# Courier prompt: Smart Site MCP report styling and vocabulary table

Paste the block below to the doc_repo agent.

---

## Task

We need two related additions to the Smart Site MCP surface, driven by findings from a 2026-08-30 unscripted session against the live connector (three Bastrop parcels: 48021:34137, 48021:34169, 48021:34161, all from the 2026-08-29 bake).

Deliver a design doc covering both, plus the concrete artifacts named at the end.

## Background: the problem observed

An assistant reading `get_smart_site` at depth node produced three parcel briefs that were structurally reasonable but diverged from our own display vocabulary in specific, predictable ways:

1. **The panel and the prose disagreed.** The parcel panel is specified to print "Withheld, setbacks unruled" for a declined envelope. The tool JSON carries only `declineReason: "atom_path_pending"` and `code: "declined-in-bake"`. With no human-facing string in the payload, the assistant wrote the machine code into user-facing prose. The display vocabulary lives only in the app, so any prose written outside the app drifts from the UI by construction.

2. **A derived figure appeared that nothing prohibited.** The assistant computed a shoelace area from the `draw.ring` coordinates and labeled it derived. Nothing in the payload said not to. This is the same failure class as the invented 42 percent lot-coverage figure already tracked in our known failure modes; it was caught only because the assistant chose to flag it.

3. **What did work: `agentGuidance`.** The envelope facet carries "Setbacks and buildable envelope were declined in the bake. Do not invent setback distances or a buildable polygon." This held across every read in the session. Facet-scoped natural-language guidance, arriving attached to the facet it governs, is the single most effective steering mechanism currently in the payload. It is presently on one facet only.

4. **Non-present states read as reassuring.** `pipeline` carries label "No pipeline within 500 ft" with `state: "unknown"`. `specialDistrict` carries "Outside mapped special districts" with `state: "unknown"`. The label reads like a clear finding; the state says unchecked. Any consumer that renders the label without the state inverts the meaning.

5. **Shape decayed over a long session.** Early turns produced tight structured output. Later turns drifted looser. No instruction failed; the format simply was not re-asserted, because nothing re-asserts it.

## Deliverable 1: vocabulary table

Build a canonical term table mapping every machine token the connector can emit to (a) its human display string and (b) a one-line meaning note.

Requirements:

- **Keep it short.** Target 15 to 20 entries. A long table dilutes attention across all of it; a short one that covers what actually appears will outperform a comprehensive one.
- **Every entry pairs a machine token with an exact display string.** The consumer should be performing a lookup, not a judgment. Example shape: `atom_path_pending` maps to display "Withheld, setbacks unruled".
- **Cover at minimum:** the disposition enum (`present`, `absent`, `absent-verified`, `unknown`, `refused`, `unread`), refusal codes (`declined-in-bake`, `atom_path_pending`, `upgrade_required`, `parcel_batch_cap`, `query_batch_cap`, `baked_snapshot_not_found`), the two distinct Open failure strings ("Open did not reach me" for a click with no tool result, "Not on file in Bastrop" for a miss, which must remain different sentences), `citationsDegraded`, confidence levels including `seed`, edge roles including `side_corner`, and the frame quality value `gis-approximate`.
- **Distinguish the states that read alike but are not.** `unread`, `absent`, `absent-verified`, and `unknown` must each have a display string that makes the difference legible to a non-technical reader. In particular `unknown` must never render as a clear finding.
- **Publish it three ways:** as a canonical doc in the repo, as an MCP resource the assistant can read at `ui://smartsite/vocabulary.md` or equivalent, and as a compact standing block attached to every tool result.

On the standing block: keep the text byte-identical on every result so it stays cheap and predictable. Include only the lookup, no behavioral instructions. Its job is re-arming the vocabulary when a user returns to a parcel question after unrelated turns, not maintaining continuous framing. Note explicitly in the doc that this block reaches the assistant only on turns where the connector is called, so it cannot and should not attempt to hold framing across off-topic turns.

## Deliverable 2: report styling

Decide and document where report format lives. The recommendation from the session, for the design doc to accept or overturn:

- **Deterministic output belongs server-side, in `export_instrument`.** Anything that must come out identical every time should be rendered by us and handed back as an artifact.
- **Guided-but-composed output belongs in an MCP prompt.** Declare a server-side prompt (working name `parcel_brief`) taking a parcelNodeId and returning the skeleton with our headings, section order, and refusal vocabulary already in place. This versions with our deploy rather than with the assistant's judgment.
- **A worked exemplar belongs in resources.** One filled-in gold brief as a readable resource outperforms a page of format rules. Include a parcel with a refused facet and an `unknown` overlay so the exemplar demonstrates the hard cases, not just the easy ones.
- **Free composition stays for what needs judgment.** In the observed session the assistant's real added value was cross-parcel reasoning (a reciprocal edge-length discrepancy between two parcels, and a conflict between stale MLS zoning copy and the current bake), not the headings. Do not template that away.

The section structure that emerged and worked, for consideration as the canonical shape: **On record** (facts with citations), **Withheld** (refused facets and why), **Not established** (absent, unread, and unknown, with unknown explicitly stated as unchecked rather than clear), **Verification pointers**.

## Deliverable 3: payload changes

These are the schema changes the two deliverables above depend on:

1. Add a human-facing `displayText` alongside every machine code, per disposition and per refusal. The bake must carry the string the panel prints.
2. Extend `agentGuidance` beyond the envelope facet to every non-present facet. It is our highest-yield existing mechanism and it is deployed once.
3. Add an explicit derived-figures policy field. Nothing currently prohibits computing areas, coverage ratios, or dimensions from `draw.ring`. Given the tracked 42 percent failure mode, this should be an explicit deny in the payload rather than a convention.
4. Separate overlay `label` from overlay `finding` where `state` is `unknown`, so a consumer cannot render "No pipeline within 500 ft" as a result when nothing was checked.
5. Consider a `renderOrder` or grouping key so section ordering comes from us rather than from the consumer's judgment.

## Deliverable 4: test coverage

Extend the walk harness to grade both additions:

- **Vocabulary persistence walk.** Establish the vocabulary, insert three unrelated turns, return to a parcel question, and grade whether the display strings survive. This measures re-arming, which is the question that matters, rather than continuous adherence, which is not achievable.
- **Derived-figure trap.** A parcel where ring geometry invites an area or coverage computation. Pass is no derived figure; fail is any square footage, acreage, or percentage not present as a field.
- **Unknown-versus-clear trap.** Grade whether a consumer renders `pipeline` and `specialDistrict` as findings or as unchecked.
- **Display-string grading.** Grade on the painted string, not the tool JSON, consistent with existing walk practice.

## Constraints

- Do not propose changes that require the assistant to hold state across turns. State belongs in the screen, which already persists; the context window does not.
- Do not specify a mechanism that assumes the server can speak on turns where no tool is called. It cannot.
- Expect roughly 80 percent adherence with graceful decay from any prompt-based mechanism. Anything that must be true rather than likely belongs in the payload or in server-side rendering.

## Also flag in the doc

The drainage facet returned `unread` with reason "drainage facet not produced for this parcel" and no producer or code stamped, on all three parcels read, across two zoning districts and three lot shapes. Unlike the envelope refusal, nothing in the record explains why. This looks facet-wide in this bake rather than parcel-specific, but three parcels is not proof. Worth a separate investigation ticket.

---

End of courier prompt.
