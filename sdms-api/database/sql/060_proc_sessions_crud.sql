-- Missing stored procedure used by sessionStorageController

CREATE OR REPLACE PROCEDURE sdms_db.proc_sessions_crud(
  IN p_payload JSONB,
  IN p_meta JSONB,
  OUT result JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_action TEXT := LOWER(COALESCE(p_payload->>'action_mode', ''));
  v_id BIGINT := NULLIF(COALESCE(p_payload->>'id', ''), '')::BIGINT;
  v_session_id UUID := NULLIF(COALESCE(p_payload->>'session_id', ''), '')::UUID;
  v_row sdms_db.sessions%ROWTYPE;
BEGIN
  IF v_action IN ('insert', 'create') THEN
    INSERT INTO sdms_db.sessions (
      session_id,
      token,
      data,
      expires_at,
      is_active,
      device_id,
      loc_id,
      insert_by,
      insert_date,
      created_at,
      updated_at
    )
    VALUES (
      COALESCE(v_session_id, gen_random_uuid()),
      p_payload->>'token',
      COALESCE(p_payload->'data', '{}'::jsonb),
      COALESCE(NULLIF(p_payload->>'expires_at', '')::timestamptz, NOW() + INTERVAL '1 day'),
      COALESCE((p_payload->>'is_active')::boolean, TRUE),
      p_payload->>'device_id',
      COALESCE(p_payload->>'loc_id', 'loc'),
      COALESCE(p_payload->>'insert_by', 'system'),
      COALESCE(NULLIF(p_payload->>'insert_date', '')::timestamptz, NOW()),
      NOW(),
      NOW()
    )
    ON CONFLICT (session_id)
    DO UPDATE SET
      token = EXCLUDED.token,
      data = EXCLUDED.data,
      expires_at = EXCLUDED.expires_at,
      is_active = EXCLUDED.is_active,
      device_id = EXCLUDED.device_id,
      loc_id = EXCLUDED.loc_id,
      insert_by = EXCLUDED.insert_by,
      insert_date = EXCLUDED.insert_date,
      updated_at = NOW()
    RETURNING * INTO v_row;

    result := to_jsonb(v_row);

  ELSIF v_action = 'getbyid' THEN
    SELECT s.*
    INTO v_row
    FROM sdms_db.sessions s
    WHERE (
      v_id IS NOT NULL AND s.id = v_id
    ) OR (
      v_session_id IS NOT NULL AND s.session_id = v_session_id
    )
    LIMIT 1;

    result := CASE
      WHEN v_row.id IS NULL THEN NULL
      ELSE to_jsonb(v_row)
    END;

  ELSIF v_action = 'getlist' THEN
    SELECT COALESCE(jsonb_agg(to_jsonb(s) ORDER BY s.created_at DESC), '[]'::jsonb)
    INTO result
    FROM sdms_db.sessions s
    WHERE COALESCE((p_payload->>'is_active')::boolean, TRUE) = TRUE;

  ELSIF v_action = 'update' THEN
    UPDATE sdms_db.sessions
    SET
      token = COALESCE(NULLIF(p_payload->>'token', ''), token),
      data = COALESCE(p_payload->'data', data),
      expires_at = COALESCE(NULLIF(p_payload->>'expires_at', '')::timestamptz, expires_at),
      is_active = COALESCE((p_payload->>'is_active')::boolean, is_active),
      device_id = COALESCE(NULLIF(p_payload->>'device_id', ''), device_id),
      loc_id = COALESCE(NULLIF(p_payload->>'loc_id', ''), loc_id),
      updated_at = NOW()
    WHERE (
      v_id IS NOT NULL AND id = v_id
    ) OR (
      v_session_id IS NOT NULL AND session_id = v_session_id
    )
    RETURNING * INTO v_row;

    result := CASE
      WHEN v_row.id IS NULL THEN NULL
      ELSE to_jsonb(v_row)
    END;

  ELSIF v_action = 'delete' THEN
    DELETE FROM sdms_db.sessions
    WHERE (
      v_id IS NOT NULL AND id = v_id
    ) OR (
      v_session_id IS NOT NULL AND session_id = v_session_id
    )
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