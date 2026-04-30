package com.ecowire.ecowire.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "carbon_emissions")
public class CarbonEmissions {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "emissions_id", updatable = false, nullable = false)
    private String emissionsId;

    @OneToOne
    @JoinColumn(name = "policy_id", nullable = false, unique = true)
    private Policy policy;

    @Column(name = "scope1_kg", nullable = false, precision = 12, scale = 2)
    private BigDecimal scope1Kg = BigDecimal.ZERO;

    @Column(name = "scope2_kg", nullable = false, precision = 12, scale = 2)
    private BigDecimal scope2Kg = BigDecimal.ZERO;

    @Column(name = "scope3_kg", nullable = false, precision = 12, scale = 2)
    private BigDecimal scope3Kg = BigDecimal.ZERO;

    @Column(name = "reporting_year", nullable = false)
    private Integer reportingYear;

    @CreationTimestamp
    @Column(name = "calculated_date", nullable = false, updatable = false)
    private LocalDateTime calculatedDate;

    // ── Getters & Setters ──────────────────────────────────────────────────

    public String getEmissionsId() { return emissionsId; }
    public void setEmissionsId(String emissionsId) { this.emissionsId = emissionsId; }

    public Policy getPolicy() { return policy; }
    public void setPolicy(Policy policy) { this.policy = policy; }

    public BigDecimal getScope1Kg() { return scope1Kg; }
    public void setScope1Kg(BigDecimal scope1Kg) { this.scope1Kg = scope1Kg; }

    public BigDecimal getScope2Kg() { return scope2Kg; }
    public void setScope2Kg(BigDecimal scope2Kg) { this.scope2Kg = scope2Kg; }

    public BigDecimal getScope3Kg() { return scope3Kg; }
    public void setScope3Kg(BigDecimal scope3Kg) { this.scope3Kg = scope3Kg; }

    public Integer getReportingYear() { return reportingYear; }
    public void setReportingYear(Integer reportingYear) { this.reportingYear = reportingYear; }

    public LocalDateTime getCalculatedDate() { return calculatedDate; }
}
