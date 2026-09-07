---
id: OPS-20_thread_coordination_index
title: OPS-20 — Thread coordination index
status: active
last_updated: 2026-09-07
applies_to: portfolio
owner: doc-repo-6f (coordination seat)
related:
  - 90_operations/OPS-16_texas_market_plan_of_record
  - 90_operations/OPS-19_factory_plan_of_record
  - _decisions/2026-09-06_boundary_envelope_atom_program_scope
  - _inbox/2026-09-07_reports_courthouse_program_WDLL
  - _inbox/2026-09-07_integration_smart-site-ui-review-triage
  - _smartsite_gtm/09_crm_courthouse_agent_roadmap
  - _catalog/seat_register.json
---

# OPS-20 — Thread coordination index

## What this doc is, and is not

It is an index and an arbitration record across the concurrent doc_repo threads.
It names who owns what, where each program's roadmap lives, which lanes are loaded
by more than one thread, and how cross-thread items route.

It is not a plan of record and it creates no work. Every item of scope belongs to
one of the roadmaps named below and stays there. If this doc starts carrying items,
it has become the fourth roadmap it exists to prevent.

## Snapshot

Assembled by the coordination seat (`doc-repo-6f`) on 2026-09-07 against doc_repo
main at `4c6625d0`, live `gh`, `npm` and `gcloud` reads, worktree state on disk,
and direct confirmation from all three program threads. Each thread independently
verified the coordination role with the operator before accepting routing changes,
which is the correct posture and is recorded as such rather than treated as friction.

## The work streams

There are four, not three. The fourth is the residue of the UI review that is not
UI work. It was the hardest to see because it is sourced by one thread and driven
by another.

| Stream | Thread | Roadmap | Plan row |
|---|---|---|---|
| Data pipeline / boundary-envelope atom program | `doc-repo-2c` | `_decisions/2026-09-06_boundary_envelope_atom_program_scope.md` | P-121, filed by that thread |
| Reports + Courthouse | `doc-repo-3b` | `_inbox/2026-09-07_reports_courthouse_program_WDLL.md`, 27 items | P-120 |
| UI QA | `doc-repo-f9` | `_inbox/2026-09-07_integration_smart-site-ui-review-triage.md`, batches 1 to 6 | P-122, operator approved 2026-09-07 |
| Smart Site UI review backlog, non-UI residue | sourced by `doc-repo-f9`, driven by `doc-repo-2c` | the "NOT for this lane" section of the same triage doc | none |
| Coordination | `doc-repo-6f` | this doc | not applicable |

## Lane load

Ownership is by loading thread, not by repo. Two lanes are loaded by more than one
thread. That is not being unwound. It is recorded so neither thread assumes it has
a lane's full attention.

| Lane | Repo | Loaded by | Carrying |
|---|---|---|---|
| `cente-67` | hauska-engine | data pipeline and reports | atom program items 5, 7, 9; P-120 items 1, 5 to 14, 18 to 22, 25, 26 |
| `cente-c1` | legacy-design-tools | data pipeline, reports, UI review backlog | atom program item 2; P-120 items 2 to 4, 15 to 17, 21, 23; one billing bug |
| `cente-b9` | hauska-map | data pipeline drives, UI QA sourced | billing, attribution, the A-062/P-101/P-100/P-106 checklist |
| `cente-7d` | hauska-map (ui-qa worktree) | UI QA | batches 1 to 6 |
| `cente-65` | hauska-mcp-server | reports | P-120 item 27 |
| `cente-b5` | hauska-factory | data pipeline | factory health, tracked under OPS-19 |

## Contended resources

**Bare item numbering collides on shared lanes.** `cente-c1` holds an "item 2" from
the atom program (rewire `buildableEnvelope/derive.ts` onto the atom chain) and an
"item 2" from P-120 (confirm the `utilityService` rail for Bastrop). Same lane, same
words, unrelated work. Standing rule: every cross-lane instruction names its program,
never a bare item number.

**`buildable-display-vocab.ts` is claimed by three streams.** It exists twice, in
hauska-engine at `packages/engine-core/src/site-plan/` and hauska-map at
`apps/property-explorer/src/lib/`, each with a parity lock fixture. The UI lane
correctly declined to touch it during the Batch 1 sweep. P-120 item 5 is explicitly
about canonicalizing that vocabulary onto the report and PDF read path. The atom
program's drift thesis runs through it. Nothing lands here without the coordination
seat sequencing all three.

**`cente-67` splits by path, not by thread.** Agreed by both loading threads:
`packages/engine-core/src/site-plan/` and report composition to reports;
`packages/atoms/`, `packages/adapters/` and the writers to the data pipeline.

**`cente-b9` was understood three different ways.** The data pipeline thread drives
it, the UI thread sourced its backlog, the reports thread believed it idle. All three
readings were locally reasonable. The lane table above is authoritative.

## Corrections to the durable record

Each is a claim in a tracked artifact that live state does not support.

The `@empressaio/setback-corpus` publish is not blocked on an operator-provisioned
npm token. `hauska-setback-corpus` has zero Actions secrets configured, while
`hauska-atom-contract`, which published 1.31.0 successfully the same day, has
`NPM_TOKEN`. The new repo's `publish.yml` expects `secrets.NPM_TOKEN`. This account
namespace has no organization-level secrets to inherit from. The blocker is a secret
copied into a new repo, not a credential that does not exist.

The `hauska-mcp-server-p120-item27` entry in `_catalog/seat_register.json` states the
feasibility export route exists only on the unmerged hauska-engine branch
`feat/p32-feasibility-wave1`, and that item 27 cannot be verified end to end. That
branch merged as PR #380 on 2026-09-04, and the `feasibility-export` routes are on
hauska-engine main, confirmed by reading file contents. The stated blocker does not
exist. Merged is still not deployed and a live check remains owed.

The same entry points at `_inbox/2026-09-07_smart-site-ui-review_triage.md`. The real
file is `_inbox/2026-09-07_integration_smart-site-ui-review-triage.md`.

P-120 item 17's acceptance check reads "a decision record exists either way". That
check cannot be satisfied as written. The ruling already exists
(`_decisions/2026-09-01_owner_policy_and_portal_access_rulings.md`, 2026-09-03
addendum) and the lane still correctly declined, on the grounds that a planner-authored
artifact is not independently derivable evidence of operator authorization. Another
decision record does not discharge it. Direct human execution does.

P-120 item 27's declared dependency on item 6 was a soft sequencing preference, never
a technical block. The reports thread has amended the WDLL.

`hauska-mcp-server` PR #82 was relayed as open with CI running. It was created at
2026-09-07T14:43:53Z and merged at 14:45:21Z, eighty eight seconds later, all five
checks green. A lane self-report passed on without a live check.

The atom program's item 8 (rebake/publish trigger verification) was held internally as
Done on the strength of a status-screenshot summary line, while the program's own
roadmap table read "not started, flagged, not verified". Retracted by the data pipeline
thread 2026-09-07 on challenge. It is now unverified and gates item 9, which is the
correct state. This is the most consequential place for that error, because a wrong
Done here means the production backfill mints atoms that reach no consumer and reports
success.

**The pattern across these corrections is one failure mode, not six.** A claim degrades
between where it was established and where it was used. The ENEEDAUTH diagnosis existed
at the lane and arrived at the coordination seat as "blocked on a token only Nick can
provision". PR #82's merged state existed on GitHub and arrived as "open, CI running".
Item 8's unverified state existed in the roadmap and was used as Done. Item 27's blocker
was resolved on 2026-09-04 and was still being cited three days later. In each case the
original observation was sound and the relay was lossy. The instrument that fixes this is
not more careful reporting; it is reading the authoritative record at the point of use.

`hauska-map` PR #364 merged at 15:20:24Z under a title naming a two file styling fix,
carrying a ninety four file copy sweep. Content was reviewed before merge and nothing
harmful is in it. The UI thread has since imposed one branch and one PR per batch.

## Live production note

`hauska-retrieval-api` was serving a stale revision missing a fix that had merged to
main three times and never rolled out. Revision `hauska-retrieval-api-00080-yax` was
created at 2026-09-07T15:23:12Z and carries 100 percent of traffic; `/health`
returned HTTP 200 on independent probes at 15:27Z and 15:37Z. Resolved.

**The "crash looping" characterization is withdrawn as unestablished.** It reached this
seat in that form and was written here on that wording. The reports thread then checked
the retired revision's own conditions and found it reporting container-ready and
container-healthy at the Cloud Run infra level right up to its retirement at 15:24:48Z,
which is inconsistent with a boot crash loop and points instead at an application-level
failure on live requests. Confirming that needs request-level Cloud Logging nobody has
pulled. What is established is the stale revision and the missing fix. The failure mode
is not. This is a fifth instance of the relay-degradation pattern named above, and the
first one where this seat propagated it into the durable record rather than catching it.

**Outage window, as far as it is established.** The last deploy before the fix was
2026-09-06T22:08Z and the fix landed 2026-09-07T15:23Z. The three report PDFs that
opened the P-120 QA thread were generated at 00:58Z, 11:32Z and 11:54Z on 2026-09-07,
inside that window. The reports thread's judgment, recorded here rather than adjudicated
by this seat: the defects found are structured and internally coherent (a 20 sq ft
discrepancy, a well rendered present against an absence atom), which is not the usual
signature of a failing service, and the two load-bearing findings were established by
reading source rather than by observing rendered output, so they do not depend on the
question. Findings confirmed only by looking at rendered PDFs are being regenerated
against the healthy revision as part of `cente-67`'s remaining live-verification passes,
rather than treated as settled.

## Orphans and placement

| Item | Placement | State |
|---|---|---|
| Absence-vs-presence audit beyond the four fixed atom families | data pipeline | accepted |
| Bastrop `GEOMETRY-DIVERGE` on 48021:104120 | data pipeline | accepted, reproduced independently by `cente-67` |
| P-120 item 14 live re-verification after deploy | reports, `cente-67` | owned, not done |
| Flood report data not reaching the sharable section | reports, proposed | awaiting reports thread acceptance |
| Attached report documents failing to download | reports, proposed | awaiting reports thread acceptance |
| McLennan extractor: 1,706 real records unextractable | courthouse, P-113 leave-behind | unscheduled |
| Hays silent-fabricated-zero defect check | courthouse, P-113 leave-behind | flagged, not verified |
| Stale `p85ClerkPortalRegistry.ts` / `p85-clerk-portals.mjs` | courthouse, P-113 leave-behind | unscheduled |
| Four unidentified `hauska-map-*` Vercel projects | unplaced | flagged 2026-09-07 |
| Raw jurisdiction slug leak in X-Ray | reports | deliberately held pending P-120 item 7, not an orphan |
| Atom program item 9 rail-backfill list | data pipeline | believed to exist, does not; provenance being chased |

## The courthouse chain

Recorded here because it spans P-113, P-120 and the GTM roadmap, and no single
artifact carries the whole sequence.

The 2026-08-31 block-job audit measured 36 issued records-request jobs, of which
zero carried a block search term. Fourteen jobs on three parcels were digit-block
cases the retired `BLK(?:OCK)?` pattern could never match, since it expands to `BLK`
or `BLKOCK` and never `BLOCK`. Seven jobs on four parcels were letter-only blocks the
parser also missed. Together that is the 21-job consequence population on seven
parcels.

The parser fix landed and merged as `legacy-design-tools` PR #597. It was never
deployed: the post-merge workflow builds and pushes an image and skips every traffic
step. Deploying that image is a stated precondition of the re-run, which makes P-120
item 15 a hard predecessor of item 17.

The authorization is not outstanding. It was ruled 2026-09-01 and reconfirmed
2026-09-03, and the reliability lane independently re-verified every technical claim
in it and found it accurate. The lane still declined, reasoning that its dispatch
precommitted it against talking itself past a planner-authored authorization, however
well evidenced. That is a structural limit and it is correct. It closes only by direct
human execution.

## Operator rulings, 2026-09-07

**Setback corpus published.** `@empressaio/setback-corpus@1.0.0` is live on the npm
registry, verified by `npm view` rather than by the workflow's own report. The
blocker was a missing `NPM_TOKEN` on a new repo, not an absent credential; the
authoritative evidence was run `34133526571` failing with `npm error code ENEEDAUTH`
after lint, typecheck, test and build all passed. Operator set the secret, the
coordination seat triggered run `34140400126`, which succeeded. Thirty two
jurisdictions now have one published source. Consumer repointing and retirement of
the two vendored copies is the data pipeline thread's next step and follows the
retirement discipline: repoint first, retire second, divergence test between them
until the old copies are gone.

**Placeholder glyph is out of scope for the em-dash ban.** The `"—"` convention,
roughly ninety uses, is a symbol meaning "not included" or "no value", not prose.
The no-em-dash rule is a prose style rule. The UI lane was correct to leave it
untouched and the question is closed.

**A subset of those glyphs is a load-bearing sentinel, and is parked, not scheduled.**
In `recordsRequestClient.ts` a missing recording date becomes the literal string
`"—"`, which `records-chat-context.ts:47` then reads back with
`row.recordedAt === "—" ? null : row.recordedAt`. A display glyph is being used as a
data sentinel that travels between modules and is recovered by string comparison,
collapsing "no date on file" with "nothing looked". This is the pattern ENFORCEMENT
prohibits. It also explains why the Batch 1 subagent's eighty six file overreach was
correctly reverted: that sweep would have silently broken a data path. Operator ruled
2026-09-07 to leave it alone for now rather than widen scope. Recorded here so it is
not rediscovered as new, and deliberately not dispatched to any lane.

**Layer hover dot resolved in favour of the lane's third option.** The 2026-09-04
review said remove the hover popups; the earlier WB7c ruling said info tone stays
quiet and tooltip-only. The objection was to delivery, not to the information
existing. Approved fix: swap the raw browser `title` tooltip for `MapFlyTip`, the
app's own on-brand component already used in the same file, and scope the trigger to
the dot rather than the whole row label. WB7c's intent is preserved. The hold is
released.

## The courthouse sequence, corrected

The 21 held jobs do not form one population and must not be re-run as one.

The fourteen digit-block jobs are all Bastrop, across three parcels. They are clean
to re-run once P-120 item 15 deploys, and the operator tests them.

The seven letter-block jobs span four counties: one Bastrop, one Hays, four McLennan,
one Travis. McLennan's extractor cannot read its vendor's markup, so those four
refuse honestly rather than returning anything, which is safe but yields nothing until
the extractor is taught. The Hays job is the live risk: Hays was flagged and never
verified for the silent-fabricated-zero defect, the class that would have reported a
real 1,706 record hit as empty on McLennan. Re-running it unverified risks a confident
empty on a parcel that may hold records.

Consequently two of the three P-113 leave-behinds are not leave-behinds. The Hays
verification moves ahead of the re-run and gates correctness. The McLennan extractor
runs in parallel and gates only its own four jobs. Only the stale
`p85ClerkPortalRegistry.ts` reconciliation genuinely trails.

Item 15 is a hard predecessor of item 17 and the WDLL does not say so. Item 17 is
recommended for a split into the Bastrop fourteen and the letter-block seven.

## Routing

Cross-thread items route through the coordination seat. Items scoped wholly inside one
program stay with that program's thread, which continues to manage its own lanes and
sequencing directly. The operator communicates with any lane directly at any time;
routing through this seat constrains the threads, not him.
