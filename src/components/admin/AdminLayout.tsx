'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/home', label: 'Home Page', icon: 'home' },
  { href: '/admin/about', label: 'About Page', icon: 'info' },
  { href: '/admin/services', label: 'Services', icon: 'construction' },
  { href: '/admin/team', label: 'Team Members', icon: 'group' },
  { href: '/admin/contact', label: 'Contact Info', icon: 'contact_mail' },
  { href: '/admin/submissions', label: 'Submissions', icon: 'inbox' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 text-white transition-transform duration-300 lg:translate-x-0 lg:static`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-800">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-zinc-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-zinc-800 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
              <span className="material-symbols-outlined text-xl">open_in_new</span>
              <span>View Site</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
