/**
 * Admin Layout - Content Management Dashboard
 * Theme matches CIBC Dashboard (cream/amber)
 */

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Image, FileText, MessageSquare,
  HelpCircle, Phone, Settings, Menu, X, ChevronRight,
  Users, Calendar, Megaphone, ClipboardList, Star, LogOut
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const contentItems = [
  { to: '/admin/hero', label: 'Hero', icon: Image },
  { to: '/admin/services', label: 'Services', icon: FileText },
  { to: '/admin/portfolio', label: 'Portfolio', icon: Image },
  { to: '/admin/news', label: 'News', icon: FileText },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { to: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/admin/statistics', label: 'Statistics', icon: FileText },
  { to: '/admin/contact', label: 'Contact', icon: Phone },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const competitionItems = [
  { to: '/admin/registrations-hub', label: 'Registrations & Teams', icon: ClipboardList },
  { to: '/admin/competition-setup', label: 'Competition Setup', icon: Calendar },
  { to: '/admin/judging', label: 'Judging', icon: Star },
  { to: '/admin/users-hub', label: 'Users', icon: Users },
  { to: '/admin/communications', label: 'Communications', icon: Megaphone },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out bg-white border-r border-[#0F0F0F]/5
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 lg:translate-x-0 shadow-lg lg:shadow-none flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#0F0F0F]/5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FFB22C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div>
              <span className="font-bold text-[#0F0F0F] text-sm">Admin</span>
              <span className="text-[#FFB22C] font-bold text-sm"> Panel</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-[#F9F8F6] rounded-lg"
          >
            <X className="w-5 h-5 text-[#0F0F0F]/40" />
          </button>
        </div>

        {/* Navigation - scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
          <div>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300
                ${isActive ? 'bg-[#FFB22C] text-white font-bold shadow-md shadow-[#FFB22C]/20' : 'text-[#0F0F0F]/60 font-semibold hover:bg-[#F9F8F6] hover:text-[#0F0F0F]'}`
              }
            >
              {({ isActive }) => (
                <>
                  <LayoutDashboard className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#0F0F0F]/40'}`} />
                  Dashboard
                </>
              )}
            </NavLink>
          </div>

          {/* Content Management */}
          <div>
            <h3 className="px-3 text-[11px] font-bold text-[#0F0F0F]/40 uppercase tracking-[0.15em] mb-3">
              Landing Page Content
            </h3>
            <div className="space-y-1">
              {contentItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
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
            </div>
          </div>

          {/* Competition Management */}
          <div>
            <h3 className="px-3 text-[11px] font-bold text-[#0F0F0F]/40 uppercase tracking-[0.15em] mb-3">
              Competition
            </h3>
            <div className="space-y-1">
              {competitionItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
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
            </div>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-[#0F0F0F]/5 bg-white flex-shrink-0">
          <div className="p-4 space-y-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[#0F0F0F]/60 font-semibold hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <div className="p-2 bg-[#F9F8F6] rounded-xl">
                <LogOut className="w-4 h-4" />
              </div>
              <span>Logout</span>
            </button>
            <a
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[#0F0F0F]/60 font-semibold hover:bg-[#F9F8F6] hover:text-[#0F0F0F] transition-colors"
            >
              <div className="p-2 bg-[#F9F8F6] rounded-xl">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </div>
              <span>Back to Website</span>
            </a>
          </div>
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
          <span className="text-xs sm:text-sm text-[#0F0F0F]/50 font-semibold">Content Management System</span>
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

export default AdminLayout;
