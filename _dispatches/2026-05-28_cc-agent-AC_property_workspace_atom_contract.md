---
id: 2026-05-28_cc-agent-AC_property_workspace_atom_contract
title: Dispatch — Property workspace atom contract for Brokerage V1
date: 2026-05-28
agent: cc-agent-AC
repo: hauska-atom-contract
kind: dispatch
related: [75a_hauska_brief_extension, 01a_atom_conventions, _decisions/2026-05-28_brokerage_v1_expanded_scope]
---

# Atom contract slice for Brokerage V1 (3c foundation)

You are `cc-agent-AC`, owning contract definitions only.

## Goal

Define and publish v1 contract types for brokerage workspace packaging:

- `property-workspace`
- `brief-run`
- `workspace-attachment`
- `workspace-share-edge`

## Scope

In scope:
- New contract schemas/types.
- Validation helpers and fixture examples.
- Exported types used by `hauska-engine` and `legacy-design-tools`.
- Semver bump and changelog entry.

Out of scope:
- Engine ingestion or storage implementation.
- API route wiring in `legacy-design-tools`.

## Required fields (minimum)

- Common metadata: `did`, `createdAt`, `updatedAt`, `accessPolicy`.
- `property-workspace`: address identity, listing URL(s), owner, collaborator refs.
- `brief-run`: workspace ref, run inputs, citation refs, confidence, generatedAt.
- `workspace-attachment`: workspace ref, kind (`link|image|pdf|note`), uri/body, uploader.
- `workspace-share-edge`: from-user, to-user, workspace ref, sharedAt, consent flags.

## Acceptance criteria

- [ ] Types compile and export cleanly.
- [ ] Example fixtures pass schema validation.
- [ ] Changelog and version bump included.
- [ ] Clear migration notes for downstream consumers.

## Report back

Write inbox close file:

`P:/doc_repo/_inbox/2026-05-28_hauska-atom-contract_cc-agent-AC_property_workspace_atom_contract_close.md`

Include PR URL, tag/version, schema diff summary, and consumer guidance.
