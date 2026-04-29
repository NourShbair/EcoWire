import { Lightbulb, CheckCircle2 } from 'lucide-react';

const RecommendationsList = ({ recommendations = [], policyType }) => {
    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="p-4 text-center bg-light rounded-4 border border-dashed">
                <CheckCircle2 className="mx-auto mb-2 text-success" size={32} />
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
                        <Lightbulb size={20} />
                    </div>
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="fw-bold text-dark mb-0">{rec.description}</h6>
                            <span className="badge bg-success bg-opacity-10 text-success fw-bold border border-success border-opacity-25 px-2">
                                + {rec.estimatedImprovement} pts
                            </span>
                        </div>
                        <p className="small text-muted mb-0">
                            Priority: {rec.priority === 1 ? 'High' : rec.priority === 2 ? 'Medium' : 'Low'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecommendationsList;
