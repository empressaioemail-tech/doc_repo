# Append ENGINE_SPINE_TOPOGRAPHY to deploy-canary — cc-agent-C report

**Date:** 2026-06-11  
**Agent:** cc-agent-C  
**Repo:** legacy-design-tools  
**Branch:** `cortex/append-briefing-hydro-spine-flags`  
**PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/178  
**SHA:** `ea9d2d8f1997911ed4f944cecf973b872488a393`  
**Worktree:** `P:\legacy-design-tools`

---

## Problem

Topography on spine is live on prod (`cortex-api-00169-jep` @ 100%) via manual `ENGINE_SPINE_TOPOGRAPHY=1`. Briefing + hydrology were also manual-only; PR #178 (still open) baked those two. Without topography in the workflow, the next `deploy-canary` would clobber the manual flag and revert topography to the local engine.

**Folded into PR #178** (briefing+hydro append was still open per dispatch).

---

## Exact diff

| File | Lines | What |
|------|-------|------|
| `.github/workflows/cloud-run-deploy.yml` | 174–178 | Comment: all four engines flipped + baked; C3 is next (not a flag) |
| `.github/workflows/cloud-run-deploy.yml` | 211 | `--set-env-vars` append: `ENGINE_SPINE_TOPOGRAPHY=1` (after briefing + hydrology from prior commit `218e75b`) |

### Verbatim updated comment (174–178)

```yaml
        # ENGINE_SPINE_* flags: all four reasoning engines are flipped on the
        # spine and baked below (findings, briefing, hydrology, topography).
        # ENGINE_SPINE_FINDINGS + ENGINE_SPINE_FINDINGS_ORCHESTRATED,
        # ENGINE_SPINE_BRIEFING, ENGINE_SPINE_HYDROLOGY, ENGINE_SPINE_TOPOGRAPHY.
        # The engine cut is complete; next engine work is C3 (not a flag).
```

### Verbatim spine env segment (line 211)

```
...,ENGINE_SPINE_FINDINGS=1,ENGINE_SPINE_FINDINGS_ORCHESTRATED=1,ENGINE_SPINE_BRIEFING=1,ENGINE_SPINE_HYDROLOGY=1,ENGINE_SPINE_TOPOGRAPHY=1,MNML_RENDER_MODE=mock,...
```

Plus existing `ENGINE_API_URL=...` and `--set-secrets=...,ENGINE_API_GATE_TOKEN=HAUSKA_ENGINE_API_KEY:latest`.

---

## Acceptance checklist

- [x] `--set-env-vars` carries all five spine entries + `ENGINE_API_URL`
- [x] `ENGINE_API_GATE_TOKEN` secret unchanged on line 212
- [x] Comment updated (engine cut complete; C3 next)
- [ ] Post-merge durability proof (operator)

---

## Post-merge durability proof (operator — paste verbatim after one deploy-canary)

```bash
gcloud run revisions describe <new-revision> \
  --region=us-central1 \
  --format='value(spec.containers[0].env)'
```

Expected: `ENGINE_SPINE_FINDINGS`, `ENGINE_SPINE_FINDINGS_ORCHESTRATED`, `ENGINE_SPINE_BRIEFING`, `ENGINE_SPINE_HYDROLOGY`, `ENGINE_SPINE_TOPOGRAPHY`, plus `ENGINE_API_GATE_TOKEN` from secret — no manual `gcloud run services update`.

**Not captured in this session** — placeholder for operator paste after merge + deploy-canary.

---

## Blockers

None for merge.

---

## PR

https://github.com/empressaioemail-tech/legacy-design-tools/pull/178 — held for operator merge (now completes full spine bake).
