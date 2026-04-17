/**
 * Team Detail Modal - Full team detail view for admin
 * Shows: members, KTM/student cards, submissions, activity log
 */

import { useState, useEffect } from 'react';
import {
  X, Users, Building2, Clock, FileText, ExternalLink,
  User, Mail, Phone, GraduationCap, Crown, Shield,
  Send, CheckCircle, Loader2, Activity,
  Calendar, Image, Link2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Team, TeamMember, Submission } from '@/lib/supabase';

// ============================================
// Types
// ============================================

interface TeamWithMembers extends Team {
  members?: TeamMember[];
}

interface SubmissionWithTask extends Submission {
  task_name?: string;
  task_type?: string;
}

interface AuditLogEntry {
  id: string;
  user_id: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

type DetailTab = 'members' | 'submissions' | 'activity';

interface TeamDetailModalProps {
  team: TeamWithMembers;
  onClose: () => void;
}

// ============================================
// Component
// ============================================

const TeamDetailModal = ({ team, onClose }: TeamDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('members');
  const [members, setMembers] = useState<TeamMember[]>(team.members || []);
  const [submissions, setSubmissions] = useState<SubmissionWithTask[]>([]);
  const [activityLogs, setActivityLogs] = useState<AuditLogEntry[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Load full member data when modal opens
  useEffect(() => {
    loadMembers();
  }, []);

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'submissions' && submissions.length === 0) {
      loadSubmissions();
    }
    if (activeTab === 'activity' && activityLogs.length === 0) {
      loadActivityLogs();
    }
  }, [activeTab]);

  const loadMembers = async () => {
    setLoadingMembers(true);
    try {
      const { data } = await supabase!
        .from('team_members')
        .select('id, team_id, user_id, full_name, email, phone, institution, role, is_active, joined_at, student_id, major, position')
        .eq('team_id', team.id)
        .eq('is_active', true);
      setMembers(data || []);
    } catch (e) {
      console.error('Failed to load members:', e);
    } finally {
      setLoadingMembers(false);
    }
  };

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const { data } = await supabase!
        .from('submissions')
        .select(`
          id, task_id, team_id, competition_id,
          file_url, file_name, file_size, drive_file_id,
          link_url, content, status, total_score, feedback,
          submitted_at, created_at, updated_at
        `)
        .eq('team_id', team.id)
        .order('submitted_at', { ascending: false });

      if (data && data.length > 0) {
        // Get task names
        const taskIds = [...new Set(data.map(s => s.task_id))];
        const { data: tasks } = await supabase!
          .from('tasks')
          .select('id, name, type')
          .in('id', taskIds);

        const taskMap = new Map((tasks || []).map(t => [t.id, t]));

        const enriched = data.map(s => ({
          ...s,
          task_name: taskMap.get(s.task_id)?.name || 'Unknown Task',
          task_type: taskMap.get(s.task_id)?.type || 'unknown',
        }));
        setSubmissions(enriched);
      } else {
        setSubmissions([]);
      }
    } catch (e) {
      console.error('Failed to load submissions:', e);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const loadActivityLogs = async () => {
    setLoadingActivity(true);
    try {
      // Get user IDs from team members
      const memberUserIds = members
        .filter(m => m.user_id)
        .map(m => m.user_id);

      if (memberUserIds.length === 0) {
        setActivityLogs([]);
        setLoadingActivity(false);
        return;
      }

      // Query audit_logs for these users
      const { data: logs } = await supabase!
        .from('audit_logs')
        .select('id, user_id, action, entity_type, entity_id, details, created_at')
        .in('user_id', memberUserIds)
        .order('created_at', { ascending: false })
        .limit(100);

      if (logs && logs.length > 0) {
        // Get user names
        const { data: users } = await supabase!
          .from('users')
          .select('id, name, email')
          .in('id', memberUserIds);

        const userMap = new Map((users || []).map(u => [u.id, u]));

        const enriched = logs.map(log => ({
          ...log,
          user_name: userMap.get(log.user_id)?.name || 'Unknown',
          user_email: userMap.get(log.user_id)?.email || '',
        }));
        setActivityLogs(enriched);
      } else {
        // Fallback: try to get activity from submissions as activity indicator
        const { data: subs } = await supabase!
          .from('submissions')
          .select('id, submitted_at, status, file_name, created_at')
          .eq('team_id', team.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (subs && subs.length > 0) {
          const subLogs: AuditLogEntry[] = subs.map(s => ({
            id: s.id,
            user_id: '',
            action: s.status === 'submitted' ? 'submit_task' : `submission_${s.status}`,
            entity_type: 'submission',
            entity_id: s.id,
            details: { file_name: s.file_name, status: s.status },
            created_at: s.submitted_at || s.created_at,
            user_name: 'Team Member',
            user_email: '',
          }));
          setActivityLogs(subLogs);
        } else {
          setActivityLogs([]);
        }
      }
    } catch (e) {
      console.error('Failed to load activity logs:', e);
      setActivityLogs([]);
    } finally {
      setLoadingActivity(false);
    }
  };

  // ============================================
  // Helper Functions
  // ============================================

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      verified: 'bg-green-100 text-green-700',
      submitted: 'bg-green-100 text-green-700',
      graded: 'bg-blue-100 text-blue-700',
      final: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      draft: 'bg-gray-100 text-gray-700',
      under_review: 'bg-blue-100 text-blue-700',
      needs_revision: 'bg-orange-100 text-orange-700',
      rejected: 'bg-red-100 text-red-700',
      late: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'leader':
        return <Crown className="w-4 h-4 text-amber-500" />;
      case 'mentor':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionLabel = (action: string): { label: string; color: string; icon: React.ReactNode } => {
    switch (action) {
      case 'login':
        return { label: 'Login', color: 'text-green-600 bg-green-50', icon: <CheckCircle className="w-4 h-4" /> };
      case 'logout':
        return { label: 'Logout', color: 'text-gray-600 bg-gray-50', icon: <X className="w-4 h-4" /> };
      case 'submit_task':
        return { label: 'Submit Tugas', color: 'text-blue-600 bg-blue-50', icon: <Send className="w-4 h-4" /> };
      case 'upload_payment':
        return { label: 'Upload Pembayaran', color: 'text-amber-600 bg-amber-50', icon: <FileText className="w-4 h-4" /> };
      case 'register_team':
        return { label: 'Daftar Tim', color: 'text-purple-600 bg-purple-50', icon: <Users className="w-4 h-4" /> };
      case 'join_team':
        return { label: 'Bergabung Tim', color: 'text-purple-600 bg-purple-50', icon: <Users className="w-4 h-4" /> };
      case 'update_profile':
        return { label: 'Update Profil', color: 'text-gray-600 bg-gray-50', icon: <User className="w-4 h-4" /> };
      case 'upload_file':
        return { label: 'Upload File', color: 'text-blue-600 bg-blue-50', icon: <FileText className="w-4 h-4" /> };
      default:
        // Handle submission_status patterns
        if (action.startsWith('submission_')) {
          return { label: `Submission ${action.replace('submission_', '')}`, color: 'text-blue-600 bg-blue-50', icon: <Send className="w-4 h-4" /> };
        }
        return { label: action.replace(/_/g, ' '), color: 'text-gray-600 bg-gray-50', icon: <Activity className="w-4 h-4" /> };
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // ============================================
  // Render Tabs
  // ============================================

  const TABS: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
    { id: 'members', label: 'Anggota Tim', icon: <Users className="w-4 h-4" /> },
    { id: 'submissions', label: 'Submissions', icon: <Send className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity Log', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-amber-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center">
                <Users className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{team.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">{team.code}</span>
                  {getStatusBadge(team.status)}
                  {getStatusBadge(team.payment_status || 'unpaid')}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Team Meta Info */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4 text-gray-400" />
              {team.institution || 'No institution'}
            </span>
            <span className="flex items-center gap-1 capitalize">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              {team.category} Category
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              Terdaftar: {new Date(team.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Registration Documents */}
          {(team.student_cards_url || team.instagram_proof_url || team.twibbon_proof_url || team.bmc_url) && (
            <div className="mt-4 pt-3 border-t border-amber-200">
              <p className="text-xs text-gray-500 mb-2 font-medium">Dokumen Pendaftaran:</p>
              <div className="flex flex-wrap gap-2">
                {team.student_cards_url && (
                  <a href={team.student_cards_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs hover:bg-blue-100 transition-colors">
                    <Image className="w-3 h-3" /> KTM / Student Cards
                  </a>
                )}
                {team.instagram_proof_url && (
                  <a href={team.instagram_proof_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-pink-50 text-pink-700 rounded-lg text-xs hover:bg-pink-100 transition-colors">
                    <Image className="w-3 h-3" /> Instagram Follow
                  </a>
                )}
                {team.twibbon_proof_url && (
                  <a href={team.twibbon_proof_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs hover:bg-purple-100 transition-colors">
                    <Image className="w-3 h-3" /> Twibbon
                  </a>
                )}
                {team.bmc_url && (
                  <a href={team.bmc_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs hover:bg-amber-100 transition-colors">
                    <FileText className="w-3 h-3" /> BMC
                  </a>
                )}
                {team.payment_proof && (
                  <a href={team.payment_proof} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs hover:bg-green-100 transition-colors">
                    <FileText className="w-3 h-3" /> Bukti Pembayaran
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ===== MEMBERS TAB ===== */}
          {activeTab === 'members' && (
            <div>
              {loadingMembers ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p>Belum ada anggota tim</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
                          {member.full_name?.charAt(0)?.toUpperCase() || '?'}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800 truncate">{member.full_name}</h4>
                            {getRoleIcon(member.role)}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              member.role === 'leader' ? 'bg-amber-100 text-amber-700' :
                              member.role === 'mentor' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {member.role === 'leader' ? 'Ketua' : member.role === 'mentor' ? 'Pembimbing' : 'Anggota'}
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
                            <span className="flex items-center gap-1.5 text-gray-600">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              {member.email}
                            </span>
                            {member.phone && (
                              <span className="flex items-center gap-1.5 text-gray-600">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                {member.phone}
                              </span>
                            )}
                            {member.institution && (
                              <span className="flex items-center gap-1.5 text-gray-600">
                                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                {member.institution}
                              </span>
                            )}
                            {member.student_id && (
                              <span className="flex items-center gap-1.5 text-gray-600">
                                <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                                NIM: {member.student_id}
                              </span>
                            )}
                            {member.major && (
                              <span className="flex items-center gap-1.5 text-gray-600">
                                <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                                {member.major}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 text-xs text-gray-400">
                            Bergabung: {new Date(member.joined_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== SUBMISSIONS TAB ===== */}
          {activeTab === 'submissions' && (
            <div>
              {loadingSubmissions ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Send className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p>Belum ada submission</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map(sub => (
                    <div key={sub.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-800">{sub.task_name}</h4>
                            {getStatusBadge(sub.status)}
                          </div>

                          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                            {sub.file_name && (
                              <span className="flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-gray-400" />
                                {sub.file_name}
                              </span>
                            )}
                            {sub.file_size && (
                              <span className="text-gray-400">
                                ({(sub.file_size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            )}
                            {sub.total_score !== null && sub.total_score !== undefined && (
                              <span className="flex items-center gap-1 text-amber-600 font-medium">
                                Score: {sub.total_score}
                              </span>
                            )}
                          </div>

                          {sub.link_url && (
                            <a href={sub.link_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:underline">
                              <Link2 className="w-3.5 h-3.5" />
                              {sub.link_url.length > 50 ? sub.link_url.substring(0, 50) + '...' : sub.link_url}
                            </a>
                          )}

                          {sub.content && (
                            <p className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border max-h-20 overflow-y-auto">
                              {sub.content.length > 200 ? sub.content.substring(0, 200) + '...' : sub.content}
                            </p>
                          )}

                          {sub.feedback && (
                            <div className="mt-2 bg-blue-50 border border-blue-100 p-2 rounded">
                              <p className="text-xs text-blue-600 font-medium mb-1">Feedback:</p>
                              <p className="text-sm text-blue-800">{sub.feedback}</p>
                            </div>
                          )}

                          <div className="mt-2 text-xs text-gray-400 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Submitted: {sub.submitted_at
                                ? new Date(sub.submitted_at).toLocaleString('id-ID')
                                : 'Belum disubmit'}
                            </span>
                          </div>
                        </div>

                        {/* File Link */}
                        {sub.file_url && (
                          <a href={sub.file_url} target="_blank" rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-200 rounded-lg shrink-0" title="Lihat file">
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== ACTIVITY LOG TAB ===== */}
          {activeTab === 'activity' && (
            <div>
              {loadingActivity ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                </div>
              ) : activityLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p>Belum ada aktivitas tercatat</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

                  <div className="space-y-4">
                    {activityLogs.map((log) => {
                      const actionInfo = getActionLabel(log.action);
                      return (
                        <div key={log.id} className="relative flex gap-4 pl-2">
                          {/* Timeline dot */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${actionInfo.color}`}>
                            {actionInfo.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <span className="font-medium text-gray-800 text-sm">
                                  {log.user_name || 'Anggota Tim'}
                                </span>
                                <span className="text-sm text-gray-600 ml-2">
                                  {actionInfo.label}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {formatTimeAgo(log.created_at)}
                              </span>
                            </div>

                            {/* Details */}
                            {log.details && Object.keys(log.details).length > 0 && (
                              <div className="mt-1.5 text-xs text-gray-500">
                                {log.details.file_name && (
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    {String(log.details.file_name)}
                                  </span>
                                )}
                                {log.details.status && (
                                  <span className="ml-2">
                                    Status: <span className="font-medium">{String(log.details.status).replace(/_/g, ' ')}</span>
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Exact timestamp */}
                            <div className="mt-1 text-xs text-gray-400">
                              {new Date(log.created_at).toLocaleString('id-ID', {
                                day: 'numeric', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-xs text-gray-400">
            {members.length} anggota | {submissions.length} submission
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailModal;
