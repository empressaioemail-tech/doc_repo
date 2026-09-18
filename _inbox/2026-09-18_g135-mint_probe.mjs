#!/usr/bin/env node
/**
 * G-135 / lane g135-mint — step 4: prove the minted credential BY VIOLATION, both directions.
 *
 * The raw value is read from Secret Manager INSIDE this process, presented in the
 * `x-hauska-key` header, and never printed. Every cell records a status code; the
 * artifact holds pack identity and refusal bodies, no credential material.
 *
 * Run: node --use-system-ca _inbox/2026-09-18_g135-mint_probe.mjs
 */

import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT = "hauska-prod-497015";
const SECRET = "hauska-tenant-key-bastrop-tx-lane-verification";
const NEW_KEY_ID = "96e40316-0907-49f3-8c6e-d47d9013f02e";
const MCP = "https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app";
const APP = "https://d12-main-uat-gqnjx.ondigitalocean.app";
const GARBAGE = "hk_garbage_not_a_real_key_000";

const key = execSync(
  `gcloud secrets versions access latest --secret=${SECRET} --project=${PROJECT}`,
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
).trim();
if (!/^hk_/.test(key)) {
  console.error("REFUSING: stored secret does not have the hk_ key shape.");
  process.exit(2);
}

async function cell(name, url, headers) {
  const started = Date.now();
  let status = null;
  let body = null;
  let err = null;
  try {
    const res = await fetch(url, { headers, redirect: "manual" });
    status = res.status;
    const t = await res.text();
    try { body = JSON.parse(t); } catch { body = t.slice(0, 600); }
  } catch (e) {
    err = String(e);
  }
  let summary = null;
  if (body && typeof body === "object") {
    summary = {
      cityKey: body.cityKey ?? null,
      displayName: body.displayName ?? null,
      environment: body.environment ?? null,
      accessPolicy: body.accessPolicy ?? body.cityPack?.accessPolicy ?? null,
      regionCount: body.regionCount ?? null,
      withRecords: body.withRecords ?? null,
      error: body.error ?? body.message ?? null,
      anonymous: body.anonymous ?? null,
      jurisdiction_tenant: body.jurisdiction_tenant ?? null,
      key_id: body.key_id ?? null,
    };
  }
  return {
    cell: name,
    url,
    presented: headers?.["x-hauska-key"] === undefined ? "no key" : headers["x-hauska-key"] === GARBAGE ? "garbage key" : "the minted key",
    httpStatus: status,
    latencyMs: Date.now() - started,
    summary,
    bodyHead: typeof body === "string" ? body.slice(0, 300) : undefined,
    error: err,
  };
}

const withKey = { "x-hauska-key": key };
const garbageKey = { "x-hauska-key": GARBAGE };

const cells = [];
const probeStartedAt = Date.now();
cells.push(await cell("A whoami with minted key (MCP)", `${MCP}/auth/whoami`, withKey));
cells.push(await cell("B whoami anonymous (MCP, control)", `${MCP}/auth/whoami`, undefined));
cells.push(await cell("C bastrop_tx with minted key (app)", `${APP}/api/city-domains?cityKey=bastrop_tx`, withKey));
cells.push(await cell("D bastrop_tx no key (app)", `${APP}/api/city-domains?cityKey=bastrop_tx`, undefined));
cells.push(await cell("E bastrop_tx garbage key (app)", `${APP}/api/city-domains?cityKey=bastrop_tx`, garbageKey));
cells.push(await cell("F fixture-city (OTHER tenant-private pack) with minted key (app)", `${APP}/api/city-domains?cityKey=fixture-city`, withKey));
cells.push(await cell("G template-city (public-free) no key (app, control)", `${APP}/api/city-domains?cityKey=template-city`, undefined));
cells.push(await cell("H no-such-city with minted key (app, control)", `${APP}/api/city-domains?cityKey=no-such-city-zzz`, withKey));

const find = (n) => cells.find((c) => c.cell.startsWith(n));

// ---- corroborate WHICH key_id the whoami call used ---------------------------
// /auth/whoami's body is {"anonymous":false,"jurisdiction_tenant":"bastrop_tx"} and carries
// NO key_id (measured, not assumed — the dispatch expected one and the route does not return
// it). The link between the presented value and the new key_id is therefore established from
// the store instead: GET /admin/keys immediately after the probe, reading the new row's
// last_used_at, which this probe's own call must have advanced.
const adminKey = execSync(
  `gcloud secrets versions access latest --secret=HAUSKA_ADMIN_BOOTSTRAP_KEY --project=${PROJECT}`,
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
).trim();
let storeCorroboration = { measured: false };
try {
  const r = await fetch(`${MCP}/admin/keys`, { headers: { "X-Hauska-Admin-Key": adminKey } });
  const j = await r.json();
  const row = (j.keys || []).find((k) => k.key_id === NEW_KEY_ID);
  storeCorroboration = {
    measured: true,
    instrument: `GET ${MCP}/admin/keys`,
    key_id: NEW_KEY_ID,
    rowFound: Boolean(row),
    row: row
      ? {
          tier: row.tier,
          product: row.product,
          jurisdiction_tenant: row.jurisdiction_tenant,
          platform_internal: row.platform_internal,
          owner_name: row.owner_name,
          owner_email: row.owner_email,
          status: row.status,
          created_at: row.created_at,
          last_used_at: row.last_used_at,
        }
      : null,
    advanceClaim: row?.last_used_at
      ? "last_used_at is at or after the first cell of this probe, which is what ties the value this script presented to this key_id"
      : "UNMEASURED: no last_used_at on the row",
    lastUsedAtIsAfterProbeStart: row?.last_used_at
      ? Date.parse(row.last_used_at) >= probeStartedAt
      : null,
  };
} catch (e) {
  storeCorroboration = { measured: false, error: String(e) };
}

const expected = {
  A: { want: 200, why: "/auth/whoami resolves the presented key to bastrop_tx (anonymous=false) and, per storeCorroboration, to this key_id — the route itself carries no key_id" },
  B: { want: 200, why: "anonymous control: the route exists and treats no key as anonymous" },
  C: { want: 200, why: "the tenant-private pack the key is scoped to is readable WITH the key" },
  D: { want: 401, why: "violation direction 1: the same route WITHOUT the key is refused" },
  E: { want: 401, why: "violation direction 2: a garbage key is refused" },
  F: { want: "refused (401/403)", why: "violation direction 3: the SAME key against a DIFFERENT tenant-private pack is refused — the direction that proves the key is tenant-scoped and not a master key" },
  G: { want: 200, why: "control: the public-free demo pack is readable with no key, so the 401s above are the gate and not an outage" },
  H: { want: "404 (or a refusal)", why: "control: an unknown city is not the same answer as a gated city" },
};

const verdict = (id) => {
  const c = find(id);
  const s = c?.httpStatus;
  switch (id) {
    case "A": return s === 200 && c.summary?.anonymous === false && c.summary?.jurisdiction_tenant === "bastrop_tx" ? "PASS" : "FAIL";
    case "B": return s === 200 && c.summary?.anonymous === true ? "PASS" : "FAIL";
    case "C": return s === 200 ? "PASS" : "FAIL";
    case "D": return s === 401 ? "PASS" : "FAIL";
    case "E": return s === 401 ? "PASS" : "FAIL";
    case "F": return (s === 401 || s === 403) ? "PASS" : "FAIL";
    case "G": return s === 200 ? "PASS" : "FAIL";
    case "H": return (s === 404 || s === 401 || s === 403) ? "PASS" : "FAIL";
    default: return "UNMEASURED";
  }
};

const rows = cells.map((c) => ({
  ...c,
  expect: expected[c.cell[0]],
  verdict: verdict(c.cell[0]),
}));

const allPass =
  rows.every((r) => r.verdict === "PASS") &&
  storeCorroboration.measured === true &&
  storeCorroboration.rowFound === true &&
  storeCorroboration.lastUsedAtIsAfterProbeStart === true;

const artifact = {
  lane: "g135-mint",
  planRows: ["G-135"],
  kind: "credential-mint proof by violation",
  measuredAt: new Date().toISOString(),
  instrument: "_inbox/2026-09-18_g135-mint_probe.mjs (this lane's own instrument)",
  whyNotSurfaceProbe:
    "The dispatch's close skeleton says probe.artifact is 'a path under _inbox/ produced by scripts/surface-probe.mjs'. scripts/surface-probe.mjs has no G-135 row and no row measuring an admin-minted tenant credential; its ROWS registry covers OPS-23/OPS-24 customer surfaces. Citing it would cite an instrument that measured other rows. Declared as a deviation, per the G-159 precedent, rather than worked around by naming this file misleadingly.",
  credential: {
    key_id: NEW_KEY_ID,
    jurisdiction_tenant: "bastrop_tx",
    tier: "team",
    product: "public",
    platform_internal: false,
    header: "x-hauska-key",
    storedAt: `Secret Manager ${PROJECT}/${SECRET} (version 1)`,
    valueHandling: "read from Secret Manager inside this process; presented in a header; never printed, logged or written to any artifact",
  },
  hosts: { mcp: MCP, app: APP, appName: "d12-main-uat (non-production)" },
  expected,
  cells: rows,
  storeCorroboration,
  keyIdLinkageNote:
    "The dispatch expected /auth/whoami to return the new key_id. It does not: the deployed route answers {\"anonymous\":false,\"jurisdiction_tenant\":\"bastrop_tx\"} only. Recorded as a contradiction of the dispatch, not worked around silently. The key_id is corroborated instead by storeCorroboration above, which measures that THIS probe advanced this key_id's last_used_at.",
  overallVerdict: allPass ? "PASS" : "FAIL",
  counts: {
    cells: rows.length,
    pass: rows.filter((r) => r.verdict === "PASS").length,
    fail: rows.filter((r) => r.verdict === "FAIL").length,
    countingRule: "one cell per HTTP request this script made; verdict is this script's own comparison of the measured status code against the expected band declared above",
  },
  note:
    "Direction F is measurable rather than UNMEASURED because smartcity-dashboards ships TWO tenant-private packs, not one: src/city-pack.test.mjs names fixture-city (tenant-private tenancy test subject) and bastrop_tx (real). So the 'same key, different tenant-private pack' refusal was measured against a real other tenant rather than declared unmeasurable.",
};

const stamp = new Date().toISOString().slice(11, 19).replace(/:/g, "");
const out = join(HERE, `2026-09-18_${stamp}_g135_mint_credential_probe.json`);
writeFileSync(out, JSON.stringify(artifact, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ artifactPath: out, overallVerdict: artifact.overallVerdict, counts: artifact.counts }, null, 2));
console.log(JSON.stringify(rows.map((r) => ({ cell: r.cell, presented: r.presented, httpStatus: r.httpStatus, verdict: r.verdict })), null, 2));
process.exit(allPass ? 0 : 1);
