# P2 job template (F-01)

Writer allowlist so a non-CAD Factory job can run on a named FIPS and refuse without one. This unlocks P2-JURIS persist. It does not persist.

Read P1-FACTORY refuse by ref from `P:/seat-worktrees/property/hauska-factory-p1-controls` (do not write there): `requireCountyFips`, `requireCollectComplete` before `startRun`, `runScope` on the close line.

Build a job stub that:

- Requires `--county=<fips>` (both arg forms). Never defaults 48021.
- Requires a run row before any write.
- Names the allowlist of writer jobs (containment persist, F-11 setback, easement with no live REST). CAD-only allowlist is the defect.
- Consumes `sql/p2-juris/03` PERSIST_SPEC as the payload shape. Does not execute the persist.
- `--apply` from a laptop refuses (`LAPTOP_WRITE_FROZEN` / Cloud Run only).

Both arms: missing county refuses; named county plus a run row is accepted as a dry plan. Do not start a Cloud Run job. Do not apply 0005. Do not open p1-controls, gate8, or p2-juris for write.
