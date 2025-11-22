'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData.email);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      console.log('Login response:', { data, error: authError });

      if (authError) {
        console.error('Login error:', authError);
        setError(authError.message);
        setLoading(false);
      } else if (data.session) {
        console.log('Login successful! Session:', data.session);

        // Store session info and redirect using window.location for full page reload
        // This ensures middleware can read the session
        console.log('Redirecting to dashboard...');

        // Force a hard reload to ensure middleware picks up the session
        window.location.href = '/admin/dashboard';
        // Don't set loading to false - we're redirecting
      } else {
        setError('Login failed - no session returned');
        setLoading(false);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`An unexpected error occurred: ${err}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg">
        <div className="mx-auto h-16 w-16 bg-primary text-white rounded-lg flex items-center justify-center mb-6">
          <span className="text-3xl font-black">AB</span>
        </div>
        <h2 className="text-center text-3xl font-extrabold mb-6">Admin Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="admin@apexbase.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Use your Supabase admin credentials
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Check browser console (F12) for debug info
          </p>
        </div>
      </div>
    </div>
  );
}
