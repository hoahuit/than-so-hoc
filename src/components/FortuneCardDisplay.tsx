import React, { useState } from 'react';
import {
  Scroll,
  Sparkles,
  Briefcase,
  Heart,
  Compass,
  ChevronDown,
  Bookmark,
  BookmarkCheck,
  Share2,
  RotateCcw,
  Gift,
  Lock,
  Unlock,
  MessageCircleHeart,
} from 'lucide-react';
import { FORTUNE_RANK_INFO, type OmikujiFortune, type PlanType } from '../data/omikujiData';
import { shrineAudio } from '../utils/sound';

interface FortuneCardDisplayProps {
  fortune: OmikujiFortune;
  plan: PlanType;
  isSaved: boolean;
  isUnlocked: boolean;
  onSave: (fortune: OmikujiFortune) => void;
  onShare: (fortune: OmikujiFortune) => void;
  onRedraw: () => void;
  onOpenGift: (fortune: OmikujiFortune) => void;
  onOpenUnlock: () => void;
  onConsult1on1: () => void;
  flipVersion: number;
}

type SectionKey = 'mood' | 'career' | 'love' | 'advice';

export const FortuneCardDisplay: React.FC<FortuneCardDisplayProps> = ({
  fortune,
  isSaved,
  isUnlocked,
  onSave,
  onShare,
  onRedraw,
  onOpenGift,
  onOpenUnlock,
  onConsult1on1,
  flipVersion,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    mood: true,
    career: true,
    love: false,
    advice: true,
  });

  const rankMeta = FORTUNE_RANK_INFO[fortune.rank];

  const toggleSection = (key: SectionKey) => {
    shrineAudio.playStickSlide();
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const mirrorMood = fortune.mirrorMood ?? fortune.meaning;
  const careerInsight = fortune.careerInsight ?? fortune.aspects.career;
  const loveInsight = fortune.loveInsight ?? fortune.aspects.love;
  const closingAdvice = fortune.closingAdvice ?? fortune.advice;

  const interpretationSections: {
    key: SectionKey;
    code: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    preview: string;
    detail: React.ReactNode;
  }[] = [
    {
      key: 'mood',
      code: '01',
      title: 'Tâm trạng hiện tại của bạn',
      icon: Sparkles,
      preview: fortune.summary,
      detail: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed text-[#3d1a15]">{mirrorMood}</p>
          <div className="rounded-xl border border-[#ebd9c8] bg-[#faf4ea] p-3.5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8b2a18] mb-1.5">
              Lời thơ ứng quẻ
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
      key: 'career',
      code: '02',
      title: 'Góc nhìn Công việc & Sự nghiệp',
      icon: Briefcase,
      preview: careerInsight,
      detail: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed text-[#3d1a15]">{careerInsight}</p>
          <p className="text-xs leading-relaxed text-[#5c2a21]">
            <strong className="text-[#8b2a18]">Tài chính đi kèm:</strong> {fortune.aspects.wealth}
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="rounded-xl bg-[#faf4e8] px-3 py-2 border border-[#ead9be] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#6b3a24]">Nhịp sự nghiệp</span>
              <span className="text-xs font-black text-[#8b2a18]">{fortune.scores.career}%</span>
            </div>
            <div className="rounded-xl bg-[#faf4e8] px-3 py-2 border border-[#ead9be] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#6b3a24]">Dòng tài chính</span>
              <span className="text-xs font-black text-[#8b2a18]">{fortune.scores.wealth}%</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'love',
      code: '03',
      title: 'Góc nhìn Tình cảm & Mối quan hệ',
      icon: Heart,
      preview: loveInsight,
      detail: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed text-[#3d1a15]">{loveInsight}</p>
          <div className="flex items-center justify-between rounded-xl bg-[#fdf1ee] px-3.5 py-2.5 border border-[#f5d5ce]">
            <span className="text-xs font-semibold text-[#7a180b]">Mức độ kết nối hiện tại</span>
            <span className="text-sm font-black text-[#8b2a18]">{fortune.scores.love}%</span>
          </div>
        </div>
      ),
    },
    {
      key: 'advice',
      code: '04',
      title: 'Lời khuyên chốt hạ',
      icon: Compass,
      preview: closingAdvice,
      detail: (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm leading-relaxed font-medium text-[#3d1a15]">
            {closingAdvice}
          </p>
          <p className="text-xs leading-relaxed text-[#5c2a21]">
            <strong>Sức khỏe &amp; Năng lượng:</strong> {fortune.aspects.health} ({fortune.scores.health}%)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-xl border border-[#ead9be] bg-[#faf4ea] p-3 text-[11px] text-[#5c2a21]">
            <div>
              Màu hộ thân: <strong className="text-[#3d1a15]">{fortune.numerology.color}</strong>
            </div>
            <div>
              Hướng cát: <strong className="text-[#3d1a15]">{fortune.numerology.direction}</strong>
            </div>
            <div>
              Bùa gợi ý: <strong className="text-[#3d1a15]">{fortune.numerology.amulet}</strong>
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
      className="relative w-full mx-auto space-y-5"
    >
      {/* ================= TOP DECORATIVE FORTUNE CARD ================= */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-[#d4af37]/55 bg-gradient-to-b from-[#23060c] via-[#170408] to-[#110205] p-6 sm:p-9 text-amber-50 shadow-[0_24px_60px_rgba(20,4,8,0.35)] animate-card-bloom">
        <div className="pointer-events-none absolute inset-3 rounded-2xl border border-[#d4af37]/25" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-72 -translate-x-1/2 rounded-full bg-amber-400/15 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/45 bg-[#3a0c15]/80 px-4 py-1 text-[11px] font-bold tracking-[0.16em] text-amber-200 uppercase">
            <Scroll className="h-3.5 w-3.5 text-brass-300" />
            <span>{rankMeta.badge}</span>
          </div>

          <div className="space-y-1 pt-1">
            <p className="text-sm sm:text-base font-bold tracking-widest text-amber-200/90 uppercase">
              Quẻ số {fortune.stickNumber}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fff8e7] via-[#fde7b0] to-[#d4af37]">
              {fortune.title}
            </h2>
            <p className="text-xs font-bold tracking-widest text-amber-200/80 uppercase">
              {fortune.rank} <span className="font-jp">({fortune.kanjiRank})</span>
            </p>
          </div>

          <p className="max-w-lg text-xs sm:text-sm text-amber-100/85 leading-relaxed">
            {rankMeta.vibe}
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3 w-full">
            <button
              type="button"
              onClick={() => onOpenGift(fortune)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-200 via-[#fde7b0] to-amber-300 px-4 py-2 text-xs font-extrabold text-[#3d0e08] shadow-md transition hover:brightness-105 active:scale-95"
            >
              <Gift className="h-3.5 w-3.5" />
              <span>Nhận Bùa &amp; Hình Nền Miễn Phí</span>
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
              onClick={() => onShare(fortune)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#d4af37]/45 bg-white/10 px-4 py-2 text-xs font-bold text-amber-100 backdrop-blur-md transition hover:bg-white/20"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Chia sẻ</span>
            </button>

            <button
              type="button"
              onClick={onRedraw}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-300/40 bg-[#5c1218]/90 px-4 py-2 text-xs font-bold text-amber-100 shadow-sm transition hover:brightness-110"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Lắc quẻ khác</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= FOUR EMPATHETIC INTERPRETATION SECTIONS ================= */}
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

      {/* ================= STAGE 3: SOFT-LOCKED DEEP INSIGHT & DONATE BRIDGE ================= */}
      {fortune.deepUnlock && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#d4af37]/60 bg-gradient-to-br from-[#fffdf9] via-[#fdf5ea] to-[#faece6] p-5 sm:p-6 shadow-temple">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#3d0e08] text-amber-200">
                {isUnlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#a67d22]">
                  {isUnlocked ? 'ĐÃ MỞ KHÓA CHUYÊN SÂU' : 'PHẦN GIẢI MÃ SÂU HƠN TỪ QUẺ NÀY'}
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#3d1a15]">
                  Nút thắt gốc rễ &amp; Nhịp xoay chuyển 30 ngày tới
                </h3>
              </div>
            </div>
          </div>

          {isUnlocked ? (
            <div className="space-y-3 text-xs sm:text-sm text-[#3d1a15] leading-relaxed">
              <div className="rounded-xl border border-[#ebd9c8] bg-white/80 p-3.5">
                <p>
                  <strong className="text-[#8b2a18]">Nguyên nhân gốc rễ:</strong>{' '}
                  {fortune.deepUnlock.rootCause}
                </p>
              </div>
              <div className="rounded-xl border border-[#ebd9c8] bg-white/80 p-3.5">
                <p>
                  <strong className="text-[#8b2a18]">Dự báo 14–30 ngày tới:</strong>{' '}
                  {fortune.deepUnlock.next30Days}
                </p>
              </div>
              <div className="rounded-xl border border-[#ebd9c8] bg-white/80 p-3.5 space-y-1.5">
                <p className="font-bold text-[#8b2a18]">Gợi ý bước đi cụ thể:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {fortune.deepUnlock.actionSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Blurred Teaser */}
              <div className="relative rounded-xl border border-[#ead9be] bg-white/75 p-4 overflow-hidden">
                <p className="text-xs sm:text-sm text-[#3d1a15] line-clamp-2 blur-[3px] select-none">
                  {fortune.deepUnlock.rootCause} {fortune.deepUnlock.next30Days}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-[#8b2a18]">
                  <Sparkles className="h-3.5 w-3.5 text-[#cba135]" />
                  <span>
                    Nếu bạn cảm thấy quẻ trên đang chạm đúng tâm trạng của mình, có thể gieo duyên mở khóa phần giải mã chi tiết bên dưới.
                  </span>
                </div>
              </div>

              {/* Gentle Donate / Deep-Dive CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  onClick={onOpenUnlock}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#a33a24] via-[#8b2a18] to-[#6e1e12] px-5 py-3 text-xs sm:text-sm font-bold text-amber-50 shadow-temple-red transition hover:brightness-110 active:scale-[0.99]"
                >
                  <Sparkles className="h-4 w-4 text-amber-200" />
                  <span>Bước tiếp · Gieo duyên mở khóa (từ 10.000đ)</span>
                </button>

                <button
                  type="button"
                  onClick={onConsult1on1}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#8b2a18]/40 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-[#8b2a18] transition hover:bg-[#faeee9]"
                >
                  <MessageCircleHeart className="h-4 w-4" />
                  <span>Đào sâu vấn đề qua Tarot 1:1</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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
