package com.ecowire.ecowire.service;

import com.ecowire.ecowire.dto.RecommendationDTO;
import com.ecowire.ecowire.enums.PolicyType;

import java.util.List;
import java.util.Map;

public interface RecommendationEngine {
    List<RecommendationDTO> generateRecommendations(
            PolicyType policyType,
            int ecoScore,
            Map<String, Object> attributes);
}
