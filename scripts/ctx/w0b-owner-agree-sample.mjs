#!/usr/bin/env node
/**
 * W0b item 2. Leftover no-row owner-agree using the LDT keys, not SQL regexp.
 *
 * 1) Snapshot no-row prop_ids (place_key range, LIMIT 800).
 * 2) CAD IN-list. Keep numbered streets only (`/^[0-9]+\s+[A-Za-z]/`).
 *    First-by-place_key leftovers are rural CR; those are not the recovery set.
 * 3) TxGIO by house+street LIKE prefix (batches of 20). No table-wide regexp.
 * 4) Match on normalizeSitusAddress (LDT joinNormalize). Gate with ownersAgree
 *    (LDT joinIntegrityGate lead-token rule). Never prints the URL.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = join(ROOT, "_inbox", "2026-08-30_ctx_w0b_owner_agree.json");
const FIPS = ["48021", "48055", "48453"];
const GATE = 0.86;
const SNAPSHOT_N = 800;
const NUMBERED_CAP = 60;

function redact(s) {
  return String(s).replace(/postgres(?:ql)?:\/\/\S+/gi, "postgres://REDACTED");
}

function url() {
  return process.env.CORTEX_DATABASE_URL || process.env.PRODUCTION_NEONDB_URL || "";
}

function sqlLiteral(v) {
  return `'${String(v).replace(/'/g, "''")}'`;
}

function psql(u, sql, timeoutMs = 20000) {
  const r = spawnSync("psql", [u, "-v", "ON_ERROR_STOP=1", "-A", "-F", "\t", "-t", "-c", sql], {
    encoding: "utf8",
    timeout: timeoutMs,
  });
  if (r.status !== 0) {
    throw new Error(redact(r.stderr || r.stdout || "psql failed"));
  }
  return String(r.stdout || "")
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.length > 0 && l !== "SET" && !l.startsWith("SET\t"))
    .map((l) => l.split("\t"));
}

/** LDT joinNormalize.normalizeSitusAddress */
function normalizeSitusAddress(address) {
  if (address == null) return "";
  return String(address).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

const NOISE = new Set([
  "JR", "SR", "II", "III", "IV", "LLC", "LP", "LLP", "INC", "CORP", "CO",
  "COMPANY", "TRUST", "TR", "ESTATE", "EST", "ET", "AL", "ETAL", "ETUX", "ETVIR", "THE",
]);

function ownerLeadToken(raw) {
  if (raw == null) return "";
  let s = String(raw).toUpperCase().trim();
  if (!s) return "";
  const commaIdx = s.indexOf(",");
  if (commaIdx > 0) s = `${s.slice(0, commaIdx)} ${s.slice(commaIdx + 1)}`;
  const tokens = s
    .replace(/[^A-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0 && !NOISE.has(t));
  return tokens[0] ?? "";
}

function ownersAgree(a, b) {
  const la = ownerLeadToken(a);
  const lb = ownerLeadToken(b);
  if (!la || !lb) return false;
  if (la === lb) return true;
  const shorter = la.length <= lb.length ? la : lb;
  const longer = la.length <= lb.length ? lb : la;
  return shorter.length >= 4 && longer.startsWith(shorter);
}

/** Walk / txgioAddressNormalize: drop trailing ", CITY, TX ZIP" before the key. */
function stripCityStateZip(situs) {
  return String(situs ?? "")
    .replace(/,?\s+[A-Z .']+,\s*TX\s*\d{5}(?:-\d{4})?\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function houseStreetPrefix(situs) {
  const stripped = stripCityStateZip(situs);
  const parts = stripped.split(/\s+/);
  if (parts.length < 2) return null;
  if (!/^[0-9]+/.test(parts[0])) return null;
  return `${parts[0]} ${parts[1]}`;
}

const u = url();
if (!u) {
  writeFileSync(
    OUT,
    JSON.stringify({ control: "ctx-w0b-owner-agree", liveStatus: "unmeasured", reason: "CORTEX_DATABASE_URL unset" }, null, 2) + "\n",
  );
  process.exit(2);
}

let host = "unparsed";
try {
  host = new URL(u).host.split(".")[0];
} catch {
  host = "unparsed";
}

const counties = {};
const attempts = [];

for (const fips of FIPS) {
  try {
    const leftoverIds = psql(
      u,
      `
SET default_transaction_read_only = on;
SET statement_timeout = 15000;
SELECT split_part(place_key, ':', 3)
  FROM place_layer_snapshots
 WHERE adapter_key = 'node-facets:tier1'
   AND place_key >= 'node:${fips}:' AND place_key < 'node:${fips};'
   AND payload_json #>> '{provenance,parcelJoin,state}' = 'no-row'
 LIMIT ${SNAPSHOT_N};
`,
      18000,
    )
      .map((r) => r[0])
      .filter((id) => id && /^\S+$/.test(id));
    attempts.push({ fips, step: "snapshot-no-row", n: leftoverIds.length, result: "ok" });
    if (leftoverIds.length === 0) {
      counties[fips] = { leftover_n: 0, verdict: "unmeasured", reason: "zero no-row ids" };
      continue;
    }

    const cadRows = psql(
      u,
      `
SET default_transaction_read_only = on;
SET statement_timeout = 15000;
SELECT TRIM(prop_id::text), situs_address, owner_name
  FROM cad_property
 WHERE county_fips = '${fips}'
   AND TRIM(prop_id::text) IN (${leftoverIds.map(sqlLiteral).join(",")});
`,
      18000,
    ).map((r) => ({ prop_id: r[0], situs: r[1] ?? "", owner: r[2] ?? "" }));

    const numbered = cadRows
      .filter((r) => /^[0-9]+\s+[A-Za-z]/.test(stripCityStateZip(r.situs)))
      .slice(0, fips === "48453" ? 30 : NUMBERED_CAP);
    attempts.push({
      fips,
      step: "cad-numbered",
      n: numbered.length,
      cad_n: cadRows.length,
      result: "ok",
    });
    if (numbered.length === 0) {
      counties[fips] = {
        leftover_n: leftoverIds.length,
        numbered_n: 0,
        verdict: "no-go",
        reason: "leftover no-row in this window has no numbered street situs; situs-extend would recover zero",
      };
      continue;
    }

    const prefixes = [...new Set(numbered.map((r) => houseStreetPrefix(r.situs)).filter(Boolean))];
    const txgio = [];
    for (let i = 0; i < prefixes.length; i += fips === "48453" ? 8 : 20) {
      const chunk = prefixes.slice(i, i + (fips === "48453" ? 8 : 20));
      const rows = psql(
        u,
        `
SET default_transaction_read_only = on;
SET statement_timeout = 20000;
SELECT situs_address, owner_name
  FROM txgio_parcel
 WHERE county_fips = '${fips}'
   AND (${chunk.map((p) => `situs_address ILIKE ${sqlLiteral(p + "%")}`).join(" OR ")});
`,
        22000,
      );
      for (const r of rows) txgio.push({ situs: r[0] ?? "", owner: r[1] ?? "" });
    }
    attempts.push({ fips, step: "txgio-prefix", prefixes: prefixes.length, n: txgio.length, result: "ok" });

    const byKey = new Map();
    for (const t of txgio) {
      const k = normalizeSitusAddress(stripCityStateZip(t.situs));
      if (!k) continue;
      if (!byKey.has(k)) byKey.set(k, []);
      byKey.get(k).push(t);
    }

    let situs_hits = 0;
    let owners_agree = 0;
    let owners_blank = 0;
    const examples = [];
    for (const c of numbered) {
      const key = normalizeSitusAddress(stripCityStateZip(c.situs));
      const hits = byKey.get(key) ?? [];
      if (examples.length < 3) {
        examples.push({
          cad: c.situs,
          stripped: stripCityStateZip(c.situs),
          key,
          txgioHit: hits[0]?.situs ?? null,
        });
      }
      if (hits.length === 0) continue;
      situs_hits += 1;
      if (!ownerLeadToken(c.owner)) {
        owners_blank += 1;
        continue;
      }
      if (hits.some((h) => ownersAgree(c.owner, h.owner))) owners_agree += 1;
    }

    const rate = situs_hits > 0 ? owners_agree / situs_hits : null;
    counties[fips] = {
      leftover_n: leftoverIds.length,
      numbered_n: numbered.length,
      situs_hits,
      owners_agree,
      owners_blank,
      rate,
      gate: GATE,
      verdict:
        situs_hits === 0
          ? "no-go"
          : rate >= GATE
            ? "go"
            : "no-go",
      reason:
        situs_hits === 0
          ? "numbered leftover produced zero LDT situs-key hits; recovery would be vacuous"
          : rate >= GATE
            ? "owner-agree at or above Hays leftover gate"
            : "owner-agree below 0.86 leftover gate",
      method: "strip city/state/zip; LDT normalizeSitusAddress + ownersAgree; numbered leftover",
      examples,
    };
  } catch (err) {
    attempts.push({ fips, result: "error", error: redact(String(err.message || err)).slice(0, 240) });
    counties[fips] = { verdict: "unmeasured", reason: redact(String(err.message || err)).slice(0, 240) };
  }
}

const go = FIPS.filter((f) => counties[f]?.verdict === "go");
const nogo = FIPS.filter((f) => counties[f]?.verdict === "no-go");
const unmeasured = FIPS.filter((f) => counties[f]?.verdict === "unmeasured");
const report = {
  control: "ctx-w0b-owner-agree",
  wdll: "_inbox/2026-08-30_ctx_w0b_prebake_review_WDLL.md item 2",
  liveStatus: unmeasured.length === 0 ? "measured" : go.length + nogo.length > 0 ? "partial" : "unmeasured",
  queriedAt: new Date().toISOString(),
  snapshot: {
    host,
    database: "neondb",
    readOnly: true,
    method: "snapshot no-row 800; CAD IN; numbered streets; txgio house+street LIKE batches; LDT keys in JS",
    methodNote: "Rural CR leftovers excluded. Rate is among numbered leftover that key-match. Zero key hits is no-go (vacuous recovery), not unmeasured.",
    priorAttempts: "regexp join timeout; exact situs IN hit 0 because CR leftovers and punctuation",
    attempts,
  },
  publishedGate: { leftoverApply: GATE, haysPublished: 0.86, williamsonPublished: 0.89 },
  counties,
  w1:
    unmeasured.length > 0
      ? `blocked on ${unmeasured.join(",")}. Do not invent a go.`
      : `situs-extend ${go.join(",") || "none"}. no-go ${nogo.join(",") || "none"} stays no-row. landUse/tax-year/honest-point still run.`,
  rejected: "A fabricated go so W1 can start.",
};

writeFileSync(OUT, JSON.stringify(report, null, 2) + "\n");
console.log(
  JSON.stringify(
    { ok: true, liveStatus: report.liveStatus, counties: Object.fromEntries(FIPS.map((f) => [f, counties[f]?.verdict])), w1: report.w1 },
    null,
    2,
  ),
);
