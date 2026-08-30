#!/usr/bin/env node
/**
 * Authoritative-vs-convenient read detector.
 *
 * ENFORCEMENT.md line 96 already says "Read the authoritative record, never a
 * proxy for it." It is prose, and this repo's measured base rate is prose
 * controls 0-for-3, hook-shaped controls 1-for-1. On 2026-08-30 two load-bearing
 * planner claims failed, both by reading the convenient artifact:
 *
 *   - "A12 is absorbed"        -> read the working tree; the fix was uncommitted.
 *   - "P4 multiplies this 41x" -> read a coverage count; the writer P4 calls
 *                                 hardcodes the field null.
 *
 * Neither was caught by re-reading the conclusion. The defect is that the
 * CONVENIENT read is the tool default: `grep file.md` reads the working tree,
 * `cd repo && grep` reads whatever branch a seat left checked out.
 *
 * This WARNS, it does not block. ENFORCEMENT: a control whose scope is broader
 * than its claim is worse than a narrow one, because it teaches the fleet to
 * reach for the bypass flag. Every pattern here is a documented instance, not a
 * category. When in doubt it stays silent.
 *
 *   node scripts/enforcement/authoritative-read.mjs --self-test
 */

/** Each rule: a documented failure, its convenient read, and the authoritative one. */
export const RULES = [
  {
    id: "worktree-not-head",
    // cat/sed/grep/head/tail on a doc_repo canon path. Only meaningful because
    // P0-class gates are defined over TRACKED canon.
    test: (c) =>
      /\b(cat|sed|head|tail|grep|rg)\b/.test(c) &&
      /\b(90_operations|80_adrs|_decisions|ENFORCEMENT\.md|CLAUDE\.md)\b/.test(c) &&
      !/git\s+show\s+HEAD:/.test(c) &&
      !/git\s+show\s+origin\//.test(c),
    say: "reads the WORKING TREE. A gate defined over tracked canon is not satisfied by an uncommitted fix (2026-08-30: OPS-1 A12 read as landed while HEAD still carried the lie). Authoritative: git show HEAD:<path>",
  },
  {
    id: "stale-product-checkout",
    test: (c) =>
      /\bgit\s+-C\s+\/p\/[a-z-]+|cd\s+\/p\/(hauska|legacy|smart|cortex)[a-z-]*/.test(c) &&
      /\b(grep|show|cat|sed)\b/.test(c) &&
      !/origin\/(main|master)/.test(c),
    say: "reads a LOCAL CHECKOUT. Product clones here sit on feature branches hundreds of commits behind (2026-08-30: LDT 206, hauska-map 236, neither contained the file under review). Authoritative: git -C <repo> show origin/main:<path>",
  },
  {
    id: "gcloud-positional-format",
    test: (c) => /--format=["']?value\([^)]*,[^)]*\)/.test(c),
    say: "multi-field --format=value() aligns by semicolon; ONE blank field shifts every column after it and the wrong serving revision gets reported. Authoritative: --format=json, read fields by name",
  },
  {
    id: "latest-ready-not-serving",
    test: (c) => /latestReadyRevisionName/.test(c),
    say: "latestReadyRevisionName is NOT the serving revision. A new revision can be ready and carry zero traffic. Authoritative: the revision on the request's own log line",
  },
  {
    id: "atoms-db-as-schema",
    test: (c) => /hauska_mcp\.atoms/.test(c) && !/database|--dbname|\/hauska_mcp/.test(c),
    say: "hauska_mcp is a DATABASE, not a schema. `hauska_mcp.atoms` as schema.table returns 0 columns - a FALSE ABSENCE. Authoritative: connect to database hauska_mcp, query public.atoms",
  },
  {
    id: "unanchored-like-on-atoms",
    test: (c) => /entity_id\s+LIKE\s+'%/i.test(c),
    say: "an unanchored LIKE on atoms already timed out at 90s once, and a timeout misread as 0 is a fabricated absence. Authoritative: an indexed (entity_type, entity_id) range predicate",
  },
  {
    id: "image-tag-not-digest",
    test: (c) => /gcloud\s+run\s+(deploy|jobs)/.test(c) && /:latest\b/.test(c),
    say: ":latest resolves at deploy time and has frozen a digest seconds before the intended push. Authoritative: pin the SHA/digest and read the digest back off the revision",
  },
];

export function evaluate(command) {
  if (typeof command !== "string" || command.trim() === "") return [];
  return RULES.filter((r) => {
    try {
      return r.test(command);
    } catch {
      return false; // a rule that throws must not block work
    }
  }).map((r) => ({ id: r.id, say: r.say }));
}

export function render(hits) {
  if (hits.length === 0) return "";
  const lines = hits.map((h) => `  [${h.id}] ${h.say}`);
  return (
    "AUTHORITATIVE-READ WARNING (not a block; proceed if you meant it)\n\n" +
    lines.join("\n\n") +
    "\n\nIf this read is load-bearing, use the authoritative form and state the ref in your claim.\n"
  );
}

/* ---------------- self-test: both directions, not vacuous ---------------- */

function selfTest() {
  const cases = [
    // must FIRE
    ["grep -n 'zero rows' 90_operations/OPS-1_texas_source_registry.md", "worktree-not-head", true],
    ["git -C /p/legacy-design-tools grep -n foo -- 'artifacts/**'", "stale-product-checkout", true],
    ['gcloud run services describe x --format="value(status.traffic[].revisionName,status.traffic[].percent)"', "gcloud-positional-format", true],
    ["gcloud run services describe x --format='value(status.latestReadyRevisionName)'", "latest-ready-not-serving", true],
    ["psql -c \"select * from hauska_mcp.atoms limit 1\"", "atoms-db-as-schema", true],
    ["select count(*) from atoms where entity_id LIKE '%48021%'", "unanchored-like-on-atoms", true],
    ["gcloud run deploy svc --image us-docker.pkg.dev/p/i:latest", "image-tag-not-digest", true],
    // must NOT fire (the authoritative forms)
    ["git show HEAD:90_operations/OPS-1_texas_source_registry.md | grep -n 'zero rows'", "worktree-not-head", false],
    ["git -C /p/legacy-design-tools show origin/main:artifacts/api-server/src/lib/x.ts", "stale-product-checkout", false],
    ['gcloud run services describe x --format=json', "gcloud-positional-format", false],
    ["psql --dbname hauska_mcp -c 'select * from public.atoms limit 1'", "atoms-db-as-schema", false],
    ["select 1 from atoms where entity_type='x' and entity_id >= '48021:' and entity_id < '48022:'", "unanchored-like-on-atoms", false],
    // must be SILENT on ordinary work (not-vacuous / over-broad check)
    ["git status --porcelain", null, false],
    ["node scripts/ctx/post-h-residue-recount.mjs --self-test", null, false],
    ["ls -la _inbox/", null, false],
  ];
  let pass = 0;
  const fail = [];
  for (const [cmd, rule, want] of cases) {
    const hits = evaluate(cmd).map((h) => h.id);
    const got = rule === null ? hits.length > 0 : hits.includes(rule);
    if (got === want) pass++;
    else fail.push({ cmd, rule, want, hits });
  }
  const out = { ok: fail.length === 0, tests: cases.length, passed: pass, failed: fail };
  console.log(JSON.stringify(out, null, 2));
  return fail.length === 0 ? 0 : 1;
}

if (process.argv.includes("--self-test")) {
  process.exit(selfTest());
}
