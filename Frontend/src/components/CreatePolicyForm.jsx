import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Zap, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

const CreatePolicyForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [policyType, setPolicyType] = useState('AUTO');

    const nextStep = () => setStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const steps = [
        { id: 1, name: 'Identity', icon: User },
        { id: 2, name: 'Policy Details', icon: ShieldCheck },
        { id: 3, name: 'Impact', icon: Zap },
    ];

    return (
        <div className="max-w-4xl mx-auto text-start">
            {/* Header */}
            <div className="mb-5">
                <h2 className="fw-bold text-dark">New Policy Creation</h2>
                <p className="text-muted">Complete the steps below to generate a policy.</p>
            </div>

            {/* Stepper Header */}
            <div className="mb-5 d-flex justify-content-between position-relative px-4">
                <div className="position-absolute start-0 end-0 bg-secondary opacity-20 mx-5" style={{ top: 22, height: 2, zIndex: 0 }}></div>
                <div
                    className="position-absolute start-0 bg-success transition-all duration-500 mx-5"
                    style={{ top: 22, height: 3, width: `calc(${((step - 1) / 2) * 100}% - 3rem)`, zIndex: 1 }}
                ></div>

                {steps.map((s) => (
                    <div key={s.id} className="text-center position-relative" style={{ zIndex: 2 }}>
                        <div className={clsx(
                            "rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 transition-all duration-300",
                            step >= s.id ? "bg-success text-white shadow" : "bg-white text-muted border border-2"
                        )} style={{ width: 45, height: 45 }}>
                            {step > s.id ? <CheckCircle2 size={24} /> : <s.icon size={20} />}
                        </div>
                        <span className={clsx("small fw-bold", step >= s.id ? "text-dark" : "text-muted")}>{s.name}</span>
                    </div>
                ))}
            </div>

            {/* Form Content */}
            <div>
                <AnimatePresence mode="wait">
                    {/* STEP 1: IDENTITY */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h4 className="fw-bold mb-4 border-bottom pb-3">1. Customer Identity</h4>
                            <div className="row mt-2 g-5">
                                <div className="col-md-6">
                                    <label className="form-label text-muted fw-bold">Full Name</label>
                                    <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="John Doe" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted fw-bold">Email Address</label>
                                    <input type="email" className="form-control form-control-lg bg-light border-0" placeholder="john@example.com" />
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-muted fw-bold mb-3">Select Policy Type</label>
                                    <div className="d-flex gap-3">
                                        {['AUTO', 'HOME', 'PROPERTY'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setPolicyType(t)}
                                                className={clsx(
                                                    "btn px-5 py-2 border-2 fw-bold transition-all",
                                                    policyType === t ? "btn-success border-success text-white shadow-sm" : "btn-outline-secondary opacity-60 hover-eco-btn"
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
                            <h4 className="fw-bold mb-4 border-bottom pb-3">2. {policyType} Details</h4>
                            <div className="row g-4">
                                {policyType === 'AUTO' && (
                                    <>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Vehicle ID (VIN)</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="17-character VIN" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Vehicle Type</label>
                                            <select className="form-select form-select-lg bg-light border-0">
                                                <option>Electric</option>
                                                <option>Hybrid</option>
                                                <option>Petrol</option>
                                                <option>Diesel</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Annual Mileage</label>
                                            <select className="form-select form-select-lg bg-light border-0">
                                                <option>Low (&lt; 5k)</option>
                                                <option>Medium (5k-15k)</option>
                                                <option>High (&gt; 15k)</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Usage Type</label>
                                            <select className="form-select form-select-lg bg-light border-0">
                                                <option>Personal</option>
                                                <option>Business</option>
                                                <option>Commercial</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Fuel Efficiency</label>
                                            <select className="form-select form-select-lg bg-light border-0">
                                                <option>High</option>
                                                <option>Medium</option>
                                                <option>Low</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {policyType === 'HOME' && (
                                    <>
                                        <div className="col-12">
                                            <label className="form-label text-muted fw-bold">Property Address</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="123 Eco Street" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Energy Rating</label>
                                            <select className="form-select form-select-lg bg-light border-0">
                                                <option>A</option>
                                                <option>B</option>
                                                <option>C</option>
                                                <option>D</option>
                                                <option>E</option>
                                                <option>F</option>
                                                <option>G</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Insulation Type</label>
                                            <select className="form-select form-select-lg bg-light border-0">
                                                <option>None</option>
                                                <option>Basic</option>
                                                <option>Standard</option>
                                                <option>Advanced</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Heating System</label>
                                            <select className="form-select form-select-lg bg-light border-0">
                                                <option>Gas</option>
                                                <option>Oil</option>
                                                <option>Electric</option>
                                                <option>Heat_Pump</option>
                                                <option>Geothermal</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Water Conservation Features</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="e.g. rainwater harvesting" />
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-check form-switch p-4 bg-light rounded-3 d-flex align-items-center">
                                                <input className="form-check-input ms-0 me-3" type="checkbox" id="solarSwitch" style={{ transform: 'scale(1.5)' }} />
                                                <label className="form-check-label fw-bold mb-0" htmlFor="solarSwitch">Property has active Solar Panels</label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {policyType === 'PROPERTY' && (
                                    <>
                                        <div className="col-12">
                                            <label className="form-label text-muted fw-bold">Property Address</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="456 Corporate Blvd" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Property Type</label>
                                            <select className="form-select form-select-lg bg-light border-0">
                                                <option>Commercial</option>
                                                <option>Residential</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Certifications</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="e.g. LEED Gold" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Energy Systems</label>
                                            <select className="form-select form-select-lg bg-light border-0">
                                                <option>Grid</option>
                                                <option>Solar</option>
                                                <option>Wind</option>
                                                <option>Hybrid</option>
                                                <option>Geothermal</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted fw-bold">Waste Management</label>
                                            <select className="form-select form-select-lg bg-light border-0">
                                                <option>None</option>
                                                <option>Basic_Recycling</option>
                                                <option>Advanced_Recycling</option>
                                                <option>Composting</option>
                                                <option>Zero_Waste</option>
                                            </select>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="form-label text-muted fw-bold">Building Age (years)</label>
                                            <input type="number" className="form-control form-control-lg bg-light border-0" placeholder="10" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: IMPACT */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-center py-4"
                        >
                            <div className="mb-4 d-inline-block p-4 rounded-circle bg-mint text-success shadow-sm">
                                <Zap size={60} strokeWidth={2.5} />
                            </div>
                            <h3 className="fw-bold text-dark">Sustainability Analysis</h3>
                            <p className="text-muted mb-5">Your {policyType} policy has been analyzed for environmental impact.</p>

                            <div className="glass-card p-4 mb-4 bg-white border-0 shadow mx-auto" style={{ maxWidth: 400 }}>
                                <h1 className="display-3 fw-bold text-success mb-0">85</h1>
                                <p className="fw-bold text-success text-uppercase tracking-wider">Excellent Score</p>
                                <hr className="opacity-20" />
                                <div className="text-start bg-mint p-3 rounded-3 mt-3">
                                    <div className="d-flex align-items-center gap-2 mb-2 text-success fw-bold">
                                        <CheckCircle2 size={18} />
                                        <span>Green Discount Eligible</span>
                                    </div>
                                    <p className="small text-muted mb-0">This policy qualifies for a 15% reduction in premium due to high ESG compliance.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Fixed Navigation Buttons */}
            <div
                className="position-fixed bottom-0 end-0 border-top d-flex justify-content-between align-items-center"
                style={{ width: 'calc(100% - 280px)', backgroundColor: 'var(--eco-bg)', zIndex: 1000, padding: '1.5rem 3rem' }}
            >
                <button
                    onClick={prevStep}
                    className={clsx("btn btn-hover-eco px-4 py-2 fw-bold d-flex align-items-center gap-2", step === 1 && "invisible")}
                >
                    <ArrowLeft size={18} /> Back
                </button>
                {step < 3 ? (
                    <button
                        onClick={nextStep}
                        className="btn btn-eco px-4 py-2 d-flex align-items-center gap-2"
                    >
                        Continue <ArrowRight size={18} />
                    </button>
                ) : (
                    <button
                        className="btn btn-eco px-4 py-2 shadow"
                        onClick={() => navigate('/dashboard/NEW-POLICY-123')}
                    >
                        Finalize & Create Policy
                    </button>
                )}
            </div>
        </div>
    );
};

export default CreatePolicyForm;
