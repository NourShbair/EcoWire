// PolicyRepository.java
package com.ecowire.ecowire.repository;

import com.ecowire.ecowire.entity.Policy;
import com.ecowire.ecowire.enums.PolicyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, String> {
    List<Policy> findByPolicyType(PolicyType policyType);
    List<Policy> findByCustomerName(String customerName);
    List<Policy> findByOrganizationId(String organizationId);
    List<Policy> findByCustomerId(String customerId);
}
