'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUI } from '@/lib/hooks/useUI';
import { cn } from '@/lib/utils';
import {
  Home,
  Apple,
  Dumbbell,
  TrendingUp,
  MessageCircle,
  Settings,
  Users,
  FileText,
  Activity,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  role?: 'student' | 'coach';
}

const studentNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Beslenme', href: '/nutrition', icon: Apple },
  { name: 'Fitness', href: '/fitness', icon: Dumbbell },
  { name: 'Ölçümler', href: '/measurements', icon: TrendingUp },
  { name: 'Forum', href: '/forum', icon: MessageCircle },
  { name: 'Ayarlar', href: '/settings', icon: Settings },
];

const coachNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/coach/dashboard', icon: Home },
  { name: 'Öğrenciler', href: '/coach/students', icon: Users },
  { name: 'Beslenme Planları', href: '/coach/nutrition-plans', icon: FileText },
  { name: 'Fitness Programları', href: '/coach/fitness-programs', icon: Activity },
  { name: 'Forum', href: '/forum', icon: MessageCircle },
  { name: 'Ayarlar', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const { user } = useAuth();
  const { state } = useUI();

  if (!user) return null;

  const navigation = user.role === 'coach' ? coachNavigation : studentNavigation;
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none',
        state.isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex flex-col h-full pt-16 lg:pt-0">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200 lg:hidden">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">FitCoach</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;

            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive
                      ? 'text-primary-600'
                      : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.full_name || user.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}