package com.ecowire.ecowire.controller;

import com.ecowire.ecowire.dto.PolicyRequestDTO;
import com.ecowire.ecowire.dto.PolicyResponseDTO;
import com.ecowire.ecowire.security.RequestContext;
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
        RequestContext ctx = RequestContext.current();
        PolicyResponseDTO response = policyService.createPolicy(request, ctx);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolicyResponseDTO> getPolicy(
            @PathVariable String id) {
        RequestContext ctx = RequestContext.current();
        PolicyResponseDTO response = policyService.getPolicy(id, ctx);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PolicyResponseDTO>> getAllPolicies() {
        RequestContext ctx = RequestContext.current();
        List<PolicyResponseDTO> policies = policyService.getAllPolicies(ctx);
        return ResponseEntity.ok(policies);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PolicyResponseDTO> updatePolicy(
            @PathVariable String id,
            @RequestBody @Valid PolicyRequestDTO request) {
        RequestContext ctx = RequestContext.current();
        PolicyResponseDTO response = policyService.updatePolicy(id, request, ctx);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePolicy(
            @PathVariable String id) {
        RequestContext ctx = RequestContext.current();
        policyService.deletePolicy(id, ctx);
        return ResponseEntity.noContent().build();
    }

}
