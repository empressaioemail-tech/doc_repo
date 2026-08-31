# Mission — the two P4 quarantines, and the one that could eat Bastrop

Repo `hauska-engine`, plus read-only reconnaissance in `hauska-map`,
`legacy-design-tools` and `hauska-mcp-server`. Open your own registered
worktree. Do not write to a repository you do not own.

Plan rows F-11, F-06, P-60. Gate: P4 of
`_inbox/2026-08-30_ctx_road_to_prod_accurate.md`, which names two quarantines
before anything serves.

## Why this card exists

P4 says two populations must be quarantined before Wave R: 188,103 placeholder
`setback-rule` atoms citing `storage-port-proof/phase-1a`, and McLennan's 65,814
buildable envelopes derived from zero setback rules.

Neither is a data-cleanup card. Both are the same defect: a value on the wire
whose input does not exist. The placeholder cohort cites a smoke-test code
section as its dimensional authority. The McLennan envelopes compute geometry
from a rule that is not on file. An envelope derived without its input is a
fabricated value, and a fabricated value is harder to detect than an absence
because it enters averages, percentages and drawings without announcing itself.

The card exists now, and not later, because of what landed on 2026-08-31.
`_decisions/2026-08-31_bastrop_setbacks_bake_ruling.md` ruled Bastrop city's
setback source authoritative and cleared the four existing artifacts to bake.
**The Bastrop bake and the placeholder quarantine address the same rows by
primary key.** That is established below, not assumed. A quarantine designed
without that fact in front of it is a quarantine that can refuse or suppress the
highest-value real data on the board.

## Where the atoms live, and how that was established

Neon database **`hauska_mcp`**, table **`atoms`**. Not `neondb`. `neondb` holds
the landing tables (`tx_rrc_well`, `tx_building_footprint`, `cad_property`,
`txgio_parcel`); querying it for atoms returns a false absence.

Established by reading the write path and the schema, with no store connection:

- `packages/storage/migrations/005_atoms_storage_port.sql` defines `atoms`:
  `atom_did` primary key, `cid`, `content_hash`, `entity_type`, `entity_id`,
  `jurisdiction_tenant`, `section_number`, `subsection_path`, `source_adapter`,
  `source_url`, `fetched_at`, `body jsonb`, `access_policy`, `created_at`,
  `updated_at`. Unique index `atoms_entity_composite_unique (entity_type,
  entity_id)`. Also `atom_links (from_atom_did, to_atom_did, link_type, context)`
  and `jurisdiction_status`.
- Every engine writer header names the target: `DATABASE_URL=...hauska_mcp...`
  in `packages/engine-core/scripts/write-cad-parcel-roll-county.mjs`,
  `write-building-footprint-county.mjs`, `write-flood-hazard-fact-county.mjs`,
  `bake-property-atom-county.mjs` and the rest.
- Migration `010_drop_access_policy_defaults.sql` removed the
  `DEFAULT 'public-free'` so an omitted policy errors rather than filling in.
- `011_atoms_writer_lease_v2.sql` states plainly that the Factory run ledger
  lives in a **different database**, which is why `run_id` is text with no
  foreign key.

**There is no `status` column, no `state` column and no quarantine column on
`atoms`.** Any quarantine that wants a stored flag needs a migration, and the
consequences of that are item 3.

## Where the placeholder provenance actually sits

Not in `source_adapter`. Read the sampled row in
`_inbox/2026-08-20_store_audit_atom_graph.md:651`: `atom_did`
`did:hauska:setback-rule:48055:18925`, `source_adapter`
`cortex-tier1-snapshot-breadth-bake`, `access_policy` `public-free`. The
placeholder is inside `body`:

- `body->'sourceCodeAtomRef'->>'atomDid'`
- `body->'fieldProvenance'->{front,side,rear}->>'atomDid'`
- `body->>'sourceCitation'` (prose, carries the DID)

all pointing at `did:hauska:code-section:storage-port-proof/phase-1a`.

Consequence: no column predicate finds this cohort. Every quarantine mechanism
that operates on columns is looking in the wrong place, and a
`source_adapter`-based allowlist would pass all 188,103 rows.

## The placeholder has a live re-mint path, and it is a documented deploy step

Answer the bypass question before designing the control, because the answer here
is not "none".

`packages/storage/scripts/write-storage-port-proof.mjs` writes
`did:hauska:code-section:storage-port-proof/phase-1a` into the substrate store as
an idempotent upsert on `atom_did`. It is not dead code. It is
`services/retrieval-api/DEPLOY.md` **step 2**, an operator command in the live
retrieval-api deploy runbook, and the Gate A live verify at DEPLOY.md:167 then
asserts that same DID returns 200 and is findable by `search?q=storage-port-proof`.
It is also exposed as the package script `write-storage-port-proof` in
`packages/storage/package.json:21`.

Two consequences, and they pull in opposite directions:

1. **A quarantine that makes that DID decline or 404 breaks the documented
   retrieval-api deploy verification**, and it would present as a deploy failure
   rather than as a quarantine working. The proof atom is a deliberately
   maintained serving artifact for a different purpose.
2. **A source-text CI detector does not cover this path.** The detector this card
   models on `retire-road-class-setback-table.mjs` scans for a provenance string
   assigned in source. Re-minting here is a runbook command, so the scan passes
   while the atom is rewritten. A control whose scope is narrower than its claim
   is still a defect.

Hold the scope distinction precisely. The proof atom is a **`code-section`**.
Re-running the deploy step does not re-mint the 188,103 `setback-rule` rows; it
keeps the DID those rows cite alive and servable. Do not conflate "the cited
target exists" with "the citation is a dimensional record". Report whether the
quarantine's scope is the citing `setback-rule` rows only, which is the reading
this card assumes, or the cited `code-section` as well, which would collide with
Gate A. **Do not resolve that collision by weakening either side.**

## What already exists — build into it, do not rebuild

The F-11 provenance lane already landed real work on `hauska-engine` main
(commits `293633a`, `c344345`, PRs #366 and #367). Read it before writing
anything.

- `packages/adapters/src/local/setbacks/setback-provenance-disposition.ts` 
  `classifySetbackRuleAtom`, `classifyBoundaryEdgeSetback`,
  `classifyEnvelopeServe`. Three populations, three dispositions: `value`,
  `refused` (road class), `unknown` (placeholder). `classifyEnvelopeServe`
  refuses an envelope whose named setback-rule is missing, refused or unknown,
  and reports `namedRuleSource`. **This is the McLennan quarantine, already
  written.**
- `packages/retrieval/src/setback-envelope-serve.ts` 
  `applySetbackProvenanceServe`, called from `packages/retrieval/src/index.ts:442`
  (`getPropertyAtomChain`) and `serving-sweep/chain-assembly.ts:190`
  (`assembleChain`), paired so they cannot diverge.
- `packages/engine-core/scripts/retire-road-class-setback-table.mjs`: a
  retirement detector that self-tests in both directions and is wired at
  `.github/workflows/ci.yml:57`. It covers `road-class-setback-table` only.
  **There is no equivalent detector for `storage-port-proof/phase-1a`.**
- `packages/engine-core/src/setback-writer/plan-city-setback.ts` 
  `refuseSetbackQuarantines`, refuse codes `PLACEHOLDER_COLLISION` and
  `MCLENNAN_ENVELOPE_COLLISION`. Read this one carefully; it is item 1.
- `packages/retrieval/scripts/measure-setback-provenance.mjs`: the per-FIPS
  measuring instrument. It exists, it declares its snapshot and timeout, and it
  treats a timeout as `unmeasured` rather than 0. It has never been run against
  the store: `_inbox/2026-08-31_f11-setback_cp2.json` records
  `"store": "unmeasured; no writes"`.
- `packages/engine-core/scripts/atoms-writer-allowlist.mjs`: the frozen writer
  allowlist, five entries, `setback` pointing at `write-setback-city.mjs` with
  `planRow: "F-11"`. The road-to-prod claim that `atoms-writer-job.mjs`
  hardcodes the CAD writer is **stale**; the allowlist landed. Do not re-derive
  that blocker.
- `packages/engine-core/scripts/write-setback-city.mjs`: plan-only.
  `--apply` refuses with `SETBACK_APPLY_HELD`. It holds no database connection.

Factory side, `hauska-factory`:

- `migrations/0001_init.sql` defines `runs` and
  `run_events (run_id, at, kind, body jsonb)`. That is the durable record, and it
  is in the Factory database, not `hauska_mcp`.
- `src/control/holds.mjs`, `src/control/plan.mjs`, `src/jobs/hold-refuse-run.mjs`
  are the hold path. Its current state is item 3.

## Order of work, and why this order

**Instrument repair is step one and nothing else starts before it.** Both premises
this card rests on come from `measure-setback-provenance.mjs`, and both of its
defects push the same way: it reads `fieldProvenance.front` ONLY, so a placeholder
carrying only side or rear scores as REAL, and its `entity_id >= '48309:'` range
assumes a FIPS prefix `assertCanonicalParcelEntityId` does not enforce, so
"McLennan has 0 setback rules" may be a false absence.

So **188,103 is a floor, not a count**, and the entire basis for quarantining
65,814 McLennan envelopes may be an artefact of a range predicate. Quarantining on
those numbers is acting on an instrument that reads one of three fields and
mis-ranges a county.

The Bastrop overlap question depends on the same repair. "Does Bastrop hold
placeholders" is answered by this measurement, and the 29,150 placeholders
unattributed across 48021 / 48055 / 48309 / 48453 are the reason to expect that it
does. Answering the overlap on the broken instrument would produce a confident
wrong scope for the quarantine that gates the Bastrop bake.

## 1. Fix the instrument before you trust either premise

`measure-setback-provenance.mjs` is the only instrument that can settle either
premise or the Bastrop overlap in item 2,
and it has two defects that bias it toward under-counting placeholders.

**(a) It reads `fieldProvenance.front` only.** A row placeholdered on `side` or
`rear` but not `front` scores `other-dimensional`, which means it counts as
real. Add `side` and `rear`. Pre-register the falsifier: **adding the two axes
must not move the 188,103 / 158,573 split.** If it does, the published figures
were wrong and that is the finding, not a corpus change.

**(b) Its county predicate assumes a FIPS-prefixed `entity_id`, and nothing
enforces one.** `packages/atoms/src/parcel-write-identity.ts:67`
(`assertCanonicalParcelEntityId`) rejects sentinel tokens and decimal-padded
parcel grammar. It does **not** require a leading FIPS. So
`entity_id >= '48309:' AND entity_id < '48310:'` answers a narrower question than
"how many McLennan setback rules exist", and the corpus is already known to carry
six identifier key forms.

**This is the second mechanism for "McLennan has 0 setback rules", and it must be
rejected on evidence before the first is reported.** Mechanism A: McLennan
genuinely has no setback rules and 65,814 envelopes were derived from nothing.
Mechanism B: McLennan's setback rules exist under a non-FIPS key form and the
range predicate cannot see them, which would make the envelopes correct and the
measurement wrong.

The discriminator is a second derivation, not a better query. Every envelope
carries `reasoningChain.inputAtomRefs` with an entry whose `entityType` is
`setback-rule` (`packages/engine-core/src/property-reasoning/emit-buildable-envelope.ts:35`).
Enumerate the DIDs the 65,814 McLennan envelopes name, then look those DIDs up by
`atom_did`, which is the primary key and needs no range predicate. Absent by
primary key is absent. Present under another key form means mechanism B and the
McLennan quarantine is void.

State which mechanism you believe, state the other, and say why you rejected it.

## 2. The Bastrop overlap. Answer it with the repaired instrument.

**The placeholder rows and the rows a real Bastrop setback lands into are the
same rows, by primary key, wherever a Bastrop in-city parcel currently holds a
placeholder.** The chain:

1. `packages/engine-core/src/property-reasoning/confidence.ts:200` 
   `propertyEntityId(parcelNodeId, "setback", version)` returns the **bare
   `parcelNodeId`** at version 1. Versions above 1 get a `/vN` suffix.
2. `atom_did` is `did:hauska:setback-rule:<entityId>`, so a version-1 setback for
   `48021:34137` is `did:hauska:setback-rule:48021:34137`.
3. `packages/storage/src/pg-storage.ts:264`: `writePropertyAtom` upserts
   `ON CONFLICT (atom_did) DO UPDATE SET ... body = EXCLUDED.body`.

So a real Bastrop write does not create a sibling row. It replaces the
placeholder body in place. That is the correct outcome and it is the reason a
stored quarantine mark keyed on `atom_did` is wrong (item 3).

**The live defect this creates is already in the tree.**
`plan-city-setback.ts` calls `refuseSetbackQuarantines` at the top of
`planCitySetback`, and `refusePlaceholder` **throws** `PLACEHOLDER_COLLISION` on
the first parcel whose existing rule classifies `unknown`. It is a throw, not a
per-row disposition, so **one placeholder parcel inside Bastrop city refuses the
entire Bastrop city plan.** A quarantine that hardens this without changing its
granularity is a quarantine that blocks the Bastrop bake. Say what it should do
instead: a per-parcel disposition that records the collision and continues, or an
explicit "the incoming named source supersedes the placeholder" rule. Do not
guess; state the choice and its falsifier.

**Does Bastrop actually hold placeholder rows? The record does not say, and the
arithmetic leaves room.** Do not report either answer without the measurement.

| Figure | Value | Source |
|---|---|---|
| Six-county `setback-rule` total | 346,676 | `_inbox/2026-08-30_ctx_w3_collect_amendments.md` |
| Placeholder | 188,103 | same |
| Non-placeholder | 158,573 | difference |
| Named real: Bastrop + Lockhart + Austin | 7,534 + 337 + 150,702 = **158,573** | same |
| Hays 100% placeholder | 34,454 | same |
| Williamson 100% placeholder | 124,499 | same |
| Placeholder **not** attributed to Hays or Williamson | **29,150** | difference |

The non-placeholder side reconciles exactly, which is a good sign for the
predicate. The placeholder side leaves 29,150 rows distributed across 48021,
48055, 48309 and 48453 with no published split. **Bastrop overlap is therefore
not ruled out by anything on file.**

One live data point, and treat it as existence only, never as a population
claim: `_inbox/2026-08-31_f11_ldt_c7_reread.md`, gate 8 C7 on the Bastrop gold
`48021:34137` fetched 2026-08-31T02:56:30Z from
`https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets`, found
the retired-provenance hit was **only `descriptor-fixture` (5 occurrences)**,
`setbackProvenance` null, and no `storage-port-proof/phase-1a` on the served
body. One parcel is not 62,257 parcels.

**That same artifact surfaces a third provenance neither quarantine covers.**
`descriptor-fixture` is in gate 8's `RETIRED_PROVENANCE`
(`hauska-factory/scripts/gate8/assert.mjs:16`) alongside the other two, it is
live on the Bastrop gold right now, and the F-11 classifier does not know it. It
is the depth-warm fixture that carries the P-3 front-15 transcription error the
2026-07-29 probe found. **Report whether it belongs in this card's scope. Do not
silently widen, and do not silently exclude.**

## 3. Which quarantine mechanisms are actually available

Evaluate each against the schema above, not against what a quarantine "should"
have. Report the disposition of all six; do not silently pick one.

**A. Serve-time provenance exclusion, read from `body`.** Available today, built,
partly wired. No schema change, no mutation, no durable record required because
nothing changes state. It is the **only** mechanism that cannot outlive the data
it describes: when the Bastrop bake replaces a placeholder body, the same
predicate re-evaluates and returns `value` on the next read, with no unwind step.
This is the recommended spine. Its gap is coverage, not design (item 4).

**B. `access_policy`.** Mechanically writable and semantically wrong. Note what
the write path actually does: `packages/storage/src/access-policy-write.ts`
`resolveAccessPolicyOrRefuse` refuses only null and empty string. It does **not**
validate against an enum, so an invented value such as `quarantined` would be
accepted by every writer, and `accessPolicyMatchesFilter` would then fail every
read because it requires set membership. The atom would become invisible on every
surface, indistinguishable from never having existed. That is precisely the
absent / unknown collapse this program exists to prevent, and it would collide
with the 2026-08-28 access-pair ruling that writer, bake and serve all refuse a
non-conformant pair. **Reject, and say why in the handback so the next agent does
not re-propose it.**

**C. A status flip.** There is no `status` column on `atoms`. There is
`body->>'status'`, typed `PropertyAtomStatus = "active" | "retired"`
(`packages/atoms/src/property-instances.ts:216`), and it **is** read:
`coalesce(body->>'status','active') = 'active'` appears in
`block13-cert-grade.mjs:161`, `bastrop-batch-bulk-prefetch.mjs:145` and the
Bastrop line-tag backfill; `packages/storage/src/road-ingest-supersede.ts:68`
writes `"retired"`. So it is armed and fed, which makes it tempting. It is still
wrong here: `retired` means superseded, a retired atom is not served at all, and
that turns `unknown` into absence on 188,103 parcels. It also means rewriting
188,103 bodies through the upsert, changing `content_hash` and `cid` on every
one. **Reject for the placeholder cohort. It remains the correct mechanism for a
genuine supersede.**

**D. Delete.** Forbidden on the F-11 board, and independently wrong: deleting
converts a wrong value into an absence, and absent, zero and unmeasured are three
different states that must never be collapsed.

**E. A side table or `atom_links` mark keyed on `atom_did`.** Available and
additive; `atom_links` already carries a `context` text column and a
`(from, to, link_type)` primary key. But it is **stale by construction**. Because
`writePropertyAtom` upserts `body = EXCLUDED.body` on `atom_did` and nothing
clears a side table, a mark made before the Bastrop bake keeps suppressing the
real value written after it. If a stored mark is used at all, it must record the
`content_hash` it was made against and be checked against the row's current
hash, so that a changed body invalidates the mark automatically. State that as a
requirement, not a nicety.

**F. A Factory hold that refuses work rather than mutating data.** `holds`
exists with `cell_key`, `reason`, `author`, `doc_repo_head`, `lifted_at`;
`holdsFromRoutingPin` mints a `rail:<rail>` cell for every routing-pin row with
`ready:false`; `isHeldRail` is read by `planWork`. **It is not armed for these
two rails.** `planWork` iterates only `["cad","geometry","flood"]`, so a
`rail:setback` or `rail:envelope` hold is generated and never consulted;
`src/jobs/hold-refuse-run.mjs` is hardcoded to `"footprint"` and is invoked only
by hand; and `_inbox/2026-08-24_factory_routing_pin.json` carries
`envelope ready:true` with **no `setback` row at all**. This is the cheapest
thing on the list to arm and the only one that refuses work instead of touching
data. Report what arming it would take and whether it belongs to this seat.

## 4. Name every consumer before retiring anything

**Retirement is proven by decline, never by documentation, and consumers are
repointed BEFORE a store is retired. The reverse order turns an invisible defect
into a visible regression.** The consumer map below is what this card starts
from. Verify it, extend it, and correct it where it is wrong.

| Consumer | Repo / path | State |
|---|---|---|
| `getPropertyAtomChain` | engine `packages/retrieval/src/index.ts:442` | applies the classifier |
| `assembleChain` | engine `serving-sweep/chain-assembly.ts:190` | applies the classifier |
| node detail, boundary consume, site-plan author and export | engine `node-detail.ts:95`, `boundary-primitive/consume.ts`, `site-plan/author.ts`, `site-plan/prepare-boundary-edges-for-export.ts` | apply the classifier |
| cortex-api edge read | LDT `artifacts/api-server/src/lib/boundaryEdgeFactRead.ts` -> `setbackProvenanceDisposition.ts` | **edge only**, deployed at `cortex-api-00672-ceq` |
| cortex-api envelope derive | LDT `artifacts/api-server/src/lib/buildableEnvelope/derive.ts` | **no guard**; still imports `roadClassSetbacks` |
| cortex-api baked facets route | LDT `artifacts/api-server/src/routes/brokerageNodeFacets.ts` | strips baked envelope to `null` and sets `facetCoverage.envelope=false`; not an envelope consumer. **Whether baked setbacks survive the strip is unanswered and is yours to answer** |
| PE serve | hauska-map `apps/property-explorer/api/spine.ts` -> `_lib/pe-property-atoms.ts` -> `_lib/atom-chain-to-facets.ts` | **no F-11 logic on `origin/main`** |
| MCP `get_property_atom_chain` | `hauska-mcp-server/src/property-atom-chain.ts:204,288` | passes `setback-rule` and `buildable-envelope` slots through; `setbackServe` and `envelopeServe` appear nowhere in its `src/` |
| MCP ICC obligation meter | `hauska-mcp-server/src/source-obligation-meter.ts:36` reached from `read-attribution.ts:100` | `did:hauska:code-section:storage-port-proof/phase-1a` is on `ICC_SOURCED_ATOM_DID_ALLOWLIST` |

Two of these deserve emphasis.

**The envelope quarantine is not on the surface that serves envelopes.** The
decline path that emits `declineReason: envelope-no-setback-rule` lives in
`packages/retrieval/src/serving-sweep/vendor/atom-chain-to-facets.ts`. Read that
directory's `README.md`: it is a **verbatim vendored copy** of hauska-map, pinned
by `VENDOR_SOURCE_SHA.txt` to `d3510a6`, and it says DO NOT EDIT THE LOGIC. The
F-11 commit edited it. Meanwhile `hauska-map` `origin/main` carries **zero** F-11
tokens in `apps/property-explorer/api/_lib/atom-chain-to-facets.ts`, and that
file has grown from 710 lines at the vendor pin to 1,549 lines on main. The
drift guard `__tests__/vendor-drift.test.ts` skips when no map checkout is
reachable and looks only at `P:/hauska-map`, `/p/hauska-map` or
`$HAUSKA_MAP_ROOT`; `P:/hauska-map` exists and is parked on
`fix/p35-vercel-token-preflight` at exactly `d3510a6`. So the mirror is stale in
one direction and edited in the other, and the guard that would have said so has
been comparing against the pin it was copied from. **Report this as its own
finding. Do not fix hauska-map from this seat; it is not yours.**

**A quarantine changes ICC accrual.** Every served setback citing the
placeholder currently accrues a `license-reference-royalty` obligation against
the ICC actor, because the placeholder DID is on the inbound allowlist. Removing
or reclassifying those citations changes the meter's input. That is in the
substrate seat's repository. Name it, quantify what changes, request it. Do not
edit it.

## 5. If you mutate anything, the record comes first

**Every state-changing operation emits a durable record naming the items acted
on, the timestamp and the invocation. A count is not a record. If the record
cannot be written, the mutation does not run.**

Concretely, in this system: the record is a Factory `runs` row plus one
`run_events` row per chunk, in the Factory database, and the atoms lease is
`atoms_writer_lease_v2` in `hauska_mcp` with `run_id` carried as text across the
database boundary with no foreign key. Run row first, then lease, then work.
"188,103 rows quarantined" is a count and satisfies nothing; the record names
the `atom_did` set per chunk, the predicate version, the wall time and the
invocation.

A refusal is recorded the same way as a mutation. A refuse that leaves no name
is how an unattributed mutation becomes unanswerable.

If this card concludes that no mutation is required, which is the likely and
preferable outcome under mechanism A, **say so explicitly**, because "we chose
not to mutate" and "we forgot to record the mutation" look identical in an empty
ledger.

## The falsifiers. State each one before you run it.

Four checks, each with a result that would prove it wrong. A check with no such
result is not a check.

**F1: the provenance split reconciles.** Run
`measure-setback-provenance.mjs` against `hauska_mcp` after fixing the `side` and
`rear` gap. Pre-registered: placeholder totals 188,103, non-placeholder totals
158,573, and Bastrop non-placeholder is exactly 7,534. **Falsified if any of the
three misses.** A miss means the predicate is wrong, not that the corpus moved,
and the reconcile numbers are the target, not the output. A timeout is
`unmeasured` and is reported as `unmeasured`, never as 0.

**F2: Bastrop overlap is a number, not a belief.** Count Bastrop `setback-rule`
rows that classify `unknown`. **Falsified in the dangerous direction if the count
is greater than zero and the card still treats the two populations as disjoint.**
Falsified in the other direction if the count is zero but 48021 total minus 7,534
is greater than zero, which would mean rows exist that are neither placeholder
nor one of the three named real sources, and that third population needs a name.

**F3: the quarantine cannot suppress a real value.** Take a fixture parcel
carrying a placeholder rule, write a named-source rule over the same `atom_did`,
re-run the serve classifier, and require `value` with the new source named.
**Falsified if it still returns `unknown`.** This is the mechanism-E trap made
executable, and it must be run against every mechanism the card adopts, not only
the one it prefers.

**F4: McLennan's zero is a real zero.** Resolve the setback-rule DIDs the 65,814
envelopes name, by `atom_did` primary key, with no range predicate.
**Falsified if any resolve.** One resolving DID means mechanism B and the
McLennan quarantine is void as currently scoped.

And one negative control, because a control verified only by passing has not been
observed working: run F1's predicate against a row you have deliberately stamped
with the placeholder DID and confirm it is caught, and against a known layer-23
Bastrop row and confirm it is not. Generated events are indistinguishable from
the ones being counted, so note and exclude them explicitly.

## Do not

- Do not delete atoms. Not one, not to make a rail look clean.
- Do not collapse absent, zero and unmeasured. A timed-out query is
  `unmeasured`. A quarantined value is `unknown`. A probed and empty scope is
  `absent-verified`. Three states, three strings, never one.
- Do not stamp `not-applicable` on an in-city parcel. The 2026-08-31 ruling
  governs 465,568 parcels and calls this the largest fabrication available on
  this board.
- Do not use `access_policy` as a truth flag.
- Do not widen a check to admit a placeholder so a number comes out even.
- Do not retire a store, a derivation or a provenance before its consumers are
  repointed, and do not report a retirement from a comment. A retired path
  declines, and a CI check fails when it reappears.
- Do not write to `hauska-map`, `legacy-design-tools` or `hauska-mcp-server`.
  Read them, name what is needed, request it from the owning seat.
- Do not edit `packages/retrieval/src/serving-sweep/vendor/`. It is a mirror of
  another repo and its whole value is that it is verbatim. Report the drift; do
  not resolve it by editing the mirror further.
- Do not run `write-setback-city.mjs --apply`. `SETBACK_APPLY_HELD` is correct
  and stays armed.
- Do not connect to `neondb` looking for atoms and report an absence.
- Do not report the McLennan quarantine as sound until F4 has run.
- Do not run two writers on the same `(store, entity_type, county_fips)`.
- Do not raise a `statement_timeout` to make a scan finish.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch.

Declare your snapshot in your first output: repository, branch, commit, and for
any measurement the database host fingerprint and the query timeout.

State the falsifier for each check before running it, including your own checks,
not only the ones inspecting other agents' work. The instrument that produced a
claim is part of the claim: a load-bearing number needs a file-based instrument
that has been shown to fail, never a shell one-liner.

For every finding, state the mechanism you believe explains it and a second
mechanism that would produce the same observation, and say why you rejected the
second.

`leave_behind` named, with owner and plan row. `none` is a valid and cheap
answer; the declaration is required either way.

Subagents do not commit. If you fan work out, they hand back artifacts and you
read the diff before it lands. Verification never delegates below the lane
planner.
