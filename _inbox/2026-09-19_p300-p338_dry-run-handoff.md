# DRY-RUN HANDOFF — P-300/P-338 setback writer

From: the session that built and released P-300/P-338 (`p300-p338-writer-build`, closed-partial 2026-09-19)
To: the session that will run the per-county dry run
Re: the one item the build lane could not measure — the store counts — and everything you need to run it without re-deriving anything

This is a handoff, not a dispatch. It grants no new scope. The build is DONE and MERGED; the
dry run is the only outstanding measurement, and it needs a read-only store handle that the
build session never had.

---

## 0. The state you inherit (verified, not narrated)

| | |
| --- | --- |
| `hauska-factory` main | `be29575` (squash of the reviewed tree `ef5526d`) |
| factory `ci` on that commit | **success** — test, gate8, ldt-sha-comment-presence, engine-declaration-pin |
| `hauska-setback-corpus` main | `1448586`, tagged `v1.5.0` |
| npm | `@empressaio/setback-corpus@1.5.0` published, `latest` → `1.5.0` |
| this lane's close | `_inbox/2026-09-19_p300-p338-writer-build_close.json` |
| predictions to grade against | `_inbox/2026-09-19_p300-p338-writer-build_dry-run-predictions.json` |
| lease / release evidence | `_inbox/2026-09-19_p300-corpus-publish-and-pin_transcript.txt` |
| the job's real flag contract | `_inbox/2026-09-19_p300-flag-contract-probe.txt` |
| short-circuit, both directions | `_inbox/2026-09-19_p300-short-circuit-probe_{pre,post}-change.json` |

Known-red on `hauska-factory` main and NOT yours to fix: `ldt-pin-staleness` fails identically at
`be29575` (run `35446070978`) and at the parent `ab7618c` (run `35442687258`) — same step, same
reason, same pin `03bb424a`, LDT-side files in its hit list. Do not re-diagnose it; do not read it
as a regression from P-300.

---

## 1. The one job

Read the six program counties' setback rails with the merged writer, **dry-run only**, and report
the counts beside the filed predictions. No writes, no `--apply`, anywhere.

The population is 58,339 parcels (P-326's store measurement of 2026-09-17T23:02Z): parcels whose
five setback rails all carry `kind = 'unaccounted'`. 48,829 have no district on file; 9,510 do.

---

## 2. Before you start

1. **Get a read-only DSN.** `FACTORY_DATABASE_URL_RO` (and `PRODUCTION_NEONDB_URL`) are UNSET in
   this machine's shell and there is no `.env` in either checkout; the `hauska-cortex` MCP
   namespace is in an error state. Ask for the handle explicitly. Do not substitute a read-write
   DSN, and do not infer counts from the prediction because the store is unreachable.
2. **Work from a worktree at `be29575`.** A stale checkout runs the pre-fix writer and will
   reproduce the short-circuit as if it were real. Confirm the pin: the writer should report
   corpus version `1.5.0`.
3. **Announce the heavy scan BEFORE starting** — the AGENT CONTRACT (§4) allows at most ONE heavy
   PostGIS/full-table scan at a time across all lanes, and requires the target and expected
   duration in your progress artifact, confirmed after. P-326's own run took ~2m30s, so announce
   roughly 3 minutes for the read plus the writer pass per county.
4. **Register the watch** if you run this as a long runner: `_catalog/watch_registry/<id>.json`
   with a quiet budget, before you start (§5). Stalls are detected by progress, never by process
   existence.
5. **Everything is exit-bounded.** One-shot queries and bounded polls. No `tail -f`, no watchers.

---

## 3. The run

```
# 1. the census instrument (takes and releases the heavy-scan lease itself; read-only session,
#    SET default_transaction_read_only = on, read back with SHOW)
node scripts/p326/setback-residual-composition.mjs --counties 48021,48055,48209,48309,48453,48491

# 2. the writer's own dry run per county, under the same heavy-scan scope.
#    DRY RUN IS THE DEFAULT: there is no --dry-run flag, and --apply is what writes.
node src/cli.mjs parcel-setback-cells --county=48209

#    or all six in-scope counties in one pass (the deployed template's own default)
node src/cli.mjs parcel-setback-cells

#    or one city, the job's other scope
node src/cli.mjs parcel-setback-cells --city=Bastrop
```

**Do not pass `--dry-run`.** The merged artifacts briefly carried
`--county <fips> --dry-run`, and that form REFUSES: `--dry-run` is not in this job's
`KNOWN_FLAGS`, and since P-229 the job refuses any unrecognized argument *before* it opens a
store. The known flags are `--city`, `--county`, `--page-size` (default 2000), `--apply`.
Parsing the tokens after the verb is also required (including the verb token refuses). Verified
by calling the job's own exported parser without a store —
`_inbox/2026-09-19_p300-flag-contract-probe.txt` has the verbatim output and a 15-line
reproduction recipe.

The writer's dry run prints the count buckets the predictions name: `districtMissRefused`,
`zoningNotAcquired` (class a), `jurisdictionDefault` (class b served as a value),
`defaultRowMissing` (class b with no coded row), `classCAbsence`, `absentVerified`, and
`unaccounted`. `counts.absentVerified` is expected to be **0** from the ordinary run: the only
absence the writer is allowed to write is the class (c) shape, which arrives through
`classCAbsence`; a nonzero `absentVerified` is a defect, not a result.

Williamson `48491` is **dry-run only** (P-350). Never `--apply`.

---

## 4. What you should see (filed before the run, restated from measured artifacts)

Project level:

| outcome | expected | counting rule |
| --- | --- | --- |
| district-miss refusals | **9,510** | every parcel carrying a district on file. **EXACT** (P-326 measured it) |
| — of which, city has a table but no row | 8,484 | |
| — of which, city has no table at all | 1,026 | these are the short-circuit fix showing up (see §5) |
| class (a) refused, `zoningNotAcquired` | **44,112** | district-less parcels in a city that zones |
| class (b) served as a value | **1,327** | Gholson only (see §5.3 — Thrall is NOT coded) |
| class (b) row not coded, stays `unaccounted` | **487** | Thrall, counted as `defaultRowMissing` |
| class (c) `absent-verified` | **195** | the one earned absence |
| still unclassified, stays `unaccounted` | **3,195** | never guessed into a class |
| sum check | 44,112 + 1,327 + 195 + 3,195 = **48,829** | ✓ |

Per county:

| fips | county | population | district-miss (EXACT) | class (a) | (b) | (c) | unclassified |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 48021 | Bastrop | 1,313 | 1,295 | 1,984 | 0 | 0 | 245 |
| 48055 | Caldwell | 951 | 402 | 4,148 | 0 | 0 | 0 |
| 48209 | Hays | 8,283 | 3,669 | 5,141 | 0 | 195 | 0 |
| 48309 | McLennan | 8,610 | 109 | 4,715 | 840 | 0 | 2,946 |
| 48453 | Travis | 33,883 | 1,743 | 32,371 | 0 | 0 | 245 |
| 48491 | Williamson | 5,299 | 2,292 | 2,521 | 487 | 0 | 4 |

**Read the class columns as UPPER BOUNDS, and the district-miss column as exact.** The committed
classification table carries a county LIST, not a per-county split, so a six-city group spanning
counties is allocated to every county it names — over by 7,013 parcels, itemised in
`perCounty.multiCountyCities` of the predictions artifact. The over-count is exactly the class (a)
column over by 6,768 plus the unclassified column over by 245 (Webberville counted in both Bastrop
and Travis). Class (b) and (c) are exact because every such city lies in one county. The
population column is exact.

**A corrected number, so you do not re-derive from the bad copy.** The close artifact briefly
carried a per-county district-miss table reading Hays `2,643`, summing to 8,484 beside its own
total of 9,510. That was P-326's legacy `classes['district-miss']` census bucket, not
`districtOnFile`; the difference is Hays's 1,026 no-table-city parcels that carry a district. It
is corrected to `3,669` in the close, with the correction and its cause recorded there. If you
find `2,643` anywhere else, it is the stale copy.

---

## 5. How to read a difference

1. **The 1,026-parcel movement is the fix, not an error.** Pre-fix, the short-circuit wrote the
   1,026 district-carrying parcels of no-table cities the city's *no-table* answer. Post-fix they
   are ruling 6's district-miss refusals. So a live district-miss count ABOVE the pre-fix store
   census is expected, and the 58,339 total must not move.
2. **Do not add 1,026 to 9,510.** The 1,026 are already inside the 9,510 (49,855 no-table-city
   parcels + 8,484 table-city parcels = 58,339). The dispatch's framing can be read either way;
   the arithmetic only works one way.
3. **Thrall, TX is class (b) with no coded row.** The dispatch said "Gholson 840 if it is the only
   one". It is not: there are two class (b) cities. Gholson (840) is served as a value; Thrall's
   487 stay `unaccounted` and are counted as `defaultRowMissing`. Expect 840, not 1,327, served as
   values today.
4. **Class (a) 45,138 vs 44,112 is a definition, not a discrepancy.** The 40-city roll-up counts
   every parcel in a class (a) city; P-300 counts only that city's district-less parcels. The
   1,026 difference is the same 1,026 as §5.1.
5. **A result outside the band is a finding either way.** Report what IS. Never tune to the
   expected number, and never report the prediction as a measured count.

---

## 6. Traps that will cost you time (each one cost this lane time)

- **An unrecognized flag REFUSES; a flag the job does not know is not ignored.** That is P-229's
  fix and it is why the wrong `--dry-run` in these artifacts was a no-op only in the sense that
  it would have refused loudly. The silent version of the same mistake really happened: on a
  production apply, `--county=48209` was accepted and discarded, so the run covered every county
  instead of the one asked for. Read `KNOWN_FLAGS` rather than assuming a conventional flag name.
- **Do not trust the cloudbuild YAML's header comment for scope.** It still says "Hays (48209) is
  structurally excluded (P-145 gate) -- there is no flag that can reach it", while the source it
  ships with hardcodes `IN_SCOPE_COUNTIES` to all six counties, Hays included, and records the
  P-200 admission. The YAML also still pins `_CONTRACT_VERSION: 1.30.0` with older engine/LDT
  SHAs. Read the source; if the deployed generator matters to you, inspect it rather than the
  comment.
- **PowerShell `>` and `Out-File` write UTF-16 with a BOM**, and JSON artifacts written that way
  are unreadable to `JSON.parse` and to the close gate. Use
  `[System.IO.File]::WriteAllText(path, text, (New-Object System.Text.UTF8Encoding($false)))`.
- **`git stash push -- src test scripts` does NOT make a tree pre-change** if `package.json` or
  the lockfile sit outside those paths: the stash aborts and the next command silently runs
  against the NEW code. Stash by explicit filename, and assert the corpus version in the output
  so a wrong-side transcript cannot pass unnoticed.
- **Do not try to produce pre-change evidence by running a post-change test file against
  pre-change source** — it dies at import (`SyntaxError: does not provide an export named ...`),
  which proves nothing about the defect. Use a probe that imports only APIs common to both
  versions (`scripts/p300-short-circuit-probe.mjs` is that probe, and it prints its own corpus
  version).
- **P-326's census does not know the new cell shapes.** It classifies by `basis.method` /
  `codeClass` and reads P-300's refusal basis as *unclassified*. That blind spot is pinned by a
  test in `hauska-factory test/setback-residual-composition.test.mjs` rather than repaired here,
  because an instrument's exclusion set is part of its contract. If you extend the census, that
  is a finding about the contract, not a silent widening.
- **`test/p2-juris-57p01.test.mjs` "multiple lease heartbeats" is a known flake** (1 of 3 isolated
  runs). Unrelated to setbacks.

---

## 7. What to file

The measurement is a **new lane's** work, not an edit to this lane's close: this lane's close
records the dry run as `UNMEASURED`, and rewriting it after the fact would destroy the distinction
between what was measured at close and what was measured later. File a new artifact with the
counts and their counting rules, and cite:

- the six per-county rows beside the table in §4, per county, with the same column meanings;
- the lease announcement and its confirmation (target, duration);
- the corpus version the writer reported;
- every difference from §4, reconciled or declared a finding — never rounded off;
- the DSN's identity and a statement that the session was read-only (`SHOW
  default_transaction_read_only` read back as `on`).

If you cannot get a store handle, file nothing and say so. `UNMEASURED` is a legitimate result;
a number inferred from a prediction is not.

---

## 8. Do not

- Do not `--apply`, in Williamson or anywhere.
- Do not write to any store.
- Do not modify the merged writer to make a count line up. A disagreement between the store and
  §4 is the finding, and it is worth more than a green number.
- Do not merge anything, publish anything, or deploy anything. The release is closed.
- Do not re-open the fixed short-circuit or the refused/absent cell shapes: both are merged, green
  on `ci`, and shown in both directions in the transcripts cited in §0.
