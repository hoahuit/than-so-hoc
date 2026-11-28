import React, { useState } from 'react';

interface TarotCardArtProps {
  cardId: number;
  accentHex: string;
  compact?: boolean;
  cardName?: string;
}

export function getTarotImageUrl(cardId: number): string {
  return `/images/tarot/${String(cardId).padStart(2, '0')}.png`;
}

/**
 * Renders the authentic 1910 Rider-Waite-Smith Tarot card artwork with SVG fallback.
 */
export const RiderWaiteCardFace: React.FC<{
  cardId: number;
  cardName: string;
  accentHex: string;
  isReversed?: boolean;
}> = ({ cardId, cardName, accentHex, isReversed = false }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-[#cba135] bg-[#fffaf0] p-2 text-center">
        <div className={isReversed ? 'rotate-180' : ''}>
          <TarotCardArt cardId={cardId} accentHex={accentHex} compact />
        </div>
        <span className="mt-1 text-[9px] font-bold uppercase text-[#5a120c]">{cardName}</span>
      </div>
    );
  }

  return (
    <img
      src={getTarotImageUrl(cardId)}
      alt={cardName}
      loading="lazy"
      onError={() => setImgError(true)}
      className={`h-full w-full rounded-[6px] sm:rounded-[9px] bg-[#f4efe3] object-contain transition-transform ${
        isReversed ? 'rotate-180' : ''
      }`}
    />
  );
};

/**
 * Renders fallback gold-engraved Major Arcana Tarot iconography for cards 0–21.
 */
export const TarotCardArt: React.FC<TarotCardArtProps> = ({ cardId, accentHex, compact = false }) => {
  const renderSymbol = () => {
    switch (cardId) {
      case 0: // The Fool: Rising sun, cliff peak & feather
        return (
          <>
            <circle cx="56" cy="24" r="9" stroke="#d97706" strokeWidth="1.6" />
            <path d="M56 10v4M56 34v4M42 24h4M66 24h4M46 14l3 3M63 31l3 3M66 14l-3 3M49 31l-3 3" stroke="#d97706" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M12 68L34 42L48 56L68 38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 22c8-2 14 2 16 10c-8-1-13-4-16-10Z" fill={accentHex} fillOpacity="0.22" stroke={accentHex} strokeWidth="1.5" />
          </>
        );
      case 1: // The Magician
        return (
          <>
            <path d="M26 24c0-5 7-7 14 0c7 7 14 5 14 0c0-5-7-7-14 0c-7 7-14 5-14 0Z" stroke="#d97706" strokeWidth="1.8" />
            <path d="M40 34v30M32 42h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="22" cy="52" r="4.5" stroke={accentHex} strokeWidth="1.5" />
            <path d="M58 46l5 9h-10l5-9Z" stroke={accentHex} strokeWidth="1.5" />
          </>
        );
      case 2: // The High Priestess
        return (
          <>
            <rect x="18" y="20" width="8" height="44" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <rect x="54" y="20" width="8" height="44" rx="1.5" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="40" cy="36" r="9" stroke="#d97706" strokeWidth="1.6" />
            <path d="M26 56c4 4 24 4 28 0" stroke={accentHex} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M35 20a6 6 0 0 0 10 0" stroke="#d97706" strokeWidth="1.5" />
          </>
        );
      case 3: // The Empress
        return (
          <>
            <circle cx="40" cy="32" r="12" fill={accentHex} fillOpacity="0.15" stroke="currentColor" strokeWidth="1.8" />
            <path d="M40 44v18M32 54h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M24 18l4 4l4-5l4 5l4-5l4 5l4-4" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case 4: // The Emperor
        return (
          <>
            <path d="M20 34l6-14l14 9l14-9l6 14H20Z" fill={accentHex} fillOpacity="0.18" stroke="#d97706" strokeWidth="1.7" strokeLinejoin="round" />
            <rect x="24" y="38" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="1.7" />
            <path d="M40 42v16M33 48h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case 5: // The Hierophant
        return (
          <>
            <path d="M26 24l28 28M54 24L26 52" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            <circle cx="24" cy="22" r="5" stroke="#d97706" strokeWidth="1.6" />
            <circle cx="56" cy="22" r="5" stroke="#d97706" strokeWidth="1.6" />
            <path d="M40 16v8M36 20h8" stroke={accentHex} strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case 6: // The Lovers
        return (
          <>
            <circle cx="40" cy="22" r="7" fill="#d97706" fillOpacity="0.22" stroke="#d97706" strokeWidth="1.6" />
            <circle cx="31" cy="46" r="11" stroke={accentHex} strokeWidth="1.7" />
            <circle cx="49" cy="46" r="11" stroke="currentColor" strokeWidth="1.7" />
            <path d="M40 10v3M40 31v3M28 22h3M49 22h3" stroke="#d97706" strokeWidth="1.3" strokeLinecap="round" />
          </>
        );
      case 7: // The Chariot
        return (
          <>
            <path d="M18 22h44l-5 14H23l-5-14Z" stroke="#d97706" strokeWidth="1.6" />
            <circle cx="40" cy="50" r="13" stroke="currentColor" strokeWidth="1.7" />
            <path d="M40 37v26M27 50h26M31 41l18 18M49 41L31 59" stroke={accentHex} strokeWidth="1.3" />
          </>
        );
      case 8: // Strength
        return (
          <>
            <path d="M27 20c0-4 6-6 13 0c7 6 13 4 13 0c0-4-6-6-13 0c-7 6-13 4-13 0Z" stroke="#d97706" strokeWidth="1.7" />
            <path d="M40 62c-12-9-17-16-17-23a9 9 0 0 1 17-4a9 9 0 0 1 17 4c0 7-5 14-17 23Z" fill={accentHex} fillOpacity="0.16" stroke="currentColor" strokeWidth="1.7" />
          </>
        );
      case 9: // The Hermit
        return (
          <>
            <path d="M32 22h16l4 10v20l-4 6H32l-4-6V32l4-10Z" fill="#d97706" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.7" />
            <path d="M40 31l5 9H35l5-9Zm0 15l-5-9h10l-5 9Z" stroke="#d97706" strokeWidth="1.4" />
            <path d="M40 14v8M20 62h40" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case 10: // Wheel of Fortune
        return (
          <>
            <circle cx="40" cy="40" r="20" stroke="#d97706" strokeWidth="1.8" />
            <circle cx="40" cy="40" r="8" fill={accentHex} fillOpacity="0.16" stroke="currentColor" strokeWidth="1.6" />
            <path d="M40 20v12M40 48v12M20 40h12M48 40h12M26 26l8 8M46 46l8 8M54 26l-8 8M34 46l-8 8" stroke="currentColor" strokeWidth="1.4" />
          </>
        );
      case 11: // Justice
        return (
          <>
            <path d="M40 14v48M32 52h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M20 28h40" stroke="#d97706" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M22 28l-6 14h12l-6-14Zm36 0l-6 14h12l-6-14Z" fill={accentHex} fillOpacity="0.15" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </>
        );
      case 12: // The Hanged Man
        return (
          <>
            <path d="M22 20h36M40 20v24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="40" cy="52" r="9" fill="#d97706" fillOpacity="0.18" stroke="#d97706" strokeWidth="1.7" />
            <path d="M40 39v5M26 52h3M51 52h3M40 63v3" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round" />
          </>
        );
      case 13: // Death
        return (
          <>
            <circle cx="40" cy="34" r="14" stroke="currentColor" strokeWidth="1.6" />
            <path d="M40 24c4 3 4 9 0 10c-4-1-4-7 0-10Zm-8 10c3-4 9-4 8 0c-1 4-7 4-8 0Zm16 0c-1 4-7 4-8 0c-1-4 5-4 8 0Z" fill={accentHex} fillOpacity="0.18" stroke={accentHex} strokeWidth="1.4" />
            <path d="M16 60h48M28 60a12 12 0 0 1 24 0" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case 14: // Temperance
        return (
          <>
            <path d="M20 22h14l-3 11h-8l-3-11Zm26 24h14l-3 11h-8l-3-11Z" fill={accentHex} fillOpacity="0.15" stroke="currentColor" strokeWidth="1.6" />
            <path d="M31 28c10 0 12 18 18 22" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" />
            <path d="M27 33v7M53 57v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case 15: // The Devil
        return (
          <>
            <circle cx="40" cy="38" r="19" stroke="currentColor" strokeWidth="1.6" />
            <path d="M40 55L28 24l26 18H26l26-18L40 55Z" fill={accentHex} fillOpacity="0.15" stroke={accentHex} strokeWidth="1.5" strokeLinejoin="round" />
          </>
        );
      case 16: // The Tower
        return (
          <>
            <rect x="30" y="28" width="20" height="34" stroke="currentColor" strokeWidth="1.7" />
            <path d="M26 28l4-8h20l4 8" stroke="#d97706" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M56 12L42 26h9l-11 14" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case 17: // The Star
        return (
          <>
            <path d="M40 16l4 16l16 4l-16 4l-4 16l-4-16l-16-4l16-4l4-16Z" fill="#d97706" fillOpacity="0.2" stroke="#d97706" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="22" cy="22" r="2" fill="currentColor" />
            <circle cx="58" cy="22" r="2" fill="currentColor" />
            <path d="M18 62c8-4 16 4 24 0s14 4 20 0" stroke={accentHex} strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case 18: // The Moon
        return (
          <>
            <path d="M46 18a14 14 0 1 0 0 24a10 10 0 1 1 0-24Z" fill="#d97706" fillOpacity="0.22" stroke="#d97706" strokeWidth="1.6" />
            <rect x="16" y="42" width="10" height="20" stroke="currentColor" strokeWidth="1.5" />
            <rect x="54" y="42" width="10" height="20" stroke="currentColor" strokeWidth="1.5" />
            <path d="M36 64c0-7 8-9 4-16" stroke={accentHex} strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case 19: // The Sun
        return (
          <>
            <circle cx="40" cy="40" r="12" fill="#f59e0b" fillOpacity="0.24" stroke="#d97706" strokeWidth="1.8" />
            <path d="M40 16v7M40 57v7M16 40h7M57 40h7M23 23l5 5M52 52l5 5M57 23l-5 5M28 52l-5 5" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
      case 20: // Judgement
        return (
          <>
            <path d="M40 16v30M32 28h16" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M18 48c7-8 14-8 22 0c8-8 15-8 22 0" stroke={accentHex} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M24 58c5-4 10-4 16 0c6-4 11-4 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
      default: // 21: The World
        return (
          <>
            <ellipse cx="40" cy="40" rx="16" ry="22" stroke="#047857" strokeWidth="1.9" strokeDasharray="4 2.5" />
            <path d="M40 29l6 11l-6 11l-6-11l6-11Z" fill="#d97706" fillOpacity="0.22" stroke="#d97706" strokeWidth="1.6" />
            <circle cx="18" cy="20" r="2" fill="currentColor" />
            <circle cx="62" cy="20" r="2" fill="currentColor" />
            <circle cx="18" cy="60" r="2" fill="currentColor" />
            <circle cx="62" cy="60" r="2" fill="currentColor" />
          </>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 80 80"
      className={compact ? 'h-9 w-9 sm:h-12 sm:w-12 text-[#3d1a15]' : 'h-14 w-14 sm:h-20 sm:w-20 text-[#3d1a15]'}
      fill="none"
    >
      <circle cx="40" cy="40" r="34" stroke="#d4af37" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="2 3" />
      {renderSymbol()}
    </svg>
  );
};

export const TarotCardBackPattern: React.FC<{ numeral?: string; label?: string }> = ({
  numeral,
  label,
}) => (
  <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-lg sm:rounded-xl border-2 border-[#E6BD72] bg-gradient-to-b from-[#6b1424] via-[#4A101D] to-[#280610] p-1.5 text-[#FFF4E5] shadow-[0_12px_28px_rgba(12,2,6,0.65)]">
    {/* Intricate Champagne Gold Filigree Engraving SVG */}
    <svg
      viewBox="0 0 120 180"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-95"
      fill="none"
    >
      <rect x="5" y="5" width="110" height="170" rx="6" stroke="#E6BD72" strokeWidth="1.2" strokeOpacity="0.85" />
      <rect x="9" y="9" width="102" height="162" rx="4" stroke="#FFF4E5" strokeWidth="0.6" strokeDasharray="2 2" strokeOpacity="0.55" />

      <path d="M24 24C42 16 78 16 96 24" stroke="#E6BD72" strokeWidth="1.1" strokeOpacity="0.7" />
      <path d="M24 156C42 164 78 164 96 156" stroke="#E6BD72" strokeWidth="1.1" strokeOpacity="0.7" />

      <circle cx="16" cy="16" r="2.2" fill="#E6BD72" fillOpacity="0.85" />
      <circle cx="104" cy="16" r="2.2" fill="#E6BD72" fillOpacity="0.85" />
      <circle cx="16" cy="164" r="2.2" fill="#E6BD72" fillOpacity="0.85" />
      <circle cx="104" cy="164" r="2.2" fill="#E6BD72" fillOpacity="0.85" />

      <line x1="60" y1="22" x2="60" y2="158" stroke="#E6BD72" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="20" y1="90" x2="100" y2="90" stroke="#E6BD72" strokeWidth="0.6" strokeOpacity="0.5" />

      <circle cx="60" cy="90" r="31" stroke="#E6BD72" strokeWidth="1.2" strokeOpacity="0.82" />
      <circle cx="60" cy="90" r="22" stroke="#FFF4E5" strokeWidth="0.8" strokeDasharray="2 3" strokeOpacity="0.75" />
      <path
        d="M60 52L65.5 81.5L94 90L65.5 98.5L60 128L54.5 98.5L26 90L54.5 81.5L60 52Z"
        fill="#E6BD72"
        fillOpacity="0.26"
        stroke="#FFF4E5"
        strokeWidth="1.1"
      />
      <circle cx="60" cy="90" r="6" fill="#4A101D" stroke="#FFF4E5" strokeWidth="1.3" />
      <circle cx="60" cy="90" r="2.2" fill="#FFF4E5" />

      <path d="M64 35a6 6 0 1 0 0 10a4.5 4.5 0 1 1 0-10Z" fill="#FFF4E5" fillOpacity="0.88" />
      <path d="M56 135a6 6 0 1 1 0 10a4.5 4.5 0 1 0 0-10Z" fill="#FFF4E5" fillOpacity="0.88" />
    </svg>

    <div className="relative z-10 flex w-full items-center justify-between px-1 text-[7px] sm:text-[8px] font-bold tracking-widest text-[#FFF4E5]/90">
      <span>✦</span>
      <span>{numeral ?? 'ARCANA'}</span>
      <span>✦</span>
    </div>

    <div className="relative z-10 text-[6px] sm:text-[7.5px] font-bold uppercase tracking-[0.16em] text-[#E6BD72]">
      {label ?? 'TAROT'}
    </div>
  </div>
);
