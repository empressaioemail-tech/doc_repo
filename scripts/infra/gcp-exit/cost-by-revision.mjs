#!/usr/bin/env node
// Derived Cloud Run service cost per revision, split into the SERVING revision and 0%-traffic
// revisions (tagged canaries and recently untagged ones that still hold minimum instances).
//
// Cost = billable instance-seconds per revision (Cloud Monitoring) x that revision's OWN cpu, memory
// and billing mode (its spec, not the service template's) x the Billing Catalog SKU price read live.
// DERIVED, not billed: it ignores request charges, the free tier, networking and discounts. Grade
// money against a bill line (OPS-25 rule 5) once the billing export exists.
//
// Finding on 2026-09-18: about 96 percent of derived service cost was 0%-traffic revisions. Each
// tagged revision of a min-instances service keeps a warm instance for as long as the tag exists.
// Independent confirmation: 37 hauska-engine-api tags removed 2026-09-16 ~16:53Z stopped billing at
// exactly that time (revisions 00154-00159 billed 125 of 168 hours in the window ending 09-18 11:25Z).
//
// Usage: DAYS=30 node --use-system-ca scripts/infra/gcp-exit/cost-by-revision.mjs [service ...]
// What would prove the canary-leak reading wrong: the serving revision carrying most of the billable
// time. The script prints the split so that result would be visible.
import { SERVICES, gcloudJson, getJson, timeSeries, pointValue, snapshot, selftest, finish } from "./lib.mjs";

const DAYS = Number(process.env.DAYS || 30);
const end = new Date(), start = new Date(end.getTime() - DAYS * 86400e3);
const only = process.argv.slice(2);
snapshot("gcp-exit cost-by-revision", `window ${start.toISOString()}..${end.toISOString()} (derived, not billed)`);

// Live SKU prices. Refuse rather than fall back to a remembered number.
let skus = [], t;
do {
  const j = await getJson(`https://cloudbilling.googleapis.com/v1/services/152E-C115-5142/skus?pageSize=5000${t ? "&pageToken=" + t : ""}`);
  skus.push(...(j.skus || [])); t = j.nextPageToken;
} while (t);
const unit = (s) => { const r = s.pricingInfo?.[0]?.pricingExpression?.tieredRates?.at(-1)?.unitPrice; return Number(r?.units || 0) + (r?.nanos || 0) / 1e9; };
function price(desc, region) {
  const s = skus.find((x) => x.description === desc && (!region || x.serviceRegions?.includes(region)));
  if (!s) throw new Error(`SKU not found: "${desc}"${region ? " in " + region : ""}; refusing to price with a guess`);
  return unit(s);
}
const P = (region) => ({
  instCpu: price(`Services CPU (Instance-based billing) in ${region}`, region),
  instMem: price(`Services Memory (Instance-based billing) in ${region}`, region),
  reqCpu: price("Services CPU (Request-based billing)", region),
  reqMem: price("Services Memory (Request-based billing)", region),
  idleCpu: price("Services Min Instance CPU (Request-based billing)", region),
  idleMem: price("Services Min Instance Memory (Request-based billing)", region),
});
const cpuNum = (c) => (String(c).endsWith("m") ? Number(String(c).slice(0, -1)) / 1000 : Number(c));
const memGiB = (m) => { const s = String(m), n = parseFloat(s); return s.endsWith("Gi") ? n : s.endsWith("Mi") ? n / 1024 : s.endsWith("G") ? (n * 1e9) / 2 ** 30 : s.endsWith("M") ? (n * 1e6) / 2 ** 30 : n; };

let grand = 0, grandIdle = 0, missing = 0, sawServingShare = false;
for (const [project, region, name] of SERVICES.filter(([, , n]) => !only.length || only.includes(n))) {
  const prices = P(region);
  const svc = gcloudJson(["run", "services", "describe", name, `--project=${project}`, `--region=${region}`]);
  const serving = new Set((svc.spec.traffic || []).filter((x) => (x.percent ?? 0) > 0).map((x) => x.revisionName ?? svc.status.latestReadyRevisionName));
  const tagged = new Set((svc.spec.traffic || []).filter((x) => x.tag).map((x) => x.revisionName));
  const revs = Object.fromEntries(gcloudJson(["run", "revisions", "list", `--service=${name}`, `--project=${project}`, `--region=${region}`]).map((r) => [r.metadata.name, r]));
  const bill = await timeSeries(project, `metric.type="run.googleapis.com/container/billable_instance_time" AND resource.type="cloud_run_revision" AND resource.labels.service_name="${name}"`,
    { alignmentPeriod: `${DAYS * 86400}s`, perSeriesAligner: "ALIGN_SUM", crossSeriesReducer: "REDUCE_SUM", groupByFields: ["resource.labels.revision_name"] }, start, end);
  let total = 0, idle = 0, hours = 0, idleTagged = 0;
  for (const s of bill) {
    const rev = s.resource.labels.revision_name, secs = s.points.reduce((a, p) => a + pointValue(p), 0);
    const r = revs[rev];
    if (!r) { missing++; continue; }
    const lim = r.spec.containers[0].resources?.limits || {};
    const cpu = cpuNum(lim.cpu ?? 1), mem = memGiB(lim.memory ?? "512Mi");
    const throttled = (r.metadata.annotations?.["run.googleapis.com/cpu-throttling"] ?? "true") !== "false";
    const isServing = serving.has(rev);
    const rate = throttled ? (isServing ? cpu * prices.reqCpu + mem * prices.reqMem : cpu * prices.idleCpu + mem * prices.idleMem) : cpu * prices.instCpu + mem * prices.instMem;
    const usd = secs * rate;
    total += usd; hours += secs / 3600;
    if (!isServing) { idle += usd; if (tagged.has(rev)) idleTagged++; }
  }
  if (total > 0 && idle / total < 0.5) sawServingShare = true;
  grand += total; grandIdle += idle;
  console.log(`${name.padEnd(24)} ${hours.toFixed(0).padStart(6)} inst-h  ~$${total.toFixed(0).padStart(5)}  0%-traffic revisions ~$${idle.toFixed(0).padStart(5)} (${total ? ((idle / total) * 100).toFixed(0) : 0}%)  tagged-0% revisions billed: ${idleTagged}  tags now: ${tagged.size}`);
}
console.log(`TOTAL ~$${grand.toFixed(0)} per ${DAYS}d; 0%-traffic revisions ~$${grandIdle.toFixed(0)} (${grand ? ((grandIdle / grand) * 100).toFixed(0) : 0}%)`);
selftest(missing === 0, `every billed revision has a readable spec (missing: ${missing})`);
selftest(grand > 0, "some service cost was measured (a zero total means the metric query is blind)");
if (!only.length) console.error(`note: a service where the serving revision carries most of the cost was ${sawServingShare ? "seen" : "NOT seen"}; after the canary-tag cleanup it should be seen for every min-instances service`);
finish();
