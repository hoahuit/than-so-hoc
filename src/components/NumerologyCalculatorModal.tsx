import React, { useState } from 'react';
import { X, Sparkles, Compass, Heart, Briefcase, User, Calendar, Flame } from 'lucide-react';
import { calculateNumerology, type NumerologyProfile } from '../data/numerologyData';
import { shrineAudio } from '../utils/sound';

interface NumerologyCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NumerologyCalculatorModal: React.FC<NumerologyCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('2002-08-15');
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);

  if (!isOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    shrineAudio.playShrineBell();
    const res = calculateNumerology(name, birthDate);
    setProfile(res);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c0d14]/55 p-4 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="washi-card relative my-8 w-full max-w-2xl overflow-hidden rounded-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto"
      >
        {/* Inner Japanese Frame */}
        <div className="pointer-events-none absolute inset-2 rounded-xl border border-rose-200/70" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full border border-rose-200 bg-white text-ink-muted hover:border-crimson-400 hover:text-crimson-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="relative z-10 mb-5 flex items-center gap-3 pr-8">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#ef6676] to-[#d43c50] font-jp text-2xl font-bold text-amber-100 shadow-coral-glow">
            数
          </div>
          <div>
            <span className="font-jp text-[11px] font-bold tracking-[0.25em] text-crimson-500 uppercase">
              数秘術 · PYTHAGORAS
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
              Khám Phá Thần Số Học Cá Nhân
            </h2>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleCalculate} className="relative z-10 grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
              <User className="h-3.5 w-3.5 text-crimson-500" />
              Họ và tên đầy đủ
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Nguyễn Minh Anh"
              required
              className="w-full rounded-xl border border-rose-200 bg-white px-3.5 py-2.5 text-sm text-ink placeholder-ink-light focus:border-crimson-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink">
              <Calendar className="h-3.5 w-3.5 text-crimson-500" />
              Ngày tháng năm sinh (Dương lịch)
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full rounded-xl border border-rose-200 bg-white px-3.5 py-2.5 text-sm text-ink focus:border-crimson-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          <button
            type="submit"
            className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ee5b6d] via-[#e24558] to-[#d43c50] py-3 text-sm font-bold text-white shadow-coral-glow hover:brightness-105 transition-all"
          >
            <Sparkles className="h-4 w-4 text-amber-200" />
            <span>Khai Mở Bản Đồ Thần Số</span>
          </button>
        </form>

        {/* Results */}
        {profile && (
          <div className="relative z-10 space-y-4 border-t border-rose-200 pt-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-gradient-to-b from-[#ef6676] to-[#d43c50] p-3 text-center text-white shadow-coral-glow">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-100">
                  Số Chủ Đạo
                </span>
                <span className="mt-1 block font-display text-4xl font-extrabold text-amber-100">
                  {profile.lifePathNumber}
                </span>
              </div>

              <div className="rounded-xl border border-rose-200 bg-white p-3 text-center">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  Linh Hồn
                </span>
                <span className="mt-1 block font-display text-3xl font-bold text-crimson-600">
                  {profile.soulUrgeNumber}
                </span>
              </div>

              <div className="rounded-xl border border-rose-200 bg-white p-3 text-center">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  Sứ Mệnh
                </span>
                <span className="mt-1 block font-display text-3xl font-bold text-crimson-500">
                  {profile.expressionNumber}
                </span>
              </div>

              <div className="rounded-xl border border-rose-200 bg-white p-3 text-center">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  Năm Cá Nhân 2026
                </span>
                <span className="mt-1 block font-display text-3xl font-bold text-amber-600">
                  {profile.personalYear2026}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 via-white to-amber-50/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-crimson-600">
                  <Flame className="h-3.5 w-3.5" />
                  Bản Nguyên · {profile.name}
                </span>
                <span className="rounded-full bg-crimson-500/10 px-2.5 py-0.5 text-[11px] font-bold text-crimson-700">
                  Nguyên tố: {profile.element}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-ink">{profile.archetype}</h3>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-ink-muted">
                {profile.personality}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-rose-200 bg-white p-3.5">
                <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase text-crimson-600 mb-1">
                  <Briefcase className="h-3.5 w-3.5" /> Con Đường Sự Nghiệp
                </h4>
                <p className="text-xs leading-relaxed text-ink-muted">{profile.careerPath}</p>
              </div>

              <div className="rounded-xl border border-rose-200 bg-white p-3.5">
                <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase text-pink-600 mb-1">
                  <Heart className="h-3.5 w-3.5" /> Lời Khuyên Tình Duyên
                </h4>
                <p className="text-xs leading-relaxed text-ink-muted">{profile.loveAdvice}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2.5 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-ink">
                <Compass className="h-3.5 w-3.5 text-crimson-500" />
                Bộ số cát tường trọn đời:
              </span>
              <div className="flex items-center gap-2">
                {profile.luckyNumbers.map((num, idx) => (
                  <span
                    key={idx}
                    className="grid h-7 min-w-7 place-items-center rounded-full bg-crimson-500 px-2 font-display font-bold text-white shadow-sm"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
