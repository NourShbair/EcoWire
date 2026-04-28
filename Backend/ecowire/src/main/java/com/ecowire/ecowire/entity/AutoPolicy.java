package com.ecowire.ecowire.entity;

import com.ecowire.ecowire.enums.*;
import jakarta.persistence.*;

@Entity
@Table(name = "auto_policies")
public class AutoPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "auto_policy_id", updatable = false, nullable = false)
    private String autoPolicyId;

    @OneToOne
    @JoinColumn(name = "policy_id", nullable = false, unique = true)
    private Policy policy;

    @Column(name = "vehicle_id", nullable = false)
    private String vehicleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(name = "annual_mileage", nullable = false)
    private AnnualMileage annualMileage;

    @Enumerated(EnumType.STRING)
    @Column(name = "usage_type", nullable = false)
    private UsageType usageType;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_efficiency", nullable = false)
    private FuelEfficiency fuelEfficiency;

    // Getters and Setters
    public String getAutoPolicyId() { return autoPolicyId; }
    public void setAutoPolicyId(String autoPolicyId) { this.autoPolicyId = autoPolicyId; }
    public Policy getPolicy() { return policy; }
    public void setPolicy(Policy policy) { this.policy = policy; }
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }
    public AnnualMileage getAnnualMileage() { return annualMileage; }
    public void setAnnualMileage(AnnualMileage annualMileage) { this.annualMileage = annualMileage; }
    public UsageType getUsageType() { return usageType; }
    public void setUsageType(UsageType usageType) { this.usageType = usageType; }
    public FuelEfficiency getFuelEfficiency() { return fuelEfficiency; }
    public void setFuelEfficiency(FuelEfficiency fuelEfficiency) { this.fuelEfficiency = fuelEfficiency; }
}
