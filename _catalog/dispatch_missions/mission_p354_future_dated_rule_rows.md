## Mission — P-354: a rule adopted but not yet in effect is served by ruling, and every surface says so

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-setback-corpus`, `hauska-factory`,
`hauska-map` and `legacy-design-tools`, one PR per repo, each branched from that repo's current
`origin/main` with the SHA declared. You do not merge, publish, deploy or write any store; the
integration seat does all four. Any doc_repo change is handed back as a diff in your close.

### The ruling you are implementing

Operator, 2026-09-18 (A-218, amending ruling 19 of `_decisions/2026-09-18_phase0_closeout_rulings.md`):
**Georgetown is served from its rewritten code, adopted 2026-08-11, ahead of its 2026-11-01 effective
date** ("anyone using our site should be planning for the new codes"). What the ruling requires is
honesty on the surface: a customer reading a Georgetown setback must be told the rule was adopted on
2026-08-11 and takes effect on 2026-11-01. Today the card says "Setback rule vintage unknown", which
is false: the dates are known, they are just not in a field any code reads.

### What is wrong, measured 2026-09-18 (`_inbox/2026-09-18_georgetown_rewrite_served_FINDING.md`)

- `georgetown-tx.json` in `hauska-setback-corpus` (and LDT's adapter copy) carries two vintages in one
  table: 9 current-code districts (TF, TH, MF-1, MF-2, CN, C-1, C-3, OF, IN) and 8 rows from the
  adopted rewrite (RE, RT, RS, RM merged 2026-09-07; AG, MH, PF, MU-DT added by P-258 lane-c in 1.4.0).
  The table has no table-level `effectiveDate`, and the rows carry their dates only in prose (`note`,
  provenance quotes).
- The factory setback writer (`src/lib/setback-writer/setback-table-router.mjs`) reads a table-level
  date only, so every Georgetown cell is written with `dateBasis: "unreadable"`. 35,038 of 38,825
  Georgetown `setbackFrontFt` value cells carry a rewrite row (RS 34,011).
- The card for `48491:R000009` (RS) serves front 20 / side 5 / rear 10 / corner 15 citing the rewrite
  PDF (`Unified Development Code 8.11.2026.pdf`) with "Setback rule vintage unknown — the rule is
  served undated, not as current."

### What to build

1. **Rows carry their own dates.** In `hauska-setback-corpus`, a row may carry `adoptedDate` and
   `effectiveDate` (ISO, read at source, never inferred) that override the table's. Fill them for the
   8 Georgetown rewrite rows from the rewrite's own Section 1.09 and the Council adoption; the 9
   current-code rows carry the current code's date if the source states one, else nothing (the
   existing unreadable path). The schema and the corpus gate accept the new fields; a date that is not
   strict ISO fails the gate. Bump the minor version; the seat publishes.
2. **The writer carries them into the cell.** The factory setback writer writes the row's dates into
   the cell (row date over table date) with a basis naming which it read. A row whose effective date is
   in the future is written as a `value` only where a ruling admits it, from ONE declared list
   (Georgetown, A-218); any other future-dated row writes a declared refusal naming its effective date.
   Never a silent value, and never "unreadable" when a date was read.
3. **Every surface names both dates.** hauska-map's citation-vintage module
   (`api/_lib/setback-citation-vintage.ts`, from P-270) and LDT's
   (`buildableEnvelope/setbackCitationVintage.ts`) render a future-effective row as "adopted
   2026-08-11, takes effect 2026-11-01", as its own state beside `read` and the three `unreadable-*`
   states. It is never "vintage unknown", and it is never printed as if already in force. Find every
   path that composes the citation sentence (P-270 found four in hauska-map and three in LDT) and say
   which you changed.
4. **Count, do not assume.** Read-only (lease if heavy): how many cells in the six counties carry a row
   whose effective date is in the future, by jurisdiction. Georgetown should be most or all of it; any
   other city is a finding for the seat, not something to rule on yourself.

### Verify by violation

Pre-register your falsifiers before you run them, and state what result would prove each wrong.

- Revert-and-run: the pre-change writer writes `dateBasis: "unreadable"` for a Georgetown RS row; the
  post-change writer writes both dates with the row as its basis.
- A future-dated row from a jurisdiction NOT on the ruled list writes a refusal naming its date, never
  a value.
- The renderer: a future-effective row reads "adopted ..., takes effect ..."; a current dated row reads
  exactly as today (byte-identical disclosure); an undated row still reads the P-270 declaration.
- A current-code Georgetown district (C-3) keeps its present citation and is not relabelled.
- Live, after the seat publishes, deploys and re-runs the writer for 48491: the card for
  `48491:R000009` names both dates. You cannot deploy, so name the exact probe and its expected result.

### The three-question gate

Answer in your close: what executes the ruled list and the rendering, what triggers them, what fails
when a future-dated row is served without its dates, and what bypasses them (the MCP depth response,
the PDF, the bake's own citation text).

### Constraints

- No store writes, no publishes, no deploys, no merges.
- County 48491 (Williamson): the seat re-runs the writer after merge; you do not touch its store. It
  republishes only after P-327, P-333 and P-351 (P-350).
- San Marcos is NOT in scope: its half of ruling 19 (the coverage re-check before 1.4.0 replaces its
  1.1.0 legacy rows) is unchanged and is the seat's.
- `hauska-map` main now carries P-332 (#419, merged 2026-09-18) and P-270's vintage module; branch
  from current `origin/main`.

### Close

Declare: the start commit and PR for each repo, the fields added and the rows filled with their source
quotes, every citation-composing path you found and which you changed, the future-dated population
with its snapshot, the falsifiers with both directions shown, the three-question gate answers, and
`leave_behind`.
