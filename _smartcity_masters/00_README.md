---
id: smartcity_masters_readme
title: SmartCity category masters — the reference set
status: active
last_updated: 2026-08-01
applies_to: smartcity
owner: nick
purpose: Index and authority statement for the SmartCity category masters. These four documents are the corrected, current definition of the SmartCity product line. They are the reference set that other docs are weighted and corrected against in the doc reconciliation pass — not the other way around.
---

# SmartCity category masters

Ratified in the strategy session of 2026-08-01. **This folder is the reference set.**

## Authority

Where these documents and any other doc in the repo disagree about what SmartCity is, what it holds, or what may be said about it, **these win**. They were built from live code and ledger state, the Smart Site white papers, and operator rulings made in session. Older SmartCity docs predate the structure and in several cases actively mislead.

This folder is deliberately isolated from the numbered canon so the reconciliation pass has a fixed point to correct against.

## The structure

Three categories, on one foundation. Everything is built from **smart sites** — a smart site is any addressable place, fully twinned; a smart city is a bunch of smart sites. It is the unit, not a product.

| Doc | What it covers |
|---|---|
| [31_smartcity_dashboards.md](31_smartcity_dashboards.md) | Dashboards — a lens family keyed by audience and permission. Leads: city manager, development services, finance, citizen. CitizenConnect is the citizen lens, not a separate product. |
| [32_smartcity_asset_management.md](32_smartcity_asset_management.md) | Asset Management — the city's physical reality as a durable, access-controlled record. Delivered as a build. Record, then live state, then view. |
| [33a_smartcity_plan_review.md](33a_smartcity_plan_review.md) | Plan Review — pre-reviewed submittals against the city's own adopted code. Sold on money and staff capacity. Carries a licensed-content constraint. |
| [34_smartcity_smart_files_and_foundation.md](34_smartcity_smart_files_and_foundation.md) | The data foundation (never named externally, one sentence only) and Smart Files, its customer-facing face. Also covers the Compass rework. |
| [35_smartcity_positioning_framework.md](35_smartcity_positioning_framework.md) | How the line is positioned: the two-altitude rule, the three-beat pitch, the four uncontested claims, the never-say list, per-audience altitude, and the method for generating the peer-recommendation line. |

## How to use these

**Producing collateral.** Draw only from each doc's External language and Approved claims register. Sections marked INTERNAL ONLY must never reach a market-facing artifact. A claim not in a register is not approved.

**Reconciling other docs.** Correct the other doc, not these.

## Rulings made in session (2026-08-01)

- **Smart site is the unit**, not a product. Cities buy access to their smart sites and may deepen them. Parcel intelligence is not a separate product; it is a city's access to its smart sites.
- **Dashboards is a lens family**, keyed by audience and permission, expanding by department.
- **No aggregation-only dashboards.** If a city wants a screen that renders an existing vendor feed, they already have one. Connecting a feed means the thing measured becomes a record and every reading joins its history.
- **Telemetry is atomized by default.** What a sensor reads becomes a node; each reading becomes a record on it. Source-agnostic — no per-source capability caveat.
- **Asset Management is a build, not a module.** Scope is every physical asset a city tracks, water mains to sidewalks to vehicles. No v1/v2 staging.
- **Tier order is record, live state, view.** Sensors matter more to a city than visualization; 3D is real and deliberately last.
- **GovTitle is retired.** The durable-record capability is described plainly; a name may be set later once seen in practice.
- **Plan Review sells money and capacity** — less review sent to outside firms, more handled by existing staff, via submittals pre-reviewed before intake. The calibration and keystone story is internal and never dressed as buyer value.
- **No cycle-time or savings figures.** Mechanism and problem scale only. "Cut review cycles in half" is explicitly barred.
- **The foundation is never named externally.** One sentence: the way we capture and process data is the foundation for everything else to get built.
- **Smart Files is named** and is the customer-facing face — search from one interface, revise once and it is current everywhere, prior versions still there.
- **IPFS is never said in marketing.** Ownership is stated plainly: your data is yours, and you are not locked to us or any one host.
- **The learning loop is not sold.** Ambient capture and the plan-review write-back are one internal loop.
- **A city buys a system that becomes the foundation for programs.** Dashboards is a complete deployable system, never described as phase one.
- **Fleet is both** an asset class and a dashboard lens.

## Owed

1. **The peer-recommendation line** — generate candidates against the constraints in doc 35. The line itself is the one piece of positioning still open.
2. **Smart reports** — mentioned only, deliberately not defined this session. Two are live in the property surface: the smart site X-ray and the flood and drainage study. Bastrop's deployment carries more that become library material on rebuild. Do not enumerate beyond the two live ones.
3. **Government pricing tiers** — an operator decision gating every pricing-bearing artifact.

## Reconciliation debt these masters create

Docs that now contradict this structure and need correcting:

- `07a_smartcity_product_positioning.md` — sells a four-surface line; parcel intelligence and ambient capture both need demoting.
- `_sales/03_smartcity_os.md` — same four-surface line; its "infrastructure vision" is now Asset Management, and its do-not-claim-live-sensors instruction is superseded.
- `30_smartcity_os.md` — lists five products including Digital Twinning and CitizenConnect; carries the superseded M4-B/PLR/SD/W plan-review vocabulary.
- `47_codex_plan_review.md` and `33_smartcity_codex_1b_integration.md` — the superseded plan-review generation. Retire by status flip, not deletion.
- `46_smartcity_parcel_intelligence.md` — its spec'd parcel briefing is not what shipped; the live artifact is thinner and the spec is closer to what the smart site X-ray already does.
- Deployed SmartCity `QUICK_REPORTS_GUIDE.md` — documents six reports with illustrative KPI tables and claims PDF download the code does not produce; the Reports Center's 21 reports are names with a stub text download. Same class of problem as the retired GovTitle. Disposition owed.
