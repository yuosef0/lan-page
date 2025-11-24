'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types/database';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (data) setSiteSettings(data);
    };

    fetchSettings();
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-4">
            {siteSettings?.logo_url ? (
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src={siteSettings.logo_url}
                  alt={siteSettings.site_name || 'Logo'}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="size-10 flex-shrink-0 bg-primary text-white rounded-md flex items-center justify-center font-black text-xl">
                AB
              </div>
            )}
            <h2 className="text-text-light dark:text-text-dark text-sm sm:text-lg font-bold leading-tight tracking-[-0.015em]">
              {siteSettings?.site_name || 'Apex & Base'}
            </h2>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium leading-normal nav-link ${
                  pathname === link.href
                    ? 'text-primary active'
                    : 'text-text-light dark:text-text-dark hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-light dark:text-text-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border-light dark:border-border-dark">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium leading-normal px-4 py-2 rounded ${
                    pathname === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-text-light dark:text-text-dark hover:text-primary hover:bg-primary/5'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
