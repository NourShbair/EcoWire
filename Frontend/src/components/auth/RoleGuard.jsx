import { authService } from '../../services/authService.js';

/**
 * RoleGuard component for conditional rendering based on user permissions
 * 
 * This component conditionally renders its children based on whether the current
 * user's role satisfies the provided permission function. It handles all error
 * cases gracefully by rendering nothing when errors occur.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.permission - Function that receives the current role and returns boolean
 * @param {React.ReactNode} props.children - Content to render when permission check passes
 * @returns {React.ReactNode|null} Children if permission granted, null otherwise
 */
function RoleGuard({ permission, children }) {
    // Handle case where permission prop is not a function
    if (typeof permission !== 'function') {
        return null;
    }

    try {
        // Get the current user's role from authService
        const currentRole = authService.getRole();
        
        // Handle cases where getRole() returns null/undefined
        if (!currentRole) {
            return null;
        }

        // Call the permission function with the current role
        const hasPermission = permission(currentRole);
        
        // Render children if permission check passes, otherwise render nothing
        return hasPermission ? children : null;
        
    } catch (error) {
        // Handle any errors that occur during role retrieval or permission checking
        // Render nothing on errors to fail safely
        console.error('RoleGuard: Error checking permissions:', error);
        return null;
    }
}

export default RoleGuard;