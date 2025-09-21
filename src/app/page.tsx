'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Target,
  Zap,
  Brain,
  Database,
  Trophy,
  ShoppingCart,
  BarChart3,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Mock data for the dashboard
  const stats = [
    {
      title: 'Total Businesses',
      value: '1,247',
      change: '+12%',
      changeType: 'increase' as const,
      icon: Building2,
      color: 'text-primary'
    },
    {
      title: 'Active Subscriptions',
      value: '1,156',
      change: '+8%',
      changeType: 'increase' as const,
      icon: CheckCircle,
      color: 'text-success'
    },
    {
      title: 'Monthly Revenue',
      value: '$89,432',
      change: '+15%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'text-accent'
    },
    {
      title: 'Team Members',
      value: '24',
      change: '+2',
      changeType: 'increase' as const,
      icon: Users,
      color: 'text-info'
    }
  ];

  const recentBusinesses = [
    { id: 1, name: 'TechCorp Solutions', industry: 'Technology', status: 'active', onboardedAt: '2024-01-15', revenue: '$12,500' },
    { id: 2, name: 'RetailMax Inc', industry: 'Retail', status: 'pending', onboardedAt: '2024-01-14', revenue: '$8,200' },
    { id: 3, name: 'HealthCare Plus', industry: 'Healthcare', status: 'active', onboardedAt: '2024-01-13', revenue: '$15,300' },
    { id: 4, name: 'FinanceFlow Ltd', industry: 'Finance', status: 'trial', onboardedAt: '2024-01-12', revenue: '$5,800' },
  ];

  const teamPerformance = [
    { name: 'Sarah Johnson', role: 'Manager', businesses: 45, revenue: '$125,000', target: 50 },
    { name: 'Mike Chen', role: 'Team', businesses: 32, revenue: '$89,500', target: 40 },
    { name: 'Emily Davis', role: 'Team', businesses: 28, revenue: '$76,200', target: 35 },
  ];

  const businessFeatures = [
    { name: 'Dashboard Analytics', enabled: true, usage: '98%' },
    { name: 'Campaign Management', enabled: true, usage: '87%' },
    { name: 'Data Center', enabled: true, usage: '92%' },
    { name: 'Tribly AI', enabled: false, usage: '0%' },
    { name: 'Automation', enabled: true, usage: '78%' },
    { name: 'Cohorts', enabled: true, usage: '65%' },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'success',
      pending: 'warning',
      trial: 'info',
      inactive: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span>Welcome back, {user?.name}!</span>
            </CardTitle>
            <CardDescription>
              Here's what's happening with your Tribly business platform today.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${stat.changeType === 'increase' ? 'text-success' : 'text-destructive'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Businesses */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Businesses</span>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Business
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBusinesses.map((business) => (
                  <div key={business.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{business.name}</p>
                        <p className="text-sm text-muted-foreground">{business.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">{business.revenue}</p>
                        <p className="text-sm text-muted-foreground">{business.onboardedAt}</p>
                      </div>
                      {getStatusBadge(business.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Top performers this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamPerformance.map((member, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <Badge variant="outline">{member.businesses} businesses</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round((member.businesses / member.target) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min((member.businesses / member.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Revenue: {member.revenue}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Usage & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage</CardTitle>
              <CardDescription>Most used business features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${feature.enabled ? 'bg-success' : 'bg-muted-foreground'}`} />
                      <span className="font-medium">{feature.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: feature.usage }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12">{feature.usage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Building2 className="h-5 w-5" />
                  <span className="text-sm">Onboard Business</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Add Team Member</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Zap className="h-5 w-5" />
                  <span className="text-sm">Manage Features</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">API Services</p>
                  <p className="text-sm text-muted-foreground">All systems operational</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium">Email Service</p>
                  <p className="text-sm text-muted-foreground">Minor delays</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">Payment Gateway</p>
                  <p className="text-sm text-muted-foreground">Processing normally</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
