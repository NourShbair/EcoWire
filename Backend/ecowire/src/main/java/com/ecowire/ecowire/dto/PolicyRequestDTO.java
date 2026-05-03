package com.ecowire.ecowire.dto;

import com.ecowire.ecowire.enums.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PolicyRequestDTO {

    @NotNull(message = "Policy type is required")
    private PolicyType policyType;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Contact information is required")
    @Email(message = "Contact information must be a valid email address")
    private String contactInfo;

    // Optional: link policy to a CUSTOMER user
    private String customerId;

    // AUTO fields
    private String vehicleId;
    private VehicleType vehicleType;
    private AnnualMileage annualMileage;
    private UsageType usageType;
    private FuelEfficiency fuelEfficiency;

    // HOME fields
    private String propertyAddress;
    private EnergyRating energyRating;
    private Boolean hasSolarPanels;
    private InsulationType insulationType;
    private HeatingSystem heatingSystem;
    private String waterConservationFeatures;

    // PROPERTY fields
    private PropertyType propertyType;
    private String certifications;
    private EnergySystem energySystems;
    private WasteManagement wasteManagement;
    private Integer buildingAge;
}