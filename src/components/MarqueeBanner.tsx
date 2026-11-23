import React from 'react';

export const MarqueeBanner: React.FC = () => {
  const marqueeItems = [
    { kanji: '大吉', text: 'ĐẠI CÁT ĐẮC THỜI' },
    { kanji: 'おみくじ', text: 'XĂM MAY MẮN ASAKUSA' },
    { kanji: '良縁', text: 'CẦU DUYÊN ĐẮC DUYÊN' },
    { kanji: '金運招福', text: 'CẦU TÀI ĐẮC TÀI' },
    { kanji: '神の数', text: 'THẦN SỐ ĐỊNH MỆNH' },
    { kanji: '無病息災', text: 'BÌNH AN GIA ĐẠO' },
    { kanji: '開運厄除', text: 'KHAI VẬN HANH THÔNG' },
  ];

  return (
    <div className="relative overflow-hidden border-y border-temple-200/80 bg-gradient-to-r from-[#faeee9] via-[#f5dbd2] to-[#faeee9] py-2.5 text-temple-900">
      <div className="flex w-max animate-marquee space-x-8 whitespace-nowrap text-xs sm:text-sm font-semibold tracking-wider">
        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <span className="rounded bg-temple-800 px-2 py-0.5 font-jp text-xs sm:text-sm font-bold text-brass-100 shadow-sm">
              {item.kanji}
            </span>
            <span className="text-temple-900 font-bold">{item.text}</span>
            <span className="text-temple-600">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
