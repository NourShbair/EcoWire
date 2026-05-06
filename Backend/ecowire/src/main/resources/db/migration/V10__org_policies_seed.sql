-- =============================================================
-- V7__org_policies_seed.sql
-- 80 policies across 4 organisations (20 each)
-- AA · Aviva · AXA · USAA
-- Mix: ~7 AUTO + ~7 HOME + ~6 PROPERTY per org
-- All organization_id, customer_id, created_by_id populated
-- =============================================================

-- ═══════════════════════════════════════════════════════════════
-- ORGANISATION: AA  (20 policies)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO policies (policy_id, customer_name, contact_info, policy_type, organization_id, created_date, updated_date) VALUES
-- AUTO (7)
('aa-auto-001', 'Oliver Bennett',   'oliver.bennett@aa.com',   'AUTO', 'AA', '2024-01-05 09:00:00', '2024-01-05 09:00:00'),
('aa-auto-002', 'Sophie Clarke',    'sophie.clarke@aa.com',    'AUTO', 'AA', '2024-01-12 10:00:00', '2024-01-12 10:00:00'),
('aa-auto-003', 'Harry Wilson',     'harry.wilson@aa.com',     'AUTO', 'AA', '2024-02-03 11:00:00', '2024-02-03 11:00:00'),
('aa-auto-004', 'Isla Thompson',    'isla.thompson@aa.com',    'AUTO', 'AA', '2024-02-18 09:30:00', '2024-02-18 09:30:00'),
('aa-auto-005', 'Jack Davies',      'jack.davies@aa.com',      'AUTO', 'AA', '2024-03-07 14:00:00', '2024-03-07 14:00:00'),
('aa-auto-006', 'Amelia Roberts',   'amelia.roberts@aa.com',   'AUTO', 'AA', '2024-03-22 08:45:00', '2024-03-22 08:45:00'),
('aa-auto-007', 'George Evans',     'george.evans@aa.com',     'AUTO', 'AA', '2024-04-10 13:00:00', '2024-04-10 13:00:00'),
-- HOME (7)
('aa-home-001', 'Charlotte Hughes', 'charlotte.hughes@aa.com', 'HOME', 'AA', '2024-01-08 09:00:00', '2024-01-08 09:00:00'),
('aa-home-002', 'William Turner',   'william.turner@aa.com',   'HOME', 'AA', '2024-01-25 10:30:00', '2024-01-25 10:30:00'),
('aa-home-003', 'Poppy Martin',     'poppy.martin@aa.com',     'HOME', 'AA', '2024-02-14 11:00:00', '2024-02-14 11:00:00'),
('aa-home-004', 'Alfie Jackson',    'alfie.jackson@aa.com',    'HOME', 'AA', '2024-03-01 09:00:00', '2024-03-01 09:00:00'),
('aa-home-005', 'Lily White',       'lily.white@aa.com',       'HOME', 'AA', '2024-03-19 14:30:00', '2024-03-19 14:30:00'),
('aa-home-006', 'Freddie Harris',   'freddie.harris@aa.com',   'HOME', 'AA', '2024-04-05 10:00:00', '2024-04-05 10:00:00'),
('aa-home-007', 'Grace Lewis',      'grace.lewis@aa.com',      'HOME', 'AA', '2024-04-22 09:15:00', '2024-04-22 09:15:00'),
-- PROPERTY (6)
('aa-prop-001', 'AA Commercial Ltd',    'commercial@aa.com',    'PROPERTY', 'AA', '2024-01-15 09:00:00', '2024-01-15 09:00:00'),
('aa-prop-002', 'AA Estates Group',     'estates@aa.com',       'PROPERTY', 'AA', '2024-02-01 10:00:00', '2024-02-01 10:00:00'),
('aa-prop-003', 'AA Property Holdings', 'holdings@aa.com',      'PROPERTY', 'AA', '2024-02-20 11:00:00', '2024-02-20 11:00:00'),
('aa-prop-004', 'AA Realty Partners',   'realty@aa.com',        'PROPERTY', 'AA', '2024-03-10 09:30:00', '2024-03-10 09:30:00'),
('aa-prop-005', 'AA Green Buildings',   'green@aa.com',         'PROPERTY', 'AA', '2024-03-28 14:00:00', '2024-03-28 14:00:00'),
('aa-prop-006', 'AA Urban Developments','urban@aa.com',         'PROPERTY', 'AA', '2024-04-15 10:30:00', '2024-04-15 10:30:00');

INSERT INTO auto_policies (auto_policy_id, policy_id, vehicle_id, vehicle_type, annual_mileage, usage_type, fuel_efficiency) VALUES
('aa-ap-001', 'aa-auto-001', 'AA-VH-001', 'ELECTRIC', 'LOW',    'PERSONAL',   'HIGH'),
('aa-ap-002', 'aa-auto-002', 'AA-VH-002', 'HYBRID',   'MEDIUM', 'PERSONAL',   'HIGH'),
('aa-ap-003', 'aa-auto-003', 'AA-VH-003', 'PETROL',   'HIGH',   'COMMERCIAL', 'LOW'),
('aa-ap-004', 'aa-auto-004', 'AA-VH-004', 'ELECTRIC', 'LOW',    'PERSONAL',   'HIGH'),
('aa-ap-005', 'aa-auto-005', 'AA-VH-005', 'DIESEL',   'HIGH',   'BUSINESS',   'MEDIUM'),
('aa-ap-006', 'aa-auto-006', 'AA-VH-006', 'HYBRID',   'LOW',    'PERSONAL',   'HIGH'),
('aa-ap-007', 'aa-auto-007', 'AA-VH-007', 'PETROL',   'MEDIUM', 'BUSINESS',   'MEDIUM');

INSERT INTO home_policies (home_policy_id, policy_id, property_address, energy_rating, has_solar_panels, insulation_type, heating_system, water_conservation_features) VALUES
('aa-hp-001', 'aa-home-001', '12 Regent St, London, W1B 4DY',      'A', TRUE,  'ADVANCED',  'HEAT_PUMP',  'Rainwater harvesting, low-flow fixtures'),
('aa-hp-002', 'aa-home-002', '45 Victoria Rd, Birmingham, B1 2JT',  'B', TRUE,  'STANDARD',  'ELECTRIC',   'Low-flow fixtures'),
('aa-hp-003', 'aa-home-003', '78 King St, Manchester, M2 4NH',      'C', FALSE, 'STANDARD',  'GAS',        'Low-flow fixtures'),
('aa-hp-004', 'aa-home-004', '9 Queen Ave, Leeds, LS1 2AB',         'D', FALSE, 'BASIC',     'GAS',        NULL),
('aa-hp-005', 'aa-home-005', '33 Park Lane, Bristol, BS1 5TR',      'A', TRUE,  'ADVANCED',  'GEOTHERMAL', 'Rainwater harvesting, greywater recycling'),
('aa-hp-006', 'aa-home-006', '56 High St, Sheffield, S1 2GH',       'B', FALSE, 'STANDARD',  'ELECTRIC',   'Low-flow fixtures'),
('aa-hp-007', 'aa-home-007', '21 Church Rd, Nottingham, NG1 4AB',   'E', FALSE, 'NONE',      'OIL',        NULL);

INSERT INTO property_policies (property_policy_id, policy_id, property_address, property_type, certifications, energy_systems, waste_management, building_age) VALUES
('aa-pp-001', 'aa-prop-001', '100 Canary Wharf, London, E14 5AB',   'COMMERCIAL',  'LEED Platinum',  'SOLAR',       'ZERO_WASTE',         3),
('aa-pp-002', 'aa-prop-002', '22 Broad St, Birmingham, B1 2HF',     'RESIDENTIAL', 'EPC A',          'HYBRID',      'ADVANCED_RECYCLING', 5),
('aa-pp-003', 'aa-prop-003', '55 Deansgate, Manchester, M3 2FF',    'COMMERCIAL',  'BREEAM Excellent','WIND',        'COMPOSTING',         8),
('aa-pp-004', 'aa-prop-004', '7 Park Row, Leeds, LS1 5HD',          'RESIDENTIAL', NULL,             'GRID',        'BASIC_RECYCLING',    25),
('aa-pp-005', 'aa-prop-005', '88 Clifton Down, Bristol, BS8 3HN',   'COMMERCIAL',  'LEED Gold',      'SOLAR',       'ADVANCED_RECYCLING', 6),
('aa-pp-006', 'aa-prop-006', '300 Fargate, Sheffield, S1 2HE',      'COMMERCIAL',  NULL,             'GRID',        'NONE',               45);

INSERT INTO eco_scores (score_id, policy_id, total_score, score_breakdown, calculated_date) VALUES
('aa-sc-a01', 'aa-auto-001', 95, '{"vehicleType":40,"annualMileage":30,"usageType":20,"fuelEfficiency":5}'::jsonb,  '2024-01-05 09:05:00'),
('aa-sc-a02', 'aa-auto-002', 76, '{"vehicleType":28,"annualMileage":18,"usageType":20,"fuelEfficiency":10}'::jsonb, '2024-01-12 10:05:00'),
('aa-sc-a03', 'aa-auto-003', 28, '{"vehicleType":9,"annualMileage":6,"usageType":6,"fuelEfficiency":7}'::jsonb,    '2024-02-03 11:05:00'),
('aa-sc-a04', 'aa-auto-004', 97, '{"vehicleType":40,"annualMileage":30,"usageType":20,"fuelEfficiency":7}'::jsonb,  '2024-02-18 09:35:00'),
('aa-sc-a05', 'aa-auto-005', 38, '{"vehicleType":10,"annualMileage":6,"usageType":15,"fuelEfficiency":7}'::jsonb,   '2024-03-07 14:05:00'),
('aa-sc-a06', 'aa-auto-006', 82, '{"vehicleType":28,"annualMileage":30,"usageType":20,"fuelEfficiency":4}'::jsonb,  '2024-03-22 08:50:00'),
('aa-sc-a07', 'aa-auto-007', 52, '{"vehicleType":9,"annualMileage":18,"usageType":15,"fuelEfficiency":10}'::jsonb,  '2024-04-10 13:05:00'),
('aa-sc-h01', 'aa-home-001', 93, '{"energyRating":35,"solarPanels":25,"insulationType":20,"heatingSystem":9,"waterConservation":4}'::jsonb,  '2024-01-08 09:05:00'),
('aa-sc-h02', 'aa-home-002', 74, '{"energyRating":29,"solarPanels":25,"insulationType":14,"heatingSystem":6,"waterConservation":0}'::jsonb,  '2024-01-25 10:35:00'),
('aa-sc-h03', 'aa-home-003', 55, '{"energyRating":24,"solarPanels":0,"insulationType":14,"heatingSystem":14,"waterConservation":3}'::jsonb,  '2024-02-14 11:05:00'),
('aa-sc-h04', 'aa-home-004', 36, '{"energyRating":17,"solarPanels":0,"insulationType":7,"heatingSystem":12,"waterConservation":0}'::jsonb,   '2024-03-01 09:05:00'),
('aa-sc-h05', 'aa-home-005', 98, '{"energyRating":35,"solarPanels":25,"insulationType":20,"heatingSystem":10,"waterConservation":8}'::jsonb,  '2024-03-19 14:35:00'),
('aa-sc-h06', 'aa-home-006', 65, '{"energyRating":29,"solarPanels":0,"insulationType":14,"heatingSystem":6,"waterConservation":16}'::jsonb,  '2024-04-05 10:05:00'),
('aa-sc-h07', 'aa-home-007', 22, '{"energyRating":12,"solarPanels":0,"insulationType":0,"heatingSystem":4,"waterConservation":6}'::jsonb,    '2024-04-22 09:20:00'),
('aa-sc-p01', 'aa-prop-001', 97, '{"certifications":40,"energySystems":27,"wasteManagement":15,"location":15}'::jsonb, '2024-01-15 09:05:00'),
('aa-sc-p02', 'aa-prop-002', 83, '{"certifications":34,"energySystems":22,"wasteManagement":13,"location":14}'::jsonb, '2024-02-01 10:05:00'),
('aa-sc-p03', 'aa-prop-003', 79, '{"certifications":34,"energySystems":25,"wasteManagement":12,"location":8}'::jsonb,  '2024-02-20 11:05:00'),
('aa-sc-p04', 'aa-prop-004', 35, '{"certifications":0,"energySystems":9,"wasteManagement":6,"location":20}'::jsonb,    '2024-03-10 09:35:00'),
('aa-sc-p05', 'aa-prop-005', 88, '{"certifications":34,"energySystems":27,"wasteManagement":13,"location":14}'::jsonb,  '2024-03-28 14:05:00'),
('aa-sc-p06', 'aa-prop-006', 18, '{"certifications":0,"energySystems":9,"wasteManagement":0,"location":9}'::jsonb,     '2024-04-15 10:35:00');

-- ═══════════════════════════════════════════════════════════════
-- ORGANISATION: Aviva  (20 policies)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO policies (policy_id, customer_name, contact_info, policy_type, organization_id, created_date, updated_date) VALUES
-- AUTO (7)
('aviva-auto-001', 'Emma Thornton',   'emma.thornton@aviva.com',   'AUTO', 'Aviva', '2024-01-06 09:00:00', '2024-01-06 09:00:00'),
('aviva-auto-002', 'James Hartley',   'james.hartley@aviva.com',   'AUTO', 'Aviva', '2024-01-20 10:00:00', '2024-01-20 10:00:00'),
('aviva-auto-003', 'Sarah Mitchell',  'sarah.mitchell@aviva.com',  'AUTO', 'Aviva', '2024-02-08 11:00:00', '2024-02-08 11:00:00'),
('aviva-auto-004', 'Daniel Cooper',   'daniel.cooper@aviva.com',   'AUTO', 'Aviva', '2024-02-25 09:30:00', '2024-02-25 09:30:00'),
('aviva-auto-005', 'Laura Spencer',   'laura.spencer@aviva.com',   'AUTO', 'Aviva', '2024-03-12 14:00:00', '2024-03-12 14:00:00'),
('aviva-auto-006', 'Thomas Bailey',   'thomas.bailey@aviva.com',   'AUTO', 'Aviva', '2024-03-29 08:45:00', '2024-03-29 08:45:00'),
('aviva-auto-007', 'Rachel Foster',   'rachel.foster@aviva.com',   'AUTO', 'Aviva', '2024-04-16 13:00:00', '2024-04-16 13:00:00'),
-- HOME (7)
('aviva-home-001', 'Michael Reed',    'michael.reed@aviva.com',    'HOME', 'Aviva', '2024-01-09 09:00:00', '2024-01-09 09:00:00'),
('aviva-home-002', 'Jessica Price',   'jessica.price@aviva.com',   'HOME', 'Aviva', '2024-01-28 10:30:00', '2024-01-28 10:30:00'),
('aviva-home-003', 'Andrew Ward',     'andrew.ward@aviva.com',     'HOME', 'Aviva', '2024-02-16 11:00:00', '2024-02-16 11:00:00'),
('aviva-home-004', 'Claire Morgan',   'claire.morgan@aviva.com',   'HOME', 'Aviva', '2024-03-04 09:00:00', '2024-03-04 09:00:00'),
('aviva-home-005', 'Steven Bell',     'steven.bell@aviva.com',     'HOME', 'Aviva', '2024-03-21 14:30:00', '2024-03-21 14:30:00'),
('aviva-home-006', 'Karen Murphy',    'karen.murphy@aviva.com',    'HOME', 'Aviva', '2024-04-07 10:00:00', '2024-04-07 10:00:00'),
('aviva-home-007', 'Paul Griffin',    'paul.griffin@aviva.com',    'HOME', 'Aviva', '2024-04-24 09:15:00', '2024-04-24 09:15:00'),
-- PROPERTY (6)
('aviva-prop-001', 'Aviva Commercial Trust',  'commercial@aviva.com',  'PROPERTY', 'Aviva', '2024-01-17 09:00:00', '2024-01-17 09:00:00'),
('aviva-prop-002', 'Aviva Residential Fund',  'residential@aviva.com', 'PROPERTY', 'Aviva', '2024-02-03 10:00:00', '2024-02-03 10:00:00'),
('aviva-prop-003', 'Aviva Green Assets',      'green@aviva.com',       'PROPERTY', 'Aviva', '2024-02-22 11:00:00', '2024-02-22 11:00:00'),
('aviva-prop-004', 'Aviva Urban Portfolio',   'urban@aviva.com',       'PROPERTY', 'Aviva', '2024-03-14 09:30:00', '2024-03-14 09:30:00'),
('aviva-prop-005', 'Aviva Eco Developments',  'eco@aviva.com',         'PROPERTY', 'Aviva', '2024-03-31 14:00:00', '2024-03-31 14:00:00'),
('aviva-prop-006', 'Aviva Legacy Properties', 'legacy@aviva.com',      'PROPERTY', 'Aviva', '2024-04-18 10:30:00', '2024-04-18 10:30:00');

INSERT INTO auto_policies (auto_policy_id, policy_id, vehicle_id, vehicle_type, annual_mileage, usage_type, fuel_efficiency) VALUES
('aviva-ap-001', 'aviva-auto-001', 'AV-VH-001', 'ELECTRIC', 'LOW',    'PERSONAL',   'HIGH'),
('aviva-ap-002', 'aviva-auto-002', 'AV-VH-002', 'DIESEL',   'HIGH',   'COMMERCIAL', 'LOW'),
('aviva-ap-003', 'aviva-auto-003', 'AV-VH-003', 'HYBRID',   'MEDIUM', 'PERSONAL',   'HIGH'),
('aviva-ap-004', 'aviva-auto-004', 'AV-VH-004', 'PETROL',   'HIGH',   'BUSINESS',   'LOW'),
('aviva-ap-005', 'aviva-auto-005', 'AV-VH-005', 'ELECTRIC', 'LOW',    'PERSONAL',   'HIGH'),
('aviva-ap-006', 'aviva-auto-006', 'AV-VH-006', 'HYBRID',   'MEDIUM', 'BUSINESS',   'MEDIUM'),
('aviva-ap-007', 'aviva-auto-007', 'AV-VH-007', 'PETROL',   'MEDIUM', 'PERSONAL',   'MEDIUM');

INSERT INTO home_policies (home_policy_id, policy_id, property_address, energy_rating, has_solar_panels, insulation_type, heating_system, water_conservation_features) VALUES
('aviva-hp-001', 'aviva-home-001', '14 Lombard St, London, EC3V 9AA',    'A', TRUE,  'ADVANCED', 'HEAT_PUMP',  'Rainwater harvesting, greywater recycling'),
('aviva-hp-002', 'aviva-home-002', '67 Colmore Row, Birmingham, B3 2BJ', 'C', FALSE, 'STANDARD', 'GAS',        'Low-flow fixtures'),
('aviva-hp-003', 'aviva-home-003', '30 Mosley St, Manchester, M2 3AZ',   'B', TRUE,  'STANDARD', 'ELECTRIC',   'Low-flow fixtures'),
('aviva-hp-004', 'aviva-home-004', '5 Bond St, Leeds, LS1 5AB',          'D', FALSE, 'BASIC',    'GAS',        NULL),
('aviva-hp-005', 'aviva-home-005', '19 Corn St, Bristol, BS1 1HT',       'A', TRUE,  'ADVANCED', 'GEOTHERMAL', 'Rainwater harvesting, low-flow fixtures'),
('aviva-hp-006', 'aviva-home-006', '42 Division St, Sheffield, S1 4GF',  'F', FALSE, 'NONE',     'OIL',        NULL),
('aviva-hp-007', 'aviva-home-007', '88 Maid Marian Way, Nottingham, NG1 6GG', 'B', FALSE, 'STANDARD', 'ELECTRIC', 'Low-flow fixtures');

INSERT INTO property_policies (property_policy_id, policy_id, property_address, property_type, certifications, energy_systems, waste_management, building_age) VALUES
('aviva-pp-001', 'aviva-prop-001', '1 Canada Square, London, E14 5AB',      'COMMERCIAL',  'BREEAM Outstanding', 'SOLAR',  'ZERO_WASTE',         4),
('aviva-pp-002', 'aviva-prop-002', '35 Colmore Row, Birmingham, B3 2PH',    'RESIDENTIAL', 'EPC A',              'HYBRID', 'ADVANCED_RECYCLING', 2),
('aviva-pp-003', 'aviva-prop-003', '1 Spinningfields, Manchester, M3 3AP',  'COMMERCIAL',  'LEED Gold',          'WIND',   'COMPOSTING',         7),
('aviva-pp-004', 'aviva-prop-004', '3 Sovereign St, Leeds, LS1 4BA',        'COMMERCIAL',  NULL,                 'GRID',   'BASIC_RECYCLING',    30),
('aviva-pp-005', 'aviva-prop-005', '66 Queen Square, Bristol, BS1 4JP',     'RESIDENTIAL', 'LEED Silver',        'SOLAR',  'ADVANCED_RECYCLING', 5),
('aviva-pp-006', 'aviva-prop-006', '500 Cheetham Hill Rd, Manchester, M8 9WT', 'COMMERCIAL', NULL,              'GRID',   'NONE',               60);

INSERT INTO eco_scores (score_id, policy_id, total_score, score_breakdown, calculated_date) VALUES
('aviva-sc-a01', 'aviva-auto-001', 96, '{"vehicleType":40,"annualMileage":30,"usageType":20,"fuelEfficiency":6}'::jsonb,  '2024-01-06 09:05:00'),
('aviva-sc-a02', 'aviva-auto-002', 25, '{"vehicleType":10,"annualMileage":6,"usageType":6,"fuelEfficiency":3}'::jsonb,    '2024-01-20 10:05:00'),
('aviva-sc-a03', 'aviva-auto-003', 78, '{"vehicleType":28,"annualMileage":18,"usageType":20,"fuelEfficiency":12}'::jsonb, '2024-02-08 11:05:00'),
('aviva-sc-a04', 'aviva-auto-004', 22, '{"vehicleType":9,"annualMileage":6,"usageType":4,"fuelEfficiency":3}'::jsonb,     '2024-02-25 09:35:00'),
('aviva-sc-a05', 'aviva-auto-005', 98, '{"vehicleType":40,"annualMileage":30,"usageType":20,"fuelEfficiency":8}'::jsonb,  '2024-03-12 14:05:00'),
('aviva-sc-a06', 'aviva-auto-006', 68, '{"vehicleType":28,"annualMileage":18,"usageType":12,"fuelEfficiency":10}'::jsonb, '2024-03-29 08:50:00'),
('aviva-sc-a07', 'aviva-auto-007', 55, '{"vehicleType":9,"annualMileage":18,"usageType":20,"fuelEfficiency":8}'::jsonb,   '2024-04-16 13:05:00'),
('aviva-sc-h01', 'aviva-home-001', 96, '{"energyRating":35,"solarPanels":25,"insulationType":20,"heatingSystem":9,"waterConservation":7}'::jsonb,  '2024-01-09 09:05:00'),
('aviva-sc-h02', 'aviva-home-002', 48, '{"energyRating":24,"solarPanels":0,"insulationType":14,"heatingSystem":7,"waterConservation":3}'::jsonb,   '2024-01-28 10:35:00'),
('aviva-sc-h03', 'aviva-home-003', 75, '{"energyRating":29,"solarPanels":25,"insulationType":14,"heatingSystem":4,"waterConservation":3}'::jsonb,  '2024-02-16 11:05:00'),
('aviva-sc-h04', 'aviva-home-004', 34, '{"energyRating":17,"solarPanels":0,"insulationType":7,"heatingSystem":10,"waterConservation":0}'::jsonb,   '2024-03-04 09:05:00'),
('aviva-sc-h05', 'aviva-home-005', 95, '{"energyRating":35,"solarPanels":25,"insulationType":20,"heatingSystem":10,"waterConservation":5}'::jsonb, '2024-03-21 14:35:00'),
('aviva-sc-h06', 'aviva-home-006', 14, '{"energyRating":7,"solarPanels":0,"insulationType":0,"heatingSystem":4,"waterConservation":3}'::jsonb,     '2024-04-07 10:05:00'),
('aviva-sc-h07', 'aviva-home-007', 62, '{"energyRating":29,"solarPanels":0,"insulationType":14,"heatingSystem":6,"waterConservation":13}'::jsonb,  '2024-04-24 09:20:00'),
('aviva-sc-p01', 'aviva-prop-001', 99, '{"certifications":40,"energySystems":27,"wasteManagement":15,"location":17}'::jsonb, '2024-01-17 09:05:00'),
('aviva-sc-p02', 'aviva-prop-002', 85, '{"certifications":34,"energySystems":22,"wasteManagement":13,"location":16}'::jsonb, '2024-02-03 10:05:00'),
('aviva-sc-p03', 'aviva-prop-003', 80, '{"certifications":34,"energySystems":25,"wasteManagement":12,"location":9}'::jsonb,  '2024-02-22 11:05:00'),
('aviva-sc-p04', 'aviva-prop-004', 32, '{"certifications":0,"energySystems":9,"wasteManagement":6,"location":17}'::jsonb,    '2024-03-14 09:35:00'),
('aviva-sc-p05', 'aviva-prop-005', 75, '{"certifications":28,"energySystems":27,"wasteManagement":13,"location":7}'::jsonb,  '2024-03-31 14:05:00'),
('aviva-sc-p06', 'aviva-prop-006', 15, '{"certifications":0,"energySystems":9,"wasteManagement":0,"location":6}'::jsonb,     '2024-04-18 10:35:00');

-- ═══════════════════════════════════════════════════════════════
-- ORGANISATION: AXA  (20 policies)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO policies (policy_id, customer_name, contact_info, policy_type, organization_id, created_date, updated_date) VALUES
-- AUTO (7)
('axa-auto-001', 'Pierre Dubois',    'pierre.dubois@axa.com',    'AUTO', 'AXA', '2024-01-07 09:00:00', '2024-01-07 09:00:00'),
('axa-auto-002', 'Marie Laurent',    'marie.laurent@axa.com',    'AUTO', 'AXA', '2024-01-21 10:00:00', '2024-01-21 10:00:00'),
('axa-auto-003', 'Jean Moreau',      'jean.moreau@axa.com',      'AUTO', 'AXA', '2024-02-09 11:00:00', '2024-02-09 11:00:00'),
('axa-auto-004', 'Claire Bernard',   'claire.bernard@axa.com',   'AUTO', 'AXA', '2024-02-26 09:30:00', '2024-02-26 09:30:00'),
('axa-auto-005', 'Luc Petit',        'luc.petit@axa.com',        'AUTO', 'AXA', '2024-03-13 14:00:00', '2024-03-13 14:00:00'),
('axa-auto-006', 'Sophie Martin',    'sophie.martin@axa.com',    'AUTO', 'AXA', '2024-03-30 08:45:00', '2024-03-30 08:45:00'),
('axa-auto-007', 'Nicolas Thomas',   'nicolas.thomas@axa.com',   'AUTO', 'AXA', '2024-04-17 13:00:00', '2024-04-17 13:00:00'),
-- HOME (7)
('axa-home-001', 'Isabelle Robert',  'isabelle.robert@axa.com',  'HOME', 'AXA', '2024-01-10 09:00:00', '2024-01-10 09:00:00'),
('axa-home-002', 'François Simon',   'francois.simon@axa.com',   'HOME', 'AXA', '2024-01-29 10:30:00', '2024-01-29 10:30:00'),
('axa-home-003', 'Camille Michel',   'camille.michel@axa.com',   'HOME', 'AXA', '2024-02-17 11:00:00', '2024-02-17 11:00:00'),
('axa-home-004', 'Antoine Leroy',    'antoine.leroy@axa.com',    'HOME', 'AXA', '2024-03-05 09:00:00', '2024-03-05 09:00:00'),
('axa-home-005', 'Mathilde Roux',    'mathilde.roux@axa.com',    'HOME', 'AXA', '2024-03-22 14:30:00', '2024-03-22 14:30:00'),
('axa-home-006', 'Julien Blanc',     'julien.blanc@axa.com',     'HOME', 'AXA', '2024-04-08 10:00:00', '2024-04-08 10:00:00'),
('axa-home-007', 'Aurelie Garnier',  'aurelie.garnier@axa.com',  'HOME', 'AXA', '2024-04-25 09:15:00', '2024-04-25 09:15:00'),
-- PROPERTY (6)
('axa-prop-001', 'AXA Real Estate SA',     'realestate@axa.com',  'PROPERTY', 'AXA', '2024-01-18 09:00:00', '2024-01-18 09:00:00'),
('axa-prop-002', 'AXA Green Invest',       'green@axa.com',       'PROPERTY', 'AXA', '2024-02-04 10:00:00', '2024-02-04 10:00:00'),
('axa-prop-003', 'AXA Commercial Park',    'commercial@axa.com',  'PROPERTY', 'AXA', '2024-02-23 11:00:00', '2024-02-23 11:00:00'),
('axa-prop-004', 'AXA Residential Trust',  'trust@axa.com',       'PROPERTY', 'AXA', '2024-03-15 09:30:00', '2024-03-15 09:30:00'),
('axa-prop-005', 'AXA Sustainable Assets', 'sustainable@axa.com', 'PROPERTY', 'AXA', '2024-04-01 14:00:00', '2024-04-01 14:00:00'),
('axa-prop-006', 'AXA Heritage Buildings', 'heritage@axa.com',    'PROPERTY', 'AXA', '2024-04-19 10:30:00', '2024-04-19 10:30:00');

INSERT INTO auto_policies (auto_policy_id, policy_id, vehicle_id, vehicle_type, annual_mileage, usage_type, fuel_efficiency) VALUES
('axa-ap-001', 'axa-auto-001', 'AX-VH-001', 'HYBRID',   'LOW',    'PERSONAL',   'HIGH'),
('axa-ap-002', 'axa-auto-002', 'AX-VH-002', 'ELECTRIC', 'LOW',    'PERSONAL',   'HIGH'),
('axa-ap-003', 'axa-auto-003', 'AX-VH-003', 'PETROL',   'HIGH',   'COMMERCIAL', 'LOW'),
('axa-ap-004', 'axa-auto-004', 'AX-VH-004', 'ELECTRIC', 'MEDIUM', 'PERSONAL',   'HIGH'),
('axa-ap-005', 'axa-auto-005', 'AX-VH-005', 'DIESEL',   'HIGH',   'BUSINESS',   'MEDIUM'),
('axa-ap-006', 'axa-auto-006', 'AX-VH-006', 'HYBRID',   'LOW',    'PERSONAL',   'HIGH'),
('axa-ap-007', 'axa-auto-007', 'AX-VH-007', 'PETROL',   'MEDIUM', 'COMMERCIAL', 'LOW');

INSERT INTO home_policies (home_policy_id, policy_id, property_address, energy_rating, has_solar_panels, insulation_type, heating_system, water_conservation_features) VALUES
('axa-hp-001', 'axa-home-001', '25 Rue de Rivoli, Paris, 75001',         'A', TRUE,  'ADVANCED', 'HEAT_PUMP',  'Rainwater harvesting, low-flow fixtures'),
('axa-hp-002', 'axa-home-002', '10 Rue du Faubourg, Lyon, 69001',        'B', FALSE, 'STANDARD', 'GAS',        'Low-flow fixtures'),
('axa-hp-003', 'axa-home-003', '5 Rue de la Paix, Marseille, 13001',     'C', TRUE,  'STANDARD', 'ELECTRIC',   'Low-flow fixtures'),
('axa-hp-004', 'axa-home-004', '18 Rue Victor Hugo, Bordeaux, 33000',    'D', FALSE, 'BASIC',    'GAS',        NULL),
('axa-hp-005', 'axa-home-005', '3 Rue des Fleurs, Toulouse, 31000',      'A', TRUE,  'ADVANCED', 'GEOTHERMAL', 'Rainwater harvesting, greywater recycling'),
('axa-hp-006', 'axa-home-006', '77 Rue Nationale, Lille, 59000',         'E', FALSE, 'NONE',     'OIL',        NULL),
('axa-hp-007', 'axa-home-007', '12 Rue de la Republique, Nice, 06000',   'B', TRUE,  'STANDARD', 'ELECTRIC',   'Low-flow fixtures');

INSERT INTO property_policies (property_policy_id, policy_id, property_address, property_type, certifications, energy_systems, waste_management, building_age) VALUES
('axa-pp-001', 'axa-prop-001', '23 Avenue Montaigne, Paris, 75008',      'COMMERCIAL',  'BREEAM Excellent', 'SOLAR',       'ZERO_WASTE',         2),
('axa-pp-002', 'axa-prop-002', '15 Rue de la Bourse, Lyon, 69002',       'COMMERCIAL',  'LEED Platinum',    'WIND',        'ADVANCED_RECYCLING', 4),
('axa-pp-003', 'axa-prop-003', '8 Rue Paradis, Marseille, 13006',        'RESIDENTIAL', 'EPC A',            'HYBRID',      'COMPOSTING',         6),
('axa-pp-004', 'axa-prop-004', '44 Cours de lIntendance, Bordeaux, 33000','RESIDENTIAL', NULL,              'GRID',        'BASIC_RECYCLING',    35),
('axa-pp-005', 'axa-prop-005', '2 Place du Capitole, Toulouse, 31000',   'COMMERCIAL',  'LEED Gold',        'SOLAR',       'ADVANCED_RECYCLING', 8),
('axa-pp-006', 'axa-prop-006', '100 Grand Place, Lille, 59800',          'COMMERCIAL',  NULL,               'GRID',        'NONE',               70);

INSERT INTO eco_scores (score_id, policy_id, total_score, score_breakdown, calculated_date) VALUES
('axa-sc-a01', 'axa-auto-001', 82, '{"vehicleType":28,"annualMileage":30,"usageType":20,"fuelEfficiency":4}'::jsonb,  '2024-01-07 09:05:00'),
('axa-sc-a02', 'axa-auto-002', 97, '{"vehicleType":40,"annualMileage":30,"usageType":20,"fuelEfficiency":7}'::jsonb,  '2024-01-21 10:05:00'),
('axa-sc-a03', 'axa-auto-003', 24, '{"vehicleType":9,"annualMileage":6,"usageType":6,"fuelEfficiency":3}'::jsonb,     '2024-02-09 11:05:00'),
('axa-sc-a04', 'axa-auto-004', 88, '{"vehicleType":40,"annualMileage":18,"usageType":20,"fuelEfficiency":10}'::jsonb, '2024-02-26 09:35:00'),
('axa-sc-a05', 'axa-auto-005', 40, '{"vehicleType":10,"annualMileage":6,"usageType":15,"fuelEfficiency":9}'::jsonb,   '2024-03-13 14:05:00'),
('axa-sc-a06', 'axa-auto-006', 84, '{"vehicleType":28,"annualMileage":30,"usageType":20,"fuelEfficiency":6}'::jsonb,  '2024-03-30 08:50:00'),
('axa-sc-a07', 'axa-auto-007', 26, '{"vehicleType":9,"annualMileage":18,"usageType":6,"fuelEfficiency":3}'::jsonb,    '2024-04-17 13:05:00'),
('axa-sc-h01', 'axa-home-001', 94, '{"energyRating":35,"solarPanels":25,"insulationType":20,"heatingSystem":9,"waterConservation":5}'::jsonb,  '2024-01-10 09:05:00'),
('axa-sc-h02', 'axa-home-002', 53, '{"energyRating":29,"solarPanels":0,"insulationType":14,"heatingSystem":7,"waterConservation":3}'::jsonb,   '2024-01-29 10:35:00'),
('axa-sc-h03', 'axa-home-003', 72, '{"energyRating":24,"solarPanels":25,"insulationType":14,"heatingSystem":6,"waterConservation":3}'::jsonb,  '2024-02-17 11:05:00'),
('axa-sc-h04', 'axa-home-004', 37, '{"energyRating":17,"solarPanels":0,"insulationType":7,"heatingSystem":10,"waterConservation":3}'::jsonb,   '2024-03-05 09:05:00'),
('axa-sc-h05', 'axa-home-005', 97, '{"energyRating":35,"solarPanels":25,"insulationType":20,"heatingSystem":10,"waterConservation":7}'::jsonb, '2024-03-22 14:35:00'),
('axa-sc-h06', 'axa-home-006', 18, '{"energyRating":7,"solarPanels":0,"insulationType":0,"heatingSystem":4,"waterConservation":7}'::jsonb,     '2024-04-08 10:05:00'),
('axa-sc-h07', 'axa-home-007', 68, '{"energyRating":29,"solarPanels":25,"insulationType":14,"heatingSystem":0,"waterConservation":0}'::jsonb,  '2024-04-25 09:20:00'),
('axa-sc-p01', 'axa-prop-001', 96, '{"certifications":34,"energySystems":27,"wasteManagement":15,"location":20}'::jsonb, '2024-01-18 09:05:00'),
('axa-sc-p02', 'axa-prop-002', 98, '{"certifications":40,"energySystems":25,"wasteManagement":13,"location":20}'::jsonb, '2024-02-04 10:05:00'),
('axa-sc-p03', 'axa-prop-003', 81, '{"certifications":34,"energySystems":22,"wasteManagement":12,"location":13}'::jsonb, '2024-02-23 11:05:00'),
('axa-sc-p04', 'axa-prop-004', 33, '{"certifications":0,"energySystems":9,"wasteManagement":6,"location":18}'::jsonb,    '2024-03-15 09:35:00'),
('axa-sc-p05', 'axa-prop-005', 86, '{"certifications":34,"energySystems":27,"wasteManagement":13,"location":12}'::jsonb, '2024-04-01 14:05:00'),
('axa-sc-p06', 'axa-prop-006', 12, '{"certifications":0,"energySystems":9,"wasteManagement":0,"location":3}'::jsonb,     '2024-04-19 10:35:00');

-- ═══════════════════════════════════════════════════════════════
-- ORGANISATION: USAA  (20 policies)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO policies (policy_id, customer_name, contact_info, policy_type, organization_id, created_date, updated_date) VALUES
-- AUTO (7)
('usaa-auto-001', 'Robert Johnson',   'robert.johnson@usaa.com',   'AUTO', 'USAA', '2024-01-08 09:00:00', '2024-01-08 09:00:00'),
('usaa-auto-002', 'Jennifer Williams','jennifer.williams@usaa.com','AUTO', 'USAA', '2024-01-22 10:00:00', '2024-01-22 10:00:00'),
('usaa-auto-003', 'Christopher Brown','christopher.brown@usaa.com','AUTO', 'USAA', '2024-02-10 11:00:00', '2024-02-10 11:00:00'),
('usaa-auto-004', 'Amanda Davis',     'amanda.davis@usaa.com',     'AUTO', 'USAA', '2024-02-27 09:30:00', '2024-02-27 09:30:00'),
('usaa-auto-005', 'Matthew Miller',   'matthew.miller@usaa.com',   'AUTO', 'USAA', '2024-03-14 14:00:00', '2024-03-14 14:00:00'),
('usaa-auto-006', 'Ashley Wilson',    'ashley.wilson@usaa.com',    'AUTO', 'USAA', '2024-03-31 08:45:00', '2024-03-31 08:45:00'),
('usaa-auto-007', 'Joshua Moore',     'joshua.moore@usaa.com',     'AUTO', 'USAA', '2024-04-18 13:00:00', '2024-04-18 13:00:00'),
-- HOME (7)
('usaa-home-001', 'Brittany Taylor',  'brittany.taylor@usaa.com',  'HOME', 'USAA', '2024-01-11 09:00:00', '2024-01-11 09:00:00'),
('usaa-home-002', 'Kevin Anderson',   'kevin.anderson@usaa.com',   'HOME', 'USAA', '2024-01-30 10:30:00', '2024-01-30 10:30:00'),
('usaa-home-003', 'Megan Thomas',     'megan.thomas@usaa.com',     'HOME', 'USAA', '2024-02-18 11:00:00', '2024-02-18 11:00:00'),
('usaa-home-004', 'Ryan Jackson',     'ryan.jackson@usaa.com',     'HOME', 'USAA', '2024-03-06 09:00:00', '2024-03-06 09:00:00'),
('usaa-home-005', 'Stephanie White',  'stephanie.white@usaa.com',  'HOME', 'USAA', '2024-03-23 14:30:00', '2024-03-23 14:30:00'),
('usaa-home-006', 'Brandon Harris',   'brandon.harris@usaa.com',   'HOME', 'USAA', '2024-04-09 10:00:00', '2024-04-09 10:00:00'),
('usaa-home-007', 'Nicole Martin',    'nicole.martin@usaa.com',    'HOME', 'USAA', '2024-04-26 09:15:00', '2024-04-26 09:15:00'),
-- PROPERTY (6)
('usaa-prop-001', 'USAA Real Estate Corp',    'realestate@usaa.com',  'PROPERTY', 'USAA', '2024-01-19 09:00:00', '2024-01-19 09:00:00'),
('usaa-prop-002', 'USAA Green Portfolio',     'green@usaa.com',       'PROPERTY', 'USAA', '2024-02-05 10:00:00', '2024-02-05 10:00:00'),
('usaa-prop-003', 'USAA Commercial Holdings', 'commercial@usaa.com',  'PROPERTY', 'USAA', '2024-02-24 11:00:00', '2024-02-24 11:00:00'),
('usaa-prop-004', 'USAA Residential Fund',    'residential@usaa.com', 'PROPERTY', 'USAA', '2024-03-16 09:30:00', '2024-03-16 09:30:00'),
('usaa-prop-005', 'USAA Eco Properties',      'eco@usaa.com',         'PROPERTY', 'USAA', '2024-04-02 14:00:00', '2024-04-02 14:00:00'),
('usaa-prop-006', 'USAA Legacy Assets',       'legacy@usaa.com',      'PROPERTY', 'USAA', '2024-04-20 10:30:00', '2024-04-20 10:30:00');

INSERT INTO auto_policies (auto_policy_id, policy_id, vehicle_id, vehicle_type, annual_mileage, usage_type, fuel_efficiency) VALUES
('usaa-ap-001', 'usaa-auto-001', 'US-VH-001', 'ELECTRIC', 'LOW',    'PERSONAL',   'HIGH'),
('usaa-ap-002', 'usaa-auto-002', 'US-VH-002', 'HYBRID',   'MEDIUM', 'PERSONAL',   'HIGH'),
('usaa-ap-003', 'usaa-auto-003', 'US-VH-003', 'PETROL',   'HIGH',   'COMMERCIAL', 'LOW'),
('usaa-ap-004', 'usaa-auto-004', 'US-VH-004', 'DIESEL',   'HIGH',   'BUSINESS',   'LOW'),
('usaa-ap-005', 'usaa-auto-005', 'US-VH-005', 'ELECTRIC', 'LOW',    'PERSONAL',   'HIGH'),
('usaa-ap-006', 'usaa-auto-006', 'US-VH-006', 'HYBRID',   'LOW',    'PERSONAL',   'HIGH'),
('usaa-ap-007', 'usaa-auto-007', 'US-VH-007', 'PETROL',   'MEDIUM', 'BUSINESS',   'MEDIUM');

INSERT INTO home_policies (home_policy_id, policy_id, property_address, energy_rating, has_solar_panels, insulation_type, heating_system, water_conservation_features) VALUES
('usaa-hp-001', 'usaa-home-001', '1234 Oak Street, San Antonio, TX 78201',   'A', TRUE,  'ADVANCED', 'HEAT_PUMP',  'Rainwater harvesting, low-flow fixtures'),
('usaa-hp-002', 'usaa-home-002', '567 Maple Ave, Austin, TX 78701',          'B', TRUE,  'STANDARD', 'ELECTRIC',   'Low-flow fixtures'),
('usaa-hp-003', 'usaa-home-003', '890 Pine Rd, Houston, TX 77001',           'C', FALSE, 'STANDARD', 'GAS',        'Low-flow fixtures'),
('usaa-hp-004', 'usaa-home-004', '234 Elm Blvd, Dallas, TX 75201',           'D', FALSE, 'BASIC',    'GAS',        NULL),
('usaa-hp-005', 'usaa-home-005', '456 Cedar Lane, Fort Worth, TX 76101',     'A', TRUE,  'ADVANCED', 'GEOTHERMAL', 'Rainwater harvesting, greywater recycling'),
('usaa-hp-006', 'usaa-home-006', '789 Birch Dr, El Paso, TX 79901',          'F', FALSE, 'NONE',     'OIL',        NULL),
('usaa-hp-007', 'usaa-home-007', '321 Walnut St, Arlington, TX 76001',       'B', FALSE, 'STANDARD', 'ELECTRIC',   'Low-flow fixtures');

INSERT INTO property_policies (property_policy_id, policy_id, property_address, property_type, certifications, energy_systems, waste_management, building_age) VALUES
('usaa-pp-001', 'usaa-prop-001', '9800 Fredericksburg Rd, San Antonio, TX 78288', 'COMMERCIAL',  'LEED Platinum',    'SOLAR',  'ZERO_WASTE',         3),
('usaa-pp-002', 'usaa-prop-002', '100 Congress Ave, Austin, TX 78701',            'COMMERCIAL',  'BREEAM Excellent', 'WIND',   'ADVANCED_RECYCLING', 5),
('usaa-pp-003', 'usaa-prop-003', '1600 Smith St, Houston, TX 77002',              'COMMERCIAL',  'LEED Gold',        'HYBRID', 'COMPOSTING',         10),
('usaa-pp-004', 'usaa-prop-004', '2200 Ross Ave, Dallas, TX 75201',               'RESIDENTIAL', NULL,               'GRID',   'BASIC_RECYCLING',    28),
('usaa-pp-005', 'usaa-prop-005', '777 Main St, Fort Worth, TX 76102',             'RESIDENTIAL', 'EPC A',            'SOLAR',  'ADVANCED_RECYCLING', 4),
('usaa-pp-006', 'usaa-prop-006', '4000 Rio Bravo, El Paso, TX 79902',             'COMMERCIAL',  NULL,               'GRID',   'NONE',               55);

INSERT INTO eco_scores (score_id, policy_id, total_score, score_breakdown, calculated_date) VALUES
('usaa-sc-a01', 'usaa-auto-001', 95, '{"vehicleType":40,"annualMileage":30,"usageType":20,"fuelEfficiency":5}'::jsonb,  '2024-01-08 09:05:00'),
('usaa-sc-a02', 'usaa-auto-002', 77, '{"vehicleType":28,"annualMileage":18,"usageType":20,"fuelEfficiency":11}'::jsonb, '2024-01-22 10:05:00'),
('usaa-sc-a03', 'usaa-auto-003', 23, '{"vehicleType":9,"annualMileage":6,"usageType":6,"fuelEfficiency":2}'::jsonb,     '2024-02-10 11:05:00'),
('usaa-sc-a04', 'usaa-auto-004', 20, '{"vehicleType":10,"annualMileage":6,"usageType":4,"fuelEfficiency":0}'::jsonb,    '2024-02-27 09:35:00'),
('usaa-sc-a05', 'usaa-auto-005', 96, '{"vehicleType":40,"annualMileage":30,"usageType":20,"fuelEfficiency":6}'::jsonb,  '2024-03-14 14:05:00'),
('usaa-sc-a06', 'usaa-auto-006', 85, '{"vehicleType":28,"annualMileage":30,"usageType":20,"fuelEfficiency":7}'::jsonb,  '2024-03-31 08:50:00'),
('usaa-sc-a07', 'usaa-auto-007', 54, '{"vehicleType":9,"annualMileage":18,"usageType":15,"fuelEfficiency":12}'::jsonb,  '2024-04-18 13:05:00'),
('usaa-sc-h01', 'usaa-home-001', 92, '{"energyRating":35,"solarPanels":25,"insulationType":20,"heatingSystem":9,"waterConservation":3}'::jsonb,  '2024-01-11 09:05:00'),
('usaa-sc-h02', 'usaa-home-002', 73, '{"energyRating":29,"solarPanels":25,"insulationType":14,"heatingSystem":2,"waterConservation":3}'::jsonb,  '2024-01-30 10:35:00'),
('usaa-sc-h03', 'usaa-home-003', 51, '{"energyRating":24,"solarPanels":0,"insulationType":14,"heatingSystem":10,"waterConservation":3}'::jsonb,  '2024-02-18 11:05:00'),
('usaa-sc-h04', 'usaa-home-004', 35, '{"energyRating":17,"solarPanels":0,"insulationType":7,"heatingSystem":11,"waterConservation":0}'::jsonb,   '2024-03-06 09:05:00'),
('usaa-sc-h05', 'usaa-home-005', 96, '{"energyRating":35,"solarPanels":25,"insulationType":20,"heatingSystem":10,"waterConservation":6}'::jsonb, '2024-03-23 14:35:00'),
('usaa-sc-h06', 'usaa-home-006', 13, '{"energyRating":7,"solarPanels":0,"insulationType":0,"heatingSystem":3,"waterConservation":3}'::jsonb,     '2024-04-09 10:05:00'),
('usaa-sc-h07', 'usaa-home-007', 58, '{"energyRating":29,"solarPanels":0,"insulationType":14,"heatingSystem":6,"waterConservation":9}'::jsonb,   '2024-04-26 09:20:00'),
('usaa-sc-p01', 'usaa-prop-001', 98, '{"certifications":40,"energySystems":27,"wasteManagement":15,"location":16}'::jsonb, '2024-01-19 09:05:00'),
('usaa-sc-p02', 'usaa-prop-002', 97, '{"certifications":40,"energySystems":25,"wasteManagement":13,"location":19}'::jsonb, '2024-02-05 10:05:00'),
('usaa-sc-p03', 'usaa-prop-003', 82, '{"certifications":34,"energySystems":22,"wasteManagement":12,"location":14}'::jsonb, '2024-02-24 11:05:00'),
('usaa-sc-p04', 'usaa-prop-004', 31, '{"certifications":0,"energySystems":9,"wasteManagement":6,"location":16}'::jsonb,    '2024-03-16 09:35:00'),
('usaa-sc-p05', 'usaa-prop-005', 79, '{"certifications":34,"energySystems":27,"wasteManagement":13,"location":5}'::jsonb,  '2024-04-02 14:05:00'),
('usaa-sc-p06', 'usaa-prop-006', 14, '{"certifications":0,"energySystems":9,"wasteManagement":0,"location":5}'::jsonb,     '2024-04-20 10:35:00');
