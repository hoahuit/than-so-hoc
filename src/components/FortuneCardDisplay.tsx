import React, { useState, useEffect } from 'react';
import {
  Scroll,
  BookOpen,
  Briefcase,
  Coins,
  Heart,
  Flower2,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  Share2,
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

type AspectCategory = 'career' | 'wealth' | 'love' | 'health';

const CATEGORY_TABS: {
  key: AspectCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  contentIcon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'career', label: 'Công danh', icon: Briefcase, contentIcon: TrendingUp },
  { key: 'wealth', label: 'Tài lộc', icon: Coins, contentIcon: Coins },
  { key: 'love', label: 'Tình duyên', icon: Heart, contentIcon: Heart },
  { key: 'health', label: 'Sức khỏe', icon: Flower2, contentIcon: Flower2 },
];

export const FortuneCardDisplay: React.FC<FortuneCardDisplayProps> = ({
  fortune,
  isSaved,
  onSave,
  onShare,
  flipVersion,
}) => {
  const [activeCategory, setActiveCategory] = useState<AspectCategory>('career');

  useEffect(() => {
    setActiveCategory('career');
  }, [fortune.id, flipVersion]);

  const CurrentContentIcon = CATEGORY_TABS.find((t) => t.key === activeCategory)?.contentIcon || TrendingUp;

  return (
    <section id="fortune-result-section" className="relative w-full max-w-2xl mx-auto scroll-mt-20 my-4 sm:my-6">
      {/* ================= KẾT QUẢ QUẺ XĂM CARD ================= */}
      <div className="relative rounded-3xl border-2 border-[#e6d5be] bg-[#fffdfa] p-5 sm:p-8 shadow-[0_18px_45px_rgba(110,30,18,0.12)] overflow-hidden animate-card-bloom">
        
        {/* Decorative Top Left Plum/Sakura Blossom Branch */}
        <svg
          viewBox="0 0 160 120"
          className="pointer-events-none absolute -left-4 -top-3 w-28 sm:w-36 opacity-85 text-[#9e2717]"
          fill="none"
        >
          {/* Branch lines */}
          <path d="M-10 10 Q30 25 70 15 Q100 8 135 30" stroke="#7a180b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M40 22 Q60 40 85 45" stroke="#7a180b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M75 14 Q95 -2 120 5" stroke="#7a180b" strokeWidth="1.5" strokeLinecap="round" />
          {/* Cherry Blossom Flowers */}
          <circle cx="70" cy="15" r="7" fill="#dc2626" />
          <circle cx="70" cy="15" r="2.5" fill="#fef08a" />
          <circle cx="85" cy="45" r="6" fill="#b91c1c" />
          <circle cx="85" cy="45" r="2" fill="#fef08a" />
          <circle cx="120" cy="5" r="5.5" fill="#dc2626" />
          <circle cx="120" cy="5" r="1.8" fill="#fef08a" />
          <circle cx="135" cy="30" r="7.5" fill="#991b1b" />
          <circle cx="135" cy="30" r="2.5" fill="#fef08a" />
          <circle cx="45" cy="28" r="4.5" fill="#ef4444" />
        </svg>

        {/* Decorative Top Right Plum/Sakura Blossom Branch */}
        <svg
          viewBox="0 0 160 120"
          className="pointer-events-none absolute -right-4 -top-3 w-28 sm:w-36 opacity-85 text-[#9e2717] scale-x-[-1]"
          fill="none"
        >
          <path d="M-10 10 Q30 25 70 15 Q100 8 135 30" stroke="#7a180b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M40 22 Q60 40 85 45" stroke="#7a180b" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="70" cy="15" r="7" fill="#dc2626" />
          <circle cx="70" cy="15" r="2.5" fill="#fef08a" />
          <circle cx="85" cy="45" r="6" fill="#b91c1c" />
          <circle cx="85" cy="45" r="2" fill="#fef08a" />
          <circle cx="135" cy="30" r="7.5" fill="#991b1b" />
          <circle cx="135" cy="30" r="2.5" fill="#fef08a" />
        </svg>

        {/* 1. ORNAMENTAL TITLE PLAQUE: Kết Quả Quẻ Xăm */}
        <div className="relative z-10 mx-auto my-1 flex justify-center">
          <div className="relative flex items-center justify-center">
            {/* Left Bracket / Wing */}
            <div className="h-6 w-3 sm:h-7 sm:w-4 border-y-2 border-l-2 border-[#cba135] bg-[#7a180b] rounded-l-md -mr-1" />
            
            {/* Main Center Ribbon */}
            <div className="relative flex items-center justify-center rounded-lg bg-gradient-to-r from-[#7a180b] via-[#9e2717] to-[#7a180b] px-6 sm:px-9 py-2 border-y-2 border-[#cba135] shadow-[0_4px_12px_rgba(122,24,11,0.35)]">
              <span className="font-sans text-sm sm:text-base font-extrabold text-amber-100 drop-shadow-sm tracking-normal">
                Kết Quả Quẻ Xăm
              </span>
            </div>

            {/* Right Bracket / Wing */}
            <div className="h-6 w-3 sm:h-7 sm:w-4 border-y-2 border-r-2 border-[#cba135] bg-[#7a180b] rounded-r-md -ml-1" />
          </div>
        </div>

        {/* 2. NUMBER LINE: ── ☁ ── Quẻ số 28 ── ☁ ── */}
        <div className="relative z-10 my-3 flex items-center justify-center gap-2 sm:gap-3 text-ink">
          <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#cba135]" />
          <span className="text-xs text-[#cba135] select-none">☁</span>
          <div className="font-sans text-base sm:text-lg text-[#3d1a15] flex items-center gap-1.5 font-bold">
            <span>Quẻ số</span>
            <strong className="font-sans text-2xl sm:text-3xl font-black text-[#8b2a18]">
              {fortune.stickNumber}
            </strong>
          </div>
          <span className="text-xs text-[#cba135] select-none">☁</span>
          <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#cba135]" />
        </div>

        {/* 3. CALLIGRAPHY BRUSH CAPSULE: Đại Cát */}
        <div className="relative z-10 my-2 flex justify-center">
          <div className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#8b2a18] via-[#a33a24] to-[#8b2a18] px-8 sm:px-10 py-1.5 text-amber-50 shadow-[0_4px_12px_rgba(139,42,24,0.3)] border border-[#cba135]/40">
            <span className="font-sans text-base sm:text-lg font-black tracking-widest pl-1">
              {fortune.rank}
            </span>
          </div>
        </div>

        {/* 4. SUBSECTION: Lời quẻ (4-line poem) */}
        <div className="relative z-10 mt-5">
          <div className="flex items-center gap-2 mb-2 text-[#8b2a18] font-bold text-sm sm:text-base">
            <Scroll className="h-4 w-4" />
            <span>Lời quẻ</span>
          </div>

          <div className="rounded-2xl border border-[#ecdccb] bg-[#faf3e8]/75 p-4 sm:p-5 text-center shadow-xs">
            <blockquote className="font-sans text-xs sm:text-sm italic leading-relaxed text-[#2c1410] space-y-1">
              {fortune.poem.map((line, idx) => (
                <p key={idx} className="block font-medium">
                  {idx === 0 ? `“${line}` : idx === fortune.poem.length - 1 ? `${line}”` : line}
                </p>
              ))}
            </blockquote>
          </div>
        </div>

        {/* 5. SUBSECTION: Giải nghĩa */}
        <div className="relative z-10 mt-4 sm:mt-5">
          <div className="flex items-center gap-2 mb-1.5 text-[#8b2a18] font-bold text-sm sm:text-base">
            <BookOpen className="h-4 w-4" />
            <span>Giải nghĩa</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[#3d1a15] text-justify font-normal px-1">
            {fortune.meaning}
          </p>
        </div>

        {/* 6. SUBSECTION: 4 Category Tabs (Công danh, Tài lộc, Tình duyên, Sức khỏe) */}
        <div className="relative z-10 mt-5 pt-1">
          {/* Tab Headers */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    shrineAudio.playStickSlide();
                    setActiveCategory(tab.key);
                  }}
                  className={`flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl py-2 px-1 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#8b2a18] text-white shadow-sm font-bold'
                      : 'bg-[#f4eae0] text-[#5c2a21] hover:bg-[#ede0d1] border border-[#e2d5c3]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Divination Content Box */}
          <div className="mt-3 rounded-2xl border border-[#f5d6cc] bg-[#fdf3f0] p-4 flex items-start gap-3 shadow-xs transition-all">
            <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#fae3dd] text-[#8b2a18]">
              <CurrentContentIcon className="h-4 w-4" />
            </div>
            <p className="text-xs sm:text-sm text-[#3d1a15] leading-relaxed font-medium">
              {fortune.aspects[activeCategory]}
            </p>
          </div>
        </div>

        {/* 7. ACTION BUTTONS: Chia sẻ / Lưu quẻ */}
        <div className="relative z-10 mt-6 pt-2 flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => onShare(fortune)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#8b2a18]/40 bg-white py-2.5 px-4 text-xs sm:text-sm font-bold text-[#8b2a18] shadow-xs hover:bg-[#faeee9] transition-all active:scale-98"
          >
            <Share2 className="h-4 w-4" />
            <span>Chia sẻ</span>
          </button>

          <button
            type="button"
            onClick={() => onSave(fortune)}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full border py-2.5 px-4 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-98 ${
              isSaved
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                : 'border-[#8b2a18]/40 bg-white text-[#8b2a18] hover:bg-[#faeee9]'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4 text-emerald-700" />
                <span>Đã lưu quẻ</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                <span>Lưu quẻ</span>
              </>
            )}
          </button>
        </div>

        {/* Subtle Bottom Feng Shui Note */}
        <div className="relative z-10 mt-4 pt-3 border-t border-[#f0e4d5] flex flex-wrap items-center justify-between text-[11px] text-[#7d564d] px-1">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#cba135]" />
            Màu may: <strong className="text-[#3d1a15]">{fortune.numerology.color}</strong>
          </span>
          <span>
            Hướng tốt: <strong className="text-[#3d1a15]">{fortune.numerology.direction}</strong>
          </span>
          <span>
            Vật may: <strong className="text-[#3d1a15]">{fortune.numerology.amulet}</strong>
          </span>
        </div>
      </div>
    </section>
  );
};
