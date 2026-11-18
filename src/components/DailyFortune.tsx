import React, { useState } from 'react';
import { Flower2, Mountain, Gem, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getDailyFortune, type DailyFortuneInfo } from '../data/numerologyData';

interface DailyFortuneProps {
  onOpenNumerology: () => void;
}

export const DailyFortune: React.FC<DailyFortuneProps> = ({ onOpenNumerology }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

  // Extract concise direction & amulet for ultra-clean display
  const shortDirection = fortune.direction.split('(')[0].trim();
  const shortAmulet = fortune.amulet.split('(')[0].trim();

  return (
    <section
      id="daily-fortune-section"
      className="washi-card relative h-full w-full scroll-mt-24 flex flex-col justify-between overflow-hidden rounded-2xl p-5 sm:p-6"
    >
      {/* Inner Japanese Frame */}
      <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-rose-200/70" />

      {/* Header with Diamond Dividers matching mockup */}
      <div className="relative z-10 mb-4">
        <div className="flex items-center justify-center gap-2.5">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-rose-300" />
          <span className="h-1.5 w-1.5 rotate-45 bg-crimson-400" />
          <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
            Con số may mắn hôm nay
          </h2>
          <span className="h-1.5 w-1.5 rotate-45 bg-crimson-400" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-rose-300" />
        </div>

        {/* Date Bar */}
        <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-ink-muted">
          <button
            onClick={handlePrevDay}
            aria-label="Ngày trước"
            className="grid h-6 w-6 place-items-center rounded-full border border-rose-200 bg-white text-crimson-500 hover:bg-crimson-50 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleResetToday}
            className="rounded-full bg-rose-50 px-2.5 py-0.5 font-medium text-crimson-700 hover:bg-rose-100 transition-colors"
          >
            {fortune.dateString}
          </button>
          <button
            onClick={handleNextDay}
            aria-label="Ngày sau"
            className="grid h-6 w-6 place-items-center rounded-full border border-rose-200 bg-white text-crimson-500 hover:bg-crimson-50 transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content: Circle Emblem + 3 Clean Attribute Rows */}
      <div className="relative z-10 grid grid-cols-1 items-center gap-5 sm:grid-cols-[140px_1fr]">
        {/* Left: Circular Lucky Number Seal with Japanese Clouds */}
        <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
          {/* Decorative Japanese Clouds SVG */}
          <svg
            viewBox="0 0 160 160"
            className="pointer-events-none absolute inset-0 h-full w-full text-rose-300/80"
            fill="none"
          >
            <path
              d="M8 46H34C39 46 42 42 42 38C42 34 38 31 34 31H24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M152 122H122C116 122 113 126 113 130C113 134 117 137 122 137H138"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Outer Double Ring */}
          <div className="grid h-28 w-28 place-items-center rounded-full border-2 border-rose-300 bg-white p-1.5 shadow-washi">
            <div className="grid h-full w-full place-items-center rounded-full border border-amber-300/80 bg-gradient-to-br from-[#6b2131] via-[#8c273b] to-[#c93b4f] shadow-inner">
              <span className="font-display text-5xl font-bold text-amber-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                {fortune.luckyNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Right: 3 Crisp Rows */}
        <dl className="divide-y divide-rose-200/75 text-sm">
          <div className="flex items-center justify-between gap-2 py-2.5">
            <dt className="flex items-center gap-2 text-ink-muted">
              <Flower2 className="h-4 w-4 text-crimson-500 shrink-0" />
              <span>Màu sắc:</span>
            </dt>
            <dd className="flex items-center gap-1.5 font-bold text-ink text-right">
              <span
                className="inline-block h-3 w-3 rounded-full border border-rose-200 shadow-sm shrink-0"
                style={{ backgroundColor: fortune.luckyColor.hex }}
              />
              <span>{fortune.luckyColor.name}</span>
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2 py-2.5">
            <dt className="flex items-center gap-2 text-ink-muted">
              <Mountain className="h-4 w-4 text-crimson-500 shrink-0" />
              <span>Phương hướng:</span>
            </dt>
            <dd className="font-bold text-ink text-right">{shortDirection}</dd>
          </div>

          <div className="flex items-center justify-between gap-2 py-2.5">
            <dt className="flex items-center gap-2 text-ink-muted">
              <Gem className="h-4 w-4 text-crimson-500 shrink-0" />
              <span>Vật may mắn:</span>
            </dt>
            <dd className="font-bold text-crimson-700 text-right">{shortAmulet}</dd>
          </div>
        </dl>
      </div>

      {/* Footer CTA to Open Full Numerology */}
      <div className="relative z-10 mt-4 flex items-center justify-between gap-2 border-t border-rose-200/70 pt-3">
        <span className="text-[11px] text-ink-muted truncate">
          Nguyên tố: <strong className="text-ink">{fortune.element.split('(')[0]}</strong>
        </span>
        <button
          onClick={onOpenNumerology}
          className="inline-flex items-center gap-1 rounded-full bg-crimson-50 px-3 py-1 text-[11px] font-bold text-crimson-600 border border-rose-200 hover:bg-crimson-500 hover:text-white transition-all shrink-0"
        >
          <Sparkles className="h-3 w-3" />
          <span>Xem Thần số học cá nhân</span>
        </button>
      </div>
    </section>
  );
};
