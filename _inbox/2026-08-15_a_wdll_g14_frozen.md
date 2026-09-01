# WDLL: Lane A — Smart Files foundation (G-14 subset)
Date: 2026-08-15  Status: FROZEN at CP1
Plan rows: G-14, plus the lane A half of G-10
Repo: legacy-design-tools
Checkpoint that froze it: `_inbox/2026-08-15_a_cp1.json`

Derived as a SUBSET of `_inbox/2026-08-14_g09_wdll_lane_a_smart_files.md` (draft, ten items, five plan
rows). Items 1 through 5 carried; items 6 through 10 deferred to their own rows. The full disposition,
including the two straddle rulings, is in the CP1 artifact. This card is not edited after freezing;
drift is measured against it at close.

## Done looks like

A Smart Files artifact family exists in its own right, with a contract type and a store, and it is not a
rendering of the brokerage workspace family. A document is stored once and referenced from every place
it belongs, so placing it again adds a relationship rather than a copy. Revising it supersedes the prior
version without destroying it, and the prior version stays retrievable by version identity. Every
artifact the store serves carries its source, a computedAt and a servedAt stamp, and a STALE indicator
that has been proven able to fire and proven to stay silent when the artifact is fresh. Access policy is
a column on the record, resolved when the record is read. The entityId shape for the city-file node
class is written down before the first schema PR, not reconstructed from parts later.

This card covers the structural guarantee only. It does not make the doc 34 customer claims true on
their own; a corpus (G-44) and a served surface (G-53) are required for that, and this lane does not
deliver either.

## Items

1. **The entityId shape is DECLARED before the first schema is written.** A written record states the
   entityId shape for the city-file node class and the placement relation. The EXTEND-vs-SUPERSEDE
   verdict is NOT owed here: it is already ruled by A-012 (NEW family, does not extend
   `brokerage_workspaces`); what is owed is the shape A-012 does not state.
   | check: a decision record in `_decisions/` naming the entityId shape, cited by the first schema PR;
   `brokerage_workspaces.ts` absent from that PR diff. No shape reconstructed from parts anywhere in
   lane code (OPS-17:131 instrument, constraint 6).
   | grade: [ ] | depends on: nothing (blocks 2)

2. **The store schema carries the four columns the brokerage table provably lacks.** The Smart Files
   artifact table has `updated_at`, a version identity, a content identifier, and `access_policy` drawn
   from the five-value union.
   | check: the merged migration table definition read at source shows all four present and
   non-vestigial; a live schema read against the deployment database confirms the migration is APPLIED,
   not merely merged.
   | grade: [ ] | depends on: 1

   *Counting rule and basis:* baseline is
   `legacy-design-tools/lib/db/src/schema/brokerageWorkspaces.ts:54-76`, re-verified at source by this
   lane on 2026-08-15 against main at `10069854`: `brokerage_workspace_attachments` defines **8**
   columns (`id`, `workspace_id`, `kind`, `uri`, `body`, `title`, `created_by_install_id`,
   `created_at`) with a single `notNull` FK on cascade delete, and no `updated_at`, no `version`, no
   `cid`, no `access_policy`. Agrees with A-002 as corrected and with the draft card.

   *Layer distinction, established at CP1 and load-bearing here:* the four-column gap is a DATABASE
   fact, not a contract fact. The contract's `WORKSPACE_ATOM_METADATA_SCHEMA`
   (`hauska-atom-contract/src/workspace/common.ts`) already carries `did`, `createdAt`, `updatedAt`,
   and `accessPolicy`. Only version identity and content identifier are absent at both layers. A build
   that treats the contract as equally bare rebuilds what exists.

3. **A document placed in N locations is stored once, not N times.** Placement is a reference from a
   location to one stored artifact; the artifact row count does not rise when a document is placed
   again.
   | check: store one document, place it in three locations, then query the artifact table for that
   content identifier and get exactly one row while the placement relation returns three. Re-place a
   fourth time and confirm the artifact count is still one.
   | grade: [ ] | depends on: 2

4. **Revise once, current everywhere, prior version still retrievable.** A revision to a multi-placed
   document is current at every placement on the next read, and the superseded version remains
   independently retrievable by version identity.
   | check: on the same three placements — revise once, read all three and get the new version, then
   fetch the prior version by its version identity and get the pre-revision content. Nothing is
   destroyed by the revision.
   | grade: [ ] | depends on: 3

5. **Every served artifact carries source, computedAt, and servedAt, and the STALE indicator is PROVEN
   in BOTH directions.** This is the G-14 instrument verbatim (OPS-17:135) plus inherited spine
   constraint 4.
   | check: a read from the store read path returns all three fields populated and non-null. Separately,
   a backdate test drives the stamp past the freshness threshold and the indicator FIRES; and a fresh
   artifact leaves the indicator SILENT. Both directions asserted on the real exit code, never a pipe's
   exit code (DEV_PROCESS 2.2, 2.3). A one-directional test would pass a permanently-firing indicator.
   | grade: [ ] | depends on: 2

   *Straddle ruling, made deliberately at CP1:* the source card probed "the deployed serving path".
   This dispatch builds no surface and deploys nothing, so that reading is unsatisfiable in scope. The
   probe is re-pointed to the store read path. **Residual obligation, recorded not dropped:** G-53 must
   re-probe on the serving revision. A store-level pass here does NOT satisfy DEV_PROCESS 4.4, and this
   lane must not be read as having proven customer-visible freshness.

## Out of scope for this card, explicitly

Typed absence (G-34, source item 6). Bastrop document corpus capture (G-44, source item 7). Corpus
coverage counting (G-20, source item 8). Any deployed surface or live-probe grade (G-53, source item 9).
Sellability and collateral (G-53, source item 10). Any Smart Files UI. Lane B, C, D work. The
`brokerage*` rename and any brokerage refactor (backlog item 25; explicitly not lane A per A-012). Any
revision to doc 34's approved claims (fixed by A-003). `smartcity-os` in any form.

Auth and tenancy (G-11, S-1) gate real per-tenant ENFORCEMENT of `access_policy`. Item 2 requires the
COLUMN and item 5's read path requires resolution AT READ, not enforcement across tenants. That
enforcement gap is stated here rather than silently assumed closed.

## Amendments

- 2026-08-15: item 1 identity string. The city-file FIPS shape `smartfile:<jurisdictionFips>:<docSlug>` is reversed. The node class is the Smart Files MODULE, keyed `smartfile:<scopeType>:<scopeId>:<docSlug>` (OPS-17 A-015; `_decisions/2026-08-15_smart_files_module_identity.md`). Reason: operator correction that Smart Files is a spine module used across SmartCity, Smart Site, Mox/custom, and a la carte, not a city-only store. The check (a `_decisions/` record cited by the schema PR; no brokerage reconstruction) is unchanged. The three-table split and items 2-5 are unchanged.

## Finish card (graded at close)

1. met: entityId declared as `smartfile:<scopeType>:<scopeId>:<docSlug>` in `_decisions/2026-08-15_smart_files_module_identity.md` and in `smart-file.contract.ts` on main `015b15d6` (PR #432). Frozen-card item 1 amended 2026-08-15 (FIPS-only reversed). Brokerage absent from the PR diff.
2. met: live schema on cortex-prod `fancy-fire-06136146` / `neondb` at 2026-08-15T14:27Z. `_schema_migrations` has 0078 (14:27:09.389Z), 0079 (14:27:10.242Z), 0080 (14:27:10.446Z). `smart_file_documents` has `updated_at` NOT NULL, `access_policy` NOT NULL, `scope_type`/`scope_id` NOT NULL, `jurisdiction_fips` nullable. `smart_file_versions` has `version` and `content_cid` NOT NULL. Apply run https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/31889907009 conclusion success. CI fixture-drift on PR #432 SUCCESS.
3. met: CI Test job executed `smartFiles.integration.test.ts` (15 tests, 15864ms) including store-once on all three scopes. Not skipped.
4. met: same CI suite revise-once probes executed (not skip).
5. met at store path: G-14 STALE both-directions inherited; G-34 absence STALE 15 tests 15952ms executed. Residual G-53 serving-path probe unchanged. Serving cortex-api revision does not yet include #432.
