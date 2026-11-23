import React, { useState, useCallback } from 'react';
import { RotateCw, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { type OmikujiFortune, type PlanType, getRandomFortune } from '../data/omikujiData';
import { shrineAudio } from '../utils/sound';

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

  const handleDraw = useCallback(() => {
    if (phase === 'shaking' || phase === 'ejecting') return;

    const fortune = getRandomFortune(selectedPlan);
    setEjectedStick(fortune.stickNumber);
    setLastDrawn(fortune);
    setPhase('shaking');

    // Realistic bamboo rattle sounds inside hexagonal box
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

      // Smooth scroll to fortune result section
      setTimeout(() => {
        const el = document.getElementById('fortune-result-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 400);
    }, 2100);

    return () => {
      clearTimeout(shake2);
      clearTimeout(tiltTimer);
      clearTimeout(finishTimer);
    };
  }, [phase, selectedPlan, onFortuneDrawn]);

  return (
    <section id="hero-omikuji-section" className="relative min-h-[92vh] sm:min-h-screen overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16 flex flex-col justify-between">
      {/* ================= BACKGROUND SHRINE IMAGE ================= */}
      <img
        src="/images/hero-shrine.jpg"
        alt="Đền Thần Sensoji Nhật Bản dưới trăng rằm và cổng Torii"
        className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.72] contrast-[1.08]"
      />

      {/* Atmospheric Overlays: Senso-ji Vermilion & Night Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#180306]/85 via-[#2b080f]/60 to-[#120205]/95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(203,161,53,0.14)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#120205] to-transparent pointer-events-none" />

      {/* Top Traditional Sensoji Vermilion Beam Accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-brass-400 via-temple-600 to-brass-400 opacity-80" />

      {/* ================= FOREGROUND HERO CONTENT ================= */}
      <div className="relative z-10 mx-auto w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col items-center justify-between flex-1">

        {/* ================= 30% TITLE & INTENT SELECTION ================= */}
        <div className="w-full max-w-2xl text-center flex flex-col items-center space-y-2.5 sm:space-y-3 mb-2">


          {/* Main Title in Vietnamese */}
          <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fff9ed] via-[#fde7b0] to-[#dfb84b] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
            Linh Xăm Khai Vận
          </h1>

          {/* Clean, Poetic Subtitle without emojis */}
          <div className="space-y-1">
            <p className="text-sm sm:text-base text-amber-100 font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] tracking-wide">
              Một thông điệp chỉ dẫn dành riêng cho bạn lúc này
            </p>
            <p className="text-xs text-amber-200/80 max-w-md mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
              Lắng nghe tiếng vọng vũ trụ · Khám phá vận trình trong 30 ngày tới
            </p>
          </div>

          {/* Clean Intent Tabs without icons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
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
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold backdrop-blur-md transition-all duration-200 ${isSelected
                    ? 'bg-gradient-to-r from-temple-800 to-temple-700 text-amber-100 shadow-temple-red border border-brass-400 ring-1 ring-brass-400/50 scale-105 font-bold'
                    : 'bg-black/35 text-white/85 border border-white/20 hover:border-brass-300/60 hover:text-white hover:bg-black/50'
                    }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= 70% BIG OMIKUJI BOX SHOWCASE ================= */}
        <div className="relative w-full max-w-2xl flex flex-col items-center justify-center my-auto py-2">
          {/* Interactive Omikuji Box Stage */}
          <div
            onClick={handleDraw}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleDraw();
            }}
            aria-label="Lắc hũ rút xăm"
            className="relative flex h-[380px] w-[330px] sm:h-[480px] sm:w-[420px] md:h-[530px] md:w-[470px] cursor-pointer items-center justify-center select-none group focus:outline-none"
          >
            {/* Concentric Golden Halo Rings */}
            <div
              className={`pointer-events-none absolute inset-6 sm:inset-4 rounded-full border border-dashed border-brass-400/50 transition-transform duration-700 ${phase === 'shaking' ? 'animate-spin scale-110 border-brass-300' : 'animate-spin-slow'
                }`}
            />
            <div
              className={`pointer-events-none absolute inset-16 sm:inset-12 rounded-full border border-brass-300/30 ${phase === 'shaking' ? 'animate-ping opacity-50' : 'animate-spin-reverse-slow'
                }`}
            />

            {/* Sacred Radiant Amber Glow behind Box */}
            <div
              className={`pointer-events-none absolute h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-gradient-to-tr from-temple-600/40 via-brass-400/35 to-amber-200/30 blur-3xl transition-transform duration-500 ${phase === 'shaking' ? 'scale-135' : 'scale-100 group-hover:scale-110'
                }`}
            />

            {/* High-Resolution Omikuji Box Image (70% Visual Prominence) */}
            <div
              className={`relative z-20 h-full w-full p-2 transition-transform duration-300 ${phase === 'shaking'
                ? 'animate-ritual-shake'
                : phase === 'ejecting'
                  ? 'animate-ritual-tilt'
                  : 'animate-float group-hover:scale-105'
                }`}
            >
              <img
                src="/images/omikuji-box.png"
                alt="Hũ xăm gỗ Omikuji đền Asakusa Nhật Bản"
                className="h-full w-full object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.85)] filter contrast-[1.05]"
              />
            </div>

            {/* BAMBOO STICK EJECTING WITH DRAWN LUCKY NUMBER */}
            {phase === 'ejecting' && ejectedStick !== null && (
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -ml-7 -mt-10 animate-stick-fall">
                <div className="relative flex h-52 w-14 flex-col items-center justify-between rounded-md border-2 border-brass-400 bg-gradient-to-b from-[#fffef5] via-[#fde7b7] to-[#dfb84b] py-3 text-temple-950 shadow-[0_20px_45px_rgba(0,0,0,0.85)]">
                  <span className="h-3 w-full bg-temple-800" />
                  <span className="vertical font-jp text-lg font-black tracking-[0.25em] text-temple-950">
                    第{String(ejectedStick).padStart(2, '0')}番
                  </span>
                  <span className="rounded-full bg-temple-800 px-2.5 py-0.5 text-xs font-black text-amber-200 shadow-sm">
                    吉
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Lucky Number Reveal Banner (When Finished) */}
          {phase === 'finished' && lastDrawn && (
            <div className="my-2 inline-flex items-center gap-3 rounded-full border border-brass-400/90 bg-black/75 backdrop-blur-md px-5 py-2.5 text-sm font-bold shadow-[0_10px_30px_rgba(0,0,0,0.7)] animate-card-bloom">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-temple-700 to-temple-900 text-amber-100 font-display font-black text-base shadow-sm border border-brass-400/50">
                {lastDrawn.stickNumber}
              </span>
              <div className="text-left">
                <span className="block text-[11px] text-amber-200/90">Con số may mắn của bạn:</span>
                <span className="text-white font-extrabold text-sm sm:text-base">
                  Số {lastDrawn.stickNumber} · {lastDrawn.rank} ({lastDrawn.kanjiRank})
                </span>
              </div>
              <Flame className="h-4 w-4 text-brass-400 animate-pulse" />
            </div>
          )}

          {/* Primary Action Button (Clean, no emoji) */}
          <div className="mt-2 sm:mt-3 flex flex-col items-center gap-2 w-full max-w-sm">
            <button
              type="button"
              onClick={handleDraw}
              disabled={phase === 'shaking' || phase === 'ejecting'}
              className="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#b32b1b] via-[#9e2717] to-[#7a180b] px-8 py-3.5 sm:py-4 text-base sm:text-lg font-black text-amber-100 shadow-[0_12px_28px_rgba(158,39,23,0.55)] border border-[#cba135]/60 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {phase === 'idle' || phase === 'finished' ? (
                <>
                  <span className="tracking-wide">Gieo Quẻ</span>
                  <span className="text-amber-300 font-bold ml-1">›</span>
                </>
              ) : (
                <>
                  <RotateCw className="h-5 w-5 animate-spin text-brass-200" />
                  <span className="tracking-wide">
                    {phase === 'shaking' ? 'Đang gieo quẻ...' : 'Thẻ tre đang rơi...'}
                  </span>
                </>
              )}
            </button>

            <p className="text-[11px] text-amber-100/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] tracking-wide">
              Chạm vào hũ xăm hoặc  Gieo Quẻ để xem thông điệp
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
