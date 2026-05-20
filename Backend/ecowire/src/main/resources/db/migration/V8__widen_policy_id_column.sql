-- Widen policy_id column to support custom format: {org-name}-{type}-{sequence}
ALTER TABLE policies ALTER COLUMN policy_id TYPE VARCHAR(100);
ALTER TABLE auto_policies ALTER COLUMN policy_id TYPE VARCHAR(100);
ALTER TABLE home_policies ALTER COLUMN policy_id TYPE VARCHAR(100);
ALTER TABLE property_policies ALTER COLUMN policy_id TYPE VARCHAR(100);
ALTER TABLE eco_scores ALTER COLUMN policy_id TYPE VARCHAR(100);
