package com.ecowire.ecowire.dto;
import com.ecowire.ecowire.enums.PolicyType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class EcoScoreDTO {
    private String policyId;
    private int totalScore;
    private PolicyType policyType;
    private Map<String, ScoreComponentDTO> scoreBreakdown;
    private LocalDateTime calculatedDate;
}