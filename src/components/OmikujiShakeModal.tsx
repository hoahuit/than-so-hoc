import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Sparkles,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Share2,
  Heart,
  Briefcase,
  Coins,
  Flower2,
  Compass,
  Shield,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { type OmikujiFortune, type PlanType, getRandomFortune } from '../data/omikujiData';
import { shrineAudio } from '../utils/sound';

interface OmikujiShakeModalProps {
  isOpen: boolean;
  selectedPlan: PlanType;
  isFortuneSaved: (fortune: OmikujiFortune) => boolean;
  onClose: () => void;
  onFortuneRevealed: (fortune: OmikujiFortune) => void;
  onSaveFortune: (fortune: OmikujiFortune) => void;
  onShareFortune: (fortune: OmikujiFortune) => void;
}

type RitualStage = 'ready' | 'shaking' | 'falling' | 'revealed';

const PLAN_LABELS: Record<PlanType, string> = {
  mini: 'Mini Fortune · Quẻ Tổng Quan',
  love: 'Love Fortune · Quẻ Tình Duyên',
  destiny: 'Destiny Fortune · Thần Số Vận Mệnh',
};

export const OmikujiShakeModal: React.FC<OmikujiShakeModalProps> = ({
  isOpen,
  selectedPlan,
  isFortuneSaved,
  onClose,
  onFortuneRevealed,
  onSaveFortune,
  onShareFortune,
}) => {
  const [stage, setStage] = useState<RitualStage>('ready');
  const [drawnFortune, setDrawnFortune] = useState<OmikujiFortune | null>(null);
  const [shakeProgress, setShakeProgress] = useState<number>(0);

  // Reset modal to clean ready stage whenever opened
  useEffect(() => {
    if (isOpen) {
      setStage('ready');
      setDrawnFortune(null);
      setShakeProgress(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const startShakeRitual = useCallback(() => {
    if (stage === 'shaking' || stage === 'falling') return;

    const fortune = getRandomFortune(selectedPlan);
    setDrawnFortune(fortune);
    setStage('shaking');
    setShakeProgress(15);

    // Multi-beat realistic wooden rattle audio
    shrineAudio.playBoxShake();
    const s2 = setTimeout(() => {
      shrineAudio.playBoxShake();
      setShakeProgress(55);
    }, 550);
    const s3 = setTimeout(() => {
      shrineAudio.playBoxShake();
      setShakeProgress(90);
    }, 1100);

    // Stage 3: Tilt cylinder & drop bamboo stick out!
    const fallTimer = setTimeout(() => {
      setShakeProgress(100);
      setStage('falling');
      shrineAudio.playStickSlide();
    }, 1650);

    // Stage 4: Reveal full fortune ONLY AFTER the stick has dropped out!
    const revealTimer = setTimeout(() => {
      shrineAudio.playShrineBell();
      if (fortune.rank === 'Đại Cát') {
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.55 },
          colors: ['#e85366', '#fda4af', '#fbbf24', '#fff1f2'],
        });
      } else {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.55 },
          colors: ['#fda4af', '#fb7185', '#fde68a'],
        });
      }
      setStage('revealed');
      onFortuneRevealed(fortune);
    }, 3050);

    return () => {
      clearTimeout(s2);
      clearTimeout(s3);
      clearTimeout(fallTimer);
      clearTimeout(revealTimer);
    };
  }, [stage, selectedPlan, onFortuneRevealed]);

  if (!isOpen) return null;

  const isSaved = drawnFortune ? isFortuneSaved(drawnFortune) : false;

  const statItems = drawnFortune
    ? [
      { label: 'Tình duyên', value: drawnFortune.scores.love, icon: Heart, bar: 'from-[#f472b6] to-[#e85366]' },
      { label: 'Sự nghiệp', value: drawnFortune.scores.career, icon: Briefcase, bar: 'from-[#fb7185] to-[#d43c50]' },
      { label: 'Tài lộc', value: drawnFortune.scores.wealth, icon: Coins, bar: 'from-[#f59e0b] to-[#e85366]' },
      { label: 'Sức khỏe', value: drawnFortune.scores.health, icon: Flower2, bar: 'from-[#fda4af] to-[#e14b5a]' },
    ]
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Nghi thức lắc hũ rút quẻ Omikuji"
      className="fixed inset-0 z-50 flex flex-col seigaiha-bg overflow-y-auto"
    >
      {/* Ambient Soft Coral-Rose Radial Glows */}
      <div className="pointer-events-none fixed -top-24 left-1/2 h-96 w-[640px] -translate-x-1/2 rounded-full bg-rose-300/35 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-80 w-80 rounded-full bg-amber-200/35 blur-3xl" />

      {/* ================= FULL-BLEED TOP BAR ================= */}
      <div className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-rose-200/80 bg-[#461622]/95 px-4 py-3.5 text-white backdrop-blur-md sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#f26979] to-[#d43c50] font-jp text-base font-bold text-amber-100 shadow-sm">
            籤
          </span>
          <div>
            <p className="font-display text-sm sm:text-base font-bold text-amber-50 leading-tight">
              Đài Lắc Hũ Omikuji · 御神籤
            </p>
            <p className="text-[11px] text-rose-200/90">{PLAN_LABELS[selectedPlan]}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Đóng đài rút quẻ"
          className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/35 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-rose-50 hover:bg-white/20 hover:border-amber-200 transition-all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ================= FULL-BLEED CENTER STAGE ================= */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 lg:px-14">
        {/* STAGES 1–3: READY / SHAKING / STICK FALLING OUT */}
        {stage !== 'revealed' && (
          <div className="flex w-full max-w-3xl flex-col items-center text-center">
            {/* Step Pills */}
            <div className="mb-6 flex items-center gap-2 text-[11px] font-bold">
              <span
                className={`rounded-full px-3 py-1 transition-all ${stage === 'ready'
                    ? 'bg-crimson-500 text-white shadow-coral-glow'
                    : 'bg-rose-100 text-crimson-600'
                  }`}
              >
                1. Khởi tâm
              </span>
              <span className="text-rose-300">→</span>
              <span
                className={`rounded-full px-3 py-1 transition-all ${stage === 'shaking'
                    ? 'bg-crimson-500 text-white shadow-coral-glow'
                    : 'bg-rose-100 text-crimson-600'
                  }`}
              >
                2. Lắc hũ thẻ
              </span>
              <span className="text-rose-300">→</span>
              <span
                className={`rounded-full px-3 py-1 transition-all ${stage === 'falling'
                    ? 'bg-crimson-500 text-white shadow-coral-glow'
                    : 'bg-rose-100 text-crimson-600'
                  }`}
              >
                3. Rớt thẻ tre
              </span>
            </div>

            {/* Interactive Omikuji Box Ritual Arena */}
            <div
              onClick={stage === 'ready' ? startShakeRitual : undefined}
              className={`relative flex h-[340px] w-full max-w-[380px] sm:h-[400px] sm:max-w-[440px] items-center justify-center select-none ${stage === 'ready' ? 'cursor-pointer group' : ''
                }`}
            >
              {/* Concentric Sacred Shrine Halo Rings */}
              <div
                className={`pointer-events-none absolute h-72 w-72 sm:h-80 sm:w-80 rounded-full border-2 border-dashed border-crimson-300/70 transition-all duration-500 ${stage === 'shaking' ? 'animate-spin scale-110 border-crimson-400' : 'animate-spin-slow'
                  }`}
              />
              <div
                className={`pointer-events-none absolute h-56 w-56 sm:h-64 sm:w-64 rounded-full border border-amber-400/50 ${stage === 'shaking' ? 'animate-ping opacity-30' : 'animate-spin-reverse-slow'
                  }`}
              />

              {/* Warm Radiant Light Burst behind Box */}
              <div
                className={`pointer-events-none absolute h-56 w-56 rounded-full bg-gradient-to-tr from-rose-300/50 via-amber-200/45 to-pink-200/40 blur-2xl transition-transform duration-500 ${stage === 'shaking' ? 'scale-125' : 'scale-100'
                  }`}
              />

              {/* Wooden Sakura Omikuji Box (Transparent PNG) */}
              <div
                className={`relative z-20 h-64 w-64 sm:h-72 sm:w-72 transition-transform duration-300 ${stage === 'shaking'
                    ? 'animate-ritual-shake'
                    : stage === 'falling'
                      ? 'animate-ritual-tilt'
                      : 'animate-float group-hover:scale-105'
                  }`}
              >
                <img
                  src="/images/omikuji-box.png"
                  alt="Hũ gỗ rút quẻ Omikuji"
                  className="h-full w-full object-contain drop-shadow-[0_20px_28px_rgba(181,43,63,0.26)]"
                />
              </div>

              {/* FALLING BAMBOO FORTUNE STICK (ONLY DURING 'falling' STAGE) */}
              {stage === 'falling' && drawnFortune && (
                <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -ml-5 -mt-10 animate-stick-fall">
                  <div className="relative flex h-40 w-10 flex-col items-center justify-between rounded-md border-2 border-amber-400 bg-gradient-to-b from-[#fffaf0] via-[#fde7b7] to-[#f3c978] py-2.5 text-crimson-800 shadow-[0_14px_32px_rgba(212,60,80,0.48)]">
                    <span className="h-2.5 w-full bg-crimson-500" />
                    <span className="vertical font-jp text-sm font-black tracking-[0.25em] text-crimson-800">
                      第{String(drawnFortune.stickNumber).padStart(2, '0')}番
                    </span>
                    <span className="rounded-full bg-crimson-500/15 px-1.5 text-[10px] font-extrabold text-crimson-700">
                      神
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Stage Status & Progress / Action Button */}
            <div className="mt-4 w-full max-w-md space-y-4">
              {stage === 'ready' && (
                <>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                    Tĩnh tâm &amp; Lắc hũ thẻ Omikuji
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    Nghĩ về điều bạn đang mong cầu trong lòng, sau đó bấm nút bên dưới hoặc chạm thẳng vào hũ thẻ để lắc cho đến khi một thẻ tre rớt ra!
                  </p>
                  <button
                    onClick={startShakeRitual}
                    className="mt-2 inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#f26979] via-[#e24558] to-[#d43c50] px-9 py-4 text-base font-extrabold text-white shadow-[0_12px_30px_rgba(232,83,102,0.45)] transition-all hover:-translate-y-0.5 hover:brightness-105 active:scale-95"
                  >
                    <Sparkles className="h-5 w-5 text-amber-200" />
                    <span>Lắc hũ rút quẻ ngay</span>
                  </button>
                </>
              )}

              {stage === 'shaking' && (
                <div className="space-y-3">
                  <h2 className="font-display text-2xl font-bold text-crimson-600 animate-pulse">
                    🌸 Đang lắc hũ thẻ linh ứng...
                  </h2>
                  <div className="mx-auto h-2.5 w-64 overflow-hidden rounded-full bg-rose-200/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#f26979] via-[#e24558] to-amber-400 transition-all duration-500"
                      style={{ width: `${shakeProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-ink-muted">
                    Những thẻ tre đang vang tiếng lách cách trong hũ gỗ...
                  </p>
                </div>
              )}

              {stage === 'falling' && drawnFortune && (
                <div className="space-y-2 animate-card-bloom">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-extrabold text-crimson-700 shadow-sm">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>Thẻ tre số #{String(drawnFortune.stickNumber).padStart(2, '0')} đã rớt ra!</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-ink-muted">
                    Đang khai mở sấm truyền dành riêng cho bạn...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAGE 4: REVEALED FORTUNE SLIP (FULL-BLEED HERO REVEAL AFTER STICK DROPS!) */}
        {stage === 'revealed' && drawnFortune && (
          <div className="w-full max-w-5xl animate-card-bloom">
            <div className="mb-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-white/90 px-4 py-1 text-xs font-bold text-crimson-600 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Đã mở thẻ tre số #{String(drawnFortune.stickNumber).padStart(2, '0')} · {PLAN_LABELS[selectedPlan]}</span>
              </span>
            </div>

            <div className="washi-card relative grid gap-6 overflow-hidden rounded-3xl p-6 sm:p-8 lg:grid-cols-[150px_1fr_290px] shadow-washi-hover">
              <div className="pointer-events-none absolute inset-2 rounded-2xl border border-rose-200/80" />

              {/* Left Vertical Rank Ribbon */}
              <div className="relative z-10 flex flex-row items-center justify-between gap-3 rounded-2xl border border-rose-300 bg-gradient-to-b from-[#fff0f2] via-[#ffe2e6] to-[#ffd3da] px-5 py-4 text-crimson-700 shadow-sm lg:flex-col lg:justify-center lg:py-8">
                <span className="rounded-full bg-crimson-500/15 border border-crimson-400/40 px-2.5 py-0.5 font-jp text-xs font-bold text-crimson-700">
                  第{String(drawnFortune.stickNumber).padStart(2, '0')}番
                </span>

                <b className="font-jp text-5xl lg:text-6xl font-black leading-none text-crimson-700 lg:vertical lg:my-4">
                  {drawnFortune.kanjiRank}
                </b>

                <div className="text-right lg:text-center">
                  <span className="block text-base font-extrabold uppercase tracking-wider text-ink">
                    {drawnFortune.rank}
                  </span>
                  <span className="block text-xs text-crimson-500 mt-0.5">❀ {drawnFortune.theme}</span>
                </div>
              </div>

              {/* Center Poem & Interpretation */}
              <div className="relative z-10 flex flex-col justify-between space-y-4">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                    {drawnFortune.title}
                  </h2>

                  <div className="mt-4 rounded-2xl border-l-4 border-crimson-400 bg-white/85 p-4 font-jp text-sm sm:text-base italic leading-relaxed text-ink shadow-sm space-y-1">
                    {drawnFortune.poem.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                    {drawnFortune.meaning}
                  </p>
                  <p className="mt-2.5 rounded-xl bg-rose-50/90 border border-rose-200/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-crimson-700">
                    <strong className="text-crimson-600">Lời khuyên đền thần:</strong> {drawnFortune.advice}
                  </p>
                </div>

                {/* Numerology Lucky Trio */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-white/90 px-3 py-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-crimson-500 font-display font-bold text-white">
                      {drawnFortune.numerology.luckyNumber}
                    </span>
                    <div className="min-w-0">
                      <span className="block text-[10px] text-ink-light">Số &amp; Màu tốt</span>
                      <span className="font-bold text-ink truncate block">{drawnFortune.numerology.color}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-white/90 px-3 py-2">
                    <Compass className="h-4 w-4 shrink-0 text-crimson-500" />
                    <div className="min-w-0">
                      <span className="block text-[10px] text-ink-light">Phương hướng</span>
                      <span className="font-bold text-ink truncate block">{drawnFortune.numerology.direction}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-white/90 px-3 py-2">
                    <Shield className="h-4 w-4 shrink-0 text-crimson-500" />
                    <div className="min-w-0">
                      <span className="block text-[10px] text-ink-light">Vật hộ mệnh</span>
                      <span className="font-bold text-crimson-700 truncate block">{drawnFortune.numerology.amulet}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Progress Bars & Action Buttons */}
              <div className="relative z-10 flex flex-col justify-between gap-5 border-t border-rose-200 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <div className="space-y-3.5">
                  {statItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="flex items-center gap-1.5 font-semibold text-ink">
                            <Icon className="h-4 w-4 text-crimson-500" />
                            {item.label}
                          </span>
                          <span className="font-bold text-crimson-600">{item.value}%</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-rose-100">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${item.bar} transition-[width] duration-700 ease-out`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => onSaveFortune(drawnFortune)}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${isSaved
                        ? 'border border-crimson-400 bg-crimson-50 text-crimson-700'
                        : 'bg-[#461622] text-amber-50 shadow-sm hover:bg-[#5f1d2d]'
                      }`}
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 text-crimson-600" />
                        <span>Đã lưu vào bộ sưu tập</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 text-amber-200" />
                        <span>Lưu vào bộ sưu tập</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onShareFortune(drawnFortune)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-rose-300 bg-white px-3 py-2.5 text-xs font-bold text-ink hover:border-crimson-400 hover:bg-crimson-50 transition-all"
                    >
                      <Share2 className="h-3.5 w-3.5 text-crimson-500" />
                      <span>Chia sẻ</span>
                    </button>

                    <button
                      onClick={startShakeRitual}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#f26979] to-[#d43c50] px-3 py-2.5 text-xs font-bold text-white shadow-coral-glow hover:brightness-105 transition-all"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Lắc lại</span>
                    </button>
                  </div>

                  <button
                    onClick={onClose}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/70 py-2 text-xs font-semibold text-crimson-700 hover:bg-rose-100 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Hoàn tất &amp; xem trên trang chính</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
