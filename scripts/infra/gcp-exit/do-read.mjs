#!/usr/bin/env node
// Read-only DigitalOcean estate and token-scope matrix. GET requests only; any other method is
// refused before a request is built. The token is read from DIGITALOCEAN_TOKEN, or from the fleet's
// Cursor MCP config (~/.cursor/mcp.json, do-apps Authorization header), and is never printed.
//
// Prints: which endpoints the token can read (200) and which it cannot (403) -- the scope a lane
// actually has -- then the apps (source branch, the commit each component is running, size, count,
// domains, VPC, egress, health check) and droplets.
//
// Usage: node --use-system-ca scripts/infra/gcp-exit/do-read.mjs [--prices]
// Self-tests: 'apps' is readable (the fleet token is Apps-scoped), and a nonexistent endpoint does
// not return 200 (so a 200 means something).
import fs from "node:fs";
import path from "node:path";
import { selftest, finish } from "./lib.mjs";

let auth = process.env.DIGITALOCEAN_TOKEN ? `Bearer ${process.env.DIGITALOCEAN_TOKEN}` : null;
if (!auth) {
  const cfg = JSON.parse(fs.readFileSync(path.join(process.env.USERPROFILE || process.env.HOME, ".cursor", "mcp.json"), "utf8"));
  auth = cfg.mcpServers?.["do-apps"]?.headers?.Authorization;
}
if (!/^Bearer dop_v1_/.test(auth || "")) { console.error("no DigitalOcean token found in DIGITALOCEAN_TOKEN or the do-apps MCP config; refusing"); process.exit(2); }
const get = async (ep) => {
  const r = await fetch(`https://api.digitalocean.com/v2/${ep}${ep.includes("?") ? "&" : "?"}per_page=200`, { method: "GET", headers: { Authorization: auth } });
  return { status: r.status, body: await r.json().catch(() => ({})) };
};
console.log(`# gcp-exit do-read | read ${new Date().toISOString()}`);
const scope = ["account", "apps", "droplets", "vpcs", "sizes", "apps/tiers/instance_sizes", "projects", "monitoring/alerts", "uptime/checks", "databases",
  "registry", "reserved_ips", "firewalls", "load_balancers", "domains", "certificates", "volumes", "cdn/endpoints", "spaces/keys", "kubernetes/clusters", "customers/my/balance"];
const res = {};
console.log("\ntoken scope:");
for (const ep of scope) { res[ep] = await get(ep); console.log(`   ${res[ep].status}  ${ep}`); }

for (const a of res.apps.body.apps || []) {
  const s = a.spec;
  console.log(`\n## app ${s.name} region=${a.region?.slug} live=${a.live_url ?? "-"} vpc=${s.vpc ? "yes" : "no"} egress=${s.egress?.type ?? "default"} domains=${(s.domains || []).map((d) => d.domain).join(",") || "-"}`);
  for (const kind of ["services", "workers", "jobs", "static_sites"]) for (const c of s[kind] || []) {
    const dep = (a.active_deployment?.[kind] || []).find((x) => x.name === c.name);
    console.log(`   ${kind.slice(0, -1)} ${c.name}: ${c.instance_size_slug} x${c.instance_count ?? "-"} autoscaling=${c.autoscaling ? "yes" : "no"} health=${c.health_check ? "yes" : "NONE"} src=${c.github ? `${c.github.repo}@${c.github.branch}` : c.image ? `image:${c.image.repository}` : "?"} running_commit=${dep?.source_commit_hash?.slice(0, 8) ?? "-"}`);
  }
}
for (const d of res.droplets.body.droplets || []) console.log(`\n## droplet ${d.name} ${d.size_slug} ($${d.size.price_monthly}/mo) ${d.region.slug} public=${d.networks.v4.find((n) => n.type === "public")?.ip_address} vpc=${d.vpc_uuid}`);
if (process.argv.includes("--prices")) {
  console.log("\nApp Platform sizes:");
  for (const z of res["apps/tiers/instance_sizes"].body.instance_sizes || []) if (!z.deprecation_intent) console.log(`   ${z.slug.padEnd(24)} ${z.cpu_type} vcpu=${z.cpus} mem=${Number(z.memory_bytes) / 2 ** 30}GiB $${z.usd_per_month}/mo autoscalable=${!!z.scalable}`);
}
selftest(res.apps.status === 200, "apps endpoint readable");
selftest((await get("zz_no_such_endpoint")).status !== 200, "a nonexistent endpoint does not return 200");
finish();
