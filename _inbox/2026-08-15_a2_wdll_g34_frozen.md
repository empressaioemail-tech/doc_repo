# WDLL: Lane A — typed absence on the Smart Files store (G-34)
Date: 2026-08-15  Status: FROZEN at CP1
Plan row: G-34
Repo: legacy-design-tools
Checkpoint that froze it: `_inbox/2026-08-15_a2_cp1.json`

Item 6 of the ten-item source card (`_inbox/2026-08-14_g09_wdll_lane_a_smart_files.md`) is CARRIED
FORWARD here, not re-authored. The G-14 card at `_inbox/2026-08-15_a_wdll_g14_frozen.md` is frozen and
is not edited by this dispatch; it deferred items 6 through 10, and this card takes only item 6. Items
7, 8, 9 and 10 (corpus capture, coverage counting, surface deployment, sellability) stay deferred to
G-44, G-20 and G-53.

What was carried, stated exactly: the source card's item 6 asked that a document the store does not
hold return a typed, provenanced absence rather than a null, that only a positive determination write
an absence, and that a verified absence be renderable as a real answer. All three are items 1, 2 and 3
below. Nothing in item 6 was dropped. What was ADDED beyond it, and why, is item 4 (the version-axis
absence, from finding F-A2-CP1-2 read at source) and item 5 (freshness on the absence path, which the
dispatch names explicitly).

This card is not edited after freezing; drift is measured against it at close. It is a WDLL card, not
an acceptance card.

## Done looks like

The Smart Files read path can no longer hand a caller a bare null. Every outcome it returns is a named
state, and every not-held state carries the basis for its own claim. A document we looked for and
positively determined is not there reads as a real answer with its citation, distinct in the type
system from a document we have never looked for and from a lookup that failed on us. A caller who asks
for a version we do not have is told that, rather than being told the document is missing. Absences
carry the same freshness stamp positives do, because a verified absence decays exactly like a verified
presence, and that stamp is proven able to fire and proven to stay silent on both paths. Nothing in the
system can turn an empty query result into a recorded absence.

This card covers the read-path contract only. It does not put any document into the store (G-44), does
not count coverage over a corpus (G-20), and does not serve anything to a customer (G-53). Nothing here
satisfies DEV_PROCESS 4.4.

## Items

1. **The read path cannot express a bare null, and the type enforces it.** The absence is TYPED: a
   discriminated union whose every member names a state, with no null member and no undefined member.
   | check: the declared return type of the store read path contains no `null` and no `undefined`;
   a test asserts every returned shape carries a discriminant. Attempting to return a bare null from
   the read path is a COMPILE error, demonstrated rather than asserted — the typecheck must actually
   fail on real exit code when a null return is introduced.
   | grade: [ ] | depends on: nothing

2. **Every absence carries its BASIS, and "not found" is not a basis.** An absence states why it is
   not held, not merely that it is not held.
   | check: every non-held member of the union carries a basis field that is structurally required
   (not optional, not nullable-with-a-default); a test asserts a basis-less absence is rejected. For
   the recorded-determination case the basis is REQUIRED AT THE DATABASE by a check constraint, not
   only in application code, mirroring the spine's `absence_basis` treatment
   (`countyFacetCoverage.ts:154-158`).
   | grade: [ ] | depends on: 1

3. **Only a POSITIVE determination produces a recorded absence; an empty lookup cannot.** This is the
   inherited spine constraint that killed a defect class, and it must be STRUCTURAL, not disciplinary.
   | check: reading an entityId with no document row and no determination row returns the
   never-looked state, NOT the verified-absent state. A test asserts this directly. Separately: no
   code path constructs the verified-absent verdict from a zero count — the verdict is read from a
   row that something deliberately wrote, and a test asserts the never-looked read wrote nothing.
   | grade: [ ] | depends on: 2

4. **A held document with an unheld version is distinguished from an unheld document.** The two
   `return null` sites in the G-14 store (lines 307 and 322) return the identical value for two
   different facts; they must stop doing so.
   | check: reading a held document at a version that does not exist returns the version-absent state
   and still carries the document's identity; reading an entityId with no document at all returns a
   document-level state. The two are asserted to be different discriminants in one test.
   | grade: [ ] | depends on: 1

   *Basis:* finding F-A2-CP1-2, read at source on `origin/main@7bb79248`. The G-14 header named only
   the document-missing case; this second conflation was found by reading the code, not the header.

5. **The STALE indicator is proven in BOTH directions on BOTH paths.** Re-verify the G-14 property
   still holds on the present path, and extend it to the absence path, because a verified absence
   decays exactly like a verified presence.
   | check: on the PRESENT path, the existing both-directions property still holds (fires on a
   backdated stamp, silent on a fresh one). On the ABSENCE path, a determination backdated past the
   threshold FIRES and a recent determination stays SILENT. All four assertions on the REAL exit code,
   never a pipe's. Additionally MUTATION-TESTED: forcing the indicator to a constant must FAIL the
   suite on real exit code 1, in both the always-true and always-false directions — per the G-14
   finding that a fire-only test passes a permanently-firing gate, and DEV_PROCESS 2.2 that a gating
   indicator is tested for its ability to fire before it is trusted.
   | grade: [ ] | depends on: 1, 3

   *Straddle ruling, made deliberately at CP1 and inherited from G-14's:* this dispatch builds no
   surface, so the probe is on the STORE read path, not a deployed serving path. **Residual
   obligation, recorded not dropped:** G-53 must re-probe on the serving revision. A store-level pass
   does NOT satisfy DEV_PROCESS 4.4, and this lane must not be read as having proven customer-visible
   freshness or customer-visible absence.

6. **The contract-promotion call is RECORDED, either way.** OPS-17 A-013 set the criterion as "when
   G-34 closes"; the dispatch requires a decision, not a preference.
   | check: the close carries an explicit promote / do-not-promote verdict with reasoning. If promote:
   what promotion REQUIRES is named, given the repo consumes a vendored 1.6.0 tarball rather than the
   published package (backlog item 27), so it is not a version bump. If do-not-promote: what is still
   moving and what would settle it. The promotion itself is NOT performed in this dispatch.
   | grade: [ ] | depends on: 1, 2, 3, 4, 5 — the call cannot honestly be made before the shape is
   built, which is why the criterion was set at this row.

## Out of scope for this card, explicitly

Applying migration 0078 (operator HOLD, OPS-17 A-014) and applying any migration this lane authors.
Any migration run against any deployment database. Corpus capture (G-44). Coverage counting (G-20).
Any deployed surface, live-probe grade, or sellability claim (G-53). Any Smart Files UI or collateral.
The contract promotion itself (decided and recorded here; performed elsewhere). Lanes B, C and D. The
`brokerage*` rename and any brokerage refactor (backlog item 25). Any revision to doc 34's approved
claims (fixed by A-003). `smartcity-os` in any form. Closing G-14 — this dispatch does not close it.

Auth and tenancy (G-11, S-1) still gate real per-tenant ENFORCEMENT of `access_policy`; unchanged by
this row and not silently assumed closed. An absence is resolved and returned with its access policy
like any other read, and enforcement across tenants remains gated.

## Amendments

(none; frozen at CP1 on 2026-08-15)

## Finish card (graded at close)

(not graded; build not started)
