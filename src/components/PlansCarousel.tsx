import React from 'react';
import { Star, Check } from 'lucide-react';
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
    name: 'Thông Điệp 30 Ngày Tới',
    subtitle: 'May mắn nào đang đến? Khám phá bất ngờ sắp tới',
    price: '10.000đ',
    charmType: 'mini',
  },
  {
    id: 'love',
    name: 'Chuyện Tình Cảm & Duyên',
    subtitle: 'Tơ hồng se duyên, nhân duyên từ giờ tới cuối năm',
    price: '15.000đ',
    popular: true,
    charmType: 'love',
  },
  {
    id: 'destiny',
    name: 'Công Việc & Tài Chính',
    subtitle: 'Khía cạnh nào sẽ nở hoa? Định hướng vận mệnh',
    price: '20.000đ',
    charmType: 'destiny',
  },
];

interface PlansCarouselProps {
  selectedPlan: PlanType;
  isUnlocked?: boolean;
  onSelectPlan: (plan: PlanType) => void;
  onScrollToDraw: () => void;
  onOpenUnlock?: () => void;
}

const OrnateCardBorder: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 240 320"
    preserveAspectRatio="none"
    className="pointer-events-none absolute inset-1.5 h-[calc(100%-12px)] w-[calc(100%-12px)]"
    fill="none"
  >
    <path
      d="M16 2H224C226 10 230 14 238 16V304C230 306 226 310 224 318H16C14 310 10 306 2 304V16C10 14 14 10 16 2Z"
      stroke={active ? '#f3d179' : '#d6b07c'}
      strokeOpacity={active ? '0.75' : '0.7'}
      strokeWidth="1.25"
    />
  </svg>
);

const SakuraCornerCluster: React.FC = () => (
  <svg
    viewBox="0 0 72 52"
    className="pointer-events-none absolute -bottom-1.5 -right-1.5 z-20 h-12 w-16 drop-shadow-md"
    fill="none"
  >
    <g transform="translate(26,18)">
      <circle cx="0" cy="-7" r="5" fill="#fbcfe8" />
      <circle cx="7" cy="-2" r="5" fill="#f9a8d4" />
      <circle cx="4" cy="6" r="5" fill="#fbcfe8" />
      <circle cx="-4" cy="6" r="5" fill="#f9a8d4" />
      <circle cx="-7" cy="-2" r="5" fill="#fbcfe8" />
      <circle cx="0" cy="0" r="2.6" fill="#fde68a" />
    </g>
    <g transform="translate(49,30) scale(0.85)">
      <circle cx="0" cy="-7" r="5" fill="#fce7f3" />
      <circle cx="7" cy="-2" r="5" fill="#fbcfe8" />
      <circle cx="4" cy="6" r="5" fill="#f9a8d4" />
      <circle cx="-4" cy="6" r="5" fill="#fbcfe8" />
      <circle cx="-7" cy="-2" r="5" fill="#fce7f3" />
      <circle cx="0" cy="0" r="2.6" fill="#fbbf24" />
    </g>
  </svg>
);

const OmamoriCharmIcon: React.FC<{ type: 'mini' | 'love' | 'destiny'; active?: boolean }> = ({
  type,
  active,
}) => {
  if (type === 'love') {
    return (
      <div className="relative mx-auto flex h-12 w-12 items-center justify-center">
        {active && (
          <span className="pointer-events-none absolute inset-0 rounded-full bg-amber-300/35 blur-md" />
        )}
        <svg viewBox="0 0 48 52" className="relative h-11 w-11 drop-shadow-sm" fill="none">
          <path
            d="M24 26C24 26 10 17.5 10 11.5C10 7.8 13.2 5.5 16.8 6.8C19.6 7.8 22 10.5 24 13.5C26 10.5 28.4 7.8 31.2 6.8C34.8 5.5 38 7.8 38 11.5C38 17.5 24 26 24 26Z"
            stroke={active ? '#fde7b0' : '#b45309'}
            strokeWidth="2.1"
            fill={active ? 'rgba(253,231,176,0.16)' : '#fff7eb'}
          />
          <path
            d="M24 27C24 27 16 33 17.5 39C18.8 43 22 42.5 24 38.5C26 42.5 29.2 43 30.5 39C32 33 24 27 24 27Z"
            stroke={active ? '#f3d179' : '#b45309'}
            strokeWidth="1.9"
          />
          <circle cx="24" cy="17" r="3" fill={active ? '#fde7b0' : '#d97706'} />
        </svg>
      </div>
    );
  }

  if (type === 'destiny') {
    return (
      <div className="relative mx-auto flex h-12 w-12 items-center justify-center">
        {active && (
          <span className="pointer-events-none absolute inset-0 rounded-full bg-amber-300/35 blur-md" />
        )}
        <svg viewBox="0 0 48 48" className="relative h-11 w-11 drop-shadow-sm" fill="none">
          <rect
            x="9"
            y="14"
            width="30"
            height="24"
            rx="5"
            fill={active ? 'rgba(253,231,176,0.16)' : '#fff7eb'}
            stroke={active ? '#fde7b0' : '#b45309'}
            strokeWidth="2"
          />
          <path
            d="M14 14V11C14 8.5 16 7 18.5 7H29.5C32 7 34 8.5 34 11V14"
            stroke={active ? '#f3d179' : '#b45309'}
            strokeWidth="1.8"
          />
          <rect
            x="27"
            y="22"
            width="13"
            height="8"
            rx="3"
            fill={active ? '#fde7b0' : '#fef3c7'}
            stroke={active ? '#fde7b0' : '#b45309'}
            strokeWidth="1.6"
          />
          <circle cx="31" cy="26" r="1.4" fill={active ? '#4f0c11' : '#b45309'} />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex h-12 w-12 items-center justify-center">
      {active && (
        <span className="pointer-events-none absolute inset-0 rounded-full bg-amber-300/35 blur-md" />
      )}
      <svg viewBox="0 0 48 54" className="relative h-11 w-11 drop-shadow-sm" fill="none">
        <circle cx="24" cy="7" r="4" stroke={active ? '#fde7b0' : '#b45309'} strokeWidth="1.8" />
        <path
          d="M15 13H33L36 22V43C36 45.5 34 47 31.5 47H16.5C14 47 12 45.5 12 43V22L15 13Z"
          fill={active ? 'rgba(253,231,176,0.16)' : '#fff7eb'}
          stroke={active ? '#fde7b0' : '#b45309'}
          strokeWidth="1.9"
        />
        <path
          d="M24 36C24 36 18 32 18 28C18 26 19.6 24.6 21.3 24.6C22.5 24.6 23.4 25.3 24 26.3C24.6 25.3 25.5 24.6 26.7 24.6C28.4 24.6 30 26 30 28C30 32 24 36 24 36Z"
          fill={active ? '#fde7b0' : '#d97706'}
        />
      </svg>
    </div>
  );
};

export const PlansCarousel: React.FC<PlansCarouselProps> = ({
  selectedPlan,
  isUnlocked = false,
  onSelectPlan,
  onScrollToDraw,
  onOpenUnlock,
}) => {
  const handleSelect = (plan: PlanType) => {
    shrineAudio.playShrineBell();
    onSelectPlan(plan);
    if (!isUnlocked && onOpenUnlock) {
      onOpenUnlock();
    } else {
      onScrollToDraw();
    }
  };

  return (
    <section id="plans-section" className="relative scroll-mt-24 flex flex-col justify-center">
      {/* Ornate Header + Subtitle */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px max-w-[60px] flex-1 bg-gradient-to-r from-transparent to-[#c6973c]" />
          <span className="h-2 w-2 rotate-45 bg-[#7a1218]" />
          <h2 className="font-serif text-xl sm:text-2xl font-black tracking-tight text-[#581016]">
            Chọn Ý Nguyện Xin Xăm
          </h2>
          <span className="h-2 w-2 rotate-45 bg-[#7a1218]" />
          <span className="h-px max-w-[60px] flex-1 bg-gradient-to-l from-transparent to-[#c6973c]" />
        </div>
        <p className="mt-1 text-[11px] sm:text-xs text-[#735249]">
          Lựa chọn chủ đề bạn muốn cầu xin và khám phá lời dẫn từ Thần Số
        </p>
      </div>

      {/* Responsive 3-Card Container (Mobile Swipe / Tablet & Desktop 3-Col Grid) */}
      <div className="w-full overflow-hidden">
        <div className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-1 pb-5 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:items-stretch sm:gap-3.5 sm:overflow-visible sm:px-0">
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => handleSelect(plan.id)}
                className={`group relative w-[78%] shrink-0 snap-center cursor-pointer rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.985] sm:w-auto flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#82151c] via-[#660e15] to-[#43070c] text-white border-2 border-[#e5c16c] shadow-[0_18px_42px_-10px_rgba(95,12,18,0.52),0_0_24px_rgba(229,193,108,0.22)] sm:scale-[1.03] z-10'
                    : 'bg-gradient-to-b from-[#fffdfa] to-[#faf1e3] text-[#3d1a15] border border-[#dfc5a4] shadow-[0_10px_28px_-10px_rgba(120,75,40,0.16)] hover:border-[#cfa03b] hover:shadow-[0_16px_34px_-10px_rgba(130,30,22,0.18)]'
                }`}
              >
                {/* Champagne Gold Notched Filigree Border */}
                <OrnateCardBorder active={isSelected} />

                {/* Gold Featured Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-[#fff2c6] bg-gradient-to-r from-[#f8e1a0] via-[#ebc464] to-[#d69f38] px-3 py-0.5 text-[10.5px] font-extrabold text-[#4a120a] shadow-md">
                    <Star className="h-3 w-3 fill-[#4a120a] text-[#4a120a]" />
                    <span>Nhiều người chọn</span>
                  </div>
                )}

                {/* Delicate Sakura Corner on Selected Card */}
                {isSelected && <SakuraCornerCluster />}

                <div className="relative z-10 pt-2">
                  <div className="mb-2 transition-transform duration-300 group-hover:scale-110">
                    <OmamoriCharmIcon type={plan.charmType} active={isSelected} />
                  </div>

                  <h3
                    className={`font-serif text-[15px] sm:text-base font-bold leading-snug ${
                      isSelected ? 'text-amber-50' : 'text-[#581016]'
                    }`}
                  >
                    {plan.name}
                  </h3>

                  <p
                    className={`mx-auto mt-1.5 min-h-[2.4rem] text-[11px] leading-snug ${
                      isSelected ? 'text-amber-100/90' : 'text-[#735249]'
                    }`}
                  >
                    {plan.subtitle}
                  </p>

                  <div
                    className={`my-2.5 font-display text-xl font-black ${
                      isSelected ? 'text-[#fde7b0]' : 'text-[#8b2a18]'
                    }`}
                  >
                    {plan.price}
                  </div>
                </div>

                <button
                  type="button"
                  className={`relative z-10 mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-xs font-extrabold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#fae4a6] via-[#f1ca69] to-[#dfab42] text-[#4a120a] shadow-md hover:brightness-105'
                      : 'border border-[#d6b07c] bg-white text-[#581016] hover:bg-[#781218] hover:text-amber-50 hover:border-[#781218]'
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  <span>{isSelected ? 'Đang chọn' : 'Chọn gói này'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
