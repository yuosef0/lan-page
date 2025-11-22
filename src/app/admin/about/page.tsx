'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import Toast from '@/components/admin/Toast';
import { supabase } from '@/lib/supabase';
import type { AboutPage, Principle } from '@/types/database';

export default function AboutAdmin() {
  const [aboutPage, setAboutPage] = useState<AboutPage | null>(null);
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPrinciple, setEditingPrinciple] = useState<Principle | null>(null);
  const [isAddingPrinciple, setIsAddingPrinciple] = useState(false);
  const [missionImageUrl, setMissionImageUrl] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [aboutRes, principlesRes] = await Promise.all([
      supabase.from('about_page').select('*').single(),
      supabase.from('principles').select('*').order('order'),
    ]);

    if (aboutRes.data) setAboutPage(aboutRes.data);
    if (principlesRes.data) setPrinciples(principlesRes.data);
    setLoading(false);
  };

  const handleSaveAbout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!aboutPage) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase
      .from('about_page')
      .update({
        hero_title: formData.get('hero_title') as string,
        hero_subtitle: formData.get('hero_subtitle') as string,
        mission_title: formData.get('mission_title') as string,
        mission_content: formData.get('mission_content') as string,
        mission_image: missionImageUrl || (formData.get('mission_image') as string) || aboutPage.mission_image,
        show_mission: formData.get('show_mission') === 'on',
        values_title: formData.get('values_title') as string,
        values_content: formData.get('values_content') as string,
        show_values: formData.get('show_values') === 'on',
        principles_section_title: formData.get('principles_section_title') as string,
        show_principles: formData.get('show_principles') === 'on',
        team_section_title: formData.get('team_section_title') as string,
        show_team: formData.get('show_team') === 'on',
      })
      .eq('id', aboutPage.id);

    if (!error) {
      setToast({ message: 'تم تحديث صفحة About بنجاح!', type: 'success' });
      setMissionImageUrl('');
      fetchData();
    } else {
      console.error('Error updating about page:', error);
      setToast({ message: 'خطأ في التحديث: ' + error.message, type: 'error' });
    }
    setSaving(false);
  };

  const handleSavePrinciple = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const principleData = {
      icon: formData.get('icon') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      order: parseInt(formData.get('order') as string),
    };

    let error;
    if (editingPrinciple) {
      const res = await supabase.from('principles').update(principleData).eq('id', editingPrinciple.id);
      error = res.error;
    } else {
      const res = await supabase.from('principles').insert(principleData);
      error = res.error;
    }

    if (!error) {
      setToast({
        message: editingPrinciple ? 'تم تحديث المبدأ بنجاح!' : 'تم إضافة المبدأ بنجاح!',
        type: 'success'
      });
      setEditingPrinciple(null);
      setIsAddingPrinciple(false);
      fetchData();
    } else {
      setToast({ message: 'خطأ في حفظ المبدأ', type: 'error' });
    }
    setSaving(false);
  };

  const handleDeletePrinciple = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المبدأ؟')) return;

    const { error } = await supabase.from('principles').delete().eq('id', id);

    if (!error) {
      setToast({ message: 'تم حذف المبدأ بنجاح!', type: 'success' });
      fetchData();
    } else {
      setToast({ message: 'خطأ في حذف المبدأ', type: 'error' });
    }
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
          <h1 className="text-3xl font-bold text-gray-900">About Page</h1>
          <p className="text-gray-600 mt-1">Manage about page content and principles</p>
        </div>

        {/* About Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Page Content</h2>
          <form onSubmit={handleSaveAbout} className="space-y-6">
            {/* Hero Section */}
            <div className="border-b pb-6">
              <h3 className="font-bold mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="hero_title"
                    defaultValue={aboutPage?.hero_title}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <textarea
                    name="hero_subtitle"
                    defaultValue={aboutPage?.hero_subtitle}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Mission Section */}
            <div className="border-b pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Mission Section</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm font-medium">عرض في الموقع</span>
                  <div className="relative inline-block">
                    <input
                      type="checkbox"
                      name="show_mission"
                      defaultChecked={aboutPage?.show_mission !== false}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </div>
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="mission_title"
                    defaultValue={aboutPage?.mission_title}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    name="mission_content"
                    defaultValue={aboutPage?.mission_content}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mission Image</label>
                  <ImageUpload
                    currentImage={missionImageUrl || aboutPage?.mission_image}
                    onImageUploaded={setMissionImageUrl}
                    folder="about"
                    onSuccess={(msg) => setToast({ message: msg, type: 'success' })}
                    onError={(msg) => setToast({ message: msg, type: 'error' })}
                  />
                  <p className="text-xs text-gray-500 mt-2">أو أدخل رابط الصورة:</p>
                  <input
                    type="url"
                    name="mission_image"
                    defaultValue={aboutPage?.mission_image || ''}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="border-b pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Values Section</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm font-medium">عرض في الموقع</span>
                  <div className="relative inline-block">
                    <input
                      type="checkbox"
                      name="show_values"
                      defaultChecked={aboutPage?.show_values !== false}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </div>
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="values_title"
                    defaultValue={aboutPage?.values_title}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    name="values_content"
                    defaultValue={aboutPage?.values_content}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Principles Section */}
            <div className="border-b pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Principles Section</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm font-medium">عرض في الموقع</span>
                  <div className="relative inline-block">
                    <input
                      type="checkbox"
                      name="show_principles"
                      defaultChecked={aboutPage?.show_principles !== false}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <input
                  type="text"
                  name="principles_section_title"
                  defaultValue={aboutPage?.principles_section_title}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Team Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Team Section</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm font-medium">عرض في الموقع</span>
                  <div className="relative inline-block">
                    <input
                      type="checkbox"
                      name="show_team"
                      defaultChecked={aboutPage?.show_team !== false}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <input
                  type="text"
                  name="team_section_title"
                  defaultValue={aboutPage?.team_section_title}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
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

        {/* Principles */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Principles</h2>
            <button
              onClick={() => setIsAddingPrinciple(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Add Principle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {principles.map((principle) => (
              <div key={principle.id} className="border rounded-lg p-4">
                <span className="material-symbols-outlined text-primary text-4xl mb-3 block">{principle.icon}</span>
                <h3 className="font-bold mb-2">{principle.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{principle.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPrinciple(principle)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeletePrinciple(principle.id)}
                    className="flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Principle Modal */}
        {(isAddingPrinciple || editingPrinciple) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">{editingPrinciple ? 'Edit Principle' : 'Add New Principle'}</h3>
              <form onSubmit={handleSavePrinciple} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Icon (Material Symbol)</label>
                  <input
                    type="text"
                    name="icon"
                    defaultValue={editingPrinciple?.icon}
                    required
                    placeholder="e.g., handshake, verified, diversity_3"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Find icons at: fonts.google.com/icons</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingPrinciple?.title}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingPrinciple?.description}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingPrinciple?.order ?? principles.length + 1}
                    required
                    min="1"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPrinciple(null);
                      setIsAddingPrinciple(false);
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
