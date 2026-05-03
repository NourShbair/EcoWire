-- V5: Create organizations table for multi-tenancy support
-- Organizations represent insurance carriers or brokers (e.g. AXA, Allianz)

CREATE TABLE organizations (
    organization_id VARCHAR(36)  NOT NULL,
    name            VARCHAR(255) NOT NULL,
    created_date    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_organizations PRIMARY KEY (organization_id),
    CONSTRAINT uq_organizations_name UNIQUE (name)
);
