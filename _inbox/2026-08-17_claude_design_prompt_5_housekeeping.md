---
id: 2026-08-17_claude_design_prompt_5_housekeeping
title: Claude Design prompt 5 — housekeeping before kit copy
status: draft
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    30b_smartcity_design_system,
    30c_smartcity_platform_ia,
    2026-08-17_claude_design_prompt_3_compass,
    2026-08-17_claude_design_prompt_4_files_and_plan_review,
  ]
---

# Prompt 5 — paste this as the last design pass

The product line is complete. This is housekeeping so engineering can copy one kit and open four WDLLs without asking you questions. **Do not design a new surface.** Do not reopen frozen law. Do not open product repos. Do not `git add`. Do not commit. Do not push.

Work only in the four files you already own: `30b_smartcity_design_system.md`, `30b_smartcity_design_system.html`, `30c_smartcity_platform_ia.md`, `30c_smartcity_platform_ia.html`.

## Freeze these two flags (do not leave them open)

1. **Light-theme atom hex is `#177F78`.** The reservation is the meaning (openable recorded evidence), not the literal dark hex in both themes. Dark stays `#4CC9C0`. Light is the contrast-legal sibling. Write this as law in 30b, not as a question. If you already did, leave it and say so in the stop note.
2. **If atom and accent read too close in build, move `--sc-accent` dark, not `--sc-atom`.** Form-separation (accent never a chip; atom chip always carries a 10px mono DID) stays. Do not invent a third teal.

## Do these items

1. **One token count.** 30b and 30c must agree on one number. If the reserved atom pair is in, the count is 60, not 58. Kill leftover "58 tokens" sentences.
2. **Component inventory in 30b.** Name every class the HTML introduced that is not already in the inventory: at least `.atomchip` and `.p4bar`. Each gets a one-line job. `.p4bar` is determinate progress composed from existing tokens. No new color, radius, or duration.
3. **Kit extract.** Add a section or sibling block that is the **copy payload**: the full `--sc-` declaration set as a single CSS `:root` / `.sc-light` / `.sc-dark` listing, plus the class name list. This is what engineering will paste into three repos. Byte-identical to the HTML token blocks. Do not copy it into `smartcity-dashboards`, `smart-files`, or `plan-review` yourself.
4. **Housing line.** Add one sentence: canonical housing will be `_smartcity_masters/36_smartcity_design_system` and `_smartcity_masters/37_smartcity_platform_ia`, INTERNAL ONLY, not claims registers. **Do not move the files.** The planner moves them after you stop.
5. **Implementer notes (short, in 30c handoff).** Compass demo approximates interruptibility; the build path is Framer `layoutId` (or equivalent) so grab-to-dismiss is real. FLIP, spring `{ stiffness: 320, damping: 32, mass: 0.9 }`, radius interpolation, content fade at ~35% of settle, background scale 1.03. Reduced-motion instant. Retrieval and answer engine remain out of scope.
6. **TOC / section numbers.** Contents rail matches the body. Compass, Files browser, Bring files, access, comment letter, applicant, cross flow are findable without hunting.
7. **INTERNAL banners** on both HTML files. Do not publish outside the building. If a mock leaves the building, strip ICC titles.
8. **Banned words in UI copy.** Confirm `substrate`, `content-addressed`, `OAuth`, `atom` (as a customer word), `IPFS`, `CID` appear only inside prohibition rules, never on a control or empty state.
9. **G-64 residual.** One line in 30c handoff: today's Dashboards development-services iframe of `plan-review-app` is as-found. Designed end state is native compose. The iframe is allowed to remain until the Plan Review UI card replaces it. Do not redraw PermitFlow.

## Stop

When the kit extract exists, the two flags are law, token counts match, and the class list is named: **stop.** Reply with: token count, class list added, whether light atom was already `#177F78`, and that you did not commit.

Do not start a fifth product. Do not design Asset ingest. Do not restyle `smartcityos.io`.
