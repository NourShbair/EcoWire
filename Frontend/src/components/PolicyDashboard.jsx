import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Shield, CheckCircle2, TrendingUp, ArrowLeft, Activity, Loader2, AlertCircle } from 'lucide-react';
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

    // Helper to format labels (e.g., annualMileage -> Annual Mileage)
    const formatLabel = (key) => {
        if (!key) return '';
        
        // Handle all-caps Enums (e.g., ELECTRIC -> Electric)
        if (key === key.toUpperCase()) {
            return key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ');
        }

        return key
            .replace(/([A-Z])/g, ' $1') // Add space before caps
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
            .trim();
    };

    // Helper to get all policy-specific attributes
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
                const [policyRes, recsRes] = await Promise.all([
                    apiService.getPolicyDetails(policyId),
                    apiService.getRecommendations(policyId)
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
        if (policyId) loadData();
    }, [policyId]);

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
                <ArrowLeft size={16} /> Back to Policies
            </button>

            <div className="d-flex justify-content-between align-items-start mb-4 pb-4 border-bottom">
                <div>
                    <h2 className="fw-bold text-dark mb-1">ESG Policy Report</h2>
                    <p className="text-muted mb-0 small">Policy ID: <code className="text-success fw-bold">{policy.policyId}</code></p>
                    <p className="text-muted mb-0 small mt-1">
                        Issued On: <span className="fw-bold">
                            {new Date(policy.createdDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} 
                            {' '} 
                            {new Date(policy.createdDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </p>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-3 rounded-circle text-success">
                        <Shield size={32} />
                    </div>
                    <div className="text-start">
                        <h3 className="fw-bold text-dark mb-1">{policy.customerName}</h3>
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
                    />
                </div>

                {/* Right Column: Breakdown & Recommendations */}
                <div className="col-lg-8 d-flex flex-column gap-4">

                    {/* Breakdown Card */}
                    <ScoreBreakdown breakdownItems={breakdownItems} />

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

export default PolicyDashboard;
