/**
 * Admin Contact Info Editor
 */

import { useState, useEffect } from 'react';
import { Plus, Loader2, Phone, Mail, MapPin, MessageCircle, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { contactInfoService, type ContactInfo } from '@/services/content.service';

const TYPES = ['phone', 'email', 'whatsapp', 'address', 'social', 'other'];
const ICONS = ['phone', 'mail', 'map-pin', 'message-circle', 'globe', 'link'];

const AdminContact = () => {
  const [items, setItems] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ContactInfo>>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try {
      setItems(await contactInfoService.getAll());
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editForm.type || !editForm.value) {
      toast.error('Type and value are required');
      return;
    }
    try {
      if (editingId === 'new') {
        const newItem = await contactInfoService.create({
          ...editForm,
          order_index: items.length,
          is_active: true,
        });
        setItems([...items, newItem]);
        toast.success('Contact added!');
      } else {
        const updated = await contactInfoService.update(editingId!, editForm);
        setItems(items.map(i => i.id === editingId ? updated : i));
        toast.success('Updated!');
      }
      setEditingId(null);
      setEditForm({});
    } catch (_e) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact?')) return;
    try {
      await contactInfoService.delete(id);
      setItems(items.filter(i => i.id !== id));
      toast.success('Deleted');
    } catch (_e) {
      toast.error('Failed to delete');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'phone': return Phone;
      case 'email': return Mail;
      case 'whatsapp': return MessageCircle;
      case 'address': return MapPin;
      case 'social': return Globe;
      default: return Globe;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contact Information</h1>
          <p className="text-gray-600">Contact details displayed on website</p>
        </div>
        <button
          onClick={() => { setEditingId('new'); setEditForm({ type: 'phone', value: '' }); }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = getIcon(item.icon || item.type);
          return (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
              {editingId === item.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={editForm.type || 'phone'}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    >
                      {TYPES.map(t => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                    <select
                      value={editForm.icon || 'phone'}
                      onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    >
                      {ICONS.map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={editForm.label || ''}
                    onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Label (e.g., Main Office, Support)"
                  />
                  <input
                    type="text"
                    value={editForm.value || ''}
                    onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Value (phone, email, address...)"
                  />
                  <input
                    type="text"
                    value={editForm.link || ''}
                    onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Link (e.g., tel:+62..., https://wa.me/...)"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Save</button>
                    <button onClick={() => { setEditingId(null); setEditForm({}); }} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">{item.type}</span>
                      {item.label && <span className="text-sm font-medium text-gray-700">{item.label}</span>}
                    </div>
                    <p className="text-gray-800 font-medium mt-1">{item.value}</p>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                        {item.link}
                      </a>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => { setEditingId(item.id); setEditForm(item); }}
                        className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {editingId === 'new' && (
          <div className="bg-white rounded-lg border border-amber-300 p-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Type</label>
                  <select
                    value={editForm.type || 'phone'}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {TYPES.map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Icon</label>
                  <select
                    value={editForm.icon || 'phone'}
                    onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {ICONS.map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>
              <input
                type="text"
                value={editForm.label || ''}
                onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Label (e.g., Main Office)"
              />
              <input
                type="text"
                value={editForm.value || ''}
                onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Value (phone, email, address...) *"
              />
              <input
                type="text"
                value={editForm.link || ''}
                onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Link (e.g., tel:+62..., https://wa.me/...)"
              />
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Add Contact</button>
                <button onClick={() => { setEditingId(null); setEditForm({}); }} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {items.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700">No contact info yet. Add your first contact!</p>
        </div>
      )}
    </div>
  );
};

export default AdminContact;