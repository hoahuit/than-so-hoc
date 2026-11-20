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

type NavKey = 'home' | 'omikuji' | 'tarot' | 'numerology' | 'saved';

export const Header: React.FC<HeaderProps> = ({
  onOpenNumerology,
  onOpenSaved,
  onScrollToOmikuji,
  onOpenTarotDraw,
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
          ? 'bg-[#240a12]/95 py-3 shadow-[0_12px_36px_rgba(20,5,10,0.5),0_1px_0_rgba(254,205,211,0.18)] backdrop-blur-xl border-b border-rose-300/25'
          : 'bg-gradient-to-b from-[#2a0c15]/60 via-[#2a0c15]/25 to-transparent py-4 sm:py-5 border-b border-white/5 backdrop-blur-[2px]'
      }`}
    >
      <div className="flex w-full items-center justify-between gap-6 px-5 sm:px-8 lg:px-12 xl:px-16 text-white">
        {/* Clean Editorial Logo */}
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
            className="h-7 w-8 text-amber-200 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(253,230,138,0.7)]"
          >
            <path d="M2 6C10 9.5 26 9.5 34 6L33 9.5C25 12 11 12 3 9.5L2 6Z" fill="currentColor" />
            <rect x="6" y="13" width="24" height="2.4" fill="#fda4af" />
            <rect x="9.5" y="9" width="3" height="21" fill="currentColor" />
            <rect x="23.5" y="9" width="3" height="21" fill="currentColor" />
            <rect x="16.5" y="9.5" width="3" height="4.8" fill="#fb7185" />
          </svg>

          <div className="leading-none">
            <span className="block font-display text-xl sm:text-2xl font-bold tracking-wide text-amber-50 text-glow-gold">
              Kami no Sū
            </span>
            <span className="mt-1 block font-jp text-[11px] tracking-[0.45em] text-rose-200/90 font-medium">
              神の数
            </span>
          </div>
        </button>

        {/* Airy Editorial Center Navigation (Bigger & Sparkling Text) */}
        <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-2 lg:gap-3">
          {navItems.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={item.action}
                className={`relative px-3.5 py-1.5 rounded-full text-[15px] lg:text-base font-semibold tracking-wide transition-all duration-200 group ${
                  isActive
                    ? 'text-amber-200 text-glow-gold font-bold bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                    : 'text-rose-100/85 hover:text-amber-200 hover:text-glow-gold hover:bg-white/5'
                }`}
              >
                <span className="relative z-10 flex items-center gap-1">
                  {isActive && <span className="text-[11px] text-amber-300 animate-twinkle">✦</span>}
                  <span>{item.label}</span>
                </span>
                <span
                  className={`absolute inset-x-2.5 -bottom-0.5 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_8px_rgba(253,230,138,0.9)] transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Minimal Borderless Right Utilities */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Music Toggle Button */}
          <button
            type="button"
            onClick={onToggleMusic}
            title={musicOn ? 'Tắt nhạc nền' : 'Bật nhạc nền Nhật Bản'}
            className={`relative flex items-center gap-1 transition-all focus:outline-none p-1.5 rounded-full hover:bg-white/10 ${
              musicOn
                ? 'text-amber-200 drop-shadow-[0_0_8px_rgba(253,230,138,0.8)]'
                : 'text-rose-100/70 hover:text-amber-200'
            }`}
          >
            {musicOn ? (
              <>
                <Music2 className="h-5 w-5" />
                {/* Animated music notes */}
                <span className="animate-bounce-note absolute -top-1.5 -right-1 text-[10px] text-amber-200 select-none pointer-events-none font-bold">♪</span>
              </>
            ) : (
              <Music className="h-5 w-5 opacity-60" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={soundOn ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
            className="text-rose-100/80 hover:text-amber-200 transition-colors focus:outline-none p-1.5 rounded-full hover:bg-white/10"
          >
            {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 opacity-50" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveNav('saved');
              onOpenSaved();
            }}
            title="Bộ sưu tập quẻ đã lưu"
            className="relative flex items-center gap-1.5 text-sm font-semibold text-rose-100/90 hover:text-amber-200 transition-colors focus:outline-none p-1.5 rounded-full hover:bg-white/10"
          >
            <Bookmark className="h-5 w-5" />
            {savedCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson-500 px-1 text-[10px] font-bold text-white shadow-sm">
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveNav('omikuji');
              onScrollToOmikuji();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#f26979] to-[#d93d50] px-4 py-1.5 text-[13px] font-bold text-white shadow-coral-glow hover:brightness-110 hover:scale-105 active:scale-95 transition-all shimmer-sweep"
          >
            <span>Lắc hũ ngay</span>
            <span className="text-amber-200">✦</span>
          </button>
        </div>
      </div>
    </header>
  );
};
