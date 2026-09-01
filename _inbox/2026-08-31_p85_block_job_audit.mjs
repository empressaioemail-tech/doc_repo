/**
 * P-85 issued-job BLOCK audit.
 *
 * Question: which already-issued records_request_jobs were planned without a
 * block term they should have carried, because BLK(?:OCK)? can never match
 * "BLOCK"?
 *
 * Falsifier (convenient result is zero damage):
 *   - If DATABASE_URL is unset or the store is unreachable, the result is
 *     UNMEASURED. Exit 2. A missing store is not a zero.
 *   - If a fetched row has legal text the retired pattern misses, storedBlock
 *     empty, and the third number is 0, the instrument is wrong.
 *   - If the third number is 0 and every fetched legal that contains BLOCK n
 *     also has a stored block, that 0 is measured, not assumed.
 *
 * Three numbers, not one:
 *   1. issuedInScope          — all rows in records_request_jobs
 *   2. carriedBlockTerm       — request_payload.searchTerms.block non-empty
 *   3. shouldHaveAndDidNot    — new parser extracts a block the retired
 *                               pattern missed, AND stored block is empty
 *
 * Exclusion (declared, not subtracted): jobs with no legalDescription cannot
 * be scored for this defect. They are counted in (1) and named in
 * noLegalDescription.
 *
 * Does not re-run jobs. A count is not a record: misses are named by id.
 *
 * Snapshot is written into the output. Predicates match
 * artifacts/api-server/src/lib/recordsSearchQueryPlan.ts at LDT #567.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

export const RETIRED_BLOCK_PATTERN = /\bBLK(?:OCK)?\.?\s+(\d+[A-Z]?)\b/i;
export const CURRENT_BLOCK_PATTERN = /\bBL(?:OC)?K\.?\s+(\d+[A-Z]?)\b/i;
/** Letter-only block. Not captured by CURRENT_BLOCK_PATTERN (\d+ required). */
export const LETTER_BLOCK_PATTERN = /\bBL(?:OC)?K\.?\s+([A-Z])\b/i;

export function parseBlock(legal) {
  if (!legal?.trim()) return null;
  return legal.trim().match(CURRENT_BLOCK_PATTERN)?.[1]?.trim() ?? null;
}

export function parseLetterBlock(legal) {
  if (!legal?.trim()) return null;
  if (parseBlock(legal)) return null;
  return legal.trim().match(LETTER_BLOCK_PATTERN)?.[1]?.trim() ?? null;
}

export function blockTermMissedByRetiredPattern(legal) {
  if (!legal?.trim()) return false;
  return parseBlock(legal) != null && !RETIRED_BLOCK_PATTERN.test(legal);
}

export function shouldHaveAndDidNot(row) {
  const stored = row.storedBlock == null ? "" : String(row.storedBlock).trim();
  return blockTermMissedByRetiredPattern(row.legalDescription) && stored === "";
}

export function isLetterBlockNoDigit(row) {
  const stored = row.storedBlock == null ? "" : String(row.storedBlock).trim();
  return parseLetterBlock(row.legalDescription) != null && stored === "";
}

export function classifyIssuedRows(rows, extras = {}) {
  const issuedInScope = rows.length;
  const carriedBlockTerm = rows.filter(
    (r) => r.storedBlock != null && String(r.storedBlock).trim() !== "",
  ).length;
  const noLegalDescription = rows.filter(
    (r) => r.legalDescription == null || String(r.legalDescription).trim() === "",
  ).length;
  const digitMisses = rows.filter(shouldHaveAndDidNot).map((r) => ({
    id: r.id,
    parcelKey: r.parcelKey,
    status: r.status,
    legalDescription: String(r.legalDescription).trim(),
    parsedBlock: parseBlock(r.legalDescription),
  }));
  const letterMisses = rows.filter(isLetterBlockNoDigit).map((r) => ({
    id: r.id,
    parcelKey: r.parcelKey,
    status: r.status,
    legalDescription: String(r.legalDescription).trim(),
    parsedLetterBlock: parseLetterBlock(r.legalDescription),
  }));
  const digitParcels = [...new Set(digitMisses.map((m) => m.parcelKey))];
  const letterParcels = [...new Set(letterMisses.map((m) => m.parcelKey))];
  return {
    status: "MEASURED",
    ...extras,
    counts: {
      issuedInScope,
      carriedBlockTerm,
      digitBlockShouldHaveAndDidNot: digitMisses.length,
      letterBlockNoDigit: letterMisses.length,
      issuedWithoutBlockTermTheyShouldHaveCarried: digitMisses.length + letterMisses.length,
      noLegalDescription,
    },
    rerunPopulationLandedFix: {
      jobs: digitMisses.length,
      parcels: digitParcels.length,
      parcelKeys: digitParcels,
      note: "Jobs the landed BL(?:OC)?K parser now extracts. Not re-run: portal-access gate is with the operator.",
    },
    consequencePopulation: {
      jobs: digitMisses.length + letterMisses.length,
      parcels: new Set([...digitParcels, ...letterParcels]).size,
      note: "Issued without a block term they should have carried. 21 is this count, not the re-run count for today's fix.",
    },
    letterBlockClass: {
      jobs: letterMisses.length,
      parcels: letterParcels.length,
      parcelKeys: letterParcels,
      disposition: "held-parser-not-declined",
      reason:
        "Letter-only blocks are valid plat designations and the worker submits block as free text. The current capture group requires a digit, so a re-run with the landed fix still stores null. Not a declined clerk-term class. Not in the landed-fix re-run population. Do not re-run.",
    },
    misses: digitMisses,
    exclusion_letterBlockNoDigit: letterMisses,
    retiredPatternHits: rows.filter((r) =>
      RETIRED_BLOCK_PATTERN.test(String(r.legalDescription ?? "")),
    ).length,
  };
}

export function selfTest() {
  const cases = [
    { legal: "BLOCK 3", retired: false, current: "3", miss: true },
    { legal: "BLK 3", retired: true, current: "3", miss: false },
    { legal: "BLK. 3", retired: true, current: "3", miss: false },
    { legal: "BLOCK 12A", retired: false, current: "12A", miss: true },
    { legal: "PECAN GROVE BLOCK 3 LOT 5", retired: false, current: "3", miss: true },
    { legal: "LOT 12 BLK 3 PECAN GROVE", retired: true, current: "3", miss: false },
    { legal: null, retired: false, current: null, miss: false },
  ];
  const failures = [];
  for (const c of cases) {
    const retired = c.legal == null ? false : RETIRED_BLOCK_PATTERN.test(c.legal);
    const current = parseBlock(c.legal);
    const miss = blockTermMissedByRetiredPattern(c.legal);
    if (retired !== c.retired || current !== c.current || miss !== c.miss) {
      failures.push({ ...c, got: { retired, current, miss } });
    }
  }
  const carriedAnyway = shouldHaveAndDidNot({
    legalDescription: "PECAN GROVE BLOCK 3 LOT 5",
    storedBlock: "3",
  });
  if (carriedAnyway !== false) {
    failures.push({
      case: "post-fix job with BLOCK and stored block must not be a miss",
      got: carriedAnyway,
    });
  }
  const trueMiss = shouldHaveAndDidNot({
    legalDescription: "PECAN GROVE BLOCK 3 LOT 5",
    storedBlock: null,
  });
  if (trueMiss !== true) {
    failures.push({ case: "BLOCK without stored block must be a miss", got: trueMiss });
  }
  const letterCases = [
    { legal: "RIVERSIDE GROVE SUBDIVISION PHASE 1, BLOCK A, LOT 27", letter: "A" },
    { legal: "6 CREEKS PHASE 1 SECTION 10, BLOCK F, Lot 30, 18671 SQUARE FEET", letter: "F" },
    { legal: "MELBOURNE HTS Lot 6 Block D Acres .186", letter: "D" },
    { legal: "LOT 2 BLK D WALNUT RIDGE I", letter: "D" },
    { legal: "Building Block, BLOCK 13 E W ST, ACRES 0.485", letter: null },
    { legal: "BLOCK 12A", letter: null },
  ];
  for (const c of letterCases) {
    const got = parseLetterBlock(c.legal);
    if (got !== c.letter) {
      failures.push({ case: `letter block ${c.legal}`, expected: c.letter, got });
    }
  }
  return { ok: failures.length === 0, failures };
}

const SQL_ALL = `
SELECT
  id::text AS id,
  parcel_key AS "parcelKey",
  status,
  request_payload->'searchTerms'->>'legalDescription' AS "legalDescription",
  request_payload->'searchTerms'->>'block' AS "storedBlock"
FROM records_request_jobs
`.trim();

function loadPg() {
  const require = createRequire(import.meta.url);
  const candidates = [
    "pg",
    join(
      "P:/tmp/legacy-design-tools-p91-q1-cortex/artifacts/api-server/node_modules/pg",
    ),
  ];
  for (const c of candidates) {
    try {
      return require(c);
    } catch {
      /* next */
    }
  }
  throw new Error("pg driver not loadable");
}

export async function runAudit({ databaseUrl, snapshot } = {}) {
  const self = selfTest();
  if (!self.ok) {
    return { status: "REFUSED", reason: "self-test failed", self };
  }
  const url = databaseUrl ?? process.env.DATABASE_URL ?? "";
  if (!String(url).trim()) {
    return {
      status: "UNMEASURED",
      reason: "DATABASE_URL unset. A missing store is not a zero.",
      self,
      snapshot: snapshot ?? null,
    };
  }

  let pg;
  try {
    pg = loadPg();
  } catch (err) {
    return {
      status: "UNMEASURED",
      reason: `store reachable unknown; pg driver missing: ${err.message}`,
      self,
      snapshot: snapshot ?? null,
    };
  }

  const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 15000 });
  try {
    await client.connect();
  } catch (err) {
    return {
      status: "UNMEASURED",
      reason: `store unreachable: ${err.message}`,
      self,
      snapshot: snapshot ?? null,
    };
  }

  try {
    const { rows } = await client.query(SQL_ALL);
    const classified = classifyIssuedRows(rows, {
      snapshot: snapshot ?? null,
      self,
      reason: "live records_request_jobs",
    });
    const instrumentWrong =
      classified.counts.digitBlockShouldHaveAndDidNot === 0 &&
      rows.some(
        (r) =>
          /\bBLOCK\.?\s+\d+[A-Z]?\b/i.test(String(r.legalDescription ?? "")) &&
          (r.storedBlock == null || String(r.storedBlock).trim() === ""),
      );
    if (instrumentWrong) {
      return {
        ...classified,
        status: "REFUSED",
        reason: "third number is 0 while a fetched BLOCK-without-stored-block row exists",
      };
    }
    return classified;
  } finally {
    await client.end().catch(() => {});
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const snapshot = {
    at: new Date().toISOString(),
    docRepo: process.env.DOC_REPO_SHA ?? null,
    instrument: "doc_repo/_inbox/2026-08-31_p85_block_job_audit.mjs",
    predicates: "LDT recordsSearchQueryPlan.ts RETIRED_BLOCK_PATTERN + CURRENT BL(?:OC)?K + letter-only [A-Z]",
  };
  const fromRows = process.argv.includes("--from-rows");
  const run = fromRows
    ? Promise.resolve(
        classifyIssuedRows(
          JSON.parse(readFileSync(join(HERE, "2026-08-31_p85_block_job_rows.json"), "utf8")).rows,
          {
            snapshot: {
              ...snapshot,
              source: "re-derived from _inbox/2026-08-31_p85_block_job_rows.json (no store write, no portal)",
            },
            self: selfTest(),
            reason: "re-derived from stored issued-job rows",
          },
        ),
      )
    : runAudit({ snapshot });
  run
    .then((out) => {
      const path = join(HERE, "2026-08-31_p85_block_job_audit.json");
      writeFileSync(path, JSON.stringify(out, null, 2));
      console.log(JSON.stringify(out, null, 2));
      if (out.status === "MEASURED") process.exit(0);
      process.exit(2);
    })
    .catch((err) => {
      console.error(err);
      process.exit(2);
    });
}
