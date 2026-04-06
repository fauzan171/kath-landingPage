/**
 * Admin Tasks Management
 * Manage competition tasks across all stages
 * Used as a tab in AdminCompetitionSetup and standalone route at /admin/tasks
 */

import { useState, useEffect } from 'react';
import { Plus, Loader2, Edit2, Trash2, Clock, FileText, Link, Type, Presentation, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { stagesService, tasksService, competitionService, type Stage, type Task } from '@/services/cibc.service';
import type { LegacyRubricCriterion } from '@/lib/supabase';

// Use the legacy rubric criterion type (matches admin UI format)
type RubricCriterion = LegacyRubricCriterion;

const TASK_TYPE_ICONS: Record<string, React.ReactNode> = {
  file_upload: <FileText className="w-4 h-4" />,
  text: <Type className="w-4 h-4" />,
  text_input: <Type className="w-4 h-4" />,
  link: <Link className="w-4 h-4" />,
  link_submit: <Link className="w-4 h-4" />,
  presentation: <Presentation className="w-4 h-4" />,
};

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

const AdminTasks = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([]);
  const [selectedStageId, setSelectedStageId] = useState<string>('all');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const comp = await competitionService.getActive();
      if (comp) {
        const stagesData = await stagesService.getAll(comp.id);
        setStages(stagesData);

        // Load all tasks across stages
        const allTasks: Task[] = [];
        for (const s of stagesData) {
          const stageTasks = await tasksService.getAll(s.id);
          allTasks.push(...stageTasks);
        }
        setTasks(allTasks);
      }
    } catch (e) {
      console.error('Failed to load tasks:', e);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = selectedStageId === 'all'
    ? tasks
    : tasks.filter(t => t.stage_id === selectedStageId);

  const handleSaveTask = async () => {
    if (!editingTask || !editingTask.name || !editingTask.stage_id) return;
    setSaving(true);
    try {
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
      toast.error('Failed to save task');
    } finally {
      setSaving(false);
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

  // Rubric management
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

  const getStageName = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    return stage?.name || 'Unknown Stage';
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

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
          <p className="text-gray-600">Kelola tugas kompetisi untuk semua tahapan</p>
        </div>
        <button
          onClick={() => {
            const firstStage = stages[0];
            setEditingTask({
              stage_id: firstStage?.id || '',
              name: '',
              type: 'file_upload',
              is_published: false,
              is_required: true,
              order_index: tasks.length
            });
            setRubricCriteria([]);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Stage Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedStageId('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedStageId === 'all'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({tasks.length})
        </button>
        {stages.map(stage => {
          const count = tasks.filter(t => t.stage_id === stage.id).length;
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStageId(stage.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStageId === stage.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {stage.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada task. Klik "Add Task" untuk membuat.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Task</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{task.name}</p>
                      {task.is_required && (
                        <span className="text-xs text-red-500">Required</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{getStageName(task.stage_id)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      {TASK_TYPE_ICONS[task.type || 'file_upload'] || <FileText className="w-4 h-4" />}
                      <span className="capitalize">{(task.type || 'file_upload').replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {task.deadline ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className={new Date(task.deadline) < new Date() ? 'text-red-600 font-medium' : 'text-gray-600'}>
                          {formatDateTime(task.deadline)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No deadline</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      task.is_published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {task.is_published ? <><CheckCircle2 className="w-3 h-3" /> Published</> : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          const taskRubric = task.rubric?.filter(
                            (r): r is LegacyRubricCriterion => 'criterion' in r
                          ) || [];
                          setRubricCriteria(taskRubric);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit task"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingTask.id ? 'Edit Task' : 'Tambah Task Baru'}
              </h2>
              <button onClick={() => { setEditingTask(null); setRubricCriteria([]); }} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Stage Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select
                  value={editingTask.stage_id || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, stage_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                >
                  <option value="">Pilih Stage...</option>
                  {stages.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

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
                <p className="text-sm font-medium text-red-800 mb-2">Deadline Task</p>
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
                    <p className="text-xs text-purple-300 mt-1">Klik "Load BMC Default" atau "+ Add Criterion"</p>
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
                                placeholder="Nama kriteria"
                                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 outline-none"
                              />
                              <input
                                type="number"
                                value={c.max_points}
                                onChange={(e) => updateRubricCriterion(idx, 'max_points', parseInt(e.target.value) || 0)}
                                placeholder="Pts"
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
                  onClick={() => { setEditingTask(null); setRubricCriteria([]); }}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTask}
                  disabled={saving || !editingTask.name || !editingTask.stage_id}
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

export default AdminTasks;
