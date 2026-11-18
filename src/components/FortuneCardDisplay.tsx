import React, { useState, useEffect } from 'react';
import {
  Heart,
  Briefcase,
  Coins,
  Flower2,
  Bookmark,
  BookmarkCheck,
  Share2,
  RefreshCw,
  Rotate3d,
  Sparkles,
} from 'lucide-react';
import { type OmikujiFortune, type PlanType } from '../data/omikujiData';
import { shrineAudio } from '../utils/sound';

interface FortuneCardDisplayProps {
  fortune: OmikujiFortune;
  plan: PlanType;
  isSaved: boolean;
  onSave: (fortune: OmikujiFortune) => void;
  onShare: (fortune: OmikujiFortune) => void;
  onRedraw: () => void;
  flipVersion: number;
}

const PLAN_NAMES: Record<PlanType, string> = {
  mini: 'Mini Fortune',
  love: 'Love Fortune',
  destiny: 'Destiny Fortune',
};

export const FortuneCardDisplay: React.FC<FortuneCardDisplayProps> = ({
  fortune,
  plan,
  isSaved,
  onSave,
  onShare,
  onRedraw,
  flipVersion,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(true);
  const [animateBars, setAnimateBars] = useState<boolean>(true);

  useEffect(() => {
    if (flipVersion === 0) return;

    setIsFlipped(false);
    setAnimateBars(false);

    const flipTimer = setTimeout(() => {
      shrineAudio.playCardFlip();
      setIsFlipped(true);
    }, 420);

    const barTimer = setTimeout(() => {
      setAnimateBars(true);
    }, 820);

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(barTimer);
    };
  }, [flipVersion]);

  const handleToggleFlip = () => {
    shrineAudio.playCardFlip();
    setIsFlipped((prev) => !prev);
  };

  const statItems = [
    { label: 'Tình duyên', value: fortune.scores.love, icon: Heart, bar: 'from-[#f472b6] to-[#e85366]', delay: '0ms' },
    { label: 'Sự nghiệp', value: fortune.scores.career, icon: Briefcase, bar: 'from-[#fb7185] to-[#d43c50]', delay: '100ms' },
    { label: 'Tài lộc', value: fortune.scores.wealth, icon: Coins, bar: 'from-[#f59e0b] to-[#e85366]', delay: '200ms' },
    { label: 'Sức khỏe', value: fortune.scores.health, icon: Flower2, bar: 'from-[#fda4af] to-[#e14b5a]', delay: '300ms' },
  ];

  return (
    <section id="fortune-result-section" className="relative h-full w-full scroll-mt-24">
      <div className="perspective-1000 h-full w-full">
        <div
          className={`relative h-full w-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? '' : 'rotate-y-180'
          }`}
        >
          {/* ================= FRONT FACE (RESULT SCROLL CARD) ================= */}
          <div className="backface-hidden h-full w-full">
            <div className="washi-card relative grid h-full gap-5 overflow-hidden rounded-2xl p-5 sm:p-6 md:grid-cols-[112px_1fr_255px] lg:grid-cols-[120px_1fr_280px]">
              {/* Inner Japanese Frame */}
              <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-rose-200/75" />

              {/* Decorative Mt. Fuji & Soft Mist Watercolor SVG at Bottom-Center */}
              <svg
                viewBox="0 0 260 80"
                className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-56 opacity-25 text-crimson-500"
                fill="none"
              >
                <path d="M10 80 L110 14 L150 14 L250 80 Z" fill="url(#fujiGrad)" />
                <path d="M110 14 L130 32 L150 14 L138 24 L130 18 L122 24 Z" fill="#fffcfa" />
                <defs>
                  <linearGradient id="fujiGrad" x1="130" y1="14" x2="130" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#e85366" />
                    <stop offset="1" stopColor="#fde4e8" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Left Column: Vertical Japanese Omikuji Scroll Ribbon (matching mockup) */}
              <div className="relative z-10 flex flex-row items-center justify-between gap-3 rounded-xl border border-rose-300/80 bg-gradient-to-b from-[#fff1f2] via-[#ffe6e9] to-[#ffd9df] px-4 py-3 text-crimson-700 shadow-sm md:flex-col md:justify-center md:py-5">
                <span className="rounded-full bg-crimson-500/15 border border-crimson-400/40 px-2 py-0.5 font-jp text-[10px] font-bold text-crimson-700">
                  第{String(fortune.stickNumber).padStart(2, '0')}番
                </span>

                <b className="font-jp text-4xl md:text-5xl font-black leading-none text-crimson-700 md:vertical md:my-2 drop-shadow-[0_2px_4px_rgba(181,43,63,0.12)]">
                  {fortune.kanjiRank}
                </b>

                <div className="text-right md:text-center">
                  <span className="block text-sm font-extrabold text-ink">
                    {fortune.rank}
                  </span>
                  <span className="mt-0.5 inline-block text-crimson-500 text-xs">❀</span>
                </div>
              </div>

              {/* Middle Column: Header, Mystical Poem & Meaning */}
              <div className="relative z-10 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-crimson-500">🌸</span>
                      <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
                        Kết quả rút quẻ
                      </h2>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-crimson-50 border border-rose-200 px-2.5 py-0.5 text-[11px] font-semibold text-crimson-600">
                        {PLAN_NAMES[plan]}
                      </span>
                      <button
                        onClick={handleToggleFlip}
                        title="Lật thẻ 3D"
                        className="grid h-7 w-7 place-items-center rounded-full border border-rose-200 bg-white text-crimson-500 hover:bg-crimson-50 transition-colors"
                      >
                        <Rotate3d className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Fortune Title */}
                  <p className="text-xs font-bold uppercase tracking-wider text-crimson-600 mb-2">
                    {fortune.title}
                  </p>

                  {/* Poetic Quote */}
                  <blockquote className="mb-3 rounded-xl border-l-3 border-crimson-400 bg-white/75 px-3.5 py-2.5 font-jp text-xs sm:text-[13px] italic leading-relaxed text-ink shadow-sm">
                    “{fortune.poem.join(' · ')}”
                  </blockquote>

                  {/* Interpretation */}
                  <p className="text-xs sm:text-[13px] leading-relaxed text-ink-muted">
                    {fortune.meaning}
                  </p>
                </div>

                {/* Quick Advice Footer */}
                <p className="mt-3 text-[11.5px] font-medium text-crimson-700/90">
                  <strong className="text-crimson-600">Lời nhắn:</strong> {fortune.advice}
                </p>
              </div>

              {/* Right Column: 4 Animated Percentage Bars + Action Buttons */}
              <div className="relative z-10 flex flex-col justify-between gap-4 border-t border-rose-200/70 pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                {/* 4 Progress Bars */}
                <div className="space-y-3">
                  {statItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 font-semibold text-ink">
                            <Icon className="h-3.5 w-3.5 text-crimson-500" />
                            {item.label}
                          </span>
                          <span className="font-bold text-crimson-600">{item.value}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-rose-100">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${item.bar} transition-[width] duration-1000 ease-out`}
                            style={{
                              width: animateBars ? `${item.value}%` : '0%',
                              transitionDelay: item.delay,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Pill Buttons matching mockup */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onSave(fortune)}
                    className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                      isSaved
                        ? 'border border-crimson-400 bg-crimson-50 text-crimson-700'
                        : 'bg-[#5c1e2a] text-amber-50 shadow-sm hover:bg-[#742535]'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="h-3.5 w-3.5 text-crimson-600" />
                        <span>Đã lưu vào bộ sưu tập</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-3.5 w-3.5 text-amber-200" />
                        <span>Lưu vào bộ sưu tập</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onShare(fortune)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-300 bg-white px-3 py-2 text-xs font-bold text-ink hover:border-crimson-400 hover:bg-crimson-50 transition-all"
                    >
                      <Share2 className="h-3.5 w-3.5 text-crimson-500" />
                      <span>Chia sẻ</span>
                    </button>

                    <button
                      onClick={onRedraw}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#ee5b6d] to-[#d43c50] px-3 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 transition-all"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Rút mới</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BACK FACE (3D TAROT OMIKUJI SEAL) ================= */}
          <div
            onClick={handleToggleFlip}
            className="backface-hidden rotate-y-180 absolute inset-0 cursor-pointer"
          >
            <div className="washi-card-featured flex h-full min-h-[260px] flex-col items-center justify-center rounded-2xl p-6 text-center text-white relative overflow-hidden">
              <div className="pointer-events-none absolute inset-2.5 rounded-xl border border-amber-200/45" />
              <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-amber-200 bg-white/15 shadow-lg">
                <span className="font-jp text-4xl font-black text-amber-100">神</span>
              </div>
              <p className="mt-3 font-jp text-lg font-bold tracking-[0.35em] text-amber-100">
                御神籤 · 開運
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1 text-xs font-bold text-white backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                Chạm để mở lá quẻ số #{fortune.stickNumber}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
