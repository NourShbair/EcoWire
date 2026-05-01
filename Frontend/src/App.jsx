import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PolicyForm from './components/PolicyForm';
import PolicyDashboard from './components/PolicyDashboard';
import PoliciesList from './components/PoliciesList';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
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
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="main-layout">
                <Sidebar />
                <main className="content-wrapper">
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <RoleProtectedRoute permission={canCreatePolicy}>
                          <PolicyForm />
                        </RoleProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/edit/:policyId" 
                      element={
                        <RoleProtectedRoute permission={canEditPolicy}>
                          <PolicyForm />
                        </RoleProtectedRoute>
                      } 
                    />
                    <Route path="/policies" element={<PoliciesList />} />
                    <Route path="/dashboard/:policyId" element={<PolicyDashboard />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
