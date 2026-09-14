---
id: 2026-09-14_COORD_bastrop_cutover_to_dashboards
title: COORDINATION — Bastrop cutover onto smartcity-dashboards, and its boundary with the Smart Site lane
date: 2026-09-14
status: coordination memo — boundaries are RULED (repo_intents); the cutover's own WDLL is OWED
kind: coordination
owner: nick
from: Smart Site lane (doc_repo integration seat)
to: the Bastrop cutover lane
related:
  - _catalog/repo_intents.md
  - _inbox/2026-09-14_county_to_serving_WDLL.md
  - 90_operations/OPS-24_county_to_serving_program.md
---

# COORDINATION — Bastrop cutover onto smartcity-dashboards

## You are sanctioned, and canon names the condition you are satisfying

`_catalog/repo_intents.md` puts `smartcity-os` under **ABSOLUTE NO-TOUCH** with an explicit
lift condition, verbatim:

> "**ABSOLUTE NO-TOUCH** until the Dashboards template is the staff path and a named cutover
> WDLL runs. Then Bastrop is city one of the onboarding machine, not a unique codebase."

That is this work. Two things follow.

**Your cutover needs a named WDLL.** That is the literal condition in the ruling, not a
formality, and it is the thing that lifts the no-touch.

**Your destination framing is already ruled.** Bastrop becomes **city one of the onboarding
machine**, not a preserved special case. Anything that makes Bastrop more unique rather than
less is moving away from the ruled destination.

## Your boundaries, from the same ruling

`smartcity-dashboards` is its own repo, own service, own store:

```
GitHub     empressaioemail-tech/smartcity-dashboards
Neon       ep-still-wave-avbwm4yc-pooler  db neondb   (this product's own store)
GCP        smartcity-dashboards / 666199866241
Cloud Run  smartcity-dashboards-00001-92j @100%
```

The ruling's own do-not list, verbatim: **"Not `smartcity-os`. Not Asset Management. Not a
repo per city. Do not clone live Bastrop wallpaper. Do not deploy into `smartcity-os-prod`,
`hauska-prod-497015`, or `legacy-design-tools-prod`. Not Hauska substrate."**

You **mount** the Hauska spine plus SmartSite plus Smart Files over G-13. You do not
reimplement them.

## What the Smart Site lane is, and what it is touching right now

Everything under OPS-24 and OPS-23 is collectively **the Smart Site lane** (named 2026-09-14):
the county-to-serving pipeline, the gate fix, the Burnet prototype, the farm model. It owns
`hauska-factory`, `hauska-engine`, `legacy-design-tools` and `hauska-map`.

**Bastrop is being actively written by that lane right now.** OPS-23 wave 6 carries P-156's
Bastrop per-city declaration round and is on its last subagent. **Read Bastrop after wave 6
hands back, or treat anything read before then as provisional.**

**A passing gate is not evidence today.** P-195 is fixing a publish gate that returns
`ok: true` on a county with zero earned cells — total absence passes while partial absence
refuses. Until it lands and is proven by violation in both directions, **do not build any
dashboard element that treats a gate pass as a coverage claim.**

## Three hard lines you will be tempted to cross

**Bastrop MyGov is off limits.** `smartcity-os` `tenant_id=2` carries 658 active permits plus
inspection, violation and work-order data. It is a city customer's internal feed. It must
never populate a public parcel rail. **It will look like free, high-quality coverage when you
find it.** Tenant sovereignty and the no-privileged-data rule both forbid it, and the join
will look like an obvious win to whoever hits it first.

**Command Center and Property Explorer are not the same surface.** CC is the internal operator
console; PE is the customer app. Never collapse them. CC deploys to `cmdcenter/blush`, not
`command-center/jade`.

**Dashboards embeds, it does not compute.** OPS-23's G-110 record states the Dashboards embed
is "structurally incapable of diverging since it has no separate computation of its own."
**Preserve that property.** The moment Dashboards computes its own version of a fact it
becomes another read path, and the program on the other side of this memo exists because one
parcel was being served by six.

## Repo and commit protocol

Stay in `smartcity-dashboards`. If you need a change in `hauska-factory`, `hauska-engine`,
`legacy-design-tools` or `hauska-map`, **request it from the Smart Site lane via your close**
rather than making it yourself.

On `doc_repo`: multiple sessions are already writing `main` from one checkout and it has
collided three times in three days — four plan-row IDs on 2026-09-13, an amendment by three
minutes on 2026-09-14. **Hand artifacts back through `_inbox/` rather than committing to
`doc_repo` main.** If you must take a plan row, re-read the max ID immediately before and
immediately after writing, and expect it to have moved.

## What we need from you

Name your WDLL. Name the repos and stores you will write. Declare your snapshot in your first
output.

And tell us the one thing only you can: **if the cutover needs a fact from the spine that
Bastrop does not currently serve, name the fact.** The Smart Site lane is filling exactly
those rails and can sequence yours. Asking is cheap; discovering it at cutover time is not.

## Live state you should not re-derive

```
Bastrop        one of six CTX counties, actively written by wave 6 right now
The gate       returns ok:true on zero earned cells — fix in flight as P-195
Six writers    owner, land-use, flood-hazard, rail-corridor, rrc-pipeline,
               special-district cannot re-run under the current lease
Envelope       buildable area/percent/status REFUSED BY RULING (R-2), not broken.
               The polygon draws; the figure is withheld deliberately. Do not
               "fix" this and do not render it as a gap.
Serve path     working; one real defect (F25) — record-path payloads print
               bakedAt/snapshotAt from an old snapshot while the cells behind
               them were written in September. Values right, label lies.
```
