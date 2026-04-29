package com.ecowire.ecowire.controller;

import com.ecowire.ecowire.dto.PolicyRequestDTO;
import com.ecowire.ecowire.dto.PolicyResponseDTO;
import com.ecowire.ecowire.service.PolicyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    @Autowired
    private PolicyService policyService;

    @PostMapping
    public ResponseEntity<PolicyResponseDTO> createPolicy(
            @RequestBody @Valid PolicyRequestDTO request) {
        PolicyResponseDTO response = policyService.createPolicy(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolicyResponseDTO> getPolicy(
            @PathVariable String id) {
        PolicyResponseDTO response = policyService.getPolicy(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PolicyResponseDTO>> getAllPolicies() {
        List<PolicyResponseDTO> policies = policyService.getAllPolicies();
        return ResponseEntity.ok(policies);
    }
}
