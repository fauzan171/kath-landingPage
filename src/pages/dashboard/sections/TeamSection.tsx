import { Users, AlertCircle, UserPlus } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface TeamSectionProps {
    team: any;
    teamMembers: any[];
}

const TeamSection = ({ team, teamMembers }: TeamSectionProps) => {
    const { language } = useLanguage();

    return (
        <div className="space-y-6">
            {/* Team Info Card */}
            <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6 lg:mb-8">
                    <div className="p-3 bg-[#FFB22C]/10 rounded-xl">
                        <Users className="w-6 h-6 text-[#FFB22C]" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-[#0F0F0F]">
                        {language === 'id' ? 'Informasi Tim' : 'Team Information'}
                    </h3>
                </div>

                {team ? (
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
                            <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
                                {language === 'id' ? 'Nama Tim' : 'Team Name'}
                            </label>
                            <p className="font-body font-bold text-[#0F0F0F] mt-1">{team.name}</p>
                        </div>
                        <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
                            <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
                                {language === 'id' ? 'Kategori' : 'Category'}
                            </label>
                            <p className="font-body font-bold text-[#0F0F0F] mt-1 capitalize">{team.category}</p>
                        </div>
                        {team.institution && (
                            <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
                                <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
                                    {language === 'id' ? 'Institusi' : 'Institution'}
                                </label>
                                <p className="font-body font-bold text-[#0F0F0F] mt-1">{team.institution}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
                        <AlertCircle className="w-14 h-14 text-[#0F0F0F]/20 mx-auto mb-4" />
                        <p className="font-body font-medium text-[#0F0F0F]/50">
                            {language === 'id' ? 'Anda belum bergabung dengan tim' : "You haven't joined a team yet"}
                        </p>
                    </div>
                )}
            </div>

            {/* Team Members */}
            {team && (
                <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6 lg:mb-8">
                        <h3 className="font-display font-bold text-xl text-[#0F0F0F]">
                            {language === 'id' ? 'Anggota Tim' : 'Team Members'}
                        </h3>
                        <span className="font-body font-bold text-sm bg-[#0F0F0F]/5 text-[#0F0F0F]/60 px-4 py-1.5 rounded-full">
                            {teamMembers.length} / {team.category === 'open' ? 10 : 5}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {teamMembers.map((member: any) => (
                            <div key={member.id} className="flex items-center justify-between p-4 sm:p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5 hover:border-[#0F0F0F]/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#FFB22C]/10 flex items-center justify-center border border-[#FFB22C]/20">
                                        <span className="font-display font-bold text-lg text-[#FFB22C]">
                                            {member.user?.name?.charAt(0) || '?'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-body font-bold text-[#0F0F0F]">{member.user?.name || 'Unknown'}</p>
                                        <p className="font-body text-xs font-medium text-[#0F0F0F]/50 mt-0.5">{member.user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {member.role === 'leader' && (
                                        <span className="px-3 py-1 bg-[#FFB22C]/10 text-[#FFB22C] text-[11px] font-bold uppercase tracking-wider rounded-full font-body">
                                            Leader
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Invite Button */}
                    {teamMembers.length < (team.category === 'open' ? 10 : 5) && (
                        <button className="w-full mt-5 py-4 border-2 border-dashed border-[#0F0F0F]/10 rounded-2xl text-[#0F0F0F]/50 hover:border-[#FFB22C] hover:text-[#FFB22C] hover:bg-[#FFB22C]/5 transition-all font-body font-bold flex items-center justify-center gap-2 group">
                            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {language === 'id' ? 'Undang Anggota' : 'Invite Member'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TeamSection;