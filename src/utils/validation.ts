// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (supports international formats)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// URL validation
export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// PAN validation (Indian PAN format)
export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

// GST validation (Indian GST format)
export const validateGST = (gst: string): boolean => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Required field validation
export const validateRequired = (value: string | string[]): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0 && value.every(item => item.trim() !== '');
  }
  return value.trim() !== '';
};

// Minimum length validation
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

// Maximum length validation
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

// Numeric validation
export const validateNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};

// Alphanumeric validation
export const validateAlphanumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value);
};

// Date validation
export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// Future date validation
export const validateFutureDate = (date: string): boolean => {
  const dateObj = new Date(date);
  const today = new Date();
  return dateObj > today;
};

// Past date validation
export const validatePastDate = (date: string): boolean => {
  const dateObj = new Date(date);
  const today = new Date();
  return dateObj < today;
};

// Form validation helper
export const validateForm = <T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, (value: unknown) => string | null>
): Record<keyof T, string> => {
  const errors: Record<keyof T, string> = {} as Record<keyof T, string>;
  
  Object.keys(rules).forEach((key) => {
    const field = key as keyof T;
    const validator = rules[field];
    const error = validator(data[field]);
    
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
};
