# Card

Make the chrome follow the pack. Right now a pack switch is only half a switch.

Housing: `empressaioemail-tech/smartcity-dashboards`. Clone fresh to a new directory under `P:\tmp`. Branch from `origin/main` as `g80/chrome-follows-pack`. Node 22+, `npm install`, `npm test`.

You own `web/index.html`, `web/app.js` and `src/`. A parallel lane (G-81) owns `web/shell.css`. **Do not edit `web/shell.css` or `web/sc-kit.css` at all.**

# The defect

Serving `smartcity-dashboards-00016-77z`. Open `/?lens=development-services&cityKey=empty-city`. The breadcrumb correctly reads "Empty city". The top bar still reads **"City of Template · TX"**, the seal still reads **CT**, and the nav footer still reads **"1 of 12 sources connected | template-city"**.

City name, seal, environment badge, page title and the footer are static markup. `web/app.js` has zero references to `brandcity`. So the most prominent identity on the screen names the wrong city, and the "swap a city with one command" property the fixture-city ruling promises cannot be demonstrated.

# Build

Identity resolves from the active pack, everywhere it appears:

1. Top bar city name and the state suffix.
2. The seal initials.
3. The environment badge, from `pack.environment`, so a pack that is not demo does not render Demo.
4. The document `<title>`.
5. The Compass scope line.
6. The nav footer.

The pack already carries `cityKey`, `displayName`, `accessPolicy`, `environment`, `generatesFixtures` and `grantedAdapters`. Read the existing resolution path before inventing one; `/api/lenses/development-services/pipeline` already returns `cityKey`, `displayName` and `environment` to an anonymous caller, and `/api/lenses/city-manager/compose` is the other public path.

**Anonymous access is the requirement, not a nice-to-have.** Per `_decisions/2026-08-18_template_city_becomes_fixture_city.md` and the G-78 fix, reading the content of a **public-free** pack is public: `canReadPackContent` / `packContentReadStatus` in `src/tenancy.mjs` exist for exactly this. Pack identity for a public-free pack is content. A tenant-private pack must still refuse an anonymous caller, and enumeration via `/api/city-packs` must stay shut when `DASHBOARDS_API_KEY` is set.

## The nav footer needs a ruling, and you make it

Today it reads "1 of 12 sources connected", derived at bake time from the Connections register, beside a hardcoded `template-city`. The city must follow the pack. The figure beside it is your call, and whichever you choose must be **true for the pack being viewed and must carry its counting rule**. The register's product-level figure belongs on the Connections page; a per-city footer claiming a product-level count would be a figure without its denominator. State what you chose and why in your report.

# Constraints

- No new CSS class, and no CSS file edited. Compose existing kit classes. If markup needs a class that does not exist, stop and report.
- Static markup must not name a city that the active pack is not. If a value is a fallback before JS resolves, it must be honest about being a fallback rather than asserting a specific city.
- `_decisions/2026-08-18_template_city_becomes_fixture_city.md` labelling gate still holds in full, including that the environment badge reads Demo on any pack whose records are generated.
- Do not seed from any real city. Do not grant or run an adapter. `grantedAdapters` stays empty on every pack. G-24 stays zero.
- Forbidden anywhere in `web/` or `src/` outside tests: `permitflow`, `CitizenConnect`, `leaflet`, `pipedrive`, `stripe.com`, `Bastrop`, `Chestnut`.

# Verify before reporting

1. `npm test`. All pass, including tests you did not write.
2. **Run the production condition.** Two divergences in a row shipped green and were broken on the deployed service, both because a code path no local run executes: the pack gate is open locally because `DASHBOARDS_API_KEY` is unset, and the Neon read path never runs locally because there is no DSN. Any test you add for pack identity must run with `DASHBOARDS_API_KEY` set. Where you can inject a query, exercise the SQL read path too.
3. Start the server on a free port in the background, then **look at screenshots** at 1600x1000 for `template-city` and for `empty-city`. Chrome must name the right city in both. Use `C:\Program Files\Google\Chrome\Application\chrome.exe` with `--headless=new --disable-gpu --no-sandbox --hide-scrollbars --virtual-time-budget=10000 --screenshot=<path> <url>`. Kill the server when done; never run a command that does not exit.
4. Confirm `web/shell.css` and `web/sc-kit.css` are blob-identical to `origin/main`.

# Report

PR number, CI check-run conclusion string, close artifact path, what you chose for the footer figure and why, every surface that now follows the pack, and — required — **every code path your tests do not exercise, naming any that differs between a local run and the deployed service.**
