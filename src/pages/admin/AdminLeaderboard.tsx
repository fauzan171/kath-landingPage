/**
 * Admin Leaderboard
 * View team rankings and scores
 * Based on PRD-CIBC-Competition-Platform.md Section 4.6 ADM-03
 */

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Loader2, Download, ArrowUpDown, Users, FileText, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { competitionService, teamsService, submissionsService, type Team, type Submission } from '@/services/cibc.service';

interface LeaderboardEntry {
  team: Team;
  submissions: Submission[];
  total_score: number;
  graded_count: number;
  pending_count: number;
}

const AdminLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'all' | 'student' | 'startup' | 'corporate'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'institution'>('score');
  const [showPublicPreview, setShowPublicPreview] = useState(false);

  useEffect(() => { load(); }, [category]);

  const load = async () => {
    try {
      const comp = await competitionService.getActive();
      if (!comp) return;

      const teams = await teamsService.getAll(comp.id);
      const submissions = await submissionsService.getAll(comp.id);

      // Calculate leaderboard
      const entries: LeaderboardEntry[] = teams.map(team => {
        const teamSubmissions = submissions.filter(s => s.team_id === team.id);
        const gradedSubmissions = teamSubmissions.filter(s => s.status === 'graded');
        const pendingSubmissions = teamSubmissions.filter(s => s.status === 'submitted');

        const totalScore = gradedSubmissions.reduce((sum, s) => sum + (s.total_score || 0), 0);

        return {
          team,
          submissions: teamSubmissions,
          total_score: totalScore,
          graded_count: gradedSubmissions.length,
          pending_count: pendingSubmissions.length,
        };
      });

      // Filter by category
      const filtered = category === 'all'
        ? entries
        : entries.filter(e => e.team.category === category);

      // Sort
      const sorted = filtered.sort((a, b) => {
        if (sortBy === 'score') return b.total_score - a.total_score;
        if (sortBy === 'name') return a.team.name.localeCompare(b.team.name);
        if (sortBy === 'institution') return (a.team.institution || '').localeCompare(b.team.institution || '');
        return 0;
      });

      setLeaderboard(sorted);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Rank', 'Team Name', 'Institution', 'Category', 'Total Score', 'Graded Submissions', 'Pending Submissions'];
    const rows = leaderboard.map((entry, idx) => [
      idx + 1,
      entry.team.name,
      entry.team.institution || '',
      entry.team.category || '',
      entry.total_score,
      entry.graded_count,
      entry.pending_count,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leaderboard-${category}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Leaderboard exported!');
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200';
    return 'bg-white border-gray-200';
  };

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
          <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
          <p className="text-gray-600">Team rankings based on graded submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowPublicPreview(!showPublicPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            <Users className="w-4 h-4" />
            {showPublicPreview ? 'Admin View' : 'Public Preview'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Category:</span>
          {(['all', 'student', 'startup', 'corporate'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-lg text-sm capitalize ${
                category === cat ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Sort:</span>
          {(['score', 'name', 'institution'] as const).map(sort => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-3 py-1 rounded-lg text-sm capitalize ${
                sortBy === sort ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {sort}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Teams</p>
          <p className="text-2xl font-bold">{leaderboard.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Fully Graded</p>
          <p className="text-2xl font-bold text-green-600">
            {leaderboard.filter(e => e.pending_count === 0 && e.graded_count > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Average Score</p>
          <p className="text-2xl font-bold text-amber-600">
            {leaderboard.length > 0
              ? Math.round(leaderboard.reduce((a, b) => a + b.total_score, 0) / leaderboard.filter(e => e.total_score > 0).length || 1)
              : 0}
          </p>
        </div>
      </div>

      {/* Leaderboard Table */}
      {leaderboard.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-500">No teams found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={entry.team.id}
                className={`rounded-xl border p-4 ${getRankStyle(rank)} transition-all hover:shadow-md`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-12 text-center">
                    {getRankIcon(rank) || (
                      <span className="text-lg font-bold text-gray-600">{rank}</span>
                    )}
                  </div>

                  {/* Team Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{entry.team.name}</h3>
                      {entry.team.category && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs capitalize">
                          {entry.team.category}
                        </span>
                      )}
                    </div>
                    {entry.team.institution && (
                      <p className="text-sm text-gray-500">{entry.team.institution}</p>
                    )}
                  </div>

                  {/* Submission Stats */}
                  {!showPublicPreview && (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{entry.graded_count} graded</span>
                      </div>
                      {entry.pending_count > 0 && (
                        <div className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                          {entry.pending_count} pending
                        </div>
                      )}
                    </div>
                  )}

                  {/* Score */}
                  <div className={`w-24 text-center ${
                    rank <= 3 ? 'text-amber-700' : 'text-gray-700'
                  }`}>
                    <p className="text-2xl font-bold">{entry.total_score}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>

                {/* Score Breakdown (Admin only) */}
                {!showPublicPreview && entry.submissions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex gap-2 flex-wrap">
                      {entry.submissions.filter(s => s.status === 'graded').map(s => (
                        <div key={s.id} className="px-3 py-1 bg-gray-100 rounded text-sm">
                          <span className="text-gray-500">{s.task_id.slice(0, 8)}:</span>
                          <span className="font-medium ml-1">{s.total_score || 0}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Public Preview Toggle */}
      {showPublicPreview && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            This is how the leaderboard will appear to participants. Scores breakdown is hidden.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminLeaderboard;