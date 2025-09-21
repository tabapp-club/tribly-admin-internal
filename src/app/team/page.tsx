'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DataTable from '@/components/ui/DataTable';
import {
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BarChart3,
  Award,
  Activity,
  UserCheck,
  UserX,
  RefreshCw,
  Settings
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'master' | 'manager' | 'team';
  department: string;
  jobTitle: string;
  isActive: boolean;
  avatar?: string;
  performance: {
    businessesOnboarded: number;
    totalRevenue: number;
    conversionRate: number;
    averageOnboardingTime: number;
    monthlyTarget: number;
    monthlyAchieved: number;
  };
  lastActiveAt: Date;
  createdAt: Date;
  assignedBusinesses: number;
}

export default function TeamOverviewPage() {
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - in a real app, this would come from an API
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@tribly.com',
      role: 'manager',
      department: 'Sales',
      jobTitle: 'Sales Manager',
      isActive: true,
      avatar: '',
      performance: {
        businessesOnboarded: 45,
        totalRevenue: 125000,
        conversionRate: 78,
        averageOnboardingTime: 3.2,
        monthlyTarget: 15,
        monthlyAchieved: 12
      },
      lastActiveAt: new Date('2024-01-15T10:30:00'),
      createdAt: new Date('2023-06-15'),
      assignedBusinesses: 23
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@tribly.com',
      role: 'team',
      department: 'Customer Success',
      jobTitle: 'Customer Success Specialist',
      isActive: true,
      avatar: '',
      performance: {
        businessesOnboarded: 32,
        totalRevenue: 89000,
        conversionRate: 85,
        averageOnboardingTime: 2.8,
        monthlyTarget: 12,
        monthlyAchieved: 10
      },
      lastActiveAt: new Date('2024-01-15T09:15:00'),
      createdAt: new Date('2023-08-20'),
      assignedBusinesses: 18
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@tribly.com',
      role: 'team',
      department: 'Marketing',
      jobTitle: 'Marketing Coordinator',
      isActive: true,
      avatar: '',
      performance: {
        businessesOnboarded: 28,
        totalRevenue: 67000,
        conversionRate: 72,
        averageOnboardingTime: 3.5,
        monthlyTarget: 10,
        monthlyAchieved: 8
      },
      lastActiveAt: new Date('2024-01-14T16:45:00'),
      createdAt: new Date('2023-09-10'),
      assignedBusinesses: 15
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@tribly.com',
      role: 'team',
      department: 'Sales',
      jobTitle: 'Sales Representative',
      isActive: false,
      avatar: '',
      performance: {
        businessesOnboarded: 19,
        totalRevenue: 45000,
        conversionRate: 65,
        averageOnboardingTime: 4.1,
        monthlyTarget: 8,
        monthlyAchieved: 5
      },
      lastActiveAt: new Date('2024-01-10T14:20:00'),
      createdAt: new Date('2023-11-05'),
      assignedBusinesses: 12
    }
  ]);

  const [teamStats, setTeamStats] = useState({
    totalMembers: 24,
    highPerformers: 8,
    lowPerformers: 3,
    averagePerformance: 87
  });


  if (!hasRole('manager')) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }


  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'master': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'team': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && member.isActive) ||
                         (filterStatus === 'inactive' && !member.isActive);
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const departments = ['Sales', 'Marketing', 'Customer Success', 'Engineering', 'Product', 'Operations'];

  const tableColumns = [
    {
      key: 'member',
      label: 'Team Member',
      render: (value: any, row: TeamMember) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.avatar} />
            <AvatarFallback className="bg-[#e9e9e9] text-[#2a2a2f]">
              {getInitials(row.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-[#2a2a2f]">{row.name}</div>
            <div className="text-sm text-gray-500">{row.jobTitle}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: any, row: TeamMember) => (
        <Badge className={getRoleColor(row.role)}>
          {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
        </Badge>
      )
    },
    {
      key: 'department',
      label: 'Department',
      render: (value: any, row: TeamMember) => (
        <span className="text-sm text-gray-600">{row.department}</span>
      )
    },
    {
      key: 'performance',
      label: 'Performance',
      render: (value: any, row: TeamMember) => (
        <div className="text-sm">
          <div className={`font-medium ${getPerformanceColor(row.performance.conversionRate)}`}>
            {row.performance.conversionRate}%
          </div>
          <div className="text-gray-500">{row.performance.businessesOnboarded} onboarded</div>
        </div>
      )
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (value: any, row: TeamMember) => (
        <div className="text-sm font-medium text-gray-900">
          ${row.performance.totalRevenue.toLocaleString()}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any, row: TeamMember) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-sm text-gray-600">
            {row.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: TeamMember) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#f6f6f6] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex gap-[7px] items-start mb-12">
          <button 
            onClick={() => router.back()}
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
              <p className="leading-[1.4]">Team overview</p>
            </div>
            <div className="flex flex-col font-light justify-center relative shrink-0 text-[14px]">
              <p className="leading-[1.4]">Manage and monitor your team performance</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-3xl font-bold text-[#2a2a2f]">{teamStats.totalMembers}</p>
                  <p className="text-sm text-gray-500">All team members</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Performers</p>
                  <p className="text-3xl font-bold text-[#2a2a2f]">{teamStats.highPerformers}</p>
                  <p className="text-sm text-green-600">
                    {Math.round((teamStats.highPerformers / teamStats.totalMembers) * 100)}% of team
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Performers</p>
                  <p className="text-3xl font-bold text-[#2a2a2f]">{teamStats.lowPerformers}</p>
                  <p className="text-sm text-red-600">
                    {Math.round((teamStats.lowPerformers / teamStats.totalMembers) * 100)}% of team
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                  <p className="text-3xl font-bold text-[#2a2a2f]">{teamStats.averagePerformance}%</p>
                  <p className="text-sm text-green-600">+5% from last month</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Team Members Table */}
        <Card className="shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage and monitor your team members' performance
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DataTable
              columns={tableColumns}
              data={filteredMembers}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
