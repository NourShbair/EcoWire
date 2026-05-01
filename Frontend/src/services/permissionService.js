/**
 * Permission Service for Role-Based Access Control
 * 
 * This service provides centralized permission checking functions for the EcoWire application.
 * All functions perform case-sensitive role comparisons and return false for invalid inputs.
 */

// Valid roles in the system
const VALID_ROLES = ['CUSTOMER', 'AGENT', 'UNDERWRITER', 'REPORTING', 'AUDITOR', 'ADMIN'];

// Write roles that can create, edit, and delete policies
const WRITE_ROLES = ['AGENT', 'ADMIN'];

// Read-only roles that can only view policies
const READ_ONLY_ROLES = ['CUSTOMER', 'UNDERWRITER', 'REPORTING', 'AUDITOR'];

/**
 * Checks if a role is valid (not null, undefined, empty, or unrecognized)
 * @param {string} role - The role to validate
 * @returns {boolean} True if the role is valid
 */
function isValidRole(role) {
    return typeof role === 'string' && role.length > 0 && VALID_ROLES.includes(role);
}

/**
 * Checks if a role can create policies
 * @param {string} role - The user role to check
 * @returns {boolean} True if the role can create policies (AGENT or ADMIN only)
 */
export function canCreatePolicy(role) {
    if (!isValidRole(role)) {
        return false;
    }
    return WRITE_ROLES.includes(role);
}

/**
 * Checks if a role can edit policies
 * @param {string} role - The user role to check
 * @returns {boolean} True if the role can edit policies (AGENT or ADMIN only)
 */
export function canEditPolicy(role) {
    if (!isValidRole(role)) {
        return false;
    }
    return WRITE_ROLES.includes(role);
}

/**
 * Checks if a role can delete policies
 * @param {string} role - The user role to check
 * @returns {boolean} True if the role can delete policies (AGENT or ADMIN only)
 */
export function canDeletePolicy(role) {
    if (!isValidRole(role)) {
        return false;
    }
    return WRITE_ROLES.includes(role);
}

/**
 * Checks if a role can view policies
 * @param {string} role - The user role to check
 * @returns {boolean} True if the role can view policies (all valid roles)
 */
export function canViewPolicies(role) {
    return isValidRole(role);
}

/**
 * Helper function to check if a role is a write role
 * @param {string} role - The user role to check
 * @returns {boolean} True if the role is AGENT or ADMIN
 */
export function isWriteRole(role) {
    if (!isValidRole(role)) {
        return false;
    }
    return WRITE_ROLES.includes(role);
}

/**
 * Helper function to check if a role is a read-only role
 * @param {string} role - The user role to check
 * @returns {boolean} True if the role is CUSTOMER, UNDERWRITER, REPORTING, or AUDITOR
 */
export function isReadOnlyRole(role) {
    if (!isValidRole(role)) {
        return false;
    }
    return READ_ONLY_ROLES.includes(role);
}