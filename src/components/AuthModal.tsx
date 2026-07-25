import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SEASONAL_THEMES } from '../utils/themeUtils';
import { X, UserCheck, ShieldCheck, Sparkles, Lock } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAs, seasonalTheme } = useStore();
  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  const [inputName, setInputName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('customer', inputName.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            퍼즐퍼즐 회원 서비스
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            원활한 예약 신청 및 리뷰 작성을 위해 로그인해주세요.
          </p>
        </div>

        {/* Quick Customer Login & Custom Name Form */}
        <div className="space-y-4 pt-1">
          <button
            onClick={() => loginAs('customer', '김퍼즐 (체험고객)')}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs ${theme.buttonBg} shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105`}
          >
            <UserCheck className="w-4 h-4" />
            <span>원클릭 체험고객으로 바로 시작</span>
          </button>

          <div className="relative text-center">
            <span className="text-[10px] text-slate-400 bg-white dark:bg-slate-900 px-3 relative z-10 font-bold uppercase">
              또는 성함 직접 입력
            </span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
          </div>

          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                사용하실 성함 (닉네임)
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="예: 홍길동"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              입력 정보로 로그인 🚀
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
