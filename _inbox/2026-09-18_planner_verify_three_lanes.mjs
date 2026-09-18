// Planner verification instrument for the three in-flight SmartCity dispatches.
// Reads DO state from OUTSIDE (this seat has no doctl token and no DO MCP).
// No credential is used or printed. All cells are anonymous.
//
// Tells taken from committed ground truth:
//  - v1 (G-159 close): an EXISTING platform route answers 401 JSON; a NON-existent
//    /api/platform/* path answers the SPA shell (HTML, 200). So route existence is
//    readable from outside with no key, using content-type as the discriminator.
//  - dashboards finance route (G-159 STEP 2): keyless 400 city_key_required,
//    template-city 200, bastrop_tx 401, no-such-city 404.
//
// Run: node _inbox/2026-09-18_planner_verify_three_lanes.mjs

const WALRUS = "https://walrus-app-kzog6.ondigitalocean.app";
const UAT = "https://d12-main-uat-gqnjx.ondigitalocean.app";
const DOLPHIN = "https://dolphin-app-y4ixf.ondigitalocean.app";
const APEX = "https://smartcityos.io";
const APP = "https://app.smartcityos.io";
const GCP_DASH = "https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app";

function classify(status, ctype, bodyHead) {
  const ct = (ctype || "").toLowerCase();
  if (ct.includes("application/json")) {
    let code = "";
    try {
      const j = JSON.parse(bodyHead);
      code = j.error || j.code || j.error_code || "";
    } catch {}
    return code ? `JSON_error:${code}` : "JSON";
  }
  if (ct.includes("text/html")) return "SPA_SHELL_html";
  return `OTHER:${ct.split(";")[0]}:${String(bodyHead).slice(0, 40)}`;
}

async function probe(url) {
  const out = { url, status: null, ctype: null, class: null, bytes: null, err: null };
  try {
    const r = await fetch(url, { redirect: "follow" });
    const text = await r.text();
    out.status = r.status;
    out.ctype = r.headers.get("content-type");
    out.bytes = Buffer.byteLength(text);
    out.class = classify(r.status, out.ctype, text);
  } catch (e) {
    out.err = `${e?.name}: ${e?.message}`;
  }
  return out;
}

function show(label, r) {
  const s = r.err ? `ERR ${r.err}` : `${r.status} ${r.class} ${r.bytes}B`;
  console.log(`  ${label.padEnd(52)} ${s}`);
}

const results = {};

// ---- LEG 1: D-14. Does walrus-app serve smartcity-os main (do the new routes exist)? ----
console.log("\n=== LEG 1 (D-14): v1 platform route existence on walrus-app and the apex ===");
results.d14 = {};
for (const [baseName, base] of [["walrus-app", WALRUS], ["smartcityos.io", APEX]]) {
  console.log(` ${baseName}`);
  const cells = [
    ["opengov/budgets (G-159 new route)", "/api/platform/opengov/budgets"],
    ["opengov/chart-of-accounts (new)", "/api/platform/opengov/chart-of-accounts"],
    ["finance/permit-revenue/summary (new)", "/api/platform/finance/permit-revenue/summary?fy=2026"],
    ["mygov/permits (EXISTING control)", "/api/platform/mygov/permits"],
    ["xyz-nonexistent (FAKE control)", "/api/platform/xyz-nonexistent-control"],
  ];
  results.d14[baseName] = [];
  for (const [label, path] of cells) {
    const r = await probe(base + path);
    show(label, r);
    results.d14[baseName].push({ label, path, ...r });
  }
}

// ---- LEG 2: G-161 cells on the dashboards UAT app ----
console.log("\n=== LEG 2 (G-161): dashboards route cells on d12-main-uat ===");
results.g161 = {};
const routes = [
  "/api/city-domains",
  "/api/city-identity",
  "/api/shell",
  "/api/lenses/finance/sources",
];
const variants = [
  ["keyless", ""],
  ["bastrop_tx", "?cityKey=bastrop_tx"],
  ["no-such-city", "?cityKey=no-such-city"],
  ["template-city", "?cityKey=template-city"],
  ["whitespace", "?cityKey=%20%20"],
];
for (const route of routes) {
  console.log(` ${route}`);
  results.g161[route] = [];
  for (const [vlabel, q] of variants) {
    const r = await probe(UAT + route + q);
    show(vlabel, r);
    results.g161[route].push({ variant: vlabel, ...r });
  }
}

// ---- LEG 3: D-13. Do the dashboards still read GCP, or a DO v1? (heuristic) ----
console.log("\n=== LEG 3 (D-13): dashboards origin tells ===");
results.d13 = [];
for (const [label, url] of [
  ["app.smartcityos.io /auth/sign-in (GATE B marker)", APP + "/auth/sign-in"],
  ["app.smartcityos.io /health", APP + "/health"],
  ["app.smartcityos.io finance sources keyless", APP + "/api/lenses/finance/sources"],
  ["dolphin-app /health", DOLPHIN + "/health"],
  ["dolphin-app finance sources keyless", DOLPHIN + "/api/lenses/finance/sources"],
  ["GCP dashboards /auth/sign-in (control)", GCP_DASH + "/auth/sign-in"],
  ["GCP dashboards finance sources keyless", GCP_DASH + "/api/lenses/finance/sources"],
]) {
  const r = await probe(url);
  show(label, r);
  results.d13.push({ label, ...r });
}

const fs = await import("node:fs");
const outPath = "_inbox/2026-09-18_planner_three_lane_verify.json";
fs.writeFileSync(outPath, JSON.stringify({ readAt: new Date().toISOString(), results }, null, 2));
console.log(`\nwrote ${outPath}`);
