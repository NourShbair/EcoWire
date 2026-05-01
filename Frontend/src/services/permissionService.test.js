import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
    canCreatePolicy,
    canEditPolicy,
    canDeletePolicy,
    canViewPolicies,
    isWriteRole,
    isReadOnlyRole
} from './permissionService.js';

describe('PermissionService', () => {
    const VALID_ROLES = ['CUSTOMER', 'AGENT', 'UNDERWRITER', 'REPORTING', 'AUDITOR', 'ADMIN'];
    const WRITE_ROLES = ['AGENT', 'ADMIN'];
    const READ_ONLY_ROLES = ['CUSTOMER', 'UNDERWRITER', 'REPORTING', 'AUDITOR'];
    const INVALID_INPUTS = [null, undefined, '', 'invalid', 'agent', 'AGENT_INVALID', 123, {}, []];

    describe('canCreatePolicy', () => {
        it('should return true for AGENT role', () => {
            expect(canCreatePolicy('AGENT')).toBe(true);
        });

        it('should return true for ADMIN role', () => {
            expect(canCreatePolicy('ADMIN')).toBe(true);
        });

        it('should return false for read-only roles', () => {
            READ_ONLY_ROLES.forEach(role => {
                expect(canCreatePolicy(role)).toBe(false);
            });
        });

        it('should return false for invalid inputs', () => {
            INVALID_INPUTS.forEach(input => {
                expect(canCreatePolicy(input)).toBe(false);
            });
        });

        it('should be case-sensitive', () => {
            expect(canCreatePolicy('agent')).toBe(false);
            expect(canCreatePolicy('admin')).toBe(false);
            expect(canCreatePolicy('Agent')).toBe(false);
            expect(canCreatePolicy('Admin')).toBe(false);
        });
    });

    describe('canEditPolicy', () => {
        it('should return true for AGENT role', () => {
            expect(canEditPolicy('AGENT')).toBe(true);
        });

        it('should return true for ADMIN role', () => {
            expect(canEditPolicy('ADMIN')).toBe(true);
        });

        it('should return false for read-only roles', () => {
            READ_ONLY_ROLES.forEach(role => {
                expect(canEditPolicy(role)).toBe(false);
            });
        });

        it('should return false for invalid inputs', () => {
            INVALID_INPUTS.forEach(input => {
                expect(canEditPolicy(input)).toBe(false);
            });
        });

        it('should be case-sensitive', () => {
            expect(canEditPolicy('agent')).toBe(false);
            expect(canEditPolicy('admin')).toBe(false);
            expect(canEditPolicy('Agent')).toBe(false);
            expect(canEditPolicy('Admin')).toBe(false);
        });
    });

    describe('canDeletePolicy', () => {
        it('should return true for AGENT role', () => {
            expect(canDeletePolicy('AGENT')).toBe(true);
        });

        it('should return true for ADMIN role', () => {
            expect(canDeletePolicy('ADMIN')).toBe(true);
        });

        it('should return false for read-only roles', () => {
            READ_ONLY_ROLES.forEach(role => {
                expect(canDeletePolicy(role)).toBe(false);
            });
        });

        it('should return false for invalid inputs', () => {
            INVALID_INPUTS.forEach(input => {
                expect(canDeletePolicy(input)).toBe(false);
            });
        });

        it('should be case-sensitive', () => {
            expect(canDeletePolicy('agent')).toBe(false);
            expect(canDeletePolicy('admin')).toBe(false);
            expect(canDeletePolicy('Agent')).toBe(false);
            expect(canDeletePolicy('Admin')).toBe(false);
        });
    });

    describe('canViewPolicies', () => {
        it('should return true for all valid roles', () => {
            VALID_ROLES.forEach(role => {
                expect(canViewPolicies(role)).toBe(true);
            });
        });

        it('should return false for invalid inputs', () => {
            INVALID_INPUTS.forEach(input => {
                expect(canViewPolicies(input)).toBe(false);
            });
        });

        it('should be case-sensitive', () => {
            expect(canViewPolicies('customer')).toBe(false);
            expect(canViewPolicies('agent')).toBe(false);
            expect(canViewPolicies('Customer')).toBe(false);
            expect(canViewPolicies('Agent')).toBe(false);
        });
    });

    describe('isWriteRole', () => {
        it('should return true for write roles', () => {
            WRITE_ROLES.forEach(role => {
                expect(isWriteRole(role)).toBe(true);
            });
        });

        it('should return false for read-only roles', () => {
            READ_ONLY_ROLES.forEach(role => {
                expect(isWriteRole(role)).toBe(false);
            });
        });

        it('should return false for invalid inputs', () => {
            INVALID_INPUTS.forEach(input => {
                expect(isWriteRole(input)).toBe(false);
            });
        });
    });

    describe('isReadOnlyRole', () => {
        it('should return true for read-only roles', () => {
            READ_ONLY_ROLES.forEach(role => {
                expect(isReadOnlyRole(role)).toBe(true);
            });
        });

        it('should return false for write roles', () => {
            WRITE_ROLES.forEach(role => {
                expect(isReadOnlyRole(role)).toBe(false);
            });
        });

        it('should return false for invalid inputs', () => {
            INVALID_INPUTS.forEach(input => {
                expect(isReadOnlyRole(input)).toBe(false);
            });
        });
    });

    // Property-based tests
    describe('Property-based tests', () => {
        describe('Property 1: Write Permission Authorization', () => {
            it('**Validates: Requirements 1.1, 1.2, 1.3, 1.5, 7.2** - Write permission functions return true only for AGENT and ADMIN', () => {
                fc.assert(fc.property(
                    fc.oneof(
                        fc.constantFrom(...VALID_ROLES),
                        fc.constant(null),
                        fc.constant(undefined),
                        fc.constant(''),
                        fc.string().filter(s => !VALID_ROLES.includes(s)),
                        fc.string().map(s => s.toLowerCase())
                    ),
                    (role) => {
                        const isWritePermission = role === 'AGENT' || role === 'ADMIN';
                        
                        expect(canCreatePolicy(role)).toBe(isWritePermission);
                        expect(canEditPolicy(role)).toBe(isWritePermission);
                        expect(canDeletePolicy(role)).toBe(isWritePermission);
                    }
                ), { numRuns: 100 });
            });
        });

        describe('Property 2: View Permission Authorization', () => {
            it('**Validates: Requirements 1.4, 1.5, 7.2** - canViewPolicies returns true only for valid roles', () => {
                fc.assert(fc.property(
                    fc.oneof(
                        fc.constantFrom(...VALID_ROLES),
                        fc.constant(null),
                        fc.constant(undefined),
                        fc.constant(''),
                        fc.string().filter(s => !VALID_ROLES.includes(s)),
                        fc.string().map(s => s.toLowerCase())
                    ),
                    (role) => {
                        const isValidRole = VALID_ROLES.includes(role);
                        expect(canViewPolicies(role)).toBe(isValidRole);
                    }
                ), { numRuns: 100 });
            });
        });

        describe('Property 3: Helper Function Consistency', () => {
            it('isWriteRole and isReadOnlyRole should be mutually exclusive for valid roles', () => {
                fc.assert(fc.property(
                    fc.constantFrom(...VALID_ROLES),
                    (role) => {
                        const isWrite = isWriteRole(role);
                        const isReadOnly = isReadOnlyRole(role);
                        
                        // For valid roles, exactly one should be true
                        expect(isWrite !== isReadOnly).toBe(true);
                        expect(isWrite || isReadOnly).toBe(true);
                    }
                ), { numRuns: 100 });
            });
        });

        describe('Property 4: Invalid Input Handling', () => {
            it('All permission functions should return false for invalid inputs', () => {
                fc.assert(fc.property(
                    fc.oneof(
                        fc.constant(null),
                        fc.constant(undefined),
                        fc.constant(''),
                        fc.string().filter(s => !VALID_ROLES.includes(s))
                    ),
                    (invalidInput) => {
                        expect(canCreatePolicy(invalidInput)).toBe(false);
                        expect(canEditPolicy(invalidInput)).toBe(false);
                        expect(canDeletePolicy(invalidInput)).toBe(false);
                        expect(canViewPolicies(invalidInput)).toBe(false);
                        expect(isWriteRole(invalidInput)).toBe(false);
                        expect(isReadOnlyRole(invalidInput)).toBe(false);
                    }
                ), { numRuns: 100 });
            });
        });
    });
});