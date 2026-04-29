package com.ecowire.ecowire.service.impl;

import com.ecowire.ecowire.dto.RecommendationDTO;
import com.ecowire.ecowire.enums.*;
import com.ecowire.ecowire.service.RecommendationEngine;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class RecommendationEngineImpl implements RecommendationEngine {

    @Override
    public List<RecommendationDTO> generateRecommendations(
            PolicyType policyType,
            int ecoScore,
            Map<String, Object> attributes) {

        List<RecommendationDTO> recommendations = new ArrayList<>();

        switch (policyType) {
            case AUTO:
                recommendations.addAll(generateAutoRecommendations(attributes));
                break;
            case HOME:
                recommendations.addAll(generateHomeRecommendations(attributes));
                break;
            case PROPERTY:
                recommendations.addAll(generatePropertyRecommendations(attributes));
                break;
        }

        // Sort by priority ascending (1 = highest priority)
        recommendations.sort(Comparator.comparingInt(RecommendationDTO::getPriority));

        return recommendations;
    }

    // ─── AUTO ────────────────────────────────────────────────────────────────

    private List<RecommendationDTO> generateAutoRecommendations(Map<String, Object> attributes) {
        List<RecommendationDTO> recs = new ArrayList<>();

        VehicleType   vehicleType  = (VehicleType)   attributes.get("vehicleType");
        AnnualMileage mileage      = (AnnualMileage)  attributes.get("annualMileage");
        UsageType     usage        = (UsageType)      attributes.get("usageType");

        if (vehicleType == VehicleType.PETROL || vehicleType == VehicleType.DIESEL) {
            recs.add(new RecommendationDTO(
                    "Consider switching to a Hybrid or Electric vehicle",
                    "15-30 points", 1, "Vehicle Type"));
        }

        if (mileage == AnnualMileage.HIGH) {
            recs.add(new RecommendationDTO(
                    "Reduce annual mileage through route optimization or carpooling",
                    "10-15 points", 2, "Mileage"));
        }

        if (usage == UsageType.COMMERCIAL) {
            recs.add(new RecommendationDTO(
                    "Consider fleet electrification for commercial vehicles",
                    "20-35 points", 1, "Usage Type"));
        }

        return recs;
    }

    // ─── HOME ────────────────────────────────────────────────────────────────

    private List<RecommendationDTO> generateHomeRecommendations(Map<String, Object> attributes) {
        List<RecommendationDTO> recs = new ArrayList<>();

        EnergyRating   energyRating   = (EnergyRating)   attributes.get("energyRating");
        Boolean        hasSolarPanels = (Boolean)         attributes.get("hasSolarPanels");
        InsulationType insulationType = (InsulationType)  attributes.get("insulationType");

        if (energyRating != null &&
                (energyRating == EnergyRating.D || energyRating == EnergyRating.E ||
                        energyRating == EnergyRating.F || energyRating == EnergyRating.G)) {
            recs.add(new RecommendationDTO(
                    "Improve home energy efficiency to reach at least a C rating",
                    "10-20 points", 1, "Energy Rating"));
        }

        if (hasSolarPanels == null || !hasSolarPanels) {
            recs.add(new RecommendationDTO(
                    "Install solar panels or other renewable energy systems",
                    "15-25 points", 1, "Renewable Energy"));
        }

        if (insulationType == InsulationType.NONE || insulationType == InsulationType.BASIC) {
            recs.add(new RecommendationDTO(
                    "Upgrade home insulation to Standard or Advanced level",
                    "8-14 points", 2, "Insulation"));
        }

        return recs;
    }

    // ─── PROPERTY ────────────────────────────────────────────────────────────

    private List<RecommendationDTO> generatePropertyRecommendations(Map<String, Object> attributes) {
        List<RecommendationDTO> recs = new ArrayList<>();

        String          certifications  = (String)          attributes.get("certifications");
        WasteManagement wasteManagement = (WasteManagement) attributes.get("wasteManagement");

        if (certifications == null || certifications.trim().isEmpty()) {
            recs.add(new RecommendationDTO(
                    "Pursue LEED or BREEAM certification to improve sustainability credentials",
                    "20-40 points", 1, "Certifications"));
        }

        if (wasteManagement == WasteManagement.NONE ||
                wasteManagement == WasteManagement.BASIC_RECYCLING) {
            recs.add(new RecommendationDTO(
                    "Implement advanced waste management systems such as composting or zero-waste programs",
                    "5-10 points", 2, "Waste Management"));
        }

        return recs;
    }
}
