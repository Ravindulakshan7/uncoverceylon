'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserSession } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (credentialOrUser: string | { name: string; email: string; image?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to sign in.');
        return false;
      }
      setUser(data.user);
      toast.success(data.message || 'Signed in successfully!');
      closeAuthModal();
      return true;
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to create account.');
        return false;
      }
      setUser(data.user);
      toast.success(data.message || 'Account created successfully!');
      closeAuthModal();
      return true;
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const loginWithGoogle = async (
    credentialOrUser: string | { name: string; email: string; image?: string }
  ): Promise<boolean> => {
    try {
      const body =
        typeof credentialOrUser === 'string'
          ? { credential: credentialOrUser }
          : credentialOrUser;

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Google sign-in failed.');
        return false;
      }
      setUser(data.user);
      toast.success(data.message || 'Signed in with Google!');
      closeAuthModal();
      return true;
    } catch {
      toast.error('Google sign-in encountered an error.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      toast.success('Signed out.');
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshSession,
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
