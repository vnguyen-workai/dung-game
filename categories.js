// Tiers: 1 = phổ biến (10đ), 2 = khá hiếm (30đ), 3 = hiếm (60đ), 4 = có một không hai (100đ).
// "a|b" = aliases for the same answer.
module.exports = [
  {
    prompt: 'Kể tên một món ăn đường phố Việt Nam',
    answers: {
      1: ['phở', 'bánh mì', 'bún chả', 'cơm tấm', 'bún bò huế|bún bò', 'gỏi cuốn', 'bánh xèo', 'xôi'],
      2: ['bánh cuốn', 'hủ tiếu|hủ tíu', 'bánh tráng trộn', 'bún riêu', 'chè', 'bánh căn', 'bột chiên', 'bánh bèo', 'cháo lòng', 'mì quảng', 'cao lầu', 'bún đậu mắm tôm|bún đậu'],
      3: ['bánh khọt', 'bánh tráng nướng', 'bánh bột lọc', 'bánh nậm', 'ốc luộc', 'bánh đúc', 'nem nướng', 'bánh canh', 'bún mắm', 'phá lấu', 'hột vịt lộn|trứng vịt lộn'],
      4: ['bánh ít', 'bún thang', 'bánh hỏi', 'bánh giò', 'bánh tằm bì', 'bún cá', 'bánh đa cua', 'súp cua', 'bánh ướt'],
    },
  },
  {
    prompt: 'Kể tên một tỉnh hoặc thành phố của Việt Nam',
    answers: {
      1: ['hà nội', 'hồ chí minh|sài gòn|tp hcm|hcm', 'đà nẵng', 'hải phòng', 'huế', 'cần thơ', 'nha trang', 'đà lạt'],
      2: ['quảng ninh', 'khánh hòa', 'lâm đồng', 'nghệ an', 'thanh hóa', 'bình dương', 'đồng nai', 'vũng tàu|bà rịa vũng tàu', 'quảng nam', 'lào cai', 'an giang', 'kiên giang'],
      3: ['ninh bình', 'hà giang', 'quảng bình', 'bình định', 'phú yên', 'gia lai', 'đắk lắk', 'cà mau', 'bến tre', 'tiền giang', 'thái bình', 'nam định', 'bắc ninh', 'hải dương', 'sơn la', 'cao bằng'],
      4: ['lai châu', 'điện biên', 'bắc kạn', 'kon tum', 'đắk nông', 'bạc liêu', 'sóc trăng', 'trà vinh', 'hậu giang', 'ninh thuận', 'tuyên quang', 'yên bái', 'hà nam', 'hòa bình', 'vĩnh long', 'long an', 'tây ninh', 'bình phước', 'bình thuận', 'quảng trị', 'quảng ngãi', 'hà tĩnh', 'phú thọ', 'vĩnh phúc', 'bắc giang', 'lạng sơn', 'thái nguyên', 'hưng yên', 'đồng tháp'],
    },
  },
  {
    prompt: 'Kể tên một loại trái cây',
    answers: {
      1: ['chuối', 'xoài', 'cam', 'táo', 'dưa hấu', 'nho', 'dứa|thơm|khóm', 'sầu riêng'],
      2: ['thanh long', 'chôm chôm', 'măng cụt', 'vải', 'nhãn', 'ổi', 'đu đủ', 'mít', 'bưởi', 'dừa', 'quýt', 'lê', 'dâu tây|dâu'],
      3: ['vú sữa', 'mãng cầu|na', 'chanh dây', 'hồng xiêm|sapoche|xa bô chê', 'khế', 'mận|roi', 'bơ', 'kiwi', 'lựu', 'sơ ri', 'chà là'],
      4: ['bòn bon', 'dâu da', 'trứng gà|lêkima', 'cóc', 'sấu', 'me', 'thị', 'bình bát', 'cherry', 'việt quất', 'lí chi', 'hồng', 'dưa lưới'],
    },
  },
  {
    prompt: 'Kể tên một con vật',
    answers: {
      1: ['chó', 'mèo', 'gà', 'bò', 'heo|lợn', 'vịt', 'cá', 'trâu', 'chim', 'ngựa'],
      2: ['voi', 'hổ|cọp', 'sư tử', 'khỉ', 'gấu', 'rắn', 'thỏ', 'dê', 'cừu', 'chuột', 'ếch', 'rùa', 'cá sấu'],
      3: ['hươu cao cổ', 'ngựa vằn', 'tê giác', 'hà mã', 'chim cánh cụt', 'cá heo', 'cá voi', 'kangaroo|chuột túi', 'đà điểu', 'gấu trúc', 'bạch tuộc', 'sứa'],
      4: ['tê tê', 'cầy hương', 'sao la', 'voọc', 'kỳ đà', 'tắc kè', 'nhím', 'rái cá', 'lạc đà', 'cú mèo|cú', 'bò sát', 'kỳ nhông', 'cá ngựa', 'mực'],
    },
  },
  {
    prompt: 'Kể tên một ca sĩ Việt Nam',
    answers: {
      1: ['sơn tùng|sơn tùng mtp', 'mỹ tâm', 'đen|đen vâu', 'hà anh tuấn', 'đàm vĩnh hưng', 'hồ ngọc hà'],
      2: ['noo phước thịnh', 'đông nhi', 'erik', 'jack|j97', 'bích phương', 'min', 'soobin|soobin hoàng sơn', 'hoàng thùy linh', 'tóc tiên', 'chi pu', 'amee', 'hòa minzy'],
      3: ['vũ', 'hieuthuhai', 'mono', 'binz', 'karik', 'suboi', 'đức phúc', 'văn mai hương', 'trúc nhân', 'isaac', 'tuấn hưng', 'lam trường', 'phương ly'],
      4: ['khánh ly', 'tuấn ngọc', 'thanh lam', 'hồng nhung', 'mỹ linh', 'trần thu hà', 'quang lê', 'cẩm ly', 'đan trường', 'ưng hoàng phúc', 'hà trần', 'lệ quyên', 'grey d', 'wren evans', 'obito', 'tlinh'],
    },
  },
  {
    prompt: 'Kể tên một món đồ trong nhà bếp',
    answers: {
      1: ['nồi', 'chảo', 'dao', 'đũa', 'muỗng|thìa', 'chén|bát', 'đĩa|dĩa', 'tủ lạnh'],
      2: ['nồi cơm điện', 'bếp ga', 'thớt', 'vá|muôi', 'ly|cốc', 'ấm|ấm nước', 'lò vi sóng', 'nĩa', 'rổ'],
      3: ['nồi chiên không dầu', 'máy xay sinh tố', 'kéo', 'giá đỡ', 'khăn lau', 'lò nướng', 'nồi áp suất', 'máy rửa chén'],
      4: ['cối', 'chày', 'cối đá', 'vỉ nướng', 'rây', 'phới', 'muôi thủng', 'giỏ tre', 'mâm', 'nạo'],
    },
  },
  {
    prompt: 'Kể tên một môn thể thao',
    answers: {
      1: ['bóng đá', 'bóng chuyền', 'cầu lông', 'bơi|bơi lội', 'bóng rổ', 'chạy bộ'],
      2: ['tennis|quần vợt', 'bóng bàn', 'võ', 'đá cầu', 'cờ vua', 'golf', 'xe đạp|đạp xe', 'pickleball'],
      3: ['vovinam', 'judo', 'karate', 'taekwondo', 'boxing|quyền anh', 'bắn cung', 'thể dục dụng cụ', 'trượt ván', 'lướt sóng', 'leo núi'],
      4: ['đấu kiếm', 'polo', 'bóng bầu dục', 'bóng chày', 'cricket', 'curling', 'đua thuyền', 'kéo co', 'vật', 'cử tạ', 'nhảy cầu', 'khúc côn cầu'],
    },
  },
  {
    prompt: 'Kể tên một thương hiệu nổi tiếng',
    answers: {
      1: ['apple', 'samsung', 'honda', 'vinamilk', 'coca cola|coca|coke', 'nike'],
      2: ['toyota', 'adidas', 'vinfast', 'viettel', 'grab', 'shopee', 'pepsi', 'trung nguyên', 'highlands', 'yamaha'],
      3: ['biti\'s|bitis', 'masan', 'vingroup', 'tiki', 'momo', 'zalo', 'the coffee house', 'phúc long', 'kfc', 'starbucks', 'lotteria', 'sony'],
      4: ['bkav', 'rạng đông', 'kinh đô', 'acecook', 'hảo hảo', 'thiên long', 'cộng cà phê|cộng', 'vietjet', 'bamboo', 'casio'],
    },
  },
  {
    prompt: 'Kể tên một thứ có màu đỏ',
    answers: {
      1: ['máu', 'lửa', 'cà chua', 'táo', 'dâu', 'cờ việt nam|cờ', 'hoa hồng', 'ớt'],
      2: ['bao lì xì|lì xì', 'đèn lồng', 'son môi|son', 'thanh long', 'dưa hấu', 'xe cứu hỏa', 'đèn đỏ', 'tim'],
      3: ['câu đối', 'pháo', 'hoa phượng', 'gạch', 'củ dền', 'cua luộc', 'tôm luộc', 'quả gấc|gấc', 'mặt trời'],
      4: ['san hô', 'hồng ngọc|ruby', 'bọ rùa', 'sao hỏa', 'vải thiều', 'cherry', 'nho đỏ', 'lá phong', 'ông già noel'],
    },
  },
  {
    prompt: 'Kể tên một nghề nghiệp',
    answers: {
      1: ['bác sĩ', 'giáo viên|cô giáo|thầy giáo', 'kỹ sư', 'công an|cảnh sát', 'nông dân', 'ca sĩ'],
      2: ['y tá', 'đầu bếp', 'lập trình viên', 'luật sư', 'kế toán', 'tài xế', 'thợ may', 'thợ cắt tóc', 'nhà báo', 'diễn viên'],
      3: ['phi công', 'kiến trúc sư', 'thợ điện', 'thợ hồ', 'ngư dân', 'dược sĩ', 'nha sĩ', 'bộ đội', 'lính cứu hỏa', 'họa sĩ', 'nhiếp ảnh gia'],
      4: ['thợ kim hoàn', 'thợ rèn', 'phiên dịch viên', 'thủ thư', 'xe ôm', 'shipper', 'thợ lặn', 'nhà khảo cổ', 'thầy bói', 'thợ mộc', 'bảo vệ', 'quản gia'],
    },
  },
  {
    prompt: 'Kể tên một thứ bạn thấy trong ngày Tết',
    answers: {
      1: ['bánh chưng', 'lì xì|bao lì xì', 'hoa mai|mai', 'hoa đào|đào', 'pháo hoa', 'bánh tét'],
      2: ['mứt', 'câu đối', 'dưa hành', 'thịt kho', 'cây quất|quất', 'mâm ngũ quả', 'áo dài', 'giò lụa|chả lụa'],
      3: ['hạt dưa', 'củ kiệu', 'nem', 'múa lân', 'ông đồ', 'xin chữ', 'cây nêu', 'đèn lồng', 'chợ hoa'],
      4: ['ông công ông táo|táo quân', 'cá chép', 'xông đất', 'đi lễ chùa|lễ chùa', 'canh khổ qua', 'thịt đông', 'bánh in', 'hái lộc', 'tranh đông hồ'],
    },
  },
  {
    prompt: 'Kể tên một phương tiện giao thông',
    answers: {
      1: ['xe máy', 'ô tô|xe hơi', 'xe đạp', 'máy bay', 'xe buýt|xe bus', 'tàu hỏa|xe lửa'],
      2: ['tàu thủy', 'thuyền', 'taxi', 'xe tải', 'xích lô', 'tàu điện|metro', 'trực thăng'],
      3: ['ghe', 'xuồng', 'xe ba gác', 'xe cứu thương', 'du thuyền', 'tàu ngầm', 'xe điện', 'cáp treo', 'xe lôi'],
      4: ['khinh khí cầu', 'thuyền thúng', 'tên lửa', 'tàu vũ trụ', 'xe trượt tuyết', 'xe ngựa', 'xe bò', 'phà', 'bè', 'xe container'],
    },
  },

  // ---------- Địa lý Việt Nam ----------
  {
    prompt: 'Kể tên một con sông ở Việt Nam',
    answers: {
      1: ['sông hồng', 'sông mekong|sông cửu long|mekong|cửu long', 'sông hương', 'sông sài gòn'],
      2: ['sông đà', 'sông đồng nai', 'sông hàn', 'sông tiền', 'sông hậu', 'sông lô', 'sông mã', 'sông cầu'],
      3: ['sông thu bồn', 'sông lam|sông cả', 'sông gianh', 'sông bến hải', 'sông thao', 'sông đuống', 'sông bạch đằng|bạch đằng', 'sông vàm cỏ'],
      4: ['sông kỳ cùng', 'sông chảy', 'sông gâm', 'sông nhật lệ', 'sông trà khúc', 'sông ba|sông đà rằng', 'sông sê san', 'sông srêpốk|srepok', 'sông thạch hãn', 'sông đáy', 'sông nho quế', 'sông bé', 'sông tô lịch'],
    },
  },
  {
    prompt: 'Kể tên một bãi biển, đảo hoặc vịnh ở Việt Nam',
    answers: {
      1: ['vịnh hạ long|hạ long', 'phú quốc', 'nha trang', 'mỹ khê', 'vũng tàu'],
      2: ['côn đảo', 'cát bà', 'lý sơn', 'mũi né', 'sầm sơn', 'cửa lò', 'quy nhơn', 'hoàng sa', 'trường sa', 'cô tô'],
      3: ['vịnh lan hạ|lan hạ', 'nam du', 'cù lao chàm', 'đồ sơn', 'bãi cháy', 'phú yên', 'bái tử long', 'cam ranh', 'non nước', 'thiên cầm', 'ninh chữ', 'kỳ co', 'eo gió'],
      4: ['bạch long vĩ', 'phú quý', 'hòn sơn', 'hòn tre', 'vịnh vĩnh hy|vĩnh hy', 'quan lạn', 'minh châu', 'hòn khoai', 'bãi xếp', 'cồn cỏ', 'vân đồn', 'hòn mun', 'thổ chu'],
    },
  },
  {
    prompt: 'Kể tên một ngọn núi, đèo hoặc cao nguyên ở Việt Nam',
    answers: {
      1: ['fansipan|phan xi păng', 'đèo hải vân|hải vân', 'núi bà đen|bà đen', 'tây nguyên'],
      2: ['đèo mã pí lèng|mã pí lèng', 'langbiang|lang biang', 'núi ngũ hành sơn|ngũ hành sơn', 'đèo ô quy hồ|ô quy hồ', 'cao nguyên đá đồng văn|đồng văn', 'tam đảo', 'ba vì', 'yên tử', 'bạch mã'],
      3: ['đèo khau phạ|khau phạ', 'đèo cù mông', 'đèo cả', 'núi bà rá', 'núi cấm', 'pù luông', 'mộc châu', 'bà nà', 'núi sam', 'tà xùa', 'putaleng'],
      4: ['đèo prenn', 'đèo ngoạn mục', 'đèo pha đin', 'đèo lò xo', 'núi chứa chan', 'chư yang sin', 'ngọc linh', 'lảo thẩn', 'bạch mộc lương tử|ky quan san', 'núi tản viên|tản viên', 'đèo ngang', 'núi hàm rồng'],
    },
  },
  {
    prompt: 'Kể tên một địa danh, di tích nổi tiếng ở Việt Nam',
    answers: {
      1: ['hồ gươm|hồ hoàn kiếm', 'lăng bác|lăng chủ tịch hồ chí minh', 'phố cổ hội an|hội an', 'văn miếu', 'chợ bến thành', 'cầu rồng'],
      2: ['chùa một cột', 'đại nội huế|kinh thành huế|đại nội', 'tràng an', 'phong nha kẻ bàng|phong nha', 'nhà thờ đức bà', 'dinh độc lập', 'địa đạo củ chi|củ chi', 'cầu vàng', 'mỹ sơn|thánh địa mỹ sơn', 'chùa bái đính|bái đính'],
      3: ['hang sơn đoòng|sơn đoòng', 'thác bản giốc|bản giốc', 'hoàng thành thăng long', 'chùa hương', 'tam cốc', 'cột cờ lũng cú|lũng cú', 'chùa thiên mụ', 'lăng khải định', 'nhà tù côn đảo', 'thành nhà hồ'],
      4: ['chùa tây phương', 'đền hùng', 'cố đô hoa lư|hoa lư', 'tháp chàm', 'chùa dâu', 'thành cổ quảng trị', 'nhà thờ đá phát diệm|phát diệm', 'chùa trấn quốc', 'đồi a1', 'cầu tràng tiền', 'nhà hát lớn', 'bưu điện thành phố', 'nhà rông'],
    },
  },
  {
    prompt: 'Kể tên một dân tộc ở Việt Nam',
    answers: {
      1: ['kinh|việt', 'tày', 'thái', 'mường', 'h\'mông|hmong|mông'],
      2: ['khmer|khơ me', 'hoa', 'nùng', 'dao', 'ê đê|ede', 'chăm', 'gia rai|jrai'],
      3: ['ba na|bahnar', 'xơ đăng', 'sán chay', 'cơ ho', 'sán dìu', 'hrê', 'mnông', 'ra glai', 'xtiêng', 'bru vân kiều|vân kiều', 'thổ', 'giáy', 'cơ tu', 'tà ôi'],
      4: ['gié triêng', 'mạ', 'khơ mú', 'co', 'chơ ro', 'kháng', 'xinh mun', 'hà nhì', 'chu ru', 'lào', 'la chí', 'la ha', 'phù lá', 'lô lô', 'chứt', 'mảng', 'pà thẻn', 'cơ lao', 'cống', 'bố y', 'si la', 'pu péo', 'brâu', 'ơ đu', 'rơ măm', 'lự', 'ngái'],
    },
  },
  {
    prompt: 'Kể tên một nhân vật lịch sử Việt Nam',
    answers: {
      1: ['hồ chí minh|bác hồ', 'trần hưng đạo', 'võ nguyên giáp', 'hai bà trưng', 'lý thường kiệt', 'quang trung|nguyễn huệ'],
      2: ['bà triệu|triệu thị trinh', 'ngô quyền', 'lê lợi', 'lý thái tổ|lý công uẩn', 'nguyễn trãi', 'đinh bộ lĩnh|đinh tiên hoàng', 'lê thánh tông', 'phan bội châu', 'phan châu trinh'],
      3: ['lê hoàn|lê đại hành', 'trần nhân tông', 'nguyễn du', 'trần quốc toản', 'võ thị sáu', 'nguyễn ánh|gia long', 'hồ xuân hương', 'chu văn an', 'tô hiến thành', 'yết kiêu'],
      4: ['mạc đăng dung', 'hồ quý ly', 'lý chiêu hoàng', 'trần thủ độ', 'nguyễn bỉnh khiêm', 'lê quý đôn', 'nguyễn thái học', 'phan đình phùng', 'hoàng hoa thám|đề thám', 'trương định', 'nguyễn trung trực', 'mai hắc đế', 'phùng hưng', 'lý bí|lý nam đế'],
    },
  },

  // ---------- Thế giới ----------
  {
    prompt: 'Kể tên một quốc gia',
    answers: {
      1: ['việt nam', 'mỹ|hoa kỳ', 'trung quốc', 'nhật bản|nhật', 'hàn quốc', 'thái lan', 'pháp', 'anh'],
      2: ['lào', 'campuchia', 'singapore', 'malaysia', 'indonesia', 'philippines', 'úc|australia', 'đức', 'nga', 'ấn độ', 'brazil', 'canada', 'ý', 'tây ban nha'],
      3: ['myanmar', 'brunei', 'đông timor|timor leste', 'mông cổ', 'đài loan', 'argentina', 'mexico', 'bồ đào nha', 'hà lan', 'bỉ', 'thụy sĩ', 'thụy điển', 'na uy', 'ai cập', 'nam phi', 'thổ nhĩ kỳ', 'new zealand', 'ba lan'],
      4: ['bhutan', 'nepal', 'iceland', 'phần lan', 'đan mạch', 'áo', 'hy lạp', 'croatia', 'séc|cộng hòa séc', 'ukraine', 'kazakhstan', 'iran', 'iraq', 'israel', 'ả rập xê út|saudi arabia', 'qatar', 'kenya', 'nigeria', 'ghana', 'morocco|ma rốc', 'peru', 'chile', 'colombia', 'cuba', 'jamaica', 'fiji', 'madagascar', 'sri lanka', 'pakistan', 'bangladesh', 'maldives', 'ireland', 'scotland'],
    },
  },
  {
    prompt: 'Kể tên một thủ đô trên thế giới',
    answers: {
      1: ['hà nội', 'tokyo', 'bắc kinh', 'seoul', 'bangkok', 'paris', 'london', 'washington|washington dc'],
      2: ['viêng chăn|vientiane', 'phnôm pênh|phnom penh', 'kuala lumpur', 'jakarta', 'manila', 'singapore', 'moscow|mát xcơ va', 'berlin', 'rome', 'madrid', 'canberra', 'ottawa', 'new delhi'],
      3: ['naypyidaw', 'bandar seri begawan', 'dili', 'ulaanbaatar|ulan bato', 'đài bắc|taipei', 'amsterdam', 'brussels', 'bern', 'stockholm', 'oslo', 'lisbon', 'athens', 'cairo', 'buenos aires', 'brasília|brasilia', 'mexico city'],
      4: ['thimphu', 'kathmandu', 'reykjavik', 'helsinki', 'copenhagen', 'vienna|viên', 'warsaw|vác sa va', 'prague|praha', 'budapest', 'kyiv|kiev', 'ankara', 'tehran', 'baghdad', 'riyadh', 'doha', 'nairobi', 'lima', 'santiago', 'bogotá|bogota', 'havana', 'wellington', 'pretoria', 'abuja', 'colombo', 'islamabad', 'dhaka', 'dublin', 'astana'],
    },
  },
  {
    prompt: 'Kể tên một thành phố nổi tiếng thế giới (không phải thủ đô)',
    answers: {
      1: ['new york', 'los angeles', 'thượng hải|shanghai', 'osaka', 'dubai', 'hồng kông|hong kong'],
      2: ['san francisco', 'las vegas', 'chicago', 'miami', 'sydney', 'melbourne', 'barcelona', 'milan', 'venice', 'busan', 'kyoto', 'quảng châu', 'thâm quyến', 'phuket', 'pattaya', 'chiang mai', 'bali'],
      3: ['toronto', 'vancouver', 'rio de janeiro', 'são paulo|sao paulo', 'istanbul', 'mumbai', 'manchester', 'liverpool', 'munich', 'frankfurt', 'florence', 'nice', 'marseille', 'macau|ma cao', 'siem reap', 'luang prabang', 'penang'],
      4: ['geneva', 'zurich', 'hamburg', 'porto', 'seville', 'saint petersburg', 'casablanca', 'cape town', 'auckland', 'boston', 'seattle', 'houston', 'nagoya', 'sapporo', 'jeju', 'trùng khánh', 'thành đô', 'hàng châu', 'cebu', 'yogyakarta', 'mandalay', 'yangon'],
    },
  },
  {
    prompt: 'Kể tên một kỳ quan hoặc công trình nổi tiếng thế giới',
    answers: {
      1: ['vạn lý trường thành', 'tháp eiffel', 'kim tự tháp', 'tượng nữ thần tự do', 'angkor wat'],
      2: ['taj mahal', 'đấu trường la mã|colosseum', 'machu picchu', 'tháp nghiêng pisa', 'burj khalifa', 'tượng chúa cứu thế', 'big ben', 'cầu cổng vàng', 'nhà hát opera sydney'],
      3: ['petra', 'chichen itza', 'stonehenge', 'tử cấm thành', 'cung điện buckingham', 'bảo tàng louvre', 'đền parthenon', 'khải hoàn môn', 'tượng nhân sư', 'núi phú sĩ', 'borobudur', 'marina bay sands', 'tháp đôi petronas|petronas'],
      4: ['moai|tượng đá đảo phục sinh', 'sagrada familia', 'alhambra', 'neuschwanstein', 'mont saint michel', 'bagan', 'cung điện potala', 'thác niagara', 'grand canyon', 'great barrier reef|rạn san hô great barrier', 'điện kremlin', 'hagia sophia', 'cung điện versailles', 'tháp tokyo', 'shwedagon'],
    },
  },
  {
    prompt: 'Kể tên một ngôn ngữ',
    answers: {
      1: ['tiếng việt', 'tiếng anh', 'tiếng trung|tiếng hoa', 'tiếng nhật', 'tiếng hàn', 'tiếng pháp'],
      2: ['tiếng thái', 'tiếng đức', 'tiếng nga', 'tiếng tây ban nha', 'tiếng lào', 'tiếng khmer', 'tiếng ý', 'tiếng quảng đông'],
      3: ['tiếng ả rập', 'tiếng bồ đào nha', 'tiếng hindi', 'tiếng indonesia', 'tiếng mã lai', 'tiếng hà lan', 'tiếng thổ nhĩ kỳ', 'tiếng tagalog|tiếng philippines', 'tiếng latin', 'tiếng chăm'],
      4: ['tiếng swahili', 'tiếng hebrew|tiếng do thái', 'tiếng ba tư', 'tiếng hy lạp', 'tiếng ba lan', 'tiếng thụy điển', 'tiếng phần lan', 'tiếng mông cổ', 'tiếng miến điện', 'tiếng nepal', 'tiếng bengal', 'tiếng tamil', 'tiếng esperanto', 'tiếng phạn', 'tiếng h\'mông', 'tiếng tày'],
    },
  },
  {
    prompt: 'Kể tên một loại tiền tệ',
    answers: {
      1: ['đồng|vnd|việt nam đồng', 'đô la|đô la mỹ|usd|dollar', 'euro', 'yên|yên nhật', 'nhân dân tệ|tệ|yuan'],
      2: ['won', 'baht', 'bảng anh|pound', 'đô la úc', 'đô la singapore', 'ringgit', 'rupee', 'rúp|ruble'],
      3: ['kip', 'riel', 'rupiah', 'peso', 'franc|franc thụy sĩ', 'đô la canada', 'đô la hồng kông', 'đài tệ', 'dirham', 'lira', 'real'],
      4: ['kyat', 'tugrik', 'rand', 'krona', 'krone', 'zloty', 'forint', 'shekel', 'riyal', 'dinar', 'naira', 'bitcoin'],
    },
  },

  // ---------- Thể thao ----------
  {
    prompt: 'Kể tên một cầu thủ bóng đá nổi tiếng thế giới',
    answers: {
      1: ['messi|lionel messi', 'ronaldo|cristiano ronaldo|cr7', 'neymar', 'mbappé|mbappe', 'pelé|pele', 'maradona'],
      2: ['haaland', 'beckham|david beckham', 'zidane', 'ronaldinho', 'salah', 'kaká|kaka', 'benzema', 'modric', 'de bruyne', 'kane|harry kane', 'son heung min|son heung-min'],
      3: ['vinicius', 'bellingham', 'lewandowski', 'griezmann', 'henry|thierry henry', 'rooney', 'buffon', 'iniesta', 'xavi', 'beckenbauer', 'cruyff', 'ibrahimovic', 'suárez|suarez', 'lamine yamal|yamal'],
      4: ['pirlo', 'maldini', 'puskas', 'eusebio', 'eto o|eto\'o', 'drogba', 'gerrard', 'lampard', 'van basten', 'casillas', 'neuer', 'pedri', 'rodri', 'saka', 'foden', 'kroos', 'van dijk', 'pogba', 'figo', 'baggio', 'totti', 'raul'],
    },
  },
  {
    prompt: 'Kể tên một cầu thủ bóng đá Việt Nam',
    answers: {
      1: ['quang hải|nguyễn quang hải', 'công phượng|nguyễn công phượng', 'văn hậu|đoàn văn hậu', 'tiến linh|nguyễn tiến linh', 'đặng văn lâm|văn lâm'],
      2: ['văn toàn|nguyễn văn toàn', 'hùng dũng|đỗ hùng dũng', 'xuân trường|lương xuân trường', 'duy mạnh|đỗ duy mạnh', 'quế ngọc hải|ngọc hải', 'tuấn anh|nguyễn tuấn anh', 'văn thanh|vũ văn thanh', 'xuân son|nguyễn xuân son'],
      3: ['lê công vinh|công vinh', 'lê huỳnh đức|huỳnh đức', 'phạm thành lương|thành lương', 'đình trọng|trần đình trọng', 'bùi tiến dũng', 'văn quyết|nguyễn văn quyết', 'thanh bình', 'hoàng đức|nguyễn hoàng đức', 'filip nguyễn', 'tuấn hải|phạm tuấn hải', 'đình bắc|nguyễn đình bắc', 'huỳnh như'],
      4: ['lê văn tân', 'nguyễn hồng sơn|hồng sơn', 'triệu quang hà', 'văn sỹ hùng', 'phạm văn quyến|văn quyến', 'lê tấn tài', 'nguyễn minh phương', 'phan văn tài em|tài em', 'dương hồng sơn', 'thanh hưng', 'quang thanh', 'văn thuận'],
    },
  },
  {
    prompt: 'Kể tên một câu lạc bộ bóng đá',
    answers: {
      1: ['manchester united|man utd|mu', 'real madrid|real', 'barcelona|barca', 'manchester city|man city', 'liverpool', 'chelsea', 'arsenal'],
      2: ['bayern munich|bayern', 'juventus|juve', 'psg|paris saint germain', 'ac milan|milan', 'inter milan|inter', 'tottenham|spurs', 'hà nội fc|clb hà nội', 'hoàng anh gia lai|hagl'],
      3: ['atletico madrid', 'dortmund|borussia dortmund', 'napoli', 'as roma|roma', 'ajax', 'newcastle', 'aston villa', 'thể công|viettel', 'nam định|thép xanh nam định', 'công an hà nội|cahn', 'bình dương|becamex bình dương', 'sông lam nghệ an|slna'],
      4: ['porto', 'benfica', 'celtic', 'lazio', 'sevilla', 'valencia', 'leverkusen', 'everton', 'west ham', 'al nassr', 'inter miami', 'boca juniors', 'hải phòng', 'thanh hóa', 'sài gòn fc', 'hồng lĩnh hà tĩnh|hà tĩnh', 'quảng nam'],
    },
  },
  {
    prompt: 'Kể tên một vận động viên Việt Nam (không phải bóng đá)',
    answers: {
      1: ['hoàng xuân vinh', 'nguyễn thị ánh viên|ánh viên', 'nguyễn tiến minh|tiến minh'],
      2: ['lý hoàng nam', 'trương thanh hằng', 'nguyễn thùy linh|thùy linh', 'thạch kim tuấn', 'trần hiếu ngân', 'lê quang liêm|quang liêm', 'nguyễn thị oanh', 'lê văn công'],
      3: ['vũ thị hương', 'nguyễn thị thật', 'trần văn thi', 'hoàng quý phước', 'nguyễn huy hoàng|huy hoàng', 'đỗ thị ngân thương', 'phạm thị thu hiền', 'quách thị lan', 'hoàng thị duyên', 'nguyễn thị huyền'],
      4: ['nguyễn ngọc trường sơn|trường sơn', 'đào thiên hải', 'lê bích phương', 'trương thị kim tuyền', 'nguyễn văn hùng', 'đinh phương thành', 'nguyễn hoàng ngân', 'bùi thị thu thảo', 'nguyễn thị lụa', 'trần lê quốc toàn', 'vương thị huyền'],
    },
  },
  {
    prompt: 'Kể tên một giải đấu hoặc sự kiện thể thao',
    answers: {
      1: ['world cup', 'olympic|thế vận hội', 'sea games', 'euro'],
      2: ['champions league|cúp c1|c1', 'premier league|ngoại hạng anh', 'aff cup|asean cup', 'asian cup', 'v league', 'asiad|asian games', 'la liga'],
      3: ['serie a', 'bundesliga', 'ligue 1', 'copa america', 'wimbledon', 'nba', 'super bowl', 'tour de france', 'paralympic', 'europa league|cúp c2', 'u23 châu á'],
      4: ['us open', 'roland garros|pháp mở rộng', 'úc mở rộng|australian open', 'f1|formula 1', 'world series', 'ryder cup', 'masters', 'dakar rally', 'giải xe đạp cúp truyền hình|cúp truyền hình', 'giải marathon', 'motogp', 'club world cup', 'nations league', 'king\'s cup|king cup'],
    },
  },
  {
    prompt: 'Kể tên một môn thi đấu ở Olympic',
    answers: {
      1: ['bóng đá', 'điền kinh', 'bơi lội|bơi', 'bóng rổ', 'bóng chuyền', 'thể dục dụng cụ'],
      2: ['bắn súng', 'cử tạ', 'cầu lông', 'quần vợt|tennis', 'bóng bàn', 'quyền anh|boxing', 'taekwondo', 'judo', 'đua xe đạp|xe đạp'],
      3: ['bắn cung', 'đấu kiếm', 'vật', 'chèo thuyền', 'nhảy cầu', 'bơi nghệ thuật', 'bóng ném', 'khúc côn cầu|hockey', 'karate', 'golf', 'leo núi thể thao', 'trượt ván'],
      4: ['ba môn phối hợp', 'năm môn phối hợp hiện đại', 'cưỡi ngựa', 'bóng nước', 'canoeing|đua thuyền kayak', 'lướt ván buồm', 'breaking|breakdance', 'lướt sóng', 'bóng chày', 'rugby|bóng bầu dục', 'trượt tuyết', 'trượt băng', 'bobsleigh', 'curling'],
    },
  },
];
