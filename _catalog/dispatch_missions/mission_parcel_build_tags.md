# Mission — BUILD-TAGS: end the shared-tag deploy race

OPERATOR AUTHORIZATION 2026-09-02: adopt a per-invocation build-tag convention on the
shared factory cloudbuild files. The mutable shared tag has raced twice (the R2
collision vehicle; the R5 deploy race resolved only by digest-matching).

Design constraint: keep it simple and mechanical — a _TAG substitution (for example
the card id + short SHA) so every Cloud Build submission pushes a unique tag, deploys
pin by digest as they already must, and two concurrent submissions cannot overwrite
each other's tag. Add a check (test or build-time) that FAILS when a deploy pin does
not name a digest. Do not restructure the build files; do not touch job code. Verify
by violation: submit two overlapping builds (trivial no-op changes) and show both
digests remain independently addressable. Update
90_runbooks/factory_cloud_job_execute.md if it names the old tag convention — flag if
you cannot write doc_repo runbooks from your seat (planner will land it from your
close). Close: _inbox/2026-09-02_parcel-build-tags_close.json.
