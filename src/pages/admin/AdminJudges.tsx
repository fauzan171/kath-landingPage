/**
 * Admin Judge Assignment Page
 *
 * Assign judges to submissions and manage workload
 */

import { useState, useEffect } from 'react';
import {
  Search, Users, Loader2, UserPlus, CheckCircle, Clock,
  X, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// ============================================
// Types
// ============================================

interface Judge {
  id: string;
  name: string;
  email: string;
  assignments_count: number;
  pending_count: number;
  completed_count: number;
}

interface Submission {
  id: string;
  team_id: string;
  team_name: string;
  institution?: string;
  task_name: string;
  submitted_at: string;
  status: string;
  assigned_judges: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

// ============================================
// Component
// ============================================

const AdminJudges = () => {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unassigned' | 'assigned'>('all');

  // Modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedJudges, setSelectedJudges] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      if (!supabase) return;

      // Load judges from users table (role = 'judge')
      const { data: judgeUsers, error: judgeError } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('role', 'judge');

      if (judgeError) {
        console.error('Error loading judges:', judgeError.message);
      }

      // Load assignment counts for each judge
      const judgesWithCounts = await Promise.all(
        (judgeUsers || []).map(async (u) => {
          const { count: total } = await supabase!
            .from('judge_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('judge_id', u.id);

          const { count: pending } = await supabase!
            .from('judge_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('judge_id', u.id)
            .eq('status', 'pending');

          const { count: completed } = await supabase!
            .from('judge_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('judge_id', u.id)
            .eq('status', 'completed');

          return {
            id: u.id,
            name: u.name || 'Unknown',
            email: u.email || '',
            assignments_count: total || 0,
            pending_count: pending || 0,
            completed_count: completed || 0,
          };
        })
      );

      setJudges(judgesWithCounts);

      // Load submissions with assigned judges
      const { data: submissionsData } = await supabase
        .from('submissions')
        .select('id, team_id, submitted_at, status, tasks(id, name), teams(id, name, institution)')
        .order('submitted_at', { ascending: false });

      // Load assigned judges for each submission
      const submissionsWithJudges = await Promise.all(
        (submissionsData || []).map(async (sub) => {
          const taskData = Array.isArray(sub.tasks) ? sub.tasks[0] : sub.tasks;
          const teamData = Array.isArray(sub.teams) ? sub.teams[0] : sub.teams;

          const { data: assignments } = await supabase!
            .from('judge_assignments')
            .select('status, users(id, name)')
            .eq('submission_id', sub.id);

          return {
            id: sub.id,
            team_id: sub.team_id,
            team_name: teamData?.name || 'Unknown Team',
            institution: teamData?.institution,
            task_name: taskData?.name || 'Unknown Task',
            submitted_at: sub.submitted_at,
            status: sub.status,
            assigned_judges: (assignments || []).map((a) => {
              const judgeData = Array.isArray(a.users) ? a.users[0] : a.users;
              return {
                id: judgeData?.id || '',
                name: judgeData?.name || 'Unknown',
                status: a.status,
              };
            }),
          };
        })
      );

      setSubmissions(submissionsWithJudges);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setSelectedJudges([]);
    setShowAssignModal(true);
  };

  const handleAssignJudges = async () => {
    if (!selectedSubmission || selectedJudges.length === 0 || !supabase) return;

    setAssigning(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create assignments
      const assignments = selectedJudges.map(judgeId => ({
        judge_id: judgeId,
        submission_id: selectedSubmission.id,
        assigned_by: user.id,
        status: 'pending',
      }));

      const { error } = await supabase
        .from('judge_assignments')
        .insert(assignments);

      if (error) throw error;

      toast.success(`Assigned ${selectedJudges.length} judge(s) to submission`);
      setShowAssignModal(false);
      loadData();
    } catch (error) {
      console.error('Error assigning judges:', error);
      toast.error('Failed to assign judges');
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveAssignment = async (submissionId: string, judgeId: string) => {
    if (!confirm('Remove this judge from the submission?')) return;
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('judge_assignments')
        .delete()
        .eq('submission_id', submissionId)
        .eq('judge_id', judgeId);

      if (error) throw error;

      toast.success('Judge removed');
      loadData();
    } catch (error) {
      console.error('Error removing judge:', error);
      toast.error('Failed to remove judge');
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      if (!sub.team_name.toLowerCase().includes(searchLower) &&
          !sub.task_name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Status filter
    if (filter === 'unassigned' && sub.assigned_judges.length > 0) return false;
    if (filter === 'assigned' && sub.assigned_judges.length === 0) return false;

    return true;
  });

  const stats = {
    totalJudges: judges.length,
    totalSubmissions: submissions.length,
    unassigned: submissions.filter(s => s.assigned_judges.length === 0).length,
    assigned: submissions.filter(s => s.assigned_judges.length > 0).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Judge Assignments</h1>
          <p className="text-gray-600">Assign judges to submissions for grading</p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.totalJudges}</p>
          <p className="text-xs text-gray-500">Total Judges</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-gray-800">{stats.totalSubmissions}</p>
          <p className="text-xs text-gray-500">Total Submissions</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-center bg-amber-50">
          <p className="text-3xl font-bold text-amber-600">{stats.unassigned}</p>
          <p className="text-xs text-amber-600">Unassigned</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4 text-center bg-green-50">
          <p className="text-3xl font-bold text-green-600">{stats.assigned}</p>
          <p className="text-xs text-green-600">Assigned</p>
        </div>
      </div>

      {/* Judges Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Judge Workload</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {judges.map((judge) => (
            <div key={judge.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-700 font-medium">{judge.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{judge.name}</p>
                  <p className="text-xs text-gray-500">{judge.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-800">{judge.assignments_count}</p>
                  <p className="text-[10px] text-gray-500">Total</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-600">{judge.pending_count}</p>
                  <p className="text-[10px] text-amber-600">Pending</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">{judge.completed_count}</p>
                  <p className="text-[10px] text-green-600">Done</p>
                </div>
              </div>
            </div>
          ))}
          {judges.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No judges found. Add judges in User Management.
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {(['all', 'unassigned', 'assigned'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search submissions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Submission</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Task</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Institution</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Submitted</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">Assigned Judges</th>
                <th className="text-right p-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No submissions found</p>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-gray-800">{submission.team_name}</p>
                      <p className="text-xs text-gray-500 font-mono">{submission.id.slice(0, 8)}</p>
                    </td>
                    <td className="p-4 text-gray-600">{submission.task_name}</td>
                    <td className="p-4 text-gray-600">{submission.institution || '-'}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(submission.submitted_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {submission.assigned_judges.length === 0 ? (
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                            No judges assigned
                          </span>
                        ) : (
                          submission.assigned_judges.map((judge) => (
                            <span
                              key={judge.id}
                              className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                                judge.status === 'completed'
                                  ? 'bg-green-50 text-green-700'
                                  : judge.status === 'in_progress'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {judge.name}
                              {judge.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                              {judge.status === 'in_progress' && <Clock className="w-3 h-3" />}
                              <button
                                onClick={() => handleRemoveAssignment(submission.id, judge.id)}
                                className="ml-1 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openAssignModal(submission)}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium flex items-center gap-2 ml-auto"
                      >
                        <UserPlus className="w-4 h-4" />
                        Assign
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Assign Judges</h3>
              <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Submission: <strong>{selectedSubmission.team_name}</strong> - {selectedSubmission.task_name}
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {judges.map((judge) => (
                <label
                  key={judge.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedJudges.includes(judge.id)
                      ? 'bg-purple-50 border border-purple-200'
                      : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedJudges.includes(judge.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedJudges([...selectedJudges, judge.id]);
                      } else {
                        setSelectedJudges(selectedJudges.filter(id => id !== judge.id));
                      }
                    }}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{judge.name}</p>
                    <p className="text-xs text-gray-500">{judge.assignments_count} assignments</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignJudges}
                disabled={selectedJudges.length === 0 || assigning}
                className="flex-1 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {assigning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Assign {selectedJudges.length} Judge(s)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJudges;