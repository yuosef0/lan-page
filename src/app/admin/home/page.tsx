'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { supabase } from '@/lib/supabase';
import type { HomePage, FeatureCard } from '@/types/database';

export default function HomeAdmin() {
  const [homeData, setHomeData] = useState<HomePage | null>(null);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCard, setEditingCard] = useState<FeatureCard | null>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardImageUrl, setCardImageUrl] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [homeRes, cardsRes] = await Promise.all([
      supabase.from('home_page').select('*').single(),
      supabase.from('feature_cards').select('*').order('order'),
    ]);

    if (homeRes.data) setHomeData(homeRes.data);
    if (cardsRes.data) setFeatureCards(cardsRes.data);
    setLoading(false);
  };

  const handleSaveHero = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!homeData) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase
      .from('home_page')
      .update({
        hero_title: formData.get('hero_title') as string,
        hero_subtitle: formData.get('hero_subtitle') as string,
      })
      .eq('id', homeData.id);

    if (!error) {
      alert('Hero section updated successfully!');
      fetchData();
    } else {
      alert('Error updating hero section');
    }
    setSaving(false);
  };

  const handleSaveCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const cardData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: cardImageUrl || formData.get('image') as string,
      order: parseInt(formData.get('order') as string),
    };

    let error;
    if (editingCard) {
      const res = await supabase.from('feature_cards').update(cardData).eq('id', editingCard.id);
      error = res.error;
    } else {
      const res = await supabase.from('feature_cards').insert(cardData);
      error = res.error;
    }

    if (!error) {
      alert(editingCard ? 'Card updated successfully!' : 'Card added successfully!');
      setEditingCard(null);
      setIsAddingCard(false);
      setCardImageUrl('');
      fetchData();
    } else {
      alert('Error saving card');
    }
    setSaving(false);
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    const { error } = await supabase.from('feature_cards').delete().eq('id', id);

    if (!error) {
      alert('Card deleted successfully!');
      fetchData();
    } else {
      alert('Error deleting card');
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
          <h1 className="text-3xl font-bold text-gray-900">Home Page</h1>
          <p className="text-gray-600 mt-1">Manage hero section and feature cards</p>
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
                defaultValue={homeData?.hero_title}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <textarea
                name="hero_subtitle"
                defaultValue={homeData?.hero_subtitle}
                required
                rows={3}
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

        {/* Feature Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Feature Cards</h2>
            <button
              onClick={() => setIsAddingCard(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Add Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureCards.map((card) => (
              <div key={card.id} className="border rounded-lg p-4">
                <img src={card.image} alt={card.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                <h3 className="font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCard(card)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Card Modal */}
        {(isAddingCard || editingCard) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">{editingCard ? 'Edit Card' : 'Add New Card'}</h3>
              <form onSubmit={handleSaveCard} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingCard?.title}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingCard?.description}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Card Image</label>
                  <ImageUpload
                    currentImage={cardImageUrl || editingCard?.image}
                    onImageUploaded={setCardImageUrl}
                    folder="home"
                  />
                  <p className="text-xs text-gray-500 mt-2">أو أدخل رابط الصورة:</p>
                  <input
                    type="url"
                    name="image"
                    defaultValue={editingCard?.image}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingCard?.order ?? featureCards.length + 1}
                    required
                    min="1"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCard(null);
                      setIsAddingCard(false);
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
