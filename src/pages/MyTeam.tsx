import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Users,
  Plus,
  Copy,
  Check,
  Crown,
  MoreHorizontal,
  Trash2,
  LogOut,
  Mail,
  X,
  ChevronRight,
  Search
} from 'lucide-react';
import {
  getTeams,
  getCompetitions,
  createTeam,
  inviteMember,
  removeMember,
  promoteMember,
  addNotification,
  type Team,
  type Competition
} from '../services/mockData';

const MyTeam = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberMenu, setShowMemberMenu] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState('');

  // Load data
  useEffect(() => {
    setTeams(getTeams());
    setCompetitions(getCompetitions().filter(c => c.status !== 'finished'));
    if (teams.length > 0 && !activeTeam) {
      setActiveTeam(teams[0]);
    }
  }, []);

  const handleCopyCode = () => {
    if (activeTeam) {
      navigator.clipboard.writeText(activeTeam.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCreateTeam = () => {
    if (newTeamName.length < 3) {
      alert('Team name must be at least 3 characters');
      return;
    }
    if (!selectedCompetition) {
      alert('Please select a competition');
      return;
    }

    const comp = competitions.find(c => c.id === selectedCompetition);
    if (!comp) return;

    const newTeam = createTeam({
      name: newTeamName,
      competitionId: selectedCompetition,
      competitionName: comp.name,
      description: newTeamDesc,
      maxMembers: 4,
      members: [{
        id: 'usr_test_001',
        name: 'Budi Santoso',
        email: 'test@kath.com',
        role: 'leader',
        status: 'active',
        joinedAt: new Date().toISOString(),
      }],
    });

    setTeams([...teams, newTeam]);
    setActiveTeam(newTeam);
    setShowCreateModal(false);
    setNewTeamName('');
    setNewTeamDesc('');
    setSelectedCompetition('');

    addNotification({
      type: 'success',
      title: 'Team Created',
      message: `Team "${newTeam.name}" has been created successfully!`,
      read: false,
    });
  };

  const handleInvite = () => {
    if (!inviteEmail || !activeTeam) return;
    
    if (!inviteEmail.includes('@')) {
      alert('Please enter a valid email');
      return;
    }

    inviteMember(activeTeam.id, inviteEmail);
    setTeams(getTeams());
    setShowInviteModal(false);
    setInviteEmail('');

    addNotification({
      type: 'info',
      title: 'Invitation Sent',
      message: `Invitation sent to ${inviteEmail}`,
      read: false,
    });
  };

  const handleRemoveMember = (memberId: string) => {
    if (!activeTeam) return;
    removeMember(activeTeam.id, memberId);
    setTeams(getTeams());
    setActiveTeam(getTeams().find(t => t.id === activeTeam.id) || null);
    setShowMemberMenu(null);
  };

  const handlePromoteMember = (memberId: string) => {
    if (!activeTeam) return;
    promoteMember(activeTeam.id, memberId);
    setTeams(getTeams());
    setActiveTeam(getTeams().find(t => t.id === activeTeam.id) || null);
    setShowMemberMenu(null);
  };

  const handleLeaveTeam = () => {
    if (!activeTeam) return;
    if (window.confirm('Are you sure you want to leave this team?')) {
      const updatedTeams = teams.filter(t => t.id !== activeTeam.id);
      setTeams(updatedTeams);
      setActiveTeam(updatedTeams[0] || null);
      
      addNotification({
        type: 'warning',
        title: 'Left Team',
        message: `You have left team "${activeTeam.name}"`,
        read: false,
      });
    }
  };

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.competitionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-kath-bg-dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-kath-bg-dark/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-white/60 hover:text-kath-gold transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-body text-sm">Back</span>
              </button>
              <div className="h-6 w-px bg-white/10" />
              <h1 className="font-display text-xl text-white">My Teams</h1>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body text-sm font-medium rounded-full transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Team
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {teams.length === 0 ? (
            // Empty State
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/[0.02] flex items-center justify-center">
                <Users className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="font-display text-xl text-white mb-2">No teams yet</h3>
              <p className="font-body text-white/50 mb-6">
                Create a team or join an existing team to collaborate
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body font-medium rounded-full transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Your First Team
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Teams List */}
              <div className="lg:col-span-1">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search teams..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl font-body text-white placeholder-white/30 focus:outline-none focus:border-kath-gold/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    {filteredTeams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => setActiveTeam(team)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          activeTeam?.id === team.id
                            ? 'bg-kath-gold/20 border border-kath-gold/30'
                            : 'hover:bg-white/[0.02] border border-transparent'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-kath-gold/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-kath-gold" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-body text-white font-medium">{team.name}</p>
                          <p className="font-body text-white/50 text-xs">{team.competitionName}</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-white/40 transition-transform ${activeTeam?.id === team.id ? 'rotate-90' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Detail */}
              <div className="lg:col-span-2 space-y-6">
                {activeTeam && (
                  <>
                    {/* Team Info Card */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="font-display text-2xl text-white mb-2">{activeTeam.name}</h2>
                          <p className="font-body text-white/60">{activeTeam.competitionName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowInviteModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body text-sm font-medium rounded-full transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            Invite
                          </button>
                        </div>
                      </div>

                      <p className="font-body text-white/70 mb-4">{activeTeam.description}</p>

                      {/* Team Code */}
                      <div className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-xl">
                        <div className="flex-1">
                          <p className="font-body text-white/50 text-xs mb-1">Team Code</p>
                          <p className="font-body text-white font-mono text-lg">{activeTeam.code}</p>
                        </div>
                        <button
                          onClick={handleCopyCode}
                          className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-kath-gold/50 text-white/70 hover:text-kath-gold rounded-lg transition-all"
                        >
                          {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          <span className="font-body text-sm">{copiedCode ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Members List */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-lg text-white">Team Members</h3>
                        <span className="font-body text-white/50 text-sm">
                          {activeTeam.members.length} / {activeTeam.maxMembers}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {activeTeam.members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kath-gold to-kath-gold-dark flex items-center justify-center">
                                <span className="font-display text-kath-bg-dark text-sm">
                                  {member.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-body text-white font-medium">{member.name}</p>
                                  {member.role === 'leader' && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-kath-gold/20 text-kath-gold rounded-full text-xs">
                                      <Crown className="w-3 h-3" />
                                      Leader
                                    </span>
                                  )}
                                </div>
                                <p className="font-body text-white/50 text-sm">{member.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {member.status === 'pending' && (
                                <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs">
                                  Pending
                                </span>
                              )}
                              {member.role !== 'leader' && member.status === 'active' && (
                                <div className="relative">
                                  <button
                                    onClick={() => setShowMemberMenu(showMemberMenu === member.id ? null : member.id)}
                                    className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                  >
                                    <MoreHorizontal className="w-5 h-5" />
                                  </button>
                                  
                                  {showMemberMenu === member.id && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-kath-dark-gray border border-white/10 rounded-xl shadow-xl z-10">
                                      <button
                                        onClick={() => handlePromoteMember(member.id)}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-white/70 hover:text-kath-gold hover:bg-white/5 rounded-t-xl transition-all"
                                      >
                                        <Crown className="w-4 h-4" />
                                        Make Leader
                                      </button>
                                      <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-b-xl transition-all"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Leave Team Button */}
                      <button
                        onClick={handleLeaveTeam}
                        className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Leave Team
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-kath-bg-dark border border-white/10 rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-white">Create New Team</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-white/60 hover:text-white rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-body text-sm text-white/70 mb-2">Team Name *</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl font-body text-white placeholder-white/30 focus:outline-none focus:border-kath-gold/50"
                  placeholder="Enter team name (min 3 chars)"
                />
              </div>
              <div>
                <label className="block font-body text-sm text-white/70 mb-2">Competition *</label>
                <select
                  value={selectedCompetition}
                  onChange={(e) => setSelectedCompetition(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl font-body text-white focus:outline-none focus:border-kath-gold/50"
                >
                  <option value="">Select competition</option>
                  {competitions.map((comp) => (
                    <option key={comp.id} value={comp.id}>{comp.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-body text-sm text-white/70 mb-2">Description</label>
                <textarea
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl font-body text-white placeholder-white/30 focus:outline-none focus:border-kath-gold/50 resize-none"
                  placeholder="Describe your team..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 border border-white/10 text-white/70 hover:bg-white/5 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                className="flex-1 px-4 py-3 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body font-medium rounded-xl transition-all"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-kath-bg-dark border border-white/10 rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-white">Invite Member</h2>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-white/60 hover:text-white rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="font-body text-white/60 mb-4">
                Send invitation to join team "{activeTeam?.name}"
              </p>
              <div>
                <label className="block font-body text-sm text-white/70 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl font-body text-white placeholder-white/30 focus:outline-none focus:border-kath-gold/50"
                    placeholder="member@example.com"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-3 border border-white/10 text-white/70 hover:bg-white/5 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="flex-1 px-4 py-3 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body font-medium rounded-xl transition-all"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeam;
