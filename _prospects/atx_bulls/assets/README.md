# Assets

## What is here

| File | What it is | Caveat |
| --- | --- | --- |
| `atx-bulls-mark-on-ink.png` | Bull-head mark | 125×117, screenshot-derived, opaque background |
| `atx-bulls-lockup-on-orange.png` | ATX BULLS lockup | ~275px, screenshot-derived, orange background baked in |
| `reference-homepage-hero.png` | Live homepage hero | Layout reference only, not an asset to ship |

## Production art (fetch by URL)

```
https://atxbulls.com/bulls-logo-official.png       mark, 4096×4096, transparent
https://atxbulls.com/atx-bulls-official-logo.png   lockup, 4096×4096, transparent
https://atxbulls.com/af1-logo.png                  Arena Football One league mark, 485×205
```

The `Logo` component loads these and falls back to the local copies above.

## Photography (reference by URL — not downloadable)

```
austin-tough-banner.png     origin-story-2027.png    family-arena-2027.png
story-section-2027.png      uniform-reveal.png       merch-hero.png
hero-main-event.png         og.png                   atx-bulls-hero.mp4
```

All at `https://atxbulls.com/`. Hotlink protection blocks programmatic download, so these are
referenced live. They display in a browser; screenshot tooling renders them blank.

## Missing — please supply

- Vector or high-resolution transparent logo files (SVG/AI/EPS, or the 4096px PNGs as files).
- The photography set as files.
- Any secondary marks, sponsor lockups, or AF1 co-branding rules.

Nothing in this folder was drawn, reconstructed, or generated. The mark is the brand's own art.
