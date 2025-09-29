export type UserRole = 'master' | 'manager' | 'team'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  permissions: Permission[]
}

export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

export interface Business {
  id: string
  name: string
  email: string
  industry: string
  size: 'startup' | 'small' | 'medium' | 'enterprise'
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  subscription: Subscription
  features: Feature[]
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
  onboardedAt?: Date
  contactInfo: ContactInfo
  metrics: BusinessMetrics
}

export interface ContactInfo {
  phone?: string
  address?: string
  website?: string
  contactPerson?: string
  contactEmail?: string
}

export interface BusinessMetrics {
  totalUsers: number
  monthlyRevenue: number
  activeCampaigns: number
  lastActivity: Date
  growthRate: number
}

export interface Subscription {
  id: string
  plan: 'basic' | 'professional' | 'enterprise' | 'custom'
  status: 'active' | 'cancelled' | 'expired' | 'trial'
  startDate: Date
  endDate?: Date
  price: number
  billingCycle: 'monthly' | 'yearly'
  features: string[]
}

export interface Feature {
  id: string
  name: string
  description: string
  category: 'analytics' | 'campaigns' | 'automation' | 'ai' | 'data' | 'business'
  isEnabled: boolean
  isPremium: boolean
  usage?: FeatureUsage
}

export interface FeatureUsage {
  current: number
  limit: number
  resetDate: Date
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  assignedBusinesses: string[]
  performance: PerformanceMetrics
  createdAt: Date
  lastActiveAt?: Date
}

export interface PerformanceMetrics {
  businessesOnboarded: number
  totalRevenue: number
  conversionRate: number
  averageOnboardingTime: number
  monthlyTarget: number
  monthlyAchieved: number
}

export interface DashboardStats {
  totalBusinesses: number
  activeSubscriptions: number
  totalRevenue: number
  monthlyRevenue: number
  growthRate: number
  teamMembers: number
  activeFeatures: number
  systemHealth: 'healthy' | 'warning' | 'critical'
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: Date
  actionUrl?: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId: string
  details: Record<string, unknown>
  ipAddress: string
  userAgent: string
  createdAt: Date
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, unknown>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
