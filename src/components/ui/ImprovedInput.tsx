'use client';

import React, { forwardRef, useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export interface ImprovedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  validate?: (value: string) => string | null;
  onValidationChange?: (isValid: boolean) => void;
  showValidationIcon?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

const ImprovedInput = forwardRef<HTMLInputElement, ImprovedInputProps>(
  ({ 
    label, 
    error, 
    success, 
    validate, 
    onValidationChange,
    showValidationIcon = true,
    required = false,
    icon,
    containerClassName,
    labelClassName,
    inputClassName,
    errorClassName,
    className,
    onBlur,
    onChange,
    ...props 
  }, ref) => {
    const [internalError, setInternalError] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [hasBeenTouched, setHasBeenTouched] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const currentError = error || internalError;
    const isError = !!currentError && hasBeenTouched;
    const isSuccess = success && !isError && hasBeenTouched;

    // Memoize validation to prevent unnecessary re-renders
    const validateValue = useCallback((value: string) => {
      if (!validate) return null;
      return validate(value);
    }, [validate]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setHasBeenTouched(true);
      setIsFocused(false);
      
      if (validate) {
        setIsValidating(true);
        // Use setTimeout to prevent blocking the UI
        setTimeout(() => {
          const validationError = validateValue(e.target.value);
          setInternalError(validationError);
          onValidationChange?.(!validationError);
          setIsValidating(false);
        }, 0);
      }
      onBlur?.(e);
    }, [validate, validateValue, onValidationChange, onBlur]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (hasBeenTouched && validate) {
        const validationError = validateValue(e.target.value);
        setInternalError(validationError);
        onValidationChange?.(!validationError);
      }
      onChange?.(e);
    }, [hasBeenTouched, validate, validateValue, onValidationChange, onChange]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    }, [props.onFocus]);

    // Memoize the input classes to prevent unnecessary re-renders
    const inputClasses = useMemo(() => cn(
      // Base styles
      "flex h-11 w-full rounded-[4px] border border-input bg-background px-3 py-2.5 text-sm",
      "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground transition-all duration-200 ease-in-out",
      
      // Focus styles
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      
      // Disabled styles
      "disabled:cursor-not-allowed disabled:opacity-50",
      
      // Icon padding
      icon && "pl-10",
      
      // Validation styles
      isError && "border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-50",
      isSuccess && "border-green-500 focus-visible:ring-green-500 focus-visible:ring-offset-green-50",
      
      // Focus state
      isFocused && !isError && !isSuccess && "border-blue-500 focus-visible:ring-blue-500",
      
      // Hover state
      "hover:border-gray-400",
      
      className,
      inputClassName
    ), [icon, isError, isSuccess, isFocused, className, inputClassName]);

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label 
            htmlFor={props.id} 
            className={cn(
              "block text-sm font-medium text-gray-700 transition-colors duration-200",
              isError && "text-red-700",
              isSuccess && "text-green-700",
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            {...props}
          />
          
          {showValidationIcon && hasBeenTouched && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {isValidating ? (
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              ) : isError ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : isSuccess ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : null}
            </div>
          )}
        </div>
        
        {isError && (
          <p className={cn(
            "text-sm text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200",
            errorClassName
          )}>
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            <span>{currentError}</span>
          </p>
        )}
      </div>
    );
  }
);

ImprovedInput.displayName = 'ImprovedInput';

export { ImprovedInput };
