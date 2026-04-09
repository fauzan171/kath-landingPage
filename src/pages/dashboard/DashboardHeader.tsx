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
        <header className="h-14 lg:h-16 bg-white border-b border-gray-200 flex items-center px-4 sticky top-0 z-30">
            {/* Burger menu - mobile only */}
            <button
                onClick={() => setIsSidebarOpen && setIsSidebarOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden"
            >
                <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1" />

            {/* Language toggle */}
            <button className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-amber-600 font-medium text-sm transition-colors mr-3">
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
            <div className="flex items-center gap-2 sm:gap-3 ml-3 sm:ml-4 pl-3 sm:pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-800">{currentUser?.fullName || 'Peserta'}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{currentUser?.category || 'User'}</p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-700 font-medium text-sm sm:text-base">
                        {currentUser?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
                title="Logout"
            >
                <LogOut className="w-4 h-4" />
            </button>
        </header>
    );
};

export default DashboardHeader;
