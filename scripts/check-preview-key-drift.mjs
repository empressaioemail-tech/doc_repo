#!/usr/bin/env node
/**
 * P-305 (OPS-24): a rotated key cannot silently miss an environment.
 *
 * THE FINDING THIS EXISTS FOR (A-205, measured 2026-09-17). P-251 rotated
 * `HAUSKA_ENGINE_API_KEY` (Secret Manager, project hauska-prod-497015) end to end across five Cloud
 * Run services. Its SIXTH consumer -- Vercel project `property-explorer` -- carries a copy of the
 * same value as `HAUSKA_RETRIEVAL_API_KEY` / `RETRIEVAL_API_KEY`, and the sync workflow that writes
 * it (`hauska-map/.github/workflows/property-explorer-sync-retrieval-key.yml`) authoritative-
 * replaces the **production** environment only. The Preview environment kept the old value, so
 * EVERY Property Explorer preview answered its panel read with
 *
 *   {"error":"retrieval_auth_failed","message":"Property atom chain retrieval returned HTTP 401 ..."}
 *
 * and nothing noticed until a staging proof needed a preview. The store was never sick; the
 * credential leg was. `vercel env pull` returns sensitive values empty, so the two environments
 * cannot be compared by pulling them: the SURFACE is the measurable thing.
 *
 * WHAT THIS MEASURES. One GET against a preview's panel route for a known parcel, then one
 * classification of the BODY (not the wrapper status: the incident's own status was 503 wrapping an
 * upstream 401). A preview whose credential leg is stale reads AUTH_FAILURE; a preview that can
 * reach the atom chain reads OK. It is the customer-shaped leg, not a store-reading instrument
 * (A-183: the store instruments were green through the whole class of incidents this catches).
 *
 * WHAT EXECUTES IT / WHAT TRIGGERS IT / WHAT FAILS IT / WHAT BYPASSES IT, per the three-question
 * gate in `ENFORCEMENT.md`:
 *   executes  `node scripts/check-preview-key-drift.mjs --url <preview-base>` by an authorised
 *             lane/operator identity. `--selftest` proves the indicator can FIRE before it is
 *             trusted, and it is the mode `npm test`-style callers should use.
 *   triggers  ON DEMAND, as the closing step of a key rotation (see
 *             `90_runbooks/key_rotation_all_environments.md`) and before any proof that needs a
 *             preview. It is NOT wired into doc_repo CI: doc_repo CI has no route to a preview URL
 *             and no network egress policy for one, and a gate that cannot reach its subject is the
 *             permanently-red gate DEV_PROCESS 2.0 forbids. The URL is an ARGUMENT rather than a
 *             baked default for the same reason: preview URLs are ephemeral (the one this lane
 *             graded is deploy-specific), and a hardcoded one is a dead gate with a delay.
 *   fails     exit 3 (`AUTH_FAILURE`) naming the marker that fired and the counting rule inline;
 *             exit 4 (`REFUSAL`) when the read could not be graded at all.
 *   bypasses  STATED RATHER THAN DISCOVERED:
 *             (1) 403 is NOT in the predicate. retrieval-api's gate answers 401 for a stale token
 *                 (measured: `401 unauthorized` to a junk bearer, `_decisions/2026-09-16_engine_api_
 *                 key_rotation_and_tag_cleanup.md`), so 401 is what a key miss looks like here. A
 *                 403 is reported as a REFUSAL, loudly, never as `ok` -- it is simply not claimed as
 *                 this instrument's predicate.
 *             (2) A non-auth failure (a 5xx with no auth marker) is a REFUSAL, not drift. That is
 *                 deliberate: reporting every 5xx as credential drift is how a gate goes red for
 *                 the wrong reason and stops being read. The refusal is non-zero and names itself.
 *             (3) `readPath` is NOT asserted. A 200 whose `readPath` is `record` rather than
 *                 `atom-chain-warm` still PASSES: that is P-230's bake staleness, a different
 *                 finding, and folding it in would make this gate permanently red.
 *             (4) The instrument cannot see a consumer it is not pointed at. It measures one URL.
 *                 Enumerating how many environments exist is the inventory's job, not this file's.
 *             (5) A redirect to a login wall yields a 200 HTML page, which classifies as REFUSAL
 *                 (unparseable body), never as `ok`.
 *
 * IT NEVER PRINTS A KEY. It reads no secret, takes no token, and sends no header. Its only inputs
 * are a URL and a parcel id; its output carries status, the body's `error` / `atomPathReason` /
 * `readPath` fields, and a 12-hex sha256 PREFIX of the body. Nothing else from the body is echoed.
 *
 * PLATFORM TRAP (measured on this workstation, 2026-09-17): Node's own CA bundle on Nick's Windows
 * box cannot verify some hosts without `NODE_OPTIONS=--use-system-ca`
 * (`90_runbooks/cc_agent_node_tls_workaround.md`). `node fetch` reaches the Vercel hosts used here
 * WITHOUT it, but when the fetch fails on a certificate the refusal names that runbook rather than
 * reporting a generic network error.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = path.join(HERE, "fixtures", "check-preview-key-drift");

export const VERDICT = Object.freeze({ OK: "ok", AUTH_FAILURE: "auth-failure", REFUSAL: "refusal" });
export const EXIT = Object.freeze({ OK: 0, SELFTEST_FAILED: 1, USAGE: 2, AUTH_DRIFT: 3, REFUSAL: 4 });

/** Gold Bastrop 34137 -- the same parcel the existing sync workflow's live-verify leg uses. */
export const DEFAULT_PARCEL = "48021:34137";
export const panelRoute = (parcel) => `/api/spine/property-atoms/${parcel}/facets`;

/** 12 hex chars: enough to distinguish two bodies, short enough to never be the body. */
export const bodyHashPrefix = (body) => createHash("sha256").update(body, "utf8").digest("hex").slice(0, 12);

/**
 * The auth markers, as DATA, so the report can name which one fired and the self-test can prove each
 * fires. The `error` field is the panel's own code and the strongest signal; `atomPathReason` and
 * `message` carry the upstream's `HTTP 401` and survive a wrapper that renames `error`.
 */
export const AUTH_MARKERS = Object.freeze([
  { name: "error=retrieval_auth_failed", fires: (j) => j?.error === "retrieval_auth_failed" },
  { name: "atomPathReason~HTTP 401", fires: (j) => /HTTP 401/.test(String(j?.atomPathReason ?? "")) },
  { name: "message~HTTP 401", fires: (j) => /HTTP 401/.test(String(j?.message ?? "")) },
]);

/** HTTP statuses that ARE the predicate. 403 is deliberately absent; see bypass (1). */
export const AUTH_STATUSES = Object.freeze([401]);

/**
 * The decision. Pure; no I/O. Returns { verdict, basis, marker }.
 *
 * ORDER MATTERS AND IS THE DESIGN: the body markers are read BEFORE the status, because the real
 * incident arrived as a 503 whose upstream was a 401. A status-only predicate would have called it
 * a generic server error; a body-only predicate would miss a bare 401 with no JSON.
 */
export function classifyRead({ status, body }) {
  let parsed = null;
  let parseError = null;
  try {
    parsed = JSON.parse(body);
  } catch (err) {
    parseError = String(err.message ?? err);
  }

  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    for (const m of AUTH_MARKERS) {
      if (m.fires(parsed)) {
        return {
          verdict: VERDICT.AUTH_FAILURE,
          marker: m.name,
          basis: `body marker ${m.name} (HTTP ${status}); the credential leg refused, whatever the wrapper status`,
        };
      }
    }
  }

  if (AUTH_STATUSES.includes(status)) {
    return {
      verdict: VERDICT.AUTH_FAILURE,
      marker: `status=${status}`,
      basis: `HTTP ${status} with no auth marker in the body; the predicate covers ${AUTH_STATUSES.join("/")} by status`,
    };
  }

  if (status === 200 && parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return {
      verdict: VERDICT.OK,
      marker: null,
      basis: `HTTP 200 and a JSON object with no auth marker (readPath=${parsed.readPath ?? "<absent>"}; readPath is NOT asserted, see bypass (3))`,
    };
  }

  return {
    verdict: VERDICT.REFUSAL,
    marker: null,
    basis: parseError
      ? `HTTP ${status} and the body did not parse as JSON (${parseError.slice(0, 120)}); not gradeable as a credential leg`
      : `HTTP ${status} with a JSON body carrying no auth marker; not a ${AUTH_STATUSES.join("/")} and not a 200 -- refused rather than read as ok`,
  };
}

/* ------------------------------- self-test ------------------------------- */
/**
 * Both directions on the REAL recorded shapes, plus the boundaries. The indicator is proven able to
 * FIRE before it is trusted (DEV_PROCESS 2.2), and it is proven NOT to fire where it should not
 * (a checker that always fails is as wrong as one that never does).
 */
export function selftest({ log = console.log, fixtureDir = FIXTURE_DIR } = {}) {
  const read = (f) => fs.readFileSync(path.join(fixtureDir, f), "utf8");
  const recorded401 = read("preview-panel-401-recorded.json");
  const recorded200 = read("preview-panel-200-recorded.json");

  const cases = [];
  const check = (name, input, wantVerdict, wantMarker) => {
    const got = classifyRead(input);
    const ok = got.verdict === wantVerdict && (wantMarker === undefined || got.marker === wantMarker);
    cases.push({ name, ok, got, wantVerdict, wantMarker });
  };

  // --- the two recorded bodies, FIRST: the predicate is graded on the real shapes ---
  check("RECORDED 401 (503 wrapper): the incident's own body must FAIL", { status: 503, body: recorded401 }, VERDICT.AUTH_FAILURE, "error=retrieval_auth_failed");
  check("RECORDED 200: the fixed preview's own body must PASS", { status: 200, body: recorded200 }, VERDICT.OK, null);
  // the same recorded 401 body under the upstream's own status
  check("RECORDED 401 under HTTP 401 (unwrapped)", { status: 401, body: recorded401 }, VERDICT.AUTH_FAILURE, "error=retrieval_auth_failed");
  // --- not vacuous: the same body with the marker removed must NOT read as auth failure ---
  check("the recorded 401 body with its marker stripped is not auth drift", { status: 503, body: JSON.stringify({ error: "upstream_unavailable" }) }, VERDICT.REFUSAL, null);
  // --- boundaries ---
  check("a bare 401 with an empty body fails by status", { status: 401, body: "" }, VERDICT.AUTH_FAILURE, "status=401");
  check("a bare 403 is a REFUSAL, not the predicate (bypass 1)", { status: 403, body: "" }, VERDICT.REFUSAL, null);
  check("a 500 with a non-auth body is a REFUSAL, never drift (bypass 2)", { status: 500, body: '{"error":"internal"}' }, VERDICT.REFUSAL, null);
  check("a 200 that is not JSON is a REFUSAL, never ok (bypass 5)", { status: 200, body: "<html>login</html>" }, VERDICT.REFUSAL, null);
  check("a 200 carrying an auth marker still FAILS (marker beats status)", { status: 200, body: recorded401 }, VERDICT.AUTH_FAILURE, "error=retrieval_auth_failed");

  // --- fixture integrity: the 200 fixture must not itself carry the marker, or the PASS case
  //     would be passing for the wrong reason ---
  const fixtureIntegrity = (() => {
    const p401 = JSON.parse(recorded401);
    const p200 = JSON.parse(recorded200);
    const markerIn200 = AUTH_MARKERS.some((m) => m.fires(p200));
    const ok401 = p401.error === "retrieval_auth_failed";
    const ok200 = p200.parcelNodeId !== undefined;
    return {
      name: "fixture integrity: 401 fixture carries the marker, 200 fixture does not",
      ok: ok401 && ok200 && !markerIn200,
      got: `401.error=${p401.error} 200.parcelNodeId=${p200.parcelNodeId} markerIn200=${markerIn200}`,
      want: "401.error=retrieval_auth_failed 200.parcelNodeId present markerIn200=false",
    };
  })();
  cases.push(fixtureIntegrity);

  const failed = cases.filter((c) => !c.ok);
  for (const c of cases) {
    log(`  ${c.ok ? "pass" : "FAIL"}  ${c.name}${c.ok ? "" : `  got=${JSON.stringify(c.got.verdict)}${c.got.marker ? ` marker=${c.got.marker}` : ""} want=${c.wantVerdict}${c.wantMarker ? ` marker=${c.wantMarker}` : ""}`}`);
  }
  log(
    failed.length
      ? `\n${failed.length} of ${cases.length} self-test case(s) FAILED`
      : `\nall ${cases.length} self-test cases pass (2 recorded bodies, both directions, 401-by-status, 403/500/HTML refusals, marker-beats-status, fixture integrity)`,
  );
  return failed.length === 0;
}

/* --------------------------------- live --------------------------------- */

function classifyFetchError(err, url) {
  const message = String(err?.message ?? err);
  if (/certificate|CERT|self.signed|unable to verify/i.test(message)) {
    return `could not reach ${url}: ${message}. On this workstation this is the Node CA trap -- rerun with NODE_OPTIONS=--use-system-ca (90_runbooks/cc_agent_node_tls_workaround.md).`;
  }
  return `could not reach ${url}: ${message}`;
}

export async function runLive({ url, parcel = DEFAULT_PARCEL, timeoutMs = 60_000, log = console.log } = {}) {
  if (!url) throw new Error("--url is required: preview base URL, e.g. https://property-explorer-<hash>-<team>.vercel.app");
  const base = url.replace(/\/+$/, "");
  const route = panelRoute(parcel);
  const target = `${base}${route}`;
  const startedAt = new Date().toISOString();

  let status = null;
  let body = "";
  let transportError = null;
  try {
    const res = await fetch(target, { redirect: "follow", signal: AbortSignal.timeout(timeoutMs), headers: { accept: "application/json" } });
    status = res.status;
    body = await res.text();
  } catch (err) {
    transportError = classifyFetchError(err, target);
  }

  const decision = transportError
    ? { verdict: VERDICT.REFUSAL, marker: null, basis: transportError }
    : classifyRead({ status, body });

  let readPath = null;
  try {
    readPath = JSON.parse(body)?.readPath ?? null;
  } catch {
    readPath = null;
  }

  const report = {
    ok: decision.verdict === VERDICT.OK,
    lane: "p305-key-drift",
    instrument: "check-preview-key-drift",
    countingRule:
      "one GET against <url>/api/spine/property-atoms/<parcel>/facets; verdict from the BODY (error/atomPathReason/message markers) then the status (401); a 200 with no marker is ok, anything else is a refusal",
    url: base,
    route,
    parcelNodeId: parcel,
    httpStatus: status,
    verdict: decision.verdict,
    marker: decision.marker,
    basis: decision.basis,
    readPath,
    bytes: body.length,
    bodySha256Prefix: body ? bodyHashPrefix(body) : null,
    startedAt,
    finishedAt: new Date().toISOString(),
    note: "no header, no token and no secret value is read or printed; readPath is reported, not asserted (bypass 3)",
  };
  log(JSON.stringify(report, null, 2));
  return report;
}

/* --------------------------------- cli --------------------------------- */

const USAGE = `Usage:
  node scripts/check-preview-key-drift.mjs --selftest
  node scripts/check-preview-key-drift.mjs --url <preview-base> [--parcel <placeKey>] [--timeout-ms <ms>]

Exit codes: 0 ok · 1 self-test failed · 2 usage · 3 auth drift (a stale environment) · 4 refusal (not gradeable)
It never prints a key.`;

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const arg = (name, fallback = null) => {
    const hit = argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
    if (!hit) return fallback;
    if (hit.includes("=")) return hit.slice(hit.indexOf("=") + 1);
    const i = argv.indexOf(hit);
    return argv[i + 1] ?? fallback;
  };

  if (argv.includes("--selftest")) {
    process.exit(selftest() ? EXIT.OK : EXIT.SELFTEST_FAILED);
  } else if (argv.includes("--help") || argv.includes("-h") || argv.length === 0) {
    console.error(USAGE);
    process.exit(argv.length === 0 ? EXIT.USAGE : EXIT.OK);
  } else {
    const url = arg("url");
    if (!url) {
      console.error(USAGE);
      process.exit(EXIT.USAGE);
    }
    // NOTE: `process.exitCode`, never `process.exit()`, on this path. Measured 2026-09-17 on this
    // workstation: `process.exit()` immediately after an undici (fetch) response crashes libuv on
    // Windows with `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)` and exit 0xC0000409,
    // which destroys the verdict's exit code -- DEV_PROCESS 2.3's exact failure mode (the exit code
    // is the control). Letting the loop drain with `exitCode` exits cleanly in ~1.4s.
    runLive({ url, parcel: arg("parcel", DEFAULT_PARCEL), timeoutMs: Number(arg("timeout-ms", 60_000)) })
      .then((report) => {
        if (report.verdict === VERDICT.OK) process.exitCode = EXIT.OK;
        else process.exitCode = report.verdict === VERDICT.AUTH_FAILURE ? EXIT.AUTH_DRIFT : EXIT.REFUSAL;
      })
      .catch((err) => {
        console.error(`check-preview-key-drift: ${String(err?.message ?? err)}`);
        process.exitCode = EXIT.REFUSAL;
      });
  }
}
