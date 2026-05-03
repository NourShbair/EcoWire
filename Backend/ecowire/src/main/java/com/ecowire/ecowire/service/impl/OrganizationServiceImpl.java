package com.ecowire.ecowire.service.impl;

import com.ecowire.ecowire.entity.Organization;
import com.ecowire.ecowire.exception.OrganizationNotFoundException;
import com.ecowire.ecowire.repository.OrganizationRepository;
import com.ecowire.ecowire.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Override
    public Organization getOrganizationById(String organizationId) {
        return organizationRepository.findByOrganizationId(organizationId)
                .orElseThrow(() -> new OrganizationNotFoundException(organizationId));
    }

    @Override
    public boolean organizationExists(String organizationId) {
        return organizationRepository.existsByOrganizationId(organizationId);
    }

    @Override
    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAllByOrderByNameAsc();
    }
}
