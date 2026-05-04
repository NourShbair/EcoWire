import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import RecommendationsList from './RecommendationsList';
import ScoreCard from './ScoreCard';
import ScoreBreakdown from './ScoreBreakdown';

const PolicyDashboard = () => {
    const { policyId } = useParams();
    const navigate = useNavigate();
    const [policy, setPolicy] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [explanation, setExplanation] = useState(null);
    const [explanationLoading, setExplanationLoading] = useState(true);
    const [explanationError, setExplanationError] = useState(null);

    const formatLabel = (key) => {
        if (!key) return '';

        if (key === key.toUpperCase()) {
            return key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ');
        }

        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    };
    const getPolicyDetails = () => {
        if (!policy) return [];
        const details = [];
        const source = policy.autoDetails || policy.homeDetails || policy.propertyDetails;

        if (source) {
            Object.entries(source).forEach(([key, value]) => {
                if (key.toLowerCase().includes('id') || key.toLowerCase().includes('policy')) return;
                if (value === null || value === undefined || value === '') return;

                details.push({
                    label: formatLabel(key),
                    value: typeof value === 'boolean' ? (value ? 'Yes' : 'No') : formatLabel(String(value))
                });
            });
        }
        return details;
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const policyRes = await apiService.getPolicyDetails(policyId);
                setPolicy(policyRes.data);
            } catch (err) {
                console.error("Dashboard load failed", err);
                setError("Could not load policy details. It may have been deleted or the backend is offline.");
            } finally {
                setLoading(false);
            }

            // Fetch recommendations separately so AI failures don't block the dashboard
            try {
                const recsRes = await apiService.getRecommendations(policyId);
                setRecommendations(recsRes.data);
            } catch (err) {
                console.error("Recommendations load failed", err);
                setRecommendations([]);
            }

            // Fetch explanation separately so failures don't block the dashboard
            setExplanationLoading(true);
            try {
                const explanationRes = await apiService.getEcoScoreExplanation(policyId);
                setExplanation(explanationRes.data.explanation);
            } catch (err) {
                console.error("Explanation load failed", err);
                setExplanationError("Could not load AI explanation.");
            } finally {
                setExplanationLoading(false);
            }
        };
        if (policyId) loadData();
    }, [policyId]);

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
                <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                <h5 className="text-muted fw-bold">Analyzing Sustainability Data...</h5>
            </div>
        );
    }

    if (error || !policy) {
        return (
            <div className="container py-5 text-center">
                <i className="bi bi-exclamation-circle text-danger fs-1 mb-4"></i>
                <h2 className="fw-bold text-dark">{error || "Policy Not Found"}</h2>
                <button onClick={() => navigate('/policies')} className="btn btn-eco mt-4 px-4 py-2 d-inline-flex align-items-center gap-2">
                    <i className="bi bi-arrow-left"></i> Back to List
                </button>
            </div>
        );
    }

    const score = policy.ecoScore?.totalScore || 0;
    const status = score >= 67 ? "Excellent" : score >= 34 ? "Good" : "Needs Improvement";
    const discount = score >= 67 ? "15% Green Discount" : score >= 34 ? "10% Green Discount" : "Standard Rate";

    const policyDetails = getPolicyDetails();

    // Convert score breakdown map to array for display
    const breakdownItems = Object.entries(policy.ecoScore?.scoreBreakdown || {}).map(([key, data]) => {
        return {
            label: formatLabel(key),
            value: data.points,
            max: data.maxPoints,
            color: '#1a5f49'
        };
    });

    return (
        <div className="container-fluid text-start pb-5">
            {/* Back Button */}
            <button
                onClick={() => navigate('/policies')}
                className="btn btn-link btn-hover-eco text-muted text-decoration-none p-2 px-3 mb-4 d-flex align-items-center gap-2 fw-bold transition-all"
                style={{ marginLeft: '-0.75rem', borderRadius: '8px' }}
            >
                <i className="bi bi-arrow-left"></i> Back to Policies
            </button>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-4 mb-4 pb-4 border-bottom">
                <div>
                    <h2 className="fw-bold text-dark mb-1 responsive-h1">ESG Policy Report</h2>
                    <p className="text-muted mb-0 small">Policy ID: <code className="text-success fw-bold">{policy.policyId}</code></p>
                    <p className="text-muted mb-0 small mt-1">
                        Issued On: <span className="fw-bold">
                            {new Date(policy.createdDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            {' '}
                            {new Date(policy.createdDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </p>
                </div>
                <div className="d-flex align-items-center gap-3 p-2">
                    <div className="text-success">
                        <i className="bi bi-shield-check fs-2"></i>
                    </div>
                    <div className="text-start">
                        <h3 className="fw-bold text-dark mb-1 h5">{policy.customerName}</h3>
                        <div className="text-muted small">{policy.contactInfo}</div>
                    </div>
                </div>
            </div>

            {/* Policy Context Details Grid */}
            <div className="bg-light p-4 rounded-4 mb-4 shadow-sm border border-white">
                <h6 className="fw-bold text-dark mb-3 small text-uppercase tracking-wider">Policy Specifications</h6>
                <div className="row g-3">
                    <div className="col-md-3 col-6">
                        <div className="text-muted small fw-bold mb-1">Coverage Type</div>
                        <div className="text-dark fw-bold">{policy.policyType}</div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="text-muted small fw-bold mb-1">Status</div>
                        <div>
                            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 rounded-pill small">Active</span>
                        </div>
                    </div>
                    {policyDetails.map((detail, idx) => (
                        <div key={idx} className="col-md-3 col-6">
                            <div className="text-muted small fw-bold mb-1">{detail.label}</div>
                            <div className="text-dark fw-bold">{detail.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column: Score Card */}
                <div className="col-lg-4">
                    <ScoreCard
                        score={score}
                        status={status}
                        discount={discount}
                        policyType={policy.policyType}
                        topRecommendation={recommendations.length > 0 ? recommendations.sort((a, b) => a.priority - b.priority)[0] : null}
                    />
                </div>

                {/* Right Column: Breakdown & Recommendations */}
                <div className="col-lg-8 d-flex flex-column gap-4">

                    {/* Breakdown Card */}
                    <ScoreBreakdown breakdownItems={breakdownItems} />

                    {/* AI Eco Score Explanation */}
                    <div className="p-4 bg-white shadow-sm border rounded-4" style={{ backgroundImage: 'linear-gradient(to bottom right, #ffffff, #f8fbf9)' }}>
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
                            <i className="bi bi-stars text-success"></i>
                            AI Eco Score Explanation
                        </h6>
                        {explanationLoading ? (
                            <div className="d-flex align-items-center gap-2 text-muted">
                                <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                                <span>Generating AI explanation...</span>
                            </div>
                        ) : explanationError ? (
                            <div className="alert alert-warning mb-0 py-2 small" role="alert">
                                <i className="bi bi-exclamation-triangle me-1"></i>
                                {explanationError}
                            </div>
                        ) : (
                            <p className="text-muted mb-0" style={{ lineHeight: '1.7' }}>{explanation}</p>
                        )}
                    </div>

                    {/* Recommendations Section */}
                    <div className="p-4 bg-white shadow-sm border rounded-4 flex-grow-1" style={{ backgroundImage: 'linear-gradient(to bottom right, #ffffff, #f8fbf9)' }}>
                        <h6 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark">
                            <i className="bi bi-activity text-success"></i>
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

export default PolicyDashboard;
