/**
 * Admin Announcements Management
 */

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Send, Loader2, Megaphone, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { announcementsService, competitionService, type Announcement } from '@/services/cibc.service';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Announcement>>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const comp = await competitionService.getActive();
      if (comp) {
        const data = await announcementsService.getAll(comp.id);
        setAnnouncements(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editForm.title || !editForm.content) {
      toast.error('Title and content required');
      return;
    }
    setSaving(true);
    try {
      const comp = await competitionService.getActive();
      if (editingId === 'new') {
        const newAnn = await announcementsService.create({
          ...editForm,
          competition_id: comp?.id,
          id: undefined
        } as Partial<Announcement>);
        setAnnouncements([newAnn, ...announcements]);
        toast.success('Announcement created!');
      } else {
        const updated = await announcementsService.update(editingId!, editForm);
        setAnnouncements(announcements.map(a => a.id === editingId ? updated : a));
        toast.success('Announcement updated!');
      }
      setEditingId(null);
      setEditForm({});
    } catch (_e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const updated = await announcementsService.publish(id);
      setAnnouncements(announcements.map(a => a.id === id ? updated : a));
      toast.success('Published!');
    } catch (_e) {
      toast.error('Failed to publish');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await announcementsService.delete(id);
      setAnnouncements(announcements.filter(a => a.id !== id));
      toast.success('Deleted');
    } catch (_e) {
      toast.error('Failed to delete');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-600 border-red-200';
      case 'success': return 'bg-green-100 text-green-600 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      default: return 'bg-blue-100 text-blue-600 border-blue-200';
    }
  };

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
          <p className="text-gray-600">Manage competition announcements</p>
        </div>
        <button
          onClick={() => { setEditingId('new'); setEditForm({ title: '', content: '', type: 'info' }); }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => {
          const TypeIcon = getTypeIcon(announcement.type);
          return (
            <div key={announcement.id} className={`bg-white rounded-xl border p-6 ${announcement.is_published ? '' : 'opacity-70'}`}>
              {editingId === announcement.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Title"
                  />
                  <textarea
                    value={editForm.content || ''}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={4}
                    placeholder="Content..."
                  />
                  <select
                    value={editForm.type || 'info'}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Announcement['type'] })}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-amber-500 text-white rounded-lg">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => { setEditingId(null); setEditForm({}); }} className="px-4 py-2 bg-gray-100 rounded-lg">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${getTypeColor(announcement.type)}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                      {!announcement.is_published && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">Draft</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{announcement.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {announcement.published_at
                        ? `Published: ${new Date(announcement.published_at).toLocaleString()}`
                        : 'Not published yet'}
                    </p>
                    <div className="flex gap-2 mt-3">
                      {!announcement.is_published && (
                        <button
                          onClick={() => handlePublish(announcement.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded text-sm"
                        >
                          <Send className="w-4 h-4" /> Publish
                        </button>
                      )}
                      <button
                        onClick={() => { setEditingId(announcement.id); setEditForm(announcement); }}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded text-sm"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {editingId === 'new' && (
          <div className="bg-white rounded-xl border border-amber-300 p-6">
            <h3 className="font-semibold mb-4">New Announcement</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editForm.title || ''}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Announcement title"
              />
              <textarea
                value={editForm.content || ''}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={4}
                placeholder="Write your announcement..."
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={editForm.type || 'info'}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value as Announcement['type'] })}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="urgent">Urgent</option>
                </select>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.is_published || false}
                    onChange={(e) => setEditForm({ ...editForm, is_published: e.target.checked })}
                  />
                  Publish immediately
                </label>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-amber-500 text-white rounded-lg">
                  {saving ? 'Creating...' : 'Create'}
                </button>
                <button onClick={() => { setEditingId(null); setEditForm({}); }} className="px-4 py-2 bg-gray-100 rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {announcements.length === 0 && editingId !== 'new' && (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No announcements yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;