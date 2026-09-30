import React from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { SEASONAL_THEMES } from '../utils/themeUtils';
import { SeasonalTheme } from '../types';
import { MapPin, Phone, Clock, Instagram, Sparkles, Heart, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { companyInfo, seasonalTheme, setSeasonalTheme, setActiveTab, setIsAdminAuthModalOpen, user, sectionCopy } = useStore();
  const copy = sectionCopy.footer;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors duration-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Logo size="lg" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {copy.brandDescription}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>{copy.statusMessage}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              {copy.quickLinksTitle}
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <button onClick={() => setActiveTab('games')} className="hover:text-purple-400 transition-colors">
                  {copy.gamesLink}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('reviews')} className="hover:text-purple-400 transition-colors">
                  {copy.reviewsLink}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('notices')} className="hover:text-purple-400 transition-colors">
                  {copy.noticesLink}
                </button>
              </li>
              {companyInfo.visible && (
                <li>
                  <button onClick={() => setActiveTab('about')} className="hover:text-purple-400 transition-colors">
                    {copy.companyLink}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Store Info & Seasonal Theme Selector */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              {copy.storeGuideTitle}
            </h4>

            <div className="space-y-1.5 text-xs text-slate-400">
              <p>📍 {companyInfo.address}</p>
              <p>📞 {companyInfo.phone}</p>
              <p>⏰ {companyInfo.businessHours}</p>
            </div>

            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">{copy.themeLabel}</span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(SEASONAL_THEMES).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => setSeasonalTheme(key as SeasonalTheme)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                      seasonalTheme === key
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.badge.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{copy.copyright}</p>

          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1">
              <span>{copy.craftedPrefix}</span>
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              <span>{copy.craftedSuffix}</span>
            </p>

            {/* Discrete Admin Link */}
            <button
              onClick={() => {
                if (user?.role === 'admin') {
                  setActiveTab('admin');
                } else {
                  setIsAdminAuthModalOpen(true);
                }
              }}
              className="text-[10px] font-mono text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 opacity-60 hover:opacity-100 pl-2 border-l border-slate-800"
              title="스토어 관리자 보안 접속 (/pz_admin)"
            >
              <Lock className="w-3 h-3" />
              <span>/pz_admin</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
