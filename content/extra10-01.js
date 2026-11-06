// Extra quirky animal topics for ĐÙNG (batch 10-01).
// Aliases separated by "|": display name first, then other names players type.
module.exports = [
  {
    id: 'animals-one-syllable',
    group: 'quirky',
    prompt: 'Kể tên một con vật có tên chỉ một tiếng (VD: mèo, gà)',
    answers: {
      1: ['bò', 'gà', 'vịt', 'heo|lợn', 'chó', 'mèo', 'chuột', 'voi', 'hổ|cọp', 'khỉ', 'cá', 'ngựa', 'trâu'],
      2: ['gấu', 'rắn', 'cua', 'tôm', 'ếch', 'rùa', 'dê', 'cừu', 'nai', 'hươu', 'sói', 'cáo', 'thỏ', 'sóc', 'chim', 'ong', 'kiến', 'ruồi', 'muỗi', 'bướm', 'ốc', 'ngỗng', 'ngan', 'cò', 'quạ', 'cú', 'công', 'dế', 'gián', 'mực', 'nhím', 'cóc', 'sâu', 'giun|trùn', 'nhện', 'báo', 'dơi'],
      3: ['sò', 'hến', 'nhái', 've', 'rết', 'nghêu|ngao', 'sứa', 'lươn', 'chạch|trạch', 'sẻ', 'vẹt|két', 'sáo', 'yến', 'én', 'vượn', 'chồn', 'lừa', 'trăn', 'ghẹ', 'hàu|hào', 'trai', 'đỉa', 'mối', 'tằm', 'rận', 'chấy', 'rệp', 'bọ', 'beo', 'cầy', 'lửng', 'diệc', 'vạc', 'sếu', 'hạc', 'tép', 'ngài'],
      4: ['vẹm', 'sam', 'cáy', 'còng', 'rạm', 'ruốc', 'khướu', 'cuốc', 'cu', 'cắt', 'ưng', 'ó', 'nhạn', 'trĩ', 'chích', 'hoẵng', 'mang', 'la', 'bê', 'nghé', 'cún', 'nhặng', 'mòng', 'mọt', 'vắt', 'sên', 'dòi', 'rươi', 'ngóe', 'giông', 'moi'],
    },
  },
  {
    id: 'egg-laying-animals',
    group: 'quirky',
    prompt: 'Kể tên một con vật đẻ trứng',
    answers: {
      1: ['gà|gà mái', 'vịt', 'chim', 'rắn', 'rùa', 'cá sấu', 'ếch', 'cá', 'ngỗng', 'đà điểu', 'khủng long'],
      2: ['ngan|vịt xiêm', 'chim cút|cút|cun cút', 'bồ câu|chim bồ câu|chim câu', 'chim cánh cụt|cánh cụt', 'thằn lằn', 'tắc kè', 'thạch sùng|thằn lằn nhà', 'ong', 'kiến', 'bướm', 'muỗi', 'ruồi', 'gián', 'nhện', 'thú mỏ vịt|platypus', 'công|chim công', 'gà tây', 'ba ba', 'cóc', 'nhái', 'trăn', 'chim sẻ|sẻ', 'cá chép', 'cá vàng', 'cá hồi', 'cua', 'tôm', 'ốc', 'mực', 'bạch tuộc', 'rùa biển', 'đại bàng', 'vẹt|két'],
      3: ['nhím mỏ dài|echidna|thú lông nhím|thú ăn kiến gai', 'kỳ đà', 'kỳ nhông', 'rồng komodo|komodo', 'rắn hổ mang|hổ mang', 'tắc kè hoa', 'ễnh ương', 'chẫu chàng', 'kỳ giông|sa giông', 'thiên nga', 'hồng hạc', 'cò', 'quạ', 'cú|cú mèo', 'chim yến|yến', 'chim én|én', 'chim ruồi', 'hải âu|mòng biển', 'bồ nông', 'gà lôi|chim trĩ', 'vịt trời', 'le le', 'gà rừng', 'chim sáo|sáo', 'gõ kiến|chim gõ kiến', 'diều hâu', 'chim ưng', 'kền kền', 'sếu', 'hạc', 'cá rô', 'cá trê', 'cá lóc|cá quả|cá chuối', 'cá tra', 'cá basa', 'cá ngừ', 'cá thu', 'cá hề|nemo', 'cá koi|cá chép koi', 'cá rô phi', 'cá ngựa', 'cá betta|cá chọi|cá xiêm|cá lia thia', 'châu chấu', 'cào cào', 'dế', 've sầu|ve', 'chuồn chuồn', 'bọ rùa', 'tằm|con tằm', 'mối', 'bọ ngựa', 'đom đóm', 'ốc sên', 'tôm hùm', 'ghẹ', 'chim chào mào|chào mào', 'đà điểu emu|emu'],
      4: ['chim kiwi|kiwi', 'họa mi|chim họa mi', 'khướu', 'bìm bịp', 'chích chòe', 'vành khuyên', 'chim cu|cu gáy', 'tu hú', 'bói cá|chim bói cá', 'vạc', 'diệc', 'chim sâu', 'cá trắm', 'cá mè', 'cá mòi', 'cá trích', 'cá tầm', 'cá chình', 'lươn', 'cá mập mèo|cá mập sừng', 'cá chim', 'cá kèo', 'cá bống', 'ngài|bướm đêm|thiêu thân', 'bọ cánh cứng|bọ hung', 'bọ xít', 'ong bắp cày', 'ong vò vẽ', 'rận', 'chấy', 'rệp', 'rết', 'giun đất|giun|trùn', 'sam', 'ốc bươu', 'cá đuối', 'cá mập', 'trăn gấm', 'rắn ráo'],
    },
  },
  {
    id: 'horned-animals',
    group: 'quirky',
    prompt: 'Kể tên một con vật có sừng',
    answers: {
      1: ['trâu', 'bò', 'dê', 'tê giác', 'hươu', 'nai'],
      2: ['cừu', 'tuần lộc', 'linh dương', 'bò rừng', 'bò tót', 'sơn dương|tỳ linh', 'hươu cao cổ', 'bò yak|bò tây tạng|yak', 'nai sừng tấm|moose', 'trâu rừng', 'khủng long ba sừng|triceratops'],
      3: ['bò bison|bò rừng bison|bò bizon|bison|trâu bison', 'hươu sao', 'sao la', 'bò xám|kouprey', 'dê núi', 'linh dương đầu bò|linh dương nhảy|wildebeest|gnu', 'bọ hung|bọ cánh cứng sừng|bọ sừng|bọ tê giác|kiến vương', 'hoẵng|mang|mễn', 'trâu châu phi|trâu rừng châu phi|trâu cape', 'nai sừng xám|elk', 'bò mộng', 'cừu sừng lớn|cừu bighorn|cừu núi', 'dê ibex|ibex|dê núi ibex'],
      4: ['linh dương sừng kiếm|oryx', 'linh dương kudu|kudu', 'linh dương gazelle|gazelle|linh dương gazen', 'linh dương sừng nhánh|pronghorn', 'linh dương bongo|bongo', 'linh dương impala|impala', 'bò sừng dài|longhorn|bò longhorn', 'dê sừng xoắn|markhor', 'okapi|hươu đùi vằn', 'tắc kè hoa ba sừng|tắc kè sừng|tắc kè hoa jackson', 'thằn lằn sừng|horned lizard', 'rắn lục sừng|rắn sừng', 'bò banteng|banteng', 'trâu nước', 'nai cà tông|cà tông|hươu cà tông', 'dê sừng dài|chamois|sơn dương chamois', 'hươu đỏ|hươu sừng đỏ', 'khủng long sừng'],
    },
  },
  {
    id: 'striped-spotted-animals',
    group: 'quirky',
    prompt: 'Kể tên một con vật có sọc hoặc đốm trên người',
    answers: {
      1: ['ngựa vằn', 'hổ|cọp|hổ trắng|bạch hổ', 'báo|báo hoa mai', 'hươu cao cổ', 'bò sữa|bò hà lan|bò holstein'],
      2: ['báo đốm|jaguar', 'báo săn|cheetah|báo gêpa', 'chó đốm|dalmatian|chó dalmatian', 'cá hề|nemo', 'ong', 'bọ rùa', 'rắn cạp nong', 'linh cẩu|linh cẩu đốm', 'báo tuyết', 'hươu sao|nai sao'],
      3: ['rắn cạp nia', 'sóc chuột|chipmunk', 'heo vòi|lợn vòi|tapir', 'chồn hôi|skunk', 'gấu mèo|raccoon', 'mèo mướp|mèo vằn|mèo tabby', 'mèo báo|mèo rừng', 'báo gấm|báo mây', 'cá ngựa vằn|zebrafish', 'cá mập hổ', 'cá mập voi', 'cá koi|cá chép koi', 'ong bắp cày', 'muỗi vằn|muỗi aedes|muỗi sốt xuất huyết', 'trăn gấm|trăn hoa', 'tắc kè', 'bướm', 'cá thần tiên|cá ông tiên|angelfish', 'okapi|hươu đùi vằn', 'ếch phi tiêu|ếch độc|ếch phi tiêu độc', 'rắn san hô', 'ngựa đốm|ngựa appaloosa'],
      4: ['linh dương bongo|bongo', 'linh dương kudu|kudu', 'lợn rừng|heo rừng', 'kỳ giông lửa|fire salamander', 'cá mú|cá song', 'cá tứ vân|cá hổ', 'cá đuối đốm|cá đuối ó', 'cá nóc', 'linh miêu', 'mèo cá|mèo rừng cá', 'cầy hương|cầy giông', 'hải cẩu báo', 'kỳ đà', 'lửng mật|honey badger', 'thằn lằn đốm|tắc kè báo|leopard gecko', 'bướm hổ', 'rắn biển|rắn vằn', 'cá chình mây|cá chình hoa'],
    },
  },
  {
    id: 'nocturnal-animals',
    group: 'quirky',
    prompt: 'Kể tên một con vật hoạt động về đêm',
    answers: {
      1: ['cú|cú mèo|chim cú', 'dơi', 'chuột', 'mèo', 'đom đóm'],
      2: ['cáo', 'sói|chó sói', 'nhím', 'gián', 'muỗi', 'ếch', 'cu li|culi|cu li lớn|cu li nhỏ', 'sóc bay', 'gấu mèo|raccoon', 'chồn', 'rắn', 'tắc kè', 'thạch sùng|thằn lằn nhà|thằn lằn', 'bọ cạp|bò cạp', 'bướm đêm|ngài|thiêu thân', 'dế', 'cóc'],
      3: ['lửng', 'cầy hương|chồn hương', 'nhện', 'nhái', 'ễnh ương', 'cú lợn|chim lợn|cú màu|cú mặt quỷ', 'cú muỗi|chim cú muỗi', 'vạc|chim vạc', 'tê tê|pangolin', 'chồn hôi|skunk', 'linh cẩu', 'báo|báo hoa mai', 'trăn', 'rết', 'rệp|rệp giường', 'khỉ đêm|khỉ cú', 'vượn cáo|lemur', 'dơi quỷ|dơi ma cà rồng|dơi hút máu', 'dơi quạ'],
      4: ['khỉ aye-aye|aye-aye|aye aye', 'lợn đất|aardvark', 'gấu túi|koala', 'opossum|chồn opossum|thú có túi opossum', 'sư tử', 'hổ|cọp', 'hà mã', 'cá sấu', 'linh miêu', 'mèo rừng', 'tarsier|khỉ tarsier|khỉ lùn', 'chim kiwi|kiwi', 'ốc sên|sên', 'giun đất|giun|trùn', 'thỏ', 'lợn rừng|heo rừng', 'rái cá', 'cầy vòi|cầy vòi mốc|cầy vòi hương|binturong', 'thú mỏ vịt|platypus', 'hải ly', 'lươn', 'gấu chó', 'chuột túi đuôi dài|bilby', 'cá trê', 'cua đồng', 'mối'],
    },
  },
];
