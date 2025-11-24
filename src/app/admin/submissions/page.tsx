'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Toast from '@/components/admin/Toast';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';

interface ContactSubmission {
  id: string;
  type: 'general' | 'vendor';
  name?: string;
  email: string;
  message?: string;
  company_name?: string;
  contact_person?: string;
  phone?: string;
  created_at: string;
}

export default function SubmissionsAdmin() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'general' | 'vendor'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setSubmissions(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);

    if (!error) {
      setToast({ message: 'Message deleted successfully!', type: 'success' });
      fetchData();
    } else {
      setToast({ message: 'Error deleting message', type: 'error' });
    }
  };

  const handleExportToExcel = () => {
    const dataToExport = filteredSubmissions.map((submission) => {
      const baseData = {
        'Type': submission.type === 'general' ? 'General Inquiry' : 'Vendor Inquiry',
        'Date': new Date(submission.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        'Email': submission.email,
      };

      if (submission.type === 'general') {
        return {
          ...baseData,
          'Name': submission.name || '',
          'Message': submission.message || '',
          'Company': '',
          'Contact Person': '',
          'Phone': '',
        };
      } else {
        return {
          ...baseData,
          'Name': '',
          'Message': '',
          'Company': submission.company_name || '',
          'Contact Person': submission.contact_person || '',
          'Phone': submission.phone || '',
        };
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contact Submissions');

    // Auto-size columns
    const maxWidth = 50;
    const columnWidths = Object.keys(dataToExport[0] || {}).map((key) => {
      const maxLength = Math.max(
        key.length,
        ...dataToExport.map((row) => String(row[key as keyof typeof row] || '').length)
      );
      return { wch: Math.min(maxLength + 2, maxWidth) };
    });
    worksheet['!cols'] = columnWidths;

    const fileName = `contact_submissions_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    setToast({ message: 'Excel file exported successfully!', type: 'success' });
  };

  const filteredSubmissions = submissions.filter((sub) => filter === 'all' || sub.type === filter);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-gray-600 mt-1">View and manage contact form submissions</p>
        </div>

        {/* Filters and Export */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all' ? 'bg-primary text-white' : 'bg-white border hover:bg-gray-50'
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              onClick={() => setFilter('general')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'general' ? 'bg-primary text-white' : 'bg-white border hover:bg-gray-50'
              }`}
            >
              General ({submissions.filter((s) => s.type === 'general').length})
            </button>
            <button
              onClick={() => setFilter('vendor')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'vendor' ? 'bg-primary text-white' : 'bg-white border hover:bg-gray-50'
              }`}
            >
              Vendor ({submissions.filter((s) => s.type === 'vendor').length})
            </button>
          </div>

          <button
            onClick={handleExportToExcel}
            disabled={filteredSubmissions.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-xl">download</span>
            Export to Excel
          </button>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      submission.type === 'general'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {submission.type === 'general' ? 'General Inquiry' : 'Vendor Inquiry'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(submission.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(submission.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>

              {submission.type === 'general' ? (
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {submission.name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{' '}
                    <a href={`mailto:${submission.email}`} className="text-primary hover:underline">
                      {submission.email}
                    </a>
                  </div>
                  <div>
                    <span className="font-medium">Message:</span>
                    <p className="mt-1 text-gray-700 whitespace-pre-wrap">{submission.message}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Company:</span> {submission.company_name}
                  </div>
                  <div>
                    <span className="font-medium">Contact Person:</span> {submission.contact_person}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{' '}
                    <a href={`mailto:${submission.email}`} className="text-primary hover:underline">
                      {submission.email}
                    </a>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{' '}
                    <a href={`tel:${submission.phone}`} className="text-primary hover:underline">
                      {submission.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
              No submissions found.
            </div>
          )}
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AdminLayout>
  );
}
