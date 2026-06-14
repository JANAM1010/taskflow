import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} className="text-green-500" />,
  error:   <XCircle size={18} className="text-red-500" />,
  warning: <AlertCircle size={18} className="text-yellow-500" />,
};

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-white border border-gray-100 shadow-xl rounded-2xl px-5 py-4 flex items-center gap-3 min-w-72">
        {icons[type]}
        <p className="text-sm font-medium text-gray-700 flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-gray-500 transition"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;