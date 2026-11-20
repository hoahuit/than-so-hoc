import React from 'react';

export const MarqueeBanner: React.FC = () => {
  const marqueeItems = [
    { kanji: '大吉', text: 'ĐẠI CÁT KHAI VẬN', color: 'text-crimson-600' },
    { kanji: '恋結び', text: 'TÌNH DUYÊN NHƯ Ý', color: 'text-pink-600' },
    { kanji: 'おみくじ', text: 'RÚT THĂM OMIKUJI', color: 'text-crimson-700' },
    { kanji: 'タロット', text: 'TAROT VẬN MỆNH', color: 'text-rose-600' },
    { kanji: '金運', text: 'TÀI LỘC HẠNH THÔNG', color: 'text-amber-600' },
    { kanji: '神の数', text: 'KAMI NO SŪ', color: 'text-crimson-600' },
    { kanji: '桜満開', text: 'HOA ANH ĐÀO NỞ RỘ', color: 'text-pink-500' },
    { kanji: '無病息災', text: 'BÌNH AN MAY MẮN', color: 'text-crimson-700' },
  ];

  return (
    <div className="relative overflow-hidden border-y border-rose-200 marquee-enhanced py-2.5">
      {/* Left & right fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#fff1f2] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#fff1f2] to-transparent z-10" />

      <div className="flex w-max animate-marquee space-x-8 whitespace-nowrap text-xs sm:text-sm font-semibold tracking-wider">
        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <span className="rounded bg-crimson-500/15 px-1.5 py-0.5 font-jp text-xs sm:text-sm font-bold text-crimson-600 shadow-sm">
              {item.kanji}
            </span>
            <span className={`${item.color} font-bold`}>{item.text}</span>
            <span className="text-rose-400 animate-twinkle" style={{ animationDelay: `${idx * 0.3}s` }}>❀</span>
          </div>
        ))}
      </div>
    </div>
  );
};
