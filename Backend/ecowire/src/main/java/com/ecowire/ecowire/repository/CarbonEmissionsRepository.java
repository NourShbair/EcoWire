package com.ecowire.ecowire.repository;

import com.ecowire.ecowire.entity.CarbonEmissions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarbonEmissionsRepository extends JpaRepository<CarbonEmissions, String> {
    Optional<CarbonEmissions> findByPolicy_PolicyId(String policyId);
}
