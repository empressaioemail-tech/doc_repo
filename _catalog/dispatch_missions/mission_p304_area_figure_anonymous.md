## Mission — P-304: the withheld area figure stops reaching anonymous callers

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` and, only if your design
needs it, `hauska-map`, one PR per repo. You do not deploy.

### Where you work

Fresh clones from `origin/main` under `P:/tmp/` into NEW directories: `legacy-design-tools` (main
`c40423a5` at compile) and `hauska-map` (main `93f832b6`), branch `fix/p304-area-figure`. Register
each clone under the property seat and remove the entries at close. Lanes P-259b (LDT zoning
stamp) and P-303 (map `atom-chain-to-facets.ts`) are open. Stay out of their files.

### The finding (A-205, measured 2026-09-17)

- The 2026-09-11 ruling (`_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`) draws the
  modelled polygon and refuses the buildable area and percent until an envelope atom backs them.
- `artifacts/api-server/src/routes/brokeragePlaceBuildableEnvelope.ts` returns
  `payload.geojson.features[].properties.buildableAreaSqFt` and `buildableAreaPct` on every drawn
  envelope. Measured on production and the P-249 canary, for example Hays `48209:97658`: 5,022 and
  58.3, from an unverified atom.
- `apps/property-explorer/api/spine.ts` allowlists `POST api/brokerage/v1/place/buildable-envelope`
  for anonymous callers, so anyone can read those figures through smartsite.cloud.
- The surfaces withhold them on their own: the panel with `figureWithheld`, and the MCP draw
  block with `derivedFigures.denies`. The route does not.

### What to build

1. Decide where the figure is withheld at the source: in the route (omit the two properties
   unless the envelope atom is depth-warm verified, per the same predicate P-249 uses), or in the
   anonymous proxy (strip them). State the choice and why. Prefer the one that also protects
   authenticated callers that are not supposed to print the figure.
2. List every consumer of those two properties (the panel, `live-envelope-augment.ts`, the MCP draw
   block, the PDF and site plan in hauska-engine, anything else) and what each does after the
   change. A verified envelope must still carry its figure where a surface is entitled to print it.
3. Tests in both directions: an anonymous POST for an unverified parcel returns no area figure; a
   verified-atom fixture returns it where entitled.
4. A live probe the integration seat can run after deploy: the exact request and the field it
   must not contain.

### Falsifiers, pre-register your answers first

1. After the change, the route response for an unverified fixture contains neither property
   (test).
2. A verified fixture still carries them (test).
3. Reverting the change fails a test.

### Do not

- Deploy, merge, or change the verification predicate itself.
- Launch sub-agents.

### Close

Snapshot per repo; files touched; each PR with every CI check's literal conclusion string; the
consumer list; the falsifiers with evidence; the live probe. `status`: `closed-partial` until the
integration seat deploys and the live probe passes. `probe`: `{"notApplicable": "build lane;
graded by the integration seat's anonymous POST after deploy"}`. `subAgents`. `leave_behind`.
