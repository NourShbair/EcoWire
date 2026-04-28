package com.ecowire.ecowire.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationDTO {
    private String description;
    private String estimatedImprovement;
    private int priority;
    private String category;
}