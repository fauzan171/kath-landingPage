/**
 * Admin Statistics Editor
 */

import { useState, useEffect } from 'react';
import { Save, Loader2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { statisticsService, type Statistic } from '@/services/content.service';

const ICONS = ['users', 'calendar', 'award', 'star', 'heart', 'briefcase', 'globe', 'trophy'];

const AdminStatistics = () => {
  const [items, setItems] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try {
      setItems(await statisticsService.getAll());
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (id: string, field: keyof Statistic, value: string | number | boolean) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(items.map(item => statisticsService.update(item.id, item)));
      toast.success('Statistics saved!');
    } catch (e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
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
          <h1 className="text-2xl font-bold text-gray-800">Statistics</h1>
          <p className="text-gray-600">Key numbers displayed on homepage</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <select
                value={item.icon || 'star'}
                onChange={(e) => updateItem(item.id, 'icon', e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                {ICONS.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-1 mb-2">
              <input
                type="text"
                value={item.value}
                onChange={(e) => updateItem(item.id, 'value', e.target.value)}
                className="text-3xl font-bold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-amber-500 focus:outline-none w-24"
              />
              <input
                type="text"
                value={item.suffix || ''}
                onChange={(e) => updateItem(item.id, 'suffix', e.target.value)}
                className="text-xl text-amber-500 font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-amber-500 focus:outline-none w-12"
                placeholder="+"
              />
            </div>

            <div className="space-y-1">
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                className="w-full text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-amber-500 focus:outline-none"
                placeholder="Label (EN)"
              />
              <input
                type="text"
                value={item.label_id || ''}
                onChange={(e) => updateItem(item.id, 'label_id', e.target.value)}
                className="w-full text-sm text-gray-400 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-amber-500 focus:outline-none"
                placeholder="Label (ID)"
              />
            </div>

            <div className="flex items-center gap-2 mt-3">
              <label className="flex items-center gap-1 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={item.is_active}
                  onChange={(e) => updateItem(item.id, 'is_active', e.target.checked)}
                  className="rounded"
                />
                Active
              </label>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">No statistics found. Please run the SQL setup first.</p>
        </div>
      )}
    </div>
  );
};

export default AdminStatistics;