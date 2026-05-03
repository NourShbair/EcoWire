-- V7: Add multi-tenancy scoping columns to policies table

ALTER TABLE policies
    ADD COLUMN organization_id VARCHAR(36) NULL
        REFERENCES organizations(organization_id),
    ADD COLUMN customer_id     VARCHAR(36) NULL
        REFERENCES users(user_id),
    ADD COLUMN created_by_id   VARCHAR(36) NULL
        REFERENCES users(user_id);
