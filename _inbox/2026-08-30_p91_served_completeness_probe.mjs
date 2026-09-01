// P-91: score a get_smart_site depth-node batch result (saved JSON) for served completeness.
// Usage: node 2026-08-30_p91_served_completeness_probe.mjs <batch-result.json>. Reads what the product serves, not the store.
import { readFileSync } from "node:fs";
const f = process.argv[2]; const j = JSON.parse(readFileSync(f, "utf8"));
const rows = [];
for (const p of j.parcels) {
  const d = p.draw || {}; const sec = Object.fromEntries((p.brief?.sections||[]).map(s=>[s.id,s]));
  const flood = sec.flood?.data || {};
  const adj = new Set((d.edges||[]).map(e=>e.adjacency)); const neigh = (d.edges||[]).filter(e=>e.neighbor).length; const roads=(d.edges||[]).filter(e=>e.roadNode).length;
  const ov = Object.fromEntries((d.overlays||[]).map(o=>[o.id,o]));
  rows.push({ id:p.parcelNodeId, label:(d.label||"").replace(" , ",", "), ring:(d.ring||[]).length, edges:(d.edges||[]).length, neigh, roads, adj:[...adj].join("/"),
    zoning: d.attrs?.zoning?.v||"-", flood:(flood.floodZone||"-")+(flood.inSpecialFloodHazardArea?" SFHA":"")+(flood.zoneSubtype?` (${flood.zoneSubtype.replace(" FLOOD HAZARD","")})`:""),
    year: d.attrs?.yearBuilt?.v||"-", footprint: ov.footprint?.geom||"-", envelope: ov.envelope?.state||"-", landUse: sec["land-use"]?.disposition||"-" });
}
console.log(["id","label","ring","edges","neigh","roads","adjacency","zoning","flood","year","footprint","envelope","landUse"].join(" | "));
for (const r of rows) console.log([r.id,r.label,r.ring,r.edges,r.neigh,r.roads,r.adj,r.zoning,r.flood,r.year,r.footprint,r.envelope,r.landUse].join(" | "));
console.log("notFound:", JSON.stringify(j.notFound));
