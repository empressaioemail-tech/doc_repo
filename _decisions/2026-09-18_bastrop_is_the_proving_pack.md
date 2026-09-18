---
decision_id: 2026-09-18_bastrop_is_the_proving_pack
date: 2026-09-18
owner: nick
status: active
supersedes_in_part:
  [
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md,
    _decisions/2026-08-17_dashboards_ui_then_one_feed.md,
    _decisions/2026-08-17_smartcity_dashboards_housing.md,
  ]
related_canonical:
  [
    _catalog/program_preambles/OPS-17.md,
    90_operations/OPS-17_govtech_stack_plan_of_record.md,
    _design/SMARTCITY_PACKAGE.md,
  ]
---

## Decision

**SmartCity designs are implemented and proven on `bastrop_tx`, against the live data Bastrop already
has wired.** `template-city` is a demo and fixture pack, and a build proven only on it is not proof of a
Bastrop design. Operator, 2026-09-18, on seeing the first-wave builds: *"it looks like this stuff was
built in the template city not bastrop. the designs were meant to be implemented in bastrop and harness
the data that much of which is wired into the bastrop dashboard."*

This supersedes three August 2026 rulings that were still being compiled into every OPS-17 dispatch:
*"template Dashboards UI first, then one adapter/source onto `template-city`. Live Bastrop is an
island, not the next card"*; *"Live Bastrop no-touch"*; and *"Live Bastrop stays `smartcity-os` until a
named island replacement"*. v2 on `bastrop_tx` is now that named replacement.

## Why the builds missed Bastrop, which is the reason for the ruling

**The lanes followed program law.** `_catalog/program_preambles/OPS-17.md` is stamped into every OPS-17
dispatch, and it told them to build on `template-city` and treat live Bastrop as no-touch. It also
states that it "wins on scope" over conflicting instructions, so a mission naming `bastrop_tx` would
have lost to it. Those rulings were right in August, when no real Bastrop pack existed. Since then
G-116 created `bastrop_tx` with real grants, G-145 recorded that v1 is being retired rather than run
alongside, D-12 moved the dashboards to DigitalOcean, and staff are moving to `app.smartcityos.io`. The
rulings were never retired. That is the defect.

**The planner's missions compounded it.** The G-156 mission never named `bastrop_tx`, and it pointed the
lane at fixture traceability, which lives on `template-city`.

## What "harness the data" means, measured

`bastrop_tx` already grants seven live feeds: the municode meeting calendar, MyGov permits, Samsara,
Spireon, FirstDue, Power BI CIP and GoTo. Fleet, Police, Public works and Fire and EMS can read live
Bastrop data today. Bastrop's v1 dashboard (`smartcity-os`) is wired to more than v2 can reach:

| Bastrop data | Wired in v1 | Reachable from v2 | Granted to `bastrop_tx` |
|---|---|---|---|
| Samsara, Spireon, FirstDue, Power BI, GoTo, MyGov permits | yes | yes | yes |
| MyGov inspections, code violations, business licenses, work orders | yes | yes, served by production v1 at `8bea7fa` | no |
| OpenGov, OpenGov budgeting and planning, v1 permit revenue | yes, with API keys in production | no platform route | no |
| v1 executive overview | yes | no | no |

The OpenGov credentials exist in production in both projects (`smartcity-OPENGOV_API_KEY` and
`smartcity-OPENGOV_BNP_API_KEY` in `smartcity-os-prod`; `opengov-api-key` and `opengov-bnp-api-key` in
`smartcity-dashboards`). They exist; whether they return live data is not yet proven. v1 sits behind a
login and now runs on DigitalOcean.

## The rules this puts in force

1. **Prove on `bastrop_tx`.** Every design build in `smartcity-dashboards` is verified against
   `bastrop_tx` and its granted feeds. A pass on `template-city` is not a pass.
2. **Bastrop data that is wired but not granted is a bridge to build, not a fixture to fall back
   on.** A surface that needs data Bastrop has in v1 but v2 cannot reach says so as a declared absence,
   and the row cards the bridge: a v1 platform route, a v2 adapter declaration, and a grant.
3. **Never default a city.** A route that takes a `cityKey` refuses when it is missing. Defaulting to
   `template-city` serves demo data silently to anyone who forgot the parameter.
4. **v1 stays production, and changes to it are bridges.** `smartcity-os` behind `smartcityos.io` is
   what Bastrop uses today. Adding a platform route to it is allowed. Every v1 deploy goes by canary,
   with `services[0].source_commit_hash` read back (OPS-25 rule 13), and never breaks the v1 surface.
5. **Keep `template-city` clean of Bastrop.** Unchanged from G-74, and consistent with rule 1: Bastrop
   data belongs on `bastrop_tx`, and a demo pack must not carry it.

## Structural commitment check

**Sell reasoning, not data.** Engaged. Rule 2 keeps absence declared rather than filled, and rule 3
stops a missing parameter from quietly substituting demo data for a city's own.

**Confidence is earned.** Engaged. A pass on fixtures had been standing in for a pass on the customer's
data. Only the second earns anything.

**Cost per jurisdiction.** Engaged. The bridge pattern (v1 platform route, v2 adapter, grant) is how
the next city's live data reaches v2 too, so building it for Bastrop is not Bastrop-only work.

**Dual interface.** Not engaged.

**Tenant sovereignty.** Engaged. `bastrop_tx` is `tenant-private`. Proving on it means proving the
tenant gate as well, which a public demo pack never exercises.

## Reversal criteria

Revisit rule 1 when a second city is onboarded. Proving on "the customer's real pack" is the principle,
and `bastrop_tx` is its first instance.

Revisit rule 4 when v1 is decommissioned. After that, bridges are no longer needed, and v2 reads its
sources directly.

## Dependencies

Carried into every OPS-17 dispatch through `_catalog/program_preambles/OPS-17.md`. The operator's
memory is not the vehicle; standing decisions reach lanes only through what is compiled into their
dispatch.

## Counterparties

Internal: Nick (operator, ruled). Bastrop is the customer whose live data this rule exists to put on
the screen.
