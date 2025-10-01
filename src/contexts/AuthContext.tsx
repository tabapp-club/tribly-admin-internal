'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  sendOTP: (mobileNumber: string) => Promise<void>;
  verifyOTP: (mobileNumber: string, otp: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session - only run on client side
    const checkAuth = async () => {
      try {
        // Check if we're on the client side
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem('auth_token');
        if (token) {
          // In a real app, validate token with backend
          const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
          setUser(userData);
        } else {
          // No token found, user needs to login
          setUser(null);
        }
      } catch (error) {
        // Authentication failed, user needs to login
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if we have a valid token and user data from the API call
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const userData = typeof window !== 'undefined' ? localStorage.getItem('user_data') : null;

      if (token && userData) {
        // Parse the user data and set it
        const parsedUserData = JSON.parse(userData);

        // Ensure required fields exist with defaults
        if (!parsedUserData.permissions) {
          parsedUserData.permissions = [
            { id: '1', name: 'All Access', description: 'Full system access', resource: '*', action: '*' }
          ];
        }

        if (!parsedUserData.role) {
          parsedUserData.role = 'master';
        }

        if (!parsedUserData.isActive) {
          parsedUserData.isActive = true;
        }

        if (!parsedUserData.createdAt) {
          parsedUserData.createdAt = new Date();
        }

        if (!parsedUserData.updatedAt) {
          parsedUserData.updatedAt = new Date();
        }

        setUser(parsedUserData);
        } else {
          // No valid token or user data found
          throw new Error('No valid authentication data found');
        }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (mobileNumber: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual OTP sending API call
      throw new Error('OTP functionality not implemented');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (mobileNumber: string, otp: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual OTP verification API call
      throw new Error('OTP functionality not implemented');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: new Date()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
      }
      setUser(updatedUser);
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;

    return user.permissions.some(permission =>
      (permission.resource === '*' || permission.resource === resource) &&
      (permission.action === '*' || permission.action === action)
    );
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    sendOTP,
    verifyOTP,
    logout,
    updateUser,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
