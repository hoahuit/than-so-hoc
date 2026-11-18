import React from 'react';

interface FloatingBottomNavProps {
  activeTab: 'home' | 'plans' | 'numerology' | 'saved';
  onHome: () => void;
  onPlans: () => void;
  onQuickDraw: () => void;
  onNumerology: () => void;
  onSaved: () => void;
  savedCount: number;
}

export const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({
  activeTab,
  onHome,
  onPlans,
  onQuickDraw,
  onNumerology,
  onSaved,
  savedCount,
}) => {
  return (
    <nav
      aria-label="Điều hướng di động"
      className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 items-end rounded-2xl border border-rose-200 bg-white/95 px-2 py-2 shadow-[0_10px_30px_rgba(181,43,63,0.2)] backdrop-blur-md md:hidden"
    >
      <button
        onClick={onHome}
        className={`flex flex-col items-center gap-0.5 py-0.5 text-[10px] font-semibold transition-colors ${
          activeTab === 'home' ? 'text-crimson-600' : 'text-ink-muted'
        }`}
      >
        <span className="font-jp text-base font-bold leading-none">家</span>
        <span>Trang chủ</span>
      </button>

      <button
        onClick={onPlans}
        className={`flex flex-col items-center gap-0.5 py-0.5 text-[10px] font-semibold transition-colors ${
          activeTab === 'plans' ? 'text-crimson-600' : 'text-ink-muted'
        }`}
      >
        <span className="font-jp text-base font-bold leading-none">吉</span>
        <span>Gói quẻ</span>
      </button>

      {/* Center Lively Soft-Red Circular Button "籤" */}
      <div className="flex flex-col items-center">
        <button
          onClick={onQuickDraw}
          aria-label="Rút quẻ Omikuji nhanh"
          className="relative -mt-9 grid h-14 w-14 place-items-center rounded-full border-4 border-[#fff9f7] bg-gradient-to-b from-[#f06475] via-[#e24558] to-[#c93347] font-jp text-2xl font-black text-amber-50 shadow-coral-glow active:scale-95 transition-transform"
        >
          <span>籤</span>
          <span className="pointer-events-none absolute -inset-1 rounded-full border border-crimson-400/50 animate-ping opacity-30" />
        </button>
        <span className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wider text-crimson-600">
          Rút quẻ
        </span>
      </div>

      <button
        onClick={onNumerology}
        className={`flex flex-col items-center gap-0.5 py-0.5 text-[10px] font-semibold transition-colors ${
          activeTab === 'numerology' ? 'text-crimson-600' : 'text-ink-muted'
        }`}
      >
        <span className="font-jp text-base font-bold leading-none">数</span>
        <span>Thần số</span>
      </button>

      <button
        onClick={onSaved}
        className={`relative flex flex-col items-center gap-0.5 py-0.5 text-[10px] font-semibold transition-colors ${
          activeTab === 'saved' ? 'text-crimson-600' : 'text-ink-muted'
        }`}
      >
        <span className="font-jp text-base font-bold leading-none">蔵</span>
        <span>Đã lưu</span>
        {savedCount > 0 && (
          <span className="absolute right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-crimson-500 px-1 text-[9px] font-bold text-white">
            {savedCount}
          </span>
        )}
      </button>
    </nav>
  );
};
