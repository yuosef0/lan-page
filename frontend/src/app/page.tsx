'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ClientLayout from '@/components/ClientLayout';
import { homeAPI } from '@/lib/api';

export default function HomePage() {
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await homeAPI.getHomePage();
        setHomeData(response.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
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

  const hero = homeData?.hero || {
    title: 'Beyond Construction',
    subtitle: 'At A.B. we are committed to helping our clients bring their visions to life.',
  };

  const featureCards = homeData?.featureCards || [];

  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden bg-background-light dark:bg-background-dark">
        {/* Background decorations */}
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute top-[-50px] left-[-50px] size-40 border-2 border-primary rounded-full"></div>
          <div className="absolute bottom-[-20px] right-[-30px] size-60 border border-primary rounded-full"></div>
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl flex flex-col items-center gap-4">
          <h1 className="text-text-light dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="text-text-light dark:text-gray-300 text-base font-normal leading-normal md:text-lg max-w-2xl">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 px-4 bg-white dark:bg-zinc-900">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCards
              .sort((a: any, b: any) => a.order - b.order)
              .map((card: any) => (
                <div key={card._id} className="flex flex-col gap-3 pb-3">
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
