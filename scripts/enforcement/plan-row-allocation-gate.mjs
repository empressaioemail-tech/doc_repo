#!/usr/bin/env node
/**
 * plan-row-allocation-gate.mjs — row allocation is a CLAIM, and a duplicate claim is refused.
 *
 * WHY. Two doc_repo sessions writing main from one checkout allocated the same plan-row IDs
 * three times in three days; four IDs collided on 2026-09-13 alone. The operator's standing
 * fix is not "pick a session" -- vigilance is not a control. It is that a row ID is claimed
 * against the plan file, which is the authoritative allocation record, and a commit that
 * introduces a SECOND definition of an ID already defined is refused.
 *
 * WHAT THIS DOES NOT CATCH, stated so nobody mistakes its scope for its name.
 * There are TWO failure modes and this covers ONE.
 *   (a) COVERED: two sessions allocating the same NEW id. Both write `| P-200 | ...` into the
 *       plan table; the second commit is refused.
 *   (b) NOT COVERED: a lane typing an ALREADY-ALLOCATED id into a PR title, commit message or
 *       dispatch for unrelated work. Live instance 2026-09-14 (F31): OPS-16's P-186 is
 *       "OPS-24 stage 0, source recon", and hauska-engine PR #445 used "(P-186, OPS-23 wave 6)"
 *       for a depth-warm re-mint wrapper. Verified: NO compiled dispatch anywhere binds P-186
 *       to that work, so the title was hand-typed and the compiler was never involved. This
 *       gate would not have caught it and does not claim to. Catching (b) means requiring a PR
 *       claiming a row to trace to a compiled dispatch for that row, which lives in the
 *       dispatch/close loop, not in a commit hook. Carded separately, deliberately not folded
 *       in here: a control whose claim is broader than its scope is its own defect class.
 *
 * THE THREE-QUESTION GATE.
 *   1. What executes this?  .claude/hooks/plan-row-allocation-gate.mjs, importing evaluate().
 *   2. What triggers it?    PreToolUse on Bash, on any `git commit` targeting doc_repo whose
 *                           staged set contains a plan-of-record file named in plan_registry.
 *   3. What fails?          exit 2, {"block":true}, naming the duplicated IDs and their lines.
 *   4. What bypasses it?    A commit made outside this harness (another seat's terminal, a GUI
 *                           client); a row written to a file the registry does not name; and an
 *                           ID reused in prose rather than as a table row. All real, all named.
 *
 * FAILS LOUD on a plan file that cannot be read while staged (an unreadable plan is itself the
 * defect). Fails OPEN only when git cannot run, and prints that it could not.
 *
 *   node scripts/enforcement/plan-row-allocation-gate.mjs --self-test
 *   node scripts/enforcement/plan-row-allocation-gate.mjs --scan   (report duplicates today)
 */

import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const DOC_REPO = process.env.EMPRESSA_DOC_REPO?.replace(/\\/g, "/") || resolve(HERE, "..", "..").replace(/\\/g, "/");

/**
 * A row DEFINITION is a table row whose first cell is the bare row id: `| P-186 | ...`.
 * Line-split rather than a global multiline regex, deliberately: the 464 KB OPS-16 table made
 * a `gm` scan pathological during development. Simple, bounded, one pass.
 * A MENTION inside another row's prose ("P-169, P-170 ADDED") is not a definition and is
 * ignored, which is why the id must be the whole first cell.
 */
export function rowDefinitions(text, prefix) {
  const out = new Map();
  const lines = String(text ?? "").split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.charCodeAt(0) !== 124 /* | */) continue;
    const end = line.indexOf("|", 1);
    if (end < 0) continue;
    const cell = line.slice(1, end).trim();
    if (!cell.startsWith(prefix + "-")) continue;
    const num = cell.slice(prefix.length + 1);
    if (num.length === 0 || num.length > 6) continue;
    let allDigits = true;
    for (let c = 0; c < num.length; c++) { const d = num.charCodeAt(c); if (d < 48 || d > 57) { allDigits = false; break; } }
    if (!allDigits) continue;
    const id = prefix + "-" + num;
    if (!out.has(id)) out.set(id, []);
    out.get(id).push(i + 1);
  }
  return out;
}

export function duplicatesIn(text, prefix) {
  return [...rowDefinitions(text, prefix).entries()]
    .filter(([, lines]) => lines.length > 1)
    .map(([id, lines]) => ({ id, lines }));
}

export function isGitCommit(command) {
  return /(^|[;&|]\s*)git\s+(-C\s+\S+\s+)?commit\b/.test(String(command ?? ""));
}

export function targetsDocRepo(command, cwd) {
  const m = /git\s+-C\s+("[^"]+"|'[^']+'|\S+)/.exec(String(command ?? ""));
  const norm = (p) => String(p ?? "").replace(/^["']|["']$/g, "").replace(/\\/g, "/").replace(/\/$/, "").toLowerCase();
  if (m) return norm(m[1]) === norm(DOC_REPO);
  return norm(cwd).startsWith(norm(DOC_REPO));
}

export function stagedFiles(repo) {
  try {
    return execFileSync("git", ["diff", "--cached", "--name-only"], { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  } catch { return null; }
}

/**
 * evaluate(staged, read, registry) -> {block, message, checked}
 * `read` takes a repo-relative path and returns text or null.
 */
export function evaluate(staged, read, registry) {
  const plans = registry?.plans ?? {};
  const byFile = new Map();
  for (const [id, p] of Object.entries(plans)) byFile.set(String(p.file).replace(/\\/g, "/"), { id, prefix: p.rowPrefix });

  const problems = [];
  const checked = [];
  for (const f of staged ?? []) {
    const key = String(f).replace(/\\/g, "/");
    const plan = byFile.get(key);
    if (!plan) continue;
    const text = read(key);
    if (text === null || text === undefined) {
      problems.push(`- ${key}: staged plan file could not be read. An unreadable plan of record is the defect; refusing rather than passing.`);
      continue;
    }
    checked.push(`${plan.id} (${key})`);
    for (const d of duplicatesIn(text, plan.prefix)) {
      problems.push(`- ${key}: ${d.id} is DEFINED ${d.lines.length} times, at lines ${d.lines.join(", ")}. A row id is a claim; a second claim on the same id is refused.`);
    }
  }

  if (problems.length === 0) return { block: false, message: "", checked };
  return {
    block: true,
    checked,
    message:
      "PLAN ROW ALLOCATION GATE refused the commit: a plan of record defines the same row id more than once.\n" +
      problems.join("\n") +
      "\nRe-read the max row id, pick the next free one, and rewrite YOUR row. Do not renumber another seat's row.\n" +
      "Scope note: this gate catches two sessions allocating the same NEW id. It does NOT catch an already-allocated id reused in a PR title or commit message for unrelated work (F31); that is a separate, uncarded control.",
  };
}

/* ------------------------------- self-test ------------------------------- */

function selfTest() {
  let failures = 0;
  const check = (name, cond) => { if (cond) console.log("  ok   " + name); else { console.log("  FAIL " + name); failures++; } };
  console.log("plan-row-allocation-gate self-test\n");

  const one = "| P-186 | 2026-09-14 | ADDED | stage 0 |\n| P-187 | 2026-09-14 | ADDED | farm |\n";
  const dup = one + "| P-186 | 2026-09-14 | ADDED | something else entirely |\n";

  check("a clean table has no duplicates", duplicatesIn(one, "P").length === 0);
  check("a duplicated row id is found, with BOTH line numbers",
    JSON.stringify(duplicatesIn(dup, "P")) === JSON.stringify([{ id: "P-186", lines: [1, 3] }]));
  check("a MENTION in another row's prose is not a definition",
    duplicatesIn(one + "| A-132 | x | P-186, P-187 ADDED | y |\n", "P").length === 0);
  check("a different plan's prefix does not collide", duplicatesIn(dup, "G").length === 0);
  check("G rows are parsed for the G plan", rowDefinitions("| G-52 | x |\n| G-52 | y |\n", "G").get("G-52").length === 2);
  check("a non-table line is ignored", rowDefinitions("P-186 is discussed here\n", "P").size === 0);
  check("a row id with a non-numeric tail is not a row", rowDefinitions("| P-18a | x |\n", "P").size === 0);

  const registry = { plans: { "OPS-16": { file: "90_operations/OPS-16.md", rowPrefix: "P" }, "OPS-17": { file: "90_operations/OPS-17.md", rowPrefix: "G" } } };
  const readClean = (p) => (p === "90_operations/OPS-16.md" ? one : null);
  const readDup = (p) => (p === "90_operations/OPS-16.md" ? dup : null);

  check("clean plan staged -> allow", evaluate(["90_operations/OPS-16.md"], readClean, registry).block === false);
  check("NOT VACUOUS: duplicated plan staged -> BLOCK", evaluate(["90_operations/OPS-16.md"], readDup, registry).block === true);
  check("the refusal names the id and the lines", /P-186 is DEFINED 2 times, at lines 1, 3/.test(evaluate(["90_operations/OPS-16.md"], readDup, registry).message));
  check("the refusal states its own scope limit (F31 not covered)", /does NOT catch/.test(evaluate(["90_operations/OPS-16.md"], readDup, registry).message));
  check("a plan file NOT staged is not checked even if duplicated", evaluate(["_inbox/x.json"], readDup, registry).block === false);
  check("a staged plan that cannot be read -> BLOCK (loud, not open)", evaluate(["90_operations/OPS-17.md"], () => null, registry).block === true);
  check("checked[] names what was actually examined", evaluate(["90_operations/OPS-16.md"], readClean, registry).checked[0] === "OPS-16 (90_operations/OPS-16.md)");
  check("isGitCommit matches plain and -C forms", isGitCommit("git commit -m x") && isGitCommit("git -C P:/doc_repo commit -F m.txt") && !isGitCommit("git status && echo commit"));

  console.log(failures === 0 ? "\nself-test: all checks passed" : `\nself-test: ${failures} check(s) FAILED`);
  return failures;
}

function scan() {
  const registry = JSON.parse(readFileSync(join(DOC_REPO, "_catalog", "plan_registry.json"), "utf8"));
  let total = 0;
  console.log(`plan-row allocation scan — ${DOC_REPO}\n`);
  for (const [id, p] of Object.entries(registry.plans ?? {})) {
    const path = join(DOC_REPO, p.file);
    if (!existsSync(path)) { console.log(`${id.padEnd(8)} MISSING ${p.file}`); continue; }
    const text = readFileSync(path, "utf8");
    const defs = rowDefinitions(text, p.rowPrefix);
    const dupes = duplicatesIn(text, p.rowPrefix);
    total += dupes.length;
    console.log(`${id.padEnd(8)} rows ${String(defs.size).padEnd(5)} duplicates ${dupes.length === 0 ? "none" : JSON.stringify(dupes)}`);
  }
  console.log(total === 0 ? "\nscan: no duplicate row definitions" : `\nscan: ${total} duplicated row id(s)`);
  return total;
}

const invoked = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (invoked) {
  if (process.argv.includes("--self-test")) process.exit(selfTest() === 0 ? 0 : 1);
  else if (process.argv.includes("--scan")) { scan(); process.exit(0); }
  else { console.log("usage: --self-test | --scan"); process.exit(0); }
}
