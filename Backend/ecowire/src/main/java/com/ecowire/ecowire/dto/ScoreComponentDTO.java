package com.ecowire.ecowire.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScoreComponentDTO {
    private int points;
    private int weight;
    private int maxPoints;
    private String description;
}