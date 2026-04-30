package com.ecowire.ecowire.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "climate_risk")
public class ClimateRisk {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "climate_risk_id", updatable = false, nullable = false)
    private String climateRiskId;

    @OneToOne
    @JoinColumn(name = "policy_id", nullable = false, unique = true)
    private Policy policy;

    @Column(name = "avg_temperature_celsius", precision = 5, scale = 2)
    private BigDecimal avgTemperatureCelsius;

    @Column(name = "max_wind_speed_kph", precision = 7, scale = 2)
    private BigDecimal maxWindSpeedKph;

    @Column(name = "flood_risk_level", nullable = false, length = 10)
    private String floodRiskLevel; // LOW, MEDIUM, HIGH, VERY_HIGH

    @Column(name = "data_source", length = 255)
    private String dataSource;

    @CreationTimestamp
    @Column(name = "recorded_date", nullable = false, updatable = false)
    private LocalDateTime recordedDate;

    // ── Getters & Setters ──────────────────────────────────────────────────

    public String getClimateRiskId() { return climateRiskId; }
    public void setClimateRiskId(String climateRiskId) { this.climateRiskId = climateRiskId; }

    public Policy getPolicy() { return policy; }
    public void setPolicy(Policy policy) { this.policy = policy; }

    public BigDecimal getAvgTemperatureCelsius() { return avgTemperatureCelsius; }
    public void setAvgTemperatureCelsius(BigDecimal avgTemperatureCelsius) { this.avgTemperatureCelsius = avgTemperatureCelsius; }

    public BigDecimal getMaxWindSpeedKph() { return maxWindSpeedKph; }
    public void setMaxWindSpeedKph(BigDecimal maxWindSpeedKph) { this.maxWindSpeedKph = maxWindSpeedKph; }

    public String getFloodRiskLevel() { return floodRiskLevel; }
    public void setFloodRiskLevel(String floodRiskLevel) { this.floodRiskLevel = floodRiskLevel; }

    public String getDataSource() { return dataSource; }
    public void setDataSource(String dataSource) { this.dataSource = dataSource; }

    public LocalDateTime getRecordedDate() { return recordedDate; }
}
