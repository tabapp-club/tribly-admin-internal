'use client';

import React, { createContext, useContext, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormContextType {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  setTouched: (field: string, touched: boolean) => void;
  validateField: (field: string, value: unknown) => void;
  isSubmitting: boolean;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a Form component');
  }
  return context;
}

interface FormProps {
  children: React.ReactNode;
  onSubmit: (data: unknown) => Promise<void> | void;
  initialValues?: Record<string, unknown>;
  validationSchema?: Record<string, (value: unknown) => string | null>;
  className?: string;
  submitButtonText?: string;
  showSubmitButton?: boolean;
}

export function Form({
  children,
  onSubmit,
  initialValues = {},
  validationSchema = {},
  className,
  submitButtonText = 'Submit',
  showSubmitButton = true,
}: FormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setTouchedField = useCallback((field: string, touched: boolean) => {
    setTouched(prev => ({ ...prev, [field]: touched }));
  }, []);

  const validateField = useCallback((field: string, value: unknown) => {
    const validator = validationSchema[field];
    if (validator) {
      const error = validator(value);
      if (error) {
        setError(field, error);
      } else {
        clearError(field);
      }
    }
  }, [validationSchema, setError, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all fields
      const formData = new FormData(e.target as HTMLFormElement);
      const data: Record<string, unknown> = {};
      
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }

      // Run validation
      let hasErrors = false;
      Object.keys(validationSchema).forEach(field => {
        validateField(field, data[field]);
        if (errors[field]) {
          hasErrors = true;
        }
      });

      if (!hasErrors) {
        await onSubmit(data);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contextValue: FormContextType = {
    errors,
    touched,
    setError,
    clearError,
    setTouched: setTouchedField,
    validateField,
    isSubmitting,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
        {children}
        {showSubmitButton && (
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              submitButtonText
            )}
          </Button>
        )}
      </form>
    </FormContext.Provider>
  );
}
