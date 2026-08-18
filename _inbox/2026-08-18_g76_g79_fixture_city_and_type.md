---
id: 2026-08-18_g76_g79_fixture_city_and_type
title: G-76 to G-79 type conformance, fixture city, and two production divergences
status: closed
last_updated: 2026-08-18
applies_to: smartcity
owner: nick
related:
  [
    _decisions/2026-08-18_smartcity_kit_component_package,
    _decisions/2026-08-18_template_city_becomes_fixture_city,
    _inbox/2026-08-17_g73_shell_design_review,
    _inbox/2026-08-17_g75_shell_mounts_motion,
    30b_smartcity_design_system,
    30c_smartcity_platform_ia,
  ]
---

# G-76 to G-79

Serving `smartcity-dashboards-00016-77z` @100%. Four PRs merged: **#15** `30cb660` (G-76), **#14** `321119f` (G-77), **#16** `04e16ed` (G-78), **#17** `23154be` (G-79). 149 tests. Live Bastrop untouched, no adapter granted, G-24 still zero.

## What the demo is now

An anonymous visitor opening Development services sees fourteen generated permit cases, sorted unresolved-first, with the status column carrying the only saturated colour on the page and the four tiles reading 3 / 5 / 4 / 2 with "of 14 generated cases in flight" beneath each. `empty-city` shows the same screen honest-empty with its own basis. That is 30b law 3 working for the first time, because until this card there was nothing unresolved for the design to be loud about.

## Two production divergences, and what they have in common

Both cards passed CI, passed my own local verification, and were broken on the deployed service. Neither was a coding mistake in the changed code. Both were the same shape: **a code path that no local run executes.**

**G-78.** Reading a pack's content went through the same gate as enumerating packs. For a public-free pack that gate falls through to "is a service key configured", which is deployment posture rather than access policy. Locally `DASHBOARDS_API_KEY` is unset so the gate is open; in production it is set, so the demo refused its own records to the anonymous visitor it exists for. The pipeline returned 401 and the UI degraded to honest-empty, which is why it looked like nothing had shipped rather than like something had broken.

**G-79.** After the gate opened, the endpoint returned 200 with zero records. Neon was queried directly and held `generates_fixtures = true` for `template-city`. Both `SELECT` statements listed columns explicitly and stopped at `notes`, while the write path had learned `environment` and `generates_fixtures`, so `rowToPack` read undefined and mapped it to false. `environment` hid half the fault behind its `"demo"` fallback. A local run has no DSN, takes the in-memory pack path, and never executes the SQL at all, so the entire Neon read path was unexercised by a fully green suite.

The lesson is not "test more." It is that **a green suite on a store the deployment does not use is not evidence about the deployment.** Both fixes ship a guard that runs in the production condition: G-78's test sets `DASHBOARDS_API_KEY` because no local run does, and G-79's walks every property `rowToPack` actually reads and fails if the SELECT omits it, so it cannot go stale as columns are added. Both were watched fail before being watched pass.

Neither executor could have caught these. Both verified exactly as instructed, locally, and both reported honestly. The gap was in my dispatch: I required screenshots and `npm test` and did not require a probe of the deployed surface after merge. That is the correction worth carrying, not a note about either agent.

## G-76, type

Fourteen declarations below the 30b 12px floor went to zero; 42 rules and 67 declarations changed, none of them colour, radius, shadow, transition or animation. Panel heads moved from 13/18 to the 15/22 head step, which is most of what made the build read flat: with heads at 13 and body at 14 there were no heads.

The nav badge width problem was solved in CSS alone, because `src/ui.test.mjs` asserts an exact byte sequence for fifteen nav rows and that file belonged to the other lane. Badges wrap to a second line and right-align there; measured 13 of 15 rows single-line, the two wrapped being Development services and People and access.

Found and not fixed, carried forward: the top bar's min-content width grew from 500 to 545px, so it overflows below ~545px where it previously fit; the narrowest designed breakpoint is 900px and 820 is clean. `.cz` body copy is 15px where 30c line 66 grants citizen 16px. Control weight stays 500 where the ramp has no 500 UI step; changing it shifts emphasis product-wide and wants a ruling.

## G-77, the fixture city

Record shapes are declared beside `ADAPTER_KINDS` as data: an envelope, a fixture mark, four case-status values each carrying a semantic severity, and `mygov` declared in full as `permit-case`. The other six kinds carry an explicit undeclared entry with a basis, and a test enumerates every adapter id so a new kind cannot arrive silently shapeless. That declaration is the part that makes a later real-city swap work without the surfaces changing.

Fourteen rows on `template-city`, zero on `empty-city` and `fixture-city`. Tiles are counted from the records, never from the plan and never by subtraction.

The executor made one call better than the card: it minted **no parcel at all**. Every `48021:*` identifier is a real Bastrop County parcel, so attaching invented cases to the demo fixture range would have been a quiet identity collapse. `place.parcelNodeId` is null with a stated basis, and places are obviously invented (Fixture Ridge, Specimen Yard, Placeholder Heights).

Zero CSS classes were added, enforced by a test that checks every class used against the kit's definitions.

## Carried forward

**Chrome does not follow the pack.** On `empty-city` the top bar still reads "City of Template · TX" and the nav footer still reads "1 of 12 sources connected | template-city", while the breadcrumb correctly says "Empty city". City name, seal, environment badge and the source counter are static markup. This is the real "swap a city with one command" card, and it is the first thing to build next, because the pack switch is otherwise only half a switch.

**`[hidden]` is inert product-wide.** The kit gives `.pill`, `.prov` and `.state` an explicit display, so the attribute does nothing on them. It had already shipped: the Overview meetings panel rendered an amber "Partial" beside "no meeting packet has been read". G-77 fixed it behaviourally with a `show()` helper; the root fix is a single `[hidden]` rule in `shell.css`.

**Queue loudness rides on the pill alone.** `.rail` exists only inside `.srcreg` with no critical variant, and this repo ships no matrix classes, so the Unchecked hatch has no component yet. Named rather than faked.

## Process notes

The canon gate and the dispatch template gate both blocked my first fan: the dispatches were hand-assembled, and then the no-nesting clause was not the first line and no close artifact was named. Both hooks did exactly what they exist for.

The close artifact path disagreed between the hand-written card and the compiled dispatch, so both executors wrote both files rather than guessing which one was read. The compiler-named paths are canonical; the duplicates were byte-identical and have been removed. Future cards should not name a close path by hand.
