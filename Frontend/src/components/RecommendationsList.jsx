const RecommendationsList = ({ recommendations = [], policyType }) => {
    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="p-4 text-center bg-light rounded-4 border border-dashed">
                <i className="bi bi-check-circle text-success fs-1 mb-2 d-block"></i>
                <h6 className="fw-bold text-dark">Maximum Efficiency Reached</h6>
                <p className="small text-muted mb-0">Your {policyType} policy is already highly sustainable. No further improvements needed!</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column gap-3">
            {recommendations.sort((a, b) => a.priority - b.priority).map((rec, idx) => (
                <div
                    key={idx}
                    className="p-3 bg-white border rounded-4 shadow-sm hover-eco-row transition-all d-flex align-items-start gap-3"
                    style={{ borderLeft: '4px solid #4caf50 !important' }}
                >
                    <div className="bg-mint p-2 rounded-circle text-success">
                        <i className="bi bi-lightbulb fs-5"></i>
                    </div>
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="fw-bold text-dark mb-0">{rec.description}</h6>
                            <span className="badge bg-success bg-opacity-10 text-success fw-bold border border-success border-opacity-25 px-2">
                                + {rec.estimatedImprovement} pts
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-muted small">
                                Priority: <span className="text-dark fw-bold">{rec.priority === 1 ? 'High' : rec.priority === 2 ? 'Medium' : 'Low'}</span>
                            </span>
                            {rec.category && <span className="text-muted opacity-25">|</span>}
                            {rec.category && (
                                <span className="text-muted small">
                                    Category: <span className="text-dark fw-bold">{rec.category}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecommendationsList;
