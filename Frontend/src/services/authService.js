import api from './api.js';

const KEYS = {
    TOKEN: 'ecowire_token',
    ROLE: 'ecowire_role',
    USERNAME: 'ecowire_username',
};

/**
 * Authenticate a user with username and password.
 * Stores token, role, and username in localStorage on success.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ token: string, role: string }>}
 */
async function login(username, password) {
    const response = await api.post('auth/login', { username, password });
    const { token, role } = response.data;

    localStorage.setItem(KEYS.TOKEN, token);
    localStorage.setItem(KEYS.ROLE, role);
    localStorage.setItem(KEYS.USERNAME, username);

    return { token, role };
}

/**
 * Register a new user account.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} role  — one of CUSTOMER | AGENT | UNDERWRITER | REPORTING | AUDITOR | ADMIN
 * @returns {Promise<{ userId, username, email, role, createdDate }>}
 */
async function signup(username, email, password, role) {
    const response = await api.post('auth/signup', { username, email, password, role });
    return response.data;
}

/**
 * Clear all auth keys from localStorage, effectively ending the session.
 */
function logout() {
    localStorage.removeItem(KEYS.TOKEN);
    localStorage.removeItem(KEYS.ROLE);
    localStorage.removeItem(KEYS.USERNAME);
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
    isAuthenticated,
};
