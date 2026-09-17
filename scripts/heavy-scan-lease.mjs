#!/usr/bin/env node
/**
 * P-281 session side: take, release, renew, list and check heavy-scan leases from a SESSION.
 *
 * WHY THIS EXISTS. AGENT-CONTRACT section 4 applies to a session about to run a heavy scan by hand
 * exactly as much as it applies to a Cloud Run job -- and a session is the one caller that cannot
 * hold a database lease, because it has no factory database credential and must not be given one.
 * The factory store is already the place both kinds of caller can reach, and `factory-control`
 * already serves it, so the session goes through the control API (CP1's decision: the API over
 * "a documented take call", because a documented-but-unbuilt take call is a control that cannot
 * fire).
 *
 * CREDENTIAL: TWO ENVIRONMENT VARIABLES, AND THEIR VALUES ARE NEVER PRINTED.
 *   FACTORY_CONTROL_API_URL  the factory-control service base URL
 *   FACTORY_CONTROL_API_KEY  the bearer token (a Cloud Run secret mount on console-audit today)
 * No database credential is read. The refusals below name the MISSING VARIABLE, never a value, and
 * this file never echoes either one.
 *
 * THE HONEST FAILURE MODE. This lane does not deploy. Until the integration seat ships a revision
 * carrying the four heavy-scan-lease routes, the API answers 404 and this script refuses with
 * ENDPOINT_NOT_DEPLOYED, naming what must ship. It does NOT fall back to a local file or to a
 * silent no-op: a lease that only exists in the caller's imagination is the "guardrail that does
 * not survive a clone" DEV_PROCESS refuses, and it would be worse than no lease at all because the
 * fleet would believe a heavy scan had announced itself.
 *
 * THE STORE YOU NAME. Pass the host (`ep-cool-123.aws.neon.tech`) or the whole URL you connect
 * with (`postgres://user:pw@ep-cool-123.aws.neon.tech/neondb`); the factory keys the lease on the
 * HOST, lowercased, with the port and database stripped, so both spellings contend with a job that
 * took the lease through its own connection URL. If your spelling is not the key, it is kept as the
 * row's alias so `list` still shows the lease you took.
 *
 * P-307: THE STORE MUST BE A HOST, AND THE FACTORY DECIDES THAT -- NOT THIS SCRIPT. A name with a
 * single label and no dot (`factory-store`, an env-var name, a container service name) is not a
 * store host and is refused by name with LEASE_STORE_INVALID; so is a URL that carries no host. The
 * refusal quotes the spelling, because the spelling is the defect: on 2026-09-17 a session held
 * `factory-store` while the hourly gate job held `ep-round-base-au0jofwp.c-10.us-east-1.aws.neon.tech`,
 * one physical store carrying two concurrent heavy windows, both callers told they held it. And the
 * pooler and direct hostnames of ONE Neon endpoint are now ONE key, so a caller holding
 * `ep-x-pooler...` contends with a job holding `ep-x...`.
 *
 * This script deliberately does NOT re-implement the rule: a second copy of a key rule in another
 * repo drifts from the first, and the factory is the only side that can see every caller. What this
 * script owes you is the opposite: print the code AND the reason, with an exit code of its own, so a
 * refused spelling cannot be mistaken for a network failure and retried.
 *
 * Usage:
 *   node scripts/heavy-scan-lease.mjs list [--store HOST]
 *   node scripts/heavy-scan-lease.mjs take --store HOST_OR_URL --holder SEAT [--window-kind heavy-scan]
 *                                         [--alias NAME] [--database NAME] [--phase TEXT]
 *                                         [--county FIPS] [--ttl-seconds N] [--reason TEXT]
 *   node scripts/heavy-scan-lease.mjs renew  --token UUID --holder SEAT [--ttl-seconds N]
 *   node scripts/heavy-scan-lease.mjs release --token UUID --holder SEAT [--reason TEXT]
 *   node scripts/heavy-scan-lease.mjs check  --token UUID
 *   node scripts/heavy-scan-lease.mjs selftest
 *
 * Exit codes: 0 ok; 2 usage; 3 ENDPOINT_NOT_DEPLOYED; 4 CALLER_NOT_REGISTERED (bad/missing
 * credential); 5 LEASE_HELD (the store is held; the blocking holder is named in the output);
 * 6 LEASE_LOST / LEASE_NOT_FOUND; 7 LEASE_STORE_INVALID (the store you named is not a store host --
 * the `reason` names the spelling; fix it and take again).
 */
import { fileURLToPath } from "node:url";

export const ENDPOINT_NOT_DEPLOYED = "ENDPOINT_NOT_DEPLOYED";
export const CALLER_NOT_REGISTERED = "CALLER_NOT_REGISTERED";
export const LEASE_HELD = "LEASE_HELD";
export const LEASE_LOST = "LEASE_LOST";
export const LEASE_NOT_FOUND = "LEASE_NOT_FOUND";
/**
 * P-307. The factory refuses a store that cannot be a store host (a single label such as
 * `factory-store`, or a URL with no host) with this code and a reason naming the spelling. It is
 * not a LEASE_LOST and not a crash: the caller's spelling is wrong and the store is untouched, so
 * it gets its own exit code and its own line in the output.
 */
export const LEASE_STORE_INVALID = "LEASE_STORE_INVALID";
export const USAGE = "USAGE";

/** Minimum the server accepts; kept here too so a bad --ttl-seconds refuses before a round trip. */
export const MIN_TTL_SECONDS = 60;

const VERBS = new Set(["list", "take", "renew", "release", "check", "selftest"]);

/** The verbs the API treats as mutations and refuses without an operator identity. */
export const MUTATIONS = new Set(["take", "renew", "release"]);

export function parseArgs(argv) {
  const [verb, ...rest] = argv;
  if (!verb || !VERBS.has(verb)) {
    const err = new Error(`usage: heavy-scan-lease list|take|renew|release|check ...`);
    err.code = USAGE;
    throw err;
  }
  const flags = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (!a.startsWith("--")) {
      const err = new Error(`unexpected argument ${a}`);
      err.code = USAGE;
      throw err;
    }
    const name = a.slice(2);
    const value = rest[i + 1] == null || rest[i + 1].startsWith("--") ? true : (i++, rest[i]);
    flags[name] = value;
  }
  return { verb, flags };
}

const KNOWN = Object.freeze({
  list: ["store", "limit"],
  take: ["store", "holder", "alias", "database", "window-kind", "phase", "county", "ttl-seconds", "reason"],
  renew: ["token", "ttl-seconds", "holder"],
  release: ["token", "reason", "holder"],
  check: ["token"],
  selftest: [],
});

function requireFlag(verb, flags, name) {
  const v = flags[name];
  if (typeof v !== "string" || v.trim() === "") {
    const err = new Error(`${verb} needs --${name}`);
    err.code = USAGE;
    throw err;
  }
  return v.trim();
}

/**
 * The request body for `take`. holder_kind is ALWAYS session-seat here: a session must not claim a
 * job execution identity it does not have (heavy-lease.mjs's leaseHolder does the same for local
 * job runs), and holder is the seat id from _catalog/seat_register.json.
 */
export function takeBody(flags) {
  const ttlSeconds = flags["ttl-seconds"] == null ? null : Number(flags["ttl-seconds"]);
  if (ttlSeconds != null) {
    if (!Number.isFinite(ttlSeconds) || ttlSeconds < MIN_TTL_SECONDS) {
      const err = new Error(`--ttl-seconds must be a number >= ${MIN_TTL_SECONDS}`);
      err.code = USAGE;
      throw err;
    }
  }
  return {
    store: requireFlag("take", flags, "store"),
    holder: requireFlag("take", flags, "holder"),
    holderKind: "session-seat",
    windowKind: flags["window-kind"] ?? "heavy-scan",
    storeAlias: flags.alias ?? null,
    storeDatabase: flags.database ?? null,
    phase: flags.phase ?? null,
    countyFips: flags.county ?? null,
    ...(ttlSeconds == null ? {} : { ttlMs: ttlSeconds * 1000 }),
    reason: flags.reason ?? null,
  };
}

export function resolveEndpoint(env = process.env) {
  const url = env.FACTORY_CONTROL_API_URL;
  const key = env.FACTORY_CONTROL_API_KEY;
  const missing = [];
  if (typeof url !== "string" || url.trim() === "") missing.push("FACTORY_CONTROL_API_URL");
  if (typeof key !== "string" || key.trim() === "") missing.push("FACTORY_CONTROL_API_KEY");
  if (missing.length > 0) {
    // NAMES, never values. This is the whole reason the refusal is written as a code.
    const err = new Error(`heavy-scan-lease needs ${missing.join(" and ")} (values are never printed)`);
    err.code = CALLER_NOT_REGISTERED;
    err.missing = missing;
    throw err;
  }
  return { url: url.replace(/\/$/, ""), key };
}

/** Maps an HTTP outcome onto this script's codes. Split out so the mapping is testable.
 *
 * Every refusal carries the server's own `reason` alongside the local code, because the two answer
 * different questions: the code is this script's (how do I branch, what do I exit with), the reason
 * is the factory's (what exactly is wrong with what I sent -- for P-307, the offending spelling).
 * Flattening them to a bare code is how a refused spelling becomes a retry.
 */
export function outcomeFor(status, body) {
  const reason = typeof body?.message === "string" && body.message.trim() !== "" ? body.message : null;
  const refused = (code) => ({ code, ok: false, reason });
  if (status === 404) return refused(ENDPOINT_NOT_DEPLOYED);
  if (status === 401 || status === 403) return refused(CALLER_NOT_REGISTERED);
  if (status === 409 && body?.error === LEASE_HELD) return refused(LEASE_HELD);
  if (status === 409) return refused(LEASE_LOST);
  if (status === 400 && body?.error === LEASE_STORE_INVALID) return refused(LEASE_STORE_INVALID);
  if (status === 200 || status === 201) return { code: null, ok: true, reason: null };
  return refused(body?.error ?? `HTTP_${status}`);
}

async function call(verb, flags, env = process.env) {
  const { url, key } = resolveEndpoint(env);
  let path = "";
  let method = "GET";
  let body = null;
  if (verb === "list") {
    const q = new URLSearchParams();
    if (flags.store) q.set("store", flags.store);
    if (flags.limit) q.set("limit", String(flags.limit));
    path = `/heavy-scan-leases${q.toString() ? `?${q}` : ""}`;
  } else if (verb === "check") {
    path = `/heavy-scan-lease?holderToken=${encodeURIComponent(requireFlag("check", flags, "token"))}`;
  } else if (verb === "take") {
    method = "POST";
    path = "/heavy-scan-lease-take";
    body = takeBody(flags);
  } else if (verb === "renew") {
    method = "POST";
    path = "/heavy-scan-lease-renew";
    const ttlSeconds = flags["ttl-seconds"] == null ? null : Number(flags["ttl-seconds"]);
    if (ttlSeconds != null && (!Number.isFinite(ttlSeconds) || ttlSeconds < MIN_TTL_SECONDS)) {
      const err = new Error(`--ttl-seconds must be a number >= ${MIN_TTL_SECONDS}`);
      err.code = USAGE;
      throw err;
    }
    body = { holderToken: requireFlag("renew", flags, "token"), ...(ttlSeconds == null ? {} : { ttlMs: ttlSeconds * 1000 }) };
  } else if (verb === "release") {
    method = "POST";
    path = "/heavy-scan-lease-release";
    body = {
      holderToken: requireFlag("release", flags, "token"),
      releasedBy: requireFlag("release", flags, "holder"),
      reason: flags.reason ?? "released by a session",
    };
  }
  // EVERY MUTATION CARRIES AN OPERATOR, and the API refuses one that is missing or a sentinel.
  // Renew and release are mutations too: without this the seat that took a window could read it
  // and never refresh or hand it back, and the store would sit held until the TTL expired -- a
  // guard whose only exit is a timeout. The seat id is the identity, the same one that took it.
  const headers = { Authorization: `Bearer ${key}` };
  if (body) headers["content-type"] = "application/json";
  if (MUTATIONS.has(verb)) headers["x-factory-operator"] = requireFlag(verb, flags, "holder");
  const res = await fetch(`${url}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = { error: "NON_JSON_RESPONSE", body: text.slice(0, 200) };
  }
  return { status: res.status, body: parsed };
}

function validateFlags(verb, flags) {
  for (const name of Object.keys(flags)) {
    if (!KNOWN[verb].includes(name)) {
      // Strict: an unknown flag refuses rather than being accepted on the command line and
      // silently discarded (the P-229 convention).
      const err = new Error(`${verb} does not take --${name}`);
      err.code = USAGE;
      throw err;
    }
  }
}

export const EXIT = Object.freeze({
  [USAGE]: 2,
  [ENDPOINT_NOT_DEPLOYED]: 3,
  [CALLER_NOT_REGISTERED]: 4,
  [LEASE_HELD]: 5,
  [LEASE_LOST]: 6,
  [LEASE_NOT_FOUND]: 6,
  // NOT 1. Exit 1 is this script's crash/transport bucket, and the 2026-09-17 finding included a
  // bare `fetch failed` on exit 1 -- a refused spelling that shares an exit code with a dead network
  // is a refusal the operator retries.
  [LEASE_STORE_INVALID]: 7,
});

/**
 * No network, no credentials: the checks that can be made from the file alone. The end-to-end run
 * (a real factory-control, a real row, a real refusal) is test/p281-heavy-lease-api.test.mjs in
 * hauska-factory, where the routes live; this is the cheap guard that the client half still agrees
 * with the shapes that test pins.
 */
export function selftest() {
  const fails = [];
  // COUNTED, not asserted as a literal: a hardcoded checks count is a claim about this file that
  // this file cannot keep (it drifts the moment a check is added), and the number is only useful if
  // it is the number that ran.
  let checks = 0;
  const ok = (name, cond, detail = "") => {
    checks += 1;
    if (!cond) fails.push(`${name}${detail ? `: ${detail}` : ""}`);
  };

  // The usage refusals.
  for (const argv of [[], ["nonsense"], ["take"], ["take", "--store", "x"], ["take", "--store", "x", "--holder", "h", "--nope", "1"]]) {
    try {
      const parsed = parseArgs(argv);
      validateFlags(parsed.verb, parsed.flags);
      if (parsed.verb === "take") takeBody(parsed.flags);
      ok(`argv ${JSON.stringify(argv)} refuses`, false, "it was accepted");
    } catch (err) {
      ok(`argv ${JSON.stringify(argv)} refuses as usage`, err.code === USAGE, err.code);
    }
  }

  // The store and holder are required and trimmed; the hold is always a session-seat.
  const body = takeBody({ store: "  db.example.test:5432  ", holder: " seat-p281 " });
  ok("store is trimmed", body.store === "db.example.test:5432", body.store);
  ok("holder is trimmed", body.holder === "seat-p281", body.holder);
  ok("holderKind is session-seat", body.holderKind === "session-seat", body.holderKind);
  ok("windowKind defaults to heavy-scan", body.windowKind === "heavy-scan", body.windowKind);
  ok("no ttlMs unless asked", body.ttlMs === undefined, String(body.ttlMs));
  ok("ttlMs is seconds*1000", takeBody({ store: "x", holder: "h", "ttl-seconds": "600" }).ttlMs === 600_000);
  for (const bad of ["0", "59", "abc", "-1"]) {
    try {
      takeBody({ store: "x", holder: "h", "ttl-seconds": bad });
      ok(`ttl-seconds ${bad} refuses`, false, "it was accepted");
    } catch (err) {
      ok(`ttl-seconds ${bad} refuses`, err.code === USAGE, err.code);
    }
  }

  // The credentials are named, never printed.
  for (const env of [{}, { FACTORY_CONTROL_API_URL: "http://x" }, { FACTORY_CONTROL_API_KEY: "k" }]) {
    try {
      resolveEndpoint(env);
      ok(`resolveEndpoint ${JSON.stringify(Object.keys(env))} refuses`, false, "it was accepted");
    } catch (err) {
      ok(`resolveEndpoint ${JSON.stringify(Object.keys(env))} refuses`, err.code === CALLER_NOT_REGISTERED, err.code);
      // The secret must not appear in the message -- only the variable's NAME may.
      const leaked = Object.values(env).some((v) => err.message.includes(v));
      ok("the refusal names the variable, never its value", !leaked && /FACTORY_CONTROL_/.test(err.message), err.message);
    }
  }
  ok("resolveEndpoint strips a trailing slash", resolveEndpoint({ FACTORY_CONTROL_API_URL: "http://x/", FACTORY_CONTROL_API_KEY: "k" }).url === "http://x");

  // The mapping the exit codes are built on -- the half of this script a bad server can break.
  ok("404 is ENDPOINT_NOT_DEPLOYED", outcomeFor(404, { error: "NOT_FOUND" }).code === ENDPOINT_NOT_DEPLOYED);
  ok("401 is CALLER_NOT_REGISTERED", outcomeFor(401, { error: "UNAUTHENTICATED" }).code === CALLER_NOT_REGISTERED);
  ok("OPERATOR_REQUIRED (a 401) is CALLER_NOT_REGISTERED", outcomeFor(401, { error: "OPERATOR_REQUIRED" }).code === CALLER_NOT_REGISTERED);
  ok("409 LEASE_HELD is LEASE_HELD", outcomeFor(409, { error: LEASE_HELD }).code === LEASE_HELD);
  ok("409 LEASE_LOST is LEASE_LOST", outcomeFor(409, { error: LEASE_LOST }).code === LEASE_LOST);
  ok("201 is ok", outcomeFor(201, { ok: true }).ok === true);
  ok("an unknown code keeps its name", outcomeFor(500, { error: "HEAVY_LEASE_FAILED" }).code === "HEAVY_LEASE_FAILED");

  // P-307: the refusal a mis-spelled --store now gets. Both directions, because a mapping that only
  // widens is a mapping that swallows: LEASE_STORE_INVALID must be THAT code with the factory's
  // reason kept, and a 400 for any other error must keep its own name rather than being absorbed.
  const badStore = outcomeFor(400, {
    error: LEASE_STORE_INVALID,
    message: 'the store "factory-store" is not a store host: name the host or the whole connection URL',
  });
  ok("400 LEASE_STORE_INVALID is LEASE_STORE_INVALID", badStore.code === LEASE_STORE_INVALID, badStore.code);
  ok("the refusal keeps the factory's reason", /factory-store/.test(badStore.reason ?? ""), String(badStore.reason));
  ok("a refused store is not ok, so it cannot be mistaken for a take", badStore.ok === false);
  ok("LEASE_STORE_INVALID has an exit code of its own", EXIT[LEASE_STORE_INVALID] === 7, String(EXIT[LEASE_STORE_INVALID]));
  ok("...and it is NOT the crash bucket (exit 1)", EXIT[LEASE_STORE_INVALID] !== 1);
  ok("a 400 with another error keeps that error", outcomeFor(400, { error: "LEASE_SPEC_INVALID" }).code === "LEASE_SPEC_INVALID");
  ok("a success carries no reason", outcomeFor(201, { ok: true }).reason === null);

  console.log(JSON.stringify({ selftest: fails.length === 0 ? "PASS" : "FAIL", checks, failures: fails }, null, 2));
  return fails.length === 0;
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const { verb, flags } = parseArgs(argv);
  validateFlags(verb, flags);
  if (verb === "selftest") return selftest() ? 0 : 1;
  const { status, body } = await call(verb, flags, env);
  const outcome = outcomeFor(status, body);
  console.log(JSON.stringify({ verb, httpStatus: status, ...outcome, response: body }, null, 2));
  return outcome.ok ? 0 : (EXIT[outcome.code] ?? 1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main()
    .then((code) => process.exit(code))
    .catch((err) => {
      console.error(JSON.stringify({ code: err.code ?? "FAILED", message: err.message, missing: err.missing ?? null }));
      process.exit(EXIT[err.code] ?? 1);
    });
}
