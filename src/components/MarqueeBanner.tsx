import React from 'react';

export const MarqueeBanner: React.FC = () => {
  const marqueeItems = [
    { kanji: 'おみくじ', text: 'MỘT THÔNG ĐIỆP NGẪU NHIÊN DÀNH CHO BẠN LÚC NÀY' },
    { kanji: '大吉', text: 'MAY MẮN NÀO ĐANG ĐẾN VỚI BẠN TRONG 30 NGÀY TỚI?' },
    { kanji: '良縁', text: 'CHUYỆN TÌNH CẢM CỦA BẠN TỪ GIỜ TỚI CUỐI NĂM?' },
    { kanji: '金運', text: '30 NGÀY TỚI KHÍA CẠNH NÀO SẼ NỞ HOA?' },
    { kanji: '神託', text: 'ĐIỀU BẠN THẦM MONG CẦU CÓ THÀNH SỰ THỰC?' },
    { kanji: '開運', text: 'ĐOẠN ĐƯỜNG SẮP TỚI CỦA BẠN SẼ RA SAO?' },
  ];

  return (
    <div className="relative overflow-hidden border-y border-[#cba135]/45 bg-gradient-to-r from-[#5a120c] via-[#7c1b12] to-[#5a120c] py-2.5 text-amber-50 shadow-sm">
      <div className="flex w-max animate-marquee space-x-8 whitespace-nowrap text-[11px] sm:text-xs font-semibold tracking-wider">
        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <span className="rounded bg-gradient-to-b from-[#f3d179] to-[#cfa03b] px-2 py-0.5 font-jp text-[11px] sm:text-xs font-extrabold text-[#3d0e08] shadow-sm">
              {item.kanji}
            </span>
            <span className="text-amber-50/95 font-bold">{item.text}</span>
            <span className="text-[#f3d179]">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
