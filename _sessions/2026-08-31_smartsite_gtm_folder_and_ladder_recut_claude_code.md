---
id: 2026-08-31_smartsite_gtm_folder_and_ladder_recut
title: Smart Site GTM working set opened, ladder re-cut RULED, GoHighLevel proven live
date: 2026-08-31
status: active
applies_to: smart_site
owner: nick
related:
  - _smartsite_gtm/00_README
  - _smartsite_gtm/01_central_texas_gtm_strategy
  - _smartsite_gtm/02_gohighlevel_buildout
  - _smartsite_gtm/03_ladder_recut_proposal
  - _decisions/2026-08-31_ctx_gtm_rulings
  - _decisions/2026-08-31_gohighlevel_supersedes_pipedrive
  - _decisions/2026-08-31_smartsite_connector_is_a_door_not_a_tier
  - _decisions/2026-08-31_smartsite_ladder_recut_studio_works_a_list
  - _smartsite_gtm/04_gohighlevel_agent_runbook
  - 90_operations/OPS-16_texas_market_plan_of_record
---

# Session summary

Snapshot at open: `p:\doc_repo` main `3add9d1`. Another seat moved the tip to `cab9403` and added OPS-16 A-062 and A-063 mid-session; both were read before appending A-064.

## What happened

A Smart Site GTM thread. Opened `_smartsite_gtm/` as the go-to-market working set, with `_smartsite_masters/` still governing what may be said and winning any conflict. Wrote the Central Texas strategy, the GoHighLevel buildout, and a ladder re-cut proposal. Provisioned and proved the GoHighLevel credential. Filed three decision records and one OPS-16 amendment opening two rows.

Operator corrections taken during the thread: the affiliate channel is in flight with another agent group on PromoteKit into Stripe with PayPal payouts, the Stripe live switch is running with that same group, and the share loop already works. The planner's earlier framing of "no channel data" as a gap was wrong; it is a pre-market fact. What survives is that the events do not exist to catch data once traffic starts, which became P-100.

## Rulings

Affiliate is opt-in with an application, not a universal link. McLennan is held for targeting; the launch target is the Austin metro five and serving Waco is unchanged. Affiliate launch holds on share and funnel instrumentation, the only hold in the plan. GoHighLevel supersedes Pipedrive as the CRM, with the 2026-08-17 seam rules transferring unchanged.

The Smart Site MCP connector is a door, not a tier: available at every rung including Free, mirroring the workbench gates rather than carrying its own.

## The planner proposed something wrong and withdrew it

Looking for a way to make Studio the obvious buy, the planner proposed moving the connector's `run_report` to Studio. That contradicts the positioning master's "two doors, one truth" claim, which is one of four things the set says only we can say. Pricing the door falsifies the claim; what may be gated is what sits behind it, which is already how the code is built. The proposal was withdrawn against the master and the ruling filed as its inverse.

The underlying problem was real but was a tier defect, not a connector defect. Screens and boards are ungated in the workbench as well as in the connector, so the fix belongs at the tier where both surfaces inherit it.

## Code reads, and what they found

Read `origin/main` in both repos, read-only, never the working trees. legacy-design-tools `394424f2`, hauska-map `fbda04aa`.

The live tier system is two gate points across the whole MCP surface and four capabilities on the web side. Studio's entire differentiation is site plan CAD, terrain export, the records package, and owner data. Three of those four are architect-only, so the largest audience segment has essentially no reason to pass Solo, while the pricing table files owner data under "Hand it to someone else" and badges Studio "The packet", which tells that segment the tier is not for them.

Screens and boards carry no entitlement gate anywhere, giving away the set-level job the locked ladder reserves for Prospect, before Prospect has launched.

`requirePePaidDeep` is dead code with zero repo-wide mounts. It was nearly reported as a starved control, which would have been a false alarm; it is superseded by `requirePePaidOrPropertyUnlocked`, which carries four live mounts. The negative was checked repo-wide rather than by a scoped grep, per the planner's own standing error.

The proposed re-cut is "Solo answers one parcel, Studio works a list", with Prospect redefined from set-level answers to monitoring. Prices untouched. Ruled later the same day; see Second arc.

## GoHighLevel proven live, and how the first two proofs were vacuous

Credential is a v2 Private Integration token against sub-account `KtUXFiFB5e22abpLp1MR`. Scopes proven by 200: locations, contacts, opportunities, users.

The first two probe runs proved nothing. The real location id and a deliberately bogus one returned byte-identical scope errors, because the scope check fired before the location was ever evaluated. Only the third run separated: real returned 200 while bogus returned 403. A probe whose control matches its subject is not a test, and this is recorded in the buildout doc as the re-verification procedure after any scope or token change.

Two vendor artifacts found in the account and owed cleanup before real data lands: seeded `(example)` contacts, and a default "Marketing Pipeline" the platform created at 21:43Z rather than us.

## A refused claim, recorded

The 2026-08-10 humanless handoff offers "get the site base without paying for a survey" as an example affiliate line. It is refused and recorded as refused in the strategy doc. The masters' approved answer is the opposite: envelopes are approximate, not survey grade, and Smart Site is the fastest defensible read rather than a replacement for a stamped survey.

## Open

The one-line outcome each affiliate segment sells. Candidates were drafted and deliberately not ratified, because the ladder re-cut changes which tier each segment is sold into.

The ladder re-cut itself, and the Prospect redefinition that rides with it.

Whether a free connector session costs meaningful compute. Unmeasured, and the connector ruling names it as the thing that would reopen it.

The product-to-CRM pipe, which needs the credential in Secret Manager bound to cortex-api.

## Hygiene noted, not fixed

OPS-16 amendment ids A-016, A-060 and A-061 each appear twice. The baseline is append-only so the duplicates stand; they are named in A-064 so a later reader is not misled.

## Second arc, same day

The ladder was RULED, not left as a proposal. Solo answers one parcel, Studio works a list. Exactly one capability moves, screens and boards from ungated to Studio; the records package was already Studio and only becomes visible; the rest is regrouping, a second Studio seat, and Prospect redefined as monitoring. Prices untouched. `03_ladder_recut_proposal.md` keeps its filename and flips to ruled. OPS-16 A-066 opens P-101 to implement it.

Before ruling, the capability map was re-checked for staleness. Another seat had shipped P-98 and its commit message named a "Paid for everyone" defect, which sounded like entitlement. The four entitlement files behind the map are byte-unchanged between the read commit and current LDT main, and the defect was a client-side `SettingsModal` display bug. The map held, but the check was the point.

P-100 was assigned to the property seat with a compiled dispatch. Scoping it surfaced a second staleness: the instrumentation is not missing. `gtmEvents`, `gtmConsent`, `recordGtmEvent` with many live call sites, a PE emitter, and `share_created` / `share_viewed` all exist, so the 2026-08-24 "none are wired" claim is stale and the card is measure-then-close rather than build-from-zero. The one gap established repo-wide as genuinely absent is sharer attribution: no referrer field exists anywhere, so a recipient who signs up is credited to nobody. Had the card been written from the doc instead of from the code, it would have ordered a rebuild of a working writer.

GoHighLevel pipeline creation was proven API-supported by a safe write probe, 422 validation against a 404 control, creating nothing. Browser-only setup went into an agent runbook the operator drives from Google Docs.

Two planner errors avoided by checking rather than asserting, and one earlier in the day corrected by withdrawal. The pattern across all three: the doc was stale and the code was not.

## Incident: another seat's commit swallowed this seat's staged index

At 19:56 local, commit `71c3a62`, message `docs(F-03): compile STORE-SPLIT-PLAN — plan the split, change nothing`, landed carrying all eight of this session's staged files and nothing else. Its own F-03 artifact does not appear in its diff. That seat committed with an add-all reflex in the window between this seat's `git add` and its `git commit`.

Nothing was lost or corrupted. The ladder ruling, the runbook, OPS-16 A-066, and the other seat's A-065 are all intact in that commit, verified by reading them out of it. The commit is pushed and on the shared branch, so it is not being rewritten: other seats are actively working and a history rewrite would cost more than a misdescribing message. The record is corrected here instead.

The lesson is sharper than the existing one. Staging explicit paths does not protect you, because the exposure is the git INDEX, which is shared process-wide, not the paths you chose. Committing "promptly" after staging does not protect you either, because the window is however long the next tool call takes. The only mitigation that closes it is to stage and commit in a single invocation, so no other process can observe a populated index. This seat staged in one call and committed in the next, and lost the race by one call.

