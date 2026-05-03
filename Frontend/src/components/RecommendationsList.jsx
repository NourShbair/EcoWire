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
                    className="p-3 bg-white border rounded-4 shadow-sm hover-eco-row transition-all d-flex flex-column flex-md-row align-items-start gap-3"
                    style={{ borderLeft: '4px solid #4caf50 !important' }}
                >
                    <div className="bg-mint p-2 rounded-circle text-success flex-shrink-0">
                        <i className="bi bi-lightbulb fs-5"></i>
                    </div>
                    <div className="flex-grow-1 w-100">
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-2">
                            <h6 className="fw-bold text-dark mb-0">{rec.description}</h6>
                            <span className="badge bg-success bg-opacity-10 text-success fw-bold border border-success border-opacity-25 px-2 flex-shrink-0">
                                + {rec.estimatedImprovement} pts
                            </span>
                        </div>
                        <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
                            <div className="bg-light px-2 py-1 rounded small text-muted border">
                                Priority: <span className="text-dark fw-bold">{rec.priority === 1 ? 'High' : rec.priority === 2 ? 'Medium' : 'Low'}</span>
                            </div>
                            {rec.category && (
                                <div className="bg-light px-2 py-1 rounded small text-muted border">
                                    Category: <span className="text-dark fw-bold">{rec.category}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecommendationsList;
