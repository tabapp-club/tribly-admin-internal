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
          // Auto-login for development - remove in production
          const mockUser: User = {
            id: '1',
            name: 'Admin User',
            email: 'admin@tribly.com',
            phone: '+91 98765 43210',
            role: 'master',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            permissions: [
              { id: '1', name: 'All Access', description: 'Full system access', resource: '*', action: '*' }
            ],
            jobTitle: 'Platform Administrator',
            department: 'Operations'
          };
          
          localStorage.setItem('auth_token', 'mock_token');
          localStorage.setItem('user_data', JSON.stringify(mockUser));
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Auto-login for development even on error
        const mockUser: User = {
          id: '1',
          name: 'Admin User',
          email: 'admin@tribly.com',
          phone: '+1 (555) 123-4567',
          role: 'master',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: [
            { id: '1', name: 'All Access', description: 'Full system access', resource: '*', action: '*' }
          ],
          jobTitle: 'Platform Administrator',
          department: 'Operations'
        };
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', 'mock_token');
          localStorage.setItem('user_data', JSON.stringify(mockUser));
        }
        setUser(mockUser);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - replace with actual API call
      if (email === 'admin@tribly.com' && password === 'admin123') {
        const mockUser: User = {
          id: '1',
          name: 'Admin User',
          email: 'admin@tribly.com',
          phone: '+1 (555) 123-4567',
          role: 'master',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: [
            { id: '1', name: 'All Access', description: 'Full system access', resource: '*', action: '*' }
          ],
          jobTitle: 'Platform Administrator',
          department: 'Operations'
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', 'mock_token');
          localStorage.setItem('user_data', JSON.stringify(mockUser));
        }
        setUser(mockUser);
      } else {
        throw new Error('Invalid credentials');
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
      // Mock OTP sending - replace with actual API call
      // In a real app, this would send an SMS to the mobile number
      console.log(`Sending OTP to ${mobileNumber}`);
      
      // Store the mobile number temporarily for verification
      if (typeof window !== 'undefined') {
        localStorage.setItem('pending_mobile', mobileNumber);
        // Store a mock OTP for demo purposes
        localStorage.setItem('pending_otp', '123456');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (mobileNumber: string, otp: string) => {
    setIsLoading(true);
    try {
      // Mock OTP verification - replace with actual API call
      const storedMobile = typeof window !== 'undefined' ? localStorage.getItem('pending_mobile') : null;
      const storedOTP = typeof window !== 'undefined' ? localStorage.getItem('pending_otp') : null;
      
      if (storedMobile === mobileNumber && storedOTP === otp) {
        // Find user by mobile number or create new user
        const mockUser: User = {
          id: '1',
          name: 'Admin User',
          email: 'admin@tribly.com',
          phone: mobileNumber,
          role: 'master',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: [
            { id: '1', name: 'All Access', description: 'Full system access', resource: '*', action: '*' }
          ],
          jobTitle: 'Platform Administrator',
          department: 'Operations'
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', 'mock_token');
          localStorage.setItem('user_data', JSON.stringify(mockUser));
          localStorage.removeItem('pending_mobile');
          localStorage.removeItem('pending_otp');
        }
        setUser(mockUser);
      } else {
        throw new Error('Invalid OTP');
      }
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