-- V6: Add organization_id to users table
-- Org-scoped roles (AGENT, UNDERWRITER, REPORTING, AUDITOR) belong to an organization.
-- CUSTOMER and ADMIN have NULL organization_id.

ALTER TABLE users
    ADD COLUMN organization_id VARCHAR(36) NULL
        REFERENCES organizations(organization_id);
