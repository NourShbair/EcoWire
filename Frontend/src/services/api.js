import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
        const token = localStorage.getItem('ecowire_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            localStorage.removeItem('ecowire_token');
            localStorage.removeItem('ecowire_role');
            localStorage.removeItem('ecowire_username');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const apiService = {
    getAllPolicies: () => api.get('policies'),
    getPolicyDetails: (id) => api.get(`policies/${id}`),
    calculatePreview: (data) => api.get('ecoscore/calculate', { params: data }),
    getScoreBreakdown: (id) => api.get(`policies/${id}/ecoscore`),
    getRecommendations: (id) => api.get(`policies/${id}/recommendations`),
    getEcoScoreExplanation: (id) => api.get(`policies/${id}/ecoscore/explanation`),
    createPolicy: (data) => api.post('policies', data),
    deletePolicy: (id) => api.delete(`policies/${id}`),
    updatePolicy: (id, data) => api.put(`policies/${id}`, data)
};

export default api;
