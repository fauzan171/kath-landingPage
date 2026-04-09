/**
 * Admin Dashboard - Competition Management Overview
 * Shows real-time stats for the CIBC 2026 competition
 * Theme matches CIBC Dashboard (cream/amber)
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, FileText, Clock, CheckCircle, AlertCircle,
  TrendingUp, Award, ArrowRight, Calendar,
  Loader2, ClipboardList, Send
} from 'lucide-react';
import { competitionService, teamsService, submissionsService, announcementsService } from '@/services/cibc.service';

// Stat Card Component
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  trend?: { value: number; positive: boolean };
}) => (
  <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#0F0F0F]/5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="min-w-0">
        <p className="text-[11px] sm:text-sm text-[#0F0F0F]/50 font-semibold mb-1">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-[#0F0F0F]">{value}</p>
        {subtitle && <p className="text-[10px] sm:text-xs text-[#0F0F0F]/40 mt-1 font-medium">{subtitle}</p>}
        {trend && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-3 h-3 ${!trend.positive && 'rotate-180'}`} />
            {trend.value}% from last week
          </p>
        )}
      </div>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
    </div>
  </div>
);

// Quick Action Component
const QuickAction = ({
  to,
  label,
  desc,
  icon: Icon,
  color
}: {
  to: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}) => (
  <Link
    to={to}
    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl border border-[#0F0F0F]/5 hover:border-[#FFB22C]/30 hover:shadow-md transition-all group"
  >
    <div className={`w-9 h-9 sm:w-10 sm:h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-[#0F0F0F] text-sm sm:text-base">{label}</h3>
      <p className="text-xs sm:text-sm text-[#0F0F0F]/50 font-medium">{desc}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-[#0F0F0F]/30 group-hover:text-[#FFB22C] transition-colors" />
  </Link>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTeams: 0,
    verifiedTeams: 0,
    pendingTeams: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    gradedSubmissions: 0,
    activeStage: '',
    announcementsCount: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const comp = await competitionService.getActive();
      if (!comp) return;

      // Load team stats
      const teams = await teamsService.getAll(comp.id);
      const verifiedTeams = teams.filter(t => t.status === 'verified').length;
      const pendingTeams = teams.filter(t => t.status === 'pending').length;

      // Load submission stats
      const submissions = await submissionsService.getAll(comp.id);
      const pendingSubmissions = submissions.filter(s => s.status === 'submitted').length;
      const gradedSubmissions = submissions.filter(s => s.status === 'graded').length;

      // Load announcements
      const announcements = await announcementsService.getAll(comp.id);

      // Get active stage
      const stages = await import('@/services/cibc.service').then(m => m.stagesService.getAll(comp.id));
      const activeStage = stages.find(s => s.is_active)?.name || 'Registration';

      setStats({
        totalTeams: teams.length,
        verifiedTeams,
        pendingTeams,
        totalSubmissions: submissions.length,
        pendingSubmissions,
        gradedSubmissions,
        activeStage,
        announcementsCount: announcements.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#FFB22C]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F0F0F]">Dashboard</h1>
        <p className="text-sm text-[#0F0F0F]/50 font-medium">CIBC Power by KATH 2026 - Competition Management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Teams"
          value={stats.totalTeams}
          subtitle={`${stats.verifiedTeams} verified`}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Pending Registrations"
          value={stats.pendingTeams}
          subtitle="Awaiting verification"
          icon={Clock}
          color="bg-[#FFB22C]"
        />
        <StatCard
          title="Total Submissions"
          value={stats.totalSubmissions}
          subtitle={`${stats.gradedSubmissions} graded`}
          icon={FileText}
          color="bg-green-500"
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingSubmissions}
          subtitle="Submissions to grade"
          icon={AlertCircle}
          color="bg-purple-500"
        />
      </div>

      {/* Current Phase Banner */}
      <div className="bg-gradient-to-r from-[#FFB22C] to-amber-500 rounded-2xl p-4 sm:p-6 text-white shadow-lg shadow-[#FFB22C]/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs sm:text-sm mb-1 font-medium">Current Phase</p>
            <h2 className="text-lg sm:text-2xl font-bold">{stats.activeStage}</h2>
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[#0F0F0F] mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {stats.pendingTeams > 0 && (
            <QuickAction
              to="/admin/registrations"
              label="Verify Registrations"
              desc={`${stats.pendingTeams} teams waiting`}
              icon={ClipboardList}
              color="bg-[#FFB22C]"
            />
          )}
          {stats.pendingSubmissions > 0 && (
            <QuickAction
              to="/admin/submissions"
              label="Grade Submissions"
              desc={`${stats.pendingSubmissions} pending review`}
              icon={CheckCircle}
              color="bg-green-500"
            />
          )}
          <QuickAction
            to="/admin/announcements"
            label="Send Announcement"
            desc="Notify all participants"
            icon={Send}
            color="bg-blue-500"
          />
          <QuickAction
            to="/admin/stages"
            label="Manage Timeline"
            desc="Edit competition stages"
            icon={Calendar}
            color="bg-purple-500"
          />
          <QuickAction
            to="/admin/users"
            label="View All Teams"
            desc={`${stats.totalTeams} registered`}
            icon={Users}
            color="bg-cyan-500"
          />
          <QuickAction
            to="/admin/settings"
            label="Competition Settings"
            desc="Configure competition"
            icon={Award}
            color="bg-[#0F0F0F]/60"
          />
        </div>
      </div>

      {/* Competition Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Registration Status */}
        <div className="bg-white rounded-2xl border border-[#0F0F0F]/5 p-4 sm:p-6 shadow-sm">
          <h3 className="font-bold text-[#0F0F0F] mb-3 sm:mb-4 text-sm sm:text-base">Registration Status</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#0F0F0F]/60 text-xs sm:text-sm font-medium">Verified Teams</span>
              <div className="flex items-center gap-2">
                <div className="w-20 sm:w-32 bg-[#F9F8F6] rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${stats.totalTeams > 0 ? (stats.verifiedTeams / stats.totalTeams) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0F0F0F]">{stats.verifiedTeams}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#0F0F0F]/60 text-xs sm:text-sm font-medium">Pending Verification</span>
              <div className="flex items-center gap-2">
                <div className="w-20 sm:w-32 bg-[#F9F8F6] rounded-full h-2">
                  <div
                    className="bg-[#FFB22C] h-2 rounded-full"
                    style={{ width: `${stats.totalTeams > 0 ? (stats.pendingTeams / stats.totalTeams) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0F0F0F]">{stats.pendingTeams}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#0F0F0F]/60 text-xs sm:text-sm font-medium">Draft/Other</span>
              <div className="flex items-center gap-2">
                <div className="w-20 sm:w-32 bg-[#F9F8F6] rounded-full h-2">
                  <div
                    className="bg-[#0F0F0F]/20 h-2 rounded-full"
                    style={{ width: `${stats.totalTeams > 0 ? ((stats.totalTeams - stats.verifiedTeams - stats.pendingTeams) / stats.totalTeams) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0F0F0F]">{stats.totalTeams - stats.verifiedTeams - stats.pendingTeams}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Status */}
        <div className="bg-white rounded-2xl border border-[#0F0F0F]/5 p-4 sm:p-6 shadow-sm">
          <h3 className="font-bold text-[#0F0F0F] mb-3 sm:mb-4 text-sm sm:text-base">Submission Progress</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#0F0F0F]/60 text-xs sm:text-sm font-medium">Graded</span>
              <div className="flex items-center gap-2">
                <div className="w-20 sm:w-32 bg-[#F9F8F6] rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${stats.totalSubmissions > 0 ? (stats.gradedSubmissions / stats.totalSubmissions) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0F0F0F]">{stats.gradedSubmissions}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#0F0F0F]/60 text-xs sm:text-sm font-medium">Pending Review</span>
              <div className="flex items-center gap-2">
                <div className="w-20 sm:w-32 bg-[#F9F8F6] rounded-full h-2">
                  <div
                    className="bg-[#FFB22C] h-2 rounded-full"
                    style={{ width: `${stats.totalSubmissions > 0 ? (stats.pendingSubmissions / stats.totalSubmissions) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0F0F0F]">{stats.pendingSubmissions}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#0F0F0F]/60 text-xs sm:text-sm font-medium">Draft</span>
              <div className="flex items-center gap-2">
                <div className="w-20 sm:w-32 bg-[#F9F8F6] rounded-full h-2">
                  <div
                    className="bg-[#0F0F0F]/20 h-2 rounded-full"
                    style={{ width: `${stats.totalSubmissions > 0 ? ((stats.totalSubmissions - stats.gradedSubmissions - stats.pendingSubmissions) / stats.totalSubmissions) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#0F0F0F]">{stats.totalSubmissions - stats.gradedSubmissions - stats.pendingSubmissions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Management Quick Links */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-[#0F0F0F] mb-3 sm:mb-4">Landing Page Content</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link to="/admin/hero" className="p-3 sm:p-4 bg-white rounded-2xl border border-[#0F0F0F]/5 hover:border-[#FFB22C]/30 shadow-sm hover:shadow-md transition-all">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mb-2" />
            <h3 className="font-bold text-[#0F0F0F] text-xs sm:text-sm">Hero Section</h3>
            <p className="text-[10px] sm:text-xs text-[#0F0F0F]/40 font-medium">Edit hero banner</p>
          </Link>
          <Link to="/admin/services" className="p-3 sm:p-4 bg-white rounded-2xl border border-[#0F0F0F]/5 hover:border-[#FFB22C]/30 shadow-sm hover:shadow-md transition-all">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mb-2" />
            <h3 className="font-bold text-[#0F0F0F] text-xs sm:text-sm">Services</h3>
            <p className="text-[10px] sm:text-xs text-[#0F0F0F]/40 font-medium">Manage services</p>
          </Link>
          <Link to="/admin/portfolio" className="p-3 sm:p-4 bg-white rounded-2xl border border-[#0F0F0F]/5 hover:border-[#FFB22C]/30 shadow-sm hover:shadow-md transition-all">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mb-2" />
            <h3 className="font-bold text-[#0F0F0F] text-xs sm:text-sm">Portfolio</h3>
            <p className="text-[10px] sm:text-xs text-[#0F0F0F]/40 font-medium">Add/edit portfolio</p>
          </Link>
          <Link to="/admin/faq" className="p-3 sm:p-4 bg-white rounded-2xl border border-[#0F0F0F]/5 hover:border-[#FFB22C]/30 shadow-sm hover:shadow-md transition-all">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 mb-2" />
            <h3 className="font-bold text-[#0F0F0F] text-xs sm:text-sm">FAQ</h3>
            <p className="text-[10px] sm:text-xs text-[#0F0F0F]/40 font-medium">{'Questions & answers'}</p>
          </Link>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-[#FFB22C]/10 border border-[#FFB22C]/20 rounded-2xl p-4 sm:p-6">
        <h2 className="font-bold text-[#FFB22C] mb-2 text-sm sm:text-base">Tips</h2>
        <ul className="text-xs sm:text-sm text-[#0F0F0F]/60 space-y-1 font-medium">
          <li>• Verify team registrations promptly to improve participant experience</li>
          <li>• Send announcements to keep participants informed about deadlines</li>
          <li>• Use the timeline management to activate/deactivate competition stages</li>
          <li>• All content changes are saved immediately to the database</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
