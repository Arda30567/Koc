'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUI } from '@/lib/hooks/useUI';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, signOut } = useAuth();
  const { state, toggleSidebar } = useUI();

  const getDashboardLink = () => {
    if (!user) return '/login';
    return user.role === 'coach' ? '/coach/dashboard' : '/dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
            >
              {state.isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            
            <a
              href={getDashboardLink()}
              className="ml-4 lg:ml-0 flex items-center"
            >
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">
                  FitCoach
                </span>
              </div>
            </a>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.full_name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                    <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <a
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Giriş Yap
                </a>
                <a
                  href="/register"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Kayıt Ol
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}