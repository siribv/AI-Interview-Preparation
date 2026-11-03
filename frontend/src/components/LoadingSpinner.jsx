import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 text-slate-500">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-brand-600`} />
      {text && <p className="text-sm font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
