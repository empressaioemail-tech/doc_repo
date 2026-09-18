#!/usr/bin/env node
/**
 * Compare two published @empressaio/setback-corpus versions district by district, on the four setback
 * scalars the factory setback writer serves (front, side, rear, side_corner) plus max_height_ft.
 * Written 2026-09-18 by the integration seat when 387,237 factory setback value cells were found still
 * stamped 1.1.0 while the writer pins 1.4.0: the question is whether those cells carry a stale CITATION
 * only, or stale NUMBERS.
 *
 *   node scripts/setback-corpus-version-diff.mjs --old <dir of 1.1.0 dist/setbacks> --new <dir of 1.4.0 dist/setbacks> [--json <out>]
 *   node scripts/setback-corpus-version-diff.mjs --self-test
 *
 * A district is matched by its exact `district_name` first and then by its leading code token (the
 * setback writer's own district identity, `setback-table-router.mjs` districtCode), so a relabel
 * ("NC Neighborhood Commercial" -> "NC Neighborhood Commercial (legacy)") is a rename, not a removal.
 * EXIT 0 compared; 3 usage. The verdict is data, not an exit code.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const FIELDS = Object.freeze(["front_ft", "side_ft", "rear_ft", "side_corner_ft", "max_height_ft"]);
const code = (name) => String(name).trim().split(/\s+/)[0].toUpperCase().replace(/[^A-Z0-9]/g, "");

/** Pure. oldT, newT: { districts: [...] }. Returns the per-district comparison for one jurisdiction. */
export function diffTable(oldT, newT) {
  const out = { same: 0, changed: [], renamed: [], removed: [], added: 0 };
  const newByName = new Map(newT.districts.map((d) => [d.district_name, d]));
  const newByCode = new Map();
  for (const d of newT.districts) { const c = code(d.district_name); if (!newByCode.has(c)) newByCode.set(c, []); newByCode.get(c).push(d); }
  const used = new Set();
  for (const o of oldT.districts) {
    let n = newByName.get(o.district_name);
    let renamed = false;
    if (!n) {
      const cands = newByCode.get(code(o.district_name)) ?? [];
      if (cands.length === 1) { n = cands[0]; renamed = true; }
    }
    if (!n) { out.removed.push(o.district_name); continue; }
    used.add(n.district_name);
    if (renamed) out.renamed.push({ from: o.district_name, to: n.district_name });
    const diffs = FIELDS.filter((f) => JSON.stringify(o[f] ?? null) !== JSON.stringify(n[f] ?? null)).map((f) => ({ field: f, old: o[f] ?? null, new: n[f] ?? null }));
    if (diffs.length) out.changed.push({ district: o.district_name, diffs });
    else out.same += 1;
  }
  out.added = newT.districts.filter((d) => !used.has(d.district_name)).length;
  return out;
}

function selfTest() {
  const t = (rows) => ({ districts: rows.map(([n, f]) => ({ district_name: n, front_ft: f, side_ft: 5, rear_ft: 10, side_corner_ft: 10, max_height_ft: 35 })) });
  const checks = [];
  const c = (name, ok) => checks.push({ name, ok });
  let r = diffTable(t([["SF-6 Single Family 6", 25]]), t([["SF-6 Single Family 6", 25]]));
  c("identical row is same", r.same === 1 && r.changed.length === 0);
  r = diffTable(t([["SF-6 Single Family 6", 25]]), t([["SF-6 Single Family 6", 20]]));
  c("a changed front is reported with old and new", r.changed.length === 1 && r.changed[0].diffs[0].old === 25 && r.changed[0].diffs[0].new === 20);
  r = diffTable(t([["NC Neighborhood Commercial", 15]]), t([["NC Neighborhood Commercial (legacy)", 15], ["N-CM Neighborhood Commercial District", 10]]));
  c("a relabel by code is a rename, not a removal, and N-CM is not taken as NC", r.renamed.length === 1 && r.removed.length === 0 && r.same === 1 && r.added === 1);
  r = diffTable(t([["RL Residential Low", 25]]), t([["RT Residential Traditional", 20]]));
  c("a district replaced under a new code is a removal plus an addition", r.removed.length === 1 && r.added === 1);
  for (const x of checks) console.log(`  ${x.ok ? "ok  " : "FAIL"} ${x.name}`);
  const failed = checks.filter((x) => !x.ok).length;
  console.log(failed ? `self-test: ${failed} FAILED` : `self-test: all ${checks.length} checks passed`);
  process.exit(failed ? 1 : 0);
}

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };
if (process.argv.includes("--self-test")) selfTest();
else {
  const oldDir = arg("old"), newDir = arg("new");
  if (!oldDir || !newDir) { console.error("usage: --old <dir> --new <dir> [--json <out>]"); process.exit(3); }
  const files = readdirSync(oldDir).filter((f) => f.endsWith(".json"));
  const report = { old: oldDir, new: newDir, jurisdictions: {} };
  for (const f of files) {
    const key = f.replace(/\.json$/, "");
    let newT;
    try { newT = JSON.parse(readFileSync(join(newDir, f), "utf8")); } catch { report.jurisdictions[key] = { missingInNew: true }; continue; }
    const r = diffTable(JSON.parse(readFileSync(join(oldDir, f), "utf8")), newT);
    report.jurisdictions[key] = r;
    console.log(`${key.padEnd(28)} same=${r.same} changed=${r.changed.length} renamed=${r.renamed.length} removed=${r.removed.length} added=${r.added}`);
    for (const ch of r.changed) console.log(`    CHANGED ${ch.district}: ${ch.diffs.map((d) => `${d.field} ${d.old}->${d.new}`).join(", ")}`);
    for (const rm of r.removed) console.log(`    REMOVED ${rm}`);
  }
  if (arg("json")) writeFileSync(arg("json"), JSON.stringify(report, null, 2) + "\n", "utf8");
}
