export type FortuneRank = 'Đại Cát' | 'Thượng Cát' | 'Trung Cát' | 'Tiểu Cát' | 'Bình An';
export type KanjiRank = '大吉' | '上吉' | '中吉' | '小吉' | '吉';
export type PlanType = 'mini' | 'love' | 'destiny';

export interface FortuneAspects {
  love: string;    // Tình duyên (1 câu súc tích)
  career: string;  // Công danh & sự nghiệp (1 câu súc tích)
  wealth: string;  // Tài lộc & tiền bạc (1 câu súc tích)
  health: string;  // Sức khỏe & bình an (1 câu súc tích)
}

export interface OmikujiFortune {
  id: number;
  stickNumber: number; // Con số quẻ may mắn (1-99)
  rank: FortuneRank;
  kanjiRank: KanjiRank;
  title: string;
  theme: string;
  summary: string;     // Tóm lược 1 câu then chốt
  poem: string[];      // 4 câu thơ sấm
  meaning: string;     // Luận giải chi tiết
  advice: string;      // Lời khuyên hành động
  aspects: FortuneAspects; // 4 khía cạnh đời sống chia mục rõ ràng
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
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-400',
    badge: 'ĐẠI CÁT · THẦN LINH PHÙ TRỢ',
    kanji: '大吉',
    vibe: 'Vận khí rực rỡ ngập tràn, vạn sự hanh thông như rồng bay lên mây!',
  },
  'Thượng Cát': {
    color: 'text-temple-700',
    bgColor: 'bg-temple-50',
    borderColor: 'border-temple-600',
    badge: 'THƯỢNG CÁT · CÁT TƯỜNG NHƯ Ý',
    kanji: '上吉',
    vibe: 'Gió lành thổi đến, hạt mầm thiện lương nay đơm hoa kết trái.',
  },
  'Trung Cát': {
    color: 'text-temple-800',
    bgColor: 'bg-temple-50/70',
    borderColor: 'border-temple-700',
    badge: 'TRUNG CÁT · HƯỚNG THIỆN ĐẮC THỜI',
    kanji: '中吉',
    vibe: 'Nước chảy từ từ ắt thành sông, kiên định giữ vững chí hướng.',
  },
  'Tiểu Cát': {
    color: 'text-brass-700',
    bgColor: 'bg-brass-50',
    borderColor: 'border-brass-400',
    badge: 'TIỂU CÁT · KHỞI TÂM AN LẠC',
    kanji: '小吉',
    vibe: 'Ánh rạng đông dần hé lộ, chớ vội vàng, từng bước an yên.',
  },
  'Bình An': {
    color: 'text-ink-muted',
    bgColor: 'bg-washi-100',
    borderColor: 'border-washi-300',
    badge: 'BÌNH AN · TÂM AN VẠN SỰ AN',
    kanji: '吉',
    vibe: 'Giữ tâm bình thản trước biến động, tích lũy đức độ, phúc lộc tự đến.',
  },
};

export const OMIKUJI_DATABASE: OmikujiFortune[] = [
  {
    id: 1,
    stickNumber: 28,
    rank: 'Đại Cát',
    kanjiRank: '大吉',
    title: 'Quẻ Số 28: Thần Long Xuất Hải',
    theme: 'Đại Khai Vận Mệnh',
    summary: 'Thời vận đang hanh thông, mọi việc tiến triển thuận lợi, công danh rộng mở và nhân duyên hài hòa.',
    poem: [
      'Vạn sự hanh thông, phúc lộc tới,',
      'Công danh sự nghiệp sớm gặp thời.',
      'Nhân duyên tốt đẹp, lòng an ổn,',
      'Gia đạo yên vui, vạn sự như ý.',
    ],
    meaning: 'Đây là quẻ Đại Cát, báo hiệu thời vận đang hanh thông, mọi việc tiến triển thuận lợi. Công việc, học hành, làm ăn đều có cơ hội phát triển tốt. Nhân duyên hài hòa, gia đạo êm ấm, tài lộc có dấu hiệu gia tăng.',
    advice: 'Càng khiêm nhường thì hào quang thần linh ban tặng càng tỏa sáng bền lâu. Hãy giữ tâm sáng và nắm bắt cơ hội tốt.',
    aspects: {
      career: 'Công danh rộng mở, dễ gặp quý nhân phù trợ. Thời điểm tốt để triển khai kế hoạch, mở rộng công việc hoặc thăng tiến.',
      wealth: 'Tài lộc có dấu hiệu gia tăng, các khoản đầu tư bắt đầu sinh lời, dòng tiền hanh thông vững chắc.',
      love: 'Nhân duyên tốt đẹp, lòng an ổn. Người độc thân có duyên kỳ ngộ tao phùng, đôi lứa thấu hiểu sắt son.',
      health: 'Khí sắc hồng hào, thân tâm an định. Duy trì tập luyện nhẹ nhàng và giữ gìn giấc ngủ ngon.',
    },
    scores: {
      love: 96,
      career: 98,
      wealth: 95,
      health: 90,
    },
    numerology: {
      luckyNumber: 28,
      destinyNumber: 1,
      color: 'Đỏ Son Chùa Sensoji',
      direction: 'Chính Đông',
      amulet: 'Lá Bùa Kim Vận Asakusa',
    },
    suitablePlans: ['mini', 'love', 'destiny'],
  },
  {
    id: 2,
    stickNumber: 68,
    rank: 'Đại Cát',
    kanjiRank: '大吉',
    title: 'Quẻ Số 68: Nguyệt Lão Se Duyên',
    theme: 'Tơ Hồng Viên Mãn',
    summary: 'Nguyệt Lão điểm trúng mối tơ duyên lành, tình cảm đôi lứa sắt son, tháo gỡ mọi hiểu lầm.',
    poem: [
      'Sợi tơ hồng thắm cột tay duyên,',
      'Dưới mái chùa xưa cất tiếng nguyền.',
      'Dẫu cách ngàn trùng qua bão tuyết,',
      'Bến đỗ bình yên một sớm thuyền.',
    ],
    meaning: 'Thần Nguyệt Lão đã điểm trúng mối tơ duyên của bạn. Người đang đơn thân sẽ gặp được tri kỷ có tần số rung động tương hợp kỳ diệu. Người đang trong mối quan hệ sẽ tháo gỡ hiểu lầm, tiến tới kết tinh tình yêu sắt son.',
    advice: 'Đừng ngần ngại mở rộng lòng mình và nói ra tiếng nói chân thành của trái tim.',
    aspects: {
      love: 'Duyên trời định đã tới, đôi lứa thấu hiểu sâu sắc, người độc thân sớm tìm thấy tri kỷ.',
      career: 'Được đồng nghiệp và đối tác tương trợ nhiệt tình, không khí làm việc hài hòa.',
      wealth: 'Tài chính ổn định, thu chi cân đối, có thêm lộc nhỏ từ bạn bè người thân.',
      health: 'Tâm trí thảnh thơi, tinh thần sảng khoái, không còn vướng bận âu lo.',
    },
    scores: {
      love: 99,
      career: 88,
      wealth: 86,
      health: 92,
    },
    numerology: {
      luckyNumber: 68,
      destinyNumber: 6,
      color: 'Hồng Đào Sakura',
      direction: 'Đông Nam',
      amulet: 'Chuông Gió Duyên Lành Musubi',
    },
    suitablePlans: ['love', 'destiny'],
  },
  {
    id: 3,
    stickNumber: 88,
    rank: 'Thượng Cát',
    kanjiRank: '上吉',
    title: 'Quẻ Số 88: Kim Ngân Mãn Đường',
    theme: 'Tài Lộc & Công Danh',
    summary: 'Đỉnh cao tài lộc và hanh thông tiền bạc, những nỗ lực thầm lặng bắt đầu đơm hoa kết trái.',
    poem: [
      'Đỉnh núi mù sương rạng ánh hồng,',
      'Thuyền buôn tấp nập vượt trùng sông.',
      'Vàng mười gom góp về tay chủ,',
      'Một sớm thênh thang rạng cửa bồng.',
    ],
    meaning: 'Tài chính có dấu hiệu khởi sắc vượt bậc, những nỗ lực thầm lặng bấy lâu bắt đầu kết tinh thành dòng tiền và sự công nhận từ cấp trên hoặc đối tác.',
    advice: 'Nên cẩn trọng trong việc quản lý chi tiêu cá nhân, tái đầu tư vào tri thức và những giá trị lâu dài.',
    aspects: {
      love: 'Tình cảm bình hòa, cả hai cùng chia sẻ tầm nhìn và đồng lòng xây đắp tương lai.',
      career: 'Năng lực được công nhận rõ rệt, có khả năng nhận thêm trọng trách quan trọng.',
      wealth: 'Vượng khí tài lộc mạnh mẽ, hợp đồng ký kết suôn sẻ, dòng tiền sinh sôi.',
      health: 'Cần chú ý nghỉ ngơi điều độ, tránh làm việc quá sức khi vào guồng quay bận rộn.',
    },
    scores: {
      love: 84,
      career: 94,
      wealth: 96,
      health: 88,
    },
    numerology: {
      luckyNumber: 88,
      destinyNumber: 8,
      color: 'Vàng Đồng Cổ Asakusa',
      direction: 'Tây Bắc',
      amulet: 'Đồng Xu Cổ Chiêu Tài',
    },
    suitablePlans: ['mini', 'destiny'],
  },
  {
    id: 4,
    stickNumber: 18,
    rank: 'Trung Cát',
    kanjiRank: '中吉',
    title: 'Quẻ Số 18: Thanh Thủy Tĩnh Lưu',
    theme: 'Tâm Hồn An Yên',
    summary: 'Dòng nước trong êm đềm chảy, giai đoạn tích lũy nội lực và dưỡng tâm lý tưởng.',
    poem: [
      'Nước biếc êm đềm chảy góc hiên,',
      'Trúc đưa kẽ lá rũ ưu phiền.',
      'Lòng không vướng bận điều hư ảo,',
      'Trăng sáng đầu non ngự cõi thiền.',
    ],
    meaning: 'Giai đoạn bình ổn để tích lũy nội lực. Dù không có những cú hích thần kỳ đột ngột nhưng đây là khoảng lặng vô giá giúp bạn tái tạo năng lượng thể chất và tinh thần.',
    advice: 'Dành thời gian chăm sóc sức khỏe, thanh lọc môi trường sống và lắng nghe trực giác mách bảo.',
    aspects: {
      love: 'Mối quan hệ êm đềm, nên chủ động tạo bất ngờ nhỏ để hâm nóng tình cảm.',
      career: 'Công việc giữ nhịp ổn định, thời điểm vàng để học tập bổ sung kỹ năng mới.',
      wealth: 'Tài chính an toàn, nên ưu tiên giữ vốn, tránh đầu cơ vào kênh rủi ro cao.',
      health: 'Thể trạng dẻo dai, tâm hồn thư thái, giấc ngủ sâu và ngon hơn.',
    },
    scores: {
      love: 82,
      career: 80,
      wealth: 78,
      health: 96,
    },
    numerology: {
      luckyNumber: 18,
      destinyNumber: 7,
      color: 'Xanh Trầm Sensoji',
      direction: 'Chính Bắc',
      amulet: 'Vòng Gỗ Trầm Hương',
    },
    suitablePlans: ['mini', 'love'],
  },
  {
    id: 5,
    stickNumber: 9,
    rank: 'Đại Cát',
    kanjiRank: '大吉',
    title: 'Quẻ Số 09: Cửu Long Quy Nhất',
    theme: 'Đỉnh Cao Phúc Lạc',
    summary: 'Quẻ Cực Cát của đền thần! Mọi ý niệm tích cực sẽ nhanh chóng thành hiện thực viên mãn.',
    poem: [
      'Chùa cổ trang nghiêm dưới ráng hồng,',
      'Thần linh ấn định vận hanh thông.',
      'Bốn bề phúc lộc quy về một,',
      'Rạng rỡ danh gia thoả ước mong.',
    ],
    meaning: 'Quẻ số 09 - Quẻ Cực Cát của đền thần! Bạn đang sở hữu năng lượng bảo bọc từ chư vị thần linh. Mọi ý niệm tích cực bạn phát ra sẽ thành hiện thực trong thời gian ngắn nhất.',
    advice: 'Hãy làm việc thiện nguyện hoặc giúp đỡ một ai đó xung quanh để kích hoạt dòng năng lượng tích cực lan tỏa vô hạn.',
    aspects: {
      love: 'Hòa khí gia đạo viên mãn, tình duyên đơm hoa, đón nhận nhiều phước lành.',
      career: 'Thời cơ hiếm có, bước tiến vượt bậc được quý nhân mở đường dẫn lối.',
      wealth: 'Tụ lộc đại cát, thu nhập gia tăng đáng kể từ nhiều nguồn khác nhau.',
      health: 'Thân tâm an khang, tràn đầy năng lượng tích cực và nhiệt huyết sống.',
    },
    scores: {
      love: 98,
      career: 99,
      wealth: 97,
      health: 95,
    },
    numerology: {
      luckyNumber: 9,
      destinyNumber: 9,
      color: 'Đỏ Chu Sa Cổ Tự',
      direction: 'Tứ Phương Đều Tốt',
      amulet: 'Gương Bát Quái Cổ Đền Sensoji',
    },
    suitablePlans: ['mini', 'love', 'destiny'],
  },
  {
    id: 6,
    stickNumber: 36,
    rank: 'Thượng Cát',
    kanjiRank: '上吉',
    title: 'Quẻ Số 36: Bách Hoa Tranh Diễm',
    theme: 'Học Vấn & Thi Cử',
    summary: 'Trực giác nhạy bén, đầu óc minh mẫn, vạn sự thi cử và bảo vệ kế hoạch thành công mỹ mãn.',
    poem: [
      'Cánh hạc nghiêng chao đón nắng lành,',
      'Đèn khuya miệt mài chí thanh danh.',
      'Bút hoa nở nhụy vờn trang giấy,',
      'Tên khắc ghi vào bảng rạng danh.',
    ],
    meaning: 'Trực giác nhạy bén, đầu óc minh mẫn tột bậc. Rất tốt cho người chuẩn bị thi cử, phỏng vấn, bảo vệ dự án hoặc chuyển đổi ngành nghề mới.',
    advice: 'Tập trung cao độ, tránh để những thông tin thị phi bên ngoài làm phân tâm dòng chảy suy nghĩ.',
    aspects: {
      love: 'Sức hút cá nhân nổi bật nhờ sự thông minh, duyên dáng và tinh tế trong giao tiếp.',
      career: 'Thi cử đỗ đạt, phỏng vấn suôn sẻ, đề xuất dự án được phê duyệt nhanh chóng.',
      wealth: 'Thu nhập tăng dần theo uy tín và năng lực chuyên môn của bản thân.',
      health: 'Cần chú ý thư giãn mắt và giữ ấm cổ họng sau những giờ làm việc căng thẳng.',
    },
    scores: {
      love: 80,
      career: 95,
      wealth: 86,
      health: 88,
    },
    numerology: {
      luckyNumber: 36,
      destinyNumber: 3,
      color: 'Vàng Kim Hoàng Gia',
      direction: 'Đông Bắc',
      amulet: 'Bút Trâm Văn Xương',
    },
    suitablePlans: ['mini', 'destiny'],
  },
  {
    id: 7,
    stickNumber: 77,
    rank: 'Đại Cát',
    kanjiRank: '大吉',
    title: 'Quẻ Số 77: Thất Tinh Tụ Hội',
    theme: 'Quý Nhân Phù Trợ',
    summary: 'Quý nhân xuất hiện tương trợ đúng thời khắc then chốt, tháo gỡ mọi nút thắt bế tắc.',
    poem: [
      'Đèn lồng soi sáng lối hoa tiêu,',
      'Bằng hữu chung lòng đón gió xiêu.',
      'Tay nắm chặt tay qua ải hiểm,',
      'Vang lừng tiếng nhạc giữa hoàng triều.',
    ],
    meaning: 'Quý nhân tương trợ xuất hiện đúng thời điểm then chốt nhất. Mọi khó khăn tưởng chừng bế tắc sẽ được một người bạn hoặc tiền bối tháo gỡ dễ dàng.',
    advice: 'Chủ động kết nối và mở lòng biết ơn. Mối quan hệ này có thể định hình vận mệnh sắp tới của bạn.',
    aspects: {
      love: 'Được đối phương che chở, tình cảm vững vàng vượt qua mọi sóng gió thử thách.',
      career: 'Có bậc tiền bối dìu dắt, việc khó hóa dễ, gặt hái sự tin tưởng của tập thể.',
      wealth: 'Hợp tác đem lại nguồn lợi lớn, tài lộc hanh thông nhờ mạng lưới bạn bè.',
      health: 'Sức sống dồi dào, thể lực tốt, tinh thần vui tươi phấn khởi mỗi ngày.',
    },
    scores: {
      love: 94,
      career: 95,
      wealth: 92,
      health: 93,
    },
    numerology: {
      luckyNumber: 77,
      destinyNumber: 11,
      color: 'Đỏ Rượu Vang',
      direction: 'Tây Nam',
      amulet: 'Quạt Giấy Khảm Vàng Asakusa',
    },
    suitablePlans: ['love', 'destiny'],
  },
  {
    id: 8,
    stickNumber: 52,
    rank: 'Tiểu Cát',
    kanjiRank: '小吉',
    title: 'Quẻ Số 52: Sơ Tuyết Nghênh Mai',
    theme: 'Khởi Đầu Mới',
    summary: 'Mầm cây bắt đầu nhú chồi qua mùa đông lạnh, kiên nhẫn từng bước ắt gặt quả ngọt.',
    poem: [
      'Tuyết mỏng vương trên cánh đóa mai,',
      'Gian truân tôi luyện bậc anh tài.',
      'Chân trời hé lộ tia mai ấm,',
      'Hạnh phúc tròn đầy đợi sớm mai.',
    ],
    meaning: 'Những dấu hiệu tích cực ban đầu đã xuất hiện. Công việc và dự án có tiến triển nhưng cần thêm thời gian để trưởng thành và gặt hái.',
    advice: 'Kiên nhẫn là chìa khóa vàng lúc này. Chớ đốt cháy giai đoạn để tránh những sơ sót không đáng có.',
    aspects: {
      love: 'Tình cảm chớm nở nhẹ nhàng, hãy để mọi việc diễn tiến tự nhiên, chớ vội vàng.',
      career: 'Dự án mới bắt đầu khởi động, chú trọng tích lũy và làm chắc từng khâu nhỏ.',
      wealth: 'Tài chính ở mức vừa đủ, nên có kế hoạch chi tiêu hợp lý và tiết kiệm.',
      health: 'Giữ ấm cơ thể khi thời tiết thay đổi, chú ý dinh dưỡng và ngủ đủ giấc.',
    },
    scores: {
      love: 79,
      career: 80,
      wealth: 75,
      health: 85,
    },
    numerology: {
      luckyNumber: 52,
      destinyNumber: 4,
      color: 'Trắng Ngà Washi',
      direction: 'Chính Tây',
      amulet: 'Bùa Bình An Omamori',
    },
    suitablePlans: ['mini', 'love'],
  },
  {
    id: 9,
    stickNumber: 61,
    rank: 'Bình An',
    kanjiRank: '吉',
    title: 'Quẻ Số 61: Tĩnh Tâm Tu Dưỡng',
    theme: 'An Định Nội Lực',
    summary: 'Giữ tâm bình lặng trước biến động, củng cố nền tảng nội tại, phúc lộc tự khắc tụ hội.',
    poem: [
      'Chùa xưa chuông điểm bóng tà dương,',
      'Gác lại âu lo giữa dặm trường.',
      'Tâm phẳng như gương đời bớt sóng,',
      'Mai về rạng rỡ ngát thơm hương.',
    ],
    meaning: 'Hiện tại thích hợp để nghỉ ngơi, nhìn nhận lại bản thân và củng cố nền tảng. Chớ vội vàng mưu cầu đại sự, hãy chú trọng gìn giữ hòa khí và gia đạo êm ấm.',
    advice: 'Nên dành thời gian thiền tịnh, dọn dẹp không gian sống và duy trì thói quen ngủ nghỉ điều độ.',
    aspects: {
      love: 'Lắng nghe và thấu hiểu nhiều hơn, dĩ hòa vi quý để giữ trọn vẹn sự êm ấm.',
      career: 'Giai đoạn củng cố vị trí, tránh mạo hiểm nhảy việc hay đưa ra quyết định hấp tấp.',
      wealth: 'Thu chi ổn định, kiểm soát ngân sách an toàn, tránh cho vay mượn rủi ro.',
      health: 'Thích hợp thanh lọc tâm trí, đi dạo hòa mình vào thiên nhiên để hồi phục sinh lực.',
    },
    scores: {
      love: 78,
      career: 76,
      wealth: 74,
      health: 92,
    },
    numerology: {
      luckyNumber: 61,
      destinyNumber: 2,
      color: 'Xanh Rêu Cổ Tự',
      direction: 'Chính Nam',
      amulet: 'Lá Bùa Trừ Tà Yakuyoke',
    },
    suitablePlans: ['mini', 'destiny'],
  }
];

export function getRandomFortune(plan: PlanType = 'mini'): OmikujiFortune {
  const filtered = OMIKUJI_DATABASE.filter(f => f.suitablePlans.includes(plan));
  const pool = filtered.length > 0 ? filtered : OMIKUJI_DATABASE;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
