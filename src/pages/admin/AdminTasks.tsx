/**
 * Admin Tasks Management
 * Manage tasks within competition stages
 * Based on PRD-CIBC-Competition-Platform.md Section 4.3
 */

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical, Loader2, FileText, Link, Text, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { stagesService, tasksService, competitionService, type Stage, type Task } from '@/services/cibc.service';

const AdminTasks = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    name_id: '',
    description: '',
    description_id: '',
    instructions: '',
    type: 'file_upload' as Task['type'],
    max_file_size_mb: 5,
    allowed_extensions: ['.pdf'],
    deadline: '',
    is_required: true,
    is_published: false,
    rubric: [] as Array<{ id: string; name: string; nameId?: string; maxScore: number; weight: number }>,
    order_index: 1,
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const comp = await competitionService.getActive();
      if (!comp) return;

      const stagesData = await stagesService.getAll(comp.id);
      setStages(stagesData);

      // Load tasks for each stage
      const tasksMap: Record<string, Task[]> = {};
      for (const stage of stagesData) {
        const stageTasks = await tasksService.getAll(stage.id);
        tasksMap[stage.id] = stageTasks;
      }
      setTasks(tasksMap);

      if (stagesData.length > 0) {
        setSelectedStage(stagesData[0].id);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedStage) {
      toast.error('Select a stage first');
      return;
    }
    if (!form.name) {
      toast.error('Task name is required');
      return;
    }

    setSaving(true);
    try {
      const comp = await competitionService.getActive();
      if (!comp) throw new Error('No active competition');

      const newTask = await tasksService.create({
        stage_id: selectedStage,
        competition_id: comp.id,
        name: form.name,
        name_id: form.name_id,
        description: form.description,
        description_id: form.description_id,
        type: form.type,
        max_file_size: form.max_file_size_mb,
        file_types: form.allowed_extensions,
        deadline: form.deadline || undefined,
        is_published: form.is_published,
        order_index: form.order_index,
        is_required: form.is_required,
      });

      setTasks(prev => ({
        ...prev,
        [selectedStage]: [...(prev[selectedStage] || []), newTask].sort((a, b) => a.order_index - b.order_index)
      }));

      setIsCreating(false);
      resetForm();
      toast.success('Task created!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingTask) return;

    setSaving(true);
    try {
      const updated = await tasksService.update(editingTask.id, {
        name: form.name,
        name_id: form.name_id,
        description: form.description,
        description_id: form.description_id,
        type: form.type,
        max_file_size: form.max_file_size_mb,
        file_types: form.allowed_extensions,
        deadline: form.deadline || undefined,
        is_published: form.is_published,
        is_required: form.is_required,
      });

      setTasks(prev => ({
        ...prev,
        [editingTask.stage_id]: prev[editingTask.stage_id]?.map(t => t.id === updated.id ? updated : t) || []
      }));

      setEditingTask(null);
      resetForm();
      toast.success('Task updated!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (task: Task) => {
    if (!confirm('Delete this task? This cannot be undone.')) return;

    try {
      await tasksService.delete(task.id);
      setTasks(prev => ({
        ...prev,
        [task.stage_id]: prev[task.stage_id]?.filter(t => t.id !== task.id) || []
      }));
      toast.success('Task deleted');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete task');
    }
  };

  const handleTogglePublish = async (task: Task) => {
    try {
      const updated = await tasksService.update(task.id, { is_published: !task.is_published });
      setTasks(prev => ({
        ...prev,
        [task.stage_id]: prev[task.stage_id]?.map(t => t.id === updated.id ? updated : t) || []
      }));
      toast.success(updated.is_published ? 'Task published' : 'Task unpublished');
    } catch (e) {
      console.error(e);
      toast.error('Failed to toggle publish');
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      name_id: '',
      description: '',
      description_id: '',
      instructions: '',
      type: 'file_upload',
      max_file_size_mb: 5,
      allowed_extensions: ['.pdf'],
      deadline: '',
      is_required: true,
      is_published: false,
      rubric: [],
      order_index: 1,
    });
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      name: task.name,
      name_id: task.name_id || '',
      description: task.description || '',
      description_id: task.description_id || '',
      instructions: '',
      type: task.type,
      max_file_size_mb: task.max_file_size || 5,
      allowed_extensions: task.file_types || ['.pdf'],
      deadline: task.deadline || '',
      is_required: task.is_required ?? true,
      is_published: task.is_published,
      rubric: [],
      order_index: task.order_index,
    });
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'file_upload': return <FileText className="w-4 h-4" />;
      case 'link': return <Link className="w-4 h-4" />;
      case 'text': return <Text className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: Task['type']) => {
    switch (type) {
      case 'file_upload': return 'File Upload';
      case 'link': return 'Link Submit';
      case 'text': return 'Text Input';
      case 'presentation': return 'Presentation';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const currentTasks = selectedStage ? tasks[selectedStage] || [] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tasks Management</h1>
          <p className="text-gray-600">Manage submission tasks for each stage</p>
        </div>
        <button
          onClick={() => { setIsCreating(true); resetForm(); }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Stage Selector */}
      <div className="flex gap-2 flex-wrap">
        {stages.map((stage, idx) => (
          <button
            key={stage.id}
            onClick={() => setSelectedStage(stage.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedStage === stage.id
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-xs opacity-70 mr-1">Stage {idx + 1}:</span>
            {stage.name}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {selectedStage && (
        <div className="bg-white rounded-xl border border-gray-200">
          {currentTasks.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tasks for this stage</p>
              <p className="text-sm mt-1">Click "Add Task" to create one</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {currentTasks.map((task, idx) => (
                <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                  <div className="text-gray-400 cursor-grab">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="w-8 text-center text-sm text-gray-500 font-medium">
                    {idx + 1}
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    task.is_published ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {getTypeIcon(task.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">{task.name}</h3>
                      {task.is_published ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Published</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">Draft</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>{getTypeLabel(task.type)}</span>
                      {task.max_file_size && <span>Max {task.max_file_size}MB</span>}
                      {task.deadline && <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>}
                      {task.is_required && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePublish(task)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title={task.is_published ? 'Unpublish' : 'Publish'}
                    >
                      {task.is_published ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                    </button>
                    <button
                      onClick={() => openEdit(task)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(task)}
                      className="p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreating || editingTask) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <h2 className="text-xl font-bold mb-6">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name (English) *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                    placeholder="e.g., Business Model Canvas"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Name (Indonesian)</label>
                  <input
                    type="text"
                    value={form.name_id}
                    onChange={(e) => setForm({ ...form, name_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                    placeholder="e.g., Business Model Canvas"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Description (EN)</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                    rows={3}
                    placeholder="Task description..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description (ID)</label>
                  <textarea
                    value={form.description_id}
                    onChange={(e) => setForm({ ...form, description_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                    rows={3}
                    placeholder="Deskripsi task..."
                  />
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="text-sm font-medium text-gray-700">Submission Type</label>
                <div className="flex gap-2 mt-2">
                  {(['file_upload', 'text', 'link'] as Task['type'][]).map(type => (
                    <button
                      key={type}
                      onClick={() => setForm({ ...form, type })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        form.type === type
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {getTypeIcon(type)}
                      {getTypeLabel(type)}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Settings (only for file_upload) */}
              {form.type === 'file_upload' && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Max File Size (MB)</label>
                    <input
                      type="number"
                      value={form.max_file_size_mb}
                      onChange={(e) => setForm({ ...form, max_file_size_mb: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg mt-1"
                      min={1}
                      max={50}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Allowed Extensions</label>
                    <input
                      type="text"
                      value={form.allowed_extensions.join(', ')}
                      onChange={(e) => setForm({ ...form, allowed_extensions: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full px-3 py-2 border rounded-lg mt-1"
                      placeholder=".pdf, .doc, .pptx"
                    />
                  </div>
                </div>
              )}

              {/* Deadline */}
              <div>
                <label className="text-sm font-medium text-gray-700">Deadline (optional)</label>
                <input
                  type="datetime-local"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg mt-1"
                />
              </div>

              {/* Settings */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_required}
                    onChange={(e) => setForm({ ...form, is_required: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Required task</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Publish immediately</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-6 border-t">
                <button
                  onClick={editingTask ? handleUpdate : handleCreate}
                  disabled={saving || !form.name}
                  className="flex-1 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task')}
                </button>
                <button
                  onClick={() => { setIsCreating(false); setEditingTask(null); resetForm(); }}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
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

export default AdminTasks;