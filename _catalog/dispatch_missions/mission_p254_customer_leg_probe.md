## Mission — P-254: the customer leg of the Phase 0 exit gets its instrument

You launch no sub-agents (FAN-DEPTH 0). You build in doc_repo, in your OWN doc_repo worktree on
branch `lane/p254-customer-leg-probe` cut from `origin/main`. Every doc_repo edit stays
UNCOMMITTED in that worktree for the integration seat to review and commit (AGENT_CONTRACT
section 6); `P:/doc_repo` is read, never written. You change no product repo and deploy nothing.

### Where the standard lives

- The row: OPS-16 P-254. The plan: `_inbox/2026-09-16_texas_scaleup_program_scope.md` sections 4.5
  and 5 (the customer leg is exit condition 2).
- The acceptance standard: `_inbox/2026-09-16_scaleup-le_card_spec.md` and the 39-bucket fixture
  list `_inbox/2026-09-16_scaleup-le_fixture_list.json`. Fifteen buckets and the PDF leg are
  ungraded today.
- The instrument you extend: `scripts/surface-probe.mjs` (OPS-23's predicate, 1,231 lines, with a
  self-test and committed fixtures). Read its header first; keep its exit codes and its
  MEASURED / OBSERVED labelling.

### What to build

1. **OPS-24 legs over the 39 buckets.** For every fixture, grade the three customer surfaces:
   the map payload (`https://smartsite.cloud/api/spine/property-atoms/<id>/facets`), the MCP
   (`get_smart_site` at node depth), and the PDF (the engine-api feasibility export). For every
   envelope fixture record `status`, `declineReason`, `envelopeCovered`, geometry presence and
   figure presence. At least four fixtures per wired city (a codified district, a formerly
   uncodified district, a PUD, a promoted envelope) plus one unincorporated parcel per county.
2. **Build identity by asset existence**, never by `Age:` or a header: the P-249 proof
   (`_inbox/2026-09-17_p249_canary_proof.md`) shows the method. Each measurement runs in a fresh
   context, with no reused connection or cache.
3. **An authorised path for each leg, or an honest label.** The MCP and PDF legs need
   credentials. Find the path the fleet already uses (the PDF leg needs the six gate-front headers
   `x-hauska-product`, `x-hauska-tenant-id`, `x-hauska-package-id`,
   `x-hauska-gate-credential-id`, `x-hauska-access-tier`, `x-hauska-request-id`, a Bearer key,
   the route `/v1/property-nodes/<id>/feasibility-export`, and a JSON body on the refresh POST).
   A leg that cannot be run is a REFUSAL (exit 2) or enters through `--observations` labelled
   OBSERVED. Never a pass it did not measure.
4. **The open-defect count.** Emit the count of open customer-visible defects (the XD and X
   lists in the plan, section 4.5), each with its fixture and its current verdict. The Phase 0
   exit reads this number.
5. **Rows for the lanes landing now.** Carry predicates for P-303 (Waco `48309:103015` draws on
   the panel with no area figure; a class member with no district still declines) and P-304 (an
   anonymous POST to the envelope route for `48209:97658` carries neither `buildableAreaSqFt` nor
   `buildableAreaPct`, while `48021:34049` still carries 19052 and 63.5; the exact requests are in
   `_inbox/2026-09-17_p304-area-figure_live-probe.md`).

### Two measured findings to carry as required cases (integration seat, 2026-09-17 15:3xZ)

- **Cross-surface envelope reason, Travis `48453:367134`** (5833 Taylor Draper Cv, SF-2, Austin).
  `get_smart_site` node depth: the `setbacks-envelope` section is `present` with front 25, side 5,
  rear 10, corner 15, while the same read's `draw.overlays` envelope reads `state: refused`,
  `reason: atom_path_pending`, display "Withheld, setbacks unruled", and the boundary overlay reads
  "Parcel boundary unmeasured" with no geometry (`boundaryEdgeFact` is refused `atom-miss`). The
  panel route for the same parcel returns `envelope.status: ok` with the same setbacks and the
  disclosure "depth-warm geometry withheld". The MCP's "setbacks unruled" is false for this
  parcel. Build a check that fails when any surface says "unruled" or `atom_path_pending` for a
  parcel whose own read carries a ruled setback table, and report the population it finds across
  the fixtures (and, if you can bound it cheaply, across a county sample, with the denominator).
- **Two impervious figures under one idea, same parcel.** The panel's envelope carries
  `maxImperviousPct: 45` (the zoning table); the MCP's `maxImperviousCoverPctFact.percent` is 30
  (the Water Supply Suburban watershed rule, with its citation). Both may be correct law. Record
  both, and flag any fixture where two surfaces print different values for fields a customer would
  read as the same quantity. This is a finding for a ruling, not a defect to fix in this lane.

### Traps already measured (do not rediscover them)

- The panel's `facets.bakedAt` is not a bake time. Grade a bake on the `node-facets:tier1` row
  (read-only) or on `get_smart_site`'s `bakedAt`, never on the panel.
- After a Vercel alias switch there is a 5 to 20 second window where the HTML names the other
  build's asset.
- A wrong auth header falls through to the anonymous gate silently.
- The operator's test account is paid Solo, so owner, valuation and records refusals are correct
  on it and are not defects.

### Falsifiers — pre-register your predictions before building

1. A fixture known to fail today reads FAIL (Travis `48453:367134` on the cross-surface reason
   check is one; name any others you find before running).
2. A fixture known to pass reads PASS, and a copy of it with one asserted field altered reads
   FAIL (the self-test proves the check is not vacuous).
3. With a leg's credential withheld, that leg refuses (exit 2) and the run does not report a pass.

### Do not

- Commit, merge, deploy, or write any store.
- Change product code in any repo. A defect you find goes in the close as a finding.
- Grade on the panel `bakedAt`.
- Launch sub-agents.

### Close

Snapshot (doc_repo HEAD, every base URL, serving builds by asset, run times); files touched in
your worktree; the artifact the probe writes (`_inbox/2026-09-17_p254_surface_probe_*.json`, or
dated to your run); per-bucket verdicts on each surface with the count still ungraded and why;
the open-defect count; the two findings above with their measured populations; the falsifiers
with evidence. `status`: `closed-partial` until the integration seat commits the instrument and
runs it once on main. `probe`: this lane IS the probe; cite its artifact. `subAgents`.
`leave_behind`.
