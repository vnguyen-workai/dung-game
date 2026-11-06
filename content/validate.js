// Usage: node content/validate.js <file.js> [...]
// Checks a category file: format, lowercase, tiers, and duplicate answers inside a category.
const path = require('path');

function exactForm(s) {
  return String(s).normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();
}
function loose(s) {
  return exactForm(s).replace(/đ/g, 'd').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

let errors = 0, warnings = 0, cats = 0, answers = 0;
const prompts = new Map();
for (const f of process.argv.slice(2)) {
  const list = require(path.resolve(f));
  if (!Array.isArray(list)) { console.log(`${f}: must export an array`); errors++; continue; }
  for (const c of list) {
    cats++;
    const where = `${path.basename(f)} › ${c.prompt}`;
    if (!c.id || !/^[a-z0-9-]+$/.test(c.id)) { console.log(`ERROR ${where}: id must be kebab-case`); errors++; }
    if (!c.group) { console.log(`ERROR ${where}: missing group`); errors++; }
    if (!/^Kể tên /.test(c.prompt || '')) { console.log(`ERROR ${where}: prompt must start with "Kể tên "`); errors++; }
    if (prompts.has(c.prompt)) { console.log(`ERROR ${where}: duplicate prompt (also in ${prompts.get(c.prompt)})`); errors++; }
    prompts.set(c.prompt, f);
    const exact = new Map(), looseMap = new Map();
    let n = 0;
    for (const tier of ['1', '2', '3', '4']) {
      const list2 = (c.answers || {})[tier];
      if (!Array.isArray(list2) || !list2.length) { console.log(`ERROR ${where}: tier ${tier} missing/empty`); errors++; continue; }
      for (const entry of list2) {
        n++;
        if (entry !== entry.toLowerCase()) { console.log(`ERROR ${where}: not lowercase: "${entry}"`); errors++; }
        for (const a of entry.split('|')) {
          if (!a.trim()) { console.log(`ERROR ${where}: empty alias in "${entry}"`); errors++; continue; }
          const e = exactForm(a), l = loose(a);
          if (exact.has(e) && exact.get(e) !== entry) { console.log(`ERROR ${where}: "${a}" is in "${entry}" and "${exact.get(e)}"`); errors++; }
          exact.set(e, entry);
          if (looseMap.has(l) && looseMap.get(l) !== entry && exact.get(e) === entry) {
            if (!looseMap.get(l).split('|').some((x) => exactForm(x) === e)) { console.log(`warn  ${where}: "${a}" ≈ "${looseMap.get(l)}" without accents`); warnings++; }
          }
          looseMap.set(l, entry);
        }
      }
    }
    answers += n;
    const min = c.min || 40;
    if (n < min) { console.log(`ERROR ${where}: only ${n} answers (need ≥ ${min})`); errors++; }
  }
}
console.log(`\n${cats} categories, ${answers} answers, ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
