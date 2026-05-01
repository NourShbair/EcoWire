import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import RoleGuard from './RoleGuard.jsx';
import { authService } from '../../services/authService.js';
import { canCreatePolicy } from '../../services/permissionService.js';

// Mock the authService
vi.mock('../../services/authService.js', () => ({
    authService: {
        getRole: vi.fn()
    }
}));

describe('RoleGuard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders children when permission function returns true', () => {
        // Mock authService to return ADMIN role
        authService.getRole.mockReturnValue('ADMIN');
        
        render(
            <RoleGuard permission={canCreatePolicy}>
                <button>New Policy</button>
            </RoleGuard>
        );
        
        expect(screen.getByText('New Policy')).toBeInTheDocument();
    });

    it('renders nothing when permission function returns false', () => {
        // Mock authService to return CUSTOMER role (read-only)
        authService.getRole.mockReturnValue('CUSTOMER');
        
        render(
            <RoleGuard permission={canCreatePolicy}>
                <button>New Policy</button>
            </RoleGuard>
        );
        
        expect(screen.queryByText('New Policy')).not.toBeInTheDocument();
    });

    it('renders nothing when authService.getRole() returns null', () => {
        // Mock authService to return null
        authService.getRole.mockReturnValue(null);
        
        render(
            <RoleGuard permission={canCreatePolicy}>
                <button>New Policy</button>
            </RoleGuard>
        );
        
        expect(screen.queryByText('New Policy')).not.toBeInTheDocument();
    });

    it('renders nothing when authService.getRole() returns undefined', () => {
        // Mock authService to return undefined
        authService.getRole.mockReturnValue(undefined);
        
        render(
            <RoleGuard permission={canCreatePolicy}>
                <button>New Policy</button>
            </RoleGuard>
        );
        
        expect(screen.queryByText('New Policy')).not.toBeInTheDocument();
    });

    it('renders nothing when permission prop is not a function', () => {
        // Mock authService to return ADMIN role
        authService.getRole.mockReturnValue('ADMIN');
        
        render(
            <RoleGuard permission="not-a-function">
                <button>New Policy</button>
            </RoleGuard>
        );
        
        expect(screen.queryByText('New Policy')).not.toBeInTheDocument();
    });

    it('renders nothing when permission prop is null', () => {
        // Mock authService to return ADMIN role
        authService.getRole.mockReturnValue('ADMIN');
        
        render(
            <RoleGuard permission={null}>
                <button>New Policy</button>
            </RoleGuard>
        );
        
        expect(screen.queryByText('New Policy')).not.toBeInTheDocument();
    });

    it('renders nothing when authService.getRole() throws an error', () => {
        // Mock authService to throw an error
        authService.getRole.mockImplementation(() => {
            throw new Error('Storage error');
        });
        
        render(
            <RoleGuard permission={canCreatePolicy}>
                <button>New Policy</button>
            </RoleGuard>
        );
        
        expect(screen.queryByText('New Policy')).not.toBeInTheDocument();
    });

    it('renders nothing when permission function throws an error', () => {
        // Mock authService to return ADMIN role
        authService.getRole.mockReturnValue('ADMIN');
        
        // Create a permission function that throws an error
        const errorPermission = () => {
            throw new Error('Permission check error');
        };
        
        render(
            <RoleGuard permission={errorPermission}>
                <button>New Policy</button>
            </RoleGuard>
        );
        
        expect(screen.queryByText('New Policy')).not.toBeInTheDocument();
    });

    it('works with custom permission functions', () => {
        // Mock authService to return AGENT role
        authService.getRole.mockReturnValue('AGENT');
        
        // Custom permission function that allows AGENT role
        const customPermission = (role) => role === 'AGENT';
        
        render(
            <RoleGuard permission={customPermission}>
                <div>Agent Content</div>
            </RoleGuard>
        );
        
        expect(screen.getByText('Agent Content')).toBeInTheDocument();
    });
});