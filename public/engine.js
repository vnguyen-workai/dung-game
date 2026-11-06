// Game rules. Runs in the host player's browser (and in Node for tests).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./categories'));
  else root.DungEngine = factory(root.DUNG_CATEGORIES);
})(this, function (CATEGORIES) {
  const TIER_POINTS = { 1: 10, 2: 30, 3: 60, 4: 100 };
  const config = { fuseMinMs: 12000, fuseMaxMs: 30000, popPauseMs: 2200 };
  const LIMITS = {
    lives: [1, 5],
    minTurn: [3, 15],
    seats: [2, 20],
    heartCap: [1, 9],
    pointsPerHeart: [100, 1000],
  };
  const PLANES = ['tanbinh', 'cotruong', 'sieuthanh', 'chop', 'quaixe'];
  const DEFAULT_SETTINGS = { lives: 2, minTurn: 8, seats: 20, heartCap: 5, pointsPerHeart: 300 };

  function exactForm(s) {
    return String(s)
      .normalize('NFC')
      .toLowerCase()
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

  // exact: accented alias -> answer; loose: accent-free alias -> [answers] (several when accents collide, e.g. dứa/dừa)
  const CATS = CATEGORIES.map((c) => {
    const exact = new Map();
    const loose = new Map();
    for (const [tier, list] of Object.entries(c.answers)) {
      for (const entry of list) {
        const aliases = entry.split('|');
        const ans = { key: exactForm(aliases[0]), label: aliases[0], tier: Number(tier) };
        for (const a of aliases) {
          exact.set(exactForm(a), ans);
          const n = normalize(a);
          if (!loose.has(n)) loose.set(n, []);
          if (!loose.get(n).includes(ans)) loose.get(n).push(ans);
        }
      }
    }
    return { prompt: c.prompt, exact, loose };
  });

  function findAnswer(cat, text, used) {
    const hit = cat.exact.get(exactForm(text));
    if (hit) return hit;
    const options = cat.loose.get(normalize(text)) || [];
    return options.find((a) => !used.has(a.key)) || options[0] || null;
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
          usedCount: r.used.size,
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
      if (this.players.length < 1) return;
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
        fuseEnd: Date.now() + config.fuseMinMs + Math.random() * (config.fuseMaxMs - config.fuseMinMs),
        turnStartedAt: 0,
      };
      this.startTurn();
    }

    startTurn() {
      const r = this.round;
      const now = Date.now();
      r.turnStartedAt = now;
      r.fuseEnd = Math.max(r.fuseEnd, now + this.settings.minTurn * 1000);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.explode(), r.fuseEnd - now);
      this.broadcast();
    }

    explode() {
      const r = this.round;
      if (this.status !== 'playing' || !r) return;
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
      if (!hit) {
        this.emit('answer', { playerId: id, text: shown, ok: false, reason: 'Không hợp lệ' });
        return;
      }
      if (r.used.has(hit.key)) {
        this.emit('answer', { playerId: id, text: shown, ok: false, reason: 'Đã có người nói' });
        return;
      }
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
      this.startTurn();
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

  return { Room, PLANES, config, CATS, LIMITS, normalize, findAnswer, clampSettings };
});
