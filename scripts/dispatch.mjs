#!/usr/bin/env node
/**
 * Dispatch compiler — emits a complete hand-carry lane dispatch.
 *
 *   node scripts/dispatch.mjs --lane L17 --plan-row P-22,P-23 [--title "Zoning depth wave 1"]
 *                             [--mission-file path/to/mission.md] [--repo hauska-engine]
 *                             [--plan OPS-16|OPS-17]   (default OPS-16)
 *
 * Assembles: CANON-PREAMBLE (regenerated from _STATE.md) + AGENT-CONTRACT (hash maintained here)
 * + DEV-PROCESS + FLEET-MEMORY (verbatim M0 block from fleet_memory_practice.md) + PLAN-ROW
 * (validated against the named plan baseline/amendments) + mission section + auto-named
 * CP1/CP2/close artifact paths. Writes _dispatches/<date>_<lane>_dispatch.md and prints to stdout.
 * The canon-gate hook requires the hash markers (including FLEET-MEMORY), so a stripped M0
 * block is refused the same way a missing AGENT-CONTRACT marker is.
 */
import { createHash } from 'node:crypto';
import { extractStandingDecisions } from './lib/standing-decisions.mjs';
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
// Programs run concurrently with disjoint row-ID prefixes (OPS-16 = P-xx, OPS-17 = G-xx).
//
// CTRL-1 fix (G0 audit 2026-08-14): this table used to be hardcoded HERE and again,
// differently, in .claude/hooks/canon-gate.ps1. They drifted the moment OPS-17 was added
// and the gate silently stopped validating every G- row. Both now read the shared
// registry, and scripts/plan-registry-divergence.test.mjs fails if they disagree.
// Add a plan by editing _catalog/plan_registry.json ONLY.
const registry = JSON.parse(readFileSync(join(root, '_catalog/plan_registry.json'), 'utf8'));
const PLANS = Object.fromEntries(
  Object.entries(registry.plans).map(([id, p]) => [
    id,
    { file: p.file.replace(/^90_operations\//, ''), rowPrefix: p.rowPrefix },
  ]),
);
const planId = (getArg('plan') || registry.defaultPlan).toUpperCase();
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
  // A row is real if it is DECLARED as a baseline row (first cell of its own row), or if
  // an amendment ADDS it (row id followed by an add-verb in the amendment's Change cell).
  //
  // SECOND FAIL-OPEN, found 2026-08-14 while negative-testing the CTRL-1 gate fix. The
  // previous amendment test scanned the WHOLE amendment row for the bare token, so ANY
  // row id merely MENTIONED in an amendment's prose validated as real. Amendment A-004
  // quotes "G-9999" while documenting the CTRL-1 bug, and G-9999 -- a row that exists
  // nowhere -- compiled clean. Same defect existed in canon-gate.ps1 and is fixed there
  // identically; scripts/plan-registry-divergence.test.mjs guards the pair.
  const inBaseline = new RegExp(`^\\|\\s*${row}\\s*\\|`, 'm').test(planDoc);
  const inAmendment = new RegExp(
    `^\\|\\s*A-\\d+\\s*\\|[^\\n|]*\\|[^\\n|]*(?:^|[^A-Za-z0-9-])${row}(?:\\s+(?:ADDED|added|ADD|NEW|new))`,
    'm',
  ).test(planDoc);
  if (!inBaseline && !inAmendment) {
    console.error(`PLAN-ROW ${row} not found as a declared row in ${planId} baseline or amendments. No row, no dispatch.`);
    console.error('Add an amendment row first (operator-ruled), then compile.');
    process.exit(1);
  }
}

// --- 2. Regenerate CANON-PREAMBLE from _STATE.md (same extraction as dispatch-preamble.mjs). ---
const state = readFileSync(join(root, '_STATE.md'), 'utf8');
const sdBody = extractStandingDecisions(state);
if (sdBody === null) {
  console.error('STANDING DECISIONS section not found in _STATE.md');
  process.exit(1);
}
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

// --- 3b. Hash the DEV_PROCESS body; maintain its marker line in place. ---
// Same treatment as the contract: the process file must TRAVEL in every dispatch, or it becomes a
// document living in a folder — which is the 0-for-3 control shape it exists to replace.
const processPath = join(root, '90_runbooks', 'DEV_PROCESS.md');
let devProcess = readFileSync(processPath, 'utf8');
const pMarkerRe = /^<!-- DEV-PROCESS v[a-z0-9]+ [^\n]*-->\n/;
const processBody = devProcess.replace(pMarkerRe, '');
const processHash = createHash('sha256').update(processBody, 'utf8').digest('hex').slice(0, 8);
const pMarker = `<!-- DEV-PROCESS v${processHash} — hash maintained by scripts/dispatch.mjs; do not edit this line by hand -->\n`;
if (!devProcess.startsWith(pMarker)) {
  devProcess = pMarker + processBody;
  writeFileSync(processPath, devProcess, 'utf8');
}

// --- 3c. Hash fleet_memory_practice.md; emit the verbatim M0 fenced block. ---
// 2026-08-08 audit break, still live until this emit: 0 compiled dispatches carried the
// paste-ready FLEET MEMORY (M0) block. The practice file is the source; do not rewrite it.
const fleetPath = join(root, '90_runbooks', 'fleet_memory_practice.md');
let fleetPractice = readFileSync(fleetPath, 'utf8');
const fMarkerRe = /^<!-- FLEET-MEMORY v[a-f0-9]{8} [^\n]*-->\n/m;
const fleetBody = fleetPractice.replace(fMarkerRe, '');
const fleetHash = createHash('sha256').update(fleetBody, 'utf8').digest('hex').slice(0, 8);
const fMarker = `<!-- FLEET-MEMORY v${fleetHash} — hash maintained by scripts/dispatch.mjs; do not edit this line by hand -->\n`;
if (!fleetPractice.includes(fMarker.trim())) {
  const stripped = fleetBody;
  const fmEnd = stripped.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n\r?\n/);
  fleetPractice = fmEnd
    ? fmEnd[0] + fMarker + stripped.slice(fmEnd[0].length)
    : fMarker + stripped;
  writeFileSync(fleetPath, fleetPractice, 'utf8');
}
const m0Match = fleetBody.match(
  /cc-agent dispatch rule block[^\n]*\r?\n\r?\n```\r?\n([\s\S]*?)\r?\n```/,
);
if (!m0Match) {
  console.error('FLEET MEMORY (M0) fenced block not found in 90_runbooks/fleet_memory_practice.md');
  process.exit(1);
}
const m0Block = m0Match[1].replace(/\r\n/g, '\n').trim();
if (!m0Block.startsWith('FLEET MEMORY (M0):')) {
  console.error('FLEET MEMORY (M0) fenced block is not the verbatim install text.');
  process.exit(1);
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

DEV-PROCESS v${processHash} — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v${fleetHash} — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

${m0Block}

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
console.error(`\n[dispatch.mjs] wrote ${outPath} (CANON-PREAMBLE v${preambleHash}, AGENT-CONTRACT v${contractHash}, FLEET-MEMORY v${fleetHash})`);
