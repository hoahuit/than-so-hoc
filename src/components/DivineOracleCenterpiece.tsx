import React from 'react';
import { TarotCardBackPattern } from './TarotCardArt';

const ZODIAC_SIGNS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

interface DivineOracleCenterpieceProps {
  isSummoning: boolean;
  isFocusedOnCard: boolean;
  parallax?: { x: number; y: number };
}

/**
 * Celestial Goddess Centerpiece with Rotating Zodiac Halo behind her head
 * and an active glowing Tarot card hovering between her summoned hands.
 */
export const DivineOracleCenterpiece: React.FC<DivineOracleCenterpieceProps> = ({
  isSummoning,
  isFocusedOnCard,
  parallax = { x: 0, y: 0 },
}) => {
  return (
    <div
      style={{ transform: `translate3d(${parallax.x * 5}px, ${parallax.y * 3}px, 0)` }}
      className="relative flex flex-col items-center justify-center transition-transform duration-200 ease-out select-none"
    >
      {/* Large Rotating Celestial Halo & Zodiac Circle Behind Her Head */}
      <div className="pointer-events-none absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2">
        <div
          className={`transition-all duration-700 ${
            isSummoning ? 'scale-110 opacity-90' : 'scale-100 opacity-65'
          }`}
        >
          <svg
            viewBox="0 0 560 560"
            className="h-[310px] w-[310px] sm:h-[440px] sm:w-[440px] lg:h-[520px] lg:w-[520px] text-[#E6BD72] animate-spin-slow"
            fill="none"
          >
            <circle cx="280" cy="280" r="262" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 6" />
            <circle cx="280" cy="280" r="240" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="280" cy="280" r="196" stroke="currentColor" strokeWidth="1" strokeDasharray="8 5" />
            <circle cx="280" cy="280" r="144" stroke="currentColor" strokeWidth="0.9" />
            <polygon points="280,26 500,408 60,408" stroke="currentColor" strokeWidth="0.85" strokeOpacity="0.65" />
            <polygon points="280,534 60,152 500,152" stroke="currentColor" strokeWidth="0.85" strokeOpacity="0.65" />

            {ZODIAC_SIGNS.map((sign, idx) => {
              const deg = idx * 30 - 90;
              const rad = (deg * Math.PI) / 180;
              const x1 = 280 + Math.cos(rad) * 196;
              const y1 = 280 + Math.sin(rad) * 196;
              const x2 = 280 + Math.cos(rad) * 240;
              const y2 = 280 + Math.sin(rad) * 240;
              const tx = 280 + Math.cos(rad + Math.PI / 12) * 218;
              const ty = 280 + Math.sin(rad + Math.PI / 12) * 218;
              return (
                <g key={sign}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.65" />
                  <text
                    x={tx}
                    y={ty}
                    fill="#FFF4E5"
                    fontSize="15"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {sign}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Divine Warm Radial Aura Behind Goddess */}
      <div
        className={`pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-[radial-gradient(circle,rgba(230,189,114,0.34)_0%,rgba(143,30,50,0.22)_46%,transparent_72%)] blur-2xl transition-all duration-700 ${
          isSummoning ? 'scale-125 opacity-100' : 'scale-100 opacity-80'
        }`}
      />

      {/* Dominant Anime-Fantasy Celestial Goddess Artwork */}
      <div
        className={`relative h-60 w-52 sm:h-76 sm:w-68 lg:h-[340px] lg:w-[290px] animate-oracle-levitate transition-transform duration-500 ${
          isFocusedOnCard ? 'translate-y-1 scale-[1.02]' : ''
        }`}
      >
        <img
          src="/images/divine-oracle.jpg"
          alt="Nữ Thần Tiên Tri Tarot"
          className="h-full w-full object-cover object-top [mask-image:radial-gradient(ellipse_78%_86%_at_50%_44%,#000_58%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_78%_86%_at_50%_44%,#000_58%,transparent_100%)] drop-shadow-[0_14px_40px_rgba(0,0,0,0.85)]"
        />

        {/* Glowing Magic Sparks at Her Hands */}
        <span
          className={`pointer-events-none absolute left-4 top-[54%] h-4 w-4 rounded-full bg-[#FFF4E5] blur-[4px] transition-all duration-500 ${
            isSummoning ? 'scale-150 opacity-100' : 'scale-100 opacity-65 animate-twinkle'
          }`}
        />
        <span
          className={`pointer-events-none absolute right-4 top-[54%] h-4 w-4 rounded-full bg-[#FFF4E5] blur-[4px] transition-all duration-500 ${
            isSummoning ? 'scale-150 opacity-100' : 'scale-100 opacity-65 animate-twinkle'
          }`}
        />

        {/* Active Summoned Glowing Tarot Card Levitating Between Her Hands */}
        <div
          className={`pointer-events-none absolute left-1/2 bottom-5 sm:bottom-7 -translate-x-1/2 transition-all duration-700 ${
            isSummoning ? 'scale-115 -translate-y-3' : 'scale-100'
          }`}
        >
          <div className="relative h-20 w-14 sm:h-24 sm:w-16 rotate-3 animate-card-bob">
            <div
              className={`absolute -inset-2 rounded-xl bg-gradient-to-tr from-[#E6BD72]/65 via-[#FFF4E5]/45 to-[#8F1E32]/50 blur-md transition-opacity ${
                isSummoning ? 'opacity-100 animate-summon-pulse' : 'opacity-75'
              }`}
            />
            <TarotCardBackPattern numeral="✦" label="DESTINY" />
          </div>
          {/* Energy Beam Linking Summoned Card Down to Altar Center */}
          <div
            className={`mx-auto mt-1 h-8 w-[2px] bg-gradient-to-b from-[#FFF4E5] via-[#E6BD72] to-transparent transition-opacity duration-500 ${
              isSummoning ? 'opacity-95' : 'opacity-50'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
