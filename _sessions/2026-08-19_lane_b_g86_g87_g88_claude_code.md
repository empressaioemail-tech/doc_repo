---
id: 2026-08-19_lane_b_g86_g87_g88
title: Session — Lane B, the upload leg lands and the design premises get measured
status: active
last_updated: 2026-08-19
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-18_b86u_close,
    _inbox/2026-08-18_g87_close,
    _inbox/2026-08-18_g88_design_into_apps_WDLL,
  ]
---

# Session 2026-08-19: Lane B, three legs

Operator dispatched three legs in order: close G-86, build G-87, then design into the apps. All three moved. Four PRs merged, one deploy verified live, five plan rows added.

## What shipped

**G-86 CLOSED FULL.** The upload leg that had been mis-issued twice for want of a tool finally ran. Kit PR #5 merged squash `d4f7b61`. All 417 files reached Claude Design project `f5e5465e-943f-4f68-b52f-608925bc07b0` and reconciled by prefix against the remote: components 292, `_preview` 73, fonts 44, `_vendor` 2, six root files. Sentinel first, nine content chunks, no deletes, sentinel re-armed, `_ds_sync.json` last and alone. Zero write failures. The one deviation from the runbook was deliberate and is the part worth keeping: the remote was listed and reconciled at 416 BEFORE the anchor was armed, because an anchor vouches for everything beneath it and verifying after arming it is verifying too late.

Acceptance item 5 re-graded dropped to met, with one half of its named check recorded as unrun rather than absorbed: nobody has looked at the picker. The sentinel is still armed, so the app has not rebuilt its card index. That walk is owed by the operator.

**G-87 CLOSED.** Kit PR #6 merged squash `93f2e6b`. `walk()` skipped `ds-bundle`, `.ds-sync` and `.design-sync` by directory NAME at the root. The skip was correct at kit PR #2 and went stale at G-85 when authored source moved into `.design-sync`. It is now by PATH and names the generated paths inside that directory instead, so 76 authored files enter the scans that could not see them, including `conventions.md`, which ships verbatim inside the uploaded README and which had carried a real vendor-brand violation past a green CI.

Two harness gaps were found on the way, and either alone would have made the row unprovable. `prove-gates.mjs` never copied `.design-sync` into its scratch, so a violation planted there could not have fired for want of the file. And the scratch is a plain tmpdir, so the new gitignore-based guard would have reported UNRUN and passed. Both fixed. 27 of 27 injected violations caught and named, up from 24, plus one legitimate-payload control that must stay green.

Counter-verified rather than trusted: reverting the fix on a backup sent both new cases SILENT and the harness to exit 1 at 23 of 26. Watching a case fire on the fixed tree proves the detector works now; it does not prove the fix caused it.

**G-88 items 2, 3 and 8 shipped and deployed.** Dashboards PRs #20, #22 and #21 merged; canary revision `00018-kiw` deployed, smoked at 0% traffic, then shifted to 100% and confirmed as the serving revision.

Item 2 ported four CSS families from 30b's own style block: `cite`, `mx*`, `atomchip`, and `finding`/`basisline`/`meter`. 34 rules live on the deployed surface. Item 3 hardened the product's class gate. Item 8 gave all six static assets `cache-control: no-cache` plus a content-hash ETag, measured live at 154,604 bytes cold and 0 bytes on a returning navigation.

## What was measured and found false

Three of four investigations contradicted a premise the work was scoped on. That is the finding of this session, more than any of the merges.

**The React-to-static translation is not lossless.** A kit composition emits zero `id`, zero `hidden` branches and zero `data-*` hooks, while the product carries 94 ids and `app.js` makes 33 `getElementById` calls against them. `test/_markup.mjs` normalises away exactly `id`, `hidden` and every non-class attribute before comparing, so nineteen green parity tests were silent about the gap by construction. Same shape as the G-86 `cardMode` blind spot: the instrument does not look at the thing that broke. WDLL item 7 exists because of this and has no existing instrument behind it.

**The shell.css staleness premise was false.** Measured with a real Chrome on a persistent profile across three scenarios including a full browser restart and an in-session deploy: the returning browser fetched fresh CSS every time. With no `Last-Modified` there is no basis for heuristic freshness, so Chrome revalidates, and with no validator that degrades to a full GET. The defect was inverted from the one recorded at A-061. Item 8 was re-sequenced non-blocking on that measurement, and the operator accepted the re-ordering.

**One PR per surface is logical, not physical.** All fifteen surfaces share one `index.html` and one unpartitioned `shell.css`.

The good surprise ran the other way: the CSS for all four families already existed, fully written and token-only, inside 30b's own style block, needing zero new tokens. That is what made item 2 a Dashboards PR rather than a product-line ruling across three byte-locked repos.

## Rulings taken to the operator

Three, because each changed what an executor would build. The 12px type floor HOLDS, so 30b's sub-12px declarations are raised. 30b governs the CSS and 30c governs atomchip markup, resolving five undeclared divergences. A fourth family ships, because a matrix and a citation compose into a finding row and shipping the parts without the whole leaves the design agent to invent the assembly.

A fourth ruling followed mid-flight: the executor found that scope contained six sub-12px declarations rather than three, and that one of them is the single exception 30b explicitly grants, the evidence chip label at 10px. The product's type gate had hardcoded the floor as absolute and justified it in its own error string with "the evidence chip, which does not exist in this product" — a sentence the same PR falsified. Operator granted the carve-out, scoped to exactly two selectors, with 13 of 13 injected violations proving it did not widen and a liveness arm that fails if the stylesheet stops exercising it.

## What my own work got wrong

Recorded because the pattern matters more than the instances.

The probe I wrote into the approved WDLL as "the leg that can fail" could not catch a constant ETag. Leg 3 sends a stale tag, and a constant tag differs from a stale tag, so it returns 200 and passes. The executor proved this by injection rather than arguing it. The check that discriminates is distinct validators per asset, verified live as six distinct ETags.

My item-2 verification grep was `font-size:`, and both sub-12px declarations use `font:` shorthand, so the grep would never have seen either. The executor substituted a positive enumeration.

My item-3 dispatch told the executor to derive its scan list purely from `sendFile` call sites while separately naming `shell-homes.mjs`, which is not a `sendFile` call site. Those two instructions were never jointly satisfiable.

And I told the operator I would proceed to leg 2, then ended the turn without starting it.

## The defect the operator found

Every deep link into the dashboards product paints Overview before switching to the requested lens, because `index.html` hardcodes `class="lens on"` on Overview and `app.js` loads as a deferred module. On a not-built lens this reads as a populated screen collapsing into an empty one. Established as pre-existing rather than asserted: `index.html` and `app.js` are byte-identical across the deploy, and revision `00017-vx4` was tagged `pre` at 0% traffic so the operator could reproduce it on the pre-deploy build. Scoped as G-89.

## Tooling findings

`scripts/dispatch.mjs` requires a row id followed by an add-verb. A-070 declared G-88 as `SCOPED`, which the row scan rejects. A-067 declares G-87 the same way and would have failed identically had G-87 been dispatched rather than planner-executed.

The canon gate and the dispatch-template gate both key on dispatch SHAPE rather than on whether an agent writes anything, and fired on one of four near-identical read-only prompts. Adding the sanctioned `CANON_OVERRIDE` made a brief dispatch-shaped and tripped the second gate the siblings never hit.

`infra.md` in `smartcity-dashboards` records the serving revision as `00001-92j`. It is now `00018-kiw`, so that line has been stale for eighteen revisions.

## Open

G-88 items 4, 5, 6, 7, 9, 10. G-89 unstarted. The Design picker walk is owed by the operator. `.prov.stale` missing from a shipped load-bearing component, so a stale source renders identical to a current one. A second weaker copy of the class rule at `src/city-identity.test.mjs:184` with the identical comment hole. `roster-lens` shipped and defined nowhere. The forbidden-string gate does not scan CSS, on a card that adds CSS.
