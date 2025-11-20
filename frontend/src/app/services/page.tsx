'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ClientLayout from '@/components/ClientLayout';
import { servicesAPI } from '@/lib/api';

export default function ServicesPage() {
  const [servicesPage, setServicesPage] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageResponse, servicesResponse] = await Promise.all([
          servicesAPI.getServicesPage(),
          servicesAPI.getServices(),
        ]);
        setServicesPage(pageResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error('Error fetching services data:', error);
      } finally {
        setLoading(false);
      }
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

  const hero = servicesPage?.hero || {};

  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="bg-background-light dark:bg-background-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="flex flex-col gap-6 text-center md:text-left md:flex-1">
              <div className="flex flex-col gap-2">
                <h1 className="text-text-light dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl">
                  {hero.title || 'Our Construction Services'}
                </h1>
                <h2 className="text-text-light dark:text-gray-300 text-base font-normal leading-normal md:text-lg">
                  {hero.subtitle || 'We help you plan, design, and build with precision and creativity.'}
                </h2>
              </div>
            </div>
            {hero.image && (
              <div className="w-full md:flex-1">
                <div className="relative bg-center bg-no-repeat aspect-video bg-cover rounded-xl overflow-hidden">
                  <Image
                    src={hero.image}
                    alt="Services"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Sections */}
      {services
        .sort((a, b) => a.order - b.order)
        .map((service, index) => (
          <section
            key={service._id}
            className={index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-background-light dark:bg-background-dark'}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
              <div
                className={`flex flex-col gap-8 md:items-center md:gap-12 ${
                  service.imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="w-full md:flex-1">
                  <div className="relative bg-center bg-no-repeat aspect-video bg-cover rounded-xl overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-6 md:flex-1">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-text-light dark:text-white text-[32px] font-bold leading-tight md:text-4xl">
                      {service.title}
                    </h2>
                    <p className="text-text-light dark:text-gray-300 text-base font-normal leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

      {services.length === 0 && (
        <section className="bg-white dark:bg-zinc-900 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">No services available yet.</p>
          </div>
        </section>
      )}
    </ClientLayout>
  );
}
