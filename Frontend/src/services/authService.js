import api from './api.js';

const KEYS = {
    TOKEN: 'ecowire_token',
    ROLE: 'ecowire_role',
    USERNAME: 'ecowire_username',
    ORGANIZATION_ID: 'ecowire_organization_id',
};

/**
 * Authenticate a user with username and password.
 * Stores token, role, username, and organizationId in localStorage on success.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ token: string, role: string, organizationId: string|null }>}
 */
async function login(username, password) {
    const response = await api.post('auth/login', { username, password });
    const { token, role, organizationId } = response.data;

    localStorage.setItem(KEYS.TOKEN, token);
    localStorage.setItem(KEYS.ROLE, role);
    localStorage.setItem(KEYS.USERNAME, username);
    localStorage.setItem(KEYS.ORGANIZATION_ID, organizationId ?? '');

    return { token, role, organizationId };
}

/**
 * Register a new user account.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} role  — one of CUSTOMER | AGENT | UNDERWRITER | REPORTING | AUDITOR | ADMIN
 * @param {string} [organizationId]  — required for org-scoped roles
 * @returns {Promise<{ userId, username, email, role, createdDate }>}
 */
async function signup(username, email, password, role, organizationId) {
    const body = { username, email, password, role };
    if (organizationId) {
        body.organizationId = organizationId;
    }
    const response = await api.post('auth/signup', body);
    return response.data;
}

/**
 * Clear all auth keys from localStorage, effectively ending the session.
 */
function logout() {
    localStorage.removeItem(KEYS.TOKEN);
    localStorage.removeItem(KEYS.ROLE);
    localStorage.removeItem(KEYS.USERNAME);
    localStorage.removeItem(KEYS.ORGANIZATION_ID);
}

/**
 * @returns {string|null} The stored JWT token, or null if absent.
 */
function getToken() {
    return localStorage.getItem(KEYS.TOKEN) || null;
}

/**
 * @returns {string|null} The stored user role, or null if absent.
 */
function getRole() {
    return localStorage.getItem(KEYS.ROLE) || null;
}

/**
 * @returns {string|null} The stored username, or null if absent.
 */
function getUsername() {
    return localStorage.getItem(KEYS.USERNAME) || null;
}

/**
 * @returns {string|null} The stored organizationId, or null if absent.
 */
function getOrganizationId() {
    return localStorage.getItem(KEYS.ORGANIZATION_ID) || null;
}

/**
 * @returns {boolean} True if a non-empty token is present in localStorage.
 */
function isAuthenticated() {
    const token = localStorage.getItem(KEYS.TOKEN);
    return Boolean(token && token.length > 0);
}

export const authService = {
    login,
    signup,
    logout,
    getToken,
    getRole,
    getUsername,
    getOrganizationId,
    isAuthenticated,
};
