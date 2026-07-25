import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SEASONAL_THEMES } from '../utils/themeUtils';
import { X, Lock, ShieldCheck, KeyRound, AlertCircle, Sparkles } from 'lucide-react';

export const AdminAuthModal: React.FC = () => {
  const {
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    loginAs,
    setActiveTab,
    seasonalTheme,
    showToast,
  } = useStore();

  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminAuthModalOpen) return null;

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPw = password.trim();

    // Valid passwords: 1234, admin1234, or puzzle2026
    if (cleanPw === '1234' || cleanPw === 'admin1234' || cleanPw === 'puzzle2026') {
      loginAs('admin', '최고 관리자');
      setActiveTab('admin');
      setIsAdminAuthModalOpen(false);
      setPassword('');
      setErrorMsg('');

      // Update URL to /pz_admin for direct route reflection
      try {
        window.history.pushState({}, '', '/pz_admin');
      } catch (err) {
        console.error('URL pushstate error:', err);
      }

      showToast('🔒 관리자 인증 성공! 대시보드로 이동합니다.');
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다. (기본 비밀번호: 1234)');
    }
  };

  const handleClose = () => {
    setIsAdminAuthModalOpen(false);
    setErrorMsg('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-mono font-bold">
            <Lock className="w-3 h-3" />
            <span>DIRECT ROUTE: /pz_admin</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            스토어 관리자 보안 접속
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            일반 고객의 무단 접근을 방지하기 위해 보안 비밀번호 인증이 필요합니다.
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
                <span>관리자 인증 비밀번호</span>
              </span>
              <span className="text-[10px] font-normal text-slate-400">(기본 PIN: 1234)</span>
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="비밀번호 입력 (예: 1234)"
              autoFocus
              className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-extrabold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>관리자 전용 주소 접속 안내</span>
            </div>
            <p className="leading-snug">
              브라우저 주소창에 <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-emerald-500 text-[10px]">/pz_admin</code>을 입력하시거나, 푸터 우측 하단 임시 링크로 언제든 바로 접속하실 수 있습니다.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-lg shadow-emerald-500/20 transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>관리자 대시보드 인증 로그인</span>
          </button>
        </form>

      </div>
    </div>
  );
};
