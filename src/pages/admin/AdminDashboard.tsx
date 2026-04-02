/**
 * Admin Dashboard - Competition Management Overview
 * Shows real-time stats for the CIBC 2026 competition
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
  <div className="bg-white rounded-xl p-6 border border-gray-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {trend && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-3 h-3 ${!trend.positive && 'rotate-180'}`} />
            {trend.value}% from last week
          </p>
        )}
      </div>
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
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
    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all group"
  >
    <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1">
      <h3 className="font-medium text-gray-800">{label}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
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
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">CIBC Power by KATH 2026 - Competition Management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          color="bg-amber-500"
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
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-100 text-sm mb-1">Current Phase</p>
            <h2 className="text-2xl font-bold">{stats.activeStage}</h2>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.pendingTeams > 0 && (
            <QuickAction
              to="/admin/registrations"
              label="Verify Registrations"
              desc={`${stats.pendingTeams} teams waiting`}
              icon={ClipboardList}
              color="bg-amber-500"
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
            color="bg-gray-500"
          />
        </div>
      </div>

      {/* Competition Progress */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Registration Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Registration Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Verified Teams</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${stats.totalTeams > 0 ? (stats.verifiedTeams / stats.totalTeams) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{stats.verifiedTeams}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending Verification</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${stats.totalTeams > 0 ? (stats.pendingTeams / stats.totalTeams) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{stats.pendingTeams}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Draft/Other</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gray-400 h-2 rounded-full"
                    style={{ width: `${stats.totalTeams > 0 ? ((stats.totalTeams - stats.verifiedTeams - stats.pendingTeams) / stats.totalTeams) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{stats.totalTeams - stats.verifiedTeams - stats.pendingTeams}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Submission Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Graded</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${stats.totalSubmissions > 0 ? (stats.gradedSubmissions / stats.totalSubmissions) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{stats.gradedSubmissions}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending Review</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${stats.totalSubmissions > 0 ? (stats.pendingSubmissions / stats.totalSubmissions) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{stats.pendingSubmissions}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Draft</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gray-400 h-2 rounded-full"
                    style={{ width: `${stats.totalSubmissions > 0 ? ((stats.totalSubmissions - stats.gradedSubmissions - stats.pendingSubmissions) / stats.totalSubmissions) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{stats.totalSubmissions - stats.gradedSubmissions - stats.pendingSubmissions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Management Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Landing Page Content</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/hero" className="p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 transition-colors">
            <FileText className="w-5 h-5 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-800">Hero Section</h3>
            <p className="text-xs text-gray-500">Edit hero banner</p>
          </Link>
          <Link to="/admin/services" className="p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 transition-colors">
            <FileText className="w-5 h-5 text-green-500 mb-2" />
            <h3 className="font-medium text-gray-800">Services</h3>
            <p className="text-xs text-gray-500">Manage services</p>
          </Link>
          <Link to="/admin/portfolio" className="p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 transition-colors">
            <FileText className="w-5 h-5 text-purple-500 mb-2" />
            <h3 className="font-medium text-gray-800">Portfolio</h3>
            <p className="text-xs text-gray-500">Add/edit portfolio</p>
          </Link>
          <Link to="/admin/faq" className="p-4 bg-white rounded-xl border border-gray-200 hover:border-amber-300 transition-colors">
            <FileText className="w-5 h-5 text-cyan-500 mb-2" />
            <h3 className="font-medium text-gray-800">FAQ</h3>
            <p className="text-xs text-gray-500">Questions & answers</p>
          </Link>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h2 className="font-semibold text-amber-800 mb-2">Tips</h2>
        <ul className="text-sm text-amber-700 space-y-1">
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