---
title: "CTRL-3 — an amendment that MENTIONS a row id grants that row"
date: 2026-08-14
status: open-defect
found_by: doc_repo planner (while verifying OPS-17 amendments A-002..A-007)
severity: HIGH — same class as CTRL-1, and it defeats the CTRL-1 fix for any row named in prose
routes_to: G0 program-zero lane planner (owns the control fixes; do not planner-patch, files are in flight)
related: [90_operations/OPS-17_govtech_stack_plan_of_record, _catalog/plan_registry.json, scripts/dispatch.mjs, .claude/hooks/canon-gate.ps1]
---

# CTRL-3 — an amendment that MENTIONS a row id grants that row

## What happened

While verifying the OPS-17 amendment batch (A-002 through A-007), the planner ran the standard
negative test and it FAILED:

```
node scripts/dispatch.mjs --plan OPS-17 --lane VER --plan-row G-14    exit=0   (correct)
node scripts/dispatch.mjs --plan OPS-17 --lane VER --plan-row G-9999  exit=0   (WRONG — want 1)
```

`G-9999` is a row that exists nowhere in the baseline. It validated because amendment **A-004** —
the amendment that RECORDS the CTRL-1 defect — quotes the string `G-9999` in its prose as the
reproduction case.

## Root cause

Both consumers accept a row if it appears in a baseline table row OR is mentioned anywhere on an
amendment line:

- `scripts/dispatch.mjs`: `` new RegExp(`^\\| A-\\d+[^\\n]*\\b${row}\\b`, 'm') ``
- `.claude/hooks/canon-gate.ps1:335`: `$planDoc -match "(?m)^\| A-\d+[^\r\n]*\b$rid\b"`

The intent is that an amendment can ADD a row without editing the frozen baseline (OPS-17 governing
rule 1). The implementation cannot distinguish **granting** a row from **mentioning** one. Any
amendment that discusses a row id — a defect report, a reversal, a "row X was descoped" note —
silently grants that row dispatch authority.

This is the CTRL-1 lesson repeating one level up: the rule is right, the string-match implementing
it is too loose.

## Why it matters more than it looks

1. **It defeats the CTRL-1 fix for exactly the rows most likely to be discussed.** A row named in an
   amendment because something went wrong with it is now permanently dispatchable, whatever the
   amendment actually said about it.
2. **The shared registry does not help here.** CTRL-1 was two implementations drifting; CTRL-3 is
   both implementations agreeing on a rule that is itself wrong. The divergence test passes.
3. **It is self-inflicted by good practice.** Recording defects in the amendment log is correct
   behavior, and it is what opened the hole.

## Reproduction

```
# A-004 mentions G-9999 in prose only. No baseline row exists.
node scripts/dispatch.mjs --plan OPS-17 --lane VER --plan-row G-9999   # exits 0, should exit 1
grep -n "G-9999" 90_operations/OPS-17_govtech_stack_plan_of_record.md  # only A-004 prose + grade log
```

## Proposed fix (G0 owns it; planner did not patch)

Make an amendment GRANT a row explicitly rather than by mention. Options, preferred first:

**(a) Require a grant marker.** An amendment grants a row only via a fixed token, e.g.
`ADDS-ROW: G-56`. Regex becomes `^\| A-\d+[^\n]*\bADDS-ROW:\s*[^|]*\b<rid>\b`. Prose may then
discuss any row id freely without granting it. Cheapest, most legible, and it makes the grant
visible to a human reader too.

**(b) Grant only from a dedicated column.** Amendments gain an explicit "rows added" column and the
match is anchored to it.

**(c) Maintain a materialized row list** the amendment updates, and validate against that. Most
robust, most machinery.

Whichever is chosen: the fix must land in `_catalog/plan_registry.json`-driven shared code so the
compiler and the hook cannot diverge, and it needs the **negative test that fails today**:

```
# must exit 1 after the fix (row mentioned in A-004 prose, never granted)
node scripts/dispatch.mjs --plan OPS-17 --lane VER --plan-row G-9999
# must still exit 0 (real baseline row)
node scripts/dispatch.mjs --plan OPS-17 --lane VER --plan-row G-14
# must exit 0 (a row legitimately granted by an amendment, once one exists)
```

Add the mentioned-not-granted case to `scripts/plan-registry-divergence.test.mjs` or its sibling so
this cannot regress.

## Interim posture until fixed

No OPS-17 dispatch may name a row that is not visible in a baseline table row. The four build-lane
dispatches all cite baseline rows, so none is currently affected. The planner will not add further
amendments quoting bare row ids until the grant marker exists; where a defect must reference a row,
it will be written in a form the regex cannot match as a grant.
