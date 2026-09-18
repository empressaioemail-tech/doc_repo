#!/usr/bin/env node
// Cloud Run Jobs: configuration, execution counts and derived cost per job over N days.
// Cost = billable instance-seconds (resource cloud_run_job) x the job's cpu/memory x the live
// Billing Catalog "Jobs CPU/Memory in <region>" SKUs. Derived, not billed.
//
// Why: the factory job plane moves to DOKS in OPS-25 D-31; this is its sizing input and the
// before-figure its bill line is compared against. On 2026-09-18 it read about $73 per 30 days,
// $44 of it factory-publish-gate-sched.
//
// Usage: DAYS=30 node --use-system-ca scripts/infra/gcp-exit/jobs-cost.mjs
// Self-tests: at least one job is billed (factory-publish-gate-sched runs hourly while its trigger is
// enabled), and every billed job has a readable spec.
import { gcloudJson, getJson, timeSeries, pointValue, snapshot, selftest, finish } from "./lib.mjs";

const DAYS = Number(process.env.DAYS || 30);
const end = new Date(), start = new Date(end.getTime() - DAYS * 86400e3);
const PLANES = [["hauska-prod-497015", "us-east4"], ["legacy-design-tools-prod", "us-central1"]];
snapshot("gcp-exit jobs-cost", `window ${start.toISOString()}..${end.toISOString()} (derived, not billed)`);
let skus = [], t;
do { const j = await getJson(`https://cloudbilling.googleapis.com/v1/services/152E-C115-5142/skus?pageSize=5000${t ? "&pageToken=" + t : ""}`); skus.push(...(j.skus || [])); t = j.nextPageToken; } while (t);
const unit = (desc) => { const s = skus.find((x) => x.description === desc); if (!s) throw new Error(`SKU not found: ${desc}; refusing to guess`); const r = s.pricingInfo[0].pricingExpression.tieredRates.at(-1).unitPrice; return Number(r.units || 0) + (r.nanos || 0) / 1e9; };
const cpuNum = (c) => (String(c).endsWith("m") ? Number(String(c).slice(0, -1)) / 1000 : Number(c));
const memGiB = (m) => parseFloat(m) / (String(m).endsWith("Mi") ? 1024 : 1);
let billedJobs = 0, grand = 0;
const unpriced = []; // jobs billed in the window but deleted since: listed with hours, never priced by guess
for (const [project, region] of PLANES) {
  const cpuP = unit(`Jobs CPU in ${region}`), memP = unit(`Jobs Memory in ${region}`);
  const jobs = Object.fromEntries(gcloudJson(["run", "jobs", "list", `--project=${project}`, `--region=${region}`]).map((j) => [j.metadata.name, j]));
  const bill = await timeSeries(project, `metric.type="run.googleapis.com/container/billable_instance_time" AND resource.type="cloud_run_job"`,
    { alignmentPeriod: `${DAYS * 86400}s`, perSeriesAligner: "ALIGN_SUM", crossSeriesReducer: "REDUCE_SUM", groupByFields: ["resource.labels.job_name"] }, start, end);
  const rows = [];
  for (const s of bill) {
    const name = s.resource.labels.job_name, secs = s.points.reduce((a, p) => a + pointValue(p), 0);
    const j = jobs[name];
    if (!j) { unpriced.push([name, secs / 3600]); continue; }
    const c = j.spec.template.spec.template.spec.containers[0].resources.limits;
    const usd = secs * (cpuNum(c.cpu) * cpuP + memGiB(c.memory) * memP);
    rows.push([name, `${c.cpu}/${c.memory}`, j.spec.template.spec.template.spec.timeoutSeconds, secs / 3600, usd]);
    billedJobs++; grand += usd;
  }
  console.log(`\n== ${project} (${Object.keys(jobs).length} jobs defined, ${rows.length} billed in window)`);
  for (const r of rows.sort((a, b) => b[4] - a[4])) console.log(`   ${r[0].padEnd(44)} ${String(r[1]).padEnd(10)} timeout=${r[2]}s ${r[3].toFixed(1).padStart(7)} h  ~$${r[4].toFixed(2)}`);
}
if (unpriced.length) {
  console.log(`\nbilled in the window but no longer defined (deleted), UNPRICED:`);
  for (const [n, h] of unpriced) console.log(`   ${n.padEnd(44)} ${h.toFixed(1).padStart(7)} h`);
}
console.log(`\nTOTAL ~$${grand.toFixed(2)} per ${DAYS}d (derived${unpriced.length ? `; a LOWER BOUND: ${unpriced.length} deleted jobs with ${unpriced.reduce((a, [, h]) => a + h, 0).toFixed(1)} h are unpriced` : ""})`);
selftest(billedJobs > 0, `at least one defined job billed (${billedJobs}); zero means the metric query is blind`);
finish();
