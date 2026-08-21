# L6 GTM polish scratch (P-28 / P-35)

## GROUND-TRUTH (2026-08-12)

- Stripe test catalog after rename: active products Smart Site Solo / Studio / Team only; Hauska string hits on active name/desc/nickname/metadata = 0.
- Active subscriptions at rename time: 10 (9 Studio price, 1 Solo price) — not zero.
- PE production host is `property-explorer-xi.vercel.app` (not `property-explorer.vercel.app` which 404s).
- PE facets gold 48021:34137 → HTTP 200 `readPath: atom-chain-warm` after env sync + prod deploy `dpl_7hKRRor3TcLAFqFHpPPyen2XWAat`.
- MCP keyed `get_property_atom_chain` returns ownerName; anon withholds owner-fact (`public-paid`).
- Workflow SM pull GREEN via SA `hauska-pe-key-sync@hauska-prod-497015.iam.gserviceaccount.com`.
- CLI OAuth `auth.json` token is NOT valid for `vercel --token` / Bearer API (403/invalidToken). Needs dashboard personal token.

## LESSON

- PowerShell capture of `gcloud secrets versions access` mangles UTF-16; write to file with Ascii/NoNewline or use cmd redirect.
- `vercel deploy --cwd apps/property-explorer` doubles path when Vercel Root Directory is already that folder — deploy from repo root.
- Never remove Vercel env before the re-add path is proven; restore via `vercel env add` with Node stdin of exact bytes.

## GROUND-TRUTH (2026-08-12T22:36Z)

- Operator personal `VERCEL_TOKEN` set on hauska-map; whoami HTTP 200.
- Workflow run `31647474972` conclusion **success** (full path including live facets verify).
- Post-run PE facets still `readPath: atom-chain-warm` on 48021:34137.

## OPEN

- 76j: rebuild Stripe unit_amounts to locked ladder; create Unlock $15; fix LDT `_stripe-setup-pro-price.mjs` so it cannot recreate Hauska Pro.
- Pre-launch: rotate this Vercel personal token as part of the security update (operator acknowledged chat exposure).
