package com.ecowire.ecowire.controller;

import com.ecowire.ecowire.dto.EcoScoreExplanationDTO;
import com.ecowire.ecowire.service.AiEcoScoreExplanationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class EcoScoreExplanationController {

    private final AiEcoScoreExplanationService explanationService;

    public EcoScoreExplanationController(AiEcoScoreExplanationService explanationService) {
        this.explanationService = explanationService;
    }

    @GetMapping("/policies/{id}/ecoscore/explanation")
    public ResponseEntity<EcoScoreExplanationDTO> getEcoScoreExplanation(@PathVariable String id) {
        return ResponseEntity.ok(explanationService.getExplanation(id));
    }
}
