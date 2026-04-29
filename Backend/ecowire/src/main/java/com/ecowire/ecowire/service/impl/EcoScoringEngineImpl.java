package com.ecowire.ecowire.service.impl;

import com.ecowire.ecowire.enums.PolicyType;
import com.ecowire.ecowire.exception.InvalidPolicyTypeException;
import com.ecowire.ecowire.scoring.EcoScoreResult;
import com.ecowire.ecowire.scoring.ScoringAlgorithm;
import com.ecowire.ecowire.scoring.algorithm.AutoScoringAlgorithm;
import com.ecowire.ecowire.scoring.algorithm.HomeScoringAlgorithm;
import com.ecowire.ecowire.scoring.algorithm.PropertyScoringAlgorithm;
import com.ecowire.ecowire.service.EcoScoringEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class EcoScoringEngineImpl implements EcoScoringEngine {

    private final Map<PolicyType, ScoringAlgorithm> algorithms;

    @Autowired
    public EcoScoringEngineImpl(
            AutoScoringAlgorithm autoAlgorithm,
            HomeScoringAlgorithm homeAlgorithm,
            PropertyScoringAlgorithm propertyAlgorithm) {

        this.algorithms = new HashMap<>();
        algorithms.put(PolicyType.AUTO,     autoAlgorithm);
        algorithms.put(PolicyType.HOME,     homeAlgorithm);
        algorithms.put(PolicyType.PROPERTY, propertyAlgorithm);
    }

    @Override
    public EcoScoreResult calculateScore(PolicyType policyType, Map<String, Object> attributes) {
        ScoringAlgorithm algorithm = algorithms.get(policyType);

        if (algorithm == null) {
            throw new InvalidPolicyTypeException(policyType.name());
        }

        return algorithm.calculate(attributes);
    }
}
