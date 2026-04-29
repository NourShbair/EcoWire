package com.ecowire.ecowire.entity;

import com.ecowire.ecowire.enums.*;
import jakarta.persistence.*;

@Entity
@Table(name = "property_policies")
public class PropertyPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "property_policy_id", updatable = false, nullable = false)
    private String propertyPolicyId;

    @OneToOne
    @JoinColumn(name = "policy_id", nullable = false, unique = true)
    private Policy policy;

    @Column(name = "property_address", nullable = false)
    private String propertyAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false)
    private PropertyType propertyType;

    @Column(name = "certifications")
    private String certifications;

    @Enumerated(EnumType.STRING)
    @Column(name = "energy_systems", nullable = false)
    private EnergySystem energySystems;

    @Enumerated(EnumType.STRING)
    @Column(name = "waste_management", nullable = false)
    private WasteManagement wasteManagement;

    @Column(name = "building_age", nullable = false)
    private Integer buildingAge;

    // Getters and Setters
    public String getPropertyPolicyId() { return propertyPolicyId; }
    public void setPropertyPolicyId(String propertyPolicyId) { this.propertyPolicyId = propertyPolicyId; }
    public Policy getPolicy() { return policy; }
    public void setPolicy(Policy policy) { this.policy = policy; }
    public String getPropertyAddress() { return propertyAddress; }
    public void setPropertyAddress(String propertyAddress) { this.propertyAddress = propertyAddress; }
    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }
    public String getCertifications() { return certifications; }
    public void setCertifications(String certifications) { this.certifications = certifications; }
    public EnergySystem getEnergySystems() { return energySystems; }
    public void setEnergySystems(EnergySystem energySystems) { this.energySystems = energySystems; }
    public WasteManagement getWasteManagement() { return wasteManagement; }
    public void setWasteManagement(WasteManagement wasteManagement) { this.wasteManagement = wasteManagement; }
    public Integer getBuildingAge() { return buildingAge; }
    public void setBuildingAge(Integer buildingAge) { this.buildingAge = buildingAge; }
}
