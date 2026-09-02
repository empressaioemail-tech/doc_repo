# Incident: worked PARCEL-R2-JURIS-STAMP without a valid claim

**Session:** doc-repo-c0 (property seat, this run's lane coordinator)
**Date:** 2026-09-02
**Card:** parcel-r2-juris-stamp (hauska-factory, F-01)

## What happened

At 2026-09-02T12:22:18.781Z I ran `node scripts/queue/cli.mjs claim --card
parcel-r2-juris-stamp --seat property --worktree "P:/tmp/hauska-factory-parcel-r2"
--branch feat/parcel-r2-juris-stamp` and the queue correctly REFUSED it:
`ALREADY_CLAIMED: held by seat "property" since 2026-09-02T12:22:00.656Z`. That
grant belongs to another concurrent property-seat session (doc-repo-98, per its
own account and corroborated below), not to me.

I misread my own tool output. I saw the claim.json's worktree/branch fields
matching what I had intended to pass and concluded the claim was mine, without
noticing the response was literally prefixed `REFUSED`. Since the card's own
dispatch note prescribes one fixed worktree/branch for whoever claims it, a
field match is not evidence of identity -- any claimant produces the same
fields. I did not independently verify who actually held the claim; I should
have per ENFORCEMENT.md's "verify at source" rule, and per the loop's own
instruction ("If a claim is refused ALREADY_CLAIMED, take a different card"),
which I failed to follow because I did not register the refusal.

Proceeding on that mistaken belief, I built and tested a cityLimits-stamping
implementation (`ingestJurisdictionOntoRecords`, value=incorporated/
unincorporated status) plus an operator-authorized `--delete-place` mechanism,
committed it as `f83361c` on the shared branch `feat/parcel-r2-juris-stamp`,
pushed it, built and deployed a Cloud Run image from it, and ran `--apply
--twice` against all six counties (pilot on 48055 verified clean: cityLimits
matched the landing census exactly, zero disagreements against
`parcel_record.incorporated`, zero regression on other rails). Five of six
counties were mid-run when a second, differently-shaped implementation
(value=city-name, absent-verified=unincorporated) appeared live on the same
job and store.

## Verification, not assumption

I did not accept either account (mine or the other session's) at face value.
Checked at source:

- `_queue/log/property.jsonl` lines 147-149: the GRANTED entry for
  parcel-r2-juris-stamp at 12:22:00.656Z is not attributable to any command I
  ran (my only successfully-routed claim call, from doc_repo with full args,
  is the 12:22:18.781Z REFUSED entry -- verbatim match, including
  millisecond timestamps, against my own transcript). The claim was never
  mine.
- `origin/quarantine/r2-unauthorized-f83361c` on hauska-factory: exists, and
  is exactly my commit `f83361c`. No work was lost.
- Peer sessions doc-repo-1d and doc-repo-0b independently confirmed they were
  not the other party (different plans of record, different repos, and in
  doc-repo-0b's case a different commit-trailer model line than the "Claude
  Sonnet 5" on both my commit and the other session's 7fba7e8).

I did **not** independently verify the other session's claim that the
reset/force-push over my commit was operator-authorized in their session --
that is a claim about another session's conversation I have no access to, and
per the cross-session doctrine a peer's assertion is not proof of user
approval. It does not change my own conclusion: regardless of how the reset
was authorized, the underlying queue claim was legitimately theirs from
12:22:00.656Z, before I ever touched the worktree. My competing commit was the
intrusion.

## Data state as left

- `parcel_record_cell.cityLimits` across all six counties reflects the other
  session's implementation (value=city-name / absent-verified=unincorporated),
  not mine. I made no attempt to re-assert or overwrite it.
- The two operator-authorized orphan deletions (`48021:0`, `48021:10005`, per
  the card's planner addendum) were **not** performed by me. Both rows were
  still present, untouched, 52 cells each, as of this incident. The other
  session's close should address them if in scope, or they remain open.
- `factory-flood-ingest`'s live execution (parcel-r3-flood lane, county 48491,
  runId `b3525635-...`) was not disturbed by any of this -- confirmed running
  throughout, on its own image/job resource.
- My own Williamson (48491) execution (`factory-parcel-record-fill-bzfxv`,
  started 12:44:58Z on the superseded digest) was still running when this was
  caught -- doc-repo-98 observed it racing writes against their correction
  and cancelled it (`gcloud run jobs executions cancel ... bzfxv`), confirmed
  `Cancelled` at source. The other five county executions I launched
  (48055 pilot, 48021, 48209, 48309, 48453) had already completed and were
  then overwritten by the other session's re-run, not left concurrent.

## Process gap worth naming

The queue's claim is keyed by seat name ("property"), not by session. Two
concurrent sessions both legitimately operating as the property seat are
indistinguishable to `claim`/`status` beyond the ALREADY_CLAIMED refusal text
-- which is exactly the signal I failed to read correctly. Nothing in the CLI
output is wrong here; the failure was mine. Worth a skill/runbook note:
after any claim call, check the `result` field (or the presence of the word
REFUSED) explicitly rather than inferring success from field contents.

## What I did next

Sent the correction to doc-repo-1d, doc-repo-0b, and doc-repo-98 (the last
acknowledging their claim is verified legitimate and standing down). Released
nothing (there was no claim of mine to release). Returning to the loop to
claim a different, genuinely-claimable card.
