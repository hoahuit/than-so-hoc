export interface TarotAspectReading {
  mood: string;
  career: string;
  love: string;
  advice: string;
}

export interface TarotCard {
  id: number;
  numeral: string;
  nameEn: string;
  nameVi: string;
  archetype: string;
  element: string;
  accentHex: string;
  keywordsUpright: string[];
  keywordsReversed: string[];
  upright: TarotAspectReading;
  reversed: TarotAspectReading;
}

export interface DrawnTarotCard {
  card: TarotCard;
  isReversed: boolean;
  positionLabel?: string;
}

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0,
    numeral: '0',
    nameEn: 'The Fool',
    nameVi: 'Khởi Nguyên Tự Do',
    archetype: 'Bước chân đầu tiên không mang nặng định kiến',
    element: 'Khí · Uranus',
    accentHex: '#e6a73c',
    keywordsUpright: ['Khởi đầu mới', 'Tin vào trực giác', 'Nhẹ gánh', 'Can đảm'],
    keywordsReversed: ['Chần chừ', 'Sợ bước sai', 'Thiếu chuẩn bị', 'Gồng mình'],
    upright: {
      mood: 'Bạn đang đứng trước ngưỡng cửa muốn bỏ bớt những kỳ vọng cũ để thở nhẹ hơn. Nỗi lo vẫn còn nhưng sự tò mò bắt đầu lớn hơn nỗi sợ.',
      career: 'Một hướng đi hoặc vai trò mới đang manh nha. Đừng đòi hỏi mọi thứ phải rõ 100% mới dám thử — hãy bắt đầu từ bước nhỏ nhất.',
      love: 'Năng lượng mở lòng, gặp gỡ tự nhiên không gượng ép. Nếu đang trong mối quan hệ, cả hai cần một không gian tươi mới bớt kiểm soát.',
      advice: 'Đặt bớt chiếc ba lô trách nhiệm không thuộc về mình xuống trước khi bước tiếp.',
    },
    reversed: {
      mood: 'Bạn muốn đổi hướng nhưng đầu óc cứ tính toán rủi ro lặp đi lặp lại khiến chân đứng yên tại chỗ.',
      career: 'Cẩn thận quyết định bốc đồng chỉ vì muốn thoát khỏi áp lực hiện tại; hãy kiểm tra lại nền tảng tài chính trước khi nhảy.',
      love: 'Có sự ngập ngừng không dám tiến tới hoặc né tránh cam kết vì sợ tổn thương giống lần trước.',
      advice: 'Không cần nhảy vội, chỉ cần đừng tự khóa mình trong những kịch bản tự dọa mình.',
    },
  },
  {
    id: 1,
    numeral: 'I',
    nameEn: 'The Magician',
    nameVi: 'Nhà Kiến Tạo',
    archetype: 'Nguồn lực nằm ngay trong tay bạn',
    element: 'Khí · Sao Thủy',
    accentHex: '#d43c50',
    keywordsUpright: ['Chủ động', 'Kỹ năng', 'Tập trung', 'Biến ý tưởng thành thật'],
    keywordsReversed: ['Phân tán', 'Tự nghi ngờ', 'Nói nhiều làm ít', 'Mất tập trung'],
    upright: {
      mood: 'Bên trong bạn có đủ trải nghiệm để tự xoay chuyển tình thế, chỉ là thời gian qua bạn hơi mệt nên quên mất thế mạnh của mình.',
      career: 'Thời điểm tốt để chủ động đề xuất, thương lượng hoặc biến kỹ năng cá nhân thành nguồn thu thực tế.',
      love: 'Sự chủ động giao tiếp rõ ràng sẽ phá tan cảm giác mập mờ hiện tại.',
      advice: 'Chọn đúng 1 việc quan trọng nhất trong 7 ngày tới và dồn toàn lực vào đó.',
    },
    reversed: {
      mood: 'Bạn đang thấy mình biết nhiều thứ nhưng làm mãi chưa tới đâu, dễ tự trách bản thân thiếu quyết đoán.',
      career: 'Đề phòng lời hứa hẹn nghe rất hay từ đối tác hoặc cấp trên nhưng thiếu cam kết cụ thể.',
      love: 'Một bên đang dùng lời nói khéo léo để né tránh vấn đề cốt lõi của mối quan hệ.',
      advice: 'Thu gọn đầu việc lại; năng lượng bị rò rỉ vì bạn ôm quá nhiều thứ cùng lúc.',
    },
  },
  {
    id: 2,
    numeral: 'II',
    nameEn: 'The High Priestess',
    nameVi: 'Nữ Tư Tế',
    archetype: 'Trực giác nhìn thấu điều chưa nói',
    element: 'Nước · Mặt Trăng',
    accentHex: '#4f46e5',
    keywordsUpright: ['Trực giác', 'Quan sát thầm lặng', 'Bí mật', 'Chờ đúng nhịp'],
    keywordsReversed: ['Bỏ qua linh cảm', 'Giữ kín quá lâu', 'Nhiễu thông tin', 'Bứt rứt'],
    upright: {
      mood: 'Có những điều bạn cảm nhận rất rõ bằng trực giác nhưng chưa có bằng chứng rõ ràng, nên bạn chọn im lặng quan sát.',
      career: 'Chưa phải lúc vội công bố kế hoạch hoặc tranh luận gay gắt. Hãy âm thầm quan sát cục diện và giữ bài tẩy cho riêng mình.',
      love: 'Khoảng lặng hiện tại chứa nhiều tâm tư chưa được gọi tên. Đừng vội ép câu trả lời nếu đối phương chưa sẵn sàng.',
      advice: 'Tin vào cảm giác đầu tiên của bạn — điều gì khiến bạn thấy bất an kéo dài thì đừng cố tự thuyết phục ngược lại.',
    },
    reversed: {
      mood: 'Bạn đang nghe quá nhiều ý kiến bên ngoài nên tiếng nói bên trong bị nhiễu loạn.',
      career: 'Có thông tin quan trọng bị che giấu hoặc bạn đang bỏ qua dấu hiệu cảnh báo nhỏ trong hợp tác.',
      love: 'Sự im lặng kéo dài đang biến thành khoảng cách lạnh; giữ trong lòng quá lâu chỉ làm bạn thêm nặng nề.',
      advice: 'Tách mình khỏi tiếng ồn xung quanh một buổi tối để tự hỏi: thực tâm mình muốn gì?',
    },
  },
  {
    id: 3,
    numeral: 'III',
    nameEn: 'The Empress',
    nameVi: 'Nữ Hoàng',
    archetype: 'Nuôi dưỡng, nở hoa & giá trị bền vững',
    element: 'Đất · Sao Kim',
    accentHex: '#15803d',
    keywordsUpright: ['Nuôi dưỡng', 'Dồi dào', 'Chăm sóc bản thân', 'Sáng tạo'],
    keywordsReversed: ['Cạn kiệt', 'Cho đi quá mức', 'Bỏ quên chính mình', 'Bí ý tưởng'],
    upright: {
      mood: 'Sau quãng thời gian gồng gánh, tâm hồn bạn cần được vỗ về bằng những điều dịu dàng và thực tế hơn.',
      career: 'Những hạt giống bạn âm thầm chăm chút bắt đầu có dấu hiệu đâm chồi, đặc biệt ở lĩnh vực sáng tạo, dịch vụ hoặc chăm sóc khách hàng.',
      love: 'Sự ấm áp và bao dung kéo hai người lại gần nhau hơn; người độc thân thu hút nhờ năng lượng bình an tự nhiên.',
      advice: 'Hãy đối xử với cơ thể và cảm xúc của mình tốt như cách bạn lo cho người khác.',
    },
    reversed: {
      mood: 'Bạn đang cho đi và gánh thay phần người khác quá nhiều đến mức chính mình rơi vào trạng thái rỗng pin.',
      career: 'Công việc bị chững vì bạn làm trong tâm thế kiệt sức, thiếu cảm hứng và thiếu ranh giới thời gian.',
      love: 'Dễ nảy sinh cảm giác tủi thân khi sự quan tâm của bạn không được hồi đáp tương xứng.',
      advice: 'Dừng lại nghỉ ngơi trước khi cố gắng thêm — đất cạn dinh dưỡng thì hạt tốt cũng khó nảy mầm.',
    },
  },
  {
    id: 4,
    numeral: 'IV',
    nameEn: 'The Emperor',
    nameVi: 'Hoàng Đế',
    archetype: 'Kỷ luật, ranh giới & chỗ dựa vững vàng',
    element: 'Lửa · Bạch Dương',
    accentHex: '#b91c1c',
    keywordsUpright: ['Cấu trúc', 'Quyết đoán', 'Ranh giới rõ ràng', 'Ổn định'],
    keywordsReversed: ['Áp lực kiểm soát', 'Cứng nhắc', 'Gồng trách nhiệm', 'Thiếu linh hoạt'],
    upright: {
      mood: 'Bạn đang cần lại cảm giác nắm quyền kiểm soát cuộc sống của mình thay vì bị hoàn cảnh kéo đi.',
      career: 'Thời điểm lập lại trật tự, đặt ranh giới rõ về quyền lợi – trách nhiệm và chốt các việc liên quan đến giấy tờ, tài chính.',
      love: 'Cần sự thẳng thắn, trách nhiệm và hành động thực tế thay vì những lời hứa mơ hồ.',
      advice: 'Nói "không" với những việc làm tiêu hao bạn nhưng không tạo ra giá trị dài hạn.',
    },
    reversed: {
      mood: 'Bạn đang tự tạo áp lực phải gánh mọi thứ hoàn hảo, hoặc đang chịu sức ép từ một người có quyền lực/gia đình.',
      career: 'Dễ va chạm quan điểm với cấp trên hoặc đối tác nếu cả hai cùng giữ cái tôi quá cứng.',
      love: 'Một bên đang kiểm soát hoặc giữ khoảng cách lý trí quá mức khiến mối quan hệ thiếu hơi ấm.',
      advice: 'Vững vàng không có nghĩa là phải tự mình chống đỡ tất cả.',
    },
  },
  {
    id: 5,
    numeral: 'V',
    nameEn: 'The Hierophant',
    nameVi: 'Giáo Hoàng',
    archetype: 'Giá trị cốt lõi & người dẫn đường',
    element: 'Đất · Kim Ngưu',
    accentHex: '#b45309',
    keywordsUpright: ['Kinh nghiệm', 'Mentor', 'Chuẩn mực', 'Cam kết'],
    keywordsReversed: ['Lối mòn', 'Ngột ngạt quy tắc', 'Muốn phá khung', 'Tự tìm lối riêng'],
    upright: {
      mood: 'Bạn đang tìm một điểm tựa đáng tin cậy hoặc một lời khuyên đủ chín chắn để đỡ phải tự mò mẫm.',
      career: 'Học hỏi từ người đi trước hoặc củng cố chuyên môn bài bản sẽ mở ra cánh cửa an toàn và bền vững.',
      love: 'Mối quan hệ hướng tới sự nghiêm túc, tôn trọng giá trị gia đình và sự đồng hành dài lâu.',
      advice: 'Đừng ngại hỏi ý kiến một người có trải nghiệm thật thay vì tự xoay trong suy nghĩ của mình.',
    },
    reversed: {
      mood: 'Những khuôn mẫu cũ ("phải thế này mới đúng") đang làm bạn thấy ngột ngạt và mất kết nối với chính mình.',
      career: 'Cách làm cũ đã hết hiệu quả; bạn cần đổi phương pháp tiếp cận thay vì cố lặp lại quy trình quen thuộc.',
      love: 'Áp lực từ kỳ vọng gia đình hoặc định kiến bên ngoài đang ảnh hưởng đến lựa chọn tình cảm.',
      advice: 'Giữ nguyên tắc tốt cho bạn, nhưng đừng sống chỉ để làm vừa lòng tiêu chuẩn của người khác.',
    },
  },
  {
    id: 6,
    numeral: 'VI',
    nameEn: 'The Lovers',
    nameVi: 'Tình Nhân',
    archetype: 'Sự lựa chọn xuất phát từ trái tim thật',
    element: 'Khí · Song Tử',
    accentHex: '#e11d48',
    keywordsUpright: ['Lựa chọn', 'Đồng điệu', 'Chân thành', 'Gắn kết'],
    keywordsReversed: ['Phân vân', 'Lệch pha', 'Do dự giữa 2 ngã', 'Chưa dứt khoát'],
    upright: {
      mood: 'Bạn đang đứng trước một quyết định quan trọng đòi hỏi phải chọn bằng sự chân thành với chính mình chứ không chỉ vì tiện lợi.',
      career: 'Cơ hội hợp tác ăn ý hoặc tìm lại được công việc đúng với giá trị bạn theo đuổi.',
      love: 'Sự thu hút và thấu hiểu sâu sắc; nếu đang lấn cấn, một cuộc trò chuyện thẳng thắn sẽ đưa hai người về cùng tần số.',
      advice: 'Chọn con đường khiến bạn tôn trọng bản thân mình nhất khi nhìn lại.',
    },
    reversed: {
      mood: 'Tâm trí bạn đang bị giằng co giữa hai lựa chọn — bên nào cũng có lý do để giữ và lý do để rời.',
      career: 'Thiếu đồng thuận trong hợp tác hoặc bạn đang làm một việc không còn hợp với định hướng cá nhân.',
      love: 'Có sự mập mờ, lệch nhịp hoặc một điều chưa dám chọn dứt khoát khiến cả hai mệt mỏi.',
      advice: 'Không chọn cũng là một lựa chọn — và nó đang âm thầm lấy đi năng lượng của bạn mỗi ngày.',
    },
  },
  {
    id: 7,
    numeral: 'VII',
    nameEn: 'The Chariot',
    nameVi: 'Chiến Xa',
    archetype: 'Bứt tốc có kiểm soát giữa hai lực kéo',
    element: 'Nước · Cự Giải',
    accentHex: '#0284c7',
    keywordsUpright: ['Tiến lên', 'Ý chí', 'Vượt trở ngại', 'Quyết liệt'],
    keywordsReversed: ['Mất lái nhẹ', 'Nôn nóng', 'Kẹt nhịp', 'Chạy sai hướng'],
    upright: {
      mood: 'Sau quãng thời gian chững lại, bạn bắt đầu gom lại được ý chí để tự kéo mình ra khỏi vùng trì trệ.',
      career: 'Đây là lúc tăng tốc dứt điểm một mục tiêu cụ thể; đi công tác, di chuyển hoặc đổi môi trường sẽ mang lại xung lực mới.',
      love: 'Muốn mối quan hệ tiến triển thì cần chủ động tạo chuyển động thay vì ngồi chờ tín hiệu.',
      advice: 'Giữ tay lái vững bằng mục tiêu dài hạn, đừng để cảm xúc nhất thời bẻ hướng.',
    },
    reversed: {
      mood: 'Bạn muốn chạy thật nhanh cho xong giai đoạn này nhưng càng vội lại càng thấy rối và hụt hơi.',
      career: 'Kế hoạch dễ bị trì hoãn do thiếu phối hợp giữa các bên hoặc chạy nhiều hướng ngược nhau.',
      love: 'Hai người đang kéo về hai phía khác nhau; ép tiến độ lúc này dễ gây rạn nứt.',
      advice: 'Chậm lại một nhịp để chỉnh đúng hướng quan trọng hơn cố chạy thật nhanh.',
    },
  },
  {
    id: 8,
    numeral: 'VIII',
    nameEn: 'Strength',
    nameVi: 'Sức Mạnh Nội Tâm',
    archetype: 'Mềm mại nhưng không khuất phục',
    element: 'Lửa · Sư Tử',
    accentHex: '#d97706',
    keywordsUpright: ['Kiên cường', 'Bình tĩnh', 'Thấu cảm', 'Làm chủ cảm xúc'],
    keywordsReversed: ['Mệt mỏi', 'Tự ti', 'Dễ cáu/nản', 'Cạn sức bền'],
    upright: {
      mood: 'Bạn đã đi qua nhiều chuyện hơn vẻ ngoài bình tĩnh của mình. Sức mạnh lớn nhất lúc này là sự điềm tĩnh và lòng tự trọng.',
      career: 'Giải quyết việc khó bằng sự khéo léo và kiên trì sẽ hiệu quả hơn đối đầu trực diện.',
      love: 'Sự dịu dàng nhưng giữ vững giá trị bản thân giúp mối quan hệ chuyển hóa tích cực.',
      advice: 'Bạn bền bỉ hơn bạn nghĩ, nhưng vẫn xứng đáng có khoảng nghỉ để hồi phục.',
    },
    reversed: {
      mood: 'Bạn đã gồng quá lâu nên lớp vỏ mạnh mẽ bắt đầu rạn nhẹ — chỉ một chuyện nhỏ cũng dễ làm bạn tụt năng lượng.',
      career: 'Áp lực kéo dài khiến bạn tự nghi ngờ năng lực thật của mình.',
      love: 'Cảm giác yếu thế hoặc cố nhịn cho êm chuyện đang làm bạn tích tụ mệt mỏi.',
      advice: 'Cho phép mình thừa nhận đang mệt không phải là yếu đuối, mà là bước đầu để nạp lại lực.',
    },
  },
  {
    id: 9,
    numeral: 'IX',
    nameEn: 'The Hermit',
    nameVi: 'Ẩn Sĩ',
    archetype: 'Thu mình lại để nghe rõ câu trả lời thật',
    element: 'Đất · Xử Nữ',
    accentHex: '#475569',
    keywordsUpright: ['Tĩnh lặng', 'Tự soi chiếu', 'Chín chắn', 'Tìm ý nghĩa thật'],
    keywordsReversed: ['Cô đơn', 'Khép kín quá mức', 'Trốn tránh', 'Nghĩ quẩn'],
    upright: {
      mood: 'Bạn có xu hướng muốn thu mình lại khỏi những cuộc vui ồn ào vì cảm thấy ít ai thật sự hiểu điều mình đang trải qua.',
      career: 'Rất hợp để rà soát lại chiến lược, học sâu một kỹ năng hoặc làm việc độc lập trước khi bước ra ánh sáng.',
      love: 'Cần không gian riêng để hiểu rõ mình đang tìm kiếm sự đồng hành thật sự hay chỉ sợ cô đơn.',
      advice: 'Ánh đèn nhỏ trong tay đủ soi bước tiếp theo — bạn không cần nhìn thấy hết cả chặng đường hôm nay.',
    },
    reversed: {
      mood: 'Khoảng lặng đang kéo dài thành cảm giác lạc lõng, càng nghĩ một mình càng thấy bế tắc.',
      career: 'Làm việc cô độc quá lâu khiến bạn bỏ lỡ cơ hội kết nối hoặc góc nhìn mới từ người ngoài.',
      love: 'Tự xây tường rào quá cao khiến người muốn bước vào cũng không biết cách chạm tới bạn.',
      advice: 'Đừng cô lập mình mãi; đôi khi một cuộc trò chuyện đúng người sẽ mở ra nút thắt.',
    },
  },
  {
    id: 10,
    numeral: 'X',
    nameEn: 'Wheel of Fortune',
    nameVi: 'Bánh Xe Vận Mệnh',
    archetype: 'Chu kỳ xoay chuyển sắp bắt đầu',
    element: 'Lửa · Sao Mộc',
    accentHex: '#ca8a04',
    keywordsUpright: ['Bước ngoặt', 'Thời cơ', 'Xoay chiều', 'Thuận dòng'],
    keywordsReversed: ['Trì hoãn', 'Lặp lại vòng cũ', 'Khó đoán', 'Chưa tới lúc'],
    upright: {
      mood: 'Cảm giác đứng yên bấy lâu sắp có sự xê dịch. Một biến số bất ngờ có thể làm thay đổi góc nhìn của bạn.',
      career: 'Cơ hội mới đến khá nhanh qua một cuộc hẹn, lời mời hoặc thay đổi cơ cấu; hãy giữ trạng thái sẵn sàng.',
      love: 'Cuộc gặp gỡ tình cờ hoặc sự kiện chung giúp phá băng trạng thái chững lại.',
      advice: 'Khi bánh xe bắt đầu quay, đừng bám chặt vào vị trí cũ chỉ vì nó quen thuộc.',
    },
    reversed: {
      mood: 'Bạn cảm thấy mọi chuyện cứ lặp đi lặp lại một kịch bản cũ dù mình đã cố đổi cách phản ứng.',
      career: 'Thời điểm này chưa thuận để liều lĩnh; nếu có trục trặc phát sinh, coi đó là bài kiểm tra sự linh hoạt.',
      love: 'Vấn đề cũ quay lại đòi được giải quyết tận gốc thay vì lờ đi cho qua.',
      advice: 'Thay đổi một thói quen nhỏ hôm nay để ngắt vòng lặp cũ.',
    },
  },
  {
    id: 11,
    numeral: 'XI',
    nameEn: 'Justice',
    nameVi: 'Công Lý',
    archetype: 'Cán cân sòng phẳng & sự thật rõ ràng',
    element: 'Khí · Thiên Bình',
    accentHex: '#0f766e',
    keywordsUpright: ['Minh bạch', 'Công bằng', 'Nhân quả rõ ràng', 'Quyết định lý trí'],
    keywordsReversed: ['Thiệt thòi', 'Né tránh sự thật', 'Thiếu cân bằng', 'Chần chừ'],
    upright: {
      mood: 'Đã đến lúc nhìn thẳng vào thực tế một cách công bằng — không tô hồng cũng không tự dằn vặt quá mức.',
      career: 'Các vấn đề giấy tờ, hợp đồng, chia sẻ quyền lợi cần được đặt lên bàn minh bạch ngay từ đầu.',
      love: 'Cần cân bằng lại sự cho – nhận giữa hai người để tránh âm thầm tích tụ ấm ức.',
      advice: 'Sự rõ ràng ban đầu có thể hơi khó nói, nhưng nó cứu bạn khỏi rất nhiều mệt mỏi về sau.',
    },
    reversed: {
      mood: 'Bạn đang thấy hơi chạnh lòng vì nỗ lực của mình chưa được ghi nhận tương xứng, hoặc tự trách bản thân quá khắt khe.',
      career: 'Cẩn thận điều khoản bất lợi hoặc sự phân công thiếu công bằng trong tập thể.',
      love: 'Một bên đang tự lừa dối cảm xúc thật để giữ bề ngoài yên ổn.',
      advice: 'Đừng ký hay hứa bất cứ điều gì khi lòng bạn vẫn thấy cấn.',
    },
  },
  {
    id: 12,
    numeral: 'XII',
    nameEn: 'The Hanged Man',
    nameVi: 'Người Treo Ngược',
    archetype: 'Tạm dừng bắt buộc để đổi góc nhìn',
    element: 'Nước · Hải Vương',
    accentHex: '#6366f1',
    keywordsUpright: ['Chờ đợi', 'Đổi góc nhìn', 'Buông kiểm soát', 'Lắng đọng'],
    keywordsReversed: ['Sốt ruột', 'Mắc kẹt vô ích', 'Chống cự thực tế', 'Mệt mỏi'],
    upright: {
      mood: 'Lá bài phản ánh chính xác cảm giác "bị treo lơ lửng" — tiến chưa được mà lùi cũng không xong.',
      career: 'Khoảng dừng này giúp bạn nhìn thấy một góc khuất mà trước đây vì quá bận nên không nhận ra.',
      love: 'Ép câu trả lời lúc này không hiệu quả; hãy cho cả hai khoảng lùi để nhìn rõ bản chất mối quan hệ.',
      advice: 'Thử đảo ngược câu hỏi: "Nếu chuyện này không diễn ra theo ý mình ngay bây giờ, nó đang bảo vệ mình khỏi điều gì?"',
    },
    reversed: {
      mood: 'Bạn đang rất sốt ruột vì sự trì hoãn kéo dài, cảm thấy thời gian đang trôi qua mà chưa đổi được gì.',
      career: 'Đừng tiếp tục đầu tư công sức vào một hướng rõ ràng đã hết dư địa chỉ vì tiếc công cũ.',
      love: 'Đợi chờ trong vô vọng hoặc hy sinh một chiều đang làm bạn đánh mất chính mình.',
      advice: 'Chấp nhận buông một kỳ vọng sai sẽ giải phóng rất nhiều năng lượng cho bạn.',
    },
  },
  {
    id: 13,
    numeral: 'XIII',
    nameEn: 'Death',
    nameVi: 'Chuyển Hóa',
    archetype: 'Khép lại chương cũ để mở đất cho mầm mới',
    element: 'Nước · Bọ Cạp',
    accentHex: '#334155',
    keywordsUpright: ['Kết thúc tự nhiên', 'Lột xác', 'Dọn dẹp', 'Tái sinh'],
    keywordsReversed: ['Bám víu quá khứ', 'Ngại thay đổi', 'Kéo dài dây dưa', 'Trì trệ'],
    upright: {
      mood: 'Một giai đoạn hoặc một thói quen tâm lý trong bạn đã thật sự đến hạn phải khép lại.',
      career: 'Chuyển việc, dừng một dự án kém hiệu quả hoặc thay đổi hoàn toàn cách làm cũ sẽ mang lại luồng sinh khí mới.',
      love: 'Hoặc là mối quan hệ bước sang hình thái trưởng thành mới, hoặc khép lại nhẹ nhàng một vòng lặp không còn phù hợp.',
      advice: 'Cánh cửa mới không thể mở nếu hai tay bạn vẫn đang giữ chặt cánh cửa đã đóng.',
    },
    reversed: {
      mood: 'Bạn biết rõ điều gì cần kết thúc hoặc thay đổi nhưng vẫn chần chừ vì quen với cảm giác an toàn cũ.',
      career: 'Kéo dài công việc đã hết động lực chỉ khiến năng lượng bào mòn từng ngày.',
      love: 'Vương vấn kỷ niệm cũ hoặc giữ một mối liên hệ lưng chừng làm lỡ cơ hội mới.',
      advice: 'Dọn dẹp một góc nhỏ không gian sống hoặc tin nhắn cũ hôm nay để đánh dấu sự chuyển mình.',
    },
  },
  {
    id: 14,
    numeral: 'XIV',
    nameEn: 'Temperance',
    nameVi: 'Cân Bằng & Chữa Lành',
    archetype: 'Pha trộn hài hòa, đi chậm mà bền',
    element: 'Lửa · Nhân Mã',
    accentHex: '#0d9488',
    keywordsUpright: ['Điều độ', 'Hòa giải', 'Kiên nhẫn', 'Chữa lành'],
    keywordsReversed: ['Mất cân bằng', 'Thái quá', 'Nóng vội', 'Lệch nhịp'],
    upright: {
      mood: 'Tâm trí bạn đang dần dịu xuống sau những biến động, tìm lại nhịp thở ổn định hơn.',
      career: 'Phối hợp nhịp nhàng giữa các bên; đây là lúc cân đối sức lực và thời gian thay vì chạy nước rút.',
      love: 'Mối quan hệ cần sự kiên nhẫn, lắng nghe và dung hòa khác biệt từng chút một.',
      advice: 'Không cần mọi thứ giải quyết trong một đêm; sự ổn định nhỏ mỗi ngày mới là phép màu thật.',
    },
    reversed: {
      mood: 'Nhịp sinh hoạt và cảm xúc của bạn đang lệch pha — lúc thì dốc hết sức, lúc lại buông xuôi hoàn toàn.',
      career: 'Quá tải vì nhận việc thiếu chọn lọc hoặc thiếu kiên nhẫn chờ kết quả tích lũy.',
      love: 'Cảm xúc lên xuống thất thường dễ tạo hiểu lầm không đáng có.',
      advice: 'Ưu tiên ngủ đủ và tách bạch giờ làm – giờ nghỉ trong vài ngày tới.',
    },
  },
  {
    id: 15,
    numeral: 'XV',
    nameEn: 'The Devil',
    nameVi: 'Ràng Buộc Vô Hình',
    archetype: 'Nhận ra sợi dây trói thực ra chưa hề khóa',
    element: 'Đất · Ma Kết',
    accentHex: '#7f1d1d',
    keywordsUpright: ['Ràng buộc', 'Nỗi sợ vô hình', 'Áp lực vật chất', 'Thức tỉnh'],
    keywordsReversed: ['Thoát khỏi trói buộc', 'Nhìn thấu sự thật', 'Lấy lại quyền chủ động', 'Giải phóng'],
    upright: {
      mood: 'Bạn đang bị trói bởi một nỗi lo (tài chính, ánh nhìn người khác, hoặc một mối quan hệ) khiến bạn nghĩ mình không còn lựa chọn nào khác.',
      career: 'Cảnh giác cảm giác bị kẹt trong "chiếc lồng an toàn" — lương hoặc danh nghĩa giữ chân bạn nhưng tinh thần ngày càng cạn.',
      love: 'Sự gắn bó mang nhiều phụ thuộc cảm xúc, ghen tuông hoặc lặp lại tổn thương cũ.',
      advice: 'Hãy nhìn kỹ xem ai đang giữ chìa khóa: hoàn cảnh bên ngoài hay chính nỗi sợ bên trong bạn?',
    },
    reversed: {
      mood: 'Bạn bắt đầu tỉnh ra và nhận thấy những thứ từng làm mình sợ thực ra không đáng để đánh đổi bình yên.',
      career: 'Dấu hiệu tốt để cắt bỏ khoản chi/việc làm tiêu hao và giành lại quyền chủ động thời gian.',
      love: 'Bước ra khỏi sự mập mờ độc hại hoặc đặt lại giới hạn tôn trọng bản thân.',
      advice: 'Chỉ cần một lần dám bước ra khỏi vòng lặp, bạn sẽ thấy mình nhẹ đi rất nhiều.',
    },
  },
  {
    id: 16,
    numeral: 'XVI',
    nameEn: 'The Tower',
    nameVi: 'Tia Chớp Thức Tỉnh',
    archetype: 'Phá vỡ lớp vỏ mong manh để xây nền thật',
    element: 'Lửa · Sao Hỏa',
    accentHex: '#dc2626',
    keywordsUpright: ['Sự thật phơi bày', 'Thay đổi đột ngột', 'Thức tỉnh', 'Giải tỏa'],
    keywordsReversed: ['Né tránh đổ vỡ', 'Cố giữ vỏ bọc', 'Cảnh báo nhẹ', 'Sắp xếp lại'],
    upright: {
      mood: 'Có thể vừa có một sự việc hoặc một lời nói làm lung lay kỳ vọng lâu nay của bạn, khiến bạn hơi chao đảo.',
      career: 'Những gì xây trên nền thiếu chắc chắn sẽ bộc lộ lỗ hổng; dù hơi sốc lúc đầu nhưng giúp bạn dừng lỗ kịp thời.',
      love: 'Sự thật không thể che giấu thêm nữa — nói ra một lần còn hơn âm thầm chịu đựng.',
      advice: 'Thứ sụp đổ chỉ là ảo ảnh chưa vững; phần giá trị thật của bạn vẫn còn nguyên.',
    },
    reversed: {
      mood: 'Bạn linh cảm có điều gì đó đang lung lay nhưng cố níu giữ vẻ bình yên bề mặt.',
      career: 'Chủ động sửa chữa điểm yếu ngay khi còn nhỏ trước khi nó trở thành khủng hoảng lớn.',
      love: 'Đừng chờ tới lúc quá giới hạn mới chịu đối thoại thẳng thắn.',
      advice: 'Chủ động đổi mới từ bên trong luôn nhẹ nhàng hơn đợi ngoại cảnh ép phải đổi.',
    },
  },
  {
    id: 17,
    numeral: 'XVII',
    nameEn: 'The Star',
    nameVi: 'Ngôi Sao Hy Vọng',
    archetype: 'Ánh sáng dịu dàng sau cơn bão',
    element: 'Khí · Bảo Bình',
    accentHex: '#0ea5e9',
    keywordsUpright: ['Hy vọng', 'Chữa lành', 'Tầm nhìn xa', 'Bình yên'],
    keywordsReversed: ['Mất niềm tin tạm thời', 'Nản lòng', 'Quên giá trị mình', 'Kiệt sức'],
    upright: {
      mood: 'Dù thực tế vẫn còn bộn bề, một tia sáng nhẹ đang quay lại giúp bạn tin rằng giai đoạn khó rồi sẽ qua.',
      career: 'Hướng đi dài hạn bắt đầu lộ rõ; rất thuận lợi cho thương hiệu cá nhân, kết nối cộng đồng và những dự án mang giá trị thật.',
      love: 'Sự chân thành, nhẹ nhõm và chữa lành những vết xước cũ.',
      advice: 'Giữ niềm tin lành mạnh và tiếp tục gieo điều tử tế — bạn đang đi đúng hướng.',
    },
    reversed: {
      mood: 'Bạn đang hơi nản vì chờ mãi chưa thấy tín hiệu hồi đáp xứng đáng với công sức bỏ ra.',
      career: 'Đừng vội bỏ cuộc ngay đoạn gần sáng chỉ vì thiếu một chút kiên nhẫn cuối cùng.',
      love: 'Cảm giác hụt hẫng khiến bạn thu mình và nghi ngờ khả năng được yêu thương trọn vẹn.',
      advice: 'Nghỉ một nhịp, nhìn lại xem mình đã đi được bao xa so với một năm trước.',
    },
  },
  {
    id: 18,
    numeral: 'XVIII',
    nameEn: 'The Moon',
    nameVi: 'Mặt Trăng Ẩn Hiện',
    archetype: 'Đi xuyên qua sương mù của nỗi lo và sự mập mờ',
    element: 'Nước · Song Ngư',
    accentHex: '#7c3aed',
    keywordsUpright: ['Mập mờ', 'Nỗi lo tiềm thức', 'Chưa rõ thực hư', 'Nhạy cảm'],
    keywordsReversed: ['Sương mù tan dần', 'Lộ rõ sự thật', 'Bớt hoang mang', 'Rõ nét'],
    upright: {
      mood: 'Tâm trạng hiện tại giống như đi trong sương sớm — bạn cảm thấy bất an nhưng chưa gọi tên rõ được chuyện gì sẽ xảy ra.',
      career: 'Thông tin chưa đầy đủ, dễ có hiểu lầm ngầm hoặc thay đổi phút chót. Tránh chốt quyết định lớn khi dữ kiện còn mù mờ.',
      love: 'Sự mập mờ, suy đoán tâm ý của đối phương đang làm bạn mệt hơn cả sự thật.',
      advice: 'Đừng tin hết mọi kịch bản tiêu cực do tâm trí tự vẽ ra trong đêm; hãy kiểm chứng bằng thông tin thực tế.',
    },
    reversed: {
      mood: 'Những nghi ngờ kéo dài bấy lâu bắt đầu sáng tỏ dần, giúp bạn bớt đoán già đoán non.',
      career: 'Điểm khuất trong công việc hoặc tài chính dần lộ diện để bạn xử lý dứt điểm.',
      love: 'Khoảng mập mờ được làm rõ — dù kết quả ra sao bạn cũng nhẹ lòng hơn trước.',
      advice: 'Thà biết sự thật rõ ràng còn hơn sống mãi trong trạng thái nửa tin nửa ngờ.',
    },
  },
  {
    id: 19,
    numeral: 'XIX',
    nameEn: 'The Sun',
    nameVi: 'Mặt Trời Rạng Rỡ',
    archetype: 'Minh bạch, ấm áp & thành quả xứng đáng',
    element: 'Lửa · Mặt Trời',
    accentHex: '#f59e0b',
    keywordsUpright: ['Rõ ràng', 'Niềm vui', 'Thành công', 'Sức sống'],
    keywordsReversed: ['Áp lực tỏa sáng', 'Thành công đến chậm', 'Hơi tự mãn', 'Cần nghỉ'],
    upright: {
      mood: 'Năng lượng ấm áp và sáng sủa đang tiến về phía bạn, xua tan cảm giác nặng nề kéo dài.',
      career: 'Công sức được ghi nhận công khai, dự án hoặc nguồn thu có bước tiến rõ rệt, minh bạch.',
      love: 'Sự ấm áp, vui vẻ, cởi mở không giấu giếm giúp tình cảm thăng hoa.',
      advice: 'Cho phép bản thân tận hưởng niềm vui nhỏ hôm nay thay vì lo xa cho ngày mai.',
    },
    reversed: {
      mood: 'Cơ hội vẫn có đó nhưng bạn hơi mệt nên chưa cảm nhận trọn vẹn được niềm vui.',
      career: 'Kết quả tích cực nhưng đến chậm hơn kỳ vọng một chút; đừng vì thế mà vội đánh giá thấp bản thân.',
      love: 'Cần bớt cái tôi và chia sẻ thẳng thắn niềm vui, nỗi lo với người bên cạnh.',
      advice: 'Ánh sáng vẫn đang ở đó — chỉ là bạn cần ngẩng lên thay vì cúi nhìn mãi khuyết điểm của mình.',
    },
  },
  {
    id: 20,
    numeral: 'XX',
    nameEn: 'Judgement',
    nameVi: 'Tiếng Gọi Thức Tỉnh',
    archetype: 'Tha thứ cho quá khứ & bước vào phiên bản mới',
    element: 'Lửa · Diêm Vương',
    accentHex: '#be123c',
    keywordsUpright: ['Tỉnh thức', 'Quyết định bước ngoặt', 'Tha thứ', 'Đổi mới'],
    keywordsReversed: ['Tự trách', 'Chần chừ nghe tiếng gọi', 'Sợ phán xét', 'Chưa buông'],
    upright: {
      mood: 'Một tiếng chuông thức tỉnh nhẹ bên trong nhắc bạn đã đến lúc sống đúng với điều mình thật sự trân trọng.',
      career: 'Thời điểm đánh giá lại toàn bộ hành trình vừa qua để nhận một cơ hội mang tính bước ngoặt hoặc tái khởi động dự án cũ.',
      love: 'Cơ hội hàn gắn hoặc nâng cấp mối quan hệ nếu cả hai thật sự nhìn lại phần lỗi của mình.',
      advice: 'Ngừng tự phán xét bản thân vì những lựa chọn chưa trọn vẹn trong quá khứ.',
    },
    reversed: {
      mood: 'Bạn đang tự làm quan tòa khắt khe nhất với chính mình, cứ dằn vặt mãi những chuyện đã qua.',
      career: 'Ngại bước ra nhận cơ hội mới vì sợ bị đánh giá hoặc sợ lặp lại sai lầm cũ.',
      love: 'Không chịu bỏ qua lỗi cũ khiến hiện tại lúc nào cũng nặng nề.',
      advice: 'Bài học đã học xong rồi thì không cần giữ lại cảm giác tội lỗi nữa.',
    },
  },
  {
    id: 21,
    numeral: 'XXI',
    nameEn: 'The World',
    nameVi: 'Thế Giới Viên Mãn',
    archetype: 'Tròn vẹn một chu kỳ & mở ra chân trời mới',
    element: 'Đất · Sao Thổ',
    accentHex: '#047857',
    keywordsUpright: ['Hoàn thành', 'Tròn đầy', 'Mở rộng tầm nhìn', 'Tự do'],
    keywordsReversed: ['Thiếu mảnh ghép cuối', 'Chưa khép vòng', 'Vướng việc dở dang', 'Sắp xong'],
    upright: {
      mood: 'Một chặng đường dài nhiều thử thách sắp khép lại với cảm giác trưởng thành và vững vàng hơn hẳn trước kia.',
      career: 'Dự án hoàn tất tốt đẹp, mở rộng kết nối đi xa (tỉnh thành mới, môi trường quốc tế hoặc nền tảng online).',
      love: 'Cảm giác đủ đầy, bình yên bên nhau hoặc hài lòng sâu sắc với cuộc sống độc thân tự chủ.',
      advice: 'Ghi nhận những gì bạn đã đi qua trước khi vội vàng đặt mục tiêu kế tiếp.',
    },
    reversed: {
      mood: 'Bạn đang ở rất gần vạch đích của một giai đoạn nhưng vẫn còn một việc nhỏ chưa khép lại dứt điểm.',
      career: 'Hoàn thành nốt phần việc còn dang dở trước khi ôm thêm dự án mới.',
      love: 'Cần một lời kết hoặc một cuộc hẹn rõ ràng để không còn lấn cấn chuyện cũ.',
      advice: 'Đừng bỏ dở ở bước cuối cùng khi chỉ còn một mảnh ghép nữa là trọn vẹn.',
    },
  },
];

export const THREE_CARD_POSITIONS = [
  'Hiện tại · Tâm trạng & Nút thắt',
  'Góc khuất · Công việc / Tình cảm',
  'Chuyển hóa · Lời khuyên xoay chuyển',
] as const;

export function getShuffledDeck(count: number = 7): TarotCard[] {
  const copy = [...MAJOR_ARCANA];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export function drawTarotSpread(
  count: 1 | 3,
  allowReversed: boolean = true
): DrawnTarotCard[] {
  const picked = getShuffledDeck(count);
  return picked.map((card, idx) => ({
    card,
    isReversed: allowReversed ? Math.random() < 0.28 : false,
    positionLabel: count === 3 ? THREE_CARD_POSITIONS[idx] : undefined,
  }));
}
