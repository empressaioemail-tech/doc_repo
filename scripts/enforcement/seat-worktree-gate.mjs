#!/usr/bin/env node
/**
 * SEAT-01 worktree gate.
 *
 * Strong version: refuses a git write (add/commit) or a path mutation whose
 * target worktree is not the worktree declared for that seat/repo in
 * _catalog/seat_register.json. Identity is the worktree path, not a remembered
 * seat name and not a branch-name prefix grep.
 *
 * What executes: this script, invoked by Cursor beforeShellExecution / preToolUse,
 * Claude Code PreToolUse, and as a CLI for proof and for git hook wrappers.
 * What triggers: a shell git add/commit/push, or a Write/StrReplace/Delete whose
 * path is in a registered repo.
 * What fails: exit 2 (or JSON permission: deny). Running today as soon as a
 * hook or CLI invocation reaches it.
 * What bypasses: editors outside the agent harness; git GUI; core.hooksPath
 * unset so a native pre-commit never fires; CLOSE_OVERRIDE-style env
 * SEAT_GATE_OVERRIDE=1 (logged); any harness that loads neither Cursor hooks
 * nor Claude PreToolUse nor this CLI.
 *
 * Scope predicate is the worktree the command mutates (git -C / file path
 * toplevel), not the hook process cwd. Process cwd is the fallback named in
 * _git-repo-target.ps1, not a determination.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadSeatRegister,
  findByWorktree,
  ownerOfRepoPath,
  namespaceFromStatePath,
  pathsEqual,
  normalizePath,
} from './seat-register.mjs';
import { appendOverride } from './override-log.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOC_REPO = join(__dirname, '../..');

function gitShowToplevel(cwd) {
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

function gitBranch(cwd) {
  try {
    return execFileSync('git', ['branch', '--show-current'], {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return '';
  }
}

function commonGitDir(cwd) {
  try {
    return execFileSync('git', ['rev-parse', '--git-common-dir'], {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

function repoRootFromCommonDir(commonDir, fallbackToplevel) {
  if (!commonDir) return fallbackToplevel;
  const abs = resolve(commonDir);
  const norm = normalizePath(abs);
  if (norm.toLowerCase().endsWith('/.git')) {
    return normalizePath(dirname(abs));
  }
  return fallbackToplevel;
}

export function evaluate({ worktree, branch, paths = [], command = '' }) {
  const register = loadSeatRegister();
  const wt = normalizePath(worktree);
  if (!wt) {
    return { allow: false, code: 'unknown_worktree', message: 'SEAT-01: cannot resolve target worktree. Refuse rather than guess.' };
  }

  if (process.env.SEAT_GATE_OVERRIDE === '1') {
    return {
      allow: true,
      code: 'override',
      message: 'SEAT-01 override',
      logOverride: true,
      worktree: wt,
    };
  }

  const entry = findByWorktree(register, wt);
  if (!entry) {
    return {
      allow: false,
      code: 'unregistered_worktree',
      message: `SEAT-01: worktree ${wt} is not in _catalog/seat_register.json. A shared checkout is the failure this control exists to make impossible. Work in a registered seat worktree.`,
    };
  }

  if (entry.kind === 'extra') {
    return {
      allow: false,
      code: 'extra_worktree_no_writes',
      message: `SEAT-01: worktree ${wt} is named in otherWorktrees and is not a writer seat. Writes refused.`,
    };
  }

  if (branch && entry.branch && branch !== entry.branch) {
    return {
      allow: false,
      code: 'branch_mismatch',
      message: `SEAT-01: worktree ${wt} is registered to ${entry.name} on branch ${entry.branch}, current branch is ${branch}.`,
    };
  }

  if (entry.kind === 'seat-product') {
    const owner = ownerOfRepoPath(register, entry.repoPath);
    if (owner && owner.name !== entry.name) {
      return {
        allow: false,
        code: 'repo_owner_mismatch',
        message: `SEAT-01: internal register defect: worktree owner ${entry.name} != repo owner ${owner.name}`,
      };
    }
  }

  if (entry.kind === 'integration' || entry.kind === 'seat-doc') {
    const common = gitShowToplevel(wt);
    const productOwner = common ? ownerOfRepoPath(register, common) : null;
    if (productOwner && !pathsEqual(productOwner.worktree, wt)) {
      return {
        allow: false,
        code: 'product_from_wrong_tree',
        message: `SEAT-01: ${productOwner.repoName} is owned by ${productOwner.name}. Write it from ${productOwner.worktree}, not ${wt}.`,
      };
    }
  }

  for (const p of paths) {
    const ns = namespaceFromStatePath(p);
    if (!ns) continue;
    if (entry.kind === 'integration') {
      return {
        allow: false,
        code: 'namespace_from_integration',
        message: `SEAT-01: _state/${ns}/ is a seat file. Integration checkout P:/doc_repo does not write seat namespaces. Write it from that seat's worktree.`,
      };
    }
    if (entry.namespace && ns !== entry.namespace) {
      return {
        allow: false,
        code: 'foreign_namespace',
        message: `SEAT-01: path ${p} is namespace ${ns}; this worktree is seat ${entry.name} (namespace ${entry.namespace}).`,
      };
    }
  }

  const looksLikeGitWrite =
    /\bgit\b[^&|;]*?\b(add|commit|push|restore\s+--staged|rm\s+--cached)\b/i.test(command);
  if (looksLikeGitWrite && entry.kind === 'seat-product') {
    const owner = ownerOfRepoPath(register, entry.repoPath);
    if (owner && !pathsEqual(owner.worktree, wt)) {
      return {
        allow: false,
        code: 'product_index_foreign',
        message: `SEAT-01: refusing git write in ${wt}; owner worktree is ${owner.worktree}.`,
      };
    }
  }

  return {
    allow: true,
    code: 'ok',
    seat: entry.name,
    kind: entry.kind,
    worktree: wt,
    branch: entry.branch,
  };
}

function parseArgs(argv) {
  const out = { mode: 'cli', worktree: '', branch: '', paths: [], command: '', json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--mode' && argv[i + 1]) out.mode = argv[++i];
    else if (argv[i] === '--worktree' && argv[i + 1]) out.worktree = argv[++i];
    else if (argv[i] === '--branch' && argv[i + 1]) out.branch = argv[++i];
    else if (argv[i] === '--paths' && argv[i + 1]) {
      out.paths = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    }
    else if (argv[i] === '--command' && argv[i + 1]) out.command = argv[++i];
    else if (argv[i] === '--json') out.json = true;
    else if (argv[i] === '--cwd' && argv[i + 1]) out.cwd = argv[++i];
  }
  return out;
}

function readStdinSync() {
  try {
    return readFileSyncStdin();
  } catch {
    return '';
  }
}

function readFileSyncStdin() {
  const chunks = [];
  const fs = process.stdin;
  if (fs.isTTY) return '';
  try {
    return execFileSync('node', ['-e', 'let d="";process.stdin.setEncoding("utf8");process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{process.stdout.write(d)})'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      encoding: 'utf8',
      timeout: 2000,
    });
  } catch {
    return '';
  }
}

function extractFromHookPayload(raw) {
  if (!raw || !String(raw).trim()) return {};
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return {};
  }
  if (Array.isArray(payload) && payload.length >= 10) {
    const toolName = String(payload[7] || '');
    const toolInput = payload[9];
    const command = Array.isArray(toolInput) ? String(toolInput[0] || '') : String(toolInput?.command || '');
    const cwd = toolInput?.working_directory || payload.cwd;
    return { command, cwd, toolName, path: toolInput?.path };
  }
  const command = payload.command || payload.tool_input?.command || '';
  const cwd = payload.cwd || payload.tool_input?.working_directory || payload.working_directory || '';
  const path = payload.tool_input?.path || payload.path || payload.file_path || '';
  const toolName = payload.tool_name || payload.tool || '';
  return { command, cwd, path, toolName };
}

function isGitWriteCommand(command) {
  return /\bgit\b[^&|;]*?\b(add|commit|push|restore\s+--staged|rm\s+--cached)\b/i.test(command || '');
}

function logOverride(worktree, cwd) {
  try {
    appendOverride({ kind: 'SEAT_GATE_OVERRIDE', cwd, worktree });
  } catch {
    /* still allow; acknowledgment write failed is its own finding */
  }
}

function emitCursor(result) {
  if (result.allow) {
    process.stdout.write(JSON.stringify({ permission: 'allow', agent_message: result.message || `SEAT-01 ok seat=${result.seat}` }));
  } else {
    process.stdout.write(JSON.stringify({
      permission: 'deny',
      user_message: result.message,
      agent_message: result.message,
    }));
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  let worktree = args.worktree;
  let branch = args.branch;
  let paths = args.paths;
  let command = args.command;
  const cwdHint = args.cwd || process.cwd();

  if (!worktree && (args.mode === 'shell' || args.mode === 'write' || args.mode === 'session')) {
    const raw = (() => {
      try {
        return execFileSync('powershell', ['-NoProfile', '-Command', '[Console]::In.ReadToEnd()'], {
          encoding: 'utf8',
          stdio: ['inherit', 'pipe', 'pipe'],
          timeout: 3000,
        });
      } catch {
        return '';
      }
    })();
    const extracted = extractFromHookPayload(raw);
    command = command || extracted.command || '';
    const cwd = extracted.cwd || cwdHint;
    if (extracted.path) paths = [...paths, extracted.path];
    worktree = gitShowToplevel(cwd) || cwd;
    branch = branch || gitBranch(worktree);
    if (args.mode === 'shell' && command && !isGitWriteCommand(command) && args.mode !== 'session') {
      process.stdout.write(JSON.stringify({ permission: 'allow' }));
      process.exit(0);
    }
  }

  if (!worktree) {
    worktree = gitShowToplevel(cwdHint) || cwdHint;
  }
  if (!branch) {
    branch = gitBranch(worktree);
  }

  if (args.mode === 'session') {
    const result = evaluate({ worktree, branch, paths, command: '' });
    const snapshot = {
      control: 'SEAT-01-session',
      worktree,
      branch,
      commit: (() => {
        try {
          return execFileSync('git', ['-C', worktree, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
        } catch {
          return null;
        }
      })(),
      result,
    };
    process.stdout.write(JSON.stringify({
      additional_context: result.allow
        ? `SEAT-01: you are ${result.seat} (${result.kind}) in ${worktree} on ${branch}. Snapshot: ${snapshot.commit}. Load ENFORCEMENT.md.`
        : `SEAT-01 BLOCKED at session start: ${result.message}`,
    }));
    process.exit(result.allow ? 0 : 0);
  }

  const result = evaluate({ worktree, branch, paths, command });
  if (result.logOverride) logOverride(worktree, cwdHint);

  if (args.json || args.mode === 'shell' || args.mode === 'write') {
    if (args.mode === 'shell' || args.mode === 'write') emitCursor(result);
    else process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  } else {
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  }

  if (!result.allow) {
    process.stderr.write(result.message + '\n');
    process.exit(2);
  }
  process.exit(0);
}

const isMain = process.argv[1] && normalizePath(process.argv[1]).endsWith('seat-worktree-gate.mjs');
if (isMain) {
  main();
}
