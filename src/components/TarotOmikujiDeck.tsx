import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Shuffle,
  Layers,
  Lock,
  Moon,
  Stars,
  Hand,
  Compass,
  Flower2,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getShuffledDeck,
  drawTarotSpread,
  THREE_CARD_POSITIONS,
  type TarotCard,
  type DrawnTarotCard,
} from '../data/tarotData';
import { RiderWaiteCardFace, TarotCardBackPattern } from './TarotCardArt';
import { TarotAltarDecor } from './TarotAltarDecor';
import { TarotReadingResult } from './TarotReadingResult';
import { shrineAudio } from '../utils/sound';

interface TarotOmikujiDeckProps {
  isUnlocked: boolean;
  onUnlockClick: () => void;
  onConsult1on1: (drawnCards: DrawnTarotCard[]) => void;
  onCardsDrawn?: (drawnCards: DrawnTarotCard[]) => void;
}

type RitualPhase = 'idle' | 'summoning' | 'dealing' | 'flying' | 'revealed';

const TEN_CARD_ROMANS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const RITUAL_STEPS = [
  {
    num: '1. Tĩnh Tâm',
    desc: 'Thả lỏng tâm trí, tập trung vào câu hỏi của bạn.',
    icon: Flower2,
  },
  {
    num: '2. Chọn Lá Bài',
    desc: 'Chọn 1 hoặc 3 trong 10 lá bài quanh tế đàn.',
    icon: Layers,
  },
  {
    num: '3. Nhận Thông Điệp',
    desc: 'Khám phá thông điệp và định hướng dành cho bạn.',
    icon: Sparkles,
  },
];

function getDesktopAltarSlot(idx: number) {
  const t = (idx - 4.5) / 4.5; // -1 .. +1
  const leftPct = 50 + Math.sin(t * 1.18) * 42;
  const topPx = Math.cos(t * 1.25) * 98;
  const angleDeg = -t * 16;
  const scale = 0.88 + (1 - Math.abs(t)) * 0.2;
  const zIndex = 20 + Math.round((1 - Math.abs(t)) * 12);
  return { leftPct, topPx, angleDeg, scale, zIndex };
}

function getMobileArcStyle(posInRow: number) {
  const t = (posInRow - 2) / 2;
  const yPx = Math.cos(t * 1.1) * 12;
  const angleDeg = -t * 9;
  return { yPx, angleDeg };
}

export const TarotOmikujiDeck: React.FC<TarotOmikujiDeckProps> = ({
  isUnlocked,
  onUnlockClick,
  onConsult1on1,
  onCardsDrawn,
}) => {
  const [deckCards, setDeckCards] = useState<TarotCard[]>(() => getShuffledDeck(10));
  const [ritualPhase, setRitualPhase] = useState<RitualPhase>('idle');
  const [pickedIndices, setPickedIndices] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [spotlightIndex, setSpotlightIndex] = useState<number | null>(null);
  const [spotlightFlipped, setSpotlightFlipped] = useState<boolean>(false);
  const [drawnCards, setDrawnCards] = useState<DrawnTarotCard[]>([]);
  const [spreadMode, setSpreadMode] = useState<1 | 3>(1);
  const [parallax, setParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const timersRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const clearPendingTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = window.requestAnimationFrame(() => {
      setParallax({ x: nx, y: ny });
    });
  }, []);

  const isBusy = ritualPhase === 'summoning' || ritualPhase === 'dealing' || ritualPhase === 'flying';

  const reversedMap = useMemo(() => {
    const map: Record<number, boolean> = {};
    drawnCards.forEach((entry) => {
      map[entry.card.id] = entry.isReversed;
    });
    return map;
  }, [drawnCards]);

  const handleSummonAndDeal = (targetMode?: 1 | 3) => {
    if (isBusy) return;
    clearPendingTimers();

    if (targetMode) setSpreadMode(targetMode);
    setPickedIndices([]);
    setDrawnCards([]);
    setHoveredIndex(null);
    setSpotlightIndex(null);
    setSpotlightFlipped(false);

    shrineAudio.playBoxShake();
    setRitualPhase('summoning');

    const t1 = window.setTimeout(() => {
      setDeckCards(getShuffledDeck(10));
      setRitualPhase('dealing');
      shrineAudio.playCardFlip();
    }, 520);

    const t2 = window.setTimeout(() => {
      setRitualPhase('idle');
    }, 1420);

    timersRef.current.push(t1, t2);
  };

  const handleSwitchMode = (mode: 1 | 3) => {
    if (mode === 3 && !isUnlocked) {
      onUnlockClick();
      return;
    }
    handleSummonAndDeal(mode);
  };

  const handlePickCard = (idx: number) => {
    if (isBusy) return;

    if (spreadMode === 1) {
      const card = deckCards[idx];
      const isReversed = Math.random() < 0.25;
      const result: DrawnTarotCard[] = [{ card, isReversed }];

      clearPendingTimers();
      setHoveredIndex(null);
      setPickedIndices([idx]);
      setDrawnCards(result);
      setSpotlightIndex(idx);
      setSpotlightFlipped(false);
      setRitualPhase('flying');
      shrineAudio.playStickSlide();

      const t1 = window.setTimeout(() => {
        setSpotlightFlipped(true);
        setRitualPhase('revealed');
        shrineAudio.playCardFlip();
      }, 420);

      const t2 = window.setTimeout(() => {
        shrineAudio.playShrineBell();
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.56 },
          colors: ['#E6BD72', '#FFF4E5', '#8F1E32', '#F4B7C5'],
        });
        onCardsDrawn?.(result);
      }, 800);

      timersRef.current.push(t1, t2);
      return;
    }

    if (pickedIndices.includes(idx) || pickedIndices.length >= 3) return;
    const nextIndices = [...pickedIndices, idx];
    const nextDrawn: DrawnTarotCard[] = nextIndices.map((cardIdx, posIdx) => ({
      card: deckCards[cardIdx],
      isReversed: Math.random() < 0.25,
      positionLabel: THREE_CARD_POSITIONS[posIdx],
    }));

    setHoveredIndex(null);
    setPickedIndices(nextIndices);
    setDrawnCards(nextDrawn);
    setSpotlightIndex(idx);
    setSpotlightFlipped(false);
    setRitualPhase('flying');
    shrineAudio.playStickSlide();

    const t1 = window.setTimeout(() => {
      setSpotlightFlipped(true);
      setRitualPhase('revealed');
      shrineAudio.playCardFlip();
    }, 360);

    if (nextIndices.length === 3) {
      const t2 = window.setTimeout(() => {
        shrineAudio.playShrineBell();
        confetti({
          particleCount: 95,
          spread: 80,
          origin: { y: 0.58 },
          colors: ['#E6BD72', '#FFF4E5', '#8F1E32', '#F4B7C5'],
        });
        setSpotlightIndex(null);
        onCardsDrawn?.(nextDrawn);
      }, 1000);
      timersRef.current.push(t2);
    } else {
      const t2 = window.setTimeout(() => {
        setSpotlightIndex(null);
        setRitualPhase('idle');
      }, 950);
      timersRef.current.push(t2);
    }

    timersRef.current.push(t1);
  };

  const handleGoddessSequentialThreeDeal = () => {
    if (!isUnlocked) {
      onUnlockClick();
      return;
    }
    if (isBusy) return;
    clearPendingTimers();

    setSpreadMode(3);
    setPickedIndices([]);
    setDrawnCards([]);
    setHoveredIndex(null);
    setSpotlightIndex(null);
    setSpotlightFlipped(false);
    setRitualPhase('summoning');
    shrineAudio.playBoxShake();

    const result = drawTarotSpread(3, true);
    const nextDeck = getShuffledDeck(10);
    const targetSlots = [2, 4, 7];

    result.forEach((entry, i) => {
      const existing = nextDeck.findIndex((c) => c.id === entry.card.id);
      if (existing !== -1) {
        [nextDeck[targetSlots[i]], nextDeck[existing]] = [nextDeck[existing], nextDeck[targetSlots[i]]];
      } else {
        nextDeck[targetSlots[i]] = entry.card;
      }
    });

    setDeckCards(nextDeck);

    targetSlots.forEach((slotIdx, step) => {
      const t = window.setTimeout(() => {
        shrineAudio.playCardFlip();
        setPickedIndices((prev) => [...prev, slotIdx]);
        setDrawnCards(result.slice(0, step + 1));
        if (step === 2) {
          shrineAudio.playShrineBell();
          confetti({
            particleCount: 95,
            spread: 80,
            origin: { y: 0.58 },
            colors: ['#E6BD72', '#FFF4E5', '#8F1E32', '#F4B7C5'],
          });
          setRitualPhase('revealed');
          onCardsDrawn?.(result);
        }
      }, 580 + step * 540);
      timersRef.current.push(t);
    });
  };

  const spotlightCard = spotlightIndex !== null ? deckCards[spotlightIndex] : null;
  const spotlightReversed = spotlightCard ? reversedMap[spotlightCard.id] ?? false : false;

  const renderAltarCard = (card: TarotCard, idx: number, isDesktop: boolean) => {
    const isPicked = pickedIndices.includes(idx);
    const isHovered = hoveredIndex === idx;
    const isInSpotlight = spotlightIndex === idx;
    const isReversed = reversedMap[card.id] ?? false;

    const desktopPos = getDesktopAltarSlot(idx);
    const mobileArc = getMobileArcStyle(idx % 5);

    const dimmedByHover = hoveredIndex !== null && !isHovered && !isPicked;
    const dimmedByPick = spreadMode === 1 && pickedIndices.length > 0 && !isPicked;

    const opacityClass = isInSpotlight
      ? 'opacity-0 pointer-events-none'
      : dimmedByHover || dimmedByPick
        ? 'opacity-55'
        : 'opacity-100';

    if (isDesktop) {
      const transformStr =
        ritualPhase === 'summoning'
          ? `translate(-50%, -88px) rotate(${(idx - 4.5) * 2.5}deg) scale(0.72)`
          : isPicked
            ? `translate(-50%, ${desktopPos.topPx - 14}px) rotate(0deg) scale(${desktopPos.scale * 1.08})`
            : isHovered
              ? `translate(-50%, ${desktopPos.topPx - 22}px) rotate(0deg) scale(${desktopPos.scale * 1.12})`
              : `translate(-50%, ${desktopPos.topPx}px) rotate(${desktopPos.angleDeg}deg) scale(${desktopPos.scale})`;

      const leftVal = ritualPhase === 'summoning' ? '50%' : `${desktopPos.leftPct}%`;

      return (
        <div
          key={`${card.id}-${idx}`}
          style={{
            left: leftVal,
            top: '0px',
            transform: transformStr,
            zIndex: isHovered ? 50 : isPicked ? 45 : desktopPos.zIndex,
            transitionDelay: ritualPhase === 'dealing' ? `${idx * 55}ms` : '0ms',
            transitionProperty: 'left, transform, opacity',
            transitionDuration: ritualPhase === 'dealing' ? '640ms' : '420ms',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className={`absolute flex flex-col items-center ${opacityClass}`}
        >
          <div
            style={{ animationDelay: `${idx * 0.3}s` }}
            className={ritualPhase === 'idle' && !isPicked && !isHovered ? 'animate-card-bob' : ''}
          >
            <button
              type="button"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex((prev) => (prev === idx ? null : prev))}
              onFocus={() => setHoveredIndex(idx)}
              onBlur={() => setHoveredIndex((prev) => (prev === idx ? null : prev))}
              onClick={() => handlePickCard(idx)}
              aria-label={`Chọn lá bài ${TEN_CARD_ROMANS[idx]}`}
              className="group perspective-1000 relative h-36 w-[84px] lg:h-40 lg:w-[94px] xl:h-44 xl:w-[104px] focus:outline-none"
            >
              <div
                className={`pointer-events-none absolute -inset-2 rounded-2xl blur-md transition-opacity duration-300 ${
                  isPicked || isHovered
                    ? 'bg-gradient-to-b from-[#E6BD72]/80 via-[#8F1E32]/45 to-[#E6BD72]/60 opacity-100'
                    : 'opacity-0'
                }`}
              />
              {isHovered && (
                <>
                  <span className="pointer-events-none absolute -left-2 -top-2 h-2 w-2 rounded-full bg-[#FFF4E5] shadow-[0_0_8px_#E6BD72] animate-ping" />
                  <span className="pointer-events-none absolute -right-2 top-3 h-1.5 w-1.5 rounded-full bg-[#E6BD72] shadow-[0_0_8px_#FFF4E5] animate-twinkle" />
                </>
              )}

              <div
                className={`relative h-full w-full transition-transform duration-700 transform-style-3d ${
                  isPicked ? 'rotate-y-180' : ''
                }`}
              >
                <div className="backface-hidden absolute inset-0 rounded-xl">
                  <TarotCardBackPattern numeral={TEN_CARD_ROMANS[idx]} label="ARCANA" />
                </div>

                <div className="backface-hidden rotate-y-180 absolute inset-0 overflow-hidden rounded-xl border-2 border-[#E6BD72] bg-[#FFF4E5] p-1 shadow-[0_16px_38px_rgba(74,16,29,0.35)]">
                  <RiderWaiteCardFace
                    cardId={card.id}
                    cardName={`${card.nameEn} – ${card.nameVi}`}
                    accentHex={card.accentHex}
                    isReversed={isReversed}
                  />
                  {isReversed && (
                    <span className="absolute right-1 top-1 z-20 rounded bg-[#4A101D]/90 px-1 py-0.5 text-[7px] font-bold uppercase text-[#FFF4E5]">
                      Ngược
                    </span>
                  )}
                </div>
              </div>
            </button>
          </div>

          <span
            className={`mt-1.5 inline-flex min-w-[26px] items-center justify-center rounded border px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider shadow-md transition ${
              isPicked || isHovered
                ? 'border-[#4A101D] bg-gradient-to-b from-[#fae4a6] to-[#cfa03b] text-[#4A101D]'
                : 'border-[#E6BD72] bg-[#4A101D]/95 text-[#FFF4E5]'
            }`}
          >
            {TEN_CARD_ROMANS[idx]}
          </span>
        </div>
      );
    }

    return (
      <div
        key={`${card.id}-${idx}`}
        style={{
          transform:
            ritualPhase === 'summoning'
              ? 'scale(0.84)'
              : `translateY(${mobileArc.yPx}px) rotate(${mobileArc.angleDeg}deg)`,
          transitionDelay: ritualPhase === 'dealing' ? `${idx * 45}ms` : '0ms',
          transition: 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease',
          zIndex: isPicked ? 35 : 15 + (idx % 5),
        }}
        className={`relative flex flex-col items-center ${opacityClass}`}
      >
        <button
          type="button"
          onClick={() => handlePickCard(idx)}
          aria-label={`Chọn lá bài ${TEN_CARD_ROMANS[idx]}`}
          className="group perspective-1000 relative h-28 w-[62px] transition-transform duration-300 active:scale-95 hover:-translate-y-2 focus:outline-none"
        >
          <div
            className={`relative h-full w-full transition-transform duration-700 transform-style-3d ${
              isPicked ? 'rotate-y-180' : ''
            }`}
          >
            <div className="backface-hidden absolute inset-0 rounded-lg">
              <TarotCardBackPattern numeral={TEN_CARD_ROMANS[idx]} label="TAROT" />
            </div>
            <div className="backface-hidden rotate-y-180 absolute inset-0 overflow-hidden rounded-lg border-2 border-[#E6BD72] bg-[#FFF4E5] p-0.5 shadow-lg">
              <RiderWaiteCardFace
                cardId={card.id}
                cardName={`${card.nameEn} – ${card.nameVi}`}
                accentHex={card.accentHex}
                isReversed={isReversed}
              />
            </div>
          </div>
        </button>
        <span className="mt-1 rounded border border-[#E6BD72] bg-[#4A101D]/95 px-1.5 py-0.5 text-[8px] font-bold text-[#FFF4E5]">
          {TEN_CARD_ROMANS[idx]}
        </span>
      </div>
    );
  };

  return (
    <section
      id="tarot-omikuji-section"
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] w-full scroll-mt-16 flex flex-col justify-between overflow-hidden bg-[#fbf4e7] px-4 pt-8 pb-12 sm:px-6 sm:py-12 lg:px-10 xl:px-14 text-[#3d1a15]"
    >
      {/* Seamless Warm Ivory Sanctuary + Sharp Isolated Goddess & Golden Halo */}
      <TarotAltarDecor
        parallax={parallax}
        isSummoning={ritualPhase === 'summoning' || ritualPhase === 'dealing'}
      />

      {/* ================= MAIN 3-COLUMN CINEMATIC STAGE ================= */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-between gap-6">
        {/* Top Row: Left Floating Glass Panel + Open Center Window for Goddess + Right Guide Panel */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[310px_1fr_270px]">
          {/* LEFT FLOATING HEADER & CONTROLS */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cfa03b]/60 bg-white/85 px-3.5 py-1 text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-[#781218] uppercase backdrop-blur-md shadow-sm">
              <Moon className="h-3.5 w-3.5 text-[#8F1E32]" />
              <span>Tarot Major Arcana · 10 Lá Vận Mệnh</span>
              <Stars className="h-3.5 w-3.5 text-[#cfa03b]" />
            </div>

            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-black tracking-tight leading-[1.1] text-[#581016]">
                Rút Bài Tarot
              </h2>
              <p className="font-serif text-lg sm:text-xl italic font-semibold text-[#8F1E32] mt-0.5">
                Soi Chiếu Nút Thắt Hiện Tại
              </p>
              <p className="mt-2.5 max-w-md text-xs sm:text-sm text-[#5c3d35] leading-relaxed">
                Hít thở sâu, tĩnh tâm và để Thần Linh dẫn lối. Chọn lá bài để nhận thông điệp vũ trụ dành riêng cho bạn.
              </p>
            </div>

            {/* Floating Glass Control Buttons */}
            <div className="flex flex-wrap justify-center lg:w-full lg:flex-col gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleSwitchMode(1)}
                className={`inline-flex items-center justify-center lg:justify-start gap-2.5 rounded-full border px-4 py-2.5 text-xs font-bold backdrop-blur-md transition-all active:scale-95 ${
                  spreadMode === 1
                    ? 'border-[#E6BD72] bg-gradient-to-r from-[#82151c] via-[#660e15] to-[#4A101D] text-[#FFF4E5] shadow-[0_10px_24px_rgba(95,12,18,0.3)]'
                    : 'border-[#d6b07c] bg-white/85 text-[#581016] hover:border-[#8F1E32] hover:bg-white'
                }`}
              >
                <Sparkles className={`h-3.5 w-3.5 ${spreadMode === 1 ? 'text-[#E6BD72]' : 'text-[#8F1E32]'}`} />
                <span>1 Lá - Miễn phí</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchMode(3)}
                className={`inline-flex items-center justify-center lg:justify-start gap-2.5 rounded-full border px-4 py-2.5 text-xs font-bold backdrop-blur-md transition-all active:scale-95 ${
                  spreadMode === 3
                    ? 'border-[#E6BD72] bg-gradient-to-r from-[#82151c] via-[#660e15] to-[#4A101D] text-[#FFF4E5] shadow-[0_10px_24px_rgba(95,12,18,0.3)]'
                    : 'border-[#d6b07c] bg-white/85 text-[#581016] hover:border-[#8F1E32] hover:bg-white'
                }`}
              >
                {!isUnlocked ? (
                  <Lock className="h-3.5 w-3.5 text-[#cfa03b]" />
                ) : (
                  <Layers className={`h-3.5 w-3.5 ${spreadMode === 3 ? 'text-[#E6BD72]' : 'text-[#8F1E32]'}`} />
                )}
                <span>3 Lá Chuyên Sâu</span>
              </button>

              <button
                type="button"
                onClick={() => handleSummonAndDeal()}
                disabled={isBusy}
                className="inline-flex items-center justify-center lg:justify-start gap-2.5 rounded-full border border-[#d6b07c] bg-white/85 px-4 py-2.5 text-xs font-bold text-[#581016] backdrop-blur-md shadow-sm transition-all hover:border-[#781218] hover:bg-[#781218] hover:text-[#FFF4E5] active:scale-95 disabled:opacity-60"
              >
                <Shuffle className={`h-3.5 w-3.5 ${isBusy ? 'animate-spin' : ''}`} />
                <span>{isBusy ? 'Thần Linh đang chia bài...' : 'Xáo lại bộ bài'}</span>
              </button>

              {spreadMode === 3 && isUnlocked && (
                <button
                  type="button"
                  onClick={handleGoddessSequentialThreeDeal}
                  disabled={isBusy}
                  className="inline-flex items-center justify-center lg:justify-start gap-2.5 rounded-full border border-[#cfa03b] bg-gradient-to-r from-[#fae4a6] via-[#E6BD72] to-[#cfa03b] px-4 py-2.5 text-xs font-extrabold text-[#4A101D] shadow-md hover:brightness-105 active:scale-95 transition disabled:opacity-60"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>Nữ Thần chia 3 lá</span>
                </button>
              )}
            </div>
          </div>

          {/* MOBILE & TABLET (< lg): Dedicated Goddess Showcase Below Controls (Zero Text Overlap) */}
          <div className="relative mx-auto flex w-full max-w-[460px] justify-center lg:hidden -my-2">
            <div
              className="relative h-[265px] w-full sm:h-[340px] animate-oracle-levitate"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
              }}
            >
              <img
                src="/images/divine-oracle-ivory.jpg"
                alt="Nữ Thần Tiên Tri Tarot"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 82%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, transparent 0%, black 5%, black 82%, transparent 100%)',
                }}
                className="h-full w-full object-contain object-center"
              />
              <div
                className={`pointer-events-none absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(255,244,229,0.65)_0%,rgba(230,189,114,0.32)_48%,transparent_75%)] blur-xl transition-all duration-500 ${
                  ritualPhase === 'summoning' || ritualPhase === 'dealing'
                    ? 'scale-125 opacity-100 animate-summon-pulse'
                    : 'scale-100 opacity-65 animate-halo-pulse'
                }`}
              />
            </div>
          </div>

          {/* DESKTOP (lg+): Open Center Window for Absolute Goddess Backdrop */}
          <div className="hidden lg:block lg:min-h-[320px]" />

          {/* RIGHT FLOATING GLASS RITUAL GUIDE PANEL (Desktop lg+) */}
          <aside className="hidden lg:block rounded-2xl border border-[#dec19b] bg-white/80 p-5 backdrop-blur-md shadow-[0_14px_38px_-12px_rgba(105,45,25,0.2)]">
            <div className="mb-4 flex items-center justify-center gap-2 border-b border-[#ebd9c3] pb-3">
              <span className="text-[10px] text-[#cfa03b]">✦</span>
              <h3 className="font-serif text-base font-bold text-[#581016]">Quy Trình Rút Bài</h3>
              <span className="text-[10px] text-[#cfa03b]">✦</span>
            </div>

            <div className="space-y-4">
              {RITUAL_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#e3c699] bg-[#fff7eb] text-[#781218] shadow-sm">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#581016]">{step.num}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-[#6b4b42]">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        {/* 3-Card Slots Progress */}
        {spreadMode === 3 && (
          <div className="relative z-30 mx-auto grid w-full max-w-2xl grid-cols-1 sm:grid-cols-3 gap-2">
            {THREE_CARD_POSITIONS.map((label, i) => {
              const picked = drawnCards[i];
              return (
                <div
                  key={label}
                  className={`rounded-xl border px-3 py-1.5 text-center text-[11px] backdrop-blur-md transition ${
                    picked
                      ? 'border-[#E6BD72] bg-[#4A101D] text-[#FFF4E5] shadow-md'
                      : 'border-[#d6b07c] bg-white/85 text-[#5c3d35]'
                  }`}
                >
                  <span className="block text-[9px] uppercase tracking-widest text-[#cfa03b] font-bold">
                    Vị trí {i + 1}
                  </span>
                  <span className="font-semibold line-clamp-1">
                    {picked ? `${picked.card.nameEn} (${picked.card.nameVi})` : label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* FOREGROUND CIRCULAR MYSTICAL ALTAR + 10 SEMI-CIRCULAR FLOATING TAROT CARDS */}
        <div className="relative flex flex-col items-center">
          {/* Desktop / Tablet (md+): Concentric Golden-Burgundy Circular Altar + 10 Cards */}
          <div className="relative hidden md:block h-[290px] lg:h-[310px] w-full max-w-5xl mx-auto">
            <div className="pointer-events-none absolute inset-x-4 bottom-2 top-8 rounded-[50%] border-2 border-[#E6BD72]/70 bg-[radial-gradient(ellipse_at_50%_50%,rgba(230,189,114,0.34)_0%,rgba(143,30,50,0.22)_46%,rgba(251,244,231,0)_76%)] shadow-[0_0_70px_rgba(230,189,114,0.32)]">
              <div className="absolute inset-4 rounded-[50%] border border-dashed border-[#8F1E32]/40" />
              <div className="absolute inset-9 rounded-[50%] border border-[#E6BD72]/55" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-28 rounded-[50%] bg-[#FFF4E5]/70 blur-xl animate-halo-pulse" />
            </div>

            {deckCards.map((card, idx) => renderAltarCard(card, idx, true))}
          </div>

          {/* Mobile (< md): Compact 2-Tier Curved Arc */}
          <div className="relative flex flex-col gap-3 w-full max-w-[350px] md:hidden pb-2">
            <div className="pointer-events-none absolute -inset-x-3 bottom-0 top-2 rounded-[50%] border border-[#E6BD72]/55 bg-[radial-gradient(ellipse_at_50%_50%,rgba(230,189,114,0.28)_0%,rgba(143,30,50,0.14)_55%,transparent_80%)]" />
            <div className="relative grid grid-cols-5 gap-1.5">
              {deckCards.slice(0, 5).map((card, idx) => renderAltarCard(card, idx, false))}
            </div>
            <div className="relative grid grid-cols-5 gap-1.5">
              {deckCards.slice(5, 10).map((card, idx) => renderAltarCard(card, idx + 5, false))}
            </div>
          </div>

          {/* Bottom Altar Prompt Pill */}
          <div className="relative z-30 mt-2 inline-flex items-center gap-2 rounded-full border border-[#E6BD72] bg-gradient-to-r from-[#581016] via-[#781218] to-[#581016] px-5 py-2 text-xs font-bold text-[#FFF4E5] shadow-[0_8px_24px_rgba(88,16,22,0.28)]">
            <Hand className="h-3.5 w-3.5 text-[#E6BD72]" />
            <span>
              {ritualPhase === 'summoning'
                ? 'Nữ Thần đang triệu hồi 10 lá vận mệnh...'
                : spreadMode === 3 && pickedIndices.length < 3
                  ? `Chạm chọn lá thứ ${pickedIndices.length + 1}/3 trên tế đàn`
                  : 'Chạm vào 1 trong 10 lá bài để rút thông điệp'}
            </span>
          </div>
        </div>
      </div>

      {/* CENTER SPOTLIGHT OVERLAY: FLY -> DARKEN -> 3D FLIP REVEAL */}
      {spotlightCard && (
        <div
          onClick={() => {
            if (ritualPhase === 'revealed') setSpotlightIndex(null);
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#180409]/80 p-4 backdrop-blur-md animate-card-bloom"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative flex flex-col items-center">
            <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(230,189,114,0.48)_0%,rgba(143,30,50,0.35)_52%,transparent_76%)] blur-2xl animate-halo-pulse" />

            <div className="perspective-1000 relative h-72 w-44 sm:h-88 sm:w-52">
              <div
                className={`relative h-full w-full transition-transform duration-700 transform-style-3d ${
                  spotlightFlipped ? 'rotate-y-180' : ''
                }`}
              >
                <div className="backface-hidden absolute inset-0 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
                  <TarotCardBackPattern numeral="✦" label="TAROT" />
                </div>
                <div className="backface-hidden rotate-y-180 absolute inset-0 overflow-hidden rounded-2xl border-2 border-[#E6BD72] bg-[#FFF4E5] p-1.5 shadow-[0_0_55px_rgba(230,189,114,0.58)]">
                  <RiderWaiteCardFace
                    cardId={spotlightCard.id}
                    cardName={`${spotlightCard.nameEn} – ${spotlightCard.nameVi}`}
                    accentHex={spotlightCard.accentHex}
                    isReversed={spotlightReversed}
                  />
                  {spotlightReversed && (
                    <span className="absolute right-2 top-2 z-20 rounded bg-[#4A101D]/95 px-2 py-0.5 text-[10px] font-bold uppercase text-[#FFF4E5] shadow">
                      Ngược
                    </span>
                  )}
                </div>
              </div>
            </div>

            {spotlightFlipped && (
              <div className="mt-5 flex flex-col items-center text-center gap-3 animate-card-bloom">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E6BD72]">
                    {spotlightReversed ? 'Lá Ngược · Thông điệp cảnh tỉnh' : 'Lá Xuôi · Tín hiệu khai mở'}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-black text-[#FFF4E5]">
                    {spotlightCard.numeral} · {spotlightCard.nameEn} ({spotlightCard.nameVi})
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSpotlightIndex(null)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#FFF4E5]/80 bg-gradient-to-r from-[#fae4a6] via-[#E6BD72] to-[#cfa03b] px-6 py-2.5 text-xs sm:text-sm font-extrabold text-[#4A101D] shadow-lg hover:brightness-105 active:scale-95 transition"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Xem luận giải chi tiết bên dưới</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= DARK BURGUNDY INTERPRETATION RESULT PANEL ================= */}
      <div className="relative z-30 mx-auto w-full max-w-6xl">
        {drawnCards.length > 0 && (
          <div className="mt-4 mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => handleSummonAndDeal()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#781218] hover:text-[#4A101D] transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Làm mới nghi thức rút bài</span>
            </button>
          </div>
        )}

        <TarotReadingResult
          drawnCards={drawnCards}
          isUnlocked={isUnlocked}
          onUnlockClick={onUnlockClick}
          onConsult1on1={onConsult1on1}
        />
      </div>
    </section>
  );
};
