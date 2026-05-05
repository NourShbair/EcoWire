package com.ecowire.ecowire.service.impl;

import com.ecowire.ecowire.dto.*;
import com.ecowire.ecowire.entity.*;
import com.ecowire.ecowire.enums.PolicyType;
import com.ecowire.ecowire.enums.UserRole;
import com.ecowire.ecowire.exception.ForbiddenPolicyAccessException;
import com.ecowire.ecowire.exception.InvalidPolicyTypeException;
import com.ecowire.ecowire.exception.PolicyNotFoundException;
import com.ecowire.ecowire.repository.*;
import com.ecowire.ecowire.scoring.EcoScoreResult;
import com.ecowire.ecowire.scoring.ScoreComponent;
import com.ecowire.ecowire.security.RequestContext;
import com.ecowire.ecowire.service.EcoScoringEngine;
import com.ecowire.ecowire.service.PolicyService;
import com.ecowire.ecowire.service.RecommendationEngine;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class PolicyServiceImpl implements PolicyService {

    private static final Logger logger = LoggerFactory.getLogger(PolicyServiceImpl.class);

    @Autowired private PolicyRepository         policyRepository;
    @Autowired private AutoPolicyRepository     autoPolicyRepository;
    @Autowired private HomePolicyRepository     homePolicyRepository;
    @Autowired private PropertyPolicyRepository propertyPolicyRepository;
    @Autowired private EcoScoreRepository       ecoScoreRepository;
    @Autowired private UserRepository           userRepository;
    @Autowired private EcoScoringEngine         scoringEngine;
    @Autowired private RecommendationEngine     recommendationEngine;

    @PersistenceContext
    private EntityManager entityManager;

    // ─── CREATE ──────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public PolicyResponseDTO createPolicy(PolicyRequestDTO request, RequestContext ctx) {
        logger.info("Creating policy of type: {}", request.getPolicyType());

        // 1. Save base policy and flush to DB immediately so timestamps are generated
        Policy policy = new Policy();
        policy.setCustomerName(request.getCustomerName());
        policy.setContactInfo(request.getContactInfo());
        policy.setPolicyType(request.getPolicyType());

        // organizationId and createdById always come from the JWT, never from the request body
        policy.setOrganizationId(ctx.isOrgScoped() ? ctx.getOrganizationId() : null);
        policy.setCreatedById(ctx.getUserId());

        // Validate and set customerId if provided
        if (request.getCustomerId() != null) {
            User customer = userRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "User " + request.getCustomerId() + " is not a CUSTOMER"));
            if (customer.getRole() != UserRole.CUSTOMER) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "User " + request.getCustomerId() + " is not a CUSTOMER");
            }
            policy.setCustomerId(request.getCustomerId());
        }

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
    public PolicyResponseDTO getPolicy(String policyId, RequestContext ctx) {
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new PolicyNotFoundException(policyId));

        // Org-scoped: deny access if policy belongs to a different org
        if (ctx.isOrgScoped()) {
            if (!Objects.equals(policy.getOrganizationId(), ctx.getOrganizationId())) {
                throw new PolicyNotFoundException(policyId);
            }
        }

        // Customer: deny access if policy belongs to a different customer
        if (ctx.isCustomer()) {
            if (!Objects.equals(policy.getCustomerId(), ctx.getUserId())) {
                throw new PolicyNotFoundException(policyId);
            }
        }

        // ADMIN: no check

        EcoScore ecoScore = ecoScoreRepository
                .findTopByPolicy_PolicyIdOrderByCalculatedDateDesc(policyId)
                .orElse(null);

        return buildPolicyResponseFromEntity(policy, ecoScore);
    }

    // ─── GET ALL ─────────────────────────────────────────────────────────────

    @Override
    public List<PolicyResponseDTO> getAllPolicies(RequestContext ctx) {
        List<Policy> policies;

        logger.debug("getAllPolicies called — role={}, orgId={}, userId={}, isAdmin={}, isOrgScoped={}, isCustomer={}",
                ctx.getRole(), ctx.getOrganizationId(), ctx.getUserId(),
                ctx.isAdmin(), ctx.isOrgScoped(), ctx.isCustomer());

        if (ctx.isAdmin()) {
            policies = policyRepository.findAll();
        } else if (ctx.isOrgScoped()) {
            policies = policyRepository.findByOrganizationId(ctx.getOrganizationId());
        } else {
            // CUSTOMER
            policies = policyRepository.findByCustomerId(ctx.getUserId());
        }

        logger.debug("getAllPolicies returning {} policies", policies.size());

        return policies.stream()
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
    public PolicyResponseDTO updatePolicy(String policyId, PolicyRequestDTO request, RequestContext ctx) {
        logger.info("Updating policy with ID: {}", policyId);

        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new PolicyNotFoundException(policyId));

        // CUSTOMER cannot modify policies
        if (ctx.isCustomer()) {
            throw new ForbiddenPolicyAccessException(
                    "Access denied: CUSTOMER role cannot modify policies");
        }

        // Org-scoped: deny if policy belongs to a different org
        if (ctx.isOrgScoped()) {
            if (!Objects.equals(policy.getOrganizationId(), ctx.getOrganizationId())) {
                throw new ForbiddenPolicyAccessException(
                        "Access denied: policy belongs to a different organization");
            }
        }

        // ADMIN: no check

        // Prevent policyType change
        if (request.getPolicyType() != null &&
                !request.getPolicyType().equals(policy.getPolicyType())) {
            throw new InvalidPolicyTypeException(
                    "Policy type cannot be changed. Existing type: " + policy.getPolicyType(),
                    true);
        }

        // Update base fields — do NOT overwrite organizationId or createdById
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
        return buildPolicyResponse(policy, ecoScore, request);
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void deletePolicy(String policyId, RequestContext ctx) {
        logger.info("Deleting policy with ID: {}", policyId);

        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new PolicyNotFoundException(policyId));

        // CUSTOMER cannot delete policies
        if (ctx.isCustomer()) {
            throw new ForbiddenPolicyAccessException(
                    "Access denied: CUSTOMER role cannot modify policies");
        }

        // Org-scoped: deny if policy belongs to a different org
        if (ctx.isOrgScoped()) {
            if (!Objects.equals(policy.getOrganizationId(), ctx.getOrganizationId())) {
                throw new ForbiddenPolicyAccessException(
                        "Access denied: policy belongs to a different organization");
            }
        }

        // ADMIN: no check

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
        response.setOrganizationId(policy.getOrganizationId());
        response.setCustomerId(policy.getCustomerId());
        response.setCreatedById(policy.getCreatedById());

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
        response.setOrganizationId(policy.getOrganizationId());
        response.setCustomerId(policy.getCustomerId());
        response.setCreatedById(policy.getCreatedById());

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
            // Weight lookup for legacy seed data that stores flat numbers instead of nested objects
            Map<String, int[]> weightLookup = getWeightLookup(policyType);

            ecoScore.getScoreBreakdown().forEach((key, value) -> {
                if (value instanceof Map) {
                    // Full nested format: {"points":28,"weight":40,"maxPoints":40,"description":"HYBRID"}
                    @SuppressWarnings("unchecked")
                    Map<String, Object> componentMap = (Map<String, Object>) value;
                    int points    = ((Number) componentMap.getOrDefault("points",      0)).intValue();
                    int weight    = ((Number) componentMap.getOrDefault("weight",      0)).intValue();
                    int maxPoints = ((Number) componentMap.getOrDefault("maxPoints",   0)).intValue();
                    String desc   = String.valueOf(componentMap.getOrDefault("description", ""));
                    breakdownDTO.put(key, new ScoreComponentDTO(points, weight, maxPoints, desc));
                } else if (value instanceof Number) {
                    // Legacy flat format: {"vehicleType":30} — just the points as a plain number
                    int points = ((Number) value).intValue();
                    int[] weightAndMax = weightLookup.getOrDefault(key, new int[]{0, 0});
                    breakdownDTO.put(key, new ScoreComponentDTO(points, weightAndMax[0], weightAndMax[1], ""));
                }
            });
        }
        dto.setScoreBreakdown(breakdownDTO);
        return dto;
    }

    /**
     * Returns a map of component key → [weight, maxPoints] for legacy seed data
     * that only stores flat point values without weight/maxPoints metadata.
     */
    private Map<String, int[]> getWeightLookup(PolicyType policyType) {
        Map<String, int[]> lookup = new HashMap<>();
        switch (policyType) {
            case AUTO -> {
                lookup.put("vehicleType",    new int[]{40, 40});
                lookup.put("annualMileage",  new int[]{30, 30});
                lookup.put("usageType",      new int[]{20, 20});
                lookup.put("fuelEfficiency", new int[]{10, 10});
            }
            case HOME -> {
                lookup.put("energyRating",      new int[]{35, 35});
                lookup.put("renewableEnergy",   new int[]{25, 25});
                lookup.put("insulationType",    new int[]{20, 20});
                lookup.put("heatingSystem",     new int[]{10, 10});
                lookup.put("waterConservation", new int[]{10, 10});
            }
            case PROPERTY -> {
                lookup.put("certifications",  new int[]{40, 40});
                lookup.put("energySystems",   new int[]{30, 30});
                lookup.put("wasteManagement", new int[]{15, 15});
                lookup.put("location",        new int[]{15, 15});
            }
        }
        return lookup;
    }
}
