export type FortuneRank = 'Đại Cát' | 'Thượng Cát' | 'Trung Cát' | 'Tiểu Cát' | 'Bình An';
export type KanjiRank = '大吉' | '上吉' | '中吉' | '小吉' | '吉';
export type PlanType = 'mini' | 'love' | 'destiny';

export interface FortuneAspects {
  love: string;
  career: string;
  wealth: string;
  health: string;
}

export interface FortuneDeepUnlock {
  rootCause: string;
  next30Days: string;
  actionSteps: string[];
}

export interface OmikujiFortune {
  id: number;
  stickNumber: number;
  rank: FortuneRank;
  kanjiRank: KanjiRank;
  title: string;
  theme: string;
  summary: string;
  poem: string[];
  meaning: string;
  advice: string;
  /** Phase 3: 4-layer empathetic structure (safe free depth, leaves desire to unlock/ask deeper) */
  mirrorMood?: string;
  careerInsight?: string;
  loveInsight?: string;
  closingAdvice?: string;
  deepUnlock?: FortuneDeepUnlock;
  aspects: FortuneAspects;
  scores: {
    love: number;
    career: number;
    wealth: number;
    health: number;
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
    badge: 'ĐẠI CÁT · KHAI THÔNG CHUYỂN MÌNH',
    kanji: '大吉',
    vibe: 'Khoảng lặng đang dần mở lối, bước ngoặt nhỏ sắp đưa bạn ra khỏi nhịp chững lại.',
  },
  'Thượng Cát': {
    color: 'text-temple-700',
    bgColor: 'bg-temple-50',
    borderColor: 'border-temple-600',
    badge: 'THƯỢNG CÁT · TÍN HIỆU RÕ DẦN',
    kanji: '上吉',
    vibe: 'Gió lành bắt đầu thổi qua những điều bạn đã âm thầm gồng gánh suốt thời gian qua.',
  },
  'Trung Cát': {
    color: 'text-temple-800',
    bgColor: 'bg-temple-50/70',
    borderColor: 'border-temple-700',
    badge: 'TRUNG CÁT · GIỮ NHỊP CHỜ THỜI',
    kanji: '中吉',
    vibe: 'Chững lại không phải thụt lùi — đây là khoảng dừng cần thiết để tránh bước sai nhịp.',
  },
  'Tiểu Cát': {
    color: 'text-brass-700',
    bgColor: 'bg-brass-50',
    borderColor: 'border-brass-400',
    badge: 'TIỂU CÁT · MỞ NÚT THẮT NHẸ',
    kanji: '小吉',
    vibe: 'Sự im lặng kéo dài sắp có hồi đáp nhỏ, nhưng bạn cần chỉnh lại cách giữ sức.',
  },
  'Bình An': {
    color: 'text-ink-muted',
    bgColor: 'bg-washi-100',
    borderColor: 'border-washi-300',
    badge: 'BÌNH AN · TĨNH TÂM SOI CHIẾU',
    kanji: '吉',
    vibe: 'Đừng ép câu trả lời ngay hôm nay; khi tâm bớt rối, nút thắt tự khắc lộ hướng gỡ.',
  },
};

export const OMIKUJI_DATABASE: OmikujiFortune[] = [
  {
    id: 1,
    stickNumber: 28,
    rank: 'Trung Cát',
    kanjiRank: '中吉',
    title: 'Khoảng Lặng Trước Khi Chuyển Mình',
    theme: 'Gồng gánh âm thầm & Chững nhịp',
    summary: 'Bên ngoài bạn vẫn xoay xở ổn thỏa, nhưng bên trong đã mỏi vì phải tự gồng nhiều thứ một mình giữa giai đoạn chững lại.',
    poem: [
      'Ngoài mặt an nhiên giữ nhịp đời,',
      'Trong lòng bao nỗi chẳng thành lời.',
      'Chững lại một nhịp cho bớt mỏi,',
      'Gió mới đang về cuối chân trời.',
    ],
    meaning: 'Dạo gần đây bạn đang ở trong một khoảng chững khá rõ: vẫn làm việc, vẫn gánh trách nhiệm, nhưng cảm giác cạn pin vì mọi thứ cứ lửng lơ chưa bật hẳn lên. Bạn phân vân giữa việc tiếp tục kiên nhẫn hay rẽ sang hướng khác, trong khi tín hiệu bên ngoài vẫn im lặng kéo dài.',
    advice: 'Khoảng chững lại này không phải để làm bạn nản lòng, mà để bạn dừng việc bước tiếp theo quán tính. Đừng vội quyết định lớn khi tinh thần đang mệt.',
    mirrorMood:
      'Có lẽ dạo gần đây bạn đang rơi vào trạng thái quen thuộc: bên ngoài vẫn tỏ ra ổn và tự xoay xở hết mọi việc, nhưng bên trong lại khá mệt vì phải gồng gánh một mình. Bạn muốn có một sự thay đổi rõ ràng hơn, nhưng hiện tại vẫn là cảm giác chững lại, đứng giữa nhiều lựa chọn mà chưa dám chốt hẳn.',
    careerInsight:
      'Nhịp công việc chưa hẳn xấu nhưng đang kẹt ở chỗ bạn ôm quá nhiều việc lặp lại hoặc chờ sự phản hồi từ người khác. Đây là lúc nên giữ sức và cân đối lại cách làm; nếu chuẩn bị hợp tác hay ký kết, hãy chú ý các cam kết ngầm thay vì tin lời hứa chung chung.',
    loveInsight:
      'Trong chuyện tình cảm hoặc mối quan hệ gần gũi đang có một khoảng im lặng khó gọi tên — không hẳn là hết quan tâm, mà là có điều cả hai đang mập mờ hoặc né tránh nói thẳng vì sợ làm mất hòa khí.',
    closingAdvice:
      'Đừng tự ép mình phải giải quyết xong mọi ngã rẽ trong một đêm. Chỉ cần nhận ra bạn đang mệt ở khâu nào và tạm ngưng gồng thay phần người khác, cục diện sẽ bắt đầu nhẹ đi.',
    deepUnlock: {
      rootCause:
        'Nút thắt gốc nằm ở việc bạn đặt tiêu chuẩn tự lực quá cao, ngại nhờ vả và đang dồn năng lượng vào một cam kết/công việc tỷ lệ hoàn vốn cảm xúc thấp.',
      next30Days:
        'Từ ngày 12 đến ngày 24 tới sẽ xuất hiện một cuộc trao đổi hoặc tin nhắn làm rõ hướng đi. Nếu bạn giữ được ranh giới rõ ràng ngay từ tuần này, cơ hội dịch chuyển tích cực sẽ rơi vào nửa cuối tháng.',
      actionSteps: [
        'Nên làm: Rà soát lại 1 đầu việc hoặc mối quan hệ đang hút sức nhiều nhất và giảm bớt 30% mức đầu tư cảm xúc.',
        'Nên tránh: Chốt hợp tác mới hoặc đưa ra lời hứa tài chính dài hạn trong 10 ngày tới khi dữ kiện chưa đủ minh bạch.',
        'Tín hiệu cần để ý: Một lời đề nghị quay lại hoặc gợi ý từ người quen cũ vào cuối tuần.',
      ],
    },
    aspects: {
      career: 'Công việc đang kẹt nhịp vì ôm đồm; cần giữ sức và rà kỹ điều khoản trước khi hợp tác hoặc đổi hướng.',
      wealth: 'Tài chính ở mức cầm chừng, nên giữ tiền mặt an toàn, tránh chi tiêu cảm xúc để giải tỏa stress.',
      love: 'Có khoảng cách hoặc sự mập mờ chưa nói rõ; một bên đang chờ bên kia lên tiếng trước.',
      health: 'Cơ thể báo hiệu thiếu ngủ sâu và căng vai gáy do suy nghĩ nhiều vào ban đêm.',
    },
    scores: {
      love: 76,
      career: 81,
      wealth: 79,
      health: 74,
    },
    numerology: {
      luckyNumber: 28,
      destinyNumber: 1,
      color: 'Đỏ Son Ấm Áp',
      direction: 'Chính Đông',
      amulet: 'Bùa Tĩnh Tâm Asakusa',
    },
    suitablePlans: ['mini', 'love', 'destiny'],
  },
  {
    id: 2,
    stickNumber: 68,
    rank: 'Tiểu Cát',
    kanjiRank: '小吉',
    title: 'Đứng Giữa Hai Ngã Rẽ Chưa Tên',
    theme: 'Phân vân lựa chọn & Mập mờ',
    summary: 'Bạn biết mình không thể đứng mãi ở chỗ cũ, nhưng vẫn thiếu một lý do đủ chắc để bước hẳn sang hướng mới.',
    poem: [
      'Ngã ba sương phủ bóng chiều tà,',
      'Nửa muốn dừng chân, nửa muốn qua.',
      'Chớ hỏi gió mây bao giờ dứt,',
      'Hỏi lòng còn giữ chút thiết tha?',
    ],
    meaning: 'Tâm trạng hiện tại có nhiều giằng co giữa lý trí an toàn và mong muốn thoát khỏi sự tẻ nhạt hiện tại. Sự im lặng từ đối phương hoặc từ công việc khiến bạn hay tự đặt câu hỏi liệu mình có đang đợi nhầm chỗ hay không.',
    advice: 'Không chọn cũng là một lựa chọn đang âm thầm lấy đi năng lượng mỗi ngày. Hãy thu hẹp câu hỏi lại thay vì cố nhìn hết cả năm.',
    mirrorMood:
      'Bạn đang ở đúng cảm giác "tiến chưa nỡ, buông chưa đành". Rất nhiều ngày trôi qua trong trạng thái làm cho tròn vai, còn trong đầu vẫn lấn cấn về một lựa chọn dang dở mà bạn chưa dám nói rõ với ai.',
    careerInsight:
      'Điểm nghẽn sự nghiệp nằm ở sự phân tán — bạn thấy nhiều hướng có tiềm năng nhưng chưa dứt khoát đặt cược vào hướng nào. Cơ hội ẩn giấu đang nằm ở một kỹ năng phụ bạn từng bỏ dở; hãy cân đối lại lịch làm việc trước khi nhận thêm trách nhiệm mới.',
    loveInsight:
      'Trong mối quan hệ đang có sự mập mờ hoặc lệch nhịp: bạn cho đi sự kiên nhẫn, nhưng lại lờ đi câu hỏi lớn nhất về tương lai chung vì sợ chạm vào khoảng cách thật giữa hai người.',
    closingAdvice:
      'Trước khi tìm câu trả lời từ người khác, hãy tự hỏi điều gì đang khiến bạn sợ thay đổi nhất: mất sự quen thuộc hay sợ bắt đầu lại?',
    deepUnlock: {
      rootCause:
        'Sự do dự đến từ việc bạn muốn giữ cả hai phương án cùng lúc để tránh cảm giác hụt hẫng, vô tình khiến cả công việc lẫn tình cảm đều bị treo lưng chừng.',
      next30Days:
        'Trong 2 tuần tới có một tình huống nhỏ buộc bạn phải chọn ưu tiên. Khoảnh khắc bạn nói rõ giới hạn của mình cũng là lúc người phù hợp hoặc cơ hội đúng lộ diện.',
      actionSteps: [
        'Nên làm: Viết ra 2 lựa chọn hiện tại và cho mỗi lựa chọn một hạn chót cụ thể (ví dụ 21 ngày).',
        'Nên tránh: Im lặng chịu đựng rồi tự suy diễn ý nghĩ của đối phương hoặc sếp.',
        'Tín hiệu cần để ý: Cuộc trò chuyện ngắn vào buổi tối giúp lộ rõ thái độ thật của người kia.',
      ],
    },
    aspects: {
      love: 'Đang có sự mập mờ hoặc né tránh nói thẳng; giữ im lặng quá lâu chỉ làm khoảng cách xa thêm.',
      career: 'Có cơ hội chuyển hướng nhưng cần dọn bớt việc phụ mới đủ sức nắm bắt.',
      wealth: 'Tiền bạc vào ra thất thường nhẹ, tránh đầu tư theo số đông lúc tâm lý chưa vững.',
      health: 'Dễ mệt mỏi tinh thần vào cuối ngày; nên giảm lướt tin tức tiêu cực trước khi ngủ.',
    },
    scores: {
      love: 72,
      career: 78,
      wealth: 75,
      health: 80,
    },
    numerology: {
      luckyNumber: 68,
      destinyNumber: 6,
      color: 'Hồng Đào Sakura',
      direction: 'Đông Nam',
      amulet: 'Chuông Gió Khai Tâm',
    },
    suitablePlans: ['love', 'mini'],
  },
  {
    id: 3,
    stickNumber: 88,
    rank: 'Thượng Cát',
    kanjiRank: '上吉',
    title: 'Giữ Sức Qua Đoạn Khúc Quanh',
    theme: 'Cơ hội ẩn sau áp lực tài chính & công việc',
    summary: 'Áp lực vật chất và công việc khiến bạn hơi căng, nhưng bên dưới bề mặt chững lại đang hình thành một lối mở thực tế.',
    poem: [
      'Đá ngầm dưới suối nước còn vương,',
      'Chớ vội chê dòng chảy chậm đường.',
      'Giữ vững tay chèo qua đoạn khúc,',
      'Sớm ngày bến rộng đón vầng dương.',
    ],
    meaning: 'Bạn đã nỗ lực khá bền bỉ nhưng kết quả gần đây chưa tương xứng với công sức bỏ ra. Điều đó dễ khiến bạn nghi ngờ hướng đi của mình, dù thực tế chu kỳ chuyển biến tốt đang bắt đầu tích tụ.',
    advice: 'Lúc này không cần cố chạy nhanh hơn, mà cần bỏ bớt những đầu việc không sinh giá trị để dồn lực cho điểm chạm đúng.',
    mirrorMood:
      'Cảm giác lớn nhất của bạn lúc này là "mình đã cố rất nhiều nhưng sao mọi thứ vẫn chậm hơn kỳ vọng". Nỗi lo cơm áo, KPI hay kế hoạch cá nhân khiến bạn hiếm khi thật sự thả lỏng đầu óc kể cả vào cuối tuần.',
    careerInsight:
      'Điểm nghẽn nằm ở cách làm cũ đã hết dư địa tăng trưởng, không phải vì bạn kém năng lực. Cơ hội ẩn giấu sẽ đến qua một lời giới thiệu hoặc một dự án nhỏ tưởng chừng bình thường — hãy cẩn trọng khâu chia quyền lợi khi hợp tác.',
    loveInsight:
      'Vì áp lực công việc đè nặng nên bạn vô tình thu mình lại, ít chia sẻ cảm xúc thật với người thân cận. Sự xa cách gần đây phần nhiều đến từ kiệt sức chứ chưa hẳn do hết thương.',
    closingAdvice:
      'Tiền bạc và cơ hội cần một tinh thần tỉnh táo mới giữ được. Hãy cho mình một buổi tối thật sự ngắt kết nối công việc để nhìn lại bức tranh lớn.',
    deepUnlock: {
      rootCause:
        'Bạn đang dùng 80% thời gian xử lý việc phát sinh vụn vặt nên không còn dư địa cho việc tạo ra nguồn thu hoặc bước nhảy mới.',
      next30Days:
        'Sau mốc 15 ngày tới, dòng tiền hoặc tiến độ công việc bắt đầu nhích lên qua một đầu mối quen biết. Người từng làm việc chung có thể nhắc tên bạn.',
      actionSteps: [
        'Nên làm: Chốt lại 1 thế mạnh dễ tạo ra tiền mặt nhanh nhất trong 30 ngày thay vì ôm kế hoạch quá lớn.',
        'Nên tránh: Cho vay mượn hoặc góp vốn cảm tính khi chưa có văn bản rõ ràng.',
        'Tín hiệu cần để ý: Một cuộc gọi hoặc tin nhắn hỏi thăm công việc tưởng như xã giao.',
      ],
    },
    aspects: {
      love: 'Dễ lạnh nhạt do bận rộn và giữ mệt mỏi một mình; một lời hỏi thăm thật lòng sẽ làm dịu lại.',
      career: 'Cơ hội ẩn trong mạng lưới quen biết; cần rà soát lại cách làm để bớt kiệt sức.',
      wealth: 'Dòng tiền chậm nhưng chắc; giữ kỷ luật chi tiêu thêm 3 tuần sẽ thấy nhẹ gánh.',
      health: 'Chú ý dạ dày và nhịp ăn uống thất thường khi chạy tiến độ.',
    },
    scores: {
      love: 77,
      career: 88,
      wealth: 86,
      health: 78,
    },
    numerology: {
      luckyNumber: 88,
      destinyNumber: 8,
      color: 'Vàng Đồng Cổ Asakusa',
      direction: 'Tây Bắc',
      amulet: 'Đồng Xu Cổ Tụ Lộc',
    },
    suitablePlans: ['mini', 'destiny'],
  },
  {
    id: 4,
    stickNumber: 18,
    rank: 'Bình An',
    kanjiRank: '吉',
    title: 'Im Lặng Kéo Dài Đợi Câu Trả Lời',
    theme: 'Khoảng lặng & Chữa lành nội lực',
    summary: 'Sự im lặng kéo dài khiến bạn bồn chồn, nhưng ép mọi thứ trả lời ngay lúc này lại chỉ làm rối thêm.',
    poem: [
      'Chuông chùa ngân khẽ giữa chiều sương,',
      'Đợi một hồi âm suốt dặm trường.',
      'Tâm tĩnh như hồ không gợn sóng,',
      'Tự nhiên nhìn rõ lối quay đường.',
    ],
    meaning: 'Bạn đang chờ một tín hiệu rõ ràng từ công việc hoặc một người quan trọng, nhưng sự im lặng kéo dài làm lòng bạn bất an. Quẻ này nhắc bạn tạm rút sự chú ý khỏi nơi đang im lặng để quay về củng cố nền tảng của chính mình.',
    advice: 'Giá trị của bạn không phụ thuộc vào tốc độ hồi đáp của người khác. Khi bạn đứng vững lại, thế chủ động sẽ quay về tay bạn.',
    mirrorMood:
      'Điều khiến bạn hao tâm tổn trí nhất dạo này không phải là biến cố lớn, mà là sự im lặng kéo dài — chờ một phản hồi, chờ một thái độ rõ ràng, chờ tình hình khá hơn nhưng ngày nào trôi qua cũng thấy giống nhau.',
    careerInsight:
      'Dự án hoặc hồ sơ đang ở trạng thái chờ duyệt/chờ thị trường. Đừng dồn toàn bộ hy vọng vào một cửa duy nhất; hãy âm thầm chuẩn bị phương án dự phòng để không bị động nếu tiến độ kéo dài thêm.',
    loveInsight:
      'Khoảng cách trong mối quan hệ đang lớn dần vì cả hai đều sợ mở lời trước sẽ bị hụt hẫng. Điều bạn đang lờ đi là câu hỏi: nếu tình trạng này giữ nguyên thêm 3 tháng nữa, bạn có thật sự ổn không?',
    closingAdvice:
      'Ngừng kiểm tra tín hiệu từ bên ngoài trong vài ngày tới. Quay về sắp xếp lại nhịp sống của mình chính là cách đổi vận nhanh nhất lúc này.',
    deepUnlock: {
      rootCause:
        'Bạn đang trao quyền quyết định tâm trạng mỗi ngày của mình cho phản ứng của một người hoặc một kết quả chưa chắc chắn.',
      next30Days:
        'Khoảng 10 ngày tới vẫn khá tĩnh, nhưng cuối chu kỳ 30 ngày sẽ có tín hiệu dứt khoát giúp bạn không còn phải đoán già đoán non nữa.',
      actionSteps: [
        'Nên làm: Mở thêm 1 phương án dự phòng cho công việc/thu nhập để tâm lý bớt phụ thuộc.',
        'Nên tránh: Nhắn tin hỏi dồn hoặc đưa ra tối hậu thư trong lúc cảm xúc đang tủi thân.',
        'Tín hiệu cần để ý: Cảm giác nhẹ nhõm bất ngờ khi bạn quyết định đặt ranh giới cho riêng mình.',
      ],
    },
    aspects: {
      love: 'Im lặng kéo dài tạo suy diễn; cần nhìn thẳng xem mình đang đợi vì thương hay vì tiếc.',
      career: 'Tiến độ chậm khách quan; hợp để nâng cấp kỹ năng và mở thêm phương án phụ.',
      wealth: 'Giữ nguyên trạng an toàn, không nên mạo hiểm gỡ gạc trong giai đoạn tâm lý sốt ruột.',
      health: 'Thích hợp đi bộ tối, giảm caffeine và thư giãn hệ thần kinh.',
    },
    scores: {
      love: 73,
      career: 75,
      wealth: 76,
      health: 89,
    },
    numerology: {
      luckyNumber: 18,
      destinyNumber: 7,
      color: 'Xanh Trầm Sensoji',
      direction: 'Chính Bắc',
      amulet: 'Bùa Bình An Omamori',
    },
    suitablePlans: ['mini', 'love'],
  },
  {
    id: 5,
    stickNumber: 77,
    rank: 'Đại Cát',
    kanjiRank: '大吉',
    title: 'Quý Nhân Mở Nút Thắt Đúng Lúc',
    theme: 'Tín hiệu sáng sau chuỗi ngày tự xoay',
    summary: 'Sau quãng thời gian tự xoay xở một mình, sắp có một người hoặc một thông tin đúng lúc giúp bạn gỡ nút thắt.',
    poem: [
      'Đêm dài sương lạnh bước đơn côi,',
      'Chợt thấy đèn xa rạng cuối đồi.',
      'Một tiếng đồng lòng qua khúc khó,',
      'Mây mù tan biến, nắng lên ngôi.',
    ],
    meaning: 'Dù hiện tại bạn vẫn thấy hơi nặng đầu vì nhiều việc chưa xong, năng lượng cô độc sắp kết thúc. Một người có kinh nghiệm hoặc một mối quan hệ thiện lành sẽ mang đến góc nhìn giúp bạn sáng ra.',
    advice: 'Đừng giữ hết mọi khó khăn trong lòng vì sĩ diện hay sợ làm phiền; mở lời đúng người lúc này sẽ tiết kiệm cho bạn cả tháng tự mò mẫm.',
    mirrorMood:
      'Bạn vốn quen tự giải quyết mọi việc từ đầu đến cuối, nên khi gặp chuyện chững lại, phản xạ đầu tiên của bạn là tự gồng và giấu kín. Nhưng sâu bên trong, bạn đang rất mong có ai đó thật sự hiểu và san sẻ cùng mình.',
    careerInsight:
      'Cơ hội ẩn giấu nằm ở sự kết nối: một lời khuyên từ tiền bối, đồng nghiệp cũ hoặc khách hàng cũ có thể mở ra hướng giải quyết điểm nghẽn hiện tại. Tuy vậy, vẫn cần phân rõ trách nhiệm trước khi hợp tác chung.',
    loveInsight:
      'Có tín hiệu ấm lại từ một cuộc trò chuyện chân thành, hoặc nếu độc thân, bạn dễ gặp người nói chuyện rất hợp tần số trong bối cảnh tự nhiên (công việc, lớp học, bạn bè giới thiệu).',
    closingAdvice:
      'Cánh cửa sắp mở nằm ở chữ "kết nối". Hãy trả lời tin nhắn hoặc chủ động kết nối lại với một người bạn từng quý mến.',
    deepUnlock: {
      rootCause:
        'Bạn mất nhiều thời gian không phải vì thiếu năng lực mà vì tự đóng khung mình trong góc nhìn cũ quá lâu.',
      next30Days:
        'Trong 14–21 ngày tới, một cuộc gặp hoặc cuộc gọi không hẹn trước sẽ mang đến gợi ý quan trọng cho bước tiếp theo.',
      actionSteps: [
        'Nên làm: Chủ động hỏi ý kiến 1 người đi trước đáng tin về vấn đề bạn đang phân vân.',
        'Nên tránh: Từ chối lời mời gặp gỡ chỉ vì ngại giao tiếp khi đang mệt.',
        'Tín hiệu cần để ý: Một lời khen hoặc lời gợi ý hợp tác nhẹ từ người ít khi nói nhiều.',
      ],
    },
    aspects: {
      love: 'Dễ có sự sẻ chia thật lòng; người độc thân có duyên gặp gỡ qua kết nối quen biết.',
      career: 'Gỡ được điểm nghẽn nhờ góc nhìn mới; chú ý làm rõ vai trò khi cộng tác.',
      wealth: 'Tài lộc cải thiện dần nhờ mạng lưới uy tín và khách hàng giới thiệu.',
      health: 'Tinh thần nhẹ nhõm hơn rõ rệt khi trút được gánh nặng tâm lý.',
    },
    scores: {
      love: 91,
      career: 93,
      wealth: 89,
      health: 90,
    },
    numerology: {
      luckyNumber: 77,
      destinyNumber: 11,
      color: 'Đỏ Rượu Vang',
      direction: 'Tây Nam',
      amulet: 'Quạt Giấy Khảm Vàng',
    },
    suitablePlans: ['mini', 'love', 'destiny'],
  },
  {
    id: 6,
    stickNumber: 36,
    rank: 'Thượng Cát',
    kanjiRank: '上吉',
    title: 'Rà Lại Cách Làm Để Bứt Nhịp',
    theme: 'Chuyển hướng thông minh & Chắt lọc',
    summary: 'Bạn không thiếu nỗ lực — bạn chỉ đang dùng sức vào nơi không còn tạo ra đòn bẩy nữa.',
    poem: [
      'Cánh hạc dừng chao ngắm hướng mây,',
      'Đổi chiều theo gió nhẹ đôi tay.',
      'Chẳng cần gắng sức ngược dòng mãi,',
      'Thuận thế xoay vần ắt đổi thay.',
    ],
    meaning: 'Quẻ báo hiệu sự tỉnh táo đang quay lại. Thay vì tiếp tục cố chấp với một kế hoạch đang ì ạch, bạn bắt đầu nhìn thấy đâu là chỗ cần cắt bỏ và đâu là chỗ nên tập trung.',
    advice: 'Bỏ bớt 2 việc kém hiệu quả quan trọng hơn cố nhồi thêm 1 việc mới vào lịch trình đã quá tải.',
    mirrorMood:
      'Có lẽ bạn từng tự hỏi vì sao mình làm việc chăm chỉ không kém ai mà kết quả vẫn cứ lưng chừng. Cảm giác hơi nản và muốn sắp xếp lại toàn bộ cuộc sống đang lớn dần trong bạn vài tuần gần đây.',
    careerInsight:
      'Điểm nghẽn là cách phân bổ thời gian và giá trị công sức. Đây là thời điểm tốt để đàm phán lại phạm vi công việc, nâng đơn giá dịch vụ hoặc chuyển trọng tâm sang mảng bạn thật sự giỏi.',
    loveInsight:
      'Bạn đang bắt đầu nhìn rõ hơn điều mình cần ở một mối quan hệ, không còn dễ dãi bỏ qua những lần thất vọng nhỏ như trước nữa.',
    closingAdvice:
      'Sự rõ ràng với chính mình là khởi đầu của may mắn mới. Đừng tiếc công cũ nếu nó đang giữ chân phiên bản tốt hơn của bạn.',
    deepUnlock: {
      rootCause:
        'Bạn duy trì thói quen "làm cho xong hết" thay vì chọn đúng việc tạo ra giá trị cốt lõi, dẫn đến kiệt lực âm thầm.',
      next30Days:
        'Tuần thứ 2–3 sắp tới rất thuận cho việc phỏng vấn, đổi phương án làm việc hoặc ra mắt một thay đổi nhỏ nhưng trúng nhu cầu.',
      actionSteps: [
        'Nên làm: Dành 30 phút liệt kê việc nào tạo ra 80% kết quả thực tế và ưu tiên nó vào buổi sáng.',
        'Nên tránh: So sánh tốc độ của mình với người khác trên mạng xã hội.',
        'Tín hiệu cần để ý: Một ý tưởng từng bị bạn gạt qua bỗng xuất hiện lại với cơ hội thực tế hơn.',
      ],
    },
    aspects: {
      love: 'Thẳng thắn với nhu cầu của bản thân giúp mối quan hệ lành mạnh hoặc sàng lọc đúng người.',
      career: 'Rất tốt để chỉnh chiến lược, thi cử, phỏng vấn hoặc tái cơ cấu công việc.',
      wealth: 'Thu nhập cải thiện khi bạn cắt giảm khoản rò rỉ và định giá đúng năng lực.',
      health: 'Thư giãn mắt và vai cổ, tránh làm việc khuya liên tục nhiều ngày.',
    },
    scores: {
      love: 80,
      career: 92,
      wealth: 87,
      health: 84,
    },
    numerology: {
      luckyNumber: 36,
      destinyNumber: 3,
      color: 'Vàng Kim Hoàng Gia',
      direction: 'Đông Bắc',
      amulet: 'Bút Trâm Khai Trí',
    },
    suitablePlans: ['mini', 'destiny'],
  },
  {
    id: 7,
    stickNumber: 52,
    rank: 'Tiểu Cát',
    kanjiRank: '小吉',
    title: 'Mầm Xanh Hé Lộ Giữa Mùa Lạnh',
    theme: 'Khởi động lại từ bước nhỏ',
    summary: 'Chưa có cú nhảy vọt ngay, nhưng những dấu hiệu hồi phục đầu tiên đã bắt đầu nhú lên lặng lẽ.',
    poem: [
      'Tuyết mỏng vương trên nụ sớm mai,',
      'Âm thầm gom nhựa chẳng phô phai.',
      'Chớ chê bước nhỏ chưa thành lớn,',
      'Nắng ấm qua rồi nở đóa mai.',
    ],
    meaning: 'Sau giai đoạn mệt mỏi kéo dài, bạn không nên ép mình bật dậy mạnh mẽ ngay lập tức. Hãy coi đây là giai đoạn khởi động lại nhẹ nhàng: từng việc nhỏ trôi chảy sẽ kéo sự tự tin quay trở lại.',
    advice: 'Kiên nhẫn giữ nhịp đều trong 2 tuần tới, tránh đốt cháy giai đoạn hay kỳ vọng kết quả tức thì.',
    mirrorMood:
      'Bạn không hẳn là tuyệt vọng, chỉ là hơi chênh vênh vì chưa thấy tín hiệu bứt phá rõ rệt. Cảm giác sống chậm lại một chút vừa làm bạn nhẹ lòng, vừa khiến bạn hơi lo mình bị tụt lại phía sau.',
    careerInsight:
      'Công việc mới hoặc hướng đi mới đang ở giai đoạn gieo mầm, cần làm chắc từng khâu nhỏ. Nếu hợp tác mới, hãy thử nghiệm quy mô nhỏ trước khi dốc toàn bộ vốn hoặc thời gian.',
    loveInsight:
      'Tình cảm có dấu hiệu nhẹ nhàng hơn nếu cả hai bớt đòi hỏi hoàn hảo. Với người độc thân, sự cởi mở từ tốn sẽ an toàn và bền hơn những rung động vội vàng.',
    closingAdvice:
      'Đừng coi thường những ngày bình thường không biến cố — đó chính là nền đất để cây mới bén rễ.',
    deepUnlock: {
      rootCause:
        'Bạn dễ nản ở tuần thứ hai vì đặt mục tiêu quá lớn trong khi năng lượng hồi phục vẫn đang ở giai đoạn đầu.',
      next30Days:
        'Tín hiệu tích cực rõ nhất sẽ đến vào khoảng tuần thứ 3–4 thông qua một kết quả nhỏ nhưng chứng minh bạn đang đi đúng hướng.',
      actionSteps: [
        'Nên làm: Chia mục tiêu hiện tại thành các mốc 7 ngày thật gọn để dễ hoàn thành.',
        'Nên tránh: Nghe quá nhiều lời khuyên trái chiều khiến bạn thay đổi kế hoạch liên tục.',
        'Tín hiệu cần để ý: Cảm giác hứng thú quay lại với một việc bạn từng thích làm.',
      ],
    },
    aspects: {
      love: 'Tình cảm nhen nhóm nhẹ nhàng; cần sự kiên nhẫn thay vì thúc ép câu trả lời.',
      career: 'Phù hợp khởi động dự án nhỏ, học thêm kỹ năng nền tảng.',
      wealth: 'Tài chính vừa đủ, ưu tiên tích lũy từng khoản nhỏ và kiểm soát chi tiêu cố định.',
      health: 'Giữ ấm cơ thể, ngủ đủ giấc để phục hồi sinh lực tự nhiên.',
    },
    scores: {
      love: 79,
      career: 82,
      wealth: 77,
      health: 86,
    },
    numerology: {
      luckyNumber: 52,
      destinyNumber: 4,
      color: 'Trắng Ngà Washi',
      direction: 'Chính Tây',
      amulet: 'Bùa Hộ Mệnh Sakura',
    },
    suitablePlans: ['mini', 'love'],
  },
  {
    id: 8,
    stickNumber: 9,
    rank: 'Đại Cát',
    kanjiRank: '大吉',
    title: 'Cởi Bỏ Gánh Nặng, Đón Luồng Khí Mới',
    theme: 'Giải tỏa nút thắt & Hanh thông',
    summary: 'Khoảng tối đang khép lại — điều bạn trăn trở suốt thời gian qua sắp có hướng giải tỏa nhẹ nhàng hơn bạn nghĩ.',
    poem: [
      'Mây xám tan dần lộ nắng mai,',
      'Gánh sầu đặt xuống nhẹ đôi vai.',
      'Tâm sáng hướng về điều tử tế,',
      'Phúc lành tự khắc đến bên tai.',
    ],
    meaning: 'Quẻ Đại Cát nhưng không mang màu sắc hào nhoáng xa vời, mà là sự nhẹ nhõm thật sự: những hiểu lầm dần tan, công việc bớt tắc và bạn lấy lại được niềm tin vào lựa chọn của mình.',
    advice: 'Khi cơ hội mở ra, hãy đón nhận với tâm thế điềm tĩnh và giữ lại một khoảng thở cho bản thân.',
    mirrorMood:
      'Bạn đã đi qua một đoạn khá nhiều áp lực và suy tư thầm lặng. Dù đôi lúc vẫn còn chút dè chừng vì sợ mừng hụt, linh cảm bên trong bạn đang mách rằng mọi chuyện sắp dễ thở hơn rồi.',
    careerInsight:
      'Nút thắt công việc sắp được tháo gỡ nhờ sự thay đổi tích cực từ phía đối tác hoặc quyết định dứt khoát của chính bạn. Thuận lợi để chốt kế hoạch đã ấp ủ kỹ.',
    loveInsight:
      'Những gợn lấn cấn được hóa giải nếu bạn mở lòng nói nhẹ nhàng điều mình mong muốn. Gia đạo và các mối quan hệ thân thiết mang lại cảm giác được nâng đỡ.',
    closingAdvice:
      'Hãy trân trọng cảm giác bình yên đang quay lại và đừng quên chia sẻ một chút năng lượng tích cực cho người bên cạnh.',
    deepUnlock: {
      rootCause:
        'Bạn đã đi hết phần khó nhất của chu kỳ cũ; thứ duy nhất còn giữ lại chút nặng nề là thói quen cảnh giác quá mức.',
      next30Days:
        '30 ngày tới mang sắc thái khai thông rõ rệt: tin vui về công việc hoặc tài chính nhỏ xuất hiện trong nửa đầu tháng, kéo theo tinh thần phấn chấn.',
      actionSteps: [
        'Nên làm: Tự tin triển khai việc bạn đã chuẩn bị kỹ thay vì trì hoãn thêm.',
        'Nên tránh: Mang tâm lý phòng thủ cũ áp vào những người thật lòng hỗ trợ bạn.',
        'Tín hiệu cần để ý: Một sự trùng hợp đẹp giúp hai việc tưởng rời rạc bỗng khớp vào nhau.',
      ],
    },
    aspects: {
      love: 'Hòa khí ấm áp, dễ hóa giải hiểu lầm và tìm thấy sự đồng cảm sâu sắc.',
      career: 'Khai thông bế tắc, cơ hội tốt đến đúng lúc bạn sẵn sàng.',
      wealth: 'Dòng tiền khởi sắc, có thêm lộc từ công việc phụ hoặc hợp tác uy tín.',
      health: 'Thần sắc sáng hơn, giấc ngủ sâu và tinh thần nhẹ nhõm.',
    },
    scores: {
      love: 94,
      career: 95,
      wealth: 92,
      health: 93,
    },
    numerology: {
      luckyNumber: 9,
      destinyNumber: 9,
      color: 'Đỏ Chu Sa Cổ Tự',
      direction: 'Chính Nam',
      amulet: 'Lá Bùa Kim Vận Asakusa',
    },
    suitablePlans: ['mini', 'love', 'destiny'],
  },
];

export function getRandomFortune(plan: PlanType = 'mini'): OmikujiFortune {
  const filtered = OMIKUJI_DATABASE.filter((f) => f.suitablePlans.includes(plan));
  const pool = filtered.length > 0 ? filtered : OMIKUJI_DATABASE;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
