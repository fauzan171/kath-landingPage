/**
 * Admin Submissions & Grading
 */

import { useState, useEffect } from 'react';
import { Download, Star, Loader2, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { submissionsService, competitionService, type Submission, type Team } from '@/services/cibc.service';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState<(Submission & { team?: Team })[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<typeof submissions[0] | null>(null);
  const [gradeForm, setGradeForm] = useState({ score: 0, feedback: '' });
  const [filter, setFilter] = useState<'all' | 'submitted' | 'graded' | 'draft'>('all');

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async () => {
    if (!selectedSubmission) return;
    setGradingId(selectedSubmission.id);
    try {
      // Get admin ID from Supabase auth
      const { supabase: sb } = await import('@/lib/supabase');
      if (!sb) throw new Error('Supabase not configured');
      const { data: { user } } = await sb.auth.getUser();
      await submissionsService.grade(selectedSubmission.id, gradeForm.score, undefined, gradeForm.feedback);
      // Update graded_by separately since grade() doesn't accept it
      if (user?.id) {
        await sb.from('submissions').update({ graded_by: user.id }).eq('id', selectedSubmission.id);
      }
      toast.success('Submission graded!');
      load();
      setSelectedSubmission(null);
      setGradeForm({ score: 0, feedback: '' });
    } catch (_e) {
      toast.error('Failed to grade');
    } finally {
      setGradingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Graded</span>;
      case 'submitted':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Submitted</span>;
      case 'late':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Late</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">Draft</span>;
    }
  };

  const filteredSubmissions = submissions.filter(s => filter === 'all' || s.status === filter);

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Submissions</h1>
          <p className="text-sm text-gray-500">Review and grade team submissions</p>
        </div>
        <div className="flex gap-2">
          {submissions.filter(s => s.status === 'submitted').length > 0 && (
            <div className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
              {submissions.filter(s => s.status === 'submitted').length} Pending
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-4">
        {(['all', 'submitted', 'graded', 'draft'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs capitalize ${filter === f ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="space-y-2">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">No submissions found</p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-lg border border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    submission.status === 'graded' ? 'bg-green-100 text-green-600' :
                    submission.status === 'submitted' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {submission.status === 'graded' ? <CheckCircle className="w-4 h-4" /> :
                     submission.status === 'submitted' ? <Clock className="w-4 h-4" /> :
                     <Star className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-800 truncate">
                        {submission.team?.name || 'Unknown Team'}
                      </span>
                      {getStatusBadge(submission.status)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      {submission.file_name && (
                        <span className="truncate">{submission.file_name}</span>
                      )}
                      {submission.submitted_at && (
                        <span className="flex-shrink-0">
                          {new Date(submission.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {submission.total_score !== undefined && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold">
                      {submission.total_score}/100
                    </span>
                  )}
                  {submission.file_url && (
                    <a
                      href={submission.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-gray-100 rounded-md"
                    >
                      <Download className="w-4 h-4 text-gray-400" />
                    </a>
                  )}
                  {submission.status === 'submitted' && (
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setGradeForm({ score: submission.total_score || 0, feedback: submission.feedback || '' });
                      }}
                      className="px-3 py-1.5 bg-amber-500 text-white rounded-md text-xs font-medium"
                    >
                      Grade
                    </button>
                  )}
                  {submission.status === 'graded' && (
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setGradeForm({ score: submission.total_score || 0, feedback: submission.feedback || '' });
                      }}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs"
                    >
                      View
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5">
            <h2 className="text-lg font-bold mb-3">Grade Submission</h2>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Team</p>
                <p className="font-medium text-sm">{selectedSubmission.team?.name}</p>
              </div>

              {selectedSubmission.file_url && (
                <a
                  href={selectedSubmission.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Submission
                </a>
              )}

              <div>
                <label className="text-xs text-gray-600">Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeForm.score}
                  onChange={(e) => setGradeForm({ ...gradeForm, score: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border rounded-lg mt-1 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Feedback</label>
                <textarea
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-lg mt-1 text-sm"
                  rows={3}
                  placeholder="Provide feedback for the team..."
                />
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button
                  onClick={handleGrade}
                  disabled={gradingId === selectedSubmission.id}
                  className="flex-1 py-2 bg-amber-500 text-white rounded-lg text-sm disabled:opacity-50"
                >
                  {gradingId === selectedSubmission.id ? 'Saving...' : 'Save Grade'}
                </button>
                <button
                  onClick={() => { setSelectedSubmission(null); setGradeForm({ score: 0, feedback: '' }); }}
                  className="flex-1 py-2 bg-gray-100 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;