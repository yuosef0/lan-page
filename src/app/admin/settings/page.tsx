'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import Toast from '@/components/admin/Toast';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types/database';

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase
      .from('site_settings')
      .update({
        site_name: formData.get('site_name') as string,
        logo_url: logoUrl || (formData.get('logo_url') as string) || settings.logo_url,
      })
      .eq('id', settings.id);

    if (!error) {
      setToast({ message: 'تم تحديث الإعدادات بنجاح!', type: 'success' });
      setLogoUrl('');
      fetchData();
    } else {
      console.error('Error updating settings:', error);
      setToast({ message: 'خطأ في التحديث: ' + error.message, type: 'error' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-600 mt-1">Manage site logo and branding</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input
                type="text"
                name="site_name"
                defaultValue={settings?.site_name || ''}
                required
                placeholder="Apex & Base"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">This will appear in the header</p>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Site Logo</label>
              <ImageUpload
                currentImage={logoUrl || settings?.logo_url}
                onImageUploaded={setLogoUrl}
                folder="branding"
                onSuccess={(msg) => setToast({ message: msg, type: 'success' })}
                onError={(msg) => setToast({ message: msg, type: 'error' })}
              />
              <p className="text-xs text-gray-500 mt-2">أو أدخل رابط اللوجو:</p>
              <input
                type="url"
                name="logo_url"
                defaultValue={settings?.logo_url || ''}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2 border rounded-lg mt-1"
              />
              <p className="text-xs text-gray-500 mt-2">Recommended size: 200x200px (PNG with transparent background)</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AdminLayout>
  );
}
