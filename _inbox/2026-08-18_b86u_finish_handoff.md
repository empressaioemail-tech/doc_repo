---
id: 2026-08-18_b86u_finish_handoff
title: Handoff — finish G-86, run G-87, open G-88 design-into-apps
status: active
last_updated: 2026-08-18
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-18_b86_close,
    _inbox/2026-08-18_g86_previews_WDLL,
    30b_smartcity_design_system,
  ]
---

# Handoff to the credentialed seat

For a Claude Code seat that carries DesignSync, `gh` auth, `gcloud` auth and a browser session on
claude.ai. The Cursor planner seat carries none of those, which is why this is being handed over.

The paste-able prompt is the body of this file from "You are the lane planner" onward.

---

You are the lane planner on OPS-17 Lane B. Three legs, in order. Do not start leg 3 before leg 1 is
filed. You have credentials the previous seat did not; that is the only reason this is yours.

## Read first

1. `_STATE.md`
2. `90_operations/OPS-17_govtech_stack_plan_of_record.md` — rows A-062 through A-067
3. `_inbox/2026-08-18_b86_close.json` — the partial close you are completing
4. `_inbox/2026-08-18_g86_previews_WDLL.md` — the acceptance card you are re-grading
5. `_scratch/g86_design_sync.md` — six lessons, two dead-ends. Read before re-deriving anything.
6. `90_runbooks/AGENT_CONTRACT.md`, `90_runbooks/DEV_PROCESS.md`

Working clone `P:\tmp\g82v`, branch `g86/preview-cards-and-conventions`, clean.

## Verified state you inherit

The upload is DONE and reconciled: 417 of 417 in project `f5e5465e-943f-4f68-b52f-608925bc07b0`
(components 292, `_preview` 73, fonts 44, `_vendor` 2, 6 root files; `tokens/` and `guidelines/`
empty and correct). Sentinel first, nine content chunks, sentinel re-armed, `_ds_sync.json` last and
alone, no write failures, remote listed before the anchor was armed. Kit PR **#5** open, green, not
merged. Nothing committed anywhere.

Two findings carried, not acted on: the `[FONT_MISSING]` warn (shipped CSS names "Inter Variable"
and "Cascadia Mono", neither ships; Inter static and Plex Mono render correctly) and the
constraint-gate blindness that is leg 2.

## LEG 1 — close G-86. Paperwork only. Do it fast.

1. Merge kit PR #5. Squash. Operator has greenlit the merge; record the squash SHA.
2. Write `_inbox/2026-08-18_b86u_close.json`. Contract-specified path. Carry the 417-of-417 prefix
   table, the sequence you held, the squash SHA, and the two carried findings.
3. Re-grade WDLL item 5 to **met** in `_inbox/2026-08-18_g86_previews_WDLL.md` (finish card, and the
   `wdllRegrade` block of the new close). Its named check was "`list_files` component count rises in
   named batches; project URL returns the picker" — say plainly which half you observed. It was
   dropped for a tooling reason that no longer holds.
4. Amend OPS-17 with **A-068**: G-86 CLOSED FULL, item 5 re-graded met on the upload leg, PR #5
   merged at `<sha>`. Keep the existing column count; the table is 5 columns.
5. `_scratch/g86_design_sync.md`: convert the OPEN block to a GROUND-TRUTH with a UTC timestamp.
   An OPEN thread that is closed and left open is how the next context wastes a session.

Leave doc_repo **uncommitted** and list the files. Doc_repo commits are planner-owned.

## LEG 2 — G-87. Scoped at A-067, blocked on nothing.

`walk()` in `test/_lib.mjs` skips `.design-sync` at ROOT as `TOOL_OUTPUT_DIRS`, so
`constraints.test.mjs` scans neither `conventions.md` nor the 73 previews. A real vendor-brand
violation sat there with CI green.

Pass/fail instrument is the **injected-violation harness**, not a passing suite. A forbidden string
planted in `.design-sync/conventions.md` must turn `npm test` red and name the file; so must one
planted in a `.design-sync/previews/*.tsx`. Gate 4 must still not read converter output as
package-authored CSS — that false positive is why the skip exists, and re-opening it is the
failure mode here. `toolOutputSkipped()` must keep reporting whatever remains skipped; an empty
result is not an absence.

Prove both injections fire before you claim the gate works.

## LEG 3 — G-88. Design into the apps. This is what the operator actually wants.

**Scope it as G-88 in OPS-17 before you build.** Lane B. Housing: `smartcity-dashboards` primarily.

### The thing you must understand before you touch anything

The kit is React. **The products are not.** All three product repos are static `web/` plus a Node
server — no React, no JSX, no bundler, `pg` is the only dependency (verified, A-062). Claude Design
emits React that imports the kit. You cannot drop that into the apps.

You do not need to. The kit adds **zero styling** — gate 4 enforces that the package styles nothing,
and the vendored `sc-kit.css` and `shell.css` are byte-identical to the product's own by git blob
hash. Every kit component is a typed wrapper over classes that already exist in the shipping
stylesheet: 73 components covering 109 of 109 classes. So a design composed only of kit components
is, by construction, expressible as the exact class markup the product already serves.

The translation is therefore mechanical and lossless in one direction: **React composition of kit
components → static HTML with the same classes.** Do it that way. Do not adopt React in the
products; do not invent a build step; do not let a design ship a class that is not in the 109.

That last clause is the real gate. If a design needs a class that does not exist, the answer is to
ship the CSS in the product first and re-vendor, never to hand-write it into a screen.

### Order of work

1. **Ship the three missing CSS families into `smartcity-dashboards` first.** `mx*` (applicability
   matrix) and `cite` (code citation) are two of the five components 30b section 3.1 calls
   load-bearing, plus `atomchip` from 6.3. None has CSS in any shipped stylesheet. Until they ship,
   a design agent drawing Plan Review will invent all three, which is precisely the failure the
   wrapper exists to prevent. Carried as F-4 through two closes; it blocks the design pass, not the
   other way round.
2. **Re-vendor into the kit, rebuild, re-sync.** `npm run build`, `package-build`,
   `package-validate.mjs` exit 0, then DesignSync the delta. Sentinel first, `_ds_sync.json` last
   and alone, same discipline as the 417 upload. Wrap the three new families as components so the
   109-of-109 coverage claim stays true with a bigger denominator, and state the new denominator.
3. **Fingerprint `/shell.css` or give it cache headers.** It ships with no `cache-control` and no
   fingerprint, so a returning browser holds a stale stylesheet across every CSS deploy shipped so
   far. Every design change you land is invisible to a returning operator until this is fixed. Do
   this before the design pass, not after, or you will debug ghosts.
4. **Design the screens in the Claude Design project**, composed only of kit components.
5. **Translate to static `web/` markup and ship.** One PR per surface, not one mega-PR. Each PR
   states which classes it used and asserts none is outside the vendored stylesheet.
6. **Deploy and verify on the deployed surface.** A grade is a live probe, never a merged PR.
   Probe with GET; HEAD returns 404 on this service.

### Standing constraints that do not bend

Live Bastrop no-touch. No adapter grant; `grantedAdapters` stays empty. Do not start G-52. Do not
fill G-24. L26 untouched. No real city asserted as content — the template city and `empty-city` are
the fixtures. `permitflow`, `citizenconnect`, `leaflet`, `pipedrive`, `stripe.com` appear nowhere in
shipping files, not even inside a refusal guard: they are on the ABSOLUTE list and the carve-out
granted to `bastrop`/`chestnut` was deliberately withheld from vendors. Dark is the staff default,
set `data-theme="dark"` on the root, never `Theme mode="dark"` as a page provider.

Doc_repo commits are planner-owned. Deploys of product repos are yours to run; say so in the close.

### What "done" means for G-88

Write the WDLL before you build — this is sprint-scale and the WDLL rule applies. Numbered
acceptance items, each checkable by a specific observation, operator-approved before implementation.
At minimum it must include: the three CSS families shipped and wrapped, the stylesheet cache
problem fixed and proven with a returning-browser probe, every shipped screen using only vendored
classes with that asserted by a test rather than by prose, and the deployed surface walked.
