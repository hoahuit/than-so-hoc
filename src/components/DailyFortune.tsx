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
      {/* Inner Sacred Frame */}
      <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-temple-200/80" />

      {/* Header */}
      <div className="relative z-10 mb-4">
        <div className="flex items-center justify-center gap-2.5">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-temple-300" />
          <span className="h-1.5 w-1.5 rotate-45 bg-temple-700" />
          <h2 className="font-display text-lg sm:text-xl font-bold text-temple-900">
            Con Số May Mắn Hôm Nay
          </h2>
          <span className="h-1.5 w-1.5 rotate-45 bg-temple-700" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-temple-300" />
        </div>

        {/* Date Bar */}
        <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-ink-muted">
          <button
            onClick={handlePrevDay}
            aria-label="Ngày trước"
            className="grid h-6 w-6 place-items-center rounded-full border border-temple-200 bg-white text-temple-800 hover:bg-temple-50 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleResetToday}
            className="rounded-full bg-temple-50 px-3 py-0.5 font-semibold text-temple-800 hover:bg-temple-100 transition-colors"
          >
            {fortune.dateString}
          </button>
          <button
            onClick={handleNextDay}
            aria-label="Ngày sau"
            className="grid h-6 w-6 place-items-center rounded-full border border-temple-200 bg-white text-temple-800 hover:bg-temple-50 transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content: Circle Emblem + 3 Clean Attribute Rows */}
      <div className="relative z-10 grid grid-cols-1 items-center gap-5 sm:grid-cols-[140px_1fr]">
        {/* Left: Circular Lucky Number Seal with Japanese Clouds */}
        <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
          <svg
            viewBox="0 0 160 160"
            className="pointer-events-none absolute inset-0 h-full w-full text-temple-300/70"
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
          <div className="grid h-28 w-28 place-items-center rounded-full border-2 border-temple-300 bg-white p-1.5 shadow-temple">
            <div className="grid h-full w-full place-items-center rounded-full border border-brass-400 bg-gradient-to-br from-[#8b2a18] via-[#a33a24] to-[#6e1e12] shadow-inner">
              <span className="font-display text-5xl font-black text-brass-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                {fortune.luckyNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Right: 3 Crisp Rows */}
        <dl className="divide-y divide-temple-100 text-sm">
          <div className="flex items-center justify-between gap-2 py-2.5">
            <dt className="flex items-center gap-2 text-ink-muted">
              <Flower2 className="h-4 w-4 text-temple-700 shrink-0" />
              <span>Màu cát tường:</span>
            </dt>
            <dd className="flex items-center gap-1.5 font-bold text-temple-900 text-right">
              <span
                className="inline-block h-3 w-3 rounded-full border border-temple-200 shadow-sm shrink-0"
                style={{ backgroundColor: fortune.luckyColor.hex }}
              />
              <span>{fortune.luckyColor.name}</span>
            </dd>
          </div>

          <div className="flex items-center justify-between gap-2 py-2.5">
            <dt className="flex items-center gap-2 text-ink-muted">
              <Mountain className="h-4 w-4 text-temple-700 shrink-0" />
              <span>Phương hướng tốt:</span>
            </dt>
            <dd className="font-bold text-temple-900 text-right">{shortDirection}</dd>
          </div>

          <div className="flex items-center justify-between gap-2 py-2.5">
            <dt className="flex items-center gap-2 text-ink-muted">
              <Gem className="h-4 w-4 text-temple-700 shrink-0" />
              <span>Vật phẩm hộ mệnh:</span>
            </dt>
            <dd className="font-bold text-temple-800 text-right">{shortAmulet}</dd>
          </div>
        </dl>
      </div>

      {/* Footer CTA to Open Full Numerology */}
      <div className="relative z-10 mt-4 flex items-center justify-between gap-2 border-t border-temple-200/80 pt-3">
        <span className="text-[11px] text-ink-muted truncate">
          Nguyên tố: <strong className="text-temple-900">{fortune.element.split('(')[0]}</strong>
        </span>
        <button
          onClick={onOpenNumerology}
          className="inline-flex items-center gap-1 rounded-full bg-temple-50 px-3 py-1 text-[11px] font-bold text-temple-800 border border-temple-200 hover:bg-temple-800 hover:text-white transition-all shrink-0"
        >
          <Sparkles className="h-3 w-3" />
          <span>Tra Thần số học chi tiết</span>
        </button>
      </div>
    </section>
  );
};
