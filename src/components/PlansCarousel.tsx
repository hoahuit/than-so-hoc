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
    name: 'Xăm Toàn Cảnh',
    subtitle: 'Quẻ tổng quan nhanh & thông điệp bất ngờ',
    price: '10.000đ',
    charmType: 'mini',
  },
  {
    id: 'love',
    name: 'Xăm Tình Duyên',
    subtitle: 'Quẻ tơ hồng, nhân duyên & đào hoa',
    price: '15.000đ',
    popular: true,
    charmType: 'love',
  },
  {
    id: 'destiny',
    name: 'Xăm Vận Mệnh',
    subtitle: 'Giải mã thần số học & công danh tài lộc',
    price: '20.000đ',
    charmType: 'destiny',
  },
];

interface PlansCarouselProps {
  selectedPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  onScrollToDraw: () => void;
}

const OmamoriCharmIcon: React.FC<{ type: 'mini' | 'love' | 'destiny'; active?: boolean }> = ({
  type,
  active,
}) => {
  if (type === 'love') {
    return (
      <svg viewBox="0 0 48 52" className="mx-auto h-11 w-11 drop-shadow-sm" fill="none">
        <path
          d="M24 3C21 3 19 5.5 19 8.5C19 10.5 21 12 24 12C27 12 29 10.5 29 8.5C29 5.5 27 3 24 3Z"
          stroke={active ? '#fde7b0' : '#8b2a18'}
          strokeWidth="2.2"
        />
        <path
          d="M24 27C24 27 12 19 12 13C12 9.5 15 7.5 18 8.5C20.5 9.3 22.5 11.5 24 14C25.5 11.5 27.5 9.3 30 8.5C33 7.5 36 9.5 36 13C36 19 24 27 24 27Z"
          fill={active ? '#ffffff' : '#faeee9'}
          stroke={active ? '#fde7b0' : '#a33a24'}
          strokeWidth="2"
        />
        <path
          d="M24 29C24 29 14 35 16 42C17.5 46 21.5 46 24 41C26.5 46 30.5 46 32 42C34 35 24 29 24 29Z"
          stroke={active ? '#fde7b0' : '#8b2a18'}
          strokeWidth="2"
          fill="none"
        />
      </svg>
    );
  }

  if (type === 'destiny') {
    return (
      <svg viewBox="0 0 48 54" className="mx-auto h-11 w-11 drop-shadow-sm" fill="none">
        <circle cx="24" cy="7" r="4.5" stroke="#cba135" strokeWidth="2" />
        <path
          d="M15 13H33L37 22V44C37 46.5 35 48 32.5 48H15.5C13 48 11 46.5 11 44V22L15 13Z"
          fill="#3d0e08"
          stroke="#dfb84b"
          strokeWidth="2"
        />
        <path
          d="M26.5 24.5C23 24.5 20.5 27.3 20.5 31C20.5 34.7 23 37.5 26.5 37.5C27.9 37.5 29.2 37 30.2 36.2C26.5 36 24.5 33.8 24.5 31C24.5 28.2 26.5 26 30.2 25.8C29.2 25 27.9 24.5 26.5 24.5Z"
          fill="#fde7b0"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 54" className="mx-auto h-11 w-11 drop-shadow-sm" fill="none">
      <circle cx="24" cy="7" r="4.5" stroke="#8b2a18" strokeWidth="2" />
      <path
        d="M15 13H33L37 22V44C37 46.5 35 48 32.5 48H15.5C13 48 11 46.5 11 44V22L15 13Z"
        fill="#faeee9"
        stroke="#8b2a18"
        strokeWidth="2"
      />
      <path
        d="M24 37C24 37 17.5 32.8 17.5 28.5C17.5 26.3 19.2 24.8 21.1 24.8C22.4 24.8 23.4 25.5 24 26.6C24.6 25.5 25.6 24.8 26.9 24.8C28.8 24.8 30.5 26.3 30.5 28.5C30.5 32.8 24 37 24 37Z"
        fill="#cb6d53"
      />
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
      {/* Title */}
      <div className="mb-5 flex items-center justify-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-temple-300 to-temple-400" />
        <span className="h-1.5 w-1.5 rotate-45 bg-temple-700" />
        <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-temple-900">
          Chọn Ý Nguyện Xin Xăm
        </h2>
        <span className="h-1.5 w-1.5 rotate-45 bg-temple-700" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-temple-300 to-temple-400" />
      </div>

      {/* 3-Card Row */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-3 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isFeatured = Boolean(plan.popular);

          return (
            <div
              key={plan.id}
              onClick={() => handleSelect(plan.id)}
              className={`group relative w-[76%] shrink-0 snap-center cursor-pointer rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 sm:w-auto flex flex-col justify-between ${
                isFeatured
                  ? 'washi-card-featured text-white scale-[1.02]'
                  : 'washi-card text-ink hover:border-temple-600 hover:shadow-temple-hover'
              } ${
                isSelected && !isFeatured
                  ? 'ring-2 ring-temple-700 border-temple-700 shadow-temple-hover'
                  : ''
              } ${isSelected && isFeatured ? 'ring-2 ring-brass-300' : ''}`}
            >
              {/* Inner Decorative Frame */}
              <div
                className={`pointer-events-none absolute inset-1.5 rounded-xl border ${
                  isFeatured ? 'border-white/20' : 'border-temple-200/70'
                }`}
              />

              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-brass-300 bg-[#3d0e08] px-3 py-0.5 text-[11px] font-bold text-brass-200 shadow-md">
                  <Crown className="h-3 w-3 text-brass-300 fill-brass-300" />
                  <span>Nhiều người chọn</span>
                </div>
              )}

              <div className="relative z-10 pt-2">
                <div className="mb-2.5 transition-transform duration-300 group-hover:scale-110">
                  <OmamoriCharmIcon type={plan.charmType} active={isFeatured} />
                </div>

                <h3
                  className={`font-display text-base font-bold ${
                    isFeatured ? 'text-white' : 'text-temple-900'
                  }`}
                >
                  {plan.name}
                </h3>

                <p
                  className={`mx-auto mt-1 min-h-[2.4rem] text-[11.5px] leading-snug ${
                    isFeatured ? 'text-white/90' : 'text-ink-muted'
                  }`}
                >
                  {plan.subtitle}
                </p>

                <div
                  className={`my-2 font-display text-xl font-black ${
                    isFeatured ? 'text-brass-200' : 'text-temple-800'
                  }`}
                >
                  {plan.price}
                </div>
              </div>

              <button
                type="button"
                className={`relative z-10 mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-all ${
                  isFeatured
                    ? isSelected
                      ? 'bg-white text-temple-900 shadow-md'
                      : 'bg-brass-100 text-temple-950 hover:bg-white'
                    : isSelected
                      ? 'bg-temple-800 text-white shadow-temple-red'
                      : 'border border-temple-300 bg-white/90 text-temple-900 hover:bg-temple-800 hover:text-white hover:border-temple-800'
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                <span>{isSelected ? 'Đang chọn' : 'Chọn gói này'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
