import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService.js';

const LoginPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setServerError('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setServerError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        const newErrors = {};
        if (!username.trim()) {
            newErrors.username = 'Username is required.';
        }
        if (!password) {
            newErrors.password = 'Password is required.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);
        setServerError('');

        try {
            await authService.login(username, password);
            navigate('/');
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

                {/* Welcome heading */}
                <h4 className="fw-bold mb-1">Welcome back</h4>
                <p className="text-muted small mb-4">Sign in to your account to continue</p>

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

                    {/* Password field */}
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={`form-control${errors.password ? ' is-invalid' : ''}`}
                            value={password}
                            onChange={handlePasswordChange}
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password}</div>
                        )}
                    </div>

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
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Server error alert */}
                {serverError && (
                    <div className="alert alert-danger mt-3 mb-0" role="alert">
                        {serverError}
                    </div>
                )}

                {/* Link to signup */}
                <p className="text-center text-muted small mt-4 mb-0">
                    Don&apos;t have an account?{' '}
                    <Link to="/signup" className="text-decoration-none fw-semibold" style={{ color: 'var(--eco-primary)' }}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
