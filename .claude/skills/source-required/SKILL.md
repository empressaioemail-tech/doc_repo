---
name: source-required
description: "Enforce source attribution on factual claims being committed to company intelligence. Use this skill whenever the conversation involves claims about jurisdictions, counterparties, market data, regulatory status, competitor positioning, technical specifications, or any assertion of fact that would inform a decision or enter durable artifacts. Trigger automatically whenever a factual claim is made; do not wait to be asked. Without this skill, hallucinations and unverified assumptions slip into company intelligence and compound."
---

# Source Required

Enforces attribution discipline on factual claims.

## When this triggers

Every time a factual claim is made in conversation, especially when:
- The claim is about a jurisdiction (city, county, state) and its rules, status, or politics
- The claim is about a counterparty (Mox, Bastrop, Sylvia's network, MGO, an ICC term, a county CAD director, an attorney, an insurance carrier)
- The claim is about market data (pricing, deal flow, competitor moves)
- The claim is about regulatory status (a permit rule, a code section, an environmental designation)
- The claim is about technical specifications (an API, a software product feature, a version, a vendor)
- The claim is going into a decision-log entry, a stakeholder update, a session summary, or any durable artifact in the canonical doc set

## What this checks

For each factual claim, ask: where did this come from?

Acceptable provenance:
- Operator direct knowledge ("I talked to Sylvia yesterday and she said X")
- Canonical doc in this repo, verified by `view` in the current session ("per `51_substrate_v1_sprint.md` line 47")
- Cited web search result with URL
- Cited document with file path and date
- Cited Pipedrive, CRM, or ECI record with ID
- AI agent reasoning explicitly framed as inference (not fact)

Unacceptable provenance:
- "I recall reading somewhere"
- "I think this is generally true"
- "It is commonly understood"
- Pattern matching without verification (an LLM trap)
- Confident assertion with no source
- Memory from prior sessions without re-verifying against the canonical doc this session

## What this does on detection

If a claim has acceptable provenance, append the source inline or as a note.

If a claim lacks provenance:

1. Pause before committing the claim to any artifact
2. Ask the operator: "I am about to assert [X]. Where does this come from? If you do not have the source, I can search to verify, or we can flag this as inference rather than fact."
3. If operator confirms it is operator direct knowledge, log as operator-attributed
4. If operator does not have source, either run a verification search (web_search) or read the relevant canonical doc (`view`) or flag the claim as unverified in the output

## Routing unverified canonical-doc claims

When a factual claim depends on the content of a canonical doc (an ADR, a sprint plan, an atom spec, a runbook) and that doc has not been read with `view` in the current session, do not accept the claim by paraphrase or memory. The verbatim read is the verification.

Use the `view` tool. The full file is in this repo and directly readable. If the file is large, view the relevant section by line range. Reading a 300-line ADR is cheap; relying on a stale paraphrase is expensive.

If the claim depends on a doc outside this repo (an external partner doc, a vendor spec, an Anthropic doc), use `web_fetch` if a URL exists, or flag the claim as agent-attributed pending external verification.

## Inference framing

Not all useful statements are facts. Inferences are useful but should be framed as such:

- "Based on the proposal Mox received, they will likely want to discuss [X]" - inference, fine
- "Mox will want to discuss [X]" - asserted as fact, requires source

The skill should rewrite confident assertions as inferences when source is missing rather than letting them pass.

## Special case: cross-conversation memory

Claims from prior sessions are not facts in the current session; they are recall. The skill should treat them as "in the 2026-05-16 session we noted X" rather than "X is true." If X needs to enter durable artifacts now, verify against the actual canonical doc this session via `view`.

This applies even when the prior-session claim is plausible and consistent with the rest of the conversation. Plausibility is not verification.

## What this skill does not do

Does not stop creative exploration. Brainstorms, hypotheticals, and what-if scenarios are not factual claims and do not need provenance.

Does not interrupt rhetoric or framing. The structural commitments and decision rules from CLAUDE.md are operating principles, not factual claims; they do not require fresh sourcing every time they are invoked.

Does not require academic-grade citation. A pointer to a doc with line numbers, a quote from a stakeholder, or a search result URL is enough.

## Example invocation

In conversation, the operator asks: "What is MGO's current contract structure?"

Without this skill, the agent might say: "MGO operates under exclusive contracts with cities..."

With this skill, the agent says: "I do not have a verified source in this session for MGO's current contract structure. There is competitive intel in this repo; I should check `13_risk_register.md` and search `_sessions/` for prior MGO research before answering. Want me to do that now, or treat this as recall and flag for re-verification before any commitment hinges on it?"

Second example. A prior session's summary says: "ADR-007 already covers stakeholder access for the construction lifecycle." This is recall, not verification in this session. The skill response: "Flagging as recall pending re-verification. Reading `80_adrs/adr_007_cross_stakeholder_atom_access.md` now via view before this enters the decision record."

The discipline is to make uncertainty visible rather than hiding it under confident phrasing.

End of skill.
