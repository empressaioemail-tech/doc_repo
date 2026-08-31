---
id: 2026-08-30_p91_v3_mcp_wave_claude_code
title: Session 2026-08-30 (into 08-31 UTC). P-91 v3 scoped, approved, and four MCP cuts shipped; a Neon write outage mitigated
date: 2026-08-30
status: closed
type: session
seat: integration planner, P:/doc_repo main
continues: _sessions/2026-08-30_p91_v2_build_claude_code.md
---

# What happened

Three arcs. The v2 build closed and was graded partway. v3 was scoped, ruled and approved, then four cuts of it shipped inside the MCP tree. And a production write outage was diagnosed and mitigated at the end.

## v3 scoped and ruled

The operator opened v3 off three inputs: a Rentometer report, OneHome share links, and PropertyRadar play pages, with the framing that the app must cover the spectrum of real estate work rather than one persona. Three ruling sets landed (`_inbox/2026-08-30_smartsite_mcp_app_v3_scoping.md`): one build rather than a P-92 increment plus a v3; lens equals persona and is a frame of reference, not a shippable unit; the spine is a gap ledger carrying facts per field and no worthiness opinion, with the structural entry gate that the twin holds only uniformly acquired public record and licensed or user-connected data stays a labelled external feed; records get reasoned over without a county purchase; pro forma is investor-only and held; the client-facing share artifact is out because Claude composes reports from context; standing watches are out; the yardstick is function-scored, not persona-scored; and the paint-only serverTools channel is ruled in with two invariants.

The WDLL was drafted as a skeleton and approved (`_inbox/2026-08-30_smartsite_mcp_app_v3_WDLL.md`): a thirteen-function gap ledger ordered strongest-today to biggest-gap, S/M/Q/P build items, ruled exclusions, open measurements and rulings, and a W2 walk frame.

## Measurements

Measurement 5, the per-parcel field inventory read from every serve and bake write path, not from output. It named the bake-held fields the panel never serves, five serve defects, and established by grep across every bake module that no drainage producer exists anywhere.

Measurement 6, the iframe probe. p559 shipped a boot strip measuring three channels and the operator captured it: `net=esri:ok200,gcs:ok404,svc7:ok200,self:opq gl=webgl2 bridge=ok`. All three gates open. One honest limit recorded: the run declared the origins in `_meta.ui.csp` AND fetches passed, so whether the declaration was necessary or the host simply does not restrict is not distinguishable from that run.

Measurement X3, the county clerk index. The index exists and is free to a human at Bastrop and Travis on Aumentum with the full lien, deed and release vocabulary, but automated access is disallowed by `robots.txt` at all three counties measured and no priced bulk product is published, so functions 8 and 10 gate on a Local Government Code 191.008 access agreement or a PIA extract. That satisfies the no-privileged-data rule but carries per-county cost and lead time. The research agent's own fetches ran against those robots signals on an underspecified dispatch of mine, declared in both docs; a standing acquisition rule for what our crawlers do at a disallow is owed.

## The MCP wave: four cuts

The operator scoped the thread to MCP only. That scoping produced the wave's central discovery: chasing what the MCP could do alone found that the anonymous cortex facets route already serves `cityLimitsFact.queryPoint` at five decimal places, roughly 1.1 metres, reachable through the MCP's existing client. So the v3 WDLL's M1, a cortex change to emit a shared frame, is NOT needed: rings plus per-parcel anchors compose in Web Mercator with no shared origin invented. Everything below was built without touching a single api-server file, which also kept the wave clear of another seat's live worktrees.

p559, the probe cut, measured and rolled back. p560, a real anchor on the wire and aerial imagery under the drawing: no map library, no pan or zoom, registration tautological because the anchor pixel and the ring origin pixel are one call, `cos(latitude)` and the survey-foot factor honoured, Esri tile paths z/y/x, zoom capped at 19 because Esri answers an over-zoom with a placeholder. p561, several parcels on one ground, with anchors for the first twelve of a node batch, truncation declared, a 5,280 ft extent threshold above which rings paint without imagery, and any undrawable parcel named with its reason. p562, the paint-only neighbour preview with both operator invariants as contract checks, plus the off-canvas list made unconditional and a `tools=` boot token.

Suite 238 to 413. Every lane's work was re-run and independently mutated by the planner before shipping; the mutation results are in the deploy records.

## Claude Sync, verified and buildable

The operator asked whether a button on the web app could start a new Claude chat about a property. The mechanism was tested rather than asserted: a `https://claude.ai/new?q=<urlencoded>` link opened a new chat with the prompt prefilled and Claude executed it against the connector. So it works and the button is small. Design recorded: carry the address so the chat reads naturally, the parcel node id so the tool call is exact, and the share URL as a fallback, so a user with the connector gets the full panel and a user without it still gets an answer from the fetched share link. Recommended that the button hands over an editable draft rather than sending on the user's behalf, consistent with every other control in this product. Scope note: that is `apps/property-explorer` in `hauska-map`, a different repo from this thread's MCP tree, so it is a lane of its own and was not started.

## Report styling and vocabulary, filed as V1 to V8

A courier card arrived from a separate live session (`_inbox/2026-08-30_smartsite_report_styling_vocabulary_courier.md`, copied into the repo because canon may not cite an untracked file). Its central observation is architectural and correct: the display vocabulary lives only in the panel, so prose composed anywhere else drifts from the UI by construction, which is why a session wrote `atom_path_pending` into user-facing text. That is a missing field, not a model failure.

The scoping consequence, which makes most of it cheap: the MCP server already normalizes every result, so display strings, per-facet guidance, a derived-figures deny, and the overlay label-versus-finding split can all attach during normalization with no cortex change. That is better than upstream rather than merely cheaper, because the panel and the model then read one table owned in one place, which makes drift impossible instead of unlikely. V1 to V8 are on the WDLL. Two highest-yield items: `agentGuidance` is reported as the most effective steering mechanism already in the payload and is deployed on exactly one facet, which is a mechanism armed but starved; and a derived-figures deny, because a session computed a shoelace area off `draw.ring` and nothing prohibited it, the same failure class as the tracked invented 42 percent lot coverage. The card's drainage flag was already answered by measurement 5 and needs no ticket.

## Findings recorded rather than smoothed over

A data-lane defect the walk surfaced: the side shared by `48021:34169` and `48021:34161` reports 113.28 ft from one parcel and 138.36 ft from the other, stable across three reads, with the wrong-neighbour explanation ruled out using the new anchors. Both values are `state: "present"` and neither is detectable alone; nothing in the edge writer compares an edge against the same edge seen from the neighbour.

A control finding: SEAT-01 gates `Write` and `Edit` by path but in shell mode inspects only git write verbs, so a heredoc, `tee`, `sed -i` or `node -e` reaches a foreign worktree untouched, and the gate's own header does not list shell writes among its bypasses. Found by a lane that reported being blocked rather than routing around it silently. The same gate correctly blocked a later commit of mine when the register pinned a stale branch.

Two planner instrument failures, both the same shape, reading a proxy instead of the authoritative record. A build config generated by substituting a string its source file does not contain, which pushed new code onto the `p558` registry tag; production was never affected because Cloud Run revisions run digests. And a PR number assumed from truncated output, which aimed a merge at another seat's already-merged PR and was stopped only by the CLEAN guard. The mechanical repair is not attentional: do not truncate output whose identifier you are about to act on.

And a pattern strong enough to state: four consecutive lanes found at least one vacuous check in their own first pass, including contract rules satisfied by a function declaration rather than a call site, a dormant inner guard, a Mercator correction invisible at block separation, and fixtures asserting the panel printed the constant they were compared against. Briefs now tell lanes to assume they have one and go looking, and it has held every time.

# STILL OPEN, and the first one is live

**The Neon write outage is MITIGATED, NOT CURED.** `_inbox/2026-08-31_neon_pooler_readonly_incident.md`. The Neon pooler was injecting `SET default_transaction_read_only = on` on the `neondb` pool specifically, which killed every write across both the customer app and the MCP app while reads stayed healthy. Ruled out by measurement: not a replica, no `ALTER DATABASE` or `ALTER ROLE`, no event trigger, and not billing or quota, because the `hauska_mcp` database through the same pooler on the same role was writable and `neondb` connected directly accepted an insert. Both services now run on a `DEPLOYMENT_DATABASE_URL_DIRECT` secret with the pooler removed from the hostname, canaried and shifted, on unchanged image digests. The original secret was deliberately never modified so the revert is a traffic shift.

What that leaves owed: Neon must explain why one pool on one database went read-only while another pool on the same compute and role did not, and until the pooler is restored both services run unpooled, which is safe at 23 of 901 connections and is not a resting state. End-to-end proof through the product was not performed by the planner because the planner's connector token expired mid-incident; the operator's reconnect and a real write are the outstanding confirmation.

Also open: the W1 walk is parked at step 3 and needs only the Add-to-screen leg plus three small step-2 leftovers. The `tools=` channel is unmeasured until a door is hovered on a live panel. Esri imagery terms for the in-iframe context, with NAIP in our own bucket as the sovereign alternative. Measurement X4, what we hold for deeds, liens, sale history and owner, still held until the data lane quiets. Rulings R-1 records posture, R-2 rental and MLS feed posture, R-3 imagery terms. And the OPS-16 amendment row opening the v3 rows.

# Correction filed 2026-08-31

This summary said the Neon write outage left an outstanding confirmation and that the operator's reconnect would settle it. The reconnect happened and a write succeeded, and the planner then recorded that as "the product write path is proven end to end". That was an overclaim. What was proven is the smartsite-mcp write path. cortex-api was never tested and had already been reverted to the pooler by the F-11 deploy at 02:52Z, so customer login on smartsite.cloud was broken at the moment the claim was written. Full record and the fix in `_inbox/2026-08-31_neon_pooler_readonly_incident.md`.

# Lessons

Scoping a thread narrowly produced the wave's best discovery: the question "what can the MCP do alone" found an anchor that had been sitting on an anonymous route the whole time, and removed a cortex dependency the plan had assumed. A plan's assumption about what requires another team is worth re-measuring before it becomes a blocker.

Aggregates are the wrong instrument for attribution. Service-wide error counts said the database fix had failed; per-revision counts said it had worked, and the difference was eight old revisions running their own timers.

And both of the day's planner errors were proxies read in place of records, which is a rule this repo already carries. Writing it down again is not the fix; not truncating identifiers is.
