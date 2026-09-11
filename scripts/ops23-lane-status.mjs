#!/usr/bin/env node
/**
 * ops23-lane-status.mjs — live status of the OPS-23 lanes (rows P-151..P-167 in OPS-16).
 *
 * Read-only. Registry-driven: for each lane it reads the worktrees registered for it in
 * _catalog/seat_register.json, reports whether each exists on disk, its branch, commits ahead
 * of origin/main, and whether checkpoint/close artifacts have landed in _inbox/.
 *
 * It reports UNKNOWN rather than a guess wherever it cannot determine something. A lane with
 * no worktree on disk is not "not started" — it is unmeasured from here. A lane with no
 * registered worktree is not dispatchable until one is registered (seat-worktree-gate refuses
 * commits from unregistered paths).
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const LANES = [
  { row: "P-151", slug: "p151-seam", what: "placement never depends on geocoding", worktrees: [/p151-seam/, /p151-point-route/] },
  { row: "P-160", slug: "p160-probe", what: "surface probe instrument (doc_repo)", worktrees: [] },
  { row: "P-153", slug: "p153-draw", what: "envelope polygon drawn, figure refused", worktrees: [/p153-draw/] },
  { row: "P-152", slug: "p152-reader", what: "one reader in retrieval-api", worktrees: [/p152/] },
  { row: "P-154", slug: "p154-most-current", what: "most-current setback resolver", worktrees: [/p154/] },
  { row: "P-155", slug: "p155-feasibility", what: "async feasibility refresh", worktrees: [/p155/] },
  { row: "P-156", slug: "p156-cities", what: "Travis city queue", worktrees: [/p156/] },
  { row: "P-157", slug: "p157-structural", what: "TCAD improvement detail", worktrees: [/p157/] },
  { row: "P-158", slug: "p158-footprint", what: "footprint join", worktrees: [/p158/] },
  { row: "P-159", slug: "p159-pdf", what: "one buildable figure per PDF", worktrees: [/p159/] },
  { row: "P-161", slug: "p161-nodes", what: "identity rulings + crosswalk type", worktrees: [/p161/] },
  { row: "P-162", slug: "p162-railmap", what: "rail-to-atom map (doc_repo)", worktrees: [] },
  { row: "P-163", slug: "p163-writer", what: "one writer: atom + pointer + rendering", worktrees: [/p163/] },
  { row: "P-164", slug: "p164-backfill", what: "mint atoms from gated cells", worktrees: [/p164/] },
  { row: "P-165", slug: "p165-edges", what: "edges as atoms; hop1/subgraph", worktrees: [/p165/] },
  { row: "P-166", slug: "p166-succession", what: "node succession", worktrees: [/p166/] },
  { row: "P-167", slug: "p167-vocabulary", what: "one vocabulary package", worktrees: [/p167/] },
];

function git(cwd, args) {
  try {
    return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

const registered = (() => {
  try {
    const j = JSON.parse(readFileSync(join(ROOT, "_catalog/seat_register.json"), "utf8"));
    const out = [];
    for (const seat of j.seats || []) for (const r of seat.repos || []) if (r.worktree) out.push({ seat: seat.name, name: r.name, worktree: r.worktree.replace(/\\/g, "/"), branch: r.branch ?? null });
    return out;
  } catch {
    return null;
  }
})();

const inboxFiles = (() => {
  try { return readdirSync(join(ROOT, "_inbox")); } catch { return null; }
})();

const artifactsFor = (slug) => {
  if (inboxFiles === null) return "UNKNOWN";
  const hit = (suffix) => inboxFiles.some((f) => f.toLowerCase().includes(`_${slug}_${suffix}`));
  const probe = inboxFiles.some((f) => f.includes("_surface_probe"));
  const marks = [hit("cp1") ? "cp1" : null, hit("cp2") ? "cp2" : null, hit("close") ? "CLOSE" : null].filter(Boolean);
  return (marks.length ? marks.join("+") : "-") + (probe ? "" : "");
};

console.log(`\nOPS-23 LANE STATUS   ${new Date().toISOString()}   doc_repo ${git(ROOT, ["rev-parse", "--short", "HEAD"]) ?? "UNKNOWN"}`);
console.log("row    registered worktree                                    on disk  branch                          ahead  artifacts");

for (const L of LANES) {
  const regs = registered === null ? null : registered.filter((r) => L.worktrees.some((rx) => rx.test(r.name) || rx.test(r.worktree)));
  if (L.worktrees.length === 0) {
    console.log(`${L.row.padEnd(6)} ${"(doc_repo, integration seat)".padEnd(52)} ${"n/a".padEnd(8)} ${"main".padEnd(31)} ${"-".padStart(5)}  ${artifactsFor(L.slug)}   ${L.what}`);
    continue;
  }
  if (regs === null) {
    console.log(`${L.row.padEnd(6)} ${"UNKNOWN (registry unreadable)".padEnd(52)}`);
    continue;
  }
  if (regs.length === 0) {
    console.log(`${L.row.padEnd(6)} ${"NOT REGISTERED -- not dispatchable yet".padEnd(52)} ${"-".padEnd(8)} ${"-".padEnd(31)} ${"-".padStart(5)}  ${artifactsFor(L.slug)}   ${L.what}`);
    continue;
  }
  for (const r of regs) {
    const onDisk = existsSync(r.worktree);
    const br = onDisk ? git(r.worktree, ["branch", "--show-current"]) ?? "det" : "-";
    const ahead = onDisk ? git(r.worktree, ["rev-list", "--count", "origin/main..HEAD"]) ?? "?" : "-";
    const wt = r.worktree.length > 50 ? "…" + r.worktree.slice(-49) : r.worktree;
    console.log(`${L.row.padEnd(6)} ${wt.padEnd(52)} ${(onDisk ? "yes" : "NONE YET").padEnd(8)} ${String(br).padEnd(31)} ${String(ahead).padStart(5)}  ${artifactsFor(L.slug)}   ${L.what}`);
  }
}

console.log(
  "\nNOT REGISTERED means no worktree entry exists in _catalog/seat_register.json for that row; register before dispatching.\n" +
    "NONE YET means registered but not created on disk; the lane creates it from origin/main. ahead = origin/main..HEAD.\n" +
    "artifacts are _inbox checkpoint/close files by dispatch slug. Run scripts/surface-probe.mjs for the predicate; this is only the board.\n"
);
