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
        FuelEfficiency efficiency  = (FuelEfficiency)  attributes.get("fuelEfficiency");

        // Major improvements for suboptimal attributes
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

        // Next-level improvements for mid-tier attributes
        if (vehicleType == VehicleType.HYBRID) {
            recs.add(new RecommendationDTO(
                    "Upgrade from Hybrid to a fully Electric vehicle for maximum eco score",
                    "8-12 points", 3, "Vehicle Type"));
        }

        if (mileage == AnnualMileage.MEDIUM) {
            recs.add(new RecommendationDTO(
                    "Reduce annual mileage below 10,000 km through remote work or public transit",
                    "5-10 points", 3, "Mileage"));
        }

        if (usage == UsageType.BUSINESS) {
            recs.add(new RecommendationDTO(
                    "Offset business travel emissions through a verified carbon offset program",
                    "3-6 points", 4, "Usage Type"));
        }

        if (efficiency == FuelEfficiency.MEDIUM) {
            recs.add(new RecommendationDTO(
                    "Improve fuel efficiency through regular maintenance and eco-driving techniques",
                    "2-4 points", 4, "Fuel Efficiency"));
        }

        return recs;
    }

    // ─── HOME ────────────────────────────────────────────────────────────────

    private List<RecommendationDTO> generateHomeRecommendations(Map<String, Object> attributes) {
        List<RecommendationDTO> recs = new ArrayList<>();

        EnergyRating   energyRating   = (EnergyRating)   attributes.get("energyRating");
        Boolean        hasSolarPanels = (Boolean)         attributes.get("hasSolarPanels");
        InsulationType insulationType = (InsulationType)  attributes.get("insulationType");
        HeatingSystem  heatingSystem  = (HeatingSystem)   attributes.get("heatingSystem");
        String         waterFeatures  = (String)          attributes.get("waterConservationFeatures");

        // Major improvements for suboptimal attributes
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

        // Next-level improvements for mid-tier attributes
        if (energyRating != null &&
                (energyRating == EnergyRating.B || energyRating == EnergyRating.C)) {
            recs.add(new RecommendationDTO(
                    "Upgrade to energy rating A through improved appliances and building envelope",
                    "5-10 points", 3, "Energy Rating"));
        }

        if (insulationType == InsulationType.STANDARD) {
            recs.add(new RecommendationDTO(
                    "Upgrade insulation from Standard to Advanced for better thermal performance",
                    "4-6 points", 3, "Insulation"));
        }

        if (heatingSystem == HeatingSystem.ELECTRIC) {
            recs.add(new RecommendationDTO(
                    "Consider upgrading to a heat pump or geothermal system for higher efficiency",
                    "2-4 points", 4, "Heating System"));
        }

        if (heatingSystem == HeatingSystem.HEAT_PUMP) {
            recs.add(new RecommendationDTO(
                    "Consider upgrading to a geothermal heating system for maximum efficiency",
                    "1-2 points", 5, "Heating System"));
        }

        if (waterFeatures == null || waterFeatures.trim().isEmpty()) {
            recs.add(new RecommendationDTO(
                    "Add water conservation features such as rainwater harvesting or low-flow fixtures",
                    "5-10 points", 3, "Water Conservation"));
        }

        return recs;
    }

    // ─── PROPERTY ────────────────────────────────────────────────────────────

    private List<RecommendationDTO> generatePropertyRecommendations(Map<String, Object> attributes) {
        List<RecommendationDTO> recs = new ArrayList<>();

        String          certifications  = (String)          attributes.get("certifications");
        WasteManagement wasteManagement = (WasteManagement) attributes.get("wasteManagement");
        EnergySystem    energySystem    = (EnergySystem)    attributes.get("energySystems");

        // Major improvements for suboptimal attributes
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

        // Next-level improvements for mid-tier attributes
        if (certifications != null && !certifications.trim().isEmpty()) {
            String lowerCerts = certifications.toLowerCase();
            if (!lowerCerts.contains("platinum") && !lowerCerts.contains("outstanding")) {
                recs.add(new RecommendationDTO(
                        "Upgrade to LEED Platinum or BREEAM Outstanding certification for the highest sustainability tier",
                        "5-15 points", 3, "Certifications"));
            }
        }

        if (wasteManagement == WasteManagement.ADVANCED_RECYCLING ||
                wasteManagement == WasteManagement.COMPOSTING) {
            recs.add(new RecommendationDTO(
                    "Transition to a zero-waste program to eliminate landfill contributions",
                    "2-5 points", 4, "Waste Management"));
        }

        if (energySystem == EnergySystem.HYBRID) {
            recs.add(new RecommendationDTO(
                    "Transition fully to renewable energy (solar, wind, or geothermal) to eliminate grid dependency",
                    "4-8 points", 3, "Energy Systems"));
        }

        if (energySystem == EnergySystem.SOLAR || energySystem == EnergySystem.WIND) {
            recs.add(new RecommendationDTO(
                    "Consider adding geothermal energy to complement your existing renewable setup",
                    "1-3 points", 5, "Energy Systems"));
        }

        return recs;
    }
}
