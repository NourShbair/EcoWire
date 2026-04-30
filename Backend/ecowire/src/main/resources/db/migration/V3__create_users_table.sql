-- =============================================================
-- V3__create_users_table.sql
-- Creates the users table for JWT-based authentication (Sprint 2)
-- =============================================================

CREATE TABLE users (
    user_id       VARCHAR(36)  PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(30)  NOT NULL CHECK (role IN (
                      'CUSTOMER', 'AGENT', 'UNDERWRITER',
                      'REPORTING', 'AUDITOR', 'ADMIN')),
    created_date  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email    ON users(email);
