// Production-ready error handling utilities

import { logger } from './logger';

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  isOperational?: boolean;
  context?: Record<string, unknown>;
}

export class CustomError extends Error implements AppError {
  public readonly code?: string;
  public readonly statusCode?: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code?: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Predefined error types
export class ValidationError extends CustomError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, true, context);
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND_ERROR', 404);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONFLICT_ERROR', 409, true, context);
  }
}

export class RateLimitError extends CustomError {
  constructor(message: string = 'Too many requests') {
    super(message, 'RATE_LIMIT_ERROR', 429);
  }
}

export class ServerError extends CustomError {
  constructor(message: string = 'Internal server error', context?: Record<string, unknown>) {
    super(message, 'SERVER_ERROR', 500, false, context);
  }
}

// Error handler for async functions
export function asyncHandler<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw handleError(error);
    }
  };
}

// Error handler for sync functions
export function syncHandler<T extends unknown[], R>(
  fn: (...args: T) => R
) {
  return (...args: T): R => {
    try {
      return fn(...args);
    } catch (error) {
      throw handleError(error);
    }
  };
}

// Main error handling function
export function handleError(error: unknown): AppError {
  // If it's already our custom error, return it
  if (error instanceof CustomError) {
    return error;
  }

  // Handle different error types
  if (error instanceof Error) {
    // Network errors
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return new ServerError('Network error occurred', { originalError: error.message });
    }

    // Validation errors from libraries
    if (error.name === 'ValidationError') {
      return new ValidationError(error.message);
    }

    // Generic error
    return new ServerError(error.message, { originalError: error.message });
  }

  // Unknown error type
  return new ServerError('An unknown error occurred', { originalError: String(error) });
}

// Error boundary helper
export function getErrorBoundaryProps(error: AppError) {
  return {
    title: getErrorTitle(error),
    message: getErrorMessage(error),
    shouldRetry: error.isOperational && error.statusCode !== 401 && error.statusCode !== 403,
    shouldReport: !error.isOperational,
  };
}

function getErrorTitle(error: AppError): string {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      return 'Validation Error';
    case 'AUTHENTICATION_ERROR':
      return 'Authentication Required';
    case 'AUTHORIZATION_ERROR':
      return 'Access Denied';
    case 'NOT_FOUND_ERROR':
      return 'Not Found';
    case 'CONFLICT_ERROR':
      return 'Conflict';
    case 'RATE_LIMIT_ERROR':
      return 'Too Many Requests';
    case 'SERVER_ERROR':
      return 'Server Error';
    default:
      return 'Something went wrong';
  }
}

function getErrorMessage(error: AppError): string {
  if (error.isOperational) {
    return error.message;
  }

  return process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred. Please try again later.'
    : error.message;
}

// Global error handler
export function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled Promise Rejection', event.reason);
    event.preventDefault();
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    logger.error('Uncaught Error', event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });
}

// Error reporting to external service
export async function reportError(error: AppError, context?: Record<string, unknown>) {
  try {
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: context });
    }
  } catch (reportingError) {
    logger.error('Failed to report error', reportingError as Error);
  }
}
