'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Building2,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Settings,
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
  status: 'active' | 'inactive';
  userType: 'trial' | 'paid';
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
  const [sortBy, setSortBy] = useState('revenue');

  // Mock data with enhanced business information
  const businesses: Business[] = [
    {
      id: 1,
      name: 'TechCorp Solutions',
      industry: 'Technology',
      status: 'active',
      userType: 'paid',
      subscription: 'Professional',
      revenue: 12500,
      users: 45,
      onboardedAt: '2024-01-15',
      lastActivity: '2 hours ago',
      assignedTo: 'Sarah Johnson',
      features: ['Analytics', 'Campaigns', 'AI'],
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
      subscription: 'Trial',
      revenue: 0,
      users: 23,
      onboardedAt: '2024-01-14',
      lastActivity: '1 day ago',
      assignedTo: 'Mike Chen',
      features: ['Analytics', 'Campaigns'],
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
      subscription: 'Enterprise',
      revenue: 15300,
      users: 78,
      onboardedAt: '2024-01-13',
      lastActivity: '30 minutes ago',
      assignedTo: 'Emily Davis',
      features: ['Analytics', 'Campaigns', 'AI', 'Automation'],
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
      subscription: 'Trial',
      revenue: 0,
      users: 12,
      onboardedAt: '2024-01-12',
      lastActivity: '3 hours ago',
      assignedTo: 'Mike Chen',
      features: ['Analytics'],
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
      subscription: 'Basic',
      revenue: 0,
      users: 0,
      onboardedAt: '2024-01-10',
      lastActivity: '1 week ago',
      assignedTo: 'Sarah Johnson',
      features: ['Analytics'],
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
      subscription: 'Professional',
      revenue: 8900,
      users: 34,
      onboardedAt: '2024-01-08',
      lastActivity: '4 hours ago',
      assignedTo: 'David Wilson',
      features: ['Analytics', 'Campaigns', 'Automation'],
      growthRate: 6.8,
      mrr: 8900,
      churnRisk: 'low'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'success' as const, icon: CheckCircle, color: 'text-green-600' },
      inactive: { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' }
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
      trial: { variant: 'outline' as const, icon: Clock, color: 'text-blue-600' },
      paid: { variant: 'default' as const, icon: Crown, color: 'text-purple-600' }
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
      low: { variant: 'success' as const, color: 'text-green-600' },
      medium: { variant: 'warning' as const, color: 'text-yellow-600' },
      high: { variant: 'destructive' as const, color: 'text-red-600' }
    };

    const config = variants[risk as keyof typeof variants] || variants.low;

    return (
      <Badge variant={config.variant} className="text-xs">
        {risk} risk
      </Badge>
    );
  };

  const filteredAndSortedBusinesses = useMemo(() => {
    let filtered = businesses.filter(business => {
      const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           business.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           business.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || business.status === statusFilter;
      const matchesUserType = userTypeFilter === 'all' || business.userType === userTypeFilter;
      const matchesIndustry = industryFilter === 'all' || business.industry === industryFilter;

      return matchesSearch && matchesStatus && matchesUserType && matchesIndustry;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Business];
      let bValue: any = b[sortBy as keyof Business];

      if (sortBy === 'onboardedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [businesses, searchQuery, statusFilter, userTypeFilter, industryFilter, sortBy]);

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

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex gap-[7px] items-start mb-6">
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[20px] font-bold text-black">Onboarded Businesses</h2>
              <p className="text-[14px] font-normal text-muted-foreground">Manage business accounts, subscriptions, and performance</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search businesses, industries, or assigned users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="growthRate">Growth Rate</SelectItem>
                  <SelectItem value="onboardedAt">Onboarded Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

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
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit Business">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Settings">
                      <Settings className="h-4 w-4" />
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
    </div>
  );
}
