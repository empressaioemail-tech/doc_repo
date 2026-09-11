---
decision_id: 2026-09-11_not_specified_semantics_and_no_approximation_state
date: 2026-09-11
owner: nick
status: active
related_canonical:
  - 90_operations/OPS-21_serve_completion_program
  - _inbox/2026-09-11_corpus_not_specified_audit.md
  - _inbox/2026-09-11_ops21-s2_close.json
  - _decisions/2026-09-10_available_on_request_sixth_cell_state.md
plan_rows: [P-133, P-146]
---

# Two rulings: what `not_specified` meant, and no approximation state

## Ruling 1 — `not_specified` is three populations, disposed three ways

The setback corpus flag `provenance.<field>.not_specified` carries two meanings and **never
its nominal one**. Zero of 329 flagged slots sit on a null; if the flag meant "the ordinance
is silent" it would sometimes. OPS-21-S2 read it as an earned absence and wrote
`absent-verified` on 547,657 live cells (`maxHeightFt` + `maxLotCoveragePct`, five counties),
austin-tx being 313,580 of them.

**547,657 is the FLAG population, not the DEFECT population.** A remediation handed all of it
would flip roughly 234,000 correct absences into wrong values, which is worse than the defect
it set out to fix. That sentence is the reason this ruling exists.

| Class | Slots | Disposition |
|---|---|---|
| `SENTINEL_UNIFORM` — value identical across every flagged sibling (`san-antonio` coverage `{100:21}`, `round-rock` height `{999:10}`) | 225 | **LEAVE.** `absent-verified` is correct where the ordinance sets no limit. ~234,000 cells. Do not touch |
| `REAL_VALUE_FLAGGED` — varied transcribed values (Austin coverage 35/40/45/50/55/60/70); the Austin provenance quote CITES the table row that provides them, and confidence reads 0.6 against 0.7 on the identical quote for unflagged siblings | 72 | **REMEDIATE to `value`.** False absences |
| `SENTINEL_SUSPECT_IN_MIXED_GROUP` — placeholder-shaped value inside a group holding real ones (`lockhart` coverage `{30:2, 40:1, 100:4}`) | 32 | **`refused`.** Not `absent-verified` |

**Why `refused` for the 32.** This is exactly what that state exists for in this program's own
vocabulary: a real limit may exist and the source cannot say which. It is the weaker, honest
state; it keeps the population countable; and it stops 32 slots being silently absorbed in
either direction. Thirty-two is small enough to adjudicate against the actual ordinances later
by hand.

**Scope by (jurisdiction, FIELD), never by jurisdiction.** A city is routinely a placeholder on
one field and a transcription on the other — `san-antonio-tx`, `cedar-park-tx`,
`pflugerville-tx` and `liberty-hill-tx` all are. Any remediation scoped by city name will be
wrong.

**The sentinel is a separate defect and it belongs to the corpus owner.** Storing `999` or
`100` as a placeholder is what ENFORCEMENT prohibits outright. Fixing the resolver in
hauska-factory is a workaround for a defect that lives in the corpus, so the remediation lane
**carries a retirement item**: when the corpus stops storing sentinels and stops flagging
transcribed values, the factory-side classification table retires. Registered as 3P-15.

## Ruling 2 — NO "computed by approximation" state. Acquire the road frontage.

OPS-21-S2 declined to write `buildableAreaSqFt` / `buildableAreaPct` because the only tested
computation needs road-frontage edge labeling nobody has acquired. Its deferral (3P-14) offered
two triggers: the acquisition landing, **or** a new representable state meaning "computed by
approximation, required input absent."

**Ruled: no such state. 3P-14's trigger is the acquisition, full stop.**

Three reasons.

**It is not the `available-on-request` shape.** That sixth state was added because a real
situation was genuinely unrepresentable. Here the value is perfectly representable; we simply
cannot compute it correctly yet. Only the first justifies widening the type.

**Buildable area is the number a customer acts on.** It is the headline question of the
product. The front setback applies to the street-facing edge, and a shape-only approximation
does not know which edge that is. Being wrong is not a rounding error, it is a wrong answer
about a specific parcel someone spends money on.

**A labeled approximation loses its label at the next seam, and it has already happened here.**
McLennan's StratMap-redistributed dollars serve byte-identical in label to a real
appraisal-district value, because the tier is loaded from the roll and dropped at the next
seam. Same pattern, one product surface earlier.

Refusal over fabrication is the position. An approximation state is fabrication with a sticker
on it.

**Consequence, and it is a positive one:** the road-frontage acquisition now has a named
customer — the headline number of the product — which makes it the strongest candidate on the
Phase 3 acquisition list rather than a vague "more data would be nice." Registered as 3P-16.

## Reversal criteria

Ruling 1 reverses if a corpus-owner statement establishes that `not_specified` was written with
a third meaning neither derivation detected; re-run the audit instrument rather than trusting
the statement. If the 32 suspects are adjudicated and split, they leave `refused` individually,
never as a batch.

Ruling 2 reverses only if road-frontage acquisition is proven unobtainable through the uniform
public-record process. In that case the honest answer is that buildable area stays
`unaccounted` and the product declines it — not that an approximation becomes acceptable.

## Provenance worth recording

Two sessions reached the same classification by different methods: the integration seat from
the corpus value distribution across sibling districts, OPS-21-S2 from live cells and
per-district provenance quotes. The splits match exactly and S2 reached its conclusion before
the peer's message arrived. A genuine second derivation.

The audit also corrected itself: its first version reported 329 contradictions because its
check treated any non-null as a real value and so passed on sentinels — the failure
ENFORCEMENT names at "never satisfy a check with a sentinel." Caught because S2 mentioned a
999 at Round Rock in passing.
