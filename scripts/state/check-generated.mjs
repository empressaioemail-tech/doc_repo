#!/usr/bin/env node
/**
 * STATE GENERATED-DRIFT CHECK. Refuses when `_STATE.md` on disk differs from what
 * generate-combined would emit, so the hand-edited combined file cannot survive a commit.
 *
 * It ALSO runs the state budget, and that is not redundant. The budget refusal lives in
 * generate-combined's main(), which only fires when someone regenerates. A seat that grows its
 * STATE.md and does not regenerate leaves `_STATE.md` matching its own generator output, so the
 * drift comparison passes green while the mandatory first read of every session in the fleet
 * just got fatter. Checking the budget here is what makes the ceiling visible in CI rather than
 * only at the moment a regeneration happens to be attempted.
 *
 *   node scripts/state/check-generated.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCombined } from './generate-combined.mjs';
import { budgetViolations } from './state-budget.mjs';
import { loadSeatRegister } from '../enforcement/seat-register.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// BUDGET FIRST. A seat over its pin is a distinct finding from drift, and reporting drift when
// the real problem is size would send the reader to the wrong fix.
const { violations } = budgetViolations(ROOT, loadSeatRegister().seats.map((s) => s.namespace));
if (violations.length) {
  console.error(JSON.stringify({
    control: 'STATE-generated',
    status: 'over-budget',
    message: 'A seat exceeds its pinned ceiling in _state/state_budget.json. _STATE.md is the mandatory first read of every session, so this is a fleet-wide cost, not a local one.',
    violations: violations.map((v) => ({ kind: v.kind, namespace: v.namespace ?? null, bytes: v.bytes ?? null, pin: v.pin ?? null, over: v.over ?? null, message: v.message })),
  }, null, 2));
  process.exit(1);
}

const ON_DISK = readFileSync(join(ROOT, '_STATE.md'), 'utf8').replace(/\r\n/g, '\n');
const EXPECTED = renderCombined(ROOT);

function stripGeneratedStamp(text) {
  return text.replace(/Last generated: [^\n]+/, 'Last generated: STAMP');
}

if (stripGeneratedStamp(ON_DISK) !== stripGeneratedStamp(EXPECTED)) {
  console.error(JSON.stringify({
    control: 'STATE-generated',
    status: 'drift',
    message: '_STATE.md does not match generate-combined output. Edit _state/<seat>/STATE.md and regenerate.',
  }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ control: 'STATE-generated', status: 'ok' }));
