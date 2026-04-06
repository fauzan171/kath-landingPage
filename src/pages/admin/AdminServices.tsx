/**
 * Admin Services Editor
 */

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { servicesService, type Service } from '@/services/content.service';

const ICONS = ['Heart', 'Building', 'Layout', 'PartyPopper', 'Music', 'Camera', 'Gift', 'Star'];

const AdminServices = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Service>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await servicesService.getAll();
      setItems(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: Service) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editForm.name) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingId === 'new') {
        const newItem = await servicesService.create({
          ...editForm,
          order_index: items.length,
          is_active: true,
        });
        setItems([...items, newItem]);
        toast.success('Service created!');
      } else {
        const updated = await servicesService.update(editingId!, editForm);
        setItems(items.map(i => i.id === editingId ? updated : i));
        toast.success('Service updated!');
      }
      cancelEdit();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await servicesService.delete(id);
      setItems(items.filter(i => i.id !== id));
      toast.success('Service deleted');
    } catch (_error) {
      toast.error('Failed to delete');
    }
  };

  const toggleActive = async (item: Service) => {
    try {
      const updated = await servicesService.update(item.id, { is_active: !item.is_active });
      setItems(items.map(i => i.id === item.id ? updated : i));
    } catch (_error) {
      toast.error('Failed to update');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Services</h1>
          <p className="text-gray-600">Manage your service offerings</p>
        </div>
        <button
          onClick={() => {
            setEditingId('new');
            setEditForm({ name: '', icon: 'Heart', is_active: true, order_index: items.length });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
            {editingId === item.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN)</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (ID)</label>
                    <input
                      type="text"
                      value={editForm.name_id || ''}
                      onChange={(e) => setEditForm({ ...editForm, name_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (ID)</label>
                    <textarea
                      value={editForm.description_id || ''}
                      onChange={(e) => setEditForm({ ...editForm, description_id: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <select
                      value={editForm.icon || 'Heart'}
                      onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={editForm.image || ''}
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-amber-500 text-white rounded-lg">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={cancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 font-bold">{item.order_index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description?.substring(0, 60)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(item)}
                    className={`px-3 py-1 rounded text-sm ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {item.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button onClick={() => startEdit(item)} className="p-2 text-gray-500 hover:text-amber-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* New Item Form */}
        {editingId === 'new' && (
          <div className="bg-white rounded-lg border border-amber-300 p-4">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN) *</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Service name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (ID)</label>
                  <input
                    type="text"
                    value={editForm.name_id || ''}
                    onChange={(e) => setEditForm({ ...editForm, name_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (ID)</label>
                  <textarea
                    value={editForm.description_id || ''}
                    onChange={(e) => setEditForm({ ...editForm, description_id: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={editForm.icon || 'Heart'}
                  onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-amber-500 text-white rounded-lg">
                  {saving ? 'Creating...' : 'Create'}
                </button>
                <button onClick={cancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;