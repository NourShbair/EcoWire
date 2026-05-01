package com.ecowire.ecowire.entity;

import com.ecowire.ecowire.converter.ScoreBreakdownConverter;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "eco_scores")
public class EcoScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "score_id", updatable = false, nullable = false)
    private String scoreId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore;

    @Convert(converter = ScoreBreakdownConverter.class)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "score_breakdown", nullable = false, columnDefinition = "jsonb")
    private Map<String, Object> scoreBreakdown;

    @CreationTimestamp
    @Column(name = "calculated_date", nullable = false, updatable = false)
    private LocalDateTime calculatedDate;

    // Getters and Setters
    public String getScoreId() { return scoreId; }
    public void setScoreId(String scoreId) { this.scoreId = scoreId; }
    public Policy getPolicy() { return policy; }
    public void setPolicy(Policy policy) { this.policy = policy; }
    public Integer getTotalScore() { return totalScore; }
    public void setTotalScore(Integer totalScore) { this.totalScore = totalScore; }
    public Map<String, Object> getScoreBreakdown() { return scoreBreakdown; }
    public void setScoreBreakdown(Map<String, Object> scoreBreakdown) { this.scoreBreakdown = scoreBreakdown; }
    public LocalDateTime getCalculatedDate() { return calculatedDate; }
}
