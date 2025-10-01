'use client';

import React, { forwardRef, useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export interface ImprovedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: boolean;
  validate?: (value: string) => string | null;
  onValidationChange?: (isValid: boolean) => void;
  showValidationIcon?: boolean;
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  errorClassName?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

const ImprovedTextarea = forwardRef<HTMLTextAreaElement, ImprovedTextareaProps>(
  ({
    label,
    error,
    success,
    validate,
    onValidationChange,
    showValidationIcon = true,
    required = false,
    containerClassName,
    labelClassName,
    textareaClassName,
    errorClassName,
    className,
    onBlur,
    onChange,
    onFocus,
    maxLength,
    showCharCount = true,
    ...props
  }, ref) => {
    const [internalError, setInternalError] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [hasBeenTouched, setHasBeenTouched] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(0);

    const currentError = error || internalError;
    const isError = !!currentError && hasBeenTouched;
    const isSuccess = success && !isError && hasBeenTouched;

    // Memoize validation to prevent unnecessary re-renders
    const validateValue = useCallback((value: string) => {
      if (!validate) return null;
      return validate(value);
    }, [validate]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
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

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setCharCount(value.length);

      if (hasBeenTouched && validate) {
        const validationError = validateValue(value);
        setInternalError(validationError);
        onValidationChange?.(!validationError);
      }
      onChange?.(e);
    }, [hasBeenTouched, validate, validateValue, onValidationChange, onChange]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    }, [onFocus]);

    // Memoize the textarea classes to prevent unnecessary re-renders
    const textareaClasses = useMemo(() => cn(
      // Base styles
      "flex min-h-[80px] w-full rounded-[4px] border border-input bg-background px-3 py-2.5 text-sm",
      "ring-offset-background placeholder:text-muted-foreground transition-all duration-200 ease-in-out",
      "resize-none",

      // Focus styles
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",

      // Disabled styles
      "disabled:cursor-not-allowed disabled:opacity-50",

      // Validation styles
      isError && "border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-50",
      isSuccess && "border-green-500 focus-visible:ring-green-500 focus-visible:ring-offset-green-50",

      // Focus state
      isFocused && !isError && !isSuccess && "border-blue-500 focus-visible:ring-blue-500",

      // Hover state
      "hover:border-gray-400",

      className,
      textareaClassName
    ), [isError, isSuccess, isFocused, className, textareaClassName]);

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
          <textarea
            ref={ref}
            className={textareaClasses}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            maxLength={maxLength}
            {...props}
          />

          {showValidationIcon && hasBeenTouched && (
            <div className="absolute right-3 top-3 pointer-events-none">
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

        {/* Character count */}
        {maxLength && showCharCount && (
          <div className="flex justify-end">
            <span className={cn(
              "text-xs text-gray-500",
              charCount > maxLength * 0.9 && "text-amber-600",
              charCount >= maxLength && "text-red-500"
            )}>
              {charCount}/{maxLength}
            </span>
          </div>
        )}

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

ImprovedTextarea.displayName = 'ImprovedTextarea';

export { ImprovedTextarea };
