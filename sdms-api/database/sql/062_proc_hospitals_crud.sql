-- Missing stored procedure used by hospitalController

CREATE OR REPLACE PROCEDURE sdms_db.proc_hospitals_crud(
  IN p_payload JSONB,
  IN p_meta JSONB,
  OUT result JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_action TEXT := LOWER(COALESCE(p_payload->>'action_mode', ''));
  v_id BIGINT := NULLIF(COALESCE(p_payload->>'id', ''), '')::BIGINT;
  v_row sdms_db.hospitals%ROWTYPE;
BEGIN
  IF v_action IN ('insert', 'create') THEN
    INSERT INTO sdms_db.hospitals (
      name,
      email,
      address_line_1,
      address_line_2,
      contact_number,
      alternative_contact_number,
      website,
      is_active,
      created_at,
      updated_at
    )
    VALUES (
      p_payload->>'name',
      NULLIF(p_payload->>'email', ''),
      p_payload->>'address_line_1',
      NULLIF(p_payload->>'address_line_2', ''),
      p_payload->>'contact_number',
      NULLIF(p_payload->>'alternative_contact_number', ''),
      NULLIF(p_payload->>'website', ''),
      COALESCE((p_payload->>'is_active')::boolean, TRUE),
      NOW(),
      NOW()
    )
    ON CONFLICT (name, contact_number)
    DO UPDATE SET
      email = EXCLUDED.email,
      address_line_1 = EXCLUDED.address_line_1,
      address_line_2 = EXCLUDED.address_line_2,
      alternative_contact_number = EXCLUDED.alternative_contact_number,
      website = EXCLUDED.website,
      is_active = EXCLUDED.is_active,
      updated_at = NOW()
    RETURNING * INTO v_row;

    result := to_jsonb(v_row);

  ELSIF v_action = 'getbyid' THEN
    SELECT h.*
    INTO v_row
    FROM sdms_db.hospitals h
    WHERE h.id = v_id
    LIMIT 1;

    result := CASE
      WHEN v_row.id IS NULL THEN NULL
      ELSE to_jsonb(v_row)
    END;

  ELSIF v_action = 'getlist' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(h) ORDER BY h.created_at DESC, h.id DESC), '[]'::jsonb)
    INTO result
    FROM sdms_db.hospitals h
    WHERE p_payload->>'is_active' IS NULL
      OR h.is_active = COALESCE((p_payload->>'is_active')::boolean, TRUE);

  ELSIF v_action = 'update' THEN
    UPDATE sdms_db.hospitals h
    SET
      name = COALESCE(NULLIF(p_payload->>'name', ''), name),
      email = COALESCE(NULLIF(p_payload->>'email', ''), email),
      address_line_1 = COALESCE(NULLIF(p_payload->>'address_line_1', ''), address_line_1),
      address_line_2 = COALESCE(NULLIF(p_payload->>'address_line_2', ''), address_line_2),
      contact_number = COALESCE(NULLIF(p_payload->>'contact_number', ''), contact_number),
      alternative_contact_number = COALESCE(NULLIF(p_payload->>'alternative_contact_number', ''), alternative_contact_number),
      website = COALESCE(NULLIF(p_payload->>'website', ''), website),
      is_active = COALESCE((p_payload->>'is_active')::boolean, is_active),
      updated_at = NOW()
    WHERE h.id = v_id
    RETURNING * INTO v_row;

    result := CASE
      WHEN v_row.id IS NULL THEN NULL
      ELSE to_jsonb(v_row)
    END;

  ELSIF v_action = 'delete' THEN
    DELETE FROM sdms_db.hospitals h
    WHERE h.id = v_id
    RETURNING * INTO v_row;

    result := CASE
      WHEN v_row.id IS NULL THEN NULL
      ELSE to_jsonb(v_row)
    END;

  ELSIF v_action = 'deactivate' THEN
    UPDATE sdms_db.hospitals h
    SET is_active = FALSE,
        updated_at = NOW()
    WHERE id = v_id
    RETURNING * INTO v_row;

    result := CASE
      WHEN v_row.id IS NULL THEN NULL
      ELSE to_jsonb(v_row)
    END;

  ELSE
    result := jsonb_build_object(
      'error', 'Unsupported action_mode',
      'action_mode', v_action
    );
  END IF;
END;
$$;