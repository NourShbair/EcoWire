import React, { useState, useEffect } from 'react';

const CircularGauge = ({ score }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const progressOffset = circumference - (score / 100) * circumference;
        setOffset(progressOffset);
    }, [score, circumference]);

    let color = "#1a5f49";
    if (score <= 33) color = "#dc3545";
    else if (score <= 66) color = "#ffc107";

    return (
        <div className="position-relative d-inline-block">
            <svg width="180" height="180" className="rotate-n90">
                <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="transparent"
                    stroke="#f0f2f0"
                    strokeWidth="12"
                />
                <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    style={{
                        strokeDashoffset: offset,
                        transition: 'stroke-dashoffset 1s ease-in-out',
                        strokeLinecap: 'round'
                    }}
                />
            </svg>
            <div className="position-absolute top-50 start-50 translate-middle text-center">
                <h1 className="display-5 fw-bold mb-0 text-dark">{score}</h1>
                <span className="text-muted fw-bold small">POINTS</span>
            </div>
        </div>
    );
};

const getTierInfo = (score) => {
    if (score >= 67) {
        return {
            tier: 'Excellent',
            discount: '15%',
            discountLabel: '15% Green Discount',
            color: '#1a5f49',
            bgClass: 'bg-success',
            textClass: 'text-success',
            borderClass: 'border-success',
            icon: 'bi-award-fill',
            nextTier: null,
            pointsToNext: 0,
            nextDiscount: null,
        };
    }
    if (score >= 34) {
        return {
            tier: 'Good',
            discount: '10%',
            discountLabel: '10% Green Discount',
            color: '#b8860b',
            bgClass: 'bg-warning',
            textClass: 'text-warning',
            borderClass: 'border-warning',
            icon: 'bi-star-fill',
            nextTier: 'Excellent',
            pointsToNext: 67 - score,
            nextDiscount: '15%',
        };
    }
    return {
        tier: 'Needs Improvement',
        discount: '0%',
        discountLabel: 'Standard Rate',
        color: '#dc3545',
        bgClass: 'bg-danger',
        textClass: 'text-danger',
        borderClass: 'border-danger',
        icon: 'bi-exclamation-triangle-fill',
        nextTier: 'Good',
        pointsToNext: 34 - score,
        nextDiscount: '10%',
    };
};

const ScoreCard = ({ score, status, discount, policyType, topRecommendation }) => {
    const tierInfo = getTierInfo(score);
    const progressToNext = tierInfo.nextTier
        ? Math.min(100, Math.max(0, ((score - (tierInfo.tier === 'Good' ? 34 : 0)) / (tierInfo.pointsToNext + (score - (tierInfo.tier === 'Good' ? 34 : 0)))) * 100))
        : 100;

    return (
        <div className="p-3 bg-white shadow-sm border rounded-4 text-center h-100 position-relative overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 bg-mint opacity-20" style={{ height: '150px', zIndex: 0, borderRadius: '0 0 50% 50%' }}></div>

            <div className="position-relative" style={{ zIndex: 1 }}>
                <h6 className="fw-bold text-muted mb-4 text-uppercase tracking-widest pt-2">Sustainability Index</h6>

                <div className="my-4">
                    <CircularGauge score={score} />
                </div>

                <div className="d-inline-flex align-items-center justify-content-center gap-2 bg-mint text-success px-4 py-2 rounded-pill mb-4 mt-3 shadow-sm border border-success border-opacity-10">
                    <i className="bi bi-leaf"></i>
                    <span className="fw-bold">{status} Rating</span>
                </div>

                <hr className="opacity-10 my-4" />

                {/* Premium Impact Section */}
                <div className="text-start bg-light p-4 rounded-4 border">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-2 text-success">
                            <i className="bi bi-graph-up fs-5"></i>
                            <h6 className="fw-bold mb-0">Premium Impact</h6>
                        </div>
                        <span
                            className={`badge ${tierInfo.bgClass} bg-opacity-15 ${tierInfo.textClass} fw-bold px-3 py-2 rounded-pill border ${tierInfo.borderClass} border-opacity-25`}
                        >
                            <i className={`bi ${tierInfo.icon} me-1`}></i>
                            {tierInfo.tier}
                        </span>
                    </div>

                    {/* Current discount */}
                    <div className="d-flex align-items-baseline gap-2 mb-2">
                        <span className="display-6 fw-bold" style={{ color: tierInfo.color }}>{tierInfo.discount}</span>
                        <span className="text-muted fw-semibold">Green Discount</span>
                    </div>
                    <p className="small text-muted mb-0">
                        Your <strong>{policyType}</strong> coverage qualifies for eco-pricing based on a <strong>{score}</strong>-point sustainability index.
                    </p>

                    {/* Next tier progress */}
                    {tierInfo.nextTier && (
                        <div className="mt-3 pt-3 border-top">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="small fw-bold text-dark">
                                    <i className="bi bi-arrow-up-circle me-1 text-success"></i>
                                    Next: {tierInfo.nextTier} ({tierInfo.nextDiscount} discount)
                                </span>
                                <span className="small fw-bold" style={{ color: tierInfo.color }}>
                                    {tierInfo.pointsToNext} pts away
                                </span>
                            </div>
                            <div className="progress rounded-pill" style={{ height: '8px' }}>
                                <div
                                    className="progress-bar rounded-pill"
                                    role="progressbar"
                                    style={{
                                        width: `${progressToNext}%`,
                                        backgroundColor: tierInfo.color,
                                        transition: 'width 1s ease-in-out'
                                    }}
                                    aria-valuenow={progressToNext}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    aria-label={`${tierInfo.pointsToNext} points to ${tierInfo.nextTier} tier`}
                                ></div>
                            </div>

                            {/* Top recommendation hint */}
                            {topRecommendation && (
                                <div className="mt-3 p-2 bg-white rounded-3 border d-flex align-items-start gap-2">
                                    <i className="bi bi-lightbulb text-warning mt-1"></i>
                                    <div>
                                        <span className="small fw-bold text-dark d-block">Quick win</span>
                                        <span className="small text-muted">{topRecommendation.description}</span>
                                        {topRecommendation.estimatedImprovement && (
                                            <span className="small text-success fw-bold d-block mt-1">
                                                +{topRecommendation.estimatedImprovement} pts potential
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Max tier message */}
                    {!tierInfo.nextTier && (
                        <div className="mt-3 pt-3 border-top">
                            <div className="d-flex align-items-center gap-2 text-success">
                                <i className="bi bi-check-circle-fill"></i>
                                <span className="small fw-bold">Maximum discount tier reached</span>
                            </div>
                            <p className="small text-muted mb-0 mt-1">
                                You're earning the highest available green discount. Keep up the sustainable practices!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScoreCard;
