import { SeasonalTheme, LogoPreset } from '../types';

export interface ThemeConfig {
  name: string;
  badge: string;
  primaryBg: string;
  gradientText: string;
  heroGradient: string;
  accentBg: string;
  accentBorder: string;
  accentGlow: string;
  buttonBg: string;
  buttonHover: string;
  cardBg: string;
  ringColor: string;
  cubesColor1: string;
  cubesColor2: string;
}

export const SEASONAL_THEMES: Record<SeasonalTheme, ThemeConfig> = {
  'trendy-lavender': {
    name: '트렌디 라벤더 (Gen Z)',
    badge: '🔮 Trendy Lavender',
    primaryBg: 'from-purple-900/30 via-slate-900 to-indigo-950/40',
    gradientText: 'from-purple-300 via-pink-300 to-indigo-300',
    heroGradient: 'bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500',
    accentBg: 'bg-purple-600/20 text-purple-300',
    accentBorder: 'border-purple-500/30 hover:border-purple-400/60',
    accentGlow: 'shadow-[0_0_25px_rgba(168,85,247,0.35)]',
    buttonBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white',
    buttonHover: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    cardBg: 'bg-slate-900/80 backdrop-blur-md border-slate-800',
    ringColor: 'ring-purple-500',
    cubesColor1: '#a855f7',
    cubesColor2: '#6366f1',
  },
  'cyber-neon': {
    name: '사이버 네온 Y2K',
    badge: '⚡ Cyber Neon',
    primaryBg: 'from-blue-950/40 via-slate-950 to-cyan-950/40',
    gradientText: 'from-cyan-300 via-blue-300 to-fuchsia-300',
    heroGradient: 'bg-gradient-to-br from-cyan-500 via-blue-600 to-fuchsia-600',
    accentBg: 'bg-cyan-500/20 text-cyan-300',
    accentBorder: 'border-cyan-500/30 hover:border-cyan-400/60',
    accentGlow: 'shadow-[0_0_25px_rgba(6,182,212,0.4)]',
    buttonBg: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold',
    buttonHover: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]',
    cardBg: 'bg-slate-950/85 backdrop-blur-md border-cyan-900/40',
    ringColor: 'ring-cyan-400',
    cubesColor1: '#06b6d4',
    cubesColor2: '#ec4899',
  },
  'pink-blossom': {
    name: '핑키 블라썸 & 코랄',
    badge: '🌸 Pink Blossom',
    primaryBg: 'from-pink-950/30 via-slate-900 to-rose-950/30',
    gradientText: 'from-pink-300 via-rose-300 to-amber-200',
    heroGradient: 'bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500',
    accentBg: 'bg-pink-500/20 text-pink-300',
    accentBorder: 'border-pink-500/30 hover:border-pink-400/60',
    accentGlow: 'shadow-[0_0_25px_rgba(236,72,153,0.35)]',
    buttonBg: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white',
    buttonHover: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]',
    cardBg: 'bg-slate-900/80 backdrop-blur-md border-pink-900/30',
    ringColor: 'ring-pink-500',
    cubesColor1: '#ec4899',
    cubesColor2: '#fb7185',
  },
  'noir-dark': {
    name: '모던 느와르 블랙',
    badge: '🖤 Modern Noir',
    primaryBg: 'from-zinc-950 via-zinc-900 to-neutral-950',
    gradientText: 'from-zinc-100 via-zinc-300 to-zinc-400',
    heroGradient: 'bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900',
    accentBg: 'bg-zinc-800/60 text-zinc-200',
    accentBorder: 'border-zinc-700 hover:border-zinc-500',
    accentGlow: 'shadow-[0_0_20px_rgba(255,255,255,0.15)]',
    buttonBg: 'bg-zinc-100 text-zinc-900 hover:bg-white font-bold',
    buttonHover: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]',
    cardBg: 'bg-zinc-900/90 backdrop-blur-md border-zinc-800',
    ringColor: 'ring-zinc-400',
    cubesColor1: '#e4e4e7',
    cubesColor2: '#a1a1aa',
  },
  'emerald-vibe': {
    name: '에메랄드 포레스트',
    badge: '🌿 Emerald Vibe',
    primaryBg: 'from-emerald-950/30 via-slate-900 to-teal-950/40',
    gradientText: 'from-emerald-300 via-teal-300 to-lime-300',
    heroGradient: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-lime-500',
    accentBg: 'bg-emerald-500/20 text-emerald-300',
    accentBorder: 'border-emerald-500/30 hover:border-emerald-400/60',
    accentGlow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    buttonBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white',
    buttonHover: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    cardBg: 'bg-slate-900/80 backdrop-blur-md border-emerald-900/30',
    ringColor: 'ring-emerald-500',
    cubesColor1: '#10b981',
    cubesColor2: '#14b8a6',
  }
};

export const LOGO_PRESETS: Record<LogoPreset, { name: string; primary: string; secondary: string; darkText: string }> = {
  'black-grey': {
    name: '클래식 블랙 & 그레이 (Classic Black)',
    primary: '#18181b',
    secondary: '#71717a',
    darkText: 'text-zinc-900 dark:text-zinc-100',
  },
  'blue-red': {
    name: '사이버 블루 & 로열 레드 (Cyber Blue & Red)',
    primary: '#1d4ed8',
    secondary: '#b91c1c',
    darkText: 'text-blue-600 dark:text-blue-400',
  },
  'magenta-pink': {
    name: '마젠타 & 버건디 핑크 (Magenta & Pink)',
    primary: '#be185d',
    secondary: '#f43f5e',
    darkText: 'text-rose-600 dark:text-rose-400',
  },
  'purple-lavender': {
    name: '디프 퍼플 & 트렌디 라벤더 (Purple & Lavender)',
    primary: '#6b21a8',
    secondary: '#c084fc',
    darkText: 'text-purple-600 dark:text-purple-400',
  },
  'custom': {
    name: '커스텀 업로드 로고',
    primary: '#8b5cf6',
    secondary: '#ec4899',
    darkText: 'text-purple-500',
  }
};
