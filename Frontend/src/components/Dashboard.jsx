import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Shield, CheckCircle2, TrendingUp, ArrowLeft, Activity, Loader2, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import RecommendationsList from './RecommendationsList';

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
                <span className="small text-muted fw-bold tracking-widest text-uppercase">OUT OF 100</span>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [policy, setPolicy] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [policyRes, recsRes] = await Promise.all([
                    apiService.getPolicyDetails(id),
                    apiService.getRecommendations(id)
                ]);
                setPolicy(policyRes.data);
                setRecommendations(recsRes.data);
            } catch (err) {
                console.error("Dashboard load failed", err);
                setError("Could not load policy details. It may have been deleted or the backend is offline.");
            } finally {
                setLoading(false);
            }
        };
        if (id) loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
                <Loader2 size={48} className="animate-spin text-success mb-3" />
                <h5 className="text-muted fw-bold">Analyzing Sustainability Data...</h5>
            </div>
        );
    }

    if (error || !policy) {
        return (
            <div className="container py-5 text-center">
                <AlertCircle size={64} className="text-danger mb-4" />
                <h2 className="fw-bold text-dark">{error || "Policy Not Found"}</h2>
                <button onClick={() => navigate('/policies')} className="btn btn-eco mt-4 px-4 py-2">
                    <ArrowLeft size={18} className="me-2" /> Back to List
                </button>
            </div>
        );
    }

    const score = policy.ecoScore?.totalScore || 0;
    const status = score >= 80 ? "Excellent" : score >= 50 ? "Moderate" : "Basic";
    const discount = score >= 80 ? "15% Green Discount" : score >= 60 ? "10% Green Discount" : "Standard Rate";

    // Convert score breakdown map to array for display
    const breakdownItems = Object.entries(policy.ecoScore?.scoreBreakdown || {}).map(([key, data]) => ({
        label: data.description || key,
        value: data.points,
        max: data.maxPoints
    }));

    return (
        <div className="container-fluid text-start pb-5">
            {/* Back Button */}
            <button
                onClick={() => navigate('/policies')}
                className="btn btn-link btn-hover-eco text-muted text-decoration-none p-2 px-3 mb-4 d-flex align-items-center gap-2 fw-bold transition-all"
                style={{ marginLeft: '-0.75rem', borderRadius: '8px' }}
            >
                <ArrowLeft size={16} /> Back to Policies
            </button>

            <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom">
                <div>
                    <h2 className="fw-bold text-dark mb-1">ESG Policy Report</h2>
                    <p className="text-muted mb-0">Record ID: <code className="text-success fw-bold">{policy.policyId}</code></p>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-3 rounded-circle text-success">
                        <Shield size={32} />
                    </div>
                    <div className="text-start">
                        <h3 className="fw-bold text-dark mb-1">{policy.customerName}</h3>
                        <div className="text-muted fw-bold mb-2 small">{policy.policyType} Coverage</div>
                        <div>
                            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 rounded-pill small">Active</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column: Score Card */}
                <div className="col-lg-4">
                    <div className="p-3 bg-white shadow-sm border rounded-4 text-center h-100 position-relative overflow-hidden">
                        <div className="position-absolute top-0 start-0 w-100 bg-mint opacity-20" style={{ height: '150px', zIndex: 0, borderRadius: '0 0 50% 50%' }}></div>

                        <div className="position-relative" style={{ zIndex: 1 }}>
                            <h6 className="fw-bold text-muted mb-4 text-uppercase tracking-widest pt-2">Sustainability Index</h6>

                            <div className="my-4">
                                <CircularGauge score={score} />
                            </div>

                            <div className="d-inline-flex align-items-center justify-content-center gap-2 bg-mint text-success px-4 py-2 rounded-pill mb-4 mt-3 shadow-sm border border-success border-opacity-10">
                                <Leaf size={18} />
                                <span className="fw-bold">{status} Rating</span>
                            </div>

                            <hr className="opacity-10 my-4" />

                            <div className="text-start bg-light p-4 rounded-4 border">
                                <div className="d-flex align-items-center gap-2 mb-2 text-success">
                                    <TrendingUp size={20} />
                                    <h6 className="fw-bold mb-0">Premium Impact</h6>
                                </div>
                                <p className="mb-0 text-dark fw-bold fs-5">{discount}</p>
                                <p className="small text-muted mt-2 mb-0">Based on your {score} point sustainability rating, your policy qualifies for specialized eco-pricing.</p>
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
                            <h6 className="fw-bold mb-0">Scoring Breakdown</h6>
                        </div>
                        <div className="d-flex flex-column gap-4 mt-4 px-2">
                            {breakdownItems.length > 0 ? breakdownItems.map((item, idx) => (
                                <div key={idx}>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="fw-bold text-dark small">{item.label}</span>
                                        <span className="fw-bold text-success small">{item.value}/{item.max}</span>
                                    </div>
                                    <div className="progress bg-light" style={{ height: 10, borderRadius: 5 }}>
                                        <motion.div
                                            className="progress-bar bg-success rounded-pill shadow-sm"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.value / item.max) * 100}%` }}
                                            transition={{ duration: 1, delay: idx * 0.15 }}
                                        ></motion.div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-muted text-center py-3">No scoring breakdown available for this policy.</p>
                            )}
                        </div>
                    </div>

                    {/* Recommendations Section */}
                    <div className="p-4 bg-white shadow-sm border rounded-4 flex-grow-1" style={{ backgroundImage: 'linear-gradient(to bottom right, #ffffff, #f8fbf9)' }}>
                        <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <Activity size={18} className="text-success" />
                            Sustainability Recommendations
                        </h6>
                        <RecommendationsList
                            recommendations={recommendations}
                            policyType={policy.policyType}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
