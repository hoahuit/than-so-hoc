import React, { useState } from 'react';
import { Volume2, VolumeX, Bell, Bookmark } from 'lucide-react';
import { shrineAudio } from '../utils/sound';

interface HeaderProps {
  onOpenNumerology: () => void;
  onOpenSaved: () => void;
  onScrollToOmikuji: () => void;
  onOpenTarotDraw: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNumerology,
  onOpenSaved,
  onScrollToOmikuji,
  onOpenTarotDraw,
  savedCount,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(true);

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    shrineAudio.enabled = nextState;
    if (nextState) {
      shrineAudio.playShrineBell();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-300/20 bg-[#3a151e]/92 px-4 sm:px-6 lg:px-10 xl:px-14 py-3 text-rose-50 backdrop-blur-md shadow-sm">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Brand Logo with Torii Gate Emblem */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex cursor-pointer items-center gap-2.5 group"
        >
          {/* Minimalist Gold-Rose Torii SVG */}
          <svg
            viewBox="0 0 36 32"
            fill="none"
            className="h-8 w-9 text-amber-200 transition-transform duration-300 group-hover:scale-105"
          >
            <path d="M2 6C10 9.5 26 9.5 34 6L33 9.5C25 12 11 12 3 9.5L2 6Z" fill="currentColor" />
            <rect x="6" y="13" width="24" height="2.6" rx="1" fill="#fda4af" />
            <rect x="9.5" y="9" width="3.2" height="21" rx="1" fill="currentColor" />
            <rect x="23.3" y="9" width="3.2" height="21" rx="1" fill="currentColor" />
            <rect x="16.5" y="9.5" width="3" height="5" fill="#fb7185" />
          </svg>

          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-wide text-amber-50 group-hover:text-rose-200 transition-colors">
              Kami no Sū
            </div>
            <div className="font-jp text-[10px] tracking-[0.42em] text-rose-200/80">
              神の数
            </div>
          </div>
        </div>

        {/* Desktop Centered Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="relative py-1 text-amber-100 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-rose-300 transition-colors"
          >
            Trang chủ
          </button>
          <button
            onClick={onScrollToOmikuji}
            className="py-1 text-rose-100/80 hover:text-amber-200 transition-colors"
          >
            Rút quẻ
          </button>
          <button
            onClick={onOpenTarotDraw}
            className="py-1 text-rose-100/80 hover:text-amber-200 transition-colors"
          >
            Tarot Omikuji
          </button>
          <button
            onClick={onOpenNumerology}
            className="py-1 text-rose-100/80 hover:text-amber-200 transition-colors"
          >
            Thần số học
          </button>
          <button
            onClick={onOpenSaved}
            className="py-1 text-rose-100/80 hover:text-amber-200 transition-colors"
          >
            Bộ sưu tập
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            title={soundOn ? 'Tắt âm thanh đền thần' : 'Bật âm thanh đền thần'}
            className="grid h-8 w-8 place-items-center rounded-full border border-rose-200/25 bg-white/10 text-rose-100 hover:border-amber-200 hover:text-amber-200 transition-colors"
          >
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 opacity-60" />}
          </button>

          {/* Saved Fortunes Pill */}
          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 rounded-full border border-rose-200/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-rose-50 hover:border-amber-200 hover:bg-white/15 transition-all"
          >
            <Bookmark className="h-3.5 w-3.5 text-amber-200" />
            <span className="hidden sm:inline">Đã lưu</span>
            {savedCount > 0 && (
              <span className="grid h-4 min-w-4 place-items-center rounded-full bg-crimson-500 px-1 text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </button>

          {/* Notification Bell + Cute Miko Seal Avatar */}
          <button
            onClick={onOpenNumerology}
            title="Thông điệp hôm nay"
            className="relative hidden sm:grid h-8 w-8 place-items-center rounded-full text-rose-100/85 hover:text-amber-200 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-400 ring-2 ring-[#3a151e]" />
          </button>

          <button
            onClick={onOpenNumerology}
            title="Hồ sơ Thần số học"
            className="grid h-9 w-9 place-items-center rounded-full border-2 border-amber-200/80 bg-gradient-to-br from-rose-300 via-crimson-400 to-crimson-600 font-jp text-sm font-bold text-white shadow-sm hover:scale-105 transition-transform"
          >
            巫
          </button>
        </div>
      </div>
    </header>
  );
};
