#!/usr/bin/env node
/**
 * R-02 doc consumer census — first half only. Classify and measure; move nothing.
 * Output: _catalog/doc_census.json + _catalog/doc_census.md
 */
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
} from 'node:fs';
import { join, relative, posix, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '.claude/skills',
]);

// --- enumerate all markdown files ---
function walkMd(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const abs = join(dir, name);
    let st;
    try {
      st = statSync(abs);
    } catch {
      continue;
    }
    if (st.isDirectory()) walkMd(abs, out);
    else if (name.endsWith('.md')) out.push(abs);
  }
  return out;
}

function normRel(abs) {
  return posix.normalize(relative(ROOT, abs).split('\\').join('/'));
}

function parseFrontmatter(text) {
  if (!text.startsWith('---\n') && !text.startsWith('---\r\n')) {
    return { hasFrontmatter: false, meta: {} };
  }
  const end = text.indexOf('\n---', 4);
  if (end === -1) return { hasFrontmatter: false, meta: {} };
  const block = text.slice(4, end);
  const meta = {};
  for (const line of block.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    meta[key] = val;
    if (key === 'last_updated') meta.lastUpdated = val;
    if (key === 'title' && !meta.title) meta.title = val;
  }
  return { hasFrontmatter: true, meta };
}

// --- git tracked set ---
function loadTracked() {
  const raw = execFileSync('git', ['ls-files', '*.md'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return new Set(
    raw
      .split(/\r?\n/)
      .filter(Boolean)
      .map((p) => posix.normalize(p.replace(/\\/g, '/')))
  );
}

// --- extract md path refs from text ---
function extractMdRefs(text, sourceRel) {
  const refs = new Set();
  // backtick paths
  for (const m of text.matchAll(/`([^`\n]+\.md(?:#[^`\n]*)?)`/g)) {
    refs.add(m[1].split('#')[0]);
  }
  // markdown links [text](path.md)
  for (const m of text.matchAll(/\]\(([^)\s]+\.md(?:#[^)\s]*)?)\)/g)) {
    refs.add(m[1].split('#')[0]);
  }
  // bare path-like tokens with slashes
  for (const m of text.matchAll(
    /(?:^|[\s(>])((?:\.{1,2}\/)?(?:[A-Za-z0-9_.-]+\/)+[A-Za-z0-9_.-]+\.md)/gm
  )) {
    refs.add(m[1]);
  }
  // root-level bare filenames in conventions
  for (const m of text.matchAll(
    /(?:^|[\s`'"(])((?:[A-Z0-9][A-Za-z0-9_.-]*\.md))/g
  )) {
    refs.add(m[1]);
  }
  // @import style
  for (const m of text.matchAll(/@([A-Za-z0-9_./-]+\.md)/g)) {
    refs.add(m[1]);
  }

  const resolved = new Set();
  for (let p of refs) {
    p = p.replace(/\\/g, '/');
    if (p.startsWith('./')) p = p.slice(2);
    if (p.startsWith('../')) {
      const base = sourceRel.includes('/')
        ? sourceRel.slice(0, sourceRel.lastIndexOf('/'))
        : '';
      const parts = base.split('/').filter(Boolean);
      for (const seg of p.split('/')) {
        if (seg === '..') parts.pop();
        else if (seg !== '.') parts.push(seg);
      }
      p = parts.join('/');
    }
    p = posix.normalize(p);
    if (p && !p.startsWith('..')) resolved.add(p);
  }
  return resolved;
}

// --- loader enumeration (read loaders, never infer) ---
function readLoader(rel) {
  const abs = join(ROOT, rel);
  return existsSync(abs) ? readFileSync(abs, 'utf8') : '';
}

/** @type {Map<string, {kind: string, via: string}[]>} */
const executedBy = new Map();

function addExec(target, kind, via) {
  const t = posix.normalize(target.replace(/\\/g, '/'));
  if (!executedBy.has(t)) executedBy.set(t, []);
  executedBy.get(t).push({ kind, via });
}

// HOOK loaders — from reading hook scripts
const HOOK_LOADS = [
  ['.claude/hooks/canon-gate.ps1', [
    '_catalog/repo_intents.md',
    '_catalog/DISPATCH_PREAMBLE.md',
    '90_runbooks/AGENT_CONTRACT.md',
    // plan files resolved dynamically from plan_registry.json
  ]],
  ['.claude/hooks/dirty-tree-close-gate.ps1', ['_STATE.md', 'MEMORY.md']],
  ['.claude/hooks/canon-divergence-run.ps1', ['_STATE.md']],
];

for (const [hook, paths] of HOOK_LOADS) {
  for (const p of paths) addExec(p, 'HOOK', hook);
}

// Plan files read by canon-gate dynamically
try {
  const reg = JSON.parse(readLoader('_catalog/plan_registry.json'));
  for (const plan of reg.plans || []) {
    if (plan.file) addExec(plan.file, 'HOOK', '.claude/hooks/canon-gate.ps1');
  }
} catch {
  /* registry unreadable */
}

// Script-specific CI reads (from reading each script)
const CI_READS = {
  'scripts/enforcement/c-00-vehicle-sync.mjs': ['ENFORCEMENT.md'],
  'scripts/enforcement/regenerate-mdc.mjs': ['ENFORCEMENT.md'],
  'scripts/dispatch.mjs': [
    '_STATE.md',
    '_catalog/DISPATCH_PREAMBLE.md',
    '90_runbooks/AGENT_CONTRACT.md',
    '90_runbooks/DEV_PROCESS.md',
  ],
  'scripts/dispatch-preamble.mjs': ['_STATE.md', '_catalog/DISPATCH_PREAMBLE.md'],
  'scripts/state/generate-combined.mjs': [
    '_state/shared/STANDING_DECISIONS.md',
  ],
  'scripts/state/check-generated.mjs': ['_STATE.md'],
  'scripts/doc-staleness.mjs': ['*ALL_MD*'],
  'scripts/enforcement/cited-untracked.mjs': ['*ALL_TRACKED_MD*'],
  'scripts/enforcement/memory-promotion-gate.mjs': ['_scratch/*.md'],
  'scripts/canon-divergence.mjs': ['_catalog/canon_divergence.md'],
  'scripts/hygiene/backlog-expiry-dryrun.mjs': ['_catalog/repo_cleanup_backlog.md'],
  'scripts/gate-grade.mjs': [
    '_STATE.md',
    '90_operations/OPS-11_invariant_register.md',
    '76j_smartsite_launch_readiness_program.md',
  ],
  'scripts/plan-registry-divergence.test.mjs': [
    'scripts/dispatch.mjs',
    '.claude/hooks/canon-gate.ps1',
  ],
  'scripts/enforcement/row-declaration.test.mjs': [],
};

function addExecFromScript(scriptRel, kind, via) {
  if (CI_READS[scriptRel]) {
    for (const p of CI_READS[scriptRel]) {
      if (!p.startsWith('*')) addExec(p, kind, via);
    }
  }
}

// CI loaders — enforcement-baseline.json + workflow
const baseline = JSON.parse(readLoader('.github/enforcement-baseline.json'));
for (const ctrl of baseline.controls || []) {
  const script = ctrl.script;
  addExecFromScript(script, 'CI', `.github/workflows/enforcement.yml → ${script}`);
}

for (const [script, paths] of Object.entries(CI_READS)) {
  for (const p of paths) {
    if (p.startsWith('*')) continue;
    addExec(p, 'CI', script);
  }
}

// row-declaration reads all plan files
try {
  const reg = JSON.parse(readLoader('_catalog/plan_registry.json'));
  for (const plan of reg.plans || []) {
    if (plan.file)
      addExec(plan.file, 'CI', 'scripts/enforcement/row-declaration.test.mjs');
  }
} catch {
  /* */
}

// COMPILER (generators that read docs to produce other artifacts)
const COMPILER_READS = {
  'scripts/dispatch.mjs': [
    '_STATE.md',
    '_catalog/DISPATCH_PREAMBLE.md',
    '90_runbooks/AGENT_CONTRACT.md',
    '90_runbooks/DEV_PROCESS.md',
  ],
  'scripts/dispatch-preamble.mjs': ['_STATE.md'],
  'scripts/state/generate-combined.mjs': [
    '_state/shared/STANDING_DECISIONS.md',
  ],
  'scripts/enforcement/regenerate-mdc.mjs': ['ENFORCEMENT.md'],
};

for (const [script, paths] of Object.entries(COMPILER_READS)) {
  for (const p of paths) addExec(p, 'COMPILER', script);
}

// seat STATE files for generate-combined
for (const abs of walkMd(join(ROOT, '_state'))) {
  const rel = normRel(abs);
  if (rel.endsWith('STATE.md')) {
    addExec(rel, 'COMPILER', 'scripts/state/generate-combined.mjs');
    addExec(rel, 'CI', 'scripts/state/generate-combined.mjs');
  }
}

// HARNESS — auto-loaded agent context
const HARNESS_FILES = [
  'CLAUDE.md',
  'AGENTS.md',
  'ENFORCEMENT.md',
  '.cursor/rules/enforcement.mdc',
  '.cursor/rules/read-state-first.mdc',
  '.cursor/rules/agent-contract-and-dev-process.mdc',
  '.cursor/rules/fleet-memory.mdc',
  '.cursor/rules/wdll-practice.mdc',
];

for (const h of HARNESS_FILES) addExec(h, 'HARNESS', 'alwaysApply / @import');

// enforcement.mdc body is copy of ENFORCEMENT.md — ENFORCEMENT is source
addExec('ENFORCEMENT.md', 'HARNESS', 'CLAUDE.md @ENFORCEMENT.md');

// ROUTED — read-first lists in harness docs
const ROUTED_SOURCES = [
  'AGENTS.md',
  'CLAUDE.md',
  '.cursor/rules/read-state-first.mdc',
  '.cursor/rules/agent-contract-and-dev-process.mdc',
  '.cursor/rules/fleet-memory.mdc',
  '.cursor/rules/wdll-practice.mdc',
];

function extractRoutedFromHarness(text, source) {
  const routed = new Set();
  for (const m of text.matchAll(/`([^`]+\.md[^`]*)`/g)) {
    let p = m[1].split('#')[0];
    p = posix.normalize(p.replace(/\\/g, '/'));
    if (!p.startsWith('..')) routed.add(p);
  }
  for (const m of text.matchAll(/\*\*`([^`]+\.md)`\*\*/g)) {
    let p = m[1].split('#')[0];
    p = posix.normalize(p.replace(/\\/g, '/'));
    routed.add(p);
  }
  for (const p of routed) {
    if (!HARNESS_FILES.includes(p)) addExec(p, 'ROUTED', source);
  }
}

for (const src of ROUTED_SOURCES) {
  extractRoutedFromHarness(readLoader(src), src);
}

// --- main ---
const allMdAbs = walkMd(ROOT);
const allMdRel = allMdAbs.map(normRel).sort();
const tracked = loadTracked();

// path index for resolution
const pathIndex = new Map();
for (const rel of allMdRel) {
  pathIndex.set(rel, true);
  pathIndex.set(rel.toLowerCase(), rel);
  const base = rel.split('/').pop();
  if (!pathIndex.has(`__basename__:${base}`)) {
    pathIndex.set(`__basename__:${base}`, rel);
  }
}

function resolveRef(ref, fromRel) {
  let p = ref.split('#')[0].replace(/\\/g, '/');
  if (p.startsWith('./')) p = p.slice(2);
  if (p.startsWith('../')) {
    const refs = extractMdRefs(`\`${p}\``, fromRel);
    return [...refs][0] || null;
  }
  if (pathIndex.has(p)) return p;
  if (pathIndex.has(p.toLowerCase())) return pathIndex.get(p.toLowerCase());
  const base = p.split('/').pop();
  if (pathIndex.has(`__basename__:${base}`)) return pathIndex.get(`__basename__:${base}`);
  return null;
}

// citation graph
/** @type {Map<string, Set<string>>} */
const citedBy = new Map();
/** @type {Map<string, Set<string>>} */
const citesOut = new Map();

for (const abs of allMdAbs) {
  const fromRel = normRel(abs);
  let text;
  try {
    text = readFileSync(abs, 'utf8');
  } catch {
    continue;
  }
  const refs = extractMdRefs(text, fromRel);
  citesOut.set(fromRel, refs);
  for (const ref of refs) {
    const resolved = resolveRef(ref, fromRel);
    if (!resolved) continue;
    if (!citedBy.has(resolved)) citedBy.set(resolved, new Set());
    citedBy.get(resolved).add(fromRel);
  }
}

// id collisions
/** @type {Map<string, string[]>} */
const idToPaths = new Map();
for (const abs of allMdAbs) {
  const rel = normRel(abs);
  const { meta } = parseFrontmatter(readFileSync(abs, 'utf8'));
  const id = meta.id || null;
  if (!id) continue;
  if (!idToPaths.has(id)) idToPaths.set(id, []);
  idToPaths.get(id).push(rel);
}

const PRIORITY = ['HOOK', 'CI', 'COMPILER', 'HARNESS', 'ROUTED', 'CITED', 'NONE'];

function classifyConsumer(rel) {
  const execs = executedBy.get(rel) || [];
  const kinds = new Set(execs.map((e) => e.kind));

  // Bulk walkers (doc-staleness, cited-untracked) enumerate the estate; they are not
  // per-document consumers and are excluded from CI assignment here.

  if (kinds.has('HOOK')) return { consumer: 'HOOK', evidence: execs.filter((e) => e.kind === 'HOOK') };
  if (kinds.has('CI')) return { consumer: 'CI', evidence: execs.filter((e) => e.kind === 'CI') };
  if (kinds.has('COMPILER')) return { consumer: 'COMPILER', evidence: execs.filter((e) => e.kind === 'COMPILER') };
  if (kinds.has('HARNESS')) return { consumer: 'HARNESS', evidence: execs.filter((e) => e.kind === 'HARNESS') };
  if (kinds.has('ROUTED')) return { consumer: 'ROUTED', evidence: execs.filter((e) => e.kind === 'ROUTED') };

  const citers = citedBy.get(rel);
  if (citers && citers.size > 0) {
    return { consumer: 'CITED', evidence: [{ kind: 'CITED', via: `${citers.size} citers` }] };
  }
  return { consumer: 'NONE', evidence: [] };
}

const rows = [];
for (const rel of allMdRel) {
  const abs = join(ROOT, rel);
  const text = readFileSync(abs, 'utf8');
  const { hasFrontmatter, meta } = parseFrontmatter(text);
  const outRefs = citesOut.get(rel) || new Set();
  const citesUntracked = [...outRefs].filter((r) => {
    const resolved = resolveRef(r, rel);
    return resolved && !tracked.has(resolved);
  });
  const id = meta.id || null;
  const idCollision =
    id && idToPaths.get(id)?.length > 1
      ? idToPaths.get(id).filter((p) => p !== rel)
      : [];
  const { consumer, evidence } = classifyConsumer(rel);

  rows.push({
    path: rel,
    id,
    title: meta.title || null,
    status: meta.status || null,
    lastUpdated: meta.lastUpdated || meta.last_updated || null,
    hasFrontmatter,
    tracked: tracked.has(rel),
    citedBy: [...(citedBy.get(rel) || [])].sort(),
    citesUntracked: [...new Set(citesUntracked)].sort(),
    idCollision,
    consumer,
    consumerEvidence: evidence,
  });
}

// distribution
const dist = {};
for (const r of rows) dist[r.consumer] = (dist[r.consumer] || 0) + 1;

const duplicateIds = [...idToPaths.entries()]
  .filter(([, paths]) => paths.length > 1)
  .map(([id, paths]) => ({ id, paths: paths.sort() }));

const commit = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: ROOT,
  encoding: 'utf8',
}).trim();

const meta = {
  generatedAt: new Date().toISOString(),
  commit,
  totalFiles: rows.length,
  consumerDistribution: dist,
  duplicateIdCount: duplicateIds.length,
  preRegisteredWrongChecks: [
    'basename-only resolution could merge distinct files with same filename',
    'ROUTED extraction from harness may miss prose-only path mentions without backticks',
  ],
};

writeFileSync(
  join(ROOT, '_catalog/doc_census.json'),
  JSON.stringify({ meta, rows, duplicateIds }, null, 2) + '\n',
  'utf8'
);

// human-readable summary
const mdLines = [
  '# Doc consumer census (R-02 first half)',
  '',
  `Snapshot: \`${commit}\` at ${meta.generatedAt}`,
  '',
  `Total markdown files: **${rows.length}**`,
  '',
  '## Consumer distribution',
  '',
  '| Consumer | Count |',
  '|----------|------:|',
  ...PRIORITY.filter((k) => dist[k]).map((k) => `| ${k} | ${dist[k]} |`),
  '',
  '## Duplicate ids',
  '',
  `Count: **${duplicateIds.length}**`,
  '',
];

for (const { id, paths } of duplicateIds) {
  mdLines.push(`### \`${id}\``);
  for (const p of paths) mdLines.push(`- ${p}`);
  mdLines.push('');
}

mdLines.push('## Reconciliation notes', '');
mdLines.push(
  '- cited-untracked baseline (2026-08-20 @ e1fdc92): 1,108 hits — run `node scripts/enforcement/cited-untracked.mjs` at this commit to compare'
);
mdLines.push(
  '- doc-staleness baseline: 365 files with no frontmatter — run `node scripts/doc-staleness.mjs --json` to compare'
);
mdLines.push(
  `- this census: ${rows.filter((r) => !r.hasFrontmatter).length} files with hasFrontmatter=false`
);
mdLines.push('');

mdLines.push('## Top NONE consumer candidates (manual triage)', '');
const noneRows = rows.filter((r) => r.consumer === 'NONE' && r.tracked);
noneRows.sort((a, b) => b.citedBy.length - a.citedBy.length);
for (const r of noneRows.slice(0, 20)) {
  mdLines.push(`- \`${r.path}\` (tracked, ${r.citedBy.length} citers)`);
}

writeFileSync(join(ROOT, '_catalog/doc_census.md'), mdLines.join('\n') + '\n', 'utf8');

console.log(JSON.stringify({ ...meta, out: '_catalog/doc_census.json' }, null, 2));
