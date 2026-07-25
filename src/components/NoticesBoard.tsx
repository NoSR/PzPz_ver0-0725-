import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SEASONAL_THEMES } from '../utils/themeUtils';
import { Notice } from '../types';
import { 
  Bell, 
  Search, 
  Pin, 
  Eye, 
  Calendar, 
  ChevronRight, 
  Tag, 
  X, 
  Gift, 
  AlertCircle 
} from 'lucide-react';

export const NoticesBoard: React.FC = () => {
  const { notices, seasonalTheme } = useStore();
  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'event' | 'notice' | 'winner'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const filteredNotices = notices.filter((n) => {
    const matchesCategory = categoryFilter === 'all' || n.category === categoryFilter;
    const matchesQuery = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const getCategoryBadge = (category: Notice['category']) => {
    switch (category) {
      case 'event':
        return (
          <span className="px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-300 font-extrabold text-[10px] flex items-center gap-1">
            <Gift className="w-3 h-3" />
            <span>이벤트</span>
          </span>
        );
      case 'winner':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 font-extrabold text-[10px] flex items-center gap-1">
            <span>🏆 당첨자발표</span>
          </span>
        );
      case 'notice':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-300 font-extrabold text-[10px] flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>공지사항</span>
          </span>
        );
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-black">
            <Bell className="w-3.5 h-3.5" />
            <span>PUZZLE PUZZLE NEWS & EVENTS</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            스토어 <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>새소식 & 이벤트</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            특별 할인 프로모션, 신규 퍼즐 게임 입고 및 공지사항을 확인하세요.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: '전체' },
              { id: 'event', label: '🎁 이벤트' },
              { id: 'notice', label: '📢 공지사항' },
              { id: 'winner', label: '🏆 당첨자발표' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  categoryFilter === tab.id
                    ? `${theme.buttonBg} shadow-md`
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목 및 내용 검색..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

        </div>

        {/* Notice List Table / Card View */}
        <div className="space-y-3">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                notice.isPinned
                  ? 'bg-purple-500/10 border-purple-500/30 shadow-md'
                  : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-purple-400/50'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                {notice.isPinned && (
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                    <Pin className="w-4 h-4 fill-purple-400" />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getCategoryBadge(notice.category)}
                    {notice.isImportant && (
                      <span className="px-2 py-0.5 rounded-md bg-red-500/15 text-red-500 text-[10px] font-black">
                        IMPORTANT
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white hover:text-purple-400 transition-colors">
                    {notice.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {notice.date}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {notice.views}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>

            </div>
          ))}

          {filteredNotices.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs font-bold">
              검색 조건에 해당되는 소식이 없습니다.
            </div>
          )}
        </div>

      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                {getCategoryBadge(selectedNotice.category)}
                <span className="text-xs text-slate-400">{selectedNotice.date}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {selectedNotice.title}
              </h3>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {selectedNotice.content}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                확인
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
