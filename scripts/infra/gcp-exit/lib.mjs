// Shared helpers for the GCP exit instruments (OPS-25). Read-only against GCP and DigitalOcean.
// Every script prints a snapshot line first (ENFORCEMENT: state your snapshot) and runs its own
// self-tests after the measurement (ENFORCEMENT: verify a check by violating it).
//
// Run with `node --use-system-ca <script>` on the fleet host: its TLS-intercepting middleware
// re-signs certificates, and Node's bundled CA store refuses them (OPS-25 rule 10).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

export const OUT = process.env.GCP_EXIT_OUT || path.join(os.tmpdir(), "gcp-exit");
fs.mkdirSync(OUT, { recursive: true });

// The GCP estate as measured 2026-09-18. atx-bulls is out of scope (decision 2026-09-18_gcp_full_exit_rulings).
export const PROJECTS = [
  "hauska-prod-497015", "legacy-design-tools-prod", "smartcity-os-prod", "smartcity-dashboards",
  "plan-review-505715", "smart-files-505619", "smart-markets-118998", "empressa-trading-prod",
];
export const SERVICES = [
  ["hauska-prod-497015", "us-central1", "hauska-engine-api"], ["hauska-prod-497015", "us-central1", "hauska-mcp-server"],
  ["hauska-prod-497015", "us-central1", "hauska-retrieval-api"], ["hauska-prod-497015", "us-east4", "factory-control"],
  ["legacy-design-tools-prod", "us-central1", "cortex-api"], ["legacy-design-tools-prod", "us-central1", "smartsite-mcp"],
  ["legacy-design-tools-prod", "us-central1", "records-request-worker"], ["plan-review-505715", "us-east1", "plan-review"],
  ["smart-files-505619", "us-east1", "smart-files"], ["smart-markets-118998", "us-east1", "smart-markets-api"],
  ["smartcity-dashboards", "us-east1", "smartcity-dashboards"], ["smartcity-os-prod", "us-central1", "smartcity-api"],
  ["smartcity-os-prod", "us-central1", "smartcity-scraper"],
];

// gcloud runs through a shell (Node refuses to spawn gcloud.cmd without one on Windows), so every
// argument must be free of shell metacharacters or the call is REFUSED. Anything that needs quoting
// (log filters, metric filters) goes through the REST helpers below instead: a shell-joined filter
// lost its quoting on 2026-09-18 and every call failed silently until a self-test caught it.
// Output has CR stripped: a CR carried out of `$(gcloud ...)` under Git Bash emptied a key listing
// the same day.
const SAFE_ARG = /^[A-Za-z0-9_.:=\/@,+-]+$/;
export function gcloud(args) {
  const bad = args.find((a) => !SAFE_ARG.test(a));
  if (bad !== undefined) throw new Error(`refusing gcloud argument with shell metacharacters: ${JSON.stringify(bad)}`);
  return execFileSync(process.platform === "win32" ? "cmd.exe" : "sh",
    process.platform === "win32" ? ["/d", "/c", "gcloud", ...args] : ["-c", ["gcloud", ...args].join(" ")],
    { encoding: "utf8", maxBuffer: 1 << 30, stdio: ["ignore", "pipe", "ignore"] }).replace(/\r/g, "");
}
export function gcloudJson(args) {
  const out = gcloud([...args, "--format=json"]);
  return JSON.parse(out || "[]");
}
let _token;
export function token() {
  if (!_token) _token = gcloud(["auth", "print-access-token"]).trim();
  return _token;
}
export async function getJson(url, init = {}) {
  const r = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token()}`, ...(init.headers || {}) } });
  const j = await r.json();
  if (j.error) throw new Error(`${j.error.code ?? r.status} ${j.error.message ?? JSON.stringify(j.error)}`);
  return j;
}

export async function timeSeries(project, filter, agg, start, end) {
  const p = new URLSearchParams({ filter, "interval.startTime": start.toISOString(), "interval.endTime": end.toISOString() });
  for (const [k, v] of Object.entries(agg)) (Array.isArray(v) ? v : [v]).forEach((x) => p.append(`aggregation.${k}`, x));
  const out = [];
  let t;
  do {
    if (t) p.set("pageToken", t);
    const j = await getJson(`https://monitoring.googleapis.com/v3/projects/${project}/timeSeries?${p}`);
    out.push(...(j.timeSeries || []));
    t = j.nextPageToken;
  } while (t);
  return out;
}
export const pointValue = (pt) => pt.value.doubleValue ?? Number(pt.value.int64Value ?? 0);

export async function readLogs(project, filter, max = 20000) {
  const out = [];
  let pageToken;
  do {
    const j = await getJson("https://logging.googleapis.com/v2/entries:list", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceNames: [`projects/${project}`], filter, orderBy: "timestamp desc", pageSize: 1000, pageToken }),
    });
    out.push(...(j.entries || []));
    pageToken = j.nextPageToken;
  } while (pageToken && out.length < max);
  return out;
}

export function snapshot(name, extra = "") {
  let account = "?";
  try { account = gcloud(["config", "get-value", "account"]).trim(); } catch {}
  console.log(`# ${name} | read ${new Date().toISOString()} | gcloud account ${account}${extra ? " | " + extra : ""}`);
}

// Self-test bookkeeping: a script exits 2 if any self-test fails, so a blind instrument cannot pass.
const failures = [];
export function selftest(ok, what) {
  console.error(`selftest ${ok ? "PASS" : "FAIL"}: ${what}`);
  if (!ok) failures.push(what);
}
// exitCode, not process.exit(): on Windows, process.exit() while fetch handles are closing trips a
// libuv assertion and the process aborts with 127 instead of 2 (seen 2026-09-18).
export function finish() {
  if (failures.length) { console.error(`${failures.length} self-test(s) failed; do not trust this output`); process.exitCode = 2; }
}

// URL -> scheme://host[:port], or null. Never returns userinfo, path, or query.
export function hostOf(v) {
  try { const u = new URL(String(v).trim()); return `${u.protocol}//${u.hostname}${u.port ? ":" + u.port : ""}`; } catch { return null; }
}
