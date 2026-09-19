#!/usr/bin/env node
/**
 * dolphin-app ship acceptance (OPS-17 A-149; OPS-25 D-12/D-13). READ-ONLY.
 *
 * Grades the deployed surface, not the merge. Run after `dolphin-ship.mjs --apply`.
 *   node --use-system-ca scripts/govtech/dolphin-ship-acceptance.mjs
 *
 * It answers, each from source:
 *   1. what production SERVES (deployment, running commit, the platform base) - never the merge;
 *   2. whether the finance route still answers `unknown lens` (the D-13 clause);
 *   3. for every registered domain on bastrop_tx, does it carry RECORDS or a STATED basis. A feed that
 *      is neither is the defect this looks for;
 *   4. THE PII CLAUSE, as a two-derivation check: the dashboards' served work-order `subject` column
 *      against the vendor payload's own `title`, matched per row. One party writing both sides cannot
 *      satisfy it, which is what makes it a check rather than an internal consistency assertion;
 *   5. the platform routes the ship repointed, compared as PAYLOAD against the host production read
 *      before the ship.
 *
 * Self-tests, both directions, so a 200 cannot mean nothing: a bogus tenant key must NOT be accepted,
 * an unknown city must NOT resolve, and on the platform side a mutated bearer must be rejected.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const PROD = "https://app.smartcityos.io";
const V1 = "https://smartcityos.io";
const GCP = "https://smartcity-api-7dyaiy7wha-uc.a.run.app"; // the host production read before the ship
/* G-171 (2026-09-19): the base is now the v1 platform's OWN PRIMARY DOMAIN, not the App Platform
   auto-generated hostname it was. `https://walrus-app-kzog6.ondigitalocean.app` is masked by DO to
   every EXTERNAL client -- this seat and any other gets ECONNRESET, while `smartcityos.io`, which
   serves the same app, answers normally -- so a verification instrument could not read the host it
   was verifying. The negative guard is kept and retargeted: the base must not be the GCP host being
   retired, and must not be the masked auto-generated name that started this. */
const TARGET_BASE = "https://smartcityos.io";
const RETIRED_BASE = "https://walrus-app-kzog6.ondigitalocean.app";
const PROD_APP = "95691c40-27ca-4afb-b9b4-a37e079c5e69";

const failures = [];
const check = (ok, what) => { console.error(`${ok ? "PASS" : "FAIL"}: ${what}`); if (!ok) failures.push(what); };
const sh = (cmd, args) => execFileSync("cmd.exe", ["/d", "/c", cmd, ...args], { encoding: "utf8" }).replace(/\r/g, "");
const secret = (name, project) => sh("gcloud", ["secrets", "versions", "access", "latest", `--secret=${name}`, `--project=${project}`]).trim();
const H = (k) => ({ headers: k ? { "x-hauska-key": k } : {} });
const fetchJson = async (u, init) => { const r = await fetch(u, init); return { status: r.status, body: await r.json().catch(() => null) }; };

console.log(`# dolphin ship acceptance | ${new Date().toISOString()}`);

const HK = secret("hauska-tenant-key-bastrop-tx-lane-verification", "hauska-prod-497015");
const PK = secret("platform-internal-api-key", "smartcity-os-prod");
const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), ".cursor", "mcp.json"), "utf8"));
const doAuth = cfg.mcpServers["do-apps"]?.headers?.Authorization;

/* ---------- 1. what production serves ---------- */
const app = (await fetchJson(`https://api.digitalocean.com/v2/apps/${PROD_APP}`, { headers: { Authorization: doAuth } })).body.app;
const served = app.active_deployment.services[0].source_commit_hash;
const head = sh("git", ["ls-remote", "https://github.com/empressaioemail-tech/smartcity-dashboards.git", "refs/heads/main"]).trim().split(/\s+/)[0];
const baseVar = (app.spec.services[0].envs || []).find((e) => e.key === "SMARTCITY_V1_PLATFORM_BASE");
console.log(`\n## production serves`);
console.log(`   deployment=${app.active_deployment.id} phase=${app.active_deployment.phase} cause=${JSON.stringify(app.active_deployment.cause)}`);
console.log(`   source_commit_hash=${served}`);
console.log(`   dashboards origin/main=${head}`);
console.log(`   SMARTCITY_V1_PLATFORM_BASE=${baseVar?.value}`);
check(served === head, "the running commit IS dashboards origin/main, byte for byte");
check(baseVar?.value === TARGET_BASE, `the platform base is the v1 platform's own primary domain (${TARGET_BASE})`);
check(baseVar?.value !== RETIRED_BASE, "the platform base is NOT the DO auto-generated hostname, which is masked to every external client");
check(!String(baseVar?.value || "").includes("a.run.app"), "the platform base is not a host being retired (the GCP original)");
check((app.spec.domains || []).some((d) => d.domain === "app.smartcityos.io" && d.type === "PRIMARY"), "app.smartcityos.io is still the PRIMARY domain");

/* ---------- 2. the finance clause ---------- */
const finOld = await fetchJson(`${PROD}/api/lenses/finance/sources?cityKey=template-city`);
const finNew = await fetchJson(`${PROD}/api/lenses/finance/sources?cityKey=bastrop_tx`, H(HK));
console.log(`\n## finance route`);
console.log(`   template-city keyless: ${finOld.status} ${JSON.stringify(finOld.body?.error ?? Object.keys(finOld.body ?? {}))}`);
console.log(`   bastrop_tx keyed:      ${finNew.status} ${JSON.stringify(finNew.body?.error ?? Object.keys(finNew.body ?? {}))}`);
check(!(finOld.status === 404 && finOld.body?.error === "unknown lens"), "the finance route no longer answers `unknown lens` (the D-13 clause)");
check(finNew.status === 200, "the finance route serves bastrop_tx with the tenant key");

/* ---------- 3. every domain on bastrop_tx: records or a stated basis ---------- */
const dom = await fetchJson(`${PROD}/api/city-domains?cityKey=bastrop_tx`, H(HK));
console.log(`\n## bastrop_tx domains: ${dom.body?.withRecords}/${dom.body?.regionCount} carry records`);
const bad = [];
for (const r of dom.body?.regions || []) {
  const n = r.recordCount ?? 0;
  const stated = r.status && r.status !== "ok" && r.basis;
  console.log(`   ${String(r.domainId).padEnd(20)} gatedBy=${String(r.gatedBy).padEnd(9)} status=${String(r.status).padEnd(17)} records=${String(n).padEnd(6)} ${n > 0 ? "" : `basis=${String(r.basis).slice(0, 40)}`}`);
  if (n === 0 && !stated) bad.push(r.domainId);
}
check(dom.body?.regionCount === 11, "the domain registry still reports 11 registered domains");
check(bad.length === 0, "every domain without records states a basis rather than reporting bare zero");

/* ---------- 4. the PII clause, two derivations ----------
   `recordId` is NOT unique: 181 rows carry 52 distinct work-order numbers, because one work order has
   several line items. A per-row join therefore does not exist, and a Map keyed on it collapses rows
   and reports mismatches that are artifacts of the join (it did, on 2026-09-18). The comparison is
   therefore on the MULTISET of (id, subject) against the vendor's (workOrderNumber, type), which is
   both correct under duplicates and still a two-derivation check: the dashboards' served bytes on one
   side, the platform's vendor payload on the other. */
const rows = (await fetchJson(`${PROD}/api/domains/work-orders?cityKey=bastrop_tx`, H(HK))).body?.records || [];
const vendor = (await fetchJson(`${V1}/api/platform/mygov/work-orders`, { headers: { Authorization: `Bearer ${PK}` } })).body?.workOrders || [];
const PHONE = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/;
const ms = (a) => a.slice().sort();
const servedPairs = rows.map((r) => `${r.recordId}|${r.subject}`);
const vendorPairs = vendor.map((r) => `${r.workOrderNumber || r.id}|${r.type}`);
const multisetEqual = servedPairs.length === vendorPairs.length && ms(servedPairs).every((x, i) => x === ms(vendorPairs)[i]);
const typeSet = new Set(vendor.map((r) => r.type));
const titleSet = new Set(vendor.map((r) => r.title));
const offVocabulary = rows.filter((r) => !typeSet.has(String(r.subject)) && String(r.subject) !== "Untitled work order");
const leakedTitles = rows.filter((r) => titleSet.has(String(r.subject)) && !typeSet.has(String(r.subject)));
const phones = rows.filter((r) => PHONE.test(String(r.subject)));
console.log(`\n## work-order subject: the dashboards' served bytes vs the vendor payload`);
console.log(`   served rows=${rows.length} over ${new Set(servedPairs.map((p) => p.split("|")[0])).size} distinct work-order numbers (one order, several line items)`);
console.log(`   vendor rows=${vendor.length} over ${new Set(vendorPairs.map((p) => p.split("|")[0])).size} distinct work-order numbers`);
console.log(`   multiset (recordId|subject) vs (workOrderNumber|type): ${multisetEqual ? "IDENTICAL" : "DIFFERENT"}`);
console.log(`   distinct served subjects: ${JSON.stringify([...new Set(rows.map((r) => r.subject))])}`);
console.log(`   distinct vendor types:    ${JSON.stringify([...typeSet])}`);
console.log(`   subjects outside the vendor's type vocabulary: ${offVocabulary.length}`);
console.log(`   subjects that are a vendor free-text title and not a type (leakage): ${leakedTitles.length}`);
console.log(`   subjects carrying a phone-number shape: ${phones.length}`);
console.log(`   served rows carrying a 'title' field: ${rows.filter((r) => "title" in r).length}`);
check(rows.length === vendor.length, `served row count equals the vendor row count (${vendor.length})`);
check(multisetEqual, "the served (id, subject) multiset IS the vendor's (workOrderNumber, type) multiset, row for row");
check(offVocabulary.length === 0, "every served subject is drawn from the vendor's own declared type vocabulary");
check(leakedTitles.length === 0, "NO served subject is the vendor's free-text title, where residents write names and phone numbers");
check(phones.length === 0, "no served subject carries a phone-number shape");
check(!rows.some((r) => "title" in r), "no served row carries a `title` field at all");

/* ---------- 5. the repointed platform routes, compared as payload ---------- */
const ROUTES = ["/api/platform/mygov/permits", "/api/platform/mygov/work-orders", "/api/platform/mygov/inspections",
  "/api/platform/mygov/code-violations", "/api/platform/mygov/business-licenses", "/api/platform/powerbi/cip-projects",
  "/api/platform/samsara/vehicles", "/api/platform/spireon/vehicles"];
console.log(`\n## platform route payload parity, v1 platform vs the host production read before the ship`);
const getP = async (base, p) => { try { const r = await fetch(base + p, { headers: { Authorization: `Bearer ${PK}` }, signal: AbortSignal.timeout(60000) }); const t = await r.text(); return { s: r.status, t }; } catch (e) { return { s: "ERR", t: e.message }; } };
let mismatched = 0;
for (const p of ROUTES) {
  const a = await getP(V1, p), b = await getP(GCP, p);
  const same = a.s === b.s && a.t === b.t;
  if (!same) mismatched++;
  console.log(`   ${same ? "same  " : "DIFFER"} ${p}  v1=${a.s}/${a.t.length}B  gcp=${b.s}/${b.t.length}B`);
}
check(mismatched === 0, "every platform route the dashboards already read returns an identical payload on both hosts");

/* ---------- 6. the instrument can fail ---------- */
const badKey = await fetchJson(`${PROD}/api/city-identity?cityKey=bastrop_tx`, H("not-a-real-key"));
const noCity = await fetchJson(`${PROD}/api/city-identity?cityKey=no-such-city`, H(HK));
const badBearer = await getP(V1, "/api/platform/mygov/permits").then(() => fetch(V1 + "/api/platform/mygov/permits", { headers: { Authorization: `Bearer ${"x".repeat(51)}` } }).then((r) => r.status));
console.log(`\n## instrument can fail`);
console.log(`   bogus tenant key: ${badKey.status}   unknown city: ${noCity.status}   bogus platform bearer: ${badBearer}`);
check(badKey.status === 401, "a bogus tenant key is refused (so the keyed 200s mean the key worked)");
check(noCity.status === 404, "an unknown city does not resolve");
check(badBearer === 401, "a bogus platform bearer is refused (so the payload parity is not just 'any request')");

if (failures.length) { console.error(`\n${failures.length} check(s) FAILED.`); process.exitCode = 2; }
else console.log("\nACCEPTED. Every clause reads clean on the deployed surface.");
