import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const username = authService.getUsername() || 'User';
    const initials = username.slice(0, 2).toUpperCase();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="sidebar shadow d-flex flex-column">
            <div className="p-4 d-flex align-items-center gap-3">
                <img src="/logo.png" alt="Logo" className="rounded-3 shadow" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                <div>
                    <h3 className="fw-bold text-white mb-0">EcoWire</h3>
                    <small className="text-white-50">Sustainability Engine</small>
                </div>
            </div>

            <nav className="mt-4 flex-grow-1">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>New Policy</Link>
                <Link to="/policies" className={`nav-link ${location.pathname.includes('/policies') ? 'active' : ''}`}>My Policies</Link>
            </nav>

            <div className="mt-auto p-4 border-top border-white-20">
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center text-success fw-bold" style={{ width: 40, height: 40 }}>
                        {initials}
                    </div>
                    <div className="overflow-hidden text-white flex-grow-1">
                        <p className="mb-0 small fw-bold text-truncate">{username}</p>
                        <p className="mb-0 smaller text-truncate opacity-70">{authService.getRole() || 'User'}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-sm ms-auto"
                        style={{ color: 'rgba(255,255,255,0.7)', background: 'transparent', border: 'none' }}
                        title="Logout"
                    >
                        <i className="bi bi-box-arrow-right fs-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
