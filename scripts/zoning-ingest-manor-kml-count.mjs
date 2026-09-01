import fs from "node:fs";

const t = fs.readFileSync("P:/tmp/zoning-ingest-manor/zoning-kmz/doc.kml", "utf8");
const zones = {};
const re = /<td>Zone<\/td>\s*<td>([^<]*)<\/td>/g;
let m;
let n = 0;
while ((m = re.exec(t))) {
  n += 1;
  const z = (m[1] || "").trim() || "<empty>";
  zones[z] = (zones[z] || 0) + 1;
}
const codes = Object.keys(zones).sort();
const out = {
  at: new Date().toISOString(),
  source: "https://www.manortx.gov/DocumentCenter/View/2340/KMZ-Files",
  file: "Zoning.kmz / doc.kml",
  placemarks_with_zone: n,
  distinct_codes: codes.length,
  codes: Object.fromEntries(codes.map((c) => [c, zones[c]])),
  grain: "parcel-joined (placemark name is a parcel id; Zone is in HTML description)",
};
fs.writeFileSync(
  "P:/doc_repo/_inbox/2026-09-01_zoning-ingest_manor_kml.json",
  JSON.stringify(out, null, 2) + "\n",
);
console.log(JSON.stringify({ n, distinct: codes.length, codes }, null, 2));
