package com.ecowire.ecowire.scoring;

import java.util.Map;

public interface ScoringAlgorithm {
    /**
     * Calculate eco score based on policy-specific attributes
     * @param attributes Map of attribute names to values
     * @return EcoScoreResult containing total score and breakdown
     */
    EcoScoreResult calculate(Map<String, Object> attributes);
}