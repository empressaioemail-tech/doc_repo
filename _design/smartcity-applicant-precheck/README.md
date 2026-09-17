# SmartCity applicant precheck

**Artifact:** on the combined design canvas, first row: https://claude.ai/artifact/FBWcVY3f1gRa3HswLoeQaY (version 11, 2026-09-17). No canvas of its own.
**Status:** RATIFIED 2026-09-17, `_decisions/2026-09-17_design_ratification_all_approved.md`. **NOT BUILDABLE:** the operator deferred the blending ruling in the same session, so which service runs the check is unresolved and no build row can name a repo.
**Plan rows:** OPS-17 G-147 (the applicant-facing plan review view) and G-142 (the Citizen lens). This folder does NOT cover the Citizen lens nav surface. The shipped Citizen page ("Near you", requests, payments, meetings) is still undesigned, and `design-completion-gate.mjs` still reports `lens:citizen` as uncovered, deliberately.
**Decision record:** none yet. The operator's answers below were given in session on 2026-09-17 and are recorded here.

Ten artboards: the flow, six applicant screens, a public verify page, and two city screens.

## What the operator asked for

A pre-submittal self-check for architects, builders and investors, offered by the city. The applicant finds the lot, checks the lot's facts, uploads a plan set, runs a check against the city's code and that lot, revises, and applies through whatever system the city already uses. The city reviews with the precheck in hand and records its decision against the lot.

The operator gave four directions on 2026-09-17, and each one changed the boards:

1. **SmartCity is the product.** The applicant page is a SmartCity public surface drawn in the SmartCity kit, next to the flood study and plan review. It is not a Smart Site screen. How Smart Site, Smart Files, SmartCity plan review and Development services blend is to be discussed before implementation.
2. **Branding is SmartCity plus the city's logo.**
3. **The AI reads the plan set, with no form.** The applicant never types dimensions.
4. **It is a self-check, and it never blocks.** The applicant gets findings quickly, can download or email them, revises, and may still apply with suggestions left open.

"CitizenConnect" is a retired product name and is on the never-say list (`_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`). The working name for this surface is **Plan precheck**. A name for the family of public city functions is still owed.

## The boards

| Board | What it shows |
|---|---|
| Flow | The whole journey in three lanes (applicant, shared, city). Each step is badged EXISTS, PARTIAL or NEW with the source file behind the badge |
| Main | Start: the lot and its facts, the project type, and the checklist shown before upload |
| Reading | The check running: sheets read, reading, or queued; the applicant can leave and be emailed |
| Findings | Version 1: counts that add up, the AI disclosure, the sheet with numbered pins, findings grouped by who acts next |
| Revised | Version 2 compared check by check: resolved, still open, reading changed, unchanged |
| Submit | Apply with a suggestion open. The applicant can add an optional note and choose to include the precheck. The city's own instructions sit beside the precheck code |
| Summary | The findings document the applicant downloads, and the same findings by email |
| Verify | The public verify page in four states: current, replaced, rules changed, no match |
| Review | City: plan review receives the precheck. Each reading can be confirmed or overridden before the decision is recorded against the lot |
| Setup | City: rules in force, project types, the checklist, the public page, who can use it, and how the city takes applications |

## The two moves

**The checklist comes before the upload.** Once a project type is picked, the applicant sees exactly what is checked: nine checks, six read from the plans against the lot and three left to the city. Every result then has a denominator, so "no issues" can never read as "complies".

**Results are sorted by who acts next.** The groups are *Suggested before you submit*, *The city reviews these*, and *No issue found*. The applicant never sees the product's determinations (Pass, Fail, Unchecked). Those appear only on the city's review board, where a person confirms or overrides each one.

## What exists today, and what is new

The Flow board carries this with a source file on every step. In short:

- **Partial:** parcel facts, the city rule set (two Bastrop sections, no effective date), and the check engine (one adjudicator in `plan-review`, for the front setback). The AI sheet reading lives separately in `legacy-design-tools`, reports problems only, and its evaluation harness has no known answers. Upload exists only through `plan-review` into Smart Files, and Smart Files has no identity for an applicant who has not submitted. Review has override with a reason. Decisions have engagement stages, but the atom contract (1.36.0) has no decision record type.
- **New:** project types and checklists, version comparison, the findings document, the precheck code and verify page, apply-anyway, packet lookup, and every city setting.

## Held to source

`source-state.json` is dumped by `dump-source-state.mjs` from clones at `plan-review` 9149595f, `smartcity-dashboards` f776b4bf and `legacy-design-tools` dca5ec2e.

- **Citations.** Every citation on these boards is produced by the product's own `renderCitationText()`. The Bastrop book holds exactly `14-02-003` and `14-02-008`.
- **Rules with no edition.** A rule with no declared edition (the IRC exterior-walls row) prints no citation, because `buildCitation()` refuses one.
- **Stages and absences.** Engagement stages come from the SQL constraint. Absence states are the product's four kinds.

**Fixture throughout.** The requirements (25', 5', 20', 35', 45%), the readings, the dates and the code `PC-7K2F-9QD4` are invented. They are not Bastrop's standards. The story continues the 908 PINE ST case from `plan-review-reasoner`: the house sits 22'-0" from the front line against a 25'-0" minimum, the applicant applies with that suggestion open, and the reviewer confirms it. No person is named anywhere; the reviewer is a role.

**An assumption to confirm before ratifying.** These boards cite `14-02-003` (district requirements) for the side and rear setbacks, height and coverage, as well as the front. That assumes the district requirements section carries those standards. The product adjudicates only the front setback against it today, and the reasoner fixture draws side and rear as uncited. If both designs are shown together, reconcile them against the city's code text first.

## The AI-reading choice, and what the boards do about it

With no form, every automated result rests on a reading whose accuracy nobody has measured. The design follows the operator's direction and makes the consequence visible rather than hiding it:

- Every reading carries an AI READING tag naming its sheet.
- Every board that shows readings says software made them and no person checked them.
- Each finding offers "This reading looks wrong", which is also the start of a calibration loop.
- On the city side, a reading is not a finding until a reviewer confirms it.

Before any launch, the readings need a set of known answers to score against.

## Open, not ruled

- How Smart Site, Smart Files, SmartCity plan review and Development services blend (operator: discuss before implementation).
- The public page's address (subdomain, the city's own domain, or a path). The verify link is shown as a path until this is decided.
- Which service runs the check. The adjudicator is in `plan-review` and the AI reading is in `legacy-design-tools`.
- Where plan sets live, and how long an anonymous upload is kept.
- Who pays. Setup draws access as three options with none selected, and the public page stays in preview until one is chosen.
- Which checks ship first.
- **G-140:** which Bastrop code is in force. The city publishes a newer zoning layer it describes as replacing the B3 code. Setup marks the rule set NOT CONFIRMED.
- The verify page. The design makes it public with no login, following the standing rule to gate what is served, never what proves it.
- How far a city's decision travels. It is that city's data, and showing it publicly is the city's choice.

## Instruments

    node dump-source-state.mjs --plan-review <clone> --dashboards <clone> --ldt <clone>
    node gen.mjs
    node check.mjs
    node violate.mjs

- **`check.mjs`** applies 13 rules and runs 20 self-tests, including a clean fixture that must pass. It refuses a verdict (exit 2) if any rule matched nothing on the boards.
  - Rules R1, R2, R3, R12 and R13 compare the boards against product source.
  - Rules R4, R5 and R10 are internal consistency across boards from one generator, and are labelled so.
  - The remaining rules refuse vocabulary: approval language, named people, retired names, missing fixture badges, and confidence figures.
- **`violate.mjs`** plants 21 violations into the real boards in memory, one or more per rule. It fails if a plant does not change its board or a rule stays silent. Its first run found two mis-aimed plants and one real gap: the Reading board listed what software found on a sheet without saying software found it. That gap is fixed.

**Render:** each `.dc.html` is a standalone artboard. `_design/demo/export-screens.mjs` shows the conversion. Public boards are always light; staff boards take `{{themeClass}}`.

    Verified 2026-09-17: gen.mjs wrote 10 boards; check.mjs clean, 13/13 rules matched;
    violate.mjs 21/21 plants fired, 13/13 rules proven; every board rendered and read in light,
    Review and Setup also in dark.
