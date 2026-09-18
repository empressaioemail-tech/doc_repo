#!/usr/bin/env node
/**
 * p347-build-fixture-pdfs.mjs -- A-215 ruling 17: the integration seat builds a PDF for each fixture
 * parcel, so the customer probe's PDF leg grades a built document instead of `never-requested`.
 *
 * WHAT IT WRITES. One refresh POST per parcel to the engine-api feasibility export
 * (`/v1/property-nodes/<id>/feasibility-export/refresh`), which rebuilds that parcel's PDF in the
 * shared export cache. That cache is what a customer's download serves, so this is a production
 * write, and it is scoped, recorded and capped:
 *   - SCOPE: exactly the parcels scripts/surface-probe.mjs reads on its PDF leg (the graded fixture
 *     of each bucket, plus the P-303, P-304 and required-case subjects), deduped. Nothing else.
 *   - RECORD: every build appends an `intent` line to the JSONL record BEFORE its POST and an
 *     `outcome` line after it settles. If the intent line cannot be written, the POST does not run.
 *   - CAP: the run refuses, writing nothing, if the scope exceeds MAX_BUILDS. The fixture set is 45
 *     buckets; a larger scope means the selection changed and the ruling did not cover it.
 *   - NEVER a canary: the base is the service URL. A refresh against a tag URL would write the
 *     shared cache from an unshifted revision (fleet memory engine-api-export-grading).
 *
 * THE THREE-QUESTION GATE. Executes: this file, run by the integration seat. Triggers: by hand,
 * once per P-347 re-run. Fails: non-zero exit when any build fails or times out, and refusal before
 * any write on a missing key, an unwritable record or an over-cap scope. Bypass: any other caller
 * of the refresh route (the customer's own export button, P-155's paths); this script governs only
 * its own writes.
 *
 * Usage:
 *   HAUSKA_ENGINE_API_KEY=... node --use-system-ca scripts/p347-build-fixture-pdfs.mjs            dry run: scope and current state
 *   HAUSKA_ENGINE_API_KEY=... node --use-system-ca scripts/p347-build-fixture-pdfs.mjs --apply    build, recorded
 *     [--record _inbox/<file>.jsonl] [--concurrency 2] [--only-missing]
 */
import { appendFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  OPS24_BUCKETS, selectOps24Subjects, P303_SUBJECTS, P304_SUBJECTS, UNRULED_SUBJECT,
  ENGINE_BASE, gateFrontHeaders, extractPdfRecord, pdfSurfaceState,
} from "./surface-probe.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const MAX_BUILDS = 60;
const POLL_MS = 10_000;
const BUILD_TIMEOUT_MS = 12 * 60_000;

/** The exact parcel set the probe's PDF leg reads, in the probe's own order, deduped. */
export function buildScope() {
  const subjects = selectOps24Subjects(OPS24_BUCKETS, false);
  return [...new Set([
    ...subjects.flatMap((s) => s.chosen.map((c) => c.id)),
    ...P303_SUBJECTS.map((s) => s.id),
    ...P304_SUBJECTS.map((s) => s.id),
    UNRULED_SUBJECT,
  ])];
}

const headersFor = (id, key) => ({
  ...gateFrontHeaders(`p347-build-${id.replace(/[^0-9a-zA-Z]/g, "-")}`, "feasibility-export"),
  authorization: `Bearer ${key}`,
});

async function req(method, url, headers, body) {
  const t0 = Date.now();
  try {
    const r = await fetch(url, { method, headers: { ...headers, ...(body ? { "content-type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(60_000) });
    const text = await r.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* kept as text */ }
    return { http: r.status, ms: Date.now() - t0, json, text: json ? null : text.slice(0, 300) };
  } catch (e) {
    return { http: 0, ms: Date.now() - t0, json: null, error: String(e?.cause?.code ?? e?.message ?? e) };
  }
}

const exportUrl = (id) => `${ENGINE_BASE}/v1/property-nodes/${encodeURIComponent(id)}/feasibility-export`;

async function readState(id, key) {
  const r = await req("GET", exportUrl(id), headersFor(id, key));
  const pdf = extractPdfRecord(r);
  return { pdf, surface: pdfSurfaceState(pdf) };
}

function record(path, line) {
  appendFileSync(path, JSON.stringify(line) + "\n", "utf8");
}

async function buildOne(id, key, recordPath, invocation) {
  const before = await readState(id, key);
  // The record precedes the write. appendFileSync throws if it cannot write, and then no POST runs.
  record(recordPath, { kind: "intent", at: new Date().toISOString(), parcel: id, action: "POST feasibility-export/refresh", base: ENGINE_BASE, stateBefore: before.pdf.state ?? null, surfaceBefore: before.surface.state, invocation });
  const post = await req("POST", `${exportUrl(id)}/refresh`, headersFor(id, key), {});
  const accepted = post.http >= 200 && post.http < 300;
  let after = null;
  const started = Date.now();
  if (accepted) {
    while (Date.now() - started < BUILD_TIMEOUT_MS) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      after = await readState(id, key);
      if (after.surface.state === "SERVED" || after.surface.state === "FAILED") break;
      if (after.pdf.state && /fail|error/i.test(after.pdf.state)) break;
    }
  }
  const outcome = !accepted ? "refresh-refused" : after?.surface.state === "SERVED" ? "built" : after?.surface.state === "FAILED" ? "failed" : "timed-out";
  record(recordPath, {
    kind: "outcome", at: new Date().toISOString(), parcel: id, outcome,
    refresh: { http: post.http, ms: post.ms, body: post.json ?? post.text ?? post.error ?? null },
    stateAfter: after?.pdf.state ?? null, surfaceAfter: after?.surface.state ?? null, basis: after?.surface.basis ?? null,
    jobRef: after?.pdf.jobRef ?? null, completedAt: after?.pdf.completedAt ?? null, pageCount: after?.pdf.pageCount ?? null,
    elapsedMs: Date.now() - started,
  });
  return outcome;
}

async function main() {
  const args = process.argv.slice(2);
  const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const apply = args.includes("--apply");
  const key = (process.env.HAUSKA_ENGINE_API_KEY || "").trim();
  if (!key) { console.error("REFUSED: HAUSKA_ENGINE_API_KEY is not set; nothing was read or written"); process.exit(2); }
  if (/---/.test(ENGINE_BASE)) { console.error(`REFUSED: ${ENGINE_BASE} is a tag URL; a refresh against a tag writes the shared cache from an unshifted revision`); process.exit(2); }
  const scope = buildScope();
  if (!scope.length) { console.error("REFUSED: the fixture list gave no parcels; nothing was written"); process.exit(2); }
  if (scope.length > MAX_BUILDS) { console.error(`REFUSED: scope is ${scope.length} parcels, over the declared cap of ${MAX_BUILDS}; the ruling covers the fixture set, and nothing was written`); process.exit(2); }
  const ranAt = new Date().toISOString();
  const recordPath = val("--record") ?? join(ROOT, "_inbox", `${ranAt.slice(0, 10)}_p347_pdf_builds.jsonl`);
  const concurrency = Math.max(1, Math.min(4, Number(val("--concurrency") ?? 2)));
  console.log(`P-347 PDF builds  ${ranAt}  base ${ENGINE_BASE}  scope ${scope.length} parcels  ${apply ? `APPLY (record ${recordPath.replace(/\\/g, "/")})` : "DRY RUN"}`);

  const states = {};
  for (const id of scope) states[id] = await readState(id, key);
  const counts = {};
  for (const id of scope) counts[states[id].surface.state] = (counts[states[id].surface.state] ?? 0) + 1;
  console.log(`current PDF surface: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(", ")}`);
  const todo = args.includes("--only-missing") ? scope.filter((id) => states[id].surface.state !== "SERVED") : scope;
  if (!apply) {
    for (const id of scope) console.log(`  ${id.padEnd(22)} ${states[id].surface.state.padEnd(10)} ${states[id].pdf.state ?? states[id].pdf.error ?? "-"}`);
    console.log(`dry run: ${todo.length} would be rebuilt; pass --apply to build`);
    return;
  }
  try {
    record(recordPath, { kind: "run", at: ranAt, invocation: process.argv.slice(1).join(" "), base: ENGINE_BASE, scope, todo, surfaceBefore: counts, ruling: "A-215 ruling 17", row: "P-347" });
  } catch (e) {
    console.error(`REFUSED: the record ${recordPath} cannot be written (${e.message}); nothing was built`);
    process.exit(2);
  }
  const outcomes = {};
  let next = 0;
  const invocation = `p347-build-fixture-pdfs ${ranAt}`;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (next < todo.length) {
      const id = todo[next++];
      let o;
      try { o = await buildOne(id, key, recordPath, invocation); } catch (e) { o = `error: ${e.message}`; }
      outcomes[o] = (outcomes[o] ?? 0) + 1;
      console.log(`  ${id.padEnd(22)} ${o}`);
    }
  }));
  record(recordPath, { kind: "run-end", at: new Date().toISOString(), invocation, outcomes });
  console.log(`done: ${Object.entries(outcomes).map(([k, v]) => `${k} ${v}`).join(", ")}  record ${recordPath.replace(/\\/g, "/")}`);
  process.exit(outcomes.built === todo.length ? 0 : 1);
}

if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) await main();
