package com.ecowire.ecowire.service;

import com.ecowire.ecowire.dto.*;
import com.ecowire.ecowire.entity.*;
import com.ecowire.ecowire.enums.PolicyType;
import com.ecowire.ecowire.exception.PolicyNotFoundException;
import com.ecowire.ecowire.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EsgDataService {

    @Autowired private PolicyRepository          policyRepository;
    @Autowired private CarbonEmissionsRepository carbonEmissionsRepository;
    @Autowired private ClimateRiskRepository     climateRiskRepository;
    @Autowired private NatureDataRepository      natureDataRepository;
    @Autowired private EsgMetricsRepository      esgMetricsRepository;

    // ── Carbon Emissions ─────────────────────────────────────────────────────

    public CarbonEmissionsDTO getCarbonEmissions(String policyId) {
        validatePolicyExists(policyId);

        CarbonEmissions entity = carbonEmissionsRepository
                .findByPolicy_PolicyId(policyId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No carbon emissions record found for policy: " + policyId));

        CarbonEmissionsDTO dto = new CarbonEmissionsDTO();
        dto.setPolicyId(policyId);
        dto.setScope1Kg(entity.getScope1Kg());
        dto.setScope2Kg(entity.getScope2Kg());
        dto.setScope3Kg(entity.getScope3Kg());
        dto.setTotalKg(entity.getScope1Kg()
                .add(entity.getScope2Kg())
                .add(entity.getScope3Kg()));
        dto.setReportingYear(entity.getReportingYear());
        dto.setCalculatedDate(entity.getCalculatedDate());
        return dto;
    }

    // ── Climate Risk ─────────────────────────────────────────────────────────

    public ClimateRiskDTO getClimateRisk(String policyId) {
        validatePolicyExists(policyId);

        ClimateRisk entity = climateRiskRepository
                .findByPolicy_PolicyId(policyId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No climate risk record found for policy: " + policyId));

        ClimateRiskDTO dto = new ClimateRiskDTO();
        dto.setPolicyId(policyId);
        dto.setAverageTemperatureCelsius(entity.getAvgTemperatureCelsius());
        dto.setMaxWindSpeedKph(entity.getMaxWindSpeedKph());
        dto.setFloodRiskLevel(entity.getFloodRiskLevel());
        dto.setDataSource(entity.getDataSource());
        dto.setRecordedDate(entity.getRecordedDate());
        return dto;
    }

    // ── Nature Data ──────────────────────────────────────────────────────────

    public NatureDataDTO getNatureData(String policyId) {
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new PolicyNotFoundException(policyId));

        // Nature data is only available for PROPERTY policies
        if (policy.getPolicyType() != PolicyType.PROPERTY) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Nature data is only available for PROPERTY policies");
        }

        NatureData entity = natureDataRepository
                .findByPolicy_PolicyId(policyId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No nature data record found for policy: " + policyId));

        NatureDataDTO dto = new NatureDataDTO();
        dto.setPolicyId(policyId);
        dto.setWaterStressLevel(entity.getWaterStressLevel());
        dto.setSoilHealthScore(entity.getSoilHealthScore());
        dto.setBiodiversityIndex(entity.getBiodiversityIndex());
        dto.setDataSource(entity.getDataSource());
        dto.setRecordedDate(entity.getRecordedDate());
        return dto;
    }

    // ── ESG Metrics ──────────────────────────────────────────────────────────

    public EsgMetricsDTO getEsgMetrics(String policyId) {
        validatePolicyExists(policyId);

        EsgMetrics entity = esgMetricsRepository
                .findByPolicy_PolicyId(policyId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No ESG metrics record found for policy: " + policyId));

        EsgMetricsDTO dto = new EsgMetricsDTO();
        dto.setPolicyId(policyId);
        dto.setAnnualEnergyConsumptionKwh(entity.getAnnualEnergyKwh());
        dto.setRenewableEnergyPercentage(entity.getRenewableEnergyPct());
        dto.setWorkforceDiversityScore(entity.getWorkforceDiversityScore());
        dto.setReportingYear(entity.getReportingYear());
        dto.setRecordedDate(entity.getRecordedDate());
        return dto;
    }

    // ── Helper ───────────────────────────────────────────────────────────────

    private void validatePolicyExists(String policyId) {
        if (!policyRepository.existsById(policyId)) {
            throw new PolicyNotFoundException(policyId);
        }
    }
}
