/**
 * Judge Layout - Portal for Grading
 * Theme matches CIBC Dashboard (cream/amber)
 */

import { useState, useEffect, useCallback } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { notificationsService } from '@/services/cibc.service';
import {
  LayoutDashboard, FileCheck, Award, LogOut,
  Menu, X
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

const JudgeLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    { to: '/judge/profile', label: 'Profile', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out bg-white border-r border-[#0F0F0F]/5
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 lg:translate-x-0 shadow-lg lg:shadow-none`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#0F0F0F]/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FFB22C] rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-[#0F0F0F] text-sm">Judge</span>
              <span className="text-[#FFB22C] font-bold text-sm"> Portal</span>
              <p className="text-[10px] text-[#0F0F0F]/40 font-medium">CIBC 2026</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-[#F9F8F6] rounded-lg"
          >
            <X className="w-5 h-5 text-[#0F0F0F]/40" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          <div className="text-[11px] font-bold text-[#0F0F0F]/40 uppercase tracking-[0.15em] mb-3 px-3">
            Menu
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300
                ${isActive ? 'bg-[#FFB22C] text-white font-bold shadow-md shadow-[#FFB22C]/20' : 'text-[#0F0F0F]/60 font-semibold hover:bg-[#F9F8F6] hover:text-[#0F0F0F]'}`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#0F0F0F]/40'}`} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#0F0F0F]/5 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[#0F0F0F]/60 font-semibold hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <div className="p-2 bg-[#F9F8F6] rounded-xl hover:bg-red-100 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="h-14 lg:h-16 bg-[#F9F8F6]/80 backdrop-blur-xl border-b border-[#0F0F0F]/5 flex items-center px-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[#0F0F0F]/60 hover:text-[#FFB22C] bg-white rounded-xl shadow-sm border border-[#0F0F0F]/5 active:scale-95 transition-transform lg:hidden"
          >
            <Menu className="w-5 h-5" />
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
            <div className="flex items-center gap-2 sm:gap-3 ml-3 sm:ml-4 pl-3 sm:pl-4 border-l border-[#0F0F0F]/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#0F0F0F]">{user.name}</p>
                <p className="text-xs text-[#0F0F0F]/50 font-medium">{user.email}</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FFB22C]/10 border border-[#FFB22C]/20 flex items-center justify-center text-[#FFB22C] font-bold text-sm sm:text-base">
                {user.name?.charAt(0) || 'J'}
              </div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default JudgeLayout;
