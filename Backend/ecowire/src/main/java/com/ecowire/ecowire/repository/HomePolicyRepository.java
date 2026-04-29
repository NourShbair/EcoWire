// HomePolicyRepository.java
package com.ecowire.ecowire.repository;

import com.ecowire.ecowire.entity.HomePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface HomePolicyRepository extends JpaRepository<HomePolicy, String> {
    Optional<HomePolicy> findByPolicy_PolicyId(String policyId);
}
