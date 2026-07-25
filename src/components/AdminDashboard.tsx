import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SEASONAL_THEMES, LOGO_PRESETS } from '../utils/themeUtils';
import { 
  Game, 
  BookingStatus, 
  BookingFieldConfig, 
  PopupConfig, 
  PopupSize,
  SeasonalTheme,
  LogoPreset
} from '../types';
import { 
  ShieldCheck, 
  CalendarCheck, 
  Gamepad2, 
  Sparkles, 
  SlidersHorizontal, 
  Bell, 
  Info, 
  Palette, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Save, 
  Maximize2 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    bookings,
    updateBookingStatus,
    deleteBooking,
    games,
    addGame,
    updateGame,
    deleteGame,
    heroConfig,
    updateHeroConfig,
    bookingFields,
    updateBookingFields,
    popups,
    addPopup,
    updatePopup,
    deletePopup,
    logoPreset,
    setLogoPreset,
    customLogoUrl,
    setCustomLogoUrl,
    seasonalTheme,
    setSeasonalTheme,
    interactiveSettings,
    updateInteractiveSettings,
    notices,
    addNotice,
    updateNotice,
    deleteNotice,
    companyInfo,
    updateCompanyInfo,
  } = useStore();

  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  const [adminTab, setAdminTab] = useState<
    'bookings' | 'games' | 'hero' | 'form' | 'popups' | 'theme' | 'notices' | 'company'
  >('bookings');

  // Local state for editing games
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isNewGame, setIsNewGame] = useState(false);

  // Local state for adding/editing popups
  const [newPopupTitle, setNewPopupTitle] = useState('🎁 신규 시즌 할인 이벤트');
  const [newPopupContent, setNewPopupContent] = useState('퍼즐퍼즐 스토어 방문 시 10% 즉시 할인 혜택을 제공합니다.');
  const [newPopupImage, setNewPopupImage] = useState('https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80');
  const [newPopupSize, setNewPopupSize] = useState<PopupSize>('medium');

  // Local state for adding notice
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'event' | 'notice' | 'winner'>('notice');
  const [newNoticeContent, setNewNoticeContent] = useState('');

  // Filtering bookings
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');

  const filteredBookings = bookingFilterStatus === 'all'
    ? bookings
    : bookings.filter((b) => b.status === bookingFilterStatus);

  // Form field toggle helper
  const handleToggleField = (fieldId: string, property: 'required' | 'enabled') => {
    const updated = bookingFields.map((f) => {
      if (f.id === fieldId) {
        return { ...f, [property]: !f[property] };
      }
      return f;
    });
    updateBookingFields(updated);
  };

  const handleFieldLabelChange = (fieldId: string, newLabel: string) => {
    const updated = bookingFields.map((f) => (f.id === fieldId ? { ...f, label: newLabel } : f));
    updateBookingFields(updated);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">
              Puzzle Puzzle Control Center
            </span>
            <h2 className="text-2xl font-black">스토어 통합 관리자 대시보드</h2>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          실시간 예약 건수: <span className="font-extrabold text-emerald-400">{bookings.length}건</span> | 등록 게임: <span className="font-extrabold text-purple-400">{games.length}개</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'bookings', label: '예약 관리', icon: CalendarCheck, badge: bookings.length },
          { id: 'games', label: '게임 등록/관리', icon: Gamepad2, badge: games.length },
          { id: 'hero', label: '메인 히어로 설정', icon: Sparkles },
          { id: 'form', label: '예약 폼 항목 설정', icon: SlidersHorizontal },
          { id: 'popups', label: '팝업 관리', icon: Maximize2, badge: popups.length },
          { id: 'theme', label: '로고 & 테마 & FX', icon: Palette },
          { id: 'notices', label: '공지/이벤트 게시판', icon: Bell, badge: notices.length },
          { id: 'company', label: '회사 소개 설정', icon: Info },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-4 py-3 rounded-2xl font-extrabold text-xs transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? `${theme.buttonBg} shadow-lg`
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full bg-slate-900/20 dark:bg-slate-100/20 text-[10px]">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Bookings Management */}
      {adminTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              고객 예약 확인 및 상태 관리
            </h3>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 text-xs font-bold">
              {['all', 'pending', 'confirmed', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl border transition-colors ${
                    bookingFilterStatus === st
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {st === 'all' ? '전체' : st === 'pending' ? '대기중' : st === 'confirmed' ? '확정' : '취소'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-extrabold text-purple-500">예약번호 #{b.id}</span>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">{b.gameTitle}</h4>
                    <p className="text-xs text-slate-400">신청일시: {b.createdAt}</p>
                  </div>

                  {/* Status buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateBookingStatus(b.id, 'confirmed')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>예약 확정</span>
                    </button>

                    <button
                      onClick={() => updateBookingStatus(b.id, 'cancelled')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                        b.status === 'cancelled'
                          ? 'bg-red-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>예약 취소</span>
                    </button>

                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-red-500 hover:bg-red-500/20"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
                  <div>
                    <span className="text-slate-400 block text-[10px]">예약자 성함</span>
                    <span className="font-bold text-slate-900 dark:text-white">{b.userName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">전화번호</span>
                    <span className="font-bold text-slate-900 dark:text-white">{b.userPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">방문 일정</span>
                    <span className="font-bold text-purple-400">{b.date} ({b.time})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">인원 & 금액</span>
                    <span className="font-bold text-slate-900 dark:text-white">{b.players}인 / {b.totalPrice.toLocaleString()}원</span>
                  </div>
                </div>

                {/* Custom fields payload */}
                {b.customData && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 text-xs space-y-1">
                    <span className="font-bold text-[10px] text-slate-400">고객 입력 데이터:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-600 dark:text-slate-300">
                      {Object.entries(b.customData).map(([k, v]) => (
                        <div key={k}>
                          <strong>{k}:</strong> {v}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredBookings.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                해당 상태의 예약 건이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Games Management */}
      {adminTab === 'games' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              게임(신규) 등록 및 (기존) 상세 포스팅 관리
            </h3>
            <button
              onClick={() => {
                setEditingGame({
                  id: '',
                  title: '신규 퍼즐 테마',
                  subtitle: '새로운 3D 퍼즐 탈출 미션',
                  summary: '간략한 퍼즐 테마 소개글입니다.',
                  description: '상세한 퍼즐 스토리를 입력하세요.',
                  difficulty: 3,
                  minPlayers: 2,
                  maxPlayers: 5,
                  playTimeMinutes: 60,
                  pricePerPerson: 22000,
                  image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1000&q=80',
                  tags: ['신규', '퍼즐', '인기'],
                  category: '3D 퍼즐룸',
                  isFeatured: true,
                  highlightBadges: ['NEW 테마'],
                });
                setIsNewGame(true);
              }}
              className={`px-5 py-2.5 rounded-xl font-black text-xs ${theme.buttonBg} shadow-md flex items-center gap-1.5`}
            >
              <Plus className="w-4 h-4" />
              <span>신규 게임 추가</span>
            </button>
          </div>

          {/* List of games */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((g) => (
              <div
                key={g.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4"
              >
                <div className="flex gap-4">
                  <img
                    src={g.image}
                    alt={g.title}
                    className="w-24 h-24 rounded-2xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-bold text-purple-400">{g.category}</span>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{g.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{g.summary}</p>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      1인 {g.pricePerPerson.toLocaleString()}원 · {g.playTimeMinutes}분
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setEditingGame(g);
                      setIsNewGame(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>수정 / 포스팅 작성</span>
                  </button>
                  <button
                    onClick={() => deleteGame(g.id)}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 font-bold text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>삭제</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit / New Game Modal */}
          {editingGame && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {isNewGame ? '신규 게임 등록' : '게임 정보 및 상세 포스팅 수정'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-400 block mb-1">게임 제목</label>
                    <input
                      type="text"
                      value={editingGame.title}
                      onChange={(e) => setEditingGame({ ...editingGame, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">서브 타이틀</label>
                    <input
                      type="text"
                      value={editingGame.subtitle}
                      onChange={(e) => setEditingGame({ ...editingGame, subtitle: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">1인 가격 (원)</label>
                    <input
                      type="number"
                      value={editingGame.pricePerPerson}
                      onChange={(e) => setEditingGame({ ...editingGame, pricePerPerson: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">플레이 시간 (분)</label>
                    <input
                      type="number"
                      value={editingGame.playTimeMinutes}
                      onChange={(e) => setEditingGame({ ...editingGame, playTimeMinutes: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">이미지 URL</label>
                    <input
                      type="text"
                      value={editingGame.image}
                      onChange={(e) => setEditingGame({ ...editingGame, image: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-400 block mb-1">카테고리</label>
                    <input
                      type="text"
                      value={editingGame.category}
                      onChange={(e) => setEditingGame({ ...editingGame, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-400 block text-xs mb-1">간략 요약</label>
                  <textarea
                    rows={2}
                    value={editingGame.summary}
                    onChange={(e) => setEditingGame({ ...editingGame, summary: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 block text-xs mb-1">상세 스토리 / 랜딩 HTML 포스팅</label>
                  <textarea
                    rows={4}
                    value={editingGame.description}
                    onChange={(e) => setEditingGame({ ...editingGame, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    onClick={() => setEditingGame(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      if (isNewGame) {
                        addGame(editingGame);
                      } else {
                        updateGame(editingGame.id, editingGame);
                      }
                      setEditingGame(null);
                    }}
                    className={`px-5 py-2 rounded-xl text-xs font-black ${theme.buttonBg}`}
                  >
                    저장하기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Hero Config */}
      {adminTab === 'hero' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            메인페이지 히어로 섹션 실시간 편집 (프로모션/이벤트 변경)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-400 block mb-1">상단 뱃지 텍스트</label>
              <input
                type="text"
                value={heroConfig.badgeText}
                onChange={(e) => updateHeroConfig({ badgeText: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-400 block mb-1">메인 제목</label>
              <input
                type="text"
                value={heroConfig.title}
                onChange={(e) => updateHeroConfig({ title: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-400 block mb-1">강조 타이틀 (그라데이션)</label>
              <input
                type="text"
                value={heroConfig.highlightTitleText}
                onChange={(e) => updateHeroConfig({ highlightTitleText: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-400 block mb-1">주 버튼 텍스트</label>
              <input
                type="text"
                value={heroConfig.primaryButtonText}
                onChange={(e) => updateHeroConfig({ primaryButtonText: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-400 block text-xs mb-1">서브 설명문구</label>
            <textarea
              rows={3}
              value={heroConfig.description}
              onChange={(e) => updateHeroConfig({ description: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>
        </div>
      )}

      {/* TAB 4: Booking Form Fields Config */}
      {adminTab === 'form' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              예약 시 고객 정보 입력 폼 관리자 설정
            </h3>
            <p className="text-xs text-slate-400">
              상황에 따라 필요한 항목(전화번호, 주소, 실명 등)의 노출 및 필수 입력을 설정할 수 있습니다.
            </p>
          </div>

          <div className="space-y-3">
            {bookingFields.map((field) => (
              <div
                key={field.id}
                className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleFieldLabelChange(field.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">[{field.key}]</span>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.enabled}
                      onChange={() => handleToggleField(field.id, 'enabled')}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>폼 노출</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={() => handleToggleField(field.id, 'required')}
                      className="rounded text-red-500 focus:ring-red-500"
                    />
                    <span className="text-red-500">필수 항목</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Popups Manager */}
      {adminTab === 'popups' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">신규 팝업 생성 및 크기 설정</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1">팝업 제목</label>
                <input
                  type="text"
                  value={newPopupTitle}
                  onChange={(e) => setNewPopupTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">팝업 크기 선택</label>
                <select
                  value={newPopupSize}
                  onChange={(e) => setNewPopupSize(e.target.value as PopupSize)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold"
                >
                  <option value="small">Small (320px)</option>
                  <option value="medium">Medium (420px)</option>
                  <option value="large">Large (560px)</option>
                  <option value="wide">Wide (680px)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-400 block text-xs mb-1">팝업 공지 내용</label>
              <textarea
                rows={3}
                value={newPopupContent}
                onChange={(e) => setNewPopupContent(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>

            <button
              onClick={() => {
                addPopup({
                  title: newPopupTitle,
                  content: newPopupContent,
                  image: newPopupImage,
                  active: true,
                  size: newPopupSize,
                });
              }}
              className={`px-6 py-2.5 rounded-xl font-black text-xs ${theme.buttonBg} shadow-md`}
            >
              팝업 게시하기 🚀
            </button>
          </div>

          {/* Existing popups list */}
          <div className="space-y-3">
            {popups.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{p.title}</span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-400 text-[10px] font-bold">
                      Size: {p.size}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{p.content}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updatePopup(p.id, { active: !p.active })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      p.active ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {p.active ? '활성화' : '비활성'}
                  </button>

                  <button
                    onClick={() => deletePopup(p.id)}
                    className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Theme & Logo & FX */}
      {adminTab === 'theme' && (
        <div className="space-y-6">
          
          {/* Logo Preset */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              로고 및 인터랙티브 퍼즐 큐브 색상 변경
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(LOGO_PRESETS).map(([key, l]) => (
                <button
                  key={key}
                  onClick={() => setLogoPreset(key as LogoPreset)}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    logoPreset === key
                      ? 'bg-purple-500/15 border-purple-500 text-purple-400 font-extrabold'
                      : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold">{l.name}</span>
                  <div className="flex gap-1">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: l.primary }} />
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: l.secondary }} />
                  </div>
                </button>
              ))}
            </div>

            {logoPreset === 'custom' && (
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-400 block mb-1">커스텀 로고 이미지 URL 입력</label>
                <input
                  type="text"
                  value={customLogoUrl}
                  onChange={(e) => setCustomLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>
            )}
          </div>

          {/* Seasonal Theme */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              시즌별 레이아웃 인터랙티브 테마 선택
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(SEASONAL_THEMES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setSeasonalTheme(key as SeasonalTheme)}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    seasonalTheme === key
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-extrabold shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold">{t.badge} ({t.name})</span>
                  {seasonalTheme === key && <span className="text-purple-400 font-bold">적용중</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive FX Settings */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              메인페이지 다채로운 움직임(3D 파티클 FX) 설정
            </h3>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-slate-950">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                floating puzzle 3D 파티클 이펙트 활성화
              </span>
              <button
                onClick={() =>
                  updateInteractiveSettings({
                    enableCubeParticles: !interactiveSettings.enableCubeParticles,
                  })
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold ${
                  interactiveSettings.enableCubeParticles ? 'bg-purple-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {interactiveSettings.enableCubeParticles ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 7: Notices & Events */}
      {adminTab === 'notices' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">공지사항 및 이벤트 게시물 작성</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1">게시물 제목</label>
                <input
                  type="text"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">카테고리</label>
                <select
                  value={newNoticeCategory}
                  onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold"
                >
                  <option value="notice">공지사항</option>
                  <option value="event">이벤트</option>
                  <option value="winner">당첨자발표</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-400 block text-xs mb-1">게시물 내용</label>
              <textarea
                rows={4}
                value={newNoticeContent}
                onChange={(e) => setNewNoticeContent(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>

            <button
              onClick={() => {
                if (!newNoticeTitle.trim()) return;
                addNotice({
                  title: newNoticeTitle,
                  category: newNoticeCategory,
                  content: newNoticeContent,
                  date: new Date().toISOString().slice(0, 10),
                  isPinned: false,
                  isImportant: false,
                });
                setNewNoticeTitle('');
                setNewNoticeContent('');
              }}
              className={`px-6 py-2.5 rounded-xl font-black text-xs ${theme.buttonBg} shadow-md`}
            >
              게시물 등록 🚀
            </button>
          </div>

          <div className="space-y-3">
            {notices.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] text-purple-400 font-bold">[{n.category}]</span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{n.title}</h4>
                </div>

                <button
                  onClick={() => deleteNotice(n.id)}
                  className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: Company Info */}
      {adminTab === 'company' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              회사 소개 페이지 관리 (노출 / 비노출 선택 및 HTML 수정)
            </h3>

            <button
              onClick={() => updateCompanyInfo({ visible: !companyInfo.visible })}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                companyInfo.visible ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {companyInfo.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{companyInfo.visible ? '페이지 노출중' : '페이지 숨김'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-400 block mb-1">회사/스토어 제목</label>
              <input
                type="text"
                value={companyInfo.title}
                onChange={(e) => updateCompanyInfo({ title: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-400 block mb-1">매장 주소</label>
              <input
                type="text"
                value={companyInfo.address}
                onChange={(e) => updateCompanyInfo({ address: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-400 block text-xs mb-1">HTML 지원 회사 소개 내용</label>
            <textarea
              rows={6}
              value={companyInfo.contentHtml}
              onChange={(e) => updateCompanyInfo({ contentHtml: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
            />
          </div>
        </div>
      )}

    </div>
  );
};
