import React, { useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import MainLayout from '../../../shared/components/layout/MainLayout';
import Toast from '../../../shared/components/feedback/Toast';
import { User, Shield, Palette, Save, Camera, Moon, Sun } from 'lucide-react';

const SettingsPage = () => {
  const { currentUser } = useAuth();
  const { darkMode, toggleDarkMode, accentColor, setAccentColor, accentColors } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    role: currentUser?.role || '',
    bio: 'Building great products one task at a time.',
    timezone: 'Asia/Kolkata',
  });

  const showToast = (message, type = 'success') => setToast({ message, type });

  const tabs = [
    { id: 'profile',    label: 'Profile',    icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security',   label: 'Security',   icon: Shield },
  ];
  return (
    <MainLayout>
      <div className="mb-8 dark:bg-gray-800 dark:text-white rounded-2xl">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white pl-2 pt-1">Settings</h1>
        <p className="text-gray-400 mt-1 dark:text-white pl-2 pb-2">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">

        {/* Sidebar Tabs */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  activeTab === id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-white-700'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Profile Settings</h2>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: currentUser?.color || '#4043e3' }}
                  >
                    {currentUser?.avatar}
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-lg shadow hover:bg-indigo-700 transition">
                    <Camera size={12} />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{currentUser?.name}</p>
                  <p className="text-gray-400 text-sm">{currentUser?.email}</p>
                  <p className="text-indigo-600 text-xs mt-1 font-medium">{currentUser?.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                  <select
                    value={profile.timezone}
                    onChange={e => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-1.5 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => showToast('Profile updated successfully!')}
                className="flex items-center mt-3 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl transition text-sm"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Appearance</h2>

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  {darkMode
                    ? <Moon size={20} className="text-indigo-400" />
                    : <Sun size={20} className="text-yellow-500" />
                  }
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {darkMode ? 'Dark Mode' : 'Light Mode'}
                    </p>
                    <p className="text-xs text-gray-500">Switch between light and dark theme</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    toggleDarkMode();
                    showToast(`${!darkMode ? 'Dark' : 'Light'} mode enabled!`);
                  }}
                  className={`relative w-10 h-6 rounded-full transition-colors ${darkMode ? 'bg-indigo-700' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Accent Color */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-sm font-medium text-gray-800 dark:text-white mb-3">Accent Color</p>
                <div className="flex gap-3 flex-wrap">
                  {Object.keys(accentColors).map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setAccentColor(color);
                        showToast('Accent color updated!');
                      }}
                      className={`w-9 h-9 rounded-full transition border-4 ${
                        accentColor === color
                          ? 'border-gray-400 scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: accentColor }} />
                  <p className="text-xs text-gray-400">Current: {accentColor}</p>
                </div>
              </div>

            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Security</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-sm font-medium text-gray-800 dark:text-white mb-4">Change Password</p>
                  <div className="space-y-3">
                    {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                      <div key={label}>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => showToast('Password updated successfully!')}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl transition text-sm mt-2"
                    >
                      <Save size={16} /> Update Password
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                  <p className="text-sm font-semibold text-red-600 mb-1">Danger Zone</p>
                  <p className="text-xs text-red-400 mb-3">Once you delete your account, there is no going back.</p>
                  <button
                    onClick={() => showToast('This is a demo — account deletion disabled.', 'warning')}
                    className="text-sm font-medium text-red-600 border border-red-300 px-4 py-2 rounded-xl hover:bg-red-100 transition"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </MainLayout>
  );
};

export default SettingsPage;