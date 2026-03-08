import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to inject JWT strictly and Multi-Tenant identifier transparently
api.interceptors.request.use(
    (config) => {
        config.headers['x-tenant-id'] = 'tenant-test-123'; // Fixed default tenant for this demo

        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
