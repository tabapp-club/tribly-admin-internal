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
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Users,
  Target,
  Calendar,
  Clock,
  AlertCircle,
  UserCheck,
  ChevronDown,
  Briefcase,
  Home,
  Contact,
  Shield
} from 'lucide-react';

interface TabItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

export default function TeamOnboardingPage() {
  const router = useRouter();
  const { hasRole } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('personal-info');
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    personalEmail: '',
    personalPhone: '',
    dateOfBirth: '',
    emergencyContact: '',
    emergencyPhone: '',

    // Professional Information
    jobTitle: '',
    department: '',
    manager: '',
    startDate: '',
    employmentType: '',
    workLocation: '',
    reportingStructure: '',

    // Address Information
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    timezone: '',

    // Role & Permissions
    role: '',
    accessLevel: '',
    permissions: [] as string[],
    businessAccess: [] as string[],
    systemAccess: [] as string[],

  });

  const tabs: TabItem[] = [
    {
      id: 'personal-info',
      title: 'Personal information',
      description: 'Basic personal details and contact info',
      icon: User,
      completed: !!(formData.firstName && formData.lastName && formData.email && formData.phone)
    },
    {
      id: 'professional-info',
      title: 'Professional information',
      description: 'Job title, department, and reporting',
      icon: Briefcase,
      completed: !!(formData.jobTitle && formData.department && formData.startDate)
    },
    {
      id: 'address-info',
      title: 'Address information',
      description: 'Home address and timezone',
      icon: Home,
      completed: !!(formData.streetAddress && formData.city && formData.state && formData.zipCode)
    },
    {
      id: 'role-permissions',
      title: 'Role & permissions',
      description: 'Access levels and system permissions',
      icon: Shield,
      completed: !!(formData.role && formData.accessLevel && formData.permissions.length > 0)
    }
  ];

  const departments = [
    'Sales', 'Marketing', 'Customer Success', 'Engineering', 'Product',
    'Operations', 'Finance', 'HR', 'Legal', 'Support'
  ];

  const employmentTypes = [
    'Full-time', 'Part-time', 'Contract', 'Intern', 'Consultant'
  ];

  const workLocations = [
    'Office', 'Remote', 'Hybrid', 'Field'
  ];

  const roles = [
    'Master', 'Manager', 'Team Member', 'Admin', 'Viewer'
  ];

  const accessLevels = [
    'Full Access', 'Limited Access', 'Read Only', 'Custom'
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

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleSubmit = () => {
    // Simulate API call
    addNotification({
      title: 'Team Member Onboarded!',
      message: `${formData.firstName} ${formData.lastName} has been successfully onboarded.`,
      type: 'success',
      isRead: false
    });

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      personalEmail: '',
      personalPhone: '',
      dateOfBirth: '',
      emergencyContact: '',
      emergencyPhone: '',
      jobTitle: '',
      department: '',
      manager: '',
      startDate: '',
      employmentType: '',
      workLocation: '',
      reportingStructure: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      timezone: '',
      role: '',
      accessLevel: '',
      permissions: [],
      businessAccess: [],
      systemAccess: [],
    });
    setActiveTab('personal-info');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal-info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="mb-0.5">First Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="lastName" className="mb-0.5">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Last name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="mb-0.5">Work Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="work@company.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="mb-0.5">Work Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="personalEmail" className="mb-0.5">Personal Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="personalEmail"
                    type="email"
                    value={formData.personalEmail}
                    onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                    placeholder="personal@email.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="personalPhone" className="mb-0.5">Personal Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="personalPhone"
                    value={formData.personalPhone}
                    onChange={(e) => handleInputChange('personalPhone', e.target.value)}
                    placeholder="+1 (555) 987-6543"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dateOfBirth" className="mb-0.5">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="emergencyContact" className="mb-0.5">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Emergency contact name"
                />
              </div>

              <div>
                <Label htmlFor="emergencyPhone" className="mb-0.5">Emergency Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'professional-info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="jobTitle" className="mb-0.5">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder="Job title"
                />
              </div>

              <div>
                <Label htmlFor="department" className="mb-0.5">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="manager" className="mb-0.5">Manager</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => handleInputChange('manager', e.target.value)}
                  placeholder="Manager name"
                />
              </div>

              <div>
                <Label htmlFor="startDate" className="mb-0.5">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="employmentType" className="mb-0.5">Employment Type</Label>
                <Select value={formData.employmentType} onValueChange={(value) => handleInputChange('employmentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="workLocation" className="mb-0.5">Work Location</Label>
                <Select value={formData.workLocation} onValueChange={(value) => handleInputChange('workLocation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work location" />
                  </SelectTrigger>
                  <SelectContent>
                    {workLocations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="reportingStructure" className="mb-0.5">Reporting Structure</Label>
              <Textarea
                id="reportingStructure"
                value={formData.reportingStructure}
                onChange={(e) => handleInputChange('reportingStructure', e.target.value)}
                placeholder="Describe the reporting structure and team hierarchy..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      case 'address-info':
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
                  placeholder="123 Home Street"
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

      case 'role-permissions':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="role" className="mb-0.5">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accessLevel" className="mb-0.5">Access Level *</Label>
                <Select value={formData.accessLevel} onValueChange={(value) => handleInputChange('accessLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">System Permissions</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['View Dashboard', 'Manage Users', 'Access Analytics', 'Edit Settings', 'View Reports', 'Manage Businesses'].map(permission => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={formData.permissions.includes(permission)}
                      onChange={(e) => handleArrayChange('permissions', permission, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={permission} className="text-sm">{permission}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Business Access</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['All Businesses', 'Assigned Only', 'View Only', 'Full Access', 'Limited Access'].map(access => (
                  <div key={access} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={access}
                      checked={formData.businessAccess.includes(access)}
                      onChange={(e) => handleArrayChange('businessAccess', access, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={access} className="text-sm">{access}</Label>
                  </div>
                ))}
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
              <p className="leading-[1.4]">Team onboarding</p>
            </div>
            <div className="flex flex-col font-light justify-center relative shrink-0 text-[14px]">
              <p className="leading-[1.4]">Add new team members to your organization</p>
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
                    {tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1 ? 'Onboard Team Member' : 'Next'}
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
