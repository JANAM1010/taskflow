import React, { useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import MemberCard from '../components/MemberCard';
import MainLayout from '../../../shared/components/layout/MainLayout';
import { Users, Search, UserPlus, Shield, User, X } from 'lucide-react';

const colorOptions = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

const MembersPage = () => {
  const { users, addMember } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'Member', color: '#6366f1' });
  const [error, setError] = useState('');

  const filtered = users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.role.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  const admins = users.filter(u => u.role === 'Admin').length;
  const members = users.filter(u => u.role === 'Member').length;

  const handleAddMember = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required');
      return;
    }
    if (users.some(u => u.email.toLowerCase() === form.email.toLowerCase())) {
      setError('A member with this email already exists');
      return;
    }
    addMember(form);
    setForm({ name: '', email: '', role: 'Member', color: '#6366f1' });
    setError('');
    setShowAddModal(false);
  };

  return (
    <MainLayout>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Members</h1>
          <p className="text-gray-400 mt-1">{users.length} members in your workspace</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl transition text-sm"
        >
          <UserPlus size={16} />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-xl">
            <Users size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{users.length}</p>
            <p className="text-sm text-gray-400">Total Members</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-xl">
            <Shield size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{admins}</p>
            <p className="text-sm text-gray-400">Admins</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-xl">
            <User size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{members}</p>
            <p className="text-sm text-gray-400">Members</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'admin', 'member'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl mb-4">
            <Users size={32} className="text-gray-400" />
          </div>
          <h3 className="text-gray-600 dark:text-gray-300 font-semibold mb-1">No members found</h3>
          <p className="text-gray-400 text-sm">Try a different search term</p>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-xl">
                  <UserPlus size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Add Member</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  value={form.name}
                  onChange={e => { setForm({ ...form, name: e.target.value }); setError(''); }}
                  placeholder="e.g. Priya Sharma"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); setError(''); }}
                  placeholder="priya@company.com"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Member</option>
                  <option>Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => setForm({ ...form, color })}
                      className={`w-8 h-8 rounded-full transition border-4 ${
                        form.color === color ? 'border-gray-400 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: form.color }}
                >
                  {form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">{form.name || 'Member name'}</p>
                  <p className="text-gray-400 text-xs">{form.email || 'email@example.com'}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowAddModal(false); setError(''); }}
                className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition text-sm"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

    </MainLayout>
  );
};

export default MembersPage;