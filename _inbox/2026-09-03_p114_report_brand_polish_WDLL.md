---
id: 2026-09-03_p114_report_brand_polish_WDLL
title: WDLL — P-114 report brand mark + formatting polish (X-ray, Flood & Drainage)
status: draft
last_updated: 2026-09-03
operator_approval: pending
plan_row: P-114 (new; not yet opened as an OPS-16 amendment — needs an operator go, same pattern as P-90's row)
related:
  - _inbox/2026-08-28_p90_engine_pdf_WDLL.md
  - _inbox/2026-08-28_p95_stone_palette_WDLL.md
  - _inbox/2026-08-12_RPT1_existing_report_surface_inventory.md
  - _inbox/2026-09-03_report_vocabulary_and_surface_findings.md
  - _decisions/2026-08-27_report_sku_feasibility_comparison_brief.md
  - docs/smart-site-brand/README.md (hauska-map)
source: smart-site-welcome-email-light.html (operator-supplied 2026-09-03; email template, not 1:1 — this card is the translation)
---

# WDLL: P-114 report brand mark + formatting polish

Date: 2026-09-03  Status: draft
Operator approval: pending (do not implement until Nick greets this card)
Plan row: P-114 (to be opened as an OPS-16 amendment on approval)
Repo: `hauska-engine` only, `packages/engine-core/src/site-plan/pdf/`. Isolated worktree from `origin/main`. Read-only reference into `hauska-map` for the source brand SVGs (vendor a copy; do not write that repo). Do not touch `hauska-map` or `hauska-mcp-server`.

Cites the shared-styling architecture RPT1 established: one token module (`template-tokens.ts`), one accent hue, a written standard (`SHEET_STANDARD_v1.html`), and an explicit sibling-assembler export seam (`render.ts`) that `dossier.ts` (X-ray) and `flood-drainage.ts` (Flood & Drainage) already both consume. This card changes the shared primitives, not per-report code, so both live reports pick it up in one place, and the future Feasibility assembler (approved architecture: "clone `dossier.ts`", `_inbox/2026-08-24_feasibility_v1_plan_DRAFT.md` §5) inherits it for free when it's built.

## Where this came from

The operator supplied `smart-site-welcome-email-light.html` — a marketing email template — as the design direction to translate into the PDF reports. It is not portable 1:1 (HTML-email table layout, Outlook `mso-` conditionals, and Arial as an email-client-safe font have no PDF equivalent), but four ideas from it translate directly and are what this card actually proposes:

1. **A dark band as the logo's native context, not a new logo variant.** The email places the existing dark-background brand mark (`smart-site-lockup.svg`, wordmark; `smart-site-mark-crosshair.svg`, mark-alone) inside short charcoal bands on an otherwise light page — header band carries the full lockup, footer band carries the mark alone, centered. This is the same problem the earlier logo scoping hit (`docs/smart-site-brand/README.md`: the asset is gold-on-dark and states "swap to a dark/navy stroke variant if ever used on light backgrounds \[none currently exist]") solved a different way: don't make a light variant, keep the logo in a small native-dark chip inside the light sheet. Cheaper, and it's already proven in production collateral.
2. **A light neutral palette with cream/warm-gray tones**, distinct from the report engine's current cooler steel-and-graphite ramp — eyebrow labels, headline ink, muted secondary text, hairline borders, a soft card fill for callout boxes.
3. **A card treatment for honest-absence content** (cream box, bordered, a small status dot, a label, a plain-language explanation) that is visually softer than the current chip system but structurally the same idea the reports already do: name the gap, explain the read.
4. **A numbered-step visual pattern** (monospace step number, bold label, body copy, a monospace example value) usable for section or item framing.

## What this is and is not

This is a **shared-primitive visual refresh**, not a change to the honesty mechanism P-90 owns. Chips, the fixed `REASON` sentence map, and `isCleanReasonSentence` stay exactly as they are — only their skin may change (item 3 above is a *styling* option for the same absence data, not a replacement for the refuse/chip logic). P-90's acceptance items are unaffected by this card and this card does not gate on P-90, though both touch `render.ts`'s header block — see Sequencing.

## The accent color, and one thing still scoped rather than decided

**A. RULED 2026-09-03: the source HTML drives colors.** Operator instruction, verbatim: "the html i gave you drives colors." This resolves what was an open fork — the email's palette is now the authority for this card, not a choice between it and the engine's current values. The one-accent rule still holds; what changes is which hue is the one. See "The ruled palette" below for the full sourced mapping.

**B. The gold status dot stays a scope question, not a color question.** The email uses a small gold mark (`#B8933F`) narrowly, as a "changed since you last looked" / "not read" indicator — not as decoration. The *hex* is now ruled along with everything else; what still needs to be enforced at build time is that it stays scoped to that one semantic (a fixed, named use, the same discipline the confidence enum already has) rather than becoming a second decorative color available anywhere a designer likes. Acceptance item 5 makes this an explicit, checked constraint.

## The ruled palette

Every value below is taken verbatim from `smart-site-welcome-email-light.html`, mapped onto the nearest existing `template-tokens.ts` role by the role's own documented purpose (RPT1 §3), not guessed. Three rows are genuinely new tokens (no current engine equivalent); the rest are proposed replacements for an existing token's value.

| Engine token | Current | Ruled (from email) | Source in the email |
|---|---|---|---|
| `neutral100` (sheet ground) | `#f5f5f8` | **`#F4F2EE`** | page background |
| `text` (heaviest ink) | `#1d1f20` | **`#2A2A28`** | H1 headline / body headline ink |
| `neutral800` (proposed: body-primary role) | `#424244` | **`#3A3833`** | primary body paragraph |
| `neutral700` (proposed: body-secondary / dimension-tag role) | `#5d5d60` | **`#54524D`** | secondary body paragraph, absence-note body |
| `neutral600` (muted label, fine print) | `#7a7a7d` | **`#86867D`** | eyebrow label, step number, button border |
| `neutral200` (row rule, light) | `#e7e7ea` | **`#E4E1DA`** | card border / hairline — the email supplies one hairline weight, not two; `neutral300` is left unresolved, see below |
| `accent` (the ONE PDF accent) | `#5980a6` (steel) | **`#2C6B9E`** | link / button-arrow color on the light page |
| *(new)* accent-on-dark | none | **`#86ADDF`** | footer-band link — used only for text/marks placed inside the new dark band, never on the light sheet ground |
| *(new)* dark band fill | none | **`#2A2A28`** | header/footer band — same value as `text` above; one ink value does double duty as body-copy-on-light and solid-fill-on-dark, so this may not need a second token at all, just a second *use* of `text` |
| *(new)* absence-card fill | none | **`#FAF9F6`** | the "not read" callout box background |
| *(new)* status-gold (scoped, see B above) | none | **`#B8933F`** | the "not read" status dot only |

**What the email does not resolve, named rather than silently interpolated:** `neutral300/400/500/900` and the full `accent100`–`accent900` fill ramp (envelope tint, setback dash, etc.). The email supplies flat colors for specific roles, not a nine-step ramp — regenerating one from the new `#2C6B9E` base is implementation work for whoever builds this (same method the original steel ramp was presumably built with), not a value this card invents. Acceptance item 6 below is scoped to exactly this gap.

## Done looks like

A generated X-ray or Flood & Drainage PDF on the live engine carries the Smart Site mark (full lockup on the cover/header band, mark-alone on the footer band), rendered from a vendored asset, inside a dark band matching the email's treatment — no new light-background logo file required. The report's neutral palette reads warmer and closer to the rest of the product's collateral, resolved entirely through `template-tokens.ts`, with exactly one accent hue in use — `#2C6B9E`, per the ruled palette, never steel and the new blue both. Honest-absence content still refuses and still names the gap; if the card box treatment is adopted, it is a second, deliberate presentation of the same chip+reason data, not a parallel mechanism. Nothing here changes what a report says — only how it looks.

## Acceptance items

1. **Plan row exists.** OPS-16 amendment row opened for P-114; dispatch compiles against it (`node scripts/dispatch.mjs --plan OPS-16 --lane <ID> --plan-row P-114`). Depends on: operator approval of this WDLL. Check: dispatch compiles; canon-gate accepts.
2. **Accent ruling recorded.** `#2C6B9E` (from the source HTML) replaces `#5980a6` as the one PDF accent, per the ruled palette above; recorded as a decision file before any token edit lands. Check: decision in `_decisions/` naming the ruled hex and citing this card and the source HTML.
3. **Logo asset vendored.** `smart-site-lockup.svg` and `smart-site-mark-crosshair.svg` copied from hauska-map's brand folder into `packages/engine-core/assets/logo/`, rasterized to PNG at a resolution clean at both the header (~170×39-equivalent at PDF scale) and footer (~34×34) sizes used in the source email, loaded via a `resolveLogoDir()` helper mirroring the existing `resolveFontDir()` pattern. Check: asset loads with no network/file-system dependency outside the vendored copy; Docker-COPY note added alongside the existing fonts note.
4. **`drawLogo()` primitive added to `render.ts`'s shared export block**, callable by both `dossier.ts` and `flood-drainage.ts` without per-file reimplementation. A dark band (new neutral token, see item 6) hosts it in the header; a smaller band or inline placement hosts the mark-alone in the footer, next to or above the existing fine-print run — never overlapping or crossing the header rule per SHEET_STANDARD_v1 §3. Check: golden-byte test decodes the image object at the expected page position on a fixture.
5. **Gold status-dot scoped, if adopted.** If the card-box absence treatment (idea 3) is built, its status dot is a single named semantic (e.g., "new since last generated") wired through one constant, not a general-purpose color available to any future call site. Check: a lint/grep gate or a code-review note in the PR body naming every call site; more than the one named use fails review.
6. **Ramp gaps filled, not fudged.** `neutral300/400/500/900` and the `accent100`–`accent900` fill ramp have no source-HTML value (see "The ruled palette" above) and must be generated from the new endpoints by a real method (documented in the PR: e.g. an HSL lightness sweep matching how the original steel ramp was likely built), never eyeballed or copy-pasted from the old ramp's relative positions. Check: token file diff shows the generation method in a comment; no ramp step is a bare hex with no derivation note.
7. **Fonts unchanged.** Barlow / Barlow Condensed stay the PDF typefaces. Arial in the source email is an email-client-compatibility artifact, not a brand direction — explicitly not ported. Check: no new font family introduced; type roles (RPT1 §3 "roles, not sizes") reused, not new sizes invented for the eyebrow/step-number treatment.
8. **Both live reports carry the change from one edit.** X-ray (`dossier.ts`) and Flood & Drainage (`flood-drainage.ts`) both render the updated header/footer band and palette without either file duplicating the primitive. Check: diff touches `render.ts` / `template-tokens.ts` for the shared parts; per-file diffs in `dossier.ts` / `flood-drainage.ts` are wiring only.
9. **Regression suite holds.** The existing eleven SHEET_STANDARD regression tests pass unchanged where untouched; `vertical-rhythm.test.ts` passes; new tests cover the logo primitive and (if built) the absence card. Check: `pnpm test` green, new test count noted.
10. **Live verification on real bytes.** Live PDF for at least two parcels (including the standing gold parcel used elsewhere in this program) shows: the mark rendering cleanly at both placements with no artifacting, exactly one accent color present in the byte stream, and the honest-absence chips/reason sentences unchanged in behavior. Check: read the bytes, not a screenshot; grade on the deployed revision, not a merged PR (same discipline as P-90 item 9).
11. **Close hygiene.** Leave_behind declared; WDLL regraded item by item.

## Sequencing note (not an acceptance item, a planning flag)

This card and P-90 both edit `render.ts`'s header block. They are independent in *purpose* (this is visual skin, P-90 is correctness/refuse behavior) but not independent in *files*. Recommend either folding this into the same lane as P-90 or sequencing them back-to-back rather than running both in parallel worktrees against the same functions — planner's call at dispatch time, not decided here.

## Out of scope

The absence *mechanism* (chips, `REASON` map, `isCleanReasonSentence`) — visual skin only, per "What this is and is not" above. Feasibility or Comparison generate paths (P-32 stays SCOPED, do not start). Any change to `hauska-map`'s email templates or web UI. MCP delivery. A full second design-system audit beyond the four translated ideas named above.

## Amendments

**2026-09-03 — accent and palette ruled.** Operator: "the html i gave you drives colors." Resolved the accent-color fork (was acceptance item 2's open question) in favor of the source HTML wholesale, not just the accent hue: added "The ruled palette" section mapping every sourced value to its nearest engine token role, updated acceptance items 2 and 6 accordingly. The gold status-dot's *scope* constraint (item 5) is unchanged by this amendment — only its hex was ever in question, and that's now ruled too. Card's overall `operator_approval` stays `pending`; this amendment rules the color sub-question, not the whole card.
