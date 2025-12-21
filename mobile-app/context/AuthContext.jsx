import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredUser();
    }, []);

    const loadStoredUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error loading stored user:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            const userData = {
                id: response.user.id,
                email: response.user.email,
            };
            setUser(userData);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            return { data: { user: userData }, error: null };
        } catch (error) {
            return {
                data: null,
                error: { message: error.response?.data?.error || 'Login failed' },
            };
        }
    };

    const register = async (email, password) => {
        try {
            const response = await authAPI.register(email, password);
            const userData = {
                id: response.user.id,
                email: response.user.email,
            };
            setUser(userData);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            return { data: { user: userData }, error: null };
        } catch (error) {
            return {
                data: null,
                error: { message: error.response?.data?.error || 'Registration failed' },
            };
        }
    };

    const logout = async () => {
        authAPI.logout();
        setUser(null);
        await AsyncStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
