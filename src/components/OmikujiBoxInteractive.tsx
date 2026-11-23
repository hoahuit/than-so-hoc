import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { type PlanType } from '../data/omikujiData';

interface OmikujiBoxInteractiveProps {
  selectedPlan: PlanType;
  onOpenShakeModal: () => void;
  onScrollToTarot: () => void;
}

const PLAN_LABELS: Record<PlanType, string> = {
  mini: 'Mini Fortune',
  love: 'Love Fortune',
  destiny: 'Destiny Fortune',
};

export const OmikujiBoxInteractive: React.FC<OmikujiBoxInteractiveProps> = ({
  selectedPlan,
  onOpenShakeModal,
  onScrollToTarot,
}) => {
  return (
    <section
      id="omikuji-box-section"
      className="washi-card magic-border relative grid h-full w-full scroll-mt-24 items-center gap-4 overflow-hidden rounded-2xl p-5 sm:grid-cols-[1.05fr_1fr] sm:gap-6 sm:p-7"
    >
      {/* Delicate Japanese Inner Border */}
      <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-rose-200/70" />

      {/* Warm Soft Sakura Aura - enhanced */}
      <div className="pointer-events-none absolute -left-8 -top-8 h-48 w-48 rounded-full bg-rose-200/50 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-amber-200/25 blur-2xl" />

      {/* Left: Illustrated Sakura Omikuji Box (clickable to open Full-Screen Modal!) */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div
          onClick={onOpenShakeModal}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onOpenShakeModal();
          }}
          aria-label="Mở đài lắc hũ rút quẻ Omikuji tràn viền"
          className="relative mx-auto flex h-56 w-56 sm:h-60 sm:w-60 cursor-pointer items-center justify-center select-none group"
        >
          {/* Subtle Glowing Ring behind Box */}
          <div className="pointer-events-none absolute inset-3 rounded-full border border-dashed border-crimson-300/60 animate-spin-slow group-hover:border-crimson-400" />

          {/* Custom Illustrated Sakura Omikuji Box Transparent PNG */}
          <div className="relative z-10 h-full w-full transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2">
            <img
              src="/images/omikuji-box.png"
              alt="Hũ gỗ rút quẻ Omikuji hoa anh đào"
              className="h-full w-full object-contain drop-shadow-[0_12px_20px_rgba(181,43,63,0.22)]"
            />
          </div>
        </div>

        {/* Status Hint */}
        <span className="mt-1 text-[11px] font-semibold text-crimson-500">
          ✨ Chạm vào hũ thẻ để mở đài lắc quẻ
        </span>
      </div>

      {/* Right: Copy & Pill CTAs */}
      <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson-50 border border-rose-200 px-3 py-0.5 text-[11px] font-bold text-crimson-600">
          <Sparkles className="h-3 w-3 text-crimson-500" />
          <span>Gói: {PLAN_LABELS[selectedPlan]}</span>
        </span>

        <h2 className="mt-2.5 font-display text-2xl sm:text-[28px] font-bold leading-tight text-ink">
          Rút quẻ Omikuji
        </h2>

        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-muted">
          Mở đài lắc hũ toàn màn hình, lắc hũ gỗ linh thiêng cho đến khi thẻ tre rớt ra để đón nhận thông điệp vận mệnh dành riêng cho bạn.
        </p>

        {/* Primary Pill CTA Button */}
        <button
          onClick={onOpenShakeModal}
          className="mt-5 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ee5b6d] via-[#e24558] to-[#d43c50] px-7 py-3 text-sm font-bold text-white shadow-coral-glow transition-all hover:-translate-y-0.5 hover:brightness-105 active:scale-95"
        >
          <span>Mở hũ lắc quẻ ngay</span>
          <Sparkles className="h-4 w-4 text-amber-200" />
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
