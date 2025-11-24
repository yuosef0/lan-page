'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ClientLayout from '@/components/ClientLayout';
import GeometricBackground from '@/components/GeometricBackground';
import { supabase } from '@/lib/supabase';
import type { HomePage, FeatureCard } from '@/types/database';

export default function Home() {
  const [homeData, setHomeData] = useState<HomePage | null>(null);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [homeRes, cardsRes] = await Promise.all([
        supabase.from('home_page').select('*').single(),
        supabase.from('feature_cards').select('*').order('order'),
      ]);

      if (homeRes.data) setHomeData(homeRes.data);
      if (cardsRes.data) setFeatureCards(cardsRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden bg-background-light dark:bg-background-dark">
        <GeometricBackground />

        <div className="relative z-10 container mx-auto max-w-7xl flex flex-col items-center gap-4">
          <h1 className="text-primary text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl">
            {homeData?.hero_title || 'Beyond Construction'}
          </h1>
          <p className="text-text-light dark:text-gray-300 text-base font-normal leading-normal md:text-lg max-w-2xl">
            {homeData?.hero_subtitle || 'At A.B. we are committed to helping our clients bring their visions to life.'}
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 px-4 bg-white dark:bg-zinc-900">
        <div className="container mx-auto max-w-7xl">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${featureCards.length === 1 ? 'md:justify-items-center' : ''}`}>
            {featureCards.map((card) => (
              <div key={card.id} className={`flex flex-col gap-3 pb-3 ${featureCards.length === 1 ? 'md:max-w-md' : ''}`}>
                <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg relative overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  />
                </div>
                <div>
                  <p className="text-text-light dark:text-white text-xl font-bold leading-normal">
                    {card.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal mt-2">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {featureCards.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No feature cards available yet.</p>
            </div>
          )}
        </div>
      </section>
    </ClientLayout>
  );
}
