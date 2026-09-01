# double-close-audit scratch

GROUND-TRUTH 2026-09-01T16:39:47Z — claimed double-close-audit on P:/doc_repo main 7ee1f6a. No store token.

GROUND-TRUTH 2026-09-01T05:41:01.308Z — VERIFICATION_MARKER. Pre-marker events excluded.

GROUND-TRUTH 2026-09-01T15:30:24Z through 15:48:29Z — cad-serve-reconcile log is four lines: claim, release (no close), claim, release (close). Zero CARD_CLOSED. Zero ALREADY_CLAIMED. Zero claims after 15:48.

LESSON — status prints CARD_CLOSED and writes nothing. A lane that sees CARD_CLOSED and keeps writing is invisible to the instrument that was supposed to reconstruct it. The log then looks like mechanism 1 (one lane finished).

LESSON — release is keyed by seat only. Same-seat agent A can release agent B's live claim and reclaim in 284ms. ALREADY_CLAIMED never fires because the steal is a release-then-claim, which is legal.

DEAD-END — treating the four-event log as proof of a single lane. Two transcripts at the same 10:29 prompt wave. Mechanism 4 is false.

OPEN — release split (close / abandon / steal) and holder-only extend are planner cards. Do not close the editor bypass.

LESSON — this seat wrote the 16:02 table (ee49e2f7) after its own 15:30 claim was released out from under it. The audit names that. It is not a reason to edit the finding.
