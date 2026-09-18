/**
 * Verify check.mjs by violating it on the REAL boards, one plant at a time.
 *
 *   node violate.mjs
 *
 * Each plant copies the declared boards, canvas.json and source-state.json to a scratch directory, applies
 * one mutation, and requires check.mjs to exit with the stated code AND name the stated rule; then a clean
 * copy must pass. Every plant asserts that it changed the file, because a plant that misses its target
 * leaves the board clean and reads as a result. Exit codes come from spawnSync directly, never through a
 * shell pipe, which reports the exit code of the last command in the pipe.
 */
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const declared = JSON.parse(readFileSync(join(here, 'canvas.json'), 'utf8')).artboards.map((a) => a.file);
const CHECK = join(here, 'check.mjs');
const fresh = () => {
  const d = mkdtempSync(join(tmpdir(), 'g143-'));
  for (const f of [...declared, 'canvas.json', 'source-state.json']) copyFileSync(join(here, f), join(d, f));
  return d;
};
const run = (d) => { const r = spawnSync(process.execPath, [CHECK, '--dir', d], { encoding: 'utf8' }); return { code: r.status, out: (r.stdout || '') + (r.stderr || '') }; };
const plant = (d, file, from, to, all = false) => {
  const p = join(d, file); const before = readFileSync(p, 'utf8');
  const after = all ? before.split(from).join(to) : before.replace(from, to);
  if (after === before) throw new Error(`plant did not apply to ${file}: ${String(from).slice(0, 60)}`);
  writeFileSync(p, after);
};

const PLANTS = [
  { rule: 'P1', code: 1, name: 'an invented role on the roster', go: (d) => plant(d, 'Access.dc.html', 'data-role="finance"', 'data-role="finance-director"') },
  { rule: 'P2', code: 1, name: 'an invented status', go: (d) => plant(d, 'Admin.dc.html', 'data-status="active"', 'data-status="suspended"') },
  { rule: 'P3', code: 1, name: 'a refusal in words the product does not use', go: (d) => plant(d, 'Refusals.dc.html', '&ldquo;this account has been disabled.&rdquo;', '&ldquo;your access was paused.&rdquo;') },
  { rule: 'P3', code: 1, name: 'the proposed code presented as one the product emits', go: (d) => plant(d, 'Refusals.dc.html', ' data-refusal-proposed="true"', '') },
  { rule: 'P4', code: 1, name: 'THE ACCESS LOG: the audit region claims reads are recorded', go: (d) => plant(d, 'WhoLooked.dc.html', 'data-recorded="false"', 'data-recorded="true"') },
  { rule: 'P5', code: 1, name: 'THE FALSE LIMIT: a Fleet account shown as opening only Fleet', go: (d) => plant(d, 'Access.dc.html', '>Every lens<', '>Fleet only<') },
  { rule: 'P5', code: 1, name: 'the not-enforced notice removed from the city manager board', go: (d) => plant(d, 'Access.dc.html', 'data-notice="not-enforced"', 'data-notice="gone"') },
  { rule: 'P6', code: 1, name: 'an action on the read-only city manager board', go: (d) => plant(d, 'Access.dc.html', '<span data-enforced="false">', '<span data-action="disable">End access</span><span data-enforced="false">') },
  { rule: 'P7', code: 1, name: 'an action with no operation in source', go: (d) => plant(d, 'Admin.dc.html', 'data-action="change-role"', 'data-action="merge-accounts"') },
  { rule: 'P8', code: 1, name: 'a max-age that is not the product cap', go: (d) => plant(d, 'Offboarding.dc.html', 'data-latency-seconds="900"', 'data-latency-seconds="3600"') },
  { rule: 'P8', code: 1, name: 'the provider-session row removed from offboarding', go: (d) => plant(d, 'Offboarding.dc.html', 'data-latency="not-ended"', 'data-latency="unknown"') },
  { rule: 'P9', code: 1, name: 'THE REAL NAME: a plausible employee on the roster', go: (d) => plant(d, 'Access.dc.html', 'data-name="Fixture staff 01"', 'data-name="Maria Gonzalez"') },
  { rule: 'P9', code: 1, name: 'a real-looking city email', go: (d) => plant(d, 'Access.dc.html', 'data-email="staff01@example.invalid"', 'data-email="mgonzalez@cityofbastrop.org"') },
  { rule: 'P10', code: 1, name: 'the administrator gap hidden from the city manager', go: (d) => plant(d, 'Access.dc.html', 'data-listed="false"', 'data-listed="true"') },
  { rule: 'P11', code: 1, name: 'showing who ended an account, a field the product does not return', go: (d) => plant(d, 'Admin.dc.html', 'Fixture staff 07</span>', 'Fixture staff 07, disabled by smartcity-admin</span>') },
  { rule: 'P12', code: 1, name: 'THE WRONG REASON hidden: the collapsed refusal no longer marked wrong', go: (d) => plant(d, 'Refusals.dc.html', ' data-wrong="true"', '') },
  { rule: 'P0', code: 1, name: 'an undeclared board on disk', go: (d) => writeFileSync(join(d, 'Extra.dc.html'), '<p>x</p>') },
  { rule: 'REFUSING A VERDICT', code: 2, name: 'boards drawn against a different commit than the snapshot', go: (d) => plant(d, 'canvas.json', /"commit": "[0-9a-f]+"/, '"commit": "0000000000000000000000000000000000000000"') },
  { rule: 'REFUSING A VERDICT', code: 2, name: 'the source snapshot deleted', go: (d) => rmSync(join(d, 'source-state.json')) },
  { rule: 'REFUSING A VERDICT', code: 2, name: 'every role chip unmarked, so no role is checked', go: (d) => { for (const f of declared) { try { plant(d, f, 'data-role=', 'data-x-role=', true); } catch { /* boards with no roles */ } } } },
];

let caught = 0, harness = 0;
for (const p of PLANTS) {
  const d = fresh();
  try {
    try { p.go(d); } catch (e) { console.error(`HARNESS  ${p.name}: ${e.message}`); harness++; continue; }
    const v = run(d);
    const ok = v.code === p.code && v.out.includes(p.rule);
    console.log(`direction 1  ${ok ? 'caught ' : 'MISSED '} ${p.rule.padEnd(18)} ${p.name}  (exit ${v.code})`);
    if (ok) caught++;
  } finally { rmSync(d, { recursive: true, force: true }); }
  const c = fresh();
  try { const v = run(c); if (v.code !== 0) { console.log(`direction 2  NOT CLEAN (exit ${v.code})`); harness++; } }
  finally { rmSync(c, { recursive: true, force: true }); }
}
console.log(`\n${caught}/${PLANTS.length} violations caught on a real board, and the unmodified boards pass.`);
if (harness) { console.error(`${harness} harness failure(s).`); process.exit(2); }
if (caught !== PLANTS.length) process.exit(1);
