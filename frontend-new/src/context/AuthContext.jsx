import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Configure global axios defaults
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }

    // Base URL for API
    axios.defaults.baseURL = 'http://localhost:8000';

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check expiry
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    // Fetch user profile
                    axios.get('/api/auth/me')
                        .then(res => setUser(res.data))
                        .catch(() => logout())
                        .finally(() => setLoading(false));
                }
            } catch (e) {
                logout();
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            // Form data for OAuth2
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const res = await axios.post('/api/auth/login', formData);
            const access_token = res.data.access_token;

            localStorage.setItem('token', access_token);
            setToken(access_token);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
