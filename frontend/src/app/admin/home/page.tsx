'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { homeAPI } from '@/lib/api';
import { toast } from 'react-toastify';

export default function AdminHomePage() {
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
  });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await homeAPI.getHomePage();
      setHomeData(response.data);
      setHeroForm({
        title: response.data.hero.title,
        subtitle: response.data.hero.subtitle,
      });
    } catch (error) {
      console.error('Error fetching home data:', error);
      toast.error('Failed to fetch home page data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHero = async () => {
    setSaving(true);
    try {
      await homeAPI.updateHero(heroForm);
      toast.success('Hero section updated successfully!');
      await fetchHomeData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update hero section');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    try {
      await homeAPI.deleteCard(cardId);
      toast.success('Card deleted successfully!');
      await fetchHomeData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete card');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-zinc-700"
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <textarea
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-zinc-700"
                placeholder="Enter hero subtitle"
              />
            </div>
            <button
              onClick={handleSaveHero}
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Hero Section'}
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Feature Cards</h2>
            <p className="text-sm text-gray-500">
              Note: Use the API or database to add/edit cards (full UI coming soon)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {homeData?.featureCards
              ?.sort((a: any, b: any) => a.order - b.order)
              .map((card: any) => (
                <div
                  key={card._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {card.description}
                  </p>
                  <button
                    onClick={() => handleDeleteCard(card._id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
          {(!homeData?.featureCards || homeData.featureCards.length === 0) && (
            <p className="text-center text-gray-500 py-8">No feature cards yet</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
