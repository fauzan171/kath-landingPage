/**
 * Admin Users & Teams Management
 */

import { useState, useEffect, memo } from 'react';
import { Search, Users, Building2, Loader2, MoreVertical, CheckCircle, Ban, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { teamsService, competitionService, type Team } from '@/services/cibc.service';
import TeamDetailModal from './TeamDetailModal';

// Memoized table row component for better performance
interface TeamRowProps {
  team: Team;
  onDisqualify: (id: string) => void;
  onReinstate: (id: string) => void;
  onViewDetail: (team: Team) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

const TeamTableRow = memo(function TeamTableRow({ team, onDisqualify, onReinstate, onViewDetail, getStatusBadge }: TeamRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">{team.name}</p>
            <p className="text-xs text-gray-500 font-mono">{team.team_code}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className="capitalize text-gray-600">{team.category}</span>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Building2 className="w-4 h-4 text-gray-400" />
          {team.institution || '-'}
        </div>
      </td>
      <td className="p-4">
        {getStatusBadge(team.status)}
      </td>
      <td className="p-4 text-sm text-gray-500">
        {new Date(team.created_at).toLocaleDateString()}
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {team.status === 'verified' && (
            <button
              onClick={() => onDisqualify(team.id)}
              className="p-2 hover:bg-red-100 rounded-lg text-red-600"
              title="Disqualify"
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
          {team.status === 'rejected' && (
            <button
              onClick={() => onReinstate(team.id)}
              className="p-2 hover:bg-green-100 rounded-lg text-green-600"
              title="Reinstate"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onViewDetail(team)}
            className="p-2 hover:bg-amber-50 rounded-lg text-amber-600"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </td>
    </tr>
  );
});

const AdminUsers = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [detailTeam, setDetailTeam] = useState<Team | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const comp = await competitionService.getActive();
      if (comp) {
        const data = await teamsService.getAll(comp.id);
        setTeams(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDisqualify = async (teamId: string) => {
    if (!confirm('Are you sure you want to disqualify this team?')) return;
    try {
      await teamsService.update(teamId, { status: 'rejected' });
      toast.success('Team rejected');
      load();
    } catch (_e) {
      toast.error('Failed to disqualify');
    }
  };

  const handleReinstate = async (teamId: string) => {
    try {
      await teamsService.update(teamId, { status: 'verified' });
      toast.success('Team reinstated');
      load();
    } catch (_e) {
      toast.error('Failed to reinstate');
    }
  };

  const filteredTeams = teams.filter(team => {
    if (filter !== 'all' && team.status !== filter) return false;
    if (search && !team.name.toLowerCase().includes(search.toLowerCase()) &&
        !(team.team_code || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Verified</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Disqualified</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">Draft</span>;
    }
  };

  const stats = {
    total: teams.length,
    verified: teams.filter(t => t.status === 'verified').length,
    pending: teams.filter(t => t.status === 'pending').length,
    rejected: teams.filter(t => t.status === 'rejected').length,
    student: teams.filter(t => t.category === 'student').length,
    open: teams.filter(t => t.category === 'open').length,
  };

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users & Teams</h1>
          <p className="text-gray-600">Manage registered teams</p>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
          Export Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Teams</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
          <p className="text-xs text-gray-500">Verified</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-xs text-gray-500">Disqualified</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.student}</p>
          <p className="text-xs text-gray-500">Student</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.open}</p>
          <p className="text-xs text-gray-500">Open</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {(['all', 'verified', 'pending', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm capitalize ${filter === f ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}
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
            placeholder="Search teams..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Team</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Category</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Institution</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Registered</th>
              <th className="text-right p-4 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredTeams.map((team) => (
              <TeamTableRow
                key={team.id}
                team={team}
                onDisqualify={handleDisqualify}
                onReinstate={handleReinstate}
                onViewDetail={(t) => setDetailTeam(t)}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </tbody>
        </table>

        {filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No teams found</p>
          </div>
        )}
      </div>

      {/* Team Detail Modal */}
      {detailTeam && (
        <TeamDetailModal
          team={detailTeam}
          onClose={() => setDetailTeam(null)}
        />
      )}
    </div>
  );
};

export default AdminUsers;