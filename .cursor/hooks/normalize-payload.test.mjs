#!/usr/bin/env node
/**
 * Self-test for the Cursor payload normalizer. Both directions, against real captured
 * payloads, with an explicit not-vacuous case.
 *
 * The not-vacuous cases matter more than the passing ones. A normalizer test that only
 * asserts "the normalizer returns the right thing" passes just as well when the input was
 * already in the right shape, and this whole control exists because a payload that LOOKED
 * fine caused eleven gates to exit open. So the suite asserts the defect directly: that the
 * raw captured payload really does carry the command somewhere the existing gates do not
 * look, and that the flag which would break fan-depth is really absent.
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizePayload, normalizePath, parseRaw } from './normalize-payload.mjs';
import { normalizePath as seatRegisterNormalizePath } from '../../scripts/enforcement/seat-register.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FIXTURES = JSON.parse(readFileSync(join(ROOT, '_catalog/fixtures/cursor-hook-payloads.json'), 'utf8'));

const results = [];
function check(name, cond, detail) {
  results.push({ name, ok: Boolean(cond), detail });
}

// --- 1. Shell -----------------------------------------------------------------------------
const shellRaw = JSON.stringify(FIXTURES.cursor.beforeShellExecution);
const shell = normalizePayload(shellRaw);

check('shell: normalizes', shell.ok && shell.shape === 'cursor-shell', shell.shape);
check('shell: tool name is Bash', shell.payload?.tool_name === 'Bash', shell.payload?.tool_name);
check(
  'shell: command survives normalisation',
  shell.payload?.tool_input?.command === 'echo cursor-payload-capture-probe',
  shell.payload?.tool_input?.command,
);

// NOT VACUOUS. The command is NOT under tool_input on a raw Cursor payload. If this ever
// starts passing, the fixture has been edited into the shape the normalizer expects and the
// suite has stopped testing anything.
check(
  'shell: NOT VACUOUS, the raw payload really hides the command from the old reader',
  FIXTURES.cursor.beforeShellExecution.tool_input === undefined &&
    typeof FIXTURES.cursor.beforeShellExecution.command === 'string',
  `tool_input=${JSON.stringify(FIXTURES.cursor.beforeShellExecution.tool_input)}`,
);

// Cursor sends cwd as "". The normalizer must not carry that emptiness forward as an answer.
check(
  'shell: empty cwd is not accepted as the cwd',
  shell.payload?.cwd === 'P:/doc_repo',
  `raw cwd=${JSON.stringify(FIXTURES.cursor.beforeShellExecution.cwd)} normalized=${shell.payload?.cwd}`,
);
check(
  'shell: working_directory is populated for the PowerShell gates',
  shell.payload?.tool_input?.working_directory === 'P:/doc_repo',
  shell.payload?.tool_input?.working_directory,
);

// --- 2. Write -----------------------------------------------------------------------------
const write = normalizePayload(JSON.stringify(FIXTURES.cursor.preToolUse_write));
check('write: normalizes', write.ok && write.shape === 'cursor-tool', write.shape);
check('write: tool name preserved', write.payload?.tool_name === 'Write', write.payload?.tool_name);
check(
  'write: file_path preserved',
  write.payload?.tool_input?.file_path === 'P:/doc_repo/_scratch/_cursor_payload_probe.txt',
  write.payload?.tool_input?.file_path,
);
check(
  'write: contents is present for the gates that read contents first',
  write.payload?.tool_input?.contents === FIXTURES.cursor.preToolUse_write.tool_input.content,
  write.payload?.tool_input?.contents,
);
check(
  'write: NOT VACUOUS, the raw payload carries no contents key',
  FIXTURES.cursor.preToolUse_write.tool_input.contents === undefined,
  JSON.stringify(Object.keys(FIXTURES.cursor.preToolUse_write.tool_input)),
);

// --- 3. Task (sub-agent launch) -----------------------------------------------------------
const task = normalizePayload(JSON.stringify(FIXTURES.cursor.preToolUse_task));
check('task: normalizes', task.ok && task.shape === 'cursor-task', task.shape);
check('task: Task is renamed to Agent so both dispatch gates see it', task.payload?.tool_name === 'Agent', task.payload?.tool_name);
check(
  'task: prompt survives',
  task.payload?.tool_input?.prompt === FIXTURES.cursor.preToolUse_task.tool_input.prompt,
  task.payload?.tool_input?.prompt,
);

// NOT VACUOUS, and load-bearing. fan-depth-gate reads `agent_id`/`agent_type` to mean "a
// sub-agent is launching another sub-agent". Cursor's `subagent_type` means "the agent being
// launched". Translating one into the other would report every depth-1 launch as a depth-2
// launch and refuse it. This asserts the translation did NOT happen.
check(
  'task: subagent_type is NOT promoted to agent_type',
  task.payload?.agent_type === undefined && task.payload?.agent_id === undefined,
  `agent_type=${JSON.stringify(task.payload?.agent_type)} agent_id=${JSON.stringify(task.payload?.agent_id)}`,
);
check(
  'task: subagent_type is still readable for a future gate that wants it',
  task.payload?.tool_input?.subagent_type === 'explore',
  task.payload?.tool_input?.subagent_type,
);

// --- 4. Read ------------------------------------------------------------------------------
const read = normalizePayload(JSON.stringify(FIXTURES.cursor.beforeReadFile));
check('read: normalizes', read.ok && read.shape === 'cursor-read', read.shape);
check('read: tool name becomes Read', read.payload?.tool_name === 'Read', read.payload?.tool_name);
check(
  'read: path is populated from file_path',
  read.payload?.tool_input?.path === 'P:/doc_repo/_scratch/cursor-payload-capture.jsonl',
  read.payload?.tool_input?.path,
);
check(
  'read: NOT VACUOUS, the raw payload carries no tool_name',
  FIXTURES.cursor.beforeReadFile.tool_name === undefined,
  JSON.stringify(FIXTURES.cursor.beforeReadFile.tool_name),
);

// --- 5. Claude array form passes through --------------------------------------------------
const arr = normalizePayload(JSON.stringify(FIXTURES.claudeArrayForm.payload));
check('claude array: normalizes', arr.ok && arr.shape === 'claude-array', arr.shape);
check('claude array: tool name at index 7 is intact', arr.payload?.[7] === 'Agent', arr.payload?.[7]);
check(
  'claude array: tool input at index 9 is intact',
  Array.isArray(arr.payload?.[9]) && arr.payload[9][1] === 'example brief text',
  JSON.stringify(arr.payload?.[9]),
);

// --- 6. Path normalisation, checked against the OTHER normaliser in the fleet --------------
check('/p:/doc_repo -> P:/doc_repo', normalizePath('/p:/doc_repo') === 'P:/doc_repo', normalizePath('/p:/doc_repo'));
check(
  'MEANING SHAPED: seat-register normalizePath disagrees on this input, so this is not a duplicate',
  seatRegisterNormalizePath('/p:/doc_repo').toLowerCase() !== 'p:/doc_repo',
  `seat-register gives ${JSON.stringify(seatRegisterNormalizePath('/p:/doc_repo'))}`,
);
check('posix path is left alone', normalizePath('/home/x/repo') === '/home/x/repo', normalizePath('/home/x/repo'));

// --- 7. Refusals --------------------------------------------------------------------------
check('empty stdin is refused, not defaulted', normalizePayload('').ok === false, JSON.stringify(normalizePayload('')));
check('non-JSON is refused, not defaulted', normalizePayload('not json').ok === false, JSON.stringify(normalizePayload('not json')));
check(
  'a shell event with no command is refused',
  normalizePayload({ hook_event_name: 'beforeShellExecution', command: '' }).ok === false,
  'beforeShellExecution/""',
);
check(
  'a payload with no identifiable tool is refused',
  normalizePayload({ arbitrary: true }).ok === false,
  '{}',
);
check('BOM-prefixed JSON still parses', parseRaw('\uFEFF{"a":1}')?.a === 1, JSON.stringify(parseRaw('\uFEFF{"a":1}')));

// --- report -------------------------------------------------------------------------------
const failed = results.filter((r) => !r.ok);
console.log('\ncursor payload normalizer self-test\n');
for (const r of results) {
  console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : `  <- ${r.detail}`}`);
}
console.log(`\n${results.length} checks, ${failed.length} failed`);
process.exit(failed.length === 0 ? 0 : 1);
