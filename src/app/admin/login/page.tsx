'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword(formData);

    if (error) {
      alert(error.message);
    } else {
      router.push('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg">
        <div className="mx-auto h-16 w-16 bg-primary text-white rounded-lg flex items-center justify-center mb-6">
          <span className="text-3xl font-black">AB</span>
        </div>
        <h2 className="text-center text-3xl font-extrabold mb-6">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Email"
          />
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Password"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Use your Supabase Auth credentials
        </p>
      </div>
    </div>
  );
}
