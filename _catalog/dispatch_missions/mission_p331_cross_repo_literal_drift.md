## Mission — P-331: a cross-repo pin that can fail on cross-repo drift

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` and `legacy-design-tools`, one PR
per repo, each from current `origin/main` with the SHA declared (map `163fde32`, LDT `25d1782f` at
compile). If a pinned literal lives in `hauska-factory`, a third PR there. You do not merge or deploy;
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
- Other lanes are in flight in both repos this wave: P-339 to P-341 (surface agreement), P-353 (Find
  box), P-270's address half and P-354 (Georgetown dates) may add shared literals. Rebase before you
  open for review and add any new shared literal they introduced to your table.

### Close

Declare: the start commits and PRs, the full literal table, the checks with both directions shown, the
bypasses, the three-question gate answers, and `leave_behind`.
