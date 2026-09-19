/**
 * P-270 CITY HALF — THE P-331 PIN ROWS, READY TO PASTE (2026-09-19).
 *
 * WHY THIS IS A SEPARATE COMMIT FROM THE DECLARATIONS. A row in
 * `scripts/check-cross-repo-literal-drift.mjs` reads the SIBLING'S MAIN. Rows
 * shipped in the same pair of PRs that introduces their declarations therefore
 * exit 2 (REFUSE — never a pass, but a required check) on both PRs before
 * either merges, and on whichever repo merges first afterwards. That is a red
 * no single merge can clear. The declarations landed first (hauska-map #426 /
 * legacy-design-tools #727); these rows land in a follow-up commit pair, ONE
 * COMMIT PER REPO, once both declarations are on both mains.
 *
 * PRECONDITION, checkable in one command each:
 *   git -C <hauska-map> show origin/main:apps/property-explorer/src/lib/situs-address.ts | grep -n "export type SitusCityBasis"
 *   git -C <legacy-design-tools> show origin/main:artifacts/api-server/src/lib/situsCompose.ts | grep -n "export type SitusCityBasis"
 * Both must print a line. If either does not, the declarations are not on both
 * mains yet and this commit MUST NOT be pushed.
 *
 * The rows below were PROVEN before landing, not after: on a trial copy of the
 * check carrying them, run against both lane worktrees —
 *   23/23 literals PASS both directions (exit 0), and four falsifiers fire:
 *     - LDT basis member renamed  -> FAIL, names situs-city-basis-vocabulary
 *     - LDT verdict word renamed  -> FAIL, names declared-absence-verdict
 *     - map status word renamed   -> FAIL, names city-limits-incorporated-status
 *     - declaration renamed       -> REFUSE exit 2, names the row (never a skip)
 * The unmodified check agrees 20/20 both directions, and the two copies of the
 * check are byte-identical (sha256 7bbbab6e, 34654 bytes CRLF-normalised).
 *
 * ============================ STEP 1: FILE TABLES ============================
 *
 * In `const MAP_FILES = {` add exactly this line (it is the declaration home on
 * the map side, and the file exists on hauska-map main today):
 */
const MAP_FILES_ENTRY = `  situsAddress: "apps/property-explorer/src/lib/situs-address.ts",`;

/**
 * In `const LDT_FILES = {` add exactly this line (the declaration home on this
 * repo's side; the file exists on legacy-design-tools main today):
 */
const LDT_FILES_ENTRY = `  situsCompose: "artifacts/api-server/src/lib/situsCompose.ts",`;

/**
 * ============================== STEP 2: THE ROWS =============================
 *
 * Append these three objects as the LAST entries of `const LITERALS = [`, in
 * the order below. `MAP_FILES`/`LDT_FILES` here are LOCAL stand-ins for the two
 * constants in the check whose keys STEP 1 adds; the row objects are pasted
 * verbatim. No other change is needed: both declaration files exist on both
 * mains already.
 */
const MAP_FILES = { situsAddress: "apps/property-explorer/src/lib/situs-address.ts" };
const LDT_FILES = { situsCompose: "artifacts/api-server/src/lib/situsCompose.ts" };

const ROWS = [
  {
    id: "situs-city-basis-vocabulary",
    kind: "union",
    name: "SitusCityBasis",
    map: { file: MAP_FILES.situsAddress, why: "the one declaration in hauska-map" },
    ldt: { file: LDT_FILES.situsCompose, why: "the one declaration in legacy-design-tools" },
    value: "cad-roll | city-limits",
  },
  {
    id: "declared-absence-verdict",
    kind: "const",
    name: "DECLARED_ABSENCE_VERDICT",
    map: { file: MAP_FILES.situsAddress, why: "the word the licence keys on" },
    ldt: { file: LDT_FILES.situsCompose, why: "the word the licence keys on" },
    value: "absent-verified",
  },
  {
    id: "city-limits-incorporated-status",
    kind: "const",
    name: "CITY_LIMITS_INCORPORATED_STATUS",
    map: { file: MAP_FILES.situsAddress, why: "the status the licence keys on" },
    ldt: { file: LDT_FILES.situsCompose, why: "the status the licence keys on" },
    value: "incorporated",
  },
];

/**
 * A comment beside the rows, in the table's own voice:
 *
 *   // P-270 CITY HALF (2026-09-19). The vocabulary the situs-city licence
 *   // stamps and the two words it reads. Declared under these NAMES on both
 *   // sides for exactly these rows. The probe's copy of the rule (doc_repo
 *   // `scripts/surface-probe.mjs`) is a THIRD repository's copy and is outside
 *   // the pair this check can read: named, not pinned.
 *
 * ========================= STEP 3: SPARSE CHECKOUTS ==========================
 *
 * Already done in this lane's PRs (both paths exist on the sibling main today,
 * so the lines are inert until the rows land):
 *   - hauska-map `.github/workflows/cross-repo-literal-drift.yml`, the LDT sparse list:
 *       artifacts/api-server/src/lib/situsCompose.ts
 *   - legacy-design-tools `.github/workflows/cross-repo-literal-drift.yml`, the map sparse list:
 *       apps/property-explorer/src/lib/situs-address.ts
 *
 * A row added to a table WITHOUT the sibling's path in the sparse list REFUSES
 * (exit 2, REMOTE_UNREADABLE) rather than passing vacuously — so if a future row
 * is added without its sparse line, the failure is loud, not silent.
 *
 * ============================== WHAT IS NOT PINNED ===========================
 *
 * The rule has THREE copies: hauska-map `applyCityLimitsSitusLicence`,
 * legacy-design-tools `resolveSitusCity`, and the probe's
 * `addressCarriesLedgerLine` in doc_repo. This pin covers the first two. The
 * probe's copy lives in a third repository that P-331 does not read; it is
 * watched by its own self-test (`--self-test`, 321 checks, both directions of
 * the licence: FIRES on an unlicensed city, PASSES the licensed pairing,
 * UNMEASURED where no ledger city exists), and by the live run recorded in this
 * lane's CP2. Named, not pinned — and named in the check's header too.
 */
export { MAP_FILES_ENTRY, LDT_FILES_ENTRY, ROWS };
