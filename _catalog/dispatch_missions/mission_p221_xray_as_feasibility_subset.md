## Mission — P-221: build the X-ray as a subset of the feasibility model

### The decision is already made. Do not re-open it.

P-120 ruled this on 2026-09-07, verbatim: **"redefine X-Ray as a subset view of the
Feasibility model rather than a separately-derived assembler, for tighter cross-document
accuracy control (operator ruling)."** That ruling has sat for eight days. You are
implementing it, not deciding it. If you find a reason it cannot be implemented as ruled,
stop and say so rather than substituting a different design.

### What P-227 established, so you do not re-derive it

P-227's ruling (`_inbox/2026-09-15_p227-standalone-vs-composed_ruling.md`) answered P-221's
own open question. P-221 guessed "either the dossier route asks for the brief on a different
key, or `verdict` is a separate artifact never produced." **It is neither.**

- `packages/engine-core/src/site-plan/dossier-author.ts` is a **pure renderer**. Verdict,
  cited brief facts, chat summary and owner notes arrive as **request-carried, caller-supplied
  content**. It independently resolves only the site-plan geometry leg, via the same
  `composeSitePlanModelForParcel` the site plan uses. It never resolves a verdict.
- The composer (`feasibility-author.ts` → `report-model.ts`) resolves the whole family from
  live atoms and computes the verdict **in-process** at `report-model.ts:282`
  (`composeVerdict`).

So `pipeline_output_absent / missing: [verdict, brief_facts]` is literally true and correctly
reported: nothing upstream supplied them, because nothing is supposed to. The asymmetry is
real and it is engine-side. That is the thing you are removing.

### Done looks like

`export_instrument kind=dossier` produces a real file for a parcel whose brief facts are
present, because the dossier path now **derives** verdict and brief facts from the feasibility
model in-process, the same way the composer does — not because anything was passed around it.

Operator target for the artifact: **3 to 4 sheets, a snapshot.** Feasibility stays the deep
dive. X-ray is not a short feasibility study; it is a different document with a different job.

### The constraint that will bite you: tier

**X-ray is SOLO. Feasibility is STUDIO.** (P-119, the authoritative tier definition: Solo is
exactly "Property X-ray and Flood & Drainage"; Studio adds Feasibility Studies.)

You are about to derive a Solo deliverable from a Studio model. **A derived report must not
leak Studio content into a Solo SKU.** Deriving from the feasibility model makes that leak
the default failure mode, not an edge case, so the section allow-list is part of this build
and not a follow-up. Decide explicitly which sections of the feasibility model an X-ray may
carry, and enforce it where the document is assembled rather than where it is rendered.

### The refusal must survive

**Do NOT weaken or delete the hollow-report refusal.** P-221 is explicit and it is right:
declining to emit a hollow report is the behaviour we want; the bug is that it has to. After
your change the refusal must still fire for a parcel whose inputs are genuinely absent. It
should become **unreachable in the normal case, never removed.**

The cheap wrong fix here is to delete the check and let a hollow X-ray render. If you find
yourself softening that guard so the happy path passes, stop.

### Second, smaller defect in the same refusal

The remedy text says *"Open the property brief and try again."* That is a WEB APP instruction
with no connector equivalent, and opening the brief did not help. A refusal that names an
action the caller cannot take is a dead end wearing a helpful face. Any refusal this path can
still emit must name an action available on the surface the caller is actually using.

### Falsifiers, pre-register your answers before you run anything

1. **Construct a parcel whose verdict or brief facts are genuinely absent and confirm the
   refusal STILL fires.** If it does not, you removed the guard instead of making it
   unreachable, and this row is failed regardless of how well the happy path works.
2. **Diff an X-ray against a feasibility study for the same parcel and confirm no
   Studio-only section appears in the X-ray.** If one does, the tier gate is not real.
3. If `kind=dossier` starts producing files but the content is assembled independently rather
   than derived from the feasibility model, P-120's ruling was not implemented and the row is
   not done even though the symptom is gone.
4. If the X-ray and the feasibility study disagree on any shared fact for the same parcel,
   the subset relationship is not real — that cross-document accuracy is the entire stated
   reason for the ruling.

### Known traps

- **hauska-engine has NO deploy workflow.** A merge there ships nothing and nothing says so.
  Your work is not live when it is merged. Say so in the close.
- The composer is actively worked. Read `git log` on `report-model.ts` and
  `feasibility-author.ts` before editing; another lane's change may already be in flight.
- Do not touch the flood async port. It is a separate, parallel piece of work in this same
  repo under P-227 and a different lane may hold it.

### Do not

- Do not re-decide P-120.
- Do not weaken the hollow-report refusal.
- Do not deploy. Deploys are planner-owned and this repo requires a manual Cloud Build.
- Do not write to any production store.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

State plainly whether the artifact is live (it will not be — no deploy workflow) and what the
integration seat must deploy. Close to `_inbox/` on doc_repo main and PUSH it. Declare
`leave_behind` explicitly. State your snapshot (repo, branch, commit).
