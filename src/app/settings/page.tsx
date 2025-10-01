'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { authApi } from '@/utils/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImprovedInput } from '@/components/ui/ImprovedInput';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Settings,
  User,
  Bell,
  Shield,
  Mail,
  Phone,
  Save,
  CheckCircle,
  ChevronDown,
  Briefcase,
  Clock,
  RefreshCw
} from 'lucide-react';

interface TabItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [isClient, setIsClient] = useState(false);

  // Settings state - initialize with empty values, will be populated by useEffect
  const [profileSettings, setProfileSettings] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    password: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    businessOnboarding: true,
    teamActivity: true,
    systemAlerts: true,
    weeklyReports: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    ipWhitelist: false
  });

  // Set client-side flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Validation functions
  const validateEmail = (value: string) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return null;
  };

  const validateName = (value: string) => {
    if (!value) return 'This field is required';
    if (value.length < 2) return 'Must be at least 2 characters';
    return null;
  };

  const validatePhone = (value: string) => {
    if (!value) return null; // Optional field
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) return 'Please enter a valid phone number';
    return null;
  };

  const validatePassword = (value: string) => {
    if (!value) return null; // Optional field
    if (value.length < 6) return 'Password must be at least 6 characters long';
    return null;
  };

  // Fetch user data from /me endpoint and update profile settings
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingUserData(true);
      try {
        const response = await authApi.getMe();
        if (response.data) {
          const userData = response.data as any;

          // Extract first and last name from the user data
          const nameParts = userData.name?.split(' ') || ['', ''];
          const newProfileSettings = {
            firstName: userData.first_name || nameParts[0] || '',
            lastName: userData.last_name || nameParts.slice(1).join(' ') || '',
            email: userData.email || '',
            phone: userData.phone_number || userData.phone || '',
            jobTitle: userData.job_title || '',
            department: userData.department || '',
            password: '' // Always start with empty password
          };

          setProfileSettings(newProfileSettings);
        }
      } catch {
        // Fallback to user data from context
        if (user) {
          const nameParts = user.name?.split(' ') || ['', ''];
          const newProfileSettings = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || '',
            jobTitle: user.jobTitle || '',
            department: user.department || '',
            password: ''
          };
          setProfileSettings(newProfileSettings);
        }

        addNotification({
          title: 'Warning',
          message: 'Could not fetch latest profile data. Using cached data.',
          type: 'warning'
        });
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [user, addNotification]);

  const tabs: TabItem[] = [
    {
      id: 'general',
      title: 'Profile settings',
      description: 'Personal information and preferences',
      icon: Settings,
      completed: !!(profileSettings.firstName && profileSettings.lastName && profileSettings.email)
    },
    {
      id: 'notifications',
      title: 'Notification settings',
      description: 'Email and push notification preferences',
      icon: Bell,
      completed: !!(notificationSettings.emailNotifications || notificationSettings.pushNotifications)
    },
    {
      id: 'security',
      title: 'Security settings',
      description: 'Authentication and security policies',
      icon: Shield,
      completed: !!(securitySettings.twoFactorAuth || securitySettings.ipWhitelist)
    },
  ];

  const handleSave = async (section: string) => {
    setIsLoading(true);
    try {
      if (section === 'general') {
        // Prepare data for API call - only include fields that have values
        const updateData: {
          first_name?: string;
          last_name?: string;
          email?: string;
          password?: string;
          phone_number?: string;
          job_title?: string;
          department?: string;
        } = {};

        if (profileSettings.firstName) updateData.first_name = profileSettings.firstName;
        if (profileSettings.lastName) updateData.last_name = profileSettings.lastName;
        if (profileSettings.email) updateData.email = profileSettings.email;
        if (profileSettings.password) updateData.password = profileSettings.password;
        if (profileSettings.phone) updateData.phone_number = profileSettings.phone;
        if (profileSettings.jobTitle) updateData.job_title = profileSettings.jobTitle;
        if (profileSettings.department) updateData.department = profileSettings.department;

        // Call the API
        await authApi.updateProfile(updateData);

        // Update local user data
        updateUser({
          name: `${profileSettings.firstName} ${profileSettings.lastName}`.trim(),
          email: profileSettings.email,
          phone: profileSettings.phone,
          jobTitle: profileSettings.jobTitle,
          department: profileSettings.department
        });

        // Clear password field after successful update
        setProfileSettings(prev => ({ ...prev, password: '' }));

        addNotification({
          title: 'Profile Updated',
          message: 'Your profile information has been updated successfully.',
          type: 'success'
        });
      } else {
        addNotification({
          title: 'Settings Saved',
          message: `${section} settings have been updated successfully.`,
          type: 'success'
        });
      }
    } catch {
      addNotification({
        title: 'Save Failed',
        message: 'Failed to save settings. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleBack = () => {
    router.back();
  };

  const handleRefreshUserData = async () => {
    setIsLoadingUserData(true);
    try {
      const response = await authApi.getMe();
      if (response.data) {
        const userData = response.data;

        const nameParts = userData.name?.split(' ') || ['', ''];
        const newProfileSettings = {
          firstName: userData.first_name || nameParts[0] || '',
          lastName: userData.last_name || nameParts.slice(1).join(' ') || '',
          email: userData.email || '',
          phone: userData.phone_number || userData.phone || '',
          jobTitle: userData.job_title || '',
          department: userData.department || '',
          password: ''
        };

        setProfileSettings(newProfileSettings);

        addNotification({
          title: 'Profile Refreshed',
          message: 'Profile data has been updated with latest information.',
          type: 'success'
        });
      }
    } catch {
      addNotification({
        title: 'Refresh Failed',
        message: 'Could not refresh profile data. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // Show loading state while auth is loading or user data is being fetched
  if (isClient && (authLoading || isLoadingUserData)) {
    return (
      <div className="bg-[#f6f6f6] relative size-full min-h-screen p-4 lg:p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6e4eff]"></div>
              <span className="text-gray-600">
                {authLoading ? 'Loading settings...' : 'Loading profile data...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Show loading state during hydration or when user data is not loaded
  if (!isClient || !user) {
    return (
      <div className="bg-[#f6f6f6] relative size-full min-h-screen p-4 lg:p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6e4eff]"></div>
              <span className="text-gray-600">Loading profile data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            {/* Refresh Button */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                <p className="text-sm text-gray-600">Update your personal details and preferences</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshUserData}
                disabled={isLoadingUserData}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingUserData ? 'animate-spin' : ''}`} />
                {isLoadingUserData ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImprovedInput
                id="firstName"
                label="First Name"
                value={profileSettings.firstName}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
                validate={validateName}
                required
                icon={<User className="h-4 w-4" />}
              />

              <ImprovedInput
                id="lastName"
                label="Last Name"
                value={profileSettings.lastName}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter last name"
                validate={validateName}
                required
                icon={<User className="h-4 w-4" />}
              />

              <ImprovedInput
                id="email"
                label="Email Address"
                type="email"
                value={profileSettings.email}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                validate={validateEmail}
                required
                icon={<Mail className="h-4 w-4" />}
              />

              <ImprovedInput
                id="phone"
                label="Phone Number"
                type="tel"
                value={profileSettings.phone}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
                validate={validatePhone}
                icon={<Phone className="h-4 w-4" />}
              />

              <ImprovedInput
                id="jobTitle"
                label="Job Title"
                value={profileSettings.jobTitle}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, jobTitle: e.target.value }))}
                placeholder="Enter job title"
                icon={<Briefcase className="h-4 w-4" />}
              />

              <ImprovedInput
                id="password"
                label="New Password"
                type="password"
                value={profileSettings.password}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter new password (leave blank to keep current)"
                validate={validatePassword}
                icon={<Shield className="h-4 w-4" />}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <Select value={profileSettings.department} onValueChange={(value) => setProfileSettings(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="businessOnboarding">Business Onboarding</Label>
                  <p className="text-sm text-gray-500">Notifications for new business registrations</p>
                </div>
                <Switch
                  id="businessOnboarding"
                  checked={notificationSettings.businessOnboarding}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, businessOnboarding: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="teamActivity">Team Activity</Label>
                  <p className="text-sm text-gray-500">Notifications for team member activities</p>
                </div>
                <Switch
                  id="teamActivity"
                  checked={notificationSettings.teamActivity}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, teamActivity: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="systemAlerts">System Alerts</Label>
                  <p className="text-sm text-gray-500">Critical system alerts and warnings</p>
                </div>
                <Switch
                  id="systemAlerts"
                  checked={notificationSettings.systemAlerts}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReports">Weekly Reports</Label>
                  <p className="text-sm text-gray-500">Receive weekly summary reports</p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Require 2FA for all user accounts</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                />
              </div>

              <ImprovedInput
                id="sessionTimeout"
                label="Session Timeout (minutes)"
                type="number"
                value={securitySettings.sessionTimeout.toString()}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 30 }))}
                placeholder="30"
                validate={(value) => {
                  const num = parseInt(value);
                  if (isNaN(num) || num < 5) return 'Must be at least 5 minutes';
                  if (num > 1440) return 'Cannot exceed 24 hours (1440 minutes)';
                  return null;
                }}
                icon={<Clock className="h-4 w-4" />}
              />

              <div>
                <Label htmlFor="passwordPolicy" className="mb-0.5">Password Policy</Label>
                <Select value={securitySettings.passwordPolicy} onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, passwordPolicy: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select password policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                    <SelectItem value="strong">Strong (12+ characters, mixed case, numbers)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (16+ characters, special chars)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                  <p className="text-sm text-gray-500">Restrict access to specific IP addresses</p>
                </div>
                <Switch
                  id="ipWhitelist"
                  checked={securitySettings.ipWhitelist}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, ipWhitelist: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auditLogging">Audit Logging</Label>
                  <p className="text-sm text-gray-500">Log all user actions and system events</p>
                </div>
                <Switch
                  id="auditLogging"
                  checked={securitySettings.auditLogging}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, auditLogging: checked }))}
                />
              </div>
            </div>
          </div>
        );


      default:
        return null;
    }
  };

  return (
    <div className="bg-[#f6f6f6] relative size-full min-h-screen p-4 lg:p-6 overflow-hidden">
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
              <p className="leading-[1.4]">Settings</p>
            </div>
            <div className="flex flex-col font-light justify-center relative shrink-0 text-[14px]">
              <p className="leading-[1.4]">Manage your platform configuration and preferences</p>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-4">
          {/* Mobile Tab Selector */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            {/* Mobile Tab Navigation */}
            <div className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#6E4EFF] text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === tab.id
                      ? 'bg-white/20'
                      : tab.completed
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <tab.icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{tab.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Content Area */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            {renderTabContent()}

            {/* Mobile Save Button */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Button
                onClick={() => handleSave(activeTab)}
                disabled={isLoading}
                className="w-full bg-[#6e4eff] hover:bg-[#5a3fd9] text-white h-12"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Save Settings</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-col lg:flex-row gap-8 lg:gap-[55px] items-start w-full relative">
          {/* Left Sidebar - Tab Navigation */}
          <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-[320px] max-h-[60vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`bg-white relative rounded-[4px] shrink-0 w-[299px] cursor-pointer transition-all min-h-[76px] ${
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
          <div className="bg-white rounded-lg p-8 flex-1 min-h-[381px] shadow-sm w-full lg:ml-0">
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

            {/* Save Button */}
            <div className="flex justify-end mt-8">
              <Button
                onClick={() => handleSave(activeTab)}
                disabled={isLoading}
                className="bg-[#6e4eff] hover:bg-[#5a3fd9] text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Save Settings</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
