'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import Toast from '@/components/admin/Toast';
import { supabase } from '@/lib/supabase';
import type { TeamMember } from '@/types/database';

export default function TeamAdmin() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberImageUrl, setMemberImageUrl] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('team_members').select('*').order('order');
    if (data) setTeamMembers(data);
    setLoading(false);
  };

  const handleSaveMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const memberData = {
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      image: memberImageUrl || (formData.get('image') as string) || editingMember?.image || '',
      bio: formData.get('bio') as string,
      order: parseInt(formData.get('order') as string),
    };

    let error;
    if (editingMember) {
      const res = await supabase.from('team_members').update(memberData).eq('id', editingMember.id);
      error = res.error;
    } else {
      const res = await supabase.from('team_members').insert(memberData);
      error = res.error;
    }

    if (!error) {
      setToast({ message: editingMember ? 'Team member updated successfully!' : 'Team member added successfully!', type: 'success' });
      setEditingMember(null);
      setIsAddingMember(false);
      setMemberImageUrl('');
      fetchData();
    } else {
      console.error('Error saving team member:', error);
      setToast({ message: 'Error saving team member: ' + error.message, type: 'error' });
    }
    setSaving(false);
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    const { error } = await supabase.from('team_members').delete().eq('id', id);

    if (!error) {
      setToast({ message: 'Team member deleted successfully!', type: 'success' });
      fetchData();
    } else {
      setToast({ message: 'Error deleting team member', type: 'error' });
    }
  };

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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">Manage your team members</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Team Members</h2>
            <button
              onClick={() => setIsAddingMember(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Add Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="border rounded-lg p-4">
                <img src={member.image} alt={member.name} className="w-full h-48 object-cover rounded-lg mb-3" />
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.position}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{member.bio}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingMember(member)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {teamMembers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No team members yet. Click "Add Member" to get started.
            </div>
          )}
        </div>

        {/* Add/Edit Member Modal */}
        {(isAddingMember || editingMember) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full my-8 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</h3>
              <form onSubmit={handleSaveMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingMember?.name}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <input
                    type="text"
                    name="position"
                    defaultValue={editingMember?.position}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Member Image</label>
                  <ImageUpload
                    currentImage={memberImageUrl || editingMember?.image}
                    onImageUploaded={setMemberImageUrl}
                    folder="team"
                  />
                  <p className="text-xs text-gray-500 mt-2">Or enter image URL:</p>
                  <input
                    type="url"
                    name="image"
                    defaultValue={editingMember?.image}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    name="bio"
                    defaultValue={editingMember?.bio}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingMember?.order ?? teamMembers.length + 1}
                    required
                    min="1"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember(null);
                      setIsAddingMember(false);
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
