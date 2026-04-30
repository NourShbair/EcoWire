package com.ecowire.ecowire.repository;

import com.ecowire.ecowire.entity.ClimateRisk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClimateRiskRepository extends JpaRepository<ClimateRisk, String> {
    Optional<ClimateRisk> findByPolicy_PolicyId(String policyId);
}
