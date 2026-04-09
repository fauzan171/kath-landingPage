import React from 'react';
import {
    LayoutDashboard, Users, FileText, Upload, Settings, LogOut, X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps {
    activeSection: string;
    setActiveSection: any;
    isSidebarOpen?: boolean;
    setIsSidebarOpen?: (isOpen: boolean) => void;
    handleLogout?: () => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({
    activeSection,
    setActiveSection,
    isSidebarOpen = false,
    setIsSidebarOpen,
    handleLogout
}) => {
    const { t } = useLanguage();
    const menuItems = [
        { id: 'overview', label: t('Overview', 'Overview'), icon: LayoutDashboard },
        { id: 'team', label: t('Tim Saya', 'My Team'), icon: Users },
        { id: 'submission', label: t('Pengumpulan', 'Submission'), icon: Upload },
        { id: 'resources', label: t('Dokumen', 'Documents'), icon: FileText },
        { id: 'settings', label: t('Pengaturan', 'Settings'), icon: Settings },
    ];

    return (
        <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out bg-white border-r border-[#0F0F0F]/5
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 lg:translate-x-0 shadow-lg lg:shadow-none flex flex-col`}
        >
            {/* Logo / Brand */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-[#0F0F0F]/5 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#FFB22C] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <div>
                        <span className="font-bold text-[#0F0F0F] text-sm">CIBC</span>
                        <span className="text-[#FFB22C] font-bold text-sm"> 2026</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
                    className="lg:hidden p-2 hover:bg-[#F9F8F6] rounded-lg"
                >
                    <X className="w-5 h-5 text-[#0F0F0F]/40" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0">
                <div className="text-[11px] font-bold text-[#0F0F0F]/40 uppercase tracking-[0.15em] mb-3 px-3">
                    {t('Menu Utama', 'Main Menu')}
                </div>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveSection(item.id);
                                if (setIsSidebarOpen) setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 ${
                                isActive
                                    ? 'bg-[#FFB22C] text-white font-bold shadow-md shadow-[#FFB22C]/20'
                                    : 'text-[#0F0F0F]/60 font-semibold hover:bg-[#F9F8F6] hover:text-[#0F0F0F]'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#0F0F0F]/40'}`} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="border-t border-[#0F0F0F]/5 bg-white flex-shrink-0 p-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[#0F0F0F]/60 font-semibold hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <div className="p-2 bg-[#F9F8F6] rounded-xl hover:bg-red-100 transition-colors">
                        <LogOut className="w-4 h-4" />
                    </div>
                    <span>{t('Keluar Akun', 'Log Out')}</span>
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
