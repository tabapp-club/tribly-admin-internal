'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, UserRole } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (resource: string, action: string) => boolean
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // In a real app, validate token with backend
          const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock login - replace with actual API call
      if (email === 'admin@tribly.com' && password === 'admin123') {
        const mockUser: User = {
          id: '1',
          name: 'Admin User',
          email: 'admin@tribly.com',
          role: 'master',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          permissions: [
            { id: '1', name: 'All Access', description: 'Full system access', resource: '*', action: '*' }
          ]
        }

        localStorage.setItem('auth_token', 'mock_token')
        localStorage.setItem('user_data', JSON.stringify(mockUser))
        setUser(mockUser)
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false

    // Master role has all permissions
    if (user.role === 'master') return true

    return user.permissions.some(
      permission =>
        (permission.resource === '*' || permission.resource === resource) &&
        (permission.action === '*' || permission.action === action)
    )
  }

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false

    const roleHierarchy = { master: 3, manager: 2, team: 1 }
    return roleHierarchy[user.role] >= roleHierarchy[role]
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
