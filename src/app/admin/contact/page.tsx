'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Toast from '@/components/admin/Toast';
import { supabase } from '@/lib/supabase';
import type { ContactInfo } from '@/types/database';

export default function ContactAdmin() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('contact_info').select('*').single();
    if (data) setContactInfo(data);
    setLoading(false);
  };

  // Extract src URL from iframe HTML if needed
  const extractMapUrl = (input: string): string => {
    if (!input) return '';

    // If it's already a URL, return it
    if (input.startsWith('http')) return input;

    // Try to extract src from iframe HTML
    const srcMatch = input.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }

    return input;
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contactInfo) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);

    // Extract map URL from iframe code if necessary
    const mapInput = formData.get('office_map_embed_url') as string;
    const mapUrl = extractMapUrl(mapInput);

    const { error } = await supabase
      .from('contact_info')
      .update({
        hero_title: formData.get('hero_title') as string,
        hero_subtitle: formData.get('hero_subtitle') as string,
        office_title: formData.get('office_title') as string,
        office_address: formData.get('office_address') as string,
        office_phone: formData.get('office_phone') as string,
        office_email: formData.get('office_email') as string,
        office_map_embed_url: mapUrl,
      })
      .eq('id', contactInfo.id);

    if (!error) {
      setToast({ message: 'Contact information updated successfully!', type: 'success' });
      fetchData();
    } else {
      setToast({ message: 'Error updating contact information', type: 'error' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Information</h1>
          <p className="text-gray-600 mt-1">Manage contact page content</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Contact Details</h2>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Hero Section */}
            <div className="border-b pb-6">
              <h3 className="font-bold mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="hero_title"
                    defaultValue={contactInfo?.hero_title}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <textarea
                    name="hero_subtitle"
                    defaultValue={contactInfo?.hero_subtitle}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Office Information */}
            <div>
              <h3 className="font-bold mb-4">Office Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Office Title</label>
                  <input
                    type="text"
                    name="office_title"
                    defaultValue={contactInfo?.office_title}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea
                    name="office_address"
                    defaultValue={contactInfo?.office_address}
                    required
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="office_phone"
                    defaultValue={contactInfo?.office_phone}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="office_email"
                    defaultValue={contactInfo?.office_email}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Google Maps Embed URL</label>
                  <textarea
                    name="office_map_embed_url"
                    defaultValue={contactInfo?.office_map_embed_url || ''}
                    placeholder="Paste the full iframe code or just the URL"
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                  />
                  <div className="text-xs text-gray-600 mt-2 space-y-1 bg-gray-50 p-3 rounded">
                    <p className="font-medium">📍 How to add the map:</p>
                    <ol className="list-decimal list-inside space-y-1 mr-4">
                      <li>Open Google Maps and search for your location</li>
                      <li>Click "Share"</li>
                      <li>Select "Embed a map"</li>
                      <li>Copy the entire code and paste it here (or copy just the URL from src)</li>
                    </ol>
                    <p className="text-green-600 mt-2">✓ You can paste the entire code, the URL will be extracted automatically</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
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
