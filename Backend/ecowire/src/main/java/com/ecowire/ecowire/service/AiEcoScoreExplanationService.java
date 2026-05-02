package com.ecowire.ecowire.service;

import com.ecowire.ecowire.dto.EcoScoreDTO;
import com.ecowire.ecowire.dto.EcoScoreExplanationDTO;
import com.ecowire.ecowire.dto.PolicyResponseDTO;
import com.ecowire.ecowire.dto.ScoreComponentDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AiEcoScoreExplanationService {

    private final PolicyService policyService;
    private final ChatClient chatClient;

    public AiEcoScoreExplanationService(PolicyService policyService, ChatClient chatClient) {
        this.policyService = policyService;
        this.chatClient = chatClient;
    }

    @Cacheable(value = "ecoScoreExplanations", key = "#policyId")
    public EcoScoreExplanationDTO getExplanation(String policyId) {
        // PolicyNotFoundException from getPolicy() is intentionally not caught — let it propagate for 404 response
        PolicyResponseDTO policy = policyService.getPolicy(policyId);
        EcoScoreDTO ecoScore = policy.getEcoScore();

        // Resolve score tier
        int totalScore = ecoScore.getTotalScore();
        String tier;
        String discount;
        if (totalScore >= 67) {
            tier = "Excellent";
            discount = "15% Green Discount";
        } else if (totalScore >= 34) {
            tier = "Good";
            discount = "10% Green Discount";
        } else {
            tier = "Needs Improvement";
            discount = "Standard Rate";
        }

        // Build score breakdown string
        StringBuilder breakdownBuilder = new StringBuilder();
        for (Map.Entry<String, ScoreComponentDTO> entry : ecoScore.getScoreBreakdown().entrySet()) {
            String componentName = entry.getKey();
            ScoreComponentDTO component = entry.getValue();
            breakdownBuilder.append(componentName)
                    .append(": ")
                    .append(component.getPoints())
                    .append("/")
                    .append(component.getMaxPoints())
                    .append(" points (weight: ")
                    .append(component.getWeight())
                    .append("%) - ")
                    .append(component.getDescription())
                    .append("\n");
        }

        String systemPrompt = "You are a sustainability insurance advisor with deep expertise in environmental impact assessment and green insurance products.";

        String userPrompt = String.format(
                "Write a plain-English explanation of the following eco score for an insurance customer.\n" +
                "Your response must be exactly 3 to 5 sentences. Do not use JSON, markdown, bullet points, or any formatting — plain text only.\n" +
                "Name the strongest and weakest scoring components. State what the score means for the customer's insurance discount tier.\n\n" +
                "Policy Type: %s\n" +
                "Total Eco Score: %d/100\n" +
                "Discount Tier: %s (%s)\n\n" +
                "Score Breakdown:\n" +
                "%s",
                policy.getPolicyType(),
                totalScore,
                tier,
                discount,
                breakdownBuilder.toString()
        );

        try {
            String explanation = chatClient.prompt()
                    .system(systemPrompt)
                    .user(userPrompt)
                    .call()
                    .content();

            return new EcoScoreExplanationDTO(policyId, explanation.trim());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate eco score explanation: " + e.getMessage(), e);
        }
    }
}
