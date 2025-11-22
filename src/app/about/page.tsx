'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ClientLayout from '@/components/ClientLayout';
import { supabase } from '@/lib/supabase';
import type { AboutPage, Principle, TeamMember } from '@/types/database';

export default function About() {
  const [aboutData, setAboutData] = useState<AboutPage | null>(null);
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [aboutRes, principlesRes, teamRes] = await Promise.all([
        supabase.from('about_page').select('*').single(),
        supabase.from('principles').select('*').order('order'),
        supabase.from('team_members').select('*').order('order'),
      ]);

      if (aboutRes.data) setAboutData(aboutRes.data);
      if (principlesRes.data) setPrinciples(principlesRes.data);
      if (teamRes.data) setTeamMembers(teamRes.data);
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
      <section className="relative py-20 md:py-32 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-black md:text-6xl text-text-light dark:text-white">
            {aboutData?.hero_title}
          </h1>
          <div className="mx-auto mt-4 h-1.5 w-24 bg-primary"></div>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-text-light/80 dark:text-text-dark/80">
            {aboutData?.hero_subtitle}
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      {(aboutData?.show_mission || aboutData?.show_values) && (
        <section className="py-16 md:py-24 bg-white dark:bg-zinc-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
              <div className="space-y-8">
                {aboutData?.show_mission && (
                  <div>
                    <h2 className="text-[22px] font-bold">{aboutData?.mission_title}</h2>
                    <p className="mt-2 text-base leading-relaxed">{aboutData?.mission_content}</p>
                  </div>
                )}
                {aboutData?.show_values && (
                  <div>
                    <h2 className="text-[22px] font-bold">{aboutData?.values_title}</h2>
                    <p className="mt-2 text-base leading-relaxed">{aboutData?.values_content}</p>
                  </div>
                )}
              </div>
              {aboutData?.mission_image && (
                <div className="relative h-[400px] md:h-[500px]">
                  <Image
                    src={aboutData.mission_image}
                    alt="Our team"
                    fill
                    className="rounded-lg object-cover shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Principles */}
      {aboutData?.show_principles && principles.length > 0 && (
        <section className="py-16 md:py-24 bg-background-light dark:bg-background-dark">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">{aboutData?.principles_section_title}</h2>
              <p className="mt-4">{aboutData?.principles_section_subtitle}</p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {principles.map((principle) => (
                <div key={principle.id} className="flex flex-col gap-3 rounded-lg border p-6 text-center shadow-sm bg-white dark:bg-zinc-900">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-3xl">{principle.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold">{principle.title}</h3>
                  <p className="text-sm">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {aboutData?.show_team && teamMembers.length > 0 && (
        <section className="py-16 md:py-24 bg-white dark:bg-zinc-900">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">{aboutData?.team_section_title}</h2>
              <p className="mt-4">{aboutData?.team_section_subtitle}</p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden shadow-md">
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                  </div>
                  <h4 className="mt-4 text-lg font-bold">{member.name}</h4>
                  <p className="text-sm text-primary">{member.position}</p>
                  <p className="mt-2 text-xs text-text-light/70 dark:text-text-dark/70">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </ClientLayout>
  );
}
