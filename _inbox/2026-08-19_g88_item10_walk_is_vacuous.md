---
id: 2026-08-19_g88_item10_walk_is_vacuous
title: G-88 finding — item 10's GET walk cannot see what it is written to check
status: active
last_updated: 2026-08-19
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-18_g88_design_into_apps_WDLL,
    _inbox/2026-08-18_g88_surface_inventory,
  ]
---

# G-88 item 10: the acceptance walk is vacuous as written, measured

Planner measurement, 2026-08-19, against the serving revision `smartcity-dashboards-00018-kiw`. This is a
finding about the card's own acceptance instrument, not about the product.

## What item 10 says

"The deployed surface is walked. A grade is a live probe, never a merged PR. | check: GET each shipped
surface on the deployed service, on `template-city` and again on `?cityKey=empty-city`; HEAD returns 404
on this service so probe with GET; the serving revision is read and quoted."

## What a GET actually returns

The served document is **byte-identical across every lens and every pack**. Six URL forms, one hash:

```
/                                          3ff26f55870f8c451975030461df69f7731b041b07061842fcd1ba466409c639
/index.html                                3ff26f55870f8c451975030461df69f7731b041b07061842fcd1ba466409c639
/?lens=finance                             3ff26f55870f8c451975030461df69f7731b041b07061842fcd1ba466409c639
/?lens=public-works                        3ff26f55870f8c451975030461df69f7731b041b07061842fcd1ba466409c639
/?work=connections                         3ff26f55870f8c451975030461df69f7731b041b07061842fcd1ba466409c639
/?lens=finance&cityKey=empty-city          3ff26f55870f8c451975030461df69f7731b041b07061842fcd1ba466409c639
```

The mechanism is already established elsewhere and is the same one G-89 exists to fix. `index.html` is one
static document carrying every lens inline; `src/server.mjs`'s `sendFile` sends the file and never sees
the query string; `app.js` toggles an `.on` class after load; and the pack differences arrive later still,
through `/api/*` calls. The two packs do differ, but only behind the API:

```
/api/city-identity                    -> cityKey template-city, seal TC, generatesFixtures true
/api/city-identity?cityKey=empty-city -> cityKey empty-city,    seal EC, generatesFixtures false
```

So item 10 as written is **thirteen identical GETs, then thirteen more identical GETs**. It cannot see a
design change on any surface, it cannot tell the two packs apart, and it would return the same result on
the day before the design pass and the day after. It would pass on a build where every surface was
redesigned and on a build where none was.

## Why this was not caught when the card was written

The same shape as the three premises measured false at A-071, and it is worth naming because it is now
four. The card reasoned from "this product is a static server, so a GET is the honest probe" to "GET each
surface", without checking whether GETting a surface returns anything surface-specific. The reasoning is
intuitive, general, and wrong in this specific configuration: a single-document SPA-shaped static app has
exactly one surface at the HTTP layer.

The `HEAD returns 404` note in the same sentence is correct and was verified. Being right about the verb
is not the same as being right about what the verb can see.

## What discriminates, and what item 10 should mean

Three legs, and only the third can see a surface.

1. **Deployed bytes match the merged tree.** `sha256` of each served asset against the local checkout of
   the merged commit. This is what proves the design actually shipped rather than that a revision exists.
   Measured now on `00018-kiw` against `main` @ `6a4580d`, all four MATCH: `index.html`
   `3ff26f55870f8c45…`, `app.js` `5c5261bbbba22cd3…`, `shell.css` `025efa4937ecfbe3…`, `sc-kit.css`
   `4601e1bc0084ab35…`.
2. **The pack legs move to the API**, where the two packs genuinely differ, rather than to the document,
   where they cannot.
3. **A real browser walk, lens by lens, on both packs.** This is the only leg that sees a rendered
   surface, and therefore the only leg that can grade a design pass. Anything less is a claim that the
   file was deployed, which is leg 1 wearing a costume.

Leg 3 is also what makes the `empty-city` regression check mean anything: the reason for that check is
that a city with zero records has no exceptions, so every pill renders quiet and the tension mechanism is
switched off. That is a statement about rendering. No HTTP response can carry it.

## Disposition

The planner is implementing the three-leg version rather than satisfying the card literally, and naming
the change rather than quietly widening it. Precedent: item 8 was re-sequenced on a measurement at A-071
and the operator accepted the re-ordering. This is the same move on the same card.

If leg 3 cannot be run, item 10 is recorded **partially unrun with the reason**, and the design pass is
graded on legs 1 and 2 plus the source-level baseline counts. It is not recorded as met. A walk nobody
walked is the thing this card exists to refuse.
