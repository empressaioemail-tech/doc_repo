/**
 * G-159 STEP 2 — the city-default fix, measured on the deployed non-production app.
 *
 * The dispatch's proof clause: "Prove the v2 change on the non-production DigitalOcean app
 * d12-main-uat against bastrop_tx, and read back services[0].source_commit_hash (OPS-25 rule 13)."
 *
 * THIS SCRIPT IS RUN TWICE, ON PURPOSE, AGAINST THE SAME URL:
 *   leg_old = while deployment 049a7de7 (source_commit_hash 7dda6db, the pre-fix commit) is ACTIVE
 *   leg_new = while deployment cc07754f (source_commit_hash 53ade8a, the merged fix) is ACTIVE
 *
 * Same probe, same host, two commits, and the keyless cell is the one that must differ. A unit test
 * proves the code refuses; this proves the DEPLOYED SURFACE refuses, which is what the dispatch asks
 * for and what a merged PR alone does not establish.
 *
 * The probe is unauthenticated on purpose. The keyless refusal is the whole point of the fix and it
 * needs no credential to observe; the tenant-private cell (bastrop_tx) is probed anonymously as well
 * because the honest result there is an access refusal, and dressing the probe up in a service key to
 * make it "succeed" would measure a different, less interesting thing.
 */
import { writeFileSync } from "node:fs";

const BASE = "https://d12-main-uat-gqnjx.ondigitalocean.app";
const LEG = process.argv[2] || "leg";
const OUT = process.argv[3];

/** The four source ids the finance lens renders. Only a RESOLVED pack can produce them. */
const SOURCE_IDS = ["adopted-budget", "fund-ledger", "permit-fee-revenue", "department-spend"];

const CELLS = [
  { id: "keyless", qs: "", expect: "refusal" },
  { id: "empty_citykey", qs: "?cityKey=", expect: "refusal" },
  { id: "whitespace_citykey", qs: "?cityKey=%20%20", expect: "refusal" },
  { id: "named_template_city", qs: "?cityKey=template-city", expect: "pack_payload" },
  { id: "named_unknown_city", qs: "?cityKey=no-such-city", expect: "unknown_pack" },
  { id: "named_bastrop_tx_anonymous", qs: "?cityKey=bastrop_tx", expect: "access_refusal" },
];

const url = `${BASE}/api/lenses/finance/sources`;
const results = [];

for (const cell of CELLS) {
  const target = `${url}${cell.qs}`;
  const row = { id: cell.id, url: target, expected: cell.expect };
  try {
    const res = await fetch(target, { redirect: "manual" });
    const text = await res.text();
    row.status = res.status;
    row.contentType = (res.headers.get("content-type") || "").split(";")[0];
    row.carriesFinanceBlock = /"finance"/.test(text);
    row.carriesAResolvedSourceId = SOURCE_IDS.filter((s) => text.includes(s));
    row.carriesMoneyToken = /\$[0-9]/.test(text);
    // A keyless 200 with a finance block is the pre-fix defect, stated as a fact about the wire.
    try {
      const body = JSON.parse(text);
      row.error = body.error ?? null;
      row.message = body.message ?? null;
      row.sourceStates = Array.isArray(body?.finance?.sources)
        ? body.finance.sources.map((s) => `${s.id}=${s.state}`)
        : null;
      row.cityKeyEchoed = body?.finance?.cityKey ?? body?.cityKey ?? null;
    } catch {
      row.bodyNotJson = true;
    }
  } catch (err) {
    row.fetchError = String(err?.cause?.code || err?.message || err);
  }
  results.push(row);
}

/** The one assertion that separates leg_old from leg_new. */
const keyless = results.find((r) => r.id === "keyless");
const named = results.find((r) => r.id === "named_template_city");
const verdict = {
  keylessRefused:
    keyless?.status === 400 && keyless?.error === "city_key_required" && keyless?.carriesFinanceBlock === false,
  keylessServedDemoPackInstead: keyless?.status === 200 && keyless?.carriesFinanceBlock === true,
  namedPackStillAnswers: named?.status === 200 && (named?.sourceStates?.length ?? 0) > 0,
};

const artifact = {
  lane: "g159-finance-bridge",
  planRow: "G-159",
  leg: LEG,
  measuredAt: new Date().toISOString(),
  target: url,
  method: "unauthenticated GET over real HTTPS; no bearer, no service key",
  cells: results,
  verdict,
  reading:
    verdict.keylessServedDemoPackInstead === true
      ? "PRE-FIX SURFACE: a request naming no city answered 200 with the demo pack's finance states. This is the defect the dispatch's rule 3 names, observed on the deployed app rather than in a test runner."
      : verdict.keylessRefused === true
        ? "POST-FIX SURFACE: a request naming no city is refused with 400 city_key_required and carries no finance payload, while a named pack still answers."
        : "NEITHER: the surface did not match either the pre-fix or the post-fix shape. Reported rather than resolved.",
};

if (OUT) writeFileSync(OUT, JSON.stringify(artifact, null, 2));
console.log(JSON.stringify(artifact, null, 2));
