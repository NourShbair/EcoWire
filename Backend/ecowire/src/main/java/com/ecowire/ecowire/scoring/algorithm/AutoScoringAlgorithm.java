package com.ecowire.ecowire.scoring.algorithm;

import com.ecowire.ecowire.enums.*;
import com.ecowire.ecowire.scoring.EcoScoreResult;
import com.ecowire.ecowire.scoring.ScoreComponent;
import com.ecowire.ecowire.scoring.ScoringAlgorithm;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class AutoScoringAlgorithm implements ScoringAlgorithm {

    private static final int VEHICLE_TYPE_WEIGHT = 40;
    private static final int ANNUAL_MILEAGE_WEIGHT = 30;
    private static final int USAGE_TYPE_WEIGHT = 20;
    private static final int FUEL_EFFICIENCY_WEIGHT = 10;

    @Override
    public EcoScoreResult calculate(Map<String, Object> attributes) {
        VehicleType vehicleType = (VehicleType) attributes.get("vehicleType");
        AnnualMileage annualMileage = (AnnualMileage) attributes.get("annualMileage");
        UsageType usageType = (UsageType) attributes.get("usageType");
        FuelEfficiency fuelEfficiency = (FuelEfficiency) attributes.get("fuelEfficiency");

        int vehicleTypeScore   = calculateVehicleTypeScore(vehicleType);
        int mileageScore       = calculateMileageScore(annualMileage);
        int usageScore         = calculateUsageScore(usageType);
        int efficiencyScore    = calculateFuelEfficiencyScore(fuelEfficiency);

        int vehicleTypePoints  = (vehicleTypeScore  * VEHICLE_TYPE_WEIGHT)    / 100;
        int mileagePoints      = (mileageScore      * ANNUAL_MILEAGE_WEIGHT)  / 100;
        int usagePoints        = (usageScore        * USAGE_TYPE_WEIGHT)      / 100;
        int efficiencyPoints   = (efficiencyScore   * FUEL_EFFICIENCY_WEIGHT) / 100;

        int totalScore = vehicleTypePoints + mileagePoints + usagePoints + efficiencyPoints;

        Map<String, ScoreComponent> breakdown = new HashMap<>();
        breakdown.put("vehicleType",    new ScoreComponent(vehicleTypePoints,  VEHICLE_TYPE_WEIGHT,    40, vehicleType.name()));
        breakdown.put("annualMileage",  new ScoreComponent(mileagePoints,      ANNUAL_MILEAGE_WEIGHT,  30, annualMileage.name()));
        breakdown.put("usageType",      new ScoreComponent(usagePoints,        USAGE_TYPE_WEIGHT,      20, usageType.name()));
        breakdown.put("fuelEfficiency", new ScoreComponent(efficiencyPoints,   FUEL_EFFICIENCY_WEIGHT, 10, fuelEfficiency.name()));

        return new EcoScoreResult(totalScore, breakdown, PolicyType.AUTO);
    }

    private int calculateVehicleTypeScore(VehicleType vehicleType) {
        switch (vehicleType) {
            case ELECTRIC: return 100;
            case HYBRID:   return 70;
            case DIESEL:   return 40;
            case PETROL:   return 30;
            default:       return 0;
        }
    }

    private int calculateMileageScore(AnnualMileage mileage) {
        switch (mileage) {
            case LOW:    return 100;
            case MEDIUM: return 60;
            case HIGH:   return 20;
            default:     return 0;
        }
    }

    private int calculateUsageScore(UsageType usage) {
        switch (usage) {
            case PERSONAL:   return 100;
            case BUSINESS:   return 60;
            case COMMERCIAL: return 30;
            default:         return 0;
        }
    }

    private int calculateFuelEfficiencyScore(FuelEfficiency efficiency) {
        switch (efficiency) {
            case HIGH:   return 100;
            case MEDIUM: return 60;
            case LOW:    return 30;
            default:     return 0;
        }
    }
}
