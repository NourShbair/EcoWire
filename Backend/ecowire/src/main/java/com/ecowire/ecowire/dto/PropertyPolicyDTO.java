package com.ecowire.ecowire.dto;

import com.ecowire.ecowire.enums.*;
import lombok.Data;

@Data
public class PropertyPolicyDTO {
    private String propertyAddress;
    private PropertyType propertyType;
    private String certifications;
    private EnergySystem energySystems;
    private WasteManagement wasteManagement;
    private Integer buildingAge;
}