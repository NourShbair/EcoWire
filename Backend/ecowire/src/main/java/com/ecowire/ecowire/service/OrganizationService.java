package com.ecowire.ecowire.service;

import com.ecowire.ecowire.entity.Organization;

import java.util.List;

public interface OrganizationService {

    /**
     * Returns the organization with the given ID.
     * Throws OrganizationNotFoundException (HTTP 404) if absent.
     */
    Organization getOrganizationById(String organizationId);

    /**
     * Returns true if an organization with the given ID exists.
     */
    boolean organizationExists(String organizationId);

    /**
     * Returns all organizations sorted alphabetically by name in ascending order.
     */
    List<Organization> getAllOrganizations();
}
