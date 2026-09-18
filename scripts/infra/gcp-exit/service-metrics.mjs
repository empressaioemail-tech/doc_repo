#!/usr/bin/env node
// Per-service Cloud Run metrics over N days: requests by class, latency percentiles, instance counts,
// CPU and memory utilisation, billable instance time, egress. This is the bake baseline every OPS-25
// cutover compares against, and the sizing input for DigitalOcean instance choices.
//
// Usage: DAYS=30 node --use-system-ca scripts/infra/gcp-exit/service-metrics.mjs [service ...]
// Writes metrics_<service>.json to GCP_EXIT_OUT.
//
// Read latency maxima with care: an hourly p99 over few samples lands on a histogram bucket bound,
// which is why unrelated services can show the identical "max". Use long-requests.mjs for durations.
// Instance counts include every revision that holds an instance, INCLUDING 0%-traffic tagged ones;
// see cost-by-revision.mjs before reading an instance count as load.
import fs from "node:fs";
import path from "node:path";
import { SERVICES, OUT, timeSeries, pointValue, snapshot, selftest, finish } from "./lib.mjs";

const DAYS = Number(process.env.DAYS || 30);
const end = new Date(), start = new Date(end.getTime() - DAYS * 86400e3);
const only = process.argv.slice(2);
const pct = (a, q) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };
const r2 = (x) => (x == null ? "-" : Math.round(x * 100) / 100);
snapshot("gcp-exit service-metrics", `window ${start.toISOString()}..${end.toISOString()}`);

async function measure(project, name) {
  const base = `resource.type="cloud_run_revision" AND resource.labels.service_name="${name}"`;
  const whole = `${DAYS * 86400}s`, hour = "3600s";
  const ts = (metric, agg) => timeSeries(project, `metric.type="${metric}" AND ${base}`, agg, start, end);
  const o = { project, name, days: DAYS, start: start.toISOString(), end: end.toISOString() };
  o.requests = Object.fromEntries((await ts("run.googleapis.com/request_count", { alignmentPeriod: whole, perSeriesAligner: "ALIGN_SUM", crossSeriesReducer: "REDUCE_SUM", groupByFields: ["metric.labels.response_code_class"] }))
    .map((s) => [s.metric.labels.response_code_class, s.points.reduce((a, p) => a + pointValue(p), 0)]));
  o.requestsPerDay = ((await ts("run.googleapis.com/request_count", { alignmentPeriod: "86400s", perSeriesAligner: "ALIGN_SUM", crossSeriesReducer: "REDUCE_SUM" }))[0]?.points || []).map(pointValue);
  for (const [k, al] of [["p50", "ALIGN_PERCENTILE_50"], ["p95", "ALIGN_PERCENTILE_95"], ["p99", "ALIGN_PERCENTILE_99"]]) {
    const h = ((await ts("run.googleapis.com/request_latencies", { alignmentPeriod: hour, perSeriesAligner: al, crossSeriesReducer: "REDUCE_MAX" }))[0]?.points || []).map(pointValue);
    o[`latency_${k}_ms_hourly_median`] = pct(h, 0.5);
  }
  const ih = ((await ts("run.googleapis.com/container/instance_count", { alignmentPeriod: hour, perSeriesAligner: "ALIGN_MAX", crossSeriesReducer: "REDUCE_SUM" }))[0]?.points || []).map(pointValue);
  o.instances = { median: pct(ih, 0.5), p95: pct(ih, 0.95), max: ih.length ? Math.max(...ih) : null };
  for (const [k, m] of [["cpu", "cpu/utilizations"], ["mem", "memory/utilizations"]]) {
    const h = ((await ts(`run.googleapis.com/container/${m}`, { alignmentPeriod: hour, perSeriesAligner: "ALIGN_PERCENTILE_99", crossSeriesReducer: "REDUCE_MAX" }))[0]?.points || []).map(pointValue);
    o[`${k}_p99_hourly`] = { median: pct(h, 0.5), p95: pct(h, 0.95), max: h.length ? Math.max(...h) : null };
  }
  o.billable_instance_hours = ((await ts("run.googleapis.com/container/billable_instance_time", { alignmentPeriod: whole, perSeriesAligner: "ALIGN_SUM", crossSeriesReducer: "REDUCE_SUM" }))[0]?.points || []).reduce((a, p) => a + pointValue(p), 0) / 3600;
  o.egress_gib = ((await ts("run.googleapis.com/container/network/sent_bytes_count", { alignmentPeriod: whole, perSeriesAligner: "ALIGN_SUM", crossSeriesReducer: "REDUCE_SUM" }))[0]?.points || []).reduce((a, p) => a + pointValue(p), 0) / 2 ** 30;
  fs.writeFileSync(path.join(OUT, `metrics_${name}.json`), JSON.stringify(o, null, 1));
  return o;
}

const rows = [];
for (const [project, , name] of SERVICES.filter(([, , n]) => !only.length || only.includes(n))) rows.push(await measure(project, name));
console.log("service | 2xx/4xx/5xx | req/day median | p50/p95/p99 ms (hourly median) | instances med/p95/max | cpu p99 med/p95/max | mem p99 med/p95/max | billable inst-h | egress GiB");
for (const o of rows) {
  const q = o.requests;
  console.log([o.name, `${q["2xx"] ?? 0}/${q["4xx"] ?? 0}/${q["5xx"] ?? 0}`, r2(pct(o.requestsPerDay, 0.5)),
    `${r2(o.latency_p50_ms_hourly_median)}/${r2(o.latency_p95_ms_hourly_median)}/${r2(o.latency_p99_ms_hourly_median)}`,
    `${o.instances.median ?? "-"}/${o.instances.p95 ?? "-"}/${o.instances.max ?? "-"}`,
    `${r2(o.cpu_p99_hourly.median)}/${r2(o.cpu_p99_hourly.p95)}/${r2(o.cpu_p99_hourly.max)}`,
    `${r2(o.mem_p99_hourly.median)}/${r2(o.mem_p99_hourly.p95)}/${r2(o.mem_p99_hourly.max)}`,
    r2(o.billable_instance_hours), r2(o.egress_gib)].join(" | "));
}
const smartcityApi = rows.find((o) => o.name === "smartcity-api");
if (smartcityApi) selftest(Object.values(smartcityApi.requests).reduce((a, b) => a + b, 0) > 0, "smartcity-api has requests (its uptime check alone guarantees some until it is retired)");
const bogus = await timeSeries("hauska-prod-497015", `metric.type="run.googleapis.com/request_count" AND resource.type="cloud_run_revision" AND resource.labels.service_name="zz-no-such-svc"`, { alignmentPeriod: `${DAYS * 86400}s`, perSeriesAligner: "ALIGN_SUM" }, start, end);
selftest(bogus.length === 0, "a nonexistent service returns no series (not a zero-filled one)");
finish();
