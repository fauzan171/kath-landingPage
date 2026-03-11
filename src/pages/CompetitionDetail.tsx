import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Trophy,
  Calendar,
  MapPin,
  Building2,
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
} from 'lucide-react';
import {
  getCompetitionById,
  getTeamsByCompetition,
  getSubmissionByCompetition,
  type Competition,
  type Team,
  type Submission
} from '../services/mockData';

const CompetitionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'requirements' | 'submissions'>('overview');

  useEffect(() => {
    if (id) {
      const comp = getCompetitionById(id);
      if (comp) {
        setCompetition(comp);
        setTeams(getTeamsByCompetition(id));
        const existingSub = getSubmissionByCompetition(id);
        setSubmission(existingSub || null);
      }
    }
  }, [id]);

  if (!competition) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.02] flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white/20" />
          </div>
          <h2 className="font-display text-xl text-white mb-2">Competition not found</h2>
          <button
            onClick={() => navigate('/my-competitions')}
            className="text-[#a68a2d] hover:text-[#c9a94d] font-body text-sm"
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
        return { color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', label: 'In Progress' };
      case 'finished':
        return { color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', label: 'Finished' };
      case 'upcoming':
        return { color: 'bg-purple-500/15 text-purple-400 border-purple-500/20', label: 'Upcoming' };
      default:
        return { color: 'bg-white/5 text-white/40 border-white/10', label: 'Unknown' };
    }
  };

  const status = getStatusConfig(competition.status);
  const daysLeft = Math.ceil((new Date(competition.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/my-competitions')}
                className="flex items-center gap-2 text-white/60 hover:text-[#a68a2d] transition-colors"
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
                className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => alert('Bookmarked!')}
                className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
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
              <img
                src={competition.image}
                alt={competition.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/40" />
            </div>
            
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${status.color}`}>
                  {status.label}
                </span>
                {competition.result && (
                  <span className="px-3 py-1.5 bg-[#a68a2d]/20 text-[#a68a2d] rounded-full text-sm font-medium border border-[#a68a2d]/30">
                    <Trophy className="w-4 h-4 inline mr-1" />
                    {competition.result === 'winner' ? 'Champion' : 'Runner Up'}
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl text-white mb-4">{competition.name}</h1>
              <p className="font-body text-white/70 max-w-2xl mb-6">{competition.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-white/60">
                  <Building2 className="w-4 h-4" />
                  <span className="font-body text-sm">{competition.organizer}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="w-4 h-4" />
                  <span className="font-body text-sm">{competition.location}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span className="font-body text-sm">
                    {new Date(competition.startDate).toLocaleDateString('id-ID')} - {new Date(competition.endDate).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Users className="w-4 h-4" />
                  <span className="font-body text-sm">{teams.length} Teams</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-white/60 text-sm">Progress</span>
                  <span className="font-body text-[#a68a2d] text-sm">{competition.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#a68a2d] to-[#c9a94d] rounded-full transition-all"
                    style={{ width: `${competition.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {competition.status === 'in_progress' && !competition.hasSubmitted && (
              <button
                onClick={() => navigate(`/competition/${competition.id}/submit`)}
                className="flex items-center gap-2 px-6 py-3 bg-[#a68a2d] hover:bg-[#c9a94d] text-[#0a0a0a] font-body font-medium rounded-full transition-all"
              >
                <Upload className="w-5 h-5" />
                Submit Now
              </button>
            )}
            {competition.status === 'in_progress' && competition.hasSubmitted && (
              <button
                onClick={() => navigate(`/competition/${competition.id}/submit`)}
                className="flex items-center gap-2 px-6 py-3 border border-[#a68a2d]/30 text-[#a68a2d] hover:bg-[#a68a2d]/10 font-body font-medium rounded-full transition-all"
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
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#a68a2d]/20 text-[#a68a2d]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
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
                    <Clock className="w-5 h-5 text-[#a68a2d] mb-2" />
                    <p className="font-body text-white/50 text-sm">Deadline</p>
                    <p className="font-body text-white">{new Date(competition.deadline).toLocaleDateString('id-ID')}</p>
                    <p className={`font-body text-sm mt-1 ${daysLeft < 7 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                    </p>
                  </div>
                  <div className="p-4 bg-white/[0.02] rounded-xl">
                    <Users className="w-5 h-5 text-[#a68a2d] mb-2" />
                    <p className="font-body text-white/50 text-sm">Team Size</p>
                    <p className="font-body text-white">{competition.teamSize} members</p>
                  </div>
                  <div className="p-4 bg-white/[0.02] rounded-xl">
                    <Trophy className="w-5 h-5 text-[#a68a2d] mb-2" />
                    <p className="font-body text-white/50 text-sm">Prize Pool</p>
                    <p className="font-body text-white">Rp 500.000.000</p>
                  </div>
                  <div className="p-4 bg-white/[0.02] rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-[#a68a2d] mb-2" />
                    <p className="font-body text-white/50 text-sm">Status</p>
                    <p className="font-body text-white">{competition.hasSubmitted ? 'Submitted' : 'Not Submitted'}</p>
                  </div>
                </div>

                {competition.prize && (
                  <div className="p-6 bg-gradient-to-br from-[#a68a2d]/10 to-transparent border border-[#a68a2d]/20 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Trophy className="w-6 h-6 text-[#a68a2d]" />
                      <h3 className="font-display text-lg text-white">Your Achievement</h3>
                    </div>
                    <p className="font-display text-3xl text-[#a68a2d] mb-2">{competition.prize}</p>
                    <p className="font-body text-white/60">
                      Congratulations on your {competition.result === 'winner' ? 'victory' : 'achievement'}!
                    </p>
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
                    {competition.timeline.map((event, index) => (
                      <div key={index} className="relative flex gap-4">
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            event.completed
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                              : 'bg-white/5 border-white/20 text-white/40'
                          }`}
                        >
                          {event.completed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1">
                            <h4 className={`font-body font-medium ${event.completed ? 'text-white' : 'text-white/40'}`}>
                              {event.phase}
                            </h4>
                            <span className="font-body text-xs text-white/40">{event.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg text-white mb-4">Submission Requirements</h3>
                  <ul className="space-y-3">
                    {competition.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-[#a68a2d] mt-0.5 flex-shrink-0" />
                        <span className="font-body text-white/70">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-lg text-white mb-4">Rules & Regulations</h3>
                  <ul className="space-y-3">
                    {competition.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-xl">
                        <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="font-body text-white/70">{rule}</span>
                      </li>
                    ))}
                  </ul>
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
                        <span className="font-body text-emerald-400 font-medium">Submitted</span>
                      </div>
                      <p className="font-body text-white/60 text-sm">
                        Submitted on {new Date(submission.submittedAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-body text-white/50 text-sm mb-3">Files</h4>
                      <div className="space-y-2">
                        {submission.files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-[#a68a2d]" />
                              <div>
                                <p className="font-body text-white text-sm">{file.name}</p>
                                <p className="font-body text-white/40 text-xs">{file.size}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => alert(`Downloading ${file.name}...`)}
                              className="p-2 text-white/40 hover:text-[#a68a2d] hover:bg-[#a68a2d]/10 rounded-lg transition-all"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {submission.feedback && (
                      <div className="p-4 bg-white/[0.02] rounded-xl">
                        <h4 className="font-body text-white/50 text-sm mb-2">Feedback</h4>
                        <p className="font-body text-white/70">{submission.feedback}</p>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/competition/${competition.id}/submit`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#a68a2d]/30 text-[#a68a2d] hover:bg-[#a68a2d]/10 rounded-xl transition-all"
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
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#a68a2d] hover:bg-[#c9a94d] text-[#0a0a0a] font-body font-medium rounded-full transition-all"
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
