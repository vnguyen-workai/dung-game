const assert = require('assert');
const { io } = require('socket.io-client');
const { config, server, CATS, findAnswer } = require('../server');
Object.assign(config, { fuseMinMs: 500, fuseMaxMs: 1200, popPauseMs: 200 });

// unit: accent handling
const fruit = CATS.find((c) => c.prompt.includes('trái cây'));
assert.equal(findAnswer(fruit, 'Dừa', new Set()).label, 'dừa');
assert.equal(findAnswer(fruit, 'dứa', new Set()).label, 'dứa|thơm|khóm'.split('|')[0]);
assert.equal(findAnswer(fruit, 'sau rieng', new Set()).label, 'sầu riêng');
const prov = CATS.find((c) => c.prompt.includes('tỉnh'));
assert.equal(findAnswer(prov, 'sai gon', new Set()).label, 'hồ chí minh');
assert.equal(findAnswer(prov, 'Đà   Nẵng!', new Set()).label, 'đà nẵng');

server.listen(0, async () => {
  const url = `http://localhost:${server.address().port}`;
  const mk = () => io(url, { transports: ['websocket'] });
  const [a, b, c] = [mk(), mk(), mk()];
  const states = new Map();
  for (const s of [a, b, c]) s.on('state', (st) => states.set(s, st));
  const emit = (s, ev, d) => new Promise((r) => s.emit(ev, d, r));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  await emit(a, 'create', { name: 'An' });
  await wait(100);
  const code = states.get(a).code;
  assert.match(code, /^[A-Z]{4}$/);
  assert.deepEqual(await emit(b, 'join', { code: 'zzzz', name: 'x' }), { ok: false, error: 'Không tìm thấy phòng' });
  assert.equal((await emit(b, 'join', { code: code.toLowerCase(), name: 'Bình' })).ok, true);
  assert.equal((await emit(c, 'join', { code, name: 'Chi' })).ok, true);
  b.emit('settings', { minTurn: 3 }); // non-host ignored
  a.emit('settings', { lives: 2, minTurn: 1, seats: 6, heartCap: 5, pointsPerHeart: 100 });
  await wait(100);
  assert.equal(states.get(c).settings.minTurn, 3); // clamped to min 3
  assert.equal(states.get(c).players.length, 3);

  const answers = [];
  for (const s of [a, b, c]) s.on('answer', (x) => answers.push(x));
  let booms = 0;
  a.on('boom', () => booms++);

  a.emit('start');
  await wait(150);
  let st = states.get(a);
  assert.equal(st.status, 'playing');
  const sock = (id) => [a, b, c].find((s) => s.id === id);

  // answer correctly with every valid answer of the current category, turn by turn
  const cat = CATS.find((x) => x.prompt === st.round.prompt);
  const labels = [...new Set([...cat.exact.values()].map((v) => v.label))];
  const first = st.round.turnId;
  sock(first).emit('answer', 'xyz không có'); // invalid
  await wait(80);
  assert.equal(answers.at(-1).ok, false);
  sock(first).emit('answer', labels[0]);
  await wait(80);
  assert.equal(answers.at(-1).ok, true);
  st = states.get(a);
  assert.notEqual(st.round.turnId, first, 'turn should pass');
  sock(st.round.turnId).emit('answer', labels[0]); // repeat
  await wait(80);
  assert.equal(answers.at(-1).reason, 'Đã có người nói');
  sock(first).emit('answer', labels[1]); // not their turn: ignored
  await wait(80);
  assert.equal(answers.at(-1).reason, 'Đã có người nói');

  // let fuses burn until the game ends
  const deadline = Date.now() + 120000;
  while (states.get(a).status !== 'ended' && Date.now() < deadline) await wait(200);
  st = states.get(a);
  assert.equal(st.status, 'ended');
  assert.ok(st.winnerId);
  assert.ok(booms >= 4, `booms ${booms}`);
  console.log('game ended after', booms, 'booms; winner', st.players.find((p) => p.id === st.winnerId).name);

  // replay works and leaving mid-game ends it
  a.emit('start');
  await wait(150);
  assert.equal(states.get(a).status, 'playing');
  b.disconnect(); c.disconnect();
  await wait(150);
  assert.equal(states.get(a).status, 'ended');
  console.log('ALL TESTS PASSED');
  a.disconnect();
  server.close();
  process.exit(0);
});
