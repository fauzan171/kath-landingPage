import { CheckCircle2, ChevronRight, Bell, Clock } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { TeamData, StageData, TaskData, SubmissionData, AnnouncementData, NotificationData, CurrentUser } from '../CIBCDashboard';

interface OverviewSectionProps {
  currentUser: CurrentUser | null;
  team: TeamData | null;
  stages: StageData[];
  tasks: TaskData[];
  submissions: SubmissionData[];
  announcements: AnnouncementData[];
  notifications: NotificationData[];
  progressPercentage: number;
  unreadNotifications: number;
  competition?: any;
  handleMarkAsRead: (id: string) => void;
  handleMarkAllRead: () => void;
}

const OverviewSection = ({
  currentUser,
  team,
  stages,
  tasks,
  submissions,
  announcements,
  notifications,
  progressPercentage,
  unreadNotifications,
  competition: _competition,
  handleMarkAsRead,
  handleMarkAllRead
}: OverviewSectionProps) => {
  const { language } = useLanguage();

  // Get current active stage
  const activeStage = stages.find(s => s.is_active);

  // Calculate completed tasks
  const completedTasksCount = submissions.filter(s =>
    s.status === 'graded' || s.status === 'submitted'
  ).length;

  const totalRequiredTasks = tasks.filter(t => t.is_required).length;

  // Get graded submissions with scores
  const gradedSubmissions = submissions.filter(s => s.status === 'graded' && s.total_score !== undefined);
  const totalScore = gradedSubmissions.reduce((sum, s) => sum + (s.total_score || 0), 0);
  const avgScore = gradedSubmissions.length > 0 ? Math.round(totalScore / gradedSubmissions.length) : null;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#0F0F0F] rounded-3xl p-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <h2 className="font-display font-bold text-3xl text-white mb-2">
            {language === 'id' ? 'Selamat Datang,' : 'Welcome,'}{' '}
            <span className="text-[#FFB22C]">{team?.name || currentUser?.fullName}</span>!
          </h2>
          <p className="font-body text-white/60 font-medium">
            {language === 'id'
              ? 'Pantau progres tim dan submission Anda di sini.'
              : 'Monitor your team progress and submissions here.'}
          </p>

          {/* Quick Stats */}
          {team && (
            <div className="flex flex-wrap gap-4 mt-6">
              {team.institution && (
                <div className="px-4 py-2 bg-white/10 rounded-xl">
                  <span className="text-white/60 text-xs font-body">{language === 'id' ? 'Institusi' : 'Institution'}</span>
                  <p className="text-white font-body font-bold">{team.institution}</p>
                </div>
              )}
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <span className="text-white/60 text-xs font-body">{language === 'id' ? 'Kategori' : 'Category'}</span>
                <p className="text-white font-body font-bold capitalize">{team.category}</p>
              </div>
              {avgScore !== null && (
                <div className="px-4 py-2 bg-[#FFB22C]/20 rounded-xl">
                  <span className="text-[#FFB22C]/80 text-xs font-body">{language === 'id' ? 'Rata-rata Nilai' : 'Avg Score'}</span>
                  <p className="text-[#FFB22C] font-display font-bold">{avgScore}/100</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#FFB22C] opacity-20 blur-3xl rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Progress & Stages */}
        <div className="lg:col-span-2 space-y-6">

          {/* Competition Progress */}
          <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-xl text-[#0F0F0F]">
                {language === 'id' ? 'Progres Kompetisi' : 'Competition Progress'}
              </h3>
              {activeStage && (
                <span className="font-body font-bold text-sm px-4 py-1.5 bg-green-100 text-green-700 rounded-full">
                  {language === 'id' ? 'Tahap Aktif:' : 'Active Stage:'} {activeStage.name}
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-3 font-body font-semibold text-[#0F0F0F]/60">
                <span>{language === 'id' ? `Task Selesai: ${completedTasksCount}/${totalRequiredTasks}` : `Completed Tasks: ${completedTasksCount}/${totalRequiredTasks}`}</span>
                <span className="text-[#FFB22C] font-bold">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-[#F9F8F6] rounded-full h-3">
                <div
                  className="bg-[#FFB22C] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-[#F9F8F6] rounded-2xl text-center">
                <p className="font-display font-bold text-2xl text-[#0F0F0F]">{tasks.length}</p>
                <p className="font-body text-xs text-[#0F0F0F]/60">{language === 'id' ? 'Total Task' : 'Total Tasks'}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-2xl text-center">
                <p className="font-display font-bold text-2xl text-green-600">{completedTasksCount}</p>
                <p className="font-body text-xs text-green-600/60">{language === 'id' ? 'Selesai' : 'Completed'}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl text-center">
                <p className="font-display font-bold text-2xl text-amber-600">{totalRequiredTasks - completedTasksCount}</p>
                <p className="font-body text-xs text-amber-600/60">{language === 'id' ? 'Belum Selesai' : 'Remaining'}</p>
              </div>
            </div>
          </div>

          {/* Stages & Deadlines */}
          <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
            <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-6">
              {language === 'id' ? 'Tahapan & Tenggat Waktu' : 'Stages & Deadlines'}
            </h3>

            {stages.length > 0 ? (
              <div className="space-y-3">
                {stages.map((stage) => {
                  // Check if team has submissions for this stage
                  const stageTasks = tasks.filter(t => t.stage_id === stage.id);
                  const stageSubmissions = submissions.filter(s =>
                    stageTasks.some(t => t.id === s.task_id)
                  );
                  const stageProgress = stageTasks.length > 0
                    ? Math.round((stageSubmissions.length / stageTasks.length) * 100)
                    : 0;

                  return (
                    <div
                      key={stage.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        stage.is_active
                          ? 'bg-[#FFB22C]/5 border-[#FFB22C]/20'
                          : 'bg-[#F9F8F6] border-transparent hover:border-[#0F0F0F]/5'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          stage.is_active ? 'bg-[#FFB22C] text-white' :
                          stage.status === 'completed' ? 'bg-green-500 text-white' :
                          'bg-[#0F0F0F]/10 text-[#0F0F0F]/40'
                        }`}>
                          {stage.is_active ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-body text-[#0F0F0F] font-bold">
                              {language === 'id' && stage.name_id ? stage.name_id : stage.name}
                            </h4>
                            {stage.is_active && (
                              <span className="px-2 py-0.5 bg-[#FFB22C] text-white text-[10px] font-bold rounded-full uppercase">
                                {language === 'id' ? 'Aktif' : 'Active'}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mt-2">
                            {stage.end_date && (
                              <span className="text-xs text-[#0F0F0F]/50 font-body">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {language === 'id' ? 'Deadline:' : 'Deadline:'}{' '}
                                {new Date(stage.end_date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            )}

                            {stageTasks.length > 0 && (
                              <span className="text-xs text-[#0F0F0F]/50 font-body">
                                {stageSubmissions.length}/{stageTasks.length} {language === 'id' ? 'task' : 'tasks'}
                              </span>
                            )}
                          </div>

                          {/* Progress bar for this stage */}
                          {stageTasks.length > 0 && (
                            <div className="mt-3">
                              <div className="w-full bg-[#0F0F0F]/10 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full transition-all ${
                                    stage.is_active ? 'bg-[#FFB22C]' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${stageProgress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <ChevronRight className="w-5 h-5 text-[#0F0F0F]/30" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-[#0F0F0F]/40">
                <p className="font-body font-medium">
                  {language === 'id' ? 'Belum ada tahapan tersedia.' : 'No stages available yet.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Announcements & Notifications */}
        <div className="space-y-6">

          {/* Announcements */}
          <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
            <h3 className="font-display font-bold text-xl text-[#0F0F0F] mb-6">
              {language === 'id' ? 'Pengumuman' : 'Announcements'}
            </h3>

            {announcements.length > 0 ? (
              <div className="space-y-3">
                {announcements.slice(0, 5).map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-4 rounded-2xl border-l-4 ${
                      announcement.type === 'urgent'
                        ? 'bg-red-50 border-l-red-500'
                        : announcement.type === 'result'
                        ? 'bg-green-50 border-l-green-500'
                        : 'bg-[#F9F8F6] border-l-[#FFB22C]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-body text-sm text-[#0F0F0F] font-bold leading-tight">
                        {language === 'id' && announcement.title_id ? announcement.title_id : announcement.title}
                      </h4>
                      {announcement.type === 'urgent' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase">
                          {language === 'id' ? 'Penting' : 'Urgent'}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs font-medium text-[#0F0F0F]/60 line-clamp-2 mt-1.5">
                      {language === 'id' && announcement.content_id ? announcement.content_id : announcement.content}
                    </p>
                    {announcement.published_at && (
                      <p className="font-body text-[10px] text-[#0F0F0F]/40 mt-2">
                        {new Date(announcement.published_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body font-medium text-sm text-[#0F0F0F]/40 text-center py-6">
                {language === 'id' ? 'Belum ada pengumuman' : 'No announcements yet'}
              </p>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white border border-[#0F0F0F]/5 rounded-3xl p-6 lg:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-xl text-[#0F0F0F]">
                {language === 'id' ? 'Notifikasi' : 'Notifications'}
              </h3>
              <div className="flex items-center gap-2">
                {unreadNotifications > 0 && (
                  <span className="bg-[#FFB22C] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
                {unreadNotifications > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#FFB22C] hover:text-[#0F0F0F] font-body font-bold"
                  >
                    {language === 'id' ? 'Tandai semua' : 'Mark all'}
                  </button>
                )}
              </div>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl flex gap-3 transition-colors cursor-pointer ${
                      !notif.is_read
                        ? 'bg-[#FFB22C]/5 border border-[#FFB22C]/20'
                        : 'bg-[#F9F8F6] border border-transparent'
                    }`}
                    onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                  >
                    <Bell className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      !notif.is_read ? 'text-[#FFB22C]' : 'text-[#0F0F0F]/30'
                    }`} />
                    <div className="flex-1">
                      <p className={`font-body text-sm font-semibold leading-snug ${
                        !notif.is_read ? 'text-[#0F0F0F]' : 'text-[#0F0F0F]/60'
                      }`}>
                        {notif.title}
                      </p>
                      {notif.message && (
                        <p className="text-xs text-[#0F0F0F]/50 mt-1 line-clamp-2">{notif.message}</p>
                      )}
                      <p className="text-[10px] text-[#0F0F0F]/30 mt-1">
                        {new Date(notif.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body font-medium text-sm text-[#0F0F0F]/40 text-center py-6">
                {language === 'id' ? 'Tidak ada notifikasi' : 'No notifications'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;