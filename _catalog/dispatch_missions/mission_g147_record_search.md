## Mission - G-147: design Records search, and settle whether the applicant-facing view is already covered

You launch no sub-agents (FAN-DEPTH 0). You work in `P:\doc_repo` only. Product repos are READ-ONLY
to you and every product claim is read at a named ref. `doc_repo` commits are planner-owned: leave
your edits uncommitted and list the paths in your close.

### Scope of THIS lane, and two things that are explicitly not yours

The row covers three surfaces that had no design and no row at all. This lane takes two of them and
DEFERS the third by ruling, so you are not blocked and not over-scoped:

1. **Records search. IN SCOPE.** This is the one the gate is actually failing on. `RECORDS_WORK =
   "records"` (`smartcity-dashboards` `origin/main` `96fdafbb`, `src/staff-review.mjs:9`), labelled
   `records: "Records search"` at `:210`. `design-completion-gate.mjs` reports it at R4: *"work:records
   no design and no exclusion ruling (carded G-147)"*.
2. **The applicant-facing plan review view. IN SCOPE, as an adjudication.** The row says "a persona
   exists in the product and the view does not". But `_design/smartcity-applicant-precheck/` was
   RATIFIED 2026-09-17, after this row was carded, and it draws the applicant-facing path. **Decide
   with evidence whether that design already covers this item, or whether there is a real remaining
   gap.** If it covers it, say so with the citation and an amendment request; do not redraw it. If it
   does not, design the remainder. Either answer is a result; a third answer that quietly does both is
   not.
3. **Compass. DEFERRED, and do not draw it.** The row's blocker is "G-142 and G-145 for Compass only,
   which needs lenses to be a sidebar over". G-145's lens designs are shipped; **G-142 (the Citizen
   lens) is in flight in a sibling lane as you read this.** A sidebar drawn before the surface it
   sidebars over exists is the defect the design thread already warned about. State the deferral in
   your close and leave it to the row.

### What the shipped product says, read at the ref

The register at `src/shell-homes.mjs` is the authority for what these surfaces are, and it is not
kind to a Records search design that wants to look full:

- `:113` reads `{ table: "primary", job: "Prophecy document search", home: "Work Records search",
  disposition: "Not built" }`. The v1 capability this replaces was a document search, and it is
  recorded as not built, not as empty.
- `:119` reads `{ table: "review-product", job: "City document table", home: "Files", disposition:
  "Island" }`. Document search is a named island until a lens is designed for it, which is this row.
- Read the comment block above the register (`:71` onward). It records that **four surfaces said "Not
  built" while their tabs shipped and rendered 72 generated records between them**, and that the
  hand-typed disposition column was the shape that opened the programme. So the register is the
  authority, but it earned that authority by being wrong first. If your design contradicts it, you owe
  a source read, not an opinion.
- `src/lens-claims.test.mjs` derives against the register's `domainId` links. A design that proposes a
  disposition change has a test on the other end of it.

### Acceptance, verbatim from the row

> Per surface, an adversarial read run as a file, self-testing in both directions with a non-zero
> matched-input count, against the shipped surface at a named ref; and the design-completion gate
> stops reporting each one as uncovered

So the deliverable is a design folder under `_design/`, and for the surface you design, a `check.mjs`
that is an adversarial read RUN AS A FILE, self-testing in both directions, aborting rather than
returning a verdict it cannot support, and printing a NON-ZERO matched-input count. The Smart Files
precedent is the bar to clear: a predicate there self-tested perfectly and matched nothing on any real
artboard, so it proved nothing. Your predicate must be shown to match real input.

For the adjudication item, the deliverable is the citation, not a canvas.

### Boundaries

- **One line in `_design/INDEX.md`, appended.** A sibling design lane (G-142) may be in flight and also
  appends one line. Append only your own line; do not reorder, reword, or reformat any existing line.
- Do not write in `smartcity-dashboards`, `smartcity-os`, or any other product repo.
- Do not commit anything in `doc_repo`.
- Do not draw Compass, and do not redraw `smartcity-applicant-precheck`.

### Evidence your close must carry

- The named product ref, the design folder created, and the applicant-view finding with its citation.
- `node _design/<your-folder>/check.mjs` exiting 0 with its matched-input count, and exiting non-zero
  on a named planted violation.
- `node scripts/govtech/design-completion-gate.mjs` re-run. Records search must no longer appear at R4.
  If it still does, say exactly why rather than softening it.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the
  close, never written to memory directly.
