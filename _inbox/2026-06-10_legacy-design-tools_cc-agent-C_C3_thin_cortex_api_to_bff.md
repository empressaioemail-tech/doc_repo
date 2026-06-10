---
id: 2026-06-10_legacy-design-tools_cc-agent-C_C3_thin_cortex_api_to_bff
title: C3 recon — thin cortex-api to BFF (BLOCKED)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: inbox-report
status: BLOCKED — prerequisites not met; no code removed
related: [_dispatches/2026-06-10_cc-agent-C_C3_thin_cortex_api_to_bff, _dispatches/2026-06-10_cc-agent-C_C1_cortex_cut_to_gate, _dispatches/2026-06-10_cc-agent-C_C2_extension_cut_and_unified_signin, 56_engine_extraction_sprint, 80_adrs/adr_008_engine_factor_out]
---

# C3 — thin cortex-api to product BFF

**Verdict: BLOCKED.** C3 dispatch requires C1 + C2 cuts verified in final topology before any engine code removal. Recon shows neither cut has landed; all consumers still reach local engine packages. Agent refused alien HEAD per dispatch rules; no branch created, no commits, no PR.

---

## 1. Workspace / HEAD (HR-11 refuse alien HEAD)

**Clone:** `P:\legacy-design-tools`

### Verbatim `git status`

```
On branch codewarm/austin-2024-uplift-rewarm
Your branch is based on 'origin/codewarm/austin-2024-uplift-rewarm', but the upstream is gone.
  (use "git branch --unset-upstream" to fixup)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
  (commit or discard the untracked or modified content in submodules)
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

no changes added to commit (use "git add" and/or "git commit -a")
```

### Verbatim `git log -3`

```
294c5d2 fix(cortex): artifact UX — auto-nav, letter document view, export PDF
2b6b41d Merge pull request #164 from empressaioemail-tech/codewarm/austin-2024-uplift-rewarm
5b8df55 feat(codes): Austin 2024 driver slugs + IECC RE/CE chapter paths
```

**Refusal:** HEAD is `codewarm/austin-2024-uplift-rewarm`, not a `cortex/` branch. Dispatch requires `cortex/` prefix. Local HEAD (`294c5d2`) is **behind** `origin/main` (`b1575ef`).

### Verbatim `git log --oneline origin/main` (HR-1)

```
b1575ef Merge pull request #167 from empressaioemail-tech/cortex/per-user-auth
bf90e85 Merge pull request #166 from empressaioemail-tech/cortex/artifact-ux
045c790 fix(test): type asUser helper with supertest Test
0b73b89 test(api-server): use x-requestor for ownership isolation suite
16c857a fix(test): pin NODE_ENV=test and seed ownership on route fixtures
c838d05 fix(api-server): align ownership checks with legacy test sessions
d91b3b9 test(db): expect Task #29 ownership tables in schema integration list
cec1b48 fix(test): stub artifact-nav store fields in engagement/chat mocks
4399b92 chore(db): refresh schema fixture for migration 0038 ownership tables
294c5d2 fix(cortex): artifact UX — auto-nav, letter document view, export PDF
a89f5a5 Merge pull request #165 from empressaioemail-tech/cortex/intake-chat-wedge-fixes
2b6b41d Merge pull request #164 from empressaioemail-tech/codewarm/austin-2024-uplift-rewarm
74b74e1 fix(cortex): unblock pre-Revit chat intake — multi-attach + vision read
5b8df55 feat(codes): Austin 2024 driver slugs + IECC RE/CE chapter paths
e97549c Task #29: cortex per-user auth, ownership isolation, and shared identity.
```

### C1/C2 branch state

| Branch | SHA | vs `origin/main` |
|---|---|---|
| `cortex/cut-to-gate` (C1 placeholder) | `b1575ef` | **Identical** — zero unique commits |
| `cortex/c2-extension-cut-and-signin` (C2 placeholder) | `b1575ef` | **Identical** — zero unique commits |

### C1/C2 inbox reports

| Expected report | Present? |
|---|---|
| `2026-06-10_legacy-design-tools_cc-agent-C_C1_cortex_cut_to_gate.md` | **NO** |
| `2026-06-10_legacy-design-tools_cc-agent-C_C2_extension_cut_and_unified_signin.md` | **NO** |

---

## 2. Recon — all consumers spine-served?

**Answer: NO.** Every engine consumer in cortex-api (`artifacts/api-server`) still calls local workspace packages. No spine `engine-api` client, no per-engine feature flags, no gate-proxied `/v1/*` routing found anywhere in the repo.

### Per-engine / per-consumer matrix

| Consumer surface | Engine / capability | Current call path | Spine-served? | Per-engine flag? |
|---|---|---|---|---|
| Cortex plan review — brief | Briefing | `parcelBriefings.ts` → `generateBriefing()` from `@workspace/briefing-engine` | **NO** | **NO** |
| Cortex plan review — findings | Finding | `findings.ts` → `generateFindings()` from `@workspace/finding-engine` | **NO** | **NO** |
| Cortex plan review — decomposition | Plan-set decomposition | `planSetClassification.ts` from `@workspace/finding-engine` | **NO** | **NO** |
| Cortex plan review — precedence | Precedence reconciliation | `lib/finding-engine/src/precedence/*` (local package) | **NO** | **NO** |
| Cortex site context | Adapters (federal/state/national/local) | `generateLayers.ts` → `runAdapters()` from `@workspace/adapters`; `brokerageSiteContext.ts` direct adapter imports | **NO** | **NO** |
| Cortex hydrology / topography | Site drainage + topo workers | `siteDrainageIngest.ts`, `siteTopographyIngest.ts` (local api-server lib, pysheds path) | **NO** | **NO** |
| Extension — property brief | Briefing + adapters | `brokerageBrief.ts` → `brokerageBriefLlm.ts` (`@workspace/briefing-engine`); `brokerageSiteContext.ts` (`@workspace/adapters`) | **NO** | **NO** |
| Extension — place hydrology/topo | Site drainage + topo | `brokeragePlaceHydrology.ts` → local ingest libs | **NO** | **NO** |
| Extension — unified sign-in (C2) | Session Bearer on brokerage | Task #29 cortex-api side merged (#167); extension client sign-in **not verified** (C2 not executed) | N/A | N/A |

### Evidence — no spine client exists

```
$ rg -l "engineApi|engine-api|ENGINE_VIA|spineEngine|consumeSpine|HAUSKA_ENGINE" legacy-design-tools/
(no matches)
```

Gate-front seam (`gateFrontSeam.ts`, `gateEngineServiceAuth.ts`) is present — it authenticates callers **into cortex-api's local engine routes**, not out to spine `engine-api`.

### Local engine packages still on `origin/main` (HR-1 `git ls-tree`)

```
lib/adapters
lib/briefing-engine
lib/finding-engine
lib/engine-core   ← calibration overlay only; not a spine proxy
```

`lib/engine-core` holds calibration/attribution helpers (Topology A overlay I/O). It is **not** a gate seam client to spine reasoning.

---

## 3. Code removal (C3 scope item 2)

**Not executed.** Prerequisite recon failed — removing `lib/adapters`, `lib/briefing-engine`, `lib/finding-engine`, hydrology/topography ingest, and dead feature-flag branches would break every consumer listed above.

### Planned removal inventory (for when C3 unblocks)

| Path | Status on main | Safe to remove after C1? |
|---|---|---|
| `lib/adapters/` | Present, actively imported | Only after adapters cut |
| `lib/briefing-engine/` | Present, actively imported | Only after brief cut |
| `lib/finding-engine/` (incl. decomposition + precedence) | Present, actively imported | Only after findings + S1 cut |
| `artifacts/api-server/src/lib/siteTopographyIngest.ts` + materializer | Present | Only after topo cut |
| `artifacts/api-server/src/lib/siteDrainageIngest.ts` + materializer | Present | Only after hydrology cut |
| Per-engine feature-flag branches | **Do not exist yet** | N/A |

### Keep (BFF scope)

- `gateFrontSeam.ts` + seam client (to be added in C1)
- Session/auth (#29 per-user identity — merged #167)
- Snapshot/sheet/IFC ingest, wedge chat (#165), deliverable letters, artifact UX
- `lib/engine-core` calibration port binding (Topology A) until spine owns overlay I/O end-to-end

---

## 4. No-ungated-path audit

**Current state: multiple ungated (local) engine paths remain.** Gate auth middleware (`requireGateEngineServiceAuth`) guards *ingress* to cortex-api routes but does **not** route reasoning through the gate to spine `engine-api`. Browser session path bypasses gate entirely and hits local engines directly — permitted during C1 transition, forbidden after C3.

### Direct local-engine routes (ungated to spine)

| Route module | HTTP prefix | Local engine reached |
|---|---|---|
| `parcelBriefings.ts` | `/api/engagements/:id/parcel-briefings/*` | `@workspace/briefing-engine` |
| `findings.ts` | `/api/engagements/:id/findings/*` | `@workspace/finding-engine` |
| `generateLayers.ts` | `/api/engagements/:id/generate-layers` | `@workspace/adapters` (`runAdapters`) |
| `siteTopography.ts` | `/api/engagements/:id/site-topography/*` | Local topo ingest worker |
| `siteDrainage.ts` | `/api/engagements/:id/site-drainage/*` | Local drainage ingest worker |
| `brokerageBrief.ts` | `/api/brokerage/v1/brief/*` | `@workspace/briefing-engine` + `@workspace/adapters` |
| `brokeragePlaceHydrology.ts` | `/api/brokerage/v1/place/*-topography|drainage/*` | Local ingest workers |
| `localSetbacks.ts` | `/api/local-setbacks/*` | `@workspace/adapters` |
| `planSetClassification.ts` (lib, called from findings pipeline) | internal | `@workspace/finding-engine` |

### Post-C3 requirement (ADR-008)

After C3: **zero** routes may invoke local reasoning. All must go cortex-api BFF → gate-front seam → spine `engine-api`. A route audit test or explicit deny-list should be added during C3 execution.

---

## 5. Full-product regression (BFF topology)

**Not run.** No BFF topology exists yet — cortex-api is still a full engine host. Regression against the target topology is deferred until C1 + C2 land and C3 thins the BFF.

### Surfaces to verify when C3 unblocks

- [ ] Plan review + brief + findings (Cortex web)
- [ ] Pre-Revit chat wedge + image vision (#165)
- [ ] Deliverable letter flow + artifact UX (#166)
- [ ] Extension anonymous tier (public key + install id)
- [ ] Extension authenticated tier (unified sign-in, C2)
- [ ] Revit / IFC / sheet ingress
- [ ] Lineage + provenance envelope end-to-end
- [ ] Calibration deposit/read (arrow-two, Topology A)

---

## 6. CI / PRs

| Item | Value |
|---|---|
| Branch created | **None** (blocked) |
| Commits | **None** |
| PR URL | **None** |
| CI run | **Not triggered** |

---

## 7. Blockers (verbatim)

1. **Alien HEAD:** workspace on `codewarm/austin-2024-uplift-rewarm` @ `294c5d2`, not `cortex/*`; behind `origin/main` @ `b1575ef`.
2. **C1 not executed:** `cortex/cut-to-gate` branch exists but has zero commits beyond main; no C1 inbox report; no per-engine spine cut or feature flags.
3. **C2 not executed:** `cortex/c2-extension-cut-and-signin` branch exists but has zero commits beyond main; no C2 inbox report; extension brokerage still on local engines; extension client unified sign-in not verified.
4. **All consumers still local:** every engine in the matrix above reaches `@workspace/briefing-engine`, `@workspace/finding-engine`, `@workspace/adapters`, or local hydrology/topo workers — none through spine `engine-api`.
5. **No spine client code:** repo contains no `engine-api` HTTP client, no `ENGINE_VIA_*` flags, no gate-proxied reasoning calls.
6. **C3 dispatch gate:** status QUEUED — "fire after C1 + C2 cuts are verified in their final topology (every consumer served from the spine)."

---

## 8. Recommended unblock sequence

1. **Operator:** check out `origin/main` on a fresh `cortex/cut-to-gate` worktree (or rebase existing placeholder branch).
2. **Execute C1** per `_dispatches/2026-06-10_cc-agent-C_C1_cortex_cut_to_gate.md`; file inbox report with per-engine flag state + lineage proof.
3. **Execute C2** per `_dispatches/2026-06-10_cc-agent-C_C2_extension_cut_and_unified_signin.md`; verify extension client sign-in in `hauska-brief-extension` repo.
4. **Re-fire C3** once both inbox reports confirm all consumers spine-served with flags stable.
5. **C3 agent** then: remove local engine packages, lock routes, add ungated-path audit test, run full-product regression, open PR on `cortex/thin-bff` (or similar).

---

## Model

Grok Build 0.1 — no escalation required (blocked at recon; no retry target).
