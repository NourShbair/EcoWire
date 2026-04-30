package com.ecowire.ecowire.scoring.algorithm;
import com.ecowire.ecowire.enums.*;
import com.ecowire.ecowire.scoring.EcoScoreResult;
import com.ecowire.ecowire.scoring.ScoreComponent;
import com.ecowire.ecowire.scoring.ScoringAlgorithm;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class HomeScoringAlgorithm implements ScoringAlgorithm {

    private static final int ENERGY_RATING_WEIGHT      = 35;
    private static final int RENEWABLE_ENERGY_WEIGHT   = 25;
    private static final int INSULATION_WEIGHT         = 20;
    private static final int HEATING_SYSTEM_WEIGHT     = 10;
    private static final int WATER_CONSERVATION_WEIGHT = 10;

    @Override
    public EcoScoreResult calculate(Map<String, Object> attributes) {
        EnergyRating  energyRating   = (EnergyRating)  attributes.get("energyRating");
        Boolean       hasSolarPanels = (Boolean)        attributes.get("hasSolarPanels");
        InsulationType insulationType = (InsulationType) attributes.get("insulationType");
        HeatingSystem heatingSystem  = (HeatingSystem)  attributes.get("heatingSystem");
        String        waterFeatures  = (String)         attributes.get("waterConservationFeatures");

        int energyScore    = calculateEnergyRatingScore(energyRating);
        int renewableScore = calculateRenewableEnergyScore(hasSolarPanels);
        int insulationScore = calculateInsulationScore(insulationType);
        int heatingScore   = calculateHeatingScore(heatingSystem);
        int waterScore     = calculateWaterConservationScore(waterFeatures);

        int energyPoints    = (energyScore    * ENERGY_RATING_WEIGHT)      / 100;
        int renewablePoints = (renewableScore * RENEWABLE_ENERGY_WEIGHT)   / 100;
        int insulationPoints = (insulationScore * INSULATION_WEIGHT)       / 100;
        int heatingPoints   = (heatingScore   * HEATING_SYSTEM_WEIGHT)     / 100;
        int waterPoints     = (waterScore     * WATER_CONSERVATION_WEIGHT) / 100;

        int totalScore = energyPoints + renewablePoints + insulationPoints
                + heatingPoints + waterPoints;

        Map<String, ScoreComponent> breakdown = new HashMap<>();
        breakdown.put("energyRating",    new ScoreComponent(energyPoints,    ENERGY_RATING_WEIGHT,      35, energyRating.name()));
        breakdown.put("renewableEnergy", new ScoreComponent(renewablePoints, RENEWABLE_ENERGY_WEIGHT,   25, hasSolarPanels ? "Solar panels installed" : "No renewable energy"));
        breakdown.put("insulationType",  new ScoreComponent(insulationPoints, INSULATION_WEIGHT,        20, insulationType.name()));
        breakdown.put("heatingSystem",   new ScoreComponent(heatingPoints,   HEATING_SYSTEM_WEIGHT,     10, heatingSystem.name()));
        breakdown.put("waterConservation", new ScoreComponent(waterPoints,   WATER_CONSERVATION_WEIGHT, 10, waterFeatures != null ? waterFeatures : "None"));

        return new EcoScoreResult(totalScore, breakdown, PolicyType.HOME);
    }

    private int calculateEnergyRatingScore(EnergyRating rating) {
        switch (rating) {
            case A: return 100;
            case B: return 85;
            case C: return 70;
            case D: return 50;
            case E: return 35;
            case F: return 20;
            case G: return 10;
            default: return 0;
        }
    }

    private int calculateRenewableEnergyScore(Boolean hasSolarPanels) {
        return (hasSolarPanels != null && hasSolarPanels) ? 100 : 0;
    }

    private int calculateInsulationScore(InsulationType type) {
        switch (type) {
            case ADVANCED: return 100;
            case STANDARD: return 70;
            case BASIC:    return 40;
            case NONE:     return 0;
            default:       return 0;
        }
    }

    private int calculateHeatingScore(HeatingSystem system) {
        switch (system) {
            case GEOTHERMAL: return 100;
            case HEAT_PUMP:  return 85;
            case ELECTRIC:   return 60;
            case GAS:        return 40;
            case OIL:        return 20;
            default:         return 0;
        }
    }

    private int calculateWaterConservationScore(String features) {
        if (features == null || features.trim().isEmpty()) return 0;
        int score = 0;
        String lower = features.toLowerCase();
        if (lower.contains("rainwater"))                              score += 40;
        if (lower.contains("low-flow") || lower.contains("low flow")) score += 30;
        if (lower.contains("greywater") || lower.contains("grey water")) score += 30;
        return Math.min(score, 100);
    }
}
