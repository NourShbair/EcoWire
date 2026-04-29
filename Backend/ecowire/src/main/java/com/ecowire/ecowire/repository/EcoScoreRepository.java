// EcoScoreRepository.java
package com.ecowire.ecowire.repository;

import com.ecowire.ecowire.entity.EcoScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EcoScoreRepository extends JpaRepository<EcoScore, String> {
    // Most recent score for a policy
    Optional<EcoScore> findTopByPolicy_PolicyIdOrderByCalculatedDateDesc(String policyId);
    // All scores for a policy (for history)
    List<EcoScore> findByPolicy_PolicyId(String policyId);
}
