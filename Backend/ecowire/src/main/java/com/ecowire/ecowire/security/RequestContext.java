package com.ecowire.ecowire.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Typed helper that extracts the current caller's identity from the Spring Security context.
 * Use RequestContext.current() in any controller or service to get userId, role, and organizationId
 * without directly coupling to SecurityContextHolder.
 */
public class RequestContext {

    private final String userId;
    private final String role;
    private final String organizationId; // null for CUSTOMER and ADMIN

    private RequestContext(String userId, String role, String organizationId) {
        this.userId = userId;
        this.role = role;
        this.organizationId = organizationId;
    }

    /**
     * Build a RequestContext from the current Spring Security authentication.
     * Requires that JwtAuthenticationFilter has already stored an EcowirePrincipal.
     */
    public static RequestContext current() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        EcowirePrincipal principal = (EcowirePrincipal) auth.getPrincipal();
        return new RequestContext(principal.userId(), principal.role(), principal.organizationId());
    }

    // ── Role helpers ──────────────────────────────────────────────────────

    public boolean isAdmin() {
        return "ADMIN".equals(role);
    }

    public boolean isCustomer() {
        return "CUSTOMER".equals(role);
    }

    public boolean isOrgScoped() {
        return switch (role) {
            case "AGENT", "UNDERWRITER", "REPORTING", "AUDITOR" -> true;
            default -> false;
        };
    }

    // ── Getters ───────────────────────────────────────────────────────────

    public String getUserId() { return userId; }
    public String getRole() { return role; }
    public String getOrganizationId() { return organizationId; }
}
