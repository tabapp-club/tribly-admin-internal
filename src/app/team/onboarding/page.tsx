'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImprovedInput } from '@/components/ui/ImprovedInput';
import { ImprovedTextarea } from '@/components/ui/ImprovedTextarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  ArrowRight,
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
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
}

export default function TeamOnboardingPage() {
  const router = useRouter();
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
              <ImprovedInput
                id="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="First name"
                icon={<User className="h-4 w-4" />}
                required
                validate={(value) => {
                  if (!value) return 'First name is required';
                  if (value.length < 2) return 'Must be at least 2 characters';
                  return null;
                }}
              />

              <ImprovedInput
                id="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Last name"
                required
                validate={(value) => {
                  if (!value) return 'Last name is required';
                  if (value.length < 2) return 'Must be at least 2 characters';
                  return null;
                }}
              />

              <ImprovedInput
                id="email"
                label="Work Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="work@company.com"
                icon={<Mail className="h-4 w-4" />}
                required
                validate={(value) => {
                  if (!value) return 'Work email is required';
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(value)) return 'Please enter a valid email address';
                  return null;
                }}
              />

              <ImprovedInput
                id="phone"
                label="Work Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                icon={<Phone className="h-4 w-4" />}
                required
                validate={(value) => {
                  if (!value) return 'Work phone is required';
                  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                  if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) return 'Please enter a valid phone number';
                  return null;
                }}
              />

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
              <p className="leading-[1.4]">Team onboarding</p>
            </div>
            <div className="flex flex-col font-light justify-center relative shrink-0 text-[14px]">
              <p className="leading-[1.4]">Add new team members to your organization</p>
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

            {/* Navigation Buttons - Desktop Only */}
            <div className="hidden lg:flex justify-between mt-8">
              {/* Back Button - Only show from second tab onwards */}
              {tabs.findIndex(tab => tab.id === activeTab) > 0 && (
                <button
                  onClick={handleTabBack}
                  className="bg-gray-100 box-border flex gap-[8px] h-[48px] items-center justify-center px-[16px] py-[12px] rounded-[4px] w-[120px] hover:bg-gray-200 transition-colors border border-gray-300"
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

        {/* Mobile Navigation - Bottom of Page */}
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
              className="flex items-center gap-2 px-6 py-3 bg-[#6E4EFF] text-white rounded-lg flex-1 justify-center hover:bg-[#7856FF] transition-colors"
            >
              <span className="text-sm font-medium">
                {tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1 ? 'Complete' : 'Next'}
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
