# `_state/govtech/STATE.md` update, prepared for the govtech seat

**Not written by the integration seat.** `scripts/enforcement/seat-worktree-gate.mjs` refuses any
`_state/<ns>/` write from integration (`namespace_from_integration`), and this seat did not route around
it. This file holds the content the govtech seat should apply at
`P:/seat-worktrees/govtech/doc_repo`, and write it into that seat's own `_state/govtech/STATE.md`.

**Why it is owed:** the file reads `Last updated: 2026-08-25T03:00Z` and describes the Wave 1 era
(deploy queue DEPLOY-7/39/75/361, ADR-023 amendment draft pending, `template-city` vs `icc-demo`). Three
weeks of OPS-17 state have landed since, including three closes today. Its board is not wrong so much as
superseded, and a fresh agent reading it would act on August state.

## Ready-to-paste blocks

### Header

```
**Last updated: 2026-09-18T21:35Z.** Namespace `govtech`. Branch `seat/govtech`. OPS-17 lanes B, C and D.
```

### Program state (replaces the Wave 1 blockers list)

```
## OPS-17 state, 2026-09-18

- **Tracker PASSES**, exit 0, 26/26 self-tests, 118 OPS-17 rows read, 364 closes. 32 rows tracked.
  M1 2/6, M2 4/6, M3 5/9, M4 4/6, M5 4/5.
- **The design gate now exits 1 by design.** A-159 changed R3 from "does a check.mjs exist" to "does it
  PASS", so `design-completion-gate.mjs` reports UNFINISHED with four R3 findings. A green gate is no
  longer the expected state and its absence is not a regression.
- **G-164 owns the 11 findings g148 disclosed.** One row, four designs (plan-review-departments 4,
  smartcity-flood-study 1, smartcity-map-dock 4, smartcity-overview-lens 2), the flood-study half blocked
  on G-125. G-164 is the only row between the design gate and exit 0.
- **G-165 is PROPOSED and not carded** (operator-ruled): the live vendor mapping, 102 of 102 live records
  refused by their declared shape, `operatorRef` 0 of 102. Proposal:
  `_inbox/2026-09-18_planner_g153_vendor_mapping_carding_proposal.md`.
- **g152 is RECOMPILED, verified canonical and READY TO HAND-CARRY.** Its precondition (a filed g153
  close) is met. `_dispatches/2026-09-18_g152-public-works-fire-ems_dispatch.md`, 26,848 bytes,
  CANON-PREAMBLE v49001500 / AGENT-CONTRACT v378cd643 / DEV-PROCESS vbb19bd34 / FLEET-MEMORY v2a98086b.
  Expect it to close CLOSED-PARTIAL at the same D-12 clause g153 did.
- **g163 queues behind g162**, which is now CLOSED-PARTIAL, so g163 is startable.
- **Design-vs-instrument ownership across all 18 instruments is UNESTABLISHED.** `--violate` REFUSES
  because `_design/exports/send/` holds 12 untracked PNGs. Not committed: doc_repo is public and the set
  includes finance and tax-filings boards. Unblocks when that directory is either tracked or ignored.
```

### Closes today (replaces the shipped-this-thread table where relevant)

```
## Closes filed 2026-09-18 (each regraded by the planner, each CLOSED-PARTIAL)

| lane | row | why not CLOSED |
|---|---|---|
| g148-design-instruments | G-148 | closed; disclosed 11 findings it did not fix, now owned by G-164 |
| g153-fleet-police-lens | G-153 | the row's done-when ends "reached on the DO app per D-12"; the app still serves the pre-fix build. PR #75 green and deliberately unmerged. Vendor mapping unowned |
| g160-served-commit-parity p2 | G-160 | both products' branches are UNPUSHED, so no scheduled run can have happened. Push, PRs and the deploy through scripts/deploy.mjs are owed to the integration seat. Note: parcel 1's CP1 was overwritten by parcel 2's CP1 at the same untracked path and is UNRECOVERABLE |
| g162-v1-finance-honesty | G-162 | defect 3's refusal is proven at ROUTE level only, never on a deployed surface. PR #60 open. |
```

### Standing hazards to carry

```
## Hazards, read at source this week

- **The `staging` smartcity-os database IS the production database** (g162's close). Until the mechanism
  is read at source, hand NO lane a "test against staging" instruction.
  `_inbox/2026-09-18_planner_g162_flag_and_staging_hazard.md`.
- **The two design dumps declare the bare /^OPR-\d{2}$/ form** while the code mints FL-OPR-nn and
  PV-OPR-nn, so a pre-lane instrument exits 2 against a recaptured dump BY DESIGN. Planner recapture
  owed.
- **A concurrent writer was active in the integration tree** during the 2026-09-18 evening session. Any
  seat working in `P:/doc_repo` should re-read before writing and expect another writer's uncommitted
  work to be present. `git log` is not sufficient to see it.
```

### Operator acts outstanding

```
1. Hand-carry g152 (ready now).
2. Rule on G-165 carding.
3. Rule on whether `_design/exports/send/` is tracked canon or outbound staging.
4. D-12 / M4 (4/6): the deploy path is what holds g153, g160, g162 and g152 at partial.
5. The MyGov fee report window, which g162 names as the binding constraint on its figures.
```

### Content to retire or mark historical

The Wave 1 blockers (`DEPLOY-7/39/75/361` as G-105, S3-1 as G-106, S4-6 as G-109, DOC-5 ADR-023
ratification, S1-17 `template-city` vs `icc-demo`), the `2026-08-25` execution-hardening section, and the
`Shipped this thread (code)` table should be moved under a dated historical heading rather than deleted
(retire via status flip, never delete, per `01_doc_conventions.md`). The `Rulings owed` list needs
`O-1`, `O-3`, `O-4` and `O-5a` checked against today's state, which this seat did not verify.
