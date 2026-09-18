#!/usr/bin/env node
/**
 * Adapter suite for run-gate.mjs. This is the control that proves the Cursor port actually
 * decides, in both directions, before anything is registered in .cursor/hooks.json.
 *
 * WHY IT IS A FILE AND NOT A SHELL ONE-LINER. ENFORCEMENT.md: a load-bearing claim needs a
 * file-based instrument that has been shown to fail, and the measured failure mode of ad hoc
 * instruments in this repo is that they return a plausible answer. So each claim below has a
 * paired negative: the deny case is paired with the allow case on the same gate, and the
 * advisory case is paired with silence on an ordinary command.
 *
 * It runs the REAL gates through the REAL adapter. Nothing here is a mock, because a mock
 * would test the mock.
 */
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const RUN_GATE = join(ROOT, '.cursor/hooks/run-gate.mjs');
const FIXTURES = JSON.parse(readFileSync(join(ROOT, '_catalog/fixtures/cursor-hook-payloads.json'), 'utf8'));

// Whether the PowerShell-runner gates can be exercised HERE. Established once, by asking, rather
// than inferred from the platform string. On a Linux CI runner there is no powershell, so the
// four checks that drive canon-gate and dispatch-template-gate cannot run at all. They are
// DECLARED as not run rather than allowed to fail: a suite that goes red for an environmental
// reason trains people to ignore it, and a suite that silently drops coverage is this repo's
// named defect class. The same discipline hooks-loadable.test.mjs follows for .ps1 parse checks.
const HAS_POWERSHELL = (() => {
  const r = spawnSync('powershell', ['-NoProfile', '-Command', 'exit 0'], { encoding: 'utf8', timeout: 20_000 });
  return !r.error && r.status === 0;
})();
const declaredSkips = [];

const results = [];
function check(name, cond, detail) {
  results.push({ name, ok: Boolean(cond), detail });
}

function callGate(runner, script, args, payload) {
  const r = spawnSync(process.execPath, [RUN_GATE, runner, script, ...args], {
    cwd: ROOT,
    input: typeof payload === 'string' ? payload : JSON.stringify(payload),
    encoding: 'utf8',
    timeout: 120_000,
  });
  let verdict = null;
  try {
    verdict = JSON.parse(r.stdout);
  } catch {
    verdict = { _unparsed: r.stdout, _stderr: r.stderr, _status: r.status };
  }
  return verdict;
}

/** A Cursor beforeShellExecution payload, shaped exactly as captured. */
const shellPayload = (command) => ({
  ...FIXTURES.cursor.beforeShellExecution,
  command,
});

/** A Cursor preToolUse Write payload, shaped exactly as captured. */
const writePayload = (filePath, content) => ({
  ...FIXTURES.cursor.preToolUse_write,
  tool_input: { file_path: filePath, content },
});

/** A Cursor preToolUse Task payload, shaped exactly as captured. */
const taskPayload = (prompt) => ({
  ...FIXTURES.cursor.preToolUse_task,
  tool_input: { ...FIXTURES.cursor.preToolUse_task.tool_input, prompt },
});

// --- 1. Advisory path: the gate fires, and its warning reaches the agent -------------------
{
  const v = callGate('node', '.claude/hooks/authoritative-read.mjs', [], shellPayload("grep -n 'zero rows' 90_operations/OPS-1_texas_source_registry.md"));
  check('advisory: the gate fires and is allowed', v.permission === 'allow', JSON.stringify(v));
  check(
    'advisory: the warning reaches the agent instead of being dropped',
    /WORKING TREE/.test(v.agent_message || ''),
    JSON.stringify(v.agent_message),
  );
}
{
  const v = callGate('node', '.claude/hooks/authoritative-read.mjs', [], shellPayload('git status --porcelain'));
  check('advisory: SILENT on ordinary work', v.permission === 'allow' && v.agent_message === undefined, JSON.stringify(v));
}

// --- 2. Deny path through a NODE gate, with the paired allow --------------------------------
// This section exists so the deny path has evidence that does NOT depend on PowerShell being
// installed. Before it, the suite's only observed refusal came from a .ps1, so on a Linux runner
// the port's blocking behaviour was untested while the suite reported a result.
{
  const stageAndCommit = callGate('node', '.claude/hooks/probe-close-gate.mjs', [], shellPayload('git add -A && git commit -m "probe"'));
  const ordinary = callGate('node', '.claude/hooks/probe-close-gate.mjs', [], shellPayload('git status --porcelain'));
  const hooksInstalled = (() => {
    const r = spawnSync('git', ['config', 'core.hooksPath'], { cwd: ROOT, encoding: 'utf8' });
    return !r.error && r.status === 0 && String(r.stdout).trim() !== '';
  })();
  check('probe-close-gate (node): staging and committing in one string is REFUSED', stageAndCommit.permission === 'deny', JSON.stringify(stageAndCommit));
  check(
    `probe-close-gate (node): the refusal names the reason the gate actually reached (core.hooksPath ${hooksInstalled ? 'is' : 'is NOT'} set)`,
    (hooksInstalled ? /stages and commits in one string/ : /COMMIT GATES NOT INSTALLED/).test(stageAndCommit.agent_message || ''),
    JSON.stringify(stageAndCommit.agent_message),
  );
  check('probe-close-gate (node): an ordinary git status is ALLOWED and quiet', ordinary.permission === 'allow' && ordinary.agent_message === undefined, JSON.stringify(ordinary));
}

// --- 3. Deny path through PowerShell, with the paired allow --------------------------------
if (!HAS_POWERSHELL) {
  declaredSkips.push(
    'canon-gate no-touch refusal and its paired allow',
    'canon-gate ordinary-Write allow',
    'dispatch-template-gate Task->Agent refusal and its paired allow',
  );
} else {
{
  const blocked = callGate('powershell', '.claude/hooks/canon-gate.ps1', [], writePayload('P:/doc_repo/_dispatches/_gate_verify_probe.md', '# probe\nrepo: smartcity-os\n'));
  const allowed = callGate('powershell', '.claude/hooks/canon-gate.ps1', [], writePayload('P:/doc_repo/_dispatches/_gate_verify_probe.md', '# probe\nrepo: hauska-engine\n'));
  check('canon-gate: no-touch repo is REFUSED', blocked.permission === 'deny', JSON.stringify(blocked));
  check(
    'canon-gate: the refusal names the posture (so the block is attributable, not just a denial)',
    /posture is 'no-touch'/.test(blocked.agent_message || ''),
    JSON.stringify(blocked.agent_message),
  );
  check('canon-gate: the SAME payload with an active repo is ALLOWED', allowed.permission === 'allow', JSON.stringify(allowed));
}

// --- 4. Ordinary work is not blocked ------------------------------------------------------
{
  const v = callGate('powershell', '.claude/hooks/canon-gate.ps1', [], FIXTURES.cursor.preToolUse_write);
  check('canon-gate: a real Write outside _dispatches/ is ALLOWED and quiet', v.permission === 'allow' && v.agent_message === undefined, JSON.stringify(v));
}

// --- 5. The Task -> Agent rename is load-bearing ------------------------------------------
{
  const dispatchLike =
    'You are the executor for this dispatch.\n' +
    'repo: hauska-engine\n\n' +
    '## Scope\nReplace the flood raster writer.\n\n'.repeat(20);
  const v = callGate('powershell', '.claude/hooks/dispatch-template-gate.ps1', [], taskPayload(dispatchLike));
  check('dispatch-gate: a Task launch carrying a dispatch IS REFUSED', v.permission === 'deny', JSON.stringify(v));
  check(
    'dispatch-gate: the refusal lists the missing clauses, which only happens if the Task payload reached it as an Agent',
    /CANON-PREAMBLE/.test(v.agent_message || ''),
    JSON.stringify(v.agent_message),
  );

  const short = callGate('powershell', '.claude/hooks/dispatch-template-gate.ps1', [], taskPayload('What is in _STATE.md?'));
  check('dispatch-gate: a short read-only sub-agent question is ALLOWED', short.permission === 'allow', JSON.stringify(short));
}
}

// --- 6. A gate that cannot run is DECLARED, never silently passed --------------------------
{
  const v = callGate('node', '.claude/hooks/authoritative-read.mjs', [], 'not json at all');
  check('failure: unparseable stdin is allowed', v.permission === 'allow', JSON.stringify(v));
  check(
    'failure: and the non-decision is declared to the agent',
    /did not run/.test(v.agent_message || ''),
    JSON.stringify(v.agent_message),
  );
}

// --- 7. Every captured payload shape survives a real gate without adapter error ------------
for (const [label, payload] of [
  ['beforeShellExecution', shellPayload('git status --porcelain')],
  ['preToolUse_write', FIXTURES.cursor.preToolUse_write],
  ['preToolUse_task', taskPayload('a short question')],
  ['beforeReadFile', FIXTURES.cursor.beforeReadFile],
]) {
  const v = callGate('node', '.claude/hooks/authoritative-read.mjs', [], payload);
  check(`shape ${label}: adapter returns a verdict, not an adapter error`, typeof v.permission === 'string', JSON.stringify(v));
}

const failed = results.filter((r) => !r.ok);
console.log('\ncursor gate adapter suite (real gates, real payloads)\n');
for (const r of results) {
  console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : `  <- ${r.detail}`}`);
}
if (declaredSkips.length > 0) {
  console.log(`\nDECLARED LIMIT: ${declaredSkips.length} check(s) were NOT RUN because PowerShell is`);
  console.log(`unavailable on ${process.platform}:`);
  for (const s of declaredSkips) console.log(`  - ${s}`);
  console.log('Those checks are not passing here; they are absent from this run. The Windows run is');
  console.log('where they execute. The node-runner refusal in section 2 is deliberately portable so');
  console.log('that this suite still observes a real block on a runner without PowerShell.');
}
console.log(`\n${results.length} checks, ${failed.length} failed`);
process.exit(failed.length === 0 ? 0 : 1);
