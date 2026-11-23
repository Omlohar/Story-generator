import React from 'react';
import { UiCopy } from '../data/i18n';
import { BrandLogo } from './BrandLogo';

export type ActiveTab = 'studio' | 'storyboard' | 'teleprompter' | 'saved';

interface HeaderProps {
  copy: UiCopy;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onNewScript: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  copy,
  activeTab,
  onSelectTab,
  onNewScript,
}) => {
  const isHindi = copy.brand === 'पटकथा स्टूडियो';
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'studio', label: copy.navStudio },
    { id: 'storyboard', label: copy.navStoryboard },
    { id: 'teleprompter', label: copy.navTeleprompter },
    { id: 'saved', label: copy.navSaved },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Custom Brand Logo — एक्स डिजिटल सॉल्यूशन (X Digital Solution) · Created by Pankaj Lohar */}
        <button
          type="button"
          onClick={() => onSelectTab('studio')}
          className="shrink-0 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48]"
        >
          <BrandLogo
            title={isHindi ? 'एक्स डिजिटल सॉल्यूशन' : 'X Digital Solution'}
            subtitle={
              isHindi
                ? 'पटकथा स्टूडियो · क्रीटेड बाय पंकज लोहार'
                : 'Patkatha Studio · Created by Pankaj Lohar'
            }
          />
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`py-5 border-b-2 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48] ${
                  isActive
                    ? 'border-[#E11D48] text-zinc-950 dark:text-white font-semibold'
                    : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onNewScript}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48]"
          >
            {copy.newScriptBtn}
          </button>
        </div>
      </div>

      {/* Mobile navigation strip */}
      <nav
        aria-label="Mobile Navigation"
        className="flex md:hidden items-center justify-around border-t border-zinc-100 dark:border-zinc-800 px-2 bg-white dark:bg-zinc-950 overflow-x-auto"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`py-2.5 px-2 text-xs font-medium border-b-2 whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'border-[#E11D48] text-zinc-950 dark:text-white font-semibold'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
