import axios from 'axios';
const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});
export const apiService = {
    // Policy Management
    getAllPolicies: () => api.get('/policies'),
    getPolicyById: (id) => api.get(`/policies/${id}`),
    createPolicy: (data) => api.post('/policies', data),

    // Eco-Scoring
    calculateScorePreview: (params) => api.get('/ecoscore/calculate', { params }),
    getScoreBreakdown: (id) => api.get(`/policies/${id}/ecoscore`),

    // Recommendations
    getRecommendations: (id) => api.get(`/policies/${id}/recommendations`)
};