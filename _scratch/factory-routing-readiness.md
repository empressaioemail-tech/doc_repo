# factory-routing-readiness

GROUND-TRUTH (2026-08-25T05:03Z live): `node scripts/enforcement/memory-promotion-gate.mjs` at doc_repo `cd885521` on `main`: lessonFiles 97, triaged 12, untriaged 85, pin 64, exit 1. Pin file not raised. Artifact `_inbox/2026-08-24_memory_gate_live.json`.

GROUND-TRUTH (2026-08-25T05:02Z live): P-73 compile `_dispatches/2026-08-25_p73-m0_dispatch.md` emits `FLEET-MEMORY v2a98086b` and the verbatim `FLEET MEMORY (M0):` install line from `90_runbooks/fleet_memory_practice.md`. Canon-gate `.claude/hooks/canon-gate.ps1` Agent payload: full compile exit 0; stripped block+marker exit 2 (M6 missing marker); hash marker without the verbatim line exit 2 (M6 missing block); restore exit 0. Proof `_inbox/2026-08-24_fleet_memory_travel_violation.json`.

OPEN: this card's items 1 and 2 are filed. Items 3-6 (routing pin + instrument + no silent turn-on + leftovers) are not this lane.

GROUND-TRUTH (2026-08-25T05:30Z): factory memory wave closed. Eight factory scratch files triaged (all declined to durable refs). Pin 64→56. P-78 dispatch `_dispatches/2026-08-25_p78-cad-merge_dispatch.md` carries FLEET-MEMORY v2a98086b + M0 block. Memory gate 63>56 leave_behind.

GROUND-TRUTH (2026-08-25T05:12Z planner re-run): `fleet-memory-travel.test.mjs` 14/14 exit 0. `factory-routing-readiness.mjs --check` PASS. Memory gate still 85 > 64 exit 1. Pin not raised.

LESSON: pin `ready:true` is already-serving, not write-allowed. Envelope P-60 and flood P-08 are serving hops. They are not a go to point new factory workload at those rails. Write-allowed stays implicit in `held` plus `ready:false` on P-25 / P-09 / roads.

GROUND-TRUTH (2026-08-25T05:25Z): factory operating instructions are in the canvas family. Atom write target is P-55 / `atom_did IN` / `applies-to`. Memory travel (M6) is in the compiler. Next wave triages eight factory scratch files and compiles P-78 only. Do not raise the memory pin.
