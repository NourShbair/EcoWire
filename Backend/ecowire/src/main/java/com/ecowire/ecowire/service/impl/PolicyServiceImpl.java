package com.ecowire.ecowire.service.impl;

import com.ecowire.ecowire.dto.*;
import com.ecowire.ecowire.entity.*;
import com.ecowire.ecowire.enums.PolicyType;
import com.ecowire.ecowire.exception.InvalidPolicyTypeException;
import com.ecowire.ecowire.exception.PolicyNotFoundException;
import com.ecowire.ecowire.repository.*;
import com.ecowire.ecowire.scoring.EcoScoreResult;
import com.ecowire.ecowire.scoring.ScoreComponent;
import com.ecowire.ecowire.service.EcoScoringEngine;
import com.ecowire.ecowire.service.PolicyService;
import com.ecowire.ecowire.service.RecommendationEngine;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PolicyServiceImpl implements PolicyService {

    private static final Logger logger = LoggerFactory.getLogger(PolicyServiceImpl.class);

    @Autowired private PolicyRepository         policyRepository;
    @Autowired private AutoPolicyRepository     autoPolicyRepository;
    @Autowired private HomePolicyRepository     homePolicyRepository;
    @Autowired private PropertyPolicyRepository propertyPolicyRepository;
    @Autowired private EcoScoreRepository       ecoScoreRepository;
    @Autowired private EcoScoringEngine         scoringEngine;
    @Autowired private RecommendationEngine     recommendationEngine;

    @PersistenceContext
    private EntityManager entityManager;

    // ─── CREATE ──────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public PolicyResponseDTO createPolicy(PolicyRequestDTO request) {
        logger.info("Creating policy of type: {}", request.getPolicyType());

        // 1. Save base policy and flush to DB immediately so timestamps are generated
        Policy policy = new Policy();
        policy.setCustomerName(request.getCustomerName());
        policy.setContactInfo(request.getContactInfo());
        policy.setPolicyType(request.getPolicyType());
        policy = policyRepository.saveAndFlush(policy);

        // Refresh entity to get @CreationTimestamp and @UpdateTimestamp populated
        entityManager.refresh(policy);

        // 2. Save type-specific record
        saveTypeSpecificEntity(policy, request);

        // 3. Calculate eco score
        Map<String, Object> attributes = extractAttributes(request);
        EcoScoreResult scoreResult = scoringEngine.calculateScore(
                request.getPolicyType(), attributes);
        logger.info("Eco score calculated: {}", scoreResult.getTotalScore());

        // 4. Save eco score and refresh for calculatedDate
        EcoScore ecoScore = new EcoScore();
        ecoScore.setPolicy(policy);
        ecoScore.setTotalScore(scoreResult.getTotalScore());
        ecoScore.setScoreBreakdown(convertBreakdownToMap(scoreResult.getBreakdown()));
        ecoScore = ecoScoreRepository.saveAndFlush(ecoScore);
        entityManager.refresh(ecoScore);

        logger.info("Policy created successfully with ID: {}", policy.getPolicyId());
        return buildPolicyResponse(policy, ecoScore, request);
    }

    // ─── GET SINGLE ──────────────────────────────────────────────────────────

    @Override
    public PolicyResponseDTO getPolicy(String policyId) {
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new PolicyNotFoundException(policyId));

        EcoScore ecoScore = ecoScoreRepository
                .findTopByPolicy_PolicyIdOrderByCalculatedDateDesc(policyId)
                .orElse(null);

        return buildPolicyResponseFromEntity(policy, ecoScore);
    }

    // ─── GET ALL ─────────────────────────────────────────────────────────────

    @Override
    public List<PolicyResponseDTO> getAllPolicies() {
        return policyRepository.findAll().stream()
                .map(policy -> {
                    EcoScore ecoScore = ecoScoreRepository
                            .findTopByPolicy_PolicyIdOrderByCalculatedDateDesc(policy.getPolicyId())
                            .orElse(null);
                    return buildPolicyResponseFromEntity(policy, ecoScore);
                })
                .toList();
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public PolicyResponseDTO updatePolicy(String policyId, PolicyRequestDTO request) {
        logger.info("Updating policy with ID: {}", policyId);

        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new PolicyNotFoundException(policyId));

        // Prevent policyType change
        if (request.getPolicyType() != null &&
                !request.getPolicyType().equals(policy.getPolicyType())) {
            throw new InvalidPolicyTypeException(
                    "Policy type cannot be changed. Existing type: " + policy.getPolicyType(),
                    true);
        }

        // Update base fields
        policy.setCustomerName(request.getCustomerName());
        policy.setContactInfo(request.getContactInfo());
        policy = policyRepository.saveAndFlush(policy);

        // Refresh to get updated @UpdateTimestamp
        entityManager.refresh(policy);

        // Update type-specific record
        updateTypeSpecificEntity(policy, request);

        // Recalculate and save new eco score
        Map<String, Object> attributes = extractAttributes(request);
        EcoScoreResult scoreResult = scoringEngine.calculateScore(
                policy.getPolicyType(), attributes);

        EcoScore ecoScore = new EcoScore();
        ecoScore.setPolicy(policy);
        ecoScore.setTotalScore(scoreResult.getTotalScore());
        ecoScore.setScoreBreakdown(convertBreakdownToMap(scoreResult.getBreakdown()));
        ecoScore = ecoScoreRepository.saveAndFlush(ecoScore);
        entityManager.refresh(ecoScore);

        logger.info("Policy updated successfully: {}", policyId);
        return buildPolicyResponse(policy, ecoScore, request);    }

    // ─── DELETE ──────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void deletePolicy(String policyId) {
        logger.info("Deleting policy with ID: {}", policyId);

        if (!policyRepository.existsById(policyId)) {
            throw new PolicyNotFoundException(policyId);
        }

        policyRepository.deleteById(policyId); // cascades to type-specific + eco_scores
        logger.info("Policy deleted successfully: {}", policyId);
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────

    private void saveTypeSpecificEntity(Policy policy, PolicyRequestDTO request) {
        switch (request.getPolicyType()) {
            case AUTO -> {
                AutoPolicy auto = new AutoPolicy();
                auto.setPolicy(policy);
                auto.setVehicleId(request.getVehicleId());
                auto.setVehicleType(request.getVehicleType());
                auto.setAnnualMileage(request.getAnnualMileage());
                auto.setUsageType(request.getUsageType());
                auto.setFuelEfficiency(request.getFuelEfficiency());
                autoPolicyRepository.save(auto);
            }
            case HOME -> {
                HomePolicy home = new HomePolicy();
                home.setPolicy(policy);
                home.setPropertyAddress(request.getPropertyAddress());
                home.setEnergyRating(request.getEnergyRating());
                home.setHasSolarPanels(request.getHasSolarPanels());
                home.setInsulationType(request.getInsulationType());
                home.setHeatingSystem(request.getHeatingSystem());
                home.setWaterConservationFeatures(request.getWaterConservationFeatures());
                homePolicyRepository.save(home);
            }
            case PROPERTY -> {
                PropertyPolicy prop = new PropertyPolicy();
                prop.setPolicy(policy);
                prop.setPropertyAddress(request.getPropertyAddress());
                prop.setPropertyType(request.getPropertyType());
                prop.setCertifications(request.getCertifications());
                prop.setEnergySystems(request.getEnergySystems());
                prop.setWasteManagement(request.getWasteManagement());
                prop.setBuildingAge(request.getBuildingAge());
                propertyPolicyRepository.save(prop);
            }
        }
    }

    private void updateTypeSpecificEntity(Policy policy, PolicyRequestDTO request) {
        switch (policy.getPolicyType()) {
            case AUTO -> {
                AutoPolicy auto = autoPolicyRepository
                        .findByPolicy_PolicyId(policy.getPolicyId())
                        .orElse(new AutoPolicy());
                auto.setPolicy(policy);
                auto.setVehicleId(request.getVehicleId());
                auto.setVehicleType(request.getVehicleType());
                auto.setAnnualMileage(request.getAnnualMileage());
                auto.setUsageType(request.getUsageType());
                auto.setFuelEfficiency(request.getFuelEfficiency());
                autoPolicyRepository.save(auto);
            }
            case HOME -> {
                HomePolicy home = homePolicyRepository
                        .findByPolicy_PolicyId(policy.getPolicyId())
                        .orElse(new HomePolicy());
                home.setPolicy(policy);
                home.setPropertyAddress(request.getPropertyAddress());
                home.setEnergyRating(request.getEnergyRating());
                home.setHasSolarPanels(request.getHasSolarPanels());
                home.setInsulationType(request.getInsulationType());
                home.setHeatingSystem(request.getHeatingSystem());
                home.setWaterConservationFeatures(request.getWaterConservationFeatures());
                homePolicyRepository.save(home);
            }
            case PROPERTY -> {
                PropertyPolicy prop = propertyPolicyRepository
                        .findByPolicy_PolicyId(policy.getPolicyId())
                        .orElse(new PropertyPolicy());
                prop.setPolicy(policy);
                prop.setPropertyAddress(request.getPropertyAddress());
                prop.setPropertyType(request.getPropertyType());
                prop.setCertifications(request.getCertifications());
                prop.setEnergySystems(request.getEnergySystems());
                prop.setWasteManagement(request.getWasteManagement());
                prop.setBuildingAge(request.getBuildingAge());
                propertyPolicyRepository.save(prop);
            }
        }
    }

    private Map<String, Object> extractAttributes(PolicyRequestDTO request) {
        Map<String, Object> attributes = new HashMap<>();
        switch (request.getPolicyType()) {
            case AUTO -> {
                attributes.put("vehicleType",    request.getVehicleType());
                attributes.put("annualMileage",  request.getAnnualMileage());
                attributes.put("usageType",      request.getUsageType());
                attributes.put("fuelEfficiency", request.getFuelEfficiency());
            }
            case HOME -> {
                attributes.put("energyRating",              request.getEnergyRating());
                attributes.put("hasSolarPanels",            request.getHasSolarPanels());
                attributes.put("insulationType",            request.getInsulationType());
                attributes.put("heatingSystem",             request.getHeatingSystem());
                attributes.put("waterConservationFeatures", request.getWaterConservationFeatures());
            }
            case PROPERTY -> {
                attributes.put("certifications",  request.getCertifications());
                attributes.put("energySystems",   request.getEnergySystems());
                attributes.put("wasteManagement", request.getWasteManagement());
                attributes.put("propertyAddress", request.getPropertyAddress());
            }
        }
        return attributes;
    }

    private Map<String, Object> convertBreakdownToMap(Map<String, ScoreComponent> breakdown) {
        Map<String, Object> result = new HashMap<>();
        breakdown.forEach((key, component) -> {
            Map<String, Object> componentMap = new HashMap<>();
            componentMap.put("points",      component.getPoints());
            componentMap.put("weight",      component.getWeight());
            componentMap.put("maxPoints",   component.getMaxPoints());
            componentMap.put("description", component.getDescription());
            result.put(key, componentMap);
        });
        return result;
    }

    private PolicyResponseDTO buildPolicyResponse(Policy policy,
                                                   EcoScore ecoScore,
                                                   PolicyRequestDTO request) {
        PolicyResponseDTO response = new PolicyResponseDTO();
        response.setPolicyId(policy.getPolicyId());
        response.setPolicyType(policy.getPolicyType());
        response.setCustomerName(policy.getCustomerName());
        response.setContactInfo(policy.getContactInfo());
        response.setCreatedDate(policy.getCreatedDate());
        response.setUpdatedDate(policy.getUpdatedDate());

        if (ecoScore != null) {
            response.setEcoScore(buildEcoScoreDTO(policy.getPolicyId(), ecoScore, policy.getPolicyType()));
        }

        // Set type-specific DTO from request
        switch (policy.getPolicyType()) {
            case AUTO -> {
                AutoPolicyDTO dto = new AutoPolicyDTO();
                dto.setVehicleId(request.getVehicleId());
                dto.setVehicleType(request.getVehicleType());
                dto.setAnnualMileage(request.getAnnualMileage());
                dto.setUsageType(request.getUsageType());
                dto.setFuelEfficiency(request.getFuelEfficiency());
                response.setAutoDetails(dto);
            }
            case HOME -> {
                HomePolicyDTO dto = new HomePolicyDTO();
                dto.setPropertyAddress(request.getPropertyAddress());
                dto.setEnergyRating(request.getEnergyRating());
                dto.setHasSolarPanels(request.getHasSolarPanels());
                dto.setInsulationType(request.getInsulationType());
                dto.setHeatingSystem(request.getHeatingSystem());
                dto.setWaterConservationFeatures(request.getWaterConservationFeatures());
                response.setHomeDetails(dto);
            }
            case PROPERTY -> {
                PropertyPolicyDTO dto = new PropertyPolicyDTO();
                dto.setPropertyAddress(request.getPropertyAddress());
                dto.setPropertyType(request.getPropertyType());
                dto.setCertifications(request.getCertifications());
                dto.setEnergySystems(request.getEnergySystems());
                dto.setWasteManagement(request.getWasteManagement());
                dto.setBuildingAge(request.getBuildingAge());
                response.setPropertyDetails(dto);
            }
        }
        return response;
    }

    private PolicyResponseDTO buildPolicyResponseFromEntity(Policy policy, EcoScore ecoScore) {
        PolicyResponseDTO response = new PolicyResponseDTO();
        response.setPolicyId(policy.getPolicyId());
        response.setPolicyType(policy.getPolicyType());
        response.setCustomerName(policy.getCustomerName());
        response.setContactInfo(policy.getContactInfo());
        response.setCreatedDate(policy.getCreatedDate());
        response.setUpdatedDate(policy.getUpdatedDate());

        if (ecoScore != null) {
            response.setEcoScore(buildEcoScoreDTO(policy.getPolicyId(), ecoScore, policy.getPolicyType()));
        }

        switch (policy.getPolicyType()) {
            case AUTO -> autoPolicyRepository.findByPolicy_PolicyId(policy.getPolicyId())
                    .ifPresent(auto -> {
                        AutoPolicyDTO dto = new AutoPolicyDTO();
                        dto.setVehicleId(auto.getVehicleId());
                        dto.setVehicleType(auto.getVehicleType());
                        dto.setAnnualMileage(auto.getAnnualMileage());
                        dto.setUsageType(auto.getUsageType());
                        dto.setFuelEfficiency(auto.getFuelEfficiency());
                        response.setAutoDetails(dto);
                    });
            case HOME -> homePolicyRepository.findByPolicy_PolicyId(policy.getPolicyId())
                    .ifPresent(home -> {
                        HomePolicyDTO dto = new HomePolicyDTO();
                        dto.setPropertyAddress(home.getPropertyAddress());
                        dto.setEnergyRating(home.getEnergyRating());
                        dto.setHasSolarPanels(home.getHasSolarPanels());
                        dto.setInsulationType(home.getInsulationType());
                        dto.setHeatingSystem(home.getHeatingSystem());
                        dto.setWaterConservationFeatures(home.getWaterConservationFeatures());
                        response.setHomeDetails(dto);
                    });
            case PROPERTY -> propertyPolicyRepository.findByPolicy_PolicyId(policy.getPolicyId())
                    .ifPresent(prop -> {
                        PropertyPolicyDTO dto = new PropertyPolicyDTO();
                        dto.setPropertyAddress(prop.getPropertyAddress());
                        dto.setPropertyType(prop.getPropertyType());
                        dto.setCertifications(prop.getCertifications());
                        dto.setEnergySystems(prop.getEnergySystems());
                        dto.setWasteManagement(prop.getWasteManagement());
                        dto.setBuildingAge(prop.getBuildingAge());
                        response.setPropertyDetails(dto);
                    });
        }
        return response;
    }

    private EcoScoreDTO buildEcoScoreDTO(String policyId, EcoScore ecoScore, PolicyType policyType) {
        EcoScoreDTO dto = new EcoScoreDTO();
        dto.setPolicyId(policyId);
        dto.setTotalScore(ecoScore.getTotalScore());
        dto.setPolicyType(policyType);
        dto.setCalculatedDate(ecoScore.getCalculatedDate());

        Map<String, ScoreComponentDTO> breakdownDTO = new HashMap<>();
        if (ecoScore.getScoreBreakdown() != null) {
            ecoScore.getScoreBreakdown().forEach((key, value) -> {
                if (value instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> componentMap = (Map<String, Object>) value;
                    int points    = ((Number) componentMap.getOrDefault("points",      0)).intValue();
                    int weight    = ((Number) componentMap.getOrDefault("weight",      0)).intValue();
                    int maxPoints = ((Number) componentMap.getOrDefault("maxPoints",   0)).intValue();
                    String desc   = String.valueOf(componentMap.getOrDefault("description", ""));
                    breakdownDTO.put(key, new ScoreComponentDTO(points, weight, maxPoints, desc));
                }
            });
        }
        dto.setScoreBreakdown(breakdownDTO);
        return dto;
    }
}
