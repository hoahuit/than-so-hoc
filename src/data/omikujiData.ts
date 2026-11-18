export type FortuneRank = 'Đại Cát' | 'Cát' | 'Trung Cát' | 'Tiểu Cát' | 'Mạt Cát';
export type KanjiRank = '大吉' | '吉' | '中吉' | '小吉' | '末吉';
export type PlanType = 'mini' | 'love' | 'destiny';

export interface OmikujiFortune {
  id: number;
  stickNumber: number;
  rank: FortuneRank;
  kanjiRank: KanjiRank;
  title: string;
  theme: string;
  poem: string[];
  meaning: string;
  advice: string;
  scores: {
    love: number;        // Tình duyên %
    career: number;      // Sự nghiệp %
    wealth: number;      // Tài lộc %
    health: number;      // Sức khỏe %
  };
  numerology: {
    luckyNumber: number;
    destinyNumber: number;
    color: string;
    direction: string;
    amulet: string;
  };
  suitablePlans: PlanType[];
}

export const FORTUNE_RANK_INFO: Record<FortuneRank, {
  color: string;
  bgColor: string;
  borderColor: string;
  badge: string;
  kanji: KanjiRank;
  vibe: string;
}> = {
  'Đại Cát': {
    color: 'text-amber-400',
    bgColor: 'bg-red-950/80',
    borderColor: 'border-amber-500',
    badge: 'ĐẠI CÁT · THƯỢNG CÁT',
    kanji: '大吉',
    vibe: 'Vận khí rực rỡ ngập tràn, vạn sự hanh thông như rồng bay lên mây!',
  },
  'Cát': {
    color: 'text-rose-400',
    bgColor: 'bg-rose-950/70',
    borderColor: 'border-rose-500',
    badge: 'CÁT TƯỜNG NHƯ Ý',
    kanji: '吉',
    vibe: 'Gió lành thổi đến, hạt mầm thiện lương nay đơm hoa kết trái.',
  },
  'Trung Cát': {
    color: 'text-red-400',
    bgColor: 'bg-red-950/60',
    borderColor: 'border-red-600',
    badge: 'TRUNG BÌNH HƯỚNG CÁT',
    kanji: '中吉',
    vibe: 'Nước chảy từ từ ắt thành sông, kiên định giữ vững chí hướng.',
  },
  'Tiểu Cát': {
    color: 'text-orange-400',
    bgColor: 'bg-amber-950/50',
    borderColor: 'border-orange-600',
    badge: 'TIỂU CÁT KHỞI TÂM',
    kanji: '小吉',
    vibe: 'Ánh rạng đông dần hé lộ, chớ vội vàng, từng bước an yên.',
  },
  'Mạt Cát': {
    color: 'text-yellow-500',
    bgColor: 'bg-zinc-950/80',
    borderColor: 'border-yellow-700',
    badge: 'MẠT CÁT TIỀM NĂNG',
    kanji: '末吉',
    vibe: 'Trước gian nan sau viên mãn, hoa sen nở rộ từ bùn sâu.',
  },
};

export const OMIKUJI_DATABASE: OmikujiFortune[] = [
  {
    id: 1,
    stickNumber: 1,
    rank: 'Đại Cát',
    kanjiRank: '大吉',
    title: 'Huyết Nguyệt Giáng Lâm - Thần Long Xuất Uyên',
    theme: 'Định Mệnh Chuyển Mình',
    poem: [
      'Gió sớm lay cành trúc biếc xanh,',
      'Vầng trăng nhuộm đỏ giữa thiên thành.',
      'Rồng thiêng thức giấc bay muôn dặm,',
      'Đại nghiệp ngàn thu định sẵn dành.',
    ],
    meaning: 'Vận khí của bạn đang ở chu kỳ cực thịnh. Những bế tắc trong quá khứ sắp tan biến như sương khói ban mai. Thời cơ ngàn năm có một để khởi xướng các dự định lớn, ký kết giao ước hoặc tỏ bày tình cảm ấp ủ.',
    advice: 'Hãy giữ tâm thế sáng suốt, không kiêu căng tự mãn. Càng khiêm nhường thì hào quang thần linh ban tặng càng tỏa sáng bền lâu.',
    scores: {
      love: 96,
      career: 98,
      wealth: 95,
      health: 90,
    },
    numerology: {
      luckyNumber: 8,
      destinyNumber: 1,
      color: 'Đỏ Thẫm Ánh Kim',
      direction: 'Chính Đông',
      amulet: 'Lá Bùa Thần Tài (Omamori Kim Vận)',
    },
    suitablePlans: ['mini', 'love', 'destiny'],
  },
  {
    id: 2,
    stickNumber: 7,
    rank: 'Đại Cát',
    kanjiRank: '大吉',
    title: 'Hồng Tuyến Tương Phùng - Nguyệt Hạ Kết Duyên',
    theme: 'Tình Duyên Viên Mãn',
    poem: [
      'Sợi tơ hồng thắm cột tay duyên,',
      'Dưới ánh trăng thanh dạ cất lời nguyền.',
      'Dẫu cách ngàn trùng qua bão tuyết,',
      'Bến đỗ bình yên một sớm thuyền.',
    ],
    meaning: 'Thần Nguyệt Lão đã điểm trúng mối tơ duyên của bạn. Người đang đơn thân sẽ gặp được tri kỷ có tần số rung động tương hợp kỳ diệu. Người đang trong mối quan hệ sẽ tháo gỡ hiểu lầm, tiến tới kết tinh tình yêu sắt son.',
    advice: 'Đừng ngần ngại mở rộng lòng mình và nói ra tiếng nói chân thành của trái tim.',
    scores: {
      love: 99,
      career: 88,
      wealth: 86,
      health: 92,
    },
    numerology: {
      luckyNumber: 24,
      destinyNumber: 6,
      color: 'Hồng Đào Sakura',
      direction: 'Đông Nam',
      amulet: 'Chuông Gió Duyên Lành (Musubi En)',
    },
    suitablePlans: ['love', 'destiny'],
  },
  {
    id: 3,
    stickNumber: 18,
    rank: 'Cát',
    kanjiRank: '吉',
    title: 'Đan Phong Triều Dương - Phú Quý Trường Xuân',
    theme: 'Tài Lộc & Công Danh',
    poem: [
      'Đỉnh núi mù sương rạng ánh hồng,',
      'Thuyền buôn tấp nập vượt trùng sông.',
      'Vàng mười gom góp về tay chủ,',
      'Một sớm thênh thang rạng cửa bồng.',
    ],
    meaning: 'Tài chính có dấu hiệu khởi sắc vượt bậc, những nỗ lực thầm lặng bấy lâu bắt đầu kết tinh thành dòng tiền và sự công nhận từ cấp trên hoặc đối tác.',
    advice: 'Nên cẩn trọng trong việc quản lý chi tiêu cá nhân, tái đầu tư vào tri thức và những giá trị lâu dài.',
    scores: {
      love: 84,
      career: 92,
      wealth: 94,
      health: 85,
    },
    numerology: {
      luckyNumber: 33,
      destinyNumber: 8,
      color: 'Vàng Kim Quý Phái',
      direction: 'Tây Bắc',
      amulet: 'Đồng Xu Cổ Ngũ Đế',
    },
    suitablePlans: ['mini', 'destiny'],
  },
  {
    id: 4,
    stickNumber: 27,
    rank: 'Trung Cát',
    kanjiRank: '中吉',
    title: 'Thanh Thủy Tĩnh Lưu - Trúc Nhàn Tĩnh Tự',
    theme: 'Tâm Hồn An Yên',
    poem: [
      'Nước biếc êm đềm chảy góc hiên,',
      'Trúc đưa kẽ lá rũ ưu phiền.',
      'Lòng không vướng bận điều hư ảo,',
      'Trăng sáng đầu non ngự cõi thiền.',
    ],
    meaning: 'Giai đoạn bình ổn để tích lũy nội lực. Dù không có những cú hích thần kỳ đột ngột nhưng đây là khoảng lặng vô giá giúp bạn tái tạo năng lượng thể chất và tinh thần.',
    advice: 'Dành thời gian chăm sóc sức khỏe, thanh lọc môi trường sống và lắng nghe trực giác mách bảo.',
    scores: {
      love: 82,
      career: 78,
      wealth: 75,
      health: 96,
    },
    numerology: {
      luckyNumber: 15,
      destinyNumber: 7,
      color: 'Xanh Matcha Thiền Định',
      direction: 'Chính Bắc',
      amulet: 'Vòng Gỗ Trầm Hương',
    },
    suitablePlans: ['mini', 'love'],
  },
  {
    id: 5,
    stickNumber: 42,
    rank: 'Cát',
    kanjiRank: '吉',
    title: 'Hạc Trắng Vờn Mây - Thi Đậu Bảng Vàng',
    theme: 'Học Vấn & Kỳ Thi',
    poem: [
      'Cánh hạc nghiêng chao đón nắng lành,',
      'Đèn khuya miệt mài chí thanh danh.',
      'Bút hoa nở nhụy vờn trang giấy,',
      'Tên khắc ghi vào bảng rạng danh.',
    ],
    meaning: 'Trực giác nhạy bén, đầu óc minh mẫn tột bậc. Rất tốt cho người chuẩn bị thi cử, phỏng vấn, bảo vệ dự án hoặc chuyển đổi ngành nghề mới.',
    advice: 'Tập trung cao độ, tránh để những thông tin thị phi bên ngoài làm phân tâm dòng chảy suy nghĩ.',
    scores: {
      love: 76,
      career: 94,
      wealth: 82,
      health: 88,
    },
    numerology: {
      luckyNumber: 7,
      destinyNumber: 3,
      color: 'Xanh Lam Thần Bí',
      direction: 'Đông Bắc',
      amulet: 'Bút Trâm Bạch Ngọc',
    },
    suitablePlans: ['mini', 'destiny'],
  },
  {
    id: 6,
    stickNumber: 59,
    rank: 'Tiểu Cát',
    kanjiRank: '小吉',
    title: 'Sơ Tuyết Nghênh Mai - Hạt Mầm Nảy Lộc',
    theme: 'Khởi Đầu Mới',
    poem: [
      'Tuyết mỏng vương trên cánh đóa mai,',
      'Gian truân tôi luyện bậc anh tài.',
      'Chân trời hé lộ tia mai ấm,',
      'Hạnh phúc tròn đầy đợi sớm mai.',
    ],
    meaning: 'Những dấu hiệu tích cực ban đầu đã xuất hiện. Công việc và dự án có tiến triển nhưng cần thêm thời gian để trưởng thành và gặt hái.',
    advice: 'Kiên nhẫn là chìa khóa vàng lúc này. Chớ đốt cháy giai đoạn để tránh những sơ sót không đáng có.',
    scores: {
      love: 79,
      career: 80,
      wealth: 72,
      health: 84,
    },
    numerology: {
      luckyNumber: 19,
      destinyNumber: 4,
      color: 'Trắng Ngọc Trai',
      direction: 'Chính Tây',
      amulet: 'Gương Bát Quái Cẩm Thạch',
    },
    suitablePlans: ['mini', 'love'],
  },
  {
    id: 7,
    stickNumber: 68,
    rank: 'Đại Cát',
    kanjiRank: '大吉',
    title: 'Nguyệt Dạ Kỳ Ngộ - Tri Kỷ Đồng Hành',
    theme: 'Nhân Duyên Quý Nhân',
    poem: [
      'Đèn lồng soi sáng lối hoa tiêu,',
      'Bằng hữu chung lòng đón gió xiêu.',
      'Tay nắm chặt tay qua ải hiểm,',
      'Vang lừng tiếng nhạc giữa hoàng triều.',
    ],
    meaning: 'Quý nhân tương trợ xuất hiện đúng thời điểm then chốt nhất. Mọi khó khăn tưởng chừng bế tắc sẽ được một người bạn hoặc tiền bối tháo gỡ dễ dàng.',
    advice: 'Chủ động kết nối và mở lòng biết ơn. Mối quan hệ này có thể định hình vận mệnh 5 năm tới của bạn.',
    scores: {
      love: 94,
      career: 95,
      wealth: 91,
      health: 93,
    },
    numerology: {
      luckyNumber: 11,
      destinyNumber: 11,
      color: 'Tím Hoàng Gia',
      direction: 'Tây Nam',
      amulet: 'Quạt Giấy Sensu Khảm Vàng',
    },
    suitablePlans: ['love', 'destiny'],
  },
  {
    id: 8,
    stickNumber: 88,
    rank: 'Mạt Cát',
    kanjiRank: '末吉',
    title: 'Phá Vỡ Kén Tằm - Hóa Bướm Nguyện Bay',
    theme: 'Chuyển Hóa Nghịch Cảnh',
    poem: [
      'Tằm kia chịu lạnh giữa đêm trường,',
      'Dệt mối tơ tằm trải gió sương.',
      'Đến lúc vươn mình tung cánh lượn,',
      'Hương hoa ngào ngạt khắp muôn phương.',
    ],
    meaning: 'Hiện tại có chút áp lực và thử thách đòi hỏi sự dẻo dai. Đừng nản lòng vì đây chính là quá trình vũ trụ rèn giũa để bạn bứt phá lên một tầm cao mới.',
    advice: 'Bình tĩnh đón nhận, giữ chế độ ăn uống và ngủ nghỉ điều độ, mọi biến cố sẽ dần chuyển hóa thành phúc lành vào cuối tháng.',
    scores: {
      love: 70,
      career: 75,
      wealth: 68,
      health: 80,
    },
    numerology: {
      luckyNumber: 55,
      destinyNumber: 9,
      color: 'Nâu Trầm Cổ Điển',
      direction: 'Đông Nam',
      amulet: 'Lá Bùa Bình An (Yakuyoke)',
    },
    suitablePlans: ['mini', 'destiny'],
  },
  {
    id: 9,
    stickNumber: 99,
    rank: 'Đại Cát',
    kanjiRank: '大吉',
    title: 'Thần Quang Phổ Chiếu - Cực Phẩm Cát Tinh',
    theme: 'Đỉnh Cao Phúc Lạc',
    poem: [
      'Đền thiêng rực rỡ dưới trăng tròn,',
      'Thần số huyền linh ấn định son.',
      'Bốn bề phúc lộc quy về một,',
      'Rạng rỡ muôn đời dạ chẳng sờn.',
    ],
    meaning: 'Quẻ số 99 - Cực số trong truyền thống Omikuji Thần Số Học! Bạn đang sở hữu năng lượng bảo bọc từ chư vị thần linh. Mọi ý niệm tích cực bạn phát ra sẽ thành hiện thực trong thời gian ngắn nhất.',
    advice: 'Hãy làm việc thiện nguyện hoặc giúp đỡ một ai đó xung quanh để kích hoạt dòng năng lượng tích cực lan tỏa vô hạn.',
    scores: {
      love: 98,
      career: 99,
      wealth: 97,
      health: 95,
    },
    numerology: {
      luckyNumber: 99,
      destinyNumber: 22,
      color: 'Đỏ Chu Sa Cung Đình',
      direction: 'Tứ Phương Đều Tốt',
      amulet: 'Gương Bát Diện Thần Điện (Yata no Kagami)',
    },
    suitablePlans: ['mini', 'love', 'destiny'],
  }
];

export function getRandomFortune(plan: PlanType = 'mini'): OmikujiFortune {
  const filtered = OMIKUJI_DATABASE.filter(f => f.suitablePlans.includes(plan));
  const pool = filtered.length > 0 ? filtered : OMIKUJI_DATABASE;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
