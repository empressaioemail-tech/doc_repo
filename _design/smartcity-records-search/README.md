# SmartCity OS — Records search

**Artifact:** not published. DRAFT of 2026-09-18, produced under OPS-17 G-147, lane
`g147-record-search`. Publication is the planner's call, not this lane's.
**Decision:** none yet. The ratifying decision belongs in `_decisions/` and should link back here.
**Status:** DRAFT, awaiting ratification. Drawn after the 2026-09-17 blanket approval, so that
approval does not cover it. Dispatched work is landed; the implementation row is not allocated.
**Plan rows:** OPS-17 G-147. The row carries three determinations and this folder lands all
three — Records search designed here, the applicant-facing plan review view adjudicated below,
Compass deferred and not drawn.
**Sources:** `smartcity-dashboards` at `origin/main` `7487d7c0a55deeefc286c4a1047545757b802c5b`
(dispatch ref `96fdafbb`, see the ref note below) and `smart-files` at `origin/main`
`6d71bf38fe0cc67fafd4fe8b55fb55b7f07c863d`. Both read with `git show` at the ref, never from a
working tree.

## Regenerate and check

    node dump-source-state.mjs
    node gen.mjs
    node check.mjs
    node violate.mjs

`source-state.json` is the OUTPUT of the product's own composers, not a transcription of them.
`dump-source-state.mjs` extracts the ref's module graph file by file into a temp directory and
imports `domains.mjs`, `city-pack.mjs`, `fixture-seam.mjs`, `staff-review.mjs`, `shell-homes.mjs`
and `adapters.mjs` from there, so the domain map, the nav lists, the register rows and the
adapter kinds on the boards are the product's own values at the ref. The smart-files half is read
with `git show` and its vocabularies are extracted from source text rather than restated.

`gen.mjs` throws if `work:records` becomes a mount, if the nav label moves off "Records search",
or if the legs stop being two. `check.mjs` refuses a verdict (exit 2) if any predicate matched
nothing. `violate.mjs` plants 24 violations into the real boards one at a time and requires each
to be caught for the reason it was planted.

`_kit.css` is a byte-identical copy of `_design/smartcity-parks-lens/_kit.css`, md5
`58a68730e051b1ee2ffa21f08eae6752`. No token was invented.

### Two notes on the refs, stated rather than smoothed over

**The dispatch ref and the dumped ref are not the same commit.** The dispatch names
`96fdafbb`; the gate read that ref and reported `work:records` uncovered. The three files this
design's claims rest on were checked across both: `src/staff-review.mjs` and
`src/shell-homes.mjs` are byte-identical, and `web/index.html` is **not** — it has moved on by
about 3KB. Every string this design quotes out of `index.html` is asserted present at the dumped
ref by `dump-source-state.mjs`, which aborts rather than reporting a stale quote as current.
`source-state.json` records the comparison per file, so the difference is a recorded fact rather
than an assumption.

**The dashboards checkout is parked on an unrelated commit** (`178e968b`) while `origin/main` is
`7487d7c0`. Neither the dashboards tree nor the smart-files tree was read for this design, which
is why the dumper uses `git show` throughout. `src/city-pack.mjs` reaches `src/db.mjs`, which
imports `pg`, so the installed driver is made visible to the temp tree through a directory
junction rather than stubbed: a stub would be this design pretending to know the driver's exports.

## Records search is a finder, not a region

The other five work surfaces are one of two things. Files and Plan review are iframe **mounts** of
separate products — `MOUNT_WORK_IDS = [FILES_WORK, REVIEW_WORK]` in `src/staff-review.mjs`, and
the Files mount points at the smart-files product rather than at a table. Connections is a
register over the product's own build state. Assets and People own a subject.

Records search owns nothing. It answers one query across two legs it does not own:

- **Cases** — the regions in `DOMAIN_REGISTRY`, which the department lenses already read. Anchored
  on `recordId`, because `RECORD_ENVELOPE_FIELDS` makes that a required identifier on every record
  of every kind; any further field the finder matches on is a decision this design makes and says
  it is making, not a product guarantee it can lean on.
- **Documents** — the corpus behind the Files mount, reached through
  `searchDocuments(scopeType, scopeId, q)`, which is scope-bound and never reads the whole system.

That is why this surface has no plausible empty state and no plausible result count on its own. It
can read neither leg completely: one of the eleven registered regions has its gating adapter
withheld on the pack it is drawn against, and the corpus is partly unsearchable and partly
refused. **So the hard problem is not layout. It is that four different sentences share the shape
of a short list, and only one of them is "no matches".**

| The sentence | Why the finder can say it |
|---|---|
| no matches | the leg ran and there is nothing |
| **not asked** | the region's gating adapter is not granted on this pack — `police-cameras` gated by `verkada` on `bastrop_tx`; the composer's basis says so |
| **not permitted** | the reader does not hold the scope; the product refuses with `read_outside_scope` |
| **not searchable** | the document has no text layer, or the extractor threw, or the row predates the reason column |

## What the design fixes

**Coverage before results.** Every result set is preceded by a coverage panel with one row per
leg. The cases leg reports how many registered regions were asked and which were not, with the
vendor named. The corpus leg carries the product's own counts — in scope, searched, not searched,
and **a count per reason, including the reasons that are zero** — beside
`emptyCoverage()`'s counting rule verbatim. A coverage panel that omits a reason cannot be told
apart from one where the reason never occurred.

**The illustrative count is badged.** The corpus figures on these boards are a shape, not a
measurement: the corpus lives in a live tenant and this design cannot call `searchCoverage` at a
ref. They are marked `data-fixture="true"` and `check.mjs` refuses a corpus panel without that
badge. What is enforced instead is the **arithmetic** — searched plus every reason equals in
scope, and not-searched equals in scope minus searched — because a coverage panel whose numbers do
not reconcile reads as precision, which is worse than reading as a shape. Two plants break it in
both directions.

**Every result says where it came from.** A case result names its region and the vendor that gated
it; a document result names its scope and its own search state. A row with no leg, or with neither
a region nor a scope, is refused: it is a bare string presented as a finding.

**A refusal is not an empty result.** The refusal row carries the product's own code and the check
refuses a zero rendered inside it. `read_outside_scope` folded into "0 documents" tells the reader
the documents do not exist.

**The finder invents no word.** The outcome vocabulary is seven words, **derived** in
`dump-source-state.mjs` from `DOMAIN_STATUSES` (four), `READ_REFUSAL_CODE` (one) and the two
counts named in the product's own counting rule (`searched`, `not-searched`) — so a sixth status
cannot be added by editing a board. Document states are the product's five and reasons its three,
and `reason-not-recorded` is a **state** and never a **reason**: the product's CHECK constraint
refuses it as a stored value, `check.mjs` refuses to let the two lists merge, and one plant proves
it.

**This surface may not call itself "Not built".** `src/domains.mjs` closed that phrase at one
meaning — absent from `DOMAIN_REGISTRY` — and Records search is absent for the opposite reason:
it generates no records, so it has nothing to register. The boards therefore quote the shipped
stub verbatim inside `data-stub="today"`, and `check.mjs` strips the quoted regions and refuses
those words anywhere else. A plant puts them in the design's own voice and is caught.

## The boards

| Board | What it shows |
|---|---|
| Main | At rest: both coverage panels stated **before** any query, the two legs declared, the third noun named as not-a-leg, the shipped stub quoted, and the two register rows this surface answers to |
| Results | One query, two legs: coverage repeated, case and document results each carrying their origin, a refused scope drawn with its code, and a "what was not searched" panel where each reason states its own basis |
| Gaps | The defect drawn as the failure — results with no coverage — beside the closed outcome vocabulary and the three acceptance items |

## Adjudication: the applicant-facing plan review view is ALREADY COVERED

The G-147 row also asks for a determination on the applicant-facing plan review view. **It is
covered, and no new design is owed here.** The citation:

- `_design/smartcity-applicant-precheck/README.md` claims the same plan row in its own header:
  *"Plan rows: OPS-17 G-147 (the applicant-facing plan review view) and G-142 (the Citizen
  lens)."* Its status is RATIFIED 2026-09-17
  (`_decisions/2026-09-17_design_ratification_all_approved.md`).
- It carries ten artboards of that view: the three-lane Flow with EXISTS/PARTIAL/NEW per step,
  six applicant screens (Main, Reading, Findings, Revised, Submit, Summary), the public Verify
  page in four states, and two city screens (Review, Setup).
- `_design/INDEX.md` describes it as *"the first public function for applicants, on a SmartCity
  page with the city's logo"*.

**So the gap is not coverage, and reporting it as a gap would be a category error.** Records
search is the staff finder behind `work:records`; the applicant view is a public surface on the
Citizen side. Two real gaps do sit adjacent, and neither is this lane's to close:

1. **NOT BUILDABLE.** The same ruling that ratified the precheck deferred the blending question,
   so no service owns the check and no build row can name a repo. That is a buildability gap, not
   a design gap, and it is recorded in that folder's status line.
2. **`lens:citizen` stays uncovered (G-142).** `design-completion-gate.mjs` still reports it,
   deliberately, and the precheck folder says in its own header that it does not cover it. This
   lane does not change that, because the Citizen *nav surface* is a different thing from the
   applicant *function*, and quietly pointing the nav at the precheck folder would mark a surface
   covered that nobody has drawn.

**Compass is deferred and is not drawn anywhere in this folder.** It appears on these boards only
as the top-bar product name in the chrome, which is a shipped string, and as a row in the
`SHELL_HOMES` register that is quoted for citation.

## Held to source

- **The register rows.** `src/shell-homes.mjs` carries
  `Prophecy document search → Work Records search (Not built)` and
  `City document table → Files (Island)`. Both are quoted on Main with the disposition vocabulary
  closed at six. Note what they are: the first is a **retired product's** function, the second is a
  table that already has a home on the Files mount. Neither is a brief for this surface, which is
  why this design is a finder across two homes rather than the city document table moved sideways.
- **The stub.** Every quoted string — the pill, the heading, the body, the basis, the top-bar
  placeholder, the aria-label, the note id and the disabled flag — is parsed out of
  `web/index.html` at the ref. A copy change in the product makes the design fail rather than
  quietly go stale.
- **The third noun.** `placeholder="Search records, parcels, cases"` is the product's own string
  and only two of its three nouns are legs of this finder. The chrome is quoted unchanged and the
  question is carried as an acceptance item instead of a word being removed from the chrome
  without a decision.
- **No person is named anywhere.** The person scan covers every cell, and a plant puts an
  initialised name in one to prove the scan fires.

## Inspected, not measurable from here

- **The scope a staff search reads.** `SMART_FILE_SCOPE_TYPES` is closed at four
  (`jurisdiction`, `tenant`, `site`, `instrument`) and `searchDocuments` takes one explicitly.
  Which scope a city staff search resolves from its session, and what it does when it holds more
  than one, is a build decision owed before launch. The design draws the outcome and names the
  item rather than picking a scope.
- **The transport to the corpus.** Files is a mount on a separate origin
  (`DEFAULT_SMART_FILES_ORIGIN`). Whether a search endpoint may be called from this page at all is
  an infrastructure decision this design cannot make. Drawn as an acceptance item.
- **Real corpus counts.** Not obtainable at a ref. The board says so, in the panel, in a badge, and
  in a basis line.

## Open, not ruled

- The three acceptance items above: the third noun in the chrome, the corpus transport, and the
  scope resolution.
- Whether Records search gets a nav badge once built, and if so which of the six closed
  disposition words it is. The design leaves the nav showing today's shipped value and says so in
  the footer rather than inventing a badge.
- Whether the two legs should be independently switchable (cases only, documents only). The design
  draws them always both stated; a switch would have to keep the coverage panel whole.

## Instruments

- **`check.mjs`** — 56 self-tests, both directions, plus a clean fixture that must pass. It refuses
  a verdict (exit 2) if any of eighteen predicates matched nothing, and it names which.
- **`violate.mjs`** — 24 plants into the real boards, restored afterwards, with the restoration
  itself asserted. **Its first run found two real instrument defects**: the counting-rule predicate
  was satisfied by the panel's prose basis rather than by its structured element, so stripping the
  element passed; and the person scan could not see the result rows, because their cells did not
  carry the cell style the scan reads. Both are fixed, and both plants now fire.
- **`probe.mjs`** — writes the artifact the close cites, `_inbox/2026-09-18_g147-record-search_probe.json`:
  the clean run with its matched-input line, the mutation result, four named plants captured
  verbatim at exit 1, and the completion gate measured **with this folder's declaration present and
  absent** — so the claim that this design clears `work:records` at R4 is shown by flipping the
  declaration, not by recalling an earlier run. It is an instrument probe, and says so in its own
  `instrument` field: Records search is not built, so there is no deployed surface to measure.
