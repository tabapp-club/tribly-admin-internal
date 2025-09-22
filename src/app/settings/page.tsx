'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Settings,
  User,
  Bell,
  Shield,
  Mail,
  Phone,
  Globe,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronDown
} from 'lucide-react';

interface TabItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Settings state
  const [profileSettings, setProfileSettings] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@tribly.com',
    phone: '+1 (555) 123-4567',
    jobTitle: 'Platform Administrator',
    department: 'Operations'
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      addNotification({
        title: 'Settings Saved',
        message: `${section} settings have been updated successfully.`,
        type: 'success'
      });
    } catch (error) {
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="mb-0.5">First Name *</Label>
                <Input
                  id="firstName"
                  value={profileSettings.firstName}
                  onChange={(e) => setProfileSettings(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="mb-0.5">Last Name *</Label>
                <Input
                  id="lastName"
                  value={profileSettings.lastName}
                  onChange={(e) => setProfileSettings(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="mb-0.5">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profileSettings.email}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="mb-0.5">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={profileSettings.phone}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="jobTitle" className="mb-0.5">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={profileSettings.jobTitle}
                  onChange={(e) => setProfileSettings(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="Enter job title"
                />
              </div>

              <div>
                <Label htmlFor="department" className="mb-0.5">Department</Label>
                <Select value={profileSettings.department} onValueChange={(value) => setProfileSettings(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
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

              <div>
                <Label htmlFor="sessionTimeout" className="mb-0.5">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  placeholder="30"
                />
              </div>

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