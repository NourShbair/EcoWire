package com.ecowire.ecowire.entity;

import com.ecowire.ecowire.enums.PolicyType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "policies")
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "policy_id", updatable = false, nullable = false)
    private String policyId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "contact_info", nullable = false)
    private String contactInfo;

    @Enumerated(EnumType.STRING)
    @Column(name = "policy_type", nullable = false)
    private PolicyType policyType;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

    @OneToOne(mappedBy = "policy", cascade = CascadeType.ALL, orphanRemoval = true)
    private AutoPolicy autoPolicy;

    @OneToOne(mappedBy = "policy", cascade = CascadeType.ALL, orphanRemoval = true)
    private HomePolicy homePolicy;

    @OneToOne(mappedBy = "policy", cascade = CascadeType.ALL, orphanRemoval = true)
    private PropertyPolicy propertyPolicy;

    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EcoScore> ecoScores = new ArrayList<>();

    // Getters and Setters
    public String getPolicyId() { return policyId; }
    public void setPolicyId(String policyId) { this.policyId = policyId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    public PolicyType getPolicyType() { return policyType; }
    public void setPolicyType(PolicyType policyType) { this.policyType = policyType; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public AutoPolicy getAutoPolicy() { return autoPolicy; }
    public void setAutoPolicy(AutoPolicy autoPolicy) { this.autoPolicy = autoPolicy; }
    public HomePolicy getHomePolicy() { return homePolicy; }
    public void setHomePolicy(HomePolicy homePolicy) { this.homePolicy = homePolicy; }
    public PropertyPolicy getPropertyPolicy() { return propertyPolicy; }
    public void setPropertyPolicy(PropertyPolicy propertyPolicy) { this.propertyPolicy = propertyPolicy; }
    public List<EcoScore> getEcoScores() { return ecoScores; }
    public void setEcoScores(List<EcoScore> ecoScores) { this.ecoScores = ecoScores; }
}
