package com.ecowire.ecowire.service.impl;

import com.ecowire.ecowire.dto.RecommendationDTO;
import com.ecowire.ecowire.enums.PolicyType;
import com.ecowire.ecowire.service.RecommendationEngine;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Primary
public class OpenAIRecommendationEngine implements RecommendationEngine {

    private static final String SYSTEM_PROMPT =
            "You are a sustainability insurance advisor with deep expertise in environmental impact assessment and green insurance products.";

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public OpenAIRecommendationEngine(ChatClient chatClient, ObjectMapper objectMapper) {
        this.chatClient = chatClient;
        this.objectMapper = objectMapper;
    }

    @Override
    @Cacheable(value = "aiRecommendations", key = "#policyType.name() + '_' + #ecoScore + '_' + #attributes.hashCode()")
    public List<RecommendationDTO> generateRecommendations(
            PolicyType policyType,
            int ecoScore,
            Map<String, Object> attributes) {
        try {
            StringBuilder attributeEntries = new StringBuilder();
            for (Map.Entry<String, Object> entry : attributes.entrySet()) {
                attributeEntries.append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
            }

            String userPrompt = String.format(
                    "Generate exactly 5 sustainability improvement recommendations for the following insurance policy.\n\n" +
                    "Policy Type: %s\n" +
                    "Eco Score: %d/100\n" +
                    "Policy Attributes:\n" +
                    "%s\n" +
                    "Return ONLY a JSON array with no wrapper keys. Each element must have exactly these fields:\n" +
                    "- \"description\": string — a specific, actionable recommendation\n" +
                    "- \"estimatedImprovement\": string — estimated eco score improvement (e.g. \"10-15 points\")\n" +
                    "- \"priority\": integer between 1 and 5 (1 = highest priority)\n" +
                    "- \"category\": string — the sustainability category (e.g. \"Energy\", \"Transport\", \"Waste\")\n\n" +
                    "Example format:\n" +
                    "[{\"description\":\"...\",\"estimatedImprovement\":\"...\",\"priority\":1,\"category\":\"...\"}]",
                    policyType,
                    ecoScore,
                    attributeEntries.toString()
            );

            String response = chatClient.prompt()
                    .system(SYSTEM_PROMPT)
                    .user(userPrompt)
                    .call()
                    .content();

            // Strip markdown code fences if present
            if (response != null) {
                response = response.replaceAll("(?s)```json\\s*", "").replaceAll("(?s)```\\s*", "").trim();
            }

            return objectMapper.readValue(response, new TypeReference<List<RecommendationDTO>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate AI recommendations: " + e.getMessage(), e);
        }
    }
}
