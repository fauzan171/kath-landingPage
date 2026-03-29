import { useLanguage } from '../../../contexts/LanguageContext';

interface SettingsSectionProps {
    currentUser: any;
}

const SettingsSection = ({ currentUser }: SettingsSectionProps) => {
    const { language } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
                <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-6 lg:mb-8">
                    {language === 'id' ? 'Pengaturan Akun' : 'Account Settings'}
                </h3>

                <div className="space-y-4">
                    <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
                        <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">Email</label>
                        <p className="font-body font-bold text-[#0F0F0F] mt-1">{currentUser?.email || '-'}</p>
                    </div>

                    <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
                        <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
                            {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                        </label>
                        <p className="font-body font-bold text-[#0F0F0F] mt-1">{currentUser?.fullName || '-'}</p>
                    </div>

                    {currentUser?.category && (
                        <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
                            <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
                                {language === 'id' ? 'Kategori' : 'Category'}
                            </label>
                            <p className="font-body font-bold text-[#0F0F0F] mt-1 capitalize">{currentUser.category}</p>
                        </div>
                    )}
                </div>

                <button className="mt-8 px-8 py-3 bg-[#FFB22C] text-white rounded-xl font-body font-bold text-sm hover:bg-[#FFB22C]/90 shadow-md shadow-[#FFB22C]/20 transition-all">
                    {language === 'id' ? 'Edit Profil' : 'Edit Profile'}
                </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-white border border-red-100 rounded-3xl p-6 lg:p-8 shadow-sm">
                <h3 className="font-display font-bold text-xl text-red-600 mb-2">
                    {language === 'id' ? 'Zona Bahaya' : 'Danger Zone'}
                </h3>
                <p className="font-body font-medium text-[#0F0F0F]/60 mb-6">
                    {language === 'id'
                        ? 'Tindakan di bawah ini tidak dapat dibatalkan.'
                        : 'Actions below cannot be undone.'}
                </p>
                <button className="px-8 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-body font-bold text-sm hover:bg-red-100 transition-all">
                    {language === 'id' ? 'Hapus Akun' : 'Delete Account'}
                </button>
            </div>
        </div>
    );
};

export default SettingsSection;