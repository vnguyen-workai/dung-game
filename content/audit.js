// Usage: node content/audit.js <tests.json> [--wrong]
// tests.json: { "<category id>": ["answer a player might type", ...], ... }
// Runs every answer through the real game matcher (built from all content files) and lists the ones it rejects.
// With --wrong, the file holds answers that must NOT be accepted, and it lists the ones that wrongly are.
const fs = require('fs');
const path = require('path');
const Module = require('module');

const dir = __dirname;
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js') && !['build.js', 'validate.js', 'audit.js'].includes(f));
const categories = files.flatMap((f) => { delete require.cache[path.join(dir, f)]; return require(path.join(dir, f)); });

// Load the engine with these categories instead of the built public/categories.js.
const enginePath = path.join(dir, '..', 'public', 'engine.js');
const src = fs.readFileSync(enginePath, 'utf8');
const m = new Module(enginePath, module);
m.filename = enginePath;
m.paths = Module._nodeModulePaths(path.dirname(enginePath));
const origRequire = m.require.bind(m);
m.require = (id) => (id === './categories' ? categories : origRequire(id));
m._compile(src, enginePath);
const { CATS, findAnswer } = m.exports;

const tests = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const wrongMode = process.argv.includes('--wrong');
let total = 0, rejected = 0;
for (const [id, answers] of Object.entries(tests)) {
  const cat = CATS.find((c) => c.id === id);
  if (!cat) { console.log(`?? unknown category id: ${id}`); continue; }
  const misses = [];
  for (const a of answers) {
    total++;
    const hit = findAnswer(cat, a, new Set());
    if (wrongMode ? hit : !hit) { rejected++; misses.push(wrongMode ? `${a} → ${hit.label}` : a); }
  }
  if (wrongMode) console.log(`${id}: ${misses.length ? `✗ wrongly accepted: ${misses.join(' | ')}` : `all ${answers.length} wrong answers rejected`}`);
  else console.log(`${id}: ${answers.length - misses.length}/${answers.length} accepted${misses.length ? `  ✗ ${misses.join(' | ')}` : ''}`);
}
console.log(wrongMode ? `\n${rejected} of ${total} wrong answers were accepted` : `\n${total - rejected}/${total} accepted, ${rejected} rejected`);
