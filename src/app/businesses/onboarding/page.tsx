'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImprovedInput } from '@/components/ui/ImprovedInput';
import { ImprovedTextarea } from '@/components/ui/ImprovedTextarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle,
  Users,
  DollarSign,
  Target,
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  UserCheck,
  ChevronDown,
  Briefcase,
  Home,
  FileCheck,
  Settings,
  Send,
  Loader2,
  Save,
  AlertTriangle,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

interface TabItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

interface FormData {
  brandName: string;
  businessType: string;
  website: string;
  description: string;
  businessEmails: string[];
  businessPhones: string[];
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  gstNumber: string;
  panNumber: string;
  businessRegistrationNumber: string;
  posSystem: string;
  posProvider: string;
  posVersion: string;
  terminalId: string;
  serialNumber: string;
  installationDate: string;
  licenseKey: string;
  pocName: string;
  pocEmail: string;
  pocPhone: string;
  pocDesignation: string;
}

interface ValidationErrors {
  [key: string]: string | string[];
}

interface LoadingState {
  saving: boolean;
  submitting: boolean;
  validating: boolean;
  [key: string]: boolean;
}

interface AutoSaveState {
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  isAutoSaving: boolean;
}

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

const validateURL = (url: string): boolean => {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

const validateGST = (gst: string): boolean => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

export default function BusinessOnboardingPage() {
  const router = useRouter();
  const { isLoading } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [formData, setFormData] = useState({
    // Basic Information
    brandName: '',
    businessType: '',
    website: '',
    description: '',

    // Contact Information
    businessEmails: [''],
    businessPhones: [''],

    // Business Address
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',

    // Business Registration
    gstNumber: '',
    panNumber: '',
    businessRegistrationNumber: '',

    // POS System Details
    posSystem: '',
    posProvider: '',
    posVersion: '',
    terminalId: '',
    serialNumber: '',
    installationDate: '',
    licenseKey: '',

    // Primary POC Details
    pocName: '',
    pocEmail: '',
    pocPhone: '',
    pocDesignation: ''
  });

  // Production-ready state management
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loadingState, setLoadingState] = useState<LoadingState>({
    saving: false,
    submitting: false,
    validating: false,
  });
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>({
    lastSaved: null,
    hasUnsavedChanges: false,
    isAutoSaving: false,
  });
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const tabs: TabItem[] = [
    {
      id: 'basic-info',
      title: 'Basic information',
      description: 'Brand name, business type, and website',
      icon: Briefcase,
      completed: !!(formData.brandName && formData.businessType && formData.website)
    },
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'Business emails and phone numbers',
      icon: Mail,
      completed: !!(formData.businessEmails.some(email => email.trim()) && formData.businessPhones.some(phone => phone.trim()))
    },
    {
      id: 'business-address',
      title: 'Business address',
      description: 'Physical location and address',
      icon: Home,
      completed: !!(formData.streetAddress && formData.city && formData.state && formData.zipCode)
    },
    {
      id: 'business-registration',
      title: 'Business registration',
      description: 'GST, PAN, and registration details',
      icon: FileCheck,
      completed: !!(formData.gstNumber && formData.panNumber && formData.businessRegistrationNumber)
    },
    {
      id: 'pos-accounting',
      title: 'POS System Details',
      description: 'POS system and configuration',
      icon: Settings,
      completed: !!(formData.posSystem && formData.posProvider && formData.terminalId)
    },
    {
      id: 'primary-poc',
      title: 'Primary POC details',
      description: 'Main point of contact info',
      icon: UserCheck,
      completed: !!(formData.pocName && formData.pocEmail && formData.pocPhone)
    },
    {
      id: 'agreements-welcome',
      title: 'Documents & Welcome Kit',
      description: 'Send agreement and welcome kit',
      icon: Send,
      completed: false // This tab is always accessible after account creation
    }
  ];

  const businessTypes = [
    'Retail', 'Restaurant', 'Services', 'Manufacturing', 'Wholesale', 'E-commerce', 'Consulting', 'Other'
  ];

  const countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Other'
  ];

  const posSystems = [
    'Square', 'Shopify POS', 'Clover', 'Toast', 'Lightspeed', 'Revel Systems',
    'NCR Silver', 'Vend', 'QuickBooks POS', 'Other'
  ];

  // Comprehensive validation function
  const validateField = useCallback((field: string, value: string | string[]): string | null => {
    switch (field) {
      case 'brandName':
        if (typeof value !== 'string') return 'Invalid value type';
        if (!value.trim()) return 'Brand name is required';
        if (value.trim().length < 2) return 'Brand name must be at least 2 characters';
        if (value.trim().length > 100) return 'Brand name must be less than 100 characters';
        return null;
      
      case 'businessType':
        if (typeof value !== 'string') return 'Invalid value type';
        if (!value) return 'Business type is required';
        return null;
      
      case 'website':
        if (typeof value !== 'string') return 'Invalid value type';
        if (value && !validateURL(value)) return 'Please enter a valid website URL';
        return null;
      
      case 'description':
        if (typeof value !== 'string') return 'Invalid value type';
        if (value && value.length > 500) return 'Description must be less than 500 characters';
        return null;
      
      case 'streetAddress':
        if (typeof value !== 'string') return 'Invalid value type';
        if (!value.trim()) return 'Street address is required';
        if (value.trim().length < 5) return 'Street address must be at least 5 characters';
        return null;
      
      case 'city':
        if (typeof value !== 'string') return 'Invalid value type';
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'City must be at least 2 characters';
        return null;
      
      case 'state':
        if (typeof value !== 'string') return 'Invalid value type';
        if (!value.trim()) return 'State is required';
        if (value.trim().length < 2) return 'State must be at least 2 characters';
        return null;
      
      case 'zipCode':
        if (typeof value !== 'string') return 'Invalid value type';
        if (!value.trim()) return 'ZIP code is required';
        if (!/^\d{5,6}$/.test(value.trim())) return 'Please enter a valid ZIP code';
        return null;
      
      case 'country':
        if (typeof value !== 'string') return 'Invalid value type';
        if (!value) return 'Country is required';
        return null;
      
      case 'gstNumber':
        if (typeof value !== 'string') return 'Invalid value type';
        if (value && !validateGST(value)) return 'Please enter a valid GST number';
        return null;
      
      case 'panNumber':
        if (typeof value !== 'string') return 'Invalid value type';
        if (value && !validatePAN(value)) return 'Please enter a valid PAN number';
        return null;
      
      case 'pocName':
        if (typeof value !== 'string') return 'Invalid value type';
        if (!value.trim()) return 'POC name is required';
        if (value.trim().length < 2) return 'POC name must be at least 2 characters';
        return null;
      
      case 'pocEmail':
        if (typeof value !== 'string') return 'Invalid value type';
        if (!value.trim()) return 'POC email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        return null;
      
      case 'pocPhone':
        if (typeof value !== 'string') return 'Invalid value type';
        if (!value.trim()) return 'POC phone is required';
        if (!validatePhone(value)) return 'Please enter a valid phone number';
        return null;
      
      case 'pocDesignation':
        if (typeof value !== 'string') return 'Invalid value type';
        if (!value.trim()) return 'POC designation is required';
        if (value.trim().length < 2) return 'POC designation must be at least 2 characters';
        return null;
      
      case 'businessEmails':
        if (!Array.isArray(value)) return 'Invalid value type';
        if (value.length === 0 || !value.some(email => email.trim())) return 'At least one business email is required';
        for (const email of value) {
          if (email.trim() && !validateEmail(email)) return 'Please enter a valid email address';
        }
        return null;
      
      case 'businessPhones':
        if (!Array.isArray(value)) return 'Invalid value type';
        if (value.length === 0 || !value.some(phone => phone.trim())) return 'At least one business phone is required';
        for (const phone of value) {
          if (phone.trim() && !validatePhone(phone)) return 'Please enter a valid phone number';
        }
        return null;
      
      default:
        return null;
    }
  }, []);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Required fields validation
    const requiredFields = [
      'brandName', 'businessType', 'businessEmails', 'businessPhones', 'streetAddress', 'city', 'state', 
      'zipCode', 'country', 'pocName', 'pocEmail', 'pocPhone', 'pocDesignation'
    ];

    requiredFields.forEach(field => {
      const fieldValue = formData[field as keyof FormData];
      const error = validateField(field, fieldValue);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    // Optional fields validation
    const optionalFields = ['website', 'description', 'gstNumber', 'panNumber'];
    optionalFields.forEach(field => {
      const fieldValue = formData[field as keyof FormData];
      if (fieldValue) {
        const error = validateField(field, fieldValue);
        if (error) {
          errors[field] = error;
          isValid = false;
        }
      }
    });

    setValidationErrors(errors);
    setIsFormValid(isValid);
    return isValid;
  }, [formData, validateField]);

  // Enhanced input change handler with validation
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => new Set([...prev, field]));
    
    // Clear error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Mark as having unsaved changes
    setAutoSaveState(prev => ({ ...prev, hasUnsavedChanges: true }));

    // Auto-save after 2 seconds of inactivity
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleAutoSave();
    }, 2000);
  }, [validationErrors]);

  // Handle array input changes (for emails and phones)
  const handleArrayInputChange = useCallback((field: 'businessEmails' | 'businessPhones', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
    setTouchedFields(prev => new Set([...prev, field]));
    
    // Clear error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Mark as having unsaved changes
    setAutoSaveState(prev => ({ ...prev, hasUnsavedChanges: true }));

    // Auto-save after 2 seconds of inactivity
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleAutoSave();
    }, 2000);
  }, [validationErrors]);

  // Add new email/phone input
  const addArrayInput = useCallback((field: 'businessEmails' | 'businessPhones') => {
    if (formData[field].length < 3) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], '']
      }));
    }
  }, [formData]);

  // Remove email/phone input
  const removeArrayInput = useCallback((field: 'businessEmails' | 'businessPhones', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  }, [formData]);

  // Auto-save functionality
  const handleAutoSave = useCallback(async () => {
    if (!autoSaveState.hasUnsavedChanges) return;

    setAutoSaveState(prev => ({ ...prev, isAutoSaving: true }));
    setLoadingState(prev => ({ ...prev, saving: true }));

    try {
      // Simulate API call for auto-save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAutoSaveState(prev => ({
        ...prev,
        hasUnsavedChanges: false,
        isAutoSaving: false,
        lastSaved: new Date()
      }));

      addNotification({
        title: 'Draft Saved',
        message: 'Your progress has been automatically saved.',
        type: 'success',
        isRead: false
      });
    } catch (error) {
      addNotification({
        title: 'Auto-save Failed',
        message: 'Failed to save your progress. Please try again.',
        type: 'error',
        isRead: false
      });
    } finally {
      setLoadingState(prev => ({ ...prev, saving: false }));
    }
  }, [autoSaveState.hasUnsavedChanges, addNotification]);

  // Enhanced submit handler
  const handleSubmit = useCallback(async () => {
    console.log('handleSubmit called');
    if (!validateForm()) {
      console.log('Form validation failed');
      addNotification({
        title: 'Validation Error',
        message: 'Please fix all validation errors before submitting.',
        type: 'error',
        isRead: false
      });
      return;
    }

    console.log('Form validation passed, starting submission');
    setLoadingState(prev => ({ ...prev, submitting: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create business object from form data
      const newBusiness = {
        id: Date.now(), // Simple ID generation
        name: formData.brandName,
        industry: formData.businessType,
        status: 'active' as const,
        userType: 'trial' as const, // Default to trial for new businesses
        subscription: 'Individual', // Default subscription
        revenue: 0,
        users: 1, // Default to 1 user (the POC)
        onboardedAt: new Date().toISOString().split('T')[0],
        lastActivity: 'Just now',
        assignedTo: formData.pocName,
        features: ['Tribly AI for Business'], // Default features
        growthRate: 0,
        mrr: 0,
        churnRisk: 'low' as const
      };

      // Save to localStorage
      try {
        const existingBusinesses = localStorage.getItem('onboardedBusinesses');
        const businesses = existingBusinesses ? JSON.parse(existingBusinesses) : [];
        businesses.push(newBusiness);
        localStorage.setItem('onboardedBusinesses', JSON.stringify(businesses));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('businessCreated', { detail: newBusiness }));
      } catch (error) {
        console.error('Error saving business to localStorage:', error);
      }
      
      addNotification({
        title: 'Business Onboarded Successfully!',
        message: `${formData.brandName} has been successfully onboarded and is ready to use.`,
        type: 'success',
        isRead: false
      });

      // Close submit dialog and show success modal
      console.log('Showing success modal');
      setShowSubmitDialog(false);
      setShowSuccessModal(true);
    } catch (error) {
      addNotification({
        title: 'Submission Failed',
        message: 'Failed to submit the form. Please try again.',
        type: 'error',
        isRead: false
      });
      
      // Show failed modal
      console.log('Showing failed modal');
      setShowFailedModal(true);
    } finally {
      setLoadingState(prev => ({ ...prev, submitting: false }));
      setShowSubmitDialog(false);
    }
  }, [formData, validateForm, addNotification, router]);

  // Handle exit with unsaved changes
  const handleExit = useCallback(() => {
    if (autoSaveState.hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      router.back();
    }
  }, [autoSaveState.hasUnsavedChanges, router]);

  // Confirm exit
  const confirmExit = useCallback(() => {
    setShowExitDialog(false);
    router.back();
  }, [router]);

  // Confirm submit
  const confirmSubmit = useCallback(() => {
    console.log('confirmSubmit called, showing submit dialog');
    setShowSubmitDialog(true);
  }, []);

  // Cancel submit
  const cancelSubmit = useCallback(() => {
    setShowSubmitDialog(false);
  }, []);

  // Check if current tab's mandatory fields are filled
  const isCurrentTabValid = useCallback((): boolean => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (!currentTab) return false;
    
    // Only check fields that are actually marked as required in the form
    switch (activeTab) {
      case 'basic-info':
        // Only brandName and businessType are required (website is optional)
        return !!(formData.brandName && formData.businessType);
      case 'contact-info':
        // At least one email and one phone are required
        return !!(formData.businessEmails.some(email => email.trim()) && formData.businessPhones.some(phone => phone.trim()));
      case 'business-address':
        // All address fields are required
        return !!(formData.streetAddress && formData.city && formData.state && formData.zipCode && formData.country);
      case 'business-registration':
        // All fields are optional in this tab, so always allow navigation
        return true;
      case 'pos-accounting':
        // All fields are optional in this tab, so always allow navigation
        return true;
      case 'primary-poc':
        // All POC fields are required
        const pocValid = !!(formData.pocName && formData.pocEmail && formData.pocPhone && formData.pocDesignation);
        console.log('POC Validation:', {
          pocName: formData.pocName,
          pocEmail: formData.pocEmail,
          pocPhone: formData.pocPhone,
          pocDesignation: formData.pocDesignation,
          isValid: pocValid
        });
        return pocValid;
      case 'agreements-welcome':
        return true; // This tab doesn't have navigation buttons
      default:
        return false;
    }
  }, [activeTab, formData]);

  // Handle success modal action
  const handleSuccessModalAction = useCallback(() => {
    // Close success modal and navigate to agreements-welcome tab
    setShowSuccessModal(false);
    setActiveTab('agreements-welcome');
  }, []);

  // Handle failed modal action
  const handleFailedModalAction = useCallback(() => {
    setShowFailedModal(false);
    // Restart the onboarding process by going back to first tab
    setActiveTab('basic-info');
    // Reset form data to start fresh
    setFormData({
      brandName: '',
      businessType: '',
      website: '',
      description: '',
      businessEmails: [''],
      businessPhones: [''],
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      gstNumber: '',
      panNumber: '',
      businessRegistrationNumber: '',
      posSystem: '',
      posProvider: '',
      posVersion: '',
      terminalId: '',
      serialNumber: '',
      installationDate: '',
      licenseKey: '',
      pocName: '',
      pocEmail: '',
      pocPhone: '',
      pocDesignation: ''
    });
    setValidationErrors({});
    setTouchedFields(new Set());
    setAutoSaveState({
      lastSaved: null,
      hasUnsavedChanges: false,
      isAutoSaving: false,
    });
  }, []);

  // Form validation on mount and data change
  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Auto-save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (autoSaveState.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [autoSaveState.hasUnsavedChanges]);

  // Helper function to render input with validation
  const renderInput = (field: string, label: string, type: string = 'text', placeholder: string = '', required: boolean = false, icon?: React.ReactNode) => {
    const hasError = validationErrors[field];
    const isTouched = touchedFields.has(field);
    
    return (
      <ImprovedInput
        id={field}
        label={label}
        type={type}
        value={typeof formData[field as keyof FormData] === 'string' ? formData[field as keyof FormData] as string : ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        required={required}
        icon={icon}
        error={hasError && isTouched ? (Array.isArray(hasError) ? hasError[0] : hasError) : undefined}
        containerClassName="w-full"
      />
    );
  };

  // Helper function to render textarea with validation
  const renderTextarea = (field: string, label: string, placeholder: string = '', required: boolean = false, maxLength?: number) => {
    const hasError = validationErrors[field];
    const isTouched = touchedFields.has(field);
    
    return (
      <ImprovedTextarea
        id={field}
        label={label}
        value={typeof formData[field as keyof FormData] === 'string' ? formData[field as keyof FormData] as string : ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        error={hasError && isTouched ? (Array.isArray(hasError) ? hasError[0] : hasError) : undefined}
        containerClassName="w-full"
      />
    );
  };

  // Helper function to render select with validation
  const renderSelect = (field: string, label: string, options: string[], placeholder: string = '', required: boolean = false) => {
    const hasError = validationErrors[field];
    const isTouched = touchedFields.has(field);
    
    return (
      <div className="space-y-2">
        <label 
          htmlFor={field} 
          className={`block text-sm font-medium text-gray-700 transition-colors duration-200 ${
            hasError && isTouched ? 'text-red-700' : ''
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Select 
          value={typeof formData[field as keyof FormData] === 'string' ? formData[field as keyof FormData] as string : ''} 
          onValueChange={(value) => handleInputChange(field, value)}
        >
          <SelectTrigger className={`h-11 rounded-[4px] transition-all duration-200 ease-in-out ${
            hasError && isTouched 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500'
          }`}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasError && isTouched && (
          <p className="text-sm text-red-500 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            <span>{Array.isArray(hasError) ? hasError[0] : hasError}</span>
          </p>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic-info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {renderInput('brandName', 'Brand Name', 'text', 'Enter brand name', true)}
              {renderSelect('businessType', 'Business Type', businessTypes, 'Select business type', true)}
              {renderInput('website', 'Website', 'url', 'https://example.com', false, <Globe className="h-4 w-4" />)}
              </div>
            {renderTextarea('description', 'Business Description', 'Brief description of your business...', false, 500)}
          </div>
        );

      case 'contact-info':
        return (
          <div className="space-y-6">
            {/* Business Emails */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Business Email IDs <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {formData.businessEmails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <ImprovedInput
                        type="email"
                        value={email}
                        onChange={(e) => handleArrayInputChange('businessEmails', index, e.target.value)}
                        placeholder="business@example.com"
                        icon={<Mail className="h-4 w-4" />}
                        error={validationErrors.businessEmails && touchedFields.has('businessEmails') && index === 0 ? (Array.isArray(validationErrors.businessEmails) ? validationErrors.businessEmails[0] : validationErrors.businessEmails) : undefined}
                        containerClassName="w-full"
                      />
                    </div>
                    {formData.businessEmails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayInput('businessEmails', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {formData.businessEmails.length < 3 && (
                  <button
                    type="button"
                    onClick={() => addArrayInput('businessEmails')}
                    className="flex items-center gap-2 text-[#6E4EFF] hover:text-[#7856FF] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm font-medium">Add another email</span>
                  </button>
                )}
              </div>
            </div>

            {/* Business Phones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Business Phone Numbers <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {formData.businessPhones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <ImprovedInput
                        type="tel"
                        value={phone}
                        onChange={(e) => handleArrayInputChange('businessPhones', index, e.target.value)}
                        placeholder="+91 98765 43210"
                        icon={<Phone className="h-4 w-4" />}
                        error={validationErrors.businessPhones && touchedFields.has('businessPhones') && index === 0 ? (Array.isArray(validationErrors.businessPhones) ? validationErrors.businessPhones[0] : validationErrors.businessPhones) : undefined}
                        containerClassName="w-full"
                      />
                    </div>
                    {formData.businessPhones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayInput('businessPhones', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {formData.businessPhones.length < 3 && (
                  <button
                    type="button"
                    onClick={() => addArrayInput('businessPhones')}
                    className="flex items-center gap-2 text-[#6E4EFF] hover:text-[#7856FF] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm font-medium">Add another phone</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'business-address':
        return (
          <div className="space-y-6">
            {renderTextarea('streetAddress', 'Street Address', 'Enter complete street address', true)}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {renderInput('city', 'City', 'text', 'City', true)}
              {renderInput('state', 'State', 'text', 'State', true)}
              {renderInput('zipCode', 'ZIP Code', 'text', '12345', true)}
                      </div>
            {renderSelect('country', 'Country', countries, 'Select country', true)}
              </div>
        );

      case 'business-registration':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {renderInput('gstNumber', 'GST Number', 'text', '22AAAAA0000A1Z5', false)}
              {renderInput('panNumber', 'PAN Number', 'text', 'AAAAA0000A', false)}
              {renderInput('businessRegistrationNumber', 'Business Registration Number', 'text', 'Business registration number', false)}
            </div>
          </div>
        );

      case 'pos-accounting':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {renderSelect('posSystem', 'POS System', posSystems, 'Select POS system', false)}
              {renderInput('posProvider', 'POS Provider', 'text', 'POS provider name', false)}
              {renderInput('posVersion', 'Version', 'text', 'Version number', false)}
              {renderInput('terminalId', 'Terminal ID', 'text', 'Terminal ID', false)}
              {renderInput('serialNumber', 'Serial Number', 'text', 'Serial number', false)}
              {renderInput('installationDate', 'Installation Date', 'date', '', false)}
                      </div>
            {renderInput('licenseKey', 'License Key', 'text', 'License key', false)}
                      </div>
        );

      case 'primary-poc':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {renderInput('pocName', 'POC Name', 'text', 'Full name', true, <User className="h-4 w-4" />)}
              {renderInput('pocEmail', 'POC Email', 'email', 'poc@business.com', true, <Mail className="h-4 w-4" />)}
              {renderInput('pocPhone', 'POC Phone', 'tel', '+91 98765 43210', true, <Phone className="h-4 w-4" />)}
              {renderInput('pocDesignation', 'POC Designation', 'text', 'Job designation', true)}
            </div>
          </div>
        );

      case 'agreements-welcome':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h4 className="text-lg font-semibold">Service Agreement</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Send the service agreement document to the business contact for review and signature.
                </p>
                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Agreement
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileCheck className="h-6 w-6 text-green-600" />
                  <h4 className="text-lg font-semibold">Welcome Kit</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Send the comprehensive welcome kit with setup instructions and resources.
                </p>
                <Button className="w-full" variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Send Welcome Kit
                </Button>
              </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Next Steps</h4>
                  <p className="text-blue-800 text-sm">
                    Once both documents are sent, the business will be able to review, sign, and complete their onboarding process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#6E4EFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-8 w-8 text-[#6E4EFF] animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">
            Please wait while we verify your access.
          </p>
        </div>
      </div>
    );
  }


  const handleBack = () => {
    router.back();
  };

  const handleTabBack = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    console.log('handleNext called, activeTab:', activeTab);
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    console.log('Current index:', currentIndex, 'Total tabs:', tabs.length);
    
    // If we're on the primary-poc tab, trigger account creation
    if (activeTab === 'primary-poc') {
      console.log('Primary POC tab - calling confirmSubmit for account creation');
      confirmSubmit();
      return;
    }
    
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    } else {
      console.log('Calling confirmSubmit');
      confirmSubmit();
    }
  };

  return (
    <div className="bg-[#f6f6f6] relative size-full min-h-screen p-4 sm:p-6 lg:p-8 overflow-hidden pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex gap-[7px] items-start mb-12">
          <button 
            onClick={handleBack}
            className="flex items-center justify-center shrink-0 size-[32px] hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M3.14551 15.9999C3.91882 15.4668 5.1713 14.1489 6.10547 12.8531C7.27318 11.2332 7.93849 10.1904 8.31866 9.0918L9.89367 10.1529C9.73979 10.7984 8.98125 12.6294 7.17814 14.7894L28.8547 14.7894V15.9999L3.14551 15.9999ZM3.14551 16.0001C3.91882 16.5332 5.1713 17.8511 6.10547 19.1469C7.27318 20.7668 7.93849 21.8096 8.31866 22.9082L9.89367 21.8471C9.73979 21.2016 8.98125 19.3706 7.17814 17.2106H28.8547V16.0001L3.14551 16.0001Z" 
                fill="#0D0D0D"
              />
            </svg>
          </button>
          <div className="flex flex-col items-start leading-[0] relative shrink-0 text-black">
            <div className="flex flex-col font-bold justify-center relative shrink-0 text-[24px]">
              <p className="leading-[1.4]">Business onboarding</p>
            </div>
            <div className="flex flex-col font-light justify-center relative shrink-0 text-[14px]">
              <p className="leading-[1.4]">Supporting text</p>
            </div>
          </div>
        </div>


        {/* Mobile Stepper Header */}
        <div className="lg:hidden w-full mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#6E4EFF] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {tabs.findIndex(tab => tab.id === activeTab) + 1}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {tabs.find(tab => tab.id === activeTab)?.title}
                </h2>
                <p className="text-sm text-gray-600">
                  Step {tabs.findIndex(tab => tab.id === activeTab) + 1} of {tabs.length} • 2-3 min
                </p>
              </div>
                  </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#6E4EFF] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((tabs.findIndex(tab => tab.id === activeTab) + 1) / tabs.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[55px] items-start w-full relative">
          {/* Left Sidebar - Tab Navigation (Desktop Only) */}
          <div className="hidden lg:flex flex-col gap-[8px] items-start relative shrink-0 w-[320px] max-h-[60vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`bg-white relative rounded-[4px] shrink-0 w-[299px] cursor-pointer transition-all min-h-[76px] ${
                  activeTab === tab.id ? 'ring-2 ring-[#6E4EFF] shadow-md' : 'hover:shadow-sm'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="box-border flex gap-[12px] items-center justify-between overflow-hidden p-[12px] relative w-full">
                  <div className="flex gap-[12px] items-center flex-1 min-w-0">
                    <div className={`relative shrink-0 size-[40px] rounded-full flex items-center justify-center ${
                      tab.completed
                        ? 'bg-[#17C653]/10 text-[#17C653]'
                        : activeTab === tab.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                        <tab.icon className="h-5 w-5" />
                    )}
                    </div>
                    <div className="flex flex-col font-normal grow justify-center leading-[0] min-w-0 text-[#2a2a2f] text-[14px]">
                      <p className="leading-[1.4] font-bold">{tab.title}</p>
                      <p className="leading-[1.3] text-[12px] text-gray-500 mt-1 font-normal">{tab.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center relative shrink-0 w-[22px] h-[22px]">
                    <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
                  </div>
                </div>
                <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[4px]" />
                </div>
              ))}
                  </div>

          {/* Right Content Area */}
          <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 flex-1 min-h-[381px] shadow-sm w-full lg:ml-0">
            {/* Desktop Header (Hidden on Mobile) */}
            <div className="hidden lg:block mb-6">
              <div className="flex items-start gap-3 mb-0">
              {(() => {
                  const activeTabData = tabs.find(tab => tab.id === activeTab);
                  return activeTabData ? (
                    <>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-1 ${
                        activeTabData.completed
                          ? 'bg-[#17C653]/10 text-[#17C653]'
                          : 'bg-[#7856FF]/10 text-[#7856FF]'
                      }`}>
                        {activeTabData.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <activeTabData.icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-[20px] font-bold text-[#2a2a2f]">
                          {activeTabData.title}
                        </h2>
                        <p className="text-gray-600 text-[14px] font-normal">
                          {activeTabData.description}
                        </p>
                      </div>
                    </>
                  ) : null;
              })()}
              </div>
                  </div>

            {renderTabContent()}
            
            {/* Navigation Buttons - Hide for Documents & Welcome Kit tab and Mobile */}
            {activeTab !== 'agreements-welcome' && (
              <div className="hidden lg:flex flex-col sm:flex-row gap-4 mt-8">
                {/* Back Button - Only show from second tab onwards */}
                {tabs.findIndex(tab => tab.id === activeTab) > 0 && (
                  <button
                    onClick={handleTabBack}
                    className="bg-gray-100 box-border flex gap-[8px] h-[48px] items-center justify-center px-[16px] py-[12px] rounded-[4px] w-full sm:w-[120px] hover:bg-gray-200 transition-colors border border-gray-300"
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 32 32" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-600"
                    >
                      <path 
                        fillRule="evenodd" 
                        clipRule="evenodd" 
                        d="M3.14551 15.9999C3.91882 15.4668 5.1713 14.1489 6.10547 12.8531C7.27318 11.2332 7.93849 10.1904 8.31866 9.0918L9.89367 10.1529C9.73979 10.7984 8.98125 12.6294 7.17814 14.7894L28.8547 14.7894V15.9999L3.14551 15.9999ZM3.14551 16.0001C3.91882 16.5332 5.1713 17.8511 6.10547 19.1469C7.27318 20.7668 7.93849 21.8096 8.31866 22.9082L9.89367 21.8471C9.73979 21.2016 8.98125 19.3706 7.17814 17.2106H28.8547V16.0001L3.14551 16.0001Z" 
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium">Back</span>
                  </button>
                )}
                
                {/* Auto-save Status */}
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    {autoSaveState.isAutoSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 text-[#6E4EFF] animate-spin" />
                        <span className="text-sm text-gray-600">Saving...</span>
                      </>
                    ) : autoSaveState.lastSaved ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-[#17C653]" />
                        <span className="text-sm text-gray-600">
                          Last saved: {autoSaveState.lastSaved.toLocaleTimeString()}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-gray-600">No changes saved</span>
                      </>
                  )}
                </div>
                  {autoSaveState.hasUnsavedChanges && (
                    <Badge variant="outline" className="text-amber-600 border-amber-200 ml-auto">
                      Unsaved changes
                    </Badge>
                  )}
            </div>
                
                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={loadingState.submitting || loadingState.validating || !isCurrentTabValid()}
                  className="bg-[#6E4EFF] box-border flex gap-[8px] h-[48px] items-center justify-center px-[16px] py-[12px] rounded-[4px] w-full sm:w-[218px] hover:bg-[#7856FF] transition-colors sm:ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingState.submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">Submitting...</span>
                    </>
                  ) : loadingState.validating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">Validating...</span>
                    </>
                  ) : (
                    <div className="flex flex-col font-semibold justify-center leading-[0] relative shrink-0 text-[16px] text-nowrap text-white">
                      <p className="leading-[24px] whitespace-pre">
                        {activeTab === 'primary-poc' ? 'Create Account' : 'Next'}
                      </p>
                    </div>
                  )}
                </button>
            </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation - Bottom of Page */}
        {activeTab !== 'agreements-welcome' && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="flex justify-between gap-4 max-w-7xl mx-auto">
              <button
                onClick={handleTabBack}
                disabled={tabs.findIndex(tab => tab.id === activeTab) === 0}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-lg"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M3.14551 15.9999C3.91882 15.4668 5.1713 14.1489 6.10547 12.8531C7.27318 11.2332 7.93849 10.1904 8.31866 9.0918L9.89367 10.1529C9.73979 10.7984 8.98125 12.6294 7.17814 14.7894L28.8547 14.7894V15.9999L3.14551 15.9999ZM3.14551 16.0001C3.91882 16.5332 5.1713 17.8511 6.10547 19.1469C7.27318 20.7668 7.93849 21.8096 8.31866 22.9082L9.89367 21.8471C9.73979 21.2016 8.98125 19.3706 7.17814 17.2106H28.8547V16.0001L3.14551 16.0001Z" 
                fill="currentColor"
              />
            </svg>
                <span className="text-sm font-medium">Previous</span>
              </button>

              <button
              onClick={handleNext}
                disabled={activeTab === 'agreements-welcome' || loadingState.submitting || loadingState.validating || !isCurrentTabValid()}
                className="flex items-center gap-2 px-6 py-3 bg-[#6E4EFF] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex-1 justify-center hover:bg-[#7856FF] transition-colors"
              >
                {loadingState.submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Submitting...</span>
                  </>
                ) : loadingState.validating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Validating...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium">
                      {activeTab === 'primary-poc' ? 'Create Account' : 'Next'}
                    </span>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M28.8545 16.0001C28.0812 16.5332 26.8287 17.8511 25.8945 19.1469C24.7268 20.7668 24.0615 21.8096 23.6813 22.9082L22.1063 21.8471C22.2602 21.2016 23.0187 19.3706 24.8219 17.2106L3.14527 17.2106L3.14527 16.0001L28.8545 16.0001ZM28.8545 15.9999C28.0812 15.4668 26.8287 14.1489 25.8945 12.8531C24.7268 11.2332 24.0615 10.1904 23.6813 9.0918L22.1063 10.1529C22.2602 10.7984 23.0187 12.6294 24.8219 14.7894L3.14527 14.7894L3.14527 15.9999L28.8545 15.9999Z" 
                  fill="currentColor"
                />
              </svg>
                  </>
                )}
              </button>
        </div>
          </div>
        )}

        {/* Exit Confirmation Dialog */}
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Unsaved Changes
              </AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes that will be lost if you leave this page. 
                Your progress has been automatically saved as a draft, but you may want to complete the form first.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowExitDialog(false)}>
                Stay on Page
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmExit} className="bg-red-600 hover:bg-red-700">
                Leave Anyway
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#17C653]" />
                Confirm Submission
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit the business onboarding form? 
                This will create the business account and send notifications to the team.
                <br /><br />
                <strong>Business:</strong> {formData.brandName || 'Unnamed Business'}
                <br />
                <strong>POC:</strong> {formData.pocName || 'Not specified'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelSubmit}>
                Review Again
              </AlertDialogCancel>
              <AlertDialogAction 
              onClick={handleSubmit}
                className="bg-[#6E4EFF] hover:bg-[#7856FF]"
                disabled={loadingState.submitting}
              >
                {loadingState.submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit & Create Account'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Success Modal */}
        <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                Account Created Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 mt-2">
                <strong>{formData.brandName || 'Business'}</strong> has been successfully onboarded and is ready to use.
                <br /><br />
                The business account is now active and the team has been notified. You can now proceed to send the agreement and welcome kit.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogAction 
                onClick={handleSuccessModalAction}
                className="w-full bg-[#6E4EFF] hover:bg-[#7856FF] text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Continue to Agreements
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Failed Modal */}
        <AlertDialog open={showFailedModal} onOpenChange={setShowFailedModal}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                Account Creation Failed
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 mt-2">
                We encountered an error while creating the business account for <strong>{formData.brandName || 'your business'}</strong>.
                <br /><br />
                Please try again or contact support if the problem persists.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogAction 
                onClick={handleFailedModalAction}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Restart Onboarding
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
