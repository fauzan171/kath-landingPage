/**
 * Admin News Editor
 */

import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { newsService, type News } from '@/services/content.service';

const AdminNews = () => {
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<News>>({});
  const [saving, setSaving] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try { setItems(await newsService.getAll()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!editForm.title) { toast.error('Title required'); return; }
    setSaving(true);
    try {
      if (editingId === 'new') {
        const newItem = await newsService.create({ ...editForm, is_published: false });
        setItems([newItem, ...items]);
        toast.success('Created!');
      } else {
        const updated = await newsService.update(editingId!, { ...editForm });
        setItems(items.map(i => i.id === editingId ? updated : i));
        toast.success('Updated!');
      }
      setEditingId(null); setEditForm({});
    } catch (_e) { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const handlePublish = async (item: News) => {
    try {
      const updated = await newsService.update(item.id, { is_published: !item.is_published, published_at: !item.is_published ? new Date().toISOString() : undefined });
      setItems(items.map(i => i.id === item.id ? updated : i));
      toast.success(item.is_published ? 'Unpublished' : 'Published');
    } catch (_e) { toast.error('Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try { await newsService.delete(id); setItems(items.filter(i => i.id !== id)); toast.success('Deleted'); }
    catch (_e) { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">News & Blog</h1>
          <p className="text-gray-600">Publish articles and updates</p>
        </div>
        <button onClick={() => { setEditingId('new'); setEditForm({ title: '' }); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg">
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
            {editingId === item.id ? (
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" value={editForm.title || ''} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="px-3 py-2 border rounded-lg" placeholder="Title" />
                </div>
                <textarea value={editForm.content || ''} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={4} placeholder="Content (Markdown)" />
                <input type="text" value={editForm.image_url || ''} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Image URL" />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 bg-amber-500 text-white rounded-lg">{saving ? 'Saving...' : 'Save'}</button>
                  <button onClick={() => { setEditingId(null); setEditForm({}); }} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                {item.image_url && <img src={item.image_url} className="w-24 h-24 object-cover rounded-lg" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${item.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.content?.substring(0, 100)}...</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handlePublish(item)} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">
                      {item.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => { setEditingId(item.id); setEditForm(item); }} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {editingId === 'new' && (
          <div className="bg-white rounded-lg border border-amber-300 p-4">
            <div className="space-y-3">
              <input type="text" value={editForm.title || ''} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Title *" />
              <textarea value={editForm.content || ''} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={6} placeholder="Article content (Markdown supported)" />
              <input type="text" value={editForm.image_url || ''} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Featured image URL" />
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-4 py-2 bg-amber-500 text-white rounded-lg">{saving ? 'Creating...' : 'Create Draft'}</button>
                <button onClick={() => { setEditingId(null); setEditForm({}); }} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNews;