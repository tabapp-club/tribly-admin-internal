'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  BarChart3,
  FileText,
  Bell,
  Shield,
  UserCheck,
  Target,
  Zap,
  Brain,
  Database,
  Trophy,
  ShoppingCart,
  TrendingUp,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    roles: ['master', 'manager', 'team']
  },
  {
    name: 'Business Management',
    href: '/businesses',
    icon: Building2,
    roles: ['master', 'manager'],
    children: [
      { name: 'All Businesses', href: '/businesses', roles: ['master', 'manager'] },
      { name: 'Onboarding', href: '/businesses/onboarding', roles: ['master', 'manager'] },
      { name: 'Subscriptions', href: '/businesses/subscriptions', roles: ['master', 'manager'] },
    ]
  },
  {
    name: 'Feature Management',
    href: '/features',
    icon: Zap,
    roles: ['master'],
    children: [
      { name: 'Feature Toggles', href: '/features/toggles', roles: ['master'] },
      { name: 'Usage Analytics', href: '/features/analytics', roles: ['master'] },
      { name: 'Plan Configuration', href: '/features/plans', roles: ['master'] },
    ]
  },
  {
    name: 'Team Management',
    href: '/team',
    icon: Users,
    roles: ['master', 'manager'],
    children: [
      { name: 'Team Members', href: '/team/members', roles: ['master', 'manager'] },
      { name: 'Performance', href: '/team/performance', roles: ['master', 'manager'] },
      { name: 'Territories', href: '/team/territories', roles: ['master', 'manager'] },
    ]
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['master', 'manager'],
    children: [
      { name: 'Overview', href: '/analytics', roles: ['master', 'manager'] },
      { name: 'Revenue', href: '/analytics/revenue', roles: ['master', 'manager'] },
      { name: 'Growth', href: '/analytics/growth', roles: ['master', 'manager'] },
    ]
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    roles: ['master', 'manager']
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['master', 'manager'],
    children: [
      { name: 'General', href: '/settings', roles: ['master', 'manager'] },
      { name: 'Roles & Permissions', href: '/settings/roles', roles: ['master'] },
      { name: 'System', href: '/settings/system', roles: ['master'] },
    ]
  },
];

const businessFeatures = [
  { name: 'Dashboard Analytics', icon: BarChart3, category: 'analytics' },
  { name: 'Campaign Management', icon: Target, category: 'campaigns' },
  { name: 'Data Center', icon: Database, category: 'data' },
  { name: 'Tribly AI', icon: Brain, category: 'ai' },
  { name: 'Automation', icon: Zap, category: 'automation' },
  { name: 'Cohorts', icon: Users, category: 'data' },
  { name: 'Achievements', icon: Trophy, category: 'business' },
  { name: 'Upsell/Cross-sell', icon: ShoppingCart, category: 'business' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, hasRole } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const canAccess = (roles: string[]) => {
    if (!user) return false;
    return roles.some(role => hasRole(role as any));
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-border">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Tribly Admin</h1>
            <p className="text-xs text-muted-foreground">Business Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          if (!canAccess(item.roles)) return null;

          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.includes(item.name);
          const itemIsActive = isActive(item.href);

          return (
            <div key={item.name}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                    itemIsActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                    itemIsActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )}

              {/* Children */}
              {hasChildren && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children?.map((child) => {
                    if (!canAccess(child.roles)) return null;

                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                          isActive(child.href)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <div className="w-2 h-2 rounded-full bg-muted-foreground mr-3" />
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Business Features Quick Access */}
      {user?.role === 'master' && (
        <div className="px-4 py-4 border-t border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Business Features
          </h3>
          <div className="space-y-1">
            {businessFeatures.map((feature) => (
              <div
                key={feature.name}
                className="flex items-center px-3 py-2 text-xs text-muted-foreground hover:bg-muted rounded-md cursor-pointer"
              >
                <feature.icon className="mr-2 h-4 w-4" />
                {feature.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
