'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import ProfileDropdown from '@/components/ui/ProfileDropdown';
import {
  Building2,
  Users,
  Coffee,
  BarChart3,
  Target,
  TrendingUp,
  DollarSign,
  CheckCircle
} from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();


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
    router.push('/login');
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
    }
  ];

  const handleCardClick = (href: string) => {
    router.push(href);
  };


  return (
    <div className="min-h-screen bg-[#f6f6f6] relative">
      {/* Mobile Layout - Only visible on mobile */}
      <div className="block lg:hidden">
        <div className="p-4 space-y-4">
          {/* Mobile Header */}
          <Card className="w-full border border-gray-200 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Coffee className="h-6 w-6 text-[#2a2a2f] flex-shrink-0" />
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-[#2a2a2f] leading-[1.4] truncate">
                    Good Morning, {user?.name || "Aditya"}!
                  </h1>
                  <p className="text-xs font-normal text-[#626266] leading-[1.4]">
                    Your tribly dashboard
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Cards - Stack vertically */}
          <div className="space-y-4">
            {dashboardCards.map((card, index) => (
              <Card 
                key={card.title}
                className="h-[180px] w-4/5 mx-auto cursor-pointer transition-all duration-200 border border-gray-200 shadow-none"
                onClick={() => handleCardClick(card.href)}
              >
                <CardContent className="flex flex-col items-center justify-center gap-4 p-4 h-full relative">
                  <div className={`w-12 h-12 ${card.color} rounded-full flex items-center justify-center`}>
                    <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <div className="flex flex-col gap-1 items-center text-center">
                    <h2 className="text-base font-bold text-[#2a2a2f] leading-[1.4]">
                      {card.title}
                    </h2>
                    <p className="text-xs font-normal text-[#626266] leading-[1.4]">
                      {card.description}
                    </p>
                  </div>
                  <svg 
                    className="absolute top-3 right-3 h-6 w-6" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 32 32" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      fillRule="evenodd" 
                      clipRule="evenodd" 
                      d="M28.8545 16.0001C28.0812 16.5332 26.8287 17.8511 25.8945 19.1469C24.7268 20.7668 24.0615 21.8096 23.6813 22.9082L22.1063 21.8471C22.2602 21.2016 23.0187 19.3706 24.8219 17.2106L3.14527 17.2106L3.14527 16.0001L28.8545 16.0001ZM28.8545 15.9999C28.0812 15.4668 26.8287 14.1489 25.8945 12.8531C24.7268 11.2332 24.0615 10.1904 23.6813 9.0918L22.1063 10.1529C22.2602 10.7984 23.0187 12.6294 24.8219 14.7894L3.14527 14.7894L3.14527 15.9999L28.8545 15.9999Z" 
                      fill="#626266"
                    />
                  </svg>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile Profile Section - At bottom */}
          <Card className="w-full border border-gray-200 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-center">
                <ProfileDropdown />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Desktop Layout - Keep original design */}
      <div className="hidden lg:block">
        {/* Header Section */}
        <div className="absolute top-[80px] left-[calc(16.667%+28px)] w-[1020px] h-[100px]">
          <Card className="h-full">
            <CardContent className="flex items-center justify-between p-6 h-full">
              {/* Left side - Greeting */}
              <div className="flex items-center gap-2">
                <Coffee className="h-8 w-8 text-[#2a2a2f]" />
                <div className="flex flex-col gap-1">
                  <h1 className="text-[20px] font-bold text-[#2a2a2f] leading-[1.4]">
                    Good Morning, {user?.name || "Aditya"}!
                  </h1>
                  <p className="text-[14px] font-normal text-[#626266] leading-[1.4]">
                    Here&apos;s What&apos;s happening with your tribly business platform today
                  </p>
                </div>
              </div>

              {/* Right side - User Profile */}
              <ProfileDropdown />
            </CardContent>
          </Card>
        </div>

        {/* Main Cards Grid */}
        <div className="absolute top-[214.5px] left-[calc(25%-10px)] w-[844px] h-[224px]">
          <div className="flex gap-4 h-full">
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
                </div>
                <svg 
                  className="absolute top-4 right-4 h-6 w-6" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 32 32" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fillRule="evenodd" 
                    clipRule="evenodd" 
                    d="M28.8545 16.0001C28.0812 16.5332 26.8287 17.8511 25.8945 19.1469C24.7268 20.7668 24.0615 21.8096 23.6813 22.9082L22.1063 21.8471C22.2602 21.2016 23.0187 19.3706 24.8219 17.2106L3.14527 17.2106L3.14527 16.0001L28.8545 16.0001ZM28.8545 15.9999C28.0812 15.4668 26.8287 14.1489 25.8945 12.8531C24.7268 11.2332 24.0615 10.1904 23.6813 9.0918L22.1063 10.1529C22.2602 10.7984 23.0187 12.6294 24.8219 14.7894L3.14527 14.7894L3.14527 15.9999L28.8545 15.9999Z" 
                    fill="#626266"
                  />
                </svg>
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
                </div>
                <svg 
                  className="absolute top-4 right-4 h-6 w-6" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 32 32" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fillRule="evenodd" 
                    clipRule="evenodd" 
                    d="M28.8545 16.0001C28.0812 16.5332 26.8287 17.8511 25.8945 19.1469C24.7268 20.7668 24.0615 21.8096 23.6813 22.9082L22.1063 21.8471C22.2602 21.2016 23.0187 19.3706 24.8219 17.2106L3.14527 17.2106L3.14527 16.0001L28.8545 16.0001ZM28.8545 15.9999C28.0812 15.4668 26.8287 14.1489 25.8945 12.8531C24.7268 11.2332 24.0615 10.1904 23.6813 9.0918L22.1063 10.1529C22.2602 10.7984 23.0187 12.6294 24.8219 14.7894L3.14527 14.7894L3.14527 15.9999L28.8545 15.9999Z" 
                    fill="#626266"
                  />
                </svg>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
