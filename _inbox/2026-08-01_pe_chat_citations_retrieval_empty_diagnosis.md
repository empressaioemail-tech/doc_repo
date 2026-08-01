---
id: 2026-08-01_pe_chat_citations_retrieval_empty_diagnosis
title: PE chat citations — ROOT CAUSE is retrieval-returns-empty, not rendering (4th pass; diagnose+fix with live-probe proof)
date: 2026-08-01
status: dispatch (diagnose+fix, verification never delegated)
owner: nick
related: [2026-07-29_pe_ai_chat_atom_citations_spec, 2026-08-01_PE_ui_polish_qa_batch, 2026-08-01_PE_qa_round3_and_mobile_dispatch]
purpose: Third fix (#136, #368, #369) did NOT make chat citations appear. Planner traced the full live chain against the citation spec. Rendering + plumbing + anti-fabrication are ALL correct. The failure is UPSTREAM: retrieveAtomsForQuestion returns ZERO code-atom sources for live Bastrop properties, so the model honestly emits no [n] markers (anti-fabrication working as designed = "honest-empty"). Fix the retrieval, prove it with a live retrievalProbe.
---

# PE chat citations — the real root cause (retrieval empty)

## WHY THREE PASSES FAILED (planner trace, done before this dispatch)
The shipped citation system is a `[n]` NUMBERED-FOOTNOTE layer (NOT the spec's `{{atom:...}}` inline markers — that shape was deliberately deprecated corpus-wide per chat-citations.ts:7). Contract: the model emits `[n]` markers backed by a DELIVERED `sources[]` list of real code atoms; `parseInlineCitations` DROPS any `[n]` not backed by a delivered source (anti-fabrication). Traced live chain:
- FRONTEND (hauska-map chat-research.ts): CORRECT. Sends `presentationMode:"pro"` (keeps [n] markers; consumer strips them), full areaContext (subject parcelNodeId, jurisdictionKey, setbacks, envelope, zoning district). Verified in buildChatRequestBody (line ~448).
- BACKEND anti-fabrication (ldt api-server brokerageBriefLlm.ts + brokerageBriefLlmCitationConstraint.test.ts): CORRECT. Model prompted "Use ONLY the numbered code atom sources. Do not invent code." Out-of-range/invented [n] dropped. TEST "HONEST-EMPTY: zero delivered sources → every [n] is fabricated → zero citations" is EXACTLY the live symptom.
- The live answer (1006 Jefferson St, SF-1; and 907 Chestnut, GC) = clean prose, NO [n], NO chips = the HONEST-EMPTY case = ZERO code-atom sources were delivered to the model.
CONCLUSION: not a rendering bug, not a mode bug, not a marker bug. `retrieveAtomsForQuestion` returns ZERO atoms for these live Bastrop properties even after #368 (jurisdiction-key canonicalize) + #369 (district-aware query). The retrieval filter/threshold still matches nothing against the Bastrop UDC corpus (~181 atoms KNOWN to exist; GC use+dimensional atom `bastrop_tx-bdc-2026-adopted/14-02-003` is confirmed ingested).

## WHERE THE BUG LIVES
`retrieveAtomsForQuestion` is imported by ldt api-server `src/lib/brokerageBriefLlm.ts` from `@workspace/briefing-engine` (shared package, authored in legacy-design-tools). The retrieval filter + embedding/threshold + jurisdiction match live in that engine package (and/or its cortex-api call path). That is the target.

## YOUR TASK — DIAGNOSE + FIX + PROVE ON LIVE
1. DIAGNOSE: Trace `retrieveAtomsForQuestion` in `@workspace/briefing-engine`. Find WHY it returns zero atoms for a Bastrop property. Candidate causes (confirm which, with evidence — do not assume):
   - jurisdiction slug still mismatched at the ENGINE layer (api-server canonicalizes to `bastrop_tx` per #368, but does the engine's own filter use a different key/column?).
   - embedding/similarity THRESHOLD too high → everything filtered out.
   - a district filter added in #369 too STRICT (e.g. requires exact "SF-1"/"GC" token match that the atoms don't carry in the filtered column) → over-filters to zero.
   - the code-atom query never runs for the `areaContext.scope:"property"` path (only ran for the brief path, not the chat path).
   - live DB (deployment Neon) missing the atoms / migration-merged-not-applied (verify the corpus rows are actually IN the deployment DB the live service reads — name the atom id and SELECT it live).
2. PROVE THE DIAGNOSIS ON LIVE: use the `retrievalProbe` endpoint (retrievalProbeBody exists in lib/api-zod generated types — find its live route + auth) to run a Bastrop SF-1 (and GC) query against PROD and show the ACTUAL returned-atom count = 0 (confirming the symptom) and the field values that cause the miss.
3. FIX the retrieval so a Bastrop SF-1 / GC property query returns its real code atoms (zoning use + dimensional + setback). Do NOT loosen anti-fabrication (never deliver an atom that isn't a real match; never let the model invent). Do NOT touch the frontend or the [n]/chip layer — they are correct.
4. PROVE THE FIX ON LIVE: re-run the retrievalProbe against the SAME prod queries and show it now returns the real atoms (verbatim ids, e.g. bastrop_tx-bdc-2026-adopted/14-02-003 for GC + the SF-1 equivalents). Paste raw probe output (before: 0 atoms; after: N real atoms).

## THE ONE TEST THAT MATTERS (from the spec)
Ask the chat a question about a property whose atoms you KNOW, and confirm the model now receives real delivered sources → emits [n] → chips render. And confirm nothing fabricated survives (invented [n] still dropped). If retrieval delivers the atom and the model still emits no [n], THEN and only then is there a residual prompt/mode bug to chase.

## DELIVER
Root-cause writeup (which candidate, proven), the retrieval fix (PR base main, CI green on HEAD SHA), and BEFORE/AFTER live retrievalProbe raw output. Report if the fix needs a live DB data-op (atoms not in deployment Neon) vs a pure code fix. Note the exact repo(s) touched (briefing-engine / api-server / cortex-api).

## DISCIPLINE / STANDING DECISIONS (travel in this dispatch)
Isolated worktree off origin/main (do NOT edit shared clone trees; collision hazard). Stage explicit paths. Build+tsc+tests green; PR base main; CI green on HEAD SHA (not a stale run). Deploys PLANNER-OWNED — do NOT merge/deploy; planner re-runs the live probe to VERIFY before merge (verification never delegated). Anti-fabrication is NON-NEGOTIABLE (a chip pointing at nothing is worse than no chip). No-special-data-access (retrieval works via uniform corpus, no relationship path). Migration-merged != applied-to-live-Neon — verify the atoms are actually in the DB the live service reads before blaming code. Verify identifiers/routes against live source. No timeframe estimates. Paste raw command/probe output, never summarize, when reporting tool state.
