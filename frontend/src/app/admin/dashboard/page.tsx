'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { contactAPI, homeAPI, aboutAPI, servicesAPI, teamAPI } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    contactSubmissions: 0,
    services: 0,
    teamMembers: 0,
    featureCards: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [contactRes, servicesRes, teamRes, homeRes] = await Promise.all([
          contactAPI.getSubmissions({ status: 'new' }),
          servicesAPI.getAllServices(),
          teamAPI.getTeamMembers(),
          homeAPI.getHomePage(),
        ]);

        setStats({
          contactSubmissions: contactRes.data.length,
          services: servicesRes.data.length,
          teamMembers: teamRes.data.length,
          featureCards: homeRes.data.featureCards?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickLinks = [
    {
      title: 'Home Page',
      description: 'Manage hero section and feature cards',
      href: '/admin/home',
      icon: 'home',
      color: 'bg-blue-500',
    },
    {
      title: 'About Page',
      description: 'Edit mission, values, principles, and team',
      href: '/admin/about',
      icon: 'info',
      color: 'bg-green-500',
    },
    {
      title: 'Services',
      description: 'Add, edit, or remove services',
      href: '/admin/services',
      icon: 'construction',
      color: 'bg-orange-500',
    },
    {
      title: 'Team Members',
      description: 'Manage team member profiles',
      href: '/admin/team',
      icon: 'group',
      color: 'bg-purple-500',
    },
    {
      title: 'Contact Info',
      description: 'Update contact details and view submissions',
      href: '/admin/contact',
      icon: 'contact_mail',
      color: 'bg-pink-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-2">Welcome to Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your website content from here
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">New Submissions</p>
                <p className="text-3xl font-bold mt-1">{stats.contactSubmissions}</p>
              </div>
              <div className="size-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">mail</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Services</p>
                <p className="text-3xl font-bold mt-1">{stats.services}</p>
              </div>
              <div className="size-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">construction</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
                <p className="text-3xl font-bold mt-1">{stats.teamMembers}</p>
              </div>
              <div className="size-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">group</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Feature Cards</p>
                <p className="text-3xl font-bold mt-1">{stats.featureCards}</p>
              </div>
              <div className="size-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`size-12 ${link.color} text-white rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="material-symbols-outlined text-2xl">{link.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{link.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
