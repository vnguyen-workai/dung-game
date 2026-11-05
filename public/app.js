const socket = io();
const $ = (id) => document.getElementById(id);

const SETTING_DEFS = [
  { key: 'lives', label: 'Số ❤ ban đầu', min: 1, max: 5, step: 1 },
  { key: 'minTurn', label: 'Thời gian mỗi lượt', hint: 'ít nhất', min: 3, max: 15, step: 1, suffix: 's' },
  { key: 'seats', label: 'Số ghế', min: 2, max: 10, step: 1 },
  { key: 'heartCap', label: 'Tối đa ❤', min: 1, max: 9, step: 1 },
  { key: 'pointsPerHeart', label: 'Điểm đổi 1 ❤', hint: 'trả lời hiếm được nhiều điểm', min: 100, max: 1000, step: 50 },
];
const COLORS = ['#ffd166', '#ff8fab', '#8ecae6', '#95d5b2', '#cdb4db', '#f4a261', '#90e0ef', '#ffadad', '#caffbf', '#fdffb6'];
const TIER_NAMES = { 1: 'Phổ biến', 2: 'Khá hiếm', 3: 'Hiếm!', 4: 'Có một không hai!' };

let me = null;
let state = null;
let turnKey = null;
let turnLocalStart = 0;
let fuseTick = null;
const seatEls = new Map();
const bubbleTimers = new Map();

// ---------- helpers ----------
function store(k, v) { try { localStorage.setItem(k, v); } catch {} }
function load(k) { try { return localStorage.getItem(k); } catch { return null; } }

function show(screen) {
  for (const s of document.querySelectorAll('.screen')) s.classList.toggle('active', s.id === screen);
}

let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

function colorFor(id) {
  const idx = state ? state.players.findIndex((p) => p.id === id) : 0;
  return COLORS[(idx < 0 ? 0 : idx) % COLORS.length];
}

function heartsStr(p) {
  if (!p.alive) return '💀';
  return '❤'.repeat(Math.max(0, p.hearts));
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function lanternSVG(color) {
  return `<svg viewBox="0 0 44 54" aria-hidden="true">
    <line x1="22" y1="0" x2="22" y2="6" stroke="#c9a24a" stroke-width="2"/>
    <rect x="13" y="5" width="18" height="5" rx="2" fill="#c9a24a"/>
    <ellipse cx="22" cy="27" rx="19" ry="17" fill="${color}"/>
    <path d="M22 10 Q 10 27 22 44 M22 10 Q 34 27 22 44" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="2"/>
    <rect x="13" y="42" width="18" height="5" rx="2" fill="#c9a24a"/>
    <line x1="17" y1="47" x2="17" y2="54" stroke="#e3262f" stroke-width="2"/>
    <line x1="22" y1="47" x2="22" y2="54" stroke="#e3262f" stroke-width="2"/>
    <line x1="27" y1="47" x2="27" y2="54" stroke="#e3262f" stroke-width="2"/>
  </svg>`;
}

// ---------- home ----------
$('nameInput').value = load('dung_name') || '';
const params = new URLSearchParams(location.search);
if (params.get('r')) $('codeInput').value = params.get('r').toUpperCase().slice(0, 4);

function getName() {
  const n = $('nameInput').value.trim();
  if (!n) {
    $('homeError').textContent = 'Nhập tên của bạn trước nhé';
    $('nameInput').focus();
    return null;
  }
  store('dung_name', n);
  return n;
}

$('createBtn').onclick = () => {
  const name = getName();
  if (!name) return;
  socket.emit('create', { name }, (res) => { if (!res?.ok) $('homeError').textContent = res?.error || 'Lỗi'; });
};

function joinRoom() {
  const name = getName();
  if (!name) return;
  const code = $('codeInput').value.trim().toUpperCase();
  if (code.length !== 4) { $('homeError').textContent = 'Mã phòng có 4 chữ cái'; return; }
  socket.emit('join', { code, name }, (res) => { if (!res?.ok) $('homeError').textContent = res?.error || 'Lỗi'; });
}
$('joinBtn').onclick = joinRoom;
$('codeInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') joinRoom(); });
$('codeInput').addEventListener('input', (e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); });

function leave() {
  location.href = location.pathname;
}
$('leaveBtn').onclick = leave;
$('endLeaveBtn').onclick = leave;

$('copyLinkBtn').onclick = async () => {
  const link = `${location.origin}${location.pathname}?r=${state.code}`;
  try {
    if (navigator.share && matchMedia('(pointer: coarse)').matches) await navigator.share({ title: 'Đùng!', text: `Vào phòng ${state.code} chơi Đùng! nè`, url: link });
    else { await navigator.clipboard.writeText(link); toast('Đã sao chép link mời'); }
  } catch { toast(link); }
};

$('startBtn').onclick = () => socket.emit('start');
$('againBtn').onclick = () => socket.emit('start');

// ---------- lobby ----------
function renderLobby() {
  const isHost = state.hostId === me;
  $('lobbyCode').textContent = state.code;
  $('seatCount').textContent = `${state.players.length}/${state.settings.seats}`;
  $('playerList').innerHTML = state.players.map((p) => `
    <li>
      <span class="avatar" style="background:${colorFor(p.id)}">${esc(p.name[0].toUpperCase())}</span>
      <span>${esc(p.name)}${p.id === me ? ' <span class="muted">(bạn)</span>' : ''}</span>
      ${p.id === state.hostId ? '<span class="tagx">Chủ phòng</span>' : ''}
    </li>`).join('');

  const box = $('settingsBox');
  box.innerHTML = SETTING_DEFS.map((d) => {
    const v = state.settings[d.key];
    return `<div class="set-row">
      <span class="lbl">${d.label}${d.hint ? `<small>${d.hint}</small>` : ''}</span>
      <span class="stepper">
        <button data-k="${d.key}" data-d="-1" ${!isHost || v <= d.min ? 'disabled' : ''} aria-label="Giảm">−</button>
        <span class="val">${v}${d.suffix || ''}</span>
        <button data-k="${d.key}" data-d="1" ${!isHost || v >= d.max ? 'disabled' : ''} aria-label="Tăng">+</button>
      </span>
    </div>`;
  }).join('');
  $('settingsNote').textContent = isHost ? '' : 'Chỉ chủ phòng mới đổi được cài đặt.';

  const enough = state.players.length >= 2;
  $('startBtn').style.display = isHost ? '' : 'none';
  $('startBtn').disabled = !enough;
  $('lobbyWait').textContent = isHost
    ? (enough ? '' : 'Cần ít nhất 2 người. Gửi mã phòng cho bạn bè nhé!')
    : 'Đợi chủ phòng bắt đầu…';
}

$('settingsBox').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-k]');
  if (!b || b.disabled) return;
  const d = SETTING_DEFS.find((x) => x.key === b.dataset.k);
  const next = { ...state.settings, [d.key]: state.settings[d.key] + Number(b.dataset.d) * d.step };
  socket.emit('settings', next);
});

// ---------- game ----------
function layoutSeats() {
  const arena = $('arena');
  const w = arena.clientWidth;
  const h = arena.clientHeight;
  const players = state.players;
  const n = players.length;
  const myIdx = Math.max(0, players.findIndex((p) => p.id === me));
  const rx = Math.max(60, w / 2 - 56);
  const ry = Math.max(60, h / 2 - 52);

  for (const [id, el] of seatEls) {
    if (!players.some((p) => p.id === id)) { el.remove(); seatEls.delete(id); }
  }
  players.forEach((p, i) => {
    let el = seatEls.get(p.id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'seat';
      el.innerHTML = `<div class="lantern">${lanternSVG(colorFor(p.id))}</div>
        <div class="nm"></div><div class="hearts"></div><div class="bubble"></div>`;
      arena.appendChild(el);
      seatEls.set(p.id, el);
    }
    const a = Math.PI / 2 + (2 * Math.PI * (i - myIdx)) / n;
    el.style.left = `${w / 2 + rx * Math.cos(a)}px`;
    el.style.top = `${h / 2 + ry * Math.sin(a)}px`;
    el.dataset.x = w / 2 + rx * Math.cos(a);
    el.dataset.y = h / 2 + ry * Math.sin(a);
    el.querySelector('.nm').textContent = p.name;
    el.querySelector('.hearts').textContent = heartsStr(p);
    el.classList.toggle('me', p.id === me);
    el.classList.toggle('out', !p.alive);
    el.classList.toggle('turn', !!state.round && state.round.turnId === p.id && !!state.round.turnStartedAt);
  });
  moveCracker();
}

function moveCracker() {
  const cr = $('cracker');
  const arena = $('arena');
  const r = state.round;
  const seat = r && r.turnStartedAt ? seatEls.get(r.turnId) : null;
  const cx = arena.clientWidth / 2;
  const cy = arena.clientHeight / 2;
  if (seat) {
    cr.style.left = `${cx + (Number(seat.dataset.x) - cx) * 0.42}px`;
    cr.style.top = `${cy + (Number(seat.dataset.y) - cy) * 0.42}px`;
  } else {
    cr.style.left = `${cx}px`;
    cr.style.top = `${cy}px`;
  }
}

function setBubble(playerId, text, cls, ms = 2600) {
  const el = seatEls.get(playerId);
  if (!el) return;
  const b = el.querySelector('.bubble');
  b.textContent = text;
  b.className = `bubble show ${cls}`;
  clearTimeout(bubbleTimers.get(playerId));
  if (ms) bubbleTimers.set(playerId, setTimeout(() => b.classList.remove('show'), ms));
}

function floatText(playerId, text) {
  const el = seatEls.get(playerId);
  if (!el) return;
  const f = document.createElement('div');
  f.className = 'float-pts';
  f.textContent = text;
  el.appendChild(f);
  setTimeout(() => f.remove(), 1500);
}

function updateFuse() {
  const cr = $('cracker');
  cr.classList.remove('shake1', 'shake2', 'shake3');
  const r = state?.round;
  if (!r || !r.turnStartedAt || state.status !== 'playing') { cr.classList.remove('lit'); return; }
  cr.classList.add('lit');
  const t = (performance.now() - turnLocalStart) / 1000;
  const m = state.settings.minTurn;
  if (t > m * 1.2) cr.classList.add('shake3');
  else if (t > m * 0.8) cr.classList.add('shake2');
  else if (t > m * 0.4) cr.classList.add('shake1');
}

function renderGame() {
  const r = state.round;
  $('gameCode').textContent = state.code;
  $('roundNum').textContent = r ? r.number : 1;
  $('promptText').textContent = r ? r.prompt : '';
  $('usedCount').textContent = r && r.usedCount ? `${r.usedCount} câu đã được nói` : 'Chưa ai trả lời';

  const myP = state.players.find((p) => p.id === me);
  const pph = state.settings.pointsPerHeart;
  $('myPoints').textContent = myP ? myP.points : 0;
  $('myBank').textContent = myP ? myP.bank : 0;
  $('ppHeart').textContent = pph;
  $('meterFill').style.width = `${myP ? Math.min(100, (myP.bank / pph) * 100) : 0}%`;

  const key = r && r.turnStartedAt ? `${r.number}:${r.turnId}:${r.turnStartedAt}` : null;
  if (key !== turnKey) {
    turnKey = key;
    turnLocalStart = performance.now();
    const input = $('answerInput');
    const mine = !!key && r.turnId === me && myP?.alive;
    input.disabled = !mine;
    $('sendBtn').disabled = !mine;
    input.classList.toggle('myturn', mine);
    input.value = '';
    const current = state.players.find((p) => p.id === r?.turnId);
    if (!key) {
      input.placeholder = 'Chuẩn bị vòng mới…';
      $('turnHint').textContent = '';
    } else if (mine) {
      input.placeholder = 'Tới lượt bạn! Gõ nhanh…';
      $('turnHint').textContent = '🔥 Ngòi đang cháy!';
      setTimeout(() => input.focus(), 30);
    } else {
      input.placeholder = `${current?.name || '…'} đang trả lời…`;
      $('turnHint').textContent = myP && !myP.alive ? 'Bạn đã bị loại — xem tiếp nhé' : '';
    }
  }
  layoutSeats();
  updateFuse();
}

$('answerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const v = $('answerInput').value.trim();
  if (!v) return;
  socket.emit('answer', v);
});
$('answerInput').addEventListener('input', (e) => socket.emit('typing', e.target.value));

// ---------- end ----------
function renderEnd() {
  const winner = state.players.find((p) => p.id === state.winnerId);
  $('winnerText').textContent = winner ? (winner.id === me ? 'Bạn thắng! 🎉' : `${winner.name} thắng!`) : 'Hết ván!';
  const sorted = [...state.players].sort((a, b) => (b.id === state.winnerId) - (a.id === state.winnerId) || b.points - a.points);
  $('scoreList').innerHTML = sorted.map((p) => `<li>${esc(p.name)}${p.id === me ? ' (bạn)' : ''} <b>${p.points} điểm</b></li>`).join('');
  const isHost = state.hostId === me;
  $('againBtn').style.display = isHost ? '' : 'none';
  $('againBtn').disabled = state.players.length < 2;
  $('againWait').textContent = isHost ? '' : 'Đợi chủ phòng mở ván mới…';
}

// ---------- socket events ----------
socket.on('joined', ({ code, you }) => {
  me = you;
  history.replaceState(null, '', `?r=${code}`);
});

socket.on('state', (s) => {
  const prevStatus = state?.status;
  state = s;
  if (s.status === 'lobby') { show('lobby'); renderLobby(); }
  else if (s.status === 'playing') {
    show('game');
    if (prevStatus !== 'playing') { for (const el of seatEls.values()) el.remove(); seatEls.clear(); turnKey = null; }
    renderGame();
  } else if (s.status === 'ended') {
    setTimeout(() => { if (state.status === 'ended') { show('end'); renderEnd(); } }, prevStatus === 'playing' ? 1800 : 0);
  }
});

socket.on('typing', ({ playerId, text }) => {
  if (text) setBubble(playerId, text, 'typing', 0);
  else seatEls.get(playerId)?.querySelector('.bubble').classList.remove('show');
});

socket.on('answer', (a) => {
  if (a.ok) {
    setBubble(a.playerId, a.text, 'ok');
    floatText(a.playerId, `+${a.points} · ${TIER_NAMES[a.tier]}${a.gainedHeart ? ' +❤' : ''}`);
  } else {
    setBubble(a.playerId, a.text, 'bad');
    if (a.playerId === me) {
      const input = $('answerInput');
      input.classList.remove('shake');
      void input.offsetWidth;
      input.classList.add('shake');
      input.select();
      toast(a.reason);
    }
  }
});

socket.on('boom', ({ playerId, eliminated }) => {
  const cr = $('cracker');
  cr.classList.add('gone');
  $('boomText').classList.remove('show');
  void $('boomText').offsetWidth;
  $('boomText').classList.add('show');
  $('flash').classList.remove('show');
  void $('flash').offsetWidth;
  $('flash').classList.add('show');
  if (navigator.vibrate && playerId === me) navigator.vibrate([80, 40, 160]);
  const p = state.players.find((x) => x.id === playerId);
  floatText(playerId, eliminated ? 'Bị loại!' : '−❤');
  if (playerId === me) toast(eliminated ? 'Bạn bị loại rồi 😢' : 'Pháo nổ trên tay bạn! −❤');
  else if (p) toast(`Đùng! ${p.name} ${eliminated ? 'bị loại' : 'mất một ❤'}`);
  setTimeout(() => cr.classList.remove('gone'), 1600);
});

socket.on('disconnect', () => {
  if (state) toast('Mất kết nối…');
});
socket.io.on('reconnect', () => {
  if (state) { toast('Đã mất phòng, quay về trang chủ'); setTimeout(leave, 1200); }
});

window.addEventListener('resize', () => { if (state?.status === 'playing') layoutSeats(); });
fuseTick = setInterval(() => { if (state?.status === 'playing') updateFuse(); }, 250);
