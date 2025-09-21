'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  AlertCircle,
  FileText,
  CreditCard,
  UserCheck,
  ChevronDown,
  Briefcase,
  Home,
  FileCheck,
  Settings,
  Contact
} from 'lucide-react';

interface TabItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

export default function BusinessOnboardingPage() {
  const router = useRouter();
  const { hasRole } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [formData, setFormData] = useState({
    // Basic Information
    businessName: '',
    industry: '',
    businessType: '',
    businessSize: '',
    website: '',
    description: '',

    // Contact Information
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    alternateEmail: '',
    alternatePhone: '',

    // Business Address
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    timezone: '',

    // Business Registration
    registrationNumber: '',
    taxId: '',
    businessLicense: '',
    incorporationDate: '',
    legalStructure: '',

    // POS/Accounting Details
    posSystem: '',
    accountingSoftware: '',
    paymentProcessor: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',

    // Primary POC Details
    pocName: '',
    pocTitle: '',
    pocEmail: '',
    pocPhone: '',
    pocDepartment: '',
    pocNotes: ''
  });

  const tabs: TabItem[] = [
    {
      id: 'basic-info',
      title: 'Basic information',
      description: 'Company name, industry, and type',
      icon: Briefcase,
      completed: !!(formData.businessName && formData.industry && formData.businessType)
    },
    {
      id: 'contact-info',
      title: 'Contact information',
      description: 'Primary and alternate contacts',
      icon: Contact,
      completed: !!(formData.contactPerson && formData.contactEmail && formData.contactPhone)
    },
    {
      id: 'business-address',
      title: 'Business address',
      description: 'Physical location and timezone',
      icon: Home,
      completed: !!(formData.streetAddress && formData.city && formData.state && formData.zipCode)
    },
    {
      id: 'business-registration',
      title: 'Business registration',
      description: 'Legal documents and tax info',
      icon: FileCheck,
      completed: !!(formData.registrationNumber && formData.taxId && formData.legalStructure)
    },
    {
      id: 'pos-accounting',
      title: 'POS/accounting details',
      description: 'Payment and accounting systems',
      icon: Settings,
      completed: !!(formData.posSystem && formData.accountingSoftware && formData.paymentProcessor)
    },
    {
      id: 'primary-poc',
      title: 'Primary POC details',
      description: 'Main point of contact info',
      icon: UserCheck,
      completed: !!(formData.pocName && formData.pocEmail && formData.pocPhone)
    }
  ];

  const industries = [
    'Technology', 'Retail', 'Healthcare', 'Finance', 'Education',
    'Manufacturing', 'Real Estate', 'Consulting', 'E-commerce', 'Other'
  ];

  const businessTypes = [
    'Corporation', 'LLC', 'Partnership', 'Sole Proprietorship', 'Non-profit'
  ];

  const businessSizes = [
    'Startup (1-10 employees)',
    'Small (11-50 employees)',
    'Medium (51-200 employees)',
    'Enterprise (200+ employees)'
  ];

  const legalStructures = [
    'Corporation', 'LLC', 'Partnership', 'Sole Proprietorship', 'Non-profit', 'Other'
  ];

  const posSystems = [
    'Square', 'Shopify POS', 'Clover', 'Toast', 'Lightspeed', 'Revel', 'Other'
  ];

  const accountingSoftware = [
    'QuickBooks', 'Xero', 'FreshBooks', 'Wave', 'Sage', 'Other'
  ];

  const paymentProcessors = [
    'Stripe', 'PayPal', 'Square', 'Authorize.Net', 'Braintree', 'Other'
  ];

  const timezones = [
    'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00',
    'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
    'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
    'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Simulate API call
    addNotification({
      title: 'Business Onboarded!',
      message: `${formData.businessName} has been successfully onboarded.`,
      type: 'success',
      isRead: false
    });

    // Reset form
    setFormData({
      businessName: '',
      industry: '',
      businessType: '',
      businessSize: '',
      website: '',
      description: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      alternateEmail: '',
      alternatePhone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      timezone: '',
      registrationNumber: '',
      taxId: '',
      businessLicense: '',
      incorporationDate: '',
      legalStructure: '',
      posSystem: '',
      accountingSoftware: '',
      paymentProcessor: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      pocName: '',
      pocTitle: '',
      pocEmail: '',
      pocPhone: '',
      pocDepartment: '',
      pocNotes: ''
    });
    setActiveTab('basic-info');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic-info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="businessName" className="mb-0.5">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter business name"
                />
              </div>

              <div>
                <Label htmlFor="industry" className="mb-0.5">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="businessType" className="mb-0.5">Business Type *</Label>
                <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="businessSize" className="mb-0.5">Business Size</Label>
                <Select value={formData.businessSize} onValueChange={(value) => handleInputChange('businessSize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business size" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessSizes.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="website" className="mb-0.5">Website</Label>
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

            <div>
              <Label htmlFor="description" className="mb-0.5">Business Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your business..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      case 'contact-info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contactPerson" className="mb-0.5">Contact Person *</Label>
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
                <Label htmlFor="contactEmail" className="mb-0.5">Primary Email *</Label>
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
                <Label htmlFor="contactPhone" className="mb-0.5">Primary Phone *</Label>
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
                <Label htmlFor="alternateEmail" className="mb-0.5">Alternate Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="alternateEmail"
                    type="email"
                    value={formData.alternateEmail}
                    onChange={(e) => handleInputChange('alternateEmail', e.target.value)}
                    placeholder="alternate@business.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="alternatePhone" className="mb-0.5">Alternate Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                    placeholder="+1 (555) 987-6543"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'business-address':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="streetAddress" className="mb-0.5">Street Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="streetAddress"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  placeholder="123 Business Street"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="city" className="mb-0.5">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>

              <div>
                <Label htmlFor="state" className="mb-0.5">State/Province *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                />
              </div>

              <div>
                <Label htmlFor="zipCode" className="mb-0.5">ZIP/Postal Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="12345"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="country" className="mb-0.5">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Country"
                />
              </div>

              <div>
                <Label htmlFor="timezone" className="mb-0.5">Timezone</Label>
                <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map(timezone => (
                      <SelectItem key={timezone} value={timezone}>{timezone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'business-registration':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="registrationNumber" className="mb-0.5">Registration Number *</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  placeholder="Business registration number"
                />
              </div>

              <div>
                <Label htmlFor="taxId" className="mb-0.5">Tax ID/EIN *</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  placeholder="Tax identification number"
                />
              </div>

              <div>
                <Label htmlFor="businessLicense" className="mb-0.5">Business License</Label>
                <Input
                  id="businessLicense"
                  value={formData.businessLicense}
                  onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                  placeholder="Business license number"
                />
              </div>

              <div>
                <Label htmlFor="incorporationDate" className="mb-0.5">Incorporation Date</Label>
                <Input
                  id="incorporationDate"
                  type="date"
                  value={formData.incorporationDate}
                  onChange={(e) => handleInputChange('incorporationDate', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="legalStructure" className="mb-0.5">Legal Structure *</Label>
                <Select value={formData.legalStructure} onValueChange={(value) => handleInputChange('legalStructure', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select legal structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {legalStructures.map(structure => (
                      <SelectItem key={structure} value={structure}>{structure}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'pos-accounting':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="posSystem" className="mb-0.5">POS System *</Label>
                <Select value={formData.posSystem} onValueChange={(value) => handleInputChange('posSystem', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select POS system" />
                  </SelectTrigger>
                  <SelectContent>
                    {posSystems.map(system => (
                      <SelectItem key={system} value={system}>{system}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accountingSoftware" className="mb-0.5">Accounting Software *</Label>
                <Select value={formData.accountingSoftware} onValueChange={(value) => handleInputChange('accountingSoftware', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accounting software" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountingSoftware.map(software => (
                      <SelectItem key={software} value={software}>{software}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="paymentProcessor" className="mb-0.5">Payment Processor *</Label>
                <Select value={formData.paymentProcessor} onValueChange={(value) => handleInputChange('paymentProcessor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment processor" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentProcessors.map(processor => (
                      <SelectItem key={processor} value={processor}>{processor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bankName" className="mb-0.5">Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  placeholder="Bank name"
                />
              </div>

              <div>
                <Label htmlFor="accountNumber" className="mb-0.5">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="Account number"
                />
              </div>

              <div>
                <Label htmlFor="routingNumber" className="mb-0.5">Routing Number</Label>
                <Input
                  id="routingNumber"
                  value={formData.routingNumber}
                  onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                  placeholder="Routing number"
                />
              </div>
            </div>
          </div>
        );

      case 'primary-poc':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="pocName" className="mb-0.5">POC Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pocName"
                    value={formData.pocName}
                    onChange={(e) => handleInputChange('pocName', e.target.value)}
                    placeholder="Full name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pocTitle" className="mb-0.5">Title/Position</Label>
                <Input
                  id="pocTitle"
                  value={formData.pocTitle}
                  onChange={(e) => handleInputChange('pocTitle', e.target.value)}
                  placeholder="Job title"
                />
              </div>

              <div>
                <Label htmlFor="pocEmail" className="mb-0.5">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pocEmail"
                    type="email"
                    value={formData.pocEmail}
                    onChange={(e) => handleInputChange('pocEmail', e.target.value)}
                    placeholder="poc@business.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pocPhone" className="mb-0.5">Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pocPhone"
                    value={formData.pocPhone}
                    onChange={(e) => handleInputChange('pocPhone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pocDepartment" className="mb-0.5">Department</Label>
                <Input
                  id="pocDepartment"
                  value={formData.pocDepartment}
                  onChange={(e) => handleInputChange('pocDepartment', e.target.value)}
                  placeholder="Department"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pocNotes" className="mb-0.5">Additional Notes</Label>
              <Textarea
                id="pocNotes"
                value={formData.pocNotes}
                onChange={(e) => handleInputChange('pocNotes', e.target.value)}
                placeholder="Any additional notes about the primary point of contact..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!hasRole('manager')) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
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
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="bg-[#f6f6f6] relative size-full min-h-screen p-4 lg:p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex gap-[7px] items-start mb-12">
          <button 
            onClick={handleBack}
            className="overflow-clip relative shrink-0 size-[32px] hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <div className="absolute flex h-[16px] items-center justify-center left-[2px] top-[8px] w-[28px]">
              <div className="flex-none rotate-[180deg]">
                <div className="h-[16px] relative w-[28px]">
                  <div className="absolute flex inset-[6.82%_4.09%] items-center justify-center">
                    <div className="flex-none h-[13.816px] rotate-[180deg] w-[25.709px]">
                      <div className="relative size-full">
                        <img alt="" className="block max-w-none size-full" src="http://localhost:3845/assets/e93f530dec15b9aeeb889e89d7a05b8c41519245.svg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[55px] items-start w-full relative">
          {/* Left Sidebar - Tab Navigation */}
          <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full lg:w-[320px] max-h-[60vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`bg-white relative rounded-[4px] shrink-0 w-full lg:w-[299px] cursor-pointer transition-all min-h-[76px] ${
                  activeTab === tab.id ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-sm'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="box-border flex gap-[12px] items-center justify-between overflow-hidden p-[12px] relative w-full">
                  <div className="flex gap-[12px] items-center flex-1 min-w-0">
                    <div className={`relative shrink-0 size-[40px] rounded-full flex items-center justify-center ${
                      tab.completed
                        ? 'bg-green-100 text-green-600'
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
          <div className="bg-white rounded-lg p-4 lg:p-8 flex-1 min-h-[381px] shadow-sm w-full lg:ml-0">
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-0">
                {(() => {
                  const activeTabData = tabs.find(tab => tab.id === activeTab);
                  return activeTabData ? (
                    <>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-1 ${
                        activeTabData.completed
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
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
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {/* Back Button - Only show from second tab onwards */}
              {tabs.findIndex(tab => tab.id === activeTab) > 0 && (
                <button
                  onClick={handleTabBack}
                  className="bg-gray-100 box-border flex gap-[8px] h-[48px] items-center justify-center px-[16px] py-[12px] rounded-[4px] w-[120px] hover:bg-gray-200 transition-colors border border-gray-300"
                >
                  <ArrowLeft className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700 font-medium">Back</span>
                </button>
              )}
              
              {/* Next Button */}
              <button
                onClick={handleNext}
                className="bg-[#6e4eff] box-border flex gap-[8px] h-[48px] items-center justify-center px-[16px] py-[12px] rounded-[4px] w-[218px] hover:bg-[#5a3fd9] transition-colors ml-auto"
              >
                <div className="flex flex-col font-semibold justify-center leading-[0] relative shrink-0 text-[16px] text-nowrap text-white">
                  <p className="leading-[24px] whitespace-pre">
                    {tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1 ? 'Create Account' : 'Next'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
