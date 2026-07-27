---
id: 2026-07-27_QA4_overpass_honest_fallback
title: QA4 dispatch — osm-overpass dead: honest fallback + no silent road loss
date: 2026-07-27
status: GO
owner: nick
planner: qa
repo: hauska-engine
related: [2026-07-27_bastrop_qa_defect_register, 2026-07-27_COMPLETE_BASTROP_hardening_audit]
---

# QA4 — osm-overpass dead: honest fallback, no silent road loss

**GO 2026-07-27.** Worktree: `P:\hauska-engine-worktrees\qa4-overpass` / branch `qa/overpass-honest-fallback`. Builder does not self-grade MET.

You are a build agent. The live health board (`/health/spine/run`) shows `osm-overpass` DEAD, alert=true (HTTP 504). Bastrop roads still serve today because county-roadway (11,351) + streets-surveyed-2016 (1,307) cover it. The RISK: a county with NO county-roadway layer that relies on overpass would SILENTLY lose roads when overpass 504s — the exact silent-zero-no-alert signature this program keeps catching. Fix it right (operator: "even though it's backend, it's important").

## M0 warm-start
- Repo: hauska-engine. Work off origin/main. Branch `qa/overpass-honest-fallback`.
- Road intake: `packages/engine-core/src/road-intake/` (fetch = overpass-bbox + streets-surveyed-2016 + bastrop-county-roadway → classify → emit road nodes).
- Health probe: the B1 spine health runner (probe id `osm-overpass`); the board is served at retrieval `/health/spine/run`. Coordinate with B1 (health monitors are hardening-owned) — this fix makes the DEGRADED state HONEST, it does not remove the probe.

## What "fix it right" means here
1. FALLBACK ORDER + HONESTY: when overpass 504s/times out, road intake must fall back to county-roadway / surveyed-2016 for counties that have them, and for counties that DON'T, it must emit an HONEST DEGRADED state ("roads unavailable this run: overpass down, no county roadway source") — NEVER silently produce zero roads as if the county has none. A county with genuinely no road source and a county with a transient overpass outage must be DISTINGUISHABLE in the output.
2. PROBE SEMANTICS: `osm-overpass` DEAD should be `alert=true` ONLY when it actually degrades coverage (no working fallback for the affected bbox). If county-roadway is firing and covers the county, overpass-down is a DEGRADED-but-covered state, not a red alarm — surface it as "overpass down, fallback active" rather than a bare DEAD/alert that reads as an outage when roads are fine. Do not fake green: if overpass is the ONLY source for some county, DEAD must alert.
3. RETRY/BACKOFF: overpass 504 is often transient (the scratch notes county single-query 504s; city bbox ~6s works). Add a bounded retry/backoff on the overpass fetch before declaring it down, and prefer the city-scope query over the county single-query that 504s (see road-intake LESSON: default scope=city ~4893 ways ~6s; county-tiled 3x3 when needed).

Keep it honest and mechanical: the goal is that a silent zero-roads outcome is IMPOSSIBLE — either roads from a working source, or an explicit degraded state naming the gap.

## Verify (you do NOT grade MET)
1. `pnpm -C packages/engine-core build` + vitest clean.
2. Promote a mechanical test: mock overpass 504 + a county WITH county-roadway → roads still emitted (fallback), probe = degraded-covered not red-alert; mock overpass 504 + a county with NO road source → HONEST degraded output (not silent zero) + probe alert=true. Red on pre-fix code.
3. Deploy engine-api / retrieval preview or canary as appropriate; re-run `/health/spine/run` and paste the `osm-overpass` probe row showing the honest semantics.
4. Report: branch, PR, SHA, build/test, live probe JSON. Planner verifies the live probe + the fallback behavior before MET. You do not claim MET.

Coordinate with the hardening/B1 owner since the health probe is theirs; do not collide on the probe runner file — extend it, and flag to the planner if the change needs a B1-owned file.
Deploys are agent-owned; fix a failed deploy yourself.
