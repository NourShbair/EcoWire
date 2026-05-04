package com.ecowire.ecowire.service;

import com.ecowire.ecowire.dto.EcoScoreExplanationDTO;
import com.ecowire.ecowire.dto.EcoScoreDTO;
import com.ecowire.ecowire.dto.PolicyResponseDTO;
import com.ecowire.ecowire.security.RequestContext;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

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
        PolicyResponseDTO policy = policyService.getPolicy(policyId, RequestContext.current());
        EcoScoreDTO ecoScore = policy.getEcoScore();

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

        String breakdownEntries = ecoScore.getScoreBreakdown().entrySet().stream()
                .map(e -> "- " + e.getKey() + ": " + e.getValue().getPoints() + "/" + e.getValue().getMaxPoints()
                        + " (weight: " + e.getValue().getWeight() + ") — " + e.getValue().getDescription())
                .collect(Collectors.joining("\n"));

        String userPrompt = String.format(
                """
                Write a plain-English explanation of the following eco score for an insurance customer.
                Your response must be exactly 3 to 5 sentences. Do not use JSON, markdown, bullet points, or any formatting — plain text only.
                Name the strongest and weakest scoring components. State what the score means for the customer's insurance discount tier.

                Policy Type: %s
                Total Eco Score: %d/100
                Discount Tier: %s (%s)

                Score Breakdown:
                %s""",
                ecoScore.getPolicyType().name(), totalScore, tier, discount, breakdownEntries);

        try {
            String response = chatClient.prompt()
                    .system("You are a sustainability insurance advisor with deep expertise in environmental impact assessment and green insurance products.")
                    .user(userPrompt)
                    .call()
                    .content();

            return new EcoScoreExplanationDTO(policyId, response);

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate eco score explanation: " + e.getMessage(), e);
        }
    }
}
