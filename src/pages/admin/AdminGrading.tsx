/**
 * Admin Grading & Evaluation
 * Criteria-based rubric grading for submissions
 * Based on PRD-CIBC-Competition-Platform.md Section 4.6
 */

import { useState, useEffect } from 'react';
import { Download, Loader2, CheckCircle, Clock, FileText, Users, Award, Eye, Send, User, CreditCard, Calendar, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { submissionsService, competitionService, type Submission, type Team } from '@/services/cibc.service';
import { supabase } from '@/lib/supabase';

// Grading criteria rubric (based on PRD)
const DEFAULT_RUBRIC = [
  { id: 'innovation', name: 'Innovation & Creativity', nameId: 'Inovasi & Kreativitas', maxScore: 25, weight: 0.25 },
  { id: 'feasibility', name: 'Feasibility & Execution', nameId: 'Kelayakan & Eksekusi', maxScore: 25, weight: 0.25 },
  { id: 'market', name: 'Market Potential', nameId: 'Potensi Pasar', maxScore: 20, weight: 0.20 },
  { id: 'presentation', name: 'Presentation Quality', nameId: 'Kualitas Presentasi', maxScore: 15, weight: 0.15 },
  { id: 'team', name: 'Team Composition', nameId: 'Komposisi Tim', maxScore: 15, weight: 0.15 },
];

interface TeamWithLeader extends Team {
  leader_name?: string;
  leader_email?: string;
  member_count?: number;
}

interface GradingSubmission extends Submission {
  team?: TeamWithLeader;
  criteria_scores?: Record<string, number>;
}

const AdminGrading = () => {
  const [submissions, setSubmissions] = useState<GradingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<GradingSubmission | null>(null);
  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [filter, setFilter] = useState<'all' | 'submitted' | 'graded' | 'needs_revision'>('submitted');
  const [blindMode, setBlindMode] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const comp = await competitionService.getActive();
      if (comp) {
        const data = await submissionsService.getAll(comp.id);

        // Enrich submissions with team leader info
        const enriched = await Promise.all(data.map(async (sub) => {
          if (sub.team_id && supabase) {
            // Get team details
            const { data: team } = await supabase
              .from('teams')
              .select('id, name, institution, payment_proof, payment_status')
              .eq('id', sub.team_id)
              .single();

            if (team) {
              // Get leader info
              let leaderName = '';
              let leaderEmail = '';
              const { data: leaderMember } = await supabase
                .from('team_members')
                .select('user_id')
                .eq('team_id', team.id)
                .eq('role', 'leader')
                .maybeSingle();

              if (leaderMember) {
                const { data: leaderUser } = await supabase
                  .from('users')
                  .select('name, email')
                  .eq('id', leaderMember.user_id)
                  .single();
                leaderName = leaderUser?.name || '';
                leaderEmail = leaderUser?.email || '';
              }

              // Get member count
              const { count: memberCount } = await supabase
                .from('team_members')
                .select('*', { count: 'exact', head: true })
                .eq('team_id', team.id);

              return {
                ...sub,
                team: {
                  ...team,
                  leader_name: leaderName,
                  leader_email: leaderEmail,
                  member_count: memberCount || 0,
                } as TeamWithLeader,
              };
            }
          }
          return sub;
        }));

        setSubmissions(enriched);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalScore = () => {
    let total = 0;
    for (const criteria of DEFAULT_RUBRIC) {
      const score = criteriaScores[criteria.id] || 0;
      total += (score / criteria.maxScore) * criteria.weight * 100;
    }
    return Math.round(total);
  };

  const handleGrade = async () => {
    if (!selectedSubmission) return;

    setGradingId(selectedSubmission.id);
    try {
      const totalScore = calculateTotalScore();

      // Get current admin user ID from Supabase auth
      let adminId: string | null = null;
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        adminId = user?.id || null;
      }

      // Update submission with criteria scores
      if (supabase) {
        const { error } = await supabase
          .from('submissions')
          .update({
            total_score: totalScore,
            feedback,
            criteria_scores: criteriaScores,
            graded_by: adminId,
            graded_at: new Date().toISOString(),
            status: 'graded',
          })
          .eq('id', selectedSubmission.id);

        if (error) throw error;
      }

      toast.success(`Graded! Score: ${totalScore}/100`);

      // Create notification for team members about grading result
      if (supabase && selectedSubmission.team_id) {
        try {
          const { data: members } = await supabase
            .from('team_members')
            .select('user_id')
            .eq('team_id', selectedSubmission.team_id);

          if (members && members.length > 0) {
            const notifications = members.map((m: { user_id: string }) => ({
              user_id: m.user_id,
              title: 'Submission Dinilai',
              message: `Submission Anda telah dinilai. Skor: ${totalScore}/100.${feedback ? ` Feedback: ${feedback.substring(0, 100)}${feedback.length > 100 ? '...' : ''}` : ''}`,
              type: 'submission_graded',
              link: '/cibc/dashboard',
              is_read: false,
            }));
            await supabase.from('notifications').insert(notifications);
          }
        } catch (notifErr) {
          console.error('Failed to create grading notification:', notifErr);
          // Don't fail the grading if notification fails
        }
      }

      load();
      setSelectedSubmission(null);
      setCriteriaScores({});
      setFeedback('');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save grade');
    } finally {
      setGradingId(null);
    }
  };

  const handleNeedsRevision = async () => {
    if (!selectedSubmission || !feedback) {
      toast.error('Please provide feedback for revision');
      return;
    }

    setGradingId(selectedSubmission.id);
    try {
      if (supabase) {
        const { error } = await supabase
          .from('submissions')
          .update({
            status: 'needs_revision',
            feedback,
          })
          .eq('id', selectedSubmission.id);

        if (error) throw error;

        // Create notification for the team
        try {
          const teamId = selectedSubmission.team_id;
          const { data: members } = await supabase
            .from('team_members')
            .select('user_id')
            .eq('team_id', teamId);

          if (members && members.length > 0) {
            const notifications = members.map((m: { user_id: string }) => ({
              user_id: m.user_id,
              title: 'Submission Perlu Revisi',
              message: `Submission Anda perlu direvisi. Silakan cek feedback dan submit ulang.${feedback ? ` Feedback: ${feedback.substring(0, 100)}${feedback.length > 100 ? '...' : ''}` : ''}`,
              type: 'warning',
              link: '/cibc/dashboard',
              is_read: false,
            }));

            await supabase.from('notifications').insert(notifications);
          }
        } catch (notifErr) {
          console.warn('Failed to create revision notification:', notifErr);
        }
      }

      toast.success('Marked for revision');
      load();
      setSelectedSubmission(null);
      setFeedback('');
    } catch (e) {
      console.error(e);
      toast.error('Failed to update status');
    } finally {
      setGradingId(null);
    }
  };

  const openGrading = (submission: GradingSubmission) => {
    setSelectedSubmission(submission);
    // Initialize criteria scores from existing data or defaults
    const existingScores = submission.criteria_scores || {};
    const initialScores: Record<string, number> = {};
    for (const criteria of DEFAULT_RUBRIC) {
      initialScores[criteria.id] = existingScores[criteria.id] || 0;
    }
    setCriteriaScores(initialScores);
    setFeedback(submission.feedback || '');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Graded</span>;
      case 'submitted':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Submitted</span>;
      case 'needs_revision':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Needs Revision</span>;
      case 'under_review':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Under Review</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">Draft</span>;
    }
  };

  const filteredSubmissions = submissions.filter(s => filter === 'all' || s.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Grading & Evaluation</h1>
          <p className="text-gray-600">Evaluate submissions using rubric criteria</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={blindMode}
              onChange={(e) => setBlindMode(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <Eye className="w-4 h-4" />
            Blind Grading
          </label>
          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
            {submissions.filter(s => s.status === 'submitted').length} Pending
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{submissions.length}</p>
              <p className="text-xs text-gray-500">Total Submissions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{submissions.filter(s => s.status === 'submitted').length}</p>
              <p className="text-xs text-gray-500">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{submissions.filter(s => s.status === 'graded').length}</p>
              <p className="text-xs text-gray-500">Graded</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {submissions.filter(s => s.status === 'graded').length > 0
                  ? Math.round(submissions.filter(s => s.status === 'graded').reduce((a, b) => a + (b.total_score || 0), 0) / submissions.filter(s => s.status === 'graded').length)
                  : 0}
              </p>
              <p className="text-xs text-gray-500">Avg Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['submitted', 'graded', 'needs_revision', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm capitalize ${
              filter === f ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'submitted' ? 'Pending' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">No submissions found</p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    submission.status === 'graded' ? 'bg-green-100 text-green-600' :
                    submission.status === 'submitted' ? 'bg-blue-100 text-blue-600' :
                    submission.status === 'needs_revision' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {submission.status === 'graded' ? <CheckCircle className="w-6 h-6" /> :
                     submission.status === 'submitted' ? <Clock className="w-6 h-6" /> :
                     <FileText className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">
                        {blindMode && submission.status !== 'graded' ? 'Team #XXXX' : (submission.team?.name || 'Unknown Team')}
                      </h3>
                      {getStatusBadge(submission.status)}
                      {submission.is_late && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs">Late</span>
                      )}
                    </div>
                    {/* Team Leader & Institution */}
                    {!blindMode && submission.team && (
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        {submission.team.leader_name && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {submission.team.leader_name}
                          </span>
                        )}
                        {submission.team.institution && (
                          <span>{submission.team.institution}</span>
                        )}
                        {submission.team.member_count !== undefined && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {submission.team.member_count} members
                          </span>
                        )}
                      </div>
                    )}
                    {/* Submission Time */}
                    {submission.submitted_at && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Submitted: {new Date(submission.submitted_at).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                    {/* File Name */}
                    {submission.file_name && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {submission.file_name}
                      </p>
                    )}
                    {/* Payment Proof */}
                    {!blindMode && submission.team?.payment_proof && (
                      <a
                        href={submission.team.payment_proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1"
                      >
                        <CreditCard className="w-3 h-3" />
                        View Payment Proof
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {submission.total_score !== undefined && submission.total_score !== null && (
                    <div className="flex items-center gap-2">
                      <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-bold text-lg">
                        {submission.total_score}/100
                      </div>
                    </div>
                  )}
                  {submission.file_url && (
                    <a
                      href={submission.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="View File"
                    >
                      <Download className="w-5 h-5 text-gray-500" />
                    </a>
                  )}
                  {(submission.status === 'submitted' || submission.status === 'graded') && (
                    <button
                      onClick={() => openGrading(submission)}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        submission.status === 'submitted'
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {submission.status === 'submitted' ? 'Grade' : 'Review'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Grading Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] flex flex-col">
            {/* Header - fixed */}
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h2 className="text-base font-bold">Grade Submission</h2>
              <div className="flex items-center gap-2">
                {selectedSubmission.file_url && (
                  <a
                    href={selectedSubmission.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Open PDF
                  </a>
                )}
                <button
                  onClick={() => { setSelectedSubmission(null); setCriteriaScores({}); setFeedback(''); }}
                  className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Content - scrollable */}
            <div className="overflow-y-auto p-4 space-y-4">
              {/* Team Info */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium text-sm">
                      {blindMode ? 'Team #XXXX (Blind Mode)' : selectedSubmission.team?.name}
                    </p>
                    {!blindMode && selectedSubmission.team?.institution && (
                      <p className="text-xs text-gray-500">{selectedSubmission.team.institution}</p>
                    )}
                  </div>
                </div>
                {/* Detailed Team Info */}
                {!blindMode && selectedSubmission.team && (
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-200">
                    {selectedSubmission.team.leader_name && (
                      <div className="p-1.5 bg-white rounded">
                        <p className="text-[10px] text-gray-400">Leader</p>
                        <p className="font-medium text-xs">{selectedSubmission.team.leader_name}</p>
                      </div>
                    )}
                    {selectedSubmission.team.leader_email && (
                      <div className="p-1.5 bg-white rounded">
                        <p className="text-[10px] text-gray-400">Email</p>
                        <p className="font-medium text-xs text-gray-700 truncate">{selectedSubmission.team.leader_email}</p>
                      </div>
                    )}
                    {selectedSubmission.team.member_count !== undefined && (
                      <div className="p-1.5 bg-white rounded">
                        <p className="text-[10px] text-gray-400">Members</p>
                        <p className="font-medium text-xs">{selectedSubmission.team.member_count} orang</p>
                      </div>
                    )}
                    {selectedSubmission.submitted_at && (
                      <div className="p-1.5 bg-white rounded">
                        <p className="text-[10px] text-gray-400">Submitted</p>
                        <p className="font-medium text-xs">
                          {new Date(selectedSubmission.submitted_at).toLocaleString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {/* Payment Proof */}
                {!blindMode && selectedSubmission.team?.payment_proof && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <a
                      href={selectedSubmission.team.payment_proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100 text-xs"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Bukti Pembayaran
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Rubric Grading */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">Rubric Criteria</h3>
                <div className="space-y-2">
                  {DEFAULT_RUBRIC.map((criteria) => (
                    <div key={criteria.id} className="p-2.5 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <p className="font-medium text-xs">{criteria.name}</p>
                          <p className="text-[10px] text-gray-400">{criteria.nameId}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-500 bg-gray-50 px-1 py-0.5 rounded">{(criteria.weight * 100)}%</span>
                          <span className="text-[10px] text-gray-400">/ {criteria.maxScore}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={criteria.maxScore}
                          value={criteriaScores[criteria.id] || 0}
                          onChange={(e) => setCriteriaScores({ ...criteriaScores, [criteria.id]: Number(e.target.value) })}
                          className="w-full accent-amber-500 h-1"
                        />
                        <input
                          type="number"
                          min={0}
                          max={criteria.maxScore}
                          value={criteriaScores[criteria.id] || 0}
                          onChange={(e) => setCriteriaScores({ ...criteriaScores, [criteria.id]: Math.min(criteria.maxScore, Math.max(0, Number(e.target.value))) })}
                          className="w-12 px-1 py-0.5 border rounded text-center text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Score */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-800 text-sm">Total Score</span>
                  <span className="text-lg font-bold text-amber-700">{calculateTotalScore()}/100</span>
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="text-xs font-medium text-gray-700">Feedback for Team</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded-lg mt-1 text-sm"
                  rows={3}
                  placeholder="Provide constructive feedback..."
                />
              </div>
            </div>

            {/* Actions - fixed at bottom */}
            <div className="flex gap-2 p-4 border-t flex-shrink-0">
              {selectedSubmission.status === 'submitted' && (
                <>
                  <button
                    onClick={handleGrade}
                    disabled={gradingId === selectedSubmission.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 text-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {gradingId === selectedSubmission.id ? 'Saving...' : 'Submit Grade'}
                  </button>
                  <button
                    onClick={handleNeedsRevision}
                    disabled={gradingId === selectedSubmission.id || !feedback}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 text-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Revision
                  </button>
                </>
              )}
              <button
                onClick={() => { setSelectedSubmission(null); setCriteriaScores({}); setFeedback(''); }}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGrading;