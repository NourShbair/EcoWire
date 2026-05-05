package com.ecowire.ecowire.service.impl;

import com.ecowire.ecowire.dto.RecommendationDTO;
import com.ecowire.ecowire.enums.PolicyType;
import com.ecowire.ecowire.service.RecommendationEngine;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Primary
public class OpenAIRecommendationEngine implements RecommendationEngine {

    private static final Logger logger = LoggerFactory.getLogger(OpenAIRecommendationEngine.class);

    private final ChatClient chatClient;
    private final RecommendationEngineImpl fallbackEngine;
    private final ObjectMapper objectMapper;

    public OpenAIRecommendationEngine(ChatClient chatClient, RecommendationEngineImpl fallbackEngine) {
        this.chatClient = chatClient;
        this.fallbackEngine = fallbackEngine;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    @Cacheable(value = "aiRecommendations", key = "#policyType + '_' + #ecoScore + '_' + #attributes.hashCode()")
    public List<RecommendationDTO> generateRecommendations(
            PolicyType policyType,
            int ecoScore,
            Map<String, Object> attributes) {

        try {
            String attributeEntries = attributes.entrySet().stream()
                    .map(e -> "- " + e.getKey() + ": " + e.getValue())
                    .collect(Collectors.joining("\n"));

            String userPrompt = String.format(
                    """
                    Generate exactly 5 sustainability improvement recommendations for the following insurance policy.

                    Policy Type: %s
                    Eco Score: %d/100
                    Policy Attributes:
                    %s

                    Return ONLY a JSON array with no wrapper keys. Each element must have exactly these fields:
                    - "description": string — a specific, actionable recommendation
                    - "estimatedImprovement": string — estimated eco score improvement (e.g. "10-15 points")
                    - "priority": integer between 1 and 5 (1 = highest priority)
                    - "category": string — the sustainability category (e.g. "Energy", "Transport", "Waste")

                    Example format:
                    [{"description":"...","estimatedImprovement":"...","priority":1,"category":"..."}]""",
                    policyType.name(), ecoScore, attributeEntries);

            String response = chatClient.prompt()
                    .system("You are a sustainability insurance advisor with deep expertise in environmental impact assessment and green insurance products.")
                    .user(userPrompt)
                    .call()
                    .content();

            List<RecommendationDTO> recommendations = objectMapper.readValue(
                    response, new TypeReference<List<RecommendationDTO>>() {});

            return recommendations;

        } catch (Exception e) {
            logger.warn("OpenAI recommendation call failed, falling back to rule-based engine: {}", e.getMessage());
            return fallbackEngine.generateRecommendations(policyType, ecoScore, attributes);
        }
    }
}
