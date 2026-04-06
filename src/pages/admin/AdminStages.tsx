/**
 * Admin Competition Timeline & Stages Management
 * Manage when competition stages start/end and task deadlines
 */

import { useState, useEffect } from 'react';
import { Plus, Loader2, Calendar, Clock, Play, Pause, Edit2, Trash2, Timer, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import { stagesService, tasksService, competitionService, type Stage, type Task } from '@/services/cibc.service';
import type { LegacyRubricCriterion } from '@/lib/supabase';

// Use the legacy rubric criterion type (matches admin UI format)
type RubricCriterion = LegacyRubricCriterion;

const AdminStages = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingStage, setEditingStage] = useState<Partial<Stage> | null>(null);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const comp = await competitionService.getActive();
      if (comp) {
        const stagesData = await stagesService.getAll(comp.id);
        const allTasks: Task[] = [];
        for (const s of stagesData) {
          const t = await tasksService.getAll(s.id);
          allTasks.push(...t);
        }
        setStages(stagesData);
        setTasks(allTasks);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStage = async () => {
    if (!editingStage || !editingStage.name) return;
    setSaving(true);
    try {
      if (!editingStage.id) {
        const comp = await competitionService.getActive();
        const newStage = await stagesService.create({
          ...editingStage,
          competition_id: comp?.id
        });
        setStages([...stages, newStage]);
        toast.success('Stage created!');
      } else {
        const updated = await stagesService.update(editingStage.id, editingStage);
        setStages(stages.map(s => s.id === updated.id ? updated : s));
        toast.success('Stage updated!');
      }
      setEditingStage(null);
    } catch (_e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTask = async () => {
    if (!editingTask || !editingTask.name || !editingTask.stage_id) return;
    setSaving(true);
    try {
      // Include rubric criteria in the task data
      const taskWithRubric = {
        ...editingTask,
        rubric: rubricCriteria.length > 0 ? rubricCriteria : undefined,
      };

      if (!editingTask.id) {
        const comp = await competitionService.getActive();
        const newTask = await tasksService.create({
          ...taskWithRubric,
          competition_id: comp?.id
        });
        setTasks([...tasks, newTask]);
        toast.success('Task created!');
      } else {
        const updated = await tasksService.update(editingTask.id, taskWithRubric);
        setTasks(tasks.map(t => t.id === updated.id ? updated : t));
        toast.success('Task updated!');
      }
      setEditingTask(null);
      setRubricCriteria([]);
    } catch (_e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (stage: Stage) => {
    try {
      const updated = await stagesService.update(stage.id, { is_active: !stage.is_active });
      setStages(stages.map(s => s.id === updated.id ? updated : s));
      toast.success(stage.is_active ? 'Stage deactivated' : 'Stage activated');
    } catch (_e) {
      toast.error('Failed');
    }
  };

  const toggleVisible = async (stage: Stage) => {
    try {
      const updated = await stagesService.update(stage.id, { is_visible: !stage.is_visible });
      setStages(stages.map(s => s.id === updated.id ? updated : s));
      toast.success(stage.is_visible ? 'Stage hidden from participants' : 'Stage visible to participants');
    } catch (_e) {
      toast.error('Failed');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await tasksService.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (_e) {
      toast.error('Failed to delete');
    }
  };

  // ============================================
  // Rubric Management
  // ============================================

  const BMC_DEFAULT_RUBRIC: RubricCriterion[] = [
    { criterion: 'Customer Segments', description: 'Target market definition, persona clarity, market size estimation', max_points: 15 },
    { criterion: 'Value Proposition', description: 'Uniqueness, differentiation from competitors, problem-solution fit', max_points: 20 },
    { criterion: 'Channels', description: 'Go-to-market strategy, distribution channels, customer acquisition', max_points: 10 },
    { criterion: 'Customer Relationships', description: 'Customer engagement, retention strategy, community building', max_points: 5 },
    { criterion: 'Revenue Streams', description: 'Monetization model, pricing strategy, revenue projections', max_points: 15 },
    { criterion: 'Key Resources', description: 'Resource allocation, asset management, capability assessment', max_points: 10 },
    { criterion: 'Key Activities', description: 'Core business activities, operational feasibility, execution plan', max_points: 10 },
    { criterion: 'Key Partnerships', description: 'Partnership strategy, supplier relations, strategic alliances', max_points: 5 },
    { criterion: 'Cost Structure', description: 'Unit economics, break-even analysis, cost optimization', max_points: 10 },
  ];

  const addRubricCriterion = () => {
    setRubricCriteria([...rubricCriteria, { criterion: '', description: '', max_points: 10 }]);
  };

  const removeRubricCriterion = (index: number) => {
    setRubricCriteria(rubricCriteria.filter((_, i) => i !== index));
  };

  const updateRubricCriterion = (index: number, field: keyof RubricCriterion, value: string | number) => {
    const updated = [...rubricCriteria];
    updated[index] = { ...updated[index], [field]: value };
    setRubricCriteria(updated);
  };

  const loadBMCDefaultRubric = () => {
    setRubricCriteria([...BMC_DEFAULT_RUBRIC]);
    toast.success('BMC default rubric loaded');
  };

  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if stage is currently active based on dates
  const isStageActiveByDate = (stage: Stage) => {
    const now = new Date();
    const start = stage.start_date ? new Date(stage.start_date) : null;
    const end = stage.end_date ? new Date(stage.end_date) : null;

    if (start && end) {
      return now >= start && now <= end;
    }
    if (start) {
      return now >= start;
    }
    return stage.is_active;
  };

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Competition Timeline</h1>
          <p className="text-gray-600">Atur jadwal tahapan kompetisi dan deadline task</p>
        </div>
        <button
          onClick={() => setEditingStage({
            name: '',
            order_index: stages.length,
            is_active: false,
            is_visible: true
          })}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Stage
        </button>
      </div>

      {/* Countdown Control Panel */}
      {(() => {
        const activeStage = stages.find(s => s.is_active);
        const countdownDeadline = activeStage?.end_date;
        const now = new Date();
        const diff = countdownDeadline ? new Date(countdownDeadline).getTime() - now.getTime() : null;
        const isExpired = diff !== null && diff <= 0;
        const days = diff && diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;
        const hours = diff && diff > 0 ? Math.floor((diff / (1000 * 60 * 60)) % 24) : 0;
        const minutes = diff && diff > 0 ? Math.floor((diff / 1000 / 60) % 60) : 0;

        return (
          <div className={`rounded-xl border-2 overflow-hidden ${activeStage ? (isExpired ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50') : 'border-gray-200 bg-gray-50'}`}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeStage ? (isExpired ? 'bg-red-500' : 'bg-green-500') : 'bg-gray-400'}`}>
                    <Timer className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Landing Page Countdown</h3>
                    <p className="text-xs text-gray-500">Timer "Registration closes in" yang tampil di landing page</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeStage && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {isExpired ? 'EXPIRED' : 'ACTIVE'}
                    </span>
                  )}
                  <button
                    onClick={() => setEditingStage(activeStage || {
                      name: 'Registration',
                      order_index: 0,
                      is_active: true,
                      is_visible: true
                    })}
                    className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 inline mr-1" />
                    {activeStage ? 'Edit Deadline' : 'Set Deadline'}
                  </button>
                </div>
              </div>

              {activeStage ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Active Stage Info */}
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Stage Aktif</p>
                    <p className="font-bold text-gray-800 text-lg">{activeStage.name}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Play className="w-3 h-3" />
                      <span>{formatDate(activeStage.start_date)}</span>
                      <span>-</span>
                      <Pause className="w-3 h-3" />
                      <span>{formatDate(activeStage.end_date)}</span>
                    </div>
                  </div>

                  {/* Countdown Display */}
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Sisa Waktu di Landing Page</p>
                    {isExpired ? (
                      <div className="text-red-600 font-bold text-lg">Deadline sudah lewat!</div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-800">{days}</div>
                          <div className="text-[10px] text-gray-400 uppercase">Days</div>
                        </div>
                        <span className="text-gray-300 text-xl">:</span>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-800">{hours}</div>
                          <div className="text-[10px] text-gray-400 uppercase">Hours</div>
                        </div>
                        <span className="text-gray-300 text-xl">:</span>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-800">{minutes}</div>
                          <div className="text-[10px] text-gray-400 uppercase">Mins</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Quick Actions</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => toggleActive(activeStage)}
                        className="w-full text-left px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm hover:bg-yellow-100 transition-colors"
                      >
                        {activeStage.is_active ? '⏸ Deactivate Stage' : '▶ Activate Stage'}
                      </button>
                      <button
                        onClick={() => toggleVisible(activeStage)}
                        className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {activeStage.is_visible ? 'Hide from Participants' : 'Show to Participants'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
                  <Timer className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Tidak ada stage aktif. Landing page menampilkan countdown fallback (30 hari dari sekarang).</p>
                  <p className="text-gray-400 text-xs mt-1">Aktifkan salah satu stage di bawah, atau buat stage baru dengan <strong>is_active</strong> dicentang.</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Timeline Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Tips Pengaturan Waktu</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Stage yang <strong>is_active</strong> menentukan countdown di landing page</li>
              <li>• <strong>End Date</strong> stage aktif = deadline countdown "Registration closes in"</li>
              <li>• Aktifkan <strong>is_active</strong> hanya di 1 stage agar countdown jelas</li>
              <li>• Perubahan langsung ter-reflect di landing page (real-time)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-4">
        {stages.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada tahapan. Klik "Add Stage" untuk membuat.</p>
          </div>
        ) : (
          stages.map((stage, index) => {
            const isActiveByDate = isStageActiveByDate(stage);
            const stageTasks = tasks.filter(t => t.stage_id === stage.id);

            return (
              <div key={stage.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Stage Header */}
                <div className={`p-5 ${isActiveByDate ? 'bg-green-50 border-b border-green-200' : 'bg-gray-50 border-b border-gray-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Stage Number */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                        isActiveByDate
                          ? 'bg-green-500 text-white'
                          : stage.is_active
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {index + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800 text-lg">{stage.name}</h3>
                          {isActiveByDate && (
                            <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                              <Play className="w-3 h-3" /> Berlangsung
                            </span>
                          )}
                          {stage.is_active && !isActiveByDate && (
                            <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                              Aktif Manual
                            </span>
                          )}
                        </div>

                        {/* Date Range */}
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Play className="w-4 h-4 text-green-600" />
                            <span>Mulai: <strong>{formatDate(stage.start_date)}</strong></span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Pause className="w-4 h-4 text-red-600" />
                            <span>Selesai: <strong>{formatDate(stage.end_date)}</strong></span>
                          </div>
                        </div>

                        {/* Visibility Status */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${stage.is_visible ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                            {stage.is_visible ? '👁 Visible to participants' : '👁‍🗨 Hidden from participants'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(stage)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          stage.is_active
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        title={stage.is_active ? 'Deactivate stage' : 'Activate stage'}
                      >
                        {stage.is_active ? '⏸ Deactivate' : '▶ Activate'}
                      </button>
                      <button
                        onClick={() => toggleVisible(stage)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          stage.is_visible
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={stage.is_visible ? 'Hide from participants' : 'Show to participants'}
                      >
                        {stage.is_visible ? '👁 Hide' : '👁‍🗨 Show'}
                      </button>
                      <button
                        onClick={() => setEditingStage(stage)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Edit stage"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Tasks ({stageTasks.length})
                    </h4>
                    <button
                      onClick={() => { setEditingTask({
                        stage_id: stage.id,
                        name: '',
                        type: 'file_upload',
                        is_published: false,
                        is_required: true,
                        order_index: stageTasks.length
                      }); setRubricCriteria([]); }}
                      className="text-xs px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                    >
                      + Add Task
                    </button>
                  </div>

                  {stageTasks.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-400">Belum ada task di tahap ini</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {stageTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-800">{task.name}</p>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                task.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                              }`}>
                                {task.is_published ? 'Published' : 'Draft'}
                              </span>
                              {task.is_required && (
                                <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600">Required</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span className="capitalize">{task.type?.replace('_', ' ')}</span>
                              {task.deadline && (
                                <span className={`flex items-center gap-1 ${
                                  new Date(task.deadline) < new Date() ? 'text-red-600 font-medium' : ''
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  Deadline: {formatDateTime(task.deadline)}
                                </span>
                              )}
                              {task.max_score && (
                                <span>Max Score: {task.max_score}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingTask(task);
                                // Load rubric from task if it exists
                                // Filter to legacy format only (the admin UI format)
                                const taskRubric = task.rubric?.filter(
                                  (r): r is LegacyRubricCriterion => 'criterion' in r
                                ) || [];
                                setRubricCriteria(taskRubric);
                              }}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                              title="Edit task"
                            >
                              <Edit2 className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete task"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Stage Edit Modal */}
      {editingStage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingStage.id ? 'Edit Tahap' : 'Tambah Tahap Baru'}
            </h2>

            <div className="space-y-5">
              {/* Stage Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tahap</label>
                <input
                  type="text"
                  value={editingStage.name || ''}
                  onChange={(e) => setEditingStage({ ...editingStage, name: e.target.value })}
                  placeholder="Contoh: Registration, Submission, Final"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>

              {/* Name in Indonesian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama (Bahasa Indonesia)</label>
                <input
                  type="text"
                  value={editingStage.name_id || ''}
                  onChange={(e) => setEditingStage({ ...editingStage, name_id: e.target.value })}
                  placeholder="Contoh: Pendaftaran, Pengumpulan, Final"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={editingStage.description || ''}
                  onChange={(e) => setEditingStage({ ...editingStage, description: e.target.value })}
                  placeholder="Deskripsi singkat tahap ini"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none"
                />
              </div>

              {/* Date Range */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-sm font-medium text-green-800 mb-3">📅 Jadwal Tahap</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      <Play className="w-3 h-3 inline mr-1" />
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={editingStage.start_date?.split('T')[0] || ''}
                      onChange={(e) => setEditingStage({ ...editingStage, start_date: e.target.value ? `${e.target.value}T00:00:00Z` : undefined })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      <Pause className="w-3 h-3 inline mr-1" />
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={editingStage.end_date?.split('T')[0] || ''}
                      onChange={(e) => setEditingStage({ ...editingStage, end_date: e.target.value ? `${e.target.value}T23:59:59Z` : undefined })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  * Peserta hanya dapat mengakses tahap ini saat dalam rentang tanggal yang ditentukan
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={editingStage.is_visible || false}
                    onChange={(e) => setEditingStage({ ...editingStage, is_visible: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">Visible to participants</span>
                    <p className="text-xs text-gray-500">Tampilkan tahap ini ke peserta</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={editingStage.is_active || false}
                    onChange={(e) => setEditingStage({ ...editingStage, is_active: e.target.checked })}
                    className="w-4 h-4 text-green-500 rounded focus:ring-green-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">Aktifkan tahap</span>
                    <p className="text-xs text-gray-500">Buka akses ke peserta (manual override)</p>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setEditingStage(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveStage}
                  disabled={saving || !editingStage.name}
                  className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingTask.id ? 'Edit Task' : 'Tambah Task Baru'}
            </h2>

            <div className="space-y-5">
              {/* Task Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Task</label>
                <input
                  type="text"
                  value={editingTask.name || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                  placeholder="Contoh: Upload BMC, Pitch Deck"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>

              {/* Task Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Task</label>
                <select
                  value={editingTask.type || 'file_upload'}
                  onChange={(e) => setEditingTask({ ...editingTask, type: e.target.value as Task['type'] })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                >
                  <option value="file_upload">File Upload (PDF)</option>
                  <option value="text">Text Input</option>
                  <option value="link">Link Submit</option>
                  <option value="presentation">Presentation</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi / Instruksi</label>
                <textarea
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  placeholder="Instruksi untuk peserta..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none"
                />
              </div>

              {/* Deadline */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <p className="text-sm font-medium text-red-800 mb-2">⏰ Deadline Task</p>
                <input
                  type="datetime-local"
                  value={editingTask.deadline?.replace('Z', '').slice(0, 16) || ''}
                  onChange={(e) => setEditingTask({
                    ...editingTask,
                    deadline: e.target.value ? new Date(e.target.value).toISOString() : undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                />
                <p className="text-xs text-red-600 mt-2">
                  * Submission setelah deadline akan ditandai sebagai terlambat
                </p>
              </div>

              {/* Max Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
                <input
                  type="number"
                  value={editingTask.max_score || 100}
                  onChange={(e) => setEditingTask({ ...editingTask, max_score: parseInt(e.target.value) || 100 })}
                  min="0"
                  max="1000"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>

              {/* Rubric Editor */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-purple-800">Grading Rubric</p>
                    <p className="text-xs text-purple-600">Kriteria penilaian. Judge akan memberi skor per kriteria.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={loadBMCDefaultRubric}
                      className="text-xs px-2.5 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                    >
                      Load BMC Default
                    </button>
                    <button
                      type="button"
                      onClick={addRubricCriterion}
                      className="text-xs px-2.5 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                    >
                      + Add Criterion
                    </button>
                  </div>
                </div>

                {rubricCriteria.length === 0 ? (
                  <div className="text-center py-4 bg-white rounded-lg border border-dashed border-purple-300">
                    <p className="text-sm text-purple-400">Belum ada kriteria penilaian</p>
                    <p className="text-xs text-purple-300 mt-1">Klik &quot;Load BMC Default&quot; atau &quot;+ Add Criterion&quot;</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rubricCriteria.map((c, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-purple-100">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                            {idx + 1}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={c.criterion}
                                onChange={(e) => updateRubricCriterion(idx, 'criterion', e.target.value)}
                                placeholder="Nama kriteria (e.g., Customer Segments)"
                                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 outline-none"
                              />
                              <input
                                type="number"
                                value={c.max_points}
                                onChange={(e) => updateRubricCriterion(idx, 'max_points', parseInt(e.target.value) || 0)}
                                placeholder="Points"
                                min="0"
                                max="100"
                                className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-center focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 outline-none"
                              />
                            </div>
                            <textarea
                              value={c.description}
                              onChange={(e) => updateRubricCriterion(idx, 'description', e.target.value)}
                              placeholder="Deskripsi penilaian..."
                              rows={2}
                              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 outline-none resize-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeRubricCriterion(idx)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 text-xs text-purple-600">
                      <span>Total: {rubricCriteria.length} kriteria</span>
                      <span>Total Points: {rubricCriteria.reduce((sum, rc) => sum + (rc.max_points || 0), 0)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={editingTask.is_published || false}
                    onChange={(e) => setEditingTask({ ...editingTask, is_published: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">Published</span>
                    <p className="text-xs text-gray-500">Tampilkan task ke peserta</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={editingTask.is_required !== false}
                    onChange={(e) => setEditingTask({ ...editingTask, is_required: e.target.checked })}
                    className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">Required</span>
                    <p className="text-xs text-gray-500">Wajib dikerjakan oleh peserta</p>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setEditingTask(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTask}
                  disabled={saving || !editingTask.name}
                  className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStages;