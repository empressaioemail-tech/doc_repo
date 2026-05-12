---
id: adr_012_atom_export_format
title: "ADR-012 — Atom export format (.atom and .atompack)"
status: active
last_updated: 2026-05-12
applies_to: portfolio
related: [adr_001_atom_architecture, adr_010_atom_graph_traversal, adr_011_atom_identity_across_versions, 05_living_lineage_thesis, 07_product_line_summary, 25_atom_architecture_reference]
owner: nick
---

# ADR-012 — Atom export format

> **Status posture.** Accepted as a high-level commitment to the format
> shape, file extensions, and MIME types. Specific view-template design,
> signature scheme details, LLM-bootstrap template, and atom-pack
> manifest schema are flagged as [Open for refinement](#open-for-refinement)
> and will be settled in follow-on design work.

## Status

**Accepted (high-level).** Originated 2026-05-12 during the velocity-through-2026 brainstorm session, in response to Nick's question "how do I download an atom and what does it look like once downloaded — it should be cool and special." This ADR commits to the format and ecosystem-shape choices that have ecosystem-stickiness (extension, MIME type, internal layout). Visual / template / schema specifics are refinement-deferred.

## Context

The atoms-as-portable-substrate strategic direction discussed in the velocity-through-2026 brainstorm requires atoms to be **downloadable as standalone, recognizable, verifiable artifacts**. Two consumer cases:

1. **Single atom export.** An architect, contractor, or city staff member downloads an atom (a parcel record, a finding, a comment letter) and uses it outside the platform — opens it locally, shares it via email, pastes its context into any LLM.
2. **Atom collection export.** A code rewrite firm (Code Studio, ZoneCo, Camiros) co-publishes a jurisdiction's atomized code as a single artifact a customer can drop into any compatible tool. The architect downloads "Bastrop.atompack," drags it into Claude, and immediately has Bastrop-jurisdictional grounding.

Without a settled format, three failure modes:

1. **Raw JSON downloads.** Atoms get exported as `parcel.json`. Functional but identity-free; the file doesn't announce what it is, doesn't render on its own, doesn't carry the Hauska brand, doesn't have a self-verification path. Distribution doesn't become branding.
2. **Per-product custom formats.** Cortex exports `.cortex-parcel.zip`; SmartCity OS exports `.smartcity-export.json`; Codex exports `.review-bundle.tar`. Three different formats for the same underlying atom contract. Distribution becomes balkanized.
3. **CID-only sharing.** "Here, look it up at this CID." Technically correct but requires the recipient to have IPFS tooling. Friction kills the wedge.

This ADR settles the format such that distribution becomes branding, atoms become portable across products, and the artifact carries enough identity and self-rendering to be valuable offline.

## Decision

**Atoms are exported as `.atom` files (single atom) or `.atompack` files (collections). Both are zip-format containers with a defined internal layout, reserved MIME types, and self-rendering view templates. The renderer is baked into atom registration via ADR-001's five rendering modes — `.atom` export uses the `focus` mode.**

Six sub-commitments:

### 1. File extensions and MIME types

- **`.atom`** — single atom export
- **`.atompack`** — atom collection export (one or many atoms bundled with a manifest)
- **MIME types reserved:**
  - `application/vnd.hauska.atom+zip`
  - `application/vnd.hauska.atompack+zip`

The vendor-prefixed MIME types claim namespace early. Even if `.atom` as an extension proves contentious in the open ecosystem later, the vendor prefix in the MIME type is unambiguous.

### 2. Internal layout (`.atom`)

A `.atom` file is a zip-format container. Standard internal layout:

```
parcel-bastrop-1042.atom
├── manifest.json        # CID, type, identity (DID), signature, ownership, format version
├── view.html            # self-rendering visual artifact (offline-capable)
├── atom.json            # the LLM-readable structured payload
├── chain.json           # event chain (lineage)
├── links.json           # CIDs of linked atoms with one-line summaries
├── llm-context.md       # paste-into-any-LLM bootstrap prompt
└── _signatures/         # cryptographic proofs
```

The format is **self-rendering**: opening the file (or extracting and opening `view.html`) presents a complete visual artifact without requiring the platform. The format is **LLM-ready**: `llm-context.md` is a paste-ready bootstrap that primes any chatbot to interpret the atom correctly.

### 3. Internal layout (`.atompack`)

Atom collections (a jurisdiction's full code, a property's full lineage, a curated reviewer training set) bundle as:

```
bastrop.atompack
├── manifest.json        # pack-level metadata: contents, version, jurisdiction, signature
├── index.html           # browseable pack viewer
├── atoms/
│   ├── code-section-001.atom
│   ├── code-section-002.atom
│   └── ...
└── llm-bootstrap.md     # one prompt to load the whole pack into any LLM
```

Each atom inside `atoms/` is a complete `.atom` file. The pack is conceptually a directory; structurally, individual atoms remain self-contained. A consumer can extract one atom from the pack and use it independently.

### 4. Renderer is part of the atom contract

Per [ADR-001](adr_001_atom_architecture.md), every atom registration provides five rendering modes: `inline` / `compact` / `card` / `expanded` / `focus`. The `focus` mode — already specified as the most complete renderer — produces the `view.html` for `.atom` export.

This means **zero net-new work in the atom contract**. The export is a packaging step over existing renderers. New atom types don't require renderer authoring twice; the contract guarantees coverage.

### 5. Identity references DID + CID

Per [ADR-011](adr_011_atom_identity_across_versions.md), the atom's DID is its identity-across-time and the CID is the per-version identifier. A `.atom` file's `manifest.json` carries both:

- `did` — the DID, for "resolve current state" semantics
- `cid` — the CID of this version, for "verify exactly this content" semantics

This means a downloaded `.atom` file can be **either** a snapshot ("I want the state of this atom as it was when I downloaded it") **or** a pointer to current state ("show me the latest version of this DID, of which this file is one historical snapshot"). The file supports both reads.

### 6. Verification is self-service

Every `.atom` file is verifiable end to end without contacting the platform:

- **Content verification:** hash the unpacked content against the `cid` in the manifest.
- **Signature verification:** verify `_signatures/` against the public keys in the manifest.
- **Network re-resolution:** look up the `did` against the IPFS / IPNS network; receive the current DID Document and confirm the file's CID is in the chain.

A right-click context menu integration in the eventual desktop client should expose "Verify CID..." as a first-class action.

## Alternatives considered

**Alternative 1 — Raw JSON exports.** Simplest. Rejected because the artifact doesn't announce identity, doesn't render, doesn't carry the brand. Distribution loses its strategic shape.

**Alternative 2 — Per-product custom formats.** Lower coordination cost short term. Rejected because it balkanizes distribution and undermines the atom-as-substrate strategic direction.

**Alternative 3 — CID-only sharing.** Pure IPFS-native. Rejected because it requires IPFS tooling on the recipient side and provides no self-rendering. Friction kills the wedge for non-technical users.

**Alternative 4 — Use existing format (JSON-LD, COSE, etc.).** Open standards exist. Rejected as primary because none combine: self-rendering view layer, LLM bootstrap, content addressing, atom-graph link semantics, and brand identity. We may *consume* JSON-LD inside `atom.json` for interop where useful; the container format remains Hauska-specific.

**Alternative 5 — Defer the decision.** Continue with ad-hoc exports per product. Rejected because the format choice has ecosystem stickiness — once consumers exist, changing the extension or MIME type is expensive. Locking in early is cheaper.

## Consequences

**Positive:**

- **Distribution becomes branding.** Every shared `.atom` file carries the Hauska mark, the format identity, and (where relevant) the city's mark. Files emailed, shared, posted in slack or social media all advertise the substrate.
- **Self-verifying, self-rendering.** Recipients can open and verify a `.atom` file offline. No dependency on the platform for the artifact to be useful.
- **LLM-ready out of the box.** "Copy LLM context" / "Open in Claude" workflows have a paste-target (`llm-context.md`). Bring-your-own-LLM users get immediate value.
- **Pack format unlocks the consultant channel.** Code rewrite firms can co-publish a jurisdiction's atomized code as a `.atompack`. Architects ask "is there a `.atompack` for Phoenix?" That question is the wedge that pulls jurisdictions into the network.
- **MIME-type registration claims namespace early.** Future ecosystem fragmentation risk is contained.
- **Zero net-new renderer work.** Atom contract's `focus` rendering mode already produces what `.atom` export needs.

**Negative / costs:**

- **Renderer discipline becomes load-bearing.** Every atom type's `focus` renderer must produce a polished, brand-consistent, offline-capable HTML view. New atom types can't ship without it. Real engineering cost.
- **Format versioning matters.** `manifest.json` carries a format version. Breaking changes to the format break all downloaded `.atom` files. Versioning policy needs care.
- **MIME-type registration is a real process.** Either IANA registration (slow, public, free) or de facto adoption (faster, ecosystem-dependent). Picking the path affects adoption timing.
- **Visual / template design becomes a brand commitment.** The view.html template is the public face of the Hauska atom. Design needs to be intentional and consistent; "looks cool" is load-bearing for the strategic story, not nice-to-have.
- **Signature scheme commitment.** `_signatures/` requires a specific cryptographic scheme. Picking it interacts with ADR-011 key management.

**Neutral:**

- Zip-format containers are well-understood; tooling exists in every language and platform. No technology risk in the container choice itself.
- The format can be made interoperable with existing standards (JSON-LD inside `atom.json`, COSE for `_signatures/`) without changing the container shape.

## Open for refinement

These items are explicitly deferred. Resolving them is what "refinement" means for this ADR.

- **`view.html` template design and brand language.** Visual treatment of the parcel passport / finding card / code-section excerpt. Type hierarchy, color palette, Hauska mark placement, city-mark placement. Cross-atom-type consistency. Needs design work, not just engineering.
- **Per-atom-type renderer specifications.** Each atom type (parcel-record, finding, adjudication-record, code-section, comment-letter, etc.) needs `focus` mode renderer that produces a coherent download artifact. Coordinate with atom registry expansion ([`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) Stream B).
- **`atom.json` schema.** Exact field shape, JSON-LD integration question, namespace prefixes.
- **`llm-context.md` template.** What does the LLM bootstrap actually say? How does it teach an arbitrary chatbot to interpret this atom? Length budget, prompt style, type-specific variations.
- **`manifest.json` format version policy.** Versioning scheme, deprecation policy, backward-compatibility window.
- **Signature scheme.** COSE, JWS, custom — choice interacts with ADR-011 key management.
- **`.atompack` manifest schema.** What does a pack's manifest carry beyond "list of atoms"? Jurisdiction metadata, code-edition info, freshness timestamps, pack-level signatures.
- **MIME type registration path.** IANA registration vs. de facto. Probably both — start de facto, formalize as adoption grows.
- **Right-click integration.** "Verify CID..." context menu integration in eventual desktop / native clients. Out of scope for web-only consumers but worth designing for.
- **Differential / delta packs.** When a jurisdiction's code amends, do consumers download a full new `.atompack` or a delta? Strategy for keeping packs fresh without re-downloading megabytes.
- **Privacy mode.** Sensitive atoms (PII-bearing parcels, attorney-client adjudications) need a redacted export mode. ADR-007 scope handling extends here.

## References

- [`adr_001_atom_architecture.md`](adr_001_atom_architecture.md) — atom contract; the five rendering modes this ADR's exports build on (`inline` / `compact` / `card` / `expanded` / `focus`)
- [`adr_010_atom_graph_traversal.md`](adr_010_atom_graph_traversal.md) — IPFS storage substrate; CIDs in `manifest.json` reference content in IPFS
- [`adr_011_atom_identity_across_versions.md`](adr_011_atom_identity_across_versions.md) — DID layer that gives `.atom` files a resolver for "current state" beyond the snapshot they carry
- [`05_living_lineage_thesis.md`](../05_living_lineage_thesis.md) — strategic foundation; portable atoms make the thesis operational
- [`07_product_line_summary.md`](../07_product_line_summary.md) — product line context; "Powered by Hauska Engine" brand pattern carried by every `.atom`
- [`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md) — atom architecture reference; renderer specification details to be extended as this format hardens
- [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) Stream B — atom registry expansion coordinated with per-atom-type renderer work

## Revision history

- **2026-05-12 (origin):** Drafted in response to Nick's "how do I download an atom and what does it look like — it should be cool and special" prompt. Captured as a high-level commitment to extensions, MIME types, internal layout, and renderer integration. Visual and template-design specifics deferred to refinement work. Companion to ADR-010 (storage) and ADR-011 (identity).
