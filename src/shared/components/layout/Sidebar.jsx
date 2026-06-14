import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { Layout, Home, FolderKanban, Users, Settings, LogOut, Plus } from 'lucide-react';

const Sidebar = ({ onCreateProject }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home,          label: 'Dashboard', path: '/dashboard' },
    { icon: FolderKanban,  label: 'Projects',  path: '/projects' },
    { icon: Users,         label: 'Members',   path: '/members' },
    { icon: Settings,      label: 'Settings',  path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-900 min-h-screen flex flex-col fixed left-0 top-0 z-40">

      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-700">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Layout className="text-white" size={20} />
        </div>
        <span className="text-white text-xl font-bold">TaskFlow</span>
      </div>

      {/* New Project Button */}
      <div className="px-4 py-4">
        <button
          onClick={onCreateProject}
          className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: currentUser?.color || '#6366f1' }}
          >
            {currentUser?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{currentUser?.name}</p>
            <p className="text-gray-400 text-xs truncate">{currentUser?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm px-2 py-1.5 rounded-lg hover:bg-gray-800 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;