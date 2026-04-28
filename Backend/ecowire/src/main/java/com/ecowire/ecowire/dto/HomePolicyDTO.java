package com.ecowire.ecowire.dto;

import com.ecowire.ecowire.enums.*;
import lombok.Data;

@Data
public class HomePolicyDTO {
    private String propertyAddress;
    private EnergyRating energyRating;
    private Boolean hasSolarPanels;
    private InsulationType insulationType;
    private HeatingSystem heatingSystem;
    private String waterConservationFeatures;
}