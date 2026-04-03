/**
 * Admin Grading & Evaluation
 * Criteria-based rubric grading for submissions
 * Based on PRD-CIBC-Competition-Platform.md Section 4.6
 */

import { useState, useEffect } from 'react';
import { Download, Loader2, CheckCircle, Clock, FileText, Users, Award, Eye, Send } from 'lucide-react';
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

interface GradingSubmission extends Submission {
  team?: Team;
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

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const comp = await competitionService.getActive();
      if (comp) {
        const data = await submissionsService.getAll(comp.id);
        setSubmissions(data);
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
                    {!blindMode && submission.team?.institution && (
                      <p className="text-sm text-gray-500">{submission.team.institution}</p>
                    )}
                    {submission.file_name && (
                      <p className="text-sm text-gray-500 mt-1">{submission.file_name}</p>
                    )}
                    {submission.submitted_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted: {new Date(submission.submitted_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {submission.total_score !== undefined && submission.total_score !== null && (
                    <div className="flex items-center gap-2">
                      <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-bold text-lg">
                        {submission.total_score}/100
                      </div>
                      {submission.criteria_scores && (
                        <button
                          onClick={() => openGrading(submission)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          View Details
                        </button>
                      )}
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
                  {submission.status === 'submitted' && (
                    <button
                      onClick={() => openGrading(submission)}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
                    >
                      Grade
                    </button>
                  )}
                  {submission.status === 'graded' && (
                    <button
                      onClick={() => openGrading(submission)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                    >
                      Review
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Grade Submission</h2>
              {selectedSubmission.file_url && (
                <a
                  href={selectedSubmission.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                >
                  <Download className="w-4 h-4" />
                  Open PDF
                </a>
              )}
            </div>

            {/* Team Info */}
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium">
                    {blindMode ? 'Team #XXXX (Blind Mode)' : selectedSubmission.team?.name}
                  </p>
                  {!blindMode && selectedSubmission.team?.institution && (
                    <p className="text-sm text-gray-500">{selectedSubmission.team.institution}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Rubric Grading */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-800">Rubric Criteria</h3>
              {DEFAULT_RUBRIC.map((criteria) => (
                <div key={criteria.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{criteria.name}</p>
                      <p className="text-xs text-gray-500">{criteria.nameId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Weight: {(criteria.weight * 100)}%</span>
                      <div className="px-2 py-1 bg-gray-100 rounded text-sm">
                        Max: {criteria.maxScore}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={criteria.maxScore}
                      value={criteriaScores[criteria.id] || 0}
                      onChange={(e) => setCriteriaScores({ ...criteriaScores, [criteria.id]: Number(e.target.value) })}
                      className="w-full accent-amber-500"
                    />
                    <input
                      type="number"
                      min={0}
                      max={criteria.maxScore}
                      value={criteriaScores[criteria.id] || 0}
                      onChange={(e) => setCriteriaScores({ ...criteriaScores, [criteria.id]: Math.min(criteria.maxScore, Math.max(0, Number(e.target.value))) })}
                      className="w-16 px-2 py-1 border rounded text-center"
                    />
                    <span className="text-sm text-gray-500">/ {criteria.maxScore}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Score */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-800">Total Score</span>
                <span className="text-2xl font-bold text-amber-700">{calculateTotalScore()}/100</span>
              </div>
            </div>

            {/* Feedback */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700">Feedback for Team</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mt-1"
                rows={4}
                placeholder="Provide constructive feedback..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              {selectedSubmission.status === 'submitted' && (
                <>
                  <button
                    onClick={handleGrade}
                    disabled={gradingId === selectedSubmission.id}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {gradingId === selectedSubmission.id ? 'Saving...' : 'Submit Grade'}
                  </button>
                  <button
                    onClick={handleNeedsRevision}
                    disabled={gradingId === selectedSubmission.id || !feedback}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    Request Revision
                  </button>
                </>
              )}
              <button
                onClick={() => { setSelectedSubmission(null); setCriteriaScores({}); setFeedback(''); }}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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