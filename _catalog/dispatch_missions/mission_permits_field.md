# Mission — permits becomes a real column now, and one jurisdiction gets sourced end to end

## Operator ruling: permits is not waiting

Permits is active work. This card does two things and they are deliberately in this order:
**make the column exist and be honestly absent**, then **source one jurisdiction end to
end** so the acquisition cost is measured rather than estimated.

## Step 1: the column, with a basis

Add `permits` to the declared serve shape as a first-class field.

**A field that does not exist cannot be honestly absent.** Today permits is not missing from
a parcel — it is missing from the *contract*, which means no parcel can say anything true
about it. Until a jurisdiction is sourced, every parcel in it reads `absent-verified` with a
basis naming that jurisdiction as unsourced.

That is a true statement, it is visible to a user, and it is the difference between "this
property has no permits" and "we have not sourced permits for this city." **Those must not
render the same way**, and today they cannot even be distinguished.

Shape it for what permits actually are: a parcel has zero or many, each with a date, a type,
a status, a number, and a source. Zero permits found at a sourced jurisdiction is a real
`value` of an empty set, and it is not the same cell as an unsourced jurisdiction. Get that
distinction into the type rather than into a convention.

## Step 2: sourcing, and the constraint is already ruled

**Bastrop permits are off limits and must not come from SmartCity.** That ruling stands.
Public source only, and the same posture as zoning: it is public record, acquired by scrape
or citizen portal, per the 2026-08-04 eCode360 retirement ruling.

Every jurisdiction has a different portal, so this is a per-jurisdiction program and not one
integration. **Take exactly one jurisdiction end to end** — acquire, normalise, write, bake,
and confirm a parcel serves its permits with provenance.

Do not scope a wave on this card. The L2 acquisition work found five blockers serially, each
visible only after the previous cleared, because scope was set before one unit had run.
Report every blocker you hit on the one, including the ones you solve.

**Pick the jurisdiction on evidence, not convenience**, and say why. A portal with a
documented API beats a scrape target for a first pass, because the goal here is to learn the
shape of the work rather than to maximise coverage.

## What this card is not

It is not permit *coverage*. It is the column plus one proven acquisition path plus a
measured cost.

It does not touch Bastrop's SmartCity data by any route.

## Do not

- Do not source Bastrop permits from SmartCity, directly or through any intermediary store.
- Do not render an unsourced jurisdiction the same as a parcel with no permits.
- Do not fabricate an empty permit set for a jurisdiction that was never sourced.
- Do not scope or run a multi-jurisdiction wave here.
- Do not add the column without the basis; a bare null is the defect this program keeps
  finding.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot in
the first output. Report the permits type and how it distinguishes an empty set from an
unsourced jurisdiction, which jurisdiction you sourced and why you chose it, every blocker
hit, the measured cost of that one acquisition, and a live parcel serving its permits with
provenance. Name what contradicted this card, or say plainly that nothing did.
`leave_behind` named. Subagents do not commit.
