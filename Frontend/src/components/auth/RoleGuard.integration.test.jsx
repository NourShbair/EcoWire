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

describe('RoleGuard Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('works with the exact usage pattern from the task specification', () => {
        // Mock authService to return ADMIN role (has create permission)
        authService.getRole.mockReturnValue('ADMIN');
        
        // Test the exact usage pattern from the task:
        // <RoleGuard permission={canCreatePolicy}>
        //   <button>New Policy</button>
        // </RoleGuard>
        render(
            <RoleGuard permission={canCreatePolicy}>
                <button>New Policy</button>
            </RoleGuard>
        );
        
        expect(screen.getByText('New Policy')).toBeInTheDocument();
    });

    it('hides content for read-only roles using the task usage pattern', () => {
        // Mock authService to return CUSTOMER role (read-only, no create permission)
        authService.getRole.mockReturnValue('CUSTOMER');
        
        render(
            <RoleGuard permission={canCreatePolicy}>
                <button>New Policy</button>
            </RoleGuard>
        );
        
        expect(screen.queryByText('New Policy')).not.toBeInTheDocument();
    });

    it('works with AGENT role (write role)', () => {
        // Mock authService to return AGENT role (has create permission)
        authService.getRole.mockReturnValue('AGENT');
        
        render(
            <RoleGuard permission={canCreatePolicy}>
                <button>New Policy</button>
            </RoleGuard>
        );
        
        expect(screen.getByText('New Policy')).toBeInTheDocument();
    });

    it('works with multiple read-only roles', () => {
        const readOnlyRoles = ['CUSTOMER', 'UNDERWRITER', 'REPORTING', 'AUDITOR'];
        
        readOnlyRoles.forEach(role => {
            vi.clearAllMocks();
            authService.getRole.mockReturnValue(role);
            
            const { unmount } = render(
                <RoleGuard permission={canCreatePolicy}>
                    <button>New Policy</button>
                </RoleGuard>
            );
            
            expect(screen.queryByText('New Policy')).not.toBeInTheDocument();
            unmount();
        });
    });
});