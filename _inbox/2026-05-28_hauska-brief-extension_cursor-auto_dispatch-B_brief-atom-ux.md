---
date: 2026-05-28
agent: cursor-auto (Cursor, cente workstation)
repo: hauska-brief-extension
type: session
topic: dispatch_B_brief_atom_ux_wave7
dispatch_to: _dispatches/2026-05-28_dispatch-B_extension_brief-atom-ux.md
assignee: extension-agent
blocked_on: LDT /brief atoms field merged + deployed (can start 7a morph immediately)
---

# Dispatch B — Extension brief atom UX (wave 7)

**Repo:** `P:/hauska-brief-extension`  
**Atom vision:** `doc_repo/25_atom_architecture_reference.md` §5 inline mode  
**Planning kickoff:** `_inbox/2026-05-28_legacy-design-tools_cursor-auto_central-tx-property-brief_planning_kickoff.md`

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
