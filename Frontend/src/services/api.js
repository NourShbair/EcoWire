import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const apiService = {

    getPolicies: () => api.get('/policies'),

    getPolicyDetails: (id) => api.get(`/policies/${id}`),

    calculatePreview: (data) => api.get('/ecoscore/calculate', { params: data }),

    getScoreBreakdown: (id) => api.get(`/policies/${id}/ecoscore`),

    getRecommendations: (id) => api.get(`/policies/${id}/recommendations`),

    createPolicy: (data) => api.post('/policies', data)
};
