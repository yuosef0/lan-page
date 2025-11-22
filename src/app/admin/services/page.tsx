'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import Toast from '@/components/admin/Toast';
import { supabase } from '@/lib/supabase';
import type { ServicesPage, Service } from '@/types/database';

export default function ServicesAdmin() {
  const [servicesPage, setServicesPage] = useState<ServicesPage | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [serviceImageUrl, setServiceImageUrl] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [pageRes, servicesRes] = await Promise.all([
      supabase.from('services_page').select('*').single(),
      supabase.from('services').select('*').order('order'),
    ]);

    if (pageRes.data) setServicesPage(pageRes.data);
    if (servicesRes.data) setServices(servicesRes.data);
    setLoading(false);
  };

  const handleSaveHero = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!servicesPage) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase
      .from('services_page')
      .update({
        hero_title: formData.get('hero_title') as string,
        hero_subtitle: formData.get('hero_subtitle') as string,
        hero_image: heroImageUrl || (formData.get('hero_image') as string) || servicesPage.hero_image,
      })
      .eq('id', servicesPage.id);

    if (!error) {
      alert('Hero section updated successfully!');
      setHeroImageUrl('');
      fetchData();
    } else {
      console.error('Error updating hero section:', error);
      alert('Error updating hero section: ' + error.message);
    }
    setSaving(false);
  };

  const handleSaveService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const serviceData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: serviceImageUrl || (formData.get('image') as string) || editingService?.image || '',
      image_position: formData.get('image_position') as 'left' | 'right',
      order: parseInt(formData.get('order') as string),
      is_active: formData.get('is_active') === 'true',
    };

    let error;
    if (editingService) {
      const res = await supabase.from('services').update(serviceData).eq('id', editingService.id);
      error = res.error;
    } else {
      const res = await supabase.from('services').insert(serviceData);
      error = res.error;
    }

    if (!error) {
      setToast({ message: editingService ? 'تم تحديث الخدمة بنجاح!' : 'تم إضافة الخدمة بنجاح!', type: 'success' });
      setEditingService(null);
      setIsAddingService(false);
      setServiceImageUrl('');
      fetchData();
    } else {
      console.error('Error saving service:', error);
      alert('Error saving service: ' + error.message);
    }
    setSaving(false);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const { error } = await supabase.from('services').delete().eq('id', id);

    if (!error) {
      setToast({ message: 'تم حذف الخدمة بنجاح!', type: 'success' });
      fetchData();
    } else {
      setToast({ message: 'خطأ في حذف الخدمة', type: 'error' });
    }
  };

  const handleToggleActive = async (service: Service) => {
    const { error } = await supabase
      .from('services')
      .update({ is_active: !service.is_active })
      .eq('id', service.id);

    if (!error) {
      fetchData();
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Manage services page and services list</p>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Hero Section</h2>
          <form onSubmit={handleSaveHero} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="hero_title"
                defaultValue={servicesPage?.hero_title}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <textarea
                name="hero_subtitle"
                defaultValue={servicesPage?.hero_subtitle}
                required
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hero Image</label>
              <ImageUpload
                currentImage={heroImageUrl || servicesPage?.hero_image}
                onImageUploaded={setHeroImageUrl}
                folder="services"
              />
              <p className="text-xs text-gray-500 mt-2">أو أدخل رابط الصورة:</p>
              <input
                type="url"
                name="hero_image"
                defaultValue={servicesPage?.hero_image || ''}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border rounded-lg mt-1"
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

        {/* Services List */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Services</h2>
            <button
              onClick={() => setIsAddingService(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Add Service</span>
            </button>
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4 flex gap-4">
                <img src={service.image} alt={service.title} className="w-32 h-32 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{service.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(service)}
                        className={`px-3 py-1 rounded text-sm ${
                          service.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {service.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                    <span>Position: {service.image_position}</span>
                    <span>Order: {service.order}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setEditingService(service)}
                      className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Service Modal */}
        {(isAddingService || editingService) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <form onSubmit={handleSaveService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingService?.title}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingService?.description}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Service Image</label>
                  <ImageUpload
                    currentImage={serviceImageUrl || editingService?.image}
                    onImageUploaded={setServiceImageUrl}
                    folder="services"
                  />
                  <p className="text-xs text-gray-500 mt-2">أو أدخل رابط الصورة:</p>
                  <input
                    type="url"
                    name="image"
                    defaultValue={editingService?.image}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image Position</label>
                  <select
                    name="image_position"
                    defaultValue={editingService?.image_position ?? 'left'}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingService?.order ?? services.length + 1}
                    required
                    min="1"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    name="is_active"
                    defaultValue={editingService?.is_active !== false ? 'true' : 'false'}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingService(null);
                      setIsAddingService(false);
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
