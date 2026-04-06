/**
 * Public Leaderboard Page
 * Displays competition results and rankings for participants and visitors
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Award, Loader2, Users, ArrowLeft } from 'lucide-react';
import { competitionService, teamsService, submissionsService, type Team, type Submission } from '@/services/cibc.service';

interface LeaderboardEntry {
  team: Team;
  submissions: Submission[];
  total_score: number;
  graded_count: number;
}

const PublicLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [competitionName, setCompetitionName] = useState('CIBC 2026');
  const [category, setCategory] = useState<'all' | 'student' | 'startup' | 'corporate'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, [category]);

  const load = async () => {
    try {
      setError(null);
      const comp = await competitionService.getActive();
      if (!comp) {
        setError('No active competition found');
        return;
      }
      setCompetitionName(comp.name || 'CIBC 2026');

      const teams = await teamsService.getAll(comp.id);
      const submissions = await submissionsService.getAll(comp.id);

      const entries: LeaderboardEntry[] = teams.map(team => {
        const teamSubmissions = submissions.filter(s => s.team_id === team.id);
        const gradedSubmissions = teamSubmissions.filter(s => s.status === 'graded');
        const totalScore = gradedSubmissions.reduce((sum, s) => sum + (s.total_score || 0), 0);

        return {
          team,
          submissions: teamSubmissions,
          total_score: totalScore,
          graded_count: gradedSubmissions.length,
        };
      });

      const filtered = category === 'all'
        ? entries
        : entries.filter(e => e.team.category === category);

      const sorted = filtered.sort((a, b) => b.total_score - a.total_score);
      setLeaderboard(sorted);
    } catch (e) {
      console.error(e);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Award className="w-8 h-8 text-amber-600" />;
    return null;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 shadow-lg';
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 shadow-md';
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-md';
    return 'bg-white border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link to="/cibc" className="inline-flex items-center gap-2 text-amber-100 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Competition
          </Link>
          <div className="flex items-center gap-4">
            <Trophy className="w-12 h-12 text-yellow-300" />
            <div>
              <h1 className="text-3xl font-bold">Leaderboard</h1>
              <p className="text-amber-100 mt-1">{competitionName} Results</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">{error}</h2>
            <p className="text-gray-400">Leaderboard will be available once the competition is active and grading is complete.</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Results Yet</h2>
            <p className="text-gray-400">Leaderboard will be updated once grading is complete.</p>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-gray-600 font-medium">Category:</span>
              {(['all', 'student', 'startup', 'corporate'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                    category === cat
                      ? 'bg-amber-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 p-6 text-center mt-8">
                  <Medal className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                  <h3 className="font-bold text-gray-800 text-lg truncate">{leaderboard[1].team.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{leaderboard[1].team.institution}</p>
                  <p className="text-3xl font-bold text-gray-600 mt-3">{leaderboard[1].total_score}</p>
                  <p className="text-xs text-gray-400">points</p>
                </div>
                {/* 1st Place */}
                <div className="bg-gradient-to-b from-yellow-50 to-white rounded-2xl border-2 border-yellow-300 p-6 text-center shadow-lg">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                  <h3 className="font-bold text-gray-800 text-xl truncate">{leaderboard[0].team.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{leaderboard[0].team.institution}</p>
                  <p className="text-4xl font-bold text-amber-600 mt-3">{leaderboard[0].total_score}</p>
                  <p className="text-xs text-amber-400">points</p>
                </div>
                {/* 3rd Place */}
                <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl border border-amber-200 p-6 text-center mt-12">
                  <Award className="w-10 h-10 mx-auto mb-3 text-amber-600" />
                  <h3 className="font-bold text-gray-800 text-lg truncate">{leaderboard[2].team.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{leaderboard[2].team.institution}</p>
                  <p className="text-3xl font-bold text-amber-700 mt-3">{leaderboard[2].total_score}</p>
                  <p className="text-xs text-amber-400">points</p>
                </div>
              </div>
            )}

            {/* Full Rankings */}
            <div className="space-y-3">
              {leaderboard.map((entry, idx) => {
                const rank = idx + 1;
                return (
                  <div
                    key={entry.team.id}
                    className={`rounded-xl border p-4 ${getRankBg(rank)} transition-all`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 text-center flex-shrink-0">
                        {getRankIcon(rank) || (
                          <span className="text-lg font-bold text-gray-500">{rank}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{entry.team.name}</h3>
                        {entry.team.institution && (
                          <p className="text-sm text-gray-500 truncate">{entry.team.institution}</p>
                        )}
                      </div>
                      {entry.team.category && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs capitalize flex-shrink-0">
                          {entry.team.category}
                        </span>
                      )}
                      <div className="w-24 text-center flex-shrink-0">
                        <p className={`text-2xl font-bold ${rank <= 3 ? 'text-amber-700' : 'text-gray-700'}`}>
                          {entry.total_score}
                        </p>
                        <p className="text-xs text-gray-400">points</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PublicLeaderboard;
