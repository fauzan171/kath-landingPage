/**
 * Admin Testimonials Editor
 */

import { useState, useEffect } from 'react';
import { Plus, Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { testimonialsService, type Testimonial } from '@/services/content.service';

const AdminTestimonials = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Testimonial>>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try { setItems(await testimonialsService.getAll()); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!editForm.name || !editForm.content) { toast.error('Name and content required'); return; }
    try {
      if (editingId === 'new') {
        const newItem = await testimonialsService.create({ ...editForm, order_index: items.length, is_active: true, rating: 5 });
        setItems([...items, newItem]);
        toast.success('Created!');
      } else {
        const updated = await testimonialsService.update(editingId!, editForm);
        setItems(items.map(i => i.id === editingId ? updated : i));
        toast.success('Updated!');
      }
      setEditingId(null); setEditForm({});
    } catch (_e) { toast.error('Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try { await testimonialsService.delete(id); setItems(items.filter(i => i.id !== id)); toast.success('Deleted'); } catch (_e) { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Testimonials</h1>
          <p className="text-gray-600">Client reviews and feedback</p>
        </div>
        <button onClick={() => { setEditingId('new'); setEditForm({ name: '', content: '', rating: 5 }); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
            {editingId === item.id ? (
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="px-3 py-2 border rounded-lg" placeholder="Name *" />
                  <input type="text" value={editForm.role || ''} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="px-3 py-2 border rounded-lg" placeholder="Role/Title" />
                </div>
                <input type="text" value={editForm.company || ''} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Company" />
                <textarea value={editForm.content || ''} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} placeholder="Testimonial content *" />
                <input type="text" value={editForm.avatar || ''} onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Avatar URL" />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Save</button>
                  <button onClick={() => { setEditingId(null); setEditForm({}); }} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                {item.avatar && <img src={item.avatar} className="w-12 h-12 rounded-full object-cover" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <span className="text-sm text-gray-500">{item.role} {item.company && `at ${item.company}`}</span>
                  </div>
                  <div className="flex items-center gap-1 my-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < (item.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                  </div>
                  <p className="text-gray-600 text-sm">"{item.content}"</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => { setEditingId(item.id); setEditForm(item); }} className="text-xs px-2 py-1 bg-gray-100 rounded">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {editingId === 'new' && (
          <div className="bg-white rounded-lg border border-amber-300 p-4">
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="px-3 py-2 border rounded-lg" placeholder="Client Name *" />
                <input type="text" value={editForm.role || ''} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="px-3 py-2 border rounded-lg" placeholder="Role/Title" />
              </div>
              <input type="text" value={editForm.company || ''} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Company" />
              <textarea value={editForm.content || ''} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} placeholder="What did they say? *" />
              <input type="text" value={editForm.avatar || ''} onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Avatar image URL (optional)" />
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Create</button>
                <button onClick={() => { setEditingId(null); setEditForm({}); }} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;