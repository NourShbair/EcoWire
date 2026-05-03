package com.ecowire.ecowire.controller;

import com.ecowire.ecowire.dto.EcoScoreDTO;
import com.ecowire.ecowire.dto.PolicyResponseDTO;
import com.ecowire.ecowire.enums.PolicyType;
import com.ecowire.ecowire.security.RequestContext;
import com.ecowire.ecowire.service.EcoScoringEngine;
import com.ecowire.ecowire.service.PolicyService;
import com.ecowire.ecowire.scoring.EcoScoreResult;
import com.ecowire.ecowire.dto.ScoreComponentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class EcoScoreController {

    @Autowired
    private PolicyService policyService;

    @Autowired
    private EcoScoringEngine scoringEngine;

    @GetMapping("/policies/{id}/ecoscore")
    public ResponseEntity<EcoScoreDTO> getEcoScore(
            @PathVariable String id) {
        RequestContext ctx = RequestContext.current();
        PolicyResponseDTO policy = policyService.getPolicy(id, ctx);
        return ResponseEntity.ok(policy.getEcoScore());
    }

    @GetMapping("/ecoscore/calculate")
    public ResponseEntity<EcoScoreDTO> calculateScore(
            @RequestParam PolicyType policyType,
            @RequestParam Map<String, String> allParams) {

        // Remove policyType from params map
        allParams.remove("policyType");

        // Convert string params to typed attributes
        Map<String, Object> attributes = convertParams(policyType, allParams);

        // Calculate score without persisting
        EcoScoreResult result = scoringEngine.calculateScore(policyType, attributes);

        // Build response DTO
        EcoScoreDTO dto = new EcoScoreDTO();
        dto.setTotalScore(result.getTotalScore());
        dto.setPolicyType(policyType);
        dto.setCalculatedDate(LocalDateTime.now());

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

        return ResponseEntity.ok(dto);
    }

    private Map<String, Object> convertParams(PolicyType policyType,
                                              Map<String, String> params) {
        Map<String, Object> attributes = new HashMap<>();

        switch (policyType) {
            case AUTO:
                if (params.containsKey("vehicleType"))
                    attributes.put("vehicleType",
                            com.ecowire.ecowire.enums.VehicleType.valueOf(params.get("vehicleType")));
                if (params.containsKey("annualMileage"))
                    attributes.put("annualMileage",
                            com.ecowire.ecowire.enums.AnnualMileage.valueOf(params.get("annualMileage")));
                if (params.containsKey("usageType"))
                    attributes.put("usageType",
                            com.ecowire.ecowire.enums.UsageType.valueOf(params.get("usageType")));
                if (params.containsKey("fuelEfficiency"))
                    attributes.put("fuelEfficiency",
                            com.ecowire.ecowire.enums.FuelEfficiency.valueOf(params.get("fuelEfficiency")));
                break;
            case HOME:
                if (params.containsKey("energyRating"))
                    attributes.put("energyRating",
                            com.ecowire.ecowire.enums.EnergyRating.valueOf(params.get("energyRating")));
                if (params.containsKey("hasSolarPanels"))
                    attributes.put("hasSolarPanels",
                            Boolean.valueOf(params.get("hasSolarPanels")));
                if (params.containsKey("insulationType"))
                    attributes.put("insulationType",
                            com.ecowire.ecowire.enums.InsulationType.valueOf(params.get("insulationType")));
                if (params.containsKey("heatingSystem"))
                    attributes.put("heatingSystem",
                            com.ecowire.ecowire.enums.HeatingSystem.valueOf(params.get("heatingSystem")));
                if (params.containsKey("waterConservationFeatures"))
                    attributes.put("waterConservationFeatures",
                            params.get("waterConservationFeatures"));
                break;
            case PROPERTY:
                if (params.containsKey("certifications"))
                    attributes.put("certifications", params.get("certifications"));
                if (params.containsKey("energySystems"))
                    attributes.put("energySystems",
                            com.ecowire.ecowire.enums.EnergySystem.valueOf(params.get("energySystems")));
                if (params.containsKey("wasteManagement"))
                    attributes.put("wasteManagement",
                            com.ecowire.ecowire.enums.WasteManagement.valueOf(params.get("wasteManagement")));
                if (params.containsKey("propertyAddress"))
                    attributes.put("propertyAddress", params.get("propertyAddress"));
                break;
        }

        return attributes;
    }
}
