import React from 'react';

export const MarqueeBanner: React.FC = () => {
  const marqueeItems = [
    { kanji: 'おみくじ', text: 'MỘT THÔNG ĐIỆP NGẪU NHIÊN DÀNH CHO BẠN LÚC NÀY' },
    { kanji: '大吉', text: 'MAY MẮN NÀO ĐANG ĐẾN VỚI BẠN TRONG 30 NGÀY TỚI?' },
    { kanji: '良縁', text: 'CHUYỆN TÌNH CẢM CỦA BẠN TỪ GIỜ TỚI CUỐI NĂM' },
    { kanji: '金運', text: '30 NGÀY TỚI KHÍA CẠNH NÀO SẼ NỞ HOA?' },
    { kanji: '神託', text: 'ĐIỀU BẠN THẦM MONG CẦU CÓ THÀNH SỰ THỰC?' },
    { kanji: '開運', text: 'ĐOẠN ĐƯỜNG SẮP TỚI CỦA BẠN SẼ RA SAO?' },
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
