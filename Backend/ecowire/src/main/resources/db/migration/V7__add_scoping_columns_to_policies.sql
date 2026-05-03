-- V7: Add multi-tenancy scoping columns to policies table
-- All columns are nullable so existing rows survive migration with NULL values.
--
-- organization_id: which organization manages this policy (set from JWT at creation)
-- customer_id:     which CUSTOMER user owns this policy (optional, set at creation)
-- created_by_id:   which user (AGENT/ADMIN) created this policy (set from JWT at creation)

ALTER TABLE policies
    ADD COLUMN organization_id VARCHAR(36) NULL
        REFERENCES organizations(organization_id),
    ADD COLUMN customer_id     VARCHAR(36) NULL
        REFERENCES users(user_id),
    ADD COLUMN created_by_id   VARCHAR(36) NULL
        REFERENCES users(user_id);
