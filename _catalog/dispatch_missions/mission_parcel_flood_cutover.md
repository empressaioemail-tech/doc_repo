# Mission — FLOOD-CUTOVER: the wedge rail goes record-served

Slate-1 flipped three rails and correctly left flood for a dedicated pass: it needs
the B-allowlist-gated adapter built (parcelRecordFactRead.ts is C-report's direct
reader, a different consumer). Follow slate-1's close as the template EXACTLY: build
the cutover wrapper through the shared allowlist (with the PR #589 resolveVerdictStore
fix — verify it is in your deployed bundle, it was the silent-legacy bug), gate
verdicts per county via real Cloud Run evaluations (Caldwell will REFUSE until the
refresh-apply backfill lands — capture that REFUSE live, it is the still-owed
observed-refusing evidence), staging flips with before/after wire probes on real
parcels (gold 48021:34137 zone X; the AO/AE discriminator 48021:36521 must serve AE),
production shift, retirement documented honestly per the slate-1 partial-retirement
pattern. Close: _inbox/2026-09-03_parcel-flood-cutover_close.json.
