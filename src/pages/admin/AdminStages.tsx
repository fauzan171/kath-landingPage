/**
 * Admin Competition Timeline & Stages Management
 * Manage when competition stages start/end and task deadlines
 */

import { useState, useEffect } from 'react';
import { Plus, Loader2, Calendar, Clock, Play, Pause, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { stagesService, tasksService, competitionService, type Stage, type Task } from '@/services/cibc.service';

const AdminStages = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingStage, setEditingStage] = useState<Partial<Stage> | null>(null);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);

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
    } catch (e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTask = async () => {
    if (!editingTask || !editingTask.name || !editingTask.stage_id) return;
    setSaving(true);
    try {
      if (!editingTask.id) {
        const comp = await competitionService.getActive();
        const newTask = await tasksService.create({
          ...editingTask,
          competition_id: comp?.id
        });
        setTasks([...tasks, newTask]);
        toast.success('Task created!');
      } else {
        const updated = await tasksService.update(editingTask.id, editingTask);
        setTasks(tasks.map(t => t.id === updated.id ? updated : t));
        toast.success('Task updated!');
      }
      setEditingTask(null);
    } catch (e) {
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
    } catch (e) {
      toast.error('Failed');
    }
  };

  const toggleVisible = async (stage: Stage) => {
    try {
      const updated = await stagesService.update(stage.id, { is_visible: !stage.is_visible });
      setStages(stages.map(s => s.id === updated.id ? updated : s));
      toast.success(stage.is_visible ? 'Stage hidden from participants' : 'Stage visible to participants');
    } catch (e) {
      toast.error('Failed');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await tasksService.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (e) {
      toast.error('Failed to delete');
    }
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

      {/* Timeline Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Tips Pengaturan Waktu</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Set <strong>Start Date</strong> untuk menentukan kapan tahap dimulai</li>
              <li>• Set <strong>End Date</strong> untuk deadline tahap</li>
              <li>• Aktifkan <strong>is_active</strong> untuk membuka akses ke peserta</li>
              <li>• Set <strong>Deadline</strong> di setiap task untuk tenggat waktu pengumpulan</li>
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
                      onClick={() => setEditingTask({
                        stage_id: stage.id,
                        name: '',
                        type: 'file_upload',
                        is_published: false,
                        is_required: true,
                        order_index: stageTasks.length
                      })}
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
                              onClick={() => setEditingTask(task)}
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