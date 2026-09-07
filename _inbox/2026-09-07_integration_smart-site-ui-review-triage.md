---
lane: integration
plan_row: P-122
item: "Smart Site UI review (P:\\tmp\\smart site review 9-4.pdf, 2026-09-04) triaged into UI-only work for the new hauska-map-ui-qa lane, plus non-UI/non-report items routed elsewhere."
checkpoint: "PAUSED at a natural stopping point 2026-09-07, all six batches worked in order. Closed/merged or verified-green-pending-merge: Batches 1, 2 (except 1 unreproducible item), 4 (except 1 held item), 6 (except 1 flagged idea). Batch 3 mostly closed, 2 items routed cross-thread. Batch 5 (Sharing) fully held, three real architecture findings, no code written. Five items outstanding with the operator: Batch 4's 5th boilerplate message, the Stripe cancellation reframe, and Batch 5's three findings (notes-default rule, checkbox-lag exception, share-flow notes scope). P-122 filed in OPS-16 by doc-repo-6f (cross-roadmap coordinator)."
date: 2026-09-07
---

## Source and scope

Source: `P:\tmp\smart site review 9-4.pdf` (operator review notes, dated 9-4-2026),
text-extracted to `P:\tmp\smart_site_review_9-4.txt`. The source doc mixes three
distinct threads: a general product/UI review, a "qa for the reports" section
addressed to whoever owns report QA (X-ray/dossier PDF, Flood & Drainage PDF), and
a functional/backend QA checklist for already-merged work (A-062, P-101, P-100,
P-106). This triage separates all three. Only the batches below (strictly UI,
nothing to do with report content or generation) are in scope for the
`hauska-map-ui-qa` lane.

Explicitly out of scope for this artifact and not duplicated here: the "qa for the
reports" section (X-ray/dossier PDF visual pass, Flood & Drainage PDF, the
envelope-refuse spot check, the X-ray-through-the-UI walkthrough) — source doc
lines ~140-196. That belongs to whoever owns report/backend QA, not this lane.

## UI QA lane punch list (hauska-map-ui-qa, branch seat/property-ui-qa)

Rule for every batch below, same as the lane's standing mission: if a fix traces
back to a data or backend problem rather than the UI layer, stop and report it to
the integration seat instead of fixing it.

**Batch 1 — Global chrome and copy**
- Remove em dashes across the entire platform (stated as a standing global rule,
  found violated repeatedly below). CLOSED 2026-09-07 for prose/copy em dashes,
  `hauska-map` PR #364, CI verified green live via `gh` (Property Explorer CI,
  Command Center CI, Typecheck, Source encoding all SUCCESS; 94 files changed).
  `cente-7d` split the sweep across 4 background subagents by directory (91
  files touched), caught and reverted one subagent's overreach (86
  command-center conversions of a distinct "—" placeholder-glyph convention that
  should not have been touched), fixed 8 test assertions that expected the old
  em-dash copy, and re-merged origin/main mid-work (picking up #363 and #365)
  before reverifying green. Deliberately skipped `SignUpCard.tsx`,
  `PricingModal.tsx`, and the `ExplorerMap.tsx` paywall context line, which get
  full rewrites in Batch 6.

  Two questions surfaced, ruled 2026-09-07 by the operator via doc-repo-6f:
  1. The "—" placeholder-glyph convention itself (~90+ uses, e.g.
     `lib/pricing.ts`'s `notIncluded: "—"` paired with `included: "✓"` on the
     pricing comparison table, plus numeric-field fallbacks across
     InspectCard/SitePlanExportSection/TerrainExportSection/CompareTool and a
     records-request "no date" default). RULED OUT OF SCOPE: it's a symbol, not
     prose; the no-em-dash rule is about writing style. Closed, no work.
  2. `apps/property-explorer/src/lib/buildable-display-vocab.ts` has 9 genuine
     user-facing em dashes (X-ray/PDF label text) but is byte-identical-locked
     against a `hauska-engine` file by a SHA256 parity fixture
     (`buildable-display-vocab.parity.test.ts`) — a cross-repo change, correctly
     not touched by this lane. RULING: contended across three threads (this
     lane, P-120 item 5, the P-121 atom program); doc-repo-6f is sequencing the
     order. Keep not touching it until that sequencing comes back. Two more
     same-convention files inside hauska-map itself (`lib/sheet-to-card-model.ts`,
     `lib/baked-facets.ts`) are fixable in-repo but need a coordinated
     multi-file pass against several exact-match tests, not a one-line edit;
     still unsequenced.

  Separately found while checking question 1, not this lane's item: a
  dash-as-sentinel defect in `records-chat-context.ts:47` (a display glyph used
  as a data value, recovered by string comparison) — real, PARKED by operator
  ruling, recorded in `90_operations/OPS-20_thread_coordination_index.md` so it
  is not rediscovered as new. Explicitly not dispatched to anyone; not this
  lane's file or scope regardless.
- Standardize button styling: some buttons show a glass/translucent treatment,
  others a dark background. Make all of them the dark-background style. CLOSED
  2026-09-07, ruling `_decisions/2026-09-07_button_fill_translucent_to_solid.md`,
  `hauska-map` PR #364, CI verified green live via `gh` (test, typecheck, source
  encoding all SUCCESS). Covers `Button.tsx` primary/subtle variants (translucent
  wash to solid PE.raised fill) plus an outlier found outside the shared
  component: `PdfViewer.tsx` had its own hand-rolled download link hardcoding the
  same old translucent values, now matches.
- Help bubble: grey background, smaller size. CLOSED 2026-09-07, same PR #364.
  Root cause: the one bubble in the app hardcoded to 48px/20px glyph instead of
  the shared 40px `--ss-bubble` token every other rail bubble uses; also
  explains the "looks white/glassy" complaint, which was bright map-tile
  imagery showing through a 3% translucent fill, not actually grey. Verified via
  Playwright before/after screenshot, now a solid dark grey circle.

**Batch 2 — Map, search, layers**
- Layer controls: hovering shows unwanted "add dot" background-info popups;
  remove. RULED 2026-09-07: GO on `cente-7d`'s recommendation. The dot's hover
  behavior for "ok"/"info" tone is deliberate and named in-repo
  (`ExplorerMap.tsx:1786`, ruling WB7c: "info tone = quiet, tooltip-only, panel
  stays clean") and carries real content (the saved-properties pin-color legend,
  layer-absence explanations) with no replacement surface if just deleted. It's
  rendered as a native unstyled browser `title` tooltip, which is genuinely
  ugly and is also wired to the whole row `<label>`, not just the dot, so it
  fires on incidental mouse movement. Fix: swap the native `title` for the
  app's own existing on-brand tooltip component (`MapFlyTip`, already used
  elsewhere in the same file) and scope the trigger to just the dot. Operator's
  original objection was to how it looks and how easily it fires, not to the
  information existing, so WB7c's intent is preserved. Not yet implemented,
  cleared to proceed.
- Search bar: selecting a property then searching a second one zooms in behind the
  subject bar (stacking/z-index bug). STILL HELD 2026-09-07: `cente-7d` cannot
  reproduce this at all in the current dev setup (search runs through
  `/api/pe-geocode`, which doesn't run under plain `vite`), read the z-index
  table (`packages/map-renderer/src/chrome/panelLayering.ts`) and found no
  obvious defect. Declined to guess-fix without reproduction. See lane-setup
  note below on the `vercel dev` path now confirmed available.
- Zoom +/- buttons work; the arrows underneath them do not. CLOSED 2026-09-07,
  not actually broken: drag-to-rotate/tilt works fine, but the app's blanket
  icon-desaturation filter was crushing MapLibre's two-tone compass-needle SVG
  to flat grey, reading as two dead buttons. Fixed with a filter scoped to just
  that icon, `hauska-map` PR #367.
- AI chat panel: opening it while the report section is open stacks it visually so
  it doesn't read as open; user has to manually scroll to the top to use it.
  CLOSED 2026-09-07, PR #367. Dock stack ordering was already correct; nothing
  scrolled the column back to the top when a new dock opened, so it landed
  off-screen if the user had scrolled down. Added a scroll-to-top effect on
  new-dock-open.
- Address search: typing a real street address lands on the correct parcel but the
  page header shows/labels a parcel number instead of the street address. CLOSED
  2026-09-07, PR #367, real root cause not a copy tweak: `cardFromSheet`
  correctly nulls the address when the county record has none (honest absence),
  but that null was overwriting a strictly better value already in hand (the
  geocoder-confirmed typed address, or the live-GIS feature's own address on a
  map click). Fixed both call sites to keep the known-good address as the
  heading only; no fact row anywhere reads it, so nothing about county-data
  honesty changed. Unit-tested (6 cases), can't drive a real e2e search in this
  backend-less dev setup.

  Batch 2 is CLOSED except the search-bar item above (held, unreproducible).
  `hauska-map` PR #367 (branch `seat/property-ui-qa-batch2`) bundles the
  compass/dock/address fixes with three Batch 3 items below on one branch/PR;
  title accurately describes both parts, so the "title matches diff" rule
  holds even though this crossed a batch boundary. CI verified green live via
  `gh` (Command Center CI, Property Explorer CI, Typecheck, Source encoding all
  SUCCESS), not yet merged as of this note.

**Batch 3 — Pricing / plan selection flow**
- Pricing toggle defaults to Monthly when Annual is the intended default
  presentation. CLOSED 2026-09-07, PR #367, one-line fix at the actual default
  constant.
- Every included-row in the comparison table renders two check glyphs instead of
  one. CLOSED 2026-09-07, PR #367 (was an icon plus a literal "✓" character;
  now one, matching every other cell kind's icon+text pattern).
- Solo annual: no "2 months free" messaging shown anywhere after purchase.
  CLOSED 2026-09-07, PR #367. All three tiers work out to exactly 2 months free
  annually by construction; the claim is now derived from each tier's own
  configured prices (fails to null rather than asserting a wrong claim if the
  numbers ever drift) and shows under all three tiers instead of only Team's
  old cryptic "10 × monthly" note.
- No visible "Solo" plan tier in the flow; only a 30-day property-unlock option
  surfaces, a confusing entry point into pricing. FOUND, NEEDS A PRODUCT CALL
  2026-09-07, not a bug fix. Real and structural: the full 3-tier Plans modal
  (Settings > Plan > View plans) already shows Solo correctly, but the direct
  "Unlock this property" paywall path, the one most people hit first, only
  ever shows the $15/30-day option. Dead code found in `pricing.ts`
  (`propertyChoiceLabel`/`soloChoiceLabel`, commented "the two-choice unlock
  flow") that's never called from any screen — a two-choice step was designed
  but never built. Needs Nick to choose: build the two-choice step, add a
  "Solo instead" link to the existing unlock modal, or something else.
- "Start Solo plan" button doesn't work. ROUTED 2026-09-07 to `doc-repo-2c`
  (billing backlog owner) via doc-repo-6f, possibly its own lane rather than an
  append. Not this lane's work from here; do not chase if it resurfaces, route
  to doc-repo-6f instead. Root cause candidate, found by doc-repo-6f: NOT the
  tempting `api-server` checkout route enum mismatch (`tier:
  z.enum(["pro","max"])` vs. the real `solo|studio|team` ladder) — the client
  actually posts through the cortex deep proxy, which speaks the real ladder
  vocabulary, so that route isn't even in the path. Real argument: if the
  vocabulary mismatched, all three tiers would break; only Solo breaks. Points
  to a Solo-specific price configuration in cortex, out of this lane's repo.
  **Entanglement checked and ruled out 2026-09-07:** these are two different
  screens with two different code paths, not one root cause wearing two faces.
  `UnlockCheckoutModal.tsx` (the direct-unlock entry point, the one that only
  ever shows $15/30-days) imports exactly one thing from `pricing.ts`,
  `PE_PRICING.property` — it never references `PE_PRICING.solo`, never calls
  `soloChoiceLabel()`, has no code path that could render Solo correctly or
  incorrectly. A cortex price-config fix wouldn't touch this screen; nothing
  here reads that config. Doc-repo-6f's theory correctly fits the OTHER Solo
  item (the dead checkout button lives in the separate 3-tier PricingModal,
  whose client code is symmetric with Studio/Team). The two-choice-step gap is
  confirmed an independent frontend/product decision, not something that
  resolves itself once billing fixes Solo's price.
- Signed-in user can't see what plan they're on; the page goes blank. BLOCKED,
  not yet verified either way: unverifiable without a real signed-in session;
  this dev environment has no backend, so everything correctly reads "not
  read" rather than reproducing the reviewer's actual blank-page bug. See
  `vercel dev` note below.
- Disabled unlock button gives no explanation; should read "Inspect a parcel
  first" rather than sit greyed out. CORRECTED 2026-09-07: initially reported
  "no bug found" because a separate explanatory note already existed nearby.
  The Batch 6 drafted copy made clear the actual ask was for the button's own
  LABEL to change, not just an adjacent note — fixed in PR #369, verified live
  via computed `textContent`.
- Studio column's badge treatment should stay Studio-only. NO BUG FOUND on
  inspection 2026-09-07: already scoped to only the Studio column, no leak
  mechanism found. Will re-flag if evidence surfaces once real data is
  available.

**Batch 4 — Settings**
- Remove boilerplate messages: "signing out clears the browser only," the message
  below "signed in as," "upgrading opens the same...," "cancelling changing," and
  "every value here means" (bottom-of-column messages on Settings/Plan tabs).
  4 OF 5 CLOSED 2026-09-07, `hauska-map` PR #368 merged (16:24:30Z, verified
  green live via `gh`): "signing out clears the browser only," the technical OAuth-callback
  explanation under Signed-in-as, "upgrading opens the same checkout" note, and
  the redundant cancellation-portal aside that repeated the row's own note two
  lines up.
  5TH HELD, needs a call, same pattern as the button-fill/layer-hover conflicts:
  "every value here names where it was read from..." (the modal's bottom
  footer) has an existing code comment explicitly arguing to keep it —
  deleting it would make the product read as broken rather than honest while
  the rows it explains are still on screen. Not touched pending a ruling.
- Account subtab doesn't show which account is currently signed in. NOT A UI
  BUG, backend/architecture gap, placed with doc-repo-2c's Smart Site backlog
  2026-09-07. CORRECTED same day: the hauska-map code comment this lane relied
  on ("not persisted anywhere a later read can reach") is true of the client
  only, not the system — the email is genuinely persisted server-side
  (`artifacts/api-server/src/lib/peIdentity.ts:224`, `getPeUserEmail(userId)`,
  already called on every subscription purchase) and simply isn't on the wire
  to the client. Same shape as the renewal-date item below, not a separate
  structural gap. Checked and explicitly ruled out as connected to the Solo
  checkout bug (that route also calls `getPeUserEmail`, but it degrades
  gracefully on null and isn't the cause). Lesson for this lane going forward:
  a code comment in this repo is evidence about this repo, not about the whole
  system — the authoritative record for "is this stored" is the schema and the
  server-side reader, not a client-side comment.
- Plan subtab: renewal date isn't rendering. NOT A UI BUG, placed with
  doc-repo-2c's Smart Site backlog 2026-09-07. Collapses into the same
  one-piece-of-work as the item above: both are persisted server-side but not
  exposed on the account/entitlement response the client reads. P-98 (the row
  these would naturally attach to) already shipped both halves 2026-09-01 per
  OPS-16 amendment A-065, so this is follow-on work against closed scope with
  no open plan row yet; doc-repo-6f is raising that placement question with
  Nick directly, not this lane's concern.
- Plans/cancellation page needs the brand-level Stripe popup treatment (matching
  checkout) instead of its current formatting. REFRAMED 2026-09-07, not a UI-QA
  fix: there is no popup of ours to restyle. Cancellation is a full-page
  redirect to Stripe's own hosted Customer Portal, a redirect-only hosted
  product, unlike the checkout modals which embed Stripe's Payment Element in
  our own chrome. Matching checkout's branded look would mean building a
  custom cancellation flow directly against Stripe's Subscriptions API,
  replacing the hosted portal entirely — a real engineering project, not a
  small UI patch. Flagged rather than guessing at a smaller version of the ask.
- Right-hand column (intended to guide the user through the funnel) is mostly
  empty; needs content decided per subtab. STILL HELD, as originally triaged;
  left untouched rather than inventing content.

**Batch 5 — Sharing.** Investigated 2026-09-07, all three items are real
architecture, not copy/CSS — held for calls before writing code, none started.
Em dashes in this area already caught by the Batch 1 sweep.
- Notes-inclusion toggle confusion. ROOT CAUSE FOUND: two independent "Include
  notes" checkboxes for the same property in two different share entry points
  (`ShareTool.tsx` quick-share, defaults always-on; `PropertyDossierDetail.tsx`
  richer dialog, defaults to whether notes exist) that don't read each other's
  history, though both write the same `sharePackages` record via
  `upsertSharePackage`. Not one ambiguous control, two that don't talk to each
  other. Proposed fix: single canonical default-resolution rule, read the last
  persisted `sharePackage.includeNotes` when one exists, across both entry
  points. A real cross-component data-consistency decision, not a wording fix.
- X-ray/Flood toggle lag. ROOT CAUSE FOUND, systemic not toggle-specific:
  `PropertiesTool.tsx` has no optimistic local update anywhere in the
  component, every mutation (remove, save, notes, these toggles) awaits the
  write then a separate change-notification refetch of the whole list before
  UI reflects it. Looks intentional (single source of truth, no split-brain
  state) rather than accidental, consistent across every handler, no decision
  record found explaining it either way. Checkboxes are the one control type
  where users expect zero-latency feedback, which is why only these two read
  as broken even though every action in the component shares the same
  latency. Needs a call: (a) a scoped optimistic-update exception just for
  these two checkboxes, deviating from the otherwise-consistent pattern, or
  (b) something else.
- No way to add notes in the share-link flow. CONFIRMED: `ShareTool.tsx` has
  zero notes-writing UI, only the include-existing-notes checkbox.
  `PropertyDossierDetail.tsx` already has a full notes editor (debounced
  autosave, 4k cap) that could be reused. Open scope question: notes live on
  the per-property dossier record, and it's unconfirmed whether `ShareTool`
  can assume the property is already saved when reached from quick-share —
  if not, there may be nothing to attach notes to yet. Needs scope
  confirmation before building.

**Batch 6 — Sign-in card and Plans modal copy — CLOSED 2026-09-07 except the
badge-rotation idea (flagged, not built).** `hauska-map` PR #369 merged
(16:47:58Z, `035d793`, verified green live via `gh`, 8 files). Both surfaces shipped
verbatim from the reviewer's drafted copy per instruction; nothing read off,
no freelancing needed.
- "The full brief" glossary violation: CLOSED, replaced with the drafted header
  line, which also fixes a real defect beyond glossary compliance — the old
  line put share links in "the paid toolkit," directly contradicting the
  sign-in card's "sharing is free on every plan." They now agree.
- Sign-in/Plans share-free contradiction: CLOSED, same fix as above.
- Comal county footnote (false coverage claim, all em dashes): CLOSED by
  omission, the whole footer was replaced by the drafted copy.
- Full sign-in card copy rewrite: CLOSED, shipped verbatim (eyebrow, headline,
  body, footer, button). Also caught and fixed 2 more em dashes in this file
  that were deliberately skipped during the Batch 1 sweep (a "no password,
  ever" reassurance line, a rate-limit error message), since this was always
  going to be the file's last stop.
- Full Plans modal copy rewrite: CLOSED, shipped verbatim (free-tier cell, a
  subline under each of the four comparison groups, 7 de-jargoned row labels,
  rewritten footer unlock line).
- Studio badge/subline rotation idea: NOT BUILT, correctly left flagged per the
  reviewer's own framing ("flag Nick before building; not a bug fix").

## Found in the same document, NOT for this lane

**Owned and in progress: `cente-b9` (hauska-map), confirmed 2026-09-07** — the
dual-active-billing-plan bug, the share-attribution gap, and the full
A-062/P-101/P-100/P-106 QA checklist below. Mid-implementation on the
attribution gap first (branch `fix/pe-share-attribution-retry`, root cause a
fire-and-forget POST with a swallowed catch on the `?signed_in=1` leg, no retry;
fix adds retry-with-backoff plus a durable localStorage pending-retry). Billing
and the QA checklist are accepted but not yet started. Not this lane's work,
listed here for the record.

**Billing / payments logic**
- One account was able to hold two simultaneously active billing plans (one
  annual, one monthly).
- Stripe/affiliate revenue split (20% to affiliate, rest to us) and how
  cancellations/chargebacks should be handled through the affiliate link —
  ruled 2026-09-07, `_decisions/2026-09-07_affiliate_chargeback_cancellation_handling.md`.
- Affiliate link visibility gated to affiliates only, tied into Stripe — access
  control plus payments, not a UI toggle.

**Data / attribution bug — CLOSED 2026-09-07**
- Share-link signups weren't attributing back to the correct sharer
  (`pe_share_attributions` row silently dropped) — already tracked as a "NO" in
  the source doc's own P-100 QA checklist. Fixed by `cente-b9`, `hauska-map` PR
  #363 merged (`7a1845a`, verified live via `gh`). Root cause: single-attempt
  fetch in `claimShareAttribution` wrapped in a catch that swallowed every
  failure, result discarded with `void`, and the one-shot `?signed_in=1` trigger
  stripped from the URL right after use, so a cold BFF function or a failed
  entitlement lookup lost the attribution permanently with zero trace. Fix adds
  3 attempts with backoff plus a localStorage-backed pending-claim record that
  survives a reload or closed tab and retries on next boot; safe to repeat since
  the server keys on the recipient's own primary key. Checked live production
  first (4 real share grants in 24h, 1 real signup, attributed correctly — too
  small a sample to catch a live failure in the act, so the fix targets the real
  gap the code shows rather than a reproduced miss).

**Not yet assigned an owner**
- Flood report data isn't passing through to the sharable section even though the
  user can see it elsewhere in the app.
- Attached report documents fail to download (UI offers download/view, then
  errors) — likely a wiring or permissions bug, not paint.

**Ops / support workflow (route to whoever owns support tooling)**
- Feedback loop that routes to tech support / billing / product, with required
  alerts per department, including fixing wrong department email addresses
  currently shown on the affiliate link.

**Needs clarification before it's actionable**
- "Cami questions: how old are the images? tree overhang" — unclear what's being
  asked; needs Cami or Nick to restate as a concrete question before anyone can
  act on it.
- "I am not sure how this error popped up" — an unexplained error occurred, no
  repro info given; needs whoever owns error monitoring to check logs, not
  something the UI lane can chase blind.
- Signed into Google vs. not, when viewing a shared link, reportedly behaves the
  same either way — unclear if that's a bug or intended; needs a product call
  before it's a task.

**Functional/backend QA checklist for already-merged work (source doc's "what to
check" section, not new bugs found, an acceptance checklist for A-062/P-101/P-100/
P-106; accepted by `cente-b9`, not yet started as of 2026-09-07)**
- A-062 (PE Billing Portal): Settings > Plan tab cancel/manage flow, real Stripe
  portal session, terms.html wording, checkout regression.
- P-101 (Ladder Re-cut / screen gating): free/Solo refusal on create/add-to-screen,
  list_screens staying open, Studio/Team screens still working end-to-end.
- P-100 (Share/Funnel Instrumentation): share_created/share_viewed events,
  attribution on signup (already flagged above as a real gap).
- P-106 (Constraint Search): three-set response shape, refusal on bad countyFips,
  MCP tier gating.
- General regression: smartsite.cloud visual load, core map/X-ray/Flood/chat
  features, the ~30 pre-existing TypeScript errors in `api/pe-share*.ts`.
This whole section reads as a verification checklist for someone else's recent
PRs, not raw UI bugs — leaving it here for the record rather than dropping it,
but it is not this lane's work either.

## Integration regression pass, 2026-09-07

`cente-7d` ran a combined regression pass against merged `origin/main`
(`035d793`) after all six batches landed: one continuous Playwright session
walking cold-open, layer-hover, three docks open together, Settings Account/Plan
tabs, and the Plans modal reached after navigating through several other tools
first (the exact carried-over-state risk a set of six separate merges creates).
No new issues found; every fix held up in combination, not just in isolation
(button fill confirmed via computed style consistent across Start Solo/Studio/
Team, dock scroll-to-top confirmed in a real 3-dock state, all four removed
boilerplate strings confirmed absent, full Plans modal copy set confirmed
matching the isolated tests exactly). One traced non-issue: the pass's own
em-dash check initially flagged the Plans modal, traced to the exact DOM node
before reporting — it's the ruled-out-of-scope `notIncluded: "—"` placeholder
glyph, not new prose. Separately present, unrelated to anything shipped this
session: BFF calls 404 against the plain `vite` dev server with no backend
attached, the same artifact present in every screenshot taken all session,
pre-existing.

## Process note, 2026-09-07

PR #364 (Batch 1) shipped two unrelated commits (button/bubble fix, then the
em-dash sweep) stacked onto one branch and one already-open PR, because GitHub
refuses a second open PR from the same branch. Both were reviewed and verified
green before merge, but the PR title only describes the first commit. Going
forward: one branch, one PR, per batch (or per sub-item within a batch), cut
fresh from main each time, so a PR's title and diff always match.

## Lane setup, done this session

- `P:/tmp/hauska-map-ui-qa` created: standalone clone of `hauska-map` from
  `origin/main` (`3dfb5e8`), branch `seat/property-ui-qa` cut and checked out,
  working tree clean.
- Registered in `_catalog/seat_register.json` (property seat, entry
  `hauska-map-ui-qa`).
- No conflict with any other hauska-map worktree confirmed: `cente-b9`'s
  buildable-envelope fix (the one originally flagged as a possible conflict) is
  already merged to main with no active branch or claimed files.
- 2026-09-07: several Batch 2/3 items are blocked on this lane's dev setup
  having no working backend (`vite` alone doesn't run `/api/*` BFF routes).
  Confirmed the Vercel CLI is already authenticated on this machine as
  `empressaioemail-tech`, so `vercel link` + `vercel dev` in the lane's own
  worktree is a real path to a working local backend; told to the lane to try.
  DEAD END 2026-09-07: `vercel link` succeeded, but `vercel dev` mis-detects
  yarn as the package manager despite `pnpm-lock.yaml` being present and hangs
  on `'yarn' is not recognized` (yarn isn't installed on this machine). No
  further time spent on it per instruction. Search-bar-stacking and the
  blank-current-plan-page item stay unverified for now because of this, not
  because of anything in the lane's own control.
