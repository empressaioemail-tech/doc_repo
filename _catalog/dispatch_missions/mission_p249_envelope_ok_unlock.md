## Mission — P-249: an unverified "no buildable area" atom stops hiding the modelled envelope

You launch no sub-agents (FAN-DEPTH 0). Two repos, one lane, in this order: read both, build
legacy-design-tools, then hauska-map. You open PRs and do not deploy; the integration seat
deploys to staging and runs the proof below with you or after you.

### Where you work

Fresh clones from `origin/main` under `P:/tmp/` for `legacy-design-tools` and `hauska-map`.
Branches `fix/p249-envelope-unlock` in each. Declare both start commits first. Other lanes may be
open in legacy-design-tools (P-206, P-241, P-258, P-259); none of them touches
`artifacts/api-server/src/lib/buildableEnvelope/`. In hauska-map, you are the first of several
rows that touch the envelope decline branch (P-257, P-270 to P-272 follow you), so keep your
change to that branch and its tests.

### The mechanism (verified; the final teardown could not break it)

- LDT `artifacts/api-server/src/lib/buildableEnvelope/reconcileAtomEnvelope.ts`
  (`reconcileWithAtomEnvelope`, around line 148): when an envelope atom exists, its outcome
  wins. A `no-buildable-area` outcome empties a good live envelope unless
  `isMachineVerifyDiagnostic(reason)` holds. 490,185 such atoms sit in the six counties, mostly
  July breadth-bake records meaning "unzoned" (208,868), "not onboarded" (153,775) or a
  reason-less zero (123,706).
- hauska-map `apps/property-explorer/api/_lib/atom-chain-to-facets.ts`: the `envelope` object is
  built from the atom chain only. The branch at about line 2074 (`!envelope && outcomeKind ===
  "no-buildable-area"`, not depth-warm) sets `status: "declined"`, `declineReason:
  "envelope-unverified"`, no geometry, `envelopeCovered = false`.
- hauska-map `apps/property-explorer/src/browse/InspectCard.tsx` (header, lines 6 to 13) prefers
  the baked node facets and uses the live buildable-envelope client only when a node has no
  baked snapshot.

**Read first, and put the answer at the top of CP1:** for a parcel that HAS a baked snapshot and
whose facets say `status: "ok"` (Pflugerville `48453:427599`), where does the drawn polygon come
from: the atom's `geojson`, or a live `place/buildable-envelope` call? The integration seat's
reading of the header is that for a baked parcel the facets decide, which would make the
hauska-map branch the real fix and the LDT change necessary but not sufficient. Confirm or refute
it from the code, with file and line, before you build.

### What to build

1. **The verification signal, named correctly.** The atom field is `depthWarmPromotion`; the
   value `"depth-warm-promoted-v1"` means verified. hauska-map reads it in `isDepthWarmPromoted`
   (`atom-chain-to-facets.ts`, around line 185) with a `sourceCitation` fallback. There is no
   `depthWarmPromoted` field on the atom (the map writes a flag by that name into its own output,
   which nothing reads). LDT reads neither today. Carry the atom field on LDT's wire type and
   apply the same predicate, with the fallback and its precedence stated.
2. **LDT reconciliation.** A `no-buildable-area` atom that is not verified-promoted no longer
   empties a live envelope that has a district and a setback table. A verified zero still wins.
   `validation-failed` (a live ring that fails the engine's own geometry gates) reaches a named
   decline, never a silent empty.
3. **The figure, on the MCP payload.** A buildable-area figure appears only when a verified atom
   backs it (operator ruling A-180). Today the Pflugerville response quotes "Buildable area from
   the property atom chain ... 5027 sq ft" from an unverified atom. Withhold the figure there,
   keep the polygon and its disclosure. The PDF is P-261, not you.
4. **hauska-map.** The `envelope-unverified` branch serves the modelled envelope with its
   disclosure and no figure (the 2026-09-11 ruling: the polygon draws wherever a district and a
   table exist; only the area waits on a verified atom). Its geometry comes from wherever your CP1
   read says the drawn polygon comes from; never from the unverified atom's zero.
5. **The divergence test.** Four predicates read "is this envelope verified": the map's
   `isDepthWarmPromoted`, your new LDT predicate, LDT's `isMachineVerifyDiagnostic` (reason text),
   and the doc_repo instrument `scripts/envelope-draw-gap.mjs` (string and boolean forms). Add a
   shared fixture set and a test in each product repo that fails when its predicate disagrees
   with the fixture's declared answer. Name the doc_repo instrument's form in your close so the
   integration seat aligns it.

### The staging proof (specify it in your PR; the integration seat runs it)

The stores were green throughout the 2026-09-15 incident, which was a stale browser tab after a
rollback, not a server regression (A-157). So the proof reads the served surface:

- the serving build recorded before and after by asset existence (request the build's unique
  `/assets/index-*.js` against the alias; the live one returns `application/javascript`), never
  by `Age:`;
- each measurement from a fresh browser context;
- three branches per city, each recording `status`, `declineReason`, `envelopeCovered`, whether
  geometry is present and whether a figure is present:
  (a) an unverified zero with a district and a table, `48209:97658`: draws, no figure;
  (b) a verified zero minted on staging (none exists in production): stays empty with a named
      reason;
  (c) a `validation-failed` ring: declines with that reason and draws nothing;
- Waco's panel declining what its own live endpoint draws (XD-2): a named fixture, must draw;
- Pflugerville `48453:427599`: still draws, and now prints no figure unless its atom is verified;
- a rollback rehearsal with the build identity shown to move both ways.

**Sizing.** 131,357 is an upper bound on what this unlocks (it counts parcels with a
`setbackFrontFt` value). Report the unlock against the district-and-table population once P-255
measures it; until then report it against 131,357 labelled as an upper bound, never as a
shortfall.

### Falsifiers, pre-register your answers first

1. `48209:97658` draws on staging with no figure. If it does not, the row is not done.
2. The staging-minted verified zero stays empty. If it draws, the change is too wide.
3. No surface prints a figure from an unverified atom (map payload, MCP, disclosure strings).
4. Your CP1 answer on the polygon's source is backed by file and line, and your build matches it.
5. The divergence test fails when one predicate is edited alone.

### Do not

- Deploy, re-derive or retire any atom (P-263, P-264), or touch the PDF (P-261).
- Change decline wording beyond this branch (P-257 owns the wording surface).
- Launch sub-agents.

### Close

Snapshot per repo; files touched; both PRs with every CI check's literal conclusion; the CP1
answer; the five falsifiers; the staging proof as a runnable checklist. `status`:
`closed-partial` until the integration seat's staging proof passes. `probe`:
`{"notApplicable": "build lane, PRs not deployed; the integration seat runs the staging proof"}`.
`subAgents`. `leave_behind`.
