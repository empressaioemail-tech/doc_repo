#!/usr/bin/env node
/**
 * GIT COMMIT GATES (P-280): the doc_repo close gates, run by git itself, in every worktree.
 *
 * WHY THIS EXISTS. `probe-close-gate` and `fan-depth-gate` were wired only as Claude Code
 * PreToolUse hooks, and they act only when the command's working directory is P:/doc_repo.
 * Lanes commit in P:/seat-worktrees/<seat>/doc_repo (linked worktrees sharing P:/doc_repo/.git)
 * and their work lands by merge, which is not `git commit`. So no lane close was ever graded at
 * commit time, in any harness; the 2026-09-16 final teardown said so from inside a lane (A-183).
 *
 * THE THREE-QUESTION GATE.
 *   1. What executes this?  `.githooks/pre-commit` and `.githooks/pre-merge-commit`, which run
 *      this file. git finds them through `core.hooksPath`, set in the shared git config, so every
 *      linked worktree of doc_repo runs them. Three evaluators run here: `probe-close-gate`
 *      (OPS-23 R-4), `fan-depth-gate`, and `close-artifact-gate` (a citation that would dangle).
 *   2. What triggers it?    Every `git commit` (including the one that concludes a conflicted
 *      merge) and every merge that creates a commit, in any worktree, from any harness.
 *   3. What fails?          The commit or merge exits non-zero with the reasons; each refusal is
 *      appended to `commit-gate-refusals.log` in the shared git directory.
 *   4. What bypasses it?    Named:
 *      - `git commit --no-verify` / `git merge --no-verify`, which leave no record;
 *      - a fast-forward merge, which creates no commit (the commits it brings were gated where
 *        they were made, once this is installed);
 *      - `core.hooksPath` unset or changed; `--check` fails then, and the Claude Code
 *        probe-close-gate hook refuses doc_repo commits until it is reinstalled;
 *      - a clone that has not run `--install`.
 *
 * USAGE
 *   node scripts/enforcement/git-commit-gates.mjs --install     set core.hooksPath (absolute)
 *   node scripts/enforcement/git-commit-gates.mjs --check       exit 1 unless installed
 *   node scripts/enforcement/git-commit-gates.mjs --self-test   end-to-end, in a temp repo
 *   node scripts/enforcement/git-commit-gates.mjs pre-commit|pre-merge-commit   (from the hooks)
 */
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, appendFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve, dirname, isAbsolute } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { evaluate as evaluateProbe } from "./probe-close-gate.mjs";
import { evaluateStaged as evaluateFanDepth, findDispatch } from "./fan-depth-gate.mjs";
import { evaluateStagedGit as evaluateCitations } from "./close-artifact-gate.mjs";

export const HOME_REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..").replace(/\\/g, "/");
export const HOOKS_DIR = `${HOME_REPO}/.githooks`;

const git = (args, cwd) =>
  execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 26 });

const norm = (p) => String(p ?? "").trim().replace(/\\/g, "/").replace(/\/$/, "").toLowerCase();

/** Pure: grade a staged set with every gate. `read(rel)` and `dispatchFor(lane)` return text or null. */
export function gradeStaged(staged, read, dispatchFor, root = HOME_REPO) {
  const probe = evaluateProbe(staged, read);
  const fan = evaluateFanDepth(staged, read, dispatchFor);
  const citations = evaluateCitations(root);
  const messages = [];
  if (probe.block) messages.push(probe.message);
  if (fan.block) messages.push(fan.message);
  if (citations.block) messages.push(citations.message);
  return { block: probe.block || fan.block || citations.block, message: messages.join("\n"), debt: probe.block ? "" : probe.message };
}

/** Grade what is about to be committed in the worktree at `root` (the hook's working directory). */
export function gradeWorktree(root) {
  const staged = git(["diff", "--cached", "--name-only", "--diff-filter=ACMR"], root)
    .split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  const read = (rel) => {
    const p = String(rel).replace(/\\/g, "/");
    try { return git(["show", `:${p}`], root); } catch { /* not in the index */ }
    for (const base of [root, HOME_REPO]) {
      const f = join(base, p);
      if (existsSync(f)) return readFileSync(f, "utf8");
    }
    return null;
  };
  const dispatchFor = (lane) => {
    for (const base of [root, HOME_REPO]) {
      const f = findDispatch(lane, base);
      if (f && existsSync(f)) return readFileSync(f, "utf8");
    }
    return null;
  };
  return { staged, ...gradeStaged(staged, read, dispatchFor, root) };
}

function recordRefusal(root, mode, message) {
  try {
    let common = git(["rev-parse", "--git-common-dir"], root).trim();
    if (!isAbsolute(common)) common = join(root, common);
    const line = JSON.stringify({ at: new Date().toISOString(), mode, worktree: root, head: git(["rev-parse", "--short", "HEAD"], root).trim(), message: message.slice(0, 2000) });
    appendFileSync(join(common, "commit-gate-refusals.log"), line + "\n");
  } catch (e) {
    process.stderr.write(`COMMIT-GATES could not write its refusal record: ${e.message}\n`);
  }
}

export function installedHooksPath(repo = HOME_REPO) {
  try { return git(["config", "--get", "core.hooksPath"], repo).trim(); } catch { return ""; }
}

export function isInstalled(repo = HOME_REPO) {
  return norm(installedHooksPath(repo)) === norm(HOOKS_DIR);
}

function runHook(mode) {
  let root;
  try { root = git(["rev-parse", "--show-toplevel"], process.cwd()).trim(); } catch { root = process.cwd(); }
  const verdict = gradeWorktree(root);
  if (verdict.debt) process.stderr.write(`${verdict.debt}\n`);
  if (verdict.block) {
    recordRefusal(root, mode, verdict.message);
    process.stderr.write(`\n${verdict.message}\n\nRefused by the doc_repo ${mode} gate (P-280) in ${root}. Fix the close; do not bypass with --no-verify.\n`);
    process.exit(1);
  }
  process.exit(0);
}

function selfTest() {
  let failures = 0;
  const check = (name, ok, detail = "") => { console.log(`  ${ok ? "ok  " : "FAIL"} ${name}${detail ? "  " + detail : ""}`); if (!ok) failures++; };
  console.log("git-commit-gates self-test (real git, temp repo, hooks from this checkout)");
  const base = mkdtempSync(join(tmpdir(), "commit-gates-"));
  const repo = join(base, "repo").replace(/\\/g, "/");
  const wt = join(base, "wt").replace(/\\/g, "/");
  const run = (args, cwd) => { try { git(args, cwd); return { ok: true }; } catch (e) { return { ok: false, err: String(e.stderr ?? e.message) }; } };
  try {
    mkdirSync(repo);
    git(["init", "-q", "-b", "main"], repo);
    for (const [k, v] of [["user.name", "gate-test"], ["user.email", "gate-test@example.invalid"], ["core.hooksPath", HOOKS_DIR], ["core.autocrlf", "false"]]) git(["config", k, v], repo);
    mkdirSync(join(repo, "_inbox")); mkdirSync(join(repo, "_dispatches"));
    writeFileSync(join(repo, "_dispatches", "2026-09-16_zz-lane_dispatch.md"), "PLAN-ROW: P-252\nFAN-DEPTH: 0\n");
    writeFileSync(join(repo, "README.md"), "x\n");
    git(["add", "--", "README.md", "_dispatches/2026-09-16_zz-lane_dispatch.md"], repo);
    check("a commit with no close passes", run(["commit", "-q", "-m", "base"], repo).ok);

    const bad = { lane: "zz-lane", planRows: ["P-252"], status: "closed-partial", probe: { notApplicable: "test" }, subAgents: { spawned: 2, maxDepth: 1 } };
    const good = { ...bad, subAgents: { spawned: 0, maxDepth: 0 } };
    const noProbe = { lane: "zz-lane", planRows: ["P-252"], status: "closed", subAgents: { spawned: 0, maxDepth: 0 } };

    writeFileSync(join(repo, "_inbox", "2026-09-16_zz-lane_close.json"), JSON.stringify(bad));
    git(["add", "--", "_inbox/2026-09-16_zz-lane_close.json"], repo);
    const r1 = run(["commit", "-q", "-m", "violating close"], repo);
    check("VIOLATION: a depth-0 close declaring sub-agents is refused at pre-commit", !r1.ok && /FAN-DEPTH/.test(r1.err));

    writeFileSync(join(repo, "_inbox", "2026-09-16_zz-lane_close.json"), JSON.stringify(noProbe));
    git(["add", "--", "_inbox/2026-09-16_zz-lane_close.json"], repo);
    const r2 = run(["commit", "-q", "-m", "close with no probe"], repo);
    check("VIOLATION: an OPS-24 close with neither probe artifact nor notApplicable is refused", !r2.ok && /PROBE CLOSE GATE/.test(r2.err));

    writeFileSync(join(repo, "_inbox", "2026-09-16_zz-lane_close.json"), JSON.stringify(good));
    git(["add", "--", "_inbox/2026-09-16_zz-lane_close.json"], repo);
    check("a conforming close commits", run(["commit", "-q", "-m", "good close"], repo).ok);

    git(["worktree", "add", "-q", "-b", "seat/zz", wt], repo);
    writeFileSync(join(wt, "_inbox", "2026-09-17_zz-lane_close.json"), JSON.stringify(bad));
    git(["add", "--", "_inbox/2026-09-17_zz-lane_close.json"], wt);
    const r3 = run(["commit", "-q", "-m", "violating close in a linked worktree"], wt);
    check("VIOLATION: the same close is refused in a linked worktree (the gap this row closes)", !r3.ok && /FAN-DEPTH/.test(r3.err));
    const r3b = run(["commit", "-q", "--no-verify", "-m", "bypassed"], wt);
    check("the named bypass (--no-verify) lets it through, so the violation reaches the branch", r3b.ok);

    writeFileSync(join(repo, "README.md"), "y\n");
    git(["add", "--", "README.md"], repo);
    git(["commit", "-q", "-m", "diverge main"], repo);
    const r4 = run(["merge", "--no-ff", "-q", "-m", "land the seat branch", "seat/zz"], repo);
    check("VIOLATION: merging a branch that carries a violating close is refused at pre-merge-commit", !r4.ok && /FAN-DEPTH/.test(r4.err));
    run(["merge", "--abort"], repo);

    let common = git(["rev-parse", "--git-common-dir"], repo).trim();
    if (!isAbsolute(common)) common = join(repo, common);
    const log = existsSync(join(common, "commit-gate-refusals.log")) ? readFileSync(join(common, "commit-gate-refusals.log"), "utf8").trim().split("\n") : [];
    check("every refusal left a record in the shared git directory", log.length === 4, `records=${log.length}`);
    check("records name both modes", log.some((l) => l.includes('"pre-commit"')) && log.some((l) => l.includes('"pre-merge-commit"')));
  } finally {
    try { git(["worktree", "remove", "--force", wt], repo); } catch { /* best effort */ }
    try { rmSync(base, { recursive: true, force: true }); } catch { /* best effort */ }
  }
  console.log(failures ? `SELF-TEST FAILED (${failures})` : "SELF-TEST OK");
  process.exit(failures ? 1 : 0);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const arg = process.argv[2];
  if (arg === "--self-test") selfTest();
  else if (arg === "--install") {
    git(["config", "core.hooksPath", HOOKS_DIR], HOME_REPO);
    console.log(`core.hooksPath = ${installedHooksPath()} (shared by every linked worktree of ${HOME_REPO})`);
  } else if (arg === "--check") {
    const ok = isInstalled();
    console.log(ok ? `installed: core.hooksPath = ${HOOKS_DIR}` : `NOT INSTALLED: core.hooksPath = "${installedHooksPath()}", expected "${HOOKS_DIR}". Run --install.`);
    process.exit(ok ? 0 : 1);
  } else if (arg === "pre-commit" || arg === "pre-merge-commit") runHook(arg);
  else { console.error("usage: git-commit-gates.mjs --install | --check | --self-test | pre-commit | pre-merge-commit"); process.exit(2); }
}
