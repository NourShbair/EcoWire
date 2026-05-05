package com.ecowire.ecowire.controller;

import com.ecowire.ecowire.dto.*;
import com.ecowire.ecowire.service.EsgDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/policies")
public class EsgDataController {

    @Autowired
    private EsgDataService esgDataService;

    // GET /api/policies/{id}/carbon-emissions
    // Roles: REPORTING, ADMIN (enforced in SecurityConfig)
    @GetMapping("/{id}/carbon-emissions")
    public ResponseEntity<CarbonEmissionsDTO> getCarbonEmissions(
            @PathVariable String id) {
        return ResponseEntity.ok(esgDataService.getCarbonEmissions(id));
    }

    // GET /api/policies/{id}/climate-risk
    // Roles: UNDERWRITER, REPORTING, ADMIN (enforced in SecurityConfig)
    @GetMapping("/{id}/climate-risk")
    public ResponseEntity<ClimateRiskDTO> getClimateRisk(
            @PathVariable String id) {
        return ResponseEntity.ok(esgDataService.getClimateRisk(id));
    }

    // GET /api/policies/{id}/nature-data
    // Roles: UNDERWRITER, REPORTING, ADMIN (enforced in SecurityConfig)
    // Only available for PROPERTY policies
    @GetMapping("/{id}/nature-data")
    public ResponseEntity<NatureDataDTO> getNatureData(
            @PathVariable String id) {
        return ResponseEntity.ok(esgDataService.getNatureData(id));
    }

    // GET /api/policies/{id}/esg-metrics
    // Roles: UNDERWRITER, REPORTING, ADMIN (enforced in SecurityConfig)
    @GetMapping("/{id}/esg-metrics")
    public ResponseEntity<EsgMetricsDTO> getEsgMetrics(
            @PathVariable String id) {
        return ResponseEntity.ok(esgDataService.getEsgMetrics(id));
    }
}
