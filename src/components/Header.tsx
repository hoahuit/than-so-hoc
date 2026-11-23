import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bookmark, Music, Music2 } from 'lucide-react';
import { shrineAudio } from '../utils/sound';

interface HeaderProps {
  onOpenNumerology: () => void;
  onOpenSaved: () => void;
  onScrollToOmikuji: () => void;
  onOpenTarotDraw: () => void;
  savedCount: number;
  musicOn: boolean;
  onToggleMusic: () => void;
}

type NavKey = 'home' | 'omikuji' | 'fortune' | 'numerology' | 'saved';

export const Header: React.FC<HeaderProps> = ({
  onOpenNumerology,
  onOpenSaved,
  onScrollToOmikuji,
  savedCount,
  musicOn,
  onToggleMusic,
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
      label: 'Lắc xăm',
      action: () => {
        setActiveNav('omikuji');
        onScrollToOmikuji();
      },
    },
    {
      key: 'fortune',
      label: 'Lời xăm',
      action: () => {
        setActiveNav('fortune');
        const el = document.getElementById('fortune-result-section');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    },
    {
      key: 'numerology',
      label: 'Số may mắn & Thần số',
      action: () => {
        setActiveNav('numerology');
        onOpenNumerology();
      },
    },
    {
      key: 'saved',
      label: 'Sổ xăm đã lưu',
      action: () => {
        setActiveNav('saved');
        onOpenSaved();
      },
    },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 w-full transition-all duration-300 ${isScrolled
        ? 'bg-[#8b2a18]/95 py-3 shadow-[0_8px_24px_rgba(87,22,10,0.35)] backdrop-blur-md border-b border-[#cba135]/30 text-white'
        : 'bg-gradient-to-b from-black/60 to-transparent py-4 sm:py-5 border-b border-transparent text-white'
        }`}
    >
      <div className="flex w-full items-center justify-between gap-6 px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Brand Name in Vietnamese (Clean, Authentic, No Box) */}
        <button
          type="button"
          onClick={() => {
            setActiveNav('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          {/* Minimalist Temple Bell / Torii SVG */}
          <svg
            viewBox="0 0 36 32"
            fill="none"
            className="h-7 w-8 text-brass-300 transition-colors duration-200 group-hover:text-brass-200"
          >
            <path d="M2 6C10 9.5 26 9.5 34 6L33 9.5C25 12 11 12 3 9.5L2 6Z" fill="currentColor" />
            <rect x="6" y="13" width="24" height="2.4" fill="#fde7b0" />
            <rect x="9.5" y="9" width="3" height="21" fill="currentColor" />
            <rect x="23.5" y="9" width="3" height="21" fill="currentColor" />
            <rect x="16.5" y="9.5" width="3" height="4.8" fill="#ffffff" />
          </svg>

          <div className="leading-none">
            <span className="mt-1 block font-jp text-[10px] tracking-[0.35em] text-brass-200/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              神の数 · OMIKUJI
            </span>
          </div>
        </button>

        {/* Center Minimal Navigation */}
        <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-7 lg:gap-9">
          {navItems.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={item.action}
                className={`relative py-1 text-sm font-semibold tracking-wide transition-colors duration-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] ${isActive
                  ? 'text-brass-300 font-bold'
                  : 'text-white/85 hover:text-white'
                  }`}
              >
                <span className="relative z-10 flex items-center gap-1">
                  {isActive && <span className="text-[11px] text-amber-300 animate-twinkle">✦</span>}
                  <span>{item.label}</span>
                </span>
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-[2px] transition-opacity duration-300 bg-brass-300 ${isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Right Utilities */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Background Music Toggle */}
          <button
            type="button"
            onClick={onToggleMusic}
            title={musicOn ? 'Tắt nhạc thiền đền thần' : 'Bật nhạc thiền đền thần'}
            className="text-white/85 hover:text-brass-200 transition-colors focus:outline-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
          >
            {musicOn ? <Music2 className="h-5 w-5 text-brass-300 animate-pulse" /> : <Music className="h-5 w-5 opacity-60" />}
          </button>

          {/* Sound FX Audio Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundOn ? 'Tắt hiệu ứng âm thanh lắc xăm' : 'Bật hiệu ứng âm thanh'}
            className="text-white/85 hover:text-brass-200 transition-colors focus:outline-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
          >
            {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 opacity-50" />}
          </button>

          {/* Saved Fortunes */}
          <button
            type="button"
            onClick={() => {
              setActiveNav('saved');
              onOpenSaved();
            }}
            title="Sổ xăm đã lưu"
            className="relative flex items-center gap-1.5 text-sm font-semibold text-white/85 hover:text-brass-200 transition-colors focus:outline-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
          >
            <Bookmark className="h-5 w-5" />
            {savedCount > 0 && (
              <span className="text-xs font-bold text-brass-300">
                {savedCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
