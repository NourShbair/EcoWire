package com.ecowire.ecowire.service.impl;

import com.ecowire.ecowire.dto.*;
import com.ecowire.ecowire.enums.PolicyType;
import com.ecowire.ecowire.exception.InvalidPolicyTypeException;
import com.ecowire.ecowire.exception.PolicyNotFoundException;
import com.ecowire.ecowire.scoring.EcoScoreResult;
import com.ecowire.ecowire.scoring.ScoreComponent;
import com.ecowire.ecowire.service.EcoScoringEngine;
import com.ecowire.ecowire.service.PolicyService;
import com.ecowire.ecowire.service.RecommendationEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PolicyServiceImpl implements PolicyService {

    private static final Logger logger = LoggerFactory.getLogger(PolicyServiceImpl.class);

    // In-memory store until Suraksha's DB layer is ready
    private final Map<String, PolicyResponseDTO> policyStore = new ConcurrentHashMap<>();

    @Autowired
    private EcoScoringEngine scoringEngine;

    @Autowired
    private RecommendationEngine recommendationEngine;

    @Override
    public PolicyResponseDTO createPolicy(PolicyRequestDTO request) {
        logger.info("Creating policy of type: {}", request.getPolicyType());

        // 1. Generate policy ID
        String policyId = UUID.randomUUID().toString();

        // 2. Extract attributes for scoring
        Map<String, Object> attributes = extractAttributes(request);

        // 3. Calculate eco score
        EcoScoreResult scoreResult = scoringEngine.calculateScore(
                request.getPolicyType(), attributes);
        logger.info("Eco score calculated: {}", scoreResult.getTotalScore());

        // 4. Build eco score DTO
        EcoScoreDTO ecoScoreDTO = buildEcoScoreDTO(policyId, scoreResult, request.getPolicyType());

        // 5. Build policy response
        PolicyResponseDTO response = new PolicyResponseDTO();
        response.setPolicyId(policyId);
        response.setPolicyType(request.getPolicyType());
        response.setCustomerName(request.getCustomerName());
        response.setContactInfo(request.getContactInfo());
        response.setCreatedDate(LocalDateTime.now());
        response.setUpdatedDate(LocalDateTime.now());
        response.setEcoScore(ecoScoreDTO);

        // 6. Set type-specific details
        setTypeSpecificDetails(response, request);

        // 7. Store in memory
        policyStore.put(policyId, response);

        logger.info("Policy created successfully with ID: {}", policyId);
        return response;
    }

    @Override
    public PolicyResponseDTO getPolicy(String policyId) {
        PolicyResponseDTO policy = policyStore.get(policyId);
        if (policy == null) {
            throw new PolicyNotFoundException(policyId);
        }
        return policy;
    }

    @Override
    public List<PolicyResponseDTO> getAllPolicies() {
        return new ArrayList<>(policyStore.values());
    }

    @Override
    public PolicyResponseDTO updatePolicy(String policyId, PolicyRequestDTO request) {
        logger.info("Updating policy with ID: {}", policyId);

        // 1. Check policy exists
        PolicyResponseDTO existing = policyStore.get(policyId);
        if (existing == null) {
            throw new PolicyNotFoundException(policyId);
        }

        // 2. Prevent policyType change
        if (request.getPolicyType() != null &&
                !request.getPolicyType().equals(existing.getPolicyType())) {
            throw new InvalidPolicyTypeException(
                    "Policy type cannot be changed. Existing type: " + existing.getPolicyType(),
                    true);
        }

        // 3. Force same policyType
        request.setPolicyType(existing.getPolicyType());

        // 4. Extract attributes and recalculate score
        Map<String, Object> attributes = extractAttributes(request);
        EcoScoreResult scoreResult = scoringEngine.calculateScore(
                request.getPolicyType(), attributes);

        // 5. Build updated eco score DTO
        EcoScoreDTO ecoScoreDTO = buildEcoScoreDTO(policyId, scoreResult, request.getPolicyType());

        // 6. Build updated response preserving original createdDate
        PolicyResponseDTO updated = new PolicyResponseDTO();
        updated.setPolicyId(policyId);
        updated.setPolicyType(existing.getPolicyType());
        updated.setCustomerName(request.getCustomerName());
        updated.setContactInfo(request.getContactInfo());
        updated.setCreatedDate(existing.getCreatedDate());
        updated.setUpdatedDate(LocalDateTime.now());
        updated.setEcoScore(ecoScoreDTO);

        // 7. Set type-specific details
        setTypeSpecificDetails(updated, request);

        // 8. Replace in store
        policyStore.put(policyId, updated);

        logger.info("Policy updated successfully: {}", policyId);
        return updated;
    }

    @Override
    public void deletePolicy(String policyId) {
        logger.info("Deleting policy with ID: {}", policyId);

        if (!policyStore.containsKey(policyId)) {
            throw new PolicyNotFoundException(policyId);
        }

        policyStore.remove(policyId);
        logger.info("Policy deleted successfully: {}", policyId);
    }


    // ─── Helpers ─────────────────────────────────────────────────────────────

    private Map<String, Object> extractAttributes(PolicyRequestDTO request) {
        Map<String, Object> attributes = new HashMap<>();

        switch (request.getPolicyType()) {
            case AUTO:
                attributes.put("vehicleType",    request.getVehicleType());
                attributes.put("annualMileage",  request.getAnnualMileage());
                attributes.put("usageType",      request.getUsageType());
                attributes.put("fuelEfficiency", request.getFuelEfficiency());
                break;
            case HOME:
                attributes.put("energyRating",              request.getEnergyRating());
                attributes.put("hasSolarPanels",            request.getHasSolarPanels());
                attributes.put("insulationType",            request.getInsulationType());
                attributes.put("heatingSystem",             request.getHeatingSystem());
                attributes.put("waterConservationFeatures", request.getWaterConservationFeatures());
                break;
            case PROPERTY:
                attributes.put("certifications",  request.getCertifications());
                attributes.put("energySystems",   request.getEnergySystems());
                attributes.put("wasteManagement", request.getWasteManagement());
                attributes.put("propertyAddress", request.getPropertyAddress());
                break;
        }

        return attributes;
    }

    private EcoScoreDTO buildEcoScoreDTO(String policyId,
                                         EcoScoreResult result,
                                         PolicyType policyType) {
        EcoScoreDTO dto = new EcoScoreDTO();
        dto.setPolicyId(policyId);
        dto.setTotalScore(result.getTotalScore());
        dto.setPolicyType(policyType);
        dto.setCalculatedDate(LocalDateTime.now());

        // Convert ScoreComponent to ScoreComponentDTO
        Map<String, ScoreComponentDTO> breakdownDTO = new HashMap<>();
        result.getBreakdown().forEach((key, component) ->
                breakdownDTO.put(key, new ScoreComponentDTO(
                        component.getPoints(),
                        component.getWeight(),
                        component.getMaxPoints(),
                        component.getDescription()
                ))
        );
        dto.setScoreBreakdown(breakdownDTO);

        return dto;
    }

    private void setTypeSpecificDetails(PolicyResponseDTO response,
                                        PolicyRequestDTO request) {
        switch (request.getPolicyType()) {
            case AUTO:
                AutoPolicyDTO autoDTO = new AutoPolicyDTO();
                autoDTO.setVehicleId(request.getVehicleId());
                autoDTO.setVehicleType(request.getVehicleType());
                autoDTO.setAnnualMileage(request.getAnnualMileage());
                autoDTO.setUsageType(request.getUsageType());
                autoDTO.setFuelEfficiency(request.getFuelEfficiency());
                response.setAutoDetails(autoDTO);
                break;
            case HOME:
                HomePolicyDTO homeDTO = new HomePolicyDTO();
                homeDTO.setPropertyAddress(request.getPropertyAddress());
                homeDTO.setEnergyRating(request.getEnergyRating());
                homeDTO.setHasSolarPanels(request.getHasSolarPanels());
                homeDTO.setInsulationType(request.getInsulationType());
                homeDTO.setHeatingSystem(request.getHeatingSystem());
                homeDTO.setWaterConservationFeatures(request.getWaterConservationFeatures());
                response.setHomeDetails(homeDTO);
                break;
            case PROPERTY:
                PropertyPolicyDTO propertyDTO = new PropertyPolicyDTO();
                propertyDTO.setPropertyAddress(request.getPropertyAddress());
                propertyDTO.setPropertyType(request.getPropertyType());
                propertyDTO.setCertifications(request.getCertifications());
                propertyDTO.setEnergySystems(request.getEnergySystems());
                propertyDTO.setWasteManagement(request.getWasteManagement());
                propertyDTO.setBuildingAge(request.getBuildingAge());
                response.setPropertyDetails(propertyDTO);
                break;
        }
    }
}
