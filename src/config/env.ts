// Environment configuration with validation

interface EnvConfig {
  apiUrl: string;
  appUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
  logLevel: string;
}

const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_APP_URL',
] as const;

// Validate required environment variables
function validateEnv() {
  const missing = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Validate environment in production
if (process.env.NODE_ENV === 'production') {
  validateEnv();
}

export const env: EnvConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.tribly.ai',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://tribly.ai',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enableErrorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
  logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL || 'info',
};

// API endpoints
export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  businesses: {
    list: '/businesses',
    create: '/businesses',
    update: (id: string) => `/businesses/${id}`,
    delete: (id: string) => `/businesses/${id}`,
  },
  team: {
    list: '/team',
    create: '/team',
    update: (id: string) => `/team/${id}`,
    delete: (id: string) => `/team/${id}`,
  },
  settings: {
    get: '/settings',
    update: '/settings',
  },
} as const;

// Feature flags
export const featureFlags = {
  enableAnalytics: env.enableAnalytics,
  enableErrorReporting: env.enableErrorReporting,
  enableMaintenanceMode: process.env.NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE === 'true',
  enableDarkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === 'true',
} as const;
