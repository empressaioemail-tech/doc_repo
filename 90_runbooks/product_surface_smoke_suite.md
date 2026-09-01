---
id: product_surface_smoke_suite
title: Product-surface smoke suite (live GET probes)
date: 2026-08-05
status: active
owner: nick
related: [T2_polish_product_track, factory_onboarding_runbook, HEALTH_CHECK_2026-08-05_verdict, CATCHUP_program_2026-08-05]
---

# Product-surface smoke suite

Purpose: a small, repeatable live check-set over the product surface so operator screenshots stop being the first detector. This is the runnable form of T2 workstream 6 (recalibration item 4). It does not replace Warden sweeps or block-13 cert; it catches serve-path regressions (health, setback card/sheet drift, envelope sanity, corpus search) in one command.

## What it probes

| Probe | Path | Pass rule |
| --- | --- | --- |
| Engine health | `GET {ENGINE}/health` | HTTP 200, `status=ok`, `adapters=true` |
| Retrieval health | `GET {RETRIEVAL}/health` | HTTP 200, `status=ok` |
| Search functional | `GET {RETRIEVAL}/health/search` | HTTP 200, `ok=true`, `resultCount>0` |
| PE facets (card) | `GET {PE}/api/spine/property-atoms/{id}/facets` | HTTP 200, parcel match |
| PE atom-chain (sheet) | `GET {PE}/api/spine/retrieval/property-nodes/{id}/atom-chain` | HTTP 200, parcel match |
| Setback consistency | facets `envelope.setbacks` vs atom-chain `setbackRule` front/side/rear | Numbers equal (or both absent) |
| Envelope sanity | facets `envelope` | `status=ok` ⇒ `buildableAreaSqFt>0` and ring ≥4 verts; named honest declines pass |
| Corpus `/search` | `GET {RETRIEVAL}/search?q=setback&limit=3` | Optional; requires `RETRIEVAL_API_KEY`; HTTP 200 with hits |

Default bases (override with env):

- PE: `https://property-explorer-xi.vercel.app`
- Engine: `https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app`
- Retrieval: `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app`

Default parcels (three Bastrop downtown/gold nodes with warm chains): `48021:34073`, `48021:34785`, `48021:34017`. Override with `SMOKE_PARCELS=id1,id2,id3`.

## How to run

From `P:\doc_repo`:

```bash
node scripts/product-surface-smoke.mjs
node scripts/product-surface-smoke.mjs --dry-run
```

`--dry-run` still hits live endpoints and writes the artifact; it prints the planned probe list first and always exits 0 (report-only). Strict mode (default) exits 1 if any check fails.

Optional env:

- `RETRIEVAL_API_KEY` — enables Bearer `/search` (without it, `/health/search` still runs; `/search` is SKIPPED pass)
- `SMOKE_PARCELS` — comma-separated parcel node ids
- `PE_BASE`, `ENGINE_API_URL`, `RETRIEVAL_API_URL` — override bases
- `SMOKE_OUT` — artifact path (default `_scratch/product-surface-smoke-last.json`)

## When to run

After any PE / engine-api / retrieval-api deploy that touches serve paths. After a city-cohort re-warm. Before claiming a product polish close that depends on setback or envelope truth. Append to shared-code pipeline stages alongside the block-13 7/7 gate in `factory_onboarding_runbook.md` when the change can affect the customer surface.

## Interpreting fails

A setback card-vs-sheet fail means the inspect-card facets and the spine atom-chain disagree on F/S/R for the same parcel. That is a serve-path or facet-derivation bug, not a GIS source dispute.

An envelope sanity fail on `status=ok` with zero area or a degenerate ring is the health-check lead-exhibit class (stored envelope geometry wrong while setback RULES may still be correct). Route to T1 city envelope re-warm / Warden v1.2; do not "fix" by relaxing the smoke.

Honest declines (`setback-rule-pending`, `split-zone-ambiguous`, `unzoned-no-district-basis`) pass envelope sanity by design. Do not swap in a different parcel to hide a real ok-envelope fail.

## Out of scope (follow-ons)

Export text integrity rides T2 workstream 1 (DXF regression test). Chat citation-chip relevance is a spot check, not automated here yet. Paid-bubble UI walk is the paywall operator E2E (`pe_paywall_e2e_operator.md`).
