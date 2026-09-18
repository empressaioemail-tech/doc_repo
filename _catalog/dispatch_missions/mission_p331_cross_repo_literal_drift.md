## Mission — P-331: a cross-repo pin that can fail on cross-repo drift

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` and `legacy-design-tools`, one PR
per repo, each from current `origin/main` with the SHA declared (map `b08f4b89`, LDT `2e7ca7c4` at
recompile, 2026-09-18 22:40Z; first compiled at map `163fde32`, LDT `25d1782f`). If a pinned literal lives in `hauska-factory`, a third PR there. You do not merge or deploy;
the integration seat does. Any doc_repo change is handed back as a diff in your close.

### What is wrong

hauska-map vendors LDT's resolvers rather than importing them, so shared customer-facing strings travel
as literals copied between repos. Each repo "pins" its copy with a test that compares its own constant
to a literal copied INTO THE SAME REPO:

- hauska-map `apps/property-explorer/api/_lib/setback-decline-wording.test.ts` (P-257: the
  planned-development pattern, its flags, the refusal sentence) and
  `apps/property-explorer/api/_lib/setback-citation-vintage.test.ts` (P-270: the vintage sentence).
- LDT `artifacts/api-server/src/lib/buildableEnvelope/plannedDevelopmentSetback.test.ts` (the same
  literals, "as hauska-map holds them"), against LDT's own `lib/cad-ingest/src/txgio/zoning-layers.ts`
  (~line 212).

A change in either repo with its own test copy updated passes both CIs. The values agree today (read
2026-09-18). The pins describe themselves as making drift impossible ("neither repo can drift alone");
that claim is false, and this row makes it true.

There are more of these than the row names. `envelope-verification-divergence.test.ts` in LDT holds a
"byte-identical copy of hauska-map" for `envelope-verification-v1`, and the P-257 map test says one of
its literals is P-256's `PUD_REFUSAL_REASON` from `parcels-setback-cells.mjs` in hauska-factory.

### What to build

1. **Enumerate every cross-repo literal pin** among the four repos first: every test or source comment
   that says it copies, pins or mirrors a value from another repo. A table: the literal, where it is
   defined, every copy, and which test asserts each copy. Grep is a start, not the answer; read the
   files it finds. Nothing gets a drift check until the list is complete.
2. **Each repo's CI reads the other's main** for the shared literals and fails on disagreement, with a
   `--selftest` run first. hauska-factory's `.github/workflows/ci.yml` already does this against LDT
   (`check-ldt-*-drift --selftest`, then the real comparison, against an LDT main checkout); copy that
   pattern. hauska-map and LDT are public, so neither needs a token. hauska-factory is private: the
   public repos cannot read it, so any literal defined in the factory is checked FROM the factory's CI
   against the public copies, and the other direction is named as a bypass.
3. **Read the literal, not a mention of it.** Extract the value from the defining module (import it or
   parse the exact declaration), never from a test's copy of it, and say how the extraction fails when
   the declaration moves or is renamed (it must fail, not skip).
4. **The existing same-repo pins** keep their tests or are replaced by the cross-repo check; say which
   and why. Do not leave both claiming the same thing with different strength.

### Verify by violation

Pre-register your falsifiers. For each shared literal: change it in one repo only (a scratch branch)
and show the other repo's check failing against it; change it in both and show both pass; rename the
defining constant and show the extraction fails loud. Run each drift check's `--selftest` and show it
failing when its fixture is corrupted.

### The three-question gate

Answer in your close: what executes each check, what triggers it (a push to either repo; say what
happens when one repo changes and the other does not push), what fails, and what bypasses it (a push
to one repo does not re-run the other's CI; the private factory's literals; a literal nobody listed).

### Constraints

- No merges, no deploys. Customer-facing strings do not change in this row; if you find two copies
  that already disagree, report it and stop on that literal rather than choosing a winner.
- Since first compile these MERGED and added cross-repo copies your table must include (read each at
  source; these are the seat's reading, not a complete list):
  - P-354 (map #421, LDT #720): `setbackFutureEffectiveNote`, `setbackFutureEffectiveCardMarker` and
    `SETBACK_CITATION_FUTURE_EFFECTIVE_TOKEN` in map
    `apps/property-explorer/api/_lib/setback-citation-vintage.ts` and LDT
    `artifacts/api-server/src/lib/buildableEnvelope/setbackCitationVintage.ts`, each saying
    "byte-identical" to the other; the two repos also read row dates with different strictness (map
    `isStrictIsoDate`, LDT `isComparableCalendarDate`), which the P-354 close names as three stances
    on one question. Report it; do not choose a winner.
  - P-270 (map #424, LDT #721): the address-line rule is written twice, map
    `apps/property-explorer/src/lib/situs-address.ts` `composeSitusLine` and LDT
    `artifacts/api-server/src/lib/situsCompose.ts` `appendMissingSitusComponents`, plus the probe's
    model in doc_repo `scripts/surface-probe.mjs` `composeAddress`. This is a shared RULE, not a
    literal: say how you pin it (a shared fixture table both suites run is one way) or name it as out
    of this row's reach.
  - P-339/P-341 (map #422) and P-353 (map #423) added sentences in map only; check whether LDT or
    the MCP composes the same sentences, and list them if so.
  - P-362 (LDT #722): `scripts/p279-tagged-revision-check.mjs` wraps `check-tagged-revision-env.mjs`,
    which `pr-checks.yml` already pins byte-identical to hauska-engine's copy. That pin is the working
    pattern; say whether it is enough.
  Rebase before you open for review, and add anything else merged since to your table.

### Close

Declare: the start commits and PRs, the full literal table, the checks with both directions shown, the
bypasses, the three-question gate answers, and `leave_behind`.
