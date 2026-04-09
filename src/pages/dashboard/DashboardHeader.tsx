import React from 'react';
import { Menu, Globe, LogOut } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

interface HeaderProps {
    activeSection?: string;
    setIsSidebarOpen?: (isOpen: boolean) => void;
    currentUser: any;
    unreadNotifications: number;
    handleLogout: () => void;
    handleMarkAsRead: (id: string) => void;
    handleMarkAllRead: () => void;
}

const DashboardHeader: React.FC<HeaderProps> = ({
    setIsSidebarOpen,
    currentUser,
    unreadNotifications,
    handleLogout,
    handleMarkAsRead,
    handleMarkAllRead
}) => {
    return (
        <header className="h-14 lg:h-16 bg-[#F9F8F6]/80 backdrop-blur-xl border-b border-[#0F0F0F]/5 flex items-center px-4 sticky top-0 z-30">
            {/* Burger menu - mobile only */}
            <button
                onClick={() => setIsSidebarOpen && setIsSidebarOpen(true)}
                className="p-2 text-[#0F0F0F]/60 hover:text-[#FFB22C] bg-white rounded-xl shadow-sm border border-[#0F0F0F]/5 active:scale-95 transition-transform lg:hidden"
            >
                <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1" />

            {/* Language toggle */}
            <button className="hidden sm:flex items-center gap-2 text-[#0F0F0F]/60 hover:text-[#FFB22C] font-semibold text-sm transition-colors mr-3">
                <Globe className="w-4 h-4" />
                <span>ID</span>
            </button>

            {/* Notifications */}
            <NotificationBell
                unreadCount={unreadNotifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllRead={handleMarkAllRead}
            />

            {/* User info */}
            <div className="flex items-center gap-2 sm:gap-3 ml-3 sm:ml-4 pl-3 sm:pl-4 border-l border-[#0F0F0F]/10">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-[#0F0F0F]">{currentUser?.fullName || 'Peserta'}</p>
                    <p className="text-xs font-semibold text-[#0F0F0F]/50 uppercase tracking-wider">{currentUser?.category || 'User'}</p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FFB22C]/10 border border-[#FFB22C]/20 flex items-center justify-center text-[#FFB22C] font-display font-bold text-sm sm:text-base">
                    {currentUser?.fullName?.charAt(0) || 'U'}
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="p-2 text-[#0F0F0F]/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors ml-1"
                title="Logout"
            >
                <LogOut className="w-4 h-4" />
            </button>
        </header>
    );
};

export default DashboardHeader;
