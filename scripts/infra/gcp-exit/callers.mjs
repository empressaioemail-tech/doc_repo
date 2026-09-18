#!/usr/bin/env node
// Who calls a Cloud Run service, and on WHICH HOSTNAME. Groups request logs by the host the caller
// used (the run.app URL or a custom hostname), user-agent family, path prefix, status and referer.
//
// This is the readiness instrument for three OPS-25 steps:
//  - hostname-first (D-25): done when every non-uptime caller arrives on the custom hostname, i.e.
//    zero requests on the *.run.app host over a window in which each known caller was exercised;
//  - decommission (every cutover row): the GCP original shows zero non-uptime requests on ANY host
//    through a bake window in which its callers were exercised. D-13 is why "exercised" matters: a
//    caller that fires only when a person opens a lens is invisible in a quiet window;
//  - third-party registrations: webhook user agents (Stripe, Samsara) show which external systems
//    still point at a host.
//
// Usage: SINCE=2026-09-17T21:00:00Z node --use-system-ca scripts/infra/gcp-exit/callers.mjs project:service [...]
//        (or DAYS=7; MAX caps entries read per service, default 40000, and a capped read is flagged)
// Self-test: pass CONTROL=service:ua-family naming a caller known to hit a listed service in the
// window (the uptime checker on smartcity-api worked on 2026-09-18). With no CONTROL the run exits 3.
import { readLogs, snapshot, selftest, finish } from "./lib.mjs";

const since = process.env.SINCE || new Date(Date.now() - Number(process.env.DAYS || 7) * 86400e3).toISOString();
const max = Number(process.env.MAX || 40000), top = Number(process.env.TOP || 15);
const targets = process.argv.slice(2).map((x) => x.split(":"));
if (!targets.length) { console.error("usage: callers.mjs project:service [...]"); process.exit(64); }
const uaFam = (ua) => {
  if (!ua) return "-";
  const m = ua.match(/GoogleStackdriverMonitoring-UptimeChecks|Google-Cloud-Scheduler|Claude-User|ChatGPT|Stripe|Samsara|Circle|WorkOS|GitHub|hauska-mcp-server|plan-review-app|icc-portal-app|smart-files-qa-ui|cortex-api|python-httpx|python-requests|curl|node|undici|axios|Go-http-client|PowerShell|Mozilla/i);
  return m ? m[0] : ua.slice(0, 30);
};
const seg = (u) => { try { const p = new URL(u).pathname.split("/").filter(Boolean); return "/" + p.slice(0, 3).map((s) => (/^[0-9a-f-]{16,}$|^\d{3,}|%3A/i.test(s) ? ":x" : s)).join("/"); } catch { return String(u); } };
const hostKind = (h) => (/\.run\.app$/.test(h) ? "run.app" : h);
snapshot("gcp-exit callers", `since ${since}`);
const seen = {};
for (const [project, svc] of targets) {
  const rows = await readLogs(project, `resource.type="cloud_run_revision" AND resource.labels.service_name="${svc}" AND httpRequest.requestUrl:* AND timestamp>="${since}"`, max);
  const byHost = {}, byUa = {}, byPath = {}, byRef = {}, ips = new Set();
  for (const r of rows) {
    const h = r.httpRequest || {};
    let host = "-"; try { host = new URL(h.requestUrl).hostname; } catch {}
    const u = uaFam(h.userAgent);
    (seen[svc] ||= new Set()).add(u);
    const hk = `${hostKind(host)}${u === "GoogleStackdriverMonitoring-UptimeChecks" ? " (uptime)" : ""}`;
    byHost[hk] = (byHost[hk] || 0) + 1;
    byUa[u] = (byUa[u] || 0) + 1;
    const k = `${h.requestMethod} ${seg(h.requestUrl)} [${u}] via ${hostKind(host)}`;
    (byPath[k] ||= { n: 0, st: {} }).n++;
    byPath[k].st[h.status] = (byPath[k].st[h.status] || 0) + 1;
    let ref = "-"; try { ref = h.referer ? new URL(h.referer).origin : "-"; } catch { ref = String(h.referer).slice(0, 40); }
    byRef[ref] = (byRef[ref] || 0) + 1;
    ips.add(h.remoteIp);
  }
  const sort = (o, n = 12) => JSON.stringify(Object.fromEntries(Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n)));
  console.log(`\n## ${svc} (${project}) since ${since}: ${rows.length} requests${rows.length >= max ? " (CAPPED: the window is only the most recent part)" : ""}, ${ips.size} distinct IPs`);
  console.log(`   by host: ${sort(byHost)}`);
  console.log(`   by UA family: ${sort(byUa)}`);
  console.log(`   by referer origin: ${sort(byRef, 8)}`);
  for (const [k, v] of Object.entries(byPath).sort((a, b) => b[1].n - a[1].n).slice(0, top)) console.log(`   ${String(v.n).padStart(6)} ${k} ${JSON.stringify(v.st)}`);
}
if (process.env.CONTROL) {
  const [cs, cu] = process.env.CONTROL.split(":");
  selftest(!!seen[cs] && [...seen[cs]].some((u) => u.toLowerCase() === cu.toLowerCase()), `control caller ${cu} seen on ${cs}`);
} else { console.error("INCONCLUSIVE: no CONTROL given; a quiet result cannot be told from a blind query. Exit 3."); process.exitCode = 3; }
finish();
