/**
 * Admin Registrations Verification
 * Verify/reject team registrations
 */

import { useState, useEffect } from 'react';
import { Check, X, Clock, Search, Loader2, Users, Building2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { teamsService, type Team } from '@/services/cibc.service';
import { competitionService } from '@/services/cibc.service';
import { supabase } from '@/lib/supabase';

interface TeamWithMembers extends Team {
  members?: {
    id: string;
    user_id: string;
    role: string;
    user?: {
      name: string;
      email: string;
      institution?: string;
    };
  }[];
}

const AdminRegistrations = () => {
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamWithMembers | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const comp = await competitionService.getActive();
      if (comp) {
        const data = await teamsService.getAll(comp.id);
        // TODO: Load members for each team
        setTeams(data as TeamWithMembers[]);
      }
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (teamId: string) => {
    setProcessing(teamId);
    try {
      // Get current admin user ID from Supabase auth
      let adminId: string | null = null;
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        adminId = user?.id || null;
      }
      await teamsService.verify(teamId, adminId);
      toast.success('Team verified successfully!');
      loadTeams();
    } catch (error) {
      toast.error('Failed to verify team');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (teamId: string, reason: string) => {
    setProcessing(teamId);
    try {
      await teamsService.reject(teamId, reason);
      toast.success('Team rejected');
      loadTeams();
    } catch (error) {
      toast.error('Failed to reject team');
    } finally {
      setProcessing(null);
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
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Draft</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Paid</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Rejected</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Registrations</h1>
          <p className="text-gray-600">Verify team registrations and payments</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Stats */}
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
              {teams.filter(t => t.status === 'pending').length} Pending
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
              {teams.filter(t => t.status === 'verified').length} Verified
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {(['pending', 'verified', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm capitalize ${
                filter === f ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            placeholder="Search by team name or code..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Teams List */}
      <div className="space-y-4">
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No registrations found</p>
          </div>
        ) : (
          filteredTeams.map((team) => (
            <div key={team.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Team Icon */}
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>

                  {/* Team Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{team.name}</h3>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded font-mono">
                        {team.team_code}
                      </span>
                      {getStatusBadge(team.status)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {team.institution || 'No institution'}
                      </span>
                      <span className="capitalize">{team.category}</span>
                    </div>

                    {team.payment_proof && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500 mr-2">Payment:</span>
                        {getPaymentBadge(team.payment_status || 'pending')}
                      </div>
                    )}

                    {team.notes && (
                      <p className="mt-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded">
                        {team.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {team.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleVerify(team.id)}
                        disabled={processing === team.id}
                        className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                      >
                        {processing === team.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Verify
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Reason for rejection:');
                          if (reason) handleReject(team.id, reason);
                        }}
                        disabled={processing === team.id}
                        className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setSelectedTeam(team)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Payment Proof Preview */}
              {team.payment_proof && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">Payment Proof:</p>
                  <a
                    href={team.payment_proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:underline text-sm"
                  >
                    View Payment Proof →
                  </a>
                </div>
              )}

              {/* Created Date */}
              <div className="mt-4 pt-4 border-t flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                Registered: {new Date(team.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Team Detail Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Team Details</h2>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500">Team Name</label>
                  <p className="font-medium">{selectedTeam.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Team Code</label>
                    <p className="font-mono">{selectedTeam.team_code}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Category</label>
                    <p className="capitalize">{selectedTeam.category}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500">Institution</label>
                  <p>{selectedTeam.institution || 'Not specified'}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedTeam.status)}</div>
                </div>

                <div>
                  <label className="text-xs text-gray-500">Payment Status</label>
                  <div className="mt-1">{getPaymentBadge(selectedTeam.payment_status || 'pending')}</div>
                </div>

                {selectedTeam.payment_drive_id && (
                  <div>
                    <label className="text-xs text-gray-500">Payment Drive ID</label>
                    <p className="mt-1 text-sm text-gray-700">{selectedTeam.payment_drive_id}</p>
                  </div>
                )}
              </div>

              {selectedTeam.status === 'pending' && (
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => {
                      handleVerify(selectedTeam.id);
                      setSelectedTeam(null);
                    }}
                    className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Verify Team
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Reason for rejection:');
                      if (reason) {
                        handleReject(selectedTeam.id, reason);
                        setSelectedTeam(null);
                      }
                    }}
                    className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Reject Team
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrations;