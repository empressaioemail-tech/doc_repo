## Mission — program zero: audit and standards for the govtech stack program

You are the PROGRAM-ZERO lane planner. Four build lanes (A Smart Files, B SmartCity/Bastrop,
C Plan Review, D ICC) are about to be dispatched against `90_operations/OPS-17_govtech_stack_plan_of_record.md`.
Your job is to make the ground under them true before they build on it. You produce FINDINGS and
PROPOSED RULINGS; you do not make scope rulings yourself and you do not start lane work.

Read `90_operations/OPS-17_govtech_stack_plan_of_record.md` in full before anything else. Its
"Inherited spine constraints" section binds your own deliverables too.

You run FOUR sub-agents, one per work item below, and you supervise each to completion. They inform
each other — G-03's finding about the workspace atom family changes what G-01 should rule about doc 34,
and G-04's memory audit may contradict what G-01 finds in the docs. Sequence G-03 early and feed its
result into the others rather than running four blind parallel tracks and reconciling at the end.

### G-01 — doc sweep

VERIFIED STARTING FACTS (re-verify; do not trust these numbers blind): 102 of 159 root `.md` docs carry
`status: active` with `last_updated` before 2026-07-01. The status field has 16 distinct values in use
against 4 legal ones in `01_doc_conventions.md` (active | draft | superseded | historical); several
docs have prose in the status field.

`_smartcity_masters/33a_smartcity_plan_review.md` ALREADY RULED on plan-review doc lineage and the
rulings were never applied to the files. It names `47_codex_plan_review.md`,
`33_smartcity_codex_1b_integration.md`, `40i_cortex_dallas_e2e_grok_plan_review_sprint.md`, the
`30_smartcity_os.md` M4-B/PLR/SD/W vocabulary, and `11a_bastrop_live_roadmap.md` as superseded or
misleading. All still read `status: active` today. Apply the rulings that already exist before
proposing new ones.

`_smartcity_masters/00_README.md` declares that folder the REFERENCE SET with explicit authority:
where those docs and any other repo doc disagree, the masters win, and the other doc gets corrected.
Use that as the tiebreak rule, not your own judgment.

DELIVER: a per-doc table (path, current status, last_updated, proposed status, one-line basis,
superseded-by where applicable) covering at minimum every doc touched by the four lanes and the five
docs named above. Flag any doc where the correct call is genuinely ambiguous rather than guessing —
ambiguous ones route to the operator. Do NOT delete anything; retirement is a status flip per
`01_doc_conventions.md`. Do NOT create an archive directory; the convention is a status flip and
moving files would itself break it.

### G-02 — staleness and status instrument

Build `scripts/doc-staleness.mjs`. It must (a) fail non-zero on any `status:` value outside the four
legal ones, and (b) report every `status: active` doc whose `last_updated` is older than the threshold
in `01_doc_conventions.md`, with a `--lane-set` mode that limits the failing set to docs the OPS-17
lanes touch. Frontmatter parsing must handle the prose-in-status cases G-01 finds.

PROVE IT FIRES before you trust it, per inherited constraint 9: introduce a deliberate bad status and
a deliberate stale doc in a scratch copy, show non-zero exit and the exact rows, then show a clean run
exiting zero. A test that cannot fail for the right reason is a defect.

### G-03 — code audit (this row SIZES lane A; do it first)

`_smartcity_masters/34_smartcity_smart_files_and_foundation.md` open-item 1 asserts: "The substrate is
built; the city-facing Smart Files surface is a rendering and marketing pass, not a build." The whole
size of lane A rests on whether that is true. TEST IT; do not accept the doc's word.

Establish from LIVE SOURCE (npm package contents, engine registration, serving path, store query — not
from docs, and not from another agent's report):
- Does the workspace atom family exist in `@empressaio/atom-contract`, at what version, exporting what
  types? What is its entityId shape?
- Is it registered in hauska-engine? Is there any writer? Is there any serving path (MCP tool,
  retrieval route, API)?
- Are there any workspace/file atoms actually in the store? Count with the counting rule.
- Does any surface today render them?

DELIVER a verdict of exactly one of: RENDERING PASS (substrate real and serving, surface is the work) |
PARTIAL (shapes exist, no writer or no serving path) | BUILD (little more than a type). Carry the
evidence inline. If the verdict is not RENDERING PASS, say so plainly — assumption 2 in OPS-17 exists
to be falsified, and falsifying it is a successful outcome, not a failure.

### G-04 — memory system review

Audit `C:\Users\cente\.claude\projects\p--doc-repo\memory\`: every memory file plus `MEMORY.md`.

For each: does it trace to something still true at live source? Memories name files, flags, and
services that may no longer exist. Flag (a) stale — was true, no longer is; (b) contradicted — another
memory or a canonical doc says otherwise; (c) superseded-but-linked — the index already marks some
Cotality entries HISTORICAL because live memories `[[link]]` them, which is the pattern to follow, not
a defect; (d) index drift — a pointer with no file, or a file with no pointer.

DELIVER a table with a proposed disposition per memory (keep / update / retire) and the basis. Propose;
do not delete. Memory is dev-level shared state for this program and a wrong memory propagates into
every dispatch.

### G-05 — dev standards refresh

Inventory and report on: `.claude/hooks/` (five hooks — what each blocks, whether each still fires,
and whether any silently fails open when it should fail closed); `.cursor/rules/` and
`.cursor/settings.json` (both currently untracked in git — flag that); `90_runbooks/AGENT_CONTRACT.md`
currency against how lanes actually behaved in recent `_inbox/` close artifacts.

For at least ONE hook, prove it still fires with a deliberate negative test. The measured base rate in
this repo is that hook-shaped controls work 1-for-1 and protocol-step controls 0-for-3 — so a hook that
has silently stopped firing is the highest-value finding available to you.

### Constraints on your own work

- READ-ONLY on product repos. You may read any repo; you may write only in doc_repo, and only the
  artifacts named here plus `scripts/doc-staleness.mjs`.
- Verify at source per AGENT_CONTRACT section 5. Counts live behind queries, never prose. Where you
  restate a number from a doc, mark it as such and re-verify it.
- Every ratio travels with its counting rule.
- Two numbers that should agree and do not is a free finding — reconcile it, do not round it off.
- Leave doc_repo edits UNCOMMITTED and list them in the close; doc_repo commits are planner-owned.
- An honest partial close beats a narrated full close.

### Out of scope

Any lane build work. Any scope ruling (you propose, the operator rules). Any dispatch of the four
build lanes. Any work belonging to another program running in another chat — if you find work that
looks like it belongs to a different plan of record, name it in the close and leave it alone.
