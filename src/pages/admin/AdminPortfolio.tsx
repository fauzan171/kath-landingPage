/**
 * Admin Portfolio Editor
 */

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { portfolioService, type Portfolio } from '@/services/content.service';

const CATEGORIES = ['All', 'Wedding', 'Corporate', 'Exhibition', 'Private'];

const AdminPortfolio = () => {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Portfolio>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try {
      const data = await portfolioService.getAll();
      setItems(data);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editForm.title) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      if (editingId === 'new') {
        const newItem = await portfolioService.create({ ...editForm, order_index: items.length, is_active: true, category: 'All' });
        setItems([...items, newItem]);
        toast.success('Created!');
      } else {
        const updated = await portfolioService.update(editingId!, editForm);
        setItems(items.map(i => i.id === editingId ? updated : i));
        toast.success('Updated!');
      }
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      await portfolioService.delete(id);
      setItems(items.filter(i => i.id !== id));
      toast.success('Deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const toggleActive = async (item: Portfolio) => {
    try {
      const updated = await portfolioService.update(item.id, { is_active: !item.is_active });
      setItems(items.map(i => i.id === item.id ? updated : i));
    } catch (error) {
      toast.error('Failed');
    }
  };

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Portfolio</h1>
          <p className="text-gray-600">Showcase your best work</p>
        </div>
        <button onClick={() => { setEditingId('new'); setEditForm({ title: '', category: 'All', is_active: true }); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className={`bg-white rounded-lg border ${item.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
            {item.image && <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-t-lg" />}
            <div className="p-4">
              <h3 className="font-medium text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.category} • {item.year || 'N/A'}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => toggleActive(item)} className={`px-2 py-1 rounded text-xs ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => { setEditingId(item.id); setEditForm(item); }} className="p-1 text-gray-500 hover:text-amber-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* New/Edit Form */}
        {editingId && (
          <div className="bg-white rounded-lg border border-amber-300 p-4 col-span-full md:col-span-1">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={editForm.title || ''} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={editForm.category || 'All'} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input type="text" value={editForm.year || ''} onChange={(e) => setEditForm({ ...editForm, year: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="2024" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" value={editForm.location || ''} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="text" value={editForm.image || ''} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editForm.description || ''} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-amber-500 text-white rounded-lg">{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={() => { setEditingId(null); setEditForm({}); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortfolio;