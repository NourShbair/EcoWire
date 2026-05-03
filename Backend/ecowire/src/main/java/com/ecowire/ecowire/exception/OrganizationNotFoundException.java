package com.ecowire.ecowire.exception;

public class OrganizationNotFoundException extends RuntimeException {

    public OrganizationNotFoundException(String organizationId) {
        super("Organization not found: " + organizationId);
    }
}
