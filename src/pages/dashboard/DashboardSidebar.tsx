import React from 'react';
import {
    LayoutDashboard, Users, FileText, Upload, Settings, LogOut, X
} from 'lucide-react';

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
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'team', label: 'Tim Saya', icon: Users },
        { id: 'submission', label: 'Pengumpulan', icon: Upload },
        { id: 'resources', label: 'Dokumen', icon: FileText },
        { id: 'settings', label: 'Pengaturan', icon: Settings },
    ];

    return (
        <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out bg-white border-r border-gray-200
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 lg:translate-x-0 shadow-lg lg:shadow-none`}
        >
            {/* Logo / Brand */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#FFB22C] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <div>
                        <span className="font-bold text-gray-800 text-sm">CIBC</span>
                        <span className="text-[#FFB22C] font-bold text-sm"> 2026</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3 px-3">
                    Menu Utama
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
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-amber-50 text-amber-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Keluar Akun</span>
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
