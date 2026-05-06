-- =============================================================
-- V6__add_policy_ownership_columns.sql
-- Adds multi-tenancy and ownership columns to policies table
-- Required by Policy entity (organization_id, customer_id, created_by_id)
-- =============================================================

ALTER TABLE policies
    ADD COLUMN IF NOT EXISTS organization_id VARCHAR(36),
    ADD COLUMN IF NOT EXISTS customer_id     VARCHAR(36),
    ADD COLUMN IF NOT EXISTS created_by_id   VARCHAR(36);

CREATE INDEX IF NOT EXISTS idx_policies_org      ON policies(organization_id);
CREATE INDEX IF NOT EXISTS idx_policies_customer_id ON policies(customer_id);
CREATE INDEX IF NOT EXISTS idx_policies_created_by  ON policies(created_by_id);
