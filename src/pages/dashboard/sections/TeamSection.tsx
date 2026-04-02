import { Users, Copy, Check, Building, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { toast } from 'sonner';
import type { TeamData, CurrentUser } from '../CIBCDashboard';

interface TeamSectionProps {
  team: TeamData | null;
  currentUser: CurrentUser | null;
  onRefresh: () => void;
}

const TeamSection = ({ team, currentUser }: TeamSectionProps) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copyTeamCode = async () => {
    if (team?.team_code) {
      await navigator.clipboard.writeText(team.team_code);
      setCopied(true);
      toast.success(language === 'id' ? 'Kode tim disalin!' : 'Team code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
      case 'registered':
      case 'active':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
            {language === 'id' ? 'Terverifikasi' : 'Verified'}
          </span>
        );
      case 'pending_review':
      case 'pending':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
            {language === 'id' ? 'Menunggu Verifikasi' : 'Pending Review'}
          </span>
        );
      case 'draft':
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
            {language === 'id' ? 'Draft' : 'Draft'}
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'student':
        return language === 'id' ? 'Mahasiswa' : 'Student';
      case 'startup':
        return 'Startup';
      case 'corporate':
        return language === 'id' ? 'Korporasi' : 'Corporate';
      case 'open':
        return language === 'id' ? 'Umum' : 'Open';
      default:
        return category;
    }
  };

  if (!team) {
    return (
      <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-8 shadow-sm">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-[#0F0F0F]/20 mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-2">
            {language === 'id' ? 'Belum Ada Tim' : 'No Team Yet'}
          </h3>
          <p className="font-body text-[#0F0F0F]/60 mb-6">
            {language === 'id'
              ? 'Anda belum terdaftar dalam tim. Silakan hubungi panitia atau daftarkan tim baru.'
              : 'You are not registered in a team yet. Contact the organizer or register a new team.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team Info Card */}
      <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <h3 className="font-display font-bold text-xl text-[#0F0F0F]">
            {language === 'id' ? 'Informasi Tim' : 'Team Information'}
          </h3>
          {getStatusBadge(team.status)}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Team Name */}
          <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
            <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
              {language === 'id' ? 'Nama Tim' : 'Team Name'}
            </label>
            <p className="font-body font-bold text-[#0F0F0F] mt-1 text-lg">{team.name}</p>
          </div>

          {/* Team Code */}
          <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
            <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
              {language === 'id' ? 'Kode Tim' : 'Team Code'}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <p className="font-body font-bold text-[#0F0F0F] font-mono">{team.team_code || '-'}</p>
              {team.team_code && (
                <button
                  onClick={copyTeamCode}
                  className="p-1.5 hover:bg-[#0F0F0F]/5 rounded-lg transition-colors"
                  title={language === 'id' ? 'Salin kode' : 'Copy code'}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#0F0F0F]/40" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
            <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
              {language === 'id' ? 'Kategori' : 'Category'}
            </label>
            <p className="font-body font-bold text-[#0F0F0F] mt-1 capitalize">
              {getCategoryLabel(team.category)}
            </p>
          </div>

          {/* Institution */}
          <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
            <label className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
              {language === 'id' ? 'Institusi' : 'Institution'}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <Building className="w-4 h-4 text-[#0F0F0F]/40" />
              <p className="font-body font-bold text-[#0F0F0F]">{team.institution || '-'}</p>
            </div>
          </div>
        </div>

        {/* Team Code Info */}
        {team.team_code && (
          <div className="mt-6 p-4 bg-[#FFB22C]/10 rounded-2xl border border-[#FFB22C]/20">
            <p className="font-body text-sm text-[#0F0F0F]/70">
              <strong>{language === 'id' ? 'Tip:' : 'Tip:'}</strong>{' '}
              {language === 'id'
                ? 'Bagikan kode tim ini kepada anggota tim Anda untuk bergabung.'
                : 'Share this team code with your team members to join.'}
            </p>
          </div>
        )}
      </div>

      {/* Team Contact */}
      <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
        <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-6">
          {language === 'id' ? 'Kontak Tim' : 'Team Contact'}
        </h3>

        <div className="p-5 bg-[#F9F8F6] rounded-2xl border border-[#0F0F0F]/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFB22C]/10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-[#FFB22C]" />
            </div>
            <div>
              <p className="font-body text-xs font-bold text-[#0F0F0F]/40 uppercase tracking-wider">
                {language === 'id' ? 'Ketua Tim' : 'Team Leader'}
              </p>
              <p className="font-body font-bold text-[#0F0F0F]">{currentUser?.fullName}</p>
              <p className="font-body text-sm text-[#0F0F0F]/60">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Summary (if any) */}
      {team.total_score !== undefined && team.total_score > 0 && (
        <div className="bg-gradient-to-r from-[#FFB22C] to-[#FFA500] rounded-3xl p-6 lg:p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-white/80 text-sm font-medium">
                {language === 'id' ? 'Total Skor Tim' : 'Team Total Score'}
              </p>
              <p className="font-display font-bold text-4xl text-white mt-1">
                {team.total_score}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSection;