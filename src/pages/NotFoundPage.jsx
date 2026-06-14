import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl font-black text-indigo-200 mb-4">404</div>
        <div className="text-6xl mb-6">🗂️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 border border-gray-300 text-gray-600 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition text-sm font-medium"
          >
            <Home size={16} /> Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;