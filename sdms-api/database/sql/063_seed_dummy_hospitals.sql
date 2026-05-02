-- Dummy hospital data for local testing
-- Safe to run multiple times because it avoids duplicate inserts.

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
VALUES
  (
    'City Care Hospital',
    'info@citycarehospital.test',
    '12 Lake Road',
    'Ward 5',
    '01700000001',
    '01800000001',
    'https://citycarehospital.test',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'Green Valley Clinic',
    'contact@greenvalleyclinic.test',
    '48 Green Road',
    'Block B',
    '01700000002',
    '01800000002',
    'https://greenvalleyclinic.test',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'Sunrise Medical Center',
    'hello@sunrisemedical.test',
    '99 Sunrise Avenue',
    'Suite 10',
    '01700000003',
    '01800000003',
    'https://sunrisemedical.test',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'Metro General Hospital',
    'admin@metrogeneral.test',
    '221 Metro Street',
    'Floor 3',
    '01700000004',
    '01800000004',
    'https://metrogeneral.test',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'Northside Clinic',
    'team@northsideclinic.test',
    '7 Northside Lane',
    'Near Station',
    '01700000005',
    '01800000005',
    'https://northsideclinic.test',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'Riverside Hospital',
    'support@riversidehospital.test',
    '300 Riverside Drive',
    'Block A',
    '01700000006',
    '01800000006',
    'https://riversidehospital.test',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'Lifeline Diagnostics & Hospital',
    'info@lifelinehospital.test',
    '18 Health Park',
    'Building C',
    '01700000007',
    '01800000007',
    'https://lifelinehospital.test',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'Harmony Women''s Hospital',
    'contact@harmonywomens.test',
    '61 Harmony Boulevard',
    'Level 2',
    '01700000008',
    '01800000008',
    'https://harmonywomens.test',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'CarePoint Specialty Hospital',
    'care@carepointspecialty.test',
    '144 CarePoint Road',
    'Unit 4',
    '01700000009',
    '01800000009',
    'https://carepointspecialty.test',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'Hopewell Hospital',
    'welcome@hopewellhospital.test',
    '77 Hopewell Street',
    'Opposite Park',
    '01700000010',
    '01800000010',
    'https://hopewellhospital.test',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'Prime Care Hospital',
    'hello@primecare.test',
    '9 Prime Care Avenue',
    'Annex B',
    '01700000011',
    '01800000011',
    'https://primecare.test',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'Everest Community Clinic',
    'contact@everestcommunity.test',
    '5 Everest Road',
    'Community Wing',
    '01700000012',
    '01800000012',
    'https://everestcommunity.test',
    TRUE,
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
  updated_at = NOW();