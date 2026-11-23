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
  mini: 'Xăm Toàn Cảnh',
  love: 'Xăm Tình Duyên',
  destiny: 'Xăm Tài Lộc Vận Mệnh',
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

    shrineAudio.playBoxShake();
    const s2 = setTimeout(() => {
      shrineAudio.playBoxShake();
      setShakeProgress(55);
    }, 550);
    const s3 = setTimeout(() => {
      shrineAudio.playBoxShake();
      setShakeProgress(90);
    }, 1100);

    const fallTimer = setTimeout(() => {
      setShakeProgress(100);
      setStage('falling');
      shrineAudio.playStickSlide();
    }, 1650);

    const revealTimer = setTimeout(() => {
      shrineAudio.playShrineBell();
      if (fortune.rank === 'Đại Cát') {
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.55 },
          colors: ['#a33a24', '#cba135', '#fde7b0', '#ffffff'],
        });
      } else {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.55 },
          colors: ['#a33a24', '#dfb84b'],
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
        { label: 'Tình duyên', value: drawnFortune.scores.love, icon: Heart, bar: 'from-[#ecbeae] via-[#cb6d53] to-[#a33a24]' },
        { label: 'Sự nghiệp', value: drawnFortune.scores.career, icon: Briefcase, bar: 'from-[#f6e7b0] via-[#dfb84b] to-[#a33a24]' },
        { label: 'Tài lộc', value: drawnFortune.scores.wealth, icon: Coins, bar: 'from-[#ecd27e] via-[#cba135] to-[#8b2a18]' },
        { label: 'Sức khỏe', value: drawnFortune.scores.health, icon: Flower2, bar: 'from-[#f5dbd2] via-[#de9782] to-[#b84e35]' },
      ]
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Nghi thức lắc hũ xăm may mắn"
      className="fixed inset-0 z-50 flex flex-col temple-bg overflow-y-auto"
    >
      {/* Ambient Temple Glows */}
      <div className="pointer-events-none fixed -top-24 left-1/2 h-96 w-[640px] -translate-x-1/2 rounded-full bg-temple-200/35 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-80 w-80 rounded-full bg-brass-200/30 blur-3xl" />

      {/* ================= TOP BAR ================= */}
      <div className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-[#cba135]/30 bg-[#8b2a18]/95 px-4 py-3.5 text-white backdrop-blur-md sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-temple-600 to-temple-900 font-jp text-base font-bold text-brass-200 shadow-sm">
            籤
          </span>
          <div>
            <p className="font-display text-sm sm:text-base font-bold text-amber-50 leading-tight">
              Lắc Hũ Xăm May Mắn · Asakusa Sensoji
            </p>
            <p className="text-[11px] text-brass-200/80">{PLAN_LABELS[selectedPlan]}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Đóng đài rút quẻ"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-all"
        >
          <span>Đóng</span>
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ================= CENTER STAGE ================= */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 lg:px-14">
        {/* STAGES 1–3: READY / SHAKING / STICK FALLING OUT */}
        {stage !== 'revealed' && (
          <div className="flex w-full max-w-3xl flex-col items-center text-center">
            {/* Step Pills */}
            <div className="mb-6 flex items-center gap-2 text-[11px] font-bold">
              <span
                className={`rounded-full px-3 py-1 transition-all ${
                  stage === 'ready'
                    ? 'bg-temple-800 text-white shadow-temple-red'
                    : 'bg-temple-100 text-temple-800'
                }`}
              >
                1. Khởi tâm
              </span>
              <span className="text-temple-400">→</span>
              <span
                className={`rounded-full px-3 py-1 transition-all ${
                  stage === 'shaking'
                    ? 'bg-temple-800 text-white shadow-temple-red'
                    : 'bg-temple-100 text-temple-800'
                }`}
              >
                2. Lắc hũ xăm
              </span>
              <span className="text-temple-400">→</span>
              <span
                className={`rounded-full px-3 py-1 transition-all ${
                  stage === 'falling'
                    ? 'bg-temple-800 text-white shadow-temple-red'
                    : 'bg-temple-100 text-temple-800'
                }`}
              >
                3. Thẻ xăm rớt ra
              </span>
            </div>

            {/* Interactive Box Arena */}
            <div
              onClick={stage === 'ready' ? startShakeRitual : undefined}
              className={`relative flex h-[340px] w-full max-w-[380px] sm:h-[420px] sm:max-w-[450px] items-center justify-center select-none ${
                stage === 'ready' ? 'cursor-pointer group' : ''
              }`}
            >
              {/* Concentric Shrine Rings */}
              <div
                className={`pointer-events-none absolute h-72 w-72 sm:h-84 sm:w-84 rounded-full border-2 border-dashed border-brass-400/70 transition-all duration-500 ${
                  stage === 'shaking' ? 'animate-spin scale-110 border-temple-600' : 'animate-spin-slow'
                }`}
              />
              <div
                className={`pointer-events-none absolute h-56 w-56 sm:h-64 sm:w-64 rounded-full border border-temple-600/40 ${
                  stage === 'shaking' ? 'animate-ping opacity-30' : 'animate-spin-reverse-slow'
                }`}
              />

              <div
                className={`pointer-events-none absolute h-60 w-60 rounded-full bg-gradient-to-tr from-temple-300/40 via-brass-200/40 to-amber-100/40 blur-2xl transition-transform duration-500 ${
                  stage === 'shaking' ? 'scale-125' : 'scale-100'
                }`}
              />

              {/* Wooden Omikuji Box */}
              <div
                className={`relative z-20 h-64 w-64 sm:h-76 sm:w-76 transition-transform duration-300 ${
                  stage === 'shaking'
                    ? 'animate-ritual-shake'
                    : stage === 'falling'
                      ? 'animate-ritual-tilt'
                      : 'animate-float group-hover:scale-105'
                }`}
              >
                <img
                  src="/images/omikuji-box.png"
                  alt="Hũ gỗ xăm may mắn"
                  className="h-full w-full object-contain drop-shadow-[0_22px_36px_rgba(110,30,18,0.25)]"
                />
              </div>

              {/* FALLING BAMBOO STICK */}
              {stage === 'falling' && drawnFortune && (
                <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -ml-6 -mt-8 animate-stick-fall">
                  <div className="relative flex h-44 w-11 flex-col items-center justify-between rounded-md border-2 border-brass-400 bg-gradient-to-b from-[#fffaf0] via-[#fde7b7] to-[#dfb84b] py-2.5 text-temple-900 shadow-[0_16px_36px_rgba(110,30,18,0.5)]">
                    <span className="h-2.5 w-full bg-temple-800" />
                    <span className="vertical font-jp text-sm font-black tracking-[0.25em] text-temple-900">
                      第{String(drawnFortune.stickNumber).padStart(2, '0')}番
                    </span>
                    <span className="rounded-full bg-temple-800/15 px-1.5 text-[10px] font-extrabold text-temple-900">
                      吉
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Stage Status & Button */}
            <div className="mt-4 w-full max-w-md space-y-4">
              {stage === 'ready' && (
                <>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-temple-900">
                    Tĩnh tâm &amp; Lắc hũ xăm
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    Nghĩ về điều bạn mong cầu, sau đó bấm nút để lắc cho đến khi một thẻ xăm mang con số may mắn rớt ra!
                  </p>
                  <button
                    onClick={startShakeRitual}
                    className="mt-2 inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-temple-700 via-temple-800 to-temple-900 px-9 py-4 text-base font-extrabold text-white shadow-temple-red transition-all hover:-translate-y-0.5 hover:brightness-105 active:scale-95"
                  >
                    <Sparkles className="h-5 w-5 text-brass-300" />
                    <span>Lắc hũ xăm ngay</span>
                  </button>
                </>
              )}

              {stage === 'shaking' && (
                <div className="space-y-3">
                  <h2 className="font-display text-2xl font-bold text-temple-800 animate-pulse">
                    Đang lắc hũ xăm linh thiêng...
                  </h2>
                  <div className="mx-auto h-2.5 w-64 overflow-hidden rounded-full bg-temple-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-temple-600 via-temple-800 to-brass-400 transition-all duration-500"
                      style={{ width: `${shakeProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-ink-muted">
                    Thẻ tre đang rộn rã trong ống xăm...
                  </p>
                </div>
              )}

              {stage === 'falling' && drawnFortune && (
                <div className="space-y-2 animate-card-bloom">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brass-400 bg-brass-100 px-5 py-2 text-base font-extrabold text-temple-900 shadow-sm">
                    <Sparkles className="h-5 w-5 text-brass-600" />
                    <span>Đã rớt thẻ tre Số #{String(drawnFortune.stickNumber).padStart(2, '0')}!</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-ink-muted">
                    Đang khai mở lời xăm sấm truyền...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAGE 4: REVEALED FORTUNE SLIP */}
        {stage === 'revealed' && drawnFortune && (
          <div className="w-full max-w-5xl animate-card-bloom">
            <div className="mb-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-temple-300 bg-white px-4 py-1.5 text-xs font-bold text-temple-900 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-brass-600" />
                <span>Đã khai mở Quẻ Xăm Số #{String(drawnFortune.stickNumber).padStart(2, '0')} · {PLAN_LABELS[selectedPlan]}</span>
              </span>
            </div>

            <div className="washi-card relative grid gap-6 overflow-hidden rounded-3xl p-6 sm:p-8 lg:grid-cols-[160px_1fr_290px] shadow-temple-hover">
              <div className="pointer-events-none absolute inset-2 rounded-2xl border border-temple-200/80" />

              {/* Left Vertical Ribbon */}
              <div className="relative z-10 flex flex-row items-center justify-between gap-3 rounded-2xl border border-temple-300 bg-gradient-to-b from-[#faeee9] via-[#f5dbd2] to-[#eed0c5] px-5 py-4 text-temple-900 shadow-sm lg:flex-col lg:justify-center lg:py-8">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-temple-700">
                    SỐ XĂM
                  </span>
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-temple-800 text-white font-display text-2xl font-black shadow-temple-red my-1">
                    {String(drawnFortune.stickNumber).padStart(2, '0')}
                  </div>
                  <span className="font-jp text-[11px] font-bold text-temple-900">
                    第{drawnFortune.stickNumber}番
                  </span>
                </div>

                <b className="font-jp text-5xl lg:text-6xl font-black leading-none text-temple-900 lg:vertical lg:my-4">
                  {drawnFortune.kanjiRank}
                </b>

                <div className="text-right lg:text-center">
                  <span className="block text-base font-extrabold uppercase tracking-wider text-temple-900">
                    {drawnFortune.rank}
                  </span>
                  <span className="block text-xs text-temple-700 mt-0.5">❀ {drawnFortune.theme}</span>
                </div>
              </div>

              {/* Center Modular Categories */}
              <div className="relative z-10 flex flex-col justify-between space-y-3.5">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-temple-950">
                    {drawnFortune.title}
                  </h2>

                  {/* Summary Callout */}
                  <div className="mt-2.5 rounded-xl border border-brass-300 bg-amber-50/70 p-3 text-xs sm:text-sm font-semibold text-temple-950">
                    <strong className="text-temple-800 uppercase tracking-wide text-[11px] block sm:inline sm:mr-1">
                      Tóm lược vận khí:
                    </strong>
                    {drawnFortune.summary}
                  </div>

                  {/* 4-Line Poem */}
                  <div className="mt-3 rounded-xl border-l-4 border-temple-700 bg-white/90 p-3.5 font-jp text-xs sm:text-sm font-semibold italic leading-relaxed text-temple-950 shadow-sm space-y-0.5">
                    {drawnFortune.poem.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>

                  {/* 4 Aspect Grid */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="rounded-xl border border-rose-200/90 bg-rose-50/80 p-2.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-temple-950 mb-1">
                        <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-rose-600" /> Tình Duyên</span>
                        <span className="text-temple-900">{drawnFortune.scores.love}%</span>
                      </div>
                      <p className="text-ink leading-snug">{drawnFortune.aspects.love}</p>
                    </div>

                    <div className="rounded-xl border border-amber-200/90 bg-amber-50/80 p-2.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-temple-950 mb-1">
                        <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-amber-700" /> Sự Nghiệp</span>
                        <span className="text-temple-900">{drawnFortune.scores.career}%</span>
                      </div>
                      <p className="text-ink leading-snug">{drawnFortune.aspects.career}</p>
                    </div>

                    <div className="rounded-xl border border-brass-200/90 bg-yellow-50/80 p-2.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-temple-950 mb-1">
                        <span className="flex items-center gap-1"><Coins className="h-3.5 w-3.5 text-brass-700" /> Tài Lộc</span>
                        <span className="text-temple-900">{drawnFortune.scores.wealth}%</span>
                      </div>
                      <p className="text-ink leading-snug">{drawnFortune.aspects.wealth}</p>
                    </div>

                    <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/80 p-2.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-temple-950 mb-1">
                        <span className="flex items-center gap-1"><Flower2 className="h-3.5 w-3.5 text-emerald-700" /> Sức Khỏe</span>
                        <span className="text-temple-900">{drawnFortune.scores.health}%</span>
                      </div>
                      <p className="text-ink leading-snug">{drawnFortune.aspects.health}</p>
                    </div>
                  </div>

                  {/* Action Advice */}
                  <p className="mt-3 rounded-xl bg-temple-50 border border-temple-200 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-temple-900">
                    <strong className="text-temple-800">Lời khuyên hành động:</strong> {drawnFortune.advice}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="flex items-center gap-2 rounded-xl border border-temple-200 bg-white/90 px-3 py-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-temple-800 font-display font-bold text-white">
                      {drawnFortune.numerology.luckyNumber}
                    </span>
                    <div className="min-w-0">
                      <span className="block text-[10px] text-ink-light">Số &amp; Màu tốt</span>
                      <span className="font-bold text-ink truncate block">{drawnFortune.numerology.color}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-temple-200 bg-white/90 px-3 py-2">
                    <Compass className="h-4 w-4 shrink-0 text-temple-700" />
                    <div className="min-w-0">
                      <span className="block text-[10px] text-ink-light">Phương hướng</span>
                      <span className="font-bold text-ink truncate block">{drawnFortune.numerology.direction.split('(')[0]}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-temple-200 bg-white/90 px-3 py-2">
                    <Shield className="h-4 w-4 shrink-0 text-temple-700" />
                    <div className="min-w-0">
                      <span className="block text-[10px] text-ink-light">Vật hộ mệnh</span>
                      <span className="font-bold text-temple-800 truncate block">{drawnFortune.numerology.amulet.split('(')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Bars & Action Buttons */}
              <div className="relative z-10 flex flex-col justify-between gap-5 border-t border-temple-200 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <div className="space-y-3.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-temple-700 block">
                    Chỉ Số Vận Hạn:
                  </span>
                  {statItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="flex items-center gap-1.5 font-semibold text-ink">
                            <Icon className="h-4 w-4 text-temple-700" />
                            {item.label}
                          </span>
                          <span className="font-bold text-temple-900">{item.value}%</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-temple-100">
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
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                      isSaved
                        ? 'border border-temple-700 bg-temple-100 text-temple-900'
                        : 'bg-temple-900 text-brass-100 shadow-sm hover:bg-temple-950'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 text-temple-700" />
                        <span>Đã lưu vào sổ xăm</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 text-brass-300" />
                        <span>Lưu vào sổ xăm</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onShareFortune(drawnFortune)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-temple-300 bg-white px-3 py-2.5 text-xs font-bold text-ink hover:border-temple-700 hover:bg-temple-50 transition-all"
                    >
                      <Share2 className="h-3.5 w-3.5 text-temple-700" />
                      <span>Chia sẻ</span>
                    </button>

                    <button
                      onClick={startShakeRitual}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-temple-700 to-temple-900 px-3 py-2.5 text-xs font-bold text-white shadow-temple-red hover:brightness-105 transition-all"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Lắc lại</span>
                    </button>
                  </div>

                  <button
                    onClick={onClose}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-temple-200 bg-temple-50/70 py-2 text-xs font-semibold text-temple-900 hover:bg-temple-100 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Hoàn tất &amp; xem trên trang</span>
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
