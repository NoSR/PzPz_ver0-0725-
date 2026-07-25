import React from 'react';
import { useStore } from '../context/StoreContext';
import { LOGO_PRESETS } from '../utils/themeUtils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const { logoPreset, customLogoUrl } = useStore();
  const preset = LOGO_PRESETS[logoPreset] || LOGO_PRESETS['purple-lavender'];

  // Size mapping
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const subTextSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-[13px]',
    xl: 'text-[15px]',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none cursor-pointer group ${className}`}>
      {/* Cube Logo Vector or Custom Image */}
      {logoPreset === 'custom' && customLogoUrl ? (
        <img
          src={customLogoUrl}
          alt="Puzzle Puzzle Logo"
          className={`${iconSizes[size]} object-contain transition-transform duration-300 group-hover:scale-110`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className={`relative ${iconSizes[size]} transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105`}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Isometric Face */}
            <polygon
              points="50,10 85,28 50,46 15,28"
              fill={preset.primary}
              opacity="0.9"
            />
            {/* Left Isometric Face */}
            <polygon
              points="15,28 50,46 50,86 15,68"
              fill={preset.primary}
            />
            {/* Right Isometric Face */}
            <polygon
              points="50,46 85,28 85,68 50,86"
              fill={preset.secondary}
            />

            {/* Grid lines for 3x3 Isometric Cube */}
            {/* Top grid lines */}
            <line x1="26.6" y1="22" x2="61.6" y2="40" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
            <line x1="38.3" y1="16" x2="73.3" y2="34" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
            <line x1="38.3" y1="16" x2="26.6" y2="34" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
            <line x1="61.6" y1="22" x2="50" y2="40" stroke="#ffffff" strokeWidth="2" opacity="0.6" />

            {/* Left face grid lines */}
            <line x1="26.6" y1="34" x2="26.6" y2="74" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
            <line x1="38.3" y1="40" x2="38.3" y2="80" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
            <line x1="15" y1="41.3" x2="50" y2="59.3" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
            <line x1="15" y1="54.6" x2="50" y2="72.6" stroke="#ffffff" strokeWidth="2" opacity="0.6" />

            {/* Right face grid lines */}
            <line x1="61.6" y1="34" x2="61.6" y2="74" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
            <line x1="73.3" y1="28" x2="73.3" y2="68" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
            <line x1="50" y1="59.3" x2="85" y2="41.3" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
            <line x1="50" y1="72.6" x2="85" y2="54.6" stroke="#ffffff" strokeWidth="2" opacity="0.6" />

            {/* Lettering highlights representing 'P U Z Z L E' on cube tiles */}
            <rect x="45" y="24" width="10" height="6" fill="#ffffff" rx="1" opacity="0.9" />
            <rect x="68" y="38" width="8" height="12" fill="#ffffff" rx="1" opacity="0.8" />
            <rect x="22" y="48" width="8" height="12" fill="#ffffff" rx="1" opacity="0.8" />
          </svg>
        </div>
      )}

      {/* Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-black tracking-tight ${textSizes[size]} text-slate-900 dark:text-white transition-colors`}>
            퍼즐 <span style={{ color: preset.secondary }}>퍼즐</span>
          </span>
          <span className={`font-extrabold tracking-wider uppercase ${subTextSizes[size]} text-slate-500 dark:text-slate-400`}>
            PUZZLE PUZZLE
          </span>
        </div>
      )}
    </div>
  );
};
