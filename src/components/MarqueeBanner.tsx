import React from 'react';

export const MarqueeBanner: React.FC = () => {
  const marqueeItems = [
    { kanji: '大吉', text: 'ĐẠI CÁT KHAI VẬN' },
    { kanji: '恋結び', text: 'TÌNH DUYÊN NHƯ Ý' },
    { kanji: 'おみくじ', text: 'RÚT THĂM OMIKUJI' },
    { kanji: 'タロット', text: 'TAROT VẬN MỆNH' },
    { kanji: '金運', text: 'TÀI LỘC HẠNH THÔNG' },
    { kanji: '神の数', text: 'KAMI NO SŪ' },
    { kanji: '桜満開', text: 'HOA ANH ĐÀO NỞ RỘ' },
    { kanji: '無病息災', text: 'BÌNH AN MAY MẮN' },
  ];

  return (
    <div className="relative overflow-hidden border-y border-rose-200 bg-gradient-to-r from-[#fff1f2] via-[#ffe4e6] to-[#fff1f2] py-2.5 text-crimson-700">
      <div className="flex w-max animate-marquee space-x-8 whitespace-nowrap text-xs sm:text-sm font-semibold tracking-wider">
        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <span className="rounded bg-crimson-500/15 px-1.5 py-0.5 font-jp text-xs sm:text-sm font-bold text-crimson-600">
              {item.kanji}
            </span>
            <span className="text-ink/85">{item.text}</span>
            <span className="text-rose-400">❀</span>
          </div>
        ))}
      </div>
    </div>
  );
};
