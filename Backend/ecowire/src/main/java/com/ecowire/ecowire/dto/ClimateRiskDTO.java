package com.ecowire.ecowire.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ClimateRiskDTO {
    private String policyId;
    private BigDecimal averageTemperatureCelsius;
    private BigDecimal maxWindSpeedKph;
    private String floodRiskLevel;
    private String dataSource;
    private LocalDateTime recordedDate;
}
