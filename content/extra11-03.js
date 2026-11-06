module.exports = [
  {
    id: 'bedroom-items', group: 'g11', prompt: 'Kể tên một thứ có trong phòng ngủ',
    answers: {
      1: ['giường', 'gối', 'chăn|mền', 'nệm|đệm', 'tủ quần áo|tủ đồ|tủ áo', 'đèn ngủ', 'gương|kiếng', 'quạt|quạt máy', 'rèm cửa|rèm|màn cửa'],
      2: ['bàn trang điểm|bàn phấn', 'điều hòa|máy lạnh|máy điều hòa', 'đồng hồ báo thức|đồng hồ', 'gấu bông|thú bông|thú nhồi bông', 'ga giường|ga trải giường|ra giường|drap|drap giường', 'màn|mùng', 'tủ đầu giường|tab đầu giường|táp đầu giường|kệ đầu giường', 'bàn học', 'ghế', 'thảm|thảm trải sàn', 'cửa sổ', 'đèn trần|đèn', 'ổ cắm|ổ điện', 'vỏ gối|áo gối|bao gối', 'gối ôm', 'tranh treo tường|tranh', 'kệ sách|giá sách|tủ sách', 'sách', 'điện thoại', 'sạc điện thoại|cục sạc|sạc', 'máy tính|laptop|máy tính xách tay', 'tivi|ti vi|tv', 'móc áo|móc treo quần áo|mắc áo', 'quần áo', 'dép đi trong nhà|dép', 'đèn bàn', 'giường tầng', 'đồ ngủ|pijama|pyjama|quần áo ngủ', 'điều khiển|remote'],
      3: ['máy sưởi', 'nôi', 'máy tạo ẩm|máy phun sương', 'máy lọc không khí', 'nến thơm|nến', 'máy xông tinh dầu|máy khuếch tán tinh dầu|tinh dầu', 'bịt mắt|bịt mắt ngủ|miếng che mắt', 'chiếu', 'khung ảnh|khung hình|ảnh|hình', 'giá treo quần áo|cây treo quần áo', 'giỏ đựng đồ bẩn|sọt đồ bẩn', 'thùng rác', 'hộp trang sức', 'mỹ phẩm', 'lược', 'máy sấy tóc', 'bàn làm việc', 'đèn led|đèn dây|đèn nháy', 'loa', 'đồng hồ treo tường', 'lịch', 'két sắt', 'ghế lười|ghế hạt xốp', 'tủ ngăn kéo|tủ kéo', 'quạt trần', 'gối tựa lưng|gối tựa', 'chăn điện', 'váy ngủ'],
      4: ['rương|hòm', 'võng', 'giấy dán tường', 'bô', 'máy chiếu', 'bình hoa|lọ hoa', 'đèn chùm', 'chuông gió', 'cây cảnh|chậu cây', 'chăn lông', 'tấm phủ giường|khăn phủ giường', 'đệm ngồi'],
    },
  },
  {
    id: 'hospital-things', group: 'g11', prompt: 'Kể tên một thứ hoặc người bạn gặp ở bệnh viện',
    answers: {
      1: ['bác sĩ|bác sỹ', 'y tá|điều dưỡng', 'bệnh nhân|người bệnh', 'giường bệnh', 'xe cứu thương|xe cấp cứu', 'thuốc', 'kim tiêm|ống tiêm|ống chích|kim chích', 'ống nghe'],
      2: ['nhiệt kế|cặp nhiệt độ|cặp nhiệt', 'máy đo huyết áp', 'phòng mổ|phòng phẫu thuật', 'phòng cấp cứu|cấp cứu', 'xe lăn', 'nạng', 'bó bột|bột|thạch cao', 'băng gạc|băng|gạc|băng keo cá nhân', 'chụp x quang|x quang|máy x quang|phim x quang', 'máy siêu âm|siêu âm', 'khẩu trang', 'áo blouse|áo blu|blouse', 'dịch truyền|truyền dịch|chai truyền|bình truyền|nước biển', 'cáng|băng ca', 'máy thở', 'bông gòn|bông', 'cồn', 'găng tay y tế|găng tay', 'đơn thuốc|toa thuốc', 'nhà thuốc|quầy thuốc|hiệu thuốc', 'dược sĩ', 'người nhà bệnh nhân|người nhà', 'bảo vệ', 'thẻ bảo hiểm y tế|bảo hiểm y tế|bhyt', 'phòng chờ|ghế chờ', 'hồ sơ bệnh án|bệnh án', 'xét nghiệm máu|xét nghiệm|lấy máu', 'máy đo điện tim|điện tim|điện tâm đồ|ecg', 'bình oxy|oxy|ô xy|bình ô xy', 'viện phí|hóa đơn viện phí', 'phòng khám', 'vắc xin|vaccine|vacxin', 'trẻ sơ sinh|em bé', 'bà bầu|sản phụ'],
      3: ['chụp ct|ct|ct scan|chụp cắt lớp|máy ct', 'chụp mri|mri|cộng hưởng từ|chụp cộng hưởng từ', 'hộ lý', 'kỹ thuật viên', 'phòng hồi sức|icu|hồi sức tích cực', 'lồng ấp', 'máy theo dõi|monitor|máy monitor', 'đèn mổ', 'dao mổ', 'kéo', 'kẹp', 'chỉ khâu', 'thuốc mê', 'thuốc tê', 'sinh viên y|thực tập sinh', 'phòng sinh|phòng đẻ', 'máy sốc tim|máy khử rung tim', 'nhà xác', 'ống nghiệm', 'túi máu|máu', 'nẹp', 'vòng đeo tay bệnh nhân', 'quần áo bệnh nhân|đồ bệnh nhân', 'máy nội soi|nội soi', 'chạy thận|máy chạy thận|lọc máu', 'căng tin', 'nước rửa tay|dung dịch sát khuẩn|nước sát khuẩn', 'quầy tiếp đón|quầy lễ tân|lễ tân', 'số thứ tự|phiếu khám', 'thang máy', 'phòng xét nghiệm', 'trưởng khoa'],
      4: ['bô|bô vệ sinh', 'ống thông|sonde', 'máy đo đường huyết', 'máy đo spo2|máy đo nồng độ oxy', 'thuốc sát trùng', 'giấy ra viện', 'người chăm bệnh|người nuôi bệnh', 'tình nguyện viên', 'nhà vệ sinh'],
    },
  },
  {
    id: 'rainy-day-items', group: 'g11', prompt: 'Kể tên một thứ bạn dùng hoặc thấy khi trời mưa',
    answers: {
      1: ['ô|dù', 'áo mưa', 'ủng|giày ủng|ủng cao su', 'sấm|tiếng sấm', 'sét|tia sét|chớp', 'cầu vồng', 'mây đen', 'vũng nước'],
      2: ['mũ|nón', 'cần gạt nước|gạt nước', 'bão', 'lũ|lụt|lũ lụt|ngập|ngập lụt|ngập nước', 'ếch', 'giun|trùn|giun đất', 'ốc sên|sên', 'chăn ấm|chăn|mền', 'mì gói|mì tôm|mì ăn liền', 'cóc', 'nhái', 'sương mù', 'gió', 'giọt mưa|hạt mưa', 'máng xối|ống máng', 'bùn|bùn lầy|bùn đất', 'đường trơn', 'áo khoác', 'mái hiên|hiên nhà', 'nước mưa', 'mưa đá', 'mưa phùn', 'lẩu|nồi lẩu', 'trà nóng|trà gừng', 'kẹt xe|tắc đường', 'mất điện|cúp điện', 'mái dột|nhà dột|dột'],
      3: ['mối cánh|mối|kiến cánh|thiêu thân', 'lốc xoáy|lốc|vòi rồng', 'cột thu lôi', 'nấm mốc|mốc', 'túi ni lông|túi nilon|bao ni lông', 'bọc giày|bao giày', 'cây đổ', 'xô hứng nước|chậu hứng nước', 'thuyền giấy', 'muỗi', 'nấm', 'bạt|tấm bạt|bạt che', 'máy sấy quần áo', 'gió mùa', 'kính chắn gió', 'khăn lau'],
      4: ['lá chuối', 'áo tơi', 'nón lá', 'ống cống|cống', 'lá sen'],
    },
  },
  {
    id: 'emotions', group: 'g11', prompt: 'Kể tên một cảm xúc hoặc trạng thái tâm trạng',
    answers: {
      1: ['vui|vui vẻ', 'buồn|buồn bã', 'giận|tức giận|giận dữ|tức|nổi giận|tức tối', 'sợ|sợ hãi|hoảng sợ|lo sợ|kinh hãi|khiếp sợ', 'lo lắng|lo|lo âu', 'ngạc nhiên|bất ngờ|ngỡ ngàng', 'hạnh phúc', 'cô đơn|cô độc', 'chán|chán nản|chán chường', 'yêu|yêu thương'],
      2: ['ghen tị|ghen tỵ|ganh tị|đố kỵ|đố kị', 'ghen|ghen tuông', 'xấu hổ|mắc cỡ', 'ngại|ngại ngùng|e ngại', 'tự hào|hãnh diện', 'thất vọng', 'nhớ|nhớ nhung|thương nhớ', 'ghét|căm ghét', 'hồi hộp', 'bình tĩnh|bình thản', 'mệt mỏi|mệt', 'căng thẳng|stress|áp lực', 'phấn khích|hào hứng|phấn khởi|hứng khởi|hưng phấn', 'biết ơn|cảm kích', 'xúc động|cảm động', 'tủi thân|tủi', 'hối hận|ân hận|hối tiếc', 'bối rối|lúng túng', 'hoang mang', 'tuyệt vọng', 'hy vọng|hi vọng', 'hài lòng|thỏa mãn|mãn nguyện', 'thoải mái|thư giãn', 'bình yên|yên bình|thanh thản', 'nhẹ nhõm', 'tò mò', 'mừng|vui mừng|mừng rỡ', 'sung sướng|vui sướng|sướng', 'bực bội|bực|bực mình', 'cáu|cáu kỉnh|cáu gắt', 'khó chịu', 'đau khổ|khổ sở|đau lòng', 'thích|thích thú|hứng thú', 'thương|thương cảm|cảm thông|đồng cảm', 'tự tin', 'tự ti', 'yên tâm|an tâm', 'dỗi|hờn dỗi|giận dỗi|hờn'],
      3: ['căm thù|thù hận|hận|oán hận', 'kinh tởm|ghê tởm', 'khinh bỉ|khinh|coi thường', 'hoảng loạn|hốt hoảng|hoảng', 'tổn thương', 'uất ức|ấm ức', 'nhục nhã|nhục', 'lạc quan', 'bi quan', 'thờ ơ|lãnh đạm|vô cảm', 'phẫn nộ', 'sốt ruột|nóng ruột|nôn nóng', 'bất an', 'ngượng|ngượng ngùng', 'e thẹn|thẹn thùng|thẹn', 'tiếc|tiếc nuối|nuối tiếc', 'buồn ngủ', 'trống rỗng|trống trải', 'u sầu|sầu|u buồn|sầu muộn', 'trầm cảm', 'sốc|choáng|choáng váng', 'hụt hẫng', 'bồn chồn|bứt rứt', 'tội lỗi|cắn rứt|day dứt', 'xao xuyến|bâng khuâng', 'say mê|đắm say|đam mê'],
      4: ['chột dạ', 'cay cú|cay', 'quê|quê độ', 'yêu đời', 'chán đời', 'hân hoan', 'ngán ngẩm|ngán', 'thẫn thờ'],
    },
  },
  {
    id: 'social-media-apps', group: 'g11', prompt: 'Kể tên một mạng xã hội hoặc ứng dụng nhắn tin',
    answers: {
      1: ['facebook|fb|face|phây búc', 'zalo', 'tiktok|tik tok|tóp tóp', 'youtube|yt|ytb', 'instagram|insta|ig', 'messenger|mess|facebook messenger'],
      2: ['twitter|x', 'telegram|tele', 'whatsapp', 'viber', 'snapchat|snap', 'threads', 'discord', 'reddit', 'pinterest', 'linkedin', 'wechat|weixin', 'line', 'kakaotalk|kakao', 'skype', 'signal'],
      3: ['weibo', 'douyin', 'xiaohongshu|tiểu hồng thư|rednote', 'tumblr', 'bereal', 'myspace', 'yahoo messenger|yahoo|ym|yahoo chat', 'imessage', 'facetime', 'microsoft teams|teams', 'slack', 'quora', 'twitch', 'vk|vkontakte', 'qq', 'mastodon', 'bluesky', 'lemon8', 'google plus|g plus', 'zing me', 'mocha'],
      4: ['kik', 'icq', 'hi5', 'friendster', 'flickr', 'vine', 'clubhouse', 'google hangouts|hangouts', 'gapo', 'lotus', 'yahoo 360|yahoo 360 độ|blog 360', 'weverse', 'bigo live|bigo', 'odnoklassniki', 'ask fm|askfm'],
    },
  },
];
