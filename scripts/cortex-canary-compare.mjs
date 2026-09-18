#!/usr/bin/env node
/**
 * cortex-canary-compare.mjs -- grades a cortex-api canary against the serving revision BEFORE any
 * traffic moves: the same request to both, every difference classified as intended or not.
 *
 * WHY. A canary smoke of /api/healthz says the process started, not that it answers the same. The
 * deploy it grades names the changes it carries; everything else must come back byte-identical once
 * volatile fields (clocks, request ids, timings) are removed. An unintended difference is a FAIL
 * even if it looks like an improvement: it was not in the change set, so nothing reviewed it.
 *
 * ROUTES (the ones the change set touches, reached the way the Property Explorer proxy reaches them,
 * `Authorization: Bearer <SERVICE_API_KEY>`):
 *   POST /api/brokerage/v1/place/buildable-envelope   the map's draw route (P-257, P-270)
 *   GET  /api/brokerage/v1/place/node/<id>/facets     the node facts (P-322)
 * Subjects come from a surface-probe artifact: each graded parcel's own draw request body (its
 * composed address or record point, exactly as the probe asked) and its node id.
 *
 * INTENDED CLASSES (declared per deploy with --intended; the default is the 2026-09-18 LDT deploy):
 *   p270-vintage   a path naming citationVintage / vintage, or a disclosure that gains the vintage
 *                  sentence ("vintage unknown")
 *   p257-pud       any draw-route difference on a subject whose district is PUD-coded (PUD, PDD, PD, PC)
 *   p322-ag        a node-facts path naming agValuation, in 48021, 48055, 48209 or 48309
 *
 * EXIT 0 PASS (only intended differences), 1 FAIL (an unintended difference), 2 UNMEASURED (a
 * subject that did not answer on one side, or no subjects).
 *
 *   SERVICE_API_KEY=... node --use-system-ca scripts/cortex-canary-compare.mjs \
 *     --canary https://canary---cortex-api-tds7av26va-uc.a.run.app --prod https://cortex-api-tds7av26va-uc.a.run.app \
 *     --probe _inbox/<artifact>.json [--json out.json]
 *   node scripts/cortex-canary-compare.mjs --self-test
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Clocks and ids, not data. `assertedAt`, `assembledAt` and `asOf` were added after a live
 *  self-calibration (the serving revision against itself, 2026-09-18 15:40Z) differed on exactly
 *  those three between two identical calls; `asOf` there is the read time of a fact, not its vintage. */
export const VOLATILE_KEYS = new Set(["fetchedAt", "generatedAt", "requestId", "request_id", "derivedAt", "computedAt", "readAt", "ms", "elapsedMs", "durationMs", "servedAt", "now", "cacheKey", "etag", "traceId", "assertedAt", "assembledAt", "asOf"]);
export const AG_COUNTIES = ["48021", "48055", "48209", "48309"];
const PUD_RE = /^(PUD|PDD|PD|PC)\b/i;

/** Pure: strip volatile keys everywhere. */
export function normalize(v) {
  if (Array.isArray(v)) return v.map(normalize);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).filter(([k]) => !VOLATILE_KEYS.has(k)).map(([k, x]) => [k, normalize(x)]));
  return v;
}

/** Pure: every leaf path where a and b differ. */
export function diffPaths(a, b, path = "") {
  if (a === b) return [];
  const oa = a && typeof a === "object", ob = b && typeof b === "object";
  if (!oa || !ob || Array.isArray(a) !== Array.isArray(b)) return [{ path: path || "(root)", before: a, after: b }];
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].flatMap((k) => diffPaths(a[k], b[k], `${path}.${k}`));
}

/** Pure: is one difference intended? Returns the class name, or null. */
export function intendedClass(d, subject, route) {
  const p = d.path.toLowerCase();
  const text = `${JSON.stringify(d.before ?? "")} ${JSON.stringify(d.after ?? "")}`.toLowerCase();
  // `citationEffectiveDate` is P-270's own new field (LDT 7f676936: a dated citation carries its
  // date as a field; its test expects "2026-04-14" on the Bastrop control). Named from the change
  // set after the 2026-09-18 15:43Z canary run surfaced it, not admitted by a wider pattern.
  if (/citationvintage|vintage|\.citationeffectivedate$/.test(p) || /vintage unknown|takes effect|date unreadable/.test(text)) return "p270-vintage";
  if (route === "draw" && subject.district && PUD_RE.test(subject.district)) return "p257-pud";
  if (route === "node" && /agvaluation/.test(p) && AG_COUNTIES.includes(subject.id.split(":")[0])) return "p322-ag";
  return null;
}

/** Pure: grade one subject's pair of answers on one route. */
export function gradePair(subject, route, prod, canary) {
  if (!prod?.ok || !canary?.ok) return { verdict: "UNMEASURED", why: `prod http ${prod?.http ?? 0}, canary http ${canary?.http ?? 0}` };
  if (prod.http !== canary.http) return { verdict: "FAIL", why: `status differs: prod ${prod.http}, canary ${canary.http}`, diffs: [] };
  const diffs = diffPaths(normalize(prod.json), normalize(canary.json)).map((d) => ({ ...d, cls: intendedClass(d, subject, route) }));
  const bad = diffs.filter((d) => !d.cls);
  return { verdict: bad.length ? "FAIL" : "PASS", diffs, why: bad.length ? `${bad.length} unintended: ${bad.slice(0, 3).map((d) => d.path).join(", ")}` : `${diffs.length} intended difference(s)` };
}

/** Pure: subjects from a surface-probe artifact (the draw body each parcel was asked with). */
export function subjectsFromProbe(doc) {
  const out = [];
  for (const [id, legs] of Object.entries(doc?.ops24?.legsById ?? {})) {
    const fx = legs.facets ?? {};
    const drawKey = legs.draw?.drawKey;
    let body = null;
    if (drawKey === "composed-address" && fx.composedAddress) body = { address: fx.composedAddress };
    else if (drawKey === "record-point" && fx.recordPoint) body = { lat: fx.recordPoint.lat, lng: fx.recordPoint.lng };
    else if (drawKey === "bare-situs" && fx.situsAddress) body = { address: fx.situsAddress };
    out.push({ id, district: fx.zoningDistrict ?? null, drawBody: body });
  }
  return out;
}

async function ask(method, url, key, body) {
  try {
    const r = await fetch(url, { method, headers: { authorization: `Bearer ${key}`, ...(body ? { "content-type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(45_000) });
    const text = await r.text();
    let json = null; try { json = JSON.parse(text); } catch { /* kept as text */ }
    return { ok: !!json, http: r.status, json };
  } catch (e) { return { ok: false, http: 0, error: String(e?.cause?.code ?? e?.message ?? e) }; }
}

function selfTest() {
  const results = [];
  const check = (n, c) => results.push({ n, ok: !!c });
  const ok = (json) => ({ ok: true, http: 200, json });
  const s = { id: "48453:1", district: "SF-2" };
  check("identical answers PASS", gradePair(s, "draw", ok({ a: 1, fetchedAt: "t1" }), ok({ a: 1, fetchedAt: "t2" })).verdict === "PASS");
  check("NOT VACUOUS: an unintended value change FAILS", gradePair(s, "draw", ok({ setbacks: { front: 25 } }), ok({ setbacks: { front: 20 } })).verdict === "FAIL");
  check("a status change FAILS", gradePair(s, "draw", ok({ a: 1 }), { ok: true, http: 500, json: { a: 1 } }).verdict === "FAIL");
  check("a vintage declaration is intended (P-270)", gradePair(s, "draw", ok({ payload: { disclosure: "x" } }), ok({ payload: { disclosure: "x. Setback rule vintage unknown", citationVintage: { state: "unreadable-absent-at-source" } } })).verdict === "PASS");
  check("P-270's new citationEffectiveDate field is intended", gradePair(s, "draw", ok({ payload: {} }), ok({ payload: { citationEffectiveDate: "2026-04-14" } })).verdict === "PASS");
  check("an unrelated new date field is NOT admitted by it", gradePair(s, "draw", ok({ payload: {} }), ok({ payload: { someOtherDate: "2026-04-14" } })).verdict === "FAIL");
  check("a change on a PUD-coded subject's draw is intended (P-257)", gradePair({ id: "48453:2", district: "PUD" }, "draw", ok({ status: "ok" }), ok({ status: "declined" })).verdict === "PASS");
  check("the same change on a Euclidean subject FAILS", gradePair({ id: "48453:2", district: "SF-2" }, "draw", ok({ status: "ok" }), ok({ status: "declined" })).verdict === "FAIL");
  check("agValuation in a no-source county is intended (P-322)", gradePair({ id: "48021:5", district: null }, "node", ok({ agValuationFact: { state: "x" } }), ok({ agValuationFact: { state: "absent" } })).verdict === "PASS");
  check("agValuation in Travis FAILS (not in P-322's four)", gradePair({ id: "48453:5", district: null }, "node", ok({ agValuationFact: { state: "x" } }), ok({ agValuationFact: { state: "absent" } })).verdict === "FAIL");
  check("a side that did not answer is UNMEASURED, never PASS", gradePair(s, "draw", ok({ a: 1 }), { ok: false, http: 0 }).verdict === "UNMEASURED");
  check("subjectsFromProbe rebuilds the draw body the probe used", JSON.stringify(subjectsFromProbe({ ops24: { legsById: { "48453:9": { facets: { composedAddress: "1 A ST, AUSTIN, TX", zoningDistrict: "SF-2" }, draw: { drawKey: "composed-address" } } } } })[0].drawBody) === JSON.stringify({ address: "1 A ST, AUSTIN, TX" }));
  for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.n}`);
  const bad = results.filter((r) => !r.ok).length;
  console.log(bad ? `SELF-TEST FAILED (${bad})` : `SELF-TEST OK (${results.length})`);
  process.exit(bad ? 1 : 0);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) return selfTest();
  const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const canary = arg("--canary"), prod = arg("--prod"), probe = arg("--probe");
  const key = (process.env.SERVICE_API_KEY || "").trim();
  if (!canary || !prod || !probe) { console.error("usage: --canary URL --prod URL --probe artifact.json"); process.exit(2); }
  if (!key) { console.error("UNMEASURED: SERVICE_API_KEY is not set"); process.exit(2); }
  const subjects = subjectsFromProbe(JSON.parse(readFileSync(probe, "utf8")));
  if (!subjects.length) { console.error("UNMEASURED: the probe artifact holds no subjects"); process.exit(2); }
  const ranAt = new Date().toISOString();
  const rows = [];
  for (const s of subjects) {
    const node = `/api/brokerage/v1/place/node/${encodeURIComponent(s.id)}/facets`;
    const [pn, cn] = [await ask("GET", prod + node, key), await ask("GET", canary + node, key)];
    rows.push({ id: s.id, route: "node", ...gradePair(s, "node", pn, cn) });
    if (s.drawBody) {
      const path = "/api/brokerage/v1/place/buildable-envelope";
      const [pd, cd] = [await ask("POST", prod + path, key, s.drawBody), await ask("POST", canary + path, key, s.drawBody)];
      rows.push({ id: s.id, route: "draw", ...gradePair(s, "draw", pd, cd) });
    }
  }
  const count = (v) => rows.filter((r) => r.verdict === v).length;
  const status = count("FAIL") ? "FAIL" : count("UNMEASURED") ? "UNMEASURED" : "PASS";
  const byClass = {};
  for (const r of rows) for (const d of r.diffs ?? []) if (d.cls) byClass[d.cls] = (byClass[d.cls] ?? 0) + 1;
  const out = { instrument: "scripts/cortex-canary-compare.mjs", ranAt, canary, prod, probe, status, counts: { PASS: count("PASS"), FAIL: count("FAIL"), UNMEASURED: count("UNMEASURED") }, intendedByClass: byClass, rows };
  if (arg("--json")) writeFileSync(arg("--json"), JSON.stringify(out, null, 2));
  console.log(`CANARY ${status}  ${JSON.stringify(out.counts)}  intended ${JSON.stringify(byClass)}  (${subjects.length} subjects, ran ${ranAt})`);
  for (const r of rows.filter((x) => x.verdict !== "PASS").slice(0, 25)) console.log(`  ${r.verdict.padEnd(10)} ${r.route.padEnd(5)} ${r.id}  ${r.why}`);
  process.exit(status === "PASS" ? 0 : status === "FAIL" ? 1 : 2);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) await main();
