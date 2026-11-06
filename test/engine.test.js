const assert = require('assert');
const { Room, LIMITS, config, CATS, findAnswer, answersForPlayers } = require('../public/engine');
assert.deepEqual([2, 3, 4, 10].map(answersForPlayers), [4, 5, 7, 7]);

Object.assign(config, { turnFloorMs: 30, popPauseMs: 20, topicIntroMs: 0 });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// accent and prefix handling
const europe = CATS.find((c) => c.id === 'europe-countries');
assert.equal(findAnswer(europe, 'Pháp', new Set()).label, 'pháp');
assert.equal(findAnswer(europe, 'nuoc phap', new Set()).label, 'pháp');
assert.equal(findAnswer(europe, 'xyz không có', new Set()), null);
const asia = CATS.find((c) => c.id === 'asia-oceania-countries');
assert.equal(findAnswer(asia, 'NHAT BAN!', new Set()).label, 'nhật bản');
assert.equal(findAnswer(asia, 'campuchiaa', new Set()).label, 'campuchia');
const places = CATS.find((c) => c.id === 'east-asia-places');
assert.equal(findAnswer(places, 'thuong hai', new Set()).label, 'thượng hải');
assert.equal(findAnswer(places, 'hải phòng', new Set()), null);
const langs = CATS.find((c) => c.id === 'programming-languages');
assert.equal(findAnswer(langs, 'C++', new Set()).label, 'c++');
assert.equal(findAnswer(langs, 'c', new Set()).label, 'c');

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
  assert.equal(st.settings.minTurn, 4);
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

  // turn mechanics: wrong answers are rejected and the same player keeps trying
  const cat = CATS.find((c) => c.prompt === st.round.prompt);
  const labels = [...new Set([...cat.exact.values()].flat().map((v) => v.label))];
  const first = st.round.turnId;
  room.answer(first, 'xyz không có');
  assert.equal(last('answer').reason, 'Không đúng');
  assert.equal(st.round.turnId, first, 'still the same player after a wrong answer');
  room.answer(first, labels[0]);
  assert.equal(last('answer').ok, true);
  assert.notEqual(st.round.turnId, first);
  const second = st.round.turnId;
  room.answer(second, labels[0]);
  assert.equal(last('answer').reason, 'Đã có người nói');
  assert.equal(st.round.turnId, second);
  const n = events.length;
  room.answer(first, labels[1]); // not their turn
  assert.equal(events.length, n);

  // leaving on your turn passes the fuse on
  const cur = st.round.turnId;
  room.leave(cur);
  assert.notEqual(st.round.turnId, cur);
  assert.equal(st.players.find((p) => p.id === cur).alive, false);

  // every turn gets the full time, and a topic ends after maxAnswers
  {
    let t = null;
    const events2 = [];
    const tr = new Room('TIME', 'a', 'A', (k, d) => { events2.push(k); if (k === 'state') t = d; });
    tr.join('b', 'B');
    tr.setSettings('a', { ...t.settings, minTurn: 10 });
    tr.start('a');
    assert.equal(t.round.turnMs, 10000);
    const c = CATS.find((x) => x.prompt === t.round.prompt);
    const all = [...new Set([...c.exact.values()].flat().map((v) => v.label))];
    tr.answer(t.round.turnId, all[0]);
    assert.equal(t.round.turnMs, 10000, 'every turn gets the full time');
    assert.equal(t.round.maxAnswers, 4, 'two players: 4 correct answers per topic');
    for (let i = 1; i < t.round.maxAnswers; i++) tr.answer(t.round.turnId, all[i]);
    assert.ok(events2.includes('topicDone'), 'topic ends after maxAnswers');
    assert.equal(t.round.turnStartedAt, 0);
    assert.ok(t.players.every((p) => p.hearts === t.settings.lives || p.hearts > t.settings.lives), 'nobody lost a heart');
    await wait(150);
    assert.notEqual(t.round.prompt, c.prompt, 'new topic');
    assert.equal(t.round.turnMs, 10000, 'timer resets on a new topic');
    // wrong answers never explode; running out of time twice in one topic does
    const booms0 = events2.filter((k) => k === 'boom').length;
    const victim = t.round.turnId;
    tr.answer(victim, 'sai bét');
    tr.answer(victim, 'sai nữa');
    assert.equal(t.round.turnId, victim);
    assert.equal(events2.filter((k) => k === 'boom').length, booms0, 'wrong answers: no boom');
    tr.explode(); // victim runs out of time: boom straight away
    assert.equal(events2.filter((k) => k === 'boom').length, booms0 + 1, 'timeout: boom');
    assert.equal(t.players.find((p) => p.id === victim).hearts, t.settings.lives - 1);
    tr.close();
  }

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

  // cannot start alone; a friend who joins mid-game gets full hearts
  let solo = null;
  const sr = new Room('SOLO', 's', 'Solo', (t, d) => { if (t === 'state') solo = d; });
  sr.setSettings('s', { ...solo.settings, minTurn: 0, lives: 2 });
  sr.start('s');
  assert.equal(solo.status, 'lobby', 'needs at least 2 players');
  sr.join('a', 'A');
  sr.start('s');
  assert.equal(solo.status, 'playing');
  assert.equal(sr.join('f', 'Friend').ok, true);
  assert.equal(solo.players.find((p) => p.id === 'f').alive, true);
  while (solo.status !== 'ended') await wait(50);
  assert.ok(solo.winnerId, 'there is a winner');
  sr.close();
  console.log(`ALL TESTS PASSED (${booms} booms, ${CATS.length} categories)`);
})();
