package com.ecowire.ecowire.repository;

import com.ecowire.ecowire.entity.EcoScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EcoScoreRepository extends JpaRepository<EcoScore, String> {
    Optional<EcoScore> findTopByPolicy_PolicyIdOrderByCalculatedDateDesc(String policyId);
}
