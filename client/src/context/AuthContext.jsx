import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await api.get('/auth/me');
                if (res.data.success) {
                    setUser(res.data.data);
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        if (res.data.success) {
            localStorage.setItem('token', res.data.data.token);
            setUser(res.data.data.user);
            return res.data;
        }
    };

    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);
        if (res.data.success) {
            localStorage.setItem('token', res.data.data.token);
            setUser(res.data.data.user);
            return res.data;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
