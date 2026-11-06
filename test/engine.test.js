const assert = require('assert');
const { Room, LIMITS, config, CATS, findAnswer } = require('../public/engine');

Object.assign(config, { fuseMinMs: 300, fuseMaxMs: 700, popPauseMs: 100 });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// accent handling
const fruit = CATS.find((c) => c.prompt.includes('trái cây'));
assert.equal(findAnswer(fruit, 'Dừa', new Set()).label, 'dừa');
assert.equal(findAnswer(fruit, 'dứa', new Set()).label, 'dứa');
assert.equal(findAnswer(fruit, 'sau rieng', new Set()).label, 'sầu riêng');
const prov = CATS.find((c) => c.prompt.includes('tỉnh'));
assert.equal(findAnswer(prov, 'sai gon', new Set()).label, 'hồ chí minh');
assert.equal(findAnswer(prov, 'Đà   Nẵng!', new Set()).label, 'đà nẵng');

(async () => {
  const events = [];
  let st = null;
  const room = new Room('ABCD', 'h', 'Host', (t, d) => { events.push({ t, ...d }); if (t === 'state') st = d; }, 'cotruong');
  const last = (t) => events.filter((e) => e.t === t).at(-1);

  assert.equal(st.players[0].plane, 'cotruong');
  assert.equal(room.join('x', 'X', 'not-a-plane').ok, true);
  assert.equal(st.players[1].plane, 'tanbinh', 'unknown plane falls back to default');
  room.leave('x');

  assert.equal(st.settings.seats, 20);
  room.setSettings('h', { ...st.settings, seats: 10 });

  // join rules
  for (let i = 1; i < 20; i++) assert.equal(room.join(`p${i}`, `P${i}`, 'chop').ok, i < 10, `seat ${i}`);
  assert.equal(room.join('p99', 'X').error, 'Phòng đã đầy');
  room.setSettings('p1', { seats: 20 }); // not host: ignored
  assert.equal(st.settings.seats, 10);
  room.setSettings('h', { lives: 2, minTurn: 1, seats: 99, heartCap: 5, pointsPerHeart: 100 });
  assert.equal(st.settings.seats, 20);
  assert.equal(st.settings.minTurn, 3);
  for (let i = 10; i < 20; i++) assert.ok(room.join(`p${i}`, `P${i}`).ok);
  assert.equal(st.players.length, 20);
  assert.equal(room.join('late', 'L').error, 'Phòng đã đầy');
  room.setSettings('h', { ...st.settings, seats: 2 });
  assert.equal(st.settings.seats, 20, 'cannot shrink below player count');

  LIMITS.minTurn[0] = 0;
  room.setSettings('h', { ...st.settings, minTurn: 0 });

  // lobby leave
  room.leave('p19');
  assert.equal(st.players.length, 19);

  room.start('p1'); // not host
  assert.equal(st.status, 'lobby');
  room.start('h');
  assert.equal(st.status, 'playing');
  assert.equal(room.join('late', 'L').ok, true, 'can join mid-game');
  const late = st.players.find((p) => p.id === 'late');
  assert.ok(late.alive && late.hearts === st.settings.lives, 'late joiner gets full hearts');
  assert.equal(room.join('late2', 'L2').error, 'Phòng đã đầy');

  // turn mechanics
  const cat = CATS.find((c) => c.prompt === st.round.prompt);
  const labels = [...new Set([...cat.exact.values()].map((v) => v.label))];
  const first = st.round.turnId;
  room.answer(first, 'xyz không có');
  assert.equal(last('answer').reason, 'Không hợp lệ');
  room.answer(first, labels[0]);
  assert.equal(last('answer').ok, true);
  assert.notEqual(st.round.turnId, first);
  room.answer(st.round.turnId, labels[0]);
  assert.equal(last('answer').reason, 'Đã có người nói');
  const n = events.length;
  room.answer(first, labels[1]); // not their turn
  assert.equal(events.length, n);

  // leaving on your turn passes the fuse on
  const cur = st.round.turnId;
  room.leave(cur);
  assert.notEqual(st.round.turnId, cur);
  assert.equal(st.players.find((p) => p.id === cur).alive, false);

  // play to the end
  const deadline = Date.now() + 60000;
  while (st.status !== 'ended' && Date.now() < deadline) await wait(50);
  assert.equal(st.status, 'ended');
  assert.ok(st.winnerId);
  const booms = events.filter((e) => e.t === 'boom').length;
  assert.ok(booms >= 18 * 2 - 1, `booms ${booms}`);
  assert.equal(st.players.filter((p) => p.alive).length, 1);

  // replay, then everyone else leaves
  room.start('h');
  assert.equal(st.status, 'playing');
  assert.equal(st.players.length, 19, 'players who left are dropped on replay');
  for (const p of st.players) if (p.id !== 'h') room.leave(p.id);
  assert.equal(st.status, 'ended');
  room.close();

  // solo: start alone, game runs until out of hearts, no winner
  let solo = null;
  const sr = new Room('SOLO', 's', 'Solo', (t, d) => { if (t === 'state') solo = d; });
  sr.setSettings('s', { ...solo.settings, minTurn: 0, lives: 2 });
  sr.start('s');
  assert.equal(solo.status, 'playing', 'can start alone');
  assert.equal(solo.round.turnId, 's');
  await wait(1200);
  assert.equal(solo.status, 'playing', 'one lost heart does not end a solo game');
  while (solo.status !== 'ended' && Date.now() < deadline + 30000) await wait(50);
  assert.equal(solo.status, 'ended');
  assert.equal(solo.winnerId, null);

  // solo, then a friend joins mid-game: last one flying wins
  sr.start('s');
  assert.equal(sr.join('f', 'Friend').ok, true);
  assert.equal(solo.players.length, 2);
  while (solo.status !== 'ended') await wait(50);
  assert.ok(['s', 'f'].includes(solo.winnerId), 'a winner once a friend joined');
  sr.close();
  console.log(`ALL TESTS PASSED (${booms} booms, ${CATS.length} categories)`);
})();
