---
id: 2026-08-19_template_city_build_opened
title: Session — the template city build opens, and a buried intent gets dug out
status: active
last_updated: 2026-08-19
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-19_template_city_lens_build_sheet,
    _inbox/2026-08-19_t1pack_close,
    _inbox/2026-08-19_t1shell_close,
    _inbox/2026-08-19_t1kit_close,
    _inbox/2026-08-17_g18_shell_homes,
  ]
---

# Session 2026-08-19, second half: the template city build opens

The operator walked the deployed dashboards, saw Public works, Parks and Police rendering as honest-empty shells, and said the screenshots did not match what he expected. They matched what was on main exactly. That is the finding.

## What had gone wrong

`_inbox/2026-08-17_g18_shell_homes.md` inventoried 67 live Bastrop staff jobs and gave each a home on Dashboards. About forty carry the disposition `Not built`, written to mean *this surface does not exist yet*. Across three agent handoffs that hardened into *this surface is meant to be empty*, and by this session it was travelling in dispatches as a hard constraint: "the sixteen honest-empty states STAY empty." It was preserved faithfully through two cards and verified on every merge.

The register was never wrong. Its disposition column was read as a destination rather than as a starting line, and the operator's actual intent — inventory Bastrop, then use it as the guide to build the others — was carried in no field any handoff read. That is a handoff-schema failure, not an execution failure, and it is the second time this program has paid for meaning that had nowhere to travel.

## What the live product actually carries

Live `smartcityos.io` is an SPA: every route returns the same 3,624-byte document, one sha256 across `/`, `/overview`, `/fleet`, `/police` and `/citizen`. So the inventory came from the shipped bundle: 138 routes and 177 distinct API endpoints across 11 vendor families. Development services is MyGov across sixteen endpoints including work orders with SLA, daily queue and geo-clusters. Police is Spireon plus Verkada. Fire is FirstDue plus VFD plus seven county flood and wildfire layers. Fleet is Samsara. Public works is PowerBI plus GoTo. Finance is OpenGov plus permit revenue plus scenarios.

That evidence is what the build sheet is built on, and it is evidence of what data exists rather than an instruction to connect a feed. No adapter was granted by any of this work.

## Three rulings

Honest absence moves down one level. It used to describe the surface; now the surface exists and what is honest is which sources the pack has granted, per region, with its basis. The product could not previously distinguish "we did not build Parks" from "your city has no Parks data", and those are different sentences to a customer.

The department roster matches live and is expected to grow, because cities have different org charts and forcing Bastrop's departments into a smaller set risks adoption. The lens roster is a template library rather than a fixed five.

Demo data on every lens so the UX can be worked, with one `Demo` chip in the top-left rather than a badge per region.

## Wave 1 shipped

The fixture-pack seam and shell function parity ran in parallel on disjoint file sets, then the kit re-vendored behind them. Product main `c7d7980` serving revision `00023-yex`; kit main `17eccfa`; 273 product tests and 86 kit tests green; the design bundle re-synced to 482 files.

Ruling 1 turned out to be four states rather than two, and that refinement is the most durable thing the wave produced. `ungranted` is distinct from `granted-empty`, from `no-fixture-source`, and from `not-registered`, which is now the only surviving meaning of "not built". It was proven by flipping a grant rather than by reading code: granting Spireon on a throwaway pack takes the patrol roster from zero records to ten while every other domain stays byte-identical and `grantedAdapters` stays empty. If ungranted and not-built were indistinguishable one layer down, the original misreading could survive again.

Shell parity brought back the theme toggle, an account menu, session state, notifications, tenant branding, help and feedback. The theme resolves in the same head script G-89 shipped, which is what keeps it from reintroducing that card's flash one attribute over. Verified on the deployed surface with the module blocked: no stored preference resolves dark under either OS preference, a stored light beats a dark-preferring OS, and the surface attribute still stamps correctly in every case.

## What the executors corrected

All three corrected a planner figure, which is what the briefs asked for, and two of the corrections changed the design rather than a number.

The pack seam lane found my instruction unsatisfiable: a pack that generates fixtures structurally cannot carry a granted adapter, because a G-74 guard throws on exactly that. Read literally, every exemplar domain would have been ungranted. They added a third pack axis instead, leaving the guard intact.

The adapter catalog went to ten rather than the eleven I claimed. My eleventh was `vfd`, which is Bastrop's own volunteer fire department route rather than a third-party vendor.

The shell lane concluded no kit re-vendor was owed, and that was wrong. Its reasoning — `sc-kit.css` untouched, no token added — is the right test for the product-line question and the wrong one here, because the kit vendors both stylesheets. The follow-on lane proved it by watching it fail: kit main was already red against live product main before it changed anything.

## What I got wrong

My "eleven vendor families" was wrong by one and I did not catch it; an executor did.

I told the pack lane to make the `$0` assertions per-pack. All six read `web/index.html`, which is pack-invariant, so they cannot be and do not need to be. The gate that actually needed a pack dimension was a different one.

And I ran a determinism check that compared two empty strings and read as a pass, then a rogue-domain probe that was rejected six times for six different reasons that were all my record shape rather than the guard I was trying to exercise. The check that finally settled it was breaking the guard and watching four tests go red. A probe that produces no output is indistinguishable from a probe that passes, and I have now made that mistake twice in one day.

## Open

Wave 2, the department lenses, ready to fan on the seam. Two operator calls first: whether the footer should distinguish granted from demonstrated, since template city now reads "0 of 10 sources granted" beside three populated regions; and how to split the Connections register's auth row, two of whose four bundled jobs now exist while the disposition vocabulary has no value that fits.

A near-miss worth keeping: the shell lane's first draft echoed a signed webhook URL into a basis string served to anonymous browsers. It was caught in-lane, fixed so only the variable name travels, and carries a canary assertion proving the value cannot.

The Design picker walk is still owed by the operator and is still recorded as unrun.
