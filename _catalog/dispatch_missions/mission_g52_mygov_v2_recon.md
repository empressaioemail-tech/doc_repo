# MISSION — MyGov recon in smartcity-dashboards (READ-ONLY)

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

READ-ONLY. Do NOT write, edit, commit, push, or modify ANY file in ANY product repository.
Do not run npm/pnpm install or any build. Do not check out, pull, reset, or alter repo state.
Your ONLY write is your report file named at the end of this mission.

## CRITICAL: the working tree is stale

Repo: `/p/smartcity-dashboards` (GitHub empressaioemail-tech/smartcity-dashboards).
The local working tree is **43 commits BEHIND** origin/main. Reading it gives WRONG answers.

Read the authoritative ref instead, each command bounded by `timeout 120`:
  timeout 120 git -C /p/smartcity-dashboards log origin/main --oneline | head -60
  timeout 120 git -C /p/smartcity-dashboards grep -n -i <pattern> origin/main
  timeout 120 git -C /p/smartcity-dashboards show origin/main:<path>

origin/main is at `86487fa` (2026-09-04). Declare repo, ref and commit SHA in your first output line.

## Context

This is the NEW v2 city dashboards product, multi-tenant via "city packs". `template-city` is
the public demo pack; `bastrop_tx` is the real, auth-gated Bastrop tenant. Bastrop's permitting
vendor is MyGov, which REFUSED to give us API access.

A STANDING PROHIBITION dated 2026-08-17 records MyGov on this product as "Not connected", with
the explicit instruction "Do not copy `mygov_permits` into Dashboards Neon" and "Do not start G-52".

But the deployed Cloud Run service carries revisions tagged `g116-mygov-live`, `g116-mygov-rest`,
`g116-vendor-auth`, `g116-honest-tiles`, `g116-field-enrich`, `g116-cip-enrich`, `g117-property-map`,
`g117-overlay-layers`, `g117-full-catalog`. NONE of that work has a governing plan row in canon.
So either the prohibition was superseded by a decision, or it was crossed.

## The question that matters most

Is MyGov data being READ LIVE, or has it been COPIED into this product's own database? And if
data flows at all: is it strictly scoped to the `bastrop_tx` tenant, or does it reach any shared,
public, or parcel-level surface? Those two have very different consequences.

## Establish, with evidence

1. Every MyGov-related code path on origin/main. Grep case-insensitively for mygov, my_gov, MyGov
   across all file types. Report every hit with file and line.
2. What the g116 mygov work actually built. Find the commits behind those tags via
   `git log origin/main` (look for g116/g117 in messages or PR numbers). Summarize each; quote diffs
   where they matter.
3. READ vs COPY. Does this product make live outbound calls to obtain MyGov data, or read it from a
   table in its own Neon DB? Look for table definitions, migrations, schema files, any table like
   `mygov_permits`. If a table exists, give its DDL.
4. Where the data comes FROM. MyGov has no API, so if it is not calling MyGov directly, what is the
   upstream? Does it call the v1 `smartcity-os` app or its API? A shared database? Name hosts, URLs
   and env var NAMES (never values).
5. Tenant scoping. Trace whether MyGov-derived data is gated to `bastrop_tx`. Is there a grant or
   adapter model (`grantedAdapters` has been referenced)? Is the data reachable from `template-city`
   or any unauthenticated route? Answer by reading routing and authorization code, not by guessing.
6. `g116-vendor-auth`. What vendor, what auth mechanism, what credentials (env var NAMES only)?
7. Does ANY MyGov data reach a parcel-level or public surface? This is our hardest line. Trace whether
   permit data can populate a parcel record, a public rail, a map layer, or an anonymous endpoint.
8. Plan review linkage. Any code connecting permits to a plan-review product? Grep plan-review,
   planReview, engagement, submittal, intake.

## Method requirements

- ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched. "I grepped these patterns across
  origin/main and found nothing" is acceptable; a bare "there is no X" is not.
- State the mechanism you believe explains an observation, THEN state a second mechanism that would
  produce the same observation and why you rejected it.
- Quote real code with real paths and line numbers from the origin/main ref.
- Never print secret VALUES. Env var names only.
- Separate what the code CAN do from what is DEPLOYED and running.
- Every verification command must be exit-bounded (`timeout 120 ...`). Never run a command that waits
  for input or does not terminate.

## Close

Write your report to `_inbox/2026-09-14_g52_mygov_v2_recon.md`.
Lead with a direct verdict on the central question: is MyGov data live-read or copied, and is it
tenant-scoped or leaking. Then the numbered sections. End with "What I could not determine and why."
