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
  Database,
  Mail,
  Globe,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronDown,
  ArrowLeft
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
  const { user, hasRole } = useAuth();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'Tribly Admin',
    platformUrl: 'https://admin.tribly.com',
    supportEmail: 'support@tribly.com',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
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
    ipWhitelist: false,
    auditLogging: true
  });

  const tabs: TabItem[] = [
    {
      id: 'general',
      title: 'General settings',
      description: 'Basic platform configuration',
      icon: Settings,
      completed: !!(generalSettings.platformName && generalSettings.platformUrl && generalSettings.supportEmail)
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
      completed: !!(securitySettings.twoFactorAuth || securitySettings.auditLogging)
    },
    {
      id: 'system',
      title: 'System settings',
      description: 'Advanced system configuration',
      icon: Database,
      completed: !!(securitySettings.auditLogging)
    }
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

  if (!hasRole('manager')) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

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
                <Label htmlFor="platformName" className="mb-0.5">Platform Name *</Label>
                <Input
                  id="platformName"
                  value={generalSettings.platformName}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, platformName: e.target.value }))}
                  placeholder="Platform name"
                />
              </div>

              <div>
                <Label htmlFor="platformUrl" className="mb-0.5">Platform URL *</Label>
                <Input
                  id="platformUrl"
                  value={generalSettings.platformUrl}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, platformUrl: e.target.value }))}
                  placeholder="https://platform.com"
                />
              </div>

              <div>
                <Label htmlFor="supportEmail" className="mb-0.5">Support Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="supportEmail"
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                    placeholder="support@platform.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="timezone" className="mb-0.5">Timezone</Label>
                <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dateFormat" className="mb-0.5">Date Format</Label>
                <Select value={generalSettings.dateFormat} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, dateFormat: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currency" className="mb-0.5">Currency</Label>
                <Select value={generalSettings.currency} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
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

      case 'system':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Put the system in maintenance mode</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={false}
                  onCheckedChange={() => {}}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="debugMode">Debug Mode</Label>
                  <p className="text-sm text-gray-500">Enable detailed logging and debugging</p>
                </div>
                <Switch
                  id="debugMode"
                  checked={false}
                  onCheckedChange={() => {}}
                />
              </div>

              <div>
                <Label htmlFor="logLevel" className="mb-0.5">Log Level</Label>
                <Select value="info" onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select log level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="backupFrequency" className="mb-0.5">Backup Frequency</Label>
                <Select value="daily" onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select backup frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
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
              <p className="leading-[1.4]">Settings</p>
            </div>
            <div className="flex flex-col font-light justify-center relative shrink-0 text-[14px]">
              <p className="leading-[1.4]">Manage your platform configuration and preferences</p>
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