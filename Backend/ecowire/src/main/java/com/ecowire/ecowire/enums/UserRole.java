package com.ecowire.ecowire.enums;

public enum UserRole {
    CUSTOMER,       // Policyholders – can only view their own policies
    AGENT,          // Insurance agents – can create and manage policies
    UNDERWRITER,    // Access climate, nature, and ESG risk data
    REPORTING,      // Access all sustainability data for reporting
    AUDITOR,        // Read-only access to public sustainability report
    ADMIN           // Full system access
}
