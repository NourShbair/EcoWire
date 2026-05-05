package com.ecowire.ecowire.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EsgMetricsDTO {
    private String policyId;
    private BigDecimal annualEnergyConsumptionKwh;
    private BigDecimal renewableEnergyPercentage;
    private Integer workforceDiversityScore;
    private Integer reportingYear;
    private LocalDateTime recordedDate;
}
