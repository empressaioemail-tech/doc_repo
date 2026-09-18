#!/usr/bin/env node
// GCP estate inventory for the exit (OPS-25). Cloud Asset Inventory per project, reduced to
// workload-bearing resources, plus Cloud Scheduler jobs read directly (Asset Inventory does NOT
// index Scheduler jobs: ten known jobs were absent from it on 2026-09-18).
//
// Usage: node --use-system-ca scripts/infra/gcp-exit/inventory.mjs [--types]
// Exit 2 when a self-test fails.
//
// What would prove this wrong: a resource known to exist missing from the output. The self-tests
// name three (one service, one VM, one Scheduler job) and one name that must not exist.
import fs from "node:fs";
import path from "node:path";
import { PROJECTS, OUT, getJson, snapshot, selftest, finish } from "./lib.mjs";

const NOISE = new Set([
  "serviceusage.googleapis.com/Service", "iam.googleapis.com/ServiceAccount", "iam.googleapis.com/ServiceAccountKey",
  "run.googleapis.com/Revision", "run.googleapis.com/Execution", "run.googleapis.com/Task",
  "cloudresourcemanager.googleapis.com/Project", "cloudbilling.googleapis.com/ProjectBillingInfo",
  "artifactregistry.googleapis.com/DockerImage", "compute.googleapis.com/Route", "compute.googleapis.com/Subnetwork",
  "compute.googleapis.com/Network", "compute.googleapis.com/Firewall", "compute.googleapis.com/Disk",
  "compute.googleapis.com/InstanceSettings", "compute.googleapis.com/Project", "logging.googleapis.com/LogBucket",
  "logging.googleapis.com/LogSink", "secretmanager.googleapis.com/SecretVersion", "cloudbuild.googleapis.com/Build",
  "dataplex.googleapis.com/EntryGroup", "pubsub.googleapis.com/Subscription", "sqladmin.googleapis.com/Backup",
  "sqladmin.googleapis.com/BackupRun",
]);
const SCHEDULER_REGIONS = ["us-central1", "us-east1", "us-east4", "us-south1", "us-west1"];

snapshot("gcp-exit inventory", `projects=${PROJECTS.length}`);
const all = {};
for (const project of PROJECTS) {
  const rows = [];
  let pageToken;
  do {
    const p = new URLSearchParams({ pageSize: "500" });
    if (pageToken) p.set("pageToken", pageToken);
    const j = await getJson(`https://cloudasset.googleapis.com/v1/projects/${project}:searchAllResources?${p}`);
    rows.push(...(j.results || []));
    pageToken = j.nextPageToken;
  } while (pageToken);
  const sched = [];
  for (const region of SCHEDULER_REGIONS) {
    try {
      const j = await getJson(`https://cloudscheduler.googleapis.com/v1/projects/${project}/locations/${region}/jobs`);
      for (const job of j.jobs || []) sched.push({ region, job });
    } catch (e) {
      if (/has not been used|is disabled|SERVICE_DISABLED/.test(e.message)) break; // API off = no jobs can exist
      throw e;
    }
  }
  all[project] = { rows, sched };
  fs.writeFileSync(path.join(OUT, `assets_${project}.json`), JSON.stringify(rows));
}

for (const [project, { rows, sched }] of Object.entries(all)) {
  console.log(`\n== ${project} (${rows.length} assets)`);
  if (process.argv.includes("--types")) {
    const counts = {};
    for (const r of rows) counts[r.assetType] = (counts[r.assetType] || 0) + 1;
    for (const [t, n] of Object.entries(counts).sort()) console.log(`   ${NOISE.has(t) ? "(noise) " : ""}${t}: ${n}`);
    continue;
  }
  for (const r of rows.filter((r) => !NOISE.has(r.assetType)).sort((a, b) => (a.assetType + a.displayName).localeCompare(b.assetType + b.displayName))) {
    console.log(`   ${r.assetType.replace(".googleapis.com", "")} | ${r.displayName} | ${r.location}${r.state ? " [" + r.state + "]" : ""}`);
  }
  for (const { region, job } of sched) {
    const t = job.httpTarget;
    const auth = t?.oidcToken ? "oidc" : t?.oauthToken ? "oauth" : t?.headers && Object.keys(t.headers).some((h) => /secret|auth/i.test(h)) ? "header-secret" : "none";
    console.log(`   scheduler | ${job.name.split("/").pop()} | ${region} | ${job.schedule} | ${job.state} | ${t ? `${t.httpMethod} ${t.uri} auth=${auth}` : "non-http"}`);
  }
}

const has = (p, type, name) => (all[p]?.rows || []).some((r) => r.assetType === type && r.displayName === name);
selftest(has("hauska-prod-497015", "run.googleapis.com/Service", "hauska-mcp-server"), "hauska-mcp-server service present");
selftest(has("legacy-design-tools-prod", "compute.googleapis.com/Instance", "overpass-tx-01"), "overpass-tx-01 VM present (drops out once D-6 retires it)");
selftest((all["legacy-design-tools-prod"]?.sched || []).some(({ job }) => job.name.endsWith("/county-ledger-heartbeat")), "county-ledger-heartbeat Scheduler job read directly");
selftest(!Object.values(all).some(({ rows }) => rows.some((r) => r.displayName === "zz-no-such-resource-qq")), "a nonexistent name is absent");
finish();
