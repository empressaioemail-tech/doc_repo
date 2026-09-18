## Mission - G-153: build the Fleet and Police lenses, fix the three live-mapper defects both of them run on, and carry G-135's parcel 2

You launch no sub-agents (FAN-DEPTH 0). You write in exactly two places: `smartcity-dashboards` (the
product, on your own branch, landing as a PR) and `_design/` in `doc_repo` (the two `check.mjs` files
whose own extraction regex your change breaks). `doc_repo` commits are planner-owned: leave the
`_design/` edits UNCOMMITTED and list the exact paths in your close.

### Why this row is the right next lane

Nothing blocks it. Its named blocker, `D-12` in OPS-25, is closed-partial and has moved further since:
`app.smartcityos.io` resolves to `dolphin-app`, which was shipped today and now serves
`smartcity-dashboards` `origin/main` `7487d7c0`, so there is a live deploy path to prove on rather than
a plan for one. The roadmap's other precondition is met too: `G-161` and `D-13` have both LANDED.

This is the FIRST lens build after those two landings, and it is first in the queue for a structural
reason rather than a preference: **every lens renders into two shared files (`web/app.js` and
`web/index.html`), so lens rows run ONE AT A TIME.** G-152 (Public works, Fire and EMS), G-151 (Parks)
and G-149 (flood study) are queued behind you and must NOT be started in parallel with this lane.

### What you are building

`_design/smartcity-fleet-lens/` and `_design/smartcity-police-lens/`, both RATIFIED 2026-09-17, both
carrying `check.mjs`, and Police also carrying `violate.mjs`. They are paired because they are the two
lenses whose vendors actually answer, and because they share one blocker and three defects.

- **Fleet** is the first lens designed whose vendor returns real data, so its second board asks what
  the page still says once it has FILLED.
- **Police** is the only registered lens whose two regions disagree about their SOURCE, and it
  disagrees in OPPOSITE directions on the two shipped packs: on the demo Verkada is granted and
  Spireon withheld; on Bastrop Spireon is granted live and Verkada is not granted at all. So the
  demo's emptiest region is the city's most connected one.

### The three defects, all verified at source 2026-09-17 against `f776b4bf`

All three land on exactly these two lenses, and none of them had a row of its own.

1. **`assertRecordShape` is never called on the live path.** It is called from `fixture-seam.mjs:546`
   and from tests and from NOTHING in `vendor-live.mjs`. So the fixture path we control is
   shape-validated and the live vendor path we do not control is not. By `ENFORCEMENT.md` this is a
   dormant mechanism: built, correct, never reached on the path that needs it. Run by hand against the
   live Samsara record it REFUSES with three faults, and that record carries twelve undeclared fields
   including `vin`, `make`, `model` and `odometerMiles`: an inventory field set arriving on exactly the
   cutover that drops the one sentence saying this is not an inventory.
2. **The literal `"Unnamed unit"` is produced on an empty row by BOTH `vendor-live.mjs:131` (Samsara)
   and `:186` (Spireon),** so identifier collisions cross lenses. A sentinel that two vendors share is
   not an identifier.
3. **`operatorRef` is `required: true` on the Spireon shape and occurs ZERO times in
   `vendor-live.mjs`,** so a required field is silently absent on every live record.

### The namespace ruling lands in THIS unit of work

Defect (3) is the code that mints operator references, which is why the ruling was made before the
live path was written rather than after (`_decisions/2026-09-17_operator_reference_namespaced_by_domain.md`):
operator references are namespaced by domain, so change `OPERATOR_REF_FORMAT` to `/^FL-OPR-\d{2}$/` in
`fleet-vehicles.mjs` and `/^PV-OPR-\d{2}$/` in `patrol-vehicles.mjs`, and mint the namespaced form on
the live path. A bare `OPR-01` stops being valid anywhere. Changing the scheme after a feed is minting
them would have been a migration, not a constant.

### The named trap, and it is the one most likely to be misread

`_design/smartcity-fleet-lens/check.mjs:154` hardcodes `/\bOPR-[A-Za-z0-9]+/g` to extract candidates. In
`FL-OPR-01` the `\b` still matches BEFORE `OPR`, so it extracts the truncated `OPR-01` and fails it
against the new format. **The check will break in a way that reads as a design defect and is an
extraction bug.** Both checks also carry hardcoded bare-form self-test fixtures (Fleet `:271`, Police
`:436` and `:449`). Fix the extraction and the fixtures; do not "fix" the design to satisfy a broken
extractor, and do not weaken the new format to satisfy the old regex.

### G-135's parcel 2 is folded into THIS lane (operator, 2026-09-18)

G-135 is CLOSED-PARTIAL on exactly one unmeasured thing:

> a full-shell authenticated probe on `bastrop_tx` that mounts the map iframe, which has never once
> happened

It was folded into the next lens BUILD lane rather than given a credential lane of its own, because it
needs a browser-driven probe of the map iframe and a lens lane already does exactly that. **You inherit
it, and G-135 closes when you report the probe.**

The credential you need is already distributed and needs no human and no request:

- key `96e40316-0907-49f3-8c6e-d47d9013f02e`, tenant `bastrop_tx`, status active;
- stored at Secret Manager `hauska-prod-497015/hauska-tenant-key-bastrop-tx-lane-verification`
  version 1;
- recorded in `_catalog/credential_access_index.json` with a one-command `howToUse` and a
  `howToRevoke`. Use the documented command; never paste the value into an artifact, a close, a
  commit or a message. The G-154 and G-134 lane keys were revoked on 2026-09-18, so the census is this
  verification key plus the operator's own pilot (`2a26c318`), which is labelled "Nick, bastrop_tx
  staff pilot" and is NOT yours to use.

### Acceptance, verbatim from the row

> Both `check.mjs` pass with non-zero matched-input counts and fail against planted violations both
> ways; Police's check refuses any plate-shaped string anywhere and any surveillance term outside a
> declared refusal; Fleet's refuses any driver name, any operator reference outside the declared
> format, and asset-inventory vocabulary in an assertive position; `assertRecordShape` is called on the
> live vendor path and REFUSES rather than defaulting when the live Samsara record fails it; no two
> vendors can emit the same unit label sentinel, proven by a fixture feeding both an empty row;
> `operatorRef` is either populated or the record is refused, never silently absent; and both surfaces
> are reached on the DO app per D-12

A check that passes on a zero matched-input count has proved nothing and is the specific defect named
in `_design/smart-files/check.mjs`, where a predicate self-tested perfectly and matched nothing. Report
the matched-input count, not just the exit code.

### Boundaries

- **Do NOT recapture `source-state.json` and do NOT regenerate the artboards.** That is a
  planner-owned follow-on: the two designs then recapture and regenerate (`Main.dc.html` carries 20
  occurrences, `Patrol.dc.html` 14). Your close should say the designs now need it, with the counts.
- Do NOT edit `_design/INDEX.md`. Put any replacement line in your close and the planner will apply it.
- Do NOT touch any other design folder's `check.mjs`. A sibling lane (G-148) is writing instruments for
  four OTHER designs in `_design/` right now; stay inside `smartcity-fleet-lens/` and
  `smartcity-police-lens/`.
- Do NOT start G-152, G-151 or G-149. They share `web/app.js` and `web/index.html` with you.
- Do NOT change `getBnpApiKey()` or any finance route; that is G-162's surface.

### Evidence your close must carry

- For each defect: the file and line changed, and the BEFORE and AFTER behaviour, shown by a
  violation rather than asserted. Defect (1) in particular must be shown REFUSING on the live Samsara
  record, not on a fixture.
- Each `check.mjs` re-run with its matched-input count printed, plus the named planted violation it
  fails on.
- The G-135 parcel 2 probe: the artifact showing a full-shell authenticated `bastrop_tx` session with
  the map iframe MOUNTED, and the sentence stating whether it rendered.
- The statement that the two designs now need `source-state.json` recaptured and artboards regenerated,
  with the occurrence counts, in a form the planner can paste into the row.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the close,
  never written to memory directly.
