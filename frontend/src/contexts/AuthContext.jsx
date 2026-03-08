import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user from token on startup
    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                if (localStorage.getItem('token')) {
                    const res = await api.get('/auth/me');
                    setUser(res.data.data);
                }
            } catch (err) {
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };
        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        setError(null);
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.data.token);
            setUser(res.data.data);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (name, email, password) => {
        setError(null);
        try {
            const res = await api.post('/auth/register', { name, email, password });
            localStorage.setItem('token', res.data.data.token);
            setUser(res.data.data);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, setError, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
