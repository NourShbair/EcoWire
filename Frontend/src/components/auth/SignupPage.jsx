import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import { apiService } from '../../services/api.js';

const ROLES = ['CUSTOMER', 'AGENT', 'UNDERWRITER', 'REPORTING', 'AUDITOR', 'ADMIN'];
const ORG_SCOPED_ROLES = ['AGENT', 'UNDERWRITER', 'REPORTING', 'AUDITOR'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignupPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [organizationId, setOrganizationId] = useState('');
    const [organizations, setOrganizations] = useState([]);
    const [orgLoading, setOrgLoading] = useState(false);
    const [orgError, setOrgError] = useState('');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const clearServerError = () => setServerError('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        clearServerError();
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        clearServerError();
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        clearServerError();
    };

    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        setRole(newRole);
        clearServerError();

        if (ORG_SCOPED_ROLES.includes(newRole)) {
            setOrgLoading(true);
            setOrgError('');
            setOrganizationId('');
            apiService.getOrganizations()
                .then((response) => {
                    setOrganizations(response.data);
                })
                .catch(() => {
                    setOrgError('Could not load organizations. Please try again.');
                })
                .finally(() => {
                    setOrgLoading(false);
                });
        } else {
            setOrganizationId('');
            setOrganizations([]);
            setOrgLoading(false);
            setOrgError('');
        }
    };

    const handleOrganizationChange = (e) => {
        setOrganizationId(e.target.value);
        clearServerError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        const newErrors = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required.';
        } else if (username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters.';
        } else if (username.trim().length > 50) {
            newErrors.username = 'Username must be at most 50 characters.';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!EMAIL_REGEX.test(email.trim())) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        if (!role) {
            newErrors.role = 'Please select a role.';
        }

        if (ORG_SCOPED_ROLES.includes(role) && !organizationId) {
            newErrors.organizationId = 'Please select an organization.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);
        setServerError('');

        try {
            const orgId = ORG_SCOPED_ROLES.includes(role) ? organizationId : undefined;
            await authService.signup(username, email, password, role, orgId);
            navigate('/login');
        } catch (error) {
            const message =
                error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : null) ||
                'An unexpected error occurred. Please try again.';
            setServerError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: '100vh', background: 'var(--eco-bg)' }}
        >
            <div className="glass-card p-4 w-100" style={{ maxWidth: '420px' }}>
                {/* Logo and branding */}
                <div className="text-center mb-4">
                    <img
                        src="/logo.png"
                        alt="EcoWire Logo"
                        className="rounded-3 mb-3"
                        style={{ width: 60, height: 60, objectFit: 'cover' }}
                    />
                    <h2 className="fw-bold mb-0" style={{ color: 'var(--eco-primary)' }}>
                        EcoWire
                    </h2>
                    <p className="text-muted small mb-0">Sustainability Engine</p>
                </div>

                {/* Page heading */}
                <h4 className="fw-bold mb-1">Create your account</h4>
                <p className="text-muted small mb-4">
                    Join EcoWire and start your sustainability journey
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Username field */}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            className={`form-control${errors.username ? ' is-invalid' : ''}`}
                            value={username}
                            onChange={handleUsernameChange}
                            autoComplete="username"
                        />
                        {errors.username && (
                            <div className="invalid-feedback">{errors.username}</div>
                        )}
                    </div>

                    {/* Email field */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={`form-control${errors.email ? ' is-invalid' : ''}`}
                            value={email}
                            onChange={handleEmailChange}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                        )}
                    </div>

                    {/* Password field */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={`form-control${errors.password ? ' is-invalid' : ''}`}
                            value={password}
                            onChange={handlePasswordChange}
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password}</div>
                        )}
                    </div>

                    {/* Role selector */}
                    <div className="mb-4">
                        <label htmlFor="role" className="form-label">
                            Role
                        </label>
                        <select
                            id="role"
                            className={`form-select${errors.role ? ' is-invalid' : ''}`}
                            value={role}
                            onChange={handleRoleChange}
                        >
                            <option value="">Select a role</option>
                            {ROLES.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <div className="invalid-feedback">{errors.role}</div>
                        )}
                    </div>

                    {/* Organization selector — visible only for org-scoped roles */}
                    {ORG_SCOPED_ROLES.includes(role) && (
                        <div className="mb-4">
                            <label htmlFor="organizationId" className="form-label">
                                Organization
                            </label>
                            {orgLoading ? (
                                <div className="d-flex align-items-center">
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <span className="text-muted small">Loading organizations...</span>
                                </div>
                            ) : (
                                <select
                                    id="organizationId"
                                    className={`form-select${errors.organizationId ? ' is-invalid' : ''}`}
                                    value={organizationId}
                                    onChange={handleOrganizationChange}
                                    disabled={!!orgError}
                                >
                                    <option value="">Select an organization</option>
                                    {organizations.map((org) => (
                                        <option key={org.organizationId} value={org.organizationId}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.organizationId && (
                                <div className="invalid-feedback" style={{ display: 'block' }}>
                                    {errors.organizationId}
                                </div>
                            )}
                            {orgError && (
                                <div className="text-danger small mt-1">{orgError}</div>
                            )}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="btn btn-eco w-100"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Creating account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                {/* Server error alert */}
                {serverError && (
                    <div className="alert alert-danger mt-3 mb-0" role="alert">
                        {serverError}
                    </div>
                )}

                {/* Link to login */}
                <p className="text-center text-muted small mt-4 mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: 'var(--eco-primary)' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
