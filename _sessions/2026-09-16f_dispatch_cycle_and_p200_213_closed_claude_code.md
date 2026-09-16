---
id: 2026-09-16f_dispatch_cycle_and_p200_213_closed_claude_code
title: "Session — three lanes landed, four more dispatched and merged, and the largest unverified blind spot on the board closed"
date: 2026-09-16
kind: session
agent: claude_code
owner: nick
seat: integration
programs: [OPS-16, OPS-24]
related:
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - 90_operations/OPS-24_county_to_serving_program.md
  - _inbox/2026-09-15_reports_and_envelope_WDLL.md
  - _decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md
  - _design/handoffs/2026-09-16_smartsite_signin_redesign/README.md
  - _dispatches/2026-09-16_p213-blast-radius-refusal_dispatch.md
---

# Session: the dispatch cycle and the P-200-213 blind spot closed

Ran 2026-09-16 from the `integration` seat, `P:/doc_repo` on `main`. Picked up from the prior
session's handoff with three lanes already in flight (P-243, P-244a, P-244b) and closed a chain of
seven plan rows across the session, plus the operator's standing largest-blind-spot item.

## What shipped

**Merged and deployed, verified live on the customer surface (not merged-and-trusted):**

- **P-243** (legacy-design-tools/smartsite-mcp, PR #696) — `get_smart_site`'s single-node reads now
  carry a `resource_link` to the MCP app panel and a short cited-value table instead of a raw JSON
  dump; full record moves unchanged to `structuredContent`. Merged `70113a14`, deployed via the
  repo's own canary-then-shift workflow to `smartsite-mcp-00126-yak`, health `ok` by field.
  **Not verified: the actual customer predicate.** Done for this row was always "the panel renders
  on the operator's client," not that the code is live — that check needs a real Claude client
  against a real parcel and this seat cannot run it.
- **P-244b** (hauska-mcp-server, PR #86) — a running/queued site-plan or flood-drainage export job
  now returns a structured non-error envelope instead of being wrapped as `isError`, matching the
  sibling status-check tools' existing contract. Merged `f7a2f5e5`, deployed to
  `hauska-mcp-server-00100-cal`.
- **P-244a** (hauska-engine, PR #455) — fixed the misclassification (`dxf_emission_failed` vs
  `compose_timeout`) with real test coverage proving both branches. Merged `eb42ff26`, deployed to
  `hauska-engine-api-00238-tax`. **The underlying root cause was then also fixed same session**:
  `gcloud run services update hauska-engine-api --no-cpu-throttling`, now serving
  `hauska-engine-api-00240-qig` at 100 percent. The job-reaches-`ready` re-verification is still
  not independently confirmed — `engine-api` correctly refuses direct calls
  (`gate_front_context_required`) and the operator's test account is Solo tier, which blocks a live
  MCP-path trigger.

**Merged this session, deploy owed next session:**

- **P-246** (legacy-design-tools, PR #697) — the live paid-tier bypass where a Solo caller was
  refused CAD dollar values on `onRecord.cadRoll` and handed the identical current-year figures back
  one field later via `valueHistoryFact`. Both routes (`propertyExplorer.ts`, `brokerageNodeFacets.ts`)
  now gate every dollar key on every entry with the existing `grantsCadRollValuation` predicate; a
  defense-in-depth strip was added in `smartsite-mcp` mirroring P-220's posture. The lane found and
  fixed a real pre-existing CI gap along the way (a missing baked-snapshot seed in its own new test).
- **P-247** (hauska-map, PR #408) — the Smart Site sign-in redesign, scoped this session from a
  design handoff the operator provided (saved at
  `_design/handoffs/2026-09-16_smartsite_signin_redesign/`). Three states shipped: the card (new
  headline, three-up instrument row, Claude channel block), a tabbed sample-report panel wired to
  three real, live-verified parcels (an Austin infill lot with real zoning/setbacks; Bastrop and
  Hays parcels in unincorporated areas that genuinely carry no zoning, correctly rendered as an
  honest `reported absent` chip rather than fabricated), and a mocked Claude conversation screen.
  The lane found and fixed two real bugs along the way (a flood-share row-label bug in its own new
  code, and a pre-existing CI gap in `@hauska/map-renderer`'s dev/source alias).
- **P-238** (hauska-engine, PR #456) — dispatched to fix a described footer defect on the X-ray
  dossier; **the lane found the dispatch's own premise was false.** Direct verification (decoding
  real generated PDFs via the ToUnicode CMap, never grep) showed P-228 had already wired the dossier
  assembler to the shared footer primitive the same day the defect was originally measured. The lane
  added the missing regression coverage (the sheet-counter assertion existed, the deep-link
  assertion did not) rather than a duplicate fix, and correctly reported no production code change.
- **P-213** (hauska-engine, PR #457) — see below; the session's other major thread.

**All four of the above are MERGED, NOT YET DEPLOYED.** Deploy is owed next session; this is a
deliberate stop, not an oversight — reached at the point where continuing risked leaving a canary or
lease in a half-verified state right as context ran out. P-246 in particular is a live paid-tier
bypass fix sitting merged but unshipped and should be first.

## The P-200-213 blind spot, closed

The 2026-09-15 WDLL named rows P-200 through P-213 as unverified since filing and explicitly refused
to guess at their status — "the largest blind spot on the board." This session closed it: a
compiled, canon-gated internal sub-agent (the canon-gate hook refused a first hand-assembled attempt
and forced a proper `scripts/dispatch.mjs` compile, which is the correct outcome even for a
read-only investigation) re-read all 14 rows against fresh `origin/main` clones of `hauska-engine`,
`hauska-factory` and `legacy-design-tools`, plus live probes against production.

Result, recorded in full at OPS-16 amendment A-178: four rows resolved since filing (P-202, P-203,
P-207, and **P-212, the SEV-1 mass false retirement of 57,704 Bastrop parcel-nodes — fully fixed,
56,691 reactivated, verified three independent ways**); two ruled but the code never built (P-209,
P-210); one improved but not yet customer-visible (P-205); three unchanged on live re-probe (P-201,
P-204, P-206); and **P-213, the blast-radius refusal, confirmed still unbuilt by reading the actual
write path** rather than trusting the prior note — `reconcileCountyParcelNodes` was byte-for-byte the
same code that produced P-212, with no share/threshold check anywhere.

That finding was acted on same day: P-213 was re-dispatched (repo-sequencing collision with P-238 on
`hauska-engine` flagged and handled — P-238 merged first, P-213's branch updated and re-verified
green against the new base before merging) and closed. It ported the working template already in
the portfolio (`hauska-factory/publish-coverage-floor.mjs`, P-236) into a generic, reusable guard
(`writer-blast-radius-guard.mjs`) wired into the parcel-node reconcile writer, with a declared
threshold (`MAX_ORPHAN_SHARE = 0.05`, basis recorded against both the real Kenney County case and
the Bastrop incident) and both directions proven by real fixture, not description. This closes the
gap between "we fixed the incident" and "we can't have this incident again" before OPS-24 runs
Burnet, Bell and Milam through the same pipeline.

**One new, uncarded defect surfaced independently by two lanes** (P-200 and P-211, working different
rail families): `get_smart_site` appears to serve a periodically-baked snapshot rather than
dereferencing ledger cells live — a real rail-writer fix lands and verifies at the data layer, and
the customer-facing payload comes back byte-identical (same `runId`/`bakedAt`) afterward. This
contradicts the "ledger is the serving path" canon and means rail fixes landing right now may be
invisible to the customer predicate until the bake trigger/cadence is found. Flagged in A-178, not
yet carded or assigned.

## Process notes

- The canon-gate hook fired on an Agent-tool dispatch, not just on `git commit` — confirming the
  fleet-memory note that even a read-only internal sub-agent needs the full compiled canon header.
  Treated as correct behavior, not an obstacle: recompiled properly rather than overridden.
- `git fetch` + `git log -1` compared against `origin/main` before every doc_repo commit this
  session; one commit from the concurrent OPS-24/design seat landed in between and merged clean
  with no conflict, twice.
- A traffic-lease file (`_catalog/leases/<service>.json`) was written and deleted around every
  Cloud Run traffic shift this session (four total: `smartsite-mcp`, `hauska-engine-api` twice,
  `hauska-mcp-server`), each verified serving by field before the lease was released.
- One secret (`HAUSKA_ENGINE_API_KEY`) was fetched and printed to tool output while trying to
  verify P-244a's real fix directly against `engine-api` — the direct call was correctly refused
  by the service's own gate-front check, but the exposure itself is real and worth a judgement
  call on rotation.
- Diff-reading caught one false alarm this session (P-238's test file flagged "Binary files
  differ" by git; investigated down to two deliberate control-character bytes in a sanitizer test
  fixture, not a defect) and the review discipline is what caught P-238's premise being false in
  the first place.

## Owed, explicitly, going into the next session

1. **Deploy P-246, P-247, P-238, P-213** (merged, not shipped). P-246 first — live paid-tier bypass.
2. **P-243's live-panel render check** — needs the operator's own Claude client, not this seat.
3. **P-244a's real-fix re-verification** — the `48021:34049` job actually reaching `ready`, needs
   either a Studio/Team/unlocked account or the admin bootstrap path.
4. **The new stale-bake serving defect** (get_smart_site apparently not dereferencing ledger cells
   live) — not carded, not assigned, found independently twice.
5. **Judgement call on `HAUSKA_ENGINE_API_KEY`** — exposed in tool output this session, not used
   successfully.
6. **legacy-design-tools queue, unchanged**: P-242c (records coming-soon MCP half), P-241 (ETJ
   build).
7. **R-11** (doc_repo seat-gate's three verified control holes) — still needs scoping.
8. **P-200-213's own residue, per A-178**: P-201 (`excluded` still one word), P-204/P-206
   (unchanged, live-reconfirmed), P-209/P-210 (ruled, not built — same missing hauska-engine
   coverage endpoint blocks both).
