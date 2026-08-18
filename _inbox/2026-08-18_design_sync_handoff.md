---
id: 2026-08-18_design_sync_handoff
title: Handoff — design sync of the SmartCity kit, 70 previews remaining
status: active
last_updated: 2026-08-18
applies_to: smartcity
owner: nick
related:
  [
    _decisions/2026-08-18_smartcity_kit_component_package,
    _decisions/2026-08-18_template_city_becomes_fixture_city,
    _inbox/2026-08-18_g76_g79_fixture_city_and_type,
    30b_smartcity_design_system,
    30c_smartcity_platform_ia,
    90_operations/OPS-17_govtech_stack_plan_of_record,
  ]
---

Filed: 2026-08-18
From: Claude Code (P:\doc_repo strategic session)
To: The next Claude Code session, acting as planner on OPS-17 Lane B
Re: Finish the design sync of `@empressaio/smartcity-kit` — 70 preview cards, fan out the subagents, upload, then the operator QA-walks the demo city

# 1. Conversation summary

The session ran three waves of work on the SmartCity product line and ended mid-way through the first design sync. Wave one closed the demo-city shell (G-76 type conformance, G-77 fixture city, plus G-78 and G-79 fixing two production divergences that a fully green test suite could not see). Wave two closed two carried-forward defects (G-80 chrome follows the pack, G-81 `[hidden]` works product-wide). Wave three built the prerequisite for design sync and started the sync itself: G-82 wrapped the kit as 73 typed React components, G-83 fixed the stylesheet closure, G-84 shipped the two typefaces, and G-85 committed the sync inputs.

The frame throughout: a design agent given the customer's real components builds on-brand screens that map onto shippable code, and a design agent given nothing invents its own parts. Everything in wave three exists to make that first case true. The sequencing mattered more than expected. Wrapping the kit before the type pass would have frozen fourteen sub-12px violations into every design the agent ever builds, and syncing before the fixture city would have shipped preview cards of empty states, because this system generates its visual hierarchy from unresolved records and has none when a city is empty.

The sync itself is working end to end and is not finished. The converter produces a clean bundle of 73 components, three are authored and graded, and 70 still need preview cards. Nothing has uploaded yet.

# 2. Decisions reached

1. **The kit ships as a typed React wrapper, amending 30b section 4.** Owner: Nick. Design sync converts a compiled component library and cannot consume a CSS class vocabulary, and the alternative was hand-drawing seven undrawn 30c surfaces and re-deriving the class vocabulary each time. A wrapper that renders `class="panel"` and owns no styling cannot fork the system. Reverse if the package acquires styling of its own, if a product repo imports components instead of copying the CSS, or if design sync turns out not to consume it. Record: `_decisions/2026-08-18_smartcity_kit_component_package.md`.

2. **`template-city` becomes a fixture city; `empty-city` keeps the honest-empty demonstration.** Owner: Nick. 30b law 3 generates hierarchy from exceptions, so a city with zero records switches the design's whole tension mechanism off and cannot be evaluated or reviewed. Fixtures generate from adapter output contracts rather than any city's rows, which is what makes the later real-city swap leave the surfaces unchanged. Reverse if a fixture is ever read as a real city's record outside the building, or if the generator starts seeding from live rows. Record: `_decisions/2026-08-18_template_city_becomes_fixture_city.md`.

3. **Repo licensing is held, not issued.** Owner: Nick. An executor drafted a proprietary LICENSE naming Legacy Group ATX LLC, an entity it inferred rather than was given, on a public repo. Legal execution routes to the operator, and an unlicensed public repo is all-rights-reserved by default, which is the safer interim state than an unread legal instrument. The drafted text is preserved. Reverse by the operator issuing considered terms.

4. **Preview scope is all 73 components, not a core subset.** Owner: Nick. The kit ships a `GALLERY` entry per component with real fixture data and provenance back to the shipped page, so authoring is porting rather than inventing. A partial kit means the design agent invents the missing parts, which is the failure the wrapper exists to prevent.

5. **The two typefaces ship from the kit.** Owner: Nick. The product loads Inter and IBM Plex Mono from a font host in its own HTML; nothing built from the package does, so every design rendered in a fallback and silently discarded the type ramp that G-76 existed to fix. Both are OFL. This required bounding gate 4 to permit `@font-face` and only that, for families the canonical token block already names.

# 3. Open questions

1. **Do previews render light or dark?** Open because the correct fix is not available. 30b makes dark the staff default and the product ships `<html data-theme="dark">`, but `cfg.provider` can only wrap an inner element and the theme must be set on the root. Cards currently render light, which is correct (light is first-class in this system) but is not the staff default. Routing: the next session, at the conventions-header step. Next action: tell the design agent in `conventions.md` that dark is the staff default and how to set it, rather than trying to force it in the previews. Full diagnosis in `.design-sync/NOTES.md` under "The dark-theme trap".

2. **Two of the five load-bearing components cannot be wrapped.** Open because the product has never shipped their CSS. The applicability matrix (`mx*`) and the code citation (`cite`) are named load-bearing by 30b section 3.1, and `atomchip` from section 6.3 is also absent. A design agent drawing the Plan Review surfaces will invent all three. Routing: a product card against `smartcity-dashboards`, not the kit. Next action: name it as a card in OPS-17 before anyone designs a review console.

3. **Asset cache headers.** Open since G-81. `/shell.css` ships from `smartcity-dashboards` with no `cache-control` and no fingerprint, so a returning browser can hold a stale stylesheet across every CSS deploy shipped so far. Routing: a product card. Next action: hard-refresh when probing the deployed surface until it is fixed.

4. **Repo licence.** See decision 3. Routing: Nick, or the IP attorney thread. Not blocking.

# 4. Artifacts produced

| Artifact | Purpose | Where it lives |
|---|---|---|
| `_decisions/2026-08-18_smartcity_kit_component_package.md` | The kit-wrapper ruling and its two amendments | Filed, committed |
| `_decisions/2026-08-18_template_city_becomes_fixture_city.md` | The fixture-city ruling and its labelling gate | Filed, committed |
| `_inbox/2026-08-18_g76_g79_fixture_city_and_type.md` | Close for the shell wave, including the two production divergences | Filed, committed |
| OPS-17 amendments A-058 through A-064 | Plan rows G-76 through G-85 with their closes | Filed, committed |
| `smartcity-kit` PRs #1 to #3 | Wrapper, combined stylesheet, typefaces | Merged |
| `smartcity-kit` PR #4 | Sync inputs: config, NOTES.md, three calibration previews | **OPEN, needs merge** |
| `.design-sync/NOTES.md` in the kit | Every gotcha that cost a cycle this session | On PR #4 branch |

# 5. Stakeholder updates needed

None outside the building. All of this is internal product work on `template-city`, which is a demo pack. Live Bastrop was untouched throughout and remains on `smartcityos.io`. No city, vendor, or counterparty has anything to be told.

# 6. Context for the next session or recipient

## Your role

You are the planner. You fan subagents, you verify their work yourself, and you own merge and deploy. Verification is never delegated below you. Dispatches are compiled with `node scripts/dispatch.mjs`, never hand-assembled; the canon gate and the dispatch template gate both block hand-written briefs, and the no-nesting clause must be the first line of the agent prompt.

## The immediate goal

Get the 70 remaining preview cards authored, graded and uploaded so Nick can open the project and QA-walk it. The upload path is **incremental**: the project is empty, so one approval opens the channel and verified batches land as they pass, with Nick able to watch it fill in.

## Exactly where the sync stands

- Project: **SmartCity Product Kit**, `f5e5465e-943f-4f68-b52f-608925bc07b0`, created, pinned in config, **empty**. Nothing uploaded.
- Working clone: `P:\tmp\g82v`, on branch `g85/design-sync-inputs`. **Merge PR #4 first**, then work from `main`.
- Converter: clean. 73 components, 43 KB bundle, all `.d.ts` parse, anchor matches disk, `package-validate.mjs` exits 0.
- Authored and graded good, carrying forward with zero cleared: **Pill, State, MetricStrip**.
- Remaining: **70 components** on the honest floor card. That is the designed baseline, not a failure.

## Run it

```
cd P:\tmp\g82v            # or a fresh clone; dist/ is gitignored so build first
npm ci && npm run build
export PLAYWRIGHT_BROWSERS_PATH="$LOCALAPPDATA/ms-playwright"
node .ds-sync/package-build.mjs --config .design-sync/config.json \
  --node-modules ./node_modules --entry ./dist/index.mjs --out ./ds-bundle
node .ds-sync/package-validate.mjs ./ds-bundle
```

If `.ds-sync/` is absent, re-stage it from the skill base dir and `npm i esbuild ts-morph @types/react playwright@1.57.0` inside it. **Pin playwright to 1.57.0** — it matches a cached chromium build; `@latest` pins one that is not cached and fails to launch.

## Author the 70

Compositions already exist. `examples/gallery.tsx` in the kit has one `GALLERY` entry per component, all 73, each carrying `covers` (the classes it exercises), `from` (which shipped screen it came from) and a real `node` with fixture data. Porting an entry into `.design-sync/previews/<Name>.tsx` means splitting its JSX into named exports, one per card cell. Read `Pill.tsx`, `State.tsx` and `MetricStrip.tsx` as the worked examples. Budget 2 to 3 cells each.

Fan out subagents over disjoint component sets. The hard rules are in the sub-skill and they matter: a subagent edits only its own `previews/<Name>.tsx` and its own grade files, never runs `package-build.mjs` or `package-validate.mjs` (they rewrite the shared bundle and race every parallel agent), and uses `preview-rebuild.mjs --components <theirs>` then `package-capture.mjs --components <theirs>` instead. Config and NOTES edits are yours alone. If the same root cause appears in two or more of a subagent's components, or even once when it is config-level, that is yours to fix globally, not theirs to work around.

Never write a grade for a sheet you have not read this iteration. That rule is what caught the dark-theme trap.

## Traps already paid for

Read `.design-sync/NOTES.md` in full before starting. The three that will cost you a cycle each:

- **Do not set `cfg.provider` to `Theme` with `mode: "dark"`.** It renders broken and the build passes. `Theme` redefines the tokens and paints no ground, so dark near-white ink lands on the light canvas `body` still carries. `MetricStrip` looks perfect through it because `.metric` paints its own surface; `State` headings go nearly invisible. This is why a calibration set must include a text-heavy component and not only boxes.
- **`cssEntry` must be `./dist/kit.css`.** The closure takes one entry and `shell.css` defines none of the 63 tokens it consumes.
- **The kit's own gate 4 scans the whole repo for stylesheets** and will read `ds-bundle/` as the package authoring CSS. Already handled via a recorded skip set; if a converter version writes somewhere new inside the workspace, add the directory to `TOOL_OUTPUT_DIRS` in `test/_lib.mjs` rather than weakening the gate.

## Before you upload

Author `.design-sync/conventions.md` and set `readmeHeader`, then rebuild so the README carries it. That file is inlined into the design agent's system prompt and is the only place it learns the system's idiom. It must name real classes and tokens, and every name must verify against the built artifacts. This is where question 1 above gets answered: tell the agent dark is the staff default and how to set it on the root.

## Then the QA walk

Nick wants to walk the demo city. Two surfaces, and they are different things:

- The **Claude Design project** at `https://claude.ai/design/p/f5e5465e-943f-4f68-b52f-608925bc07b0` — the component picker, filling in as batches land.
- The **live demo city** at `https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app`, serving `smartcity-dashboards-00017-vx4`. Development services shows 14 fixture cases sorted unresolved-first; `?cityKey=empty-city` shows the same screen honest-empty. Hard-refresh when checking CSS changes, per open question 3.

## Standing constraints that still bind

Live Bastrop is no-touch and stays on `smartcityos.io`. No adapter grant, no G-52, no G-24 ingest, `grantedAdapters` stays empty on every pack, and city-owned asset records stay at zero. `permitflow`, `CitizenConnect`, `leaflet`, `pipedrive` and `stripe.com` must not appear in shipping files. `Bastrop` and `Chestnut` must not be **asserted** as content, though a refusal guard that names one in order to reject it is correct and expected.

## One pattern worth carrying

Three gate clauses were written this week as absolutes and each one forbade the compliant case: the forbidden-string rule that flagged fifteen refusal guards, the token-block rule that made itself unsatisfiable, and the no-CSS rule that forbade shipping the fonts the system declares. Each fix named the boundary rather than loosening the rule. When a gate blocks something that looks correct, check whether the gate is wrong before working around it, and if it is, state the boundary.
