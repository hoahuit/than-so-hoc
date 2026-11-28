import React, { useState } from 'react';
import {
  Compass,
  Gem,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { getDailyFortune, type DailyFortuneInfo } from '../data/numerologyData';

interface DailyFortuneProps {
  onOpenNumerology: () => void;
}

const MEDALLION_PARTICLES = [
  { left: '14%', top: '20%', delay: '0s' },
  { right: '12%', top: '24%', delay: '1.1s' },
  { left: '16%', bottom: '22%', delay: '1.8s' },
  { right: '14%', bottom: '20%', delay: '0.6s' },
];

export const DailyFortune: React.FC<DailyFortuneProps> = ({ onOpenNumerology }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const fortune: DailyFortuneInfo = getDailyFortune(selectedDate);

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleResetToday = () => {
    setSelectedDate(new Date());
  };

  const shortDirection = fortune.direction.split('(')[0].trim();
  const shortAmulet = fortune.amulet.split('(')[0].trim();
  const shortElement = fortune.element.split('(')[0].trim();

  return (
    <section
      id="daily-fortune-section"
      className="relative h-full w-full scroll-mt-24 pt-7 flex flex-col"
    >
      {/* Peeking Torii Gate + Golden Clouds + Burgundy Scroll Ribbon Header */}
      <div className="relative z-20 -mb-5 flex flex-col items-center">
        <svg viewBox="0 0 64 28" className="h-6 w-14 text-[#8b1b1a] drop-shadow-sm" fill="none">
          <path d="M4 6C18 11 46 11 60 6L58 11C45 14.5 19 14.5 6 11L4 6Z" fill="currentColor" />
          <rect x="11" y="14" width="42" height="3" fill="#d9a441" />
          <rect x="16" y="10" width="4.5" height="17" fill="currentColor" />
          <rect x="43.5" y="10" width="4.5" height="17" fill="currentColor" />
        </svg>

        <div className="relative flex items-center justify-center">
          {/* Left Golden Cloud */}
          <svg viewBox="0 0 42 20" className="hidden sm:block -mr-2 h-5 w-10 text-[#e5c16c]" fill="currentColor">
            <path d="M40 16H10C5 16 2 13 2 9.5C2 6.5 4.8 4 8.5 4C10 1.8 13 0.5 16.5 1C19 1.3 21 3 22 5.2C24 4.2 26.8 4.4 28.5 6.2C32 5.8 36 8 40 16Z" fillOpacity="0.85" />
          </svg>

          <div className="relative inline-flex items-center justify-center rounded-full border-2 border-[#f3d179] bg-gradient-to-r from-[#5e0d12] via-[#8b1b1f] to-[#5e0d12] px-6 sm:px-8 py-1.5 shadow-[0_8px_20px_rgba(94,13,18,0.36)]">
            <span className="mr-2 text-[10px] text-[#fde7b0]">✦</span>
            <h2 className="font-serif text-base sm:text-lg font-bold tracking-wide text-[#fff8e7]">
              Con Số May Mắn Hôm Nay
            </h2>
            <span className="ml-2 text-[10px] text-[#fde7b0]">✦</span>
          </div>

          {/* Right Golden Cloud */}
          <svg viewBox="0 0 42 20" className="hidden sm:block -ml-2 h-5 w-10 -scale-x-100 text-[#e5c16c]" fill="currentColor">
            <path d="M40 16H10C5 16 2 13 2 9.5C2 6.5 4.8 4 8.5 4C10 1.8 13 0.5 16.5 1C19 1.3 21 3 22 5.2C24 4.2 26.8 4.4 28.5 6.2C32 5.8 36 8 40 16Z" fillOpacity="0.85" />
          </svg>
        </div>
      </div>

      {/* Main Ivory Washi Plaque Card */}
      <div className="relative flex-1 flex flex-col justify-between overflow-hidden rounded-3xl border border-[#dec19b] bg-gradient-to-b from-[#fffdfa] via-[#fcf7ee] to-[#f8efe1] px-5 pb-5 pt-8 sm:px-6 sm:pb-6 sm:pt-9 shadow-[0_16px_42px_-12px_rgba(105,45,25,0.22)]">
        {/* Champagne Gold Inner Frame */}
        <div className="pointer-events-none absolute inset-2 rounded-2xl border border-[#e3c699]/85" />

        {/* Japanese Mountain Landscape & Pagoda Silhouette */}
        <svg
          viewBox="0 0 420 130"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full text-[#d9bfa9]/30"
          fill="currentColor"
        >
          <path d="M0 130V88C52 64 105 74 156 92C214 112 268 62 332 72C372 78 398 92 420 98V130H0Z" />
          <path d="M0 130V104C65 92 145 112 225 102C295 92 355 114 420 104V130H0Z" fill="#cfa03b" fillOpacity="0.14" />
          <path d="M305 78h22l-2-8h-18l-2 8Zm3-10h16l-2-7h-12l-2 7Zm2-9h12l-6-10l-6 10Z" />
        </svg>

        {/* Date Selector */}
        <div className="relative z-10 mb-4 flex items-center justify-center gap-2 text-[11px] text-[#735249]">
          <button
            type="button"
            onClick={handlePrevDay}
            aria-label="Ngày trước"
            className="grid h-6 w-6 place-items-center rounded-full border border-[#e2c9aa] bg-white text-[#7a1218] hover:bg-[#faeee9] active:scale-95 transition"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetToday}
            className="rounded-full border border-[#ebd7be] bg-[#faf2e6] px-3.5 py-0.5 font-semibold text-[#581016] hover:bg-[#f3e4cf] transition"
          >
            {fortune.dateString}
          </button>
          <button
            type="button"
            onClick={handleNextDay}
            aria-label="Ngày sau"
            className="grid h-6 w-6 place-items-center rounded-full border border-[#e2c9aa] bg-white text-[#7a1218] hover:bg-[#faeee9] active:scale-95 transition"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Center Highlight: Glowing Lucky Number Medallion + 3 Aligned Rows */}
        <div className="relative z-10 grid grid-cols-1 items-center gap-5 sm:grid-cols-[156px_1fr]">
          {/* Left: Ornamental Medallion with Gentle Pulse & Floating Particles */}
          <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
            {/* Radial Golden Pulse Halo */}
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-amber-300/45 via-yellow-200/30 to-rose-300/20 blur-xl animate-halo-pulse" />

            {/* Floating Golden Sparkle Particles */}
            {MEDALLION_PARTICLES.map((pt, i) => (
              <span
                key={i}
                style={{ ...pt, animationDelay: pt.delay }}
                className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#f3d179] shadow-[0_0_8px_#fde7b0] animate-twinkle"
              />
            ))}

            <div className="relative grid h-28 w-28 place-items-center rounded-full border-2 border-[#e5c16c] bg-gradient-to-b from-[#fff5dc] to-[#ebd29a] p-1.5 shadow-[0_12px_30px_rgba(120,25,22,0.3)]">
              <div className="grid h-full w-full place-items-center rounded-full border border-[#fde7b0]/75 bg-gradient-to-br from-[#9e2618] via-[#751318] to-[#47090d] shadow-inner">
                <span className="font-serif text-5xl font-black text-[#fde7b0] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                  {fortune.luckyNumber}
                </span>
              </div>
            </div>

            {/* Blooming Lotus Accent */}
            <svg viewBox="0 0 60 32" className="pointer-events-none absolute -bottom-0.5 h-8 w-14 drop-shadow-sm" fill="none">
              <path d="M30 4C26 12 25 20 30 26C35 20 34 12 30 4Z" fill="#fbcfe8" stroke="#ec4899" strokeOpacity="0.4" />
              <path d="M18 10C18 18 23 23 30 26C27 18 23 13 18 10Z" fill="#f9a8d4" />
              <path d="M42 10C42 18 37 23 30 26C33 18 37 13 42 10Z" fill="#f9a8d4" />
              <path d="M10 18C14 24 22 26 30 26C24 21 17 18 10 18Z" fill="#fce7f3" />
              <path d="M50 18C46 24 38 26 30 26C36 21 43 18 50 18Z" fill="#fce7f3" />
            </svg>
          </div>

          {/* Right: 3 Crisp Rows */}
          <dl className="divide-y divide-[#ebd9c3] text-xs sm:text-sm">
            <div className="flex items-center justify-between gap-2 py-2.5">
              <dt className="flex items-center gap-2 text-[#735249]">
                <Sparkles className="h-4 w-4 text-[#b45309] shrink-0" />
                <span>Màu cát tường:</span>
              </dt>
              <dd className="flex items-center gap-1.5 font-bold text-[#3d1a15] text-right">
                <span
                  className="inline-block h-3 w-3 rounded-full border border-[#d6b78d] shadow-sm shrink-0"
                  style={{ backgroundColor: fortune.luckyColor.hex }}
                />
                <span>{fortune.luckyColor.name}</span>
              </dd>
            </div>

            <div className="flex items-center justify-between gap-2 py-2.5">
              <dt className="flex items-center gap-2 text-[#735249]">
                <Compass className="h-4 w-4 text-[#b45309] shrink-0" />
                <span>Phương hướng tốt:</span>
              </dt>
              <dd className="font-bold text-[#3d1a15] text-right">{shortDirection}</dd>
            </div>

            <div className="flex items-center justify-between gap-2 py-2.5">
              <dt className="flex items-center gap-2 text-[#735249]">
                <Gem className="h-4 w-4 text-[#b45309] shrink-0" />
                <span>Vật phẩm hộ mệnh:</span>
              </dt>
              <dd className="font-bold text-[#581016] text-right">{shortAmulet}</dd>
            </div>
          </dl>
        </div>

        {/* Footer: Five-Element Pill + Numerology CTA */}
        <div className="relative z-10 mt-5 flex flex-wrap items-center justify-between gap-2.5 border-t border-[#ebd9c3] pt-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e3c699] bg-white/95 px-3 py-1 text-[11px] text-[#735249] shadow-sm">
            <span>Nguyên tố:</span>
            <strong className="text-[#581016]">{shortElement}</strong>
          </span>

          <button
            type="button"
            onClick={onOpenNumerology}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#cfa03b] bg-gradient-to-r from-[#fff8e7] to-[#fae8c0] px-4 py-1.5 text-[11px] sm:text-xs font-extrabold text-[#581016] shadow-sm hover:from-[#781218] hover:to-[#581016] hover:text-amber-50 hover:border-[#781218] active:scale-95 transition-all shrink-0"
          >
            <span>Tra Thần số học chi tiết</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
