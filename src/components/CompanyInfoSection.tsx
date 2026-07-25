import React from 'react';
import { useStore } from '../context/StoreContext';
import { SEASONAL_THEMES } from '../utils/themeUtils';
import { MapPin, Phone, Clock, Instagram, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';

export const CompanyInfoSection: React.FC = () => {
  const { companyInfo, seasonalTheme } = useStore();
  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  if (!companyInfo.visible) return null;

  return (
    <section id="about-section" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STORE & BRAND STORY</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            {companyInfo.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {companyInfo.subtitle}
          </p>
        </div>

        {/* Content & Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main HTML Story Content */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
              🧩 '퍼즐퍼즐' 브랜드 철학
            </h3>

            <div
              className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: companyInfo.contentHtml }}
            />
          </div>

          {/* Location & Operating Hours Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Store Information */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-500" />
                <span>오프라인 스토어 가이드</span>
              </h3>

              <div className="space-y-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">매장 주소</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{companyInfo.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">대표 전화번호</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{companyInfo.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">운영 시간</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{companyInfo.businessHours}</span>
                  </div>
                </div>

              </div>

              {/* Map Placeholder Banner */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center space-y-2">
                <span className="text-xs font-extrabold text-purple-600 dark:text-purple-300 block">
                  📍 홍대입구역 9번 출구 도보 5분거리
                </span>
                <a
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(companyInfo.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md"
                >
                  <span>지도 앱에서 찾아오기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Social Channels */}
              <div className="pt-2 flex items-center justify-center gap-3">
                {companyInfo.instagramUrl && (
                  <a
                    href={companyInfo.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-pink-500 hover:scale-110 transition-transform"
                    title="공식 인스타그램"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {companyInfo.kakaoUrl && (
                  <a
                    href={companyInfo.kakaoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-amber-500 hover:scale-110 transition-transform"
                    title="카카오톡 채널"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
