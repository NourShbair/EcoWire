package com.ecowire.ecowire.dto;

import com.ecowire.ecowire.enums.*;
import lombok.Data;

@Data
public class AutoPolicyDTO {
    private String vehicleId;
    private VehicleType vehicleType;
    private AnnualMileage annualMileage;
    private UsageType usageType;
    private FuelEfficiency fuelEfficiency;
}