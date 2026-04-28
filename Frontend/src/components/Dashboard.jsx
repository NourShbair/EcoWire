import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Share2, Leaf, Shield, CheckCircle2, TrendingUp, AlertCircle, ArrowRight, ArrowLeft, Activity } from 'lucide-react';

// Custom SVG Circular Gauge Component
const CircularGauge = ({ score }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const progressOffset = circumference - (score / 100) * circumference;
        setOffset(progressOffset);
    }, [score, circumference]);

    let color = "#4caf50";
    if (score <= 33) color = "#f44336";
    else if (score <= 66) color = "#ff9800";

    return (
        <div className="position-relative d-inline-block">
            <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                <circle cx="100" cy="100" r={radius} stroke="#e0f2f1" strokeWidth="16" fill="none" />
                <motion.circle
                    cx="100" cy="100" r={radius}
                    stroke={color}
                    strokeWidth="16" fill="none"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                />
            </svg>
            <div className="position-absolute top-50 start-50 translate-middle text-center">
                <h1 className="display-3 fw-bold text-dark mb-0">{score}</h1>
                <span className="small text-muted fw-bold tracking-widest uppercase">OUT OF 100</span>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();

    // Mock Data for the Dashboard View
    const policyData = {
        id: "POL-8024-ESG",
        type: "AUTO",
        holder: "John Doe",
        score: 85,
        status: "Excellent",
        discount: "15% Green Discount",
        breakdown: [
            { label: "Vehicle Type", value: 37, max: 40 },
            { label: "Annual Mileage", value: 20, max: 30 },
            { label: "Usage Type", value: 18, max: 20 },
            { label: "Fuel Efficiency", value: 10, max: 10 }
        ]
    };

    return (
        <div className="container-fluid text-start pb-5">
            {/* Back Button */}
            <button
                onClick={() => navigate('/policies')}
                className="btn btn-link text-muted text-decoration-none p-0 mb-4 d-flex align-items-center gap-2 fw-bold hover-text-dark transition-all"
            >
                <ArrowLeft size={16} /> Back to Policies
            </button>

            <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom">
                <div>
                    <h2 className="fw-bold text-dark mb-1">ESG Policy Details</h2>
                    <p className="text-muted mb-0">Sustainability Report for Policy {policyData.id}</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-3 rounded-circle text-primary">
                        <Shield size={32} />
                    </div>
                    <div className="text-start">
                        <h3 className="fw-bold text-dark mb-1">{policyData.holder}</h3>
                        <div className="text-muted fw-bold mb-2 small">{policyData.type} Policy</div>
                        <div>
                            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 rounded-pill small">Active Coverage</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column: Score Card */}
                <div className="col-lg-4">
                    <div className="p-3 bg-white shadow-sm border rounded-4 text-center h-100 position-relative overflow-hidden">
                        {/* Decorative Background blob */}
                        <div className="position-absolute top-0 start-0 w-100 bg-mint opacity-20" style={{ height: '150px', zIndex: 0, borderRadius: '0 0 50% 50%' }}></div>

                        <div className="position-relative" style={{ zIndex: 1 }}>
                            <h6 className="fw-bold text-muted mb-4 text-uppercase tracking-widest"> Eco-Score</h6>

                            <div className="my-4">
                                <CircularGauge score={policyData.score} />
                            </div>

                            <div className="d-inline-flex align-items-center justify-content-center gap-2 bg-mint text-success px-4 py-2 rounded-pill mb-4 mt-3">
                                <Leaf size={18} />
                                <span className="fw-bold">{policyData.status} Rating</span>
                            </div>

                            <hr className="opacity-10 my-4" />

                            <div className="text-start bg-light p-4 rounded-3 border">
                                <div className="d-flex align-items-center gap-2 mb-2 text-success">
                                    <TrendingUp size={20} />
                                    <h6 className="fw-bold mb-0">Premium Impact</h6>
                                </div>
                                <p className="mb-0 text-dark fw-bold">{policyData.discount} Applied</p>
                                <small className="text-muted">Based on your {policyData.score} point rating, your final premium has been heavily discounted.</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Breakdown & Recommendations */}
                <div className="col-lg-8 d-flex flex-column gap-4">

                    {/* Breakdown Card */}
                    <div className="p-4 bg-white shadow-sm border rounded-4">
                        <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
                            <Activity size={20} className="text-muted" />
                            <h6 className="fw-bold mb-0">Impact Breakdown</h6>
                        </div>
                        <div className="d-flex flex-column gap-4 mt-4">
                            {policyData.breakdown.map((item, idx) => (
                                <div key={idx}>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="fw-bold text-dark small">{item.label}</span>
                                        <span className="fw-bold text-success small">{item.value}/{item.max}</span>
                                    </div>
                                    <div className="progress bg-light" style={{ height: 8 }}>
                                        <motion.div
                                            className="progress-bar bg-success"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.value / item.max) * 100}%` }}
                                            transition={{ duration: 1, delay: idx * 0.2 }}
                                        ></motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendations Card */}
                    <div className="p-4 bg-white shadow-sm border rounded-4 flex-grow-1" style={{ backgroundImage: 'linear-gradient(to bottom right, #ffffff, #f8fbf9)' }}>
                        <h6 className="fw-bold mb-4">Improvement Opportunities</h6>

                        <div className="d-flex align-items-start gap-3 mb-4">
                            <div className="text-warning mt-1">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <h6 className="fw-bold text-dark mb-0 text-sm">Reduce Annual Mileage</h6>
                                    <span className="badge bg-success bg-opacity-10 text-success fw-bold border border-success border-opacity-25 px-2">+ 10-15 pts</span>
                                </div>
                                <p className="small text-muted mb-0">Your mileage impact is your lowest metric. Carpooling or utilizing public transit could significantly increase your score.</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-start gap-3">
                            <div className="text-success mt-1">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <h6 className="fw-bold text-dark mb-0 text-sm">Maintain EV Status</h6>
                                    <span className="badge bg-success bg-opacity-10 text-success fw-bold border border-success border-opacity-25 px-2">+ 0 pts</span>
                                </div>
                                <p className="small text-muted mb-0">Your Electric Vehicle classification is providing maximum efficiency points. Excellent job.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
