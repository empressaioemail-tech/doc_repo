---
id: 2026-08-31_p91_disposition_union_defect
title: The node disposition union cannot express unknown, so the MCP silently rewrites it to absent and strengthens a claim cortex never made
date: 2026-08-31
status: OPEN defect, MCP-side, not cortex
severity: high. It manufactures a claim, it is invisible from outside, and it violates an invariant this file states in its own comment.
plan_row: P-91
found_by: W2 answer-key preparation (harness chat pulled ground truth on six fixtures and saw landUse read unknown at stub and absent at node on the same parcel and the same bake). Root cause read from the write path by the planner.
snapshot: legacy-design-tools, artifacts/smartsite-mcp/src/tool-honesty.ts and src/constants.ts at origin/main 03050926 (p563, serving smartsite-mcp-00078-fat)
---

# The observation

Land use returns `unknown` at `depth: "stub"` and `absent` at `depth: "node"`, on the same parcel, from the same bake. Confirmed across all six Bastrop fixtures, so it is one systematic defect and not six data faults.

Per this program's own display vocabulary those are different claims. `unknown` is "not a finding either way. The record neither confirms present nor earns a verified absence." `absent` is "the source claims no record exists." One reports that nothing was established; the other reports that a source affirmatively said there is nothing. The second is a claim about the world. The first is not.

# The mechanism, read from the write path

There are two disposition vocabularies for the same facets and they are not the same set.

The stub vocabulary, published in the `get_smart_site` tool description at `src/constants.ts:14`:

    present | absent-verified | unknown | refused | unread

The node vocabulary, `EXTERNAL_BRIEF_SECTION_DISPOSITIONS` at `src/tool-honesty.ts:218`:

    present | refused | absent | unread

They overlap on `present`, `refused` and `unread`. Stub carries two states node cannot express, `unknown` and `absent-verified`. Node carries one state stub does not use, `absent`.

The rewrite happens in `sectionDisposition`:

    const derived = derivedSectionDisposition(section);   // no data -> "absent"
    const claimed = asExplicitDisposition(section.disposition);
    if (claimed === null) return derived;

`asExplicitDisposition` tests membership in the node union. A cortex `unknown` is not a member, so it returns `null`, so the claimed disposition is discarded and the derived one is returned. `derivedSectionDisposition` returns `refused` if a refusal rides along, `present` if data exists, and otherwise `absent`. A facet that is honestly unknown carries no data, so it lands on `absent` every time.

The function's own doc comment says "A missing or unrecognised disposition derives", which is exactly what happens. The defect is that `unknown` is not missing and is not unrecognisable; it is a valid wire state this union simply does not list.

# Why this is worse than a display bug

Eleven lines above the function, the same comment block states the invariant:

    The wire may weaken a claim, never strengthen one.

`unknown` to `absent` is a strengthening. It converts "we did not establish this" into "the source says there is none". That is the single direction the file declares off-limits, and it is being done by the type union rather than by any line of logic, which is why no reviewer caught it and why no test failed.

`absent-verified` degrades through the same hole in the other direction: with no data it also derives to `absent`, losing the provenance-or-vintage that made the absence verified. That direction is a weakening and so is permitted by the invariant, but it is still an information loss and the same root cause.

# Why no test caught it

Every fixture in the 452-test suite exercises the node path with dispositions drawn from the node union. Nothing feeds a `unknown` or `absent-verified` section into `sectionDisposition` and asserts what comes out. The check that would have caught this is a two-derivation check: the stub rail and the node section for the SAME facet on the SAME parcel must not disagree about that facet's state. Neither derivation currently knows the other exists.

# Consequences to grade against, not to guess at

This lands squarely on two W2 functions and it is the reason the W2 answer key had to be built before the walk. F1 screening and F5 outreach targeting both justify a screen using rail states, so a rail that says `absent` where the record says `unknown` gives a screen a reason it has not earned. Any prose composed from a node read will describe land use as affirmatively absent on every one of the six fixtures.

It also means the derived-figures and honest-absence work shipped in p563 sits on top of a value that was already wrong before any display string was attached. The vocabulary made the wrong token print nicely.

# The fix, and the one to avoid

Wrong fix: add `"absent"` handling upstream, or map `unknown` to something friendlier at display time. That paints over a semantic error with a nicer word.

Right fix: make the node union express what the wire can actually say. Add `unknown` and `absent-verified` to `EXTERNAL_BRIEF_SECTION_DISPOSITIONS`, and make `sectionDisposition` preserve a claimed state it recognises rather than deriving over it. The derive path stays as the fallback for a genuinely missing or malformed disposition, which is what its comment already describes.

Then add the check that was absent: for a given parcel and facet, the stub rail and the node disposition are two independently derived readings of one fact and must agree. That is a meaning-shaped check with two real derivations, not a presence check, and no sentinel can satisfy it.

Verify by violation before reporting it fixed: feed a section with `disposition: "unknown"` and no data, and confirm the output is `unknown`. Then feed the stub and node paths the same fixture and confirm a deliberate disagreement fails.

# Scope note

This is `artifacts/smartsite-mcp/`, which this seat owns, so it is a card rather than a handoff. It does not need cortex and does not touch another seat's worktrees.
