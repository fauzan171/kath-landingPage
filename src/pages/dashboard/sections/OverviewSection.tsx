import { Bell, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface OverviewSectionProps {
    currentUser: any;
    team: any;
    stages: any[];
    announcements: any[];
    notifications: any[];
    progressPercentage: number;
    unreadNotifications: number;
    handleMarkAsRead: (id: string) => void;
}

const OverviewSection = ({
    currentUser,
    team,
    stages,
    announcements,
    notifications,
    progressPercentage,
    unreadNotifications,
    handleMarkAsRead
}: OverviewSectionProps) => {
    const { language } = useLanguage();

    return (
        <div className="space-y-6">
            {/* Welcome Banner - Dibuat gelap (Hitam) agar kontras dan elegan dengan aksen Emas */}
            <div className="bg-[#0F0F0F] rounded-3xl p-8 relative overflow-hidden shadow-lg">
                <div className="relative z-10">
                    <h2 className="font-display font-bold text-3xl text-white mb-2">
                        {language === 'id' ? 'Selamat Datang,' : 'Welcome,'} <span className="text-[#FFB22C]">{currentUser?.fullName}</span>!
                    </h2>
                    <p className="font-body text-white/60 font-medium">
                        {language === 'id'
                            ? 'Pantau progres tim dan submission Anda di sini.'
                            : 'Monitor your team progress and submissions here.'}
                    </p>
                </div>
                {/* Aksen kilau emas di pojok kanan banner */}
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#FFB22C] opacity-20 blur-3xl rounded-full"></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Kolom Kiri: Progres & Tahapan (Stages) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Progress Bar */}
                    <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-display font-bold text-xl text-[#0F0F0F]">
                                {language === 'id' ? 'Progres Kompetisi' : 'Competition Progress'}
                            </h3>
                            {team && (
                                <span className="font-body font-bold text-sm px-4 py-1.5 bg-[#FFB22C]/10 text-[#FFB22C] rounded-full">
                                    {team.name}
                                </span>
                            )}
                        </div>
                        <div className="mb-2">
                            <div className="flex justify-between text-sm mb-3 font-body font-semibold text-[#0F0F0F]/60">
                                <span>{language === 'id' ? 'Penyelesaian' : 'Completion'}</span>
                                <span className="text-[#0F0F0F]">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-[#F9F8F6] rounded-full h-3 inset-inner">
                                <div
                                    className="bg-[#FFB22C] h-3 rounded-full transition-all duration-500 shadow-sm"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stages / Tahapan Kompetisi */}
                    <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
                        <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-6">
                            {language === 'id' ? 'Tahapan & Tenggat Waktu' : 'Stages & Deadlines'}
                        </h3>
                        {stages && stages.length > 0 ? (
                            <div className="space-y-4">
                                {stages.map((stage) => (
                                    <div key={stage.id} className="flex items-center gap-4 p-5 bg-[#F9F8F6] rounded-2xl border border-transparent hover:border-[#0F0F0F]/5 transition-all">
                                        <CheckCircle2 className={`w-6 h-6 flex-shrink-0 ${stage.status === 'completed' ? 'text-green-500' :
                                            stage.status === 'active' ? 'text-[#FFB22C]' : 'text-[#0F0F0F]/20'
                                            }`} />
                                        <div className="flex-1">
                                            <h4 className="font-body text-[#0F0F0F] font-bold">{stage.title}</h4>
                                            {stage.deadline && (
                                                <p className="font-body text-sm font-medium text-[#0F0F0F]/50 mt-0.5">{stage.deadline}</p>
                                            )}
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-[#0F0F0F]/30" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-[#0F0F0F]/40">
                                <p className="font-body font-medium">
                                    {language === 'id' ? 'Belum ada tahapan yang tersedia.' : 'No stages available yet.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Kolom Kanan: Pengumuman & Notifikasi */}
                <div className="space-y-6">

                    {/* Pengumuman */}
                    <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
                        <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-6">
                            {language === 'id' ? 'Pengumuman' : 'Announcements'}
                        </h3>
                        {announcements && announcements.length > 0 ? (
                            <div className="space-y-4">
                                {announcements.map((announcement, idx) => (
                                    <div key={idx} className="p-4 bg-[#F9F8F6] rounded-2xl border-l-4 border-[#FFB22C]">
                                        <h4 className="font-body text-sm text-[#0F0F0F] font-bold leading-tight">{announcement.title}</h4>
                                        <p className="font-body text-xs font-medium text-[#0F0F0F]/60 line-clamp-2 mt-1.5">{announcement.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="font-body font-medium text-sm text-[#0F0F0F]/40 text-center py-6">
                                {language === 'id' ? 'Belum ada pengumuman' : 'No announcements yet'}
                            </p>
                        )}
                    </div>

                    {/* Notifikasi */}
                    <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-display font-bold text-xl text-[#0F0F0F]">
                                {language === 'id' ? 'Notifikasi' : 'Notifications'}
                            </h3>
                            {unreadNotifications > 0 && (
                                <span className="bg-[#FFB22C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                    {unreadNotifications} New
                                </span>
                            )}
                        </div>
                        {notifications && notifications.length > 0 ? (
                            <div className="space-y-4">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className={`p-4 rounded-2xl flex gap-3 transition-colors ${!notif.isRead ? 'bg-[#FFB22C]/5 border border-[#FFB22C]/20' : 'bg-[#F9F8F6] border border-transparent'
                                        }`}>
                                        <Bell className={`w-4 h-4 mt-0.5 flex-shrink-0 ${!notif.isRead ? 'text-[#FFB22C]' : 'text-[#0F0F0F]/30'}`} />
                                        <div className="flex-1">
                                            <p className={`font-body text-sm font-semibold leading-snug ${!notif.isRead ? 'text-[#0F0F0F]' : 'text-[#0F0F0F]/60'}`}>
                                                {notif.title}
                                            </p>
                                            {!notif.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                    className="text-[11px] uppercase tracking-wider font-bold text-[#FFB22C] hover:text-[#0F0F0F] transition-colors mt-2 font-body"
                                                >
                                                    {language === 'id' ? 'Tandai sudah dibaca' : 'Mark as read'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="font-body font-medium text-sm text-[#0F0F0F]/40 text-center py-6">
                                {language === 'id' ? 'Tidak ada notifikasi' : 'No notifications'}
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OverviewSection;