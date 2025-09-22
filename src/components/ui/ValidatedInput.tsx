'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  validate?: (value: string) => string | null;
  onValidationChange?: (isValid: boolean) => void;
  showValidationIcon?: boolean;
  required?: boolean;
}

const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ 
    label, 
    error, 
    success, 
    validate, 
    onValidationChange, 
    showValidationIcon = true,
    required = false,
    className,
    ...props 
  }, ref) => {
    const [internalError, setInternalError] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [hasBeenTouched, setHasBeenTouched] = useState(false);

    const currentError = error || internalError;
    const isError = !!currentError && hasBeenTouched;
    const isSuccess = success && !isError && hasBeenTouched;

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setHasBeenTouched(true);
      if (validate) {
        setIsValidating(true);
        const validationError = validate(e.target.value);
        setInternalError(validationError);
        onValidationChange?.(!validationError);
        setIsValidating(false);
      }
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (hasBeenTouched && validate) {
        const validationError = validate(e.target.value);
        setInternalError(validationError);
        onValidationChange?.(!validationError);
      }
      props.onChange?.(e);
    };

    useEffect(() => {
      if (validate && hasBeenTouched) {
        const validationError = validate(props.value as string || '');
        setInternalError(validationError);
        onValidationChange?.(!validationError);
      }
    }, [validate, hasBeenTouched, props.value, onValidationChange]);

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            className={cn(
              'pr-10',
              isError && 'border-red-500 focus-visible:ring-red-500',
              isSuccess && 'border-green-500 focus-visible:ring-green-500',
              className
            )}
            {...props}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {showValidationIcon && hasBeenTouched && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValidating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              ) : isError ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : isSuccess ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : null}
            </div>
          )}
        </div>
        {isError && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {currentError}
          </p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = 'ValidatedInput';

export { ValidatedInput };
