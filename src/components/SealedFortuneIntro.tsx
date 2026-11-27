import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { shrineAudio } from '../utils/sound';

interface SealedFortuneIntroProps {
  isVisible: boolean;
  onUnseal: () => void;
}

const LIGHT_MOTES = [
  { left: '28%', top: '58%', delay: '0s', duration: '3.6s', size: 'h-1.5 w-1.5' },
  { left: '70%', top: '54%', delay: '0.7s', duration: '4.2s', size: 'h-1 w-1' },
  { left: '42%', top: '46%', delay: '1.3s', duration: '3.9s', size: 'h-1.5 w-1.5' },
  { left: '58%', top: '62%', delay: '0.4s', duration: '4.5s', size: 'h-1 w-1' },
  { left: '35%', top: '38%', delay: '1.9s', duration: '3.8s', size: 'h-1 w-1' },
  { left: '64%', top: '40%', delay: '1.1s', duration: '4.1s', size: 'h-1.5 w-1.5' },
];

export const SealedFortuneIntro: React.FC<SealedFortuneIntroProps> = ({
  isVisible,
  onUnseal,
}) => {
  const [stage, setStage] = useState<'sealed' | 'opening'>('sealed');

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  const handleOpenMessage = useCallback(async () => {
    if (stage === 'opening') return;
    setStage('opening');

    // Unlock Web Audio on first user gesture and ring the sacred shrine bell
    const unlocked = await shrineAudio.unlock();
    shrineAudio.playShrineBell();
    if (unlocked && !shrineAudio.bgMusicPlaying) {
      shrineAudio.startBackgroundMusic().catch(() => {});
    }

    confetti({
      particleCount: 80,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#fde7b0', '#dfb84b', '#cba135', '#a33a24', '#ffffff'],
    });

    setTimeout(() => {
      onUnseal();
    }, 780);
  }, [stage, onUnseal]);

  if (!isVisible) return null;

  const isOpening = stage === 'opening';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Thông điệp niêm phong hôm nay"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#0c0204] px-5 py-8 transition-all duration-700 ${
        isOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Deep Temple Night Vignette & Atmospheric Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(163,58,36,0.24)_0%,rgba(43,8,15,0.65)_45%,rgba(10,2,4,0.98)_85%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brass-400/80 to-transparent" />

      {/* Center Stage */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {/* ================= SEALED FORTUNE CARD WITH LIGHT LEAK ================= */}
        <div
          onClick={handleOpenMessage}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenMessage();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Mở lá quẻ đang niêm phong"
          className="group relative mb-8 flex cursor-pointer items-center justify-center select-none focus:outline-none"
        >
          {/* Volumetric Light Rays Leaking Out Behind the Seal */}
          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] sm:h-[460px] sm:w-[460px] rounded-full animate-seal-rays transition-all duration-700 ${
              isOpening ? 'scale-150 opacity-100' : 'opacity-75 group-hover:opacity-100'
            }`}
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(253,231,176,0.22) 18deg, transparent 38deg, transparent 72deg, rgba(223,184,75,0.2) 92deg, transparent 115deg, transparent 150deg, rgba(253,231,176,0.24) 172deg, transparent 198deg, transparent 235deg, rgba(223,184,75,0.18) 256deg, transparent 280deg, transparent 315deg, rgba(253,231,176,0.22) 338deg, transparent 360deg)',
              maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 18%, rgba(0,0,0,0.4) 52%, transparent 72%)',
              WebkitMaskImage:
                'radial-gradient(circle, rgba(0,0,0,1) 18%, rgba(0,0,0,0.4) 52%, transparent 72%)',
            }}
          />

          {/* Ambient Pulsing Core Glow */}
          <div
            className={`pointer-events-none absolute h-64 w-64 sm:h-72 sm:w-72 rounded-full bg-gradient-to-tr from-temple-600/45 via-amber-400/35 to-brass-200/40 blur-3xl animate-seal-leak transition-transform duration-700 ${
              isOpening ? 'scale-[2] opacity-100' : 'group-hover:scale-110'
            }`}
          />

          {/* Floating Golden Light Motes */}
          <div className="pointer-events-none absolute inset-0">
            {LIGHT_MOTES.map((mote, idx) => (
              <span
                key={idx}
                style={{
                  left: mote.left,
                  top: mote.top,
                  animationDelay: mote.delay,
                  animationDuration: mote.duration,
                }}
                className={`absolute ${mote.size} rounded-full bg-amber-200 shadow-[0_0_10px_#fde7b0] animate-ember-drift`}
              />
            ))}
          </div>

          {/* The Sealed Washi Card */}
          <div
            className={`relative h-[300px] w-[205px] sm:h-[345px] sm:w-[236px] rounded-2xl border border-brass-400/55 bg-gradient-to-b from-[#2c090e] via-[#1c0408] to-[#130205] p-3 shadow-[0_26px_65px_rgba(0,0,0,0.9),0_0_40px_rgba(223,184,75,0.18)] transition-all duration-700 ${
              isOpening
                ? 'scale-110 border-brass-200 shadow-[0_0_90px_rgba(253,231,176,0.75)]'
                : 'animate-float group-hover:-translate-y-1.5 group-hover:border-brass-300/80'
            }`}
          >
            {/* Inner Gold-Foil Frame */}
            <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-xl border border-brass-400/35 bg-[radial-gradient(circle_at_50%_50%,rgba(223,184,75,0.12)_0%,rgba(28,4,8,0.92)_72%)] px-4 py-5">
              {/* Top & Bottom Sacred Corner Motifs */}
              <div className="flex w-full items-center justify-between text-[10px] font-jp tracking-[0.2em] text-brass-300/60">
                <span>✦</span>
                <span className="uppercase tracking-[0.28em] text-[9px] text-amber-200/75 font-sans font-semibold">
                  Niêm Phong
                </span>
                <span>✦</span>
              </div>

              {/* Vertical Kanji Watermark */}
              <div className="pointer-events-none flex flex-col items-center gap-1 opacity-25">
                <span className="vertical font-jp text-2xl font-black tracking-[0.35em] text-brass-200">
                  御神籤
                </span>
              </div>

              {/* Bottom Kanji Stamp */}
              <div className="flex w-full items-center justify-between text-[10px] font-jp tracking-[0.2em] text-brass-300/60">
                <span>✦</span>
                <span className="font-jp text-[11px] tracking-[0.25em] text-brass-300/75">
                  神の数
                </span>
                <span>✦</span>
              </div>

              {/* ===== LIGHT LEAKING FROM THE SEAL SEAM (HORIZONTAL & DIAGONAL CRACKS) ===== */}
              {/* Soft wide golden leak */}
              <div
                className={`pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 bg-gradient-to-r from-transparent via-amber-300/45 to-transparent blur-md animate-seal-leak transition-all duration-500 ${
                  isOpening ? 'h-32 via-amber-100/90 blur-xl' : 'group-hover:via-amber-200/65'
                }`}
              />
              {/* Crisp bright slit of leaked light */}
              <div
                className={`pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#fff7dc] to-transparent shadow-[0_0_16px_4px_rgba(253,231,176,0.75)] transition-all duration-500 ${
                  isOpening ? 'scale-x-125 opacity-100' : 'opacity-90 group-hover:opacity-100'
                }`}
              />
              {/* Vertical subtle seam glow */}
              <div className="pointer-events-none absolute inset-y-6 left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-transparent via-amber-200/55 to-transparent blur-[1px] animate-seal-leak" />

              {/* Traditional Mizuhiki Gold Binding Cord */}
              <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r from-brass-600/30 via-brass-300/90 to-brass-600/30" />

              {/* ===== SACRED WAX / TALISMAN SEAL (PHONG ẤN) ===== */}
              <div
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
                  isOpening ? 'scale-150 opacity-0 rotate-12' : 'scale-100 group-hover:scale-105'
                }`}
              >
                {/* Halo ring leaking around seal edge */}
                <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-amber-300/60 via-yellow-100/70 to-temple-500/40 blur-md animate-seal-leak" />

                {/* Raised Vermilion & Brass Seal */}
                <div className="relative grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-full border-2 border-brass-300/90 bg-gradient-to-br from-[#b83220] via-[#8b1e11] to-[#4a0b05] shadow-[0_10px_28px_rgba(0,0,0,0.85),inset_0_2px_6px_rgba(253,231,176,0.45),0_0_24px_rgba(253,231,176,0.45)]">
                  <div className="grid h-16 w-16 sm:h-[74px] sm:w-[74px] place-items-center rounded-full border border-dashed border-brass-200/70">
                    <span className="font-jp text-2xl sm:text-3xl font-black text-amber-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)]">
                      封
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= HOOK COPY ================= */}
        <p className="mb-6 max-w-sm font-serif text-xl sm:text-2xl font-semibold leading-snug tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fff8e7] via-[#fde7b0] to-[#f3d179] drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
          Có một thông điệp dành riêng cho hôm nay.
        </p>

        {/* ================= PRIMARY CTA: MỞ THÔNG ĐIỆP ================= */}
        <button
          type="button"
          onClick={handleOpenMessage}
          disabled={isOpening}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-brass-300/80 bg-gradient-to-r from-[#b82d1c] via-[#9b2113] to-[#7a1509] px-9 py-4 text-sm sm:text-base font-black tracking-[0.14em] text-amber-50 shadow-[0_0_32px_rgba(223,184,75,0.35),0_12px_28px_rgba(0,0,0,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_0_45px_rgba(253,231,176,0.55),0_16px_34px_rgba(0,0,0,0.85)] active:scale-95 disabled:opacity-80"
        >
          {/* Shimmer sweep */}
          <span className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-amber-100/35 to-transparent animate-cta-shimmer" />
          <span className="relative z-10">
            {isOpening ? 'ĐANG MỞ PHONG ẤN...' : 'MỞ THÔNG ĐIỆP'}
          </span>
        </button>
      </div>
    </div>
  );
};
