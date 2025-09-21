'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import ProfileDropdown from '@/components/ui/ProfileDropdown';
import {
  Building2,
  Users,
  Coffee,
  UserPlus,
  BarChart3,
  UserCheck,
  Target,
  ArrowRight,
  TrendingUp,
  DollarSign,
  CheckCircle
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
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
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

  // Dashboard cards data with enhanced functionality
  const dashboardCards = [
    {
      title: 'Business onboarding',
      description: 'Manage new business registrations',
      icon: Building2,
      href: '/businesses/onboarding',
      stats: { total: 1247, pending: 23, completed: 1224 },
      trend: '+12%',
      trendType: 'increase' as const,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Business overview',
      description: 'View all business analytics',
      icon: BarChart3,
      href: '/businesses',
      stats: { total: 1247, active: 1156, revenue: '$89,432' },
      trend: '+8%',
      trendType: 'increase' as const,
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Team onboarding',
      description: 'Add and manage team members',
      icon: UserPlus,
      href: '/team/onboarding',
      stats: { total: 24, pending: 3, completed: 21 },
      trend: '+2',
      trendType: 'increase' as const,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Team overview',
      description: 'Monitor team performance',
      icon: UserCheck,
      href: '/team',
      stats: { total: 24, active: 22, performance: '92%' },
      trend: '+5%',
      trendType: 'increase' as const,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  const handleCardClick = (href: string) => {
    router.push(href);
  };


  return (
    <div className="min-h-screen bg-[#f6f6f6] relative">
      {/* Header Section */}
      <div className="absolute top-[80px] left-[calc(16.667%+28px)] w-[1020px] h-[100px]">
        <Card className="h-full">
          <CardContent className="flex items-center justify-between p-6 h-full">
            {/* Left side - Greeting */}
            <div className="flex items-center gap-2">
              <Coffee className="h-8 w-8 text-[#2a2a2f]" />
              <div className="flex flex-col gap-1">
                <h1 className="text-[20px] font-bold text-[#2a2a2f] leading-[1.4]">
                  Good Morning, {user?.name || 'Aditya'}!
                </h1>
                <p className="text-[14px] font-normal text-[#626266] leading-[1.4]">
                  Here's What's happening with your tribly business platform today
                </p>
              </div>
            </div>

            {/* Right side - User Profile */}
            <ProfileDropdown />
          </CardContent>
        </Card>
      </div>

      {/* Main Cards Grid */}
      <div className="absolute top-[214.5px] left-[calc(25%-10px)] w-[844px] h-[464px]">
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* First Row */}
          <div className="flex gap-4">
            {/* Business onboarding */}
            <Card 
              className="flex-1 h-[224px] cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              onClick={() => handleCardClick(dashboardCards[0].href)}
            >
              <CardContent className="flex flex-col items-center justify-center gap-6 p-6 h-full relative">
                <div className={`w-16 h-16 ${dashboardCards[0].color} rounded-full flex items-center justify-center`}>
                  <Building2 className={`h-8 w-8 ${dashboardCards[0].iconColor}`} />
                </div>
                <div className="flex flex-col gap-1 items-center text-center">
                  <h2 className="text-[20px] font-bold text-[#2a2a2f] leading-[1.4]">
                    {dashboardCards[0].title}
                  </h2>
                  <p className="text-[14px] font-normal text-[#626266] leading-[1.4]">
                    {dashboardCards[0].description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[12px] text-[#626266]">
                      {dashboardCards[0].stats.pending} pending
                    </span>
                    <span className="text-[12px] text-green-600 font-medium">
                      {dashboardCards[0].trend}
                    </span>
                  </div>
                </div>
                <ArrowRight className="absolute top-4 right-4 h-4 w-4 text-[#626266]" />
              </CardContent>
            </Card>

            {/* Business overview */}
            <Card 
              className="flex-1 h-[224px] cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              onClick={() => handleCardClick(dashboardCards[1].href)}
            >
              <CardContent className="flex flex-col items-center justify-center gap-6 p-6 h-full relative">
                <div className={`w-16 h-16 ${dashboardCards[1].color} rounded-full flex items-center justify-center`}>
                  <BarChart3 className={`h-8 w-8 ${dashboardCards[1].iconColor}`} />
                </div>
                <div className="flex flex-col gap-1 items-center text-center">
                  <h2 className="text-[20px] font-bold text-[#2a2a2f] leading-[1.4]">
                    {dashboardCards[1].title}
                  </h2>
                  <p className="text-[14px] font-normal text-[#626266] leading-[1.4]">
                    {dashboardCards[1].description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[12px] text-[#626266]">
                      {dashboardCards[1].stats.revenue} revenue
                    </span>
                    <span className="text-[12px] text-green-600 font-medium">
                      {dashboardCards[1].trend}
                    </span>
                  </div>
                </div>
                <ArrowRight className="absolute top-4 right-4 h-4 w-4 text-[#626266]" />
              </CardContent>
            </Card>
          </div>

          {/* Second Row */}
          <div className="flex gap-4">
            {/* Team onboarding */}
            <Card 
              className="flex-1 h-[224px] cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              onClick={() => handleCardClick(dashboardCards[2].href)}
            >
              <CardContent className="flex flex-col items-center justify-center gap-6 p-6 h-full relative">
                <div className={`w-16 h-16 ${dashboardCards[2].color} rounded-full flex items-center justify-center`}>
                  <UserPlus className={`h-8 w-8 ${dashboardCards[2].iconColor}`} />
                </div>
                <div className="flex flex-col gap-1 items-center text-center">
                  <h2 className="text-[20px] font-bold text-[#2a2a2f] leading-[1.4]">
                    {dashboardCards[2].title}
                  </h2>
                  <p className="text-[14px] font-normal text-[#626266] leading-[1.4]">
                    {dashboardCards[2].description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[12px] text-[#626266]">
                      {dashboardCards[2].stats.pending} pending
                    </span>
                    <span className="text-[12px] text-green-600 font-medium">
                      {dashboardCards[2].trend}
                    </span>
                  </div>
                </div>
                <ArrowRight className="absolute top-4 right-4 h-4 w-4 text-[#626266]" />
              </CardContent>
            </Card>

            {/* Team overview */}
            <Card 
              className="flex-1 h-[224px] cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              onClick={() => handleCardClick(dashboardCards[3].href)}
            >
              <CardContent className="flex flex-col items-center justify-center gap-6 p-6 h-full relative">
                <div className={`w-16 h-16 ${dashboardCards[3].color} rounded-full flex items-center justify-center`}>
                  <UserCheck className={`h-8 w-8 ${dashboardCards[3].iconColor}`} />
                </div>
                <div className="flex flex-col gap-1 items-center text-center">
                  <h2 className="text-[20px] font-bold text-[#2a2a2f] leading-[1.4]">
                    {dashboardCards[3].title}
                  </h2>
                  <p className="text-[14px] font-normal text-[#626266] leading-[1.4]">
                    {dashboardCards[3].description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[12px] text-[#626266]">
                      {dashboardCards[3].stats.performance} performance
                    </span>
                    <span className="text-[12px] text-green-600 font-medium">
                      {dashboardCards[3].trend}
                    </span>
                  </div>
                </div>
                <ArrowRight className="absolute top-4 right-4 h-4 w-4 text-[#626266]" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
