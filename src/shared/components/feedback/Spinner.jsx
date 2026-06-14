import React from 'react';

const Spinner = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  );
};

export default Spinner;