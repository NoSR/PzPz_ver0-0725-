import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { SEASONAL_THEMES } from '../utils/themeUtils';
import { SeasonalTheme } from '../types';
import { 
  Sun, 
  Moon, 
  User, 
  ShieldCheck, 
  CalendarCheck, 
  Sparkles, 
  Menu, 
  X, 
  Palette, 
  LogOut,
  Info,
  Layers,
  Star,
  Bell
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    darkMode,
    setDarkMode,
    seasonalTheme,
    setSeasonalTheme,
    activeTab,
    setActiveTab,
    user,
    logout,
    setIsAuthModalOpen,
    companyInfo,
    interactiveSettings,
    updateInteractiveSettings,
    bookings,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  const userBookingsCount = user 
    ? bookings.filter(b => b.userId === user.id || b.userName === user.name).length 
    : 0;

  const navItems = [
    { id: 'home', label: '홈 (Main)', icon: Sparkles },
    { id: 'games', label: '게임 스토어 & 예약', icon: Layers },
    { id: 'reviews', label: '고객 리뷰', icon: Star },
    { id: 'notices', label: '공지 & 이벤트', icon: Bell },
  ];

  if (companyInfo.visible) {
    navItems.push({ id: 'about', label: '회사 소개', icon: Info });
  }

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);

    // Smooth scroll if clicked home/games when on home tab
    if (tabId === 'games') {
      const el = document.getElementById('games-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tabId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div onClick={() => handleNavClick('home')}>
          <Logo size="md" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/70 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? `${theme.buttonBg} shadow-md`
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Theme Picker, Dark Mode, Auth & Admin */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Particles FX Toggle */}
          <button
            onClick={() =>
              updateInteractiveSettings({
                enableCubeParticles: !interactiveSettings.enableCubeParticles,
              })
            }
            title="3D 퍼즐 인터랙티브 효과 토글"
            className={`p-2.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
              interactiveSettings.enableCubeParticles
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-600 dark:text-purple-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${interactiveSettings.enableCubeParticles ? 'animate-spin-slow text-purple-500' : ''}`} />
            <span className="text-xs">FX</span>
          </button>

          {/* Seasonal Theme Selector */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="px-3 py-2 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Palette className="w-4 h-4 text-purple-500" />
              <span>{theme.badge.split(' ')[1] || 'Theme'}</span>
            </button>

            {/* Dropdown Menu */}
            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                  🎨 시즌별 레이아웃 테마
                </div>
                {Object.entries(SEASONAL_THEMES).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSeasonalTheme(key as SeasonalTheme);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      seasonalTheme === key
                        ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{t.badge}</span>
                    {seasonalTheme === key && <span className="text-purple-500">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="다크모드 토글"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* User Auth / My Bookings */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* My Bookings Button */}
              {user.role === 'customer' && (
                <button
                  onClick={() => setActiveTab('my-bookings')}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    activeTab === 'my-bookings'
                      ? `${theme.buttonBg}`
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>내 예약</span>
                  {userBookingsCount > 0 && (
                    <span className="bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                      {userBookingsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Admin Button */}
              {user.role === 'admin' ? (
                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-3.5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>관리자 대시보드</span>
                </button>
              ) : null}

              {/* User Profile Badge */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-full hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`px-4 py-2 rounded-full text-xs font-bold ${theme.buttonBg} shadow-md transition-all flex items-center gap-1.5`}
            >
              <User className="w-4 h-4" />
              <span>로그인 / 회원가입</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-4 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          {/* Nav items */}
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold text-left transition-colors ${
                    activeTab === item.id
                      ? `${theme.buttonBg}`
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Seasonal Theme Mobile Picker */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 mb-2">🎨 시즌 테마 변경</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(SEASONAL_THEMES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setSeasonalTheme(key as SeasonalTheme)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${
                    seasonalTheme === key
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t.badge.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* User Auth in Mobile Drawer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {user ? (
              <div className="w-full flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</div>
                  <div className="text-[10px] text-slate-400">{user.role === 'admin' ? '최고 관리자' : '체험고객'}</div>
                </div>
                <div className="flex gap-2">
                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold"
                    >
                      관리자 대시보드
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-3 rounded-2xl text-xs font-bold ${theme.buttonBg} text-center`}
              >
                로그인 / 회원가입
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
