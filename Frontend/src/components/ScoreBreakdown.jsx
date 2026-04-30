import React from 'react';
import { Activity } from 'lucide-react';

const ScoreBreakdown = ({ breakdownItems = [] }) => {
    return (
        <div className="p-4 bg-white shadow-sm border rounded-4">
            <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
                <Activity size={20} className="text-success" />
                <h6 className="fw-bold mb-0">Sustainability Breakdown</h6>
            </div>
            <div className="d-flex flex-column gap-4 mt-4 px-2">
                {breakdownItems.length > 0 ? breakdownItems.map((item, idx) => {
                    const percentage = Math.round((item.value / item.max) * 100);
                    return (
                        <div key={idx} className="d-flex align-items-center gap-3">
                            {/* Percentage Circle */}
                            <div 
                                className={percentage > 0 ? "bg-mint text-success fw-bold d-flex align-items-center justify-content-center shadow-sm" : "bg-light text-muted fw-bold d-flex align-items-center justify-content-center opacity-75"}
                                style={{ 
                                    minWidth: '45px', 
                                    height: '45px', 
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    border: percentage > 0 ? '1px solid rgba(25, 135, 84, 0.1)' : '1px solid #e2e8f0'
                                }}
                            >
                                {percentage}%
                            </div>

                            <div className="flex-grow-1">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className={percentage > 0 ? "fw-bold text-dark" : "fw-medium text-muted"}>{item.label}</span>
                                    <span className={percentage > 0 ? "fw-bold text-success small" : "text-muted small"}>{item.value} / {item.max}</span>
                                </div>
                                <div className="progress rounded-pill" style={{ height: '8px', backgroundColor: '#f0f2f0' }}>
                                    <div
                                        className="progress-bar rounded-pill shadow-sm"
                                        role="progressbar"
                                        style={{
                                            width: `${Math.max(percentage, 2)}%`,
                                            backgroundColor: percentage > 0 ? item.color : '#e2e8f0',
                                            transition: 'width 1s ease-in-out',
                                            opacity: percentage > 0 ? 1 : 0.5
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <p className="text-muted small italic">No breakdown available for this policy.</p>
                )}
            </div>
        </div>
    );
};

export default ScoreBreakdown;
