-- V2: Minimal seed data for tests (H2-compatible, no ::jsonb casts)
-- Keeping it minimal for test context loading

INSERT INTO policies (policy_id, customer_name, contact_info, policy_type, created_date, updated_date) VALUES
('a1b2c3d4-0001-0001-0001-000000000001', 'James Carter', 'james.carter@email.com', 'AUTO', '2024-01-10 09:00:00', '2024-01-10 09:00:00');

INSERT INTO auto_policies (auto_policy_id, policy_id, vehicle_id, vehicle_type, annual_mileage, usage_type, fuel_efficiency) VALUES
('b1000001-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'VH-ELEC-001', 'ELECTRIC', 'LOW', 'PERSONAL', 'HIGH');

INSERT INTO eco_scores (score_id, policy_id, total_score, score_breakdown, calculated_date) VALUES
('sc000001-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 92, '{"vehicleType":30,"annualMileage":25,"usageType":20,"fuelEfficiency":17}', '2024-01-10 09:05:00');
