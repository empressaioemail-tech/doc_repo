## Mission — P-239: the PDF masthead must use the real logo, not a redrawing of it

### The finding you are acting on

Operator-reported from a generated `908 PINE / 48021:34137` PDF: the masthead logo is a
hand-redrawn approximation, not the brand asset.

**The canonical assets exist and are versioned**, in hauska-map:

```
apps/property-explorer/docs/smart-site-brand/logo/smart-site-mark-crosshair.svg
apps/property-explorer/docs/smart-site-brand/logo/smart-site-lockup.svg
apps/property-explorer/docs/smart-site-brand/tokens/{colors,typography,pe-tokens}.css
apps/property-explorer/docs/smart-site-brand/DESIGN_SYSTEM_BRIEF.md
apps/property-explorer/docs/smart-site-brand/v2/{SPEC.md,IMPLEMENTED.md}
```

**hauska-engine, which renders the PDFs, contains NO brand asset at all.** That is the actual
problem. The chrome had nothing to reference, so a mark was reproduced by hand.

Measured deltas against canon:

| | canonical | what ships today |
|---|---|---|
| stroke-width | 4 | 3 |
| centre dot radius | 6 | 5 |
| tick length | 18 | 14 |
| wordmark font-size | 34 | 40 |
| wordmark gold | `#F5B95C` | `#B87116` |
| viewBox | `0 0 320 76` | `0 0 420 96` |

**A colour change for paper is defensible.** `--ss-gold #E8963B` is 2.3:1 on `--ss-paper` and
fails as text, which is the documented reason `--ss-print-gold` exists. **The proportions are
not defensible.** Stroke weight, dot radius and tick length have no paper justification; they
are simply what a redrawing produces.

### How this happened, so you do not repeat it

The integration seat saved Claude Design's redrawn SVGs into `_design/report-chrome/` as this
row's assets, and the P-228 lane implemented from them in good faith. Nobody compared them to
the canonical file. The design brief in that folder even refers to `assets/logo.svg` as "the
untouched original" without anyone resolving where that file actually is.

**So `_design/report-chrome/logo-*.svg` are NOT canon. Do not treat them as the source.** Treat
them as what they are: a redrawing that shipped.

### START HERE

**Read `v2/SPEC.md` and `v2/IMPLEMENTED.md` before anything else.** There may be a newer brand
than the one being copied, and fixing a PDF to match a superseded logo is the same defect with
a different date on it. State which version you targeted and why.

### Done looks like

The PDF masthead mark and the running-header mark are **derived from the canonical asset** —
vendored with a recorded source path and version, or generated from it — so the two cannot
silently drift. Proportions match canon exactly. Any paper-only colour substitution is
explicit, minimal, and justified against a stated contrast ratio against `--ss-paper`.

The cross-repo part is the real work: hauska-engine needs a defensible way to hold a
hauska-map-owned asset. Vendoring with a recorded source path and version is acceptable.
Silently copying a file is what produced this row.

### Falsifiers, pre-register your answers before you run anything

1. **Diff your rendered mark's geometry against the canonical SVG numerically** — stroke-width,
   dot radius, tick length, viewBox. If any differs and you cannot state a paper reason for
   that specific difference, it is a redrawing again.
2. If you targeted the v1 assets without reading `v2/SPEC.md`, you may have just re-implemented
   a superseded brand. Say which version you used.
3. **Generate a PDF and decode it** to confirm the masthead renders — and remember this repo's
   own hazard: pdf-lib `StandardFonts` carry no ToUnicode CMap, so wordmark TEXT drawn in them
   is invisible to the decoder. If the wordmark is text rather than paths, verify it decodes.
4. If your change alters any sheet BODY content, you exceeded scope.

### Known traps

- **hauska-engine has NO deploy workflow.** A merge ships nothing and nothing says so. Your
  work is not live when merged; say so plainly in the close.
- The mark renders on EVERY continuation sheet. Whatever you embed is embedded once per sheet —
  this is why the ~14 KB C2PA manifest was stripped from the redrawn SVGs. Keep the asset small.
- `assets/logo.svg` is referenced in the design brief as the untouched original for dark
  grounds. **Resolve where that file actually is** rather than assuming it is one of the two
  paths above; if it does not exist, say so, because a brief citing a file nobody can find is
  its own defect.

### Do not

- Do not change the brand. This row makes the PDF use the real one.
- Do not edit the canonical assets in hauska-map. You are a consumer of them.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

State which brand version you targeted, the source path and version you recorded, and the
numeric geometry diff against canon. Close to `_inbox/` on doc_repo main and PUSH it. Declare
`leave_behind` explicitly. State your snapshot (repo, branch, commit).
