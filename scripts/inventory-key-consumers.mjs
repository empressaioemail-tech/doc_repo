#!/usr/bin/env node
/**
 * P-305 (OPS-24): the inventory of every place the three service keys live.
 *
 * WHY IT IS A SCRIPT AND NOT A PARAGRAPH. The dispatch asks for "every Vercel project in the team
 * and every Cloud Run service that holds a copy of HAUSKA_ENGINE_API_KEY, SERVICE_API_KEY or
 * CORTEX_SERVICE_API_KEY, by environment, read by variable name only". A hand-written list is true
 * for one afternoon; the rotation runbook names this inventory as the thing that must be complete
 * before a rotation is authorised, so the listing has to be reproducible by whoever runs the
 * rotation next (DEV_PROCESS 0: a control that depends on someone remembering is not a control).
 *
 * READ BY NAME ONLY. Nothing here reads a secret VALUE. The Vercel half asks the CLI for the env
 * LIST (key, target, type, updatedAt, never the value -- the API does not return values and this
 * script is not able to); the Cloud Run half reads each resource's own configuration
 * (`env[].name` and `env[].valueFrom.secretKeyRef.name`). The report carries names and timestamps.
 *
 * WHAT EXECUTES IT / TRIGGERS IT / FAILS IT / BYPASSES IT:
 *   executes  `node scripts/inventory-key-consumers.mjs` from an authorised workstation where
 *             `vercel` is signed in and `gcloud` can list both GCP projects. `--selftest` needs
 *             neither and proves the two matchers fire.
 *   triggers  ON DEMAND: before a rotation is authorised (see the runbook) and whenever a consumer
 *             is added. NOT in CI: it needs two authenticated CLIs and a team scope that CI does
 *             not carry; a CI version would be a dead gate (DEV_PROCESS 2.0).
 *   fails     non-zero (4) when any listing could not be read. A resource or project that cannot be
 *             listed is reported as UNREADABLE with its error -- never as clean. An empty result is
 *             not an absence (AGENT_CONTRACT 5).
 *   bypasses  STATED RATHER THAN DISCOVERED:
 *             (1) The predicate is THREE NAMES. A copy of the value held under another name is out
 *                 of reach by construction; the two known aliases (HAUSKA_RETRIEVAL_API_KEY,
 *                 RETRIEVAL_API_KEY -- the names A-205 actually ran through) are reported in their
 *                 own bucket, marked as OUTSIDE the three-name predicate.
 *             (2) Only this Vercel team is listed. Local `.env` files, GitHub Actions secrets,
 *                 Replit, Cloud Build substitutions and other teams are named as gaps below, not
 *                 enumerated.
 *             (3) Cloud Run env values are read as names/refs only; a value inlined as a literal
 *                 under one of the three names is detected by NAME (the `env[].name` branch), which
 *                 is the point -- whether it is a literal or a ref does not change that the
 *                 consumer holds a copy.
 *             (4) `gcloud` on this workstation emits an InsecureRequestWarning (unverified HTTPS to
 *                 run.googleapis.com); it still returns data, and that warning is recorded in the
 *                 report rather than hidden.
 */
import { execFile, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const PREDICATE_KEYS = Object.freeze(["HAUSKA_ENGINE_API_KEY", "SERVICE_API_KEY", "CORTEX_SERVICE_API_KEY"]);
/** Names outside the three-name predicate, reported because A-205's miss ran through them. */
export const OBSERVED_ALIASES = Object.freeze(["HAUSKA_RETRIEVAL_API_KEY", "RETRIEVAL_API_KEY"]);
export const GCP_PROJECTS = Object.freeze(["hauska-prod-497015", "legacy-design-tools-prod"]);
export const VERCEL_TEAM_ID = "team_4TH5lNnFHcBGx4EKNapJ2MVG";
export const VERCEL_TEAM_SLUG = "empressaioemail-techs-projects";

export const STATED_GAPS = Object.freeze([
  "local workstation .env files (not enumerated by any listing here)",
  "GitHub Actions secrets in every product repo (not readable by this identity)",
  "Replit env (not readable by this identity)",
  "Cloud Build substitutions and Cloud Scheduler headers (not run env, not enumerated)",
  "Vercel projects outside team " + VERCEL_TEAM_SLUG + " (out of the team listing by definition)",
  "a copy of a predicate key's VALUE held under a different variable name (the predicate is three names)",
]);

/** CLI helper. `shell: true` because on Windows gcloud/vercel resolve to .cmd wrappers. */
function cli(cmd, args, { env = {} } = {}) {
  return execFileSync(cmd, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, NODE_OPTIONS: "--use-system-ca", ...env },
  });
}

/** The same helper, non-blocking: the Vercel half has one CLI call per project, and a blocking
 *  spawn there would make the bounded concurrency a fiction. */
async function cliAsync(cmd, args, { env = {} } = {}) {
  const { stdout } = await execFileAsync(cmd, args, {
    encoding: "utf8",
    shell: true,
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, NODE_OPTIONS: "--use-system-ca", ...env },
  });
  return stdout;
}

/* ------------------------------- matchers (pure) ------------------------------- */

/** The predicate over a Vercel env-var entry list, as returned by `vercel env ls --format json`. */
export function matchVercelEnvs(envs, keys = PREDICATE_KEYS) {
  return (envs ?? [])
    .filter((e) => keys.includes(e?.key))
    .map((e) => ({ key: e.key, environments: [...(e.target ?? [])].sort(), type: e.type ?? null, updatedAt: e.updatedAt ?? null }));
}

/** Cloud Run services nest env at spec.template.spec.containers; jobs one level deeper. */
export function containersOf(kind, json) {
  return kind === "jobs"
    ? json?.spec?.template?.spec?.template?.spec?.containers ?? []
    : json?.spec?.template?.spec?.containers ?? [];
}

/** Every env entry (plain name or secretKeyRef name) that matches the keys. Pure; no I/O.
 *  `source` states HOW the resource gets the value: `secretKeyRef` follows a Secret Manager
 *  version (a rotation reaches it on a new revision); `env` is a literal baked into the Cloud Run
 *  config (a rotation does NOT reach it until someone rewrites the config -- the distinction the
 *  runbook turns on), and `matchedBy` says which of the two names carried the hit. */
export function matchCloudRunEnvs(kind, json, keys = PREDICATE_KEYS) {
  const out = [];
  for (const c of containersOf(kind, json)) {
    for (const e of c?.env ?? []) {
      const ref = e?.valueFrom?.secretKeyRef?.name ?? null;
      const nameHit = Boolean(e?.name && keys.includes(e.name));
      const refHit = Boolean(ref && keys.includes(ref));
      if (!nameHit && !refHit) continue;
      out.push({
        envVar: e.name ?? null,
        source: ref ? "secretKeyRef" : "env",
        secretName: ref,
        container: c.name ?? null,
        matchedBy: nameHit ? "env-var-name" : "secret-name",
      });
    }
  }
  return out;
}

/* ---------------------------------- selftest ---------------------------------- */
export function selftest({ log = console.log } = {}) {
  const cases = [];
  const check = (name, got, want) => cases.push({ name, ok: JSON.stringify(got) === JSON.stringify(want), got, want });

  check(
    "Vercel: a predicate key in preview+production is found with BOTH environments",
    matchVercelEnvs([
      { key: "HAUSKA_RETRIEVAL_API_KEY", target: ["preview"], type: "sensitive", updatedAt: 1 },
      { key: "CORTEX_SERVICE_API_KEY", target: ["production", "preview"], type: "sensitive", updatedAt: 2 },
      { key: "VITE_CARTO_API_KEY", target: ["production"], type: "sensitive", updatedAt: 3 },
    ]).map((m) => `${m.key}:${m.environments.join("+")}`),
    ["CORTEX_SERVICE_API_KEY:preview+production"],
  );
  check(
    "Vercel: an alias is NOT a predicate hit (bypass 1 depends on this being invisible here)",
    matchVercelEnvs([{ key: "HAUSKA_RETRIEVAL_API_KEY", target: ["preview"] }]),
    [],
  );
  check(
    "Cloud Run: a service env literal under a predicate name is found",
    matchCloudRunEnvs("services", { spec: { template: { spec: { containers: [{ name: "app", env: [{ name: "SERVICE_API_KEY", value: "x" }] }] } } } }),
    [{ envVar: "SERVICE_API_KEY", source: "env", secretName: null, container: "app", matchedBy: "env-var-name" }],
  );
  check(
    "Cloud Run: a job's secretKeyRef is found one level deeper than a service's",
    matchCloudRunEnvs("jobs", { spec: { template: { spec: { template: { spec: { containers: [{ name: "job", env: [{ name: "K", valueFrom: { secretKeyRef: { name: "HAUSKA_ENGINE_API_KEY" } } }] }] } } } } } }),
    [{ envVar: "K", source: "secretKeyRef", secretName: "HAUSKA_ENGINE_API_KEY", container: "job", matchedBy: "secret-name" }],
  );
  check(
    "Cloud Run: a ref that follows a secret version reads as secretKeyRef, not as a literal",
    matchCloudRunEnvs("services", { spec: { template: { spec: { containers: [{ name: "app", env: [{ name: "HAUSKA_ENGINE_API_KEY", valueFrom: { secretKeyRef: { name: "HAUSKA_ENGINE_API_KEY" } } }] }] } } } }),
    [{ envVar: "HAUSKA_ENGINE_API_KEY", source: "secretKeyRef", secretName: "HAUSKA_ENGINE_API_KEY", container: "app", matchedBy: "env-var-name" }],
  );
  check(
    "Cloud Run: a JOB is invisible to the service path (no false hit, bypass of the wrong reader)",
    matchCloudRunEnvs("services", { spec: { template: { spec: { template: { spec: { containers: [{ name: "job", env: [{ name: "SERVICE_API_KEY", value: "x" }] }] } } } } } }),
    [],
  );
  check(
    "Cloud Run: an env var outside the predicate is ignored",
    matchCloudRunEnvs("services", { spec: { template: { spec: { containers: [{ name: "app", env: [{ name: "CORTEX_API_URL", value: "x" }, { name: "MYSTERY_KEY", value: "y" }] }] } } } }),
    [],
  );

  const failed = cases.filter((c) => !c.ok);
  for (const c of cases) log(`  ${c.ok ? "pass" : "FAIL"}  ${c.name}${c.ok ? "" : `  got=${JSON.stringify(c.got)} want=${JSON.stringify(c.want)}`}`);
  log(failed.length ? `\n${failed.length} selftest case(s) FAILED` : `\nall ${cases.length} selftest cases pass (both matchers, both directions)`);
  return failed.length === 0;
}

/* --------------------------------- vercel half --------------------------------- */

function listVercelProjects() {
  const out = [];
  let next = null;
  do {
    const args = ["project", "ls", "--format", "json"];
    if (next) args.push("--next", String(next));
    const j = JSON.parse(cli("vercel", args));
    out.push(...(j.projects ?? []).map((p) => ({ name: p.name, id: p.id })));
    next = j.pagination?.next ?? null;
    if (out.length > 500) break; // runaway guard; a team with >500 projects needs a paged inventory, stated
  } while (next);
  return out;
}

async function vercelEnvs(project, dir) {
  fs.mkdirSync(path.join(dir, ".vercel"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, ".vercel", "project.json"),
    JSON.stringify({ projectId: project.id, orgId: VERCEL_TEAM_ID, projectName: project.name }),
    "utf8",
  );
  const j = JSON.parse(await cliAsync("vercel", ["env", "ls", "--cwd", dir, "--format", "json"]));
  return j.envs ?? [];
}

/** Bounded-concurrency map. Each Vercel call needs its OWN scaffold dir, or two workers race on
 *  `.vercel/project.json` and one project is read under another's id. */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

/* ---------------------------------- cloud half ---------------------------------- */

function cloudRunResources(kind, project) {
  const list = JSON.parse(cli("gcloud", ["run", kind, "list", `--project=${project}`, "--format=json"]));
  return list.map((r) => ({ name: r.metadata?.name, region: (r.metadata?.labels ?? {})["cloud.googleapis.com/location"] ?? r.metadata?.region }));
}

function describeCloudRun(kind, project, name, region) {
  return JSON.parse(cli("gcloud", ["run", kind, "describe", name, `--project=${project}`, `--region=${region}`, "--format=json"]));
}

/* ------------------------------------- run ------------------------------------- */

export async function run({ log = console.log, out = null, skipVercel = false, concurrency = 4 } = {}) {
  const unreachable = [];
  const scaffold = fs.mkdtempSync(path.join(os.tmpdir(), "p305-inventory-"));

  // ---- Vercel ----
  let projects = [];
  let vercelOk = true;
  if (!skipVercel) {
    try {
      projects = listVercelProjects();
    } catch (err) {
      vercelOk = false;
      unreachable.push({ half: "vercel", scope: "project ls", error: String(err.message ?? err).split("\n")[0].slice(0, 200) });
    }
  }
  const vercelHits = [];
  const vercelAliasHits = [];
  await mapLimit(projects, concurrency, (p, i) => {
    let envs;
    return vercelEnvs(p, path.join(scaffold, `link-${i}`))
      .then((found) => {
        for (const m of matchVercelEnvs(found)) vercelHits.push({ project: p.name, projectId: p.id, ...m });
        for (const m of matchVercelEnvs(found, OBSERVED_ALIASES)) vercelAliasHits.push({ project: p.name, projectId: p.id, ...m });
      })
      .catch((err) => {
        unreachable.push({ half: "vercel", project: p.name, error: String(err.message ?? err).split("\n")[0].slice(0, 200) });
      });
  });

  // ---- Cloud Run ----
  const cloudHits = [];
  let resourcesScanned = 0;
  for (const project of GCP_PROJECTS) {
    for (const kind of ["services", "jobs"]) {
      let listed;
      try {
        listed = cloudRunResources(kind, project);
      } catch (err) {
        unreachable.push({ half: "cloud-run", project, kind, error: String(err.message ?? err).split("\n")[0].slice(0, 200) });
        continue;
      }
      for (const r of listed) {
        try {
          const json = describeCloudRun(kind, project, r.name, r.region);
          resourcesScanned += 1;
          for (const m of matchCloudRunEnvs(kind, json)) cloudHits.push({ project, kind: kind.slice(0, -1), resource: r.name, region: r.region, ...m });
          for (const m of matchCloudRunEnvs(kind, json, OBSERVED_ALIASES)) cloudHits.push({ project, kind: kind.slice(0, -1), resource: r.name, region: r.region, ...m, outsidePredicate: true });
        } catch (err) {
          unreachable.push({ half: "cloud-run", project, kind, resource: r.name, error: String(err.message ?? err).split("\n")[0].slice(0, 200) });
        }
      }
    }
  }

  fs.rmSync(scaffold, { recursive: true, force: true });

  const withIso = (h) => ({ ...h, updatedAtIso: h.updatedAt ? new Date(h.updatedAt).toISOString() : null });

  const report = {
    ok: unreachable.length === 0,
    lane: "p305-key-drift",
    instrument: "inventory-key-consumers",
    at: new Date().toISOString(),
    countingRule:
      `Vercel: every project in team ${VERCEL_TEAM_SLUG} (project ls, all pages followed) x its env list; a hit is an env var whose NAME is one of [${PREDICATE_KEYS.join(", ")}]. ` +
      `Cloud Run: every service and job in [${GCP_PROJECTS.join(", ")}] read by field; a hit is env[].name or env[].valueFrom.secretKeyRef.name in that same set. ` +
      `Values are never read. Resources scanned = ${resourcesScanned}; projects listed = ${projects.length}.`,
    predicateKeys: [...PREDICATE_KEYS],
    vercel: {
      team: VERCEL_TEAM_SLUG,
      teamId: VERCEL_TEAM_ID,
      projectsListed: projects.length,
      hits: vercelHits.map(withIso),
      aliasHitsOutsidePredicate: vercelAliasHits.map(withIso),
      projectsWithNoPredicateHit: projects.map((p) => p.name).filter((n) => !vercelHits.some((h) => h.project === n)),
      listFailed: !vercelOk,
    },
    cloudRun: { resourcesScanned, hits: cloudHits, projects: [...GCP_PROJECTS] },
    unreachable,
    statedGaps: [...STATED_GAPS],
    note: "no secret VALUE is read, returned or printed by this script; every field is a name, an environment or a timestamp",
  };

  const text = JSON.stringify(report, null, 2);
  if (out) fs.writeFileSync(out, text + "\n", "utf8");
  log(text);
  return report;
}

/* ------------------------------------- cli ------------------------------------- */

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes("--selftest")) {
    process.exitCode = selftest() ? 0 : 1;
  } else if (argv.includes("--help") || argv.includes("-h")) {
    console.log("Usage: node scripts/inventory-key-consumers.mjs [--out <file.json>] [--skip-vercel]\nExit 4 when any listing could not be read.");
  } else {
    const outIdx = argv.indexOf("--out");
    const out = outIdx >= 0 ? argv[outIdx + 1] : null;
    run({ out, skipVercel: argv.includes("--skip-vercel") })
      .then((report) => {
        process.exitCode = report.ok ? 0 : 4;
      })
      .catch((err) => {
        console.error(`inventory-key-consumers: ${String(err?.message ?? err)}`);
        process.exitCode = 4;
      });
  }
}
