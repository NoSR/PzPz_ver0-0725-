import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="px-5 py-3 rounded-2xl bg-slate-900/90 text-white border border-purple-500/40 shadow-2xl backdrop-blur-md text-xs font-black flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
