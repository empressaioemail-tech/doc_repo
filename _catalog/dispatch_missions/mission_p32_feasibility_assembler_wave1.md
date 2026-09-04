## Mission: P-32 Feasibility Study — wave 1, engine-side assembler

Repo: `hauska-engine` only, primarily `packages/engine-core/src/site-plan/`. Isolated worktree from `origin/main`. This wave does not touch `hauska-map` (the PE leg, spec item 10, is wave 2 — it depends on this wave's item 4 and on the tier ruling, spec item 2, neither of which exist yet). Do not touch `hauska-mcp-server`.

**Source of truth: `_inbox/2026-08-24_feasibility_v1_plan_DRAFT.md`.** This is the approved WDLL (amendments A1-A5, 2026-08-24) — 16 specced sections, 12 acceptance items. This mission carries only items 3-9 (the engine-side build) plus the two things that changed since that spec was written. Read the full spec before starting; this is a work-scoped excerpt, not a replacement.

### What changed since 2026-08-24 that this build must account for

1. **`render.ts` moved under P-90.** The assembler this spec calls "clone `dossier.ts`" (assembly architecture, spec §5 item 1) must be cloned from current `origin/main`, which now has `emitPdfSitePlan`'s `sheets: "drawing-only"` mode, the removed dead `CAPTURED` chip stub on the aerial header, and `liveViewUrl` threaded through both the dossier and flood-drainage content types. Use these, don't reintroduce what P-90 just removed.
2. **Section 10 (utilities) is less speculative.** A live `/api/who-serves` query path shipped 2026-08-25, returning CCN service territory with a mandatory honest "SERVICE-LETTER-REQUIRED" residual sentence when a commitment can't be asserted. Section 10 can read this now rather than shipping the fully speculative honest-absence-only version the spec assumed.

### Assembly architecture (spec §5, carried verbatim, decisive)

1. Engine-side sibling assembler, cloned from `dossier.ts` — not a rewrite. Tokens only from `template-tokens.ts`; primitives from `render.ts`'s shared export block; page numbers only through `buildFinePrint` + `SheetNumbering`; honest absence via chips + the `REASON` sentence map; no new color or type token.
2. Data access engine-side via `listPropertyAtomsByParcelNodeId()` and persisted artifacts — not the MCP property-atom-chain (3 of 16 entity types; widening it is substrate work this card must not silently absorb).
3. Narrative sections (spec §3 rows 2, 11) use the shipped Grok-first-with-deterministic-fallback pattern from the Property Brief generator. Every narrative sentence binds to a cited fact; ungrounded sentences are refused; fail closed to the deterministic skeleton when the LLM path is unavailable.
4. No report-run ledger inherited. Persist the artifact in the existing `parcel-terrain-model` artifacts map pattern.

### Section-by-section spec (spec §3 table — the 16 sections; this wave builds the model and assembler for all of them, sections 10-11 shipping their currently-honest-absence or query-time form)

Read the full table in the source spec. The load-bearing distinctions: sections 1,2,13,14,16 have no dedicated data field (composed/generated/superseded-by-design); sections 3-9,12,15 read sealed `ParcelFactSheet` data and persisted artifacts, `have` or `have (logic to build)` status; section 10 reads the live who-serves query path (see "what changed" above); section 11 ships the honest "not searched" shell + Smart Files mount, per the standing P-85 non-block.

### Acceptance items (spec §7, items 3-9 — this wave's actual scope)

3. **FeasibilityModel + section registry.** A model composed from the sealed `ParcelFactSheet`, persisted artifacts (site-plan set, flood JSON/PDF), and atom reads via `listPropertyAtomsByParcelNodeId()`; every section input carries an explicit honest-absence variant, matching `SitePlanModel`'s pattern. Check: unit-composable on a fixture with zero live calls; absent inputs produce typed absences, never defaults.
4. **Assembler emits the composed PDF** (sections 1-9, 13-15) in SHEET_STANDARD_v1 language: tokens only, `buildFinePrint` numbering, chips + REASON sentences for absences, one accent. Check: existing eleven styling regression tests pass unchanged; new assembler tests decode emitted bytes; a fixture with `countSitePlanSheets() > 3` numbers correctly.
5. **Superseded-run arbitration.** Given two runs of the same kind for one parcel where one failed, the composed document appends only the operative run and emits the data-quality note; the failed run is named as superseded. Verified by violation: a fixture that force-appends a failed run fails the test.
6. **Open-items table generation.** Every typed absence in the model emits exactly one prioritized row with a fixed-vocabulary action sentence; zero absences emits the "no open items" state, never an empty table. Check: a Whitetail-class fixture (no zoning, no setback rule, ETJ unresolved) reproduces the shape of Val's sheet 4.
7. **Narrative generator, grounded.** Verdict/bottom-line prose (section 2) via Grok-first with deterministic fallback; every sentence cites a model fact; the citation check is verified by violation (an injected uncited sentence fails); LLM unavailability yields the deterministic skeleton, not an error page. Check: fixture run with LLM disabled still emits a complete document.
8. **Utilities section, honest either way.** Reads the live who-serves query path (now shipped, see "what changed"): states the territory holder(s) + the SERVICE-LETTER-REQUIRED residual when it can't go further; the assembler must not block if that read fails, falling back to the fixed honest-absence sentence.
9. **HOA section shell + Smart Files mount.** Section renders "not searched" honestly with the mount affordance; when a user-mounted recorded doc exists, the synthesis is cite-or-decline over that document only. Check: no mounted doc yields the fixed sentence; a mounted CC&R fixture yields cited synthesis; an uncited synthesis sentence fails (same violation harness as item 7).

### Explicitly out of scope for this wave

Item 1 (plan row — already done, this dispatch). Item 2 (tier ruling — business decision, not this lane's to make; flag if the assembler needs a placement to build against, propose the spec's own default — composed = Studio — as a working assumption but do not treat it as ratified). Item 10 (PE leg, `hauska-map`, `pe-site-plan-export.ts?report=feasibility`, `ReportsTool` section) — wave 2, depends on this wave's item 4 landing plus item 2 being ruled. Item 11 (live probe on the deployed PE surface) — depends on item 10. Item 12 (close hygiene) — this wave's own close still applies to items 3-9 only. Section 11's full HOA/recorded-docs program (the P-85 reconciliation) — out of scope per the standing non-block; ship the shell only.

### Source

Full spec: `_inbox/2026-08-24_feasibility_v1_plan_DRAFT.md`. Rulings: `_decisions/2026-08-24_feasibility_v1_rulings_and_data_capture_program.md`. Unfreeze: `_decisions/2026-09-03_p32_feasibility_unfrozen.md`.
