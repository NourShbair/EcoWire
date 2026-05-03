package com.ecowire.ecowire.service;

import com.ecowire.ecowire.dto.PolicyRequestDTO;
import com.ecowire.ecowire.dto.PolicyResponseDTO;
import com.ecowire.ecowire.security.RequestContext;

import java.util.List;

public interface PolicyService {
    PolicyResponseDTO createPolicy(PolicyRequestDTO request, RequestContext ctx);
    PolicyResponseDTO getPolicy(String policyId, RequestContext ctx);
    PolicyResponseDTO updatePolicy(String policyId, PolicyRequestDTO request, RequestContext ctx);
    void deletePolicy(String policyId, RequestContext ctx);
    List<PolicyResponseDTO> getAllPolicies(RequestContext ctx);
}
