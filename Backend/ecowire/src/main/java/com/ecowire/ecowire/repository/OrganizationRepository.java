package com.ecowire.ecowire.repository;

import com.ecowire.ecowire.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, String> {

    boolean existsByOrganizationId(String organizationId);

    Optional<Organization> findByOrganizationId(String organizationId);

    List<Organization> findAllByOrderByNameAsc();
}
