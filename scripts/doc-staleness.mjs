#!/usr/bin/env node
/**
 * doc-staleness.mjs -- PLAN-ROW G-02 (OPS-17 govtech stack plan of record)
 *
 * Two independent gates over doc_repo frontmatter:
 *
 *   VOCAB     every `status:` value must be one of the four legal values in
 *             01_doc_conventions.md:93 (active | draft | superseded | historical).
 *   STALENESS every `status: active` doc whose `last_updated` is older than the
 *             threshold in 01_doc_conventions.md:114-115 (~60 days, rolling).
 *
 * Exits non-zero if either gate fails. `--lane-set` limits the FAILING staleness
 * set to docs the OPS-17 lanes touch (vocab still fails globally: an illegal
 * status anywhere is a defect anywhere).
 *
 * Every ratio this script prints travels with its counting rule.
 *
 * Usage:
 *   node scripts/doc-staleness.mjs                 # all docs, report + gate
 *   node scripts/doc-staleness.mjs --lane-set      # gate only on OPS-17 lane docs
 *   node scripts/doc-staleness.mjs --json          # machine-readable
 *   node scripts/doc-staleness.mjs --root <dir>    # operate on a scratch copy (negative tests)
 *   node scripts/doc-staleness.mjs --today <date>  # pin "now" (deterministic tests)
 *   node scripts/doc-staleness.mjs --threshold <n> # override day threshold
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const LEGAL_STATUSES = ['active', 'draft', 'superseded', 'historical'];
const DEFAULT_THRESHOLD_DAYS = 60; // 01_doc_conventions.md:114-115

// ---------------------------------------------------------------- args

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const val = (name, fallback) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
};

const ROOT = val('--root', process.cwd());
const LANE_SET_ONLY = flag('--lane-set');
const AS_JSON = flag('--json');
const THRESHOLD_DAYS = Number(val('--threshold', DEFAULT_THRESHOLD_DAYS));
const TODAY = val('--today', new Date().toISOString().slice(0, 10));

// ---------------------------------------------------------------- exclusions
//
// PLAN-ROW G-09 (backlog item 14). This used to be ONE `SKIP_DIRS` set shared by
// both gates, which is why `_decisions`, `_catalog`, and `_research` were unwatched
// by the vocab gate as a side effect of a staleness-shaped decision. The two gates
// want different exclusion sets and now have them:
//
//   WALK_SKIP     never read at all. Not doc space in any sense.
//   STALENESS_SKIP read and vocab-checked, but exempt from the age gate, because
//                 these are append-only dated records whose age is the point.
//
// Both sets carry a per-directory REASON, and both are printed where the output is
// read (human and --json), per DEV_PROCESS 2.1: an instrument's exclusion set is
// part of its contract and must be stated where its output is read.

const WALK_SKIP = new Map([
  ['.git', 'version control internals, not doc space'],
  ['node_modules', 'vendored dependencies, not doc space'],
  ['.claude', 'agent harness config, not doc space'],
  ['.cursor', 'agent harness config, not doc space'],
  ['scripts', 'tool source, not doc space'],
]);

const STALENESS_SKIP = new Map([
  ['_inbox', 'working queue of dated artifacts; not canon, age is not a defect'],
  ['_sessions', 'append-only session records; age is the point'],
  ['_decisions', 'append-only decision records; age is the point'],
  ['_research', 'append-only dated research notes; age is the point'],
  ['_dispatches', 'append-only dated lane dispatches; age is the point'],
  ['_prospects', 'per-prospect working material on its own cadence, not canon'],
]);

// `_catalog` is deliberately in NEITHER set: it is the live control plane
// (repo_map, plan_registry, backlog, atoms_index), so a stale control-plane doc is
// exactly the defect this instrument exists to catch.

// A directory carrying its own `.git` is a nested clone of a DIFFERENT repo. Its
// markdown belongs to that repo's doc conventions, not this one, and it is invisible
// to the parent git entirely (`git ls-files` returns zero rows for it). Counting it
// would put another repo's files in this repo's denominator. Detected structurally,
// never by hardcoded name, so a new stray clone is excluded the day it appears and
// is REPORTED rather than silently dropped (an empty result is not an absence).
const foreignClones = [];
const isForeignClone = (fullPath) => existsSync(join(fullPath, '.git'));

const excludedFromStaleness = (rel) => {
  const top = rel.split('/')[0];
  return STALENESS_SKIP.has(top) ? STALENESS_SKIP.get(top) : null;
};

// ---------------------------------------------------------------- lane set
//
// Docs the four OPS-17 lanes touch. Sourced from the OPS-17 lane table, the
// SHARED LEGS table, and the doc-33a lineage ruling. Prefix match on repo-
// relative path, so `_smartcity_masters/` pulls the whole reference set.

const LANE_SET_PREFIXES = [
  '_smartcity_masters/',            // reference set -- authority for all four lanes
  '90_operations/OPS-17',
  '90_operations/OPS-16',
  '90_runbooks/AGENT_CONTRACT.md',
  '01_doc_conventions.md',
  '01a_atom_conventions.md',
  '00_current_state.md',
  '30_smartcity_os.md',                                // lane B + named superseded by 33a
  '31_smartcity_dashboards.md',
  '32_smartcity_asset_management.md',
  '33_smartcity_codex_1b_integration.md',              // named superseded by 33a
  '40i_cortex_dallas_e2e_grok_plan_review_sprint.md',  // named superseded by 33a
  '47_codex_plan_review.md',                           // named superseded by 33a
  '48_cortex_reporting_plan_review_spec.md',           // lane C spine spec
  '75n_icc_code_connect_catalog.md',                   // lane D
  '11a_bastrop_live_roadmap.md',                       // named in the G-01 brief
  '07a_smartcity_product_positioning.md',              // masters README reconciliation debt
  '_sales/03_smartcity_os.md',                         // masters README reconciliation debt
  '65_sensors/',                                       // S-2 telemetry plane
  '80_adrs/adr_008',                                   // S-2 target topology
  '80_adrs/adr_023',                                   // ADR-023 consumer contract
  '56',                                                // S-2 target topology (56_*)
  '08_tiered_access_model.md',                         // L5 access model
  '14_pricing_framework.md',                           // L5 pricing
];

const inLaneSet = (rel) => LANE_SET_PREFIXES.some((p) => rel === p || rel.startsWith(p));

// ---------------------------------------------------------------- frontmatter
//
// Deliberately NOT a YAML parser. The measured reality (planner sweep 2026-08-14)
// is 16 distinct `status:` strings against 4 legal ones, several carrying prose,
// parentheses, quotes, and commas. A strict YAML parse either throws on those or
// silently coerces them. We want them captured VERBATIM and reported as illegal,
// so we read the raw line.

function parseFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') {
    return { present: false, fields: {} };
  }
  const fields = {};
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '---') return { present: true, fields, endLine: i + 1 };
    const m = /^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/.exec(line);
    if (m && fields[m[1]] === undefined) {
      fields[m[1]] = { raw: m[2].trim(), line: i + 1 };
    }
  }
  return { present: true, fields, unterminated: true };
}

// A status is legal only if the ENTIRE value is one of the four words. Prose
// after a legal word is illegal by design: the field is an enum, and a parser
// that accepts a prefix is exactly how 16 values grew out of 4 without anything
// ever failing.
function classifyStatus(raw) {
  if (raw === undefined) return { legal: false, reason: 'missing status field' };
  const bare = raw.replace(/^["']|["']$/g, '').trim();
  if (LEGAL_STATUSES.includes(bare)) return { legal: true, value: bare };
  const leading = bare.split(/[\s,(]/)[0].toLowerCase();
  const reason = LEGAL_STATUSES.includes(leading)
    ? `prose in status field (leading token "${leading}" is legal, remainder is not)`
    : 'illegal status value';
  return { legal: false, reason, value: bare };
}

function parseDate(raw) {
  if (raw === undefined) return { ok: false, reason: 'missing last_updated' };
  const bare = raw.replace(/^["']|["']$/g, '').trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(bare);
  if (!m) return { ok: false, reason: `last_updated not ISO YYYY-MM-DD (${JSON.stringify(bare)})`, value: bare };
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return { ok: false, reason: `unparseable date (${JSON.stringify(bare)})`, value: bare };
  return { ok: true, date: d, value: `${m[1]}-${m[2]}-${m[3]}` };
}

const daysBetween = (a, b) => Math.floor((a - b) / 86400000);

// ---------------------------------------------------------------- walk

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (WALK_SKIP.has(entry.name)) continue;
      if (isForeignClone(full)) {
        const relDir = relative(ROOT, full).split(sep).join('/');
        let mdCount = 0;
        const tally = (d) => {
          for (const e of readdirSync(d, { withFileTypes: true })) {
            if (e.name.startsWith('.')) continue;
            const f = join(d, e.name);
            if (e.isDirectory()) tally(f);
            else if (e.isFile() && e.name.endsWith('.md')) mdCount++;
          }
        };
        tally(full);
        foreignClones.push({ dir: relDir, mdFilesExcluded: mdCount });
        continue;
      }
      walk(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

// ---------------------------------------------------------------- run

const todayDate = new Date(`${TODAY}T00:00:00Z`);
if (Number.isNaN(todayDate.getTime())) {
  console.error(`FATAL: --today ${JSON.stringify(TODAY)} is not YYYY-MM-DD`);
  process.exit(2);
}
if (!Number.isFinite(THRESHOLD_DAYS) || THRESHOLD_DAYS < 0) {
  console.error(`FATAL: --threshold ${JSON.stringify(String(THRESHOLD_DAYS))} is not a non-negative number`);
  process.exit(2);
}

let files;
try {
  files = walk(ROOT).sort();
} catch (err) {
  console.error(`FATAL: cannot walk root ${JSON.stringify(ROOT)}: ${err.message}`);
  process.exit(2);
}

const vocabViolations = [];
const staleActive = [];
const noFrontmatter = [];
const badDates = [];
let activeCount = 0;              // legal status:active, staleness-eligible
let activeExemptCount = 0;        // legal status:active, inside STALENESS_SKIP
let scannedExemptCount = 0;       // any .md inside STALENESS_SKIP (measured, not subtracted)

for (const full of files) {
  const rel = relative(ROOT, full).split(sep).join('/');
  const stalenessExemptReason = excludedFromStaleness(rel);
  const stalenessExempt = stalenessExemptReason !== null;
  if (stalenessExempt) scannedExemptCount++;
  const text = readFileSync(full, 'utf8');
  const fm = parseFrontmatter(text);

  if (!fm.present) {
    noFrontmatter.push({ path: rel, laneSet: inLaneSet(rel), stalenessExempt });
    continue;
  }

  const st = classifyStatus(fm.fields.status?.raw);
  if (!st.legal) {
    vocabViolations.push({
      path: rel,
      line: fm.fields.status?.line ?? null,
      value: st.value ?? null,
      reason: st.reason,
      laneSet: inLaneSet(rel),
      stalenessExempt,
    });
  }

  if (st.legal && st.value === 'active') {
    if (stalenessExempt) {
      activeExemptCount++;
    } else {
      activeCount++;
      const du = parseDate(fm.fields.last_updated?.raw);
      if (!du.ok) {
        badDates.push({ path: rel, reason: du.reason, laneSet: inLaneSet(rel) });
      } else {
        const age = daysBetween(todayDate, du.date);
        if (age > THRESHOLD_DAYS) {
          staleActive.push({ path: rel, lastUpdated: du.value, ageDays: age, laneSet: inLaneSet(rel) });
        }
      }
    }
  }
}

staleActive.sort((a, b) => b.ageDays - a.ageDays);

// Gating sets. Vocab gates GLOBALLY -- an illegal status is a defect wherever it
// sits. Staleness gates on the lane set when --lane-set is passed.
const gatingStale = LANE_SET_ONLY ? staleActive.filter((d) => d.laneSet) : staleActive;
const gatingBadDates = LANE_SET_ONLY ? badDates.filter((d) => d.laneSet) : badDates;

// ------------------------------------------------- counting rules + exclusions
//
// DEV_PROCESS 1.1 (a figure travels with its denominator), 1.2 (the counting rule
// is inline at the point of use), 2.1 (the exclusion set is stated where the output
// is read). Every number this script prints below carries one of these strings.

const walkSkipList = [...WALK_SKIP.keys()].join(', ');
const exclusions_foreignMd = foreignClones.reduce((n, c) => n + c.mdFilesExcluded, 0);
const stalenessSkipList = [...STALENESS_SKIP.keys()].join(', ');

const foreignCloneNote = foreignClones.length
  ? ` and the ${foreignClones.length} nested foreign clone(s) [${foreignClones.map((c) => c.dir).join(', ')}] holding ${exclusions_foreignMd} .md files`
  : ' and zero nested foreign clones (none found)';
const VOCAB_DENOMINATOR = `every *.md under ${ROOT}, recursively, excluding [${walkSkipList}]${foreignCloneNote}`;
const vocabRule = `denominator = ${VOCAB_DENOMINATOR} (${files.length} files scanned); a status is a violation unless the ENTIRE value is one of {${LEGAL_STATUSES.join(' | ')}}; a missing status field counts as a violation`;

const STALENESS_DENOMINATOR = `every *.md under ${ROOT} excluding [${walkSkipList}]${foreignCloneNote}, AND excluding the append-only/non-canon trees [${stalenessSkipList}]`;
const baseStalenessRule = `denominator = ${STALENESS_DENOMINATOR}, restricted to docs whose status is exactly "active" (${activeCount} docs); stale = last_updated older than ${THRESHOLD_DAYS} days from ${TODAY}`;
const stalenessRule = LANE_SET_ONLY
  ? `${baseStalenessRule}; failing set further limited to paths matching the OPS-17 lane-set prefixes`
  : baseStalenessRule;

// Kept under the old name so nothing downstream that reads `countingRule` breaks.
const countingRule = stalenessRule;

const exclusions = {
  walkSkip: [...WALK_SKIP.entries()].map(([dir, reason]) => ({ dir, reason, appliesTo: 'both gates (never read)' })),
  stalenessSkip: [...STALENESS_SKIP.entries()].map(([dir, reason]) => ({ dir, reason, appliesTo: 'staleness gate only (still vocab-checked)' })),
  notExcluded: [{ dir: '_catalog', reason: 'live control plane; a stale control-plane doc is the defect this instrument exists to catch', appliesTo: 'watched by both gates' }],
  foreignClones: foreignClones.map((c) => ({
    ...c,
    reason: 'nested clone of a different repo (carries its own .git); its docs answer to that repo, and the parent git tracks zero of its files',
    appliesTo: 'both gates (never read)',
  })),
  foreignCloneMdFilesExcluded: exclusions_foreignMd,
};

const failed = vocabViolations.length > 0 || gatingStale.length > 0 || gatingBadDates.length > 0;

if (AS_JSON) {
  console.log(JSON.stringify({
    planRow: 'G-02', root: ROOT, today: TODAY, thresholdDays: THRESHOLD_DAYS,
    laneSetMode: LANE_SET_ONLY, legalStatuses: LEGAL_STATUSES,
    exclusions,
    scanned: files.length,
    scannedStalenessExempt: scannedExemptCount,
    activeCount, activeExemptCount,
    vocabRule, stalenessRule, countingRule,
    vocabViolations, staleActive, gatingStale, badDates, noFrontmatter,
    exitCode: failed ? 1 : 0,
  }, null, 2));
} else {
  console.log('doc-staleness -- PLAN-ROW G-02');
  console.log(`root=${ROOT}  today=${TODAY}  threshold=${THRESHOLD_DAYS}d  laneSet=${LANE_SET_ONLY}`);
  console.log('');
  console.log('EXCLUSION SET (the contract of this instrument; DEV_PROCESS 2.1)');
  console.log('  never read, excluded from BOTH gates:');
  for (const e of exclusions.walkSkip) console.log(`    ${e.dir}/  -- ${e.reason}`);
  console.log('  read and VOCAB-CHECKED, but exempt from the staleness gate:');
  for (const e of exclusions.stalenessSkip) console.log(`    ${e.dir}/  -- ${e.reason}`);
  console.log('  deliberately NOT excluded:');
  for (const e of exclusions.notExcluded) console.log(`    ${e.dir}/  -- ${e.reason}`);
  if (exclusions.foreignClones.length) {
    console.log(`  nested foreign clones excluded from BOTH gates (${exclusions.foreignCloneMdFilesExcluded} .md files, measured by walking each clone):`);
    for (const e of exclusions.foreignClones) console.log(`    ${e.dir}/  -- ${e.mdFilesExcluded} .md  -- ${e.reason}`);
  } else {
    console.log('  nested foreign clones: none found (positive determination: no non-skipped directory carries its own .git)');
  }
  console.log('');
  console.log(`scanned ${files.length} markdown files, of which ${scannedExemptCount} sit in a staleness-exempt tree`);
  console.log(`status: active docs -- ${activeCount} staleness-eligible, ${activeExemptCount} staleness-exempt`);
  console.log(`vocab counting rule    : ${vocabRule}`);
  console.log(`staleness counting rule: ${stalenessRule}`);
  console.log('');

  if (vocabViolations.length) {
    const exemptTreeViolations = vocabViolations.filter((v) => v.stalenessExempt).length;
    const canonViolations = vocabViolations.filter((v) => !v.stalenessExempt).length;
    console.log(`FAIL vocab -- ${vocabViolations.length} doc(s) carry a status outside {${LEGAL_STATUSES.join(' | ')}}`);
    console.log(`  counting rule: ${vocabRule}`);
    console.log(`  split (measured, not derived): ${canonViolations} in canonical doc space, ${exemptTreeViolations} in staleness-exempt trees [${stalenessSkipList}] which are vocab-gated but age-exempt`);
    for (const v of vocabViolations) {
      console.log(`  ${v.path}:${v.line}${v.laneSet ? ' [lane]' : ''}${v.stalenessExempt ? ' [age-exempt tree]' : ''}`);
      console.log(`      value : ${JSON.stringify(v.value)}`);
      console.log(`      reason: ${v.reason}`);
    }
    console.log('');
  } else {
    console.log(`PASS vocab -- every status value is one of {${LEGAL_STATUSES.join(' | ')}}`);
    console.log(`  counting rule: ${vocabRule}`);
    console.log('');
  }

  const staleLabel = LANE_SET_ONLY ? 'stale-active (lane set)' : 'stale-active';
  if (gatingStale.length) {
    console.log(`FAIL ${staleLabel} -- ${gatingStale.length} doc(s) active and older than ${THRESHOLD_DAYS}d`);
    console.log(`  counting rule: ${stalenessRule}`);
    for (const d of gatingStale) {
      console.log(`  ${d.path}  last_updated=${d.lastUpdated}  age=${d.ageDays}d${d.laneSet ? ' [lane]' : ''}`);
    }
    console.log('');
  } else {
    console.log(`PASS ${staleLabel} -- zero active docs past the ${THRESHOLD_DAYS}d threshold`);
    console.log(`  counting rule: ${stalenessRule}`);
    console.log('');
  }

  if (LANE_SET_ONLY && staleActive.length > gatingStale.length) {
    console.log(`note: ${staleActive.length - gatingStale.length} stale-active doc(s) outside the lane set are REPORTED but not gating.`);
    console.log('');
  }

  if (gatingBadDates.length) {
    console.log(`FAIL last_updated -- ${gatingBadDates.length} active doc(s) with an unusable date`);
    for (const d of gatingBadDates) console.log(`  ${d.path}  ${d.reason}${d.laneSet ? ' [lane]' : ''}`);
    console.log('');
  }

  if (noFrontmatter.length) {
    console.log(`note: ${noFrontmatter.length} markdown file(s) carry no frontmatter block (not gated; reported for G-01).`);
    for (const d of noFrontmatter.slice(0, 15)) console.log(`  ${d.path}${d.laneSet ? ' [lane]' : ''}`);
    if (noFrontmatter.length > 15) console.log(`  ... and ${noFrontmatter.length - 15} more`);
    console.log('');
  }

  console.log(failed ? 'RESULT: FAIL (exit 1)' : 'RESULT: PASS (exit 0)');
}

process.exit(failed ? 1 : 0);
