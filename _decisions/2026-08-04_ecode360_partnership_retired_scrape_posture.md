---
id: 2026-08-04_ecode360_partnership_retired_scrape_posture
title: Decision — General Code/eCode360 partnership track RETIRED; zoning is public record, acquire by scrape
date: 2026-08-04
status: active
owner: nick
related: [73_partnerships, 90_operations/onboarding_defect_class_backlog, _decisions/2026-08-03_ecode-related entries]
---

# eCode360: scrape, don't partner

## Decision

The General Code (eCode360) partnership track is retired as a dependency for jurisdiction onboarding. Operator ruling, verbatim intent: zoning is public information; we acquire it by scraping, the way Pflugerville was already captured during sources-list prep. Smithville's code is reachable through its citizen-facing portal; "we should be able to get the info one way or another." The eCode360 bucket (Smithville, Pflugerville, Kyle, Buda, Liberty Hill, Bee Cave, McAllen, Dallas proper, and the rest) moves from partnership-gated to engineering-track: prove the ecode360-scraper adapter (named in the registry, zero demonstrated ingests) or the citizen-portal path, whichever lands the corpus.

## Why

Adopted ordinances are public law. The partnership route (outreach scheduled 2026-05-30) never converged and was gating a growing bucket of Texas cities — the largest single access-blocked group in the state ingest — behind a bizops dependency with no closing signal. The operator's near-term goal is all of Texas; a partnership prerequisite on the largest publisher bucket is incompatible with that timeline.

## Operational notes (recorded, not relitigated)

The prior posture rested on eCode360's 403s/robots posture; the earlier record called direct ingest a policy violation. The operator's position is that public law is public record regardless of the hosting portal's posture. Engineering implications: the scraper must be robust to blocking (rate-limits, session behavior, the citizen-portal rendering path as an alternate); provenance discipline unchanged (every atom carries source URL + fetch timestamp); quality bar unchanged (same eval gates as Municode ingests). A partnership remains acceptable if General Code ever offers one on good terms — this decision removes it as a PREREQUISITE, not as a possibility.

## Reversal criteria

Reverse (re-gate on partnership or drop the bucket) if counsel advises the scraping posture creates unacceptable exposure, or if technical blocking escalates to where scrape/portal acquisition cannot meet the quality bar at sane cost.
