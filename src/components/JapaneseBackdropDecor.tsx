import React from 'react';

const FLOATING_PETALS = [
  { left: '8%', top: '18%', delay: '0s', duration: '9s', size: 'h-2.5 w-2.5' },
  { left: '24%', top: '12%', delay: '1.8s', duration: '11s', size: 'h-2 w-2' },
  { left: '48%', top: '22%', delay: '3.2s', duration: '10s', size: 'h-2.5 w-2.5' },
  { left: '72%', top: '14%', delay: '0.9s', duration: '12s', size: 'h-2 w-2' },
  { left: '89%', top: '26%', delay: '2.5s', duration: '9.5s', size: 'h-3 w-3' },
];

/**
 * Lightweight, low-opacity Japanese background decorations (sakura branches,
 * subtle Seigaiha wave aura, golden clouds, distant mountains, and drifting petals).
 */
export const JapaneseBackdropDecor: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Subtle Japanese Seigaiha Wave Texture */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 100%, transparent 18px, #8b2a18 19px, #8b2a18 20px, transparent 21px, transparent 30px, #c6973c 31px, #c6973c 32px, transparent 33px)',
          backgroundSize: '64px 32px',
        }}
      />

      {/* Top-Left Sakura Branch */}
      <svg
        viewBox="0 0 260 150"
        className="absolute -left-6 -top-2 h-28 w-48 sm:h-36 sm:w-64 text-[#6e2c22] opacity-80"
        fill="none"
      >
        <path
          d="M-8 14C42 22 92 40 148 76M54 32C82 18 106 14 134 16M98 48C118 68 142 84 176 92"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {[
          [42, 24, 1],
          [78, 36, 0.9],
          [116, 22, 0.85],
          [134, 62, 1.05],
          [168, 86, 0.8],
          [26, 46, 0.75],
        ].map(([cx, cy, s], i) => (
          <g key={i} transform={`translate(${cx},${cy}) scale(${s})`}>
            <circle cx="0" cy="-7" r="5" fill="#fbcfe8" />
            <circle cx="7" cy="-2" r="5" fill="#f9a8d4" />
            <circle cx="4" cy="6" r="5" fill="#fce7f3" />
            <circle cx="-4" cy="6" r="5" fill="#fbcfe8" />
            <circle cx="-7" cy="-2" r="5" fill="#f9a8d4" />
            <circle cx="0" cy="0" r="2.3" fill="#f59e0b" />
          </g>
        ))}
      </svg>

      {/* Top-Right Sakura Branch */}
      <svg
        viewBox="0 0 260 150"
        className="absolute -right-6 -top-2 h-28 w-48 sm:h-36 sm:w-64 -scale-x-100 text-[#6e2c22] opacity-80"
        fill="none"
      >
        <path
          d="M-8 14C42 22 92 40 148 76M54 32C82 18 106 14 134 16M98 48C118 68 142 84 176 92"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {[
          [42, 24, 1],
          [78, 36, 0.9],
          [116, 22, 0.85],
          [134, 62, 1.05],
          [168, 86, 0.8],
        ].map(([cx, cy, s], i) => (
          <g key={i} transform={`translate(${cx},${cy}) scale(${s})`}>
            <circle cx="0" cy="-7" r="5" fill="#fbcfe8" />
            <circle cx="7" cy="-2" r="5" fill="#f9a8d4" />
            <circle cx="4" cy="6" r="5" fill="#fce7f3" />
            <circle cx="-4" cy="6" r="5" fill="#fbcfe8" />
            <circle cx="-7" cy="-2" r="5" fill="#f9a8d4" />
            <circle cx="0" cy="0" r="2.3" fill="#f59e0b" />
          </g>
        ))}
      </svg>

      {/* Soft Distant Mountain Silhouettes Fading Into Next Section */}
      <svg
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-28 sm:h-40 w-full text-[#dec19b]/30"
        fill="currentColor"
      >
        <path d="M0 180V110C180 58 340 82 520 120C700 158 880 44 1080 76C1240 102 1350 92 1440 72V180H0Z" />
        <path
          d="M0 180V138C220 96 420 145 640 128C860 110 1080 150 1440 118V180H0Z"
          fill="#cfa03b"
          fillOpacity="0.1"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[#fbf4e7]" />

      {/* Lightweight Floating Sakura Petals */}
      {FLOATING_PETALS.map((p, idx) => (
        <span
          key={idx}
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
          className={`absolute ${p.size} rounded-tl-full rounded-br-full bg-gradient-to-br from-rose-200 to-pink-300/80 opacity-60 animate-petal-drift`}
        />
      ))}
    </div>
  );
};
