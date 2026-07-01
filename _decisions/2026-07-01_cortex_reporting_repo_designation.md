---
id: 2026-07-01_cortex_reporting_repo_designation
title: cortex-reporting repo designation — legacy-design-tools is the reporting engine; AEC-cortex is the architect product
date: 2026-07-01
type: decision
adr: adr_023
related: [48_cortex_reporting_plan_review_spec, 2026-06-21_adr008_cortex_reframe_override]
---

# Decision: cortex-reporting repo designation

**What was decided:** `legacy-design-tools` is designated as the `cortex-reporting` repo in the architecture taxonomy. `AEC-cortex` is the architect product. These two repos are distinct. Product surfaces call cortex-reporting functions; they do not host them.

**Why:** The split was already underway. legacy-design-tools holds the plan review artifact (ReviewConsole, ComplianceEngine, FindingsLibrary, CodeLibrary, etc.), the api-server, and the Codex reviewer QA surface. AEC-cortex holds the architect product surfaces. The icc-demo scope explicitly calls for the plan-review function to be formalized as a durable reusable module. Designating legacy-design-tools as cortex-reporting formalizes what the code already reflects.

**How to apply:** Any new plan review function, reporting function, or code corpus query surface is built in legacy-design-tools (cortex-reporting). Product surfaces (SmartCity OS, AEC-cortex) consume via function calls, not local build. The cortex-reporting white-label plan review surface (`artifacts/plan-review`) is the proving ground. Bastrop Codex 1b build targets this artifact, not SmartCity OS directly.

**Reversal criteria:** If the plan review function proves too tightly coupled to the SmartCity OS data model to stand alone and decoupling costs exceed the build cost of a standalone module, reverse and mark ADR-023 superseded.

