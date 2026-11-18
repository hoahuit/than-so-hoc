import React from 'react';
import { Crown, Check } from 'lucide-react';
import type { PlanType } from '../data/omikujiData';
import { shrineAudio } from '../utils/sound';

interface PlanItem {
  id: PlanType;
  name: string;
  subtitle: string;
  price: string;
  popular?: boolean;
  charmType: 'mini' | 'love' | 'destiny';
}

const PLANS: PlanItem[] = [
  {
    id: 'mini',
    name: 'Mini Fortune',
    subtitle: 'Quẻ tổng quan nhanh & bất ngờ',
    price: '10.000đ',
    charmType: 'mini',
  },
  {
    id: 'love',
    name: 'Love Fortune',
    subtitle: 'Quẻ tình duyên & mối quan hệ',
    price: '15.000đ',
    popular: true,
    charmType: 'love',
  },
  {
    id: 'destiny',
    name: 'Destiny Fortune',
    subtitle: 'Giải mã thần số học & định hướng vận mệnh',
    price: '20.000đ',
    charmType: 'destiny',
  },
];

interface PlansCarouselProps {
  selectedPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  onScrollToDraw: () => void;
}

// Cute Japanese Omamori Charm SVGs matching the concept mockup
const OmamoriCharmIcon: React.FC<{ type: 'mini' | 'love' | 'destiny'; active?: boolean }> = ({
  type,
  active,
}) => {
  if (type === 'love') {
    return (
      <svg viewBox="0 0 48 52" className="mx-auto h-11 w-11 drop-shadow-sm" fill="none">
        <path
          d="M24 3C21 3 19 5.5 19 8.5C19 10.5 21 12 24 12C27 12 29 10.5 29 8.5C29 5.5 27 3 24 3Z"
          stroke={active ? '#fde68a' : '#e85366'}
          strokeWidth="2.2"
        />
        <path
          d="M24 27C24 27 12 19 12 13C12 9.5 15 7.5 18 8.5C20.5 9.3 22.5 11.5 24 14C25.5 11.5 27.5 9.3 30 8.5C33 7.5 36 9.5 36 13C36 19 24 27 24 27Z"
          fill={active ? '#fff1f2' : '#ffe4e6'}
          stroke={active ? '#fde68a' : '#d43c50'}
          strokeWidth="2"
        />
        <path
          d="M24 29C24 29 14 35 16 42C17.5 46 21.5 46 24 41C26.5 46 30.5 46 32 42C34 35 24 29 24 29Z"
          stroke={active ? '#fde68a' : '#e85366'}
          strokeWidth="2"
          fill="none"
        />
      </svg>
    );
  }

  if (type === 'destiny') {
    return (
      <svg viewBox="0 0 48 54" className="mx-auto h-11 w-11 drop-shadow-sm" fill="none">
        <circle cx="24" cy="7" r="4.5" stroke="#c99746" strokeWidth="2" />
        <path
          d="M15 13H33L37 22V44C37 46.5 35 48 32.5 48H15.5C13 48 11 46.5 11 44V22L15 13Z"
          fill="#56222c"
          stroke="#e5b869"
          strokeWidth="2"
        />
        <path
          d="M26.5 24.5C23 24.5 20.5 27.3 20.5 31C20.5 34.7 23 37.5 26.5 37.5C27.9 37.5 29.2 37 30.2 36.2C26.5 36 24.5 33.8 24.5 31C24.5 28.2 26.5 26 30.2 25.8C29.2 25 27.9 24.5 26.5 24.5Z"
          fill="#fde68a"
        />
        <circle cx="29" cy="29" r="1.4" fill="#fda4af" />
        <circle cx="19" cy="24" r="1.2" fill="#fde68a" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 54" className="mx-auto h-11 w-11 drop-shadow-sm" fill="none">
      <circle cx="24" cy="7" r="4.5" stroke="#e85366" strokeWidth="2" />
      <path
        d="M15 13H33L37 22V44C37 46.5 35 48 32.5 48H15.5C13 48 11 46.5 11 44V22L15 13Z"
        fill="#fff1f2"
        stroke="#e85366"
        strokeWidth="2"
      />
      <path
        d="M24 37C24 37 17.5 32.8 17.5 28.5C17.5 26.3 19.2 24.8 21.1 24.8C22.4 24.8 23.4 25.5 24 26.6C24.6 25.5 25.6 24.8 26.9 24.8C28.8 24.8 30.5 26.3 30.5 28.5C30.5 32.8 24 37 24 37Z"
        fill="#fb7185"
      />
      <path d="M16 18H32" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const PlansCarousel: React.FC<PlansCarouselProps> = ({
  selectedPlan,
  onSelectPlan,
  onScrollToDraw,
}) => {
  const handleSelect = (plan: PlanType) => {
    shrineAudio.playShrineBell();
    onSelectPlan(plan);
    onScrollToDraw();
  };

  return (
    <section id="plans-section" className="relative scroll-mt-24 flex flex-col justify-center">
      {/* Refined Centered Title with Diamond Dividers (matching mockup) */}
      <div className="mb-6 flex items-center justify-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-rose-300 to-rose-300" />
        <span className="h-1.5 w-1.5 rotate-45 bg-crimson-400" />
        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink">
          Chọn gói trải nghiệm
        </h2>
        <span className="h-1.5 w-1.5 rotate-45 bg-crimson-400" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-rose-300 to-rose-300" />
      </div>

      {/* Horizontal Swipe on Mobile, Clean 3-Card Row on Desktop */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-3 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3.5 sm:overflow-visible sm:px-0">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isFeatured = Boolean(plan.popular);

          return (
            <div
              key={plan.id}
              onClick={() => handleSelect(plan.id)}
              className={`group relative w-[74%] shrink-0 snap-center cursor-pointer rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1.5 sm:w-auto flex flex-col justify-between ${
                isFeatured
                  ? 'washi-card-featured text-white scale-[1.02]'
                  : 'washi-card text-ink hover:border-crimson-400 hover:shadow-washi-hover'
              } ${
                isSelected && !isFeatured
                  ? 'ring-2 ring-crimson-400 border-crimson-400 shadow-washi-hover'
                  : ''
              } ${isSelected && isFeatured ? 'ring-2 ring-amber-300/90' : ''}`}
            >
              {/* Decorative Inner Frame */}
              <div
                className={`pointer-events-none absolute inset-1.5 rounded-xl border ${
                  isFeatured ? 'border-white/25' : 'border-rose-200/70'
                }`}
              />

              {/* Popular Badge on top */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-amber-200 bg-gradient-to-r from-[#5d1a26] to-[#7c2231] px-3 py-0.5 text-[11px] font-bold text-amber-200 shadow-md">
                  <Crown className="h-3 w-3 text-amber-300 fill-amber-300" />
                  <span>Phổ biến</span>
                </div>
              )}

              <div className="relative z-10 pt-2">
                {/* Omamori Charm Icon */}
                <div className="mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <OmamoriCharmIcon type={plan.charmType} active={isFeatured} />
                </div>

                {/* Plan Name */}
                <h3
                  className={`font-display text-base sm:text-[17px] font-bold ${
                    isFeatured ? 'text-white' : 'text-ink'
                  }`}
                >
                  {plan.name}
                </h3>

                {/* Subtitle */}
                <p
                  className={`mx-auto mt-1 min-h-[2.6rem] text-[11.5px] leading-snug ${
                    isFeatured ? 'text-rose-50/90' : 'text-ink-muted'
                  }`}
                >
                  {plan.subtitle}
                </p>

                {/* Price */}
                <div
                  className={`my-3 font-display text-xl sm:text-2xl font-extrabold ${
                    isFeatured ? 'text-amber-100' : 'text-crimson-600'
                  }`}
                >
                  {plan.price}
                </div>
              </div>

              {/* Pill CTA Button */}
              <button
                type="button"
                className={`relative z-10 mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-all ${
                  isFeatured
                    ? isSelected
                      ? 'bg-white text-crimson-700 shadow-md'
                      : 'bg-amber-100/95 text-crimson-800 hover:bg-white'
                    : isSelected
                      ? 'bg-crimson-500 text-white shadow-coral-glow'
                      : 'border border-rose-300 bg-white/90 text-crimson-700 hover:bg-crimson-500 hover:text-white hover:border-crimson-500'
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                <span>{isSelected ? 'Đã chọn' : 'Chọn gói'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Mobile Swipe Hint */}
      <p className="mt-1 text-center text-[11px] text-ink-light sm:hidden">
        ← Vuốt ngang để xem các gói quẻ →
      </p>
    </section>
  );
};
