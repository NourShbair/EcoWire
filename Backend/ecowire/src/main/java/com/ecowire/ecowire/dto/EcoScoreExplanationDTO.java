package com.ecowire.ecowire.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EcoScoreExplanationDTO {
    private String policyId;
    private String explanation;
}
