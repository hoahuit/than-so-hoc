// Numerology & Daily Fortune Engine for Kami no Sū

export interface DailyFortuneInfo {
  dateString: string;
  luckyNumber: number;
  luckyColor: {
    name: string;
    hex: string;
    textHex: string;
  };
  direction: string;
  amulet: string;
  omikujiAdvice: string;
  element: string;
}

export interface NumerologyProfile {
  name: string;
  birthDate: string;
  lifePathNumber: number;
  soulUrgeNumber: number;
  expressionNumber: number;
  personalYear2026: number;
  archetype: string;
  element: string;
  personality: string;
  careerPath: string;
  loveAdvice: string;
  luckyNumbers: number[];
  luckyColors: string[];
}

const COLORS = [
  { name: 'Vàng Kim Quý Tộc', hex: '#f59e0b', textHex: '#fbbf24' },
  { name: 'Đỏ Chu Sa Cung Đình', hex: '#dc2626', textHex: '#ef4444' },
  { name: 'Hồng Đào Sakura', hex: '#ec4899', textHex: '#f472b6' },
  { name: 'Xanh Matcha Thiền', hex: '#10b981', textHex: '#34d399' },
  { name: 'Trắng Ngọc Trai', hex: '#e2e8f0', textHex: '#f8fafc' },
  { name: 'Tím Huyền Bí Onmyoji', hex: '#8b5cf6', textHex: '#a78bfa' },
  { name: 'Xanh Lam Cổ Kính', hex: '#0ea5e9', textHex: '#38bdf8' },
  { name: 'Cam Hoàng Hôn Torii', hex: '#f97316', textHex: '#fb923c' },
];

const DIRECTIONS = [
  'Đông Nam (Sinh Khí · Tài Lộc Vượng)',
  'Tây Bắc (Thiên Y · Quý Nhân Phò Trợ)',
  'Chính Đông (Phục Vị · Khởi Đầu Mới)',
  'Đông Bắc (Diên Niên · Tình Cảm Gắn Kết)',
  'Chính Nam (Hỷ Thần · Đào Hoa Rực Rỡ)',
  'Tây Nam (Văn Xương · Trí Tuệ Sáng Suốt)',
];

const AMULETS = [
  'Lá Bùa Omamori Bình An (Yakuyoke)',
  'Chuông Gió Thu Hút Tình Duyên (Musubi Suzu)',
  'Quạt Giấy Khảm Vàng Chiêu Tài (Sensu)',
  'Gương Bát Quái Xua Tà Khí (Yata Mirror)',
  'Đồng Tiền Xu Cổ Thần Tài Thất Phúc',
  'Tượng Mèo Thần Tài Vẫy Tay (Maneki Neko)',
  'Vòng Gỗ Trầm Hương Đền Thần',
];

const ELEMENTS = ['Hỏa (Lửa Đền Thần)', 'Thủy (Suối Nguồn Linh Thiêng)', 'Mộc (Rừng Trúc Ngàn Năm)', 'Kim (Gươm Báu Thần Linh)', 'Thổ (Đất Thiêng Cổ Tự)'];

// Deterministic hash from date to ensure stable daily reading
function hashDate(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function getDailyFortune(date: Date = new Date()): DailyFortuneInfo {
  const seed = hashDate(date);
  const luckyNumber = (seed % 99) + 1;
  const color = COLORS[seed % COLORS.length];
  const direction = DIRECTIONS[(seed >> 2) % DIRECTIONS.length];
  const amulet = AMULETS[(seed >> 3) % AMULETS.length];
  const element = ELEMENTS[(seed >> 1) % ELEMENTS.length];

  const dateString = date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  const adviceList = [
    'Hôm nay là thời điểm tuyệt vời để đón nhận luồng sinh khí mới, vạn sự hanh thông.',
    'Tránh vội vã quyết định lớn trước giờ Thân. Luôn mỉm cười để giữ vận đào hoa.',
    'Thần tài gõ cửa góc Đông Nam, hãy chú ý các cơ hội hợp tác xuất hiện bất ngờ.',
    'Giữ tâm bình lặng như mặt hồ phẳng lặng, điều may mắn sẽ tự khắc tìm đến bạn.',
    'Năng lượng vũ trụ hội tụ, rất thuận lợi để thi cử, phỏng vấn hoặc giải bày tâm tình.',
  ];

  return {
    dateString,
    luckyNumber,
    luckyColor: color,
    direction,
    amulet,
    omikujiAdvice: adviceList[seed % adviceList.length],
    element,
  };
}

// Letter to Pythagoras number mapping
const LETTER_MAP: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

function reduceToSingleOrMaster(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  if (num <= 9) return num;
  let sum = 0;
  let n = num;
  while (n > 0) {
    sum += n % 10;
    n = Math.floor(n / 10);
  }
  return reduceToSingleOrMaster(sum);
}

const ARCHETYPES: Record<number, {
  archetype: string;
  personality: string;
  careerPath: string;
  loveAdvice: string;
  element: string;
}> = {
  1: {
    archetype: 'Dũng Sĩ Tiên Phong (The Anime Vanguard)',
    personality: 'Khí chất thủ lĩnh bẩm sinh, ý chí kiên định như lưỡi gươm katana, luôn khát khao khai phá chân trời mới và bảo vệ đồng đội.',
    careerPath: 'Khởi nghiệp, Giám đốc điều hành, Đạo diễn sáng tạo, Trưởng nhóm công nghệ.',
    loveAdvice: 'Học cách lắng nghe và san sẻ quyền quyết định với người bạn đời để tình yêu thêm dịu dàng.',
    element: 'Hỏa Cực Thịnh',
  },
  2: {
    archetype: 'Phù Thủy Hòa Giải (The Empath Guardian)',
    personality: 'Trực giác tinh tế vượt trội, thấu cảm sâu sắc nỗi lòng người khác, mang đến bình yên cho mọi người xung quanh.',
    careerPath: 'Tâm lý học, Ngoại giao, Nghệ thuật, Chăm sóc sức khỏe, Hòa giải viên.',
    loveAdvice: 'Đừng quá hy sinh bản thân mà quên mất nhu cầu của chính mình, hãy yêu thương bản thân trọn vẹn.',
    element: 'Thủy Dịu Êm',
  },
  3: {
    archetype: 'Nghệ Sĩ Lôi Cuốn (The Charismatic Muse)',
    personality: 'Tâm hồn rực rỡ, lạc quan như ánh mặt trời, khiếu hài hước lôi cuốn và khả năng truyền cảm hứng mãnh liệt.',
    careerPath: 'Diễn viên, Nhà văn, Marketing, Content Creator, Thiết kế thời trang.',
    loveAdvice: 'Chân thành trong từng lời hứa sẽ giúp ngọn lửa tình yêu của bạn luôn rực cháy bền bỉ.',
    element: 'Mộc Phát Triển',
  },
  4: {
    archetype: 'Đại Tông Sư Kiến Thiết (The Master Architect)',
    personality: 'Thực tế, vững chãi như bàn thạch, kỷ luật thép và luôn có kế hoạch chu toàn cho mọi bước đi.',
    careerPath: 'Kiến trúc sư, Lập trình viên hệ thống, Quản trị tài chính, Nghiên cứu khoa học.',
    loveAdvice: 'Hãy mở rộng trái tim để đón nhận những bất ngờ thú vị ngoài kế hoạch của tình yêu.',
    element: 'Thổ Vững Vàng',
  },
  5: {
    archetype: 'Hiệp Khách Tự Do (The Free Wanderer)',
    personality: 'Khao khát tự do mãnh liệt, ưa thích phiêu lưu mạo hiểm, năng lượng dồi dào và thích nghi với mọi hoàn cảnh kỳ tài.',
    careerPath: 'Du lịch, Phóng viên, Thám hiểm, Truyền thông đa phương tiện, Đầu tư mạo hiểm.',
    loveAdvice: 'Tìm kiếm người bạn đời sẵn sàng cùng bạn khám phá thế giới thay vì gò bó trong khuôn phép.',
    element: 'Phong Linh Hoạt',
  },
  6: {
    archetype: 'Bảo Hộ Sứ Trái Tim (The Sacred Nurturer)',
    personality: 'Tình yêu thương vô bờ bến, trách nhiệm cao cả với gia đình và cộng đồng, luôn tạo ra tổ ấm ấm áp và an toàn.',
    careerPath: 'Giáo dục, Y tế, Thiết kế nội thất, Ẩm thực, Công tác xã hội.',
    loveAdvice: 'Hãy để đối phương cùng gánh vác, bạn không cần phải làm anh hùng đơn độc trong tình yêu.',
    element: 'Mộc Dưỡng Sinh',
  },
  7: {
    archetype: 'Ẩn Sĩ Chân Lý (The Mystic Sage)',
    personality: 'Tư duy sâu sắc triết lý, khao khát tìm hiểu quy luật vũ trụ, trực giác tâm linh huyền bí và khả năng chiêm nghiệm phi thường.',
    careerPath: 'Triết gia, Nhà khoa học lý thuyết, Phân tích dữ liệu, Chiêm tinh học, Thần số học.',
    loveAdvice: 'Mở cửa tâm hồn để đối phương hiểu được thế giới nội tâm phong phú của bạn.',
    element: 'Kim Sắc Sảo',
  },
  8: {
    archetype: 'Chúa Tể Vương Quyền (The Sovereign Strategist)',
    personality: 'Tầm nhìn chiến lược vĩ mô, năng lực lãnh đạo tài chính xuất chúng, thu hút thịnh vượng và uy quyền tự nhiên.',
    careerPath: 'Nhà tài phiệt, Doanh nhân bất động sản, Quản lý quỹ, Luật sư tranh tụng.',
    loveAdvice: 'Cân bằng giữa công việc và tình cảm, đừng để danh vọng lấn át sự ấm áp gia đình.',
    element: 'Kim Hoàng Kim',
  },
  9: {
    archetype: 'Sứ Giả Nhân Đạo (The Cosmic Healer)',
    personality: 'Lòng từ bi rộng lớn, tầm nhìn bao quát toàn cầu, luôn muốn chữa lành vết thương cho nhân loại và thiên nhiên.',
    careerPath: 'Tổ chức phi chính phủ, Nghệ thuật nhân đạo, Bác sĩ không biên giới, Nhà hoạt động bảo vệ môi trường.',
    loveAdvice: 'Hãy buông bỏ những kỳ vọng quá lý tưởng hóa để đón nhận vẻ đẹp đời thường của người thương.',
    element: 'Hỏa Quang Minh',
  },
  11: {
    archetype: 'Bậc Thầy Khai Sáng (The Master Illuminator)',
    personality: 'Con số bậc thầy tâm linh! Linh cảm siêu phàm, cây cầu nối giữa trần thế và năng lượng thần thánh bí ẩn.',
    careerPath: 'Người truyền cảm hứng, Nhà tâm linh, Nghệ sĩ thiên tài, Giáo sư tri thức mới.',
    loveAdvice: 'Tìm tri kỷ có cùng tần số tâm linh để cùng nhau soi sáng con đường vận mệnh.',
    element: 'Lôi Điện Quang',
  },
  22: {
    archetype: 'Kiến Trúc Sư Thế Giới (The Master Builder)',
    personality: 'Khả năng biến những giấc mơ vĩ đại nhất thành hiện thực hữu hình trên cõi đời, bản lĩnh phi thường.',
    careerPath: 'Nhà kiến tạo đô thị, Lãnh tụ phong trào lớn, Tập đoàn quốc tế, Công trình lịch sử.',
    loveAdvice: 'Gìn giữ sự bình yên trong tổ ấm làm hậu phương vững chắc cho sự nghiệp lớn.',
    element: 'Địa Linh Bất Diệt',
  },
  33: {
    archetype: 'Chân Sư Đại Từ Bi (The Master Avatar)',
    personality: 'Đỉnh cao của sự cống hiến và tình yêu đại đồng, lan tỏa tần số chữa lành mạnh mẽ nhất trong vũ trụ.',
    careerPath: 'Nhà tư tưởng vĩ đại, Nhà giáo mẫu mực, Nghệ sĩ hàn gắn tâm hồn.',
    loveAdvice: 'Yêu thương vô điều kiện nhưng vẫn giữ gìn ranh giới để năng lượng bản thân không bị cạn kiệt.',
    element: 'Thần Quang Vĩnh Cửu',
  },
};

export function calculateNumerology(name: string, birthDateStr: string): NumerologyProfile {
  // Parse birthdate: YYYY-MM-DD
  const parts = birthDateStr.split('-');
  const year = parseInt(parts[0], 10) || 2000;
  const month = parseInt(parts[1], 10) || 1;
  const day = parseInt(parts[2], 10) || 1;

  // Life Path Number
  const sumDigits = (n: number) => {
    let s = 0;
    while (n > 0) {
      s += n % 10;
      n = Math.floor(n / 10);
    }
    return s;
  };

  const daySum = reduceToSingleOrMaster(sumDigits(day));
  const monthSum = reduceToSingleOrMaster(sumDigits(month));
  const yearSum = reduceToSingleOrMaster(sumDigits(year));
  const lifePathNumber = reduceToSingleOrMaster(daySum + monthSum + yearSum);

  // Clean Name
  const cleanName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");

  // Soul Urge (Vowels)
  let soulSum = 0;
  let exprSum = 0;
  for (const char of cleanName) {
    const val = LETTER_MAP[char] || 0;
    exprSum += val;
    if (VOWELS.has(char)) {
      soulSum += val;
    }
  }

  const soulUrgeNumber = reduceToSingleOrMaster(soulSum > 0 ? soulSum : 7);
  const expressionNumber = reduceToSingleOrMaster(exprSum > 0 ? exprSum : 9);

  // Personal Year for 2026: Day + Month + Universal Year 2026 (2+0+2+6 = 10 -> 1)
  const universalYear2026 = 1; // 2+0+2+6 = 10 -> 1
  const personalYear2026 = reduceToSingleOrMaster(daySum + monthSum + universalYear2026);

  const profileData = ARCHETYPES[lifePathNumber] || ARCHETYPES[8];

  return {
    name: name.trim() || 'Người Hành Hương Bí Ẩn',
    birthDate: birthDateStr,
    lifePathNumber,
    soulUrgeNumber,
    expressionNumber,
    personalYear2026,
    archetype: profileData.archetype,
    element: profileData.element,
    personality: profileData.personality,
    careerPath: profileData.careerPath,
    loveAdvice: profileData.loveAdvice,
    luckyNumbers: [lifePathNumber, (lifePathNumber * 3) % 99 + 1, personalYear2026 * 7],
    luckyColors: ['Đỏ Chu Sa', 'Vàng Hoàng Kim', 'Tím Trăng Máu'],
  };
}
