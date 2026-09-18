#!/usr/bin/env node
// Requests that ran longer than a threshold, per service and normalised path, over N days.
// Why: DigitalOcean App Platform reportedly cuts HTTP at 100s at its edge (community-sourced; DO
// documents the 100s ceiling only for PHP apps). OPS-25 D-17 probes it; D-27 removes every
// synchronous route that exceeds it. This instrument is D-27's gate: zero requests over 90s on the
// services moving to App Platform, over a window in which their callers were exercised.
//
// Usage: DAYS=7 OVER=60 node --use-system-ca scripts/infra/gcp-exit/long-requests.mjs [project ...]
// Self-test: the positive control must be found. Before 2026-09-17 the GCP smartcity-scraper ran
// multi-minute syncs, so any window reaching back before then must show it; otherwise pass
// CONTROL_SERVICE / CONTROL_PROJECT naming a service you know ran long in the window.
import { PROJECTS, readLogs, snapshot, selftest, finish } from "./lib.mjs";

const DAYS = Number(process.env.DAYS || 7), OVER = Number(process.env.OVER || 60);
const since = new Date(Date.now() - DAYS * 86400e3).toISOString();
const projects = process.argv.slice(2).length ? process.argv.slice(2) : PROJECTS.filter((p) => p !== "empressa-trading-prod");
const norm = (u) => { try { return new URL(u).pathname.replace(/\/[0-9a-f]{8}-[0-9a-f-]{27,}/gi, "/:uuid").replace(/\/\d{3,}(?=\/|$)/g, "/:n").replace(/\/[^/]*%3A[^/]*/gi, "/:node").replace(/\/[A-Za-z0-9_-]{20,}(?=\/|$)/g, "/:id"); } catch { return u; } };
snapshot("gcp-exit long-requests", `since ${since}, over ${OVER}s`);
const agg = {};
for (const p of projects) {
  const rows = await readLogs(p, `resource.type="cloud_run_revision" AND httpRequest.latency>"${OVER}s" AND timestamp>="${since}"`);
  console.log(`${p}: ${rows.length} requests over ${OVER}s`);
  for (const r of rows) {
    const h = r.httpRequest || {}, sec = parseFloat(String(h.latency || "0"));
    const key = `${r.resource.labels.service_name} ${h.requestMethod} ${norm(h.requestUrl)}`;
    const a = (agg[key] ||= { n: 0, max: 0, over100: 0, status: {}, ua: {}, last: "" });
    a.n++; a.max = Math.max(a.max, sec); if (sec > 100) a.over100++;
    a.status[h.status] = (a.status[h.status] || 0) + 1;
    const ua = (h.userAgent || "-").split(/[ /]/)[0]; a.ua[ua] = (a.ua[ua] || 0) + 1;
    if (r.timestamp > a.last) a.last = r.timestamp;
  }
}
for (const [k, a] of Object.entries(agg).sort((x, y) => y[1].n - x[1].n)) {
  console.log(`${String(a.n).padStart(5)} (>100s ${String(a.over100).padStart(4)}) max ${a.max.toFixed(0).padStart(5)}s  ${k}  status=${JSON.stringify(a.status)} ua=${JSON.stringify(a.ua)} last=${a.last.slice(0, 16)}`);
}
const control = process.env.CONTROL_SERVICE || (Date.parse(since) < Date.parse("2026-09-17T00:00:00Z") ? "smartcity-scraper" : null);
if (control) selftest(Object.keys(agg).some((k) => k.startsWith(control + " ")), `positive control ${control} shows long requests`);
else { console.error("INCONCLUSIVE: no positive control for this window; set CONTROL_SERVICE to a service known to run long in it. A zero here is not a pass."); process.exitCode = 3; }
finish();
