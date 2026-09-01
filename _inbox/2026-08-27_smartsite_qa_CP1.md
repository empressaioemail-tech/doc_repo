---
id: 2026-08-27_smartsite_qa_CP1
title: CP1 — Smart Site QA program design / pre-build
status: filed
last_updated: 2026-08-27
---

# CP1 adversarial checkpoint

Program: Smart Site inbound QA + offer remediation. WDLL `_inbox/2026-08-27_smartsite_qa_program_WDLL.md`. Canvas `smartsite-design-system-gap.canvas.tsx`.

## What we are about to build

Ten waves on hauska-map PE, print/PDF islands, and checkout copy. Wave 0 chrome restore is serial. After merge, Find, share-land, X-ray P0, and offer-panel can fan on separate worktrees.

## Attacks on the plan

1. **Scope is too wide for one QA hold.** Mechanism: operator will wait weeks while Find and checkout sit behind chrome. Rejected alternative: ship Wave 0 and invite a mid-program QA. Rejected because the operator said do not QA until the in-wave set is addressed. Mitigation: fan after W0; do not serialize the whole program.

2. **X-ray P0 may live in MCP/engine, not PE.** Mechanism: PE only streams bytes from `refresh_parcel_dossier_export`. A PE-only refuse still lets MCP emit a hollow PDF. Mitigation: P0 agent must read the write path (MCP tool + engine assembler) and fail closed at the first generator, plus an in-app error. If that repo is property-seat owned and dirty, stop and request rather than write into their checkout.

3. **W7 vs register will tempt a silent SKU delete.** Mechanism: removing Feasibility/Comparison/Brief from the panel looks like P4 compliance and kills live verbs. Mitigation: agent flags extras; Records stays a P-85 verb; Brief stays chrome; Comparison stays the compare tool. No new templates.

4. **W9 primitives during W0 restyles the wrong rail again.** Mechanism: a Dock primitive built against the #234 left-stack will cement the conflation. Mitigation: W9 waits until W0 is live-graded.

5. **Second-mechanism check on 1308 Pecan.** Observed miss could be suggest ranking (Guadalupe first) or a missing Bastrop situs row. Agent must distinguish those before rewriting geocode.

## Fan rules for this program

Subagents do not spawn. Subagents do not commit. One worktree per live wave under `P:/tmp/hauska-map-qa-*`. Never `P:/hauska-map`, never `P:/seat-worktrees/property/hauska-map`. Deploy is `property-explorer` from repo root after `.vercel/project.json` is read. `NODE_OPTIONS=--use-system-ca` on this machine.

## Leave-behind if we stop after W0

Find still wrong. Share still lands wrong. Hollow X-ray still ships. Hoffman ungraded.
