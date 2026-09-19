#!/usr/bin/env node
/**
 * CLOSE ARTIFACT GATE - a close or artifact stranded in a seat worktree must FAIL, not read as a note.
 *
 * THE DEFECT, THRICE REPEATED. A lane produces `_inbox/<lane>_close.json` in its seat worktree
 * (P:/seat-worktrees/<seat>/doc_repo). The integration seat regrades the plan row to CLOSED in main
 * and the row cites that artifact by path. The artifact is never copied into main. Result: tracked
 * canon cites a path that exists nowhere a clone can see. Measured 2026-09-19 at HEAD 6c9e40e9:
 * 77 concrete `_inbox/` citations in tracked canon resolve to nothing in HEAD.
 *
 * WHY THE EXISTING CONTROL DID NOT CATCH IT. `cited-untracked.mjs` asks "is this cited path on disk
 * but not in git". That catches the close that was COPIED into main and never committed. The
 * three-wave failure is one step earlier: the close was never copied in at all, so from the
 * integration checkout the path exists nowhere and that check stays silent. The question with a
 * failing answer in BOTH cases is the one asked here: is the cited path IN THE TREE?
 *
 * TWO INDEPENDENT INPUTS, which is what makes this meaning-shaped rather than internal consistency:
 *   1. the citation   - parsed out of the content being committed
 *   2. the tree       - read from git (index for what is staged, HEAD for what already landed)
 * One party cannot fabricate both halves: a citation is text, a tree entry requires a blob.
 *
 * THE THREE-QUESTION GATE.
 *   1. What executes this?   `.githooks/pre-commit` and `.githooks/pre-merge-commit`, which call
 *      `git-commit-gates.mjs` and now include this evaluator in `gradeStaged`. Because
 *      `core.hooksPath` is shared through the common git directory, it runs in every linked
 *      worktree, not only in P:/doc_repo.
 *   2. What triggers it?     Every `git commit` and every merge that creates a commit, in any
 *      worktree of doc_repo, from any harness.
 *   3. What fails?           Non-zero exit; the commit or merge is refused and the refusal is
 *      appended to `commit-gate-refusals.log` in the shared git directory.
 *   4. What bypasses it?     Named, and only these:
 *        - `git commit --no-verify` / `git merge --no-verify`;
 *        - a fast-forward merge, which creates no commit (the commits it brings were gated where
 *          they were made);
 *        - a citation written into a file that is NOT staged, then committed later by a path that
 *          does not pass through this gate;
 *        - `core.hooksPath` changed or unset (the Claude Code probe-close-gate hook refuses doc_repo
 *          commits while that is so);
 *        - a clone that has not run `git-commit-gates.mjs --install`.
 *
 * SCOPE, DELIBERATELY NARROW. This grades citations a commit INTRODUCES (added lines) and artifacts
 * a commit REMOVES (deletions and renames). It does not re-grade the 77 pre-existing dangling
 * citations, because a gate that blocks work it was never meant to reach teaches the fleet to reach
 * for --no-verify. The pre-existing debt is enumerated by `--census`, which is a visible count, not
 * a block. Arming therefore costs zero baseline and needs no allowlist file to rot.
 *
 * USAGE
 *   node scripts/enforcement/close-artifact-gate.mjs --self-test   end-to-end in a temp repo AND unit cases
 *   node scripts/enforcement/close-artifact-gate.mjs --census      every dangling citation at HEAD
 *   node scripts/enforcement/close-artifact-gate.mjs --json        census as JSON
 *
 * Proved by violation: --self-test stages a citation to a missing artifact and asserts the real
 * pre-commit hook refuses the commit, then stages the artifact alongside and asserts it passes.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { join, resolve, dirname, isAbsolute } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

export const HOME_REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..").replace(/\\/g, "/");

/**
 * Is this string a CONCRETE `_inbox/` artifact path, or a shape that merely looks like one?
 *
 * This classifier is load-bearing and is self-tested. The first run of the census without it
 * reported 316 "dangling citations", almost all of them shapes the repo writes on purpose:
 * `_inbox/*_close.json` (a glob in OPS-17), `_inbox/â€¦` (an ellipsis in prose),
 * `_inbox/<date>_<lane id>_close.json` (a template in a mission). A check that admits those
 * reports a number nobody can act on, which is the same defect it was written to find.
 */
const SHAPE_CHARS = ["*", "?", "[", "]", "<", ">", "{", "}", "â€¦", "|", "$", "\\", " ", "\t"];
const ARTIFACT_EXT = /\.(json|jsonl|md|txt|patch|log|csv)$/i;

export function isConcreteInboxArtifact(s) {
  if (typeof s !== "string") return false;
  if (!s.startsWith("_inbox/")) return false;
  if (s.endsWith("/")) return false; // a directory citation, not an artifact
  if (s.length > 240) return false;
  for (const c of SHAPE_CHARS) if (s.includes(c)) return false;
  if (s.startsWith("_inbox/_tmp_")) return false; // lane scratch, never meant to be tracked
  if (s.includes("..")) return false;
  const base = s.split("/").pop();
  return ARTIFACT_EXT.test(base);
}

/** Normalize a raw match into a repo-relative posix path, or null if it is not one. */
export function normalizeCitation(raw) {
  let s = String(raw ?? "").trim().replace(/\\/g, "/").replace(/^\.\//, "");
  if (/^[A-Za-z]:\//.test(s)) {
    if (s.toLowerCase().startsWith(HOME_REPO.toLowerCase() + "/")) s = s.slice(HOME_REPO.length + 1);
    else return null;
  }
  // Prose puts a full stop after a path. A trailing dot or comma is punctuation, not the path.
  s = s.replace(/[.,;:]+$/, "");
  return s;
}

/**
 * Every concrete `_inbox/` artifact a block of text cites.
 *
 * One generic scan rather than backtick/markdown-link parsing: a citation reaches canon as a code
 * span, a link, and a JSON string value (`"artifact": "_inbox/x.json"`), and the three-wave defect
 * arrived through all three. The classifier above is what removes the shapes; the scanner does not
 * need to know the syntax.
 */
export function extractCitations(text) {
  const out = new Set();
  if (!text) return out;
  const re = /_inbox\/[A-Za-z0-9._\/-]+/g;
  let m;
  while ((m = re.exec(text))) {
    const s = normalizeCitation(m[0]);
    if (s && isConcreteInboxArtifact(s)) out.add(s);
  }
  return out;
}

/**
 * Citers that mention `_inbox/` paths WITHOUT asserting that the artifact is available.
 *
 * Two kinds, and both are narrow.
 *
 * FORWARD-LOOKING. A compiled dispatch tells its lane where to put the close: "write
 * `_inbox/<lane>_close.json`". A mission template does the same. Those are instructions, not claims,
 * and grading them would refuse every dispatch commit in the fleet on the first day the gate ran -
 * the over-broad control that teaches everyone to reach for --no-verify.
 *
 * RECORD-OF-DEFECT. A file that RECORDS this defect necessarily names the paths it is recording, so
 * grading it is definitionally circular. Found by the gate refusing its own first commit:
 *   - `scripts/enforcement/close-artifact-census-baseline.json` lists the pinned dangling targets.
 *     If it were graded it could never name a broken path, which means it could never record debt.
 *   - `.github/enforcement-baseline.json` records violation fixtures that were INJECTED and removed,
 *     e.g. "Injected tracked _inbox/_r05_cu_citer.md". The rule for a control verified by violation
 *     is to exclude its events explicitly rather than let them inflate a count.
 *   - `scripts/enforcement/close-artifact-gate.mjs` carries synthetic paths in its own self-test
 *     fixtures (`_inbox/x.json`, `_inbox/a_close.json`). A test fixture is not a citation.
 *
 * The exemption does NOT cover the surfaces where the defect actually occurred. Plans of record,
 * session records, `_STATE.md`, the tracker, decisions, inbox reports and every other script are all
 * still graded. A row regraded CLOSED in OPS-17 while citing an absent close is the exact case this
 * catches, while the same citation in that lane's dispatch is correctly ignored.
 */
export const FORWARD_LOOKING_CITER = [
  /^_dispatches\//,
  /^_catalog\/dispatch_missions\//,
];

export const RECORD_OF_DEFECT_CITER = [
  /^\.github\/enforcement-baseline\.json$/,
  /^scripts\/enforcement\/close-artifact-census-baseline\.json$/,
  /^scripts\/enforcement\/close-artifact-gate\.mjs$/,
];

export function isForwardLookingCiter(rel) {
  const p = String(rel ?? "").replace(/\\/g, "/").replace(/^\.\//, "");
  return FORWARD_LOOKING_CITER.some((re) => re.test(p));
}

/** True when the citer mentions `_inbox/` paths without asserting they are available. */
export function isNonAssertingCiter(rel) {
  const p = String(rel ?? "").replace(/\\/g, "/").replace(/^\.\//, "");
  return FORWARD_LOOKING_CITER.some((re) => re.test(p)) || RECORD_OF_DEFECT_CITER.some((re) => re.test(p));
}

/**
 * Pure evaluator. Deps are injected so the whole thing can be exercised without git.
 *
 * @param {Array<{path:string,status:string}>} staged  status: A(dd) M(odify) D(elete) R(ename)
 * @param {{
 *   addedLines: (rel:string)=>string,
 *   treeHas:    (rel:string)=>boolean,
 *   diskHas:    (rel:string)=>boolean,
 *   worktreeLocations: (rel:string)=>string[],
 *   citersOf:   (rel:string)=>string[],
 * }} deps
 */
export function evaluate(staged, deps) {
  const added = [];
  const removed = [];

  const list = Array.isArray(staged) ? staged : (staged ?? []).map?.((path) => ({ path, status: "M" })) ?? [];
  for (const entry of list) {
    const rel = String(entry.path ?? entry).replace(/\\/g, "/");
    const status = String(entry.status ?? "M").toUpperCase().charAt(0);
    if (status === "D") { removed.push(rel); continue; }
    if (status === "R") continue; // a rename is reported as its own pair by git; graded via the target
    if (isNonAssertingCiter(rel)) continue; // a dispatch names a future output; a pin or a fixture records the defect
    let lines = "";
    try { lines = deps.addedLines(rel) ?? ""; } catch { lines = ""; }
    for (const target of extractCitations(lines)) added.push({ citer: rel, target });
  }

  const problems = [];

  // ARM 1 - a commit that cites an artifact the committed tree will not contain.
  const seen = new Set();
  for (const { citer, target } of added) {
    const key = `${citer}\u0000${target}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (deps.treeHas(target)) continue;
    let detail = "it is not in the index and not in HEAD";
    let fix = `git add "${target}"`;
    if (deps.diskHas(target)) {
      detail = "it exists on disk in THIS worktree but is not staged";
    } else {
      const where = deps.worktreeLocations(target) ?? [];
      if (where.length === 1) {
        detail = `it is not in this worktree at all; it exists in ${where[0]}`;
        fix = `copy it from ${where[0]} and git add "${target}"`;
      } else if (where.length > 1) {
        detail = `it is not in this worktree at all; it exists in ${where.length} other worktrees (${where.slice(0, 3).join(", ")}${where.length > 3 ? ", ..." : ""})`;
        fix = `copy it from one of those and git add "${target}"`;
      } else {
        detail = "it exists in no worktree and in no tree";
        fix = `produce it, or drop the citation of "${target}"`;
      }
    }
    problems.push(`${citer} cites \`${target}\`, which the committed tree will not contain: ${detail}.\n    ${fix}`);
  }

  // ARM 2 - the mirror. A commit that REMOVES an artifact tracked canon still cites.
  for (const target of removed) {
    if (!isConcreteInboxArtifact(target)) continue;
    // Same exemption, and it has to be applied to the CITERS here rather than the deleted path:
    // deleting a lane's output only matters if a record-of-fact still points at it.
    const citers = (deps.citersOf(target) ?? []).filter((c) => !removed.includes(c) && !isNonAssertingCiter(c));
    if (citers.length) {
      problems.push(
        `this commit deletes \`${target}\`, which ${citers.length} tracked file(s) still cite: ${citers.slice(0, 4).join(", ")}${citers.length > 4 ? ", ..." : ""}.\n    Repoint the citation(s) in the same commit, or do not delete it.`,
      );
    }
  }

  if (!problems.length) return { block: false, message: "" };
  return {
    block: true,
    message:
      `CLOSE ARTIFACT GATE refused the commit: a citation would dangle the moment this lands.\n` +
      problems.map((p, i) => `  ${i + 1}. ${p}`).join("\n") +
      `\n\nThe recurring defect this closes: a close produced in a seat worktree and never copied into main,` +
      ` leaving tracked canon citing a path no clone can see. Copy the artifact in the same commit as the citation.` +
      ` Do not bypass with --no-verify.`,
  };
}

// --------------------------------------------------------------------------------------------------
// git-backed deps and CLI
// --------------------------------------------------------------------------------------------------
const git = (args, cwd = HOME_REPO) =>
  execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 26 });

/** Concrete `_inbox/` artifacts git knows about in a given worktree's index/HEAD, cached per call. */
function worktreeArtifactIndex(root) {
  const found = new Map(); // artifact -> [worktree]
  try {
    for (const rel of git(["ls-files", "_inbox"], root).split(/\r?\n/).filter(Boolean)) {
      const n = rel.replace(/\\/g, "/");
      if (!isConcreteInboxArtifact(n)) continue;
      if (!found.has(n)) found.set(n, []);
      found.get(n).push(root.replace(/\\/g, "/"));
    }
  } catch { /* not a git worktree */ }
  return found;
}

function allWorktrees(root = HOME_REPO) {
  try {
    return git(["worktree", "list", "--porcelain"], root)
      .split(/\r?\n/)
      .filter((l) => l.startsWith("worktree "))
      .map((l) => l.slice("worktree ".length).trim())
      .map((w) => w.replace(/\\/g, "/"));
  } catch {
    return [root.replace(/\\/g, "/")];
  }
}

/**
 * Grade what is staged in the worktree at `root`, reading everything from git itself.
 *
 * Deliberately reads its own git state rather than borrowing `read()` from `git-commit-gates.mjs`,
 * for two reasons that are both correctness rather than taste:
 *   1. the added-lines view must be the DIFF, not the file. Grading against whole file content would
 *      re-grade the 77 historical dangling citations on every commit that touches the file they sit
 *      in, which is the over-broad control that teaches the fleet to reach for --no-verify;
 *   2. the deletion arm needs `--diff-filter=D`, which the sibling gates' staged read filters out.
 *
 * COST. A pre-commit hook runs on every commit, so the expensive half (walking sibling worktrees) is
 * reachable only after this commit is ALREADY refusing, and is skipped entirely when the commit adds
 * no concrete `_inbox/` citation, which is the overwhelming majority of commits.
 *
 * @param {string} root absolute path to the worktree being committed to
 */
export function evaluateStagedGit(root, gitFn = git) {
  const nameStatus = gitFn(["diff", "--cached", "--name-status", "--diff-filter=ACMRD"], root)
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("\t");
      return { status: parts[0].trim().charAt(0), path: (parts[parts.length - 1] ?? "").trim().replace(/\\/g, "/") };
    })
    .filter((e) => e.path);

  const deleted = nameStatus.filter((e) => e.status === "D").map((e) => e.path);
  const touched = nameStatus.filter((e) => e.status !== "D").map((e) => e.path);

  // Fast path: no touched text file, or no added `_inbox/` citation anywhere in the diff, means
  // there is nothing for this gate to say. Read the diff once, not per file.
  const addedByFile = new Map();
  let anyCitation = false;
  if (touched.length) {
    let diffText = "";
    try { diffText = gitFn(["diff", "--cached", "-U0"], root); } catch { diffText = ""; }
    let current = null;
    for (const line of diffText.split(/\r?\n/)) {
      if (line.startsWith("+++ b/")) { current = line.slice(6).trim(); addedByFile.set(current, []); continue; }
      if (current && line.startsWith("+") && !line.startsWith("+++")) {
        addedByFile.get(current).push(line.slice(1));
      }
    }
    for (const lines of addedByFile.values()) {
      if (extractCitations(lines.join("\n")).size) { anyCitation = true; break; }
    }
  }
  if (!anyCitation && !deleted.some(isConcreteInboxArtifact)) return { block: false, message: "" };

  const stagedSet = new Set(touched);
  const headSet = new Set(
    gitFn(["ls-tree", "-r", "--name-only", "HEAD"], root).split(/\r?\n/).filter(Boolean).map((p) => p.replace(/\\/g, "/")),
  );
  const deletedSet = new Set(deleted);
  const treeHas = (rel) => stagedSet.has(rel) || (headSet.has(rel) && !deletedSet.has(rel));

  let worktreeCache = null;
  const worktreeLocations = (rel) => {
    if (worktreeCache === null) {
      worktreeCache = new Map();
      for (const wt of allWorktrees(root)) {
        const w = wt.replace(/\\/g, "/");
        if (w === root.replace(/\\/g, "/")) continue;
        for (const [artifact, roots] of worktreeArtifactIndex(w)) {
          if (!worktreeCache.has(artifact)) worktreeCache.set(artifact, new Set());
          for (const r of roots) worktreeCache.get(artifact).add(r);
        }
      }
    }
    return [...(worktreeCache.get(rel) ?? [])];
  };

  // One indexed search per deleted artifact rather than a full scan of HEAD.
  const citersOf = (rel) => {
    try {
      return gitFn(["grep", "-l", "--fixed-strings", "--", rel, "HEAD", "--", "*.md", "*.json", "*.mdc", "*.txt"], root)
        .split(/\r?\n/)
        .map((l) => l.replace(/^HEAD:/, "").trim().replace(/\\/g, "/"))
        .filter(Boolean);
    } catch {
      return []; // git grep exits 1 on no match
    }
  };

  return evaluate(nameStatus, {
    addedLines: (rel) => (addedByFile.get(rel) ?? []).join("\n"),
    treeHas,
    diskHas: (rel) => existsSync(join(root, rel)),
    worktreeLocations,
    citersOf,
  });
}

function census(asJson, quiet = false) {
  const headSet = new Set(git(["ls-tree", "-r", "--name-only", "HEAD"]).split(/\r?\n/).filter(Boolean).map((p) => p.replace(/\\/g, "/")));

  // One indexed search over HEAD rather than a `git show` per tracked file. The per-file version of
  // this took minutes on 8,978 files, which is not a cost a control can carry.
  let grepOut = "";
  try {
    grepOut = git(["grep", "-I", "-o", "-E", "_inbox/[A-Za-z0-9._/-]+", "HEAD", "--", "*.md", "*.json", "*.mdc", "*.txt"]);
  } catch {
    grepOut = ""; // git grep exits 1 when there is no match
  }
  const absent = new Map();
  let cited = 0;
  let exempted = new Set();
  for (const line of grepOut.split(/\r?\n/)) {
    if (!line) continue;
    // `HEAD:path:match`; the path may not contain a colon, the match never does.
    const m = /^HEAD:(.+?):(_inbox\/[A-Za-z0-9._/-]+)$/.exec(line);
    if (!m) continue;
    const citer = m[1].replace(/\\/g, "/");
    const target = normalizeCitation(m[2]);
    if (!target || !isConcreteInboxArtifact(target)) continue;
    if (isNonAssertingCiter(citer)) { exempted.add(target); continue; }
    cited++;
    if (!headSet.has(target)) {
      if (!absent.has(target)) absent.set(target, new Set());
      absent.get(target).add(citer);
    }
  }

  // Worktree-resident artifacts are DIAGNOSTIC, not a gate condition. A lane in flight legitimately
  // holds its own close in its own worktree until it merges, so a non-zero count here is the normal
  // state of a busy fleet. It is reported because it answers "where did the file go", which is the
  // difference between this gate blocking and this gate being actionable.
  const stranded = new Map();
  for (const wt of allWorktrees()) {
    if (wt === HOME_REPO) continue;
    if (!existsSync(join(wt, "_inbox"))) continue; // cheap pre-filter before spawning git
    for (const [artifact, roots] of worktreeArtifactIndex(wt)) {
      if (headSet.has(artifact)) continue;
      if (existsSync(join(HOME_REPO, artifact))) continue;
      if (!stranded.has(artifact)) stranded.set(artifact, new Set());
      for (const r of roots) stranded.get(artifact).add(r);
    }
  }
  const payload = {
    head: git(["rev-parse", "--short", "HEAD"]).trim(),
    citedConcrete: cited,
    exemptForwardLookingTargets: [...exempted].sort(),
    dangling: [...absent.entries()].map(([target, citers]) => ({ target, citers: [...citers] })).sort((a, b) => a.target.localeCompare(b.target)),
    strandedInWorktrees: [...stranded.entries()].map(([target, worktrees]) => ({ target, worktrees: [...worktrees] })).sort((a, b) => a.target.localeCompare(b.target)),
  };
  if (asJson) { if (!quiet) console.log(JSON.stringify(payload, null, 2)); return payload; }
  console.log(`HEAD ${payload.head} | graded concrete citations ${cited} | dangling ${payload.dangling.length} | exempted as forward-looking ${payload.exemptForwardLookingTargets.length} | resident in a seat worktree ${payload.strandedInWorktrees.length} (diagnostic, not a failure)`);
  for (const d of payload.dangling) console.log(`  DANGLING ${d.target}\n      cited by ${d.citers.slice(0, 4).join(", ")}${d.citers.length > 4 ? `, +${d.citers.length - 4}` : ""}`);
  for (const s of payload.strandedInWorktrees) console.log(`  STRANDED ${s.target}\n      lives only in ${s.worktrees.slice(0, 3).join(", ")}${s.worktrees.length > 3 ? `, +${s.worktrees.length - 3}` : ""}`);
  return payload;
}

/**
 * The pin. `--census` alone would exit 2 forever on the same historical citations, and a control
 * that cannot get worse is not a measurement. So the debt is counted and pinned here, the same way
 * `.github/enforcement-baseline.json` pins per-control exit codes: known debt is admitted, NEW debt
 * fails, and the pin may only ever move down.
 *
 * The pin holds COUNTS, not an exit code, because the interesting event is one MORE dangling
 * citation and a 0/1/2 exit code cannot express that.
 */
const PIN_PATH = join(HOME_REPO, "scripts", "enforcement", "close-artifact-census-baseline.json");

function readPin() {
  if (!existsSync(PIN_PATH)) return null;
  const raw = JSON.parse(String(readFileSync(PIN_PATH, "utf8")));
  if (!raw || typeof raw.dangling !== "number") {
    throw new Error(`${PIN_PATH} is present but does not declare a numeric \`dangling\`. A pin that cannot be read is not a pin.`);
  }
  return raw;
}

function check() {
  const pin = readPin();
  if (!pin) {
    console.error(`REFUSING: no census pin at ${PIN_PATH}. Run --census, review the count, and pin it. A ratchet with no baseline admits everything.`);
    process.exit(1);
  }
  const payload = census(true, true);
  const actual = payload.dangling.length;
  if (actual > pin.dangling) {
    const pinned = new Set(pin.targets ?? []);
    const fresh = payload.dangling.filter((d) => !pinned.has(d.target));
    console.error(`CLOSE ARTIFACT CENSUS REGRESSED: dangling citations ${pin.dangling} -> ${actual} (pin: ${pin.snapshot ?? "unstated"}).`);
    console.error(`New dangling citation(s):`);
    for (const d of fresh.slice(0, 25)) console.error(`  ${d.target}\n      cited by ${d.citers.slice(0, 4).join(", ")}`);
    if (fresh.length > 25) console.error(`  ... ${fresh.length - 25} more`);
    console.error(`\nEither bring the artifact into the tree, or drop the citation. Do not raise the pin.`);
    process.exit(2);
  }
  if (actual < pin.dangling) {
    console.log(`IMPROVED: dangling citations ${pin.dangling} -> ${actual}. Lower \`dangling\` and drop the cleared entries from \`targets\` in ${PIN_PATH} in this same commit, or the pin silently re-admits what was just cleared.`);
    process.exit(0);
  }
  console.log(`OK: dangling citations ${actual}, at the pinned ${pin.dangling} (${pin.snapshot ?? "unstated"}).`);
}

/**
 * Prove the pin can FAIL, in-tree, so the claim in `.github/enforcement-baseline.json` is reproducible
 * by anyone with a clone rather than resting on a script that lived in `P:/tmp` and is gone.
 *
 * Injects the exact event the control exists to catch: one more dangling citation, expressed by
 * lowering the pin by one and shortening its target list. Restores in a `finally`, so a crash cannot
 * leave the pin corrupted.
 */
function falsifyPin() {
  const original = readFileSync(PIN_PATH, "utf8");
  const pin = JSON.parse(original);
  if (typeof pin.dangling !== "number" || !Array.isArray(pin.targets) || pin.targets.length !== pin.dangling) {
    throw new Error(`REFUSING: the pin declares dangling=${pin.dangling} but ${pin.targets?.length} targets; it cannot be falsified as written.`);
  }
  const runSelf = () => spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--check"], { cwd: HOME_REPO, encoding: "utf8" });

  let failures = 0;
  const check = (name, ok, detail = "") => { console.log(`  ${ok ? "ok  " : "FAIL"} ${name}${detail ? `  ${detail}` : ""}`); if (!ok) failures++; };

  const before = runSelf();
  check("BASELINE: the control passes at its own pin", before.status === 0, `exit=${before.status}`);
  check("  and it states the count, not just OK", new RegExp(String(pin.dangling)).test(before.stdout ?? ""));

  const dropped = pin.targets[pin.targets.length - 1];
  let during;
  try {
    writeFileSync(PIN_PATH, JSON.stringify({ ...pin, dangling: pin.dangling - 1, targets: pin.targets.slice(0, -1), snapshot: `${pin.snapshot} [FALSIFICATION INJECTION - restored byte-identical]` }, null, 2) + "\n", "utf8");
    during = runSelf();
  } finally {
    writeFileSync(PIN_PATH, original, "utf8");
  }

  check("VIOLATION: the control FAILS when tracked canon gains one dangling citation", during.status === 2, `exit=${during.status}`);
  check("  the failure names it a regression with both counts", new RegExp(`${pin.dangling - 1} -> ${pin.dangling}`).test(during.stderr ?? ""));
  check("  the failure names the fresh citation, not just a number", (during.stderr ?? "").includes(dropped));
  check("  the failure says not to raise the pin", /Do not raise the pin/.test(during.stderr ?? ""));

  const after = runSelf();
  check("RESTORE: byte-identical restore returns the control to passing", after.status === 0, `exit=${after.status}`);
  check("  the pin is byte-identical to the original", readFileSync(PIN_PATH, "utf8") === original);

  console.log(failures ? `\nPIN FALSIFICATION FAILED (${failures})` : "\nPIN FALSIFICATION OK: the pin fires on a new dangling citation and passes again after a byte-identical restore");
  if (!failures) console.log(`injected violation was: ${dropped}`);
  process.exit(failures ? 1 : 0);
}

function selfTest() {
  let failures = 0;
  const check = (name, ok, detail = "") => { console.log(`  ${ok ? "ok  " : "FAIL"} ${name}${detail ? `  ${detail}` : ""}`); if (!ok) failures++; };

  console.log("close-artifact-gate self-test");
  console.log(" A. the classifier must admit only concrete artifacts");
  check("a real close is concrete", isConcreteInboxArtifact("_inbox/2026-09-18_g146-design-declarations_close.json") === true);
  check("a glob is not", isConcreteInboxArtifact("_inbox/*_close.json") === false);
  check("a template is not", isConcreteInboxArtifact("_inbox/<date>_<lane id>_close.json") === false);
  check("an ellipsis is not", isConcreteInboxArtifact("_inbox/â€¦") === false);
  check("a directory is not", isConcreteInboxArtifact("_inbox/x/") === false);
  check("lane scratch is not", isConcreteInboxArtifact("_inbox/_tmp_lane.md") === false);
  check("a different band is not", isConcreteInboxArtifact("_catalog/lane_claims.json") === false);

  console.log(" B. extraction sees all three syntactic forms");
  const three = extractCitations('span `_inbox/a_close.json` link [_inbox/b_cp1.json](x) json "artifact": "_inbox/c_cp2.json" prose _inbox/d_close.json.');
  check("code span, link, JSON value and bare prose all found", ["a_close.json", "b_cp1.json", "c_cp2.json", "d_close.json"].every((n) => [...three].some((t) => t.endsWith(n))), `${three.size} found`);
  check("a trailing full stop is not part of the path", three.has("_inbox/d_close.json") && !three.has("_inbox/d_close.json."));

  console.log(" C. the evaluator must fire on a violation and pass on a conforming commit");
  const base = {
    addedLines: () => 'see `_inbox/2026-09-19_lane_close.json`',
    treeHas: () => false,
    diskHas: () => false,
    worktreeLocations: () => [],
    citersOf: () => [],
  };
  const burns = evaluate([{ path: "90_operations/OPS-17_x.md", status: "M" }], base);
  check("FIRES: a staged citation to an artifact not in the tree", burns.block === true);
  check("the refusal names the citing file", /OPS-17_x\.md/.test(burns.message));
  check("the refusal names the artifact", /2026-09-19_lane_close\.json/.test(burns.message));

  const coStaged = evaluate(
    [{ path: "90_operations/OPS-17_x.md", status: "M" }, { path: "_inbox/2026-09-19_lane_close.json", status: "A" }],
    { ...base, treeHas: (t) => t.startsWith("_inbox/") },
  );
  check("PASSES: the artifact is committed alongside the citation", coStaged.block === false);

  const notAdded = evaluate([{ path: "90_operations/OPS-17_x.md", status: "M" }], { ...base, diskHas: () => true });
  check("FIRES: the artifact is on disk but unstaged", notAdded.block === true);
  check("and says so, with the one-command fix", /not staged/.test(notAdded.message) && /git add/.test(notAdded.message));

  const elsewhere = evaluate([{ path: "90_operations/OPS-17_x.md", status: "M" }], { ...base, worktreeLocations: () => ["P:/seat-worktrees/lane-x/doc_repo"] });
  check("FIRES: the artifact lives only in a seat worktree", elsewhere.block === true);
  check("and names the worktree that holds it", /seat-worktrees\/lane-x/.test(elsewhere.message));

  // The gate reads ADDED lines only, never whole file content. That is what keeps it arming with no
  // allowlist: a historical dangling citation sitting on an untouched line is the census's business,
  // not this gate's. The first version of this test asserted the right property with a fixture that
  // returned the citation FROM addedLines, so it was asserting nothing. An empty diff is the honest
  // fixture for an unchanged line.
  const untouched = evaluate([{ path: "90_operations/OPS-17_x.md", status: "M" }], { ...base, addedLines: () => "" });
  check("PASSES: a historical dangling citation on an UNCHANGED line is not re-graded, so the gate needs no allowlist", untouched.block === false);
  check("  (that half is the census's job, not the gate's)", burns.block && !untouched.block);

  console.log(" D. arm 2, the mirror: removing an artifact canon still cites");
  const deleted = evaluate([{ path: "_inbox/2026-09-19_lane_close.json", status: "D" }], { ...base, citersOf: () => ["90_operations/OPS-17_x.md"] });
  check("FIRES: deleting a cited artifact", deleted.block === true);
  check("the refusal names a citer", /OPS-17_x\.md/.test(deleted.message));
  const deletedUncited = evaluate([{ path: "_inbox/2026-09-19_lane_close.json", status: "D" }], { ...base, citersOf: () => [] });
  check("PASSES: deleting an artifact nothing cites", deletedUncited.block === false);

  console.log(" F. the exemption must be narrow, and must not cover the surfaces the defect happens on");
  check("a dispatch is exempt (it names its lane's FUTURE output)", isForwardLookingCiter("_dispatches/2026-09-17_p323-tag-hygiene_dispatch.md") === true);
  check("a mission is exempt (same reason)", isForwardLookingCiter("_catalog/dispatch_missions/mission_p80_travis_join.md") === true);
  check("the pin is exempt (it RECORDS the defect, so grading it is circular)", isNonAssertingCiter("scripts/enforcement/close-artifact-census-baseline.json") === true);
  check("this gate's own source is exempt (its fixtures are synthetic paths)", isNonAssertingCiter("scripts/enforcement/close-artifact-gate.mjs") === true);
  check("the enforcement baseline is exempt (it records INJECTED fixtures)", isNonAssertingCiter(".github/enforcement-baseline.json") === true);
  check("a plan of record is NOT exempt", isNonAssertingCiter("90_operations/OPS-17_govtech_stack_plan_of_record.md") === false);
  check("a session record is NOT exempt", isNonAssertingCiter("_sessions/2026-09-18_x_close.md") === false);
  check("_STATE.md is NOT exempt", isNonAssertingCiter("_STATE.md") === false);
  check("a tracker is NOT exempt", isNonAssertingCiter("_design/SMARTCITY_TRACKER.md") === false);
  check("an inbox report is NOT exempt", isNonAssertingCiter("_inbox/2026-09-18_g142-citizen-lens_close.json") === false);
  check("another enforcement script is NOT exempt", isNonAssertingCiter("scripts/enforcement/cited-untracked.mjs") === false);
  check("the pin exemption does not leak to the whole scripts/ tree", isNonAssertingCiter("scripts/enforcement/close-artifact-gate-notes.md") === false);

  const dispatchCiter = evaluate([{ path: "_dispatches/2026-09-19_zz_dispatch.md", status: "A" }], base);
  check("PASSES: a dispatch naming its lane's future close is not a violation", dispatchCiter.block === false);
  const pinCiter = evaluate([{ path: "scripts/enforcement/close-artifact-census-baseline.json", status: "M" }], base);
  check("PASSES: the pin listing 107 dangling targets is not 107 violations", pinCiter.block === false);
  const sameInRow = evaluate([{ path: "90_operations/OPS-17_govtech_stack_plan_of_record.md", status: "M" }], base);
  check("FIRES: the SAME citation written into a plan of record is a violation", sameInRow.block === true);
  check("  (this pair is the whole reason the exemption is safe to grant)", dispatchCiter.block === false && sameInRow.block === true);

  const deleteByDispatchOnly = evaluate([{ path: "_inbox/2026-09-19_lane_close.json", status: "D" }], { ...base, citersOf: () => ["_dispatches/2026-09-19_zz_dispatch.md"] });
  check("PASSES: deleting an artifact only a dispatch names", deleteByDispatchOnly.block === false);
  const deleteByRow = evaluate([{ path: "_inbox/2026-09-19_lane_close.json", status: "D" }], { ...base, citersOf: () => ["_dispatches/2026-09-19_zz_dispatch.md", "90_operations/OPS-17_govtech_stack_plan_of_record.md"] });
  check("FIRES: deleting an artifact a record-of-fact still cites, even if a dispatch also names it", deleteByRow.block === true);

  console.log(" E. end to end, through the REAL pre-commit hook in a temp repo");
  const tmp = mkdtempSync(join(tmpdir(), "close-artifact-gate-"));
  const repo = join(tmp, "repo").replace(/\\/g, "/");
  const hooks = `${HOME_REPO}/.githooks`;
  const run = (args, cwd) => { try { git(args, cwd); return { ok: true, out: "", err: "" }; } catch (e) { return { ok: false, out: String(e.stdout ?? ""), err: String(e.stderr ?? e.message) }; } };
  try {
    mkdirSync(repo);
    git(["init", "-q", "-b", "main"], repo);
    for (const [k, v] of [["user.name", "gate-test"], ["user.email", "gate-test@example.invalid"], ["core.hooksPath", hooks], ["core.autocrlf", "false"]]) git(["config", k, v], repo);
    mkdirSync(join(repo, "_inbox"));
    mkdirSync(join(repo, "_dispatches"));
    writeFileSync(join(repo, "_dispatches", "2026-09-19_zz-lane_dispatch.md"), "PLAN-ROW: P-252\nFAN-DEPTH: 0\n");
    writeFileSync(join(repo, "README.md"), "base\n");
    git(["add", "--", "README.md", "_dispatches/2026-09-19_zz-lane_dispatch.md"], repo);
    check("baseline commit lands", run(["commit", "-q", "-m", "base"], repo).ok);

    writeFileSync(join(repo, "OPS.md"), "Lane zz closed; see `_inbox/2026-09-19_zz-lane_close.json`.\n");
    git(["add", "--", "OPS.md"], repo);
    const violated = run(["commit", "-q", "-m", "cite a stranded close"], repo);
    check("VIOLATION: the real hook refuses a commit citing an artifact it does not bring", !violated.ok && /CLOSE ARTIFACT GATE/.test(violated.err));

    // Prove the refusal is not a blanket block: bring the artifact in the same commit and it passes.
    writeFileSync(join(repo, "_inbox", "2026-09-19_zz-lane_close.json"), JSON.stringify({ lane: "zz-lane", planRows: ["P-252"], status: "closed", probe: { notApplicable: "test" }, subAgents: { spawned: 0, maxDepth: 0 } }));
    git(["add", "--", "_inbox/2026-09-19_zz-lane_close.json"], repo);
    const fixed = run(["commit", "-q", "-m", "cite and bring the close"], repo);
    check("VIOLATION CLEARED: committing the artifact alongside the citation passes", fixed.ok, fixed.ok ? "" : fixed.err.slice(0, 300));

    // And it must fire in a linked worktree, which is where the defect actually happens.
    const wt = join(tmp, "wt").replace(/\\/g, "/");
    run(["worktree", "add", "-q", "-b", "seat/zz", wt], repo);
    writeFileSync(join(wt, "OPS2.md"), "Lane yy closed; see `_inbox/2026-09-19_yy-lane_close.json`.\n");
    git(["add", "--", "OPS2.md"], wt);
    const inWt = run(["commit", "-q", "-m", "cite from a seat worktree"], wt);
    check("VIOLATION: the same citation is refused in a LINKED WORKTREE (where the defect happens)", !inWt.ok && /CLOSE ARTIFACT GATE/.test(inWt.err));

    let common = git(["rev-parse", "--git-common-dir"], repo).trim();
    if (!isAbsolute(common)) common = join(repo, common);
    check("the refusal left a record in the shared git directory", existsSync(join(common, "commit-gate-refusals.log")));
  } finally {
    try { rmSync(tmp, { recursive: true, force: true }); } catch { /* best effort */ }
  }

  console.log(failures ? `\nSELF-TEST FAILED (${failures})` : "\nSELF-TEST OK");
  process.exit(failures ? 1 : 0);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const arg = process.argv[2];
  if (arg === "--self-test") selfTest();
  else if (arg === "--falsify-pin") falsifyPin();
  else if (arg === "--census") { const p = census(false); process.exit(p.dangling.length ? 2 : 0); }
  else if (arg === "--json") census(true);
  // No argument is the CI contract: `ci-baseline.mjs` spawns each control with no arguments and
  // grades its exit code, so the default must be the ratchet check, not a usage error.
  else if (arg === undefined || arg === "" || arg === "--check") check();
  else { console.error("usage: close-artifact-gate.mjs [--check] | --self-test | --falsify-pin | --census | --json"); process.exit(2); }
}
