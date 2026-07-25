import React from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { SEASONAL_THEMES } from '../utils/themeUtils';
import { SeasonalTheme } from '../types';
import { MapPin, Phone, Clock, Instagram, Sparkles, Heart, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { companyInfo, seasonalTheme, setSeasonalTheme, setActiveTab, setIsAdminAuthModalOpen, user } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors duration-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Logo size="lg" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              '퍼즐퍼즐(Puzzle Puzzle)'은 20대와 모든 연령층이 함께 즐기는 스타일리시 입체 퍼즐 체험 스토어입니다. 감각적인 미션 공간에서 잊지 못할 추억을 만들어보세요.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>Prepared for GitHub Deploy & Cloudflare Sync</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              빠른 메뉴 (Quick Navigation)
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <button onClick={() => setActiveTab('games')} className="hover:text-purple-400 transition-colors">
                  게임 스토어 & 예약
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('reviews')} className="hover:text-purple-400 transition-colors">
                  실제 플레이 리뷰
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('notices')} className="hover:text-purple-400 transition-colors">
                  공지사항 & 프로모션
                </button>
              </li>
              {companyInfo.visible && (
                <li>
                  <button onClick={() => setActiveTab('about')} className="hover:text-purple-400 transition-colors">
                    회사 소개 및 오시는 길
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Store Info & Seasonal Theme Selector */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              스토어 가이드 & 시즌 테마
            </h4>

            <div className="space-y-1.5 text-xs text-slate-400">
              <p>📍 {companyInfo.address}</p>
              <p>📞 {companyInfo.phone}</p>
              <p>⏰ {companyInfo.businessHours}</p>
            </div>

            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">🎨 인터랙티브 레이아웃 테마:</span>
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
          <p>© 2026 PUZZLE PUZZLE (퍼즐퍼즐). All rights reserved.</p>

          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              <span>for Trendy Puzzle Enthusiasts</span>
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
