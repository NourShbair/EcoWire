import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';
import RoleGuard from './auth/RoleGuard.jsx';
import { canCreatePolicy } from '../services/permissionService.js';
import '../styles/Sidebar.css';

const Sidebar = ({ isCollapsed, onToggle }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const username = authService.getUsername() || 'User';
    const initials = username.slice(0, 2).toUpperCase();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className={`sidebar shadow d-flex flex-column ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Toggle Button */}
            <button
                className="sidebar-toggle-btn"
                onClick={onToggle}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
            </button>

            <div className="sidebar-header p-4 d-flex align-items-center gap-3 overflow-hidden">
                <img src="/logo.png" alt="Logo" className="rounded-3 shadow flex-shrink-0" style={{ width: 50, height: 50, objectFit: 'cover' }} />
                {!isCollapsed && (
                    <div className="sidebar-brand-text">
                        <h3 className="fw-bold text-white mb-0">EcoWire</h3>
                        <small className="text-white-50">Sustainability Engine</small>
                    </div>
                )}
            </div>


            <nav className="mt-4 flex-grow-1 overflow-hidden">
                <RoleGuard permission={canCreatePolicy}>
                    <div className="px-3 mb-3">
                        <Link
                            to="/"
                            className={`btn w-100 text-start d-flex align-items-center rounded-3 text-white ${location.pathname === '/' ? 'fw-bold' : ''} ${isCollapsed ? 'justify-content-center px-0' : ''}`}
                            style={{ border: '1px solid white', backgroundColor: 'transparent' }}
                            title="New Policy"
                        >
                            <i className="sidebar-icon bi bi-plus-circle fs-5"></i>
                            {!isCollapsed && <span className="sidebar-text ms-2">New Policy</span>}
                        </Link>
                    </div>
                </RoleGuard>

                <Link
                    to="/analytics"
                    className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''} ${isCollapsed ? 'justify-content-center' : ''}`}
                    title="Analytics"
                >
                    <i className="sidebar-icon bi bi-bar-chart fs-5"></i>
                    {!isCollapsed && <span className="sidebar-text ms-2">Analytics</span>}
                </Link>

                <Link
                    to="/policies"
                    className={`nav-link ${location.pathname.includes('/policies') ? 'active' : ''} ${isCollapsed ? 'justify-content-center' : ''}`}
                    title="My Policies"
                >
                    <i className="sidebar-icon bi bi-list-check fs-5"></i>
                    {!isCollapsed && <span className="sidebar-text ms-2">My Policies</span>}

                </Link>
            </nav>

            <div className="mt-auto p-2 p-md-3 border-top border-white-20">
                <div className={`d-flex align-items-center ${isCollapsed ? 'flex-column justify-content-center gap-2' : 'gap-3'}`}>
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center text-success fw-bold flex-shrink-0" style={{ width: 40, height: 40 }}>
                        {initials}
                    </div>
                    {!isCollapsed ? (
                        <>
                            <div className="overflow-hidden text-white flex-grow-1 sidebar-user-info">
                                <p className="mb-0 small fw-bold text-truncate">{username}</p>
                                <p className="mb-0 smaller text-truncate opacity-70">{authService.getRole() || 'User'}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-sm ms-auto p-0 border-0 text-white opacity-70 hover-opacity-100"
                                title="Logout"
                            >
                                <i className="bi bi-box-arrow-right fs-5" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="btn btn-sm p-0 border-0 text-white opacity-70 hover-opacity-100 d-flex align-items-center justify-content-center"
                            style={{ width: 40, height: 40 }}
                            title="Logout"
                        >
                            <i className="bi bi-box-arrow-right fs-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
