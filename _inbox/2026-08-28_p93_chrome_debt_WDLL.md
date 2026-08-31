---
id: 2026-08-28_p93_chrome_debt_WDLL
title: WDLL — P-93 follow-on PE chrome debt conversion
status: draft
last_updated: 2026-08-28
operator_approval: pending formal plan-row amendment; execution directed by 2026-08-28 property-closer handoff (Card 3, parallel with P-89)
plan_row: P-93 follow-on
---

# WDLL: P-93 follow-on PE chrome debt conversion

Date: 2026-08-28  Status: draft
Operator approval: property-closer handoff Card 3 (parallel with Card 1; not W8). Formal OPS-16 amendment still owed so a compiled dispatch can name a row.
Plan row: P-93 follow-on (A-047 froze the kit; this card converts the leftover debt)
Repo: `hauska-map` `apps/property-explorer`. Fresh isolated clone from `origin/main`. Not `P:/tmp/hauska-map-p93-w9`. Not any registered `P:/seat-worktrees/property/hauska-map*`.

Cites QA WDLL item 42 leftover. P-93 close `_inbox/2026-08-28_p93-w9_close.json` leave_behind: 87 raw hexes and 60 native buttons across 37 files on hauska-map `0e4dc5c`. Gate: `apps/property-explorer/scripts/pe-chrome-kit-gate.mjs`. Baseline: `apps/property-explorer/scripts/chrome-kit-baseline.json`. CI: `.github/workflows/property-explorer-ci.yml` job `test` via `package.json` `test = node scripts/pe-chrome-kit-gate.mjs && vitest run`.

## Done looks like

PE chrome files import `pe-tokens.css` and `pe-chrome.ts` primitives (Button, Card, Dock, Input, StatusChip, Modal) instead of raw hex and native buttons. Gold stays a brand mark. Named islands stay named: `src/checkout/`, print gold, map overlay cyan. The regenerated baseline count drop is visible as its own reviewable act. The ratchet is not weakened. A planted hex and a planted native button, including self-closing, fail CI's exact command.

## Acceptance items

1. **Isolated tree.** Work is in a new clone from `origin/main`. Check: path is not a registered property hauska-map worktree and not the P-93 leftover. Grade: [ ]

2. **Hex conversion.** Raw hex count in chrome (islands excluded) drops from the 87 baseline by converting files to tokens. Check: regenerated `chrome-kit-baseline.json` plus the gate report. Grade: [ ]

3. **Button conversion.** Native button count (including self-closing) drops from the 60 baseline by importing kit Button. Check: same baseline file. Grade: [ ]

4. **Baseline is its own act.** `chrome-kit-baseline.json` is regenerated after conversion so the count drop is reviewable. Check: the JSON diff is not mixed into an unrelated file. Grade: [ ]

5. **Gate still fires.** Plant a new hex and a new native button (including self-closing) in chrome. CI's exact command (`pnpm --filter property-explorer test` or the script it runs first) fails. Revert the plant. Check: exit 1 named the file, then clean tree passes the gate. Grade: [ ]

6. **Islands and gold.** `src/checkout/`, print gold, and map overlay cyan still pass as islands. Gold is never a button fill. SmartCity kit is not imported. Check: violate gold-as-fill; gate fails. Checkout plant does not fail the chrome rule. Grade: [ ]

7. **Ratchet not weakened.** No blanket-ban that would fail commit one and get the gate switched off. No exemption added except the already-named islands. Check: read the gate diff. Grade: [ ]

## Out of scope

W8 Site Constraints. Stripe / checkout restyle. P-90. PE deploy (planner after review). P-85, P-87, Factory.

## Amendments

None yet.
