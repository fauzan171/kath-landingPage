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
      const adminId = 'admin'; // TODO: Get from auth
      await submissionsService.grade(selectedSubmission.id, gradeForm.score, gradeForm.feedback, adminId);
      toast.success('Submission graded!');
      load();
      setSelectedSubmission(null);
      setGradeForm({ score: 0, feedback: '' });
    } catch (e) {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Submissions</h1>
          <p className="text-gray-600">Review and grade team submissions</p>
        </div>
        <div className="flex gap-2">
          {submissions.filter(s => s.status === 'submitted').length > 0 && (
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
              {submissions.filter(s => s.status === 'submitted').length} Pending Review
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'submitted', 'graded', 'draft'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm capitalize ${filter === f ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
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
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {submission.status === 'graded' ? <CheckCircle className="w-6 h-6" /> :
                     submission.status === 'submitted' ? <Clock className="w-6 h-6" /> :
                     <Star className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">
                        {submission.team?.name || 'Unknown Team'}
                      </h3>
                      {getStatusBadge(submission.status)}
                    </div>
                    {submission.file_name && (
                      <p className="text-sm text-gray-500">{submission.file_name}</p>
                    )}
                    {submission.submitted_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted: {new Date(submission.submitted_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {submission.total_score !== undefined && (
                    <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg font-bold">
                      {submission.total_score}/100
                    </div>
                  )}
                  {submission.file_url && (
                    <a
                      href={submission.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Download className="w-5 h-5 text-gray-500" />
                    </a>
                  )}
                  {submission.status === 'submitted' && (
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setGradeForm({ score: submission.total_score || 0, feedback: submission.feedback || '' });
                      }}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm"
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
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
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
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4">Grade Submission</h2>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Team</p>
                <p className="font-medium">{selectedSubmission.team?.name}</p>
              </div>

              {selectedSubmission.file_url && (
                <a
                  href={selectedSubmission.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg"
                >
                  <Download className="w-5 h-5" />
                  Download Submission
                </a>
              )}

              <div>
                <label className="text-sm text-gray-600">Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeForm.score}
                  onChange={(e) => setGradeForm({ ...gradeForm, score: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Feedback</label>
                <textarea
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                  rows={4}
                  placeholder="Provide feedback for the team..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleGrade}
                  disabled={gradingId === selectedSubmission.id}
                  className="flex-1 py-2 bg-amber-500 text-white rounded-lg disabled:opacity-50"
                >
                  {gradingId === selectedSubmission.id ? 'Saving...' : 'Save Grade'}
                </button>
                <button
                  onClick={() => { setSelectedSubmission(null); setGradeForm({ score: 0, feedback: '' }); }}
                  className="flex-1 py-2 bg-gray-100 rounded-lg"
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