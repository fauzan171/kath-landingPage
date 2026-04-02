/**
 * Judge Grading Page
 *
 * Grade submissions with blind grading (cannot see team name/institution)
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2, CheckCircle, AlertCircle, Star, Save,
  FileText, ExternalLink, ArrowLeft
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

  // Grading state
  const [scores, setScores] = useState<Record<string, number>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadSubmission();
  }, [submissionId]);

  useEffect(() => {
    // Calculate total score
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

      // Get submission (blind - no team info)
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .select('id, file_url, file_name, content, task_id')
        .eq('id', submissionId)
        .single();

      if (submissionError) throw submissionError;

      // Get task details
      const { data: taskData } = await supabase
        .from('tasks')
        .select('id, name, description, max_score, rubric')
        .eq('id', submissionData?.task_id)
        .single();

      const fullSubmission: Submission = {
        id: submissionData?.id || '',
        file_url: submissionData?.file_url || undefined,
        file_name: submissionData?.file_name || undefined,
        content: submissionData?.content || undefined,
        task: {
          id: taskData?.id || '',
          name: taskData?.name || 'Unknown Task',
          description: taskData?.description || undefined,
          max_score: taskData?.max_score || 100,
          rubric: taskData?.rubric || [],
        },
      };

      setSubmission(fullSubmission);

      // Initialize scores from rubric
      if (taskData?.rubric && Array.isArray(taskData.rubric)) {
        const initialScores: Record<string, number> = {};
        taskData.rubric.forEach((_: unknown, index: number) => {
          initialScores[`criterion_${index}`] = 0;
        });
        setScores(initialScores);
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

  const handleSave = async (isFinal: boolean = false) => {
    if (!submission || !assignment || !supabase) return;

    if (isFinal && totalScore === 0) {
      toast.error('Please provide scores before submitting');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update submission with judge's score
      // Note: In a real system, you'd store each judge's score separately
      // For now, we'll store it in criteria_scores with judge_id as key
      const { error: submissionError } = await supabase
        .from('submissions')
        .update({
          criteria_scores: {
            ...scores,
            [`judge_${user.id}`]: totalScore
          },
          feedback: feedback || null,
        })
        .eq('id', submission.id);

      if (submissionError) throw submissionError;

      // If final, mark assignment as completed
      if (isFinal) {
        const { error: assignmentError } = await supabase
          .from('judge_assignments')
          .update({ status: 'completed' })
          .eq('id', assignment.id);

        if (assignmentError) throw assignmentError;
      }

      toast.success(isFinal ? 'Grading submitted!' : 'Progress saved!');
      if (isFinal) {
        navigate('/judge');
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
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

      {/* Blind Grading Notice */}
      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-purple-600" />
          <span className="text-sm text-purple-800 font-medium">Blind Grading Mode</span>
        </div>
        <p className="text-sm text-purple-700 mt-1">
          Anda menilai Submission #{submission.id.slice(0, 8)}. Nama tim dan institusi disembunyikan.
        </p>
      </div>

      {/* Submission Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Submission Content</h3>

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
        ) : submission.content ? (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{submission.content}</p>
          </div>
        ) : (
          <p className="text-gray-500">No content submitted</p>
        )}
      </div>

      {/* Rubric Grading */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Grading Rubric</h3>

        {rubric.length > 0 ? (
          <div className="space-y-6">
            {rubric.map((criterion: { criterion: string; description: string; max_points: number }, index: number) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-800">{criterion.criterion}</p>
                    <p className="text-sm text-gray-500">{criterion.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">Max: {criterion.max_points} pts</span>
                </div>
                <div className="flex items-center gap-4">
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

      {/* Feedback */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Feedback (Optional)</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Provide feedback for the team..."
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