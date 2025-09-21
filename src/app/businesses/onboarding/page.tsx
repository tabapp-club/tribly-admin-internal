'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Users,
  DollarSign,
  Target,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

export default function BusinessOnboardingPage() {
  const { hasRole } = useAuth();
  const { addNotification } = useNotifications();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    industry: '',
    businessSize: '',
    website: '',

    // Contact Information
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    address: '',

    // Subscription Details
    subscriptionPlan: '',
    billingCycle: 'monthly',

    // Team Assignment
    assignedTo: '',
    notes: ''
  });

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Business Information',
      description: 'Basic business details and industry',
      icon: Building2,
      completed: currentStep > 1
    },
    {
      id: 2,
      title: 'Contact Details',
      description: 'Primary contact information',
      icon: User,
      completed: currentStep > 2
    },
    {
      id: 3,
      title: 'Subscription Plan',
      description: 'Choose subscription and billing',
      icon: DollarSign,
      completed: currentStep > 3
    },
    {
      id: 4,
      title: 'Team Assignment',
      description: 'Assign to team member',
      icon: Users,
      completed: currentStep > 4
    },
    {
      id: 5,
      title: 'Review & Create',
      description: 'Review and create business account',
      icon: CheckCircle,
      completed: false
    }
  ];

  const industries = [
    'Technology', 'Retail', 'Healthcare', 'Finance', 'Education',
    'Manufacturing', 'Real Estate', 'Consulting', 'E-commerce', 'Other'
  ];

  const businessSizes = [
    'Startup (1-10 employees)',
    'Small (11-50 employees)',
    'Medium (51-200 employees)',
    'Enterprise (200+ employees)'
  ];

  const subscriptionPlans = [
    { id: 'basic', name: 'Basic', price: '$29', features: ['Analytics', 'Basic Campaigns'] },
    { id: 'professional', name: 'Professional', price: '$79', features: ['Analytics', 'Campaigns', 'Automation'] },
    { id: 'enterprise', name: 'Enterprise', price: '$199', features: ['All Features', 'AI', 'Priority Support'] }
  ];

  const teamMembers = [
    { id: '1', name: 'Sarah Johnson', role: 'Manager', available: true },
    { id: '2', name: 'Mike Chen', role: 'Team', available: true },
    { id: '3', name: 'Emily Davis', role: 'Team', available: false },
    { id: '4', name: 'David Wilson', role: 'Team', available: true }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Simulate API call
    addNotification({
      title: 'Business Onboarded!',
      message: `${formData.businessName} has been successfully onboarded.`,
      type: 'success'
    });

    // Reset form
    setFormData({
      businessName: '',
      industry: '',
      businessSize: '',
      website: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      subscriptionPlan: '',
      billingCycle: 'monthly',
      assignedTo: '',
      notes: ''
    });
    setCurrentStep(1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Enter business name"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry *</Label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">Select industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="businessSize">Business Size *</Label>
              <select
                id="businessSize"
                value={formData.businessSize}
                onChange={(e) => handleInputChange('businessSize', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">Select business size</option>
                {businessSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  placeholder="Full name"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contactEmail">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="contact@business.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contactPhone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Business Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Business St, City, State 12345"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Subscription Plan *</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {subscriptionPlans.map(plan => (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-colors ${
                      formData.subscriptionPlan === plan.id
                        ? 'ring-2 ring-primary border-primary'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange('subscriptionPlan', plan.id)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-2xl font-bold text-primary">{plan.price}</p>
                        <p className="text-sm text-muted-foreground">per month</p>
                        <ul className="mt-4 space-y-2 text-sm">
                          {plan.features.map(feature => (
                            <li key={feature} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-success mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <select
                id="billingCycle"
                value={formData.billingCycle}
                onChange={(e) => handleInputChange('billingCycle', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly (20% discount)</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Assign to Team Member *</Label>
              <div className="space-y-2 mt-2">
                {teamMembers.map(member => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.assignedTo === member.id
                        ? 'ring-2 ring-primary border-primary'
                        : 'hover:border-primary/50'
                    } ${!member.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => member.available && handleInputChange('assignedTo', member.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    {!member.available && (
                      <Badge variant="outline">Unavailable</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any special requirements or notes..."
                className="w-full px-3 py-2 border border-border rounded-md bg-background min-h-[100px]"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Review Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Business Name:</p>
                  <p className="text-muted-foreground">{formData.businessName}</p>
                </div>
                <div>
                  <p className="font-medium">Industry:</p>
                  <p className="text-muted-foreground">{formData.industry}</p>
                </div>
                <div>
                  <p className="font-medium">Contact Person:</p>
                  <p className="text-muted-foreground">{formData.contactPerson}</p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-muted-foreground">{formData.contactEmail}</p>
                </div>
                <div>
                  <p className="font-medium">Subscription:</p>
                  <p className="text-muted-foreground">
                    {subscriptionPlans.find(p => p.id === formData.subscriptionPlan)?.name}
                    ({formData.billingCycle})
                  </p>
                </div>
                <div>
                  <p className="font-medium">Assigned to:</p>
                  <p className="text-muted-foreground">
                    {teamMembers.find(m => m.id === formData.assignedTo)?.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium text-warning">Ready to Create Account</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will create a new business account and send onboarding emails to the contact person.
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

  if (!hasRole('manager')) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Onboarding</h1>
          <p className="text-muted-foreground">Onboard new businesses to the Tribly platform</p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step.completed
                      ? 'bg-success border-success text-white'
                      : currentStep === step.id
                        ? 'bg-primary border-primary text-white'
                        : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>

                  <div className="ml-3">
                    <p className={`font-medium ${
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>

                  {index < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <steps[currentStep - 1].icon className="h-5 w-5" />
              <span>Step {currentStep}: {steps[currentStep - 1].title}</span>
            </CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Create Business Account</span>
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
