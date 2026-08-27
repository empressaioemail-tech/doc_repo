---
id: otter_meeting_capture
title: Otter meeting capture — setup, sharing rules, and filing transcripts into canon
status: active
last_updated: 2026-08-27
applies_to: portfolio
owner: nick
related: [01_doc_conventions, 20_agent_operating_rules, 80_adrs/adr_030_declared_is_not_armed_contract_surface_governance, 76c_operator_master_next_steps]
purpose: How Otter is set up and used on this team, what the sharing defaults must be given that most calls are with counterparties, and where a transcript has to land before anything said on the call can be cited. Written as a follow-up for Jonathan from the Otter walkthrough; applies to everyone.
---

# Otter meeting capture

## Why this exists

Two reasons, and the second is the one that matters here.

Otter saves the note-taking. That is the obvious part. The part that is specific to us is that a call is not evidence until its transcript is filed. ADR-030 carries a line that is marked paraphrase only until the Otter transcript backing it is filed in tracked canon, which is exactly the failure this runbook prevents: a real conversation happened, the conclusion entered a document, and the source of it lives in one person's account where nobody else can check it.

So the setup below has two halves. The first half is Otter's own product, which is straightforward. The second half is what we do with the output, which is not optional.

## Setup, once

**Connect your calendar.** Otter joins meetings from your calendar by looking for events carrying a Zoom, Google Meet or Microsoft Teams link. Nothing without one of those links is picked up automatically.

**Decide which meetings it joins.** OtterPilot can be toggled on or off per meeting. The habit worth copying is checking the week's calendar on Monday and deciding then, rather than deciding in the thirty seconds before a call starts.

**Set your default sharing before your first recorded call, not after.** Account settings, meeting tab. Three defaults are offered: share with calendar guests, share with your team only, or keep private.

**Use team-only or private. Do not use share-with-calendar-guests.** Most of our recorded calls have a counterparty on them, and that default would send them our notes automatically, including whatever the summary chose to extract and whatever anyone highlighted mid-call. Share deliberately, per conversation, using the Share button on the conversation itself.

## In the meeting

OtterPilot shows up as a participant, named for you, so the room can see it is there. Say so at the top of the call anyway.

While it runs you get live notes and automatic screenshots of any screen share. You can highlight and comment inside the notes as the call happens, which is the cheapest way to mark a commitment or a number you will want to find later.

After the call you get a summary with action items and a longer outline. The conversation page switches between summary and transcript views.

## Straight after the meeting, the part people skip

**Fix the speakers and the words.** On the transcript view you can correct a mis-transcribed word and re-tag a speaker Otter got wrong. Do this while you still remember who said what. It also trains Otter, so the next call with the same voices is cleaner.

This matters more than it sounds. A misattributed sentence in a counterparty call is a wrong claim about what somebody committed to, and it is the kind of error that survives into a document and gets quoted six weeks later.

**Then file the transcript.** Export the transcript and drop it in the repo at:

    80_meetings/transcripts/<YYYY-MM[-DD]>_<topic>_otter.txt

Four are filed there today and they set the pattern: `2026-05-icc_ed_saler_api_licensing_call_otter.txt`, `2026-05-forest_forrest_consulting_call_otter.txt`, `2026-06-cotality_corelogic_gene_sales_engineer_call_otter.txt`, `2026-06-11_cotality_mcp_integration_hannah_call_otter.txt`. Name the counterparty and the subject, because the filename is what someone searches.

**The rule that follows from it.** Anything from a call that gets written into a decision, an ADR, or a doc cites the filed transcript. Until the transcript is filed, whatever you wrote is paraphrase, and it should say so in the text. This is not bureaucracy: it is the difference between a claim somebody can check and a claim they have to take on trust.

## Recurring meetings

Otter channels collect the notes from a recurring meeting in one place instead of scattering them down your conversation list. Create a channel in the left navigation, choose private or public within the workspace, invite whoever belongs in it, then connect the channel to the recurring event on the calendar panel. Every future instance lands in that channel.

Use it for anything with a standing cadence and more than one attendee. It is the difference between preparing for this week's call in ten seconds and scrolling back through three weeks of unrelated meetings.

## In-person meetings

Otter records in the browser or in the mobile app on iPhone or Android. Open it, tap record, and put the phone where it can hear the table. Everything downstream, summary, action items, transcript export, filing, works the same way.

## Otter Chat

You can ask questions across every conversation you have recorded, or scope the question to one meeting. The cross-conversation form is the useful one for us: what did they say about pricing, when did we first discuss the licence, who owned that follow-up. The single-meeting form is good for shaping a messy call into themes.

Treat its answers the way we treat any generated answer. It is reading transcripts that may still have a mis-tagged speaker in them, so check the underlying line before a claim from Otter Chat enters a document.

## The short version

Connect the calendar. Set sharing to team-only or private. Decide on Monday which calls it joins. Fix speakers and words right after the call. Export the transcript and file it under `80_meetings/transcripts/`. Cite the file, not your memory.
