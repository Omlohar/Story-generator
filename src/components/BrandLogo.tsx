import React from 'react';

interface BrandLogoProps {
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  title,
  subtitle,
  size = 'md',
}) => {
  const iconBox = size === 'sm' ? 'w-9 h-9' : 'w-10 h-10';

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      {/* Custom Studio Emblem SVG — X Digital Solution (Created by Pankaj Lohar) */}
      <div
        className={`${iconBox} rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shrink-0 shadow-xs ring-1 ring-zinc-900/15 dark:ring-white/20`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
        >
          {/* Outer rounded cinema frame */}
          <rect
            x="3.5"
            y="5.5"
            width="33"
            height="29"
            rx="6"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          {/* Bold geometric "X" emblem */}
          <path
            d="M11.5 13L21.5 27"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M21.5 13L11.5 27"
            stroke="#E11D48"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Crimson Play Aperture + Crazy Dot spark */}
          <path d="M25.5 15L32.5 20L25.5 25V15Z" fill="#E11D48" />
          <circle cx="31.5" cy="10.5" r="1.7" fill="#E11D48" />
        </svg>
      </div>

      <div className="text-left min-w-0 leading-tight">
        <span className="block text-sm sm:text-base font-bold tracking-tight text-zinc-950 dark:text-zinc-50 truncate">
          {title}
        </span>
        {subtitle && (
          <span className="block text-[10px] sm:text-[11px] font-medium text-zinc-600 dark:text-zinc-300 truncate">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
