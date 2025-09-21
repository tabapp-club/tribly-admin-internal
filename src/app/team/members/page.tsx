'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Settings,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  UserPlus
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'master' | 'manager' | 'team';
  isActive: boolean;
  avatar?: string;
  phone?: string;
  location?: string;
  joinedAt: string;
  lastActiveAt?: string;
  performance: {
    businessesOnboarded: number;
    totalRevenue: number;
    conversionRate: number;
    monthlyTarget: number;
    monthlyAchieved: number;
  };
  assignedBusinesses: string[];
}

export default function TeamMembersPage() {
  const { user, hasRole } = useAuth();
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@tribly.com',
      role: 'manager',
      isActive: true,
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      joinedAt: '2023-06-15',
      lastActiveAt: '2024-01-20 14:30',
      performance: {
        businessesOnboarded: 45,
        totalRevenue: 125000,
        conversionRate: 78,
        monthlyTarget: 50,
        monthlyAchieved: 45
      },
      assignedBusinesses: ['TechCorp Solutions', 'RetailMax Inc', 'HealthCare Plus']
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@tribly.com',
      role: 'team',
      isActive: true,
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      joinedAt: '2023-08-20',
      lastActiveAt: '2024-01-20 12:15',
      performance: {
        businessesOnboarded: 32,
        totalRevenue: 89500,
        conversionRate: 65,
        monthlyTarget: 40,
        monthlyAchieved: 32
      },
      assignedBusinesses: ['FinanceFlow Ltd', 'EduTech Academy']
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily@tribly.com',
      role: 'team',
      isActive: true,
      phone: '+1 (555) 345-6789',
      location: 'Austin, TX',
      joinedAt: '2023-09-10',
      lastActiveAt: '2024-01-19 16:45',
      performance: {
        businessesOnboarded: 28,
        totalRevenue: 76200,
        conversionRate: 70,
        monthlyTarget: 35,
        monthlyAchieved: 28
      },
      assignedBusinesses: ['HealthCare Plus', 'RetailMax Inc']
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@tribly.com',
      role: 'team',
      isActive: false,
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL',
      joinedAt: '2023-11-05',
      lastActiveAt: '2024-01-15 09:20',
      performance: {
        businessesOnboarded: 15,
        totalRevenue: 42000,
        conversionRate: 60,
        monthlyTarget: 30,
        monthlyAchieved: 15
      },
      assignedBusinesses: ['TechCorp Solutions']
    }
  ];

  const getRoleBadge = (role: string) => {
    const variants = {
      master: { variant: 'destructive' as const, label: 'Master' },
      manager: { variant: 'default' as const, label: 'Manager' },
      team: { variant: 'secondary' as const, label: 'Team' }
    };

    const config = variants[role as keyof typeof variants] || variants.team;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="success" className="flex items-center space-x-1">
        <CheckCircle className="h-3 w-3" />
        <span>Active</span>
      </Badge>
    ) : (
      <Badge variant="destructive" className="flex items-center space-x-1">
        <AlertCircle className="h-3 w-3" />
        <span>Inactive</span>
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleToggleStatus = (memberId: string, isActive: boolean) => {
    addNotification({
      title: isActive ? 'Member Activated' : 'Member Deactivated',
      message: `Team member has been ${isActive ? 'activated' : 'deactivated'}.`,
      type: isActive ? 'success' : 'warning'
    });
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && member.isActive) ||
                         (statusFilter === 'inactive' && !member.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.isActive).length,
    managers: teamMembers.filter(m => m.role === 'manager').length,
    team: teamMembers.filter(m => m.role === 'team').length,
    totalRevenue: teamMembers.reduce((sum, m) => sum + m.performance.totalRevenue, 0),
    totalBusinesses: teamMembers.reduce((sum, m) => sum + m.performance.businessesOnboarded, 0)
  };

  if (!hasRole('manager')) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Members</h1>
            <p className="text-muted-foreground">Manage your growth team and track performance</p>
          </div>
          <Button className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Add Team Member</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
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
                  <p className="text-sm font-medium text-muted-foreground">Managers</p>
                  <p className="text-2xl font-bold text-info">{stats.managers}</p>
                </div>
                <Settings className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold text-accent">{stats.team}</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-success">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Businesses</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalBusinesses}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
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
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="all">All Roles</option>
                  <option value="master">Master</option>
                  <option value="manager">Manager</option>
                  <option value="team">Team</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription className="text-sm">{member.email}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getRoleBadge(member.role)}
                    {getStatusBadge(member.isActive)}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    {member.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{member.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                    </div>
                    {member.lastActiveAt && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Last active: {member.lastActiveAt}</span>
                      </div>
                    )}
                  </div>

                  {/* Performance Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Businesses Onboarded:</span>
                      <span className="font-medium">{member.performance.businessesOnboarded}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Total Revenue:</span>
                      <span className="font-medium">${member.performance.totalRevenue.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Conversion Rate:</span>
                      <span className="font-medium">{member.performance.conversionRate}%</span>
                    </div>

                    {/* Monthly Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Monthly Progress</span>
                        <span>{member.performance.monthlyAchieved} / {member.performance.monthlyTarget}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${Math.min((member.performance.monthlyAchieved / member.performance.monthlyTarget) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Assigned Businesses */}
                  <div>
                    <p className="text-sm font-medium mb-2">Assigned Businesses:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.assignedBusinesses.slice(0, 2).map((business, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {business}
                        </Badge>
                      ))}
                      {member.assignedBusinesses.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.assignedBusinesses.length - 2} more
                        </Badge>
                      )}
                    </div>
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
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(member.id, !member.isActive)}
                      className={member.isActive ? 'text-destructive' : 'text-success'}
                    >
                      {member.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
