import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';
import EcoSelect from './EcoSelect';
import clsx from 'clsx';

const PolicyForm = ({ isSidebarCollapsed, isMobile }) => {
    const navigate = useNavigate();
    const { policyId } = useParams();
    const isEditMode = !!policyId;

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);

    const [formData, setFormData] = useState({
        policyType: 'AUTO',
        customerName: '',
        contactInfo: '',
        // Auto
        vehicleId: '',
        vehicleType: 'PETROL',
        annualMileage: 'MEDIUM',
        usageType: 'PERSONAL',
        fuelEfficiency: 'MEDIUM',
        // Home
        propertyAddress: '',
        energyRating: 'C',
        hasSolarPanels: false,
        insulationType: 'STANDARD',
        heatingSystem: 'GAS',
        waterConservationFeatures: '',
        // Property
        propertyType: 'COMMERCIAL',
        certifications: '',
        energySystems: 'GRID',
        wasteManagement: 'BASIC_RECYCLING',
        buildingAge: 10
    });

    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            fetchPolicyToEdit();
        }
    }, [policyId]);

    const fetchPolicyToEdit = async () => {
        setFetchingData(true);
        setSubmitError(null);
        try {
            const res = await apiService.getPolicyDetails(policyId);
            const data = res.data;

            // Map backend structure to flat form state
            const mappedData = {
                policyType: data.policyType,
                customerName: data.customerName,
                contactInfo: data.contactInfo,
                ...(data.autoDetails || {}),
                ...(data.homeDetails || {}),
                ...(data.propertyDetails || {})
            };

            setFormData(prev => ({ ...prev, ...mappedData }));
        } catch (err) {
            console.error("Failed to fetch policy for edit", err);
            setSubmitError("Failed to load policy details. Please check the backend connection.");
        } finally {
            setFetchingData(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTypeChange = (type) => {
        if (isEditMode) return; // Cannot change type in edit mode
        setFormData(prev => ({ ...prev, policyType: type }));
    };

    const isStepValid = () => {
        if (step === 1) {
            return formData.customerName.trim() !== '' &&
                formData.contactInfo.trim() !== '' &&
                formData.contactInfo.includes('@');
        }
        if (step === 2) {
            if (formData.policyType === 'AUTO') return formData.vehicleId.trim() !== '';
            if (formData.policyType === 'HOME') return formData.propertyAddress.trim() !== '';
            if (formData.policyType === 'PROPERTY') {
                return (formData.propertyAddress || "").trim() !== '' &&
                    formData.buildingAge !== '' &&
                    formData.buildingAge >= 0;
            }
        }
        return true;
    };

    const nextStep = async () => {
        if (!isStepValid()) return;
        setSubmitError(null);
        setStep((s) => Math.min(s + 1, 3));
    };

    const prevStep = () => {
        setSubmitError(null);
        setStep((s) => Math.max(s - 1, 1));
    };

    const handleBack = () => {
        if (step === 1) {
            navigate('/policies');
        } else {
            prevStep();
        }
    };

    const handleFinalize = async () => {
        setLoading(true);
        setSubmitError(null);
        try {
            if (isEditMode) {
                await apiService.updatePolicy(policyId, formData);
                navigate(`/dashboard/${policyId}`);
            } else {
                const res = await apiService.createPolicy(formData);
                navigate(`/dashboard/${res.data.policyId}`);
            }
        } catch (err) {
            console.error("Submission failed", err);
            setSubmitError(`Failed to ${isEditMode ? 'update' : 'create'} policy. Please ensure the backend is running.`);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, name: 'Identity', icon: 'bi-person' },
        { id: 2, name: 'Policy Details', icon: 'bi-shield-check' },
        { id: 3, name: 'Review', icon: 'bi-eye' },
    ];

    return (
        <div className="form-section" style={{ paddingBottom: '120px' }}>
            {/* Header */}
            <div className="mb-5">
                <button
                    onClick={handleBack}
                    className="btn btn-link text-decoration-none text-muted mb-3 d-flex align-items-center gap-2 btn-hover-eco fw-bold"
                >
                    <i className="bi bi-arrow-left"></i> {step === 1 ? 'Back to Policies' : 'Back to Previous Step'}
                </button>
                <h2 className="fw-bold text-dark">{isEditMode ? 'Edit Existing Policy' : 'New Policy Creation'}</h2>
                <p className="text-muted">
                    {isEditMode
                        ? `Updating details for policy ID: ${policyId}`
                        : 'Complete the steps below to generate a sustainability policy.'}
                </p>
            </div>

            {/* Stepper Header */}
            <div className="mb-5 d-flex justify-content-between position-relative">
                <div className="position-absolute bg-secondary opacity-10" style={{ top: 22, left: 50, right: 45, height: 2, zIndex: 0 }}></div>
                <div
                    className="position-absolute bg-success transition-all duration-500"
                    style={{
                        top: 22,
                        left: 50,
                        height: 3,
                        width: `calc((${step - 1} / 2) * (100% - 100px))`,
                        zIndex: 1
                    }}
                ></div>

                {steps.map((s) => (
                    <div key={s.id} className="text-center position-relative" style={{ zIndex: 2 }}>
                        <div className={clsx(
                            "rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 transition-all duration-300",
                            step >= s.id ? "bg-success text-white shadow" : "bg-white text-muted border border-2"
                        )} style={{ width: 45, height: 45 }}>
                            {step > s.id ? <i className="bi bi-check-circle fs-4"></i> : <i className={`bi ${s.icon} fs-5`}></i>}
                        </div>
                        <span className={clsx("small fw-bold", step >= s.id ? "text-dark" : "text-muted")}>{s.name}</span>
                    </div>
                ))}
            </div>

            {/* Form Content */}
            <div className="min-vh-50 position-relative">
                {fetchingData && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white opacity-75" style={{ zIndex: 10 }}>
                        <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                        <h5 className="fw-bold text-dark">Loading Policy Data...</h5>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {/* STEP 1: IDENTITY */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h4 className="fw-bold mb-4 border-bottom pb-3 text-dark">1. Customer Identity</h4>
                            <div className="row mt-2 g-4">
                                <div className="col-md-6">
                                    <label className="form-label text-muted fw-bold">Full Name <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        className="form-control form-control-lg bg-light border-0"
                                        placeholder="e.g. John Green"
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted fw-bold">Email Address <span className="text-danger">*</span></label>
                                    <input
                                        type="email"
                                        name="contactInfo"
                                        value={formData.contactInfo}
                                        onChange={handleChange}
                                        className="form-control form-control-lg bg-light border-0"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <label className={clsx("form-label text-muted fw-bold mb-3", isEditMode && "opacity-50")}>
                                        Select Policy Type {isEditMode && <span className="small fw-normal">(Cannot be changed after creation)</span>}
                                    </label>
                                    <div className="d-flex flex-column flex-md-row gap-2 gap-md-3">
                                        {['AUTO', 'HOME', 'PROPERTY'].map(t => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => handleTypeChange(t)}
                                                disabled={isEditMode}
                                                className={clsx(
                                                    "btn px-3 px-md-5 py-2 border-2 fw-bold transition-all w-100 w-md-auto",
                                                    formData.policyType === t ? "btn-success border-success text-white shadow-sm" : "btn-outline-secondary btn-hover-eco opacity-60",
                                                    isEditMode && formData.policyType !== t && "opacity-25",
                                                    isEditMode && "cursor-not-allowed"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: DYNAMIC POLICY DETAILS */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h4 className="fw-bold mb-4 border-bottom pb-3 text-dark">2. {formData.policyType} Configuration</h4>
                            <div className="row g-4">
                                {formData.policyType === 'AUTO' && (
                                    <>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Vehicle ID (VIN) <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                name="vehicleId"
                                                value={formData.vehicleId}
                                                onChange={handleChange}
                                                className="form-control form-control-lg bg-light border-0"
                                                placeholder="17-character VIN"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Vehicle Type <span className="text-danger">*</span></label>
                                            <EcoSelect
                                                name="vehicleType"
                                                value={formData.vehicleType}
                                                onChange={handleChange}
                                                options={[
                                                    { value: 'ELECTRIC', label: 'Electric' },
                                                    { value: 'HYBRID', label: 'Hybrid' },
                                                    { value: 'PETROL', label: 'Petrol' },
                                                    { value: 'DIESEL', label: 'Diesel' }
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Annual Mileage <span className="text-danger">*</span></label>
                                            <EcoSelect
                                                name="annualMileage"
                                                value={formData.annualMileage}
                                                onChange={handleChange}
                                                options={[
                                                    { value: 'LOW', label: 'Low (< 10k km)' },
                                                    { value: 'MEDIUM', label: 'Medium (10k-20k km)' },
                                                    { value: 'HIGH', label: 'High (> 20k km)' }
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Usage Type <span className="text-danger">*</span></label>
                                            <EcoSelect
                                                name="usageType"
                                                value={formData.usageType}
                                                onChange={handleChange}
                                                options={[
                                                    { value: 'PERSONAL', label: 'Personal' },
                                                    { value: 'BUSINESS', label: 'Business' },
                                                    { value: 'COMMERCIAL', label: 'Commercial' }
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Fuel Efficiency <span className="text-danger">*</span></label>
                                            <EcoSelect
                                                name="fuelEfficiency"
                                                value={formData.fuelEfficiency}
                                                onChange={handleChange}
                                                options={[
                                                    { value: 'HIGH', label: 'High (> 15 km/L)' },
                                                    { value: 'MEDIUM', label: 'Medium (10-15 km/L)' },
                                                    { value: 'LOW', label: 'Low (< 10 km/L)' }
                                                ]}
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.policyType === 'HOME' && (
                                    <>
                                        <div className="col-12">
                                            <label className="form-label text-muted fw-bold">Property Address <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                name="propertyAddress"
                                                value={formData.propertyAddress}
                                                onChange={handleChange}
                                                className="form-control form-control-lg bg-light border-0"
                                                placeholder="123 Eco Street"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Energy Rating <span className="text-danger">*</span></label>
                                            <EcoSelect
                                                name="energyRating"
                                                value={formData.energyRating}
                                                onChange={handleChange}
                                                options={['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(r => ({ value: r, label: r }))}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Insulation Type <span className="text-danger">*</span></label>
                                            <EcoSelect
                                                name="insulationType"
                                                value={formData.insulationType}
                                                onChange={handleChange}
                                                options={[
                                                    { value: 'NONE', label: 'None' },
                                                    { value: 'BASIC', label: 'Basic' },
                                                    { value: 'STANDARD', label: 'Standard' },
                                                    { value: 'ADVANCED', label: 'Advanced' }
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label text-muted fw-bold">Heating System <span className="text-danger">*</span></label>
                                            <EcoSelect
                                                name="heatingSystem"
                                                value={formData.heatingSystem}
                                                onChange={handleChange}
                                                options={[
                                                    { value: 'ELECTRIC', label: 'Electric Heat Pump' },
                                                    { value: 'GAS', label: 'Natural Gas' },
                                                    { value: 'OIL', label: 'Heating Oil' },
                                                    { value: 'SOLAR', label: 'Solar Thermal' }
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label text-muted fw-bold">Water Conservation Features</label>
                                            <textarea
                                                name="waterConservationFeatures"
                                                value={formData.waterConservationFeatures}
                                                onChange={handleChange}
                                                className="form-control bg-light border-0"
                                                placeholder="e.g. Rainwater harvesting, greywater recycling"
                                                rows="2"
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-check form-switch p-4 bg-light rounded-3 d-flex align-items-center">
                                                <input
                                                    className="form-check-input ms-0 me-3"
                                                    type="checkbox"
                                                    name="hasSolarPanels"
                                                    checked={formData.hasSolarPanels}
                                                    onChange={handleChange}
                                                    id="solarSwitch"
                                                    style={{ transform: 'scale(1.5)' }}
                                                />
                                                <label className="form-check-label fw-bold mb-0" htmlFor="solarSwitch">Property has active Solar Panels</label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {formData.policyType === 'PROPERTY' && (
                                    <>
                                        <div className="col-12">
                                            <label className="form-label text-muted fw-bold">Property Address <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                name="propertyAddress"
                                                value={formData.propertyAddress}
                                                onChange={handleChange}
                                                className="form-control form-control-lg bg-light border-0"
                                                placeholder="456 Corporate Blvd"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Property Type <span className="text-danger">*</span></label>
                                            <EcoSelect
                                                name="propertyType"
                                                value={formData.propertyType}
                                                onChange={handleChange}
                                                options={[
                                                    { value: 'COMMERCIAL', label: 'Commercial' },
                                                    { value: 'RESIDENTIAL', label: 'Residential' }
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Energy System <span className="text-danger">*</span></label>
                                            <EcoSelect
                                                name="energySystems"
                                                value={formData.energySystems}
                                                onChange={handleChange}
                                                options={[
                                                    { value: 'GRID', label: 'Grid' },
                                                    { value: 'SOLAR', label: 'Solar' },
                                                    { value: 'WIND', label: 'Wind' },
                                                    { value: 'HYBRID', label: 'Hybrid' },
                                                    { value: 'GEOTHERMAL', label: 'Geothermal' }
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Waste Management <span className="text-danger">*</span></label>
                                            <EcoSelect
                                                name="wasteManagement"
                                                value={formData.wasteManagement}
                                                onChange={handleChange}
                                                options={[
                                                    { value: 'NONE', label: 'None' },
                                                    { value: 'BASIC_RECYCLING', label: 'Basic Recycling' },
                                                    { value: 'ADVANCED_RECYCLING', label: 'Advanced Recycling' },
                                                    { value: 'COMPOSTING', label: 'Composting' },
                                                    { value: 'ZERO_WASTE', label: 'Zero Waste' }
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Building Age (years) <span className="text-danger">*</span></label>
                                            <input
                                                type="number"
                                                name="buildingAge"
                                                value={formData.buildingAge}
                                                onChange={handleChange}
                                                className="form-control form-control-lg bg-light border-0"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label text-muted fw-bold">Sustainability Certifications</label>
                                            <textarea
                                                name="certifications"
                                                value={formData.certifications}
                                                onChange={handleChange}
                                                className="form-control bg-light border-0"
                                                placeholder="e.g. LEED Gold, BREEAM Outstanding"
                                                rows="2"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: REVIEW DETAILS */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="py-2"
                        >
                            <h4 className="fw-bold mb-4 border-bottom pb-3 text-dark">3. Review Details</h4>
                            <div className="glass-card p-4 bg-white border-0 shadow-sm rounded-4 text-start">
                                <p className="text-muted">Review the details before creating the policy.</p>

                                <h5 className="fw-bold mb-3 text-success border-bottom pb-2">Customer Information</h5>
                                <div className="row mb-4">
                                    <div className="col-sm-6 mb-3">
                                        <span className="text-muted d-block small fw-bold text-uppercase">Full Name</span>
                                        <span className="fw-medium fs-5">{formData.customerName}</span>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <span className="text-muted d-block small fw-bold text-uppercase">Email Address</span>
                                        <span className="fw-medium fs-5">{formData.contactInfo}</span>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <span className="text-muted d-block small fw-bold text-uppercase">Policy Type</span>
                                        <span className="fw-medium fs-5">{formData.policyType}</span>
                                    </div>
                                </div>

                                <h5 className="fw-bold mb-3 text-success border-bottom pb-2">Policy Configuration</h5>
                                <div className="row">
                                    {Object.entries(formData).map(([key, value]) => {
                                        if (['customerName', 'contactInfo', 'policyType'].includes(key) || value === '' || value === false) return null;
                                        // Simple formatting for keys like vehicleId -> Vehicle Id
                                        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                        return (
                                            <div key={key} className="col-sm-6 mb-3">
                                                <span className="text-muted d-block small fw-bold text-uppercase">{formattedKey}</span>
                                                <span className="fw-medium fs-5">{value === true ? 'Yes' : value}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {submitError && (
                <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center gap-3 mb-4 rounded-4 mx-auto" style={{ maxWidth: '800px' }}>
                    <i className="bi bi-exclamation-circle text-danger fs-4"></i>
                    <div className="fw-bold">{submitError}</div>
                </div>
            )}

            {/* Fixed Navigation Buttons */}
            <div
                className="policy-form-footer"
                style={{
                    width: isMobile 
                        ? '100%' 
                        : (isSidebarCollapsed ? 'calc(100% - var(--sidebar-collapsed-width))' : 'calc(100% - var(--sidebar-width))'),
                    left: isMobile 
                        ? '0' 
                        : (isSidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)')
                }}
            >
                <div className="d-flex justify-content-between align-items-center mx-auto" style={{ maxWidth: '900px' }}>
                    <button
                        onClick={() => navigate('/policies')}
                        disabled={loading}
                        className="btn btn-hover-eco text-muted fw-bold px-4 py-2"
                    >
                        Cancel
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={nextStep}
                            disabled={loading || !isStepValid()}
                            className="btn btn-eco px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                        >
                            {loading ? <div className="spinner-border spinner-border-sm" role="status"></div> : <>Continue <i className="bi bi-arrow-right"></i></>}
                        </button>
                    ) : (
                        <button
                            className="btn btn-eco px-4 py-2 shadow"
                            disabled={loading || !isStepValid()}
                            onClick={handleFinalize}
                        >
                            {loading ? <div className="spinner-border spinner-border-sm me-2" role="status"></div> : null}
                            {isEditMode ? 'Update Policy' : 'Create Policy'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PolicyForm;
