'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Building2,
  Search,
  Edit,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Crown,
  Zap,
  Target,
  BarChart3,
  CreditCard
} from 'lucide-react';

interface Business {
  id: number;
  name: string;
  industry: string;
  status: 'active' | 'inactive' | 'onboarding';
  userType: 'trial' | 'paid' | 'free';
  subscription: string;
  revenue: number;
  users: number;
  onboardedAt: string;
  lastActivity: string;
  assignedTo: string;
  features: string[];
  growthRate: number;
  mrr: number;
  churnRisk: 'low' | 'medium' | 'high';
}

export default function BusinessOverviewPage() {
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [featuresCountFilter, setFeaturesCountFilter] = useState('all');
  const [assignedToFilter, setAssignedToFilter] = useState('all');
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    industry: '',
    status: 'active' as 'active' | 'inactive' | 'onboarding',
    userType: 'trial' as 'trial' | 'paid' | 'free',
    subscription: '',
    assignedTo: '',
    features: [] as string[]
  });

  // Mock data with enhanced business information
  const businesses: Business[] = [
    {
      id: 1,
      name: 'TechCorp Solutions',
      industry: 'Technology',
      status: 'active',
      userType: 'paid',
      subscription: 'Individual Business',
      revenue: 12500,
      users: 45,
      onboardedAt: '2024-01-15',
      lastActivity: '2 hours ago',
      assignedTo: 'Sarah Chen - Sales Manager',
      features: ['Tribly AI for Business', 'Campaigns', 'Automation'],
      growthRate: 12.5,
      mrr: 12500,
      churnRisk: 'low'
    },
    {
      id: 2,
      name: 'RetailMax Inc',
      industry: 'Retail',
      status: 'active',
      userType: 'trial',
      subscription: 'Individual',
      revenue: 0,
      users: 23,
      onboardedAt: '2024-01-14',
      lastActivity: '1 day ago',
      assignedTo: 'Mike Rodriguez - Senior Sales Rep',
      features: ['Tribly AI for Business', 'Campaigns'],
      growthRate: 8.2,
      mrr: 0,
      churnRisk: 'medium'
    },
    {
      id: 3,
      name: 'HealthCare Plus',
      industry: 'Healthcare',
      status: 'active',
      userType: 'paid',
      subscription: 'Organisation',
      revenue: 15300,
      users: 78,
      onboardedAt: '2024-01-13',
      lastActivity: '30 minutes ago',
      assignedTo: 'Emily Davis',
      features: ['Tribly AI for Business', 'Campaigns', 'Achievements and milestones', 'Automation'],
      growthRate: 18.7,
      mrr: 15300,
      churnRisk: 'low'
    },
    {
      id: 4,
      name: 'FinanceFlow Ltd',
      industry: 'Finance',
      status: 'inactive',
      userType: 'trial',
      subscription: 'Individual',
      revenue: 0,
      users: 12,
      onboardedAt: '2024-01-12',
      lastActivity: '3 hours ago',
      assignedTo: 'Mike Rodriguez - Senior Sales Rep',
      features: ['Tribly AI for Business'],
      growthRate: -5.2,
      mrr: 0,
      churnRisk: 'high'
    },
    {
      id: 5,
      name: 'EduTech Academy',
      industry: 'Education',
      status: 'inactive',
      userType: 'paid',
      subscription: 'Individual Business',
      revenue: 0,
      users: 0,
      onboardedAt: '2024-01-10',
      lastActivity: '1 week ago',
      assignedTo: 'Sarah Chen - Sales Manager',
      features: ['Tribly AI for Business'],
      growthRate: -15.3,
      mrr: 0,
      churnRisk: 'high'
    },
    {
      id: 6,
      name: 'Manufacturing Pro',
      industry: 'Manufacturing',
      status: 'active',
      userType: 'paid',
      subscription: 'Multiple businesses',
      revenue: 8900,
      users: 34,
      onboardedAt: '2024-01-08',
      lastActivity: '4 hours ago',
      assignedTo: 'David Wilson',
      features: ['Tribly AI for Business', 'Campaigns', 'Automation'],
      growthRate: 6.8,
      mrr: 8900,
      churnRisk: 'low'
    },
    {
      id: 7,
      name: 'StartupHub Inc',
      industry: 'Technology',
      status: 'onboarding',
      userType: 'trial',
      subscription: 'Individual',
      revenue: 0,
      users: 5,
      onboardedAt: '2024-01-20',
      lastActivity: '1 hour ago',
      assignedTo: 'Sarah Chen - Sales Manager',
      features: ['Tribly AI for Business'],
      growthRate: 0,
      mrr: 0,
      churnRisk: 'low'
    },
    {
      id: 8,
      name: 'GreenEnergy Co',
      industry: 'Energy',
      status: 'onboarding',
      userType: 'paid',
      subscription: 'Individual Business',
      revenue: 0,
      users: 2,
      onboardedAt: '2024-01-21',
      lastActivity: '30 minutes ago',
      assignedTo: 'Mike Rodriguez - Senior Sales Rep',
      features: ['Tribly AI for Business', 'Campaigns'],
      growthRate: 0,
      mrr: 0,
      churnRisk: 'low'
    },
    {
      id: 9,
      name: 'LocalShop Online',
      industry: 'Retail',
      status: 'active',
      userType: 'free',
      subscription: 'Individual',
      revenue: 0,
      users: 8,
      onboardedAt: '2024-01-18',
      lastActivity: '2 hours ago',
      assignedTo: 'Emily Davis',
      features: ['Tribly AI for Business'],
      growthRate: 5.2,
      mrr: 0,
      churnRisk: 'low'
    },
    {
      id: 10,
      name: 'Freelance Design',
      industry: 'Creative',
      status: 'active',
      userType: 'free',
      subscription: 'Individual',
      revenue: 0,
      users: 1,
      onboardedAt: '2024-01-19',
      lastActivity: '1 day ago',
      assignedTo: 'David Wilson',
      features: ['Tribly AI for Business'],
      growthRate: 0,
      mrr: 0,
      churnRisk: 'medium'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'success-soft' as const, icon: CheckCircle, color: 'text-green-700' },
      inactive: { variant: 'error-soft' as const, icon: AlertCircle, color: 'text-red-700' },
      onboarding: { variant: 'info-soft' as const, icon: Clock, color: 'text-blue-700' }
    };

    const config = variants[status as keyof typeof variants] || variants.inactive;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const getUserTypeBadge = (userType: string) => {
    const variants = {
      trial: { variant: 'blue-soft' as const, icon: Clock, color: 'text-blue-700' },
      paid: { variant: 'purple-soft' as const, icon: Crown, color: 'text-purple-700' },
      free: { variant: 'success-soft' as const, icon: Target, color: 'text-green-700' }
    };

    const config = variants[userType as keyof typeof variants] || variants.trial;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span className="capitalize">{userType}</span>
      </Badge>
    );
  };

  const getChurnRiskBadge = (risk: string) => {
    const variants = {
      low: { variant: 'success-soft' as const, color: 'text-green-700' },
      medium: { variant: 'warning-soft' as const, color: 'text-amber-700' },
      high: { variant: 'error-soft' as const, color: 'text-red-700' }
    };

    const config = variants[risk as keyof typeof variants] || variants.low;

    return (
      <Badge variant={config.variant} className="text-xs">
        {risk} risk
      </Badge>
    );
  };

  const filteredAndSortedBusinesses = useMemo(() => {
    return businesses.filter(business => {
      const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           business.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           business.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || business.status === statusFilter;
      const matchesUserType = userTypeFilter === 'all' || business.userType === userTypeFilter;
      const matchesIndustry = industryFilter === 'all' || business.industry === industryFilter;
      const matchesFeaturesCount = featuresCountFilter === 'all' || 
        (featuresCountFilter === '0' && business.features.length === 0) ||
        (featuresCountFilter === '1' && business.features.length === 1) ||
        (featuresCountFilter === '2' && business.features.length === 2) ||
        (featuresCountFilter === '3' && business.features.length === 3) ||
        (featuresCountFilter === '4' && business.features.length === 4) ||
        (featuresCountFilter === '5+' && business.features.length >= 5);
      const matchesAssignedTo = assignedToFilter === 'all' || business.assignedTo === assignedToFilter;

      return matchesSearch && matchesStatus && matchesUserType && matchesIndustry && matchesFeaturesCount && matchesAssignedTo;
    });
  }, [businesses, searchQuery, statusFilter, userTypeFilter, industryFilter, featuresCountFilter, assignedToFilter]);

  const stats = useMemo(() => {
    const total = businesses.length;
    const active = businesses.filter(b => b.status === 'active').length;
    const inactive = businesses.filter(b => b.status === 'inactive').length;
    const trial = businesses.filter(b => b.userType === 'trial').length;
    const paid = businesses.filter(b => b.userType === 'paid').length;
    const totalRevenue = businesses.reduce((sum, b) => sum + b.revenue, 0);
    const totalMRR = businesses.reduce((sum, b) => sum + b.mrr, 0);
    const avgGrowthRate = businesses.reduce((sum, b) => sum + b.growthRate, 0) / businesses.length;
    const highChurnRisk = businesses.filter(b => b.churnRisk === 'high').length;

    return {
      total,
      active,
      inactive,
      trial,
      paid,
      totalRevenue,
      totalMRR,
      avgGrowthRate,
      highChurnRisk
    };
  }, [businesses]);

  const industries = ['Technology', 'Retail', 'Healthcare', 'Finance', 'Education', 'Manufacturing'];
  
  // Get unique assigned users from business data
  const assignedUsers = useMemo(() => {
    const users = businesses.map(business => business.assignedTo);
    return Array.from(new Set(users)).sort();
  }, [businesses]);

  const handleBack = () => {
    router.back();
  };

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setEditFormData({
      name: business.name,
      industry: business.industry,
      status: business.status,
      userType: business.userType,
      subscription: business.subscription,
      assignedTo: business.assignedTo,
      features: [...business.features]
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingBusiness) {
      // In a real app, this would make an API call to update the business
      console.log('Saving business:', { ...editingBusiness, ...editFormData });
      // For now, we'll just close the dialog
      setIsEditDialogOpen(false);
      setEditingBusiness(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingBusiness(null);
    setEditFormData({
      name: '',
      industry: '',
      status: 'active',
      userType: 'trial',
      subscription: '',
      assignedTo: '',
      features: []
    });
  };

  const handleFeatureToggle = (feature: string) => {
    setEditFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="p-4 space-y-4">
          {/* Mobile Header */}
          <div className="flex gap-[7px] items-start mb-4">
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
            <div className="flex flex-col items-start leading-[0] relative shrink-0 text-black flex-1 min-w-0">
              <div className="flex flex-col font-bold justify-center relative shrink-0 text-lg">
                <p className="leading-[1.4] truncate">Business Overview</p>
              </div>
              <div className="flex flex-col font-light justify-center relative shrink-0 text-xs">
                <p className="leading-[1.4]">Monitor and manage all business accounts</p>
              </div>
            </div>
          </div>

          {/* Mobile Stats Cards - Redesigned */}
          <div className="space-y-3">
            {/* Primary Metrics Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Total Businesses Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-500 font-medium">Total</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">{stats.active} active</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">{stats.inactive} inactive</span>
                  </div>
                </div>
              </div>

              {/* Revenue Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 font-medium">Revenue</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  MRR: ₹{stats.totalMRR.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Secondary Metrics Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* User Types Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stats.paid + stats.trial}</p>
                    <p className="text-xs text-gray-500 font-medium">Users</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">{stats.paid} paid</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">{stats.trial} trial</span>
                  </div>
                </div>
              </div>

              {/* Growth Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${stats.avgGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.avgGrowthRate > 0 ? '+' : ''}{stats.avgGrowthRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 font-medium">Growth</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {stats.highChurnRisk} high risk
                </div>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <div className="text-center flex-1">
                  <p className="font-bold text-gray-900">{stats.active}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center flex-1">
                  <p className="font-bold text-gray-900">{stats.inactive}</p>
                  <p className="text-xs text-gray-500">Inactive</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center flex-1">
                  <p className="font-bold text-gray-900">{stats.paid}</p>
                  <p className="text-xs text-gray-500">Paid</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center flex-1">
                  <p className="font-bold text-gray-900">{stats.trial}</p>
                  <p className="text-xs text-gray-500">Trial</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Search and Filters - Redesigned */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search businesses, industries, or contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Filter Section Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {[statusFilter, userTypeFilter, industryFilter, featuresCountFilter, assignedToFilter].filter(f => f !== 'all').length} active
                </span>
                <button 
                  onClick={() => {
                    setStatusFilter('all');
                    setUserTypeFilter('all');
                    setIndustryFilter('all');
                    setFeaturesCountFilter('all');
                    setAssignedToFilter('all');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* Primary Filters Row */}
            <div className="grid grid-cols-2 gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 text-sm rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                </SelectContent>
              </Select>

              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="h-12 text-sm rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Secondary Filters Row */}
            <div className="grid grid-cols-2 gap-3">
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="h-12 text-sm rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={featuresCountFilter} onValueChange={setFeaturesCountFilter}>
                <SelectTrigger className="h-12 text-sm rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <SelectValue placeholder="Features" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Features</SelectItem>
                  <SelectItem value="0">0 Features</SelectItem>
                  <SelectItem value="1">1 Feature</SelectItem>
                  <SelectItem value="2">2 Features</SelectItem>
                  <SelectItem value="3">3 Features</SelectItem>
                  <SelectItem value="4">4 Features</SelectItem>
                  <SelectItem value="5+">5+ Features</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assigned To Filter - Full Width */}
            <div>
              <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
                <SelectTrigger className="h-12 text-sm rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full">
                  <SelectValue placeholder="Assigned To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sales Team</SelectItem>
                  {assignedUsers.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filter Pills */}
            {[statusFilter, userTypeFilter, industryFilter, featuresCountFilter, assignedToFilter].filter(f => f !== 'all').length > 0 && (
              <div className="flex flex-wrap gap-2">
                {statusFilter !== 'all' && (
                  <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                    <span>Status: {statusFilter}</span>
                    <button 
                      onClick={() => setStatusFilter('all')}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                )}
                {userTypeFilter !== 'all' && (
                  <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                    <span>Type: {userTypeFilter}</span>
                    <button 
                      onClick={() => setUserTypeFilter('all')}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                )}
                {industryFilter !== 'all' && (
                  <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                    <span>Industry: {industryFilter}</span>
                    <button 
                      onClick={() => setIndustryFilter('all')}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                )}
                {featuresCountFilter !== 'all' && (
                  <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                    <span>Features: {featuresCountFilter}</span>
                    <button 
                      onClick={() => setFeaturesCountFilter('all')}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                )}
                {assignedToFilter !== 'all' && (
                  <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                    <span>Assigned: {assignedToFilter}</span>
                    <button 
                      onClick={() => setAssignedToFilter('all')}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Business List */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-black">Businesses ({filteredAndSortedBusinesses.length})</h2>
            
            {filteredAndSortedBusinesses.map((business) => (
              <div key={business.id} className="bg-white border rounded-lg p-4 space-y-3">
                {/* Business Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">{business.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{business.industry}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => handleEditBusiness(business)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(business.status)}
                  {getUserTypeBadge(business.userType)}
                  {getChurnRiskBadge(business.churnRisk)}
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 py-2 border-t border-gray-100">
                  <div className="text-center">
                    <p className="font-semibold text-sm">{business.users}</p>
                    <p className="text-xs text-muted-foreground">Users</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">{business.features.length}</p>
                    <p className="text-xs text-muted-foreground">Features</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">₹{business.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><span className="font-medium">Subscription:</span> {business.subscription}</p>
                  <p><span className="font-medium">Assigned:</span> {business.assignedTo}</p>
                  <p><span className="font-medium">Last Activity:</span> {business.lastActivity}</p>
                </div>

                {/* Features */}
                {business.features.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-muted-foreground mb-2">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {business.features.map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredAndSortedBusinesses.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block px-[120px] py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex gap-[7px] items-start mb-6">
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
                <p className="leading-[1.4]">Business Overview</p>
              </div>
              <div className="flex flex-col font-light justify-center relative shrink-0 text-[14px]">
                <p className="leading-[1.4]">Monitor and manage all business accounts</p>
              </div>
            </div>
          </div>


          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Businesses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">{stats.active} Active</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">{stats.inactive} Inactive</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">MRR: ₹{stats.totalMRR.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">User Types</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">{stats.paid} Paid</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">{stats.trial} Trial</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg Growth Rate</p>
                  <p className={`text-2xl font-bold ${stats.avgGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.avgGrowthRate > 0 ? '+' : ''}{stats.avgGrowthRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stats.highChurnRisk} high churn risk</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Businesses Table */}
          <div>
            <div className="mb-6">
              <h2 className="text-[20px] font-bold text-black">Onboarded Businesses</h2>
              <p className="text-[14px] font-normal text-muted-foreground">Manage business accounts, subscriptions, and performance</p>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="User Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="trial">Trial Users</SelectItem>
                    <SelectItem value="paid">Paid Users</SelectItem>
                    <SelectItem value="free">Free Users</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={featuresCountFilter} onValueChange={setFeaturesCountFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Features" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Features</SelectItem>
                    <SelectItem value="0">0 Features</SelectItem>
                    <SelectItem value="1">1 Feature</SelectItem>
                    <SelectItem value="2">2 Features</SelectItem>
                    <SelectItem value="3">3 Features</SelectItem>
                    <SelectItem value="4">4 Features</SelectItem>
                    <SelectItem value="5+">5+ Features</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Assigned To" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sales Team</SelectItem>
                    {assignedUsers.map(user => (
                      <SelectItem key={user} value={user}>{user}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search businesses, industries, or assigned users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[400px] min-w-[300px]"
                />
              </div>
            </div>
            
            <div>
              <div className="space-y-2">
                {filteredAndSortedBusinesses.map((business) => (
                  <div key={business.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                    {/* Left Section - Business Info */}
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-base truncate">{business.name}</h3>
                          {getStatusBadge(business.status)}
                          {getUserTypeBadge(business.userType)}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{business.industry}</span>
                          <span>•</span>
                          <span>{business.subscription}</span>
                          <span>•</span>
                          <span>{business.assignedTo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Center Section - Key Metrics */}
                    <div className="flex items-center space-x-6 px-4">
                      <div className="text-center min-w-[50px]">
                        <p className="font-semibold text-base">{business.users}</p>
                        <p className="text-xs text-muted-foreground">Users</p>
                      </div>
                      <div className="text-center min-w-[50px]">
                        <p className="font-semibold text-base">{business.features.length}</p>
                        <p className="text-xs text-muted-foreground">Features</p>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        title="Edit Business"
                        onClick={() => handleEditBusiness(business)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredAndSortedBusinesses.length === 0 && (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Edit Business Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Business</DialogTitle>
              <DialogDescription>
                Update the business information and settings.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name</Label>
                  <Input
                    id="name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter business name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={editFormData.industry}
                    onValueChange={(value) => setEditFormData(prev => ({ ...prev, industry: value }))}
                  >
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editFormData.status}
                    onValueChange={(value: 'active' | 'inactive' | 'onboarding') => setEditFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userType">User Type</Label>
                  <Select
                    value={editFormData.userType}
                    onValueChange={(value: 'trial' | 'paid' | 'free') => setEditFormData(prev => ({ ...prev, userType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subscription">Subscription</Label>
                  <Select
                    value={editFormData.subscription}
                    onValueChange={(value) => setEditFormData(prev => ({ ...prev, subscription: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subscription plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Individual Business">Individual Business</SelectItem>
                      <SelectItem value="Multiple businesses">Multiple businesses</SelectItem>
                      <SelectItem value="Organisation">Organisation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={editFormData.assignedTo}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                    placeholder="Enter assigned user"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    'Tribly AI for Business',
                    'Achievements and milestones', 
                    'Cohorts',
                    'Automation',
                    'Campaigns'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center justify-between p-3 border rounded-lg">
                      <Label htmlFor={feature} className="text-sm font-medium">
                        {feature}
                      </Label>
                      <Switch
                        id={feature}
                        checked={editFormData.features.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
