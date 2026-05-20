import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { authService } from '../services/authService';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const AnalyticsDashboard = () => {
    const navigate = useNavigate();
    const role = authService.getRole() || 'CUSTOMER';
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await apiService.getAllPolicies();
                setPolicies(res.data);
            } catch (err) {
                console.error("Failed to fetch policies for analytics", err);
                setError("Could not load analytics data.");
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
                <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                <h5 className="text-muted fw-bold">Compiling Analytics Data...</h5>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 text-center">
                <i className="bi bi-exclamation-circle text-danger fs-1 mb-4"></i>
                <h2 className="fw-bold text-dark">{error}</h2>
                <button onClick={() => navigate('/')} className="btn btn-eco mt-4 px-4 py-2 d-inline-flex align-items-center gap-2">
                    <i className="bi bi-arrow-left"></i> Home
                </button>
            </div>
        );
    }

    const totalPolicies = policies.length;
    const scores = policies.map(p => p.ecoScore?.totalScore || 0).filter(s => s > 0);
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const excellentCount = scores.filter(s => s >= 67).length;
    const goodCount = scores.filter(s => s >= 34 && s < 67).length;
    const needsImprovementCount = scores.filter(s => s < 34).length;

    const autoCount = policies.filter(p => p.policyType === 'AUTO').length;
    const homeCount = policies.filter(p => p.policyType === 'HOME').length;
    const propertyCount = policies.filter(p => p.policyType === 'PROPERTY').length;

    // Data extractions from policy configurations
    const electricHybridCount = policies.filter(p => p.policyType === 'AUTO' && p.autoDetails && ['ELECTRIC', 'HYBRID'].includes(p.autoDetails.vehicleType)).length;
    const solarHomesCount = policies.filter(p => p.policyType === 'HOME' && p.homeDetails && p.homeDetails.hasSolarPanels).length;
    const highEnergyRatingCount = policies.filter(p => p.policyType === 'HOME' && p.homeDetails && ['A', 'B'].includes(p.homeDetails.energyRating)).length;
    const renewablePropCount = policies.filter(p => p.policyType === 'PROPERTY' && p.propertyDetails && ['SOLAR', 'WIND', 'GEOTHERMAL', 'HYBRID'].includes(p.propertyDetails.energySystems)).length;

    // Role-specific section titles
    const getRoleConfig = () => {
        const commonSummaryTitle = 'Sustainability Compliance Summary';
        const commonSummarySubtitle = 'Overview of sustainability metrics across your accessible policies';

        switch (role) {
            case 'CUSTOMER':
                return { summaryTitle: commonSummaryTitle, summarySubtitle: commonSummarySubtitle, compositionTitle: 'Policy Portfolio Composition', distributionTitle: 'Policy Health Overview' };
            case 'AGENT':
                return { summaryTitle: commonSummaryTitle, summarySubtitle: commonSummarySubtitle, compositionTitle: 'Asset Class Composition', distributionTitle: 'Client Sustainability Distribution' };
            case 'UNDERWRITER':
                return { summaryTitle: commonSummaryTitle, summarySubtitle: commonSummarySubtitle, compositionTitle: 'Policy Class Concentration', distributionTitle: 'Organizational Risk Distribution' };
            case 'REPORTING':
            case 'AUDITOR':
                return { summaryTitle: commonSummaryTitle, summarySubtitle: commonSummarySubtitle, compositionTitle: 'Covered Assets Breakdown', distributionTitle: 'Green Compliance Spread' };
            case 'ADMIN':
                return { summaryTitle: commonSummaryTitle, summarySubtitle: commonSummarySubtitle, compositionTitle: 'Global Asset Composition', distributionTitle: 'Global Score Distribution' };
            default:
                return { summaryTitle: commonSummaryTitle, summarySubtitle: commonSummarySubtitle, compositionTitle: 'Composition', distributionTitle: 'Distribution' };
        }
    };

    const config = getRoleConfig();

    // Chart data
    const COLORS = {
        auto: '#198754',
        home: '#ffc107',
        property: '#0dcaf0',
        excellent: '#198754',
        good: '#ffc107',
        poor: '#dc3545'
    };

    const pieData = [
        { name: 'Auto', value: autoCount, color: COLORS.auto },
        { name: 'Home', value: homeCount, color: COLORS.home },
        { name: 'Property', value: propertyCount, color: COLORS.property },
    ].filter(d => d.value > 0);

    const barData = [
        { name: 'Excellent', count: excellentCount, color: COLORS.excellent },
        { name: 'Good', count: goodCount, color: COLORS.good },
        { name: 'Needs Impr.', count: needsImprovementCount, color: COLORS.poor },
    ];

    const MetricCard = ({ title, value, icon, subtitle }) => (
        <div className="col-md-3 col-sm-6 mb-4">
            <div className="glass-card p-4 h-100 bg-white border-0 shadow-sm rounded-4 text-start">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="text-muted fw-bold mb-0 text-uppercase tracking-wider small">{title}</h6>
                    <div className="text-success bg-mint p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                        <i className={`bi ${icon} fs-5`}></i>
                    </div>
                </div>
                <h2 className="fw-bold text-dark mb-1">{value}</h2>
                {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
            </div>
        </div>
    );

    const renderRoleSpecificMetrics = () => {
        switch (role) {
            case 'CUSTOMER': {
                const discountPct = averageScore >= 67 ? 15 : averageScore >= 34 ? 10 : 0;
                return (
                    <div className="row g-4">
                        <MetricCard title="Total Policies" value={totalPolicies} icon="bi-shield-check" subtitle="Your active policies" />
                        <MetricCard title="Avg Eco-Score" value={averageScore} icon="bi-lightning-charge" subtitle="Overall sustainability" />
                        <MetricCard title="Green Discount" value={`${discountPct}%`} icon="bi-piggy-bank" subtitle="Based on avg score tier" />
                        <MetricCard title="Green Policies" value={excellentCount} icon="bi-award" subtitle="Scoring 67+ (Excellent)" />
                    </div>
                );
            }
            case 'AGENT': {
                const improvementOps = needsImprovementCount + goodCount;
                return (
                    <div className="row g-4">
                        <MetricCard title="Total Managed" value={totalPolicies} icon="bi-people" subtitle="Clients in portfolio" />
                        <MetricCard title="Portfolio Avg" value={averageScore} icon="bi-graph-up-arrow" subtitle="Average client score" />
                        <MetricCard title="Improvement Ops" value={improvementOps} icon="bi-telephone-outbound" subtitle="Clients below Excellent tier" />
                        <MetricCard title="Green Assets" value={electricHybridCount + solarHomesCount} icon="bi-award" subtitle="EVs & Solar homes" />
                    </div>
                );
            }
            case 'UNDERWRITER': {
                const highRiskRatio = totalPolicies > 0 ? Math.round((needsImprovementCount / totalPolicies) * 100) : 0;
                return (
                    <div className="row g-4">
                        <MetricCard title="Org Average" value={averageScore} icon="bi-building" subtitle="Organization-wide score" />
                        <MetricCard title="High-Risk Exposure" value={`${highRiskRatio}%`} icon="bi-exclamation-triangle" subtitle="Policies scoring below 34" />
                        <MetricCard title="Low-Risk Assured" value={excellentCount} icon="bi-shield-check" subtitle="Policies scoring 67+" />
                        <MetricCard title="Green Commercial" value={renewablePropCount} icon="bi-wind" subtitle="Renewable energy properties" />
                    </div>
                );
            }
            case 'REPORTING':
            case 'AUDITOR': {
                const carbonProxy = Math.round(policies.reduce((sum, p) => {
                    const s = p.ecoScore?.totalScore || 50;
                    return sum + (5 - (s / 100) * 4.5);
                }, 0));
                const complianceRatio = totalPolicies > 0 ? Math.round(((excellentCount + goodCount) / totalPolicies) * 100) : 0;
                return (
                    <div className="row g-4">
                        <MetricCard title="Total Audited" value={totalPolicies} icon="bi-file-earmark-check" subtitle="Policies in scope" />
                        <MetricCard title="Compliance Rate" value={`${complianceRatio}%`} icon="bi-heart-pulse" subtitle="Policies scoring 34+" />
                        <MetricCard title="Est. Emissions" value={`${carbonProxy} tCO₂e`} icon="bi-cloud-haze" subtitle="Score-based estimate" />
                        <MetricCard title="High Rating Homes" value={highEnergyRatingCount} icon="bi-house-check" subtitle="Energy rating A or B" />
                    </div>
                );
            }
            case 'ADMIN': {
                const excellentRatio = totalPolicies > 0 ? Math.round((excellentCount / totalPolicies) * 100) : 0;
                return (
                    <div className="row g-4">
                        <MetricCard title="System Policies" value={totalPolicies} icon="bi-database" subtitle="Total records" />
                        <MetricCard title="System Avg Score" value={averageScore} icon="bi-speedometer2" subtitle="Global average" />
                        <MetricCard title="Excellent Ratio" value={`${excellentRatio}%`} icon="bi-star" subtitle="Policies scoring 67+" />
                        <MetricCard title="Policy Types" value={`${autoCount}/${homeCount}/${propertyCount}`} icon="bi-grid" subtitle="Auto / Home / Property" />
                    </div>
                );
            }
            default:
                return (
                    <div className="row g-4">
                        <MetricCard title="Total Policies" value={totalPolicies} icon="bi-shield-check" subtitle="Active policies" />
                        <MetricCard title="Average Score" value={averageScore} icon="bi-lightning-charge" subtitle="Mean sustainability score" />
                    </div>
                );
        }
    };

    return (
        <div className="container-fluid text-start pb-5 px-4 pt-4">
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Analytics Overview</h2>
                </div>
                <div className="bg-mint text-success p-3 rounded-circle shadow-sm">
                    <i className="bi bi-bar-chart-fill fs-4"></i>
                </div>
            </div>

            {totalPolicies === 0 ? (
                <div className="text-center py-5">
                    <div className="text-muted mb-3"><i className="bi bi-inbox fs-1"></i></div>
                    <h4 className="text-dark fw-bold">No Data Available</h4>
                    <p className="text-muted">There are currently no policies to display analytics for.</p>
                </div>
            ) : (
                <>
                    {/* Summary Metrics */}
                    <div className="mb-4">
                        <h5 className="fw-bold text-dark mb-3">{config.summaryTitle}</h5>
                        <p className="text-muted small mb-3">{config.summarySubtitle}</p>
                        {renderRoleSpecificMetrics()}
                    </div>

                    <div className="row g-4 mt-2">
                        {/* Composition Pie Chart */}
                        <div className="col-md-6">
                            <div className="glass-card p-4 bg-white border-0 shadow-sm rounded-4 h-100 d-flex flex-column">
                                <h6 className="fw-bold text-dark mb-4">{config.compositionTitle}</h6>
                                <div className="flex-grow-1" style={{ minHeight: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [value, 'Policies']} />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Distribution Bar Chart */}
                        <div className="col-md-6">
                            <div className="glass-card p-4 bg-white border-0 shadow-sm rounded-4 h-100 d-flex flex-column">
                                <h6 className="fw-bold text-dark mb-4">{config.distributionTitle}</h6>
                                <div className="flex-grow-1" style={{ minHeight: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                            <Tooltip formatter={(value) => [value, 'Policies']} cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                                {barData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
