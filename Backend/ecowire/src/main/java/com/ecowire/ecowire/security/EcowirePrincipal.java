package com.ecowire.ecowire.security;

/**
 * Immutable principal stored in the Spring Security context for every authenticated request.
 * Replaces the bare username string so that userId, role, and organizationId are all
 * available anywhere SecurityContextHolder is accessible.
 *
 * organizationId is null for CUSTOMER and ADMIN roles.
 */
public record EcowirePrincipal(
        String userId,
        String username,
        String role,
        String organizationId
) {}
