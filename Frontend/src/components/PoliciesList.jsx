import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowRight } from 'lucide-react';

const PoliciesList = () => {
    const navigate = useNavigate();

    // Mock data representing policies fetched from the backend
    const policies = [
        { id: "POL-8024-ESG", holder: "John Doe", type: "AUTO", date: "2026-04-25", score: 85, status: "Excellent" },
        { id: "POL-9102-ESG", holder: "Sarah Jenkins", type: "HOME", date: "2026-04-26", score: 62, status: "Average" },
        { id: "POL-1044-ESG", holder: "Acme Corp", type: "PROPERTY", date: "2026-04-27", score: 30, status: "Outstanding" },
    ];

    return (
        <div className="container-fluid text-start pb-5">
            <div className="d-flex justify-content-between align-items-end mb-5">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Policies</h2>
                    <p className="text-muted mb-0">Manage and review your generated ESG policies.</p>
                </div>
                <button onClick={() => navigate('/')} className="btn btn-eco fw-bold d-flex align-items-center gap-2 px-4 py-2">
                    <Plus size={16} /> New Policy
                </button>
            </div>

            <div className="bg-white p-4 rounded-4 shadow-sm border">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Policies</h5>
                    <div className="position-relative w-25 min-w-200">
                        <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                        <input type="text" className="form-control bg-light border-0 ps-5 py-2" placeholder="Search policies..." />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-muted small text-uppercase tracking-wider">
                            <tr>
                                <th className="py-3 px-4 fw-bold border-0 rounded-start">Policy ID</th>
                                <th className="py-3 fw-bold border-0">Holder</th>
                                <th className="py-3 fw-bold border-0">Type</th>
                                <th className="py-3 fw-bold border-0">Date</th>
                                <th className="py-3 fw-bold border-0">Eco Score</th>
                                <th className="py-3 px-4 fw-bold border-0 text-end rounded-end">Action</th>
                            </tr>
                        </thead>
                        <tbody className="border-top-0">
                            {policies.map(p => (
                                <tr
                                    key={p.id}
                                    className="cursor-pointer transition-all hover-bg-light"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/dashboard/${p.id}`)}
                                >
                                    <td className="px-4 py-3 fw-bold text-dark">{p.id}</td>
                                    <td className="py-3 text-muted fw-bold">{p.holder}</td>
                                    <td className="py-3">
                                        <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 rounded-pill px-3 py-2">
                                            {p.type}
                                        </span>
                                    </td>
                                    <td className="py-3 text-muted small">{p.date}</td>
                                    <td className="py-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="progress bg-light" style={{ width: 60, height: 6 }}>
                                                <div className={`progress-bar ${p.score >= 67 ? 'bg-success' : p.score >= 34 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${p.score}%` }}></div>
                                            </div>
                                            <span className="fw-bold text-dark small">{p.score}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <button className="btn bg-success bg-opacity-10 text-success fw-bold border border-success border-opacity-25 btn-sm d-inline-flex align-items-center gap-1 px-3 py-2">
                                            View Report <ArrowRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PoliciesList;
