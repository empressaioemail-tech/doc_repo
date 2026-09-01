---
id: 2026-08-17_g67_kit_copy_WDLL
title: WDLL — Lane B G-67 design-system kit copy
status: approved
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_smartcity_product_line_design_system,
    _decisions/2026-08-17_atom_accent_light_hex,
    _decisions/2026-08-17_ux_implementation_sequence,
    30b_smartcity_design_system,
  ]
---

# WDLL: Lane B G-67 design-system kit copy

Date: 2026-08-17  Status: approved
Operator approval: 2026-08-17

Plan row: **G-67** (OPS-17, A-053). Instrument: the same `--sc-` token file is present and byte-identical in `smartcity-dashboards`, `smart-files`, and `plan-review`. No product UI rewrite on this card. Live Bastrop unchanged.

This card is the shared foundation. G-66, G-68, and G-69 do not start until this card is graded.

## Done looks like

Each of the three product repos contains one kit file whose `--sc-` declaration set matches the 30b extract. A mechanical check (hash or diff) reports identical tokens. No repo has edited a token value. No new color, radius, duration, or type step was invented in a repo. Serving revisions may be unchanged; a deploy is not required if the file is unused until the UI cards. Live `smartcityos.io` unchanged. No atoms `--apply`.

## Acceptance items

1. **Operator approves this card.** Status flips from draft to approved before any repo copy.
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [ ]
   | depends on: none

2. **Source extract exists.** 30b (or housed `_smartcity_masters/36_…`) publishes a single copy payload: `:root` / `.sc-light` / `.sc-dark` plus the class name list. Token count is the 30b number (60 if atom pair is in).
   | check: extract file or section exists; count named; light `--sc-atom` is `#177F78`; dark is `#4CC9C0`.
   | grade: [ ]
   | depends on: 1

3. **Three repos carry the same file.** Paths named in the close. Byte-identical token block across the three. Future AM repo is named as not-yet and is not invented.
   | check: diff of the three token files is empty; `git` paths quoted.
   | grade: [ ]
   | depends on: 2

4. **No UI rewrite on this card.** Existing Dashboards / Files QA / Plan Review QA still serve. Kit file may be imported and unused.
   | check: close names serving pins unchanged or names a pin whose HTML still matches the pre-card proof; no lens or browser rewrite claimed.
   | grade: [ ]
   | depends on: 3

5. **Live Bastrop and L26 untouched.** Zero deploys to `smartcity-os-prod`. No atoms `--apply`.
   | check: city pin `00118-qox` unless a later pin supersedes; L26 writer slot not taken.
   | grade: [ ]
   | depends on: 1

## Out of scope

Dashboards four-lens UI. Files browser. Plan Review console. Compass sheet. Asset Management repo. Token value edits. Second MCP. Feed ingest. G-52. G-24.

## Amendments

(none until operator go)

## Finish card (graded at close)

(empty until close)
