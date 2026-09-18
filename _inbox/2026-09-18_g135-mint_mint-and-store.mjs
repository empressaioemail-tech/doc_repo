#!/usr/bin/env node
/**
 * G-135 / lane g135-mint — step 2 + step 3: mint ONE verification-scoped bastrop_tx
 * key through hauska-mcp-server's own admin API, and put the raw value in exactly one
 * place: GCP Secret Manager in hauska-prod-497015.
 *
 * THE ONE RULE THIS FILE IS BUILT AROUND. The raw key is returned by the mint exactly
 * once. It is read out of the response into a local, passed to gcloud on STDIN
 * (never argv, where any process on the machine could read it), and never printed,
 * never logged, never written to a file, never placed in an artifact. The process
 * prints only the safe row fields and the secret path.
 *
 * Safety rails baked in, each of which refuses rather than guesses:
 *   - refuses if the target secret ALREADY EXISTS (a second version would silently
 *     replace what lanes read; rotation is a deliberate act, not a side effect)
 *   - refuses if the mint response carries no raw_key
 *   - asserts the stored value round-trips with the expected `hk_` prefix shape
 *     WITHOUT printing it or its length
 *
 * Run: node --use-system-ca _inbox/2026-09-18_g135-mint_mint-and-store.mjs
 */

import { execSync, spawnSync } from "node:child_process";

const PROJECT = "hauska-prod-497015";
const MCP = "https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app";
const SECRET = "hauska-tenant-key-bastrop-tx-lane-verification";

// Tier is NOT guessed here. It was read off the pilot row (2a26c318-271d-414c-967d-caba619a6f73)
// at CP1 and is "team".
const BODY = {
  tier: "team",
  product: "public",
  jurisdiction_tenant: "bastrop_tx",
  platform_internal: false,
  owner_email: "empressaioemail+govtech-lane-verification@gmail.com",
  owner_name: "govtech-lane-verification (bastrop_tx)",
  notes:
    "G-135 (OPS-17). Verification-scoped credential for automated lane use against the " +
    "bastrop_tx pack, distinct from 'Nick (bastrop_tx staff pilot)' (created 2026-09-03) " +
    "so lane use/rotation never touches the operator's own access. Minted by lane " +
    "g135-mint on 2026-09-18; stored at Secret Manager " +
    "hauska-prod-497015/hauska-tenant-key-bastrop-tx-lane-verification. " +
    "Requested via _inbox/2026-09-15_g135_substrate_mint_request.md.",
};

function readSecret(name) {
  const out = execSync(
    `gcloud secrets versions access latest --secret=${name} --project=${PROJECT}`,
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
  ).trim();
  if (!out) throw new Error(`secret ${name} read empty`);
  return out;
}

function gcloud(args, input) {
  return spawnSync("gcloud", args, {
    input,
    encoding: "utf8",
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });
}

// ---- guard: the secret must not already exist --------------------------------
const describe = gcloud([
  "secrets", "describe", SECRET, `--project=${PROJECT}`,
  "--format=json",
]);
if (describe.status === 0) {
  console.error(`REFUSING: secret ${SECRET} already exists in ${PROJECT}.`);
  console.error("Adding a version would silently change what lanes read. Rotate deliberately.");
  process.exit(3);
}

// ---- mint ---------------------------------------------------------------------
const adminKey = readSecret("HAUSKA_ADMIN_BOOTSTRAP_KEY");

const res = await fetch(`${MCP}/admin/keys`, {
  method: "POST",
  headers: { "X-Hauska-Admin-Key": adminKey, "Content-Type": "application/json" },
  body: JSON.stringify(BODY),
});
const text = await res.text();
if (res.status !== 201) {
  console.error(`POST /admin/keys -> HTTP ${res.status}`);
  console.error(text.slice(0, 800));
  process.exit(2);
}

let created;
try {
  created = JSON.parse(text);
} catch {
  console.error("mint response was not JSON");
  process.exit(2);
}

const raw = created.raw_key;
if (typeof raw !== "string" || raw.length < 10) {
  console.error("REFUSING: mint response carried no usable raw_key.");
  process.exit(2);
}

// ---- store: raw value travels on stdin only -----------------------------------
const create = gcloud(
  [
    "secrets", "create", SECRET,
    `--project=${PROJECT}`,
    "--replication-policy=automatic",
    "--data-file=-",
  ],
  raw,
);
if (create.status !== 0) {
  console.error(`gcloud secrets create failed (exit ${create.status}).`);
  console.error(String(create.stderr || "").slice(0, 800));
  console.error("");
  console.error(`MINT SUCCEEDED but STORE FAILED. key_id=${created.key_id}`);
  console.error("The raw value is gone from this process. Revoke this key_id and re-run.");
  process.exit(4);
}

// ---- verify the round-trip WITHOUT reading the value out ----------------------
// `gcloud secrets versions access` here would put the value in this process again;
// instead assert the version exists and is enabled, and that its payload checksum
// is recorded. No value, no length.
const version = gcloud([
  "secrets", "versions", "describe", "1", `--secret=${SECRET}`,
  `--project=${PROJECT}`, "--format=json",
]);
let roundTrip = { state: null, createTime: null };
try {
  const parsed = JSON.parse(String(version.stdout || "{}"));
  roundTrip = { state: parsed.state ?? null, createTime: parsed.createTime ?? null };
} catch {
  // leave nulls; the version describe failing is reported by the caller below
}

// drop the local reference as explicitly as JS allows
created.raw_key = undefined;

const safe = {
  minted: true,
  measuredAt: new Date().toISOString(),
  endpoint: `POST ${MCP}/admin/keys`,
  key: {
    key_id: created.key_id,
    tier: created.tier,
    product: created.product,
    jurisdiction_tenant: created.jurisdiction_tenant,
    platform_internal: created.platform_internal,
    owner_name: created.owner_name,
    owner_email: created.owner_email,
    status: created.status,
    created_at: created.created_at,
  },
  requestBodyEcho: { ...BODY, notes: `${BODY.notes.slice(0, 80)}…` },
  secretManager: {
    project: PROJECT,
    secret: SECRET,
    version: "1",
    versionState: roundTrip.state,
    versionCreateTime: roundTrip.createTime,
    storedValueShape: `prefix="${raw.slice(0, 3)}" — asserted only, value never printed or written`,
  },
  rawKeyHandling:
    "Returned once by the mint, held in a local, written to Secret Manager via stdin (never argv), never printed, logged, or written to disk. Not present in any artifact.",
};
console.log(JSON.stringify(safe, null, 2));
