package com.ecowire.ecowire.controller;

import com.ecowire.ecowire.dto.PolicyResponseDTO;
import com.ecowire.ecowire.dto.RecommendationDTO;
import com.ecowire.ecowire.service.PolicyService;
import com.ecowire.ecowire.service.RecommendationEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/policies")
public class RecommendationController {

    @Autowired
    private PolicyService policyService;

    @Autowired
    private RecommendationEngine recommendationEngine;

    @GetMapping("/{id}/recommendations")
    public ResponseEntity<List<RecommendationDTO>> getRecommendations(
            @PathVariable String id) {

        // Get policy details
        PolicyResponseDTO policy = policyService.getPolicy(id);

        // Build attributes from policy details
        Map<String, Object> attributes = extractAttributes(policy);

        // Generate recommendations
        List<RecommendationDTO> recommendations = recommendationEngine.generateRecommendations(
                policy.getPolicyType(),
                policy.getEcoScore().getTotalScore(),
                attributes);

        return ResponseEntity.ok(recommendations);
    }

    private Map<String, Object> extractAttributes(PolicyResponseDTO policy) {
        Map<String, Object> attributes = new HashMap<>();

        switch (policy.getPolicyType()) {
            case AUTO:
                if (policy.getAutoDetails() != null) {
                    attributes.put("vehicleType",    policy.getAutoDetails().getVehicleType());
                    attributes.put("annualMileage",  policy.getAutoDetails().getAnnualMileage());
                    attributes.put("usageType",      policy.getAutoDetails().getUsageType());
                    attributes.put("fuelEfficiency", policy.getAutoDetails().getFuelEfficiency());
                }
                break;
            case HOME:
                if (policy.getHomeDetails() != null) {
                    attributes.put("energyRating",              policy.getHomeDetails().getEnergyRating());
                    attributes.put("hasSolarPanels",            policy.getHomeDetails().getHasSolarPanels());
                    attributes.put("insulationType",            policy.getHomeDetails().getInsulationType());
                    attributes.put("heatingSystem",             policy.getHomeDetails().getHeatingSystem());
                    attributes.put("waterConservationFeatures", policy.getHomeDetails().getWaterConservationFeatures());
                }
                break;
            case PROPERTY:
                if (policy.getPropertyDetails() != null) {
                    attributes.put("certifications",  policy.getPropertyDetails().getCertifications());
                    attributes.put("energySystems",   policy.getPropertyDetails().getEnergySystems());
                    attributes.put("wasteManagement", policy.getPropertyDetails().getWasteManagement());
                    attributes.put("propertyAddress", policy.getPropertyDetails().getPropertyAddress());
                }
                break;
        }

        return attributes;
    }
}
