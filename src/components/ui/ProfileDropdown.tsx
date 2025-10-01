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
    if (!name) return 'U';
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

  // User stats - in a real app, this would come from an API
  const userStats = {
    businessesManaged: 0,
    teamMembers: 0,
    accountAge: 'New account'
  };

  // Early return if no user
  if (!user || typeof user !== 'object') {
    return null;
  }

  // Safely create user object with all required properties
  const safeUser = {
    name: user.name || 'User',
    role: user.role || 'user',
    email: user.email || '',
    phone: user.phone || 'No phone number',
    avatar: user.avatar || undefined,
    createdAt: user.createdAt || new Date(),
    jobTitle: user.jobTitle || '',
    department: user.department || '',
    permissions: (() => {
      try {
        if (Array.isArray(user.permissions)) {
          return user.permissions;
        }
        if (user.permissions && typeof user.permissions === 'object') {
          return Object.values(user.permissions);
        }
        return [];
      } catch (error) {
        return [];
      }
    })()
  };

  // Final safety check for permissions
  if (!Array.isArray(safeUser.permissions)) {
    safeUser.permissions = [];
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Avatar className="h-12 w-12">
          <AvatarImage src={safeUser.avatar} />
          <AvatarFallback className="bg-[#e9e9e9] text-[#2a2a2f]">
            {getInitials(safeUser.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold text-black">
              {safeUser.name}
            </span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${getRoleColor(safeUser.role)} text-xs`}>
              {getRoleDisplayName(safeUser.role)}
            </Badge>
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={safeUser.avatar} />
                <AvatarFallback className="bg-[#e9e9e9] text-[#2a2a2f] text-lg">
                  {getInitials(safeUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{safeUser.name}</h3>
                <Badge className={`mt-1 ${getRoleColor(safeUser.role)}`}>
                  {getRoleDisplayName(safeUser.role)}
                </Badge>
              </div>
            </div>

            {/* User Details */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span className="text-sm text-gray-600">{safeUser.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span className="text-sm text-gray-600">{safeUser.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span className="text-sm text-gray-600">Member since {formatDate(safeUser.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                <span className="text-sm text-gray-600">{safeUser.permissions.length} permissions</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-left"
              onClick={handleProfileClick}
            >
              <User className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="font-medium">Profile Settings</span>
                <span className="text-xs text-gray-500">Manage your account</span>
              </div>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-left"
              onClick={() => {
                router.push('/settings');
                setIsOpen(false);
              }}
            >
              <Key className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="font-medium">Security</span>
                <span className="text-xs text-gray-500">Password & security</span>
              </div>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-left"
              onClick={() => {
                router.push('/analytics');
                setIsOpen(false);
              }}
            >
              <Database className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="font-medium">Analytics</span>
                <span className="text-xs text-gray-500">View reports & data</span>
              </div>
            </Button>
          </div>

          {/* User Stats */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">{userStats.businessesManaged}</div>
                <div className="text-xs text-gray-500">Businesses</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{userStats.teamMembers}</div>
                <div className="text-xs text-gray-500">Team Members</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{userStats.accountAge}</div>
                <div className="text-xs text-gray-500">Account Age</div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-2 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-left text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="font-medium">Sign Out</span>
                <span className="text-xs text-gray-500">End your session</span>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
