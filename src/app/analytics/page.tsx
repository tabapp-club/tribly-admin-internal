'use client';

import { useAuth } from '@/contexts/AuthContext';
// Removed DashboardLayout import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

export default function AnalyticsPage() {
  const { hasRole } = useAuth();

  // Mock data
  const revenueData = [
    { month: 'Jan', revenue: 45000, businesses: 120 },
    { month: 'Feb', revenue: 52000, businesses: 135 },
    { month: 'Mar', revenue: 48000, businesses: 128 },
    { month: 'Apr', revenue: 61000, businesses: 145 },
    { month: 'May', revenue: 55000, businesses: 138 },
    { month: 'Jun', revenue: 67000, businesses: 152 }
  ];

  const topBusinesses = [
    { name: 'TechCorp Solutions', revenue: 12500, growth: 15.2, industry: 'Technology' },
    { name: 'HealthCare Plus', revenue: 15300, growth: 8.7, industry: 'Healthcare' },
    { name: 'RetailMax Inc', revenue: 8200, growth: 22.1, industry: 'Retail' },
    { name: 'FinanceFlow Ltd', revenue: 5800, growth: -2.3, industry: 'Finance' }
  ];

  const featureUsage = [
    { name: 'Dashboard Analytics', usage: 98, trend: 'up' },
    { name: 'Campaign Management', usage: 87, trend: 'up' },
    { name: 'Data Center', usage: 92, trend: 'stable' },
    { name: 'Automation', usage: 78, trend: 'up' },
    { name: 'Tribly AI', usage: 45, trend: 'up' },
    { name: 'Cohorts', usage: 65, trend: 'down' }
  ];

  const teamPerformance = [
    { name: 'Sarah Johnson', businesses: 45, revenue: 125000, target: 50 },
    { name: 'Mike Chen', businesses: 32, revenue: 89500, target: 40 },
    { name: 'Emily Davis', businesses: 28, revenue: 76200, target: 35 }
  ];

  if (!hasRole('manager')) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights into your platform performance</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">$332,000</p>
                  <p className="text-sm text-success flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12.5% from last month
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Businesses</p>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-success flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8.2% from last month
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-success flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +2 this month
                  </p>
                </div>
                <Users className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">68.5%</p>
                  <p className="text-sm text-destructive flex items-center">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    -2.1% from last month
                  </p>
                </div>
                <Target className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Business Growth</CardTitle>
            <CardDescription>Monthly revenue and business acquisition trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Revenue chart would be displayed here</p>
                <p className="text-sm text-muted-foreground">Integration with Recharts or similar library</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Businesses & Feature Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Businesses */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Businesses</CardTitle>
              <CardDescription>Highest revenue generating businesses this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topBusinesses.map((business, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{business.name}</p>
                        <p className="text-sm text-muted-foreground">{business.industry}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${business.revenue.toLocaleString()}</p>
                      <p className={`text-sm flex items-center ${
                        business.growth > 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {business.growth > 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(business.growth)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feature Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Analytics</CardTitle>
              <CardDescription>Most popular features across all businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureUsage.map((feature, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{feature.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{feature.usage}%</span>
                        {feature.trend === 'up' && <TrendingUp className="h-4 w-4 text-success" />}
                        {feature.trend === 'down' && <TrendingDown className="h-4 w-4 text-destructive" />}
                        {feature.trend === 'stable' && <div className="h-4 w-4 rounded-full bg-muted-foreground" />}
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${feature.usage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance Overview</CardTitle>
            <CardDescription>Individual team member performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamPerformance.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">Team Member</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="font-medium">{member.businesses}</p>
                      <p className="text-sm text-muted-foreground">Businesses</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">${member.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{Math.round((member.businesses / member.target) * 100)}%</p>
                      <p className="text-sm text-muted-foreground">Target</p>
                    </div>
                    <div className="w-24">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min((member.businesses / member.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
