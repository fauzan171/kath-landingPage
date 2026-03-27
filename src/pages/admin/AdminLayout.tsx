/**
 * Admin Layout - Content Management Dashboard
 */

import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Image, FileText, MessageSquare,
  HelpCircle, Phone, Settings, Menu, X, ChevronRight,
  Users, Calendar, Megaphone, ClipboardList
} from 'lucide-react';

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
  { to: '/admin/registrations', label: 'Registrations', icon: ClipboardList },
  { to: '/admin/stages', label: 'Timeline', icon: Calendar },
  { to: '/admin/submissions', label: 'Submissions', icon: FileText },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/users', label: 'Users & Teams', icon: Users },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 bg-white border-r border-gray-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 shadow-lg`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="font-bold text-gray-800">Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-8rem)]">
          {/* Dashboard */}
          <div>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                ${isActive ? 'bg-amber-50 text-amber-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </NavLink>
          </div>

          {/* Content Management */}
          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Landing Page Content
            </h3>
            <div className="space-y-1">
              {contentItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                    ${isActive ? 'bg-amber-50 text-amber-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Competition Management */}
          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Competition
            </h3>
            <div className="space-y-1">
              {competitionItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                    ${isActive ? 'bg-amber-50 text-amber-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Back to Site */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-amber-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Website
          </a>
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
          <span className="text-sm text-gray-500">Content Management System</span>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;