# Mission — DOLLAR-RUN: execute the Wave R dollar bake through the Factory job path

The DOLLAR-FIELDS card closed partial: the bake CLI is MERGED on LDT main (65f924e8, PR
#578, 10/10 checks incl. the live-Postgres job) but the lane stopped honestly on "no
Cloud Run job for LDT writes." The mechanism exists and this card is it: the Factory
image VENDORS LDT at a pinned _LDT_SHA and the factory-* jobs run LDT bakes per county —
that is how every CTX facet bake ran (publish image + per-county executions).

1. Bump the Factory _LDT_SHA pin to >= 65f924e86fd4060a439300ea51271ad8a56f9a44 (the
   pin-bump PR pattern exists: factory #35 was exactly this). PR, green CI (conclusion
   string, current base), merge, rebuild the image digest-pinned.
2. Execute the dollar bake per county through the appropriate factory job. READ the
   job's own gates first and follow them — if the job requires a staging sibling before
   production (requireStagingSibling), run staging first; the job's discipline governs,
   do not bypass it and do not invent policy around it. Never a laptop write.
3. Verify per the ORIGINAL dollar-fields dispatch (_dispatches/2026-09-01_dollar-fields_dispatch.md,
   read it and its addenda): per-county per-field served counts on place_layer_snapshots,
   the hollow-atom recheck (never read Hays/Travis/Williamson roll atoms as source), the
   Hays provenance fix verification, and the 48021:34137 live-wire report (its CAD value
   fields served 0 of 5 before; after the bake they serve).
4. Landmines that already bit: Williamson has 602,050 snapshots vs 319,487 atoms — the
   bake must cover snapshot rows, not atom-iterate; do not fill McLennan assessed or
   Travis/McLennan living area (null at source); do not collapse $0.

Close: _inbox/2026-09-01_parcel-dollar-run_close.json with verbatim counts,
whatContradictedTheCard, leave_behind.
