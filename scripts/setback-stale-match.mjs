#!/usr/bin/env node
/**
 * Which stored setback VALUE cells would the live writer now resolve to a DIFFERENT district row?
 *
 * The factory setback writer never rewrites an earned value (parcel-setback-cells.mjs releases only
 * `unaccounted` cells and its own false absences), so a cell written under corpus 1.1.0 keeps the row
 * 1.1.0's table gave it. Where the district code matched that row only by the router's weak prefix
 * fallback and 1.4.0 now carries an exact row for the code (San Marcos N-CM matched legacy NC), the
 * stored values are the wrong row's, frozen. This measures that population from the stored
 * (source, table, districtCode) groups, using the writer's own `mapDistrict` on both table versions.
 *
 *   node scripts/setback-stale-match.mjs --router <setback-table-router.mjs> --csv <grouped cells csv> \
 *        --old <1.1.0 dist/setbacks dir> --new <1.4.0 dist/setbacks dir> [--json <out>]
 *   node scripts/setback-stale-match.mjs --self-test --router <setback-table-router.mjs>
 *
 * Declared assumption: the current router's `mapDistrict` is the rule the 1.1.0 cells were written
 * under. The cell carries the resolved table and code but not the matched row name, so a stored cell
 * whose recorded values disagree with 1.1.0's row under this rule is reported as UNEXPLAINED rather
 * than attributed. Only cells whose source names 1.1.0 are examined.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SCALARS = ["front_ft", "side_ft", "rear_ft", "side_corner_ft"];
const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };

export function parseCsv(text) {
  const [head, ...lines] = text.trim().split(/\r?\n/);
  const cols = head.split(",");
  return lines.filter(Boolean).map((l) => { const v = l.split(","); return Object.fromEntries(cols.map((c, i) => [c, v[i]])); });
}

/** Pure. rows: grouped cells; tables(version, key) -> table|null; mapDistrict: the writer's rule. */
export function classify(rows, tables, mapDistrict) {
  const out = { examined: 0, cellsExamined: 0, sameRow: 0, staleMatch: [], newTableMissing: [], unmatchedNow: [] };
  for (const r of rows) {
    if (!/@1\.1\.0:/.test(r.source ?? "")) continue;
    const cells = Number(r.cells);
    out.examined += 1; out.cellsExamined += cells;
    const oldT = tables("1.1.0", r.table_key), newT = tables("1.4.0", r.table_key);
    if (!newT || !oldT) { out.newTableMissing.push({ ...r, cells }); continue; }
    const mOld = mapDistrict(oldT, r.district_code), mNew = mapDistrict(newT, r.district_code);
    if (!mNew) { out.unmatchedNow.push({ ...r, cells, oldRow: mOld?.district?.district_name ?? null }); continue; }
    if (mOld && mOld.district.district_name === mNew.district.district_name) { out.sameRow += cells; continue; }
    const diffs = mOld ? SCALARS.filter((f) => JSON.stringify(mOld.district[f] ?? null) !== JSON.stringify(mNew.district[f] ?? null)).map((f) => `${f} ${mOld.district[f]}->${mNew.district[f]}`) : ["no 1.1.0 row under this rule"];
    out.staleMatch.push({ county: r.county, table: r.table_key, code: r.district_code, cells, oldRow: mOld?.district?.district_name ?? null, oldKind: mOld?.kind ?? null, newRow: mNew.district.district_name, newKind: mNew.kind, valueDiffs: diffs });
  }
  out.staleCells = out.staleMatch.reduce((s, x) => s + x.cells, 0);
  out.staleCellsWithDifferentValues = out.staleMatch.filter((x) => x.valueDiffs.length).reduce((s, x) => s + x.cells, 0);
  return out;
}

async function main() {
  const routerPath = arg("router");
  if (!routerPath) { console.error("--router is required"); process.exit(3); }
  const { mapDistrict } = await import(pathToFileURL(resolve(routerPath)).href);
  const t = (names, front) => ({ districts: names.map((n, i) => ({ district_name: n, front_ft: front[i], side_ft: 5, rear_ft: 10, side_corner_ft: 10 })) });
  if (process.argv.includes("--self-test")) {
    const tabs = { "1.1.0": { sm: t(["SF-6 Single Family 6", "NC Neighborhood Commercial (legacy)"], [25, 15]) }, "1.4.0": { sm: t(["SF-6 Single Family 6", "NC Neighborhood Commercial (legacy)", "N-CM Neighborhood Commercial District"], [25, 15, 10]) } };
    const tables = (v, k) => tabs[v][k] ?? null;
    const rows = [
      { county: "48209", source: "@empressaio/setback-corpus@1.1.0:sm", table_key: "sm", district_code: "SF-6", cells: "100" },
      { county: "48209", source: "@empressaio/setback-corpus@1.1.0:sm", table_key: "sm", district_code: "N-CM", cells: "4" },
      { county: "48209", source: "@empressaio/setback-corpus@1.4.0:sm", table_key: "sm", district_code: "N-CM", cells: "7" },
      { county: "48209", source: "@empressaio/setback-corpus@1.1.0:gone", table_key: "gone", district_code: "X", cells: "2" },
    ];
    const r = classify(rows, tables, mapDistrict);
    const checks = [
      ["an exact match under both versions is the same row", r.sameRow === 100],
      ["N-CM prefix-matched NC under 1.1.0 and exact-matches N-CM under 1.4.0: stale, with the front difference", r.staleMatch.length === 1 && r.staleMatch[0].code === "N-CM" && r.staleMatch[0].oldKind === "matched" && r.staleMatch[0].valueDiffs[0] === "front_ft 15->10"],
      ["a cell already on 1.4.0 is not examined", r.cellsExamined === 106],
      ["a table missing from either version is reported, never dropped", r.newTableMissing.length === 1],
    ];
    for (const [n, ok] of checks) console.log(`  ${ok ? "ok  " : "FAIL"} ${n}`);
    const failed = checks.filter(([, ok]) => !ok).length;
    console.log(failed ? `self-test: ${failed} FAILED` : `self-test: all ${checks.length} checks passed`);
    process.exit(failed ? 1 : 0);
  }
  const csv = arg("csv"), oldDir = arg("old"), newDir = arg("new");
  if (!csv || !oldDir || !newDir) { console.error("usage: --router <f> --csv <f> --old <dir> --new <dir> [--json <out>]"); process.exit(3); }
  const load = (dir, k) => { try { return JSON.parse(readFileSync(join(dir, `${k}.json`), "utf8")); } catch { return null; } };
  const tables = (v, k) => load(v === "1.1.0" ? oldDir : newDir, k);
  const r = classify(parseCsv(readFileSync(csv, "utf8")), tables, mapDistrict);
  console.log(`examined ${r.examined} groups / ${r.cellsExamined} cells on 1.1.0; same row ${r.sameRow}; stale match ${r.staleCells} cells (${r.staleCellsWithDifferentValues} with different setback values); unmatched now ${r.unmatchedNow.reduce((s, x) => s + x.cells, 0)}; table missing ${r.newTableMissing.reduce((s, x) => s + x.cells, 0)}`);
  for (const s of r.staleMatch.sort((a, b) => b.cells - a.cells)) console.log(`  STALE ${s.county} ${s.table} ${s.code} x${s.cells}: ${s.oldRow} (${s.oldKind}) -> ${s.newRow} (${s.newKind}) ${s.valueDiffs.join("; ")}`);
  for (const u of r.unmatchedNow) console.log(`  UNMATCHED-NOW ${u.county} ${u.table_key} ${u.district_code} x${u.cells} (1.1.0 row: ${u.oldRow})`);
  for (const m of r.newTableMissing) console.log(`  TABLE-MISSING ${m.county} ${m.table_key} ${m.district_code} x${m.cells}`);
  if (arg("json")) writeFileSync(arg("json"), JSON.stringify({ instrument: "scripts/setback-stale-match.mjs", router: routerPath, ...r }, null, 2) + "\n", "utf8");
}
await main();
