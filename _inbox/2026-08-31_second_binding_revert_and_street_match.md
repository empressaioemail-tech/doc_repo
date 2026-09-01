---
id: 2026-08-31_second_binding_revert_and_street_match
title: The Neon binding reverted a SECOND time, on a second service, and broke MCP writes for two and a half hours. Plus a street-search matching question
date: 2026-08-31
status: binding revert FIXED and recorded; street-search matching OPEN and owned by the property seat
plan_row: P-91
---

# Part 1. The second binding revert

## What happened

`smartsite-mcp-00080-xum` was deployed at 13:49Z through the deploy workflow, twenty-four minutes BEFORE LDT #564 merged at 14:13Z. That workflow still carried `--set-secrets=DATABASE_URL=DEPLOYMENT_DATABASE_URL:latest`, the pooler, so the deploy wrote the pooler binding into the SERVICE SPEC.

It served 100 percent from 13:49Z until 16:2xZ. **MCP writes were broken that entire time**, roughly two and a half hours: `create_screen`, `save_property` and `set_property_status` all write, and the Neon pooler is injecting read-only on that database. Reads stayed green, `/health` answered `ok` throughout, and nothing alerted.

## How it was caught, and how it was NOT caught

Not by monitoring. Not by a health check. Not by a user report.

It was caught because the p565 canary failed a pre-shift gate. `gcloud run deploy --image` inherits the existing service spec, so the canary silently picked up the poisoned binding without anything in the command asking for it, and the gate read the secret binding before any traffic moved.

That gate exists because of the cortex-api version of exactly this failure earlier the same day. It has now caught the same class twice in one session, on two different services.

## What this proves about the #564 fix, precisely

#564 puts the direct endpoint in the workflow files, which prevents the FUTURE case for both services. It could not repair a revision deployed before it merged, and it did not.

So the fix is correct and its coverage has a start time. Any revision created before 14:13Z carries the old binding, and any later `--image`-only deploy inherits it from the spec. That inheritance is the part that is easy to miss: the workflow is fixed, and a hand deploy can still propagate the old value forward indefinitely until something forces the secret.

**Standing rule from this:** every deploy of either service reads the new revision's `DATABASE_URL` secretKeyRef by field name and confirms `DEPLOYMENT_DATABASE_URL_DIRECT` BEFORE shifting traffic, regardless of how the deploy was triggered. Health checks cannot see this; the whole failure is write-only.

## The fix applied

Redeployed the identical p565 digest with `--update-secrets DATABASE_URL=DEPLOYMENT_DATABASE_URL_DIRECT:latest` as `smartsite-mcp-00083-dun`, re-gated on binding, digest and health, confirmed the other secrets (`SERVICE_API_KEY`, `WORKOS_CLIENT_ID`) were preserved, then shifted. The write outage ended at that shift.

## Still unmeasured, and it should not be left that way

Nobody has counted what failed during those two and a half hours. Any `create_screen`, `save_property` or `set_property_status` attempted between 13:49Z and the shift returned an error, and the user saw it, so this is not silent to THEM. Worth reading the MCP logs for 5xx on tool calls in that window and, if any real user attempted a save, saying so rather than letting it pass. **A missing count is not a zero.**

# Part 2. street-search matches on a token, not a street

Measured live, authenticated, 2026-08-31:

    GET /place/street-search?q=Pine St, Bastrop&countyFips=48021

Returns, among others:

    48021:111146  178 PINEHILL DR , BASTROP, TX 78602
    48021:117885  190 PINE TREE LOOP UNIT, BASTROP, TX 78602
    48021:133055  121 PINECREST DR, BASTROP, TX 78602
    48021:140877  155 ROYAL PINES DR, BASTROP, TX 78602

None of those is Pine St. The match is on the token `PINE` rather than on the street.

This is a quality question rather than a correctness bug, and it needs a ruling before the selector is put in front of a customer, because the failure mode is confident: a user asking for everyone on Pine St gets a plausible list containing four different streets, and nothing in the response says the match was fuzzy. That is the same shape as every other finding this program has cared about, an answer that looks complete and is not.

The honest options are a stricter match on the street name with the suffix respected, or keeping the broad match and DECLARING it, so the response states that it matched on a name fragment and lists the distinct streets it found. The second is cheaper and arguably better, since a user searching a partial name may well want the neighbours.

Owner: property seat. Not urgent, and it should not ship to a customer surface unruled.
