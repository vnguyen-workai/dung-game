const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const CATEGORIES = require('./categories');

const TIER_POINTS = { 1: 10, 2: 30, 3: 60, 4: 100 };
const config = { fuseMinMs: 12000, fuseMaxMs: 30000, popPauseMs: 2200 };
const LIMITS = {
  lives: [1, 5],
  minTurn: [3, 15],
  seats: [2, 10],
  heartCap: [1, 9],
  pointsPerHeart: [100, 1000],
};
const DEFAULT_SETTINGS = { lives: 2, minTurn: 8, seats: 6, heartCap: 5, pointsPerHeart: 300 };

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

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const io = new Server(server);

const rooms = new Map();

function makeCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code;
  do {
    code = Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  } while (rooms.has(code));
  return code;
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

function publicState(room) {
  const r = room.round;
  return {
    code: room.code,
    hostId: room.hostId,
    settings: room.settings,
    status: room.status,
    players: room.players.map((p) => ({
      id: p.id, name: p.name, hearts: p.hearts, points: p.points, bank: p.bank, alive: p.alive,
    })),
    round: r && {
      number: r.number,
      prompt: CATS[r.cat].prompt,
      turnId: room.players[r.turnIdx]?.id,
      turnStartedAt: r.turnStartedAt,
      usedCount: r.used.size,
    },
    winnerId: room.winnerId || null,
  };
}

function broadcast(room) {
  io.to(room.code).emit('state', publicState(room));
}

function aliveCount(room) {
  return room.players.filter((p) => p.alive).length;
}

function nextAliveIdx(room, fromIdx) {
  const n = room.players.length;
  for (let i = 1; i <= n; i++) {
    const idx = (fromIdx + i) % n;
    if (room.players[idx].alive) return idx;
  }
  return -1;
}

function pickCategory(room) {
  const recent = room.recentCats;
  const pool = CATS.map((_, i) => i).filter((i) => !recent.includes(i));
  const cat = pool[Math.floor(Math.random() * pool.length)];
  recent.push(cat);
  if (recent.length > Math.min(5, CATS.length - 1)) recent.shift();
  return cat;
}

function startRound(room, turnIdx) {
  clearTimeout(room.timer);
  room.round = {
    number: (room.round?.number || 0) + 1,
    cat: pickCategory(room),
    used: new Set(),
    turnIdx,
    fuseEnd: Date.now() + config.fuseMinMs + Math.random() * (config.fuseMaxMs - config.fuseMinMs),
    turnStartedAt: 0,
  };
  startTurn(room);
}

function startTurn(room) {
  const r = room.round;
  const now = Date.now();
  r.turnStartedAt = now;
  r.fuseEnd = Math.max(r.fuseEnd, now + room.settings.minTurn * 1000);
  clearTimeout(room.timer);
  room.timer = setTimeout(() => explode(room), r.fuseEnd - now);
  broadcast(room);
}

function explode(room) {
  const r = room.round;
  if (room.status !== 'playing' || !r) return;
  const p = room.players[r.turnIdx];
  p.hearts -= 1;
  if (p.hearts <= 0) p.alive = false;
  io.to(room.code).emit('boom', { playerId: p.id, eliminated: !p.alive });
  if (aliveCount(room) <= 1) return endGame(room);
  const next = nextAliveIdx(room, r.turnIdx);
  setTimeout(() => {
    if (room.status === 'playing') startRound(room, next);
  }, config.popPauseMs);
  room.round = { ...r, turnStartedAt: 0 };
  broadcast(room);
}

function endGame(room) {
  clearTimeout(room.timer);
  room.status = 'ended';
  room.winnerId = room.players.find((p) => p.alive)?.id || null;
  broadcast(room);
}

function startGame(room) {
  room.status = 'playing';
  room.winnerId = null;
  room.round = null;
  room.recentCats = [];
  for (const p of room.players) {
    p.hearts = room.settings.lives;
    p.points = 0;
    p.bank = 0;
    p.alive = true;
  }
  startRound(room, Math.floor(Math.random() * room.players.length));
}

function handleAnswer(room, player, text) {
  const r = room.round;
  if (room.status !== 'playing' || !r || !r.turnStartedAt) return;
  if (room.players[r.turnIdx]?.id !== player.id) return;
  if (!normalize(text) && !exactForm(text)) return;
  const hit = findAnswer(CATS[r.cat], text, r.used);
  const shown = String(text).trim().slice(0, 40);
  if (!hit) {
    io.to(room.code).emit('answer', { playerId: player.id, text: shown, ok: false, reason: 'Không hợp lệ' });
    return;
  }
  if (r.used.has(hit.key)) {
    io.to(room.code).emit('answer', { playerId: player.id, text: shown, ok: false, reason: 'Đã có người nói' });
    return;
  }
  r.used.add(hit.key);
  const pts = TIER_POINTS[hit.tier];
  player.points += pts;
  player.bank += pts;
  let gainedHeart = false;
  const { pointsPerHeart, heartCap } = room.settings;
  while (player.bank >= pointsPerHeart && player.hearts < heartCap) {
    player.bank -= pointsPerHeart;
    player.hearts += 1;
    gainedHeart = true;
  }
  if (player.hearts >= heartCap) player.bank = Math.min(player.bank, pointsPerHeart - 1);
  io.to(room.code).emit('answer', {
    playerId: player.id, text: hit.label, ok: true, tier: hit.tier, points: pts, gainedHeart,
  });
  r.turnIdx = nextAliveIdx(room, r.turnIdx);
  startTurn(room);
}

function removePlayer(room, playerId) {
  const idx = room.players.findIndex((p) => p.id === playerId);
  if (idx === -1) return;
  if (room.status === 'playing') {
    const p = room.players[idx];
    const wasTurn = room.round && room.round.turnIdx === idx && room.round.turnStartedAt;
    p.alive = false;
    p.hearts = 0;
    p.left = true;
    if (aliveCount(room) <= 1) endGame(room);
    else if (wasTurn) {
      room.round.turnIdx = nextAliveIdx(room, idx);
      startTurn(room);
    }
  } else {
    room.players.splice(idx, 1);
  }
  const remaining = room.players.filter((p) => !p.left);
  if (remaining.length === 0) {
    clearTimeout(room.timer);
    rooms.delete(room.code);
    return;
  }
  if (room.hostId === playerId) room.hostId = remaining[0].id;
  broadcast(room);
}

io.on('connection', (socket) => {
  let room = null;
  let player = null;

  function join(r, name) {
    room = r;
    player = { id: socket.id, name: cleanName(name), hearts: 0, points: 0, bank: 0, alive: false };
    room.players.push(player);
    socket.join(room.code);
    socket.emit('joined', { code: room.code, you: player.id });
    broadcast(room);
  }

  socket.on('create', ({ name, settings } = {}, ack) => {
    if (room) return;
    const code = makeCode();
    const r = { code, hostId: socket.id, settings: clampSettings(settings), status: 'lobby', players: [], recentCats: [] };
    rooms.set(code, r);
    join(r, name);
    ack?.({ ok: true });
  });

  socket.on('join', ({ code, name } = {}, ack) => {
    if (room) return;
    const r = rooms.get(String(code || '').toUpperCase().trim());
    if (!r) return ack?.({ ok: false, error: 'Không tìm thấy phòng' });
    if (r.status !== 'lobby') return ack?.({ ok: false, error: 'Phòng đang chơi, đợi ván sau nhé' });
    if (r.players.length >= r.settings.seats) return ack?.({ ok: false, error: 'Phòng đã đầy' });
    join(r, name);
    ack?.({ ok: true });
  });

  socket.on('settings', (settings) => {
    if (!room || room.hostId !== socket.id || room.status === 'playing') return;
    room.settings = clampSettings(settings);
    broadcast(room);
  });

  socket.on('start', () => {
    if (!room || room.hostId !== socket.id || room.status === 'playing') return;
    room.players = room.players.filter((p) => !p.left);
    if (room.players.length < 2) return;
    startGame(room);
  });

  socket.on('typing', (text) => {
    if (!room || room.status !== 'playing' || !room.round) return;
    if (room.players[room.round.turnIdx]?.id !== socket.id) return;
    socket.to(room.code).emit('typing', { playerId: socket.id, text: String(text).slice(0, 40) });
  });

  socket.on('answer', (text) => {
    if (room && player) handleAnswer(room, player, text);
  });

  socket.on('disconnect', () => {
    if (room && player) removePlayer(room, player.id);
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Đùng! chạy ở http://localhost:${PORT}`));
}

module.exports = { config, server, normalize, findAnswer, CATS };
