package com.ecowire.ecowire.service;

import com.ecowire.ecowire.dto.PolicyRequestDTO;
import com.ecowire.ecowire.dto.PolicyResponseDTO;

import java.util.List;

public interface PolicyService {
    PolicyResponseDTO createPolicy(PolicyRequestDTO request);
    PolicyResponseDTO getPolicy(String policyId);
    List<PolicyResponseDTO> getAllPolicies();
}
