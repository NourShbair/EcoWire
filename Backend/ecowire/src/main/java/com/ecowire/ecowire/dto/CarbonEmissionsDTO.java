package com.ecowire.ecowire.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CarbonEmissionsDTO {
    private String policyId;
    private BigDecimal scope1Kg;
    private BigDecimal scope2Kg;
    private BigDecimal scope3Kg;
    private BigDecimal totalKg;
    private Integer reportingYear;
    private LocalDateTime calculatedDate;
}
