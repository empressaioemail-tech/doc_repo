#!/usr/bin/env node
// Call-graph edges and database hosts hidden in Secret Manager. For every Cloud Run service, each
// env var whose NAME suggests a URL, host or database and whose value comes from a secret is
// resolved and printed as scheme://host[:port] ONLY. Userinfo, paths, queries and every non-URL
// value are withheld. Values live in memory and are never written anywhere.
//
// Why it exists: on 2026-09-18 two call-graph edges (cortex-api -> retrieval-api via
// BRIEF_RETRIEVAL_API_URL; smart-markets-api -> api.empressa.pro) and the Neon region of every
// store were visible only here.
//
// Usage: node --use-system-ca scripts/infra/gcp-exit/secret-hosts.mjs
// Self-tests: at least one postgres host must parse (else the parser is blind), and a plain,
// non-secret env var (hauska-mcp-server DASHBOARDS_BACKEND_URL) must NOT be listed.
import { SERVICES, gcloudJson, getJson, hostOf, snapshot, selftest, finish } from "./lib.mjs";

const NAME = /URL|HOST|DSN|ENDPOINT|BASE|ORIGIN|DATABASE/i;
const neon = (h) => (h.match(/\.((?:us|eu|ap|sa)-[a-z]+-\d)\.aws\.neon\.tech/) || [])[1];
snapshot("gcp-exit secret-hosts");
const cache = new Map();
let pg = 0, leaked = false;
for (const [project, region, name] of SERVICES) {
  const svc = gcloudJson(["run", "services", "describe", name, `--project=${project}`, `--region=${region}`]);
  const env = svc.spec.template.spec.containers[0].env || [];
  const lines = [];
  for (const e of env.filter((e) => e.valueFrom?.secretKeyRef && NAME.test(e.name))) {
    const ref = e.valueFrom.secretKeyRef, projNum = svc.metadata.namespace;
    const key = `${projNum}/${ref.name}/${ref.key}`;
    if (!cache.has(key)) {
      try {
        const j = await getJson(`https://secretmanager.googleapis.com/v1/projects/${projNum}/secrets/${ref.name}/versions/${ref.key || "latest"}:access`);
        cache.set(key, Buffer.from(j.payload.data, "base64").toString("utf8"));
      } catch (err) { cache.set(key, new Error(err.message)); }
    }
    const v = cache.get(key);
    if (v instanceof Error) { lines.push(`${e.name} <- ${ref.name}: unreadable (${v.message.slice(0, 60)})`); continue; }
    const h = hostOf(v);
    if (!h) { lines.push(`${e.name} <- ${ref.name}: not a URL (value withheld)`); continue; }
    if (/^postgres/.test(h)) pg++;
    if (e.name === "DASHBOARDS_BACKEND_URL") leaked = true;
    lines.push(`${e.name} <- ${ref.name}: ${h}${neon(h) ? `  [neon ${neon(h)}]` : ""}`);
  }
  if (lines.length) { console.log(`\n## ${name}`); lines.forEach((l) => console.log("   " + l)); }
}
selftest(pg > 0, `postgres hosts parsed (${pg})`);
selftest(!leaked, "a plain env var is not treated as a secret");
finish();
