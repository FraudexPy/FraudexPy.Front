import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { ApiResponse, AuthResponse, User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('fraudex_token');
    const savedUser = localStorage.getItem('fraudex_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('fraudex_token');
        localStorage.removeItem('fraudex_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', {
      emailOrUsername,
      password,
    });

    if (response.data.success && response.data.data) {
      const { token: jwtToken, user: userData } = response.data.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('fraudex_token', jwtToken);
      localStorage.setItem('fraudex_user', JSON.stringify(userData));
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  };

  const register = async (username: string, email: string, password: string, fullName: string) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/register', {
      username,
      email,
      password,
      fullName,
    });

    if (response.data.success && response.data.data) {
      const { token: jwtToken, user: userData } = response.data.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('fraudex_token', jwtToken);
      localStorage.setItem('fraudex_user', JSON.stringify(userData));
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fraudex_token');
    localStorage.removeItem('fraudex_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
