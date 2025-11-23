'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ClientLayout from '@/components/ClientLayout';
import { supabase } from '@/lib/supabase';
import type { ServicesPage, Service } from '@/types/database';

export default function Services() {
  const [servicesPage, setServicesPage] = useState<ServicesPage | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [pageRes, servicesRes] = await Promise.all([
        supabase.from('services_page').select('*').single(),
        supabase.from('services').select('*').eq('is_active', true).order('order'),
      ]);

      if (pageRes.data) setServicesPage(pageRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
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
      {/* Hero */}
      <section className="bg-background-light dark:bg-background-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center">
            <div className="flex flex-col gap-4 sm:gap-6 text-center md:text-left md:flex-1">
              <h1 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                {servicesPage?.hero_title}
              </h1>
              <h2 className="text-sm sm:text-base md:text-lg leading-relaxed">
                {servicesPage?.hero_subtitle}
              </h2>
            </div>
            {servicesPage?.hero_image && (
              <div className="w-full md:flex-1">
                <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden">
                  <Image src={servicesPage.hero_image} alt="Services" fill className="object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      {services.map((service, index) => (
        <section
          key={service.id}
          className={index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-background-light dark:bg-background-dark'}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
            <div
              className={`flex flex-col gap-6 sm:gap-8 md:items-center md:gap-12 ${
                service.image_position === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="w-full md:flex-1">
                <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden">
                  <Image src={service.image} alt={service.title} fill className="object-cover" />
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:gap-6 md:flex-1">
                <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl leading-tight">{service.title}</h2>
                <p className="text-sm sm:text-base leading-relaxed">{service.description}</p>
              </div>
            </div>
          </div>
        </section>
      ))}
    </ClientLayout>
  );
}
