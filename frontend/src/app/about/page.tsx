'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ClientLayout from '@/components/ClientLayout';
import { aboutAPI, teamAPI } from '@/lib/api';

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutResponse, teamResponse] = await Promise.all([
          aboutAPI.getAboutPage(),
          teamAPI.getTeamMembers(),
        ]);
        setAboutData(aboutResponse.data);
        setTeamMembers(teamResponse.data);
      } catch (error) {
        console.error('Error fetching about data:', error);
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

  const hero = aboutData?.hero || {};
  const mission = aboutData?.mission || {};
  const values = aboutData?.values || {};
  const principlesSection = aboutData?.principlesSection || {};
  const principles = aboutData?.principles || [];
  const teamSection = aboutData?.teamSection || {};

  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-black leading-tight tracking-tighter md:text-6xl text-text-light dark:text-white">
            {hero.title || 'About Apex & Base'}
          </h1>
          <div className="mx-auto mt-4 h-1.5 w-24 bg-primary"></div>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-text-light/80 dark:text-text-dark/80">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="space-y-8">
              <div>
                <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-white">
                  {mission.title || 'Our Mission'}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-text-light/90 dark:text-text-dark/90">
                  {mission.content}
                </p>
              </div>
              <div>
                <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-white">
                  {values.title || 'Our Values'}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-text-light/90 dark:text-text-dark/90">
                  {values.content}
                </p>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px]">
              {aboutData?.missionImage && (
                <Image
                  src={aboutData.missionImage}
                  alt="Our team"
                  fill
                  className="rounded-lg object-cover shadow-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-16 md:py-24 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter sm:text-4xl text-text-light dark:text-white">
              {principlesSection.title || 'Our Guiding Principles'}
            </h2>
            <p className="mt-4 text-text-light/80 dark:text-text-dark/80">
              {principlesSection.subtitle}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {principles
              .sort((a: any, b: any) => a.order - b.order)
              .map((principle: any) => (
                <div
                  key={principle._id}
                  className="flex flex-col gap-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-zinc-900 p-6 text-center shadow-sm"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-3xl">
                      {principle.icon}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold leading-tight text-text-light dark:text-white">
                      {principle.title}
                    </h3>
                    <p className="text-sm leading-normal text-text-light/80 dark:text-text-dark/80">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter sm:text-4xl text-text-light dark:text-white">
              {teamSection.title || 'Meet Our Leadership'}
            </h2>
            <p className="mt-4 text-text-light/80 dark:text-text-dark/80">
              {teamSection.subtitle}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers
              .sort((a, b) => a.order - b.order)
              .map((member) => (
                <div key={member._id} className="text-center">
                  <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden shadow-md">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                  <h4 className="mt-4 text-lg font-bold text-text-light dark:text-white">
                    {member.name}
                  </h4>
                  <p className="text-sm text-primary">{member.position}</p>
                  <p className="mt-2 text-xs text-text-light/70 dark:text-text-dark/70">
                    {member.bio}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </ClientLayout>
  );
}
