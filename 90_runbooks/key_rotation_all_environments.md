---
id: key_rotation_all_environments
title: Rotating a service key — every environment of every consumer, with a surface check as the closing step
status: active
last_updated: 2026-09-17
applies_to: agent-ops
owner: nick
plan_row: P-305
related:
  - _decisions/2026-09-16_engine_api_key_rotation_and_tag_cleanup.md (P-251, the rotation that missed Preview)
  - _inbox/2026-09-17_p305-key-inventory.md (the consumer inventory this runbook requires first)
  - scripts/inventory-key-consumers.mjs (producer of that inventory; --selftest needs no network)
  - scripts/check-preview-key-drift.mjs (the closing check; --selftest needs no network)
  - 90_runbooks/cc_agent_node_tls_workaround.md (Node CA trap, if the check is run from Node on this workstation)
  - 90_operations/OPS-16_texas_market_plan_of_record.md (row P-305)
  - _inbox/2026-09-16_add084_production_credential_rotation_plan.md (P-278, the database-credential rotation — same shape, bigger surface)
---

# Rotating a service key: every environment of every consumer

## NO SUCH RUNBOOK EXISTED BEFORE 2026-09-17

This file was written on 2026-09-17 by the P-305 lane, because the dispatch for that row said to find
the key-rotation runbook and add the rule to it, "if no runbook exists, write the smallest one and say
so". The search was run first and its result is the reason this file exists:
`_inbox/2026-09-16_add084_production_credential_rotation_plan.md` is a plan for the **database**
credential (P-278), not this class; `_decisions/2026-09-16_engine_api_key_rotation_and_tag_cleanup.md`
is the record of ONE rotation; and `90_runbooks/` held no rotation runbook of any kind. So this is the
smallest one that carries the rule, and the rule is the only thing here that is new.

## The rule

**A rotation is not complete when the value changes. It is complete when EVERY environment of EVERY
consumer resolves the new value, and the closing check has read that on the surface.**

Corollaries, each one earned by an incident:

1. **"Every consumer" is a listing, not a memory.** The discovery method must be able to see consumers
   outside the system you are rotating in. `gcloud run services describe` structurally cannot see a
   Vercel project; that is exactly how the sixth consumer of `HAUSKA_ENGINE_API_KEY` was missed
   (P-251, `_decisions/2026-09-16_engine_api_key_rotation_and_tag_cleanup.md`, "Correction").
2. **"Every environment" is at least Production, Preview and Development** for any non-GCP consumer
   that has them. Vercel keeps them as separate variable sets; writing one says nothing about the
   others. The P-251 rotation reached `property-explorer`'s Production and left its Preview stale, so
   every preview failed its panel read with `retrieval_auth_failed` (A-205).
3. **A consumer keyed by a `secretKeyRef` only picks up a new version on a NEW revision.** An
   already-serving Cloud Run revision has the resolved version baked in permanently. Minting a version
   is not a rotation; a redeploy is.
4. **The closing check is a SURFACE read, not a store read.** A store instrument is green while the
   credential leg is refused (A-183). `scripts/check-preview-key-drift.mjs` reads the same panel route a
   customer's browser reads.
5. **Never destroy the old version in the same pass.** Disable is reversible; destruction is not.

## Step 0 — the consumer inventory, and it is a gate

Run it and paste its output into the rotation's record:

```
node scripts/inventory-key-consumers.mjs --out _inbox/<date>_<keyname>_inventory.json
```

- `ok: true` (exit 0) means every listing was read. **Any unreadable project or resource stops the
  rotation**: an unreadable listing is a possible consumer, and a rotation that proceeds without it is
  the A-205 failure with a different noun (`AGENT_CONTRACT` section 5, "an empty result is NOT an absence").
- The listing's own gaps are named in its `statedGaps` and are in scope for the rotation's judgement:
  local `.env` files, GitHub Actions secrets, Replit, Cloud Build substitutions, other teams, and any
  copy of the value held under a name the predicate does not carry.
- The 2026-09-17 reading of the three service keys, its counting rules, its holes and its findings are
  in `_inbox/2026-09-17_p305-key-inventory.md`. Read it before rotating any of them.

## Step 1 — name the pairs, not just the names

The same value is carried under different variable names on different sides of a call. Rotation steps
that walk NAMES miss the pairing. As of 2026-09-17, at least these must hold together:

| Value | Cloud Run side | Vercel side (environments the 2026-09-17 inventory found) |
|---|---|---|
| the engine/retrieval key | `hauska-engine-api` / `hauska-retrieval-api` / `hauska-mcp-server` / `cortex-api` / `smartsite-mcp` env vars from the `HAUSKA_ENGINE_API_KEY` secret | `property-explorer` `HAUSKA_RETRIEVAL_API_KEY` (production, preview) **and** `RETRIEVAL_API_KEY` (production); `property-explorer` also carries a variable literally named `HAUSKA_ENGINE_API_KEY` in **production only** — a third name for the same secret on the same project, so a preview that reads THAT name has no value at all; `command-center` `RETRIEVAL_API_KEY` (production, preview); `cmdcenter` `RETRIEVAL_API_KEY` (production); `icc-demo` `RETRIEVAL_API_KEY` (production) |
| the service key | `cortex-api`, `smartsite-mcp`, `records-request-worker` `SERVICE_API_KEY` (secret `SERVICE_API_KEY`) | `property-explorer` `CORTEX_SERVICE_API_KEY` (production, preview), `property-explorer-staging` `CORTEX_SERVICE_API_KEY` (production), `cmdcenter` `CORTEX_SERVICE_API_KEY` (production) |
| — | `hauska-engine-api` `SERVICE_API_KEY` resolves from secret `SERVI-6ed27a67-abc8-11f1-9b46-c4bde517b9f8` (name does not carry the variable's name) | — |

Every entry above is a row of `_inbox/2026-09-17_p305-key-inventory.json`; the file is the authority, this table is a reading of it, and a reading can go stale where the file cannot. The listing is by **variable name and environment only** — no value is read, so nothing here says two environments hold *different* values, and nothing here says two *names* hold the same one. What it does say is where a copy was last written: `property-explorer` `HAUSKA_RETRIEVAL_API_KEY` Preview 2026-09-17T13:38Z (the integration seat's hand fix for A-205) and Production 2026-09-16T18:28Z (the P-251 rotation); `command-center`, `cmdcenter` and `icc-demo` last written 2026-07-26, 2026-08-10 and 2026-07-05, i.e. **untouched by the 2026-09-16 rotation**. Whether those three hold the engine key's old value or a different value altogether cannot be told from the names — the inventory's finding 1 says the same, and calls it a decision a rotation has to take rather than a mechanical rule. The fact that nobody can tell is itself part of why this runbook exists.

A member of a pair that is not rotated is a consumer that is not rotated, whatever the other side does. Note in particular that a rotation that visits only `HAUSKA_RETRIEVAL_API_KEY` leaves `RETRIEVAL_API_KEY` (production, property-explorer/command-center/cmdcenter/icc-demo) and the production-only `HAUSKA_ENGINE_API_KEY` untouched.

## Step 2 — mint, then move every consumer, group by group

1. **Mint one new value**, add it as a new version of the secret in **both** GCP projects that mirror
   it (`hauska-prod-497015`, `legacy-design-tools-prod`), keeping the mirror in sync.
2. **Cloud Run group.** For each service in the inventory: deploy a new revision that resolves the new
   `:latest`, canary at 0% traffic under the traffic lease (`AGENT_CONTRACT` section 3), smoke a real
   cross-service call, then shift. Do the five engine-key services in quick succession to keep the
   window short in which one side sends the old value and the other expects the new one.
3. **Non-GCP group — every environment, in this order.**
   - Write the new value into **Production** and **Preview** for each Vercel project and variable in
     the inventory (**and Development** wherever that project has a Development copy; no entry in the
     2026-09-17 listing carried a `development` target, which is a fact of that reading and not a
     property of Vercel).
   - **Redeploy** so the environment is picked up. Existing preview deployments are NOT updated by
     writing a Preview variable: they keep the value they were built with. A preview that must be
     trusted has to be created after the write.
   - `hauska-map/.github/workflows/property-explorer-sync-retrieval-key.yml` is the existing
     authoritative path for `property-explorer`; read its header before touching the variables by hand,
     and see "The hole this runbook does not close" below.
4. **Run the closing check** (Step 3) against a **fresh** preview and against production.
5. **Verify one real cross-service call end to end** (not each service's own health check).
6. **Disable** — never destroy — the old version in both projects, and only after every consumer and
   every environment is verified.

**Rollback:** before Step 6 nothing is destructive. Re-enable the old version and redeploy the group
that failed; a Cloud Run shift moves back by moving traffic back.

## Step 3 — the closing check

```
node scripts/check-preview-key-drift.mjs --url https://<preview-host>
```

- **exit 0** — the preview's credential leg answered; the rotation reached that environment.
- **exit 3** — `auth-failure`: the environment is stale. The rotation is NOT done. This is the check
  that A-205 had no equivalent of.
- **exit 4** — refusal: the read could not be graded (the URL is gone, a non-auth 5xx, an HTML login
  wall, a certificate error). **A refusal is never a pass.** Hand `--parcel` a known parcel if the
  default is not in the preview's data.
- Prove the check can fire before trusting it: `node scripts/check-preview-key-drift.mjs --selftest`
  (it grades a recorded 401-shaped body and a recorded 200 body, both kept verbatim under
  `scripts/fixtures/check-preview-key-drift/`).

What the check can reach, and what it cannot: it reads ONE preview URL that it is given, on ONE parcel.
It does not enumerate environments (Step 0 does), it does not compare Vercel environments by value
(`vercel env pull` returns sensitive values empty, so a value path is not available), and it does not
assert `readPath` — a preview whose bake is stale still passes, because that is a different finding
(P-230) and folding it in would make this gate permanently red (`DEV_PROCESS` 2.0). It never prints a
key: it reads no secret and sends no header.

## The hole this runbook does not close

`property-explorer-sync-retrieval-key.yml` wrote **production only** (read at source 2026-09-17:
`vercel env rm "$VAR" production` / `vercel env add "$VAR" production`). As of 2026-09-17 the P-305 lane
carries [hauska-map PR #410](https://github.com/empressaioemail-tech/hauska-map/pull/410), a **draft that
the lane did not merge and did not run**, which drives the write loop from an
`EXPECTED_VERCEL_ENVIRONMENTS` list (`production preview`) and then creates a fresh preview deployment so
the Preview value is materialised on a real host. Until it is merged and run, **a rotation performed by
running that workflow still misses Preview by construction**, and Step 3 is the only thing that will say
so. Development stays unwritten there on purpose (see the workflow header): no Development copy of these
names exists today, and creating one would put the value on developer machines via `vercel env pull`.

## Traps already paid for — do not re-buy them

- **`hauska-map` links to whichever project `.vercel/project.json` names.** It has been linked to
  `cmdcenter` when the work was for `property-explorer`; `vercel env add` silently landed on the wrong
  project (`_STATE.md`, 2026-08-10). Re-read `.vercel/project.json` before every env or deploy op, and
  prefer a throwaway directory with a hand-written `.vercel/project.json` for inventory work.
- **Two projects are named almost the same: `command-center` and `cmdcenter`.** Both hold key copies.
- **PowerShell 5.1 appends a newline to piped stdin.** Write key material with `printf '%s'`, never with
  a stdin newline (recorded in the sync workflow's header).
- **The Node CA trap.** `node fetch` on this workstation could not verify some hosts until
  `NODE_OPTIONS=--use-system-ca` (`90_runbooks/cc_agent_node_tls_workaround.md`). The check names that
  runbook in its refusal text when it hits it.
- **Two GCP projects mirror the registry** (`hauska-prod-497015`, `legacy-design-tools-prod`). Rotating
  one and not the other is A-181's shape (P-276).

## On cadence

This runbook is executed on a rotation. Its Step 0 and Step 3 are also the two halves of a periodic
drift check, and neither is wired to a schedule today: Step 0 needs two authenticated CLIs and Step 3
needs a live preview URL, and a check that cannot reach its subject is a dead gate (`DEV_PROCESS` 2.0).
Whoever schedules them decides the cadence; this file does not claim one exists.
