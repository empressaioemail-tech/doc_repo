---
id: 2026-05-28_dispatch-B_extension_brief-atom-ux
title: Dispatch B — Extension brief atom UX (wave 7)
date: 2026-05-28
agent: extension-agent
repo: hauska-brief-extension
kind: dispatch
related: [2026-05-28_central-tx-property-brief-scope, 75a_hauska_brief_extension, 25_atom_architecture_reference]
blocked_on: LDT `/brief` atoms field merged + deployed (7a morph can start immediately)
---

# Dispatch B — Extension brief atom UX (wave 7)

You are the **extension-agent**, single owner of `hauska-brief-extension` for this run.

**Atom vision:** [`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md) §5 inline mode  
**Scope ref:** [`2026-05-28_central-tx-property-brief-scope.md`](2026-05-28_central-tx-property-brief-scope.md)

## Model (HR-12)

Default: **Grok Build 0.1**. **grok-code-fast-1** OK for 7a morph-only pass.

## Tasks (ordered by leverage)

1. **Remove listing morph (7a)** — `inject.css` `:host(.is-expanded)` border-radius transition; panel opens at fixed radius instantly (`intel-panel.js`). **No backend dependency — ship first.**

2. **Research layout (7b)** — property list left column (`GET /workspaces/recent`); hide `#citations-panel` in consumer `presentationMode`.

3. **Inline atoms in chat (7c)** — render `response.atoms.inlineRefs` as expandable chips in assistant bubbles; optional parse `{{atom:type:id:label}}` from `messageHtml`.

4. **Deep-link** — read `atoms.workspaceDid` from `/brief` for workspace identity.

## API contract (from LDT — live after Dispatch A deploy)

```json
"atoms": {
  "workspaceDid": "did:hauska:property-workspace:<listingKey>",
  "briefRunDid": "did:hauska:brief-run:<runId>",
  "placeLayers": [
    {
      "did": "did:hauska:place-layer:regrid-parcel:…",
      "entityType": "place-layer-regrid",
      "adapterKey": "regrid:parcels",
      "layerKind": "regrid-parcel",
      "status": "ok"
    }
  ],
  "inlineRefs": [
    {
      "did": "did:hauska:code-section:<atomId>",
      "entityType": "code-section",
      "entityId": "<atomId>",
      "label": "ADU requirements",
      "mode": "inline"
    }
  ]
}
```

Also: `property.llUuid` on brief response when Regrid returns parcel.

## Acceptance

- No pill→rectangle morph on listing page.
- Consumer research: no permanent citations sidebar.
- Tapping inline ref expands inside chat thread (not right panel).
- Property list replaces sidebar as primary nav in deep research.

## Do NOT

- Reintroduce Compass-style permanent citation rail for consumer mode.
- Paywall UI (deferred).

## Report back

`P:/doc_repo/_inbox/2026-05-28_hauska-brief-extension_extension-agent_brief-atom-ux_close.md`

Include version bump, screenshots or screen recording for 7a/7b/7c, blockers verbatim.
