import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, RotateCw, Wand2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { type OmikujiFortune, type PlanType, getRandomFortune } from '../data/omikujiData';
import { shrineAudio } from '../utils/sound';

interface OmikujiBoxInteractiveProps {
  selectedPlan: PlanType;
  drawTrigger: number;
  onFortuneDrawn: (fortune: OmikujiFortune) => void;
  onScrollToTarot: () => void;
}

type BoxPhase = 'idle' | 'shaking' | 'ejecting';

const PLAN_LABELS: Record<PlanType, string> = {
  mini: 'Mini Fortune',
  love: 'Love Fortune',
  destiny: 'Destiny Fortune',
};

export const OmikujiBoxInteractive: React.FC<OmikujiBoxInteractiveProps> = ({
  selectedPlan,
  drawTrigger,
  onFortuneDrawn,
  onScrollToTarot,
}) => {
  const [phase, setPhase] = useState<BoxPhase>('idle');
  const [ejectedStickNumber, setEjectedStickNumber] = useState<number | null>(null);
  const lastTriggerRef = useRef<number>(drawTrigger);

  const handleDraw = useCallback(() => {
    if (phase !== 'idle') return;

    const fortune = getRandomFortune(selectedPlan);
    setEjectedStickNumber(fortune.stickNumber);
    setPhase('shaking');

    shrineAudio.playBoxShake();
    const shake2 = setTimeout(() => {
      shrineAudio.playBoxShake();
    }, 480);

    const ejectTimer = setTimeout(() => {
      setPhase('ejecting');
      shrineAudio.playStickSlide();
    }, 1050);

    const finishTimer = setTimeout(() => {
      if (fortune.rank === 'Đại Cát') {
        shrineAudio.playShrineBell();
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.55 },
          colors: ['#e85366', '#fda4af', '#fbbf24', '#fff1f2'],
        });
      } else {
        shrineAudio.playShrineBell();
      }
      onFortuneDrawn(fortune);
      setPhase('idle');
    }, 1950);

    return () => {
      clearTimeout(shake2);
      clearTimeout(ejectTimer);
      clearTimeout(finishTimer);
    };
  }, [phase, selectedPlan, onFortuneDrawn]);

  useEffect(() => {
    if (drawTrigger > lastTriggerRef.current) {
      lastTriggerRef.current = drawTrigger;
      handleDraw();
    }
  }, [drawTrigger, handleDraw]);

  return (
    <section
      id="omikuji-box-section"
      className="washi-card relative grid h-full w-full scroll-mt-24 items-center gap-4 overflow-hidden rounded-2xl p-5 sm:grid-cols-[1.05fr_1fr] sm:gap-6 sm:p-7"
    >
      {/* Delicate Japanese Inner Border */}
      <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-rose-200/70" />

      {/* Warm Soft Sakura Aura */}
      <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-rose-200/45 blur-3xl" />

      {/* Left: Illustrated Sakura Omikuji Box (clickable!) */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div
          onClick={handleDraw}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleDraw();
          }}
          aria-label="Lắc hộp rút quẻ Omikuji"
          className="relative mx-auto flex h-56 w-56 sm:h-60 sm:w-60 cursor-pointer items-center justify-center select-none group"
        >
          {/* Subtle Glowing Ring behind Box */}
          <div
            className={`pointer-events-none absolute inset-3 rounded-full border border-dashed border-crimson-300/60 transition-transform duration-700 ${
              phase === 'shaking' ? 'animate-spin' : 'animate-spin-slow'
            }`}
          />

          {/* Ejecting Bamboo Stick Overlay */}
          {phase === 'ejecting' && ejectedStickNumber !== null && (
            <div className="absolute left-1/2 top-12 z-30 -ml-3.5 animate-stick-eject">
              <div className="flex h-32 w-7 flex-col items-center justify-between rounded-t-sm border-2 border-amber-300 bg-gradient-to-b from-[#fff7e6] via-amber-200 to-amber-400 py-1.5 text-crimson-800 shadow-[0_8px_22px_rgba(212,60,80,0.45)]">
                <span className="h-2 w-full bg-crimson-500" />
                <span className="vertical font-jp text-xs font-black tracking-widest">
                  第{ejectedStickNumber}番
                </span>
                <span className="text-[9px] font-bold text-crimson-600">神</span>
              </div>
            </div>
          )}

          {/* Custom Illustrated Sakura Omikuji Box Image */}
          <div
            className={`relative z-10 h-full w-full overflow-hidden rounded-2xl transition-transform duration-300 ${
              phase === 'shaking'
                ? 'animate-shake'
                : 'group-hover:scale-105 group-hover:-rotate-1'
            }`}
          >
            <img
              src="/images/omikuji-box.jpg"
              alt="Hộp gỗ rút quẻ Omikuji hoa anh đào"
              className="h-full w-full object-contain mix-blend-multiply drop-shadow-[0_10px_18px_rgba(181,43,63,0.16)]"
            />
          </div>
        </div>

        {/* Status Text */}
        <span className="mt-1 text-[11px] font-medium text-crimson-500">
          {phase === 'shaking' && '🌸 Đang lắc hộp gọi duyên lành...'}
          {phase === 'ejecting' && `✨ Rút được thẻ tre số #${ejectedStickNumber}!`}
          {phase === 'idle' && 'Chạm vào hộp để lắc rút quẻ'}
        </span>
      </div>

      {/* Right: Copy & Pill CTAs matching mockup */}
      <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson-50 border border-rose-200 px-3 py-0.5 text-[11px] font-bold text-crimson-600">
          <Sparkles className="h-3 w-3 text-crimson-500" />
          <span>Gói: {PLAN_LABELS[selectedPlan]}</span>
        </span>

        <h2 className="mt-2.5 font-display text-2xl sm:text-[28px] font-bold leading-tight text-ink">
          Rút quẻ Omikuji
        </h2>

        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-muted">
          Lắc hộp, rút một lá quẻ và nhận thông điệp may mắn dành riêng cho bạn.
        </p>

        {/* Primary Pill CTA Button */}
        <button
          onClick={handleDraw}
          disabled={phase !== 'idle'}
          className="mt-5 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ee5b6d] via-[#e24558] to-[#d43c50] px-7 py-3 text-sm font-bold text-white shadow-coral-glow transition-all hover:-translate-y-0.5 hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {phase === 'idle' ? (
            <>
              <span>Rút quẻ ngay</span>
              <Sparkles className="h-4 w-4 text-amber-200" />
            </>
          ) : (
            <>
              <RotateCw className="h-4 w-4 animate-spin text-amber-200" />
              <span>{phase === 'shaking' ? 'Đang lắc hộp...' : 'Đang rút thẻ...'}</span>
            </>
          )}
        </button>

        {/* Quick Link to Tarot Card Fan */}
        <button
          type="button"
          onClick={onScrollToTarot}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-crimson-600 hover:text-crimson-700 hover:underline transition-colors"
        >
          <Wand2 className="h-3.5 w-3.5" />
          <span>Hoặc tự tay chọn bài Tarot Omikuji bên dưới →</span>
        </button>
      </div>
    </section>
  );
};
