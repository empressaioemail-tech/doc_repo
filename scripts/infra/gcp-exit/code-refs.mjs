#!/usr/bin/env node
// GCP coupling in source: scans a directory of repository clones for run.app hosts, GCS paths,
// GCP-owned IPs, GCP client libraries, Cloud Run runtime variables and GCP deploy paths, and
// classifies each hit as code, deploy/ops, config, test or docs.
//
// It reads CLONES, never seat worktrees: clone with
//   git clone --depth 1 --filter=blob:limit=2m https://github.com/empressaioemail-tech/<repo> <dir>/<repo>
// and pass <dir>. Declare the commit of each clone in the output you cite (it prints them).
//
// Usage: node scripts/infra/gcp-exit/code-refs.mjs <clones-dir> [summary|hosts]
// This is also the D-35 "no GCP reference remains" gate: zero code/deploy/config hits.
// Self-tests: a planted reference in a throwaway control repo must be found and classed as code (so a
// zero-hit estate still proves the scan can see), and a pattern that cannot occur finds nothing.
// Optional REQUIRE=<repo>:<file> adds a real known hit; on 2026-09-18 that was
// smartcity-dashboards:src/vendor-live.mjs (OPS-25 D-13).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { selftest, finish } from "./lib.mjs";

const root = process.argv[2];
const mode = process.argv[3] || "summary";
if (!root || !fs.existsSync(root)) { console.error("usage: code-refs.mjs <clones-dir> [summary|hosts]"); process.exit(64); }
const PATTERNS = {
  runapp: /[a-z0-9-]+(?:-\d{6,})?\.[a-z0-9-]*\.?run\.app/gi,
  gcs: /storage\.googleapis\.com\/[a-z0-9._-]+|storage\.cloud\.google\.com\/[a-z0-9._-]+|gs:\/\/[a-z0-9._-]+/gi,
  ips: /\b10\.128\.0\.2\b|136\.119\.126\.165|35\.245\.249\.243/g,
  gcplib: /@google-cloud\/[a-z-]+|google-auth-library|from google\.cloud|google-cloud-[a-z]+/g,
  runenv: /\bK_SERVICE\b|\bK_REVISION\b|\bCLOUD_RUN_[A-Z_]+\b|\bGOOGLE_CLOUD_PROJECT\b|metadata\.google\.internal/g,
  deploy: /gcloud (?:run|builds|scheduler|secrets|storage|compute|sql)\b|google-github-actions\/[a-z-]+|workload_identity_provider|cloudbuild[\w.-]*\.ya?ml/g,
  bogus: /zz-no-such-host-qq\.run\.app/g,
};
const SKIP_DIR = new Set(["node_modules", ".git", "dist", "build", ".next", "coverage", "vendor", "attached_assets", ".turbo", "__pycache__", ".venv"]);
const SKIP_FILE = /(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|\.min\.js|\.map|\.(png|jpe?g|gif|pdf|zip|gz|ico|woff2?|ttf|geojson|pbf|parquet|sqlite|db))$/i;
const cls = (f) => /\.md$|\/_research\/|\/docs?\//i.test(f) ? "docs" : /(\.test\.|\.spec\.|__tests__|\/tests?\/|fixtures?)/i.test(f) ? "test" : /(\.github\/workflows|cloudbuild|Dockerfile|deploy|\.ya?ml$|scripts\/)/i.test(f) ? "deploy/ops" : /\.(ts|tsx|js|mjs|cjs|py|go|cs)$/i.test(f) ? "code" : "config";
const hits = [];
function walk(dir, repo, repoRoot) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) walk(full, repo, repoRoot); continue; }
    if (SKIP_FILE.test(e.name)) continue;
    let text; try { if (fs.statSync(full).size > 3e6) continue; text = fs.readFileSync(full, "utf8"); } catch { continue; }
    const rel = path.relative(repoRoot, full).replace(/\\/g, "/");
    for (const [kind, re] of Object.entries(PATTERNS)) {
      const m = text.match(re);
      if (m) hits.push({ repo, file: rel, kind, cls: cls(rel), vals: [...new Set(m.map((x) => x.toLowerCase()))] });
    }
  }
}
const repos = fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, ".git")));
for (const repo of repos) {
  let head = "?"; try { head = execFileSync("git", ["-C", path.join(root, repo), "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim(); } catch {}
  console.log(`# ${repo} @ ${head}`);
  walk(path.join(root, repo), repo, path.join(root, repo));
}
if (mode === "summary") {
  const t = {};
  for (const h of hits) { const k = `${h.repo} | ${h.kind}`; (t[k] ||= { code: 0, "deploy/ops": 0, config: 0, test: 0, docs: 0 })[h.cls]++; }
  console.log("\nrepo | kind | code deploy/ops config test docs (file counts)");
  for (const [k, v] of Object.entries(t).sort()) console.log(`${k} | ${v.code} ${v["deploy/ops"]} ${v.config} ${v.test} ${v.docs}`);
} else {
  const m = {};
  for (const h of hits.filter((h) => ["runapp", "gcs", "ips"].includes(h.kind) && !["docs", "test"].includes(h.cls))) for (const v of h.vals) ((m[v] ||= {})[h.repo] ||= []).push(`${h.file}[${h.cls}]`);
  for (const [v, rs] of Object.entries(m).sort()) { console.log(`\n${v}`); for (const [r, f] of Object.entries(rs)) console.log(`   ${r}: ${f.length}: ${f.slice(0, 8).join(", ")}${f.length > 8 ? ` (+${f.length - 8})` : ""}`); }
}
// Positive control that survives the exit: a synthetic repo with one planted reference, scanned by
// the same walker. When the estate reaches zero real hits, this still proves the scan can see one.
const fx = fs.mkdtempSync(path.join((await import("node:os")).tmpdir(), "code-refs-control-"));
const fxRepo = path.join(fx, "control-repo");
fs.mkdirSync(path.join(fxRepo, ".git"), { recursive: true });
fs.mkdirSync(path.join(fxRepo, "src"));
fs.writeFileSync(path.join(fxRepo, "src", "client.ts"), 'const BASE = "https://zz-control-svc-7dyaiy7wha-uc.a.run.app/api";\n');
const before = hits.length;
walk(fxRepo, "control-repo", fxRepo);
const controlHits = hits.splice(before);
fs.rmSync(fx, { recursive: true, force: true });
selftest(controlHits.some((h) => h.kind === "runapp" && h.cls === "code" && h.file === "src/client.ts"), "planted run.app reference in a control repo is found and classed as code");
selftest(!hits.some((h) => h.kind === "bogus"), "an impossible pattern finds nothing");
if (process.env.REQUIRE) { const [r, f] = process.env.REQUIRE.split(":"); selftest(hits.some((h) => h.repo === r && h.file === f), `required known hit ${process.env.REQUIRE} found`); }
finish();
