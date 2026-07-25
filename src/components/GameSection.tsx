import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Game } from '../types';
import { SEASONAL_THEMES } from '../utils/themeUtils';
import { 
  Users, 
  Clock, 
  Brain, 
  Sparkles, 
  Calendar, 
  Info, 
  ChevronRight, 
  Tag, 
  CheckCircle2, 
  X 
} from 'lucide-react';

export const GameSection: React.FC = () => {
  const { 
    games, 
    seasonalTheme, 
    setSelectedGameForBooking, 
    setIsBookingModalOpen, 
    user, 
    setIsAuthModalOpen 
  } = useStore();

  const [detailGameModal, setDetailGameModal] = useState<Game | null>(null);

  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  const handleBookClick = (game: Game) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedGameForBooking(game);
    setIsBookingModalOpen(true);
  };

  const renderStars = (difficulty: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < difficulty ? 'text-amber-400 font-bold' : 'text-slate-300 dark:text-slate-700'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <section id="games-section" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2026 TOP RECOMMENDED PUZZLE GAMES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            퍼즐퍼즐 <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>대표 퍼즐 체험 라인업</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            스릴 만점 입체 큐브부터 감성적인 어드벤처 퍼즐까지! 마음에 드는 게임을 선택하고 원하는 시간을 즉시 예약하세요.
          </p>
        </div>

        {/* Games Showcase Grid / Landing Sections */}
        <div className="space-y-12">
          {games.map((game, index) => (
            <div
              key={game.id}
              className={`group relative rounded-3xl p-6 sm:p-8 border transition-all duration-300 shadow-xl overflow-hidden ${
                theme.cardBg
              } ${theme.accentBorder} hover:shadow-2xl`}
            >
              {/* Featured Badge */}
              {game.isFeatured && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[11px] shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>인기 대표 테마</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Game Image Banner */}
                <div className="lg:col-span-5 relative rounded-2xl overflow-hidden h-64 sm:h-80 shadow-md">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-bold border border-slate-700">
                    {game.category}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-black shadow-lg">
                    1인 {game.pricePerPerson.toLocaleString()}원
                  </div>
                </div>

                {/* Game Detail Information & Features */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {game.highlightBadges?.map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white group-hover:text-purple-400 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-300">
                      {game.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {game.summary}
                  </p>

                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-slate-400 text-[10px] font-bold mb-0.5 flex items-center gap-1">
                        <Brain className="w-3.5 h-3.5 text-amber-400" />
                        <span>난이도</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {renderStars(game.difficulty)}
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center border-x border-slate-200 dark:border-slate-800">
                      <div className="text-slate-400 text-[10px] font-bold mb-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>플레이 시간</span>
                      </div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">
                        {game.playTimeMinutes}분
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-slate-400 text-[10px] font-bold mb-0.5 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-pink-400" />
                        <span>권장 인원</span>
                      </div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">
                        {game.minPlayers} ~ {game.maxPlayers}인
                      </span>
                    </div>
                  </div>

                  {/* Tag Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {game.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3 text-slate-400" />
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar: Detail & Reservation Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => handleBookClick(game)}
                      className={`w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl font-black text-sm ${theme.buttonBg} ${theme.buttonHover} shadow-lg transition-all flex items-center justify-center gap-2`}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{game.title} 즉시 예약하기</span>
                    </button>

                    <button
                      onClick={() => setDetailGameModal(game)}
                      className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Info className="w-4 h-4 text-purple-400" />
                      <span>상세 포스팅 / 랜딩보기</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Game Detailed Description Landing Modal */}
      {detailGameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            
            <button
              onClick={() => setDetailGameModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold">
                {detailGameModal.category}
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {detailGameModal.title}
              </h3>
              <p className="text-sm font-semibold text-purple-400">
                {detailGameModal.subtitle}
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden h-52">
              <img
                src={detailGameModal.image}
                alt={detailGameModal.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                📖 상세 가이드 & 스토리
              </h4>
              <p className="whitespace-pre-line">{detailGameModal.description}</p>
            </div>

            {/* Render Custom HTML Landing content if configured */}
            {detailGameModal.landingHtml && (
              <div
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                dangerouslySetInnerHTML={{ __html: detailGameModal.landingHtml }}
              />
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setDetailGameModal(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  const g = detailGameModal;
                  setDetailGameModal(null);
                  handleBookClick(g);
                }}
                className={`px-6 py-2.5 rounded-xl text-xs font-black ${theme.buttonBg} shadow-md`}
              >
                이 게임 예약하기 🎯
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
