# Append ENGINE_SPINE_BRIEFING + ENGINE_SPINE_HYDROLOGY to deploy-canary — cc-agent-C report

**Date:** 2026-06-11  
**Agent:** cc-agent-C  
**Repo:** legacy-design-tools  
**Branch:** `cortex/append-briefing-hydro-spine-flags`  
**PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/178  
**SHA:** `218e75bbf78ef54def2ca092ce36f64dabb27715`  
**Worktree:** `P:\legacy-design-tools`

---

## Problem

Briefing + hydrology on spine are live on prod (`cortex-api-00167-zac` @ 100%) via manual `gcloud run services update` with `ENGINE_SPINE_BRIEFING=1` and `ENGINE_SPINE_HYDROLOGY=1`. Only findings was baked into the deploy workflow (#174). The next `deploy-canary` would **replace** `--set-env-vars` and silently drop briefing + hydrology, reverting both to local engines.

---

## Exact diff

| File | Lines | What |
|------|-------|------|
| `.github/workflows/cloud-run-deploy.yml` | 174–179 | Comment: findings + briefing + hydrology live; topography (`ENGINE_SPINE_TOPOGRAPHY`) is the only remaining flip |
| `.github/workflows/cloud-run-deploy.yml` | 211 | `--set-env-vars` append: `ENGINE_SPINE_BRIEFING=1,ENGINE_SPINE_HYDROLOGY=1` after findings flags |

### Verbatim updated comment (174–179)

```yaml
        # ENGINE_SPINE_* flags: one engine at a time. Append each spine flag
        # to --set-env-vars below only AFTER that engine is verified green on
        # the canary. Findings + briefing + hydrology are live
        # (ENGINE_SPINE_FINDINGS, ENGINE_SPINE_FINDINGS_ORCHESTRATED,
        # ENGINE_SPINE_BRIEFING, ENGINE_SPINE_HYDROLOGY). Next: topography
        # (ENGINE_SPINE_TOPOGRAPHY) — do not batch with the above.
```

### Verbatim spine env tail (line 211)

```
...,ENGINE_SPINE_FINDINGS=1,ENGINE_SPINE_FINDINGS_ORCHESTRATED=1,ENGINE_SPINE_BRIEFING=1,ENGINE_SPINE_HYDROLOGY=1,MNML_RENDER_MODE=mock,...
```

**Scope confirmed:** `ENGINE_SPINE_TOPOGRAPHY` **absent** (topography flips after its own canary verify).

---

## Acceptance checklist

- [x] `--set-env-vars` carries `ENGINE_SPINE_FINDINGS=1`, `ENGINE_SPINE_FINDINGS_ORCHESTRATED=1`, `ENGINE_SPINE_BRIEFING=1`, `ENGINE_SPINE_HYDROLOGY=1`
- [x] `ENGINE_SPINE_TOPOGRAPHY` absent
- [x] Comment updated (findings + briefing + hydrology live; topography next)
- [ ] Post-merge durability proof (operator)

---

## Post-merge durability proof (operator — paste verbatim after one deploy-canary)

```bash
gcloud run revisions describe <new-revision> \
  --region=us-central1 \
  --format='value(spec.containers[0].env)'
```

Expected: all four spine flags present (`ENGINE_SPINE_FINDINGS`, `ENGINE_SPINE_FINDINGS_ORCHESTRATED`, `ENGINE_SPINE_BRIEFING`, `ENGINE_SPINE_HYDROLOGY`) plus `ENGINE_API_GATE_TOKEN` from secret — no manual `gcloud run services update` required.

**Not captured in this session** — placeholder for operator paste after merge + deploy-canary.

---

## Blockers

None for merge. Durability proof deferred to operator post-merge step.

---

## PR

https://github.com/empressaioemail-tech/legacy-design-tools/pull/178 — held for operator merge.
