// AutoPolicyRepository.java
package com.ecowire.ecowire.repository;

import com.ecowire.ecowire.entity.AutoPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AutoPolicyRepository extends JpaRepository<AutoPolicy, String> {
    Optional<AutoPolicy> findByPolicy_PolicyId(String policyId);
}
