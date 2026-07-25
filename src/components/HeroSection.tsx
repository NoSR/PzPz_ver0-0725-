import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SEASONAL_THEMES } from '../utils/themeUtils';
import { Sparkles, Calendar, ArrowRight, MapPin, Play, Star, RotateCcw } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { heroConfig, seasonalTheme, games, setSelectedGameForBooking, setIsBookingModalOpen, user, setIsAuthModalOpen } = useStore();
  const theme = SEASONAL_THEMES[seasonalTheme] || SEASONAL_THEMES['trendy-lavender'];

  // Interactive 3D Cube Rotation State
  const [cubeRotation, setCubeRotation] = useState({ x: -20, y: 35 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMoveOnCube = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setCubeRotation({
      x: -20 - y * 0.15,
      y: 35 + x * 0.15,
    });
  };

  const handleResetCube = () => {
    setCubeRotation({ x: -20, y: 35 });
  };

  const handlePrimaryClick = () => {
    if (games.length > 0) {
      if (!user) {
        setIsAuthModalOpen(true);
        return;
      }
      setSelectedGameForBooking(games[0]);
      setIsBookingModalOpen(true);
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-40 ${theme.cubesColor1}`} style={{ backgroundColor: theme.cubesColor1 }} />
        <div className={`absolute top-1/2 -right-32 w-96 h-96 rounded-full blur-[140px] opacity-35 ${theme.cubesColor2}`} style={{ backgroundColor: theme.cubesColor2 }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & CTA Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Customizable Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/10 dark:bg-slate-800/60 border border-slate-300/50 dark:border-slate-700/60 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
              <span className="text-xs font-black tracking-wide text-purple-600 dark:text-purple-300">
                {heroConfig.badgeText}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight">
              {heroConfig.title}{' '}
              <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent block mt-2 drop-shadow-sm`}>
                {heroConfig.highlightTitleText}
              </span>
            </h1>

            {/* Subtitle & Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
              {heroConfig.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
              {heroConfig.description}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handlePrimaryClick}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base ${theme.buttonBg} ${theme.buttonHover} shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3`}
              >
                <Calendar className="w-5 h-5" />
                <span>{heroConfig.primaryButtonText}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {heroConfig.showSecondaryButton && (
                <a
                  href={heroConfig.secondaryButtonUrl}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-sm bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span>{heroConfig.secondaryButtonText}</span>
                </a>
              )}
            </div>

            {/* Quick Feature Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>평점 4.9 (1,200+ 고객 리뷰)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>오늘 예약 가능 타임 8개</span>
              </div>
            </div>
          </div>

          {/* Right Interactive 3D Cube Visual Element */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              onMouseMove={handleMouseMoveOnCube}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                handleResetCube();
              }}
              className="relative w-72 h-72 sm:w-80 sm:h-80 cursor-grab active:cursor-grabbing group perspective-1000"
            >
              {/* Glow backdrop */}
              <div
                className={`absolute inset-0 rounded-full blur-3xl opacity-50 transition-all duration-300 ${
                  isHovered ? 'scale-125 opacity-70' : 'scale-100'
                }`}
                style={{
                  background: `radial-gradient(circle, ${theme.cubesColor1} 0%, ${theme.cubesColor2} 100%)`,
                }}
              />

              {/* Interactive 3D Rotating Rubik Cube representation */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out preserve-3d"
                style={{
                  transform: `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg)`,
                }}
              >
                <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                  {/* Isometric Front face */}
                  <div
                    className="absolute inset-0 rounded-3xl border-2 border-white/40 p-4 shadow-2xl backdrop-blur-md flex flex-col justify-between"
                    style={{
                      background: `linear-gradient(135deg, ${theme.cubesColor1}ee, ${theme.cubesColor2}ee)`,
                    }}
                  >
                    <div className="flex justify-between items-center text-white font-black text-xs">
                      <span>PUZZLE</span>
                      <Sparkles className="w-4 h-4" />
                    </div>
                    
                    {/* 3x3 Tile Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <div
                          key={i}
                          className="h-9 sm:h-11 rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xs shadow-inner hover:scale-105 transition-transform"
                        >
                          {i === 5 ? '🧩' : ''}
                        </div>
                      ))}
                    </div>

                    <div className="text-right text-[10px] text-white/80 font-bold uppercase tracking-wider">
                      Interactive 3D
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Interaction Hint */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] font-bold border border-slate-700 shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                <Play className="w-3 h-3 text-purple-400 animate-bounce" />
                <span>마우스를 올려 3D 큐브를 돌려보세요!</span>
                <button
                  onClick={handleResetCube}
                  title="큐브 각도 초기화"
                  className="ml-1 text-slate-400 hover:text-white"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
