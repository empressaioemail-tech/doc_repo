# Carding proposal: the live vendor mapping (g153's unowned leave_behind)

For operator ruling. Carding is operator-ruled, so this is a proposal and **no row has been written**.

## Why a row is needed

`g153-fleet-police-lens` closed 2026-09-18T20:38:32Z. Its `leave_behind` item 1 is the vendor mapping,
and its own words name it as **the next unit of work rather than polish**. Nothing in OPS-17 owns it,
which is the same shape as the 11 findings A-158 disclosed and `G-164` was carded to own.

The mechanism is fail-closed and correct, and it produces a dead surface:

| measurement (from g153's close) | value |
|---|---|
| live records read from `/api/domains/*` on the deployed surface | 102 (75 Samsara + 27 Spireon) |
| live records **refused** by the declared shape | **102 of 102** |
| `operatorRef` present | **0 of 102** |
| undeclared fields on the live Samsara row | 12 (`vin`, `make`, `model`, `odometerMiles`, ...) |
| `odometerBand` | declared, never populated |

So once PR #75 merges and deploys, Bastrop's Fleet and Police regions answer `refused` with the faults
named. That is a **declared absence and not a blank**, which is the behaviour the row wanted, and it is
still two regions showing nothing useful. `ENFORCEMENT.md` is satisfied by the refusal; the customer
outcome is not.

## Three units of work, all three named by the lane

1. Engine state onto the declared bands. The status enum is the largest gap: Samsara reads `unknown`,
   Spireon reads `Stopped`/`Idle`/`Moving`/`Unknown`, and the shape declares
   `out-of-service`/`inspection-due`/`in-shop`/`in-service`.
2. A band from the raw odometer reading, since `odometerBand` is declared and never set.
3. An operator identity from the platform route, since `operatorRef` is absent on every live record.

## One trap that must travel with the row

The two design dumps lag the code by construction: both declare the bare form `/^OPR-\d{2}$/` while the
code mints `FL-OPR-nn` and `PV-OPR-nn` (operator ruling 2026-09-17, references namespaced by domain). A
reader who runs the pre-lane Fleet instrument against a recaptured dump sees a self-test failure and
`exit 2`, and **that is the trap firing, not a board defect**. The recapture is planner-owned and g153
was forbidden to do it.

## Proposed cells

Paste as one 7-cell row matching the table order (`id | band | scope | accept | done-when | blockedBy | status`):

- **id** `G-165`
- **band** `5`
- **scope** `Lane B: MAP THE LIVE VENDOR RECORDS ONTO THE DECLARED SHAPE, SO THE FLEET AND POLICE LENSES CAN PAINT. g153 shipped the shape guard and its instruments, and the guard now REFUSES every live record, so from the moment PR #75 deploys Bastrop's Fleet and Police regions read refused with the faults named. That is correct fail-closed behaviour and it is also a dead surface until this lands. Measured by g153, not inferred: 102 of 102 live records fail their declared shape (75 Samsara + 27 Spireon); the status enum is the largest gap (Samsara reads unknown, Spireon reads Stopped/Idle/Moving/Unknown, the shape declares out-of-service/inspection-due/in-shop/in-service); operatorRef is present on 0 of 102; the live Samsara row carries 12 undeclared fields including vin, make, model and odometerMiles; and odometerBand is declared and never populated. Three units of work: engine state onto declared bands, a band from the raw odometer reading, an operator identity from the platform route. NO ROW OWNS THIS, which is why it is carded. Repo smartcity-dashboards.`
- **accept** `B`
- **done-when** `On the DO app at the post-D-12 commit neither region reads refused: every live Fleet and Patrol record either satisfies the declared shape or is refused with its fault named, with the counts stated at the moment of reading; the status enum maps from both vendors' native vocabularies with NO sentinel, so unknown is never silently widened into a band; operatorRef is populated wherever an identity route exists and refused rather than defaulted where none does; the odometer band is derived from the raw reading rather than from a constant; and both design instruments still exit 0 with non-zero matched-input counts against the RECAPTURED dumps.`
- **blockedBy** `D-12 (OPS-25) for the deploy path, and the PLANNER RECAPTURE of both design dumps, which g153 was forbidden to perform and which must land before either instrument can read live-shaped data. Trap that must not be filed as a defect: the current dumps declare the bare /^OPR-\d{2}$/ form while the code mints FL-OPR-nn and PV-OPR-nn, so the pre-lane instrument exits 2 against a recaptured dump by design.`
- **status** `OPEN - carded 2026-09-18 (A-161)`

## Alternative considered and not recommended

Splitting it three ways (enum, odometer, identity). Rejected: the three are one unit because each is a
field of one record shape, one recapture proves all three, and one lane touches one mapper. Splitting
them would create three rows that must land together anyway, which is the coupling `G-164` was carded
to avoid repeating.
