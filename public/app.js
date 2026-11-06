const $ = (id) => document.getElementById(id);
const { Room, LIMITS } = window.DungEngine;
const { Net, online } = window.DungNet;

const SETTING_DEFS = [
  { key: 'lives', label: 'Số ❤ ban đầu' },
  { key: 'minTurn', label: 'Thời gian mỗi lượt', hint: 'số giây cho mỗi câu trả lời', suffix: 's' },
  { key: 'seats', label: 'Số ghế' },
  { key: 'heartCap', label: 'Tối đa ❤' },
  { key: 'pointsPerHeart', label: 'Điểm đổi 1 ❤', hint: 'trả lời hiếm được nhiều điểm', step: 50 },
];
const PLANE_KEYS = ['tanbinh', 'cotruong', 'sieuthanh', 'chop', 'quaixe'];
const TIER_NAMES = { 1: 'Phổ biến', 2: 'Khá hiếm', 3: 'Hiếm!', 4: 'Có một không hai!' };
const JOIN_TIMEOUT_MS = 5000;

const me = (crypto.randomUUID && crypto.randomUUID()) || `${Date.now()}-${Math.random()}`;
let net = null;
let room = null; // only on the host
let hostId = null;
let state = null;
let pendingJoin = null;
let turnKey = null;
let turnLocalStart = 0;
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

function heartsStr(p) {
  if (!p.alive) return 'rơi rồi';
  return p.hearts > 3 ? `♥×${p.hearts}` : '♥'.repeat(Math.max(0, p.hearts));
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function makeCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  return Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
}

// ---------- networking ----------
// Everything goes through act(): the host applies it to the game directly, others send it to the host.
function act(t, d = {}) {
  if (room) hostHandle({ t, from: me, ...d });
  else if (net) net.send({ t, from: me, ...d });
}

// Host: deliver an event to everyone, including itself.
function hostEmit(t, d) {
  net.send({ t, ...d });
  onEvent({ t, ...d });
}

function hostHandle(m) {
  switch (m.t) {
    case 'probe': net.send({ t: 'probeAck', to: m.from }); break;
    case 'join': {
      const res = room.join(m.from, m.name, m.plane);
      net.send({ t: 'joinRes', to: m.from, ...res });
      break;
    }
    case 'settings': room.setSettings(m.from, m.settings); break;
    case 'start': room.start(m.from); break;
    case 'answer': room.answer(m.from, m.text); break;
    case 'leave': room.leave(m.from); break;
  }
}

function onMessage(m) {
  if (m.to && m.to !== me) return;
  if (m.t === 'probeAck' && pendingJoin?.probe) { pendingJoin.resolve(true); return; }
  if (m.t === 'joinRes' && pendingJoin && !pendingJoin.probe) { pendingJoin.resolve(m); return; }
  if (m.t === 'typing') { onEvent(m); return; }
  if (m.t === 'closed' && m.from === hostId) { hostGone(); return; }
  if (room) hostHandle(m);
  else if (['state', 'answer', 'boom', 'topicDone'].includes(m.t)) onEvent(m);
}

function onLeave(id) {
  if (room) room.leave(id);
  else if (id === hostId) hostGone();
}

function hostGone() {
  if (!state) return;
  toast('Chủ phòng đã rời, ván kết thúc');
  setTimeout(goHome, 1500);
}

function waitFor(kind) {
  return new Promise((resolve) => {
    pendingJoin = { probe: kind === 'probe', resolve };
    setTimeout(() => resolve(null), kind === 'probe' ? 1200 : JOIN_TIMEOUT_MS);
  }).finally(() => { pendingJoin = null; });
}

async function openChannel(code) {
  net = new Net(code, me, onMessage, onLeave);
  await net.connect();
}

function closeChannel() {
  if (!net) return;
  try {
    net.send({ t: room ? 'closed' : 'leave', from: me });
    net.close();
  } catch {}
  room?.close();
  net = null;
  room = null;
}

function setBusy(busy) {
  $('createBtn').disabled = busy;
  $('joinBtn').disabled = busy;
}

// ---------- scenery ----------
$('mountainsImg').src = Sprites.mountains();
$('airportImg').src = Sprites.airport();
for (let i = 0; i < 7; i++) {
  const c = document.createElement('img');
  c.src = Sprites.cloud(i);
  c.alt = '';
  c.style.top = `${4 + ((i * 37) % 58)}%`;
  c.style.width = `${110 + ((i * 53) % 110)}px`;
  c.style.animationDuration = `${70 + ((i * 29) % 60)}s`;
  c.style.animationDelay = `-${(i * 17) % 90}s`;
  $('clouds').appendChild(c);
}
$('homeMascot').src = Sprites.plane('mascot', 'sleep');

// ---------- home ----------
$('nameInput').value = load('dung_name') || '';
let myPlane = PLANE_KEYS.includes(load('dung_plane')) ? load('dung_plane') : PLANE_KEYS[0];

function renderPicker() {
  $('planePicker').innerHTML = PLANE_KEYS.map((k) => `
    <button type="button" class="plane-opt" role="radio" aria-checked="${k === myPlane}" data-plane="${k}">
      <img src="${Sprites.plane(k)}" alt="" /><span>${Sprites.PLANES[k].name}</span>
    </button>`).join('');
}
renderPicker();
$('planePicker').addEventListener('click', (e) => {
  const b = e.target.closest('[data-plane]');
  if (!b) return;
  myPlane = b.dataset.plane;
  store('dung_plane', myPlane);
  renderPicker();
});

$('howBtn').onclick = () => { $('howModal').hidden = false; };
$('howClose').onclick = () => { $('howModal').hidden = true; };
$('howModal').addEventListener('click', (e) => { if (e.target.id === 'howModal') $('howModal').hidden = true; });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $('howModal').hidden = true; });
const params = new URLSearchParams(location.search);
if (params.get('r')) $('codeInput').value = params.get('r').toUpperCase().slice(0, 4);
if (!online) $('localNote').hidden = false;

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

$('createBtn').onclick = async () => {
  const name = getName();
  if (!name) return;
  setBusy(true);
  $('homeError').textContent = 'Đang tạo phòng…';
  try {
    for (let tries = 0; ; tries++) {
      const code = makeCode();
      await openChannel(code);
      net.send({ t: 'probe', from: me });
      if (!(await waitFor('probe')) || tries >= 4) {
        hostId = me;
        room = new Room(code, me, name, hostEmit, myPlane);
        history.replaceState(null, '', `?r=${code}`);
        $('homeError').textContent = '';
        break;
      }
      closeChannel();
    }
  } catch {
    closeChannel();
    $('homeError').textContent = 'Không kết nối được, thử lại nhé';
  }
  setBusy(false);
};

async function joinRoom() {
  const name = getName();
  if (!name) return;
  const code = $('codeInput').value.trim().toUpperCase();
  if (code.length !== 4) { $('homeError').textContent = 'Mã phòng có 4 chữ cái'; return; }
  setBusy(true);
  $('homeError').textContent = 'Đang vào phòng…';
  try {
    await openChannel(code);
    net.send({ t: 'join', from: me, name, plane: myPlane });
    const res = await waitFor('join');
    if (res?.ok) {
      history.replaceState(null, '', `?r=${code}`);
      $('homeError').textContent = '';
    } else {
      closeChannel();
      $('homeError').textContent = res ? res.error : 'Không tìm thấy phòng';
    }
  } catch {
    closeChannel();
    $('homeError').textContent = 'Không kết nối được, thử lại nhé';
  }
  setBusy(false);
}
$('joinBtn').onclick = joinRoom;
$('codeInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') joinRoom(); });
$('codeInput').addEventListener('input', (e) => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); });

function goHome() {
  closeChannel();
  location.href = location.pathname;
}
$('leaveBtn').onclick = goHome;
$('endLeaveBtn').onclick = goHome;
window.addEventListener('pagehide', closeChannel);

$('copyLinkBtn').onclick = async () => {
  const link = `${location.origin}${location.pathname}?r=${state.code}`;
  try {
    if (navigator.share && matchMedia('(pointer: coarse)').matches) await navigator.share({ title: 'Đùng!', text: `Vào phòng ${state.code} chơi Đùng! nè`, url: link });
    else { await navigator.clipboard.writeText(link); toast('Đã sao chép link mời'); }
  } catch { toast(link); }
};

$('startBtn').onclick = () => act('start');
$('inviteBox').onclick = () => $('copyLinkBtn').click();
$('againBtn').onclick = () => act('start');

// ---------- lobby ----------
function renderLobby() {
  const isHost = state.hostId === me;
  $('lobbyCode').textContent = state.code;
  $('seatCount').textContent = `${state.players.length}/${state.settings.seats}`;
  $('playerList').innerHTML = state.players.map((p) => `
    <li>
      <img src="${Sprites.plane(p.plane)}" alt="" />
      <span class="${p.id === me ? 'you' : ''}">${esc(p.name)}${p.id === me ? ' (bạn)' : ''}</span>
      ${p.id === state.hostId ? '<span class="tagx">Chủ phòng</span>' : ''}
    </li>`).join('');

  $('settingsBox').innerHTML = SETTING_DEFS.map((d) => {
    const v = state.settings[d.key];
    const [min, max] = LIMITS[d.key];
    return `<div class="set-row">
      <span class="lbl">${d.label}${d.hint ? `<small>${d.hint}</small>` : ''}</span>
      <span class="stepper">
        <button data-k="${d.key}" data-d="-1" ${!isHost || v <= min ? 'disabled' : ''} aria-label="Giảm">−</button>
        <span class="val">${v}${d.suffix || ''}</span>
        <button data-k="${d.key}" data-d="1" ${!isHost || v >= max ? 'disabled' : ''} aria-label="Tăng">+</button>
      </span>
    </div>`;
  }).join('');
  $('settingsNote').textContent = isHost
    ? 'Giữ trang này mở trong lúc chơi — máy chủ phòng điều khiển cả ván.'
    : 'Chỉ chủ phòng mới đổi được cài đặt.';

  const enough = state.players.length >= 2;
  $('startBtn').style.display = isHost ? '' : 'none';
  $('startBtn').disabled = !enough;
  $('startBtn').textContent = enough ? 'Cất cánh!' : 'Đang chờ người chơi…';
  $('lobbyWait').textContent = isHost
    ? (enough ? `${state.players.length} người đã lên máy bay — sẵn sàng cất cánh!` : `Gửi mã ${state.code} cho bạn bè. Có thêm 1 người là bắt đầu được.`)
    : 'Đợi chủ phòng bắt đầu…';
}

$('settingsBox').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-k]');
  if (!b || b.disabled) return;
  const d = SETTING_DEFS.find((x) => x.key === b.dataset.k);
  const settings = { ...state.settings, [d.key]: state.settings[d.key] + Number(b.dataset.d) * (d.step || 1) };
  act('settings', { settings });
});

// ---------- game ----------
function layoutSeats() {
  const arena = $('arena');
  const w = arena.clientWidth;
  const h = arena.clientHeight;
  const players = state.players;
  const n = players.length;
  const myIdx = Math.max(0, players.findIndex((p) => p.id === me));
  const crowded = n > 8;
  arena.classList.toggle('crowded', crowded);
  const rx = Math.max(60, w / 2 - (crowded ? 38 : 56));
  const ry = Math.max(60, h / 2 - (crowded ? 38 : 52));

  for (const [id, el] of seatEls) {
    if (!players.some((p) => p.id === id)) { el.remove(); seatEls.delete(id); }
  }
  players.forEach((p, i) => {
    let el = seatEls.get(p.id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'seat';
      el.innerHTML = `<img class="pl" src="${Sprites.plane(p.plane)}" alt="" />
        <div class="nm"></div><div class="hearts"></div><div class="bubble"></div>`;
      arena.appendChild(el);
      seatEls.set(p.id, el);
    }
    const a = Math.PI / 2 + (2 * Math.PI * (i - myIdx)) / n;
    const x = w / 2 + rx * Math.cos(a);
    const y = h / 2 + ry * Math.sin(a);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.dataset.x = x;
    el.dataset.y = y;
    el.querySelector('.nm').textContent = p.name;
    const struck = !!state.round?.strikes?.includes(p.id);
    el.querySelector('.hearts').textContent = heartsStr(p);
    el.classList.toggle('struck', struck);
    el.classList.toggle('me', p.id === me);
    el.classList.toggle('left', x > w / 2 + 4);
    el.classList.toggle('out', !p.alive);
    el.classList.toggle('turn', !!state.round && state.round.turnId === p.id && !!state.round.turnStartedAt);
  });
  moveMascot();
}

// The plane stays in the middle and points its nose at whoever must answer.
let aim = { angle: 0, flip: false, tx: 0, ty: 0 };
function moveMascot() {
  const arena = $('arena');
  const r = state.round;
  const seat = r && r.turnStartedAt ? seatEls.get(r.turnId) : null;
  const cx = arena.clientWidth / 2;
  const cy = arena.clientHeight / 2;
  const cr = $('mascot');
  cr.style.left = `${cx}px`;
  cr.style.top = `${cy}px`;
  if (seat) {
    const dx = Number(seat.dataset.x) - cx;
    const dy = Number(seat.dataset.y) - cy;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    aim = { angle, flip: Math.abs(angle) > 90, tx: Number(seat.dataset.x), ty: Number(seat.dataset.y) };
  }
  applyMascotTransform(seat ? currentScale : 1);
}

let currentScale = 1;
function applyMascotTransform(scale) {
  currentScale = scale;
  const r = state?.round;
  const aiming = r && r.turnStartedAt;
  $('mascot').style.transform = aiming
    ? `translate(-50%, -50%) rotate(${aim.angle}deg) scale(${scale}, ${aim.flip ? -scale : scale})`
    : 'translate(-50%, -50%)';
}

let lastShot = 0;
function fireBullet(fraction) {
  const arena = $('arena');
  const cr = $('mascot');
  const cx = arena.clientWidth / 2;
  const cy = arena.clientHeight / 2;
  const rad = (aim.angle * Math.PI) / 180;
  const nose = (cr.offsetWidth / 2) * currentScale * 0.85;
  const x0 = cx + Math.cos(rad) * nose;
  const y0 = cy + Math.sin(rad) * nose;
  const b = document.createElement('div');
  b.className = 'bullet';
  b.style.left = '0px';
  b.style.top = '0px';
  arena.appendChild(b);
  const spread = (Math.random() - 0.5) * 24;
  const anim = b.animate([
    { transform: `translate(${x0}px, ${y0}px) rotate(${aim.angle}deg)`, opacity: 1 },
    { transform: `translate(${aim.tx + spread}px, ${aim.ty - 10 + spread / 2}px) rotate(${aim.angle}deg)`, opacity: 0.9 },
  ], { duration: Math.max(160, 380 - fraction * 200), easing: 'linear' });
  anim.onfinish = () => b.remove();
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

let mascotMood = null;
function setMood(mood) {
  if (mood === mascotMood) return;
  mascotMood = mood;
  $('mascotImg').src = Sprites.plane('mascot', mood);
}

function updateFuse() {
  const cr = $('mascot');
  cr.classList.remove('shake1', 'shake2', 'shake3', 'idle');
  const r = state?.round;
  const timer = $('timer');
  if (!r || !r.turnStartedAt || state.status !== 'playing') {
    cr.classList.add('idle');
    setMood('sleep');
    applyMascotTransform(1);
    timer.classList.remove('danger');
    $('timerText').textContent = '–';
    $('timerFill').style.strokeDashoffset = 0;
    return;
  }
  const total = r.turnMs || state.settings.minTurn * 1000;
  const elapsed = performance.now() - turnLocalStart;
  const f = Math.min(1, elapsed / total);
  let level = 0;
  if (f > 0.85) level = 3;
  else if (f > 0.65) level = 2;
  else if (f > 0.4) level = 1;
  if (level) cr.classList.add(`shake${level}`);
  setMood(f > 0.6 ? 'angry' : 'awake');
  applyMascotTransform(1 + f * 0.45);
  const now = performance.now();
  if (now - lastShot > 520 - f * 420) {
    lastShot = now;
    fireBullet(f);
  }
  const left = Math.max(0, total - elapsed) / 1000;
  timer.classList.toggle('danger', left <= 3);
  $('timerText').textContent = left > 0 ? Math.ceil(left) : '!';
  $('timerFill').style.strokeDashoffset = 119.4 * f;
}

function renderGame() {
  const r = state.round;
  $('gameCode').textContent = state.code;
  $('roundNum').textContent = r ? r.number : 1;
  $('promptText').textContent = r ? r.prompt : '';
  $('usedCount').textContent = r ? `câu đúng ${r.usedCount}/${r.maxAnswers}` : '';

  const myP = state.players.find((p) => p.id === me);
  const pph = state.settings.pointsPerHeart;
  $('myPoints').textContent = myP ? myP.points : 0;
  $('myBank').textContent = myP ? myP.bank : 0;
  $('ppHeart').textContent = pph;
  $('meterFill').style.width = `${myP ? Math.min(100, (myP.bank / pph) * 100) : 0}%`;
  const slots = Math.max(state.settings.lives, myP ? myP.hearts : 0);
  $('heartRow').innerHTML = Array.from({ length: slots }, (_, i) => `<i class="${myP && i < myP.hearts ? '' : 'empty'}"></i>`).join('');

  const key = r && r.turnStartedAt ? `${r.number}:${r.turnId}:${r.turnStartedAt}` : null;
  if (key !== turnKey) {
    turnKey = key;
    turnLocalStart = performance.now();
    const input = $('answerInput');
    const mine = !!key && r.turnId === me && myP?.alive;
    // Alive players can type ahead at any time; only the player whose turn it is can send.
    input.disabled = !myP?.alive;
    $('sendBtn').disabled = !mine;
    input.classList.toggle('myturn', mine);
    input.classList.remove('shake');
    if (r && r.number !== typedForRound) { input.value = ''; typedForRound = r.number; }
    const current = state.players.find((p) => p.id === r?.turnId);
    if (myP && !myP.alive) {
      input.placeholder = 'Bạn đã bị loại';
      $('turnHint').textContent = 'Bạn đã bị loại — xem tiếp nhé';
    } else if (!key) {
      input.placeholder = 'Chuẩn bị chủ đề mới…';
      $('turnHint').textContent = '';
    } else if (mine) {
      input.placeholder = 'Gõ câu trả lời…';
      const struck = r.strikes?.includes(me);
      $('turnHint').textContent = struck ? 'Bạn đã hết giờ 1 lần — lần này hết giờ là nổ!'
        : input.value.trim() ? 'Tới lượt bạn — bấm BAY!' : 'Tới lượt bạn — sai thì gõ lại tới khi đúng';
      if (input.value) sendTyping();
      setTimeout(() => input.focus(), 30);
    } else {
      input.placeholder = 'Gõ trước, tới lượt thì bấm BAY…';
      $('turnHint').textContent = `${current?.name || '…'} đang trả lời — bạn có thể gõ trước`;
    }
  }
  layoutSeats();
  updateFuse();
}

$('answerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const text = $('answerInput').value.trim();
  if (!text) return;
  if (state?.round?.turnId !== me || !state.round.turnStartedAt) { toast('Chưa tới lượt bạn — giữ câu trả lời lại nhé'); return; }
  act('answer', { text });
});

// Live typing goes straight to everyone (not via the host), throttled to keep message counts low.
let typingTimer = null;
let typingLastSent = 0;
let typedForRound = null;
function sendTyping() {
  typingTimer = null;
  if (state?.round?.turnId !== me) return;
  typingLastSent = Date.now();
  net?.send({ t: 'typing', from: me, text: $('answerInput').value.slice(0, 40) });
}
$('answerInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && $('sendBtn').disabled && $('answerInput').value.trim()) toast('Chưa tới lượt bạn — giữ câu trả lời lại nhé');
});
$('answerInput').addEventListener('input', () => {
  if (typingTimer) return;
  typingTimer = setTimeout(sendTyping, Math.max(0, 300 - (Date.now() - typingLastSent)));
});

// ---------- end ----------
function renderEnd() {
  const winner = state.players.find((p) => p.id === state.winnerId);
  const myP = state.players.find((p) => p.id === me);
  $('winnerText').textContent = winner
    ? (winner.id === me ? 'Bạn thắng!' : `${winner.name} thắng!`)
    : `Hết ván! Bạn được ${myP ? myP.points : 0} điểm`;
  $('winnerPlane').src = Sprites.plane(winner ? winner.plane : 'mascot', 'awake');
  const sorted = [...state.players].sort((a, b) => (b.id === state.winnerId) - (a.id === state.winnerId) || b.points - a.points);
  $('scoreList').innerHTML = sorted.map((p) => `<li>${esc(p.name)}${p.id === me ? ' (bạn)' : ''} <b>${p.points} điểm</b></li>`).join('');
  const isHost = state.hostId === me;
  $('againBtn').style.display = isHost ? '' : 'none';
  $('againBtn').disabled = state.players.length < 2;
  $('againWait').textContent = isHost ? '' : 'Đợi chủ phòng mở ván mới…';
}

// ---------- game events ----------
function onEvent(m) {
  if (m.t === 'state') onState(m);
  else if (m.t === 'answer') onAnswer(m);
  else if (m.t === 'boom') onBoom(m);
  else if (m.t === 'topicDone') toast(`Đủ ${m.count} câu đúng — đổi chủ đề!`);
  else if (m.t === 'typing') onTyping(m);
}

function onState(s) {
  if (!s.players.some((p) => p.id === me)) return;
  const prevStatus = state?.status;
  if (state) {
    for (const p of s.players) {
      if (p.id !== me && !state.players.some((q) => q.id === p.id)) toast(`${p.name} vừa vào phòng`);
    }
  }
  state = s;
  hostId = s.hostId;
  if (s.status === 'lobby') { show('lobby'); renderLobby(); }
  else if (s.status === 'playing') {
    show('game');
    if (prevStatus !== 'playing') { for (const el of seatEls.values()) el.remove(); seatEls.clear(); turnKey = null; }
    renderGame();
  } else if (s.status === 'ended') {
    setTimeout(() => { if (state.status === 'ended') { show('end'); renderEnd(); } }, prevStatus === 'playing' ? 1800 : 0);
  }
}

function onTyping({ from, text }) {
  if (state?.status !== 'playing' || state.round?.turnId !== from || from === me) return;
  if (text) setBubble(from, text, 'typing', 0);
  else seatEls.get(from)?.querySelector('.bubble').classList.remove('show');
}

function onAnswer(a) {
  if (a.ok) {
    if (a.playerId === me) $('answerInput').value = '';
    setBubble(a.playerId, a.text, 'ok');
    floatText(a.playerId, `+${a.points} · ${TIER_NAMES[a.tier]}${a.gainedHeart ? ' +♥' : ''}`);
  } else {
    setBubble(a.playerId, a.text || a.reason, 'bad');
    const who = state.players.find((p) => p.id === a.playerId);
    if (a.playerId === me) {
      const input = $('answerInput');
      input.classList.remove('shake');
      void input.offsetWidth;
      input.classList.add('shake');
      if (a.strike) { input.value = ''; toast('Hết giờ! ✗ — lần sau hết giờ nữa là nổ'); }
      else { input.select(); toast(`${a.reason} — thử lại nhanh!`); }
    } else if (a.strike && who) {
      toast(`${who.name} hết giờ ✗ — lượt chuyển tiếp`);
    }
  }
}

function onBoom({ playerId, eliminated }) {
  const cr = $('mascot');
  cr.classList.add('gone');
  $('boomText').classList.remove('show');
  void $('boomText').offsetWidth;
  $('boomText').classList.add('show');
  $('flash').classList.remove('show');
  void $('flash').offsetWidth;
  $('flash').classList.add('show');
  if (navigator.vibrate && playerId === me) navigator.vibrate([80, 40, 160]);
  const p = state.players.find((x) => x.id === playerId);
  floatText(playerId, eliminated ? 'Bị loại!' : '−♥');
  if (playerId === me) toast(eliminated ? 'Bạn bị loại rồi!' : 'Nổ trên tay bạn! −♥');
  else if (p) toast(`Đùng! ${p.name} ${eliminated ? 'bị loại' : 'mất một ♥'}`);
  setTimeout(() => cr.classList.remove('gone'), 1600);
}

window.addEventListener('resize', () => { if (state?.status === 'playing') layoutSeats(); });
setInterval(() => { if (state?.status === 'playing') updateFuse(); }, 90);
