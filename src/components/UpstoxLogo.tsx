import React from 'react';

interface UpstoxLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  isPro?: boolean;
  className?: string;
}

export const UpstoxLogo: React.FC<UpstoxLogoProps> = ({
  size = 'md',
  showText = true,
  isPro = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', icon: 16, text: 'text-base', proBadge: 'text-[9px] px-1' },
    md: { box: 'w-9 h-9', icon: 20, text: 'text-lg', proBadge: 'text-[10px] px-1.5' },
    lg: { box: 'w-11 h-11', icon: 24, text: 'text-xl', proBadge: 'text-[11px] px-2' },
    xl: { box: 'w-16 h-16', icon: 34, text: 'text-2xl', proBadge: 'text-xs px-2.5' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Upstox Signature Purple Squircle Icon */}
      <div
        className={`${current.box} rounded-xl bg-gradient-to-br from-[#7b2cbf] via-[#5c2494] to-[#3c1361] p-1 flex items-center justify-center shadow-md shadow-[#5c2494]/25 ring-1 ring-white/10 shrink-0 relative overflow-hidden`}
      >
        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20 pointer-events-none" />

        {/* Upstox 'u' SVG with green upward trend tick */}
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main White U-Shape */}
          <path
            d="M 12 11
               L 12 21
               C 12 26.5 15.5 29.5 20.5 29.5
               C 25.5 29.5 29 26.5 29 21
               L 29 17
               C 29 15.8 28.1 14.8 27 14.8
               C 25.9 14.8 25 15.8 25 17
               L 25 21
               C 25 24.2 23.2 25.8 20.5 25.8
               C 17.8 25.8 16 24.2 16 21
               L 16 11
               C 16 9.8 15.1 8.8 14 8.8
               C 12.9 8.8 12 9.8 12 11 Z"
            fill="#FFFFFF"
          />
          {/* Signature Upstox Dynamic Green Upward Growth Arrow */}
          <path
            d="M 27 10
               L 31.5 14.5
               C 32.1 15.1 32.1 16 31.5 16.6
               C 30.9 17.2 30 17.2 29.4 16.6
               L 27.2 14.4
               L 27.2 19
               C 27.2 20.1 26.3 21 25.2 21
               C 24.1 21 23.2 20.1 23.2 19
               L 23.2 12
               C 23.2 10.8 24.1 10 25.2 10
               L 27 10 Z"
            fill="#10B981"
          />
          <circle cx="29.5" cy="11.5" r="1.2" fill="#34D399" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`${current.text} font-black tracking-tight text-white light:text-slate-900 font-sans`}>
            upstox
          </span>
          {isPro && (
            <span
              className={`${current.proBadge} font-mono font-bold uppercase rounded bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xs tracking-wider`}
            >
              PRO
            </span>
          )}
        </div>
      )}
    </div>
  );
};
