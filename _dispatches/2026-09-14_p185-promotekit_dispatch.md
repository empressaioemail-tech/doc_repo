CANON-PREAMBLE v9e22f2c4
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v79be86e2 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: P-185 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map


## Mission — P-185 PROMOTEKIT AFFILIATES: every Smart Site checkout carries the referral, and a referred sale shows up on the affiliate's dashboard

You are a hand-carried lane on the property seat. You are the deepest worker: you do not spawn
sub-agents. The integration seat (overseer) reviews CP1 and CP2 in this thread. The operator
owns the PromoteKit dashboard (campaign, commission, cookie window) and Stripe test-mode keys.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### What PromoteKit needs (read at its dashboard 2026-09-14, Stripe Setup step 4)

Two tracking options, both enabled: affiliate links (`smartsite.cloud/?via=<affiliate>`) and
promo codes. The Stripe Checkout path, which is ours, has two halves:

1. The script on every page an affiliate can link to:
   `<script async src="https://cdn.promotekit.com/pk.js" data-promotekit="5d6458ec-b6b9-47df-a587-c2c255db7e8d"></script>`
   (the id is the public site id, not a secret). It sets `window.promotekit_referral`; it is
   NOT populated on localhost, so verification is on a deployed preview or production.
2. The referral id sent to Stripe when the checkout session is created:
   `metadata[promotekit_referral]` on the session, and for subscriptions ALSO
   `subscription_data[metadata][promotekit_referral]` (PromoteKit's "Subscription" tab), so
   renewals attribute. Optional: `window.promotekit.refer(email, stripe_customer_id)` to attach
   a signup by hand. Promo codes need `allow_promotion_codes=true` on the session.

### Where the code is (origin/main, read 2026-09-14)

- Site shell: hauska-map `apps/property-explorer/index.html` (one `<script type="module">`
  today; the PromoteKit tag goes in `<head>` on this page, which is every page of the app).
- Client: hauska-map `apps/property-explorer/src/lib/billingClient.ts` POSTs
  `/api/property-explorer/v1/billing/checkout` (subscriptions) and
  `/api/property-explorer/v1/entitlement/checkout` (per-parcel unlocks) through the cortex
  proxy; both bodies are where the referral id rides.
- Server: legacy-design-tools `artifacts/api-server/src/routes/propertyExplorer.ts` (routes at
  lines 1540 and 1887) call `artifacts/api-server/src/lib/brokerageStripe.ts`, which creates the
  session by form-encoded REST at line 280 (`stripePostForm("/checkout/sessions", ...)`), not
  the Stripe SDK; metadata is therefore `metadata[promotekit_referral]=<id>` as a form field.
- Webhooks in `brokerageStripe.ts` (`setPeAccessTierFromStripe`, subscription resolution) do
  not need to change; PromoteKit reads Stripe itself.

### Where you work

`hauska-map-p185-promotekit` (branch `feat/p185-promotekit-script-and-referral`) and
`legacy-design-tools-p185-promotekit` (branch `feat/p185-promotekit-checkout-metadata`), from
`origin/main`; declare start commits.

### What you build, in order

1. **Server first (safe without the client).** Both checkout routes accept an optional
   `promotekitReferral` string (validated: short, no whitespace; anything else ignored, never
   an error) and pass it as `metadata[promotekit_referral]` and, on the subscription route,
   `subscription_data[metadata][promotekit_referral]`; read whether `allow_promotion_codes` is
   already set and set it if not. Tests both ways: with the field the form body carries both
   keys; without it neither key appears. Merge on the conclusion string; deploy cortex-api
   under a lease (P-177's rule; check `_catalog/leases/` in your doc_repo worktree first).
2. **Client.** The script tag in `index.html` head; `billingClient.ts` reads
   `window.promotekit_referral` at checkout time (never cached at load, the script may land
   later) and sends it in both POST bodies when present. A unit test that a body without a
   referral has no field. Deploy through the Vercel CLI; verify the alias serves the tag.
3. **Verify by violation, on production or a deployed preview, with Stripe in test mode if the
   operator supplies a test key; otherwise a real $0 or promptly refunded checkout on the
   operator's say-so.** (a) Open `https://smartsite.cloud/?via=<test affiliate the operator
   creates>`; confirm `window.promotekit_referral` is set in the console; run a checkout; read
   the created session in Stripe (`gh`-style: `curl https://api.stripe.com/v1/checkout/sessions/<id>`
   with the operator's key, never printed) and paste that `metadata.promotekit_referral` equals
   the id; the operator confirms the referral appears in PromoteKit. (b) Open the site with no
   `?via=`, run a checkout, paste that the session has no such metadata. (c) A promo code
   PromoteKit issued applies at checkout.
4. **Records purchases.** The MCP connector's paid records requests (P-85/P-113) go through
   their own route; read whether they create checkout sessions; if they do, name it as a
   leave-behind with the route, do not change it this lane.

### Falsifiers

- If a session created from a `?via=` visit has no `promotekit_referral` metadata, the id did
  not travel; name which hop dropped it (script, client body, proxy, server form).
- If a session created without a referral carries the field, the client cached a stale value.
- If a subscription's `subscription_data` lacks the metadata, renewals will not attribute.

### Out of scope

Commission rates, cookie windows, payouts (the operator's dashboard). Affiliate-facing pages.

### Close

`_inbox/<date>_p185-promotekit_close.json`, `planRows` `["P-185"]`, with the PRs and merge SHAs
with conclusion strings, the revisions and deployment by field, the two session reads (ids,
metadata, no keys), and the operator's PromoteKit confirmation. `leave_behind` is required.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-14_p185-promotekit_cp1.json
  CP2: _inbox/2026-09-14_p185-promotekit_cp2.json
  CLOSE: _inbox/2026-09-14_p185-promotekit_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in P:/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p185-promotekit",
    "planRows": ["P-185"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
