---
id: design_folder_readme
title: Design records — the convention
status: active
last_updated: 2026-09-14
owner: nick
---

# Design records

Every design decision in the portfolio lands here, with its source, so a later session can
reference it, re-open it, or re-publish it without re-deriving anything.

Established 2026-09-14 by operator ruling: "one folder for all these durable design components
and or notes, we will want all design decisions saved like this."

## Why this folder exists

A published design canvas is durable at its URL, but the **source that produced it** is not:
it is written in a session scratchpad that dies with the session. A design you cannot
regenerate is a screenshot. Keeping the source here makes a design editable a month later by
someone who was not in the room.

## Layout

```
_design/
  README.md                  this file
  INDEX.md                   one line per design; the file a session reads first
  <surface-slug>/
    README.md                artifact URL, decision record, status, what is pinned
    gen.mjs                  the generator; run it to rewrite the artboards
    _kit.css                 the frozen design tokens this surface draws with
    <Name>.dc.html           one artboard per file; Main is the entry artboard
    canvas.json              artboard layout, annotations, launch view
```

## Rules

**The source is the artifact, not the other way round.** Edit `gen.mjs`, re-run it, re-seed,
re-publish. Never hand-edit a `.dc.html` that a generator writes, and never edit the seeded
output file.

**One folder per surface, named for the surface.** `smartcity-overview-lens`, not `v2`, not
`design-3`.

**Every folder carries a README** naming the artifact URL, the decision record that ratifies
it, the current status, and anything deliberately pinned out of scope.

**Tokens are copied in, never invented.** `_kit.css` in a folder is a copy of the real frozen
kit from the product repo. If a design appears to need a token that does not exist, that is a
product-line decision, not a design change. Say so instead of adding one.

**A design record is not a decision.** The ratifying decision lives in `_decisions/`; this
folder holds the artefact and its source. Link both ways.

## Adding a design

1. Read the product's real tokens and component anatomy from the product repo at `origin/main`.
   Never design from memory or from a screenshot when source is reachable.
2. Build under `_design/<surface-slug>/`.
3. Publish the canvas; record the URL in the folder README and in `INDEX.md`.
4. File the ratifying decision in `_decisions/` and link it from the folder README.
