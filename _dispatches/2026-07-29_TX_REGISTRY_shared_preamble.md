# Shared dispatch preamble — TX registry + scraper wave (Batch 1 CAPCOG)

Paste into every sub-dispatch. WDLL: `_inbox/2026-07-29_tx_authoritative_source_registry_and_scraper_fleet_WDLL.md`

## STANDING DECISIONS (verbatim)

PUBLIC-RECORD sources only. No Cotality, no Regrid, no relationship/tenant/privileged data. Every source must be reachable by a no-relationship party. SmartCity is READ-ONLY reference, never a data path.

We are NOT partnering with eCode360 / General Code. We SCRAPE public law text. Do not propose partnership as the path.

NO live-corpus ingestion, NO baking, NO engine serving changes, NO corpus-DB writes in this wave. Collection + tool-building + verification ONLY.

Verify LIVE (fetch/parse the actual source). You do NOT certify your own artifacts — the planner runs the acceptance harness.

SCRAPING ETHICS + LEGAL CEILING:
- Rate: ≤ 1 request/sec/host. No concurrent hammering of one host.
- robots.txt: fetch and READ the target's robots.txt; if it disallows the path, STOP and report — do not proceed.
- STOP RULE: if corrected headers do not clear a 403, STOP and report to the planner. Do NOT escalate to IP/proxy rotation, residential proxies, session/cookie replay, or CAPTCHA-solving.
- Scope: public LAW TEXT only.
- Exit-bounded verification ONLY. NEVER a non-exiting serve/dev/watch command.

TWO SUBSYSTEMS — do not conflate:
- THIS WAVE = corpus code-text adapters at `packages/corpus/src/adapters/` ({municode, ecode360, raw-pdf, icc-code-connect} + new scrapers).
- NOT the GIS data-layer adapters at `packages/adapters/src/`. Zoning-GIS endpoint for registry field `zoning_gis` may be LOOKED UP from GIS registry, but do not wedge ecode360 into it.

ADAPTER OUTPUT CONTRACT (`packages/corpus/src/adapters/types.ts`):
`NormalizedCode = { metadata, blocks: NormalizedBlock[] }`
NormalizedBlock = flat ordered union: heading (has depth) | paragraph | definition | cross-reference | table | figure | note | amendment-record.
NO Section type. Emit section headers as heading blocks; bodies as paragraph/table/definition/note.

## Registry row schema (exact field names)

```json
{
  "jurisdiction_id": "string",
  "name": "string",
  "type": "city|county",
  "fips_place_code": "string",
  "population": "number|null",
  "parcel_count_estimate": "number|null",
  "parent_county": "string",
  "cog_region": "CAPCOG",
  "has_land_use_authority": "boolean",
  "has_zoning": "boolean",
  "current_code": {"name":"string","ordinance_no":"string|null","adoption_date":"string|null","effective_date":"string|null"} | null,
  "prior_code": {"name":"string","repeal_date":"string|null"} | null,
  "regime_type": "euclidean|form-based|hybrid|unzoned|unknown",
  "authoritative_source_url": "string|null",
  "stale_source_flag": "string|null",
  "reachable_adapter": "municode|ecode360|raw-pdf|ecode360-scraper|muni-site-scraper|manual-only|unknown",
  "zoning_gis": {"endpoint":"string","trust":"agrees-with-text|drift-detected|untested","authoritative_for_numbers":"gis|ordinance-text"} | null,
  "dimensional_standards_location": "string|null",
  "currency_proof": {"watch_url":"string|null","last_amended":"string|null","watcher_hook":"string|null"},
  "confidence": "high|medium|low",
  "provenance": "string",
  "verified_at": "ISO-8601 string"
}
```

Every field present OR explicitly null/"unknown" WITH a follow-up note in provenance. NEVER fabricate a source, date, or ordinance number.

## Currency check (mandatory)

For every jurisdiction with a published code: cross-check the code library's "current" claim against the jurisdiction's OWN ordinance/adoption page for a recent adoption/repeal signal. Populate `prior_code` when a recent replacement is found. This is the check that would have caught Bastrop (B3 repealed 2026-04-14, still served).

## Completeness ledger (mandatory in every shard file)

```json
{
  "shard_id": "...",
  "in_scope": N,
  "attempted": N,
  "complete": N,
  "gap_list": [{"fips_place_code":"...","name":"...","reason":"..."}]
}
```

If attempted < in_scope, say so explicitly. Silent partial coverage is a defect.
