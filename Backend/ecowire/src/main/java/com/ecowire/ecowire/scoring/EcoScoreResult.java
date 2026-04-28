package com.ecowire.ecowire.scoring;

import com.ecowire.ecowire.enums.PolicyType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EcoScoreResult {
    private int totalScore;
    private Map<String, ScoreComponent> breakdown;
    private PolicyType policyType;
}