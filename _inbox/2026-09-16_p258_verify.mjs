#!/usr/bin/env node
/**
 * P-258 verification (planner-owned; verification is never delegated).
 *
 * Checks, in order:
 *   V1 coverage  — every worklist entry appears in exactly one lane fragment, with a legal state.
 *   V2 counts    — each fragment's own counts block reconciled against its entries (DEV_PROCESS 1.4).
 *   V3 no-pending— falsifier F1: no entry left `pending`.
 *   V4 PUD       — falsifier F3: no added district row whose name/code is in the PUD family.
 *
 * Usage: node _inbox/2026-09-16_p258_verify.mjs [--lanes lane-a,lane-b,lane-c] [--json]
 */

import fs from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const args = process.argv.slice(2);
const argOf = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const LANES = argOf("--lanes", "lane-a,lane-b,lane-c").split(",");
const WORKLIST = argOf("--worklist", path.join(HERE, "2026-09-16_p258_worklist.json"));

const LEGAL = new Set(["acquired", "declared-unacquirable", "blocked", "out-of-scope-pud", "pending"]);
/** A real district code can LOOK like this family (e.g. "PD" is a planned development in many
 *  Texas codes). The scan is deliberately over-broad: a hit is a question for the lane, and the
 *  lane either shows the code is a plain Euclidean district or the row comes out. */
const PUD_RE = /(^|[^A-Z])(PUD|PDD|PD|PC|PDA)([^A-Z]|$)/;

const wl = JSON.parse(fs.readFileSync(WORKLIST, "utf8"));
const entries = new Map();
for (const u of wl.units) entries.set(u.unitId, { ...u, kind: "unit" });
for (const c of wl.cities) entries.set(c.cityRowId, { ...c, kind: "city" });

const report = { lanes: {}, totals: {}, problems: [] };
const seen = new Map();

for (const lane of LANES) {
  const f = path.join(HERE, `2026-09-16_p258_${lane}.json`);
  if (!fs.existsSync(f)) { report.problems.push(`MISSING FRAGMENT ${f}`); continue; }
  const frag = JSON.parse(fs.readFileSync(f, "utf8"));
  const laneEntries = frag.entries ?? frag.units ?? [];
  const counts = {};
  let duplicate = 0, unknown = 0, wrongOwner = 0, pending = 0;
  const missing = [];
  const own = new Set();
  for (const e of [...wl.units, ...wl.cities]) {
    if (e.lane === lane) own.add(e.unitId ?? e.cityRowId);
  }
  const got = new Set();
  for (const e of laneEntries) {
    const id = e.unitId ?? e.cityRowId;
    if (!LEGAL.has(e.state)) report.problems.push(`${lane}: illegal state "${e.state}" on ${id}`);
    if (e.state === "pending") pending++;
    counts[e.state] = (counts[e.state] ?? 0) + 1;
    if (got.has(id)) { duplicate++; report.problems.push(`${lane}: duplicate entry ${id}`); }
    got.add(id);
    if (!entries.has(id)) { unknown++; report.problems.push(`${lane}: entry ${id} is NOT in the worklist skeleton`); continue; }
    seen.set(id, lane);
    if (entries.get(id).lane !== lane && entries.get(id).ownerLane !== lane) {
      wrongOwner++;
      report.problems.push(`${lane}: entry ${id} belongs to ${entries.get(id).lane}`);
    }
  }
  for (const id of own) if (!got.has(id)) missing.push(id);
  report.lanes[lane] = {
    entries: laneEntries.length,
    ownEntries: own.size,
    counts,
    pending,
    duplicate,
    unknown,
    wrongOwner,
    missingCount: missing.length,
    missingSample: missing.slice(0, 10),
    selfReportedCounts: frag.counts ?? null,
    prs: frag.prs ?? null,
  };
  if (missing.length) report.problems.push(`${lane}: ${missing.length} owned entries have no state: ${missing.slice(0, 5).join(", ")}`);
  if (laneEntries.length !== own.size) report.problems.push(`${lane}: fragment has ${laneEntries.length} entries but owns ${own.size}`);
  if (counts.pending) report.problems.push(`${lane}: ${counts.pending} entries left pending (F1)`);
}

// V2 — reconcile self-reported counts against measured counts.
for (const lane of LANES) {
  const r = report.lanes[lane];
  if (!r?.selfReportedCounts) { report.problems.push(`${lane}: no counts block in fragment (a claim without its counting rule)`); continue; }
  for (const [k, v] of Object.entries(r.selfReportedCounts)) {
    if (typeof v !== "number") continue;
    const key = k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
    const measured = r.counts[key] ?? r.counts[k];
    if (measured !== undefined && measured !== v) {
      report.problems.push(`${lane}: self-reported ${k}=${v} but measured ${measured} (rule: fragment entries)`);
    }
  }
}

const allStates = {};
for (const r of Object.values(report.lanes)) for (const [k, v] of Object.entries(r.counts)) allStates[k] = (allStates[k] ?? 0) + v;
report.totals = {
  worklistUnits: wl.units.length,
  worklistCityRows: wl.cities.length,
  worklistEntries: wl.units.length + wl.cities.length,
  coveredByTheseLanes: seen.size,
  states: allStates,
  unresolved: (wl.units.length + wl.cities.length) - seen.size,
};

// V4 — PUD scan over added rows in the fetched branches. TWO STAGES, because a single regex
// cannot do both jobs: the broad pass exists to RAISE questions (it matches any name containing
// the PD family, so "PD-Z Zero Lot Line Garden Home District" raises one), and the verdict pass
// only fails on a name whose LEADING TOKEN is the planned-development family.
const rows = JSON.parse(fs.readFileSync(path.join(HERE, "2026-09-16_p258_added_rows.json"), "utf8"));
/** Adjudicated questions. Kept as data with the evidence, not as a code comment. */
const ADJUDICATED = {
  "PD-Z Zero Lot Line Garden Home District":
    "Smithville §2.1.5 groups PD-Z under its 'Planned Development Districts' heading beside PDD, but §2.2.17 gives it a fixed code-wide dimensions table (front 20 ft, height 2-1/2 stories or 35 ft, lot 5,000 sf, coverage 40%) rather than per-development-plan standards. F3's intent is to stop negotiated, site-specific standards being presented as code-wide rules; PD-Z has a code-wide schedule, so a row is not false. The lane separately EXCLUDED the real PDD (§2.2.16, standards set by each development plan) and said so in the note. Planner re-fetched the source 2026-09-16 and confirmed the §2.2.17 table.",
};
const scanQuestions = [];
const pudHits = [];
let totalRows = 0;
for (const [lane, files] of Object.entries(rows)) {
  for (const [file, districts] of Object.entries(files)) {
    totalRows += districts.length;
    for (const d of districts) {
      const name = String(d.district_name ?? "");
      if (PUD_RE.test(name.toUpperCase().replace(/[^A-Z0-9/ ]/g, " "))) {
        const base = name.split(/[\s(]/)[0];
        const isVerdictHit = /^(PD|PUD|PDD|PDA|PC|PD-?\d*|PUD-?\d*)$/i.test(base);
        if (isVerdictHit) pudHits.push({ lane, file, district_name: name, leadingToken: base });
        else scanQuestions.push({ lane, file, district_name: name, leadingToken: base, adjudication: ADJUDICATED[name] ?? "NOT ADJUDICATED — a question the planner has not yet answered" });
      }
    }
  }
}
report.pudScan = {
  rowsScanned: totalRows,
  verdictRule: "FAIL only on a district_name whose leading token IS the planned-development family (PD/PUD/PDD/PDA/PC/PD-<n>). Names that merely CONTAIN the letters are questions, adjudicated individually below.",
  scanQuestions,
  hits: pudHits,
};
if (pudHits.length) report.problems.push(`F3: ${pudHits.length} added row(s) whose leading token is the planned-development family — each must be shown to be a plain Euclidean district or withdrawn`);
const unadjudicated = scanQuestions.filter((q) => /NOT ADJUDICATED/.test(q.adjudication));
if (unadjudicated.length) report.problems.push(`F3: ${unadjudicated.length} scan question(s) NOT YET ADJUDICATED: ${unadjudicated.map((q) => q.district_name).join(", ")}`);

console.log(JSON.stringify(report, null, 2));
console.log(`\nPROBLEMS: ${report.problems.length}`);
for (const p of report.problems) console.log("  - " + p);
process.exitCode = report.problems.length ? 1 : 0;
