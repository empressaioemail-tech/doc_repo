---
id: 2026-07-29_B2_pflugerville_muni_site_STATUS
title: Track B2 STATUS — Pflugerville municipal-site scraper (STOPPED on encodeplus robots)
status: active
last_updated: 2026-07-29
applies_to: hauska-engine
related:
  - 2026-07-29_tx_authoritative_source_registry_and_scraper_fleet_WDLL
---

# Track B2 — Pflugerville muni-site scraper STATUS

**Verdict: STOPPED** (primary UDC full-text fetch)

## True content URL(s)

- Primary: `http://online.encodeplus.com/regs/pflugerville/index.aspx` (robots Disallow `/regs/` for UA `*` → STOP)
- Library pointer: `https://ecode360.com/PF6442` → Ch.157 `https://ecode360.com/39362841` / §157.001 `https://ecode360.com/39362842` (UDC “not printed herein”)

## Artifacts

- Adapter: `P:\hauska-engine\packages\corpus\src\adapters\muni-site-scraper\` (README: per-city vs generalizes)
- Proofs: `P:\tmp\tx_scraper_proofs\pflugerville\` (`raw/`, `normalized.json`, `fidelity_harness/`, `discovery.md`, `STATUS.md`)

## PDF-via-raw-pdf

**No** (UDC not an allowed public PDF). Pattern still delegates PDFs to existing `RawPdfAdapter` (fixture tests only).

## Tests

Fixture unit tests: **10/10 PASS** (no live network in CI).

## Ethics / corpus

Landing robots OK; encodeplus STOP recorded; CivicPlus content API 401 Bearer STOP (no escalation). Zero bake/ingest/warm/corpus-DB writes. No commit.
