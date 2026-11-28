import React from 'react';
import { Sparkles, Briefcase, Heart, Compass, MessageCircleHeart, RotateCw, Lock } from 'lucide-react';
import type { DrawnTarotCard } from '../data/tarotData';
import { RiderWaiteCardFace } from './TarotCardArt';

interface TarotReadingResultProps {
  drawnCards: DrawnTarotCard[];
  isUnlocked: boolean;
  onUnlockClick: () => void;
  onConsult1on1: (drawnCards: DrawnTarotCard[]) => void;
}

export const TarotReadingResult: React.FC<TarotReadingResultProps> = ({
  drawnCards,
  isUnlocked,
  onUnlockClick,
  onConsult1on1,
}) => {
  if (drawnCards.length === 0) return null;

  return (
    <div className="mt-6 space-y-5 border-t border-[#d8b48a]/70 pt-7 animate-card-bloom">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8F1E32]">
            Lời Sấm Từ Nữ Thần &amp; Lá Bài Tarot
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4A101D]">
            {drawnCards.length === 1
              ? `${drawnCards[0].card.numeral} · ${drawnCards[0].card.nameEn} (${drawnCards[0].card.nameVi})`
              : 'Trải Bài 3 Lá Nghi Thức Thiêng'}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onConsult1on1(drawnCards)}
          className="inline-flex items-center gap-2 rounded-full border border-[#E6BD72] bg-gradient-to-r from-[#781218] via-[#5c0d13] to-[#4A101D] px-4 py-2 text-xs font-extrabold text-[#FFF4E5] shadow-[0_8px_24px_rgba(74,16,29,0.28)] transition hover:brightness-110 active:scale-95"
        >
          <MessageCircleHeart className="h-3.5 w-3.5 text-[#E6BD72]" />
          <span>Hỏi sâu 1:1 về lá bài này</span>
        </button>
      </div>

      {/* Dark Burgundy & Champagne Gold Result Cards */}
      <div className={`grid gap-4 ${drawnCards.length === 3 ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
        {drawnCards.map((entry, idx) => {
          const { card, isReversed, positionLabel } = entry;
          const reading = isReversed ? card.reversed : card.upright;
          const keywords = isReversed ? card.keywordsReversed : card.keywordsUpright;

          return (
            <div
              key={`${card.id}-${idx}`}
              className="relative overflow-hidden rounded-2xl border border-[#E6BD72]/45 bg-gradient-to-b from-[#3b0b17]/95 via-[#2a0711]/95 to-[#1c040b]/95 p-4 sm:p-6 text-[#FFF4E5] shadow-[0_18px_46px_rgba(0,0,0,0.45)] backdrop-blur-md"
            >
              <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-[#E6BD72]/20" />

              {positionLabel && (
                <div className="relative z-10 mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#E6BD72]/50 bg-[#4A101D] px-2.5 py-0.5 text-[10px] font-bold text-[#E6BD72]">
                  <Sparkles className="h-3 w-3" />
                  <span>{positionLabel}</span>
                </div>
              )}

              <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-5 items-start">
                {/* Authentic Rider-Waite Card Showcase */}
                <div className="flex shrink-0 items-center gap-3 self-center sm:self-start">
                  <div className="relative h-48 w-28 sm:h-52 sm:w-32 overflow-hidden rounded-xl border-2 border-[#E6BD72] bg-[#fdfaf2] p-1 shadow-[0_12px_28px_rgba(0,0,0,0.55)]">
                    <RiderWaiteCardFace
                      cardId={card.id}
                      cardName={card.nameEn}
                      accentHex={card.accentHex}
                      isReversed={isReversed}
                    />
                  </div>
                </div>

                {/* Reading Details */}
                <div className="flex-1 space-y-2.5 text-xs sm:text-sm text-[#FFF4E5]/90">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif font-bold text-base sm:text-lg text-[#E6BD72]">
                      {card.numeral} · {card.nameVi}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isReversed
                          ? 'bg-[#8F1E32]/70 text-[#F4B7C5] border border-[#F4B7C5]/40'
                          : 'bg-emerald-950/70 text-emerald-200 border border-emerald-400/40'
                      }`}
                    >
                      {isReversed && <RotateCw className="h-2.5 w-2.5" />}
                      {isReversed ? 'Lá Ngược (Reversed)' : 'Lá Xuôi (Upright)'}
                    </span>
                  </div>

                  <p className="text-xs italic text-[#F4B7C5]/90">{card.archetype}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full border border-[#E6BD72]/35 bg-[#4A101D]/80 px-2.5 py-0.5 text-[10px] font-semibold text-[#FFF4E5]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2 pt-1 text-xs sm:text-[13px] leading-relaxed">
                    <p>
                      <strong className="text-[#E6BD72]">Tâm trạng &amp; Năng lượng:</strong> {reading.mood}
                    </p>
                    <p className="flex items-start gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#E6BD72]" />
                      <span>
                        <strong className="text-[#E6BD72]">Công việc:</strong> {reading.career}
                      </span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <Heart className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#F4B7C5]" />
                      <span>
                        <strong className="text-[#F4B7C5]">Tình cảm:</strong> {reading.love}
                      </span>
                    </p>
                    <div className="rounded-xl border border-[#E6BD72]/35 bg-[#4A101D]/65 p-3 flex items-start gap-2">
                      <Compass className="h-4 w-4 mt-0.5 shrink-0 text-[#E6BD72]" />
                      <span>
                        <strong className="text-[#E6BD72]">Lời khuyên:</strong> {reading.advice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Teaser to unlock 3-card spread if currently viewing 1-card free spread */}
      {drawnCards.length === 1 && !isUnlocked && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[#E6BD72]/55 bg-[#2a0711]/95 p-4 text-[#FFF4E5] shadow-lg backdrop-blur-sm">
          <div className="flex items-start gap-2.5 text-xs">
            <Lock className="h-4 w-4 mt-0.5 shrink-0 text-[#E6BD72]" />
            <div>
              <p className="font-bold text-[#E6BD72]">
                Muốn Nữ Thần triệu hồi trải bài 3 lá soi rõ 30 ngày tới?
              </p>
              <p className="text-[#FFF4E5]/80 mt-0.5">
                Mở khóa gói Gieo Duyên (từ 10.000đ) để trải bộ <strong className="text-[#E6BD72]">3 lá Tarot chuyên sâu</strong> hoặc hỏi trực tiếp trợ lý Tarot 1:1.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onUnlockClick}
            className="shrink-0 rounded-full bg-gradient-to-r from-[#fae4a6] via-[#E6BD72] to-[#cfa03b] px-4 py-2 text-xs font-extrabold text-[#4A101D] shadow-sm transition hover:brightness-105"
          >
            Mở trải bài 3 lá
          </button>
        </div>
      )}
    </div>
  );
};
