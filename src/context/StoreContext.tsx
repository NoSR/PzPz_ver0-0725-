import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ThemeMode,
  SeasonalTheme,
  LogoPreset,
  Game,
  Booking,
  BookingFieldConfig,
  Review,
  Notice,
  HeroConfig,
  PopupConfig,
  CompanyInfo,
  InteractiveSettings,
  User,
  BookingStatus,
  NavMenuConfig
} from '../types';
import {
  INITIAL_GAMES,
  INITIAL_HERO_CONFIG,
  INITIAL_BOOKING_FIELDS,
  INITIAL_POPUPS,
  INITIAL_COMPANY_INFO,
  INITIAL_NOTICES,
  INITIAL_REVIEWS,
  INITIAL_INTERACTIVE_SETTINGS,
  INITIAL_NAV_MENU_CONFIG
} from '../data/initialData';

interface StoreContextType {
  // Theme & Aesthetic
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  seasonalTheme: SeasonalTheme;
  setSeasonalTheme: (theme: SeasonalTheme) => void;
  logoPreset: LogoPreset;
  setLogoPreset: (preset: LogoPreset) => void;
  customLogoUrl: string;
  setCustomLogoUrl: (url: string) => void;

  // Active Tab & Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Auth & User
  user: User | null;
  loginAs: (role: 'customer' | 'admin', name?: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;

  // Games
  games: Game[];
  addGame: (game: Omit<Game, 'id'>) => void;
  updateGame: (id: string, updated: Partial<Game>) => void;
  deleteGame: (id: string) => void;

  // Bookings
  bookings: Booking[];
  addBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  deleteBooking: (id: string) => void;
  selectedGameForBooking: Game | null;
  setSelectedGameForBooking: (game: Game | null) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;

  // Booking Fields Config
  bookingFields: BookingFieldConfig[];
  updateBookingFields: (fields: BookingFieldConfig[]) => void;

  // Hero Section Config
  heroConfig: HeroConfig;
  updateHeroConfig: (config: Partial<HeroConfig>) => void;

  // Popups Config
  popups: PopupConfig[];
  addPopup: (popup: Omit<PopupConfig, 'id'>) => void;
  updatePopup: (id: string, updated: Partial<PopupConfig>) => void;
  deletePopup: (id: string) => void;
  dismissedPopups: string[];
  dismissPopupToday: (id: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'likesCount' | 'userId' | 'userName'>) => void;
  likeReview: (id: string) => void;

  // Notices
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id' | 'views'>) => void;
  updateNotice: (id: string, updated: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;

  // Company Info
  companyInfo: CompanyInfo;
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;

  // Nav Menu Config
  navMenuConfig: NavMenuConfig;
  updateNavMenuConfig: (config: Partial<NavMenuConfig>) => void;

  // Interactive Settings
  interactiveSettings: InteractiveSettings;
  updateInteractiveSettings: (settings: Partial<InteractiveSettings>) => void;

  // Toast / Notification helper
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'puzzle_puzzle_v1_';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Helper to get from local storage or fallback
  const getStorageItem = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const setStorageItem = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  };

  // Theme & Layout States
  const [darkMode, setDarkModeState] = useState<boolean>(() => getStorageItem('darkMode', true));
  const [seasonalTheme, setSeasonalThemeState] = useState<SeasonalTheme>(() => getStorageItem('seasonalTheme', 'trendy-lavender'));
  const [logoPreset, setLogoPresetState] = useState<LogoPreset>(() => getStorageItem('logoPreset', 'purple-lavender'));
  const [customLogoUrl, setCustomLogoUrlState] = useState<string>(() => getStorageItem('customLogoUrl', ''));

  // Navigation & Auth
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<User | null>(() => getStorageItem('user', {
    id: 'guest-demo-1',
    name: '김퍼즐 (체험고객)',
    email: 'puzzle_user@example.com',
    phone: '010-9876-5432',
    role: 'customer'
  }));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // Route listener for /pz_admin
  useEffect(() => {
    const handleRouteCheck = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/pz_admin' || path.endsWith('/pz_admin') || hash === '#/pz_admin') {
        const savedUser = getStorageItem<User | null>('user', null);
        if (savedUser?.role === 'admin') {
          setActiveTab('admin');
        } else {
          setIsAdminAuthModalOpen(true);
        }
      }
    };

    handleRouteCheck();

    window.addEventListener('popstate', handleRouteCheck);
    return () => window.removeEventListener('popstate', handleRouteCheck);
  }, []);

  // Core App Data States
  const [games, setGames] = useState<Game[]>(() => getStorageItem('games', INITIAL_GAMES));
  const [bookings, setBookings] = useState<Booking[]>(() => getStorageItem('bookings', [
    {
      id: 'bk-1001',
      userId: 'u-101',
      userName: '이수진',
      userPhone: '010-3333-5555',
      userEmail: 'sujin@example.com',
      userAddress: '서울특별시 마포구 합정동',
      gameId: 'game-1',
      gameTitle: '큐브 스페이스: 차원의 문',
      date: '2026-07-26',
      time: '14:00',
      players: 4,
      totalPrice: 88000,
      status: 'confirmed',
      createdAt: '2026-07-24 10:15',
      customData: { '요청 사항 / 방문 경로': '인스타그램 광고 보고 예약합니다!' }
    }
  ]));

  const [bookingFields, setBookingFields] = useState<BookingFieldConfig[]>(() => getStorageItem('bookingFields', INITIAL_BOOKING_FIELDS));
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(() => getStorageItem('heroConfig', INITIAL_HERO_CONFIG));
  const [popups, setPopups] = useState<PopupConfig[]>(() => getStorageItem('popups', INITIAL_POPUPS));
  const [dismissedPopups, setDismissedPopups] = useState<string[]>(() => getStorageItem('dismissedPopups', []));

  const [reviews, setReviews] = useState<Review[]>(() => getStorageItem('reviews', INITIAL_REVIEWS));
  const [notices, setNotices] = useState<Notice[]>(() => getStorageItem('notices', INITIAL_NOTICES));
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => getStorageItem('companyInfo', INITIAL_COMPANY_INFO));
  const [interactiveSettings, setInteractiveSettings] = useState<InteractiveSettings>(() => getStorageItem('interactiveSettings', INITIAL_INTERACTIVE_SETTINGS));
  const [navMenuConfig, setNavMenuConfig] = useState<NavMenuConfig>(() => getStorageItem('navMenuConfig', INITIAL_NAV_MENU_CONFIG));

  // Modal State for Booking
  const [selectedGameForBooking, setSelectedGameForBooking] = useState<Game | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  // Update HTML class for Dark Mode & Theme
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setStorageItem('darkMode', darkMode);
  }, [darkMode]);

  const setDarkMode = (val: boolean) => setDarkModeState(val);

  const setSeasonalTheme = (theme: SeasonalTheme) => {
    setSeasonalThemeState(theme);
    setStorageItem('seasonalTheme', theme);
    showToast(`테마가 '${theme}'(으)로 변경되었습니다!`);
  };

  const setLogoPreset = (preset: LogoPreset) => {
    setLogoPresetState(preset);
    setStorageItem('logoPreset', preset);
  };

  const setCustomLogoUrl = (url: string) => {
    setCustomLogoUrlState(url);
    setStorageItem('customLogoUrl', url);
  };

  // Auth Handlers
  const loginAs = (role: 'customer' | 'admin', name?: string) => {
    const newUser: User = role === 'admin' ? {
      id: 'admin-master',
      name: name || '최고 관리자',
      email: 'admin@puzzlepuzzle.com',
      phone: '010-0000-0000',
      role: 'admin'
    } : {
      id: 'user-' + Date.now().toString().slice(-4),
      name: name || '김퍼즐 (체험고객)',
      email: 'user@example.com',
      phone: '010-1234-5678',
      role: 'customer'
    };
    setUser(newUser);
    setStorageItem('user', newUser);
    setIsAuthModalOpen(false);
    showToast(`${newUser.name}님으로 로그인되었습니다.`);
  };

  const logout = () => {
    setUser(null);
    setStorageItem('user', null);
    showToast('로그아웃 되었습니다.');
  };

  // Games Handlers
  const addGame = (gameData: Omit<Game, 'id'>) => {
    const newGame: Game = {
      ...gameData,
      id: 'game-' + Date.now()
    };
    const updated = [newGame, ...games];
    setGames(updated);
    setStorageItem('games', updated);
    showToast(`신규 게임 '${newGame.title}' 등록 완료!`);
  };

  const updateGame = (id: string, updated: Partial<Game>) => {
    const updatedList = games.map((g) => (g.id === id ? { ...g, ...updated } : g));
    setGames(updatedList);
    setStorageItem('games', updatedList);
    showToast('게임 정보가 수정되었습니다.');
  };

  const deleteGame = (id: string) => {
    const updatedList = games.filter((g) => g.id !== id);
    setGames(updatedList);
    setStorageItem('games', updatedList);
    showToast('게임이 삭제되었습니다.');
  };

  // Booking Handlers
  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: 'bk-' + Math.floor(1000 + Math.random() * 9000),
      userId: user ? user.id : 'guest-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    setStorageItem('bookings', updated);
    showToast('예약이 성공적으로 접수되었습니다!');
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(updated);
    setStorageItem('bookings', updated);
    showToast(`예약 상태가 '${status}'(으)로 변경되었습니다.`);
  };

  const deleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    setStorageItem('bookings', updated);
    showToast('예약 내역이 삭제되었습니다.');
  };

  // Booking Fields Handlers
  const updateBookingFields = (fields: BookingFieldConfig[]) => {
    setBookingFields(fields);
    setStorageItem('bookingFields', fields);
    showToast('예약 입력 폼 설정이 저장되었습니다.');
  };

  // Hero Section Handlers
  const updateHeroConfig = (config: Partial<HeroConfig>) => {
    const updated = { ...heroConfig, ...config };
    setHeroConfig(updated);
    setStorageItem('heroConfig', updated);
    showToast('메인 히어로 섹션 설정이 수정되었습니다.');
  };

  // Popup Handlers
  const addPopup = (popupData: Omit<PopupConfig, 'id'>) => {
    const newPopup: PopupConfig = {
      ...popupData,
      id: 'popup-' + Date.now()
    };
    const updated = [...popups, newPopup];
    setPopups(updated);
    setStorageItem('popups', updated);
    showToast('새 팝업이 등록되었습니다.');
  };

  const updatePopup = (id: string, updatedData: Partial<PopupConfig>) => {
    const updated = popups.map((p) => (p.id === id ? { ...p, ...updatedData } : p));
    setPopups(updated);
    setStorageItem('popups', updated);
    showToast('팝업 설정이 저장되었습니다.');
  };

  const deletePopup = (id: string) => {
    const updated = popups.filter((p) => p.id !== id);
    setPopups(updated);
    setStorageItem('popups', updated);
    showToast('팝업이 삭제되었습니다.');
  };

  const dismissPopupToday = (id: string) => {
    const updated = [...dismissedPopups, id];
    setDismissedPopups(updated);
    setStorageItem('dismissedPopups', updated);
  };

  // Review Handlers
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'likesCount' | 'userId' | 'userName'>) => {
    const newReview: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      userId: user ? user.id : 'anon',
      userName: user ? user.name : '방문 고객',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      createdAt: new Date().toISOString().slice(0, 10),
      likesCount: 0,
      isVerifiedBooking: true
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    setStorageItem('reviews', updated);
    showToast('소중한 리뷰가 등록되었습니다!');
  };

  const likeReview = (id: string) => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, likesCount: r.likesCount + 1 } : r));
    setReviews(updated);
    setStorageItem('reviews', updated);
  };

  // Notices Handlers
  const addNotice = (noticeData: Omit<Notice, 'id' | 'views'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: 'notice-' + Date.now(),
      views: 1
    };
    const updated = [newNotice, ...notices];
    setNotices(updated);
    setStorageItem('notices', updated);
    showToast('게시물이 등록되었습니다.');
  };

  const updateNotice = (id: string, updatedData: Partial<Notice>) => {
    const updated = notices.map((n) => (n.id === id ? { ...n, ...updatedData } : n));
    setNotices(updated);
    setStorageItem('notices', updated);
    showToast('게시물이 수정되었습니다.');
  };

  const deleteNotice = (id: string) => {
    const updated = notices.filter((n) => n.id !== id);
    setNotices(updated);
    setStorageItem('notices', updated);
    showToast('게시물이 삭제되었습니다.');
  };

  // Company Info Handlers
  const updateCompanyInfo = (info: Partial<CompanyInfo>) => {
    const updated = { ...companyInfo, ...info };
    setCompanyInfo(updated);
    setStorageItem('companyInfo', updated);
    showToast('회사 소개 정보가 수정되었습니다.');
  };

  // Interactive Settings
  const updateInteractiveSettings = (settings: Partial<InteractiveSettings>) => {
    const updated = { ...interactiveSettings, ...settings };
    setInteractiveSettings(updated);
    setStorageItem('interactiveSettings', updated);
    showToast('인터랙티브 효과 설정이 적용되었습니다.');
  };

  // Nav Menu Config
  const updateNavMenuConfig = (config: Partial<NavMenuConfig>) => {
    const updated = { ...navMenuConfig, ...config };
    setNavMenuConfig(updated);
    setStorageItem('navMenuConfig', updated);
    showToast('메인 메뉴의 이름이 변경되었습니다! 🎨');
  };

  return (
    <StoreContext.Provider
      value={{
        darkMode,
        setDarkMode,
        seasonalTheme,
        setSeasonalTheme,
        logoPreset,
        setLogoPreset,
        customLogoUrl,
        setCustomLogoUrl,
        activeTab,
        setActiveTab,
        user,
        loginAs,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        games,
        addGame,
        updateGame,
        deleteGame,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        selectedGameForBooking,
        setSelectedGameForBooking,
        isBookingModalOpen,
        setIsBookingModalOpen,
        bookingFields,
        updateBookingFields,
        heroConfig,
        updateHeroConfig,
        popups,
        addPopup,
        updatePopup,
        deletePopup,
        dismissedPopups,
        dismissPopupToday,
        reviews,
        addReview,
        likeReview,
        notices,
        addNotice,
        updateNotice,
        deleteNotice,
        companyInfo,
        updateCompanyInfo,
        navMenuConfig,
        updateNavMenuConfig,
        interactiveSettings,
        updateInteractiveSettings,
        toastMessage,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
