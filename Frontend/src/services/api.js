import axios from 'axios';

// Base Configuration
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request Interceptor (Logging)
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (Error Handling)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Service functions
export const apiService = {

    getPolicies: () => api.get('/policies'),

    getPolicyDetails: (id) => api.get(`/policies/${id}`),

    calculatePreview: (data) => api.get('/ecoscore/calculate', { params: data }),

    getScoreBreakdown: (id) => api.get(`/policies/${id}/ecoscore`),

    getRecommendations: (id) => api.get(`/policies/${id}/recommendations`),

    createPolicy: (data) => api.post('/policies', data)
};

export default api;
