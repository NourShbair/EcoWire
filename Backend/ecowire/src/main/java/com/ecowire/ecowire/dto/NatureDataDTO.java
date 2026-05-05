package com.ecowire.ecowire.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class NatureDataDTO {
    private String policyId;
    private String waterStressLevel;
    private Integer soilHealthScore;
    private BigDecimal biodiversityIndex;
    private String dataSource;
    private LocalDateTime recordedDate;
}
