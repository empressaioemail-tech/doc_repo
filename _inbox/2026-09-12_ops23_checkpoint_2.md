# OPS-23 checkpoint 2 — end of wave 2

## Snapshot

- doc_repo HEAD (this worktree): `3070515a` (fast-forwarded from `a90adbb5` at session start)
- origin/main of every repo touched this wave (post-merge):
  - hauska-map: `78ad8a51f36cb363de9c6e6f0f65b1386696a1cb` is NOT hauska-map's — correction: hauska-map `153e7beceb3237de9255c526098f37672c96dbf3` (P-152's PR #390, last merge) and `4350ab957a5b2a64faba5b39b32575ac4c2a8668` (P-172's PR #391)
  - legacy-design-tools: `78ad8a51f36cb363de9c6e6f0f65b1386696a1cb` (P-172's PR #664, cortex-api service source) and `08de93dcbf915df1c0780e6007c7529d2b75fbb4` (P-169's PR #665)
  - hauska-engine: `fcd77075bb9a82c9d59ec595cb2b91b73877745e` (P-158's PR #421) and `99f9146fa5fc0b172cd77a122487b8dddc2502e4` (P-169's PR #423)
  - hauska-factory: `7a94ae5035f7a8996d85c55ac8b328de3aca7cc6` (P-157's PR #140)
  - hauska-atom-contract: unchanged this wave (P-167 held; see below)

## Lane board (`node scripts/ops23-lane-status.mjs`, pasted verbatim — run at wave start; re-run before trusting after this checkpoint)

Run at session start (2026-09-12T14:31:37Z), before any wave-2 work landed. Not re-run at close time; the per-row closes below are the authoritative post-work state, each independently verified by this planner against live GitHub/GCP/DB state, not against a re-read working tree (per AGENT_CONTRACT: "do not read a working tree to verify a deploy").

## Probe output (final combined run, pasted verbatim, run id in the artifact)

Command: `node scripts/surface-probe.mjs --rows P-152,P-157,P-158,P-167,P-169,P-171,P-172 --observations <combined observations, assembled by this planner from each lane's independently-verified data> --allow-unmeasured`

```
SURFACE PROBE  2026-09-12T16:26:33.142Z  doc_repo 3070515a  source live  PE https://smartsite.cloud  observations sha256 6d00d1180d45

PREDICATES
  FAIL       P-152 48021:34049  panel 25/5/25/15 (readPath record); MCP 30/10/30/20 OBSERVED -- DISAGREE (pre-existing F3, assigned to P-154, not a regression)
  FAIL       P-152 48021:33223  panel 20/5/20/- (readPath record); MCP absent OBSERVED -- DISAGREE (same F3 class)
  PASS       P-152 48453:367134  panel 25/5/10/15 == MCP 25/5/10/15
  PASS       P-152 48453:113408  panel and MCP both absent
  PASS       P-152 48453:474034  panel and MCP both absent
  FAIL       P-157 48453:113408  structuralFact absent; livingAreaSqft null; yearBuilt null (blocked: parser gap, see close)
  FAIL       P-157 48453:474034  structuralFact absent; livingAreaSqft null; yearBuilt null (same blocker)
  FAIL       P-158 48021:34049  buildingFootprintFact absent (phase 3 writer run not yet executed, blocked on this wave's scope)
  FAIL       P-158 48453:113408  buildingFootprintFact absent (same)
  UNMEASURED P-167 (all 5 parcels)  not started this wave -- P-153 DRAW has not merged in hauska-map or legacy-design-tools
  PASS       P-169 48453:113408  jobs listed 2 (ldt-cad-ingest, hauska-engine-atoms-writer); staging run records 2; laptop apply refused yes
  PASS       P-171 48021:34049  outcome b; record _inbox/2026-09-12_p171-provenance_close.json#breakGlassRowDraft
  PASS       P-172 48453:113408  bare hits 48453:113408; city-qualified hits 48453:113408; Find box resolves: yes; resolved via: situs

  PASS 6  FAIL 6  UNMEASURED 5
```

artifact: `_inbox/2026-09-12_162633_surface_probe.json`

## Rulings taken since the last checkpoint

None new. This wave applied the operator's 2026-09-12 rulings already on file (A-132 and the five decision records under `_decisions/2026-09-12_*.md`) to seven rows; no new standing ruling was made by this planner.

## Planner claims a lane or the probe contradicted (section 10 shape)

| # | Date | Claim | Who caught it | Shape |
|---|---|---|---|---|
| 1 | 2026-09-12 | This planner's first live-probe verification of P-157's parser-format claim (grepping `gs://.../p157/IMP_DET.TXT` for "MAIN AREA") returned "0" and was treated as a real result. | This planner, on a second pass | Vacuous check: the object didn't exist at that path (`gsutil cat` errored), `2>&1` piped the error text into `grep -c`, which correctly found zero matches of "MAIN AREA" in an error message. Re-verified properly by downloading and unzipping the real archive; the underlying finding (0 "MAIN AREA", ~438k/177k/8k "1st/2nd/3rd Floor") held up genuinely on the second, real check. |
| 2 | 2026-09-12 | P-169 lane's first close said `status: "closed"` while both PRs were still open and one had a failing CI check-run. | This planner, adversarial checkpoint review | Seam: infrastructure existing vs. code merged/reviewed. The lane corrected it fully on request (see P-169 close `contradicted`). |
| 3 | 2026-09-12 | P-171 lane's first close cited a "greenlit remediation task" quote from `_inbox/2026-09-06_integration_building-footprint_ctx-gap_resolved.md`, which does not contain it (and says the opposite for its own scope). | This planner, adversarial checkpoint review | Misattributed citation between two same-night sibling documents; corrected to a two-tier honest confidence statement (see P-171 close `correctionLog`). |
| 4 | 2026-09-12 | Two lanes (P-169, P-172) each ended a turn assuming an automatic wake-on-completion notification for a background build/CI run, which does not exist for spawned sub-agents. | This planner | Both resumed with explicit bounded-polling instructions; recommend this caution be added to the standard dispatch boilerplate for any lane likely to kick off a long-running background command. |
| 5 | 2026-09-12 | Wave-1's checkpoint and this wave's own dispatch both said "exactly 36 factory-* jobs" in `hauska-prod-497015`/`us-east4`; P-169's own precise recount found 37. | P-169 lane, self-caught | Stale instrument count repeated across two checkpoints without independent recount; corrected in P-169's close. |

## Next three concrete actions

1. **P-167**: re-check `gh pr list --repo empressaioemail-tech/hauska-map --search p153 --state merged` and the same for legacy-design-tools before cutting the three held consumer worktrees; still unmerged as of this checkpoint (2026-09-12T16:30Z).
2. **P-157**: overseer decision needed on `lib/cad-ingest/src/pacs/parser.ts`'s `readImprovementRollups()` (`typeDesc.startsWith("MAIN AREA")`) — shared code also used by Bastrop/Caldwell, name a fix owner (naming `_inbox/2026-09-12_p157-structural_close.json`).
3. **P-158**: phase 3 (the writer/reconcile run against the corrected county_fips) is blocked on P-169's job existing (now true) plus a county_fips-assignment fix in the unmerged loader branch `feat/p2-4-tx-building-footprint-staging` (naming `_inbox/2026-09-12_p158-footprint_close.json` leave_behind).
