import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Award,
  Calendar,
  Users,
  Plus,
  MoreHorizontal,
  Eye,
  Edit3,
  FileText,
  Target,
  TrendingUp,
  Star,
  Bookmark,
  Share2,
  MapPin,
  Building2,
  Upload,
  ChevronLeft,
  X,
  Trash2,
  AlertCircle
} from '../icons';
import {
  getCompetitions,
  getTeams,
  addNotification,
  type Competition,
  type Team
} from '../services/mockData';

const MyCompetitions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'past' | 'upcoming'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load data
  useEffect(() => {
    setCompetitions(getCompetitions());
    setTeams(getTeams());
  }, []);

  const filteredCompetitions = competitions.filter((comp) => {
    if (activeTab === 'active' && (comp.status === 'finished' || comp.status === 'upcoming')) return false;
    if (activeTab === 'past' && comp.status !== 'finished') return false;
    if (activeTab === 'upcoming' && comp.status !== 'upcoming') return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        comp.name.toLowerCase().includes(query) ||
        comp.category.toLowerCase().includes(query) ||
        comp.organizer.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'registered':
        return {
          badge: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
          label: 'Registered',
          icon: <Bookmark className="w-4 h-4" />,
        };
      case 'in_progress':
        return {
          badge: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
          label: 'In Progress',
          icon: <TrendingUp className="w-4 h-4" />,
        };
      case 'finished':
        return {
          badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
          label: 'Finished',
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
      case 'upcoming':
        return {
          badge: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
          label: 'Upcoming',
          icon: <Clock className="w-4 h-4" />,
        };
      default:
        return {
          badge: 'bg-white/5 text-white/40 border-white/10',
          label: 'Unknown',
          icon: <MoreHorizontal className="w-4 h-4" />,
        };
    }
  };

  const getResultBadge = (result?: string) => {
    switch (result) {
      case 'winner':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-kath-gold/20 text-kath-gold rounded-full text-sm font-medium border border-kath-gold/30">
            <Trophy className="w-4 h-4" />
            Champion
          </span>
        );
      case 'runner_up':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-400/20 text-slate-300 rounded-full text-sm font-medium border border-slate-400/30">
            <Award className="w-4 h-4" />
            Runner Up
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-white/50 rounded-full text-sm font-medium border border-white/10">
            <Star className="w-4 h-4" />
            Participant
          </span>
        );
    }
  };

  const handleViewDetail = (comp: Competition) => {
    setSelectedCompetition(comp);
    setShowDetailModal(true);
  };

  const handleSubmit = (compId: string) => {
    navigate(`/competition/${compId}/submit`);
  };

  const handleEditSubmission = (compId: string) => {
    navigate(`/competition/${compId}/edit`);
  };

  const handleDelete = (compId: string) => {
    const updated = competitions.filter(c => c.id !== compId);
    setCompetitions(updated);
    localStorage.setItem('kath_competitions', JSON.stringify(updated));
    setShowDeleteConfirm(false);
    setShowDetailModal(false);
    
    // Add notification
    addNotification({
      type: 'info',
      title: 'Competition Removed',
      message: 'Kompetisi telah dihapus dari daftar Anda',
      read: false,
    });
  };

  const handleShare = (comp: Competition) => {
    if (navigator.share) {
      navigator.share({
        title: comp.name,
        text: `Check out ${comp.name} on KATH Competition!`,
        url: window.location.origin + `/competition/${comp.id}`,
      });
    } else {
      alert('Link copied to clipboard!');
    }
  };

  const stats = [
    { label: 'Total Competitions', value: competitions.length.toString(), icon: Trophy, trend: '+3' },
    { label: 'Active', value: competitions.filter(c => c.status === 'in_progress' || c.status === 'registered').length.toString(), icon: Target, trend: '2' },
    { label: 'Wins', value: competitions.filter(c => c.result === 'winner').length.toString(), icon: Award, trend: '+1' },
    { label: 'Certificates', value: competitions.filter(c => c.status === 'finished').length.toString(), icon: FileText, trend: '5' },
  ];

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
              <h1 className="font-display text-xl text-white">My Competitions</h1>
            </div>

            <button
              onClick={() => navigate('/competition')}
              className="flex items-center gap-2 px-4 py-2 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body text-sm font-medium rounded-full transition-all"
            >
              <Plus className="w-4 h-4" />
              Join New Event
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-kath-gold/30 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-kath-gold/10 flex items-center justify-center text-kath-gold group-hover:bg-kath-gold/20 transition-all">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-emerald-400">{stat.trend}</span>
                </div>
                <p className="font-display text-2xl text-white mb-1">{stat.value}</p>
                <p className="font-body text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl p-1">
              {[
                { id: 'active', label: 'Active', count: competitions.filter(c => c.status === 'in_progress' || c.status === 'registered').length },
                { id: 'past', label: 'Past', count: competitions.filter(c => c.status === 'finished').length },
                { id: 'upcoming', label: 'Upcoming', count: competitions.filter(c => c.status === 'upcoming').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-kath-gold/20 text-kath-gold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-kath-gold/30' : 'bg-white/10'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search competitions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl font-body text-white placeholder-white/30 focus:outline-none focus:border-kath-gold/50"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 border rounded-xl transition-all ${showFilters ? 'border-kath-gold/50 bg-kath-gold/10 text-kath-gold' : 'border-white/5 text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Competition Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCompetitions.map((comp) => {
              const status = getStatusConfig(comp.status);
              const team = teams.find(t => t.competitionId === comp.id);
              
              return (
                <div
                  key={comp.id}
                  className="group bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-kath-gold/30 transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={comp.image}
                      alt={comp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-kath-bg-dark via-kath-bg-dark/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${status.badge}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                    {comp.status === 'finished' && (
                      <div className="absolute top-4 right-4">{getResultBadge(comp.result)}</div>
                    )}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleShare(comp)}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="font-display text-lg text-white mb-1 group-hover:text-kath-gold transition-colors">
                        {comp.name}
                      </h3>
                      <p className="font-body text-white/50 text-sm">{comp.category}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-white/40" />
                        <span className="font-body text-white/60">{comp.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-white/40" />
                        <span className="font-body text-white/60">{comp.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-white/40" />
                        <span className="font-body text-white/60">
                          {new Date(comp.startDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                          {' - '}
                          {new Date(comp.endDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-white/40" />
                        <span className="font-body text-white/60">
                          {team?.name || 'Individual'} ({comp.teamSize}/{team?.maxMembers || '-'})
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-body text-white/50 text-sm">Progress</span>
                        <span className="font-body text-kath-gold text-sm">{comp.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-kath-gold to-kath-gold-light rounded-full transition-all"
                          style={{ width: `${comp.progress}%` }}
                        />
                      </div>
                    </div>

                    {comp.status === 'in_progress' && (
                      <div className="flex items-center gap-2 mb-4 p-3 bg-white/[0.02] rounded-xl">
                        {comp.hasSubmitted ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span className="font-body text-emerald-400 text-sm">
                              Submitted on {new Date(comp.submissionDate!).toLocaleDateString('id-ID')}
                            </span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5 text-amber-400" />
                            <span className="font-body text-amber-400 text-sm">
                              Deadline: {new Date(comp.deadline).toLocaleDateString('id-ID')}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {comp.prize && (
                      <div className="flex items-center gap-2 mb-4 p-3 bg-kath-gold/10 border border-kath-gold/20 rounded-xl">
                        <Trophy className="w-5 h-5 text-kath-gold" />
                        <span className="font-body text-kath-gold text-sm font-medium">Prize: {comp.prize}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewDetail(comp)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body text-sm font-medium rounded-xl transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {comp.status === 'in_progress' && !comp.hasSubmitted && (
                        <button
                          onClick={() => handleSubmit(comp.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-kath-gold/30 text-kath-gold hover:bg-kath-gold/10 font-body text-sm font-medium rounded-xl transition-all"
                        >
                          <Upload className="w-4 h-4" />
                          Submit
                        </button>
                      )}
                      {comp.status === 'in_progress' && comp.hasSubmitted && (
                        <button
                          onClick={() => handleEditSubmission(comp.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 hover:bg-white/5 font-body text-sm font-medium rounded-xl transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCompetitions.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/[0.02] flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="font-display text-xl text-white mb-2">No competitions found</h3>
              <p className="font-body text-white/50 mb-6">
                {searchQuery ? 'Try adjusting your search query' : 'Start your journey by joining a competition'}
              </p>
              <button
                onClick={() => navigate('/competition')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body font-medium rounded-full transition-all"
              >
                <Plus className="w-5 h-5" />
                Browse Competitions
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedCompetition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-kath-bg-dark border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-white">{selectedCompetition.name}</h2>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-white/60 hover:text-white rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-body text-white/50 text-sm mb-2">Description</h3>
                <p className="font-body text-white">{selectedCompetition.description}</p>
              </div>
              <div>
                <h3 className="font-body text-white/50 text-sm mb-2">Requirements</h3>
                <ul className="space-y-2">
                  {selectedCompetition.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-kath-gold mt-0.5" />
                      <span className="font-body text-white/70 text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-body text-white/50 text-sm mb-2">Rules</h3>
                <ul className="space-y-2">
                  {selectedCompetition.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5" />
                      <span className="font-body text-white/70 text-sm">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  navigate(`/competition/${selectedCompetition.id}`);
                }}
                className="flex-1 px-4 py-3 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body font-medium rounded-xl transition-all"
              >
                Full Details
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-kath-bg-dark border border-white/10 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-display text-lg text-white">Remove Competition?</h3>
            </div>
            <p className="font-body text-white/60 mb-6">
              This will remove the competition from your list. You can rejoin anytime.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border border-white/10 text-white/70 hover:bg-white/5 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedCompetition && handleDelete(selectedCompetition.id)}
                className="flex-1 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCompetitions;
