// API configuration and utilities

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export class ApiError extends Error {
  status: number;
  errors?: string[];

  constructor(message: string, status: number, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    // Debug logging for auth headers
    if (endpoint.includes('/admin/')) {
      console.log('🔐 API Request with Auth:', {
        endpoint,
        url,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
        headers: config.headers
      });
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.errors
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred',
        0
      );
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('auth_token');
    const hasToken = token && token.trim() !== '';

    // Debug logging for token retrieval
    if (hasToken) {
      console.log('🔑 Auth token retrieved:', {
        tokenPreview: `${token.substring(0, 20)}...`,
        tokenLength: token.length,
        isValid: token.trim() !== ''
      });
    } else {
      console.log('❌ No auth token found in localStorage');
    }

    return hasToken ? token : null;
  }

  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Specific API endpoints
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/dashboard/v1/admin/login', { email, password }),

  logout: () =>
    apiClient.post('/auth/logout'),

  refreshToken: () =>
    apiClient.post('/auth/refresh'),

  getProfile: () =>
    apiClient.get('/auth/profile'),

  getMe: () =>
    apiClient.get('/dashboard/v1/admin/me'),

  updateProfile: (data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    phone_number?: string;
    job_title?: string;
    department?: string;
  }) =>
    apiClient.patch('/dashboard/v1/admin/update', data),
};

export const businessApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get('/dashboard/v1/business', params),

  getOnboardedBusinesses: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get('/dashboard/v1/admin/businesses', params),

  getById: (id: string) =>
    apiClient.get(`/dashboard/v1/business/${id}`),

  create: (data: unknown) =>
    apiClient.post('/dashboard/v1/business', data),

  createBusiness: (data: unknown) =>
    apiClient.post('/dashboard/v1/admin/create-business', data),

  update: (id: string, data: unknown) =>
    apiClient.put(`/dashboard/v1/business/${id}`, data),

  updateBusiness: (id: string, data: {
    name?: string;
    status?: 'active' | 'inactive' | 'onboarding';
    industry?: string;
    business_plan?: string;
    features?: { [key: string]: boolean };
    is_deleted?: boolean;
  }) => {
    console.log('🌐 businessApi.updateBusiness called');
    console.log('🆔 ID:', id);
    console.log('📊 Data:', data);
    console.log('🔗 Endpoint:', `/businesses/${id}`);
    return apiClient.patch(`/dashboard/v1/admin/businesses/${id}`, data);
  },

  delete: (id: string) =>
    apiClient.delete(`/dashboard/v1/business/${id}`),
};

export const teamApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get('/team', params),

  getById: (id: string) =>
    apiClient.get(`/team/${id}`),

  create: (data: unknown) =>
    apiClient.post('/team', data),

  update: (id: string, data: unknown) =>
    apiClient.put(`/team/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/team/${id}`),
};

export const settingsApi = {
  get: () =>
    apiClient.get('/settings'),

  update: (data: unknown) =>
    apiClient.put('/settings', data),
};

// Error handling utility
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};
