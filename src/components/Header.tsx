import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bookmark } from 'lucide-react';
import { shrineAudio } from '../utils/sound';

interface HeaderProps {
  onOpenNumerology: () => void;
  onOpenSaved: () => void;
  onScrollToOmikuji: () => void;
  onOpenTarotDraw: () => void;
  savedCount: number;
}

type NavKey = 'home' | 'omikuji' | 'tarot' | 'numerology' | 'saved';

export const Header: React.FC<HeaderProps> = ({
  onOpenNumerology,
  onOpenSaved,
  onScrollToOmikuji,
  onOpenTarotDraw,
  savedCount,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [activeNav, setActiveNav] = useState<NavKey>('home');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    shrineAudio.enabled = nextState;
    if (nextState) {
      shrineAudio.playShrineBell();
    }
  };

  const navItems: { key: NavKey; label: string; action: () => void }[] = [
    {
      key: 'home',
      label: 'Trang chủ',
      action: () => {
        setActiveNav('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      key: 'omikuji',
      label: 'Rút quẻ',
      action: () => {
        setActiveNav('omikuji');
        onScrollToOmikuji();
      },
    },
    {
      key: 'tarot',
      label: 'Tarot Omikuji',
      action: () => {
        setActiveNav('tarot');
        onOpenTarotDraw();
      },
    },
    {
      key: 'numerology',
      label: 'Thần số học',
      action: () => {
        setActiveNav('numerology');
        onOpenNumerology();
      },
    },
    {
      key: 'saved',
      label: 'Bộ sưu tập',
      action: () => {
        setActiveNav('saved');
        onOpenSaved();
      },
    },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#3d131e]/95 py-3 shadow-[0_8px_24px_rgba(45,12,21,0.22)] backdrop-blur-md border-b border-rose-200/15'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="flex w-full items-center justify-between gap-6 px-5 sm:px-8 lg:px-12 xl:px-16 text-white">
        {/* Clean Editorial Logo (No box, no badge clutter) */}
        <button
          type="button"
          onClick={() => {
            setActiveNav('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <svg
            viewBox="0 0 36 32"
            fill="none"
            className="h-7 w-8 text-amber-200 transition-opacity duration-200 group-hover:opacity-85"
          >
            <path d="M2 6C10 9.5 26 9.5 34 6L33 9.5C25 12 11 12 3 9.5L2 6Z" fill="currentColor" />
            <rect x="6" y="13" width="24" height="2.4" fill="#fda4af" />
            <rect x="9.5" y="9" width="3" height="21" fill="currentColor" />
            <rect x="23.5" y="9" width="3" height="21" fill="currentColor" />
            <rect x="16.5" y="9.5" width="3" height="4.8" fill="#fb7185" />
          </svg>

          <div className="leading-none">
            <span className="block font-display text-lg sm:text-xl font-bold tracking-wide text-amber-50">
              Kami no Sū
            </span>
            <span className="mt-1 block font-jp text-[10px] tracking-[0.42em] text-rose-200/80">
              神の数
            </span>
          </div>
        </button>

        {/* Airy Editorial Center Navigation (No pill dock, no heavy boxes) */}
        <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-8 lg:gap-10">
          {navItems.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={item.action}
                className={`relative py-1 text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive
                    ? 'text-amber-100'
                    : 'text-rose-100/75 hover:text-white'
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-[1.5px] bg-gradient-to-r from-transparent via-amber-200 to-transparent transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Minimal Borderless Right Utilities */}
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            type="button"
            onClick={toggleSound}
            title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="text-rose-100/80 hover:text-amber-200 transition-colors focus:outline-none"
          >
            {soundOn ? <Volume2 className="h-[18px] w-[18px]" /> : <VolumeX className="h-[18px] w-[18px] opacity-50" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveNav('saved');
              onOpenSaved();
            }}
            title="Bộ sưu tập quẻ đã lưu"
            className="relative flex items-center gap-1.5 text-sm font-medium text-rose-100/85 hover:text-amber-200 transition-colors focus:outline-none"
          >
            <Bookmark className="h-[18px] w-[18px]" />
            {savedCount > 0 && (
              <span className="text-xs font-bold text-amber-200">{savedCount}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveNav('omikuji');
              onScrollToOmikuji();
            }}
            className="hidden sm:inline-block text-sm font-semibold tracking-wide text-amber-200 hover:text-white transition-colors relative pb-0.5 after:absolute after:inset-x-0 after:bottom-0 after:h-[1px] after:bg-amber-200/70 hover:after:bg-white"
          >
            Lắc hũ ngay
          </button>
        </div>
      </div>
    </header>
  );
};
