---
date: 2026-09-14
agent: planner
repo: docs
session_type: planning
memory_graded: [dispatches-are-compiled-not-authored:HELPED, canon-gate-hook-is-live:HELPED, dirty-tree-close-gate-inspects-command-string:HARMED, doc-repo-concurrent-commit-hazard:HELPED, accesspolicy-gates-atoms-not-fields:HELPED]
rolled_up: false
snapshot: >
  doc_repo main, integration seat, P:/doc_repo. Opened at 311b9914 area, closed at e390acfe
  plus this record. origin/main moved more than a dozen times from concurrent seats.
  Product repos read at origin/main WITHOUT checkout: hauska-engine 45ba9d2 and 14c7e850,
  hauska-factory 8464236, legacy-design-tools 31d181c2. Factory store read read-only.
---

# The Smart Site lane, the farm model corrected, and two rows closed

## What was done

Named the OPS-23 plus OPS-24 cluster collectively the **Smart Site lane**. Shaped the farm
model and then had two of its three legs corrected out from under it. Absorbed an OPS-24
teardown that found four defects on the program's first day. Opened and closed P-199 (the
auth gate) as a diagnosis. Watched P-195 close properly. Wrote the WDLL, the program map rev 2,
a coordination memo for a separate lane, and a planner snapshot with a complete document
manifest.

## What was learned (changes to ground truth)

**The brief is open by DEFAULT, not by ruling, and the reason is structural.** P-199 found
that **there is no atom in the brief's serving path at all** — LDT ServeCutover loaders to
engine `GET /property-nodes/:id/record` to the Factory's **pre-atom** `parcel_record` store.
`accessPolicy` is real code in that service and is never consulted here, because there is
nothing to consult it against. Verified at engine `45ba9d2`,
`services/retrieval-api/src/parcel-record-reader.ts`: *"P-163 has not landed; no live cell
carries one yet."* The one working gate, `grantsOwnerCoGatedFields()`, is a bespoke exception
for owner plus four CAD dollar fields per two dated 2026-09-05 rulings, wired to nothing else.
**Open is the default when no policy is consulted.** Operator ruled: wait for P-163.

**The atoms writer lease is already scoped, which retires my own argument for farm stores.**
`atoms_writer_lease_v2` is `PRIMARY KEY (scope_type, scope_id)`. I had told the operator that
"four counties in one store fight each other" was the strongest case for isolated farm stores.
It is not a global mutex and that claim was wrong. **A farm is a manifest and a merge gate, not
a place to run a second pipeline** — which is a better statement of the idea than the one I
gave, and it came from the farm-model lane.

**OPS-24 shipped carrying the disease it was written to cure.** Its Law 1 is "the probe is the
finish line for every stage," and `surface-probe.mjs` had predicates for P-151 through P-175 —
every one an OPS-23 row — and **zero for any OPS-24 row**. The close-gate hook was regex-scoped
to OPS-23 as well, so **six closes (P-169..P-174) were graded by a human rather than by the
instrument.** Both fixed the same day; the gate now derives its ranges from
`_catalog/plan_registry.json` and self-tests against drift. I re-ran the corrected gate over
all six: every one cites a probe, every artifact exists, every `closed` row carries a per-row
PASS. **P-170 has no close artifact naming it at all** — still unresolved.

**Three numbers reached canon this week without being counted.** "94 assumption rows" was mine,
a sum of three self-reports across three incompatible file formats. "Three lease-less writers"
is six. "Two gate files" is three. Each was corrected by someone reading source rather than
prose, and the register format divergence now blocks the pre-bake runner until normalised.

**A ruling was drawn as a defect and nearly got someone sent to fix a decision.**
`envelopeStatus` at 0 of 611,116 is refused by ruling (R-2) — OPS-21 withholds the figure until
an envelope atom exists while the polygon draws under P-153. Entry 5 of the dead-controls card
was withdrawn struck-through; the count there is seven, not eight.

**Burnet is better positioned than any document knew:** acquired and never instantiated, 59,785
parcels and a 2025 roll on production landing, `parcel_record` = 0, **zero address points**
(one loader run from a statewide set the six counties already use), and Marble Falls the one
place of seven with a verified-live zoning layer.

**`repo_intents.md` names the condition that lifts `smartcity-os`'s no-touch:** *"until the
Dashboards template is the staff path and a named cutover WDLL runs."* The Bastrop cutover is
that work and owes that WDLL.

**P-195 closed the way a row should.** Merged, deployed, and verified by violation on the live
production job: Dallas writes `refuse`, Bastrop unchanged, digest `36fe68…` → `f547df0…`. The
lane also refused to implement the dispatch's literal fix when it would have broken ratified
behaviour, and settled the gate-twin question by reading `ENGINE_PIN.json` plus a byte diff.

## My own errors this session

**I globbed across the shared tree.** A renumber script matched by date pattern and rewrote **14
files belonging to other seats**, flipping their committed references. All were tracked and
restored byte-exact with `git checkout --`, nothing lost. I verified the paths a script would
touch and not the content it would change.

**I collided on four row IDs**, then a concurrent seat collided with me on an amendment three
minutes apart. Renumbered to A-145/A-146/P-181/P-182. `A-136` remains duplicated and is left
for an operator ruling.

**I chained `git add && git commit` in one string** and the close gate refused it — a lesson
already in memory as `dirty-tree-close-gate-inspects-command-string`, which I had and ignored.
Graded HARMED for that reason.

**My CI hypothesis for P-195 was wrong.** I proposed a `paths:` filter; the real cause was
squash-merge branch divergence. The diagnostic sequence found it anyway.

## What is still open

Wave 6 baking with step 1 re-fired, step 2 out of the sequence for having no invocation plus a
`CONTRACT_VERSION` 1.30.0 versus 1.36.0 risk, step 3 unfired pending the smartsite-mcp proxy
measurement. **The 404 on `48209:84629` still invalidates step 1's success test** — production
holds a retired tier-1 row, so a post-publish 200 proves nothing.

Three rulings owed: which doc_repo session stays standing, P-170's missing close, and the Bell
cost-gate recalibration that cleared commitment #3's hard kill by deleting the external-call
term.

P-176, the Cotality bake-off, remains compiled and never dispatched.

## Suggested canonical doc updates

`MEMORY.md`'s Cotality one-liner still reads as a blanket extinguish; the MCP eval channel is
live and an index scan will mislead exactly as the 2026-08-08 resurfacing did. A new memory is
worth writing for the atoms lease being scoped, since I reasoned from the opposite for two
days. And `25b_monetization_provenance_storage_stack.md` should carry the accrual-trigger
asymmetry and point at ADR-032.

## The pattern worth carrying

Three lanes this week returned findings **sharper than the hypotheses they were handed**: six
writers not three, three gate files not two, and "there is no atom in the path" rather than
"the atoms are public-free." Each got there by reading the write path instead of testing the
framing it was given. Hand a lane a hypothesis and expect it back improved rather than
confirmed — and when it comes back different, the lane is usually right.
