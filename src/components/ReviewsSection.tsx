import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SEASONAL_THEMES } from '../utils/themeUtils';
import { 
  Star, 
  Plus, 
  ThumbsUp, 
  Tag, 
  CheckCircle2, 
  X, 
  MessageSquare, 
  Gamepad2, 
  Filter 
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, games, addReview, likeReview, user, setIsAuthModalOpen, seasonalTheme } = useStore();
  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // New Review Form
  const [targetGameId, setTargetGameId] = useState<string>(games[0]?.id || '');
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('인생샷, 재미보장, 친절해요');

  const filteredReviews = selectedGameFilter === 'all'
    ? reviews
    : reviews.filter((r) => r.gameId === selectedGameFilter);

  const handleWriteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!content.trim()) return;

    const game = games.find((g) => g.id === targetGameId) || games[0];
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addReview({
      gameId: game.id,
      gameTitle: game.title,
      rating,
      content,
      tags: parsedTags,
    });

    setContent('');
    setIsWriteModalOpen(false);
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-black">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>REAL PLAYER REVIEWS</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              실제 방문 고객 <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>생생 후기 & 평점</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              플레이한 게임 정보가 링크되어 있어 다음 고객들의 선택을 도와주는 퍼즐퍼즐 클린 리뷰
            </p>
          </div>

          <button
            onClick={() => {
              if (!user) {
                setIsAuthModalOpen(true);
              } else {
                setIsWriteModalOpen(true);
              }
            }}
            className={`px-6 py-3.5 rounded-2xl font-black text-xs ${theme.buttonBg} shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105`}
          >
            <Plus className="w-4 h-4" />
            <span>리뷰 작성하기</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedGameFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedGameFilter === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            전체 게임 후기 ({reviews.length})
          </button>

          {games.map((g) => {
            const count = reviews.filter((r) => r.gameId === g.id).length;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGameFilter(g.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedGameFilter === g.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                <span>{g.title} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-6 rounded-3xl border ${theme.cardBg} border-slate-200 dark:border-slate-800 space-y-4 shadow-lg hover:border-purple-500/40 transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                    alt={rev.userName}
                    className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {rev.userName}
                      </span>
                      {rev.isVerifiedBooking && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>예약확인 완료</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.createdAt}</span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Linked Game Tag Pill */}
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-400">플레이한 게임:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-300">
                    {rev.gameTitle}
                  </span>
                </div>
              </div>

              {/* Content */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {rev.content}
              </p>

              {/* Tags & Likes */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {rev.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => likeReview(rev.id)}
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-purple-500/20 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-purple-400" />
                  <span>{rev.likesCount}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Review Write Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                생생 리뷰 작성하기 ✍️
              </h3>
              <p className="text-xs text-slate-400">
                플레이하신 게임을 선택하고 솔직한 경험을 공유해주세요.
              </p>
            </div>

            <form onSubmit={handleWriteSubmit} className="space-y-4">
              
              {/* Game selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  플레이한 게임 선택
                </label>
                <select
                  value={targetGameId}
                  onChange={(e) => setTargetGameId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                >
                  {games.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title} ({g.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  평점 (별점)
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  리뷰 내용
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="게임의 재미, 팁, 서비스 만족도 등을 작성해주세요!"
                  className="w-full p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  태그 입력 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="예: 커플추천, 인생샷, 대박재미"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl font-black text-xs ${theme.buttonBg} shadow-lg`}
              >
                리뷰 등록 완료 🚀
              </button>

            </form>

          </div>
        </div>
      )}
    </section>
  );
};
