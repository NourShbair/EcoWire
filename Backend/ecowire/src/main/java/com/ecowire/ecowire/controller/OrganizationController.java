package com.ecowire.ecowire.controller;

import com.ecowire.ecowire.dto.OrganizationDTO;
import com.ecowire.ecowire.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @GetMapping
    public ResponseEntity<List<OrganizationDTO>> getAllOrganizations() {
        List<OrganizationDTO> dtos = organizationService.getAllOrganizations()
                .stream()
                .map(org -> new OrganizationDTO(org.getOrganizationId(), org.getName()))
                .toList();
        return ResponseEntity.ok(dtos);
    }
}
