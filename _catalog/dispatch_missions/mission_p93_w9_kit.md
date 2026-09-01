## Mission — P-93: Smart Site kit write-path (QA W9)

You are a LANE PLANNER on the **property** seat for PE chrome only. You may spawn sub-agents. You supervise every one to completion. You never delegate verification. You do not commit (the parent planner commits). You do not deploy.

**PLAN-ROW:** P-93
**Repo:** `hauska-map` (`apps/property-explorer`)
**WDLL:** `_inbox/2026-08-28_p93_w9_kit_WDLL.md` (items 1–5). Also cite QA WDLL item 42 (W9.1–W9.3).
**Parent:** `_inbox/2026-08-27_smartsite_qa_program_WDLL.md`

### Snapshot and worktree

Declare repository, branch, and commit in your first output.

Create an isolated worktree from `origin/main`. Suggested path `P:/tmp/hauska-map-p93-w9`. Do **not** write:

- `P:/hauska-map`
- `P:/seat-worktrees/property/hauska-map`
- `P:/seat-worktrees/property/hauska-map-records`
- `P:/seat-worktrees/property/hauska-map-smartsite-ai`
- `P:/seat-worktrees/property/hauska-map-chrome`
- `P:/seat-worktrees/property/hauska-map-factory`
- `P:/seat-worktrees/property/hauska-map-publish`
- Any tree the Stripe agent is using

If you cannot isolate, stop and say so.

### Why this card exists

Chrome v2 shipped tokens, `PE` / `TYPE` / `Button` / `Modal`, and `scripts/pe-chrome-kit-gate.mjs`. The write path is still local ACCENT blocks and native buttons. A token file plus one Button cannot win against hundreds of inline style sites unless the gate fails on the next raw hex. W9 freezes the law and arms that gate. It does not restyle the product.

W8 is not this card. Do not start W8.

### Read first

1. This mission and the P-93 WDLL.
2. Canvas W9.1–W9.3 on `smartsite-design-system-gap.canvas.tsx`.
3. `apps/property-explorer/src/styles/pe-chrome.ts` and `apps/property-explorer/src/styles/pe-tokens.css` (paths as they exist on origin/main).
4. `apps/property-explorer/scripts/pe-chrome-kit-gate.mjs` and the CI job that does or does not run it.
5. The write path of any file you convert. Code reading outranks output measuring.

### Acceptance mapping

| WDLL | Work |
|------|------|
| 1 | Stamp pre-v2 briefs HISTORICAL. `pe-tokens.css` + `pe-chrome.ts` are the only kit. |
| 2 | Six primitives exist. Convert only surfaces you touch. Inventory first; do not invent a second Button. |
| 3 | Gate fails on a known raw hex and a known raw chrome button, except named islands. |
| 4 | That gate is the one CI runs. Name the job. Dormant script is not met. |
| 5 | No SmartCity kit import. Gold is never a button fill. |

### Constraints

- Fail closed. A gate that cannot run and silently passes is the defect.
- Verify by violating. Pass-only is not a grade.
- Named islands stay: map overlay cyan, print gold, Stripe checkout (night / Inter). Do not restyle Stripe.
- Do not import the SmartCity kit. Do not reload Oxygen. Do not make gold a button.
- Do not convert the whole app. Touched surfaces only.
- Do not start W8, W4 P1, P-90, or Stripe live flip.
- Do not write engine, MCP, LDT, or Smart Site product MCP.
- Do not deploy. Open a PR. Planner deploys.
- Commit is not yours. Explicit pathspec list in the close.
- Subagents do not commit.

### Falsifiers (pre-register, then run)

1. A new chrome tsx file with `style={{ color: "#aabbcc" }}` still passes the gate. If that happens after your change, item 3 is not met.
2. A new chrome tsx file with `<button>` and no kit Button still passes the gate. If that happens, item 3 is not met.
3. The gate script exists and no PE CI job calls it. If that is still true, item 4 is not met.

### Close

File CP1 / CP2 / close at the paths this dispatch names. Declare `leave_behind` (whole-app conversion and W8 are the expected leftovers). Return scratch entries (LESSON / DEAD-END / GROUND-TRUTH with timestamp / OPEN) in the close. Do not promote to MEMORY.md.
