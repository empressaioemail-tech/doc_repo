---
id: 2026-09-01_p99_ghl_api_buildout_close
title: Close — P-99 Wave 0.4: GoHighLevel pipeline and tags, built through the API
date: 2026-09-01
last_updated: 2026-09-01
status: closed
applies_to: smart_site
plan_row: P-99
related:
  - _smartsite_gtm/06_consolidated_roadmap
  - _smartsite_gtm/04_gohighlevel_agent_runbook
  - _smartsite_gtm/05_ghl_chrome_runbook
owner: doc_repo planner
---

# P-99 Wave 0.4 close

Executed 2026-09-01 against sub-account `KtUXFiFB5e22abpLp1MR`, company `vKCvP5UtZmDLMD4A6T4F`, using the v2 Private Integration token held at `_secrets/gohighlevel-api-key.txt`.

**Credential hygiene, verified before use.** `_secrets/` is ignored at `.gitignore:2`, is untracked, appears in no `git status`, and `git log --all -- _secrets/` is empty, so it has never been committed. Token length 40.

**Credential proven live by paired control, not by a single success.** `GET /locations/KtUXFiFB5e22abpLp1MR` returned 200 and `GET /locations/ZZZZbogusLocation99` returned 403 on the same token in the same minute. A lone 200 would not have distinguished a working credential from an endpoint that answers anything.

## What was created

`Affiliate Recruiting`, pipeline id `POxG6ilXw5CyMHMDukJc`, six stages in the ordered sequence the runbook specifies: Identified, Contacted, Applied, Approved, Link Issued, First Conversion.

Ten tags, each returning 201 with a fresh id, so none pre-existed: `smartsite`, `tier-free`, `tier-solo`, `tier-studio`, `tier-team`, `source-affiliate`, `source-share`, `source-agent`, `source-organic`, `affiliate-partner`.

The vendor default pipeline `Marketing Pipeline` (`Smd0lYJNDuOgGLP2SmmH`) was renamed to `ZZ - unused vendor default` and hidden from the funnel and pie chart. It was renamed rather than deleted because deletion is irreversible and the runbook names rename as its documented fallback. Deleting it remains a one-line operator call.

## Verified by readback, and the readback found things the writes did not report

Pipeline and tag state was re-read from the API after writing rather than inferred from the create responses.

The tag readback returned thirteen tags, not ten. Three are vendor defaults that no create call revealed: `follow-up`, `high priority`, `warm lead`. They are harmless but they exist, and a count taken from the create loop alone would have said ten.

The create response for `Affiliate Recruiting` came back with `showInFunnel: false` and `showInPieChart: false` at the pipeline level despite every stage carrying true. That was corrected with a follow-up PUT and confirmed true on readback. Creating a pipeline and assuming it is visible would have left it invisible in the funnel view.

## A 200 that changed nothing, and the rule it produces

The first rename PUT returned HTTP 200. The readback immediately after still showed `Marketing Pipeline` with `showInFunnel: true`. The identical PUT re-run seconds later returned a body showing the new name, and the readback then agreed.

The mechanism this most likely is: read-after-write lag, with the collection GET served from a cache or replica that had not yet caught the write.

The second mechanism that would produce the same observation: the first PUT silently no-opped and only the second took effect. These cannot be distinguished from outside without running further writes against a live CRM, which is not worth doing to satisfy curiosity.

The operational rule stands either way, and it is the inverse of the usual trap. On this API a readback taken immediately after a write can report the pre-write state, so a single immediate GET is not sufficient to conclude that a write failed. Re-read after a delay before concluding anything, and never re-issue a destructive write on the strength of one stale-looking read. Had the rename been a delete, the naive response to that first readback would have been to delete twice.

The reason the first PUT's body was not available to settle this is that it was written to `/dev/null`. Capturing the response body of a state-changing call is not optional; the status code is not the record.

## What this did not do

No contact was created, modified, or deleted. No message of any kind was sent. No automation, workflow, or campaign was built. No `tier-` tag was applied to anybody, per the standing rule that a tier is written by the payment webhook and never by hand. The email sending domain, A2P 10DLC, social channels, the Private Integration permission transcription, and the demo-contact cleanup are all browser-only and remain with `05_ghl_chrome_runbook.md`.

## Still open on P-99

The product-to-CRM pipe is unbuilt and is Wave 3.3. It needs this credential in Secret Manager bound to cortex-api, because a file on the operator's disk cannot be read by a webhook handler.

The sub-account posture question raised by the Chrome runbook peel-off is now partly moot and partly sharper. The pipeline and the full tag taxonomy now exist inside the single existing sub-account, which is the state `02_gohighlevel_buildout.md` warned against creating before the posture was settled. Nothing has been migrated and no contact exists yet, so the cost of restructuring is currently zero and rises with the first real contact. That makes it the next thing to settle rather than a thing that was lost.

leave_behind: none
