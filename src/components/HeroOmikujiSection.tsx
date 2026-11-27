import React, { useState, useCallback } from 'react';
import { RotateCw, Flame, Compass, FastForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import { type OmikujiFortune, type PlanType, getRandomFortune } from '../data/omikujiData';
import { shrineAudio } from '../utils/sound';
import { SacredHeroCanvas, type CeremonyPhase } from './hero3d/SacredHeroCanvas';

interface HeroOmikujiSectionProps {
  selectedPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  onFortuneDrawn: (fortune: OmikujiFortune) => void;
  onIntroComplete?: () => void;
}

type BoxPhase = 'idle' | 'shaking' | 'ejecting' | 'finished';

const INTENT_TABS: { id: PlanType; label: string }[] = [
  { id: 'mini', label: '30 ngày tới' },
  { id: 'love', label: 'Chuyện tình duyên' },
  { id: 'destiny', label: 'Công danh & Tài chính' },
];

const DIALOGUE_MAP: Partial<Record<CeremonyPhase, string>> = {
  speak1: '“Vận may của bạn...”',
  speak2: '“Vận may của bạn... đang chờ được khai mở.”',
  speak3: '“Hãy để ta dẫn lối đến thông điệp dành riêng cho bạn.”',
  fly: '“Hãy lắng nghe tiếng vọng từ quẻ xăm linh ứng...”',
  present: '“Vận mệnh của bạn đang dần được khai mở...”',
};

export const HeroOmikujiSection: React.FC<HeroOmikujiSectionProps> = ({
  selectedPlan,
  onSelectPlan,
  onFortuneDrawn,
  onIntroComplete,
}) => {
  const [phase, setPhase] = useState<BoxPhase>('idle');
  const [ejectedStick, setEjectedStick] = useState<number | null>(null);
  const [lastDrawn, setLastDrawn] = useState<OmikujiFortune | null>(null);
  const [ceremonyPhase, setCeremonyPhase] = useState<CeremonyPhase>('arrival');
  const [skipRequested, setSkipRequested] = useState<boolean>(false);

  const isIntroComplete = ceremonyPhase === 'complete';

  const handlePhaseChange = useCallback(
    (next: CeremonyPhase) => {
      setCeremonyPhase(next);
      if (next === 'complete') {
        onIntroComplete?.();
      }
    },
    [onIntroComplete]
  );

  const handleSkipIntro = useCallback(() => {
    setSkipRequested(true);
    setCeremonyPhase('complete');
    onIntroComplete?.();
  }, [onIntroComplete]);

  const handleDraw = useCallback(() => {
    if (phase === 'shaking' || phase === 'ejecting') return;
    if (!isIntroComplete) {
      handleSkipIntro();
    }

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
  }, [phase, isIntroComplete, handleSkipIntro, selectedPlan, onFortuneDrawn]);

  const handleExploreShrine = useCallback(() => {
    const el = document.getElementById('fortune-result-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const dialogueText = DIALOGUE_MAP[ceremonyPhase];

  return (
    <section
      id="hero-omikuji-section"
      className={`relative flex flex-col bg-[#0d0307] ${
        isIntroComplete
          ? 'pt-16 pb-24 md:block md:h-screen md:min-h-[680px] md:max-h-[1080px] md:w-full md:overflow-hidden md:pt-0 md:pb-0'
          : 'h-screen w-full overflow-hidden'
      }`}
    >
      {/* ================= 3D STAGE: FULL-SCREEN DURING INTRO, MOBILE-SAFE AFTER ================= */}
      <div
        className={`relative w-full shrink-0 overflow-hidden transition-all duration-700 ${
          isIntroComplete
            ? 'h-[46vh] min-h-[290px] max-h-[410px] md:absolute md:inset-0 md:h-full md:max-h-none'
            : 'h-full'
        }`}
      >
        <SacredHeroCanvas
          drawPhase={phase}
          skipRequested={skipRequested}
          onAltarClick={handleDraw}
          onPhaseChange={handlePhaseChange}
        />

        {/* Subtle Desktop Edge Vignette */}
        {isIntroComplete && (
          <>
            <div className="pointer-events-none hidden md:block md:absolute md:inset-0 bg-gradient-to-t from-[#0b0206]/85 via-transparent to-[#0b0206]/45" />
            <div className="pointer-events-none hidden md:block md:absolute md:inset-y-0 md:left-0 md:w-2/3 bg-gradient-to-r from-[#0b0206]/75 via-[#0b0206]/25 to-transparent" />
          </>
        )}

        {/* Phase 2-4 Angel Vietnamese Subtitle Overlay */}
        {!isIntroComplete && dialogueText && (
          <div className="pointer-events-none absolute inset-x-4 bottom-12 sm:bottom-16 z-30 flex justify-center">
            <div className="max-w-lg rounded-2xl border border-brass-300/50 bg-black/75 px-5 py-3 text-center font-serif text-sm sm:text-lg italic text-amber-100 shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-md">
              {dialogueText}
            </div>
          </div>
        )}

        {/* Skip Intro Button (Always accessible during cinematic intro) */}
        {!isIntroComplete && (
          <button
            type="button"
            onClick={handleSkipIntro}
            className="absolute right-4 top-4 sm:right-8 sm:top-6 z-40 inline-flex items-center gap-1.5 rounded-full border border-brass-300/55 bg-black/65 px-4 py-1.5 text-xs font-semibold text-amber-100 backdrop-blur-md transition hover:border-brass-300 hover:bg-black/85"
          >
            <FastForward className="h-3.5 w-3.5 text-brass-300" />
            <span>Bỏ qua</span>
          </button>
        )}
      </div>

      {/* ================= HERO UI OVERLAY (ONLY REVEALED AFTER PHASE 5) ================= */}
      {isIntroComplete && (
        <div className="relative z-20 flex flex-1 flex-col items-center justify-start px-4 pt-3 text-center md:pointer-events-none md:mx-auto md:flex md:h-full md:w-full md:items-start md:justify-end md:px-10 md:pb-14 md:pt-24 md:text-left lg:px-14 xl:px-20 animate-card-bloom">
          <div className="w-full max-w-lg space-y-3 sm:space-y-4 md:pointer-events-auto">
            {/* Intent Categories */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
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
                        ? 'border border-brass-400 bg-temple-900/85 text-amber-100 shadow-gold-glow'
                        : 'border border-white/20 bg-black/45 text-white/80 hover:border-brass-300/60 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="font-serif text-3xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#fff8e7] via-[#fde7b0] to-[#d4af37] drop-shadow-[0_4px_22px_rgba(0,0,0,0.9)] sm:text-5xl lg:text-6xl">
                Linh Xăm Khai Vận
              </h1>
              <p className="text-xs sm:text-base font-medium tracking-wide text-amber-100/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Một thông điệp đang chờ bạn khám phá.
              </p>
            </div>

            {phase === 'finished' && lastDrawn && (
              <div className="inline-flex items-center gap-2.5 rounded-full border border-brass-400/80 bg-black/75 px-4 py-1.5 text-xs sm:text-sm font-bold backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.65)]">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-temple-700 to-temple-900 font-display font-black text-amber-100 border border-brass-400/50">
                  {lastDrawn.stickNumber}
                </span>
                <span className="text-amber-50">
                  Quẻ số {lastDrawn.stickNumber} · {lastDrawn.rank} ({lastDrawn.kanjiRank})
                </span>
                <Flame className="h-3.5 w-3.5 text-brass-400 animate-pulse" />
              </div>
            )}

            {phase === 'ejecting' && ejectedStick !== null && (
              <div className="inline-flex items-center gap-2 rounded-full border border-brass-400/70 bg-black/75 px-4 py-1.5 text-xs font-bold text-amber-200 backdrop-blur-md">
                Thẻ tre số {String(ejectedStick).padStart(2, '0')} đang xuất hiện...
              </div>
            )}

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 pt-1">
              <button
                type="button"
                onClick={handleDraw}
                disabled={phase === 'shaking' || phase === 'ejecting'}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-brass-300/80 bg-gradient-to-r from-[#a3221a] via-[#881611] to-[#5e0d09] px-6 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base font-black tracking-wide text-amber-50 shadow-[0_0_28px_rgba(212,175,55,0.32),0_10px_24px_rgba(0,0,0,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-75"
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
                className="inline-flex items-center gap-2 rounded-full border border-brass-300/45 bg-black/50 px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-amber-100 backdrop-blur-md transition-all duration-200 hover:border-brass-300 hover:bg-black/70"
              >
                <Compass className="h-4 w-4 text-brass-300" />
                <span>Khám phá thần điện</span>
              </button>
            </div>

            <p className="text-[11px] text-amber-100/70 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              Kéo để xoay góc nhìn 3D · Chạm vào hũ xăm hoặc nhấn Gieo Quẻ Ngay
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
