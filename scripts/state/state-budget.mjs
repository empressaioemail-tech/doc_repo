#!/usr/bin/env node
/**
 * STATE BUDGET — a per-seat ceiling on the bytes a seat contributes to the generated `_STATE.md`.
 *
 * WHY THIS EXISTS. `_STATE.md` is the mandatory first read of every session in every seat, and
 * on 2026-09-18 it was 230,044 bytes, of which `_state/property/STATE.md` was 213,766. The
 * read-state-first rule is load-bearing, so the cost is paid every session; a quarter-megabyte
 * of state is the shape that makes agents skim the rule they were told is mandatory. Nothing
 * measured it. This does.
 *
 * SHAPE: A RATCHET, NOT A FLAT BUDGET (operator chose Variant A, 2026-09-18). Pins live in
 * `_state/state_budget.json`, a tracked file, so lowering one is a visible commit. The check
 * refuses when a seat GROWS past its pin. It deliberately does NOT refuse a tree that is
 * already fat: a flat 32 KB cap would have blocked `_STATE.md` regeneration for every seat in
 * the fleet until one seat trimmed, which turns a diet into a fleet-wide close outage. The
 * ratchet is armed today, fires on the next byte of growth, and produces the number that the
 * owning seat needs in order to trim.
 *
 * WHAT THE CONTROL MEASURES. The normalized content of `_state/<namespace>/STATE.md` as it
 * enters the combined file, not the on-disk file length. `renderCombined` strips CRLF and a BOM,
 * so a checkout with different line endings would otherwise report a different size on the same
 * content, which is a measurement that depends on the environment rather than the thing.
 *
 * THE THREE-QUESTION GATE (ENFORCEMENT.md).
 *   What executes this: this module, called by scripts/state/generate-combined.mjs (writer) and
 *     scripts/state/check-generated.mjs (CI, via .github/workflows/enforcement.yml).
 *   What triggers it: a regeneration, a commit, or a PR.
 *   What fails: generate-combined refuses to write `_STATE.md`; check-generated exits 1 and
 *     ci-baseline reports the row REGRESSED. Both are non-zero exits on a control in CI.
 *   What bypasses it: editing `_STATE.md` by hand (check-generated catches the drift, not this);
 *     deleting `_state/state_budget.json` (refused as fail-closed, not treated as unlimited);
 *     raising a pin in the same commit as the growth (visible in the diff, which is the point of
 *     the pins living in a tracked file rather than in this code).
 *
 *   node scripts/state/state-budget.mjs --report   (measured sizes, for setting pins)
 *   node scripts/state/state-budget.mjs --self-test
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Read a seat file the way renderCombined does, so the measurement matches the read. */
function normalizedContent(root, namespace) {
  const p = join(root, '_state', namespace, 'STATE.md');
  if (!existsSync(p)) return null;
  return readFileSync(p, 'utf8').replace(/\r\n/g, '\n').replace(/^\uFEFF/, '');
}

export function measureSeatBytes(root, namespace) {
  const content = normalizedContent(root, namespace);
  return content === null ? 0 : Buffer.byteLength(content, 'utf8');
}

/** Returns null when the budget file is absent or unreadable. Callers treat null as a
 *  refusal, never as "no ceiling": a budget that cannot be read must not read as unlimited. */
export function loadBudget(root) {
  const p = join(root, '_state', 'state_budget.json');
  if (!existsSync(p)) return null;
  try {
    const parsed = JSON.parse(readFileSync(p, 'utf8'));
    if (!parsed || typeof parsed !== 'object') return null;
    if (!Number.isInteger(parsed.defaultPinBytes) || parsed.defaultPinBytes <= 0) return null;
    if (!parsed.pins || typeof parsed.pins !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * @returns {{ violations: object[], measured: object[] }} `violations` empty means within budget.
 *   A missing budget file, a missing default, or a non-integer pin is a violation rather than a
 *   skip. An unpinned seat falls back to `defaultPinBytes`, which is declared explicitly in the
 *   tracked file with a reason, so there is no silent ceiling anywhere in this control.
 */
export function budgetViolations(root, namespaces) {
  const measured = [];
  const violations = [];
  const budget = loadBudget(root);

  if (!budget) {
    return {
      measured,
      violations: [{
        kind: 'budget-unreadable',
        message: `${join(root, '_state', 'state_budget.json')} is missing or does not declare a positive integer defaultPinBytes and a pins object. Refusing rather than treating the absence of a ceiling as an unlimited ceiling.`,
      }],
    };
  }

  for (const namespace of namespaces) {
    const bytes = measureSeatBytes(root, namespace);
    const pinEntry = budget.pins[namespace];
    const pin = pinEntry === undefined ? budget.defaultPinBytes : pinEntry.bytes;
    const pinned = pinEntry !== undefined;
    measured.push({ namespace, bytes, pin, pinned });

    if (!Number.isInteger(pin) || pin < 0) {
      violations.push({
        kind: 'pin-not-an-integer',
        namespace,
        message: `pin for seat '${namespace}' is not a non-negative integer. A pin that is not a number cannot refuse anything.`,
      });
      continue;
    }
    if (bytes > pin) {
      violations.push({
        kind: 'seat-over-budget',
        namespace,
        bytes,
        pin,
        over: bytes - pin,
        message: `seat '${namespace}' is ${bytes} bytes against a pin of ${pin} (over by ${bytes - pin})${pinned ? '' : ', using defaultPinBytes'}. Trim _state/${namespace}/STATE.md, or lower another seat's pin in the same commit. The pin is the ceiling, not a target.`,
      });
    }
  }

  const known = new Set(namespaces);
  for (const key of Object.keys(budget.pins)) {
    if (!known.has(key)) {
      violations.push({
        kind: 'pin-for-unknown-seat',
        namespace: key,
        message: `pin declared for '${key}', which is not in the seat register. A pin on a seat that does not exist measures nothing and hides a renamed seat.`,
      });
    }
  }

  return { measured, violations };
}

function selfTest() {
  const out = [];
  const t = (name, cond) => out.push({ name, ok: Boolean(cond) });
  const fixtures = [];

  function fixture(budget, files) {
    const root = mkdtempSync(join(tmpdir(), 'state-budget-'));
    fixtures.push(root);
    mkdirSync(join(root, '_state'), { recursive: true });
    if (budget !== null) {
      writeFileSync(join(root, '_state', 'state_budget.json'), JSON.stringify(budget, null, 2), 'utf8');
    }
    for (const [ns, content] of Object.entries(files)) {
      mkdirSync(join(root, '_state', ns), { recursive: true });
      writeFileSync(join(root, '_state', ns, 'STATE.md'), content, 'utf8');
    }
    return root;
  }

  const b = (pins, def = 4096) => ({ defaultPinBytes: def, pins });

  // PASS DIRECTION.
  const within = fixture(b({ alpha: { bytes: 100 } }), { alpha: 'x'.repeat(100) });
  t('1 a seat exactly at its pin passes', budgetViolations(within, ['alpha']).violations.length === 0);
  const under = fixture(b({ alpha: { bytes: 100 } }), { alpha: 'x'.repeat(99) });
  t('2 a seat under its pin passes', budgetViolations(under, ['alpha']).violations.length === 0);
  const absent = fixture(b({ alpha: { bytes: 0 } }), {});
  t('3 a seat with no file measures 0 and passes', budgetViolations(absent, ['alpha']).violations.length === 0);
  const unpinned = fixture(b({}), { fresh: 'x'.repeat(10) });
  t('4 an unpinned seat falls back to defaultPinBytes and passes under it', budgetViolations(unpinned, ['fresh']).violations.length === 0);

  // FAIL DIRECTION. Each of these is a case the control must be able to refuse.
  const over = fixture(b({ alpha: { bytes: 100 } }), { alpha: 'x'.repeat(101) });
  const overV = budgetViolations(over, ['alpha']);
  t('5 VIOLATION one byte over the pin is refused', overV.violations.length === 1 && overV.violations[0].kind === 'seat-over-budget');
  t('6 VIOLATION the refusal NAMES the seat and both numbers', overV.violations[0].namespace === 'alpha' && overV.violations[0].bytes === 101 && overV.violations[0].pin === 100 && overV.violations[0].over === 1);
  const unpinnedOver = fixture(b({}, 50), { fresh: 'x'.repeat(51) });
  t('7 VIOLATION an unpinned seat over the default is refused', budgetViolations(unpinnedOver, ['fresh']).violations[0]?.kind === 'seat-over-budget');
  const noBudget = fixture(null, { alpha: 'x'.repeat(10) });
  t('8 VIOLATION a missing budget file is refused, not read as unlimited', budgetViolations(noBudget, ['alpha']).violations[0]?.kind === 'budget-unreadable');
  const noDefault = fixture({ pins: { alpha: { bytes: 10 } } }, { alpha: 'x' });
  t('9 VIOLATION a budget with no defaultPinBytes is refused', budgetViolations(noDefault, ['alpha']).violations[0]?.kind === 'budget-unreadable');
  const badPin = fixture(b({ alpha: { bytes: 'lots' } }), { alpha: 'x' });
  t('10 VIOLATION a non-integer pin is refused', budgetViolations(badPin, ['alpha']).violations[0]?.kind === 'pin-not-an-integer');
  const ghost = fixture(b({ alpha: { bytes: 100 }, ghostseat: { bytes: 100 } }), { alpha: 'x' });
  t('11 VIOLATION a pin for a seat not in the register is refused', budgetViolations(ghost, ['alpha']).violations.some((v) => v.kind === 'pin-for-unknown-seat'));

  // NON-VACUITY: the measurement must depend on content, not just on the file existing.
  t('12 the measurement is not vacuous: 101 bytes does not measure as 100', measureSeatBytes(over, 'alpha') === 101 && measureSeatBytes(within, 'alpha') === 100);
  t('13 CRLF is normalized so the same content measures the same on any checkout',
    (() => { const r = fixture(b({ alpha: { bytes: 100 } }), { alpha: 'x'.repeat(99) + '\r\n' }); return measureSeatBytes(r, 'alpha') === 100; })());

  for (const f of fixtures) {
    try { rmSync(f, { recursive: true, force: true }); } catch { /* temp dir */ }
  }

  console.log('\nstate-budget self-test\n');
  for (const r of out) console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name}`);
  const failed = out.filter((r) => !r.ok).length;
  console.log(`\n${out.length} checks, ${failed} failed`);
  return failed;
}

const isMain = process.argv[1] && /state-budget\.mjs$/i.test(process.argv[1].replace(/\\/g, '/'));
if (isMain) {
  if (process.argv.includes('--self-test')) process.exit(selfTest() === 0 ? 0 : 1);

  const namespaces = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  if (namespaces.length === 0) {
    console.error('usage: node scripts/state/state-budget.mjs --report <namespace> [namespace...]');
    console.error('       node scripts/state/state-budget.mjs --self-test');
    process.exit(2);
  }
  const budget = loadBudget(ROOT);
  console.log(`\nstate budget — ${budget ? 'armed' : 'UNREADABLE (fail closed)'}\n`);
  const { measured, violations } = budgetViolations(ROOT, namespaces);
  for (const m of measured) {
    const src = m.pinned ? 'pin' : 'default';
    const mark = m.bytes > m.pin ? 'OVER' : 'ok  ';
    console.log(`  ${mark}  ${m.namespace.padEnd(16)} ${String(m.bytes).padStart(8)} bytes  (${src} ${m.pin})`);
  }
  for (const v of violations) console.log(`\n  ${v.kind}: ${v.message}`);
  console.log(`\nRESULT: ${violations.length === 0 ? 'within budget' : `REFUSED (${violations.length})`}`);
  process.exit(violations.length === 0 ? 0 : 1);
}
