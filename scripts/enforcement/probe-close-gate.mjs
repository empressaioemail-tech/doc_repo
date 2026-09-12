#!/usr/bin/env node
/**
 * probe-close-gate.mjs — R-4 of OPS-23 as a control, not a sentence.
 *
 * RULE. A lane close for an OPS-23 row (P-151..P-167) may not be committed to doc_repo unless
 * it cites a surface-probe artifact (`probe.artifact`, a path under _inbox/ produced by
 * scripts/surface-probe.mjs) and that artifact's predicates for the close's rows are all
 * PASS. A row with no predicate in the instrument (the instrument rows themselves) needs only
 * an existing, parseable artifact.
 *
 * THE THREE-QUESTION GATE.
 *   1. What executes this?  .claude/hooks/probe-close-gate.mjs, which imports evaluate() below.
 *   2. What triggers it?    PreToolUse on Bash, on any `git commit` whose staged set contains
 *                           an _inbox/*_close.json for an OPS-23 row.
 *   3. What fails?          The commit is blocked (exit 2, {"block":true}) with the reason.
 *   4. What bypasses it?    A commit made outside this harness (another seat's terminal, a GUI
 *                           client) -- named here; the close reviewer is the only control there
 *                           and is not one. A close JSON with no planRows field is treated as
 *                           not-OPS-23 and allowed; that is the honest scope, not a hole to
 *                           widen (a control broader than its claim is a defect).
 *
 * FAILS LOUD on an unparseable close (a close that cannot be read is itself the defect), and
 * OPEN only when git itself cannot run, printing that it could not.
 *
 *   node scripts/enforcement/probe-close-gate.mjs --self-test
 */

import { readFileSync, existsSync, mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const DOC_REPO = process.env.EMPRESSA_DOC_REPO?.replace(/\\/g, "/") || resolve(HERE, "..", "..").replace(/\\/g, "/");

export const GATED_ROW = /^P-1(5[1-9]|6[0-7])$/;
/** Instrument rows: no predicate in surface-probe.mjs; an existing, parseable artifact suffices. */
export const ROWS_WITHOUT_PREDICATE = new Set(["P-160", "P-162", "P-170"]);

export function isGitCommit(command) {
  return /(^|[;&|]\s*)git\s+(-C\s+\S+\s+)?commit\b/.test(String(command ?? ""));
}

/**
 * A command that stages and commits in one string (`git add ... && git commit`, or
 * `git commit -a` / `--all` / `-A`) defeats this gate, which reads the index when the tool
 * call starts, before the add has run. Found live 2026-09-12: a violating close staged and
 * committed in one Bash call went through as 213f5369 (reverted). Such commands are refused
 * outright when they target doc_repo; stage in one call, commit in the next.
 */
export function stagesInSameCommand(command) {
  const c = String(command ?? "");
  if (!isGitCommit(c)) return false;
  if (/(^|[;&|]\s*)git\s+(-C\s+\S+\s+)?add\b/.test(c)) return true;
  if (/git\s+(-C\s+\S+\s+)?commit\b[^;&|]*\s(-[a-zA-Z]*[aA][a-zA-Z]*|--all)\b/.test(c)) return true;
  return false;
}

/** doc_repo is the target when `git -C <doc_repo>` names it or the cwd is inside it. */
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
  } catch {
    return null; // git unavailable: caller fails open and says so
  }
}

/**
 * Pure evaluation over a staged file list and a reader. Returns { block, message }.
 * `read(path)` returns file text or null when the file does not exist.
 */
export function evaluate(staged, read) {
  const closes = staged.filter((f) => /(^|\/)_inbox\/[^/]*_close\.json$/.test(f.replace(/\\/g, "/")));
  const problems = [];
  for (const path of closes) {
    const text = read(path);
    if (text == null) continue; // deleted in this commit; nothing to gate
    let close;
    try { close = JSON.parse(text); } catch (e) {
      problems.push(`${path}: close is not valid JSON (${e.message}); an unreadable close is itself the defect`);
      continue;
    }
    // Rows may arrive as `planRows` (array or string) or `planRow` (singular). 2026-09-11 wave 1:
    // three lane closes used the singular and this gate silently skipped them. A close whose
    // lane id names an OPS-23 row but that carries no row field at all is refused, not skipped.
    const rowField = close.planRows ?? close.planRow;
    const rows = Array.isArray(rowField) ? rowField : typeof rowField === "string" ? rowField.split(/[,\s]+/) : [];
    const gated = rows.map((r) => String(r).trim()).filter((r) => GATED_ROW.test(r));
    if (gated.length === 0) {
      const laneHint = /\bP-?1(5[1-9]|6[0-7])\b/i.test(String(close.lane ?? "") + " " + path);
      if (laneHint && rowField == null) problems.push(`${path}: lane ${close.lane ?? path} names an OPS-23 row but the close carries no planRows/planRow field; the gate cannot evaluate what it cannot see`);
      continue; // not an OPS-23 close (or refused above): out of scope by design
    }
    // A close may be PARTIAL (status says partial or blocked, or `partial: true`): it must still
    // cite a probe artifact that measured its rows, but the verdict may be FAIL or UNMEASURED,
    // because a partial close is the honest record of an unfinished row. A close that claims
    // to be closed must be PASS on every parcel.
    const statusText = String(close.status ?? "");
    const isPartial = close.partial === true || /partial|blocked|stopped/i.test(statusText);
    const cite = close.probe?.artifact;
    if (typeof cite !== "string" || !cite.trim()) {
      problems.push(`${path}: OPS-23 rows ${gated.join(",")} ${isPartial ? "partially closed" : "closed"} with no probe.artifact. R-4: a lane closes, even partially, on a surface-probe artifact, never on a merge, a cortex read, a ledger count or an MCP read.`);
      continue;
    }
    const art = read(cite.replace(/\\/g, "/"));
    if (art == null) { problems.push(`${path}: probe.artifact ${cite} does not exist in doc_repo`); continue; }
    let probe;
    try { probe = JSON.parse(art); } catch { problems.push(`${path}: probe.artifact ${cite} is not valid JSON`); continue; }
    if (probe.instrument !== "scripts/surface-probe.mjs" || !Array.isArray(probe.results)) {
      problems.push(`${path}: probe.artifact ${cite} was not produced by scripts/surface-probe.mjs (instrument=${probe.instrument ?? "missing"})`);
      continue;
    }
    for (const row of gated) {
      const rs = probe.results.filter((r) => r.row === row);
      if (rs.length === 0) {
        if (ROWS_WITHOUT_PREDICATE.has(row)) continue;
        problems.push(`${path}: probe.artifact ${cite} carries no predicate results for ${row}; run the probe with --rows ${row}`);
        continue;
      }
      const notPass = rs.filter((r) => r.verdict !== "PASS");
      if (notPass.length && !isPartial) {
        problems.push(`${path}: ${row} is not PASS in ${cite}: ${notPass.map((r) => `${r.parcel} ${r.verdict}`).join("; ")}. UNMEASURED is not a pass; a close that is not PASS must say partial or blocked in its status.`);
      }
    }
  }
  return problems.length ? { block: true, message: `PROBE CLOSE GATE (OPS-23 R-4) refused the commit:\n- ${problems.join("\n- ")}` } : { block: false, message: "" };
}

// ---------------------------------------------------------------------------- self-test
export function selfTest() {
  let failures = 0;
  const check = (name, ok, detail = "") => { console.log(`  ${ok ? "ok  " : "FAIL"} ${name}${detail ? "  " + detail : ""}`); if (!ok) failures++; };
  console.log("probe-close-gate self-test");
  const dir = mkdtempSync(join(tmpdir(), "probe-close-gate-"));
  mkdirSync(join(dir, "_inbox"));
  const files = {};
  const put = (rel, obj) => { files[rel] = typeof obj === "string" ? obj : JSON.stringify(obj); writeFileSync(join(dir, rel), files[rel]); };
  const read = (rel) => (rel in files ? files[rel] : null);

  put("_inbox/2026-09-11_x_surface_probe.json", { instrument: "scripts/surface-probe.mjs", results: [
    { row: "P-151", parcel: "48453:113408", verdict: "PASS" }, { row: "P-151", parcel: "48453:474034", verdict: "PASS" },
    { row: "P-153", parcel: "48021:34049", verdict: "UNMEASURED" },
  ] });
  put("_inbox/2026-09-11_p151-seam_close.json", { lane: "P151-SEAM", planRows: ["P-151"], probe: { artifact: "_inbox/2026-09-11_x_surface_probe.json" } });
  put("_inbox/2026-09-11_p153-draw_close.json", { lane: "P153-DRAW", planRows: ["P-153"], probe: { artifact: "_inbox/2026-09-11_x_surface_probe.json" } });
  put("_inbox/2026-09-11_noprobe_close.json", { lane: "P151-SEAM", planRows: ["P-151"] });
  put("_inbox/2026-09-11_missing_close.json", { lane: "P151-SEAM", planRows: ["P-151"], probe: { artifact: "_inbox/nope.json" } });
  put("_inbox/2026-09-11_ctx-b9_close.json", { lane: "CTX-B9", planRows: ["P-124"] });
  put("_inbox/2026-09-11_bad_close.json", "{ not json");
  put("_inbox/2026-09-11_p160-probe_close.json", { lane: "P160-PROBE", planRows: ["P-160"], probe: { artifact: "_inbox/2026-09-11_x_surface_probe.json" } });
  put("_inbox/2026-09-11_fake_close.json", { lane: "P151-SEAM", planRows: ["P-151"], probe: { artifact: "_inbox/2026-09-11_notaprobe.json" } });
  put("_inbox/2026-09-11_notaprobe.json", { instrument: "something-else", results: [] });

  check("no closes staged -> allow", evaluate(["90_operations/x.md"], read).block === false);
  check("non-OPS-23 close -> allow (scope narrow by design)", evaluate(["_inbox/2026-09-11_ctx-b9_close.json"], read).block === false);
  check("OPS-23 close with no probe -> BLOCK", evaluate(["_inbox/2026-09-11_noprobe_close.json"], read).block === true);
  check("OPS-23 close citing a missing artifact -> BLOCK", evaluate(["_inbox/2026-09-11_missing_close.json"], read).block === true);
  check("OPS-23 close citing a non-probe file -> BLOCK", evaluate(["_inbox/2026-09-11_fake_close.json"], read).block === true);
  check("OPS-23 close whose row is UNMEASURED -> BLOCK (unmeasured is not a pass)", evaluate(["_inbox/2026-09-11_p153-draw_close.json"], read).block === true);
  check("OPS-23 close whose row is PASS -> allow", evaluate(["_inbox/2026-09-11_p151-seam_close.json"], read).block === false);
  check("instrument row with a parseable artifact -> allow", evaluate(["_inbox/2026-09-11_p160-probe_close.json"], read).block === false);
  check("unparseable close -> BLOCK (loud, not open)", evaluate(["_inbox/2026-09-11_bad_close.json"], read).block === true);

  // 2026-09-11 wave 1 exposed two defects: closes with `planRow` (singular) were silently skipped,
  // and an honest partial close could never be committed. Both directions for each.
  put("_inbox/2026-09-11_singular_close.json", { lane: "P153-DRAW", planRow: "P-153", probe: { artifact: "_inbox/2026-09-11_x_surface_probe.json" } });
  check("planRow (singular) is evaluated, not skipped: UNMEASURED without partial status -> BLOCK", evaluate(["_inbox/2026-09-11_singular_close.json"], read).block === true);
  put("_inbox/2026-09-11_norows_close.json", { lane: "P155-FEASIBILITY", status: "closed-partial", probe: { artifact: "_inbox/2026-09-11_x_surface_probe.json" } });
  check("OPS-23 lane close with no row field at all -> BLOCK (cannot evaluate what it cannot see)", evaluate(["_inbox/2026-09-11_norows_close.json"], read).block === true);
  put("_inbox/2026-09-11_partial_close.json", { lane: "P153-DRAW", planRows: ["P-153"], status: "closed-partial: overlay not yet observed", probe: { artifact: "_inbox/2026-09-11_x_surface_probe.json" } });
  check("partial close citing an artifact where the row is UNMEASURED -> allow (an honest partial is a record)", evaluate(["_inbox/2026-09-11_partial_close.json"], read).block === false);
  put("_inbox/2026-09-11_partial_noprobe_close.json", { lane: "P153-DRAW", planRows: ["P-153"], status: "blocked at CP1" });
  check("partial close with no artifact -> BLOCK (partial still measures)", evaluate(["_inbox/2026-09-11_partial_noprobe_close.json"], read).block === true);
  put("_inbox/2026-09-11_fullclaim_close.json", { lane: "P153-DRAW", planRows: ["P-153"], status: "closed", probe: { artifact: "_inbox/2026-09-11_x_surface_probe.json" } });
  check("close claiming closed on an UNMEASURED row -> BLOCK", evaluate(["_inbox/2026-09-11_fullclaim_close.json"], read).block === true);
  put("_inbox/2026-09-11_partialflag_close.json", { lane: "P153-DRAW", planRows: ["P-153"], partial: true, probe: { artifact: "_inbox/2026-09-11_x_surface_probe.json" } });
  check("partial: true flag is honoured like a partial status -> allow", evaluate(["_inbox/2026-09-11_partialflag_close.json"], read).block === false);
  check("a deleted close (unreadable) -> allow", evaluate(["_inbox/2026-09-11_gone_close.json"], read).block === false);
  check("isGitCommit matches plain and -C forms", isGitCommit("git commit -m x") && isGitCommit("cd P:/doc_repo && git -C P:/doc_repo commit -F m.txt") && !isGitCommit("git status && echo commit"));
  check("stagesInSameCommand: add && commit -> true", stagesInSameCommand("git add -- _inbox/x_close.json && git commit -m x") === true);
  check("stagesInSameCommand: commit -a / --all / -am -> true", stagesInSameCommand("git commit -a -m x") && stagesInSameCommand("git commit --all -m x") && stagesInSameCommand("git commit -am x"));
  check("stagesInSameCommand: plain commit -> false (the index is readable)", stagesInSameCommand("git commit -m x") === false && stagesInSameCommand("git commit -F m.txt") === false);
  check("stagesInSameCommand: add in a previous call is not in this command -> false", stagesInSameCommand("git log -1 && git commit -F m.txt") === false);
  check("targetsDocRepo by -C and by cwd", targetsDocRepo(`git -C ${DOC_REPO} commit -m x`, "C:/elsewhere") && targetsDocRepo("git commit -m x", DOC_REPO + "/_inbox") && !targetsDocRepo("git commit -m x", "P:/hauska-map"));
  console.log(failures === 0 ? "\nself-test: all checks passed" : `\nself-test: ${failures} check(s) FAILED`);
  return failures;
}

if (process.argv.includes("--self-test")) {
  process.exit(selfTest() === 0 ? 0 : 1);
}
