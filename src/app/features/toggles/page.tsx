'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
// Removed DashboardLayout import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Zap,
  BarChart3,
  Target,
  Brain,
  Database,
  Users,
  Trophy,
  ShoppingCart,
  Settings,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'analytics' | 'campaigns' | 'automation' | 'ai' | 'data' | 'business';
  isEnabled: boolean;
  isPremium: boolean;
  usage: {
    current: number;
    limit: number;
    resetDate: string;
  };
  businesses: number;
  lastUpdated: string;
}

export default function FeatureTogglesPage() {
  const { hasRole } = useAuth();
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const features: Feature[] = [
    {
      id: '1',
      name: 'Dashboard Analytics',
      description: 'Real-time business metrics and performance insights',
      category: 'analytics',
      isEnabled: true,
      isPremium: false,
      usage: { current: 1247, limit: 2000, resetDate: '2024-02-01' },
      businesses: 1247,
      lastUpdated: '2024-01-20'
    },
    {
      id: '2',
      name: 'Campaign Management',
      description: 'Create and manage marketing campaigns across channels',
      category: 'campaigns',
      isEnabled: true,
      isPremium: false,
      usage: { current: 1089, limit: 2000, resetDate: '2024-02-01' },
      businesses: 1089,
      lastUpdated: '2024-01-19'
    },
    {
      id: '3',
      name: 'Data Center',
      description: 'Centralized data management and user segmentation',
      category: 'data',
      isEnabled: true,
      isPremium: false,
      usage: { current: 1156, limit: 2000, resetDate: '2024-02-01' },
      businesses: 1156,
      lastUpdated: '2024-01-18'
    },
    {
      id: '4',
      name: 'Tribly AI',
      description: 'AI-powered business insights and recommendations',
      category: 'ai',
      isEnabled: false,
      isPremium: true,
      usage: { current: 0, limit: 500, resetDate: '2024-02-01' },
      businesses: 0,
      lastUpdated: '2024-01-15'
    },
    {
      id: '5',
      name: 'Automation',
      description: 'Multi-channel communication automation',
      category: 'automation',
      isEnabled: true,
      isPremium: true,
      usage: { current: 456, limit: 1000, resetDate: '2024-02-01' },
      businesses: 456,
      lastUpdated: '2024-01-17'
    },
    {
      id: '6',
      name: 'Cohorts',
      description: 'User segmentation and cohort analysis',
      category: 'data',
      isEnabled: true,
      isPremium: false,
      usage: { current: 789, limit: 2000, resetDate: '2024-02-01' },
      businesses: 789,
      lastUpdated: '2024-01-16'
    },
    {
      id: '7',
      name: 'Achievements',
      description: 'Goal tracking and milestone management',
      category: 'business',
      isEnabled: true,
      isPremium: false,
      usage: { current: 623, limit: 2000, resetDate: '2024-02-01' },
      businesses: 623,
      lastUpdated: '2024-01-14'
    },
    {
      id: '8',
      name: 'Upsell/Cross-sell',
      description: 'Product and service upselling tools',
      category: 'business',
      isEnabled: false,
      isPremium: true,
      usage: { current: 0, limit: 500, resetDate: '2024-02-01' },
      businesses: 0,
      lastUpdated: '2024-01-10'
    }
  ];

  const categories = [
    { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'text-info' },
    { id: 'campaigns', name: 'Campaigns', icon: Target, color: 'text-primary' },
    { id: 'automation', name: 'Automation', icon: Zap, color: 'text-accent' },
    { id: 'ai', name: 'AI', icon: Brain, color: 'text-purple-500' },
    { id: 'data', name: 'Data', icon: Database, color: 'text-success' },
    { id: 'business', name: 'Business', icon: Trophy, color: 'text-warning' }
  ];

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : Settings;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'text-muted-foreground';
  };

  const handleToggleFeature = (featureId: string, enabled: boolean) => {
    // Simulate API call
    addNotification({
      title: enabled ? 'Feature Enabled' : 'Feature Disabled',
      message: `Feature has been ${enabled ? 'enabled' : 'disabled'} for all businesses.`,
      type: enabled ? 'success' : 'warning'
    });
  };

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || feature.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'enabled' && feature.isEnabled) ||
                         (statusFilter === 'disabled' && !feature.isEnabled);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: features.length,
    enabled: features.filter(f => f.isEnabled).length,
    disabled: features.filter(f => !f.isEnabled).length,
    premium: features.filter(f => f.isPremium).length,
    totalUsage: features.reduce((sum, f) => sum + f.usage.current, 0)
  };

  if (!hasRole('master')) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground">Only master users can manage features.</p>
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
            <h1 className="text-3xl font-bold text-foreground">Feature Management</h1>
            <p className="text-muted-foreground">Control which features are available to businesses</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Feature</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Features</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Settings className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Enabled</p>
                  <p className="text-2xl font-bold text-success">{stats.enabled}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Disabled</p>
                  <p className="text-2xl font-bold text-destructive">{stats.disabled}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Premium</p>
                  <p className="text-2xl font-bold text-warning">{stats.premium}</p>
                </div>
                <Trophy className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Usage</p>
                  <p className="text-2xl font-bold text-accent">{stats.totalUsage.toLocaleString()}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-accent" />
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
                    placeholder="Search features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => {
            const CategoryIcon = getCategoryIcon(feature.category);
            const categoryColor = getCategoryColor(feature.category);
            const usagePercentage = (feature.usage.current / feature.usage.limit) * 100;

            return (
              <Card key={feature.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${categoryColor}`}>
                        <CategoryIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.name}</CardTitle>
                        <CardDescription className="text-sm">{feature.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {feature.isPremium && (
                        <Badge variant="warning">Premium</Badge>
                      )}
                      <div className="flex items-center space-x-1">
                        <Switch
                          checked={feature.isEnabled}
                          onCheckedChange={(enabled) => handleToggleFeature(feature.id, enabled)}
                        />
                        <Label className="text-sm">
                          {feature.isEnabled ? 'Enabled' : 'Disabled'}
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Usage Stats */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Usage</span>
                        <span>{feature.usage.current.toLocaleString()} / {feature.usage.limit.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            usagePercentage > 90 ? 'bg-destructive' :
                            usagePercentage > 70 ? 'bg-warning' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Business Count */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Businesses using:</span>
                      <span className="font-medium">{feature.businesses}</span>
                    </div>

                    {/* Last Updated */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last updated:</span>
                      <span className="font-medium">{feature.lastUpdated}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {feature.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
