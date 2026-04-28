package com.ecowire.ecowire.scoring.algorithm;

import com.ecowire.ecowire.enums.*;
import com.ecowire.ecowire.scoring.EcoScoreResult;
import com.ecowire.ecowire.scoring.ScoreComponent;
import com.ecowire.ecowire.scoring.ScoringAlgorithm;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class PropertyScoringAlgorithm implements ScoringAlgorithm {

    private static final int CERTIFICATION_WEIGHT    = 40;
    private static final int ENERGY_SYSTEM_WEIGHT    = 30;
    private static final int WASTE_MANAGEMENT_WEIGHT = 15;
    private static final int LOCATION_WEIGHT         = 15;

    @Override
    public EcoScoreResult calculate(Map<String, Object> attributes) {
        String         certifications  = (String)         attributes.get("certifications");
        EnergySystem   energySystem    = (EnergySystem)   attributes.get("energySystems");
        WasteManagement wasteManagement = (WasteManagement) attributes.get("wasteManagement");
        String         propertyAddress = (String)         attributes.get("propertyAddress");

        int certScore     = calculateCertificationScore(certifications);
        int energyScore   = calculateEnergySystemScore(energySystem);
        int wasteScore    = calculateWasteManagementScore(wasteManagement);
        int locationScore = calculateLocationScore(propertyAddress);

        int certPoints     = (certScore     * CERTIFICATION_WEIGHT)    / 100;
        int energyPoints   = (energyScore   * ENERGY_SYSTEM_WEIGHT)    / 100;
        int wastePoints    = (wasteScore    * WASTE_MANAGEMENT_WEIGHT) / 100;
        int locationPoints = (locationScore * LOCATION_WEIGHT)         / 100;

        int totalScore = certPoints + energyPoints + wastePoints + locationPoints;

        Map<String, ScoreComponent> breakdown = new HashMap<>();
        breakdown.put("certifications",  new ScoreComponent(certPoints,     CERTIFICATION_WEIGHT,    40, certifications != null ? certifications : "None"));
        breakdown.put("energySystems",   new ScoreComponent(energyPoints,   ENERGY_SYSTEM_WEIGHT,    30, energySystem.name()));
        breakdown.put("wasteManagement", new ScoreComponent(wastePoints,    WASTE_MANAGEMENT_WEIGHT, 15, wasteManagement.name()));
        breakdown.put("location",        new ScoreComponent(locationPoints, LOCATION_WEIGHT,         15, "Location factor"));

        return new EcoScoreResult(totalScore, breakdown, PolicyType.PROPERTY);
    }

    private int calculateCertificationScore(String certifications) {
        if (certifications == null || certifications.trim().isEmpty()) return 0;
        String lower = certifications.toLowerCase();
        if (lower.contains("leed platinum") || lower.contains("breeam outstanding")) return 100;
        if (lower.contains("leed gold")     || lower.contains("breeam excellent"))   return 85;
        if (lower.contains("leed silver")   || lower.contains("breeam very good"))   return 70;
        if (lower.contains("leed")          || lower.contains("breeam"))             return 50;
        return 0;
    }

    private int calculateEnergySystemScore(EnergySystem system) {
        switch (system) {
            case GEOTHERMAL: return 100;
            case SOLAR:      return 90;
            case WIND:       return 85;
            case HYBRID:     return 75;
            case GRID:       return 30;
            default:         return 0;
        }
    }

    private int calculateWasteManagementScore(WasteManagement waste) {
        switch (waste) {
            case ZERO_WASTE:          return 100;
            case COMPOSTING:          return 80;
            case ADVANCED_RECYCLING:  return 65;
            case BASIC_RECYCLING:     return 40;
            case NONE:                return 0;
            default:                  return 0;
        }
    }

    private int calculateLocationScore(String address) {
        // Simplified for MVP — returns a default moderate score
        return 60;
    }
}
