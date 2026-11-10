'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, removeToken, setToken } from '../lib/api';
import { User } from '../lib/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const currentToken = getToken();
    if (!currentToken) {
      setUser(null);
      setTokenState(null);
      setIsLoading(false);
      return;
    }

    setTokenState(currentToken);
    try {
      const res = await api.auth.getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('lisso_user', JSON.stringify(res.data.user));
        }
      } else {
        // Check local storage cached user if offline
        const cached = typeof window !== 'undefined' ? localStorage.getItem('lisso_user') : null;
        if (cached) {
          try {
            setUser(JSON.parse(cached));
          } catch {
            removeToken();
            setUser(null);
            setTokenState(null);
          }
        } else {
          removeToken();
          setUser(null);
          setTokenState(null);
        }
      }
    } catch {
      const cached = typeof window !== 'undefined' ? localStorage.getItem('lisso_user') : null;
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          // ignore
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, password);
      if (res.success && res.data) {
        setToken(res.data.token);
        setTokenState(res.data.token);
        setUser(res.data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('lisso_user', JSON.stringify(res.data.user));
        }
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(name, email, password);
      if (res.success && res.data) {
        setToken(res.data.token);
        setTokenState(res.data.token);
        setUser(res.data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('lisso_user', JSON.stringify(res.data.user));
        }
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
