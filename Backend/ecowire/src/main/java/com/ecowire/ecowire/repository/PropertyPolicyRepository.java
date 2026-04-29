// PropertyPolicyRepository.java
package com.ecowire.ecowire.repository;

import com.ecowire.ecowire.entity.PropertyPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PropertyPolicyRepository extends JpaRepository<PropertyPolicy, String> {
    Optional<PropertyPolicy> findByPolicy_PolicyId(String policyId);
}
