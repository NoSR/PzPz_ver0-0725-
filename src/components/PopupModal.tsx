import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, ExternalLink } from 'lucide-react';

export const PopupModal: React.FC = () => {
  const { popups, dismissedPopups, dismissPopupToday, deletePopup } = useStore();

  const activePopups = popups.filter(
    (p) => p.active && !dismissedPopups.includes(p.id)
  );

  if (activePopups.length === 0) return null;

  const popup = activePopups[0]; // Render first active non-dismissed popup

  const getSizeClasses = () => {
    switch (popup.size) {
      case 'small':
        return 'max-w-sm';
      case 'large':
        return 'max-w-xl';
      case 'wide':
        return 'max-w-2xl';
      case 'medium':
      default:
        return 'max-w-md';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
      <div
        className={`relative w-full ${getSizeClasses()} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col`}
        style={{
          width: popup.widthPx ? `${popup.widthPx}px` : undefined,
          height: popup.heightPx ? `${popup.heightPx}px` : undefined,
        }}
      >
        {/* Header / Image Banner */}
        {popup.image && (
          <div className="relative h-48 sm:h-56 w-full overflow-hidden shrink-0">
            <img
              src={popup.image}
              alt={popup.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-3 flex-1 overflow-y-auto">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {popup.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {popup.content}
          </p>

          {popup.linkUrl && (
            <div className="pt-2">
              <a
                href={popup.linkUrl}
                onClick={() => dismissPopupToday(popup.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-500 transition-colors"
              >
                <span>{popup.linkText || '자세히 보기'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 shrink-0">
          <button
            onClick={() => dismissPopupToday(popup.id)}
            className="hover:text-purple-500 transition-colors flex items-center gap-1"
          >
            <span>오늘 하루 보지 않기</span>
          </button>

          <button
            onClick={() => dismissPopupToday(popup.id)}
            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
          >
            <span>닫기</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
