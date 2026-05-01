import { authService } from '../../services/authService.js';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const isAuthenticated = authService.isAuthenticated();
    const { pathname } = useLocation();

    if (!isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
        return <Navigate to="/login" replace />;
    }

    if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
