package com.ecowire.ecowire.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "nature_data")
public class NatureData {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "nature_data_id", updatable = false, nullable = false)
    private String natureDataId;

    @OneToOne
    @JoinColumn(name = "policy_id", nullable = false, unique = true)
    private Policy policy;

    @Column(name = "water_stress_level", nullable = false, length = 10)
    private String waterStressLevel; // LOW, MEDIUM, HIGH, VERY_HIGH

    @Column(name = "soil_health_score")
    private Integer soilHealthScore; // 0–100

    @Column(name = "biodiversity_index", precision = 5, scale = 3)
    private BigDecimal biodiversityIndex;

    @Column(name = "data_source", length = 255)
    private String dataSource;

    @CreationTimestamp
    @Column(name = "recorded_date", nullable = false, updatable = false)
    private LocalDateTime recordedDate;

    // ── Getters & Setters ──────────────────────────────────────────────────

    public String getNatureDataId() { return natureDataId; }
    public void setNatureDataId(String natureDataId) { this.natureDataId = natureDataId; }

    public Policy getPolicy() { return policy; }
    public void setPolicy(Policy policy) { this.policy = policy; }

    public String getWaterStressLevel() { return waterStressLevel; }
    public void setWaterStressLevel(String waterStressLevel) { this.waterStressLevel = waterStressLevel; }

    public Integer getSoilHealthScore() { return soilHealthScore; }
    public void setSoilHealthScore(Integer soilHealthScore) { this.soilHealthScore = soilHealthScore; }

    public BigDecimal getBiodiversityIndex() { return biodiversityIndex; }
    public void setBiodiversityIndex(BigDecimal biodiversityIndex) { this.biodiversityIndex = biodiversityIndex; }

    public String getDataSource() { return dataSource; }
    public void setDataSource(String dataSource) { this.dataSource = dataSource; }

    public LocalDateTime getRecordedDate() { return recordedDate; }
}
