import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Loader2, Trash2 } from 'lucide-react';

const PoliciesList = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [policyToDelete, setPolicyToDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const fetchPolicies = () => {
        setLoading(true);
        apiService.getAllPolicies()
            .then(res => setPolicies(res.data))
            .catch(err => console.error("List fetch failed", err))
            .finally(() => setLoading(false));
    };

    const handleDeleteClick = (policy) => {
        setPolicyToDelete(policy);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!policyToDelete) return;

        const id = policyToDelete.policyId;
        setDeletingId(id);
        try {
            await apiService.deletePolicy(id);
            setPolicies(prev => prev.filter(p => p.policyId !== id));
            setShowDeleteModal(false);
            setPolicyToDelete(null);
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete policy. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + 
               ' ' + 
               date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    const filteredPolicies = policies.filter(p =>
        p.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.policyType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.policyId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold text-dark mb-1" style={{ fontSize: '2.5rem' }}>Policies</h1>
                    <p className="text-muted mb-0">Manage and review your generated ESG policies.</p>
                </div>
                <button 
                    onClick={() => navigate('/')}
                    className="btn btn-eco px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                >
                    <Plus size={20} /> New Policy
                </button>
            </div>

            {/* Table Container */}
            <div className="card border shadow-sm mt-5" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold text-dark mb-0">Policies</h5>
                    <div className="position-relative" style={{ width: '320px' }}>
                        <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
                        <input
                            type="text"
                            className="form-control ps-5 border-0 bg-light py-2"
                            style={{ borderRadius: '10px' }}
                            placeholder="Search policies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th className="py-3 px-4 border-0 text-dark small fw-bold" style={{ backgroundColor: 'inherit' }}>POLICY ID</th>
                                <th className="py-3 border-0 text-dark small fw-bold" style={{ backgroundColor: 'inherit' }}>HOLDER</th>
                                <th className="py-3 border-0 text-dark small fw-bold text-center" style={{ backgroundColor: 'inherit' }}>TYPE</th>
                                <th className="py-3 border-0 text-dark small fw-bold" style={{ backgroundColor: 'inherit' }}>DATE</th>
                                <th className="py-3 border-0 text-dark small fw-bold" style={{ backgroundColor: 'inherit' }}>ECO SCORE</th>
                                <th className="py-3 px-4 border-0 text-dark small fw-bold text-end" style={{ backgroundColor: 'inherit' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <Loader2 size={40} className="animate-spin text-success mx-auto mb-2" />
                                        <p className="text-muted">Loading policies...</p>
                                    </td>
                                </tr>
                            ) : filteredPolicies.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="text-muted mb-2">No policies found.</div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPolicies.map((p) => {
                                    const score = p.ecoScore?.totalScore || 0;
                                    const scoreColor = score >= 67 ? "#1a5f49" : score >= 34 ? "#ffc107" : "#dc3545";

                                    return (
                                        <tr key={p.policyId} className="border-bottom">
                                            <td className="py-4 px-4 fw-bold text-dark">
                                                {p.policyId}
                                            </td>
                                            <td className="py-4">
                                                <div className="fw-bold text-dark">{p.customerName}</div>
                                                <div className="small text-muted fw-normal opacity-75">{p.contactInfo}</div>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className="badge rounded-pill px-3 py-2 text-muted fw-bold" style={{ backgroundColor: '#f0f2f5', fontSize: '0.75rem' }}>
                                                    {p.policyType}
                                                </span>
                                            </td>
                                            <td className="py-4 text-muted small fw-bold">
                                                {formatDate(p.createdDate)}
                                            </td>
                                            <td className="py-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="progress flex-grow-1" style={{ height: '6px', width: '80px', backgroundColor: '#e9ecef' }}>
                                                        <div
                                                            className="progress-bar rounded-pill"
                                                            style={{ width: `${score}%`, backgroundColor: scoreColor }}
                                                        ></div>
                                                    </div>
                                                    <span className="fw-bold text-dark" style={{ minWidth: '25px' }}>{score}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-end">
                                                <div className="d-flex justify-content-end align-items-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/dashboard/${p.policyId}`)}
                                                        className="btn btn-sm btn-hover-eco fw-bold border-0 px-3 py-2 d-inline-flex align-items-center gap-2"
                                                        style={{ backgroundColor: '#f8fbf9', color: '#1a5f49', fontSize: '0.85rem', borderRadius: '6px' }}
                                                    >
                                                        View Report <span style={{ fontSize: '1.1rem', marginTop: '-1px' }}>→</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(p)}
                                                        disabled={deletingId === p.policyId}
                                                        className="btn btn-sm btn-outline-danger border-0 p-2 d-inline-flex align-items-center justify-content-center"
                                                        style={{ borderRadius: '6px', width: '36px', height: '36px' }}
                                                        title="Delete Policy"
                                                    >
                                                        {deletingId === p.policyId ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={16} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                            <div className="modal-body p-5 text-center">
                                <div className="mb-4 text-danger">
                                    <Trash2 size={64} className="opacity-75" />
                                </div>
                                <h3 className="fw-bold text-dark mb-3">Delete Policy?</h3>
                                <p className="text-muted mb-4">
                                    Are you sure you want to delete the policy for <span className="fw-bold text-dark">{policyToDelete?.customerName}</span>? 
                                    <br />This action cannot be undone.
                                </p>
                                <div className="d-flex gap-3 justify-content-center">
                                    <button 
                                        type="button" 
                                        className="btn btn-light px-4 py-2 fw-bold text-muted border-0" 
                                        style={{ borderRadius: '10px' }}
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-danger px-4 py-2 fw-bold d-flex align-items-center gap-2"
                                        style={{ borderRadius: '10px' }}
                                        onClick={confirmDelete}
                                        disabled={!!deletingId}
                                    >
                                        {deletingId ? <Loader2 size={18} className="animate-spin" /> : 'Delete Policy'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PoliciesList;
