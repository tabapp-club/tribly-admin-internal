'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Settings,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';

export default function BusinessesPage() {
  const { user, hasRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');

  // Mock data
  const businesses = [
    {
      id: 1,
      name: 'TechCorp Solutions',
      industry: 'Technology',
      status: 'active',
      subscription: 'Professional',
      revenue: '$12,500',
      users: 45,
      onboardedAt: '2024-01-15',
      lastActivity: '2 hours ago',
      assignedTo: 'Sarah Johnson',
      features: ['Analytics', 'Campaigns', 'AI']
    },
    {
      id: 2,
      name: 'RetailMax Inc',
      industry: 'Retail',
      status: 'pending',
      subscription: 'Basic',
      revenue: '$8,200',
      users: 23,
      onboardedAt: '2024-01-14',
      lastActivity: '1 day ago',
      assignedTo: 'Mike Chen',
      features: ['Analytics', 'Campaigns']
    },
    {
      id: 3,
      name: 'HealthCare Plus',
      industry: 'Healthcare',
      status: 'active',
      subscription: 'Enterprise',
      revenue: '$15,300',
      users: 78,
      onboardedAt: '2024-01-13',
      lastActivity: '30 minutes ago',
      assignedTo: 'Emily Davis',
      features: ['Analytics', 'Campaigns', 'AI', 'Automation']
    },
    {
      id: 4,
      name: 'FinanceFlow Ltd',
      industry: 'Finance',
      status: 'trial',
      subscription: 'Trial',
      revenue: '$5,800',
      users: 12,
      onboardedAt: '2024-01-12',
      lastActivity: '3 hours ago',
      assignedTo: 'Mike Chen',
      features: ['Analytics']
    },
    {
      id: 5,
      name: 'EduTech Academy',
      industry: 'Education',
      status: 'inactive',
      subscription: 'Basic',
      revenue: '$0',
      users: 0,
      onboardedAt: '2024-01-10',
      lastActivity: '1 week ago',
      assignedTo: 'Sarah Johnson',
      features: ['Analytics']
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'success' as const, icon: CheckCircle },
      pending: { variant: 'warning' as const, icon: Clock },
      trial: { variant: 'info' as const, icon: Clock },
      inactive: { variant: 'destructive' as const, icon: AlertCircle }
    };

    const config = variants[status as keyof typeof variants] || variants.inactive;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{status}</span>
      </Badge>
    );
  };

  const getSubscriptionBadge = (subscription: string) => {
    const variants = {
      'Enterprise': 'destructive',
      'Professional': 'default',
      'Basic': 'secondary',
      'Trial': 'outline'
    } as const;

    return (
      <Badge variant={variants[subscription as keyof typeof variants] || 'outline'}>
        {subscription}
      </Badge>
    );
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || business.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || business.industry === industryFilter;

    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const stats = {
    total: businesses.length,
    active: businesses.filter(b => b.status === 'active').length,
    pending: businesses.filter(b => b.status === 'pending').length,
    trial: businesses.filter(b => b.status === 'trial').length,
    totalRevenue: businesses.reduce((sum, b) => sum + parseInt(b.revenue.replace('$', '').replace(',', '')), 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Business Management</h1>
            <p className="text-muted-foreground">Manage and monitor all businesses on the platform</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Onboard Business</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Businesses</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-success">{stats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trial</p>
                  <p className="text-2xl font-bold text-info">{stats.trial}</p>
                </div>
                <Clock className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-accent">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="trial">Trial</option>
                  <option value="inactive">Inactive</option>
                </select>

                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="all">All Industries</option>
                  <option value="Technology">Technology</option>
                  <option value="Retail">Retail</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Businesses Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Businesses ({filteredBusinesses.length})</CardTitle>
            <CardDescription>Manage business accounts and subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBusinesses.map((business) => (
                <div key={business.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{business.name}</h3>
                      <p className="text-sm text-muted-foreground">{business.industry}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(business.status)}
                        {getSubscriptionBadge(business.subscription)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-medium">{business.revenue}</p>
                      <p className="text-sm text-muted-foreground">Monthly</p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">{business.users}</p>
                      <p className="text-sm text-muted-foreground">Users</p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">{business.assignedTo}</p>
                      <p className="text-sm text-muted-foreground">Assigned to</p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">{business.lastActivity}</p>
                      <p className="text-sm text-muted-foreground">Last activity</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      {hasRole('master') && (
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
