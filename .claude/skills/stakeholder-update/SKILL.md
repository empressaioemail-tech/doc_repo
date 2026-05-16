---
name: stakeholder-update
description: "Draft a status update, message, or briefing in the voice and depth appropriate to a specific stakeholder. Use this skill whenever the operator says 'message Sylvia', 'update Valerie', 'brief Nick', 'send to Mox', 'tell the team', or names any stakeholder and a need to communicate. Also use proactively when a decision has been logged that affects stakeholders who were not in the conversation."
---

# Stakeholder Update

Drafts communications tailored to the recipient.

## When this triggers

When the operator names a stakeholder and indicates they need to receive an update, status, briefing, or message. Also trigger when a decision-log entry creates implications for stakeholders not in the originating conversation.

## Stakeholder voice profiles

These are starting points, not rigid templates. Adjust based on the actual relationship and the specific topic. See `18_stakeholder_graph.md` for canonical stakeholder reference.

### Sylvia Carrillo (municipal network anchor)

- Voice: warm but professional, focused on city-side outcomes
- Depth: enough to brief other city managers; light on technical detail unless asked
- Lead with: city benefit (less external consultant spend, faster review, lower fees, more control)
- Avoid: AI jargon, atom architecture details, capital structure language
- Format: email or text appropriate; concise

### Valerie (commercial and GTM lead)

- Voice: direct, deal-focused
- Depth: enough to position in pipeline conversations; specifics on tier and pricing if known
- Lead with: deal implications, talking points she can use with customers
- Avoid: meta strategic frames unless they change her pitch
- Format: structured note or Slack

### Nick (operator, all decisions)

- Voice: precise, technical, doc-repo-fluent
- Depth: high; reference canonical doc slots (51, 11a, 30a, ADR-008, etc.)
- Lead with: architectural implication or decision needed
- Avoid: hand wavy reasoning; he wants specifics
- Format: structured markdown, sometimes filed at `_sessions/`
- Note: drafting "to Nick" is uncommon since Nick is the operator running these conversations. Use this profile when Nick will hand a doc to a separate context (his own notes, sharing with co-founder, etc.).

### Kendra (operations and scheduling)

- Voice: practical, time-aware
- Depth: low technical, high logistics
- Lead with: dates, deliverables, scheduling implications
- Format: concise, actionable

### Dev (ECI user)

- Voice: peer to peer
- Depth: medium technical, ECI-specific
- Format: short notes

### Mox CEO (active prospect)

- Voice: peer to peer, operator to operator
- Depth: business and strategic; technical only when asked
- Lead with: business outcome, not capability list
- Avoid: pitch tone; he has the proposal already
- Format: email or follow-up conversation summary

### Valerie Thompson (eXp Realty, CMA user)

- Voice: friendly, real estate practitioner
- Depth: low technical, high practical
- Lead with: what this means for her listings or comps
- Avoid: catalog or atom terminology
- Format: short message

## What this skill produces

A drafted message in the appropriate voice. The skill should:

1. Identify the stakeholder from the request
2. Pull voice profile from above (or improvise if stakeholder is novel)
3. Draft the message with appropriate tone, depth, and format
4. Flag any items in the draft that need operator review before sending

If the stakeholder is unfamiliar, ask one clarifying question about their role and relationship before drafting.

## Conventions

- Match the operator's preference for no em dashes or en dashes and minimal symbols
- Length proportional to the topic; do not pad
- If the message communicates a decision, reference the decision_id from decision-log
- If the message references work in progress, reference canonical doc slots

## What this skill does not do

Does not send messages. Drafts only. Operator reviews and sends.

Does not invent details. If the operator has not provided specifics, ask before fabricating.

## Example invocation

Operator: "Update Sylvia on the Mox reframing in case she gets asked about it."

Skill response: Drafts a short note to Sylvia explaining (in city-friendly terms) that the multifamily catalog work with Mox now positions Mox as a design partner rather than a custom build, that this strengthens the case for similar partnerships with cities, and that Sylvia can mention this if a city manager peer asks about the multifamily vertical. No technical detail beyond what is necessary. Flags one item (share Mox's specific name only if Sylvia is briefing someone who already knows) for operator review.

End of skill.
