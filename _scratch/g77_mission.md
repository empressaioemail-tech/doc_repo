# Card

Make `template-city` a **fixture city** that demonstrates the product by default, and prove it one lens deep on Development services.

Housing: `empressaioemail-tech/smartcity-dashboards`. Clone fresh to a new directory under `P:\tmp` (e.g. `P:\tmp\g77-fixture`). Branch from `origin/main` as `g77/fixture-pack`. Node 22+, `npm install`, `npm test`.

Lane B76 owns `web/shell.css`, the top bar and the left nav in `web/index.html`. **You must not edit `web/shell.css` at all, and must not edit the `<header class="shell-top">` or `<nav class="shell-nav">` blocks.** If the planner merges G-76 first you will be asked to rebase.

# The ruling you are implementing

`_decisions/2026-08-18_template_city_becomes_fixture_city.md`, active 2026-08-18. `template-city` becomes a fixture city carrying synthetic records generated from adapter output contracts, labelled as fixture at every surface. A third pack, `empty-city`, keeps the honest-empty demonstration `template-city` provides today. A fixture record is not a feed, not a city's data, and not a claim. Swapping a real city in is a pack switch, not a data migration.

Why this exists: the design system generates hierarchy from exceptions (30b law 3, "quiet on satisfied, loud on unresolved" — Pass is gray, Uncertain carries the amber rail, Unchecked carries the hatch, and the unresolved row is the loudest object on the page). With zero records nothing is unresolved, every pill renders quiet, and the design cannot be evaluated or reviewed. That is the problem you are solving.

| Pack | Access | Carries | Shows |
|---|---|---|---|
| `template-city` | public-free | Generated fixture records | The product working, every state exercised |
| `empty-city` | public-free | Nothing | Honest-empty, the unconnected city |
| `fixture-city` | tenant-private | unchanged | Tenancy test subject, not the demo |

# What you will find, and the extra job it creates

`src/adapters.mjs` declares `ADAPTER_KINDS` with `id`, `displayName`, `writesTo` (spine or files) and `defaultAccessPolicy`. It declares **no record shape**, so you cannot generate from the contract as it stands.

Your first job is to extend the adapter contract with a declared record shape per kind, then generate from that. Do it as a data declaration next to `ADAPTER_KINDS`, not as ad-hoc code in the generator. This is the part that makes the swap work later: when a real city is granted an adapter, its records arrive in the same declared shape the fixtures used, so the surfaces do not change.

Scope the shapes to what this card needs. `mygov` is the one that matters: permit and work-order records with at minimum an identifier, a subject, a stage, a place, and a status that can carry the unresolved states. Declare the others only if it costs nothing.

# Build

1. **`empty-city` pack** in `src/city-pack.mjs`, public-free, granting nothing, generating nothing. The honest-empty screens must stay reachable and tested. Read the existing cityKey resolution before inventing one.
2. **Records dimension on the pack.** A pack declares whether it generates fixtures. `template-city` does; `empty-city` and `fixture-city` do not.
3. **Fixture generator** in a new `src/fixtures.mjs`. Deterministic: same input, same output. No bare `Math.random()`, no `Date.now()` baked into stored values in a way that makes tests flap. Enough rows to exercise the design: a pipeline with overdue, in-review, awaiting-applicant and ready-to-issue rows, including unresolved states so the amber rail and the hatch actually render.
4. **Development services, one lens deep.** Wire the four metric tiles (Overdue, In review, Awaiting applicant, Ready to issue) and the Pipeline tab to the generated records. Metrics show real counts when records exist and keep saying "Not read" when they do not.

**Compose existing kit classes only. Do not add a CSS class, and do not edit `web/shell.css`.** 30b section 4: component classes may be extended in a repo only by composing existing ones, never by declaring a new color, radius, duration or type step. The kit already has `.dt` (data table with `thead`/`tbody`, `.id`, `.subj`), `.srcreg`, `.pill` with `p-ok`/`p-info`/`p-warn`/`p-crit`/`p-restricted`/`p-quiet`, `.state`, `.basis`, `.metric`, `.prov`. Read `web/shell.css` to see what exists, use it, change none of it. If you genuinely cannot express a row with existing classes, stop and report rather than adding one.

# The labelling gate, all of it tested

1. The environment badge reads Demo on any pack whose records are generated.
2. Every generated record is marked as fixture **in the payload**, not only in the chrome, so a record that escapes its surface still says what it is.
3. No generated record carries a real person's name, a real street address, a real parcel outside the established demo fixture range, or a real vendor account identifier. Invented names must be obviously invented.
4. No generated value is presented as money collected, a payment completed, or a confidence that was earned.
5. `empty-city` generates nothing, and the honest-empty screens stay reachable and tested.

# Hard constraints

- Do not seed fixtures from any real city's rows.
- **G-24 stays zero.** Assets shows no city-owned asset records on any pack. Its emptiness is a ruling about the world, not about this demo.
- Do not start G-52. Do not grant or run a real adapter. `grantedAdapters` stays empty on every pack.
- No `$0`, no payment-complete theater, no invented "last synced" time, no staff name, no work-order assignee.
- Gold parcel `48021:34137` stays labelled a demo fixture.
- Do not touch `web/sc-kit.css`.

# Verify before reporting

1. `npm test` from the repo root. All tests pass, including ones you did not write.
2. Start the server on a free port in the background (`PORT=8096 node src/server.mjs &`), wait, then **look at screenshots**. Use `C:\Program Files\Google\Chrome\Application\chrome.exe` with `--headless=new --disable-gpu --no-sandbox --hide-scrollbars --window-size=1600,1000 --virtual-time-budget=10000 --screenshot=<path> <url>`. Capture Development services Pipeline on `template-city` and the same screen on `empty-city`. Read both images. The fixture screen must show a populated queue where unresolved rows are visibly the loudest thing on the page; the empty screen must still be honest-empty. Kill the server when done.
3. Grep for the forbidden strings and confirm `web/shell.css` is byte-identical to `origin/main`.

# Report

PR number, CI conclusion string, the record shapes you declared and where, how many fixture rows in what states, what the two screenshots actually showed, how each of the five labelling-gate items is enforced and by which test, and anything you could not do with existing classes. If part of this card turns out to be wrong or impossible as specified, say so plainly rather than working around it silently.
