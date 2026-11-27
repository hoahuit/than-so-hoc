import React, { useState } from 'react';
import {
  Scroll,
  Calendar,
  Heart,
  Briefcase,
  Compass,
  ChevronDown,
  Bookmark,
  BookmarkCheck,
  Share2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { FORTUNE_RANK_INFO, type OmikujiFortune, type PlanType } from '../data/omikujiData';
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

type SectionKey = 'next30' | 'love' | 'careerWealth' | 'advice';

export const FortuneCardDisplay: React.FC<FortuneCardDisplayProps> = ({
  fortune,
  isSaved,
  onSave,
  onShare,
  onRedraw,
  flipVersion,
}) => {
  // Track which of the 4 interpretation sections are expanded; reset cleanly when fortune changes via key
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    next30: true,
    love: false,
    careerWealth: false,
    advice: false,
  });

  const rankMeta = FORTUNE_RANK_INFO[fortune.rank];

  const toggleSection = (key: SectionKey) => {
    shrineAudio.playStickSlide();
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const interpretationSections: {
    key: SectionKey;
    code: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    preview: string;
    detail: React.ReactNode;
  }[] = [
    {
      key: 'next30',
      code: 'A',
      title: '30 ngày tới',
      icon: Calendar,
      preview: fortune.summary,
      detail: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed text-[#3d1a15]">{fortune.meaning}</p>
          <div className="rounded-xl border border-[#ebd9c8] bg-[#faf4ea] p-3.5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8b2a18] mb-1.5">
              Thơ sấm cổ truyền
            </p>
            <blockquote className="text-xs sm:text-sm italic text-[#2c1410] space-y-0.5">
              {fortune.poem.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </blockquote>
          </div>
        </div>
      ),
    },
    {
      key: 'love',
      code: 'B',
      title: 'Chuyện tình duyên',
      icon: Heart,
      preview: fortune.aspects.love,
      detail: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed text-[#3d1a15]">
            {fortune.aspects.love}
          </p>
          <div className="flex items-center justify-between rounded-xl bg-[#fdf1ee] px-3.5 py-2.5 border border-[#f5d5ce]">
            <span className="text-xs font-semibold text-[#7a180b]">Chỉ số hòa hợp tình duyên</span>
            <span className="text-sm font-black text-[#8b2a18]">{fortune.scores.love}%</span>
          </div>
        </div>
      ),
    },
    {
      key: 'careerWealth',
      code: 'C',
      title: 'Công danh & Tài chính',
      icon: Briefcase,
      preview: fortune.aspects.career,
      detail: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed text-[#3d1a15]">
            <strong className="text-[#8b2a18]">Công danh:</strong> {fortune.aspects.career}
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-[#3d1a15]">
            <strong className="text-[#8b2a18]">Tài lộc:</strong> {fortune.aspects.wealth}
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="rounded-xl bg-[#faf4e8] px-3 py-2 border border-[#ead9be] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#6b3a24]">Sự nghiệp</span>
              <span className="text-xs font-black text-[#8b2a18]">{fortune.scores.career}%</span>
            </div>
            <div className="rounded-xl bg-[#faf4e8] px-3 py-2 border border-[#ead9be] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#6b3a24]">Tài lộc</span>
              <span className="text-xs font-black text-[#8b2a18]">{fortune.scores.wealth}%</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'advice',
      code: 'D',
      title: 'Lời khuyên từ quẻ xăm',
      icon: Compass,
      preview: fortune.advice,
      detail: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed text-[#3d1a15]">{fortune.advice}</p>
          <p className="text-xs sm:text-sm leading-relaxed text-[#5c2a21]">
            <strong>Sức khỏe &amp; Bình an:</strong> {fortune.aspects.health} ({fortune.scores.health}%)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-xl border border-[#ead9be] bg-[#faf4ea] p-3 text-[11px] text-[#5c2a21]">
            <div>
              Màu may mắn: <strong className="text-[#3d1a15]">{fortune.numerology.color}</strong>
            </div>
            <div>
              Hướng cát: <strong className="text-[#3d1a15]">{fortune.numerology.direction}</strong>
            </div>
            <div>
              Vật hộ mệnh: <strong className="text-[#3d1a15]">{fortune.numerology.amulet}</strong>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      key={`${fortune.id}-${flipVersion}`}
      id="fortune-result-section"
      className="relative w-full max-w-3xl mx-auto scroll-mt-20 my-4 sm:my-8 space-y-5"
    >
      {/* ================= TOP DECORATIVE FORTUNE CARD ================= */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-[#d4af37]/55 bg-gradient-to-b from-[#23060c] via-[#170408] to-[#110205] p-6 sm:p-9 text-amber-50 shadow-[0_24px_60px_rgba(20,4,8,0.35)] animate-card-bloom">
        {/* Subtle Gold Corner Borders */}
        <div className="pointer-events-none absolute inset-3 rounded-2xl border border-[#d4af37]/25" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-72 -translate-x-1/2 rounded-full bg-amber-400/15 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-3">
          {/* Sacred Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/45 bg-[#3a0c15]/80 px-4 py-1 text-[11px] font-bold tracking-[0.16em] text-amber-200 uppercase">
            <Scroll className="h-3.5 w-3.5 text-brass-300" />
            <span>{rankMeta.badge}</span>
          </div>

          {/* Fortune Number & Japanese + Vietnamese Category */}
          <div className="space-y-1 pt-1">
            <p className="text-sm sm:text-base font-bold tracking-widest text-amber-200/90 uppercase">
              Quẻ số {fortune.stickNumber}
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fff8e7] via-[#fde7b0] to-[#d4af37]">
              {fortune.rank} <span className="font-jp font-bold">({fortune.kanjiRank})</span>
            </h2>
          </div>

          {/* Short Introductory Message */}
          <p className="max-w-md text-xs sm:text-sm text-amber-100/85 leading-relaxed">
            Một thông điệp dành riêng cho hành trình của bạn: <strong className="text-amber-200">“{fortune.title}”</strong>
          </p>

          {/* Action Row: Share / Save / Redraw */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3 w-full max-w-md">
            <button
              type="button"
              onClick={() => onShare(fortune)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#d4af37]/45 bg-white/10 px-4 py-2 text-xs font-bold text-amber-100 backdrop-blur-md transition hover:bg-white/20"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Chia sẻ</span>
            </button>

            <button
              type="button"
              onClick={() => onSave(fortune)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition ${
                isSaved
                  ? 'border-emerald-400/70 bg-emerald-950/60 text-emerald-200'
                  : 'border-[#d4af37]/45 bg-white/10 text-amber-100 hover:bg-white/20'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Đã lưu quẻ</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Lưu quẻ</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onRedraw}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-300/60 bg-gradient-to-r from-[#9e2717] to-[#7a180b] px-4 py-2 text-xs font-bold text-amber-50 shadow-sm transition hover:brightness-110"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Gieo quẻ khác</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= FOUR INTERPRETATION SECTIONS (A, B, C, D) ================= */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {interpretationSections.map((sec) => {
          const Icon = sec.icon;
          const isOpen = expandedSections[sec.key];

          return (
            <div
              key={sec.key}
              className="washi-card rounded-2xl border border-[#e6d3be] bg-[#fffcf7] p-4 sm:p-5 transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleSection(sec.key)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-3 text-left focus:outline-none"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#8b2a18] to-[#5c1218] text-amber-200 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-black text-[#a67d22]">{sec.code}.</span>
                      <h3 className="text-sm sm:text-base font-extrabold text-[#3d1a15]">
                        {sec.title}
                      </h3>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-[#695555] leading-relaxed">
                      {sec.preview}
                    </p>
                  </div>
                </div>

                <span
                  className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#e2ceb5] text-[#8b2a18] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#faeee9]' : 'bg-white'
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              {isOpen && (
                <div className="mt-3.5 border-t border-[#efe2d2] pt-3.5">
                  {sec.detail}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Subtle Bottom Numerology Note */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-[#7d564d]">
        <Sparkles className="h-3.5 w-3.5 text-[#cba135]" />
        <span>
          Con số linh ứng: <strong className="text-[#3d1a15]">{fortune.numerology.luckyNumber}</strong> · Vận mệnh số{' '}
          <strong className="text-[#3d1a15]">{fortune.numerology.destinyNumber}</strong>
        </span>
      </div>
    </section>
  );
};
