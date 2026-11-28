import React from 'react';

const CELESTIAL_MOTES = [
  { left: '18%', top: '26%', delay: '0s', size: 'h-1.5 w-1.5' },
  { left: '33%', top: '42%', delay: '1.1s', size: 'h-1 w-1' },
  { left: '46%', top: '18%', delay: '0.5s', size: 'h-1.5 w-1.5' },
  { left: '55%', top: '22%', delay: '1.4s', size: 'h-1.5 w-1.5' },
  { left: '68%', top: '38%', delay: '0.3s', size: 'h-1 w-1' },
  { left: '82%', top: '28%', delay: '1.8s', size: 'h-1.5 w-1.5' },
];

const PETALS = [
  { left: '10%', top: '12%', delay: '0s', dur: '11s' },
  { left: '28%', top: '8%', delay: '2.1s', dur: '12.5s' },
  { left: '52%', top: '6%', delay: '1.0s', dur: '11.5s' },
  { left: '72%', top: '10%', delay: '3.0s', dur: '10.5s' },
  { left: '90%', top: '12%', delay: '1.6s', dur: '12s' },
];

const CornerSakuraBranch: React.FC<{ flip?: boolean }> = ({ flip = false }) => (
  <svg
    viewBox="0 0 260 140"
    className={`pointer-events-none absolute top-0 z-10 h-24 w-44 sm:h-32 sm:w-56 opacity-80 ${
      flip ? 'right-0 -scale-x-100' : 'left-0'
    }`}
    fill="none"
  >
    <path
      d="M-10 12C48 22 104 42 158 76M58 30C88 18 118 14 146 18M104 48C128 66 154 80 186 90"
      stroke="#6e2c22"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {[
      [38, 22, 1.0],
      [78, 36, 0.9],
      [118, 22, 0.85],
      [140, 62, 1.05],
      [172, 84, 0.8],
    ].map(([cx, cy, s], i) => (
      <g key={i} transform={`translate(${cx},${cy}) scale(${s})`}>
        <circle cx="0" cy="-7" r="5" fill="#fbcfe8" />
        <circle cx="7" cy="-2" r="5" fill="#f9a8d4" />
        <circle cx="4" cy="6" r="5" fill="#fff5f7" />
        <circle cx="-4" cy="6" r="5" fill="#fbcfe8" />
        <circle cx="-7" cy="-2" r="5" fill="#f9a8d4" />
        <circle cx="0" cy="0" r="2.1" fill="#E6BD72" />
      </g>
    ))}
  </svg>
);

interface TarotAltarDecorProps {
  parallax?: { x: number; y: number };
  isSummoning?: boolean;
}

/**
 * Seamless Warm Ivory-Cream & Burgundy-Gold Tarot Sanctuary matching the section above,
 * featuring ONLY the sharp celestial Goddess + golden halo with all dark outer background removed.
 */
export const TarotAltarDecor: React.FC<TarotAltarDecorProps> = ({
  parallax = { x: 0, y: 0 },
  isSummoning = false,
}) => {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {/* Seamless Warm Ivory-Cream Base matching <main> above */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fbf4e7] via-[#fbf4e7] to-[#f4e5d3]" />

      {/* Subtle Japanese Seigaiha Wave Texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 100%, transparent 18px, #8b2a18 19px, #8b2a18 20px, transparent 21px, transparent 30px, #c6973c 31px, #c6973c 32px, transparent 33px)',
          backgroundSize: '64px 32px',
        }}
      />

      {/* Desktop/Large Tablet (lg+): Centered Goddess in Upper Stage between Left & Right Panels */}
      <div
        style={{
          transform: `translate3d(${parallax.x * -6}px, ${parallax.y * -4}px, 0)`,
        }}
        className="hidden lg:flex absolute inset-x-0 top-6 justify-center transition-transform duration-300 ease-out"
      >
        <div
          className="relative h-[510px] w-full max-w-[740px] animate-oracle-levitate"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          <img
            src="/images/divine-oracle-ivory.jpg"
            alt=""
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 6%, black 80%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 6%, black 80%, transparent 100%)',
            }}
            className="h-full w-full object-contain object-center"
          />

          <div
            className={`absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,244,229,0.65)_0%,rgba(230,189,114,0.32)_48%,transparent_75%)] blur-xl transition-all duration-500 ${
              isSummoning ? 'scale-125 opacity-100 animate-summon-pulse' : 'scale-100 opacity-60 animate-halo-pulse'
            }`}
          />
        </div>
      </div>

      {/* Subtle Corner Cherry Blossom Branches */}
      <CornerSakuraBranch />
      <CornerSakuraBranch flip />

      {/* Soft Distant Mountain Mist at Bottom */}
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-24 sm:h-36 w-full text-[#d8b892]/30"
        fill="currentColor"
      >
        <path d="M0 160V96C190 52 360 76 540 110C720 144 900 42 1100 72C1250 96 1360 88 1440 68V160H0Z" />
      </svg>

      {/* Golden Celestial Particles */}
      {CELESTIAL_MOTES.map((m, i) => (
        <span
          key={i}
          style={{ left: m.left, top: m.top, animationDelay: m.delay }}
          className={`absolute ${m.size} rounded-full bg-[#e5b95c] shadow-[0_0_8px_#E6BD72] animate-twinkle`}
        />
      ))}

      {/* Floating Cherry Blossom Petals */}
      {PETALS.map((p, i) => (
        <span
          key={i}
          style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.dur }}
          className="absolute h-2.5 w-2.5 rounded-tl-full rounded-br-full bg-gradient-to-br from-[#F4B7C5] to-[#fbcfe8] opacity-70 animate-petal-drift"
        />
      ))}
    </div>
  );
};
