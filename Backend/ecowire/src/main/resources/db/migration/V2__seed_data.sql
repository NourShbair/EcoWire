-- =============================================================
-- V2__seed_data.sql  –  Dummy data for EcoWire testing
-- 15 policies: 5 AUTO · 5 HOME · 5 PROPERTY
-- Each policy has one eco_score entry
-- =============================================================

-- ─────────────────────────────────────────────
-- AUTO POLICIES  (policy_ids: AP-001 … AP-005)
-- ─────────────────────────────────────────────

INSERT INTO policies (policy_id, customer_name, contact_info, policy_type, created_date, updated_date) VALUES
('a1b2c3d4-0001-0001-0001-000000000001', 'James Carter',   'james.carter@email.com',   'AUTO', '2024-01-10 09:00:00', '2024-01-10 09:00:00'),
('a1b2c3d4-0002-0002-0002-000000000002', 'Priya Sharma',   'priya.sharma@email.com',   'AUTO', '2024-02-14 10:30:00', '2024-02-14 10:30:00'),
('a1b2c3d4-0003-0003-0003-000000000003', 'Liam O''Brien',  'liam.obrien@email.com',    'AUTO', '2024-03-05 08:15:00', '2024-03-05 08:15:00'),
('a1b2c3d4-0004-0004-0004-000000000004', 'Sofia Nguyen',   'sofia.nguyen@email.com',   'AUTO', '2024-04-20 14:00:00', '2024-04-20 14:00:00'),
('a1b2c3d4-0005-0005-0005-000000000005', 'Marcus Johnson', 'marcus.johnson@email.com', 'AUTO', '2024-05-18 11:45:00', '2024-05-18 11:45:00');

INSERT INTO auto_policies (auto_policy_id, policy_id, vehicle_id, vehicle_type, annual_mileage, usage_type, fuel_efficiency) VALUES
('b1000001-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'VH-ELEC-001', 'ELECTRIC', 'LOW',    'PERSONAL',   'HIGH'),
('b1000002-0002-0002-0002-000000000002', 'a1b2c3d4-0002-0002-0002-000000000002', 'VH-HYBR-002', 'HYBRID',   'MEDIUM', 'PERSONAL',   'HIGH'),
('b1000003-0003-0003-0003-000000000003', 'a1b2c3d4-0003-0003-0003-000000000003', 'VH-PETR-003', 'PETROL',   'HIGH',   'COMMERCIAL', 'LOW'),
('b1000004-0004-0004-0004-000000000004', 'a1b2c3d4-0004-0004-0004-000000000004', 'VH-DIES-004', 'DIESEL',   'HIGH',   'BUSINESS',   'MEDIUM'),
('b1000005-0005-0005-0005-000000000005', 'a1b2c3d4-0005-0005-0005-000000000005', 'VH-ELEC-005', 'ELECTRIC', 'LOW',    'PERSONAL',   'HIGH');

-- ─────────────────────────────────────────────
-- HOME POLICIES  (policy_ids: HP-001 … HP-005)
-- ─────────────────────────────────────────────

INSERT INTO policies (policy_id, customer_name, contact_info, policy_type, created_date, updated_date) VALUES
('c1d2e3f4-0001-0001-0001-000000000001', 'Emma Wilson',    'emma.wilson@email.com',    'HOME', '2024-01-22 09:30:00', '2024-01-22 09:30:00'),
('c1d2e3f4-0002-0002-0002-000000000002', 'Noah Patel',     'noah.patel@email.com',     'HOME', '2024-02-28 13:00:00', '2024-02-28 13:00:00'),
('c1d2e3f4-0003-0003-0003-000000000003', 'Aisha Rahman',   'aisha.rahman@email.com',   'HOME', '2024-03-15 10:00:00', '2024-03-15 10:00:00'),
('c1d2e3f4-0004-0004-0004-000000000004', 'Ethan Brooks',   'ethan.brooks@email.com',   'HOME', '2024-04-08 16:20:00', '2024-04-08 16:20:00'),
('c1d2e3f4-0005-0005-0005-000000000005', 'Olivia Chen',    'olivia.chen@email.com',    'HOME', '2024-06-01 08:00:00', '2024-06-01 08:00:00');

INSERT INTO home_policies (home_policy_id, policy_id, property_address, energy_rating, has_solar_panels, insulation_type, heating_system, water_conservation_features) VALUES
('d1000001-0001-0001-0001-000000000001', 'c1d2e3f4-0001-0001-0001-000000000001', '12 Green Lane, Bristol, BS1 4AB',       'A', TRUE,  'ADVANCED',  'HEAT_PUMP',  'Rainwater harvesting, low-flow fixtures'),
('d1000002-0002-0002-0002-000000000002', 'c1d2e3f4-0002-0002-0002-000000000002', '45 Oak Street, Manchester, M2 3CD',     'B', TRUE,  'STANDARD',  'ELECTRIC',   'Low-flow fixtures'),
('d1000003-0003-0003-0003-000000000003', 'c1d2e3f4-0003-0003-0003-000000000003', '78 Elm Road, Birmingham, B3 5EF',       'D', FALSE, 'BASIC',     'GAS',        NULL),
('d1000004-0004-0004-0004-000000000004', 'c1d2e3f4-0004-0004-0004-000000000004', '9 Maple Avenue, Leeds, LS1 6GH',        'C', FALSE, 'STANDARD',  'GAS',        'Low-flow fixtures'),
('d1000005-0005-0005-0005-000000000005', 'c1d2e3f4-0005-0005-0005-000000000005', '33 Birch Close, Edinburgh, EH1 7IJ',    'A', TRUE,  'ADVANCED',  'GEOTHERMAL', 'Rainwater harvesting, greywater recycling, low-flow fixtures');

-- ─────────────────────────────────────────────
-- PROPERTY POLICIES  (policy_ids: PP-001 … PP-005)
-- ─────────────────────────────────────────────

INSERT INTO policies (policy_id, customer_name, contact_info, policy_type, created_date, updated_date) VALUES
('e1f2a3b4-0001-0001-0001-000000000001', 'GreenBuild Ltd',      'contact@greenbuild.com',      'PROPERTY', '2024-01-30 09:00:00', '2024-01-30 09:00:00'),
('e1f2a3b4-0002-0002-0002-000000000002', 'Sunrise Estates',     'info@sunriseestates.com',     'PROPERTY', '2024-02-10 11:00:00', '2024-02-10 11:00:00'),
('e1f2a3b4-0003-0003-0003-000000000003', 'Metro Commercial Inc','admin@metrocommercial.com',   'PROPERTY', '2024-03-25 14:30:00', '2024-03-25 14:30:00'),
('e1f2a3b4-0004-0004-0004-000000000004', 'EcoNest Properties',  'hello@econest.com',           'PROPERTY', '2024-05-05 10:15:00', '2024-05-05 10:15:00'),
('e1f2a3b4-0005-0005-0005-000000000005', 'Urban Realty Group',  'support@urbanrealty.com',     'PROPERTY', '2024-06-20 09:45:00', '2024-06-20 09:45:00');

INSERT INTO property_policies (property_policy_id, policy_id, property_address, property_type, certifications, energy_systems, waste_management, building_age) VALUES
('f1000001-0001-0001-0001-000000000001', 'e1f2a3b4-0001-0001-0001-000000000001', '100 Innovation Park, London, EC1A 1BB',    'COMMERCIAL',  'LEED Platinum, BREEAM Outstanding', 'SOLAR',       'ZERO_WASTE',         5),
('f1000002-0002-0002-0002-000000000002', 'e1f2a3b4-0002-0002-0002-000000000002', '22 Sunrise Boulevard, Cardiff, CF10 2DE',  'RESIDENTIAL', 'EPC A',                             'HYBRID',      'ADVANCED_RECYCLING', 3),
('f1000003-0003-0003-0003-000000000003', 'e1f2a3b4-0003-0003-0003-000000000003', '55 Commerce Way, Glasgow, G1 3FG',          'COMMERCIAL',  NULL,                                'GRID',        'BASIC_RECYCLING',    40),
('f1000004-0004-0004-0004-000000000004', 'e1f2a3b4-0004-0004-0004-000000000004', '7 Eco Quarter, Brighton, BN1 4HI',          'RESIDENTIAL', 'LEED Gold',                         'WIND',        'COMPOSTING',         8),
('f1000005-0005-0005-0005-000000000005', 'e1f2a3b4-0005-0005-0005-000000000005', '300 Urban Tower, Liverpool, L1 5JK',        'COMMERCIAL',  NULL,                                'GRID',        'NONE',               55);

-- ─────────────────────────────────────────────
-- ECO SCORES  (one per policy)
-- score_breakdown stored as JSONB
-- ─────────────────────────────────────────────

-- AUTO eco scores
INSERT INTO eco_scores (score_id, policy_id, total_score, score_breakdown, calculated_date) VALUES
('sc000001-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 92, '{"vehicleType":30,"annualMileage":25,"usageType":20,"fuelEfficiency":17}'::jsonb, '2024-01-10 09:05:00'),
('sc000002-0002-0002-0002-000000000002', 'a1b2c3d4-0002-0002-0002-000000000002', 78, '{"vehicleType":22,"annualMileage":20,"usageType":20,"fuelEfficiency":16}'::jsonb, '2024-02-14 10:35:00'),
('sc000003-0003-0003-0003-000000000003', 'a1b2c3d4-0003-0003-0003-000000000003', 34, '{"vehicleType":8,"annualMileage":5,"usageType":10,"fuelEfficiency":11}'::jsonb,  '2024-03-05 08:20:00'),
('sc000004-0004-0004-0004-000000000004', 'a1b2c3d4-0004-0004-0004-000000000004', 45, '{"vehicleType":10,"annualMileage":8,"usageType":15,"fuelEfficiency":12}'::jsonb, '2024-04-20 14:05:00'),
('sc000005-0005-0005-0005-000000000005', 'a1b2c3d4-0005-0005-0005-000000000005', 95, '{"vehicleType":30,"annualMileage":25,"usageType":22,"fuelEfficiency":18}'::jsonb, '2024-05-18 11:50:00'),

-- HOME eco scores
('sc000006-0001-0001-0001-000000000006', 'c1d2e3f4-0001-0001-0001-000000000001', 91, '{"energyRating":25,"solarPanels":20,"insulationType":25,"heatingSystem":21}'::jsonb, '2024-01-22 09:35:00'),
('sc000007-0002-0002-0002-000000000007', 'c1d2e3f4-0002-0002-0002-000000000002', 74, '{"energyRating":20,"solarPanels":20,"insulationType":18,"heatingSystem":16}'::jsonb, '2024-02-28 13:05:00'),
('sc000008-0003-0003-0003-000000000008', 'c1d2e3f4-0003-0003-0003-000000000003', 38, '{"energyRating":10,"solarPanels":0,"insulationType":12,"heatingSystem":16}'::jsonb,  '2024-03-15 10:05:00'),
('sc000009-0004-0004-0004-000000000009', 'c1d2e3f4-0004-0004-0004-000000000004', 55, '{"energyRating":15,"solarPanels":0,"insulationType":18,"heatingSystem":22}'::jsonb,  '2024-04-08 16:25:00'),
('sc000010-0005-0005-0005-000000000010', 'c1d2e3f4-0005-0005-0005-000000000005', 98, '{"energyRating":25,"solarPanels":20,"insulationType":25,"heatingSystem":28}'::jsonb, '2024-06-01 08:05:00'),

-- PROPERTY eco scores
('sc000011-0001-0001-0001-000000000011', 'e1f2a3b4-0001-0001-0001-000000000001', 96, '{"propertyType":20,"certifications":25,"energySystems":28,"wasteManagement":23}'::jsonb, '2024-01-30 09:05:00'),
('sc000012-0002-0002-0002-000000000012', 'e1f2a3b4-0002-0002-0002-000000000002', 82, '{"propertyType":20,"certifications":20,"energySystems":22,"wasteManagement":20}'::jsonb, '2024-02-10 11:05:00'),
('sc000013-0003-0003-0003-000000000013', 'e1f2a3b4-0003-0003-0003-000000000003', 28, '{"propertyType":10,"certifications":0,"energySystems":10,"wasteManagement":8}'::jsonb,  '2024-03-25 14:35:00'),
('sc000014-0004-0004-0004-000000000014', 'e1f2a3b4-0004-0004-0004-000000000004', 76, '{"propertyType":20,"certifications":18,"energySystems":20,"wasteManagement":18}'::jsonb, '2024-05-05 10:20:00'),
('sc000015-0005-0005-0005-000000000015', 'e1f2a3b4-0005-0005-0005-000000000005', 18, '{"propertyType":10,"certifications":0,"energySystems":5,"wasteManagement":3}'::jsonb,   '2024-06-20 09:50:00');
