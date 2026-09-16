#!/usr/bin/env node
/**
 * lane-d's citation posture: 68 rows across 8 cities is the largest batch-2 acquisition, and its
 * first row cites a third-party aggregator (zoneomics.com). This checks what lane-d CLAIMS about
 * those values and whether it disclosed the route, the same question I put to lane-b about elaws.
 */
import fs from "node:fs";

const d = JSON.parse(fs.readFileSync("P:/seat-worktrees/p258-setback-campaign/doc_repo/_inbox/2026-09-16_p258_lane-d.json", "utf8"));
console.log("=== fragment keys ===", Object.keys(d).join(", "));
console.log("=== sourceRoute ===", JSON.stringify(d.sourceRoute, null, 1).slice(0, 2500));

const added = JSON.parse(fs.readFileSync("P:/seat-worktrees/p258-setback-campaign/doc_repo/_inbox/2026-09-16_p258_added_rows.json", "utf8"))["lane-d"];
console.log("\n=== citation hosts used by lane-d's 68 added rows ===");
const hosts = {};
const states = {};
for (const [file, rows] of Object.entries(added)) {
  for (const r of rows) {
    const h = (() => { try { return new URL(r.citation_url).host; } catch { return String(r.citation_url); } })();
    hosts[h] = (hosts[h] ?? 0) + 1;
    for (const f of Object.keys(r.provenance ?? {})) {
      const s = r.provenance[f].verification_state;
      states[s] = (states[s] ?? 0) + 1;
    }
  }
}
for (const [h, n] of Object.entries(hosts).sort((a, b) => b[1] - a[1])) console.log(`   ${h}: ${n} rows`);
console.log("verification_state counts over lane-d's added values:", JSON.stringify(states));

console.log("\n=== does lane-d mention zoneomics / aggregator / third-party anywhere? ===");
const txt = JSON.stringify(d);
for (const re of [/zoneomics/gi, /third-?party/gi, /aggregator/gi, /transcription/gi, /primary sour/gi]) {
  const m = txt.match(re);
  if (m) console.log(`   ${re}: ${m.length} mention(s)`);
  else console.log(`   ${re}: NONE`);
}
