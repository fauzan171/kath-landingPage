/**
 * Admin Site Settings
 */

import { useState, useEffect } from 'react';
import { Save, Loader2, Settings, Globe, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { siteSettingsService } from '@/services/content.service';

const DEFAULT_SETTINGS = [
  { key: 'site_name', label: 'Site Name', description: 'Website name displayed in browser tab' },
  { key: 'site_tagline', label: 'Tagline', description: 'Short tagline below site name' },
  { key: 'site_description', label: 'Site Description', description: 'Meta description for SEO' },
  { key: 'contact_email', label: 'Contact Email', description: 'Main contact email address' },
  { key: 'social_instagram', label: 'Instagram URL', description: 'Instagram profile link' },
  { key: 'social_linkedin', label: 'LinkedIn URL', description: 'LinkedIn company page' },
  { key: 'social_youtube', label: 'YouTube URL', description: 'YouTube channel link' },
  { key: 'social_tiktok', label: 'TikTok URL', description: 'TikTok profile link' },
  { key: 'google_maps_embed', label: 'Google Maps Embed', description: 'Google Maps embed URL' },
  { key: 'footer_copyright', label: 'Footer Copyright', description: 'Copyright text in footer' },
  { key: 'analytics_id', label: 'Google Analytics ID', description: 'GA4 Measurement ID (G-XXXXXX)' },
];

const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const all = await siteSettingsService.getAll();
      const map: Record<string, string> = {};
      all.forEach(s => { map[s.key] = s.value || ''; });
      setSettings(map);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(settings).map(([key, value]) => siteSettingsService.set(key, value))
      );
      toast.success('Settings saved!');
    } catch (_e) {
      toast.error('Failed to save settings');
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
          <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
          <p className="text-gray-600">Global website configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-800">General</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {DEFAULT_SETTINGS.filter(s => ['site_name', 'site_tagline', 'site_description', 'footer_copyright'].includes(s.key)).map(setting => (
              <div key={setting.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{setting.label}</label>
                <p className="text-xs text-gray-500 mb-1">{setting.description}</p>
                <input
                  type="text"
                  value={settings[setting.key] || ''}
                  onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-800">Contact & Social</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {DEFAULT_SETTINGS.filter(s => ['contact_email', 'social_instagram', 'social_linkedin', 'social_youtube', 'social_tiktok'].includes(s.key)).map(setting => (
              <div key={setting.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{setting.label}</label>
                <p className="text-xs text-gray-500 mb-1">{setting.description}</p>
                <input
                  type="text"
                  value={settings[setting.key] || ''}
                  onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  placeholder={setting.key.includes('social') ? 'https://...' : ''}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Integration Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-800">Integrations</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {DEFAULT_SETTINGS.filter(s => ['google_maps_embed', 'analytics_id'].includes(s.key)).map(setting => (
              <div key={setting.key} className={setting.key === 'google_maps_embed' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{setting.label}</label>
                <p className="text-xs text-gray-500 mb-1">{setting.description}</p>
                {setting.key === 'google_maps_embed' ? (
                  <textarea
                    value={settings[setting.key] || ''}
                    onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    rows={2}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                ) : (
                  <input
                    type="text"
                    value={settings[setting.key] || ''}
                    onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    placeholder={setting.key === 'analytics_id' ? 'G-XXXXXX' : ''}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;