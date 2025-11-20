'use client';

import { useEffect, useState } from 'react';
import ClientLayout from '@/components/ClientLayout';
import { contactAPI } from '@/lib/api';
import { toast } from 'react-toastify';

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // General inquiry form state
  const [generalForm, setGeneralForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [generalSubmitting, setGeneralSubmitting] = useState(false);

  // Vendor inquiry form state
  const [vendorForm, setVendorForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
  });
  const [vendorSubmitting, setVendorSubmitting] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await contactAPI.getContactInfo();
        setContactInfo(response.data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralSubmitting(true);

    try {
      await contactAPI.submitContact({
        type: 'general',
        ...generalForm,
      });
      toast.success('Message sent successfully!');
      setGeneralForm({ name: '', email: '', message: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setGeneralSubmitting(false);
    }
  };

  const handleVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVendorSubmitting(true);

    try {
      await contactAPI.submitContact({
        type: 'vendor',
        ...vendorForm,
      });
      toast.success('Inquiry submitted successfully!');
      setVendorForm({ companyName: '', contactPerson: '', email: '', phone: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit inquiry');
    } finally {
      setVendorSubmitting(false);
    }
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

  const hero = contactInfo?.hero || {};
  const office = contactInfo?.office || {};

  return (
    <ClientLayout>
      {/* Hero Section */}
      <section className="py-10 sm:py-16 px-4 bg-background-light dark:bg-background-dark">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col gap-4">
            <h1 className="text-text-light dark:text-text-dark text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em]">
              {hero.title || 'Get In Touch'}
            </h1>
            <p className="text-text-light/80 dark:text-text-dark/80 text-lg">
              {hero.subtitle || "We're here to help and answer any question you might have."}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-10 px-4 bg-white dark:bg-zinc-900">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Forms */}
            <div className="flex flex-col gap-10">
              {/* General Inquiries Form */}
              <div className="flex flex-col gap-4">
                <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  General Inquiries
                </h2>
                <form onSubmit={handleGeneralSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <label className="flex flex-col w-full">
                      <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                        Name
                      </p>
                      <input
                        type="text"
                        required
                        value={generalForm.name}
                        onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                        className="flex w-full rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 p-4 text-base"
                        placeholder="Enter your full name"
                      />
                    </label>
                    <label className="flex flex-col w-full">
                      <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                        Email
                      </p>
                      <input
                        type="email"
                        required
                        value={generalForm.email}
                        onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                        className="flex w-full rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 p-4 text-base"
                        placeholder="Enter your email address"
                      />
                    </label>
                  </div>
                  <label className="flex flex-col w-full">
                    <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                      Message
                    </p>
                    <textarea
                      required
                      value={generalForm.message}
                      onChange={(e) => setGeneralForm({ ...generalForm, message: e.target.value })}
                      className="flex w-full resize-y rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-36 placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 p-4 text-base"
                      placeholder="Enter your message here..."
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={generalSubmitting}
                    className="self-start bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                  >
                    {generalSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Vendor Form */}
              <div className="flex flex-col gap-4">
                <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  Subcontractor/Vendor Inquiries
                </h2>
                <form onSubmit={handleVendorSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <label className="flex flex-col w-full">
                      <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                        Company Name
                      </p>
                      <input
                        type="text"
                        required
                        value={vendorForm.companyName}
                        onChange={(e) => setVendorForm({ ...vendorForm, companyName: e.target.value })}
                        className="flex w-full rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 p-4 text-base"
                        placeholder="Your company's name"
                      />
                    </label>
                    <label className="flex flex-col w-full">
                      <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                        Contact Person
                      </p>
                      <input
                        type="text"
                        required
                        value={vendorForm.contactPerson}
                        onChange={(e) => setVendorForm({ ...vendorForm, contactPerson: e.target.value })}
                        className="flex w-full rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 p-4 text-base"
                        placeholder="Enter your full name"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <label className="flex flex-col w-full">
                      <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                        Email
                      </p>
                      <input
                        type="email"
                        required
                        value={vendorForm.email}
                        onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                        className="flex w-full rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 p-4 text-base"
                        placeholder="Enter your email address"
                      />
                    </label>
                    <label className="flex flex-col w-full">
                      <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                        Phone Number
                      </p>
                      <input
                        type="tel"
                        required
                        value={vendorForm.phone}
                        onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                        className="flex w-full rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 p-4 text-base"
                        placeholder="Enter phone number"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={vendorSubmitting}
                    className="self-start bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                  >
                    {vendorSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Contact Info & Map */}
            <div className="flex flex-col gap-6">
              <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em]">
                {office.title || 'Our Office'}
              </h2>
              <div className="flex flex-col gap-4 text-text-light/90 dark:text-text-dark/90">
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                  <span>{office.address}</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">call</span>
                  <span>{office.phone}</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">mail</span>
                  <span>{office.email}</span>
                </p>
              </div>
              {office.mapEmbedUrl && (
                <div className="aspect-video w-full mt-2">
                  <iframe
                    src={office.mapEmbedUrl}
                    className="w-full h-full rounded-xl border border-border-light dark:border-border-dark"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Office Location Map"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </ClientLayout>
  );
}
