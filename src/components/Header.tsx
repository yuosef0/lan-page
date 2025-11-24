'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types/database';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

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

  const scrollNav = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = 150;
      navRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
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
            <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">
              {siteSettings?.site_name || 'Apex & Base'}
            </h2>
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-9">
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
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden py-4">
          {/* Logo - Centered */}
          <Link href="/" className="flex flex-col items-center gap-2 mb-4">
            {siteSettings?.logo_url ? (
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src={siteSettings.logo_url}
                  alt={siteSettings.site_name || 'Logo'}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="size-12 flex-shrink-0 bg-primary text-white rounded-md flex items-center justify-center font-black text-2xl">
                AB
              </div>
            )}
            <h2 className="text-text-light dark:text-text-dark text-sm font-bold leading-tight tracking-[-0.015em] text-center">
              {siteSettings?.site_name || 'Apex & Base'}
            </h2>
          </Link>

          {/* Mobile Navigation with Arrows */}
          <div className="relative flex items-center gap-2">
            {/* Left Arrow */}
            <button
              onClick={() => scrollNav('left')}
              className="flex-shrink-0 text-text-light dark:text-text-dark hover:text-primary"
              aria-label="Scroll left"
            >
              <span className="material-symbols-outlined text-2xl">chevron_left</span>
            </button>

            {/* Scrollable Navigation */}
            <div
              ref={navRef}
              className="flex-1 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <nav className="flex items-center gap-12 px-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg font-bold leading-normal whitespace-nowrap ${
                      pathname === link.href
                        ? 'text-primary'
                        : 'text-text-light dark:text-text-dark hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollNav('right')}
              className="flex-shrink-0 text-text-light dark:text-text-dark hover:text-primary"
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined text-2xl">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </header>
  );
}
