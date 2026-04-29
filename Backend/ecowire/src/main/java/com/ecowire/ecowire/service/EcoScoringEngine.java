
package com.ecowire.ecowire.service;

import com.ecowire.ecowire.enums.PolicyType;
import com.ecowire.ecowire.scoring.EcoScoreResult;

import java.util.Map;

public interface EcoScoringEngine {
    EcoScoreResult calculateScore(PolicyType policyType, Map<String, Object> attributes);
}