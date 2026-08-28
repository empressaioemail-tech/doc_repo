---
title: Smart Site chrome v2 — implemented and deployed
date: 2026-08-27
type: session
seat: integration
status: active
last_updated: 2026-08-27
repos: [hauska-map]
plan_row: n/a (operator-directed design drop, outside OPS-16 / OPS-17 rows)
---

# Smart Site chrome v2 — implemented and deployed

Operator handed over a design drop at `P:/tmp/Smart Site rebrand project (9)/smart-site-chrome-v2`
(README, SPEC, a v2 token file, five interactive reference sheets) and asked for
all of it implemented and deployed, with the animation included, without
colliding with lanes in flight.

## Snapshot

Repository `hauska-map`, branch `seat/property-chrome-v2`, from `f79b1ef`.
Merged as **#260** at **`65be567`**. Deployed to production Vercel as
**`dpl_7yNr4E7rbPKxAYFoVEt5y9kvgF2Y`**, aliased to **smartsite.cloud**.

Worktree `P:/seat-worktrees/property/hauska-map-chrome`, registered as the sixth
hauska-map worktree under the property seat.

## Collision avoidance

Five lanes already hold `apps/property-explorer` checkouts: `fix/pe-pricing-a2`,
P-85 records, P-86/87/88 ai, F-04 factory console, F-07 publish. A whole-app
restyle committed onto any of them would have been unrecoverable. A dedicated
registered worktree was cut instead, and only one PR was open on the repo
(a stale #183), so the merge was uncontended. Base was re-verified as unmoved
(`f79b1ef`) at merge time.

The seat-worktree gate refused the first attempt at an unregistered path under
`P:/tmp` — the control working. Registering the lane was the fix, not
`SEAT_GATE_OVERRIDE`. The gate was then verified in both directions: allowed on
`seat/property-chrome-v2`, refused with `branch_mismatch` on `main`.

## What shipped

Tokens (v2 `--ss-*` vocabulary plus a legacy alias layer so unported surfaces
move with no edit), primitives, the rail and dock chassis, find bar, inspect
card, the seven tool bodies, map chrome, pricing, checkout, cold open, and the
motion system — one curve, four durations, panels opening their own height while
scaling 3% from their anchored corner, with `prefers-reduced-motion` keeping the
fade and dropping the rest.

Full detail, including every refusal with its reason, is committed with the code
at `apps/property-explorer/docs/smart-site-brand/v2/IMPLEMENTED.md`. It is the
document to read, not this one.

## Ruling taken this session

**SPEC section 2 multi-dock stacking with fold-to-header in a left column was
DECLINED** (operator, 2026-08-27). One tool open at a time and the right-hand
dock stay; the `workbench.test.tsx` guards written to stop multi-open returning
stay armed. Everything else in that section landed. Do not re-raise without a
new ruling. Recorded as a decision at
`_decisions/2026-08-27_smartsite_chrome_v2_one_dock_ruling.md`.

## New control

The drop's hardest rule — gold is the brand mark and nothing else — existed only
as prose, and prose fails nothing. `apps/property-explorer/scripts/pe-chrome-kit-gate.mjs`
now refuses gold as a colour outside the four files allowed to draw the mark.

- **What executes it:** the gate script, via `pnpm --filter property-explorer test`.
- **What triggers it:** the Property Explorer CI `test` job, on every pull request
  touching `apps/property-explorer/**`.
- **What fails:** non-zero exit fails the job.
- **What bypasses it:** a push that skips PR CI, or a gold value assembled by
  string concatenation rather than written literally.
- **Verified by violation:** a gold constant planted in `ShareTool.tsx` made the
  gate exit 1 naming that file; removing it returned exit 0. Eleven self-tests
  run first, covering both directions including a not-vacuous case.

## Findings for the systems seat (not mine to fix)

1. **Two controls deadlock for the integration seat.** The dirty-tree close gate
   refuses a push while `_state/<seat>/STATE.md` is dirty and tells you to commit
   it; the seat gate then refuses integration writing any seat namespace. The
   dirty edits in this case were the F-10 lane's uncommitted work sitting in the
   integration checkout, and the push in question carried only
   `_catalog/seat_register.json` — no state doc at all. The gate fired on a
   condition the push did not create, which is the over-broad-scope defect
   ENFORCEMENT names as worse than a narrow one, and it is what pushed this
   session to the hatch. Used `CLOSE_OVERRIDE=1` twice, both logged.

2. **The per-seat override logs are untracked.** `_catalog/override_logs/README.md`
   is tracked; `integration.log` and `unknown.log` are not, and are not
   gitignored either — simply never added. The README says missing rows are a
   finding rather than a block, which is a deliberate choice, but an untracked
   log means the rows exist on one machine and nothing counts them across the
   fleet. That is the visible-counting requirement the doctrine attaches to a
   hatch that does not block.

   Method note: the first read of this went to `_catalog/dispatch_overrides.log`,
   whose last row is 2026-08-20, and briefly read as "the hatch did not log at
   all". It did log — to the per-seat file. Reading the proxy instead of the
   authoritative record, corrected before it reached a conclusion.

## Verification

- `tsc --noEmit` clean; `vite build` clean at 231 modules.
- Suite 1844 passed / 1 failed locally. The one failure, `pe-llms-txt.test.ts`,
  reproduces on a clean stashed tree (`\r\n` vs `\n` on a Windows checkout) and
  is not from this change. It passes on ubuntu CI, where all three checks were
  green before merge.
- Live verification against the served surface, not the CLI exit code: the live
  bundle hash matches the local build exactly (`index-D-mFJg7X.css` /
  `index-e8tZujTl.js`, replacing `index-Cpzurbow.css` / `index-DGFULALu.js`); all
  nine `ss-*` keyframes, the `--ss-*` tokens, the legacy aliases resolving to
  them, the reduced-motion block and the map-control restyle are present in the
  served CSS; gold appears exactly once. `/` 200, `/llms.txt` 200,
  `/api/pe-who-serves` 200, `/api/pe-geocode` 200.
- The diff touches no API, server, or config file — the only non-`src` change is
  the CI gate script — so the 403 and 400 responses seen while probing guessed
  endpoint shapes are the anonymous proxy's own allowlist, not regressions.

## Owed to the operator

A visual pass on the live site. Everything above is code-done and
instrument-verified; none of it is a person having looked at the screen, and
`CODE-DONE != CUSTOMER-DONE` is a standing decision.
