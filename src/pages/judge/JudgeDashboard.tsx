/**
 * Judge Dashboard
 *
 * Overview of assigned submissions and grading progress
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck, Clock, CheckCircle, AlertCircle, ArrowRight,
  Loader2, Award, Target, TrendingUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ============================================
// Types
// ============================================

interface Assignment {
  id: string;
  submission_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
  created_at: string;
  submission: {
    id: string;
    file_name?: string;
    submitted_at: string;
    status: string;
    task: {
      id: string;
      name: string;
      max_score?: number;
    };
    team: {
      id: string;
      name: string; // Hidden in blind grading
      institution?: string; // Hidden in blind grading
    };
  };
}

// ============================================
// Component
// ============================================

const JudgeDashboard = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('judge_assignments')
        .select('id, submission_id, status, notes, created_at')
        .eq('judge_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch submission details separately
      const assignmentsWithDetails = await Promise.all(
        (data || []).map(async (assignment) => {
          const { data: submission } = await supabase!
            .from('submissions')
            .select('id, file_name, submitted_at, status, task_id')
            .eq('id', assignment.submission_id)
            .single();

          const { data: task } = await supabase!
            .from('tasks')
            .select('id, name, max_score')
            .eq('id', submission?.task_id)
            .single();

          return {
            id: assignment.id,
            submission_id: assignment.submission_id,
            status: assignment.status,
            notes: assignment.notes,
            created_at: assignment.created_at,
            submission: {
              id: submission?.id || '',
              file_name: submission?.file_name || '',
              submitted_at: submission?.submitted_at || '',
              status: submission?.status || '',
              task: {
                id: task?.id || '',
                name: task?.name || 'Unknown Task',
                max_score: task?.max_score,
              },
              team: {
                id: '',
                name: 'Hidden (Blind Grading)',
                institution: '',
              },
            },
          };
        })
      );

      setAssignments(assignmentsWithDetails);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    inProgress: assignments.filter(a => a.status === 'in_progress').length,
    completed: assignments.filter(a => a.status === 'completed').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Judge Dashboard</h1>
          <p className="text-gray-600">Review dan grade submissions yang ditugaskan kepada Anda</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-purple-100 flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Assigned</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-center bg-amber-50">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-amber-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          <p className="text-xs text-amber-600">Pending</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4 text-center bg-blue-50">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          <p className="text-xs text-blue-600">In Progress</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4 text-center bg-green-50">
          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-xs text-green-600">Completed</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Grading Progress</h3>
          <span className="text-sm text-gray-500">
            {stats.completed} of {stats.total} completed ({stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%)
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'in_progress', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-purple-500 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12">
            <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No submissions assigned yet</p>
            <p className="text-sm text-gray-400 mt-1">Contact admin for assignment</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <FileCheck className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      {/* Blind grading - hide team name */}
                      <p className="font-medium text-gray-800">
                        Submission #{assignment.submission.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Task: {assignment.submission.task?.name || 'Unknown Task'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Assigned: {new Date(assignment.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(assignment.status)}
                    <Link
                      to={`/judge/grading/${assignment.submission_id}`}
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notice */}
      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-purple-800 font-medium">Blind Grading Mode</p>
            <p className="text-sm text-purple-700 mt-1">
              Anda tidak dapat melihat nama tim atau institusi untuk memastikan penilaian yang objektif.
              Nilai berdasarkan kualitas submission saja.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeDashboard;