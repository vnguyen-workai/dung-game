// ĐÙNG topics batch extra11-07: VN bands, VN creators, craft villages, theme parks, zodiac/con giáp.
// Aliases separated by "|": display name first, then other names players type.
module.exports = [
  {
    id: 'vn-bands-groups',
    group: 'g11',
    prompt: 'Kể tên một ban nhạc hoặc nhóm nhạc Việt Nam',
    answers: {
      1: ['bức tường|bức tường band', 'microwave', 'ngũ cung', 'chillies|the chillies', 'da lab|dalab', 'mtv|nhóm mtv', 'ngọt|ngọt band', 'cá hồi hoang|chh', '365daband|365|365 band|365 da band', 'monstar'],
      2: ['hkt|hkt band', 'v.music|v music|vmusic', 'mắt ngọc', '5 dòng kẻ|năm dòng kẻ', 'uptown', 'lime|nhóm lime', 'the men', 'spacespeakers|space speakers', 'gerdnang', 'uni5|uni 5', 'ac&m|acm|ac m', 'la thăng', 'oplus|o plus', 'lip b|lipb', 'sgo48|sgo 48'],
      3: ['unlimited|unlimited band', 'black infinity', 'hạc san', 'hoa dâm bụt', 'weboys|we boys', 'm4u', 'bb&bg|bbbg|bb bg|big boys and beautiful girls', 'tam ca áo trắng', 'phượng hoàng|ban nhạc phượng hoàng', 'thăng long|ban nhạc thăng long', 'quả dưa hấu|dưa hấu', '7uppercuts|7 uppercuts'],
      4: ['cbc|ban nhạc cbc', 'rắn cạp đuôi', 'tik tik tak|tiktiktak', 'hợp ca thăng long'],
    },
  },
  {
    id: 'vn-streamers',
    group: 'g11',
    prompt: 'Kể tên một YouTuber, streamer hoặc TikToker Việt Nam',
    answers: {
      1: ['độ mixi|mixi|mixigaming|mixi gaming|phùng thanh độ|độ tộc trưởng', 'pewpew|pew pew', 'viruss|virus', 'misthy|mis thy', 'thầy giáo ba|thầy ba', 'cris devil gamer|cris devil|cris', 'quang linh vlogs|quang linh vlog|quang linh|đỗ quang linh', 'bà tân vlog|bà tân', 'khoai lang thang|đinh võ hoài phương'],
      2: ['schannel|s channel', 'sang vlog', 'huấn hoa hồng|bùi xuân huấn', 'na gây mê', 'nờ ô nô', 'tun phạm', 'hùng akira', 'bomman', 'xemesis', 'linh ngọc đàm', 'fap tv|faptv', 'hậu hoàng', 'huỳnh lập', 'ẩm thực mẹ làm', 'vanh leg|vanhleg', 'mì gõ|mỳ gõ', 'giang ơi', 'changmakeup|chang makeup', 'chloe nguyễn', 'duy thẩm', 'jvevermind|jv evermind', 'ntn vlogs|ntn vlog|ntn', 'hưng vlog', 'khá bảnh|ngô bá khá', 'lộc fuho', 'võ hà linh|hà linh|hà linh official', 'thơ nguyễn', 'simmy|mèo simmy', 'hero team'],
      3: ['oops banana', 'lê bống', 'quỳnh trần jp|quỳnh trần', 'nhism', 'tiền zombie v4|tiền zombie', 'yến nồi cơm điện', 'kairon', 'mr vịt|mister vịt', 'sammy|sammy đào', 'phong cận', 'duy luân', 'tinhte|tinh tế', 'vật vờ studio|vật vờ', 'ăn cùng bà tuyết|bà tuyết', 'lôi con', 'phê phim', 'trần đức bo|đức bo'],
      4: ['hằng du mục', 'lâm chấn khang'],
    },
  },
  {
    id: 'vn-crafts-villages',
    group: 'g11',
    prompt: 'Kể tên một làng nghề hoặc nghề thủ công truyền thống Việt Nam',
    answers: {
      1: ['gốm bát tràng|bát tràng|làng gốm bát tràng|làng bát tràng', 'tranh đông hồ|đông hồ|làng tranh đông hồ|làng đông hồ', 'lụa vạn phúc|vạn phúc|làng lụa vạn phúc|lụa hàđông|làng vạn phúc', 'nón lá|làm nón|làm nón lá|làng nón chuông|nón chuông|nón bàithơ', 'mây tre đan|đan mây tre|mây tre|đan lát|đan tre|làng mây tre đan phú vinh|phú vinh', 'sơn mài|tranh sơn mài|làng sơn mài hạ thái|hạ thái', 'gốm|làm gốm|nghề gốm|gốm sứ|nặn gốm'],
      2: ['khảm trai|khảm xà cừ|làng khảm trai chuôn ngọ|chuôn ngọ', 'đúc đồng|làng đúc đồng', 'đồng đại bái|đại bái|làng đồng đại bái|gò đồng đại bái|làng gò đồng đại bái', 'chạm bạc đồng xâm|đồng xâm|làng bạc đồng xâm|làng chạm bạc đồng xâm', 'gốm chu đậu|chu đậu', 'dệt thổ cẩm|thổ cẩm', 'giấy dó|làm giấy dó|làng giấy dó|giấy dó yên thái', 'rèn|làng rèn|thợ rèn|nghề rèn', 'mộc|làm mộc|thợ mộc|nghề mộc', 'mộc kim bồng|kim bồng|làng mộc kim bồng', 'đèn lồng|làm đèn lồng|làng đèn lồng|đèn lồng hộian|lồng hộian', 'nước mắm|làm nước mắm|làm mắm|nước mắm phúquốc|nước mắm phanthiết|mắm phúquốc|mắm phanthiết', 'gốm thanh hà|thanh hà|làng gốm thanh hà', 'tranh hàng trống|hàng trống', 'chạm khắc gỗ|khắc gỗ|điêu khắc gỗ|chạm gỗ', 'đồ gỗ đồng kỵ|đồng kỵ|làng đồng kỵ', 'đá non nước|non nước|làng đá non nước|đá mỹ nghệ non nước|điêu khắc đá non nước', 'thêu|thêu tay|nghề thêu', 'dệt vải|dệt lụa|ươm tơ|dệt|dệt vải lụa', 'tò he|nặn tò he|làng tò he xuân la|xuân la', 'chiếu nga sơn|nga sơn|chiếu cói nga sơn', 'cốm làng vòng|cốm vòng|làng vòng|làm cốm'],
      3: ['gốm phù lãng|phù lãng', 'gốm biên hòa|biên hòa', 'gốm bàu trúc|bàu trúc|làng gốm bàu trúc', 'tranh làng sình|làng sình|tranh sình', 'lụa tân châu|tân châu|lãnh mỹ a', 'đúc đồng phước kiều|phước kiều|làng đồng phước kiều', 'đúc đồng ngũ xã|ngũ xã|làng ngũ xã', 'kim hoàn|làm vàng bạc|vàng bạc định công|định công', 'chạm bạc|làm bạc|chạm khắc bạc', 'rèn đa sỹ|đa sỹ|đa sĩ|làng rèn đa sỹ', 'thêu quất động|quất động|làng thêu quất động', 'làm hương|làm nhang|se nhang|hương trầm|làm hương trầm', 'làng hương quảng phú cầu|quảng phú cầu', 'bánh tráng trảng bàng|trảng bàng|làm bánh tráng|bánh tráng', 'kẹo dừa|làm kẹo dừa|kẹo dừa bếntre', 'dệt chiếu|chiếu cói|làm chiếu', 'trống đọi tam|đọi tam|làm trống|làng trống đọi tam', 'chuồn chuồn tre thạch xá|chuồn chuồn tre|thạch xá'],
      4: ['gốm vĩnh long|gốm đỏ vĩnh long', 'gốm lái thiêu|lái thiêu', 'gốm thổ hà|thổ hà', 'gốm hương canh|hương canh', 'gốm kim lan|kim lan', 'tranh kim hoàng|kim hoàng', 'lụa nha xá|nha xá', 'lụa bảo lộc|tơ tằm bảo lộc', 'nón ngựa phú gia|nón ngựa', 'dệt thổ cẩm mỹ nghiệp|mỹ nghiệp', 'rèn phúc sen|phúc sen', 'chiếu định yên|định yên', 'đá ninh vân|ninh vân', 'tạc tượng sơn đồng|sơn đồng|tượng sơn đồng', 'quạt chàng sơn|chàng sơn|làm quạt', 'làng hương thủy xuân|thủy xuân', 'bún phú đô|phú đô', 'rượu làng vân|rượu vân|làng vân', 'hoa giấy thanh tiên|thanh tiên', 'đồ sừng thụy ứng|thụy ứng|lược sừng|đồ sừng', 'bánh chưng tranh khúc|tranh khúc'],
    },
  },
  {
    id: 'theme-parks',
    group: 'g11',
    prompt: 'Kể tên một công viên giải trí hoặc khu vui chơi nổi tiếng',
    answers: {
      1: ['disneyland|disney land|disneyland california|disneyland anaheim', 'universal studios|universal|universal studio', 'vinwonders|vin wonders|vinpearl land|vinpearl|vinpearlland|vinwonders nhatrang|vinwonders phúquốc', 'sun world bà nà hills|bà nà hills|bà nà|sunworld bà nà|sun world bà nà', 'đầm sen|công viên đầm sen|công viên văn hóa đầm sen|đầm sen nước', 'suối tiên|khu du lịch suối tiên|công viên suối tiên', 'disney world|walt disney world|magic kingdom'],
      2: ['universal studios singapore|uss|universal singapore', 'universal studios japan|usj|universal japan|universal osaka', 'legoland', 'everland', 'lotte world', 'ocean park|ocean park hongkong', 'six flags', 'seaworld|sea world', 'disneyland paris|disneyland pháp', 'tokyo disneyland|disneyland tokyo', 'hong kong disneyland|disneyland hongkong', 'shanghai disneyland|disneyland thượnghải', 'khu du lịch đại nam|đại nam|lạc cảnh đại nam', 'ferrari world|ferrari world abudhabi'],
      3: ['universal studios hollywood|universal hollywood', 'universal orlando|universal studios florida|islands of adventure', 'tokyo disneysea|disneysea|disney sea', 'epcot', 'europa park|europapark', 'cedar point', 'busch gardens', 'portaventura|port aventura', 'tivoli|tivoli gardens', 'efteling', 'alton towers', 'fuji q highland|fuji-q highland|fujiq', 'chimelong|chimelong ocean kingdom', 'genting skyworlds|genting|resorts world genting', 'siam park', 'coney island', 'hồ tây water park|hồ tây waterpark', 'thiên đường bảo sơn|bảo sơn', 'asia park|sun world asia park|công viên châu á', 'sun world halong|sunworld halong', 'sun world hòn thơm|hòn thơm|aquatopia'],
      4: ['universal beijing resort|universal bắc kinh|universal studios beijing', 'warner bros world', 'warner bros movie world|movie world', 'knott\'s berry farm|knotts berry farm', 'phantasialand', 'blackpool pleasure beach', 'gardaland', 'liseberg', 'parc astérix|parc asterix', 'puy du fou', 'dreamworld', 'nagashima spa land', 'huis ten bosch', 'happy valley', 'fantawild', 'dufan|dunia fantasi', 'prater|wiener prater', 'kings island', 'dollywood', 'seoul land', 'hồ mây park|hồmây', 'tiniworld|tini world', 'mikazuki|mikazuki water park'],
    },
  },
  {
    id: 'zodiac-signs',
    group: 'g11',
    prompt: 'Kể tên một cung hoàng đạo hoặc một con giáp',
    min: 24,
    answers: {
      1: ['bạch dương|aries|dương cưu', 'sư tử|leo|hải sư', 'tý|tí|chuột|tuổi tý|tuổi tí', 'thìn|rồng|tuổi thìn'],
      2: ['kim ngưu|taurus', 'song tử|gemini|song nam', 'cự giải|cancer|bắc giải', 'thiên bình|libra', 'song ngư|pisces', 'sửu|trâu|tuổi sửu', 'dần|hổ|cọp|tuổi dần', 'mão|mẹo|mèo|thỏ|tuổi mão|tuổi mẹo', 'tỵ|tị|rắn|tuổi tỵ|tuổi tị', 'ngọ|ngựa|tuổi ngọ', 'mùi|dê|tuổi mùi', 'thân|khỉ|tuổi thân', 'dậu|gà|tuổi dậu', 'tuất|chó|tuổi tuất', 'hợi|heo|lợn|tuổi hợi'],
      3: ['xử nữ|virgo|trinh nữ', 'ma kết|capricorn|nam dương', 'bảo bình|aquarius|thủy bình'],
      4: ['bọ cạp|thiên yết|thần nông|scorpio|hổ cáp|thiên hạt|thiên hiết', 'nhân mã|sagittarius|cung thủ'],
    },
  },
];
