'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { supabase } from '@/lib/supabase';
import type { AboutPage, Principle } from '@/types/database';

export default function AboutAdmin() {
  const [aboutPage, setAboutPage] = useState<AboutPage | null>(null);
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPrinciple, setEditingPrinciple] = useState<Principle | null>(null);
  const [isAddingPrinciple, setIsAddingPrinciple] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [missionImageUrl, setMissionImageUrl] = useState('');
  const [valuesImageUrl, setValuesImageUrl] = useState('');

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
        hero_image: heroImageUrl || (formData.get('hero_image') as string) || aboutPage.hero_image,
        mission_title: formData.get('mission_title') as string,
        mission_content: formData.get('mission_content') as string,
        mission_image: missionImageUrl || (formData.get('mission_image') as string) || aboutPage.mission_image,
        values_title: formData.get('values_title') as string,
        values_content: formData.get('values_content') as string,
        values_image: valuesImageUrl || (formData.get('values_image') as string) || aboutPage.values_image,
        principles_section_title: formData.get('principles_section_title') as string,
      })
      .eq('id', aboutPage.id);

    if (!error) {
      alert('About page updated successfully!');
      setHeroImageUrl('');
      setMissionImageUrl('');
      setValuesImageUrl('');
      fetchData();
    } else {
      console.error('Error updating about page:', error);
      alert('Error updating about page: ' + error.message);
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
      alert(editingPrinciple ? 'Principle updated successfully!' : 'Principle added successfully!');
      setEditingPrinciple(null);
      setIsAddingPrinciple(false);
      fetchData();
    } else {
      alert('Error saving principle');
    }
    setSaving(false);
  };

  const handleDeletePrinciple = async (id: string) => {
    if (!confirm('Are you sure you want to delete this principle?')) return;

    const { error } = await supabase.from('principles').delete().eq('id', id);

    if (!error) {
      alert('Principle deleted successfully!');
      fetchData();
    } else {
      alert('Error deleting principle');
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
                <div>
                  <label className="block text-sm font-medium mb-2">Hero Image</label>
                  <ImageUpload
                    currentImage={heroImageUrl || aboutPage?.hero_image}
                    onImageUploaded={setHeroImageUrl}
                    folder="about"
                  />
                  <p className="text-xs text-gray-500 mt-2">أو أدخل رابط الصورة:</p>
                  <input
                    type="url"
                    name="hero_image"
                    defaultValue={aboutPage?.hero_image || ''}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Mission Section */}
            <div className="border-b pb-6">
              <h3 className="font-bold mb-4">Mission Section</h3>
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
              <h3 className="font-bold mb-4">Values Section</h3>
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
                <div>
                  <label className="block text-sm font-medium mb-2">Values Image</label>
                  <ImageUpload
                    currentImage={valuesImageUrl || aboutPage?.values_image}
                    onImageUploaded={setValuesImageUrl}
                    folder="about"
                  />
                  <p className="text-xs text-gray-500 mt-2">أو أدخل رابط الصورة:</p>
                  <input
                    type="url"
                    name="values_image"
                    defaultValue={aboutPage?.values_image || ''}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Principles Section Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Principles Section Title</label>
              <input
                type="text"
                name="principles_section_title"
                defaultValue={aboutPage?.principles_section_title}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
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
    </AdminLayout>
  );
}
