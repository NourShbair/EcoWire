-- V6: Add organization_id to users table

ALTER TABLE users
    ADD COLUMN organization_id VARCHAR(36) NULL
        REFERENCES organizations(organization_id);
