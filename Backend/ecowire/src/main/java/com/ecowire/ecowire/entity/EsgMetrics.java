package com.ecowire.ecowire.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "esg_metrics")
public class EsgMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "esg_metrics_id", updatable = false, nullable = false)
    private String esgMetricsId;

    @OneToOne
    @JoinColumn(name = "policy_id", nullable = false, unique = true)
    private Policy policy;

    @Column(name = "annual_energy_kwh", precision = 14, scale = 2)
    private BigDecimal annualEnergyKwh;

    @Column(name = "renewable_energy_pct", precision = 5, scale = 2)
    private BigDecimal renewableEnergyPct; // 0.00 – 100.00

    @Column(name = "workforce_diversity_score")
    private Integer workforceDiversityScore; // 0–100

    @Column(name = "reporting_year", nullable = false)
    private Integer reportingYear;

    @CreationTimestamp
    @Column(name = "recorded_date", nullable = false, updatable = false)
    private LocalDateTime recordedDate;

    // ── Getters & Setters ──────────────────────────────────────────────────

    public String getEsgMetricsId() { return esgMetricsId; }
    public void setEsgMetricsId(String esgMetricsId) { this.esgMetricsId = esgMetricsId; }

    public Policy getPolicy() { return policy; }
    public void setPolicy(Policy policy) { this.policy = policy; }

    public BigDecimal getAnnualEnergyKwh() { return annualEnergyKwh; }
    public void setAnnualEnergyKwh(BigDecimal annualEnergyKwh) { this.annualEnergyKwh = annualEnergyKwh; }

    public BigDecimal getRenewableEnergyPct() { return renewableEnergyPct; }
    public void setRenewableEnergyPct(BigDecimal renewableEnergyPct) { this.renewableEnergyPct = renewableEnergyPct; }

    public Integer getWorkforceDiversityScore() { return workforceDiversityScore; }
    public void setWorkforceDiversityScore(Integer workforceDiversityScore) { this.workforceDiversityScore = workforceDiversityScore; }

    public Integer getReportingYear() { return reportingYear; }
    public void setReportingYear(Integer reportingYear) { this.reportingYear = reportingYear; }

    public LocalDateTime getRecordedDate() { return recordedDate; }
}
