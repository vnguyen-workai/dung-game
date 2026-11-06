// Game rules. Runs in the host player's browser (and in Node for tests).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./categories'));
  else root.DungEngine = factory(root.DUNG_CATEGORIES);
})(this, function (CATEGORIES) {
  const TIER_POINTS = { 1: 10, 2: 30, 3: 60, 4: 100 };
  // Every turn gets the full time from the room settings; a topic ends after maxAnswers correct answers.
  const config = { turnFloorMs: 3000, maxAnswers: 8, popPauseMs: 2200 };
  const LIMITS = {
    lives: [1, 5],
    minTurn: [4, 20],
    seats: [2, 20],
    heartCap: [1, 9],
    pointsPerHeart: [100, 1000],
  };
  const PLANES = ['tanbinh', 'cotruong', 'sieuthanh', 'chop', 'quaixe'];
  const DEFAULT_SETTINGS = { lives: 2, minTurn: 10, seats: 20, heartCap: 5, pointsPerHeart: 300 };

  function exactForm(s) {
    return String(s)
      .normalize('NFC')
      .toLowerCase()
      .replace(/\+/g, ' plus ')
      .replace(/#/g, ' sharp ')
      .replace(/[^\p{L}\p{N} ]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalize(s) {
    return exactForm(s)
      .replace(/đ/g, 'd')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Generic words players often put in front of an answer ("con mèo", "tỉnh Nghệ An", "ca sĩ Khởi My").
  const PREFIXES = [
    'thành phố', 'tp', 'tỉnh', 'quận', 'huyện', 'thị xã', 'sông', 'núi', 'đèo', 'đảo', 'quần đảo', 'vịnh', 'biển', 'bãi biển',
    'hồ', 'thác', 'chùa', 'đền', 'con', 'quả', 'trái', 'cây', 'hoa', 'món', 'môn', 'nước', 'tiếng', 'đồng', 'ca sĩ', 'rapper',
    'cầu thủ', 'tuyển thủ', 'vận động viên', 'vđv', 'huấn luyện viên', 'hlv', 'dân tộc', 'lễ hội', 'câu lạc bộ', 'clb', 'đội tuyển',
    'nhạc sĩ', 'diễn viên', 'danh hài', 'nghệ sĩ', 'mc', 'nhà thơ', 'nhà văn', 'vua', 'bài hát', 'bài', 'phim', 'hãng', 'sân bay',
    'sân vận động', 'sân', 'trường', 'đại học', 'thủ đô', 'ban nhạc', 'nhóm nhạc', 'nhóm', 'chợ', 'nghề', 'giải', 'game', 'màu',
    'nsnd', 'nsưt', 'nghệ sĩ nhân dân', 'nghệ sĩ ưu tú', 'danh ca', 'nữ ca sĩ', 'nam ca sĩ', 'cố', 'đại tướng', 'tướng',
    'chủ tịch', 'tổng thống', 'thủ tướng', 'hoàng đế', 'nữ hoàng', 'thần', 'nữ thần', 'thánh', 'hãng xe', 'thương hiệu',
    'ứng dụng', 'app', 'bệnh', 'nguyên tố', 'hành tinh', 'cung', 'môn võ', 'đế chế', 'trận', 'album', 'anime', 'truyện', 'sách',
    'họa sĩ', 'bức tranh', 'tranh', 'nhà soạn nhạc', 'youtuber', 'streamer', 'tỷ phú', 'khủng long', 'thể loại', 'nhạc',
    'chương trình', 'gameshow', 'game show', 'show', 'sự tích', 'truyện cổ tích', 'cổ tích', 'truyền thuyết', 'công ty',
    'tập đoàn', 'ngân hàng', 'nhân vật',
    'bang', 'tiểu bang', 'quốc gia', 'đất nước', 'ngôn ngữ', 'ngôn ngữ lập trình',
    'phố', 'đường', 'con đường', 'đường phố', 'hoa hậu', 'á hậu', 'đội', 'đội bóng', 'tướng game', 'champion',
    'chó', 'mèo', 'giống chó', 'giống mèo', 'chó giống', 'mèo giống', 'cái', 'chiếc', 'bộ', 'máy', 'đồ chơi', 'đồ', 'điệu',
    'điệu nhảy', 'điệu múa', 'múa', 'nhảy', 'khí', 'chất', 'hợp chất', 'hiện tượng', 'gia vị', 'nước chấm', 'dụng cụ',
  ].map((p) => exactForm(p)).sort((a, b) => b.length - a.length);
  const PREFIXES_LOOSE = [...new Set(PREFIXES.map((p) => normalize(p)))].sort((a, b) => b.length - a.length);
  // Without accents these prefixes are also common name words (quận/Quan, trường/Trương, tướng/Tường, hãng/Hằng…),
  // so they are only stripped when at least two words remain ("quan ba dinh" → "ba dinh", but not "quan vu").
  const NAME_LIKE = new Set(['quan', 'truong', 'tuong', 'hang', 'nhac', 'ho', 'than', 'thanh', 'co', 'cung', 'hoa', 'ban', 'nhom', 'cho', 'thac', 'bai', 'tranh', 'den', 'dong', 'mon', 'mau', 'vua', 'giai', 'pho', 'duong', 'tran', 'do', 'may', 'cai', 'bo', 'chiec', 'mua', 'nhay', 'chat', 'dieu']);

  function stripPrefix(s, list = PREFIXES) {
    for (let pass = 0; pass < 2; pass++) {
      const p = list.find((x) => s.startsWith(`${x} `));
      if (!p) break;
      const rest = s.slice(p.length + 1);
      if (list === PREFIXES_LOOSE && NAME_LIKE.has(p) && !rest.includes(' ')) break;
      s = rest;
    }
    return s;
  }

  function addTo(map, key, ans) {
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    if (!map.get(key).includes(ans)) map.get(key).push(ans);
  }

  // Lookups, strongest first: exact accented alias, accent-free alias, then the same without a generic prefix.
  // Lookup tables are built the first time a topic is used, so loading 100+ topics stays fast.
  function buildIndex(c) {
    const exact = new Map(), loose = new Map(), exactBare = new Map(), looseBare = new Map();
    const compact = new Map(), shortName = new Map();
    for (const [tier, list] of Object.entries(c.answers)) {
      for (const entry of list) {
        const aliases = entry.split('|');
        const ans = { key: exactForm(aliases[0]), label: aliases[0], tier: Number(tier) };
        for (const a of aliases) {
          const e = exactForm(a);
          addTo(exact, e, ans);
          addTo(loose, normalize(e), ans);
          const bare = stripPrefix(e);
          addTo(exactBare, bare, ans);
          addTo(looseBare, stripPrefix(normalize(e), PREFIXES_LOOSE), ans);
          const n = normalize(e);
          addTo(compact, n.replace(/ /g, ''), ans);
          const words = n.split(' ');
          if (words.length >= 3) addTo(shortName, words.slice(-2).join(' '), ans);
        }
      }
    }
    return { exact, loose, exactBare, looseBare, compact, shortName };
  }

  const CATS = CATEGORIES.map((c) => {
    let index = null;
    const cat = { id: c.id, prompt: c.prompt };
    for (const k of ['exact', 'loose', 'exactBare', 'looseBare', 'compact', 'shortName']) {
      Object.defineProperty(cat, k, { get: () => (index || (index = buildIndex(c)))[k] });
    }
    return cat;
  });

  // Levenshtein distance, giving up early once it exceeds max.
  function withinDistance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return false;
    let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      let best = i;
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        best = Math.min(best, cur[j]);
      }
      if (best > max) return false;
      prev = cur;
    }
    return prev[b.length] <= max;
  }

  const typoBudget = (len) => (len >= 10 ? 2 : len >= 5 ? 1 : 0);

  function findAnswer(cat, text, used) {
    const e = exactForm(text);
    const bare = stripPrefix(e);
    const looseBare = stripPrefix(normalize(e), PREFIXES_LOOSE);
    const pick = (list) => list && (list.find((a) => !used.has(a.key)) || list[0]);
    const hit = pick(cat.exact.get(e)) || pick(cat.loose.get(normalize(e)))
      || pick(cat.exactBare.get(bare)) || pick(cat.exact.get(bare))
      || pick(cat.looseBare.get(looseBare)) || pick(cat.loose.get(looseBare));
    if (hit) return hit;
    const only = (list) => {
      const uniq = [...new Set(list || [])];
      return uniq.length === 1 ? uniq[0] : null;
    };
    // Typed without spaces ("sontung"), or just the last two words of a long name ("việt anh").
    const n = looseBare;
    const viaCompact = pick(cat.compact.get(n.replace(/ /g, '')));
    if (viaCompact) return viaCompact;
    const viaShort = only(cat.shortName.get(n));
    if (viaShort) return viaShort;
    // Small typos on longer answers (not on the first letter), only when they point to a single answer.
    const budget = typoBudget(n.length);
    if (!budget) return null;
    const found = new Set();
    for (const [k, list] of cat.loose) {
      if (k.length >= 5 && k[0] === n[0] && withinDistance(n, k, Math.min(budget, typoBudget(k.length)))) list.forEach((a) => found.add(a));
    }
    return found.size === 1 ? [...found][0] : null;
  }

  function clampSettings(input = {}) {
    const out = { ...DEFAULT_SETTINGS };
    for (const [k, [lo, hi]] of Object.entries(LIMITS)) {
      const v = Math.round(Number(input[k]));
      if (Number.isFinite(v)) out[k] = Math.min(hi, Math.max(lo, v));
    }
    out.heartCap = Math.max(out.heartCap, out.lives);
    return out;
  }

  function cleanName(name) {
    const n = String(name || '').replace(/\s+/g, ' ').trim().slice(0, 16);
    return n || 'Khách';
  }

  // emit(event, payload) must deliver to every player, including the host.
  class Room {
    constructor(code, hostId, hostName, emit, hostPlane) {
      this.code = code;
      this.hostId = hostId;
      this.emit = emit;
      this.settings = clampSettings();
      this.status = 'lobby';
      this.players = [];
      this.recentCats = [];
      this.round = null;
      this.winnerId = null;
      this.participants = 0;
      this.timer = null;
      this.join(hostId, hostName, hostPlane);
    }

    state() {
      const r = this.round;
      return {
        code: this.code,
        hostId: this.hostId,
        settings: this.settings,
        status: this.status,
        players: this.players.map((p) => ({
          id: p.id, name: p.name, plane: p.plane, hearts: p.hearts, points: p.points, bank: p.bank, alive: p.alive,
        })),
        round: r && {
          number: r.number,
          prompt: CATS[r.cat].prompt,
          turnId: this.players[r.turnIdx] && this.players[r.turnIdx].id,
          turnStartedAt: r.turnStartedAt,
          turnMs: r.turnMs,
          usedCount: r.used.size,
          maxAnswers: config.maxAnswers,
        },
        winnerId: this.winnerId,
      };
    }

    broadcast() {
      this.emit('state', this.state());
    }

    join(id, name, plane) {
      if (this.players.some((p) => p.id === id)) { this.broadcast(); return { ok: true }; }
      if (this.players.filter((p) => !p.left).length >= this.settings.seats) return { ok: false, error: 'Phòng đã đầy' };
      const playing = this.status === 'playing';
      this.players.push({
        id, name: cleanName(name), plane: PLANES.includes(plane) ? plane : PLANES[0],
        hearts: playing ? this.settings.lives : 0, points: 0, bank: 0, alive: playing,
      });
      if (playing) this.participants += 1;
      this.broadcast();
      return { ok: true };
    }

    setSettings(id, s) {
      if (id !== this.hostId || this.status === 'playing') return;
      this.settings = clampSettings(s);
      this.settings.seats = Math.max(this.settings.seats, Math.min(LIMITS.seats[1], this.players.length));
      this.broadcast();
    }

    start(id) {
      if (id !== this.hostId || this.status === 'playing') return;
      this.players = this.players.filter((p) => !p.left);
      if (this.players.length < 2) return;
      this.status = 'playing';
      this.participants = this.players.length;
      this.winnerId = null;
      this.round = null;
      this.recentCats = [];
      for (const p of this.players) {
        p.hearts = this.settings.lives;
        p.points = 0;
        p.bank = 0;
        p.alive = true;
      }
      this.startRound(Math.floor(Math.random() * this.players.length));
    }

    aliveCount() {
      return this.players.filter((p) => p.alive).length;
    }

    // Solo: play until out of hearts. With company: last plane flying wins.
    isOver() {
      const alive = this.aliveCount();
      return alive === 0 || (alive === 1 && this.participants >= 2);
    }

    nextAliveIdx(fromIdx) {
      const n = this.players.length;
      for (let i = 1; i <= n; i++) {
        const idx = (fromIdx + i) % n;
        if (this.players[idx].alive) return idx;
      }
      return -1;
    }

    pickCategory() {
      const recent = this.recentCats;
      const pool = CATS.map((_, i) => i).filter((i) => !recent.includes(i));
      const cat = pool[Math.floor(Math.random() * pool.length)];
      recent.push(cat);
      if (recent.length > Math.min(10, CATS.length - 1)) recent.shift();
      return cat;
    }

    startRound(turnIdx) {
      clearTimeout(this.timer);
      if (!this.players[turnIdx].alive) turnIdx = this.nextAliveIdx(turnIdx);
      this.round = {
        number: ((this.round && this.round.number) || 0) + 1,
        cat: this.pickCategory(),
        used: new Set(),
        turnIdx,
        turnMs: 0,
        turnStartedAt: 0,
      };
      this.startTurn();
    }

    startTurn() {
      const r = this.round;
      r.turnStartedAt = Date.now();
      r.turnMs = Math.max(config.turnFloorMs, this.settings.minTurn * 1000);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.explode(), r.turnMs);
      this.broadcast();
    }

    // Time ran out: the plane explodes on the current player.
    explode() {
      const r = this.round;
      if (this.status !== 'playing' || !r) return;
      clearTimeout(this.timer);
      const p = this.players[r.turnIdx];
      p.hearts -= 1;
      if (p.hearts <= 0) p.alive = false;
      this.emit('boom', { playerId: p.id, eliminated: !p.alive });
      if (this.isOver()) return this.end();
      const next = this.nextAliveIdx(r.turnIdx);
      r.turnStartedAt = 0;
      this.broadcast();
      this.timer = setTimeout(() => {
        if (this.status === 'playing') this.startRound(next);
      }, config.popPauseMs);
    }

    end() {
      clearTimeout(this.timer);
      this.status = 'ended';
      const winner = this.participants >= 2 && this.players.find((p) => p.alive);
      this.winnerId = winner ? winner.id : null;
      this.broadcast();
    }

    answer(id, text) {
      const r = this.round;
      if (this.status !== 'playing' || !r || !r.turnStartedAt) return;
      const player = this.players[r.turnIdx];
      if (player.id !== id) return;
      if (!exactForm(text)) return;
      const hit = findAnswer(CATS[r.cat], text, r.used);
      const shown = String(text).trim().slice(0, 40);
      // Wrong answers just get rejected: the same player keeps trying until the time runs out.
      if (!hit) return this.emit('answer', { playerId: id, text: shown, ok: false, reason: 'Không đúng' });
      if (r.used.has(hit.key)) return this.emit('answer', { playerId: id, text: shown, ok: false, reason: 'Đã có người nói' });
      r.used.add(hit.key);
      const pts = TIER_POINTS[hit.tier];
      player.points += pts;
      player.bank += pts;
      let gainedHeart = false;
      const { pointsPerHeart, heartCap } = this.settings;
      while (player.bank >= pointsPerHeart && player.hearts < heartCap) {
        player.bank -= pointsPerHeart;
        player.hearts += 1;
        gainedHeart = true;
      }
      if (player.hearts >= heartCap) player.bank = Math.min(player.bank, pointsPerHeart - 1);
      this.emit('answer', { playerId: id, text: hit.label, ok: true, tier: hit.tier, points: pts, gainedHeart });
      r.turnIdx = this.nextAliveIdx(r.turnIdx);
      if (r.used.size >= config.maxAnswers) return this.finishTopic();
      this.startTurn();
    }

    // Enough correct answers on this topic: nobody loses a heart, move to a new topic.
    finishTopic() {
      const r = this.round;
      clearTimeout(this.timer);
      r.turnStartedAt = 0;
      this.emit('topicDone', { count: r.used.size });
      this.broadcast();
      this.timer = setTimeout(() => {
        if (this.status === 'playing') this.startRound(r.turnIdx);
      }, config.popPauseMs);
    }

    leave(id) {
      const idx = this.players.findIndex((p) => p.id === id);
      if (idx === -1) return;
      if (this.status === 'playing') {
        const p = this.players[idx];
        const wasTurn = this.round && this.round.turnIdx === idx && this.round.turnStartedAt;
        p.alive = false;
        p.hearts = 0;
        p.left = true;
        if (this.isOver()) return this.end();
        if (wasTurn) {
          this.round.turnIdx = this.nextAliveIdx(idx);
          this.startTurn();
          return;
        }
      } else {
        this.players.splice(idx, 1);
      }
      this.broadcast();
    }

    close() {
      clearTimeout(this.timer);
      this.status = 'closed';
    }
  }

  return { Room, PLANES, config, CATS, LIMITS, normalize, stripPrefix, findAnswer, clampSettings };
});
