---
id: 2026-08-29_smartsite_mcp_app_design_handoff
title: Design handoff — Smart Site MCP companion app (tokens, rules, and what differs from PE)
status: ready
last_updated: 2026-08-29
plan_row: P-91, P-92
source_of_truth: P:/tmp/Smart Site Design System
app_tokens: hauska-map apps/property-explorer/src/styles/pe-tokens.css @ 6360670
---

# Design handoff — Smart Site MCP companion app

Hand-carry the block below to the MCP app agent. It is written to be pasted whole.

The one thing that makes this different from every other Smart Site surface: the
MCP app renders inside Claude's chat, not inside the Property Explorer document.
`var(--ss-*)` resolves against the DOM a component renders in, and PE's stylesheet
is not there. **The app must declare the tokens itself or every one of them paints
nothing.** That is the single largest way this handoff can be got wrong.

---

## THE BLOCK

You are building the Smart Site MCP companion app. This is the design contract.

### 1. The palette does not travel. Ship it.

Smart Site's tokens live in `apps/property-explorer/src/styles/pe-tokens.css`,
which is loaded by the Property Explorer document. Your app renders in Claude's
chat, in an iframe, from HTML your server builds. **None of those tokens exist
there.** A `var(--ss-blue)` in your markup with no local declaration paints
nothing, and `var(--token, fallback)` is banned for reasons in section 5, so you
cannot paper over it.

Declare this `:root` block in the HTML you serve. It is the live palette at
commit `6360670`, Light Charcoal with the depth pass. 66 tokens.

```css
:root {
  /* Ground. Three planes: recessed, panel, lifted. */
  --ss-void:       #2A2A2B;
  --ss-ink:        #323234;
  --ss-raised:     #3F4043;
  --ss-ink-94:     #323234;
  --ss-ink-92:     #323234;
  --ss-ink-90:     #323234;
  --ss-ink-96:     #323234;
  --ss-raised-97:  #3F4043;
  --ss-raised-98:  #3F4043;
  --ss-scrim:      rgba(23,23,25,.72);

  /* Hairlines. Three weights, one hue. Do not add a fourth. */
  --ss-line-06:    #414247;   /* rules INSIDE a surface */
  --ss-line-14:    #56575C;   /* the edge OF a surface */
  --ss-line-28:    #8A8A8F;   /* any control whose border is its only affordance */

  /* Text. t1 brightest, t6 faintest. */
  --ss-t1:         #FBFBFC;
  --ss-t2:         #EEEFF1;
  --ss-t3:         #D6D8DB;
  --ss-t4:         #B0B2B6;
  --ss-t5:         #A9ABAF;
  --ss-t6:         #999B9F;

  /* Action. Blue is the ONLY action colour. */
  --ss-blue:       #86ADDF;
  --ss-blue-bg:    #37424C;
  --ss-blue-line:  #54718E;

  /* Reserved hues. Each has exactly one job. */
  --ss-gold:       #E8963B;   /* brand mark and the unread dot. Nothing else. */
  --ss-gold-lt:    #F5B95C;   /* the word SITE in the wordmark */
  --ss-atom:       #6FC1B8;   /* an openable record */
  --ss-slate:      #A9ABAF;   /* absence: a thing that is not on file */
  --ss-sky:        #2C6B9E;   /* map geometry only. Never inside a panel. */

  /* Semantic. Always paired with a word, never colour alone. */
  --ss-ok:         #74AF8D;
  --ss-warn:       #CFB165;
  --ss-err:        #D38577;

  /* Motion. One curve, four durations. */
  --ss-ease:       cubic-bezier(.2,.6,.35,1);
  --ss-d-tint:     100ms;
  --ss-d-state:    140ms;
  --ss-d-move:     180ms;
  --ss-d-open:     220ms;

  /* Type. Six UI steps plus one allow-listed display step. */
  --ss-ui:         ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --ss-mono:       ui-monospace, "SF Mono", Menlo, monospace;
  --ss-brand:      Oxygen, var(--ss-ui);
  --ss-fs-label:   11.5px;
  --ss-fs-meta:    12.5px;
  --ss-fs-body:    14.5px;
  --ss-fs-value:   15.5px;
  --ss-fs-subject: 17.5px;
  --ss-fs-title:   26px;
  --ss-fs-display: 32px;

  /* Geometry. */
  --ss-h-control:  36px;
  --ss-h-dense:    30px;
  --ss-h-field:    40px;
  --ss-h-find:     46px;
  --ss-h-head:     42px;
  --ss-bubble:     40px;
  --ss-dock-w:     380px;
  --ss-find-w:     436px;
  --ss-inset:      20px;

  --ss-r-chip:     8px;
  --ss-r-touch:    10px;
  --ss-r-tip:      12px;
  --ss-r-float:    14px;
  --ss-r-modal:    18px;

  /* Elevation. A 1px top highlight, a close contact shadow, then the ambient. */
  --ss-sh-rail:    inset 0 1px 0 rgba(255,255,255,.05), 0 2px 6px rgba(0,0,0,.30);
  --ss-sh-dock:    inset 0 1px 0 rgba(255,255,255,.05), 0 2px 6px rgba(0,0,0,.30), 0 14px 34px rgba(0,0,0,.42);
  --ss-sh-modal:   inset 0 1px 0 rgba(255,255,255,.06), 0 28px 72px rgba(0,0,0,.52);
  --ss-sh-tip:     0 8px 20px rgba(0,0,0,.38);
  --ss-sh-focus:   0 0 0 3px rgba(134,173,223,.67);
  --ss-sh-open:    0 2px 8px rgba(0,0,0,.22);
  --ss-sh-inset:   inset 0 1px 3px rgba(0,0,0,.32);
}
```

Do not rename a token. Do not add one without saying so explicitly. If your
surface needs a colour this set does not carry, say which and why rather than
inventing one, because the next palette change will not know about it.

### 2. Five rules. Three are CI-enforced in the app; all five bind you.

1. **Gold is the brand mark and the unread dot.** Never a button, link, fill or
   hover. In the app this fails the build outside five allow-listed files.
2. **No solid blue fills on buttons**, money surfaces included. Primary is a quiet
   outline and emphasis comes from a blue GLYPH. Blue is links, citations, focus.
3. **The ramp and radii are fixed sets.** Six UI type steps, five radii. Values are
   editable; a seventh UI size needs a conversation. `--ss-fs-display` (32px) is
   NOT a UI step — in the app it is allow-listed to four commerce surfaces and
   never appears in a panel, dock, row, chip, or over the map.
4. **`--ss-t6` is legal on `--ss-ink` grounds only.** On `--ss-raised` it measures
   3.90:1 and fails. Meta on a raised surface takes `--ss-t5`.
5. **`--ss-line-06` is a row separator and nothing else.** It is not a hover fill
   and not a control border. A control whose border is its only affordance uses
   `--ss-line-28`, which is the one hairline that clears 3:1.

### 3. Three mechanics that are not obvious and have each cost a day

**Washes are DERIVED, never spelled.**

```css
background: color-mix(in oklab, var(--ss-warn) 13%, transparent);
border:     1px solid color-mix(in oklab, var(--ss-warn) 34%, transparent);
```

Not `rgba(207,177,101,.13)`. A spelled wash is a second copy of a token value that
cannot follow it. The app had **169** such sites, invisible to every hex grep
because they were decimal rgb triples inside template strings. 13/34 is calibrated
for a CHIP. A NOTE-sized surface takes `--ss-ink` with a state-coloured border and
**no fill** — a large surface tinted with a state colour reads as a state of the
whole panel.

**The `var(--token, <literal>)` fallback form is banned.** A fallback looks like it
respects the token while being a second source of truth that surfaces only when the
first is missing — it hides exactly the failure it claims to handle. If a token can
be absent, that should break loudly. This is also why section 1 matters: you cannot
rely on a fallback to cover a missing declaration.

**`box-shadow` REPLACES, it does not stack.** Fields sit at `--ss-void` with
`--ss-sh-inset`. A focus rule that sets `box-shadow: var(--ss-sh-focus)` flattens
the field at the exact moment it is being used. Compose them:
`box-shadow: var(--ss-sh-inset), var(--ss-sh-focus)`.

### 4. Your context differs from the app's in three ways. Reason from these.

**No map underneath.** The app's chrome is fully opaque because it floats over
bright aerial imagery, where canopy and roofs bleed through anything translucent.
You have no map, so that reasoning does not transfer — but stay opaque anyway for
coherence, and because Claude's chat ground is not yours to predict.

**You do not own the ground.** The app owns its whole viewport. You are a panel in
someone else's document. Do not assume the surrounding background; give your root
container an explicit `--ss-ink` (or `--ss-void`) background rather than inheriting.

**Nothing external loads.** No CDN scripts, no web fonts, no remote images. The
type stack is system fonts on purpose — `--ss-brand` names Oxygen and there is no
Oxygen binary anywhere in this operation, so it falls back to the system stack.
Do not add an `@import` for it; the app's own CSP blocks that twice over
(`style-src 'self' 'unsafe-inline'`, `font-src 'self' data:`) and yours should be
assumed at least as tight.

### 5. Voice. This is as load-bearing as the palette.

Plain, declarative, slightly blunt. An operator writing for an operator.

- **Sentences state a fact and stop.** No hedging, no marketing.
- **Absence is stated, never hidden.** The pattern is a title naming the gap and
  one sentence explaining the read: *Not read — the county's parcel id does not
  match the appraisal record, so zoning is unavailable.* Never "No data available",
  and never a raw internal token. A live PE surface printed
  `LANDUSE_JOIN_HOLD county 48491 — TxGIO prop_id does not join CAD
  property_use_code` into a customer field; that is the defect, not the standard.
- **Absent, zero and unmeasured are three different states.** Collapsing them is
  the defect this product exists to prevent. A fabricated zero is worse than an
  absence because it enters averages without announcing it was invented.
- **County data is verbatim.** `927 MAIN ST, BASTROP, TX 78602`, parcel
  `48021:33223`, dates ISO `2026-08-29`. Never re-title-cased.
- **Labels uppercase in chrome, sentence case in prose.** Panel headers are
  `--ss-fs-label`, weight 700, `.13em`, uppercase.
- **No emoji. No exclamation marks.** Numbers exact, never rounded for effect.
- Status words are single words: `Researching`, `Passed`, `Offer`, `Verified`.

### 6. What to send back

Say which tokens you used and which you needed and did not find. If you added a
surface the design system has no primitive for, name it — the system is at 16
components and grows by evidence, not by invention.

If a colour in your app cannot be expressed by this palette, that is a real finding
and worth a conversation. Inventing a hex and moving on is what produced the 169
sites above.

---

## Notes for the planner, not for the agent

The MCP app is the first Smart Site surface that does not inherit `pe-tokens.css`.
That makes it the second consumer of the palette, and the moment a palette becomes
a shared contract rather than one file's contents. Two consequences worth watching:

The parity check in P-95 acceptance item 1 diffs the design system folder against
`pe-tokens.css`. It does not know about the MCP app. When the MCP app ships its own
block, there are three copies and only two are checked. That should become a
three-way check or the MCP app should be generated from the same source.

`--ss-slate` was found stale during this handoff (a warm Stone value in a neutral
palette, also failing contrast on `--ss-raised`) because reading the tokens out for
a second consumer is a different instrument than any check that runs today. Fixed
at `6360670`. Expect more of that class as the second consumer lands.
