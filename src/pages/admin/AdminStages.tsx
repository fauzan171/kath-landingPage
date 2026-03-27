/**
 * Admin Competition Timeline & Stages Management
 */

import { useState, useEffect } from 'react';
import { Plus, Loader2, Calendar, CheckCircle2, Clock } from 'lucide-react';
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
        const newTask = await tasksService.create(editingTask);
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

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Competition Timeline</h1>
          <p className="text-gray-600">Manage competition stages and tasks</p>
        </div>
        <button
          onClick={() => setEditingStage({ name: '', order_index: stages.length, is_active: false, is_visible: true })}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" /> Add Stage
        </button>
      </div>

      {/* Stages */}
      <div className="space-y-6">
        {stages.map((stage) => (
          <div key={stage.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Stage Header */}
            <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stage.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {stage.is_active ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{stage.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {stage.start_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(stage.start_date).toLocaleDateString()}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-xs ${stage.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {stage.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(stage)}
                  className={`px-3 py-1 rounded text-sm ${stage.is_active ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                >
                  {stage.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => setEditingStage(stage)}
                  className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Tasks */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Tasks</h4>
                <button
                  onClick={() => setEditingTask({ stage_id: stage.id, name: '', type: 'file_upload', is_published: false, order_index: 0 })}
                  className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
                >
                  + Add Task
                </button>
              </div>

              {tasks.filter(t => t.stage_id === stage.id).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No tasks yet</p>
              ) : (
                <div className="space-y-2">
                  {tasks.filter(t => t.stage_id === stage.id).map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-700">{task.name}</p>
                        <p className="text-xs text-gray-500">
                          {task.type} • {task.is_published ? 'Published' : 'Draft'}
                        </p>
                      </div>
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-xs px-2 py-1 hover:bg-gray-200 rounded"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stage Edit Modal */}
      {editingStage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingStage.id ? 'Edit Stage' : 'New Stage'}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Stage Name</label>
                <input
                  type="text"
                  value={editingStage.name || ''}
                  onChange={(e) => setEditingStage({ ...editingStage, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Start Date</label>
                  <input
                    type="date"
                    value={editingStage.start_date?.split('T')[0] || ''}
                    onChange={(e) => setEditingStage({ ...editingStage, start_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">End Date</label>
                  <input
                    type="date"
                    value={editingStage.end_date?.split('T')[0] || ''}
                    onChange={(e) => setEditingStage({ ...editingStage, end_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingStage.is_visible}
                    onChange={(e) => setEditingStage({ ...editingStage, is_visible: e.target.checked })}
                  />
                  Visible to participants
                </label>
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={handleSaveStage} disabled={saving} className="flex-1 py-2 bg-amber-500 text-white rounded-lg">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditingStage(null)} className="flex-1 py-2 bg-gray-100 rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingTask.id ? 'Edit Task' : 'New Task'}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Task Name</label>
                <input
                  type="text"
                  value={editingTask.name || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Type</label>
                <select
                  value={editingTask.type || 'file_upload'}
                  onChange={(e) => setEditingTask({ ...editingTask, type: e.target.value as Task['type'] })}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                >
                  <option value="file_upload">File Upload</option>
                  <option value="text">Text</option>
                  <option value="link">Link</option>
                  <option value="presentation">Presentation</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Deadline</label>
                <input
                  type="datetime-local"
                  value={editingTask.deadline?.replace('Z', '').slice(0, 16) || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingTask.is_published}
                  onChange={(e) => setEditingTask({ ...editingTask, is_published: e.target.checked })}
                />
                <label className="text-sm">Published (visible to participants)</label>
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={handleSaveTask} disabled={saving} className="flex-1 py-2 bg-amber-500 text-white rounded-lg">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditingTask(null)} className="flex-1 py-2 bg-gray-100 rounded-lg">
                  Cancel
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