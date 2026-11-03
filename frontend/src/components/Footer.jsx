import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-600 text-sm">
          <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-800">AI Interview Prep Platform</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          Designed for CSE-AI Engineering Students &bull; Industry-Standard Architecture
        </p>
      </div>
    </footer>
  );
};

export default Footer;
