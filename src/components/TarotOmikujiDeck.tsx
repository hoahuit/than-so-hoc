import React, { useState } from 'react';
import { Sparkles, Shuffle, Wand2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { type OmikujiFortune, type PlanType, getRandomFortune } from '../data/omikujiData';
import { shrineAudio } from '../utils/sound';

interface TarotOmikujiDeckProps {
  selectedPlan: PlanType;
  onCardPicked: (fortune: OmikujiFortune) => void;
}

const DECK_CARDS = [
  { id: 0, kanji: '桜', label: 'Anh Đào', numeral: 'I', angle: -18, yOffset: 24 },
  { id: 1, kanji: '狐', label: 'Hồ Ly', numeral: 'II', angle: -12, yOffset: 10 },
  { id: 2, kanji: '月', label: 'Trăng Tròn', numeral: 'III', angle: -6, yOffset: 2 },
  { id: 3, kanji: '神', label: 'Thần Số', numeral: 'IV', angle: 0, yOffset: 0 },
  { id: 4, kanji: '恋', label: 'Tơ Hồng', numeral: 'V', angle: 6, yOffset: 2 },
  { id: 5, kanji: '鶴', label: 'Bạch Hạc', numeral: 'VI', angle: 12, yOffset: 10 },
  { id: 6, kanji: '福', label: 'Phúc Lộc', numeral: 'VII', angle: 18, yOffset: 24 },
];

export const TarotOmikujiDeck: React.FC<TarotOmikujiDeckProps> = ({
  selectedPlan,
  onCardPicked,
}) => {
  const [isShuffling, setIsShuffling] = useState(false);
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);
  const [revealedFortune, setRevealedFortune] = useState<OmikujiFortune | null>(null);

  const handleShuffle = () => {
    if (isShuffling) return;
    shrineAudio.playBoxShake();
    setPickedIndex(null);
    setRevealedFortune(null);
    setIsShuffling(true);

    setTimeout(() => {
      shrineAudio.playCardFlip();
      setIsShuffling(false);
    }, 650);
  };

  const handlePickCard = (idx: number) => {
    if (isShuffling) return;

    const fortune = getRandomFortune(selectedPlan);
    setPickedIndex(idx);
    setRevealedFortune(fortune);
    shrineAudio.playCardFlip();

    setTimeout(() => {
      if (fortune.rank === 'Đại Cát') {
        shrineAudio.playShrineBell();
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#e85366', '#fda4af', '#fbbf24', '#fff1f2'],
        });
      } else {
        shrineAudio.playShrineBell();
      }
      onCardPicked(fortune);
    }, 450);
  };

  return (
    <section
      id="tarot-omikuji-section"
      className="washi-card relative scroll-mt-24 overflow-hidden rounded-2xl p-5 sm:p-7"
    >
      {/* Decorative Inner Frame */}
      <div className="pointer-events-none absolute inset-2 rounded-xl border border-rose-200/70" />

      {/* Soft Pastel Radial Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-rose-200/40 blur-3xl" />

      {/* Section Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-crimson-50 border border-rose-200 px-3 py-0.5 text-[11px] font-bold text-crimson-600 mb-1.5">
            <Wand2 className="h-3 w-3" />
            <span>TAROT × OMIKUJI TƯƠNG TÁC</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
            Trải Bài Tarot – Rút Thăm Vận Mệnh
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Hít thở nhẹ nhàng, chọn 1 lá bài thu hút ánh nhìn của bạn nhất để mở thông điệp!
          </p>
        </div>

        <button
          onClick={handleShuffle}
          disabled={isShuffling}
          className="inline-flex items-center justify-center gap-2 self-start sm:self-center rounded-full border border-rose-300 bg-white px-4 py-2 text-xs font-bold text-crimson-600 shadow-sm hover:bg-crimson-50 hover:border-crimson-400 active:scale-95 transition-all disabled:opacity-60"
        >
          <Shuffle className={`h-3.5 w-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
          <span>{isShuffling ? 'Đang xào bài...' : 'Xào lại bộ bài'}</span>
        </button>
      </div>

      {/* Interactive Fanned Tarot-Omikuji Deck */}
      <div className="relative z-10 flex items-center justify-center py-7 sm:py-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-end justify-center -space-x-5 sm:-space-x-2 lg:space-x-2 xl:space-x-5 px-6 min-w-max">
          {DECK_CARDS.map((card, idx) => {
            const isPicked = pickedIndex === idx;
            const isOtherDimmed = pickedIndex !== null && !isPicked;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handlePickCard(idx)}
                style={{
                  transform: isShuffling
                    ? `translateX(${(3 - idx) * 28}px) rotate(0deg) scale(0.92)`
                    : isPicked
                      ? `translateY(-26px) rotate(0deg) scale(1.1)`
                      : `translateY(${card.yOffset}px) rotate(${card.angle}deg)`,
                  zIndex: isPicked ? 30 : 10 + idx,
                }}
                className={`group perspective-1000 relative h-40 w-24 sm:h-52 sm:w-32 lg:h-56 lg:w-36 transition-all duration-500 ease-out focus:outline-none ${
                  !isShuffling && !isPicked
                    ? 'hover:-translate-y-6 hover:scale-105 hover:z-40'
                    : ''
                } ${isOtherDimmed ? 'opacity-55 hover:opacity-95' : ''}`}
              >
                <div
                  className={`relative h-full w-full transition-transform duration-700 transform-style-3d ${
                    isPicked ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* CARD BACK: Soft Coral-Red & Gold Japanese Tarot Pattern */}
                  <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-between rounded-xl border-2 border-amber-200/90 bg-gradient-to-b from-[#ef6475] via-[#dd4357] to-[#b92c40] p-2 text-amber-100 shadow-[0_10px_22px_rgba(181,43,63,0.28)] group-hover:shadow-[0_16px_30px_rgba(232,83,102,0.48)]">
                    {/* Inner delicate gold line */}
                    <div className="pointer-events-none absolute inset-1.5 rounded-lg border border-amber-200/50" />

                    <span className="relative z-10 text-[9px] font-bold tracking-widest text-amber-200/90">
                      {card.numeral}
                    </span>

                    {/* Center Emblem Circle */}
                    <div className="relative z-10 grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full border border-amber-200/80 bg-white/15 backdrop-blur-[2px] shadow-inner transition-transform duration-300 group-hover:scale-110">
                      <span className="font-jp text-2xl sm:text-3xl font-bold text-amber-50 drop-shadow">
                        {card.kanji}
                      </span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-[10px] font-semibold text-rose-50/95">
                        {card.label}
                      </span>
                      <Sparkles className="mt-0.5 h-2.5 w-2.5 text-amber-200 opacity-80 group-hover:animate-pulse" />
                    </div>
                  </div>

                  {/* CARD FRONT: Revealed Omikuji Rank Slip */}
                  <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-between rounded-xl border-2 border-crimson-400 bg-gradient-to-b from-[#fffdfa] via-[#fff3f0] to-[#ffe6e9] p-2.5 text-ink shadow-[0_14px_30px_rgba(212,60,80,0.35)]">
                    <div className="pointer-events-none absolute inset-1.5 rounded-lg border border-rose-300/70" />

                    <span className="relative z-10 rounded-full bg-crimson-500 px-2 py-0.5 text-[9px] font-bold text-white">
                      #{revealedFortune?.stickNumber ?? 7}
                    </span>

                    <div className="relative z-10 text-center">
                      <span className="block font-jp text-3xl sm:text-4xl font-black text-crimson-600 leading-none">
                        {revealedFortune?.kanjiRank ?? '大吉'}
                      </span>
                      <span className="mt-1 block text-[11px] font-extrabold uppercase tracking-wider text-ink">
                        {revealedFortune?.rank ?? 'Đại Cát'}
                      </span>
                    </div>

                    <span className="relative z-10 text-[9px] font-medium text-crimson-500">
                      ✦ Đã mở quẻ ✦
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Interactive Hint */}
      <div className="relative z-10 mt-2 text-center text-xs text-ink-muted">
        {pickedIndex === null ? (
          <span>✨ Chạm vào một lá bài bất kỳ để lật mở quẻ Omikuji – Tarot dành riêng cho bạn</span>
        ) : (
          <span className="font-semibold text-crimson-600">
            🌸 Bạn đã chọn lá <strong className="underline">{DECK_CARDS[pickedIndex].label}</strong> — Xem chi tiết lời giải ở bên dưới hoặc chọn lá khác!
          </span>
        )}
      </div>
    </section>
  );
};
