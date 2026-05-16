---
name: conversation-handoff
description: "Package the current strategic conversation into a structured handoff document for cases where the work needs to be handed to a different context, agent, or session. Use this skill when the operator says 'hand this off', 'package this for the next session', 'send this to <other agent>', or when the work needs to be filed in a different repo or shared with a counterparty agent. For normal session-close work in this repo, use the session-close protocol in CLAUDE.md and 90_runbooks/session_close_template.md instead, which is more efficient since Claude Code writes and commits directly."
---

# Conversation Handoff

Packages a strategic conversation for handoff to a different context.

## When this triggers

When the work needs to leave this repo or this session and land somewhere else. Examples:

- Handing strategic decisions to a counterparty (Mox CEO prep doc)
- Sending a session to a different repo (smartcity-os, hauska-sdk, etc.)
- Producing a briefing for a stakeholder who will read it outside this conversation
- Creating context for a separate agent session that does not have access to this repo

For normal in-session strategic work that ends with a session close in this repo, use the session-close protocol in CLAUDE.md. Session close uses `90_runbooks/session_close_template.md` and Claude Code commits directly; this skill is unnecessary for that case.

## What this produces

A self-contained markdown document. Sections:

### Header

```
Filed: YYYY-MM-DD
From: Claude Code (P:\doc_repo strategic session)
To: [destination]
Re: [one line topic summary]
```

### 1. Conversation summary

Two or three paragraphs capturing what the conversation covered, what frame was used, what was decided. High signal; not exhaustive.

### 2. Decisions reached

Numbered list. Each decision:
- The decision in one sentence
- Reasoning in two or three sentences
- Owner (Nick, Valerie, counterparty, etc.)
- Reversal criteria

If no decisions reached, state "No decisions reached" and explain why.

### 3. Open questions

Numbered list. Each open question:
- The question in one sentence
- Why it is open
- Recommended routing
- Recommended next action

### 4. Artifacts produced

List of files, drafts, or other artifacts. For each: filename, brief purpose, where it should be filed.

### 5. Stakeholder updates needed

Stakeholders who need to be communicated to about this work, and the message for each.

### 6. Context for the next session or recipient

What the next session or recipient needs to inherit: which files, which prior decisions, which time-sensitive items.

## Conventions

- No em dashes or en dashes
- Reference canonical docs by their numbered slot (e.g., `51_substrate_v1_sprint.md`)
- Length proportional to the topic; do not pad

## What this skill does not do

Does not execute. Just packages.

Does not file automatically. Operator routes the document to its destination.

Does not duplicate session-close work. If the work belongs in this repo as a session summary, use session-close instead.

## Example invocation

Operator: "Package this Mox conversation so I can drop it into the Mox prep folder."

Skill response: Produces the structured handoff document covering the Mox-relevant decisions, the artifacts produced (the updated talking points draft, the reframing rationale), and the next-conversation context (which Mox prep docs to bring into the next CEO meeting). Waits for operator review before filing.

End of skill.
