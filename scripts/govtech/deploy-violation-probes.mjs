#!/usr/bin/env node
/**
 * G-105 deploy violation probes (OPS-17 A-085 / scope rev 3 S5-2a).
 *
 * File-based instrument grading live deploy gates against known pre-fix defects.
 * Each gate maps to a merged PR that is armed-inert until deployed and probed.
 *
 * Gates and defects (scope rev 3 `_inbox/2026-08-24_govtech_program_scope.md`):
 *
 *   deploy-7  — plan-review PR #7 (empressaioemail-tech/plan-review)
 *               Defect #6: code lookup served a neighbouring section via
 *               `IBC_SEED.find(...) || chapterHits[0] || IBC_SEED[0]`.
 *               Violation: unknown section returns 200 with a different section id.
 *               Fixed: refuse / typed absence; client citation synthesiser removed.
 *               DEPLOY-7 RULE: Cloud Run service + Vercel plan-review-app TOGETHER.
 *               Live (credentials): plan-review Cloud Run + Vercel UI must share one cut.
 *
 *   deploy-39 — smartcity-dashboards PR #39 (empressaioemail-tech/smartcity-dashboards)
 *               Defect #1: `atomVisibleToCaller` true when accessPolicy absent.
 *               Defect #2: `/api/lenses/city-manager/compose` resolves caller, never gates.
 *               Violation: anonymous compose exposes tenant-private atom bodies.
 *               Fixed: fail-closed visibility; compose gated on packContentReadStatus.
 *
 *   deploy-75 — hauska-mcp-server PR #75 (empressaioemail-tech/hauska-mcp-server)
 *               Defect S4-2: meter bypass — wrap() empty provenance + atom_ids guard.
 *               Violation: ICC accrual fires with zero provenance / bypass envelope.
 *               Fixed: detector split; bypass path refuses or records explicit skip.
 *
 *   deploy-361 — hauska-engine PR #361 (empressaioemail-tech/hauska-engine)
 *               Defect #5: `resolveAccessPolicy` returned `maybePolicy ?? "public-free"`.
 *               Violation: write accepts missing accessPolicy and stamps public-free.
 *               Fixed: `resolveAccessPolicyOrRefuse` on writer INSERT paths.
 *               Live write probe needs engine credentials; predicate tested via fixtures.
 *
 * Usage:
 *   node scripts/govtech/deploy-violation-probes.mjs --gate deploy-7 --expect pass
 *   node scripts/govtech/deploy-violation-probes.mjs --gate all --expect fail --mock
 *
 * --expect pass  exit 0 when the serving revision satisfies the post-fix predicate.
 * --expect fail  exit 0 when the violation is still present (pre-deploy baseline).
 *
 * Live mode requires env URLs (see GATE_LIVE below). Without them, use --mock with
 * fixture payloads exported from this module for unit tests.
 *
 * Self-tests: node --test scripts/govtech/deploy-violation-probes.test.mjs
 */

import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Unknown section used consistently across deploy-7 live + fixture probes. */
export const DEPLOY7_PROBE_SECTION = "R9999.9.9";

export const GATE_IDS = ["deploy-7", "deploy-39", "deploy-75", "deploy-361"];

/** Live endpoints — override via env; placeholders declared in snapshot output. */
export const GATE_LIVE = {
  "deploy-7": {
    repo: "empressaioemail-tech/plan-review",
    pr: 7,
    cloudRunUrl:
      process.env.PLAN_REVIEW_SERVICE_URL ||
      "https://plan-review-ozx33wafia-ue.a.run.app",
    vercelUrl:
      process.env.PLAN_REVIEW_APP_URL ||
      "https://plan-review-app-ten.vercel.app",
    revisionPlaceholder: process.env.PLAN_REVIEW_REVISION || "<plan-review-revision>",
    vercelDeploymentPlaceholder:
      process.env.PLAN_REVIEW_VERCEL_DPL || "<plan-review-vercel-dpl>",
    probePath: `/api/code-lookup?edition=icc-demo&section=${encodeURIComponent(DEPLOY7_PROBE_SECTION)}`,
    gcloudNote:
      "gcloud run services describe plan-review --project plan-review-505715 --region us-east1 --format=json",
    vercelNote:
      "vercel ls plan-review-app --scope empressaioemail-tech (from plan-review/web/)",
  },
  "deploy-39": {
    repo: "empressaioemail-tech/smartcity-dashboards",
    pr: 39,
    serviceUrl:
      process.env.SMARTCITY_DASHBOARDS_URL ||
      "https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app",
    revisionPlaceholder:
      process.env.SMARTCITY_DASHBOARDS_REVISION || "<smartcity-dashboards-revision>",
    probePath: "/api/lenses/city-manager/compose?cityKey=template-city",
    gcloudNote:
      "gcloud run services describe smartcity-dashboards --project smartcity-dashboards --region us-east1 --format=json",
  },
  "deploy-75": {
    repo: "empressaioemail-tech/hauska-mcp-server",
    pr: 75,
    mcpUrl: process.env.HAUSKA_MCP_URL || "https://mcp.hauska.dev",
    revisionPlaceholder: process.env.HAUSKA_MCP_REVISION || "<hauska-mcp-revision>",
    probeNote:
      "MCP wrap/accrual probe requires product key; POST tools/call with violation envelope (empty provenance, non-empty atom_ids).",
    gcloudNote:
      "gcloud run services describe hauska-mcp-server --format=json (project/region from deploy record)",
  },
  "deploy-361": {
    repo: "empressaioemail-tech/hauska-engine",
    pr: 361,
    engineApiUrl:
      process.env.HAUSKA_ENGINE_API_URL ||
      "https://retrieval-api-<project>.run.app",
    revisionPlaceholder: process.env.HAUSKA_ENGINE_REVISION || "<engine-api-revision>",
    probeNote:
      "Writer refuse probe needs authenticated POST to atom write path without accessPolicy; grade via response body.",
    gcloudNote:
      "gcloud run services describe retrieval-api --format=json (property seat deploy record)",
  },
};

/** Fixture payloads for self-tests (exported for deploy-violation-probes.test.mjs). */
export const FIXTURES = {
  deploy7Good: {
    requestedSection: DEPLOY7_PROBE_SECTION,
    status: 404,
    body: {
      status: "refused",
      code: "section-not-found",
      section: DEPLOY7_PROBE_SECTION,
      reason: "no matching section in declared edition",
    },
  },
  deploy7Bad: {
    requestedSection: DEPLOY7_PROBE_SECTION,
    status: 200,
    body: {
      status: "ok",
      section: "R302.1",
      title: "Exterior walls",
      fallback: true,
      requestedSection: DEPLOY7_PROBE_SECTION,
    },
  },
  deploy39Good: {
    callerKind: "anonymous",
    status: 200,
    body: {
      atoms: [{ id: "a1", accessPolicy: "public-free" }],
      filtered: { tenantPrivateCount: 0, absentPolicyCount: 0 },
      gated: true,
    },
  },
  deploy39Bad: {
    callerKind: "anonymous",
    status: 200,
    body: {
      atoms: [
        { id: "a1", accessPolicy: "tenant-private", title: "leaked" },
        { id: "a2", accessPolicy: null },
      ],
      filtered: { tenantPrivateCount: 1, absentPolicyCount: 1 },
      gated: false,
    },
  },
  deploy75Good: {
    body: {
      accrual: { counted: false, reason: "provenance-empty-refused" },
      envelope: { provenance: [], atom_ids: ["did:hauska:code-section:test"] },
    },
  },
  deploy75Bad: {
    body: {
      accrual: { counted: true, amountMinor: 1 },
      envelope: { provenance: [], atom_ids: ["did:hauska:code-section:test"] },
    },
  },
  deploy361Good: {
    status: 400,
    body: {
      error: "access-policy-required",
      refused: true,
      field: "accessPolicy",
    },
  },
  deploy361Bad: {
    status: 201,
    body: {
      ok: true,
      accessPolicy: "public-free",
      inferred: true,
    },
  },
};

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * deploy-7: unknown section must refuse, never neighbour fallback.
 */
export function gradeDeploy7(result) {
  const failures = [];
  const requested =
    result.requestedSection ?? result.body?.requestedSection ?? DEPLOY7_PROBE_SECTION;
  const body = result.body ?? result;
  const status = result.status;

  if (body?.fallback === true) {
    failures.push("neighbour fallback flag present (defect #6)");
  }
  if (
    isNonEmptyString(body?.section) &&
    body.section !== requested &&
    body.status !== "refused" &&
    body.code !== "section-not-found"
  ) {
    failures.push(
      `returned section ${JSON.stringify(body.section)} for request ${JSON.stringify(requested)}`,
    );
  }
  if (body?.status === "ok" && body.section && body.section !== requested) {
    failures.push("HTTP ok with substituted section id");
  }
  if (status === 200 && body?.status === "ok" && body.section !== requested) {
    failures.push("200 ok with wrong section (pre-fix behaviour)");
  }

  const refused =
    status === 404 ||
    status === 422 ||
    body?.status === "refused" ||
    body?.code === "section-not-found" ||
    body?.refused === true;
  if (failures.length === 0 && !refused && body?.section !== requested) {
    failures.push("expected refuse or exact section match");
  }
  if (failures.length === 0 && refused) {
    return { pass: true, failures: [] };
  }
  if (failures.length === 0 && body?.section === requested) {
    return { pass: true, failures: [] };
  }
  return { pass: failures.length === 0, failures };
}

/**
 * deploy-39: anonymous caller must not see tenant-private or absent-policy atoms.
 */
export function gradeDeploy39(result) {
  const failures = [];
  const body = result.body ?? result;
  const callerKind = result.callerKind ?? "anonymous";
  const atoms = Array.isArray(body?.atoms) ? body.atoms : [];

  if (callerKind !== "anonymous") {
    return { pass: true, failures: [] };
  }

  for (const atom of atoms) {
    const policy = atom?.accessPolicy;
    if (policy === "tenant-private") {
      failures.push(`tenant-private atom visible to anonymous: ${atom?.id ?? "?"}`);
    }
    if (policy === undefined || policy === null || policy === "") {
      failures.push(
        `atom with absent accessPolicy visible (defect #1): ${atom?.id ?? "?"}`,
      );
    }
  }

  if (body?.gated === false) {
    failures.push("compose not gated on caller (defect #2)");
  }

  const leaked =
    (body?.filtered?.tenantPrivateCount ?? 0) > 0 ||
    (body?.filtered?.absentPolicyCount ?? 0) > 0;
  if (leaked) {
    failures.push("filtered counts show leaked atoms");
  }

  return { pass: failures.length === 0, failures };
}

/**
 * deploy-75: empty provenance must not accrue (meter bypass closed).
 */
export function gradeDeploy75(result) {
  const failures = [];
  const body = result.body ?? result;
  const envelope = body?.envelope ?? result.envelope ?? {};
  const accrual = body?.accrual ?? result.accrual ?? {};
  const provenance = envelope.provenance ?? [];
  const atomIds = envelope.atom_ids ?? envelope.atomIds ?? [];

  const provenanceEmpty = !Array.isArray(provenance) || provenance.length === 0;
  const hasAtomIds = Array.isArray(atomIds) && atomIds.length > 0;

  if (provenanceEmpty && hasAtomIds && accrual?.counted === true) {
    failures.push("accrual counted with empty provenance (S4-2 bypass)");
  }
  if (provenanceEmpty && hasAtomIds && (accrual?.amountMinor ?? 0) > 0) {
    failures.push("non-zero accrual with empty provenance");
  }
  if (provenanceEmpty && hasAtomIds && accrual?.reason !== "provenance-empty-refused") {
    if (accrual?.counted !== false) {
      failures.push("expected provenance-empty-refused or counted=false");
    }
  }

  return { pass: failures.length === 0, failures };
}

/**
 * deploy-361: writer must refuse missing accessPolicy (no ?? public-free).
 */
export function gradeDeploy361(result) {
  const failures = [];
  const body = result.body ?? result;
  const status = result.status;

  const refused =
    status === 400 ||
    status === 422 ||
    body?.refused === true ||
    body?.error === "access-policy-required";
  const inferredPublicFree =
    body?.accessPolicy === "public-free" &&
    (body?.inferred === true || body?.defaulted === true);
  const acceptedWithoutPolicy =
    (status === 201 || status === 200 || body?.ok === true) && inferredPublicFree;

  if (acceptedWithoutPolicy) {
    failures.push('write accepted missing accessPolicy as "public-free" (defect #5)');
  }
  if (!refused && body?.ok === true && !isNonEmptyString(body?.accessPolicy)) {
    failures.push("write succeeded without explicit accessPolicy");
  }

  if (failures.length === 0 && refused) {
    return { pass: true, failures: [] };
  }
  if (failures.length === 0 && body?.accessPolicy && !body?.inferred) {
    return { pass: true, failures: [] };
  }

  return { pass: failures.length === 0, failures };
}

const GRADERS = {
  "deploy-7": gradeDeploy7,
  "deploy-39": gradeDeploy39,
  "deploy-75": gradeDeploy75,
  "deploy-361": gradeDeploy361,
};

export function gradeGate(gateId, result) {
  const grader = GRADERS[gateId];
  if (!grader) {
    throw new Error(`unknown gate: ${gateId}`);
  }
  return grader(result);
}

export function evaluateExpectation(grade, expect) {
  if (expect === "pass") {
    return grade.pass
      ? { ok: true, message: "predicate pass (post-fix behaviour)" }
      : { ok: false, message: `expected pass, got violation: ${grade.failures.join("; ")}` };
  }
  if (expect === "fail") {
    return !grade.pass
      ? { ok: true, message: "violation detected (pre-fix or probe working)" }
      : { ok: false, message: "expected violation present, but predicate passed" };
  }
  throw new Error(`--expect must be pass|fail, got ${expect}`);
}

function parseArgs(argv) {
  const args = { gate: null, expect: "pass", mock: false, fixture: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--gate" && argv[i + 1]) args.gate = argv[++i];
    else if (a === "--expect" && argv[i + 1]) args.expect = argv[++i];
    else if (a === "--mock") args.mock = true;
    else if (a === "--fixture" && argv[i + 1]) args.fixture = argv[++i];
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

function printSnapshot(gates) {
  const now = new Date().toISOString();
  console.error("SNAPSHOT deploy-violation-probes");
  console.error(`  date: ${now}`);
  console.error(`  doc_repo: ${ROOT}`);
  for (const gate of gates) {
    const live = GATE_LIVE[gate];
    console.error(`  ${gate}:`);
    console.error(`    repo: ${live.repo} PR #${live.pr}`);
    console.error(`    serving_revision: ${live.revisionPlaceholder}`);
    if (live.vercelDeploymentPlaceholder) {
      console.error(`    vercel_deployment: ${live.vercelDeploymentPlaceholder}`);
    }
  }
}

async function fetchJson(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { accept: "application/json", ...(init.headers ?? {}) },
  });
  let body;
  const text = await res.text();
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  return { status: res.status, body };
}

async function liveProbe(gateId) {
  const live = GATE_LIVE[gateId];
  switch (gateId) {
    case "deploy-7": {
      const url = `${live.cloudRunUrl}${live.probePath}`;
      const { status, body } = await fetchJson(url);
      return gradeDeploy7({
        status,
        body,
        requestedSection: DEPLOY7_PROBE_SECTION,
      });
    }
    case "deploy-39": {
      const url = `${live.serviceUrl}${live.probePath}`;
      const { status, body } = await fetchJson(url);
      return gradeDeploy39({ status, body, callerKind: "anonymous" });
    }
    case "deploy-75":
    case "deploy-361":
      return {
        pass: false,
        failures: [
          `${gateId} live probe requires credentials — use documented gcloud/MCP commands; grade via --mock fixtures until auth available`,
        ],
      };
    default:
      throw new Error(`unknown gate ${gateId}`);
  }
}

function mockProbe(gateId, fixtureName) {
  const fixtureKey =
    fixtureName ??
    (gateId === "deploy-7"
      ? "deploy7Good"
      : gateId === "deploy-39"
        ? "deploy39Good"
        : gateId === "deploy-75"
          ? "deploy75Good"
          : "deploy361Good");
  const fixture = FIXTURES[fixtureKey];
  if (!fixture) {
    throw new Error(`unknown fixture ${fixtureKey}`);
  }
  return gradeGate(gateId, fixture);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.gate) {
    console.log(`Usage: node scripts/govtech/deploy-violation-probes.mjs --gate <${GATE_IDS.join("|")}|all> --expect pass|fail [--mock] [--fixture name]`);
    process.exit(args.help ? 0 : 1);
  }

  const gates = args.gate === "all" ? [...GATE_IDS] : [args.gate];
  for (const g of gates) {
    if (!GATE_IDS.includes(g)) {
      console.error(`unknown gate: ${g}`);
      process.exit(1);
    }
  }

  printSnapshot(gates);

  let exitCode = 0;
  for (const gateId of gates) {
    const grade = args.mock
      ? mockProbe(gateId, args.fixture)
      : await liveProbe(gateId);
    const evalResult = evaluateExpectation(grade, args.expect);
    const line = `[${gateId}] ${evalResult.ok ? "OK" : "MISMATCH"}: ${evalResult.message}`;
    console.log(line);
    if (grade.failures?.length) {
      console.log(`  failures: ${grade.failures.join("; ")}`);
    }
    if (!evalResult.ok) exitCode = 1;
  }

  process.exit(exitCode);
}

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
