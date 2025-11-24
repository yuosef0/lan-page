'use client';

import { useEffect, useState } from 'react';
import ClientLayout from '@/components/ClientLayout';
import { supabase } from '@/lib/supabase';
import type { ContactInfo } from '@/types/database';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [generalForm, setGeneralForm] = useState({ name: '', email: '', message: '' });
  const [vendorForm, setVendorForm] = useState({ companyName: '', contactPerson: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('contact_info').select('*').single();
      if (data) setContactInfo(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('contact_submissions').insert({
      type: 'general',
      ...generalForm,
    });

    if (!error) {
      setToast({ message: 'Message sent successfully!', type: 'success' });
      setGeneralForm({ name: '', email: '', message: '' });
    } else {
      setToast({ message: 'Error sending message', type: 'error' });
    }
    setSubmitting(false);
  };

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('contact_submissions').insert({
      type: 'vendor',
      company_name: vendorForm.companyName,
      contact_person: vendorForm.contactPerson,
      email: vendorForm.email,
      phone: vendorForm.phone,
    });

    if (!error) {
      setToast({ message: 'Inquiry submitted successfully!', type: 'success' });
      setVendorForm({ companyName: '', contactPerson: '', email: '', phone: '' });
    } else {
      setToast({ message: 'Error submitting inquiry', type: 'error' });
    }
    setSubmitting(false);
  };

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
      <section className="py-10 sm:py-16 px-4 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl sm:text-5xl font-black">{contactInfo?.hero_title}</h1>
          <p className="text-lg mt-4">{contactInfo?.hero_subtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-4 bg-white dark:bg-zinc-900">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Forms */}
            <div className="flex flex-col gap-10">
              {/* General Form */}
              <div>
                <h2 className="text-[22px] font-bold mb-4">General Inquiries</h2>
                <form onSubmit={handleGeneralSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                      type="text"
                      required
                      value={generalForm.name}
                      onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg"
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      required
                      value={generalForm.email}
                      onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg"
                      placeholder="Email"
                    />
                  </div>
                  <textarea
                    required
                    value={generalForm.message}
                    onChange={(e) => setGeneralForm({ ...generalForm, message: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg h-36"
                    placeholder="Message"
                  />
                  <button type="submit" disabled={submitting} className="self-start bg-primary text-white px-8 py-3 rounded-lg">
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Vendor Form */}
              <div>
                <h2 className="text-[22px] font-bold mb-4">Subcontractor/Vendor Inquiries</h2>
                <form onSubmit={handleVendorSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                      type="text"
                      required
                      value={vendorForm.companyName}
                      onChange={(e) => setVendorForm({ ...vendorForm, companyName: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg"
                      placeholder="Company Name"
                    />
                    <input
                      type="text"
                      required
                      value={vendorForm.contactPerson}
                      onChange={(e) => setVendorForm({ ...vendorForm, contactPerson: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg"
                      placeholder="Contact Person"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                      type="email"
                      required
                      value={vendorForm.email}
                      onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg"
                      placeholder="Email"
                    />
                    <input
                      type="tel"
                      required
                      value={vendorForm.phone}
                      onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg"
                      placeholder="Phone"
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="self-start bg-primary text-white px-8 py-3 rounded-lg">
                    {submitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-6">
              <h2 className="text-[22px] font-bold">{contactInfo?.office_title}</h2>
              <div className="flex flex-col gap-4">
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                  <span>{contactInfo?.office_address}</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">call</span>
                  <span>{contactInfo?.office_phone}</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">mail</span>
                  <span>{contactInfo?.office_email}</span>
                </p>
              </div>
              {contactInfo?.office_map_embed_url && (
                <iframe
                  src={contactInfo.office_map_embed_url}
                  className="w-full h-96 rounded-xl border"
                  allowFullScreen
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in">
          <div className={`${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}>
            <span className="material-symbols-outlined text-2xl">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <p className="flex-1 font-medium">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="hover:bg-white/20 rounded p-1 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
