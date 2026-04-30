package com.ecowire.ecowire.scoring;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScoreComponent {
    private int points;
    private int weight;
    private int maxPoints;
    private String description;
}