#!/usr/bin/env node
/**
 * Dispatch compiler — emits a complete hand-carry lane dispatch.
 *
 *   node scripts/dispatch.mjs --lane L17 --plan-row P-22,P-23 [--title "Zoning depth wave 1"]
 *                             [--mission-file path/to/mission.md] [--repo hauska-engine]
 *                             [--plan OPS-16|OPS-17]   (default OPS-16)
 *
 * Assembles: CANON-PREAMBLE (regenerated from _STATE.md) + AGENT-CONTRACT (hash maintained here)
 * + PLAN-ROW line (validated against OPS-16 baseline/amendments) + mission section + auto-named
 * CP1/CP2/close artifact paths. Writes _dispatches/<date>_<lane>_dispatch.md and prints to stdout.
 * The canon-gate hook requires both hash markers, so hand-assembled dispatches are blocked.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const getArg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : null;
};

const lane = getArg('lane');
const planRowArg = getArg('plan-row');
if (!lane || !planRowArg) {
  console.error('Usage: node scripts/dispatch.mjs --lane <ID> --plan-row <P-xx[,P-yy]> [--title t] [--mission-file f] [--repo r]');
  process.exit(1);
}
const title = getArg('title') || `${lane} dispatch`;
const repo = getArg('repo');
const missionFile = getArg('mission-file');
const planRows = planRowArg.split(',').map((s) => s.trim()).filter(Boolean);

// --- 1. Validate PLAN-ROWs against the selected plan of record. Fail closed. ---
// Two programs run concurrently with disjoint row-ID prefixes (OPS-16 = P-xx, OPS-17 = G-xx).
const PLANS = {
  'OPS-16': { file: 'OPS-16_texas_market_plan_of_record.md', rowPrefix: 'P' },
  'OPS-17': { file: 'OPS-17_govtech_stack_plan_of_record.md', rowPrefix: 'G' },
};
const planId = (getArg('plan') || 'OPS-16').toUpperCase();
const plan = PLANS[planId];
if (!plan) {
  console.error(`Unknown --plan ${planId}. Known plans: ${Object.keys(PLANS).join(', ')}`);
  process.exit(1);
}
const planPath = join(root, '90_operations', plan.file);
const planDoc = readFileSync(planPath, 'utf8');
for (const row of planRows) {
  // A row from the wrong program must fail here, not silently miss in the table scan below.
  if (!new RegExp(`^${plan.rowPrefix}-\\d+$`).test(row)) {
    console.error(`PLAN-ROW ${row} does not match the ${planId} row format (${plan.rowPrefix}-xx).`);
    console.error(`Pass --plan for the program that owns this row.`);
    process.exit(1);
  }
  const inBaseline = new RegExp(`^\\| ${row} \\|`, 'm').test(planDoc);
  const inAmendment = new RegExp(`^\\| A-\\d+[^\\n]*\\b${row}\\b`, 'm').test(planDoc);
  if (!inBaseline && !inAmendment) {
    console.error(`PLAN-ROW ${row} not found in ${planId} baseline or amendments. No row, no dispatch.`);
    console.error('Add an amendment row first (operator-ruled), then compile.');
    process.exit(1);
  }
}

// --- 2. Regenerate CANON-PREAMBLE from _STATE.md (same extraction as dispatch-preamble.mjs). ---
const state = readFileSync(join(root, '_STATE.md'), 'utf8');
const sd = state.match(/^## STANDING DECISIONS[^\n]*\n([\s\S]*?)(?=^## |\Z)/m);
if (!sd) {
  console.error('STANDING DECISIONS section not found in _STATE.md');
  process.exit(1);
}
const sdBody = sd[1].trimEnd();
const preambleHash = createHash('sha256').update(sdBody, 'utf8').digest('hex').slice(0, 8);
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(root, '_catalog', 'DISPATCH_PREAMBLE.md'),
  `<!-- CANON-PREAMBLE v${preambleHash} generated ${today} from _STATE.md -->\n\n## STANDING DECISIONS (paste into every executor dispatch)\n\nCANON-PREAMBLE v${preambleHash}\n\n${sdBody}\n`,
  'utf8'
);

// --- 3. Hash the AGENT_CONTRACT body; maintain its marker line in place. ---
const contractPath = join(root, '90_runbooks', 'AGENT_CONTRACT.md');
let contract = readFileSync(contractPath, 'utf8');
const markerRe = /^<!-- AGENT-CONTRACT v[a-f0-9]{8} [^\n]*-->\n/;
const contractBody = contract.replace(markerRe, '');
const contractHash = createHash('sha256').update(contractBody, 'utf8').digest('hex').slice(0, 8);
const marker = `<!-- AGENT-CONTRACT v${contractHash} — hash maintained by scripts/dispatch.mjs; do not edit this line by hand -->\n`;
if (!contract.startsWith(marker)) {
  contract = marker + contractBody;
  writeFileSync(contractPath, contract, 'utf8');
}

// --- 4. Mission section. ---
const mission = missionFile
  ? readFileSync(missionFile, 'utf8').trim()
  : '<<< MISSION — replace this line with the hand-written mission section before dispatching >>>';

// --- 5. Compose. ---
const laneLower = lane.toLowerCase();
const cp1 = `_inbox/${today}_${laneLower}_cp1.json`;
const cp2 = `_inbox/${today}_${laneLower}_cp2.json`;
const close = `_inbox/${today}_${laneLower}_close.json`;

const dispatch = `CANON-PREAMBLE v${preambleHash}
${sdBody}

AGENT-CONTRACT v${contractHash} — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

PLAN-ROW: ${planRows.join(', ')} (90_operations/${plan.file})
${repo ? `repo: ${repo}\n` : ''}
# ${title}

${mission}

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: ${cp1}
  CP2: ${cp2}
  CLOSE: ${close}
`;

mkdirSync(join(root, '_dispatches'), { recursive: true });
const outPath = join(root, '_dispatches', `${today}_${laneLower}_dispatch.md`);
writeFileSync(outPath, dispatch, 'utf8');
console.log(dispatch);
console.error(`\n[dispatch.mjs] wrote ${outPath} (CANON-PREAMBLE v${preambleHash}, AGENT-CONTRACT v${contractHash})`);
