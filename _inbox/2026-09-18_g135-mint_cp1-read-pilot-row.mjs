#!/usr/bin/env node
/**
 * G-135 / lane g135-mint — CP1: read the pilot `bastrop_tx` row's tier.
 *
 * WHY THIS FILE EXISTS. The dispatch's step 1 says: take the tier from the existing
 * `api_keys` row labelled "Nick, bastrop_tx staff pilot", do not guess it, select only
 * the columns needed, and NEVER select or print a hash or a raw value.
 *
 * The admin API's GET /admin/keys is the instrument that satisfies that literally: it
 * returns the PUBLIC-SAFE projection (db.ts ApiKeyPublic) whose own comment says
 * "Never includes key_hash". So no hash is ever fetched into this process at all,
 * which is stronger than selecting it and not printing it.
 *
 * The admin bootstrap key is read from Secret Manager INSIDE this process (the secret
 * NAME is the only thing that reaches a child process argv) and is never printed,
 * logged, or written to disk.
 *
 * Run: node --use-system-ca _inbox/2026-09-18_g135-mint_cp1-read-pilot-row.mjs
 */

import { execSync } from "node:child_process";

const PROJECT = "hauska-prod-497015";
const MCP = "https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app";

function readSecret(name) {
  const out = execSync(
    `gcloud secrets versions access latest --secret=${name} --project=${PROJECT}`,
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
  );
  const v = out.trim();
  if (!v) throw new Error(`secret ${name} read empty`);
  return v;
}

const adminKey = readSecret("HAUSKA_ADMIN_BOOTSTRAP_KEY");

const res = await fetch(`${MCP}/admin/keys`, {
  headers: { "X-Hauska-Admin-Key": adminKey },
});
if (!res.ok) {
  console.error(`GET /admin/keys -> HTTP ${res.status}`);
  console.error((await res.text()).slice(0, 500));
  process.exit(2);
}
const body = await res.json();
const rows = Array.isArray(body.keys) ? body.keys : [];

// Safe projection only. `key_hash` is not present in this response shape at all.
const SAFE = [
  "key_id",
  "tier",
  "product",
  "jurisdiction_tenant",
  "platform_internal",
  "owner_name",
  "owner_email",
  "status",
  "created_at",
  "last_used_at",
];
const pick = (r) => Object.fromEntries(SAFE.map((k) => [k, r[k] ?? null]));

const tx = rows.filter((r) => r.jurisdiction_tenant === "bastrop_tx");

const report = {
  measuredAt: new Date().toISOString(),
  instrument: `GET ${MCP}/admin/keys`,
  projectionNote:
    "ApiKeyPublic (src/db.ts) — never includes key_hash. This process never fetched a hash or a raw value.",
  totalKeysReturned: rows.length,
  bastropTxRows: tx.map(pick),
  bastropTxRowCount: tx.length,
  rowCounts: {
    active: rows.filter((r) => r.status === "active").length,
    revoked: rows.filter((r) => r.status === "revoked").length,
    other: rows.filter((r) => !["active", "revoked"].includes(r.status)).length,
  },
};
console.log(JSON.stringify(report, null, 2));
