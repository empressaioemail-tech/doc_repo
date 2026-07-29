---
id: 2026-07-29_pe_ai_chat_atom_citations_spec
title: PE AI-chat atom citations — the full citation-layer spec (translated from the trading-app architecture, PE-adapted)
date: 2026-07-29
status: spec (addendum to the PE Workbench build — governs the AI-chat bubble's citation behavior)
owner: nick
related: [2026-07-29_pe_workbench_concept_spec, 28_THE_BASTROP_MOLD_engine_build_spec, 09_post_saas_substrate_thesis, 25_atom_architecture_reference]
reference: the Empressa trading platform's mature atom-citation architecture (operator-provided 2026-07-29); PE's own extension mechanism at P:\hauska-brief-extension src/lib/inline-atoms.js (same wire format)
---

# PE AI-chat atom citations — the citation-layer spec

This governs how the PE Workbench AI-chat bubble cites atoms. It is not cosmetic. The citation layer is where "sell reasoning not data" (structural commitment #1) becomes real in conversation: the chat does not just answer, it shows the recorded, provenanced, confidence-carrying evidence behind every claim, and lets the user open and verify it. Get this right and the chat is trustworthy in a way no competitor's can be (nobody else has the cited spine). Get it wrong — specifically, let the AI FABRICATE a citation — and it is worse than no citation at all, because a chip that looks authoritative but points at nothing weaponizes the exact trust the chip exists to earn.

The good news: this is not a new system to invent. The trading app already solved this at maturity, and PE's own brief-extension already uses the SAME wire format (`{{atom:TYPE:ID:LABEL}}`, `src/lib/inline-atoms.js`). Port the DISCIPLINE from the trading reference; the mechanism is already ours.

## WHY THIS EXISTS (the thesis — so the agent understands what it's protecting)

A citation is a PROMISE YOU CAN OPEN AND VERIFY. Three guarantees make it a promise instead of decoration:
1. The FORMAT guarantees the AI can only reference real recorded atom ids (it cannot invent one).
2. The CHIP guarantees you always see the evidence behind a claim (claim + confidence + provenance, expandable).
3. The SERVE layer guarantees the numbers are never shown in a way that overstates what has actually been earned.
Every rule below serves one of those three guarantees. When in doubt, ask: does this preserve the promise?

## PART 1 — THE WIRE FORMAT (already correct in PE; enforce it)

- ONE inline marker in AI prose: `{{atom:TYPE:ID:LABEL}}` — the model emits it in its answer text; one shared parser renders it to a chip. This is EXACTLY the shape PE's extension already parses (`inline-atoms.js` ATOM_MARKUP_RE). TYPE = a PE property atom entity type; ID = the real atom/entity id; LABEL = the natural-prose text shown on the chip.
- PE atom TYPES (from the property spine): `zoning-fact`, `setback-rule`, `buildable-envelope`, `parcel-terrain-model`, `flood` (fema), `land-use` (cad-roll), `property-boundary-edge`. The label reads as prose so stripping the markup leaves a correct sentence.
- Parallel carrier for data rows (non-prose): where the brief or a card attaches a citation to a specific record (not model-generated prose), it carries the raw atom id and builds the chip directly. Both carriers converge on the SAME chip and the SAME fetch (GET the atom by id).

## PART 2 — THE LOAD-BEARING RULE: constrain what the model can cite (anti-fabrication)

THIS IS THE MOST IMPORTANT RULE IN THE SPEC. The chat backend, before generating, hands the model an `[ATOM CONTEXT]` block containing the REAL atoms available for the ACTIVE property — a list of `type:id — label` lines, built from the property's actual atom chain. The system prompt instructs the model:
- "Copy TYPE:ID VERBATIM from the [ATOM CONTEXT] block when you cite. NEVER invent an id. NEVER cite an atom not in the block."
- Cap the number of chips (trading caps at 3 per answer — start there; a wall of chips is noise).
- If there is NO [ATOM CONTEXT] block (no citable atoms for this property), emit NO `{{atom:...}}` markup at all — answer in honest plain prose.
This is the guarantee that the AI can only reference atoms that actually exist on this property. Without it, the model will hallucinate plausible-looking citations, and the whole trust model collapses. The frontend is the second line of defense (a cited id that 404s degrades to text — PART 4), but the BACKEND CONSTRAINT is the primary guarantee. Build and test this first.

## PART 3 — THE CHIP (inline appearance)

- Inline LABEL only — no confidence number, no glyph, inline. The chip is a natural-prose button; the evidence is behind the tap.
- RESERVED COLOR: pick ONE accent color that means "this is a citable atom" and use it for NOTHING else. Numbers, plain emphasis, and web-search/unverified links must be a DIFFERENT color. (Trading: amber = atoms, blue = numbers + web links, and blue is "explicitly never an atom.") The rule that ports is: one color = "openable recorded evidence," never reused — so the user learns that amber-equivalent always means "you can open and verify this."
- WEB-SEARCH CITATIONS ARE NEVER ATOM CHIPS. PE's brief falls back to websearch for out-of-Central-TX properties (with a web-scraped/unverified disclosure). Those sources, if cited in chat, must be visually distinct from atom chips and labeled unverified — an atom chip is a promise of a RECORDED provenanced fact; a scraped web source is not, and must not borrow the atom chip's authority.
- STREAMING-SAFE: while the answer streams, a half-written `{{atom…` with no closing `}}` is HELD — the parser renders only the safe prefix, so a chip never flashes raw markup mid-stream. (PE's inline-atoms parser already has the markup regex; the streaming-hold is the addition.)
- ONE CARD OPEN AT A TIME per chat bubble — all chips share one controller. (This matches the Workbench design law: one thing open at a time. No stacking accordions.)

## PART 4 — EXPAND BEHAVIOR (the in-bubble accordion — the "expands inline" the operator wants)

Tapping a chip grows an ACCORDION CARD INSIDE THE CHAT BUBBLE — NO modal, NO navigation (this honors the Workbench design law: no second surface). The card progresses chip → BRIEF → "more →" → FULL:

BRIEF level:
- The claim (what the atom asserts), a plain-English description, a NEVER-BARE confidence line (PART 5), a FRESHNESS badge, the as-of date, a source link.
- Example (zoning-fact): "Zoning district P-3 (Place Type). Source: City of Bastrop AGOL Zoning_Place_Type. As of 2026-07-23. [fresh]."

FULL level ("more →"):
- PROVENANCE (source · method).
- CONFIDENCE (the full triple — PART 5).
- TIMES (recorded / valid-from + freshness).
- ACCESS-POLICY / license (the atom's accessPolicy tier).
- COMPUTED-FROM (lineage chips) — the atoms this one was derived from.
- WOULD-AFFECT (downstream chips) — the atoms derived from this one.
- VERIFY → "Prove it" — the anchored-atom proof link.

PE LINEAGE IS THE PROPERTY REASONING CHAIN (this is the property version of "sell reasoning not data" and it's the compelling part): a `buildable-envelope` atom is COMPUTED FROM the `setback-rule` + `zoning-fact`; the `setback-rule` is computed from / cited to the code section (B3 §6.5.003). The COMPUTED-FROM and WOULD-AFFECT chips are CLICKABLE — tapping one SWAPS the card to that related atom with a ← BACK step, so the user WALKS THE EVIDENCE GRAPH IN PLACE: "why is the buildable area this?" → tap envelope → computed-from → tap setback-rule → cited-to → the code. In the chat bubble, no navigation. That walk is the moat.

## PART 5 — THE HONESTY RULES (what makes citations trustworthy, not decorative)

These are non-negotiable and they are the reason the citation is a promise. Adapted to PE's domain:

1. NEVER-BARE CONFIDENCE. A confidence figure ALWAYS carries its basis, or it is not shown. For PE atoms the basis is the atom's own fields: `value` + `confidence` + `verification_state` (human-verified / transcribed / asserted). A bare confidence number with no basis is forbidden.

2. EARNED vs ASSERTED (critical for PE — this is commitment #2 at the display layer). PE's calibration loop is NOT live yet — nearly every PE atom is honestly `basis: asserted` / `verification_state: human-verified or transcribed`, NOT calibrated-against-outcomes. So the chip must DISPLAY-DOWNGRADE honestly: an atom that is not calibration-eligible shows `asserted` with its point estimate honestly labeled as asserted, so an ungraded observation CANNOT masquerade as earned evidence. The STORED atom is untouched (append-only) — only the DISPLAY downgrades. For PE today this means: most chips will honestly read "asserted" — SHOW THAT. Never dress an asserted setback or zoning fact as if it were calibrated. (When the calibration loop goes live later, calibration-eligible atoms will pull live earned confidence; the display rule is already correct for that future.)

3. GATED SERVE. Forbidden, unknown, and unservable all return an IDENTICAL 404 — never leak "forbidden" vs "not found" (an accessPolicy tenant-private atom a user can't see returns the same 404 as a nonexistent id). The chip caches the 404 and DEGRADES TO PLAIN LABEL TEXT — never a broken chip. This makes PE's accessPolicy tiers real at the citation layer.

4. HONEST-EMPTY. No citable atoms for a property → the model emits NO markup (it does not invent chips to look authoritative — the anti-fabrication rule from PART 2). And where a property GENUINELY LACKS a fact (the "no zoning stamp here" / "not verified here" parcels), the chat SAYS SO honestly rather than fabricating a value. Honest absence is a feature, not a gap.

5. READ-TIME FRESHNESS. Freshness is COMPUTED at read time from the atom's `captured_at` / `asOf` vs a per-family TTL — NOT a stored flag. Fresh reads quiet (green); stale/decayed escalate in color and weight so old data is impossible to miss. (PE's brief already shows "freshness verdicts" — reuse that logic on the chip.)

## PART 6 — WHAT PORTS DIRECTLY / ADAPTS / SKIP-FOR-v1

PORT DIRECTLY (same as trading): the wire format; the PART 2 backend `[ATOM CONTEXT]` constraint; the in-bubble accordion (BRIEF/FULL); streaming-hold; one-card-open; never-bare-confidence; earned-vs-asserted downgrade; gated-404-degrades-to-text; honest-empty; read-time freshness; the reserved-color rule.

ADAPT to property domain: atom TYPES are PE's (zoning/setback/envelope/flood/land-use/boundary); the lineage graph is the property reasoning chain (envelope←setback←code, envelope←zoning); "fact vs forecast" — trading splits event/news atoms into fact vs a labeled-asserted read-through; PE has little of this (no news atoms in the property chain), so it mostly does NOT apply — EXCEPT the websearch-fallback fact for out-of-area properties, which must be labeled "web-scraped / unverified" (PART 3) — the same discipline, PE's version.

SKIP FOR v1 (trading-app maturity to revise in LATER, per the operator's "revise after the initial build"):
- Calibration / track-record badges (e.g. "62% · n=214 · ±4%") — PE's calibration loop isn't live; atoms are honestly asserted, so there is no earned number to badge yet. Do NOT fake one.
- The admin/audit AtomInspector view — that already exists as PE's Command Center; do not rebuild it in PE.
- Mobile reuse / bigger-tap-target variants.
Start with: constrained-model-citation (PART 2) + reserved-color chip (PART 3) + in-bubble BRIEF/FULL accordion (PART 4) + all the PART 5 honesty rules. That is v1.

## PART 7 — BUILD ORDER + THE ONE TEST THAT MATTERS

Build order: (1) PART 2 backend constraint FIRST (it's the guarantee everything rests on), (2) the chip + streaming-hold, (3) the accordion BRIEF/FULL + lineage walk, (4) verify every PART 5 honesty rule live.

THE ONE TEST THAT MATTERS: ask the AI a question about a property whose atoms you KNOW, and confirm every chip it emits points at a REAL atom on THAT property (verbatim id from the context block), that a made-up/gated id degrades to plain text, and that no chip shows an earned-looking confidence for an asserted atom. If the AI ever cites an atom that isn't on the property, PART 2 failed — that is the failure that breaks the whole promise, and it is the thing to test hardest. (Trading pins this with atomProse.test.ts — stripping markup must leave a correct sentence, and the model can only cite context-block ids.)

## Standing decisions still govern
Planner-manages-background-agents; verify on the LIVE PE surface; deploys planner-owned; code-done != customer-done. Paste the standing-decisions block into any sub-dispatch. This is PE product work; CTX HELD.
