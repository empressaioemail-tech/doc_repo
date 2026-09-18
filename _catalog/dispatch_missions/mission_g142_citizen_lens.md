## Mission - G-142: design the Citizen lens, the only surface a resident ever sees

You launch no sub-agents (FAN-DEPTH 0). You work in `P:\doc_repo` only. The product is READ-ONLY to
you: you draw the surface, you do not change it. Any product claim you make must be read at a named
ref, never remembered. `doc_repo` commits are planner-owned, so leave every edit uncommitted and list
the paths in your close.

### Why this is the front of the queue

`node scripts/govtech/design-completion-gate.mjs` is G-146's own acceptance instrument. It exits 1
today with six findings, two of them R4 "shipped nav surfaces neither designed nor excluded by a dated
ruling", and this row is one of them:

```
R4 - shipped nav surfaces neither designed nor excluded by a dated ruling (2)
    lens:citizen     no design and no exclusion ruling (carded G-142)
    work:records     no design and no exclusion ruling (carded G-147)
```

The gate read `smartcity-dashboards` `origin/main` `96fdafbb` and `P:\doc_repo\_design` at
2026-09-18T15:46Z. Your lane moves the first of those two lines. The row's own blocker column says
"Nothing", and it is the first item in G-146's declared order.

### What is already there, and why it must not regress

The Citizen lens is not a blank page, and the honest parts of it were earned. Verified at
`smartcity-dashboards` `origin/main` `96fdafbb`:

- `src/staff-review.mjs:4` declares `export const CITIZEN_LENS = "citizen";`, and `:189` labels it
  `citizen: "Citizen"`. The shipped nav badges it `Preview`.
- Its address lookup is deliberately DISABLED with the basis printed on the page, not hidden.
  `web/index.html:1117` carries it verbatim: *"Lookup returns nothing today and the control is
  disabled rather than silent. It answers from public record once a source is connected for this city.
  A parcel identifier is never required to open this lens."*
- `src/ui.test.mjs:343` asserts that exact copy. **A design that removes or softens it breaks a test.**
  That is the product's own guard for the one thing this design most obviously wants to change, so
  read the test before you draw over it.
- The history is already recorded and you should read it before proposing structure:
  `src/shell-homes.mjs:146` reads `{ table: "other", job: "Citizen service requests", home: "Citizen
  lens. The twelve-tile grid was dropped.", disposition: "Mounted" }`. The twelve-tile grid was
  dropped once already. Do not re-propose it without saying why it is now right.

### What to build

A design for the Citizen lens, in a new folder `_design/smartcity-citizen-lens/`, drawn against the
shipped surface at the ref above. Two other surfaces are explicitly NOT yours and you must not absorb
them: `_design/smartcity-applicant-precheck/` (RATIFIED 2026-09-17) is the applicant-facing precheck,
and its own index line records that it "Does not cover the Citizen lens surface (G-142 stays
uncovered)". Compass is G-147's.

Deliver in the same pass, because the standing rule in this thread is that no design is shown or
ratified without an instrument:

1. `_design/smartcity-citizen-lens/check.mjs`, an adversarial read run as a FILE, self-testing in BOTH
   directions, aborting rather than returning a verdict it cannot support, and reporting a NON-ZERO
   matched-input count. The Smart Files precedent is the bar: a predicate that self-tested perfectly
   and matched nothing on any real board was worthless. Prove yours matches something.
2. The design folder's README with the artifact URL and status.
3. `_design/surface_coverage.json` if a nav or lens id mapping is needed.

### The acceptance, verbatim from the row

> An adversarial read run as a file, self-testing in both directions with a non-zero matched-input
> count, against `smartcity-dashboards` at a named ref - the standing rule for every design in this
> thread. Nobody named on the canvas; fixture badged as fixture; absent, zero and unmeasured never
> collapsed.

That last clause is the one that decides this design. The Citizen lens is the surface with the least
data behind it, which makes it the surface where "absent", "zero" and "unmeasured" are most tempting
to render as the same thing. The disabled lookup with its printed basis is the existing correct
treatment; the design's job is to extend that discipline to every other region rather than to regress
it.

### Boundaries

- **One line in `_design/INDEX.md`, appended.** Another design lane may be in flight and also appends
  one line. Append only your own line. Do not reorder, reword, reformat, or "tidy" any existing line.
- Do not write in `smartcity-dashboards`, `smartcity-os`, or any other product repo.
- Do not commit anything in `doc_repo`. Leave the edits and list the paths.
- The `_kit.css` file is byte-identical across all its copies; if you add a copy, keep that true.

### Evidence your close must carry

- The named product ref you read, and the design folder you created.
- `node _design/smartcity-citizen-lens/check.mjs` exiting 0 with its matched-input count printed, and
  exiting non-zero on a planted violation you name.
- `node scripts/govtech/design-completion-gate.mjs` re-run, showing R4 down to one finding
  (`work:records`) or stating plainly why `lens:citizen` still appears.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the
  close, not written to memory.
