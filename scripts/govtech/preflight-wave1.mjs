#!/usr/bin/env node
/**
 * Govtech Wave 1 pre-flight — read-only checks where possible.
 *
 * Documents probes from:
 *   _inbox/2026-08-24_govtech_program_scope.md  ("What could not be established")
 *   _inbox/2026-08-24_govtech_transaction_contract.md ("What I could not establish")
 *
 * Usage:
 *   node scripts/govtech/preflight-wave1.mjs
 *   node scripts/govtech/preflight-wave1.mjs --json-only
 *
 * Exit 0 when every runnable check passes; exit 1 if any runnable check fails.
 * Unmeasured probes (need DSN/gcloud/live credentials) are emitted with status
 * `unmeasured` and never fake a measured result.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const JSON_ONLY = process.argv.includes('--json-only');

/** Expected Wave 1 WDLL path once operator-approved. */
export const WAVE1_WDLL_CANDIDATES = [
  '_inbox/2026-08-25_govtech_wave1_WDLL.md',
  '_inbox/govtech_wave1_WDLL.md',
];

/** Canonical doc paths Wave 1 lanes gate on. */
export const DOC_ARTIFACTS = [
  {
    id: 'DOC-SCOPE',
    path: '_inbox/2026-08-24_govtech_program_scope.md',
    planRow: 'G-105',
    wdll: 'scope rev 3',
  },
  {
    id: 'DOC-CONTRACT',
    path: '_inbox/2026-08-24_govtech_transaction_contract.md',
    planRow: 'G-110',
    wdll: 'DOC-1 / S5-1',
  },
  {
    id: 'DOC-MIGRATION',
    path: '_inbox/2026-08-24_govtech_engine_migration_plan.md',
    planRow: 'G-108',
    wdll: 'DOC-2 / S2-1',
  },
  {
    id: 'DOC-ADR023',
    path: '_inbox/2026-08-24_adr023_amendment_draft.md',
    planRow: 'G-108',
    wdll: 'DOC-5',
  },
  {
    id: 'DOC-OPS17',
    path: '90_operations/OPS-17_govtech_stack_plan_of_record.md',
    planRow: 'G-105',
    wdll: 'DOC-4',
  },
  {
    id: 'DOC-CANVAS',
    path: 'canvases/govtech-master-program.canvas.tsx',
    planRow: 'G-110',
    wdll: 'live board',
    optional: true,
    pendingNote: 'Cursor-managed canvas may live outside git; adversarial CP1 JSON is fallback tracker',
    fallbackPath: '_inbox/2026-08-24_govtech_plan_adversarial_cp1.json',
  },
];

/**
 * Probes carried forward from scope + contract. `kind: unmeasured` probes emit
 * exact commands/SQL for the operator; they never run here without credentials.
 */
export const PROBES = [
  {
    id: 'SCOPE-01',
    source: 'scope',
    probe: 'Whether HAUSKA_MCP_URL is set on the live dashboards Cloud Run service',
    kind: 'unmeasured',
    owner: 'govtech',
    planRow: 'G-105',
    wdll: 'S1-15',
    passCriteria:
      'gcloud describe shows HAUSKA_MCP_URL non-empty on serving revision smartcity-dashboards-*',
    command: {
      shell: 'gcloud',
      args: [
        'run',
        'services',
        'describe',
        'smartcity-dashboards',
        '--region=us-east1',
        '--project=smartcity-dashboards',
        '--format=json(spec.template.spec.containers[0].env)',
      ],
      note: 'Read env entry name=HAUSKA_MCP_URL; value must be non-empty URL',
    },
  },
  {
    id: 'SCOPE-02',
    source: 'scope',
    probe: 'Contents of dashboards Neon city_packs (stray bastrop row would fail /api/city-packs)',
    kind: 'unmeasured',
    owner: 'govtech',
    planRow: 'G-110',
    wdll: 'S1-17 / R-C',
    passCriteria:
      'Only expected pack keys (template-city, fixture-city, …); no bastrop row on template-city demo',
    command: {
      sql: 'SELECT city_key, access_policy, lenses FROM city_packs ORDER BY city_key;',
      dsn: 'DASHBOARDS_DATABASE_URL (Neon smartcity-dashboards project)',
      note: 'Connect with psql or neon sql; read catalog not infer from API shape alone',
    },
  },
  {
    id: 'SCOPE-03',
    source: 'scope',
    probe: 'Whether MCP Neon migrations 008_sdk_metering_usage and 009_source_obligation_ledger are applied',
    kind: 'unmeasured',
    owner: 'property',
    planRow: 'G-109',
    wdll: 'DEPLOY-75 / S4-0',
    passCriteria:
      'to_regclass returns non-null for sdk_metering tables and source_obligation_ledger; schema matches migration files',
    command: {
      sql: [
        "SELECT to_regclass('public.source_obligation_ledger') AS ledger;",
        "SELECT to_regclass('public.sdk_metering_usage') AS metering;",
        "SELECT version, applied_at FROM schema_migrations WHERE version IN ('008_sdk_metering_usage','009_source_obligation_ledger') ORDER BY version;",
      ],
      dsn: 'MCP_DATABASE_URL (Neon hauska_mcp)',
      note: 'If 009 unapplied, accruals throw into swallowed catch; empty ledger != no traffic',
    },
  },
  {
    id: 'SCOPE-04',
    source: 'scope',
    probe: 'ICC-by-tenant atoms lacking sourceAdapter marker (sizes S4-4 under-count)',
    kind: 'unmeasured',
    owner: 'property',
    planRow: 'G-109',
    wdll: 'S4-4',
    passCriteria:
      'Count documented; after S4-4 fix, tenant-only ICC atoms accrue same as adapter-stamped',
    command: {
      sql: `SELECT count(*) AS icc_tenant_missing_adapter
FROM atoms
WHERE body->>'jurisdictionTenant' = 'icc-model-code'
  AND coalesce(body->>'sourceAdapter', '') <> 'icc-code-connect';`,
      dsn: 'MCP_DATABASE_URL (Neon hauska_mcp)',
    },
  },
  {
    id: 'SCOPE-05',
    source: 'scope',
    probe: 'Whether real PermitFlow rows accumulated atop seed data',
    kind: 'unmeasured',
    owner: 'govtech',
    planRow: '—',
    wdll: 'R-A moot',
    passCriteria: 'Moot under R-A (PermitFlow extinguished); optional data disposition only',
    command: {
      note: 'Skip for Wave 1 unless data disposition card opened',
    },
  },
  {
    id: 'SCOPE-06',
    source: 'scope',
    probe: 'Whether 171 demo records look full (nobody rendered a page in scope pass)',
    kind: 'unmeasured',
    owner: 'govtech',
    planRow: 'G-110',
    wdll: 'S5-5 visual',
    passCriteria: 'Operator or govtech seat renders template-city lenses; records feel dense not hollow',
    command: {
      note: 'Manual: GET https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app/?cityKey=template-city at 1920×1080',
    },
  },
  {
    id: 'CONTRACT-01',
    source: 'contract',
    probe: 'ICC_ACTOR_RECORD_FIXTURE.sourceLicensing (perReferenceRateMinor, meterFreeTier)',
    kind: 'unmeasured',
    owner: 'property',
    planRow: 'G-109',
    wdll: 'S4-9 / O-2',
    passCriteria: 'Fixture fields read from published package; rate presence documented before real billing',
    command: {
      shell: 'npm',
      args: ['pack', '@empressaio/atom-contract@1.9.0', '--pack-destination', '/tmp'],
      followUp:
        'tar -xOf empressaio-atom-contract-*.tgz package/dist/reasoning/index.js | rg sourceLicensing',
      note: 'Or npm install in isolated clone and read node_modules/@empressaio/atom-contract',
    },
  },
  {
    id: 'CONTRACT-02',
    source: 'contract',
    probe: 'Whether source_obligation_ledger table exists and row count (empty vs throw vs traffic)',
    kind: 'unmeasured',
    owner: 'property',
    planRow: 'G-109',
    wdll: 'S4-1b / R-I',
    passCriteria:
      'Table exists; count recorded; if zero, confirm inserts succeed on probe reference not swallowed catch',
    command: {
      sql: [
        "SELECT to_regclass('public.source_obligation_ledger');",
        'SELECT count(*) FROM source_obligation_ledger;',
      ],
      dsn: 'MCP_DATABASE_URL (Neon hauska_mcp)',
    },
  },
  {
    id: 'CONTRACT-03',
    source: 'contract',
    probe: 'Whether plan_review_findings ever carried Pass or Fail (CHECK constraint exercised)',
    kind: 'unmeasured',
    owner: 'govtech',
    planRow: 'G-108',
    wdll: 'S2-7',
    passCriteria: 'GROUP BY shows Pass/Fail reachable or documents only Uncertain/NotApplicable so far',
    command: {
      sql: 'SELECT determination, count(*) FROM plan_review_findings GROUP BY 1 ORDER BY 1;',
      dsn: 'PLAN_REVIEW_DATABASE_URL (Neon plan-review)',
    },
  },
  {
    id: 'CONTRACT-04',
    source: 'contract',
    probe: 'Citation validator vendored into dashboards, plan-review, smart-files without build step',
    kind: 'unmeasured',
    owner: 'govtech',
    planRow: 'G-110',
    wdll: 'S5-2c',
    passCriteria:
      'Shared validator module exists; node --test fails on citation missing editionId in all three repos',
    command: {
      note: 'First S5-2c task: write validator + violation fixture; run node --test in each product repo',
    },
  },
];

/**
 * Parse an unsettled-probes section from scope or contract markdown.
 * Scope uses `-` bullets; contract uses blank-line-separated paragraphs.
 */
export function parseUnestablishedSection(markdown, heading) {
  const needle = `## ${heading}`;
  const start = markdown.indexOf(needle);
  if (start < 0) return [];
  const lineEnd = markdown.indexOf('\n', start);
  if (lineEnd < 0) return [];
  let end = markdown.length;
  const nextSection = markdown.indexOf('\n## ', lineEnd + 1);
  if (nextSection >= 0) end = nextSection;
  const body = markdown.slice(lineEnd + 1, end).trim();
  const bullets = body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-'))
    .map((line) => line.replace(/^-\s*/, '').trim());
  if (bullets.length > 0) return bullets;

  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p && !/^Carried forward rather than guessed/i.test(p));
}

/** True when plan row appears as a declared baseline or ADDED amendment row. */
export function planRowDeclared(planMarkdown, rowId, rowPrefix) {
  const inBaseline = new RegExp(`^\\|\\s*${rowId}\\s*\\|`, 'm').test(planMarkdown);
  const inAmendment = new RegExp(
    `^\\|\\s*A-\\d+\\s*\\|[^\\n|]*\\|[^\\n|]*(?:^|[^A-Za-z0-9-])${rowId}(?:\\s+(?:ADDED|added|ADD|NEW|new))`,
    'm',
  ).test(planMarkdown);
  const prefixOk = new RegExp(`^${rowPrefix}-\\d+$`).test(rowId);
  return prefixOk && (inBaseline || inAmendment);
}

/** Aggregate exit code: fail if any runnable row has pass === false. */
export function summarizeResults(rows) {
  const runnable = rows.filter((r) => r.kind === 'runnable');
  const passed = runnable.filter((r) => r.pass === true).length;
  const failed = runnable.filter((r) => r.pass === false).length;
  const pending = rows.filter((r) => r.status === 'pending' && r.pass !== false).length;
  const unmeasured = rows.filter((r) => r.status === 'unmeasured').length;
  return {
    runnable: runnable.length,
    passed,
    failed,
    pending,
    unmeasured,
    exitCode: failed > 0 ? 1 : 0,
  };
}

/** Fixed-width summary table for operator scan. */
export function formatSummaryTable(rows) {
  const header = ['ID', 'KIND', 'STATUS', 'PLAN', 'PROBE'];
  const widths = [14, 10, 12, 8, 60];
  const pad = (s, w) => (s.length > w ? `${s.slice(0, w - 1)}…` : s.padEnd(w));
  const lines = [
    widths.map((w, i) => pad(header[i], w)).join(' '),
    widths.map((w) => '-'.repeat(w)).join(' '),
  ];
  for (const row of rows) {
    const status =
      row.status ??
      (row.kind === 'runnable' ? (row.pass ? 'pass' : 'FAIL') : row.kind);
    lines.push(
      [
        pad(row.id, widths[0]),
        pad(row.kind ?? 'runnable', widths[1]),
        pad(status, widths[2]),
        pad(row.planRow ?? '—', widths[3]),
        pad(row.probe ?? row.name ?? '', widths[4]),
      ].join(' '),
    );
  }
  return lines.join('\n');
}

function checkFileExists(relPath) {
  return existsSync(join(ROOT, relPath));
}

function tryDispatchCompileG105() {
  // Do not invoke dispatch.mjs here — it writes _dispatches/*.md as a side effect.
  const opsPath = join(ROOT, '90_operations', 'OPS-17_govtech_stack_plan_of_record.md');
  const raw = readFileSync(opsPath, 'utf8');
  const inBaseline = /^\|\s*G-105\s*\|/m.test(raw);
  const inAmendment = /^\|\s*A-\d+\s*\|[^\n|]*\|[^\n|]*(?:^|[^A-Za-z0-9-])G-105(?:\s+(?:ADDED|added|ADD|NEW|new))/m.test(raw);
  if (inBaseline || inAmendment) {
    return { pass: true, detail: 'G-105 declared in OPS-17 (compile-ready for dispatch.mjs)' };
  }
  return { pass: false, detail: 'G-105 not found in OPS-17 baseline or amendments' };
}

function findWave1Wdll() {
  for (const rel of WAVE1_WDLL_CANDIDATES) {
    if (!checkFileExists(rel)) continue;
    const raw = readFileSync(join(ROOT, rel), 'utf8');
    const approvalMatch = raw.match(/^operator_approval:\s*(\S+)/m);
    const statusMatch = raw.match(/^status:\s*(\S+)/m);
    const approved =
      approvalMatch?.[1] === 'approved' ||
      (statusMatch?.[1] === 'active' && approvalMatch?.[1] !== 'pending');
    return { found: true, path: rel, approved };
  }
  return { found: false, path: null, approved: false };
}

function runPreflight() {
  const snapshot = {
    repo: 'doc_repo',
    script: 'scripts/govtech/preflight-wave1.mjs',
    generatedAt: new Date().toISOString(),
  };

  const rows = [];
  const scopeMd = readFileSync(
    join(ROOT, '_inbox/2026-08-24_govtech_program_scope.md'),
    'utf8',
  );
  const contractMd = readFileSync(
    join(ROOT, '_inbox/2026-08-24_govtech_transaction_contract.md'),
    'utf8',
  );
  const ops17Md = readFileSync(
    join(ROOT, '90_operations/OPS-17_govtech_stack_plan_of_record.md'),
    'utf8',
  );

  const scopeBullets = parseUnestablishedSection(
    scopeMd,
    'What could not be established',
  );
  const contractBullets = parseUnestablishedSection(
    contractMd,
    'What I could not establish',
  );

  rows.push({
    id: 'META-SCOPE-BULLETS',
    kind: 'runnable',
    probe: 'Scope doc lists unsettled probes',
    planRow: 'G-105',
    wdll: 'DOC-3',
    pass: scopeBullets.length >= 6,
    detail: `parsed ${scopeBullets.length} bullets`,
  });

  rows.push({
    id: 'META-CONTRACT-BULLETS',
    kind: 'runnable',
    probe: 'Transaction contract lists unsettled probes',
    planRow: 'G-110',
    wdll: 'DOC-1',
    pass: contractBullets.length >= 4,
    detail: `parsed ${contractBullets.length} bullets`,
  });

  for (const doc of DOC_ARTIFACTS) {
    const primary = checkFileExists(doc.path);
    const fallback = doc.fallbackPath ? checkFileExists(doc.fallbackPath) : false;
    const pass = primary || (doc.optional && fallback);
    rows.push({
      id: doc.id,
      kind: 'runnable',
      probe: `File exists: ${doc.path}${doc.optional && !primary && fallback ? ` (fallback ${doc.fallbackPath})` : ''}`,
      planRow: doc.planRow,
      wdll: doc.wdll,
      pass,
      status: doc.optional && !primary ? (fallback ? 'fallback' : 'pending') : undefined,
      detail: primary
        ? 'present'
        : fallback
          ? doc.pendingNote ?? 'fallback present'
          : 'missing',
    });
  }

  rows.push({
    id: 'PLAN-G-105',
    kind: 'runnable',
    probe: 'OPS-17 declares plan row G-105',
    planRow: 'G-105',
    wdll: 'DOC-4',
    pass: planRowDeclared(ops17Md, 'G-105', 'G'),
    detail: planRowDeclared(ops17Md, 'G-105', 'G') ? 'declared' : 'not found',
  });

  const wdll = findWave1Wdll();
  rows.push({
    id: 'WDLL-WAVE1',
    kind: 'runnable',
    probe: 'Wave 1 WDLL operator-approved',
    planRow: 'G-110',
    wdll: 'pending',
    pass: true,
    status: !wdll.found ? 'pending' : wdll.approved ? 'pass' : 'pending',
    detail: !wdll.found
      ? 'Wave 1 WDLL not filed yet; operator approval pending'
      : wdll.approved
        ? wdll.path
        : `${wdll.path} filed (operator_approval pending)`,
  });

  const dispatch = tryDispatchCompileG105();
  rows.push({
    id: 'DISPATCH-G-105',
    kind: 'runnable',
    probe: 'OPS-17 declares G-105 (dispatch compile-ready)',
    planRow: 'G-105',
    wdll: 'dispatch gate',
    pass: dispatch.pass,
    detail: dispatch.detail,
  });

  for (const probe of PROBES) {
    rows.push({
      ...probe,
      status: 'unmeasured',
      pass: null,
      detail: 'requires credentials or live surface; command emitted, not executed',
    });
  }

  const summary = summarizeResults(rows);
  const output = { snapshot, summary, probes: rows };

  if (!JSON_ONLY) {
    console.log(formatSummaryTable(rows));
    console.log('');
    console.log(
      `Runnable: ${summary.passed}/${summary.runnable} passed, ${summary.failed} failed | Pending: ${summary.pending} | Unmeasured: ${summary.unmeasured}`,
    );
    console.log('');
  }
  console.log(JSON.stringify(output, null, 2));

  process.exit(summary.exitCode);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runPreflight();
}
