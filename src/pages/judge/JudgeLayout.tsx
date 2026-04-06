/**
 * Judge Layout - Portal for Grading
 *
 * Separate from Admin, limited access to assigned submissions only
 */

import { useState, useEffect, useCallback } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { notificationsService } from '@/services/cibc.service';
import {
  LayoutDashboard, FileCheck, Award, User, LogOut,
  Menu, X
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

const JudgeLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUser = useCallback(async () => {
    const stored = localStorage.getItem('cibc_current_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }, []);

  useEffect(() => {
    loadUser();
    loadUnreadCount();
  }, [loadUser, loadUnreadCount]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('cibc_current_user');
    localStorage.removeItem('user');
    navigate('/judge/login');
  };

  const handleMarkAsRead = async (_id: string) => {
    void _id;
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    setUnreadCount(0);
  };

  const navItems = [
    { to: '/judge', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/judge/grading', label: 'Grading', icon: FileCheck },
    { to: '/judge/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 bg-white border-r border-gray-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 shadow-lg`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Judge Portal</span>
              <p className="text-[10px] text-white/70">CIBC 2026</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                ${isActive ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Back to Login */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${sidebarOpen ? 'lg:ml-64' : ''} min-h-screen`}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />

          {/* Notifications */}
          <NotificationBell
            unreadCount={unreadCount}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllRead={handleMarkAllRead}
          />

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-700 font-medium">
                  {user.name?.charAt(0).toUpperCase() || 'J'}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default JudgeLayout;