'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImprovedInput } from '@/components/ui/ImprovedInput';
import { ImprovedTextarea } from '@/components/ui/ImprovedTextarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Building2,
  Search,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Crown,
  Target,
  Trash2
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

export default function BusinessOverviewClient() {
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    industry: '',
    status: 'active' as 'active' | 'inactive' | 'onboarding',
    userType: 'trial' as 'trial' | 'paid' | 'free',
    subscription: '',
    assignedTo: '',
    features: [] as string[]
  });

  // Load businesses from localStorage
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load businesses from localStorage on component mount
  useEffect(() => {
    const loadBusinesses = () => {
      try {
        const storedBusinesses = localStorage.getItem('onboardedBusinesses');
        if (storedBusinesses) {
          const parsedBusinesses = JSON.parse(storedBusinesses);
          setBusinesses(parsedBusinesses);
        }
      } catch (error) {
        console.error('Error loading businesses from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  // Listen for business creation events to refresh data
  useEffect(() => {
    const handleBusinessCreated = (e: CustomEvent) => {
      const newBusiness = e.detail;
      setBusinesses(prev => [...prev, newBusiness]);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'onboardedBusinesses' && e.newValue) {
        try {
          const parsedBusinesses = JSON.parse(e.newValue);
          setBusinesses(parsedBusinesses);
        } catch (error) {
          console.error('Error parsing updated businesses from localStorage:', error);
        }
      }
    };

    // Also refresh when page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        try {
          const storedBusinesses = localStorage.getItem('onboardedBusinesses');
          if (storedBusinesses) {
            const parsedBusinesses = JSON.parse(storedBusinesses);
            setBusinesses(parsedBusinesses);
          }
        } catch (error) {
          console.error('Error refreshing businesses on visibility change:', error);
        }
      }
    };

    window.addEventListener('businessCreated', handleBusinessCreated as EventListener);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('businessCreated', handleBusinessCreated as EventListener);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
    if (businesses.length === 0) return [];
    
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

  const industries = ['Technology', 'Retail', 'Healthcare', 'Finance', 'Education', 'Manufacturing'];
  
  // Get unique assigned users from business data
  const assignedUsers = useMemo(() => {
    if (businesses.length === 0) return [];
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

  const handleDeleteBusiness = () => {
    if (!editingBusiness) {
      console.error('No business selected for deletion');
      return;
    }

    try {
      // Validate business exists in current list
      const businessExists = businesses.some(b => b.id === editingBusiness.id);
      if (!businessExists) {
        console.error('Business not found in current list');
        setIsDeleteDialogOpen(false);
        setIsEditDialogOpen(false);
        setEditingBusiness(null);
        return;
      }

      // Remove business from localStorage
      const updatedBusinesses = businesses.filter(b => b.id !== editingBusiness.id);
      
      // Update state first
      setBusinesses(updatedBusinesses);
      
      // Update localStorage with error handling
      try {
        localStorage.setItem('onboardedBusinesses', JSON.stringify(updatedBusinesses));
      } catch (storageError) {
        console.error('Failed to update localStorage:', storageError);
        // In production, you might want to show an error toast or retry mechanism
        // For now, we'll continue as the state is already updated
      }
      
      // Close dialogs
      setIsDeleteDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingBusiness(null);
      
      // Reset form data
      setEditFormData({
        name: '',
        industry: '',
        status: 'active',
        userType: 'trial',
        subscription: '',
        assignedTo: '',
        features: []
      });

      // Show success feedback (you might want to add a toast notification here)
      console.log(`Business "${editingBusiness.name}" deleted successfully`);
      
    } catch (error) {
      console.error('Error deleting business:', error);
      // In production, you might want to show an error toast here
      // For now, we'll just log the error
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    if (!open) {
      setIsDeleteDialogOpen(false);
    } else if (!editingBusiness) {
      // Prevent opening delete dialog if no business is selected
      console.warn('Cannot open delete dialog: no business selected');
      return;
    } else {
      setIsDeleteDialogOpen(true);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading businesses...</h2>
          <p className="text-gray-600">Please wait while we load your business data.</p>
        </div>
      </div>
    );
  }

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
            
            {businesses.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No businesses onboarded yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start by onboarding your first business to see it appear here. Use the onboarding process to create and manage business accounts.
                </p>
                <Button 
                  onClick={() => router.push('/businesses/onboarding')}
                  className="bg-[#6E4EFF] hover:bg-[#7856FF] text-white"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Start Business Onboarding
                </Button>
              </div>
            ) : (
              filteredAndSortedBusinesses.map((business) => (
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
              ))
            )}

            {businesses.length > 0 && filteredAndSortedBusinesses.length === 0 && (
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
                {businesses.length === 0 ? (
                  <div className="text-center py-16">
                    <Building2 className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">No businesses onboarded yet</h3>
                    <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                      Start by onboarding your first business to see it appear here. Use the onboarding process to create and manage business accounts.
                    </p>
                    <Button 
                      onClick={() => router.push('/businesses/onboarding')}
                      className="bg-[#6E4EFF] hover:bg-[#7856FF] text-white px-8 py-3"
                    >
                      <Building2 className="h-5 w-5 mr-2" />
                      Start Business Onboarding
                    </Button>
                  </div>
                ) : (
                  filteredAndSortedBusinesses.map((business) => (
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
                  ))
                )}

                {businesses.length > 0 && filteredAndSortedBusinesses.length === 0 && (
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
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Edit Business</DialogTitle>
              <DialogDescription>
                Update the business information and settings.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4 px-1 overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-2 gap-4">
                <ImprovedInput
                  id="name"
                  label="Business Name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter business name"
                  required
                  containerClassName="w-full p-1"
                />
                <div className="space-y-2 p-1">
                  <label 
                    htmlFor="industry" 
                    className="block text-sm font-medium text-gray-700 transition-colors duration-200"
                  >
                    Industry
                  </label>
                  <Select
                    value={editFormData.industry}
                    onValueChange={(value) => setEditFormData(prev => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger className="h-11 rounded-[4px] transition-all duration-200 ease-in-out hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500">
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
                <div className="space-y-2 p-1">
                  <label 
                    htmlFor="status" 
                    className="block text-sm font-medium text-gray-700 transition-colors duration-200"
                  >
                    Status
                  </label>
                  <Select
                    value={editFormData.status}
                    onValueChange={(value: 'active' | 'inactive' | 'onboarding') => setEditFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="h-11 rounded-[4px] transition-all duration-200 ease-in-out hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 p-1">
                  <label 
                    htmlFor="userType" 
                    className="block text-sm font-medium text-gray-700 transition-colors duration-200"
                  >
                    User Type
                  </label>
                  <Select
                    value={editFormData.userType}
                    onValueChange={(value: 'trial' | 'paid' | 'free') => setEditFormData(prev => ({ ...prev, userType: value }))}
                  >
                    <SelectTrigger className="h-11 rounded-[4px] transition-all duration-200 ease-in-out hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500">
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
                <div className="space-y-2 p-1">
                  <label 
                    htmlFor="subscription" 
                    className="block text-sm font-medium text-gray-700 transition-colors duration-200"
                  >
                    Subscription
                  </label>
                  <Select
                    value={editFormData.subscription}
                    onValueChange={(value) => setEditFormData(prev => ({ ...prev, subscription: value }))}
                  >
                    <SelectTrigger className="h-11 rounded-[4px] transition-all duration-200 ease-in-out hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500">
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
                <ImprovedInput
                  id="assignedTo"
                  label="Assigned To"
                  value={editFormData.assignedTo}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                  placeholder="Enter assigned user"
                  containerClassName="w-full p-1"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 transition-colors duration-200">
                  Features
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    'Dashboard',
                    'Data Centre',
                    'Tribly AI for Business',
                    'Achievements and milestones', 
                    'Cohorts',
                    'Automation',
                    'Campaigns'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <label htmlFor={feature} className="text-sm font-medium text-gray-700">
                        {feature}
                      </label>
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

            <DialogFooter className="flex justify-between items-center flex-shrink-0 border-t pt-4">
              <div className="flex justify-start">
                <Button 
                  variant="ghost" 
                  onClick={() => editingBusiness && setIsDeleteDialogOpen(true)}
                  disabled={!editingBusiness}
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Business
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpenChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Delete Business
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{editingBusiness?.name}</strong>? 
                This action cannot be undone and will permanently remove all business data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDelete}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteBusiness}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Business
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
