import React, { Suspense, useState, useCallback } from 'react';
import { Flame, FastForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import { type OmikujiFortune, type PlanType, getRandomFortune } from '../data/omikujiData';
import { shrineAudio } from '../utils/sound';
import type { CeremonyPhase } from './hero3d/SacredHeroCanvas';

const SacredHeroCanvas = React.lazy(() =>
  import('./hero3d/SacredHeroCanvas').then((m) => ({ default: m.SacredHeroCanvas }))
);

interface HeroOmikujiSectionProps {
  selectedPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  onFortuneDrawn: (fortune: OmikujiFortune) => void;
  onIntroComplete?: () => void;
}

type BoxPhase = 'idle' | 'shaking' | 'ejecting' | 'finished';

const DIALOGUE_MAP: Partial<Record<CeremonyPhase, string>> = {
  speak1: '“Vận may của bạn...”',
  speak2: '“Vận may của bạn... đang chờ được khai mở.”',
  speak3: '“Hãy để ta dẫn lối đến thông điệp dành riêng cho bạn.”',
  fly: '“Hãy lắng nghe tiếng vọng từ quẻ xăm linh ứng...”',
  present: '“Vận mệnh của bạn đang dần được khai mở...”',
};

export const HeroOmikujiSection: React.FC<HeroOmikujiSectionProps> = ({
  selectedPlan,
  onFortuneDrawn,
  onIntroComplete,
}) => {
  const [phase, setPhase] = useState<BoxPhase>('idle');
  const [ejectedStick, setEjectedStick] = useState<number | null>(null);
  const [lastDrawn, setLastDrawn] = useState<OmikujiFortune | null>(null);
  const [sceneReady, setSceneReady] = useState<boolean>(false);
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

  const dialogueText = DIALOGUE_MAP[ceremonyPhase];

  return (
    <section
      id="hero-omikuji-section"
      className="relative h-[70vh] min-h-[440px] max-h-[720px] w-full overflow-hidden bg-[#0d0307]"
    >
      {/* ================= FULL-SCREEN 3D & BACKDROP STAGE ================= */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        {/* STAGE A: INSTANT FULL-SCREEN STATIC FALLBACK */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            sceneReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <img
            src="/images/shrine-backdrop-aaa.jpg"
            alt="Thần điện Kami no Sū"
            fetchPriority="high"
            className="h-full w-full object-cover object-center brightness-[0.85]"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/images/omikuji-box.png"
              alt="Hũ xăm Omikuji"
              className="h-60 sm:h-72 md:h-80 w-auto object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.85)] animate-float"
            />
          </div>
        </div>

        {/* STAGE B & C: LAZY-LOADED FULL-SCREEN 3D SCENE */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            sceneReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Suspense fallback={null}>
            <SacredHeroCanvas
              drawPhase={phase}
              skipRequested={skipRequested}
              onAltarClick={handleDraw}
              onPhaseChange={handlePhaseChange}
              onSceneReady={() => setSceneReady(true)}
            />
          </Suspense>
        </div>

        {/* Subtle Edge Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0206]/70 via-transparent to-[#0b0206]/40" />

        {/* Angel Vietnamese Subtitle Overlay during Ceremony */}
        {sceneReady && !isIntroComplete && dialogueText && (
          <div className="pointer-events-none absolute inset-x-4 bottom-24 md:bottom-14 z-30 flex justify-center">
            <div className="max-w-lg rounded-2xl border border-brass-300/50 bg-black/75 px-4 py-2 text-center font-serif text-xs sm:text-base italic text-amber-100 shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-md">
              {dialogueText}
            </div>
          </div>
        )}

        {/* Skip Intro Button */}
        {sceneReady && !isIntroComplete && (
          <button
            type="button"
            onClick={handleSkipIntro}
            className="absolute right-4 top-20 md:right-8 md:top-24 z-30 inline-flex items-center gap-1.5 rounded-full border border-brass-300/55 bg-black/65 px-3.5 py-1 text-[11px] font-semibold text-amber-100 backdrop-blur-md transition hover:border-brass-300 hover:bg-black/85"
          >
            <FastForward className="h-3 w-3 text-brass-300" />
            <span>Bỏ qua</span>
          </button>
        )}
      </div>

      {/* ================= MINIMAL TITLE ONLY: LINH XĂM KHAI VẬN ================= */}
      <div className="pointer-events-none relative z-20 flex h-full w-full flex-col items-center justify-end pb-6 md:items-start md:justify-end md:px-12 md:pb-8 lg:px-16">
        <div className="space-y-3 text-center md:text-left">
          <h1 className="font-serif text-3xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#fff8e7] via-[#fde7b0] to-[#d4af37] drop-shadow-[0_4px_22px_rgba(0,0,0,0.95)] sm:text-5xl lg:text-6xl">
            Linh Xăm Khai Vận
          </h1>

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
        </div>
      </div>
    </section>
  );
};
