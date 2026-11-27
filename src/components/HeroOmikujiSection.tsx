import React, { useState, useCallback } from 'react';
import { RotateCw, Flame, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { type OmikujiFortune, type PlanType, getRandomFortune } from '../data/omikujiData';
import { shrineAudio } from '../utils/sound';
import { SacredHeroCanvas } from './hero3d/SacredHeroCanvas';

interface HeroOmikujiSectionProps {
  selectedPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  onFortuneDrawn: (fortune: OmikujiFortune) => void;
}

type BoxPhase = 'idle' | 'shaking' | 'ejecting' | 'finished';

const INTENT_TABS: { id: PlanType; label: string }[] = [
  { id: 'mini', label: '30 ngày tới' },
  { id: 'love', label: 'Chuyện tình duyên' },
  { id: 'destiny', label: 'Công danh & Tài chính' },
];

export const HeroOmikujiSection: React.FC<HeroOmikujiSectionProps> = ({
  selectedPlan,
  onSelectPlan,
  onFortuneDrawn,
}) => {
  const [phase, setPhase] = useState<BoxPhase>('idle');
  const [ejectedStick, setEjectedStick] = useState<number | null>(null);
  const [lastDrawn, setLastDrawn] = useState<OmikujiFortune | null>(null);
  const [introComplete, setIntroComplete] = useState<boolean>(false);

  const handleDraw = useCallback(() => {
    if (phase === 'shaking' || phase === 'ejecting') return;

    const fortune = getRandomFortune(selectedPlan);
    setEjectedStick(fortune.stickNumber);
    setLastDrawn(fortune);
    setPhase('shaking');

    shrineAudio.playBoxShake();
    const shake2 = setTimeout(() => {
      shrineAudio.playBoxShake();
    }, 500);

    const tiltTimer = setTimeout(() => {
      setPhase('ejecting');
      shrineAudio.playStickSlide();
    }, 1100);

    const finishTimer = setTimeout(() => {
      shrineAudio.playShrineBell();
      if (fortune.rank === 'Đại Cát') {
        confetti({
          particleCount: 95,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#a33a24', '#cba135', '#fde7b0', '#ffffff'],
        });
      } else {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.55 },
          colors: ['#a33a24', '#dfb84b'],
        });
      }
      setPhase('finished');
      onFortuneDrawn(fortune);

      setTimeout(() => {
        const el = document.getElementById('fortune-result-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 450);
    }, 2100);

    return () => {
      clearTimeout(shake2);
      clearTimeout(tiltTimer);
      clearTimeout(finishTimer);
    };
  }, [phase, selectedPlan, onFortuneDrawn]);

  const handleExploreShrine = useCallback(() => {
    const el = document.getElementById('fortune-result-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <section
      id="hero-omikuji-section"
      className="relative h-screen min-h-[640px] max-h-[1080px] w-full overflow-hidden bg-[#0d0307]"
    >
      {/* ================= FULL-SCREEN UNIFIED 3D SHRINE ENVIRONMENT ================= */}
      <SacredHeroCanvas
        drawPhase={phase}
        onAltarClick={handleDraw}
        onIntroComplete={() => setIntroComplete(true)}
      />

      {/* Subtle Edge Vignette for Typography Contrast (Never Obstructs 3D Depth) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0206]/85 via-transparent to-[#0b0206]/45" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full md:w-2/3 bg-gradient-to-r from-[#0b0206]/70 via-[#0b0206]/25 to-transparent" />

      {/* ================= INTEGRATED HERO UI OVERLAY ================= */}
      <div className="pointer-events-none relative z-20 mx-auto flex h-full w-full flex-col justify-end px-4 pb-24 pt-20 sm:px-8 sm:pb-16 sm:pt-24 lg:px-14 xl:px-20">
        <div
          className={`pointer-events-auto max-w-xl space-y-3 sm:space-y-4 transition-all duration-700 ${
            introComplete ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-95'
          }`}
        >
          {/* Compact Intent Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {INTENT_TABS.map((tab) => {
              const isSelected = selectedPlan === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    shrineAudio.playShrineBell();
                    onSelectPlan(tab.id);
                  }}
                  className={`rounded-full px-3 py-1 text-[11px] sm:px-3.5 sm:text-xs font-semibold backdrop-blur-md transition-all duration-200 ${
                    isSelected
                      ? 'border border-brass-400 bg-temple-900/80 text-amber-100 shadow-gold-glow'
                      : 'border border-white/20 bg-black/35 text-white/80 hover:border-brass-300/60 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Main Title & Supporting Copy */}
          <div className="space-y-1.5 sm:space-y-2">
            <h1 className="font-serif text-3xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#fff8e7] via-[#fde7b0] to-[#d4af37] drop-shadow-[0_4px_22px_rgba(0,0,0,0.9)] sm:text-5xl lg:text-6xl">
              Linh Xăm Khai Vận
            </h1>
            <p className="text-xs sm:text-base font-medium tracking-wide text-amber-100/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              Một thông điệp đang chờ bạn khám phá.
            </p>
          </div>

          {/* Lucky Number Reveal Pill (when drawn) */}
          {phase === 'finished' && lastDrawn && (
            <div className="inline-flex items-center gap-3 rounded-full border border-brass-400/80 bg-black/70 px-4 py-2 text-xs sm:text-sm font-bold backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.65)]">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-temple-700 to-temple-900 font-display font-black text-amber-100 border border-brass-400/50">
                {lastDrawn.stickNumber}
              </span>
              <span className="text-amber-50">
                Số {lastDrawn.stickNumber} · {lastDrawn.rank} ({lastDrawn.kanjiRank})
              </span>
              <Flame className="h-4 w-4 text-brass-400 animate-pulse" />
            </div>
          )}

          {/* Ejecting Stick Indicator */}
          {phase === 'ejecting' && ejectedStick !== null && (
            <div className="inline-flex items-center gap-2 rounded-full border border-brass-400/70 bg-black/75 px-4 py-1.5 text-xs font-bold text-amber-200 backdrop-blur-md">
              Thẻ tre số {String(ejectedStick).padStart(2, '0')} đang xuất hiện...
            </div>
          )}

          {/* Primary & Secondary CTAs (Immediately Visible & Interactive) */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleDraw}
              disabled={phase === 'shaking' || phase === 'ejecting'}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-brass-300/80 bg-gradient-to-r from-[#a3221a] via-[#881611] to-[#5e0d09] px-7 py-3.5 text-sm sm:text-base font-black tracking-wide text-amber-50 shadow-[0_0_28px_rgba(212,175,55,0.32),0_10px_24px_rgba(0,0,0,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {phase === 'idle' || phase === 'finished' ? (
                <>
                  <span>Gieo Quẻ Ngay</span>
                  <span className="text-amber-300 transition-transform duration-200 group-hover:translate-x-0.5">
                    ›
                  </span>
                </>
              ) : (
                <>
                  <RotateCw className="h-4 w-4 animate-spin text-brass-200" />
                  <span>
                    {phase === 'shaking' ? 'Đang gieo quẻ...' : 'Thẻ tre đang rơi...'}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleExploreShrine}
              className="inline-flex items-center gap-2 rounded-full border border-brass-300/45 bg-black/45 px-5 py-3.5 text-xs sm:text-sm font-semibold text-amber-100 backdrop-blur-md transition-all duration-200 hover:border-brass-300 hover:bg-black/65"
            >
              <Compass className="h-4 w-4 text-brass-300" />
              <span>Khám phá thần điện</span>
            </button>
          </div>

          <p className="text-[11px] text-amber-100/70 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            Kéo để xoay góc nhìn 3D · Chạm vào hộp xăm trên điện thờ hoặc nhấn Gieo Quẻ Ngay
          </p>
        </div>
      </div>
    </section>
  );
};
