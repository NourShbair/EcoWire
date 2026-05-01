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

const ScoreCard = ({ score, status, discount, policyType }) => {
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

                <div className="text-start bg-light p-4 rounded-4 border">
                    <div className="d-flex align-items-center gap-2 mb-2 text-success">
                        <i className="bi bi-graph-up fs-5"></i>
                        <h6 className="fw-bold mb-0">Premium Impact</h6>
                    </div>
                    <p className="mb-0 text-dark fw-bold fs-5">{discount}</p>
                    <p className="small text-muted mt-2 mb-0">Your <strong>{policyType}</strong> coverage qualifies for specialized eco-pricing based on this <strong>{score}</strong> point sustainability index.</p>
                </div>
            </div>
        </div>
    );
};

export default ScoreCard;
