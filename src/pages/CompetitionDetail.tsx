import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Trophy,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Target,
  Share2,
  Bookmark,
  Download,
  Upload,
  Edit3
} from '../icons';
import {
  supabaseCompetitionService,
  supabaseTeamService,
  supabaseSubmissionService,
} from '../services/supabase.service';
import type { Competition, Team, Submission } from '../types';

const CompetitionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'requirements' | 'submissions'>('overview');
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;
    setIsLoadingData(true);
    try {
      const comp = await supabaseCompetitionService.getById(id);
      if (comp) {
        setCompetition(comp);

        // Load teams for this competition
        const teamData = await supabaseTeamService.getByCompetition(id);
        setTeams(teamData);

        // Load submission for this competition
        const existingSub = await supabaseSubmissionService.getByCompetition(id);
        setSubmission(existingSub || null);
      }
    } catch (e) {
      console.error('Error loading competition detail:', e);
    } finally {
      setIsLoadingData(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-kath-bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-kath-gold/30 border-t-kath-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-kath-bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.02] flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white/20" />
          </div>
          <h2 className="font-display text-xl text-white mb-2">Competition not found</h2>
          <button
            onClick={() => navigate('/my-competitions')}
            className="text-kath-gold hover:text-kath-gold-light font-body text-sm"
          >
            Back to My Competitions
          </button>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'registered':
        return { color: 'bg-blue-500/15 text-blue-400 border-blue-500/20', label: 'Registered' };
      case 'in_progress':
      case 'active':
        return { color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', label: 'In Progress' };
      case 'finished':
      case 'completed':
        return { color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', label: 'Finished' };
      case 'upcoming':
        return { color: 'bg-purple-500/15 text-purple-400 border-purple-500/20', label: 'Upcoming' };
      default:
        return { color: 'bg-white/5 text-white/40 border-white/10', label: 'Unknown' };
    }
  };

  const displayStatus = competition.is_active ? 'in_progress' : (competition.status as string);
  const status = getStatusConfig(displayStatus);
  const deadline = competition.competition_end || competition.registration_end || '';
  const daysLeft = deadline ? Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-kath-bg-dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-kath-bg-dark/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/my-competitions')}
                className="flex items-center gap-2 text-text-white/60 hover:text-kath-gold transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-body text-sm">Back</span>
              </button>
              <div className="h-6 w-px bg-white/10" />
              <h1 className="font-display text-xl text-white truncate max-w-[200px] sm:max-w-md">
                {competition.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Shared!')}
                className="p-2 text-text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => alert('Bookmarked!')}
                className="p-2 text-text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Card */}
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <div className="absolute inset-0">
              {competition.image && (
                <img
                  src={competition.image}
                  alt={competition.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-kath-bg-dark via-kath-bg-dark/80 to-kath-bg-dark/40" />
            </div>
            
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${status.color}`}>
                  {status.label}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl text-white mb-4">{competition.name}</h1>
              <p className="font-body text-white/70 max-w-2xl mb-6">{competition.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span className="font-body text-sm">
                    {competition.competition_start ? new Date(competition.competition_start).toLocaleDateString('id-ID') : 'TBD'} - {competition.competition_end ? new Date(competition.competition_end).toLocaleDateString('id-ID') : 'TBD'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-text-white/60">
                  <Users className="w-4 h-4" />
                  <span className="font-body text-sm">{teams.length} Teams</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-text-white/60 text-sm">Progress</span>
                  <span className="font-body text-kath-gold text-sm">
                    {competition.is_active ? 'Active' : competition.status === 'completed' ? '100' : '0'}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-kath-gold to-kath-gold-light rounded-full transition-all"
                    style={{ width: `${competition.is_active ? 50 : competition.status === 'completed' ? 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {competition.is_active && !submission && (
              <button
                onClick={() => navigate(`/competition/${competition.id}/submit`)}
                className="flex items-center gap-2 px-6 py-3 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body font-medium rounded-full transition-all"
              >
                <Upload className="w-5 h-5" />
                Submit Now
              </button>
            )}
            {competition.is_active && submission && (
              <button
                onClick={() => navigate(`/competition/${competition.id}/submit`)}
                className="flex items-center gap-2 px-6 py-3 border border-kath-gold/30 text-kath-gold hover:bg-kath-gold/10 font-body font-medium rounded-full transition-all"
              >
                <Edit3 className="w-5 h-5" />
                Edit Submission
              </button>
            )}
            <button
              onClick={() => navigate('/my-teams')}
              className="flex items-center gap-2 px-6 py-3 border border-white/10 text-white/70 hover:bg-white/5 font-body font-medium rounded-full transition-all"
            >
              <Users className="w-5 h-5" />
              Manage Team
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 bg-white/[0.02] border border-white/5 rounded-xl p-1">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'timeline', label: 'Timeline', icon: Calendar },
              { id: 'requirements', label: 'Requirements', icon: FileText },
              { id: 'submissions', label: 'My Submission', icon: Upload },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-kath-gold/20 text-kath-gold'
                    : 'text-text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg text-white mb-4">About Competition</h3>
                  <p className="font-body text-white/70 leading-relaxed">{competition.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white/[0.02] rounded-xl">
                    <Clock className="w-5 h-5 text-kath-gold mb-2" />
                    <p className="font-body text-white/50 text-sm">Deadline</p>
                    <p className="font-body text-white">
                      {deadline ? new Date(deadline).toLocaleDateString('id-ID') : 'TBD'}
                    </p>
                    <p className={`font-body text-sm mt-1 ${daysLeft < 7 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.02] rounded-xl">
                    <Users className="w-5 h-5 text-kath-gold mb-2" />
                    <p className="font-body text-white/50 text-sm">Teams</p>
                    <p className="font-body text-white">{teams.length} registered</p>
                  </div>
                  <div className="p-4 bg-white/[0.02] rounded-xl">
                    <Trophy className="w-5 h-5 text-kath-gold mb-2" />
                    <p className="font-body text-white/50 text-sm">Prize</p>
                    <p className="font-body text-white">{competition.prize || 'TBD'}</p>
                  </div>
                  <div className="p-4 bg-white/[0.02] rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-kath-gold mb-2" />
                    <p className="font-body text-white/50 text-sm">Submission</p>
                    <p className="font-body text-white">{submission ? 'Submitted' : 'Not Submitted'}</p>
                  </div>
                </div>

                {competition.prize && (
                  <div className="p-6 bg-gradient-to-br from-kath-gold/10 to-transparent border border-kath-gold/20 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Trophy className="w-6 h-6 text-kath-gold" />
                      <h3 className="font-display text-lg text-white">Prize</h3>
                    </div>
                    <p className="font-display text-3xl text-kath-gold mb-2">{competition.prize}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                <h3 className="font-display text-lg text-white mb-6">Competition Timeline</h3>
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
                  <div className="space-y-6">
                    {/* Registration phase */}
                    <div className="relative flex gap-4">
                      <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 bg-emerald-500/20 border-emerald-500 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1">
                          <h4 className="font-body font-medium text-white">Registration</h4>
                          <span className="font-body text-xs text-white/40">
                            {competition.registration_start ? new Date(competition.registration_start).toLocaleDateString('id-ID') : 'TBD'} - {competition.registration_end ? new Date(competition.registration_end).toLocaleDateString('id-ID') : 'TBD'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Competition phase */}
                    <div className="relative flex gap-4">
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        competition.is_active
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-white/5 border-white/20 text-white/40'
                      }`}>
                        {competition.is_active ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1">
                          <h4 className={`font-body font-medium ${competition.is_active ? 'text-white' : 'text-white/40'}`}>
                            Competition
                          </h4>
                          <span className="font-body text-xs text-white/40">
                            {competition.competition_start ? new Date(competition.competition_start).toLocaleDateString('id-ID') : 'TBD'} - {competition.competition_end ? new Date(competition.competition_end).toLocaleDateString('id-ID') : 'TBD'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Results phase */}
                    <div className="relative flex gap-4">
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        competition.status === 'completed'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-white/5 border-white/20 text-white/40'
                      }`}>
                        {competition.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1">
                          <h4 className={`font-body font-medium ${competition.status === 'completed' ? 'text-white' : 'text-white/40'}`}>
                            Results
                          </h4>
                          <span className="font-body text-xs text-white/40">
                            {competition.competition_end ? new Date(competition.competition_end).toLocaleDateString('id-ID') : 'TBD'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg text-white mb-4">Submission Requirements</h3>
                  {(competition.requirements && competition.requirements.length > 0) ? (
                    <ul className="space-y-3">
                      {competition.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-kath-gold mt-0.5 flex-shrink-0" />
                          <span className="font-body text-white/70">{req}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-body text-white/50">No specific requirements listed yet.</p>
                  )}
                </div>

                <div>
                  <h3 className="font-display text-lg text-white mb-4">Target Participants</h3>
                  <div className="p-4 bg-white/[0.02] rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="font-body text-white/70">{competition.target || 'Open to all participants'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div>
                <h3 className="font-display text-lg text-white mb-6">My Submission</h3>
                {submission ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="font-body text-emerald-400 font-medium capitalize">{submission.status.replace('_', ' ')}</span>
                      </div>
                      <p className="font-body text-text-white/60 text-sm">
                        Submitted on {submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString('id-ID') : 'N/A'}
                      </p>
                    </div>

                    {submission.content && (
                      <div>
                        <h4 className="font-body text-white/50 text-sm mb-3">Content</h4>
                        <div className="p-4 bg-white/[0.02] rounded-xl">
                          <p className="font-body text-white/70">{submission.content}</p>
                        </div>
                      </div>
                    )}

                    {submission.file_name && (
                      <div>
                        <h4 className="font-body text-white/50 text-sm mb-3">Files</h4>
                        <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-kath-gold" />
                            <div>
                              <p className="font-body text-white text-sm">{submission.file_name}</p>
                              <p className="font-body text-white/40 text-xs">
                                {submission.file_size ? `${(submission.file_size / 1024).toFixed(1)} KB` : ''}
                              </p>
                            </div>
                          </div>
                          {submission.file_url && (
                            <a
                              href={submission.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-white/40 hover:text-kath-gold hover:bg-kath-gold/10 rounded-lg transition-all"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {submission.feedback && (
                      <div className="p-4 bg-white/[0.02] rounded-xl">
                        <h4 className="font-body text-white/50 text-sm mb-2">Feedback</h4>
                        <p className="font-body text-white/70">{submission.feedback}</p>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/competition/${competition.id}/submit`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-kath-gold/30 text-kath-gold hover:bg-kath-gold/10 rounded-xl transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Submission
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.02] flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white/20" />
                    </div>
                    <h4 className="font-body text-white mb-2">No submission yet</h4>
                    <p className="font-body text-white/50 text-sm mb-4">
                      Submit your work before the deadline
                    </p>
                    <button
                      onClick={() => navigate(`/competition/${competition.id}/submit`)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-kath-gold hover:bg-kath-gold-light text-kath-bg-dark font-body font-medium rounded-full transition-all"
                    >
                      <Upload className="w-5 h-5" />
                      Submit Now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompetitionDetail;
