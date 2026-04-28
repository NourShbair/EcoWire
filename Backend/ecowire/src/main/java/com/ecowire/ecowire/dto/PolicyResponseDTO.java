package com.ecowire.ecowire.dto;

import com.ecowire.ecowire.enums.PolicyType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PolicyResponseDTO {
    private String policyId;
    private PolicyType policyType;
    private String customerName;
    private String contactInfo;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private EcoScoreDTO ecoScore;

    // Type-specific details (only one will be populated)
    private AutoPolicyDTO autoDetails;
    private HomePolicyDTO homeDetails;
    private PropertyPolicyDTO propertyDetails;
}