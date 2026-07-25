export type ThemeMode = 'light' | 'dark';

export type SeasonalTheme = 
  | 'trendy-lavender' 
  | 'cyber-neon' 
  | 'pink-blossom' 
  | 'noir-dark' 
  | 'emerald-vibe';

export type LogoPreset = 
  | 'black-grey' 
  | 'blue-red' 
  | 'magenta-pink' 
  | 'purple-lavender' 
  | 'custom';

export interface Game {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  difficulty: number; // 1 to 5
  minPlayers: number;
  maxPlayers: number;
  playTimeMinutes: number;
  pricePerPerson: number;
  image: string;
  tags: string[];
  category: string;
  isFeatured: boolean;
  landingHtml?: string;
  highlightBadges?: string[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  userAddress?: string;
  gameId: string;
  gameTitle: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  players: number;
  totalPrice: number;
  status: BookingStatus;
  customData?: Record<string, string>;
  createdAt: string;
}

export type FieldType = 'text' | 'tel' | 'email' | 'address' | 'select' | 'number' | 'textarea';

export interface BookingFieldConfig {
  id: string;
  key: string;
  label: string;
  placeholder?: string;
  type: FieldType;
  required: boolean;
  enabled: boolean;
  options?: string[]; // for select type
  order: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  gameId: string;
  gameTitle: string;
  rating: number; // 1 to 5
  content: string;
  tags: string[];
  createdAt: string;
  likesCount: number;
  isVerifiedBooking?: boolean;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'event' | 'notice' | 'winner';
  date: string;
  isPinned: boolean;
  isImportant: boolean;
  views: number;
}

export interface HeroConfig {
  badgeText: string;
  title: string;
  highlightTitleText: string;
  subtitle: string;
  description: string;
  bgType: 'gradient' | 'image' | 'interactive-cubes';
  bgImage: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  showSecondaryButton: boolean;
}

export type PopupSize = 'small' | 'medium' | 'large' | 'wide';

export interface PopupConfig {
  id: string;
  title: string;
  content: string;
  image?: string;
  linkUrl?: string;
  linkText?: string;
  active: boolean;
  size: PopupSize;
  widthPx?: number;
  heightPx?: number;
}

export interface CompanyInfo {
  visible: boolean;
  title: string;
  subtitle: string;
  contentHtml: string;
  address: string;
  phone: string;
  businessHours: string;
  googleMapUrl?: string;
  instagramUrl?: string;
  kakaoUrl?: string;
}

export interface InteractiveSettings {
  enableCubeParticles: boolean;
  enable3dHover: boolean;
  particleSpeed: 'slow' | 'medium' | 'fast';
  cursorGlow: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
}
