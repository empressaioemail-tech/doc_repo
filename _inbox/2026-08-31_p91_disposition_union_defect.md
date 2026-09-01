---
id: 2026-08-31_p91_disposition_union_defect
title: CORRECTED. The stub/node disposition difference is a deliberate weakening in api-server, not a strengthening in the MCP. The planner's original mechanism was inverted
date: 2026-08-31
status: CORRECTED 2026-08-31. Original severity claim WITHDRAWN. A real but latent hazard remains and is hardened in p564.
plan_row: P-91
corrected_by: the p564 build lane, which read the api-server write path before implementing the brief and refused to build the check as specified
verified_by: planner, against artifacts/api-server/src/lib/smartSiteStub.ts at origin/main
---

# What this card originally claimed, and why it was wrong

It claimed that land use reading `unknown` at stub depth and `absent` at node depth on the same parcel was a defect in `artifacts/smartsite-mcp`: that the MCP node disposition union cannot express `unknown`, so `asExplicitDisposition("unknown")` returns null, `sectionDisposition` falls through to `derivedSectionDisposition`, and a cortex `unknown` is silently rewritten to `absent`. It called that a STRENGTHENING, the one direction the file's own comment forbids, and filed it as the highest-severity finding of the walk.

**The direction was backwards.** Verified at source in `artifacts/api-server/src/lib/smartSiteStub.ts` on `origin/main`:

    // Node section disposition into the rail vocabulary. `absent` (no
    // determination, no refusal) is `unknown` on the rail
      switch (disposition) {
        case "absent":
          return "unknown";

    state?: "present" | "absent" | "refused";   // the node type. No "unknown".

Cortex's node disposition type STRUCTURALLY CANNOT emit `unknown`. The node value is `absent`, and api-server's `railStateFromSectionDisposition` deliberately projects it to `unknown` for the stub rail, which is documented in that file's own header comment.

So the observed difference is not a rewrite in the MCP at all. It is api-server serving the same fact at two fidelities, and the stub is the vaguer one. `absent` to `unknown` is a WEAKENING, which is permitted: it converts a source's claim of no record into no claim either way. Nothing manufactures a claim anywhere in that path.

# What remains true, and it is smaller

The MCP code path is real. `EXTERNAL_BRIEF_SECTION_DISPOSITIONS` genuinely lacks `unknown` and `absent-verified`, and a section arriving with either would derive to `absent`. But **that branch is dead**, because nothing upstream can send those values at node depth. It is a latent hazard rather than an active defect: if cortex ever widens its node disposition type, the MCP would silently downgrade on the first payload and nothing would fail.

p564 hardens it anyway, which is correct. The union is widened, a recognised claimed state is preserved rather than derived over, and the derive path stays as the fallback for a genuinely missing or malformed disposition.

The agreement check p564 ships uses the VERIFIED mapping, node `absent` corresponds to stub `unknown`. The check this card originally specified, that the two must be equal, would have FAILED ON EVERY HEALTHY PARCEL carrying an absent facet. The lane read the write path, found the brief wrong, and built the correct check instead of the specified one. That is the behaviour the contract asks for and it is the reason this correction exists.

# The planner failure, stated plainly because the shape recurs

Three parties reported the stub/node difference: a harness chat holding ground truth, this planner, and a blind walk chat reading only the payload. The original card presented that as three independent confirmations. **It was not.** Two of the three were the same OBSERVATION. Only one mechanism was ever proposed, by the planner, and it was never checked against the producing side.

The planner did read a write path, and that is what made the error persuasive. But it read the CONSUMING side's write path only. Reading the consumer and inferring the producer is still output-measuring with respect to the producer, and this operation's own doctrine says code reading outranks output measuring precisely because the same predicates that admitted a defect will confirm it.

The rule that would have caught it is already written down and was not applied: state the mechanism you believe explains an observation, then state a second mechanism that would produce the same observation and why you rejected it. A deliberate stub-side projection is an obvious second mechanism for "two depths disagree", it was never named, and it was the right one.

The convenient part is what should have raised suspicion. The finding arrived pre-packaged as a violation of an invariant stated in a comment eleven lines above the function, which made it feel discovered rather than assumed.

# Consequences to unwind

The walk results doc listed this as finding 1, ours, highest severity. That entry is corrected alongside this card.

No dispatch acted on it. The property-seat mission did not carry it, so nothing was built on the wrong premise outside this repo.

The stub/node fidelity difference is still worth a product question, separately and at much lower severity: a reader seeing `unknown` on the board and `absent` on the panel for one facet has to know that the board is deliberately vaguer. That is a UX legibility question about two fidelities, not a correctness defect, and it should not be carded as one.
