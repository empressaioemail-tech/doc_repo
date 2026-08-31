# Mission — regenerate the alias seed, because the generator is real but untracked

## Why this card exists

Two things are true about `_catalog/2026-08-30_breadth_place_alias_seed.json` and they
pull in opposite directions.

It is tracked canon. Four operator rulings (`_decisions/2026-08-31_alias_seed_four_rulings.md`)
dispose of 63 of its 99 `needs-human` rows by rule, and a fifth ruling carves four rows
back out because the seed grades them wrong. The carve-out is authoritative **only until
the seed is regenerated**, which means the correction currently lives in a decision record
rather than in the artifact a consumer reads.

Its generator is not tracked. It is `build_alias.py`, and it survives in the session
scratchpad of the agent that wrote it. Cited and untracked is the worst state this
operation recognises. The next agent who needs to regenerate will find a 3,152-line JSON
with no reproducible origin and will hand-patch it, which is the failure this card exists
to prevent.

So the first work item is not the fix. It is making the generator a tracked, runnable
thing. The fix is item three.

## What already exists — build into it, do not rebuild

**The generator, recovered and proven deterministic.**

| artifact | location |
|---|---|
| `build_alias.py` (343 lines) | `C:\Users\cente\AppData\Local\Temp\claude\p--doc-repo\fee8e111-788c-4d0e-bd16-5510b77df32c\scratchpad\` |
| `gen_md.py` (517 lines), writes `_inbox/2026-08-30_alias_seed_findings.md` | same directory |
| `build_sheet.py` (24,883 bytes), writes `_inbox/2026-08-31_alias_confirm_sheet.md` | same directory |
| `master_raw.tsv` (226 lines), the store enumeration | same directory |
| `adjacency.txt` (34 lines), the PostGIS county adjacency | same directory |

That directory is an ephemeral session scratchpad. Treat it as a recovery source that
may vanish, not as a home.

It was re-run in an isolated copy against the same two input files on 2026-08-31 and
reproduced the tracked seed **byte for byte**, sha256
`7f384d0dcbeb1eeb8c47b7e51732871fb5a07ae26e5360dd09fc42dacd685394` on both sides, 225 rows,
33 certain / 93 likely / 99 needs-human. The generator is intact and the regeneration is
deterministic from files. **No store connection is needed to regenerate.**

**The downstream chain, already tracked, already on `hauska-factory` main.**

`sql/p2-juris/_generate_values.mjs` reads the seed JSON and writes `sql/p2-juris/_alias_seed.sql`
as a CTE-ready `VALUES` block. `sql/p2-juris/_compose_03_04.mjs` inlines that into
`sql/p2-juris/04_alias_reconcile.sql`. Those three files exist in roughly ten property-seat
worktrees; `_alias_seed.sql` was last touched at `a99112f`, which is contained in
`origin/main`. **Do not write a second JSON-to-SQL converter.** After the seed changes,
`node sql/p2-juris/_generate_values.mjs` regenerates `_roster_six_touch.sql`,
`_alias_seed.sql`, `_file_side_counts.json` and the composed `03`/`04` in one shot.

## The bug is not the hyphen, and that changes the fix

The rulings record the cause as "an exact-name lookup missing a hyphenated name." That is
close but it points at the wrong mechanism, and building to it produces the wrong fix.

`build_alias.py` normalises with `nk()`, which strips every non-alphanumeric character.
`nk("Bruceville-Eddy")` is `brucevilleeddy` and `nk("lacy_lakeview")` is `lacylakeview`.
The hyphen is already handled. The proof is in the seed itself: `breadth_48309_lacy_lakeview`
resolves cleanly to Lacy-Lakeview `40168`, graded `certain` / `roster-exact`.

The real mechanism is a **half-name**. A hyphenated roster name is a compound of two
component names, and CAD situs carries one component. `eddy` and `bruceville` each name one
half of `Bruceville-Eddy`, and no whole-key index can ever match a half. Both fell through
to the postal bucket and were graded `unincorporated-place-no-place-fips`; `brucevill` and
`brucville` then attached to `bruceville` as its cluster head and inherited
`misspelling-of-unincorporated-place`.

**It is a class, and the class is small and bounded.** The roster carries 1,223 incorporated
places and exactly **five** hyphenated names:

| name | place_fips | parent | all_county_fips | halves |
|---|---|---|---|---|
| Bruceville-Eddy | 10828 | 48309 | 48145, 48309 | Bruceville, Eddy |
| Lacy-Lakeview | 40168 | 48309 | 48309 | Lacy, Lakeview |
| Little River-Academy | 43066 | 48027 | 48027 | Little River, Academy |
| McLendon-Chisholm | 45804 | 48397 | 48397 | McLendon, Chisholm |
| Old River-Winfree | 53824 | 48071 | 48071, 48291 | Old River, Winfree |

Two of the five sit in the six counties, both in McLennan 48309. The other three are
outside the current slice and will be reached when the Factory drains Texas, which is why
the fix is built for the class and not for the row.

One half collides: `Lakeview` is also roster place `40888`, but that is in Hall County
48191 and holds no territory in 48309. A component lookup **scoped to the filing county**
was checked against all five names across every county each holds territory in, and returns
exactly one candidate every time. Zero collisions statewide on this class.

## What to build

1. **Give the generator a tracked home and run it there.** Recover `build_alias.py`,
   `gen_md.py`, `build_sheet.py`, `master_raw.tsv` and `adjacency.txt` from the scratchpad
   above and commit them into a repository you own. Recommendation: `sql/p2-juris/`
   in `hauska-factory`, next to `_generate_values.mjs`, because that is where the only
   executable consumer already lives and doc_repo is not a code home. If you place them
   elsewhere, name the alternative you rejected and why. Record the recovery source path in
   the commit. Replace the hardcoded `SCR` scratchpad constant with a path relative to the
   file, so the next run does not depend on a session directory that no longer exists.

2. **Prove reproduction before changing anything.** Run the recovered generator against the
   unmodified `master_raw.tsv` and `adjacency.txt` and require sha256
   `7f384d0dcbeb1eeb8c47b7e51732871fb5a07ae26e5360dd09fc42dacd685394` on the output. If it
   does not reproduce, stop. A generator that does not reproduce the artifact it claims to
   have produced cannot be trusted to produce the next one, and the divergence is the
   finding.

3. **Fix the class: a county-scoped component index.** Add a third index over the
   hyphen-separated components of roster names, consulted **only** after both the primary
   `name` index and the `full_name` index miss, and accepted **only** when exactly one
   candidate holds territory in the filing county (`parent_county_fips` equal, or the FIPS
   present in `all_county_fips`). More than one county-scoped candidate refuses and leaves
   the row `needs-human`. This mirrors the discipline the `full_name` index already uses,
   which is there because it caught `bastrop-city-tx` being graded unincorporated.

4. **A component match is never `certain`, and it needs its own `kind`.** The existing
   `certain` rule is an exact name match with nothing stripped. A component match is not
   that, so it grades `likely` at most, the same downgrade `full_name` matches already take.
   Do **not** reuse `roster-exact` for it. A prototype that reused `roster-exact` produced
   rows whose reason column reads "exact roster name, county agrees" for a half-name match,
   which misdescribes the derivation to the operator reading the confirm sheet. Introduce
   `roster-component`, and have the note name which component matched and which compound
   name it belongs to.

5. **Regenerate the seed, then the two derived documents, then the SQL.** Order matters.
   Write `_catalog/2026-08-30_breadth_place_alias_seed.json` from the generator. Re-run
   `gen_md.py` and `build_sheet.py` so `_inbox/2026-08-30_alias_seed_findings.md` and
   `_inbox/2026-08-31_alias_confirm_sheet.md` stop describing a file that no longer exists.
   The confirm sheet pins the old sha256 in its provenance table and that pin is now the
   only place the stale hash survives; it must move. Then run
   `node sql/p2-juris/_generate_values.mjs` in the Factory worktree to refresh
   `_alias_seed.sql`, `_file_side_counts.json` and the composed `04_alias_reconcile.sql`.

6. **The 36-row residue: name the consumer before authoring a mapping.** The residue is
   23 `c-undecidable`, 10 `unresolved`, 2 `county-level-key` and 1 `b-cad-error`, 2,133
   parcels, enumerated row by row in `_inbox/2026-08-31_ctx_alias_seed_worksheet.md`. Do not
   re-enumerate it and do not adjudicate it as a block. For each row, state what changes
   downstream if it stays `unresolved`. Where nothing changes, leave it `unresolved` and
   record that as the disposition. `breadth_*` is demoted to name normalisation and
   containment is the jurisdiction derivation, so a mapping with no consumer is a fabricated
   claim carrying no benefit. Three sub-cases are already settled by evidence and are not
   yours to reopen:

   - The 2 `county-level-key` rows carry **zero** parcels and 40,987 and 28,787 road-node
     atoms. They need a county binding, never a place alias. A naive roster lookup sends
     `hays` to Hays city and `caldwell` to Caldwell city in Burleson County, and both are
     wrong.
   - `breadth_48055_harwood` (456 parcels) is a **roster defect**, not an alias question.
     Roster place `32684` Harwood has `parent_county_fips: null` and no `all_county_fips`,
     one of exactly 9 such rows (Coyote Flats, Draper, Harwood, Hideaway, Hillcrest village,
     New London, Pecos, Post Oak Bend City, Road Runner), verified in
     `_catalog/texas_roster_v1.json` this session. Adjacency cannot be tested on a row with
     no county. Fix belongs in the roster; file it there and leave the alias row alone.
   - `breadth_48021_waelder` (62 parcels, `b-cad-error`) is a **lead for P2-JURIS, not
     evidence**. `breadth_*` is CAD situs free text; the Bastrop 6 is a geometric containment
     result. A CAD transcription error and a ring straddle smell identical and are not the
     same finding. Do not conflate them.

## The falsifier, and it is built in

Write this as a check in the generator's repository, and state it before you run it.

**For every seed row graded `unincorporated-place-no-place-fips` or
`misspelling-of-unincorporated-place`, the row's free-text token must not be a component of
any multi-token roster place name holding territory in the filing county.**

That is meaning shaped, not presence shaped. One derivation is the store's free text via
`master_raw.tsv`. The other is the roster's compound names via `texas_roster_v1.json`.
Neither source can satisfy both halves alone, so no sentinel passes it.

It was run in both directions this session against the current seed and against a prototype
of item 3:

```
BEFORE VIOLATION breadth_48309_eddy       parcels=1274 kind=unincorporated-place-no-place-fips -> component of Bruceville-Eddy (10828)
BEFORE VIOLATION breadth_48309_bruceville parcels=1012 kind=unincorporated-place-no-place-fips -> component of Bruceville-Eddy (10828)
BEFORE: violations=2
AFTER:  violations=0
```

It catches the two anchors, not the two misspellings, because a misspelling's token is not
itself a component. That is correct behaviour: fixing the anchor fixes the derivatives,
and the prototype confirmed it.

**The second falsifier: exactly four rows change and nothing else moves.** The prototype
diff against the tracked seed:

| row | parcels | before | after |
|---|---:|---|---|
| `breadth_48309_eddy` | 1,274 | needs-human / unincorporated-place-no-place-fips, no fips | likely / component, `10828` |
| `breadth_48309_bruceville` | 1,012 | needs-human / unincorporated-place-no-place-fips, no fips | likely / component, `10828` |
| `breadth_48309_brucevill` | 1 | needs-human / misspelling-of-unincorporated-place | likely / misspelling-of-roster-place, `10828` |
| `breadth_48309_brucville` | 1 | needs-human / misspelling-of-unincorporated-place | likely / misspelling-of-roster-place, `10828` |

Row count stays 225. `certain` stays 33. `needs-human` moves 99 to 95 and its parcel weight
566,223 to 563,935. R2 moves 25 rows to 23 and R3 moves 15 rows to 13. The 36-row residue is
untouched, because those four sat in the R2 and R3 buckets and not in the residue.

**A fifth changed row is a failure, however plausible it looks.** In particular
`breadth_48309_west` must stay `certain` / `roster-exact` on West `77332`. `West` is both a
standalone McLennan roster place and a component of West Lake Hills `77632` in Travis. If a
component rule that is not county-scoped or not miss-only reaches it, that row flips and the
regeneration has broken a correct answer to fix a wrong one. `breadth_48309_lacy_lakeview`
must likewise stay untouched.

State both falsifiers before running either. A run that produces different numbers than the
four rows above has failed even if the new numbers look better.

## Do not

- Do not hand-patch the seed JSON, the SQL, or the confirm sheet. A hand edit to generated
  data reads as a fix in review and silently drifts at the next regeneration. Everything
  moves through the generator or it does not move.
- Do not fix the instance. `breadth_48309_eddy` is not the card. The class of compound
  roster names is.
- Do not treat this as a hyphen-stripping bug. `nk()` already strips hyphens, and
  Lacy-Lakeview already resolves. Building a hyphen fix leaves the defect in place and
  produces a green report.
- Do not give a CDP a `place_fips`. Cedar Creek, Driftwood, Del Valle, Dale, China Spring,
  Elm Mott, Axtell, Paige and McDade were probed against both the roster and
  `tx_city_boundary` and are absent from both. `unincorporated` is the disposition per
  `_decisions/2026-08-30_unincorporated_is_the_disposition.md`. Item 3 must not become a
  general widening that admits them.
- Do not stamp `not-applicable` on an in-city parcel. Absent, zero and unmeasured are three
  different states and a city-scoped rail that is genuinely absent inside corporate limits is
  a finding, never a shrug.
- Do not treat an alias row as a jurisdiction assertion. It maps a **string** to a **place**.
  It does not establish that those parcels lie inside corporate limits, and CAD situs city is
  a postal city. Bruceville-Eddy is a small city and 2,288 parcels under those two keys is
  almost certainly larger than its incorporated parcel count, exactly the way
  `breadth_48209_kyle` carries 30,923 against a far smaller Kyle. In-limits membership is a
  point-in-polygon question for P2-JURIS.
- Do not re-enumerate the store in this card. Regenerate from the same `master_raw.tsv` and
  `adjacency.txt` so the only delta is the lookup fix. Moving the input and the code in one
  change makes the diff unreadable and the falsifier meaningless. A fresh enumeration is its
  own card.
- Do not widen the rulings. The reversal criteria are explicit: a place shown to be
  incorporated gets another carve-out plus a regeneration, never a silent widening of R2 or
  R3.
- Do not touch any repository other than the registered worktree you open.

## One check, report the answer

`04_alias_reconcile.sql` carries `CDP_SEED_HAS_FIPS`, which counts seed rows where a
forbidden CDP name received a `place_fips`. Its forbidden set is a **hand-maintained list of
nine names** plus a parallel regex on `breadth_value`:

```
'Driftwood','Cedar Creek','Del Valle','Dale','China Spring','Elm Mott','Axtell','Paige','McDade','Mcdade'
OR breadth_value ~* '(driftwood|cedar_creek|del_valle|_dale|china_spring|elm_mott|axtell|paige|mcdade)'
```

The four corrected rows do not trip it, and `UNKNOWN_SEED`'s hardcoded 509,911 is unchanged,
so the regeneration passes both guards. That is the point worth reporting: **neither guard
would have caught the Bruceville-Eddy defect, and neither would catch the next one.** A
hand-declared list is the same shape as `has_writer` and `atomFamilyState`, which drift in
both directions against the thing they claim to describe. Read both guards and say whether
the falsifier above should replace the hand list, sit beside it, or neither. Do not refactor
them on this card.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
(repository, branch, commit) in your first output, and declare the seed sha256 you started
from alongside it. State the falsifier for each check before running it, including your own
checks and not only anything you inherit. A load-bearing claim needs a file-based instrument
that has been shown to fail in both directions; a shell one-liner is not verification.
`leave_behind` named, `none` is valid and cheap. Subagents do not commit; they hand back
artifacts and you read the diff. Verification does not delegate below the lane planner.
