---
date: 2026-09-13
agent: planner
repo: docs
session_type: planning
memory_graded: [dispatches-are-compiled-not-authored:HELPED, canon-gate-hook-is-live:HELPED, agent-prompts-in-doc-repo-need-the-full-compiled-header:HELPED, text-search-cannot-answer-structural-questions:HELPED, doc-repo-concurrent-commit-hazard:HELPED]
rolled_up: false
snapshot: >
  doc_repo main, integration seat, P:/doc_repo. Session continues the 2026-09-12 Cotality
  thread (committed 6d84cb5c). origin/main moved repeatedly during the session
  (2225a8c2 -> 6d84cb5c -> 933f68b8 -> 9eef6a6c) from other seats working in the SAME
  physical tree. Product repos read at origin/main WITHOUT checkout: legacy-design-tools
  31d181c2, hauska-engine 112bccb, hauska-factory 97b9387. Factory store read read-only
  via FACTORY_DATABASE_URL_RO. Cotality MCP eval channel probed live 2026-09-12.
  Uncommitted at time of writing: OPS-16 A-136/A-145/P-176/P-181, three P-181 missions,
  three compiled dispatches, two instruments, two catalog artifacts, three _inbox
  analyses, this capture.
---

# Scale, the source inventory that was already on disk, and the pre-bake audit

## What was done

The operator asked how one person onboards the country when Central Texas took weeks.
Four rounds of analysis, two of which the operator corrected and one of which an
adversarial review demolished. Ended with the real bottleneck named, two instruments
built, and three read-only lanes dispatched.

Written, none committed: `_inbox/2026-09-13_national_scale_working_notes.md` (wrong in
ways preserved below), its adversarial review, `_inbox/2026-09-13_tx_source_inventory_and_acquisition_process.md`,
`scripts/tx-cad-source-inventory.mjs`, `scripts/tx-source-truth.mjs`,
`_catalog/tx_cad_source_inventory.json`, `_catalog/tx_source_truth.json`, OPS-16 A-136 /
P-176 (Cotality bake-off) and A-145 / P-181 (assumption register), three mission files,
three compiled dispatches.

## What was learned (changes to ground truth)

**Throughput was solved and nobody was using the number.** `OPS-14` line 53: the wave
machinery "acquired 177 counties in two days," and in the same sentence, its count-based
gates could not see the Harris truncation class. "Proven for throughput, not for
completeness." Every estimate of years-of-grinding in this session, mine included, was
wrong about a thing already measured.

**The source question was answered on disk five weeks ago and never aggregated.** 254
`_inbox/t6_cad_probe_<fips>.json` artifacts from the 2026-08-05 statewide batch; only
tranche 1 (35) was ever transformed into a registry. Aggregated now: **176 rest-reachable,
19 rest-unproven, 58 rest-absent, 1 rest-unmeasured-network**, 9,198,711 parcels countable
at source.

**93 percent of the counties that publish are on one platform.** 182 of 195 endpoints are
`services*.arcgis.com`. Not 21 vendors. One self-describing REST API, which makes
per-county work a registry row rather than an integration, and the probe artifacts already
carry the fields that row needs.

**A second corpus, also unaggregated: 165 `L2_WAVE*` geometry-ingest runs**, 162 pass, 3
fail. Joined with the probes by `tx-source-truth.mjs`: **162 pass / 89 NEVER RUN / 3
fail**. The 89 are the largest actionable number in the state and nobody was tracking
them. The 3 failures (48213 Henderson, 48291 Liberty, 48499 Wood, all dry-run exit 1) were
never revisited.

**Harris is not absent, it landed.** 1,523,640 of 1,523,640 parcel-node atoms written and
verified 2026-08-14, geometry rescore 99.9999 percent. The first apply wrote zero because
the writer lease expired during a 58-minute plan phase that had no heartbeat; the retry
with a 4-hour TTL landed it.

**The Harris truncation class, and why it is the model for everything here.** Harris's
StratMap archive holds two shapefiles, east and west. The loader took the first. From
`_inbox/2026-08-09_L2_W3R2_RESUME_REPORT.md`: "no count-based check can detect it. Dry,
apply, apply2, and SQL all agree at 564,948 because all four read the same truncated
input," and the sizing probe's own estimate was 536,512, exactly the east-only count. Four
checks, one upstream, all agreed, all wrong. The fix was an independent derivation: a sweep
reading each ZIP's central directory. It swept 254 counties and found **exactly one**
multi-shapefile county. Class found, swept, proven singular, closed.

**Four of ten known bake assumptions are already fixed and fail closed**, verified at
`legacy-design-tools` origin/main: `shapefile-discover.ts` (all `.shp` discovered, N>1
refuses without `--multi-shp=concat`), `assertTexasWgs84Bbox` (`parse.ts:185`, envelope
AND a per-feature grid-cell ceiling), `isNullPlaceholderFeature` (`parse.ts:455`, declines
only on the conjunction of impossible coordinates and no identity), `assertDeclineCeiling`
(`parse.ts:327`, fires mid-stream, "should die on the eleventh, not after loading a garbage
county"). **Planning against the historical defect list would have re-fixed solved problems
and missed what is open.**

**Seven of ten known assumptions fail SILENTLY.** Only the Texas bbox assertion fails
loud. The controls that exist are on the assumption that was already safe.

**A governance finding the operator should see directly.**
`onboarding_defect_class_backlog.md`: BELL-COST-GATE-BREACH declined at $333.34 against
the $200 hard kill, then "CLEARED 2026-08-05 — engine #250 recalibrated cost model ...
removed stale $2/1k-calls term ... $1.15 PASS." Commitment #3's hard-kill was satisfied by
retuning the instrument, and the deleted term is the one a national acquisition consists
of. Not part of any row opened here.

**Two planner errors worth keeping, because both were caught by someone else.** First,
`TX-LANDING-ABSENT` = 217 means NOT INGESTED, and I reasoned as though it meant NO SOURCE
EXISTS; the operator caught it. Second, I classified Harris "absent at source" from
`service_url: null` while the same artifact carried DNS failures from the probe network
(unmeasured, not absent) and untested third-party repackages. `tx-source-truth.mjs` now
encodes the Harris case as a self-test so the classifier cannot regress.

**The adversarial review returned seven confirmed defects against my own working notes,**
including that the $0.24-per-county figure traces to a setback-depth pass over roughly
5,769 parcels rather than a county bake, that I called Cotality a "free" QA oracle having
priced it at $0.15/call in my own document the same session, and that the novelty registry
I proposed as a new idea already exists at `_catalog/tx_cad_source_registry.json`, recorded
Hays on 2026-08-09, and is dormant.

**Cotality, carried from 2026-09-12 and unchanged:** REST dead, MCP eval channel live since
2026-07-14 and never probed until now, 11 scope-gated tools, `pd-get_property_characteristics`
returns 84 leaf fields in one call, the `pr-` trend tools are geography-keyed rather than
parcel-keyed, and the money rails are not on the live channel.

**The canon gate is working and it blocked me three times in a row**, each time correctly:
a hand-assembled prompt missing contract markers, then a paraphrased rather than verbatim
FLEET MEMORY block ("the hash marker is not the install"), then a no-nesting clause present
but not on the first line. No override was used. Hook-shaped controls remain the only ones
in this repo with a good base rate.

## What is still open — the full thread list

Listed so nothing from this conversation is lost, including whatever the operator half
remembered.

1. **P-176 Cotality bake-off.** Compiled, ready to hand-carry, never dispatched. 60 parcels,
   180 calls against a documented-but-unmeasured 100/day eval ceiling.
2. **P-181 assumption register.** Three lanes dispatched this session, results pending.
3. **ADR-032 rights envelope.** Proposed, not accepted. Four fields unknown until the
   Cotality commercial agreement is read.
4. **The accrual-trigger asymmetry.** ICC accrues on reference, Cotality on acquisition;
   one meter placement cannot serve both. In ADR-032, unbuilt.
5. **The ICC adoption table.** Jurisdiction to code edition to effective date. Nobody sells
   it, plan-review deliberately refuses to infer it, and it is what makes ICC content apply
   to a parcel. **Identified as an unbuilt asset and never carded.**
6. **Rails v3 / field coverage.** "We need fields for all the data they bring." Discussed,
   designed as promote-to-rail plus companion-with-declared-manifest, never resolved or
   documented. Collides with OPS-21 D5.
7. **The six-phase serving sequence.** Fetch, entitle, meter-gate, mint synchronously,
   serve from the atom, derive asynchronously. Exists only in conversation.
8. **The free-tier inversion.** Zoning and setbacks exist in about ten Texas cities while
   purchased depth would cover 254 counties, so the funnel inverts. Fix identified (widen
   the free tier to the federal layers we already hold statewide), never carded.
9. **The federal-tier national pass.** Terrain, flood, roads, footprints, soils, pipelines
   are uniform in 50 states with zero per-county work. Named repeatedly as the fastest path
   to national coverage. **Never carded.**
10. **The 89 counties with no geometry ingest run**, the 3 failures, the 19 unproven
    endpoints, and the 8 counties flagged `prop_id_bad_rate >= 0.25`.
11. **The Bell cost-gate recalibration**, above.
12. **Harris roads**, excluded by decision 2026-08-17 pending a clipped-PBF extract.
13. **G-17 / G-23 / G-111**, the ICC obligation-meter rows, now load-bearing for two
    sources rather than one.
14. **A peer session's `git reset --hard`** destroyed staged work in a separate checkout at
    `C:\Users\cente\doc_repo`. Nothing of this session's was lost; two checkouts of doc_repo
    exist on this machine and multiple seats commit into `P:\doc_repo` concurrently.

## Suggested canonical doc updates

`MEMORY.md` and `cotality-hit-means-decommission-not-credential`: the blanket extinguish
one-liner is right for the three REST products and wrong for the MCP eval channel, which is
live. Same defect shape as the 2026-08-08 resurfacing, opposite direction.

`00_current_state.md` line 143: qualify "Cotality extinguished" the same way.

`OPS-1_texas_source_registry.md`: point at `_catalog/tx_source_truth.json` as the joined
per-county picture, and record that 219 of the 254 probes were never transformed into
registry rows.

`_catalog/tx_cad_source_registry_coverage_summary.md`: note it covers tranche 1 only and
that the statewide aggregate now exists.

`90_operations/OPS-14`: the "177 counties in two days" figure deserves to be quotable from
somewhere other than a single line of prose in a game-plan doc.

`25b_monetization_provenance_storage_stack.md`: carry the accrual-trigger asymmetry and
point at ADR-032.

## Not done, deliberately

No commit. `00_current_state.md` not regenerated. Three P-181 lanes still running; their
artifacts and closes are not yet read, and verification does not delegate below this seat.
