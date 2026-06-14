import React, { useState } from 'react';
import { X, Layout } from 'lucide-react';

const colorOptions = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'
];

const iconOptions = ['🛒', '🏦', '👥', '📊', '🚀', '💡', '🎯', '🔧', '📱', '🌐', '🎨', '📦'];

const CreateProjectModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    color: '#6366f1',
    icon: '🚀'
  });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError('Project name is required');
      return;
    }
    onSubmit(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Layout size={18} className="text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Create New Project</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={form.name}
              onChange={e => { setForm({ ...form, name: e.target.value }); setError(''); }}
              placeholder="e.g. Mobile App Redesign"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="What is this project about?"
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map(icon => (
                <button
                  key={icon}
                  onClick={() => setForm({ ...form, icon })}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition border-2 ${
                    form.icon === icon
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-transparent hover:border-gray-200 bg-gray-50'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Color
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

          {/* Preview */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: form.color + '20' }}
            >
              {form.icon}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {form.name || 'Project Name'}
              </p>
              <p className="text-gray-400 text-xs">
                {form.description || 'Project description'}
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition text-sm"
          >
            Create Project
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateProjectModal;