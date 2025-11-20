'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Stats {
  services: number;
  teamMembers: number;
  submissions: number;
  featureCards: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ services: 0, teamMembers: 0, submissions: 0, featureCards: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [servicesRes, teamRes, submissionsRes, cardsRes] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
        supabase.from('feature_cards').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        services: servicesRes.count || 0,
        teamMembers: teamRes.count || 0,
        submissions: submissionsRes.count || 0,
        featureCards: cardsRes.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Services', value: stats.services, icon: 'construction', color: 'bg-blue-500', link: '/admin/services' },
    { label: 'Team Members', value: stats.teamMembers, icon: 'group', color: 'bg-green-500', link: '/admin/team' },
    { label: 'Feature Cards', value: stats.featureCards, icon: 'grid_view', color: 'bg-purple-500', link: '/admin/home' },
    { label: 'New Submissions', value: stats.submissions, icon: 'inbox', color: 'bg-orange-500', link: '/admin/submissions' },
  ];

  const quickLinks = [
    { label: 'Edit Home Page', href: '/admin/home', icon: 'home' },
    { label: 'Edit About Page', href: '/admin/about', icon: 'info' },
    { label: 'Manage Services', href: '/admin/services', icon: 'construction' },
    { label: 'Manage Team', href: '/admin/team', icon: 'group' },
    { label: 'Contact Settings', href: '/admin/contact', icon: 'contact_mail' },
    { label: 'View Submissions', href: '/admin/submissions', icon: 'inbox' },
  ];

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Link
              key={stat.label}
              href={stat.link}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} rounded-full p-3`}>
                  <span className="material-symbols-outlined text-white text-2xl">{stat.icon}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-primary">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
