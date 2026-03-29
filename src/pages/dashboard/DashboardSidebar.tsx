import React from 'react';
import {
    LayoutDashboard, Users, FileText, Upload, Calendar, Settings, LogOut, X
} from 'lucide-react';

interface SidebarProps {
    activeSection: string;
    // Ubah tipe ini agar bisa menerima fungsi setState dari CIBCDashboard tanpa error TS
    setActiveSection: any;
    isSidebarOpen?: boolean;
    setIsSidebarOpen?: (isOpen: boolean) => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({
    activeSection,
    setActiveSection,
    isSidebarOpen = false,
    setIsSidebarOpen
}) => {
    // Menu Jadwal sudah ditambahkan agar ikon Calendar terpakai
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'team', label: 'Tim Saya', icon: Users },
        { id: 'submission', label: 'Pengumpulan', icon: Upload },
        { id: 'resources', label: 'Dokumen', icon: FileText },
        { id: 'schedule', label: 'Jadwal', icon: Calendar },
        { id: 'settings', label: 'Pengaturan', icon: Settings },
    ];

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#0F0F0F]/5 
            transform transition-transform duration-300 ease-in-out flex flex-col
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:relative lg:translate-x-0 lg:z-0 lg:rounded-3xl lg:border lg:h-[calc(100vh-8rem)]
        `}>
            {/* Header Sidebar (Hanya terlihat di mobile) */}
            <div className="h-20 lg:hidden flex items-center justify-between px-8 border-b border-[#0F0F0F]/5">
                <span className="font-display font-bold text-2xl tracking-wide text-[#0F0F0F]">
                    CIBC <span className="text-[#FFB22C]">2026</span>
                </span>
                <button
                    className="text-[#0F0F0F]/50 hover:text-[#FFB22C] bg-[#F9F8F6] p-1.5 rounded-lg"
                    onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Menu Navigasi */}
            <div className="flex-1 overflow-y-auto py-8 px-4 space-y-1">
                <div className="text-[11px] font-bold text-[#0F0F0F]/40 uppercase tracking-[0.2em] mb-4 px-4">
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
                            className={`
                                w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                                ${isActive
                                    ? 'bg-[#FFB22C] text-white font-bold shadow-md shadow-[#FFB22C]/20'
                                    : 'text-[#0F0F0F]/60 font-semibold hover:bg-[#F9F8F6] hover:text-[#0F0F0F]'
                                }
                            `}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#0F0F0F]/40'}`} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tombol Logout */}
            <div className="p-4 border-t border-[#0F0F0F]/5">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[#0F0F0F]/60 font-semibold hover:bg-red-50 hover:text-red-600 transition-colors group">
                    <div className="p-2 bg-[#F9F8F6] rounded-xl group-hover:bg-red-100 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </div>
                    <span>Keluar Akun</span>
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;