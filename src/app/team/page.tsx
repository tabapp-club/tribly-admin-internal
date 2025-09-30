'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImprovedInput } from '@/components/ui/ImprovedInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DataTable from '@/components/ui/DataTable';
import {
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BarChart3,
  Award,
  Activity,
  UserCheck,
  UserX,
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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    department: '',
    role: '',
    isActive: true
  });

  // Debounced search for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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

  // API hooks for data fetching
  const { data: apiTeamMembers, loading: membersLoading, execute: fetchMembers } = useApi({
    showErrorNotification: true,
    errorMessage: 'Failed to load team members'
  });

  const { execute: updateMember, loading: updateLoading } = useApi({
    showSuccessNotification: true,
    showErrorNotification: true,
    successMessage: 'Team member updated successfully',
    errorMessage: 'Failed to update team member'
  });

  const [teamStats, setTeamStats] = useState({
    totalMembers: 24,
    highPerformers: 8,
    lowPerformers: 3,
    averagePerformance: 87
  });




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

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setEditFormData({
      name: member.name,
      email: member.email,
      jobTitle: member.jobTitle,
      department: member.department,
      role: member.role,
      isActive: member.isActive
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = useCallback(async () => {
    if (!editingMember) return;

    try {
      await updateMember(async () => {
        // In a real app, this would call the API
        // await teamApi.update(editingMember.id, editFormData);
        
        // For now, update local state
        setTeamMembers(prev => prev.map(member => 
          member.id === editingMember.id 
            ? { ...member, ...editFormData }
            : member
        ));
        
        return { success: true };
      });

      setIsEditModalOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error('Failed to update team member:', error);
    }
  }, [editingMember, editFormData, updateMember]);

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingMember(null);
    setEditFormData({
      name: '',
      email: '',
      jobTitle: '',
      department: '',
      role: '',
      isActive: true
    });
  };

  // Memoized filtered members for better performance
  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || member.role === filterRole;
      const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && member.isActive) ||
                           (filterStatus === 'inactive' && !member.isActive);
      
      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });
  }, [teamMembers, debouncedSearchTerm, filterRole, filterDepartment, filterStatus]);

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
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => handleEditMember(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  // Show loading state
  if (membersLoading) {
    return <LoadingSpinner fullScreen text="Loading team members..." />;
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex gap-[7px] items-start mb-12">
          <button 
            onClick={() => router.back()}
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
              <p className="leading-[1.4]">Team overview</p>
            </div>
            <div className="flex flex-col font-light justify-center relative shrink-0 text-[14px]">
              <p className="leading-[1.4]">Manage and monitor your team performance</p>
            </div>
          </div>
        </div>

        {/* Stats Cards - Mobile & Desktop */}
        <div className="space-y-4 lg:space-y-0 mb-8">
          {/* Mobile Layout */}
          <div className="block lg:hidden space-y-3">
            {/* Primary Metrics Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Total Members Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{teamStats.totalMembers}</p>
                    <p className="text-xs text-gray-500 font-medium">Total</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  All team members
                </div>
              </div>

              {/* Average Performance Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{teamStats.averagePerformance}%</p>
                    <p className="text-xs text-gray-500 font-medium">Avg Performance</p>
                  </div>
                </div>
                <div className="text-xs text-green-600">
                  +5% from last month
                </div>
              </div>
            </div>

            {/* Performance Breakdown Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* High Performers Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{teamStats.highPerformers}</p>
                    <p className="text-xs text-gray-500 font-medium">High Performers</p>
                  </div>
                </div>
                <div className="text-xs text-green-600">
                  {Math.round((teamStats.highPerformers / teamStats.totalMembers) * 100)}% of team
                </div>
              </div>

              {/* Low Performers Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{teamStats.lowPerformers}</p>
                    <p className="text-xs text-gray-500 font-medium">Low Performers</p>
                  </div>
                </div>
                <div className="text-xs text-red-600">
                  {Math.round((teamStats.lowPerformers / teamStats.totalMembers) * 100)}% of team
                </div>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm">
                <div className="text-center flex-1">
                  <p className="font-bold text-gray-900">{teamStats.totalMembers}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center flex-1">
                  <p className="font-bold text-green-600">{teamStats.highPerformers}</p>
                  <p className="text-xs text-gray-500">High</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center flex-1">
                  <p className="font-bold text-red-600">{teamStats.lowPerformers}</p>
                  <p className="text-xs text-gray-500">Low</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center flex-1">
                  <p className="font-bold text-purple-600">{teamStats.averagePerformance}%</p>
                  <p className="text-xs text-gray-500">Avg</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
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
        </div>


        {/* Team Members - Mobile & Desktop */}
        <Card className="shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage and monitor your team members&apos; performance
                </CardDescription>
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

            {/* Mobile Layout - Card View */}
            <div className="block lg:hidden space-y-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  {/* Member Header */}
                  <div className="mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-[#e9e9e9] text-[#2a2a2f] text-lg">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">{member.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{member.jobTitle}</p>
                        <p className="text-xs text-gray-500 truncate">{member.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Performance</span>
                        <span className={`text-sm font-semibold ${getPerformanceColor(member.performance.conversionRate)}`}>
                          {member.performance.conversionRate}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{member.performance.businessesOnboarded} onboarded</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Revenue</span>
                        <span className="text-sm font-semibold text-gray-900">
                          ${member.performance.totalRevenue.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{member.assignedBusinesses} businesses</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Department: {member.department}</span>
                    <span>Last active: {member.lastActiveAt.toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {/* Tags and Status */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={`${getRoleColor(member.role)} text-xs px-2 py-1`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${member.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-xs text-gray-600">
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Edit Button */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-3 text-xs"
                      onClick={() => handleEditMember(member)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}

              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Layout - Table View */}
            <div className="hidden lg:block">
              <DataTable
                columns={tableColumns}
                data={filteredMembers}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Member Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update the team member&apos;s information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobTitle" className="text-right">
                Job Title
              </Label>
              <Input
                id="jobTitle"
                value={editFormData.jobTitle}
                onChange={(e) => setEditFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Select 
                value={editFormData.department} 
                onValueChange={(value) => setEditFormData(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select 
                value={editFormData.role} 
                onValueChange={(value) => setEditFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                value={editFormData.isActive ? 'active' : 'inactive'} 
                onValueChange={(value) => setEditFormData(prev => ({ ...prev, isActive: value === 'active' }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit} disabled={updateLoading}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateLoading}>
              {updateLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
