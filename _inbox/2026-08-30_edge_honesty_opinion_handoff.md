---
id: 2026-08-30_edge_honesty_opinion_handoff
title: Handoff prompt. Two edge-honesty issues. Opinion, not a build
date: 2026-08-30
status: ready
plan_row: P-92, F-06, F-08
from: integration seat, P:/doc_repo main beb8c8b at session start; this write uncommitted
to: receiving agent (data-pipeline or property). Opinion only. Do not implement. Do not dispatch. Do not deploy.
decision: _decisions/2026-08-30_honesty_contract_is_silence_legible.md
---

Filed: 2026-08-30
From: integration seat, doc_repo
To: a fresh agent that has not been in this conversation
Re: Two issues on Smart Site edge honesty. Give an independent opinion. Do not inherit the routing.

---

# Prompt (paste everything below this line)

You are being asked for an opinion, not a build. Do not write product code. Do not compile a dispatch. Do not deploy. Do not rewrite `_smartsite_masters`. Read the named files before you answer. If a claim below is not in a file you read this session, treat it as unverified.

## Your job

Two issues sit next to each other. The last seat split them: one for a data-pipeline team, one for a cortex serialize card. That split is a recommendation, not a ruling you must accept. Attack it. A useful return disagrees where the evidence is thin.

Return:

1. What you believe each issue actually is, in your own words, after reading the wire and the store shape. Not a restatement of this prompt.
2. Whether they are one defect or two. If two, what closes each. If one, what the last seat split wrongly.
3. What you would give a data-pipeline team that is about to run CTX execute waves (P0 to P8). What you would refuse to give them.
4. What you would put on P-92 / cortex, if anything.
5. What is unverified in this packet and what instrument would make it fail.

## Snapshot (do not trust stale numbers)

doc_repo `main`. Integration seat filed this on 2026-08-30. Serving at last traffic read (field name, not `latestReady`): smartsite-mcp p558 (`smartsite-mcp-00065-siv`), cortex-api p543 (`cortex-api-00668-cos`). Re-read traffic if you cite serving.

## Standing decisions you must not violate

Cotality extinguished. Deploys planner-owned. No privileged data. Code-done is not customer-done. Fail closed: never emit a value without a required input. A missing atom is `unknown`, never `absent-verified`.

## What this is about

Smart Site's MCP tool `get_smart_site` returns a brief with sections and a `draw` object. Sections carry an explicit disposition: present, absent-verified, unknown, refused, unread. A refused setbacks-envelope section carries `agentGuidance`: "Setbacks and buildable envelope were declined in the bake. Do not invent setback distances or a buildable polygon." That string was observed honored in a 2026-08-30 Connect walk.

The operator's design argument (2026-08-28 QA battery, operator's words, not a team measurement): most property data arrives as flat prose. A missing field has nothing to stop a model from filling the hole from training priors. Smart Site's answer is that silence is legible. The honest marketed claim is that the payload is shaped so the model refuses where the data refuses. It is not a verified property that the product "will not degrade."

Decision: `_decisions/2026-08-30_honesty_contract_is_silence_legible.md`.

Two caveats on that claim. Flood citations (already on the card as F2) are not your subject unless they change the routing. Your subject is the two edge issues below.

---

## Issue A. Wrong neighbor labels (proposed: data team, X1 + O3)

### What was observed

Operator observation, 2026-08-30 walk, not independently re-measured by the filing seat: every edge on the parcels walked came back with an implicit present. Neighbor ids and adjacency were stated as flat fact. Five of six of those labels on verified shared boundaries were wrong.

The filing seat has no file-based instrument that lists the six edges and the five misses. Treat "5 of 6" as operator-attributed. The mechanism does not depend on the count. One wrong neighbor with no disposition is the same class at n=1.

A related, older, named defect is O3. Gold `48021:34137` and its neighbor `48021:34169` both name `48021:34121` as the neighbor across the Pine right of way. A cross-ROW `neighbor` may be a ray-hit, not a shared boundary. Reciprocity will not catch it, because there is no shared edge to disagree with. Source: `_inbox/2026-08-28_smartsite_mcp_app_v1_scope.md` section 9, item O3. Still open. Walk across a ROW is suppressed in the panel (`adjacency === "ROW"`), but the id still ships on the wire.

### What the store already has

Edges are first-class atoms, `entity_type: property-boundary-edge`. Gold dump `_inbox/2026-08-28_gold_34137_draw_dump.json` (probed 2026-08-28T04:45Z, `hauska_mcp.atoms`):

- Four edges on `48021:34137`.
- `sourceAdapter: descriptor-fixture`. GIS-approximate. Not a survey.
- Edge 1: `adjacencyKind: neighbor-parcel`, `parcelNeighborPropId: "34169"`.
- Edges 2 and 3: `adjacencyKind: ROW`.
- Edge 0: `adjacencyKind: alley` plus a road node.
- Endpoints are Local-ENU metres. Lengths also exist as US survey feet on the same body.

The serve path projects those atoms into `draw.edges[]` with `role`, `ft`, `bearing`, `adjacency`, `neighbor`, `roadNode`. The p558 live read on `48021:49295` (eleven edges) is the same shape: each edge has ft, bearing, adjacency, and where mapped a neighbor id or a road node. Record: `_inbox/2026-08-30_p91_p558_deploy.md`.

There is no disposition field on those edge objects today.

### The proposed instrument (X1)

Already on the v2 card as a data-lane instrument, unbuilt.

Every shared boundary edge is two independent assertions that must agree: same length, reciprocal bearing, neighbor pointing back. Run as a county sweep from the store. No new ingest. Output is a defect map. Check named on the card: gold edge 1 versus 34169 edge 4 agree.

X1 finds disagreement. It does not by itself change what Claude sees. A repaired label that still ships as implicit present will fail the same way the next time the join is wrong.

O3 is a different miss: no shared edge, so X1 cannot see it. Confirm or label unverified before a customer walks across a street. The panel already refuses the Open door on `adjacency === "ROW"`. The wire still names the id.

### Where it sits on the CTX waves

`_inbox/2026-08-30_ctx_execute_waves_WDLL.md` P4 already owns "edges" as mint work: depth-warm only where a setback table lands, about 154,841 in-city parcels. Hays, McLennan, Williamson owe zero edge work until a city table exists. Unincorporated edges are `not-applicable` (P3), about 826,569 parcels.

The walk's wrong labels are on parcels that already have edges (downtown Bastrop / gold / warm cohort). P4 as written mints more rings. If those new rings carry the same implicit-present neighbor join, P4 scales the defect.

The last seat's recommendation: give the data team X1 plus O3 as an acceptance item on P4/P5. Produce the defect map. Repair the join only from two derivations, or stamp the label unverified. Do not rewrite a neighbor from a single ray-hit. Do not treat "P4 minted edges" as "neighbors are honest."

### What you must not collapse

X1 (reciprocity on shared edges) is not O3 (cross-ROW ray-hit). Reciprocity cannot catch O3.
N1 on the v2 card is a panel seam glyph when rails differ across a walked neighbor. N1 is not a neighbor-id check.
CTX P4 "edges owed" is coverage (do we have a ring). It is not label quality.

---

## Issue B. No disposition on edge metadata (proposed: cortex / P-92, X2)

### What was observed

Same walk. Every edge `state` (or the absence of a state) read as present. Neighbor and adjacency had no guard. The section contract that stops Claude inventing a setback does not currently stop it repeating a wrong neighbor with full confidence.

This is the new caveat. The flood caveat (present + `citationsDegraded: true` + empty citations) was already known. This one is sharper because the model has a named id to repeat.

### What the contract covers today

On brief sections (P-87 item 24, P-91 v2 F5/F7):

- `present`
- `absent-verified` (we looked, there is nothing; requires a positive typed result and, after F5, a known vintage)
- `unknown` (we did not look, or could not tell; atom-miss maps here, never to absent-verified)
- `refused` (bake declined; carries `agentGuidance` aimed at the model)
- `unread` (the read has not been attempted)

On overlays: the same idea, with F5 downgrading unearned `absent-verified` to `unknown`.

On `draw.edges[]`: nothing. Length and bearing are computed upstream (that half is the point of the draw stub). Neighbor and adjacency are attached as fact.

Gold atom body for the shared side (edge 1) carries `parcelNeighborPropId: "34169"` with no verification state, no reciprocity flag, no vintage on the neighbor join. The assembler copies that into the edge object the model reads.

### The proposed serialize rule (X2)

Added 2026-08-30 to `_inbox/2026-08-30_smartsite_mcp_app_v2_WDLL.md`. Not built. OPS-16 A-052 names it on P-92. Marketing the honesty differentiator is gated on X2 customer-done.

Each edge, or each of neighbor and adjacency on the edge, carries an explicit disposition from the same five-state vocabulary. A reciprocity miss (X1), an unverified ray-hit (O3), or an unconfirmed label maps to `unknown` or `refused` with `agentGuidance`, never to implicit present. The panel hover and the Claude transcript read the same field.

Check named on the card: a fixture whose neighbor fails X1 or O3 cannot emit that neighbor as implicit present; gold shared-boundary edges that pass X1 may stay present; a Connect walk on a known-wrong label shows the model hedging or refusing the way it already refuses setbacks.

### Why the last seat said this is not a data fix

Even if every current Bastrop label were repaired tomorrow, the next bad join would still serialize as confident fact. The setback refusal works because the section cannot be silent. Edges can still be silent about uncertainty.

Second mechanism the last seat rejected: "X1 alone closes it." Rejected because a repaired label without a disposition is the same empty-success class the first time the join is wrong again.

### What X2 is not

It is not "add a tooltip that says maybe."
It is not N1 (rail seam across two parcels).
It is not "stop minting edges until labels are perfect."
It is not a sixth disposition. Do not widen `present` to admit a bad neighbor. Split the type or add a real state.

---

## Files to read, in this order

1. `_decisions/2026-08-30_honesty_contract_is_silence_legible.md`
2. `_inbox/2026-08-30_smartsite_mcp_app_v2_WDLL.md` items X1, X2, N1, D2, O3 notes in section 7
3. `_inbox/2026-08-28_smartsite_mcp_app_v1_scope.md` sections 9 (O3) and 10 (reciprocity)
4. `_inbox/2026-08-28_gold_34137_draw_dump.json` (atom bodies, not the serve projection)
5. `_inbox/2026-08-30_p91_p558_deploy.md` (live `draw.edges` shape)
6. `_inbox/2026-08-28_p87_draw_stub_WDLL.md` item 24 (atom-miss is unknown)
7. `_inbox/2026-08-30_ctx_execute_waves_WDLL.md` P4 edges row and the 154,841 / 826,569 split
8. `_inbox/2026-08-30_p91_qa_walk_five_parcels.md` only if you need the flood caveat or the envelope `agentGuidance` observation. Those five parcels had no rings (D7). They are not the 5-of-6 neighbor walk.

If you have Neon access, do not "fix" anything. A read that would help: for gold `48021:34137` and `48021:34169`, the four-plus-five `property-boundary-edge` rows, and whether 34137 edge 1 and 34169's reciprocal edge agree on length, bearing, and neighbor. State the query. Do not infer absence from an orphan.

## Questions the last seat wants attacked

Q1. Is "5 of 6 wrong" load-bearing, or is the defect the missing disposition even at n=1?
Q2. Can X1 run as a P5 scrub on already-warmed Bastrop edges without waiting for P4 mint of the 154,841?
Q3. Should a neighbor that fails X1 be deleted from the atom, overwritten from the reciprocal, or left in place and marked unverified for X2 to serialize as unknown?
Q4. Does O3 belong on the data team (confirm the ray-hit, stamp unverified) or only on the panel (already suppressed) plus X2 (do not emit the id as present)?
Q5. Is gating the marketed honesty claim on X2 correct, or does repairing the labels to a measured reciprocity pass close the claim without a new wire field?
Q6. Flood `present` + empty citations is a third honesty hole. Does it change how you would sequence A and B, or is it independent?

## Format of your return

Write for the operator. Short. No implementation plan unless you are refusing the split and proposing a different cut.

```
## Opinion
[one paragraph]

## Issue A
[what it is; what closes it; who]

## Issue B
[what it is; what closes it; who]

## On the proposed split
[accept / reject / amend, with the rejected second mechanism]

## Give the data team
[named items only]

## Do not give the data team
[named items only]

## Unverified
[each claim, what would falsify it]

leave_behind: none
```

Or name the leave-behind if you opened a thread.

---

# End of prompt

## 1. Conversation summary

Operator restated a 2026-08-28 design argument: Smart Site differentiates by making silence legible to a model, not by a verified "will not degrade." This walk found the section half working (envelope refusal + `agentGuidance`) and a new hole: edge neighbor and adjacency serialize as fact, and the operator reported five of six shared-boundary labels wrong. Integration filed the decision, added X2 on the v2 card, and OPS-16 A-052. Operator then asked whether this is a data fix for a pipeline team about to run CTX waves. Integration said half (X1/O3) is, half (X2) is cortex, and that P4 mint without X1 scales the defect. Operator asked for both issues in a handoff prompt so another agent can give an opinion.

## 2. Decisions reached

1. Marketed claim is silence-legible, not "will not degrade." Owner: operator. Reversal: X2 customer-done plus a Connect walk that shows the model hedging on a known-wrong neighbor.
2. X2 added on P-92. Marketing gated on it. Owner: operator via A-052. Reversal: if a measured reciprocity pass is ruled sufficient without a wire field.
3. Split recommendation (data gets X1/O3; property gets X2) is not a ruling. This document exists so a second agent can reject it.

## 3. Open questions

Q1 through Q6 in the prompt. Routing: the receiving agent. Next action: their opinion, then operator routes.

## 4. Artifacts produced

This file. Decision `_decisions/2026-08-30_honesty_contract_is_silence_legible.md`. WDLL X2. OPS-16 A-052. Scratch note on `_scratch/smartsite-ai-connector.md`.

## 5. Stakeholder updates needed

None until the opinion returns. Do not change directory copy or `_smartsite_masters/01` on this packet.

## 6. Context for the recipient

Read the eight files. The five-parcel QA walk is the wrong fixture for neighbor labels (no rings). Gold and the warm downtown cohort are the right ones. CTX P4 "edges" is coverage, not honesty. You are allowed to say the last seat is wrong.
