package com.ecowire.ecowire.entity;

import com.ecowire.ecowire.enums.*;
import jakarta.persistence.*;

@Entity
@Table(name = "home_policies")
public class HomePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "home_policy_id", updatable = false, nullable = false)
    private String homePolicyId;

    @OneToOne
    @JoinColumn(name = "policy_id", nullable = false, unique = true)
    private Policy policy;

    @Column(name = "property_address", nullable = false)
    private String propertyAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "energy_rating", nullable = false)
    private EnergyRating energyRating;

    @Column(name = "has_solar_panels", nullable = false)
    private Boolean hasSolarPanels;

    @Enumerated(EnumType.STRING)
    @Column(name = "insulation_type", nullable = false)
    private InsulationType insulationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "heating_system", nullable = false)
    private HeatingSystem heatingSystem;

    @Column(name = "water_conservation_features")
    private String waterConservationFeatures;

    // Getters and Setters
    public String getHomePolicyId() { return homePolicyId; }
    public void setHomePolicyId(String homePolicyId) { this.homePolicyId = homePolicyId; }
    public Policy getPolicy() { return policy; }
    public void setPolicy(Policy policy) { this.policy = policy; }
    public String getPropertyAddress() { return propertyAddress; }
    public void setPropertyAddress(String propertyAddress) { this.propertyAddress = propertyAddress; }
    public EnergyRating getEnergyRating() { return energyRating; }
    public void setEnergyRating(EnergyRating energyRating) { this.energyRating = energyRating; }
    public Boolean getHasSolarPanels() { return hasSolarPanels; }
    public void setHasSolarPanels(Boolean hasSolarPanels) { this.hasSolarPanels = hasSolarPanels; }
    public InsulationType getInsulationType() { return insulationType; }
    public void setInsulationType(InsulationType insulationType) { this.insulationType = insulationType; }
    public HeatingSystem getHeatingSystem() { return heatingSystem; }
    public void setHeatingSystem(HeatingSystem heatingSystem) { this.heatingSystem = heatingSystem; }
    public String getWaterConservationFeatures() { return waterConservationFeatures; }
    public void setWaterConservationFeatures(String waterConservationFeatures) { this.waterConservationFeatures = waterConservationFeatures; }
}
