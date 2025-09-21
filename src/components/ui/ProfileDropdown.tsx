'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  User,
  LogOut,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Bell,
  Key,
  Database
} from 'lucide-react';

interface ProfileDropdownProps {
  className?: string;
}

export default function ProfileDropdown({ className = '' }: ProfileDropdownProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'master': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'team': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'master': return 'Master Admin';
      case 'manager': return 'Manager';
      case 'team': return 'Team Member';
      default: return 'User';
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Unknown';
      }
      return dateObj.toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleProfileClick = () => {
    router.push('/settings');
    setIsOpen(false);
  };

  const handleNotificationsClick = () => {
    // Navigate to notifications page or show notification panel
    setIsOpen(false);
  };


  // Mock user stats - in a real app, this would come from an API
  const userStats = {
    businessesManaged: 12,
    teamMembers: 8,
    notifications: 3,
    accountAge: '2 years, 3 months'
  };

  if (!user) return null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-[#e9e9e9] text-[#2a2a2f]">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold text-black">
              {getRoleDisplayName(user.role)}
            </span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <span className="text-[12px] font-normal text-gray-600">
            ID -00244
          </span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-14 w-14">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-[#e9e9e9] text-[#2a2a2f] text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                <Badge className={`mt-1 ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </Badge>
              </div>
            </div>
            
          </div>

          {/* Navigation Menu */}
          <div className="p-2">
            <div className="space-y-1">
              {/* Profile Management */}
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Profile Settings</span>
              </button>

              <button
                onClick={handleNotificationsClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="relative">
                  <Bell className="h-4 w-4" />
                  {userStats.notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {userStats.notifications}
                    </span>
                  )}
                </div>
                <span>Notifications</span>
              </button>


              {/* Account Info */}
              <div className="border-t border-gray-100 my-2"></div>
              
              <div className="px-3 py-2 text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  <span>{user.permissions.length} permissions</span>
                </div>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 my-2"></div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
