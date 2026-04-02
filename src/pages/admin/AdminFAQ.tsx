/**
 * Admin FAQ Editor
 */

import { useState, useEffect } from 'react';
import { Plus, Loader2, ChevronUp, ChevronDown, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { faqService, type FAQ } from '@/services/content.service';

const CATEGORIES = ['general', 'services', 'pricing', 'events', 'booking', 'other'];

const AdminFAQ = () => {
  const [items, setItems] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FAQ>>({});
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try {
      setItems(await faqService.getAll());
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editForm.question || !editForm.answer) {
      toast.error('Question and answer are required');
      return;
    }
    try {
      if (editingId === 'new') {
        const newItem = await faqService.create({
          ...editForm,
          category: editForm.category || 'general',
          order_index: items.length,
          is_active: true,
        });
        setItems([...items, newItem]);
        toast.success('FAQ created!');
      } else {
        const updated = await faqService.update(editingId!, editForm);
        setItems(items.map(i => i.id === editingId ? updated : i));
        toast.success('FAQ updated!');
      }
      setEditingId(null);
      setEditForm({});
    } catch (e) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await faqService.delete(id);
      setItems(items.filter(i => i.id !== id));
      toast.success('Deleted');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    const index = items.findIndex(i => i.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const newItems = [...items];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];

    // Update order_index in database
    try {
      await faqService.update(id, { order_index: swapIndex });
      await faqService.update(items[swapIndex].id, { order_index: index });
      setItems(newItems);
    } catch (e) {
      toast.error('Failed to reorder');
    }
  };

  const filteredItems = filter === 'all' ? items : items.filter(i => i.category === filter);

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
          <h1 className="text-2xl font-bold text-gray-800">FAQ</h1>
          <p className="text-gray-600">Frequently asked questions</p>
        </div>
        <button
          onClick={() => { setEditingId('new'); setEditForm({ question: '', answer: '', category: 'general' }); }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-sm capitalize ${filter === cat ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredItems.map((item, index) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
            {editingId === item.id ? (
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Question (English)</label>
                    <input
                      type="text"
                      value={editForm.question || ''}
                      onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Question *"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Question (Indonesian)</label>
                    <input
                      type="text"
                      value={editForm.question_id || ''}
                      onChange={(e) => setEditForm({ ...editForm, question_id: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Pertanyaan (opsional)"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Answer (English)</label>
                    <textarea
                      value={editForm.answer || ''}
                      onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                      placeholder="Answer *"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Answer (Indonesian)</label>
                    <textarea
                      value={editForm.answer_id || ''}
                      onChange={(e) => setEditForm({ ...editForm, answer_id: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                      placeholder="Jawaban (opsional)"
                    />
                  </div>
                </div>
                <select
                  value={editForm.category || 'general'}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Save</button>
                  <button onClick={() => { setEditingId(null); setEditForm({}); }} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.question}</h3>
                  {item.question_id && <p className="text-sm text-gray-500 mb-1">{item.question_id}</p>}
                  <p className="text-gray-600 text-sm mt-1">{item.answer}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">{item.category}</span>
                    <button
                      onClick={() => moveItem(item.id, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveItem(item.id, 'down')}
                      disabled={index === filteredItems.length - 1}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
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
        ))}

        {editingId === 'new' && (
          <div className="bg-white rounded-lg border border-amber-300 p-4">
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Question (English) *</label>
                  <input
                    type="text"
                    value={editForm.question || ''}
                    onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="What is your question?"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Question (Indonesian)</label>
                  <input
                    type="text"
                    value={editForm.question_id || ''}
                    onChange={(e) => setEditForm({ ...editForm, question_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Apa pertanyaan Anda?"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Answer (English) *</label>
                  <textarea
                    value={editForm.answer || ''}
                    onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Write the answer here..."
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Answer (Indonesian)</label>
                  <textarea
                    value={editForm.answer_id || ''}
                    onChange={(e) => setEditForm({ ...editForm, answer_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Tulis jawaban di sini..."
                  />
                </div>
              </div>
              <select
                value={editForm.category || 'general'}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-4 py-2 bg-amber-500 text-white rounded-lg">Create FAQ</button>
                <button onClick={() => { setEditingId(null); setEditForm({}); }} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFAQ;