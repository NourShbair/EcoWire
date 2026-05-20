import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PolicyForm from './components/PolicyForm';
import PolicyDashboard from './components/PolicyDashboard';
import PoliciesList from './components/PoliciesList';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard.jsx';
import { authService } from './services/authService.js';
import { canCreatePolicy, canEditPolicy } from './services/permissionService.js';
import './App.css';

/**
 * RoleProtectedRoute component for role-based route protection
 * Redirects users without required permissions to a fallback route
 */
function RoleProtectedRoute({ children, permission, fallback = '/policies' }) {
  const currentRole = authService.getRole();
  
  // If no role or permission check fails, redirect to fallback
  if (!currentRole || !permission(currentRole)) {
    return <Navigate to={fallback} replace />;
  }
  
  // If permission check passes, render the children
  return children;
}

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth <= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const navigate = useNavigate();

  const username = authService.getUsername() || 'User';
  const initials = username.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            {isMobile && (
              <header 
                className="mobile-header d-flex align-items-center justify-content-between px-3 py-2 text-white shadow-sm position-sticky top-0 w-100" 
                style={{ 
                  zIndex: 999, 
                  height: '60px', 
                  background: 'linear-gradient(135deg, #004d40 0%, #00796b 100%)' 
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <img src="/logo.png" alt="Logo" className="rounded-3 shadow-sm" style={{ width: 35, height: 35, objectFit: 'cover' }} />
                  <h4 className="fw-bold mb-0 text-white" style={{ letterSpacing: '0.5px' }}>EcoWire</h4>
                </div>
                
                <button 
                  onClick={toggleSidebar} 
                  className="btn text-white p-1 d-flex align-items-center justify-content-center"
                  aria-label="Toggle Navigation Menu"
                  style={{ fontSize: '1.75rem', background: 'transparent', border: 'none' }}
                >
                  <i className={`bi ${isSidebarCollapsed ? 'bi-list' : 'bi-x'}`}></i>
                </button>
              </header>
            )}

            {isMobile && !isSidebarCollapsed && (
              <div 
                className="sidebar-backdrop" 
                onClick={() => setIsSidebarCollapsed(true)}
                style={{
                  position: 'fixed',
                  top: '60px',
                  left: 0,
                  width: '100vw',
                  height: 'calc(100vh - 60px)',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(3px)',
                  zIndex: 997,
                  transition: 'opacity 0.3s ease'
                }}
              />
            )}

            {isMobile && !isSidebarCollapsed && (
              <div className="mobile-nav-dropdown text-white shadow-lg">
                <nav className="d-flex flex-column gap-2 mb-3">
                  <RoleGuard permission={canCreatePolicy}>
                    <div className="px-1 mb-2">
                      <Link
                        to="/"
                        className={`btn w-100 text-start d-flex align-items-center rounded-3 text-white py-2 px-3 ${location.pathname === '/' ? 'fw-bold active' : ''}`}
                        style={{ border: '1px solid rgba(255, 255, 255, 0.4)', backgroundColor: 'transparent' }}
                        onClick={() => setIsSidebarCollapsed(true)}
                      >
                        <i className="bi bi-plus-circle fs-5 me-2"></i>
                        <span>New Policy</span>
                      </Link>
                    </div>
                  </RoleGuard>

                  <Link
                    to="/analytics"
                    className={`nav-link-mobile d-flex align-items-center py-2 px-3 rounded-3 text-white-50 ${location.pathname === '/analytics' ? 'active fw-bold text-white' : ''}`}
                    onClick={() => setIsSidebarCollapsed(true)}
                  >
                    <i className="bi bi-bar-chart fs-5 me-2"></i>
                    <span>Analytics</span>
                  </Link>

                  <Link
                    to="/policies"
                    className={`nav-link-mobile d-flex align-items-center py-2 px-3 rounded-3 text-white-50 ${location.pathname.includes('/policies') ? 'active fw-bold text-white' : ''}`}
                    onClick={() => setIsSidebarCollapsed(true)}
                  >
                    <i className="bi bi-list-check fs-5 me-2"></i>
                    <span>My Policies</span>
                  </Link>
                </nav>

                <div className="pt-3 border-top border-white-20 d-flex align-items-center gap-3">
                  <div className="bg-white rounded-circle d-flex align-items-center justify-content-center text-success fw-bold flex-shrink-0" style={{ width: 40, height: 40 }}>
                    {initials}
                  </div>
                  <div className="overflow-hidden text-white flex-grow-1">
                    <p className="mb-0 small fw-bold text-truncate">{username}</p>
                    <p className="mb-0 smaller text-white-50 text-truncate">{authService.getRole() || 'User'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSidebarCollapsed(true);
                      handleLogout();
                    }}
                    className="btn btn-sm ms-auto p-0 border-0 text-white opacity-70 hover-opacity-100"
                    title="Logout"
                  >
                    <i className="bi bi-box-arrow-right fs-4" />
                  </button>
                </div>
              </div>
            )}

            <div className={`main-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
              {!isMobile && (
                <Sidebar 
                  isCollapsed={isSidebarCollapsed} 
                  onToggle={toggleSidebar} 
                  onLinkClick={() => { if (isMobile) setIsSidebarCollapsed(true); }}
                />
              )}
              <main className="content-wrapper">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <RoleProtectedRoute permission={canCreatePolicy}>
                        <PolicyForm isSidebarCollapsed={isSidebarCollapsed} isMobile={isMobile} />
                      </RoleProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/edit/:policyId" 
                    element={
                      <RoleProtectedRoute permission={canEditPolicy}>
                        <PolicyForm isSidebarCollapsed={isSidebarCollapsed} isMobile={isMobile} />
                      </RoleProtectedRoute>
                    } 
                  />
                  <Route path="/policies" element={<PoliciesList />} />
                  <Route path="/analytics" element={<AnalyticsDashboard />} />
                  <Route path="/dashboard/:policyId" element={<PolicyDashboard />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
