/**
 * Judge Grading Page
 *
 * Grade submissions with per-criterion scoring.
 * Shows team name, leader name, submission time for context.
 * Scores are stored in judge_scores table separately per judge.
 * Feedback is saved to BOTH judge_scores AND submissions.feedback (visible to participant).
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2, CheckCircle, AlertCircle, Save,
  FileText, ExternalLink, ArrowLeft, MessageSquare,
  Users, Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// ============================================
// Types
// ============================================

interface Submission {
  id: string;
  file_url?: string;
  file_name?: string;
  content?: string;
  field_values?: Record<string, unknown>;
  submitted_at?: string;
  task: {
    id: string;
    name: string;
    description?: string;
    max_score?: number;
    rubric?: Array<{
      criterion: string;
      description: string;
      max_points: number;
    }>;
  };
  team?: {
    id: string;
    name: string;
    institution?: string;
    leader_name?: string;
    leader_email?: string;
  };
}

interface JudgeScore {
  id?: string;
  judge_id: string;
  submission_id: string;
  criterion_key: string;
  score: number;
  max_score: number;
  feedback: string;
}

// ============================================
// Component
// ============================================

const JudgeGrading = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [assignment, setAssignment] = useState<{ id: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Grading state - per criterion
  const [scores, setScores] = useState<Record<string, number>>({});
  const [criterionFeedback, setCriterionFeedback] = useState<Record<string, string>>({});
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [existingScores, setExistingScores] = useState<JudgeScore[]>([]);

  useEffect(() => {
    loadSubmission();
  }, [submissionId]);

  useEffect(() => {
    // Calculate total score from criterion scores
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    setTotalScore(total);
  }, [scores]);

  const loadSubmission = async () => {
    if (!submissionId || !supabase) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/judge/login');
        return;
      }

      // Get assignment and verify access
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('judge_assignments')
        .select('id, status')
        .eq('submission_id', submissionId)
        .eq('judge_id', user.id)
        .single();

      if (assignmentError || !assignmentData) {
        toast.error('You are not assigned to this submission');
        navigate('/judge');
        return;
      }

      setAssignment(assignmentData);

      // Get submission WITH team info (judge can see team details)
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .select(`
          id,
          file_url,
          file_name,
          content,
          submitted_at,
          task_id,
          team_id
        `)
        .eq('id', submissionId)
        .single();

      if (submissionError) throw submissionError;

      // Get task details
      const { data: taskData } = await supabase
        .from('tasks')
        .select('id, name, description, max_score, rubric')
        .eq('id', submissionData?.task_id)
        .single();

      // Get team details (name, leader, institution)
      let teamData: Submission['team'] | null = null;
      if (submissionData?.team_id) {
        const { data: team } = await supabase
          .from('teams')
          .select('id, name, institution')
          .eq('id', submissionData.team_id)
          .single();

        if (team) {
          // Get leader name from team_members
          let leaderName = '';
          let leaderEmail = '';
          const { data: leaderProfile } = await supabase
            .from('team_members')
            .select('user_id, role')
            .eq('team_id', team.id)
            .eq('role', 'leader')
            .single();

          if (leaderProfile) {
            const { data: leaderUser } = await supabase
              .from('users')
              .select('name, email')
              .eq('id', leaderProfile.user_id)
              .single();

            leaderName = leaderUser?.name || '';
            leaderEmail = leaderUser?.email || '';
          }

          // Fallback: get first member as leader if no explicit leader
          if (!leaderName) {
            const { data: members } = await supabase
              .from('team_members')
              .select('user_id, role')
              .eq('team_id', team.id)
              .order('joined_at', { ascending: true })
              .limit(1);

            if (members && members.length > 0) {
              const { data: firstMember } = await supabase
                .from('users')
                .select('name, email')
                .eq('id', members[0].user_id)
                .single();

              leaderName = firstMember?.name || '';
              leaderEmail = firstMember?.email || '';
            }
          }

          teamData = {
            id: team.id,
            name: team.name,
            institution: team.institution,
            leader_name: leaderName,
            leader_email: leaderEmail,
          };
        }
      }

      const fullSubmission: Submission = {
        id: submissionData?.id || '',
        file_url: submissionData?.file_url || undefined,
        file_name: submissionData?.file_name || undefined,
        content: submissionData?.content || undefined,
        field_values: undefined,
        submitted_at: submissionData?.submitted_at || undefined,
        task: {
          id: taskData?.id || '',
          name: taskData?.name || 'Unknown Task',
          description: taskData?.description || undefined,
          max_score: taskData?.max_score || 100,
          rubric: taskData?.rubric || [],
        },
        team: teamData || undefined,
      };

      setSubmission(fullSubmission);

      // Initialize scores from rubric
      if (taskData?.rubric && Array.isArray(taskData.rubric)) {
        const initialScores: Record<string, number> = {};
        const initialFeedback: Record<string, string> = {};
        taskData.rubric.forEach((_: unknown, index: number) => {
          initialScores[`criterion_${index}`] = 0;
          initialFeedback[`criterion_${index}`] = '';
        });
        setScores(initialScores);
        setCriterionFeedback(initialFeedback);
      }

      // Load existing scores from judge_scores table
      const { data: existingScoreData } = await supabase
        .from('judge_scores')
        .select('id, judge_id, submission_id, criterion_key, score, max_score, feedback')
        .eq('judge_id', user.id)
        .eq('submission_id', submissionId);

      if (existingScoreData && existingScoreData.length > 0) {
        const savedScores: Record<string, number> = {};
        const savedFeedback: Record<string, string> = {};
        const scoreRecords: JudgeScore[] = [];

        existingScoreData.forEach((record: JudgeScore) => {
          savedScores[record.criterion_key] = record.score;
          savedFeedback[record.criterion_key] = record.feedback || '';
          scoreRecords.push(record);
        });

        setScores(savedScores);
        setCriterionFeedback(savedFeedback);
        setExistingScores(scoreRecords);

        // Also load general feedback from assignment notes
        if (assignmentData) {
          const { data: assignDetail } = await supabase
            .from('judge_assignments')
            .select('notes')
            .eq('id', assignmentData.id)
            .single();
          if (assignDetail?.notes) {
            setGeneralFeedback(assignDetail.notes);
          }
        }
      }

      // Update assignment status to in_progress
      if (assignmentData.status === 'pending') {
        await supabase
          .from('judge_assignments')
          .update({ status: 'in_progress' })
          .eq('id', assignmentData.id);
      }
    } catch (error) {
      console.error('Error loading submission:', error);
      toast.error('Failed to load submission');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (criterionKey: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [criterionKey]: value
    }));
  };

  const handleCriterionFeedbackChange = (criterionKey: string, value: string) => {
    setCriterionFeedback(prev => ({
      ...prev,
      [criterionKey]: value
    }));
  };

  const handleSave = async (isFinal: boolean = false) => {
    if (!submission || !assignment || !supabase) return;

    if (isFinal && totalScore === 0) {
      toast.error('Please provide scores before submitting');
      return;
    }

    // Validate: feedback is mandatory for final submission
    if (isFinal) {
      const hasAnyFeedback = Object.values(criterionFeedback).some(f => f.trim().length > 0) || generalFeedback.trim().length > 0;
      if (!hasAnyFeedback) {
        toast.error('Please provide feedback for at least one criterion before submitting');
        return;
      }
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Save/update each criterion score in judge_scores table
      const rubric = submission.task?.rubric || [];
      const scorePromises = rubric.map(async (criterion: { criterion: string; max_points: number }, index: number) => {
        const key = `criterion_${index}`;
        const score = scores[key] || 0;
        const feedback = criterionFeedback[key] || '';

        // Check if score already exists
        const existing = existingScores.find(s => s.criterion_key === key);

        if (existing?.id) {
          // Update existing score
          return supabase!
            .from('judge_scores')
            .update({
              score,
              max_score: criterion.max_points,
              feedback,
            })
            .eq('id', existing.id);
        } else {
          // Insert new score
          return supabase!
            .from('judge_scores')
            .insert({
              judge_id: user.id,
              submission_id: submission.id,
              criterion_key: key,
              score,
              max_score: criterion.max_points,
              feedback,
            });
        }
      });

      await Promise.all(scorePromises);

      // Save general feedback in assignment notes AND submissions.feedback
      await supabase
        .from('judge_assignments')
        .update({ notes: generalFeedback || null })
        .eq('id', assignment.id);

      // Save feedback to submissions table so participant can see it
      if (generalFeedback.trim()) {
        await supabase
          .from('submissions')
          .update({ feedback: generalFeedback })
          .eq('id', submission.id);
      }

      // If final, mark assignment as completed and update submission aggregate score
      if (isFinal) {
        const { error: assignmentError } = await supabase
          .from('judge_assignments')
          .update({ status: 'completed' })
          .eq('id', assignment.id);

        if (assignmentError) throw assignmentError;

        // Calculate aggregate score from all judges
        await calculateAggregateScore(submission.id);
      }

      toast.success(isFinal ? 'Grading submitted!' : 'Progress saved!');
      if (isFinal) {
        navigate('/judge');
      } else {
        // Reload to get updated scores
        loadSubmission();
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Calculate aggregate score from all judges for a submission.
   * This averages all judge scores and updates the submission's total_score.
   */
  const calculateAggregateScore = async (subId: string) => {
    if (!supabase) return;

    // Get all completed judge_assignments for this submission
    const { data: completedAssignments } = await supabase
      .from('judge_assignments')
      .select('judge_id')
      .eq('submission_id', subId)
      .eq('status', 'completed');

    if (!completedAssignments || completedAssignments.length === 0) return;

    // Get all scores from all judges
    const judgeIds = completedAssignments.map((a: { judge_id: string }) => a.judge_id);
    const { data: allScores } = await supabase
      .from('judge_scores')
      .select('judge_id, score')
      .eq('submission_id', subId)
      .in('judge_id', judgeIds);

    if (!allScores || allScores.length === 0) return;

    // Calculate average per judge, then average across judges
    const judgeTotals: Record<string, number> = {};
    const judgeCounts: Record<string, number> = {};

    (allScores as Array<{ judge_id: string; score: number }>).forEach((s) => {
      judgeTotals[s.judge_id] = (judgeTotals[s.judge_id] || 0) + s.score;
      judgeCounts[s.judge_id] = (judgeCounts[s.judge_id] || 0) + 1;
    });

    const judgeAverages = Object.keys(judgeTotals).map(judgeId =>
      judgeTotals[judgeId] / judgeCounts[judgeId]
    );

    const aggregateScore = Math.round(
      judgeAverages.reduce((sum, avg) => sum + avg, 0) / judgeAverages.length
    );

    // Update submission with aggregate score
    await supabase
      .from('submissions')
      .update({
        total_score: aggregateScore,
        status: 'graded',
      })
      .eq('id', subId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-500">Submission not found</p>
      </div>
    );
  }

  const rubric = submission.task?.rubric || [];
  const maxScore = submission.task?.max_score || 100;

  // Check if BMC structured data exists
  const bmcFields = submission.field_values as Record<string, string> | undefined;
  const isStructuredBMC = bmcFields && bmcFields.mode === 'structured';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/judge')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Grade Submission</h1>
          <p className="text-gray-600">Task: {submission.task?.name}</p>
        </div>
      </div>

      {/* ============================================ */}
      {/* Team Info Card */}
      {/* ============================================ */}
      {submission.team && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Team Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Team Name */}
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-600 font-medium uppercase tracking-wider mb-1">Team Name</p>
              <p className="font-semibold text-gray-800">{submission.team.name}</p>
            </div>
            {/* Leader */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wider mb-1">Team Leader</p>
              <p className="font-semibold text-gray-800">{submission.team.leader_name || 'N/A'}</p>
              {submission.team.leader_email && (
                <p className="text-xs text-gray-500 mt-0.5">{submission.team.leader_email}</p>
              )}
            </div>
            {/* Institution */}
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-600 font-medium uppercase tracking-wider mb-1">Institution</p>
              <p className="font-semibold text-gray-800">{submission.team.institution || 'N/A'}</p>
            </div>
          </div>
          {/* Submission Time */}
          {submission.submitted_at && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>
                Submitted: {new Date(submission.submitted_at).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Submission Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Submission Content</h3>

        {/* BMC Structured Content */}
        {isStructuredBMC && (
          <div className="space-y-3 mb-6">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Business Model Canvas</p>
            {Object.entries(bmcFields)
              .filter(([key]) => key !== 'mode' && key !== 'files' && key !== 'file_count')
              .map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{value || '(empty)'}</p>
                </div>
              ))}
          </div>
        )}

        {submission.file_url ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <FileText className="w-8 h-8 text-gray-400" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{submission.file_name || 'Document'}</p>
                <p className="text-sm text-gray-500">Uploaded file</p>
              </div>
              <a
                href={submission.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </a>
            </div>
          </div>
        ) : !isStructuredBMC && submission.content ? (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{submission.content}</p>
          </div>
        ) : !isStructuredBMC ? (
          <p className="text-gray-500">No content submitted</p>
        ) : null}
      </div>

      {/* Rubric Grading */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Grading Rubric</h3>

        {rubric.length > 0 ? (
          <div className="space-y-6">
            {rubric.map((criterion: { criterion: string; description: string; max_points: number }, index: number) => (
              <div key={index} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-800">{criterion.criterion}</p>
                    <p className="text-sm text-gray-500">{criterion.description}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">Max: {criterion.max_points} pts</span>
                </div>

                {/* Score Slider */}
                <div className="flex items-center gap-4 mb-3">
                  <input
                    type="range"
                    min="0"
                    max={criterion.max_points}
                    value={scores[`criterion_${index}`] || 0}
                    onChange={(e) => handleScoreChange(`criterion_${index}`, parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <input
                    type="number"
                    min="0"
                    max={criterion.max_points}
                    value={scores[`criterion_${index}`] || 0}
                    onChange={(e) => handleScoreChange(`criterion_${index}`, Math.min(criterion.max_points, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center font-medium"
                  />
                </div>

                {/* Per-criterion Feedback */}
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-2 flex-shrink-0" />
                  <textarea
                    value={criterionFeedback[`criterion_${index}`] || ''}
                    onChange={(e) => handleCriterionFeedbackChange(`criterion_${index}`, e.target.value)}
                    placeholder="Feedback for this criterion (required for final submission)..."
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Simple scoring if no rubric
          <div className="space-y-4">
            <p className="text-gray-600">Enter total score (0 - {maxScore}):</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max={maxScore}
                value={totalScore}
                onChange={(e) => setTotalScore(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <input
                type="number"
                min="0"
                max={maxScore}
                value={totalScore}
                onChange={(e) => setTotalScore(Math.min(maxScore, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-center font-medium"
              />
            </div>
          </div>
        )}

        {/* Total Score */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-800">Total Score</span>
            <span className="text-3xl font-bold text-purple-600">{totalScore} <span className="text-lg text-gray-400">/ {maxScore}</span></span>
          </div>
        </div>
      </div>

      {/* General Feedback */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-2">
          General Feedback
          <span className="text-red-500 text-sm ml-1">*</span>
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Feedback ini akan terlihat oleh peserta. Wajib diisi sebelum submit final.
        </p>
        <textarea
          value={generalFeedback}
          onChange={(e) => setGeneralFeedback(e.target.value)}
          placeholder="Provide overall feedback for the team..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Progress
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="flex-1 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Submit Grade
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default JudgeGrading;
