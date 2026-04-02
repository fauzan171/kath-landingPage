import React from 'react';
import { Menu, Globe, ChevronRight, LogOut } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

// Interface disesuaikan dengan prop yang dikirim dari CIBCDashboard
interface HeaderProps {
    activeSection?: string; // Dibuat opsional sementara agar tidak error
    setIsSidebarOpen?: (isOpen: boolean) => void; // Dibuat opsional
    currentUser: any;
    unreadNotifications: number; // Diubah dari unreadCount
    handleLogout: () => void; // Ditambahkan
    handleMarkAsRead: (id: string) => void; // Ditambahkan
    handleMarkAllRead: () => void; // Ditambahkan
}

const DashboardHeader: React.FC<HeaderProps> = ({
    activeSection = 'overview',
    setIsSidebarOpen,
    currentUser,
    unreadNotifications,
    handleLogout,
    handleMarkAsRead,
    handleMarkAllRead
}) => {
    return (
        <header className="sticky top-0 z-30 bg-[#F9F8F6]/80 backdrop-blur-xl border-b border-[#0F0F0F]/5 h-20 flex items-center justify-between px-6 lg:px-10">

            <div className="flex items-center gap-4">
                {/* Tombol menu sidebar mobile */}
                <button
                    className="lg:hidden p-2 text-[#0F0F0F]/60 hover:text-[#FFB22C] bg-white rounded-xl shadow-sm border border-[#0F0F0F]/5"
                    onClick={() => setIsSidebarOpen && setIsSidebarOpen(true)}
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#0F0F0F]/40 capitalize">
                    <span>Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[#0F0F0F]">{activeSection}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
                <button className="flex items-center gap-2 text-[#0F0F0F]/60 hover:text-[#FFB22C] font-semibold text-sm transition-colors">
                    <Globe className="w-5 h-5" />
                    <span className="hidden sm:block">ID</span>
                </button>

                <NotificationBell
                    unreadCount={unreadNotifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllRead={handleMarkAllRead}
                />

                <div className="w-px h-8 bg-[#0F0F0F]/10 hidden sm:block"></div>

                <div className="flex items-center gap-3 group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-[#0F0F0F] group-hover:text-[#FFB22C] transition-colors">
                            {currentUser?.fullName || 'Peserta'}
                        </p>
                        <p className="text-xs font-semibold text-[#0F0F0F]/50 uppercase tracking-wider">
                            {currentUser?.category || 'User'}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-[#FFB22C]/10 border border-[#FFB22C]/20 flex items-center justify-center text-[#FFB22C] font-display font-bold text-lg">
                        {currentUser?.fullName?.charAt(0) || 'U'}
                    </div>
                </div>

                {/* Tombol Logout */}
                <button
                    onClick={handleLogout}
                    className="p-2 text-[#0F0F0F]/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors ml-2"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader;