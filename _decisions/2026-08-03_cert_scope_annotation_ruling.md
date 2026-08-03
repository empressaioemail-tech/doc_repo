---
id: 2026-08-03_cert_scope_annotation_ruling
title: Decision — Cert issues WITH scope annotation when a core rail declines (not withheld)
date: 2026-08-03
status: active
owner: nick
related: [90_operations/OPS-8_blocker_free_onboarding_model, _sessions/2026-08-03_handoff_execution_pr213_pe_deploy_ops8_claude_code]
---

# Cert-with-scope-annotation ruling

## Decision

When a jurisdiction's pre-flight gate (OPS-8) declines a core rail (parcels, or zoning in a zoned jurisdiction), the certification still ISSUES, carrying a scope annotation rather than being withheld. The annotation is part of the cert artifact and names, per declined rail: (1) what happened — the rail and its named decline reason (e.g. `zoning: source unreachable, needs ecode360-scraper`); (2) what it takes to fix — the defect class the gap joins on the class-grouped backlog, so the fix route is explicit and a post-class-fix re-warm upgrades the cert in place. Operator framing ratified verbatim: the annotation is "a report on what happened and what it will take to fix it."

## Why

Run-what-passes already ruled that partial coverage is a successful onboarding; withholding the cert would contradict that by making a declined rail a de facto blocker again. The scope annotation keeps the cert honest (nobody reads a certified jurisdiction as fuller than it is — the declined scope is stamped on the artifact itself, same honesty doctrine as OPS-7 named absence) while letting the factory keep moving. The dual defect ledger already carries the same events; the annotation is the cert-side expression of the same truth.

## Consequences

- OPS-8's "UNRULED" open item is resolved; the doc's interim rule (no cert issues for a declined core rail) is retired.
- Cert artifacts gain a scope-annotation block; a cert with zero annotations is a full cert; annotations upgrade away via class-fix + re-warm, no re-certification ceremony.
- External or customer-facing coverage statements derived from certs must carry the annotation, never a bare headline (same rule as the public-vs-internal atom-count split).

## Reversal criteria

Reverse to cert-withheld if annotated certs are observed being consumed as full certs downstream (an operator, agent, or customer treats an annotated jurisdiction as fully covered because "it's certified") — that would prove the annotation fails as an honesty mechanism at the consumption point, and withholding becomes the safer default.
