---
id: 2026-07-23_GATE_D_checkin_sdk_money_boundary
title: GATE D CHECK-IN — SDK money boundary restored (Master WDLL 3.11 / I-F)
status: active
date: 2026-07-23
applies_to: doc_repo planner (review), hauska-mcp-server
related: [2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_atoms_first_central_tx_execution_plan, 2026-07-23_GATE_C_checkin_property_atom_path]
owner: nick
---

# GATE D CHECK-IN — addressed to the doc_repo planner (`P:\doc_repo`)

**From:** Phase 1d / Gate D execution seat  
**Stop:** after live-proven SDK money boundary on hauska-mcp-server  
**Ask:** reviewing planner grades Master WDLL **3.11** / I-F against the pasted evidence. Do not expand into full I-K inbound ICC meter in this wave.

Standing holds observed: **property-explorer dual-serve atom path left as cutover (not re-touched this PR).** Cortex dual-serve **not deleted.**

**Parent re-verify (build planner, post-agent):** MCP `00025-bkp` @ 100%, `SDK_METERING=1`, `rg api.stripe.com src` CLEAN, `@hauska-sdk/metering@^0.1.1` present, anonymous `get_property_atom_chain` `status=ready` / `district=RS` for Hays, PE Bexar still `X-Pe-Read-Path: atom-chain`.

---

## 1. Live stack (parent-verified)

| Surface | Live value |
|---|---|
| hauska-mcp-server | **`hauska-mcp-server-00025-bkp` @ 100%** (project `hauska-prod-497015`) |
| Image tag | **`4307c33`** = squash merge of PR [#45](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/45) on top of PR [#44](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/44) `b0e94b4` |
| `SDK_METERING` | **`1`** on revision 00025 |
| `HAUSKA_ENGINE_API_URL` | preserved (`https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app`) |
| `GATE_CONTEXT_SIGNING_KEY` | preserved (secret binding present) |
| Migration | **`008_sdk_metering_usage.sql` applied** to prod Neon (`hauska_mcp`) |
| `@hauska-sdk/metering` | **0.1.1** (dep + dynamic import); consumer ESM patch in `scripts/patch-hauska-sdk-esm.mjs` |
| property-explorer | **NOT touched** |
| cortex dual-serve | **NOT deleted** |

Tagged historical revisions remain at 0% traffic (fourgate / t1fix / a4b / a4c / a4cfix).

---

## 2. PRs / merge SHAs

| PR | URL | Merge SHA | Scope |
|---|---|---|---|
| #44 | https://github.com/empressaioemail-tech/hauska-mcp-server/pull/44 | `b0e94b4` | authorizeCall at requireProduct; Stripe retired; Postgres MeteringStore; CI conformance; cloudbuild preserves env |
| #45 | https://github.com/empressaioemail-tech/hauska-mcp-server/pull/45 | `4307c33` | postinstall/Docker ESM extension patch so `@hauska-sdk/metering` loads under Node 20 |

Final `origin/main` HEAD for the live image: **`4307c33eb6bf3ec7dee8cd31e8bc749bd72eb291`**.

---

## 3. Master WDLL 3.11 subcheck grades

| # | Acceptance | Grade | Evidence |
|---|---|---|---|
| 3.11.1 | Paid-read authorize path calls `McpMeteringGate.authorizeCall` at **authorize-time** (before serve) | **met** | `requireProduct` → `authorizePaidRead` → `authorizePaidCall` → `gate.authorizeCall`. Live logs on `00025-bkp`: two `sdk_metering_authorize` events for `read_atom_calibration` with `allowed=true`, `sdk_tier=builder`, `usage=1` then `usage=2`, `quota=1000` (timestamps `2026-07-23T21:56:32Z` / `21:56:37Z`) |
| 3.11.2 | Stripe meter path (`api.stripe.com` / `postStripeMeterEvent`) retired from live paid path | **met** | `rg api.stripe.com src` → CLEAN on merged main; `src/metering.ts` is observability-only (no Stripe post). Live paid path wrote `sdk_metering_usage`, not Stripe |
| 3.11.3 | Public-free / anonymous path does NOT load `@hauska-sdk/*` | **met** | Dynamic `import("@hauska-sdk/metering")` only inside paid gate. CI test `public-free logToolRead does not load @hauska-sdk/metering`. Live anonymous `get_property_atom_chain` `is_error=false`, `auth={product:public,tier:free_anonymous}`, `status=ready` for `48209:156346` |
| 3.11.4 | CI conformance fails if dep/import disappears or Stripe meter returns | **met** | `tests/sdk-money-boundary.test.ts` (PR #44/#45 CI green): dep present, `authorizeCall` wired, no `api.stripe.com`, no static SDK import outside dynamic gate, ESM load + authorizeCall smoke |
| 3.11.5 | Deploy MCP, shift traffic, prove live on revision | **met** | `00025-bkp` @ 100%; health HTTP 200; paid `/mcp` + introspection succeeded; durable usage row below |

### PARTIAL (named)

| Item | Grade | Reason |
|---|---|---|
| Circle overage checkout / RevenueRouter live settle | **partial** | `CIRCLE_API_KEY` / `CIRCLE_MERCHANT_WALLET_ID` / `HAUSKA_CHECKOUT_BASE_URL` unset on revision. Log `sdk_metering_circle_absent`: within-bundle authorize OK; overage honest-degrades. Authorize gate still runs (I-F money boundary restored for bundle path). |
| Full I-K inbound ICC meter | **not claimed** | Explicit stop: do not expand unless trivial; not done this wave. |

---

## 4. Verbatim live evidence

### 4a. Health (`GET /health`)

```
HTTP 200
service=hauska-mcp-server env=production overall=degraded
```

(`degraded` reflects dependency probes; service serving.)

### 4b. Public-free catalog tool (no SDK load)

```
POST /admin/introspection/tools/get_property_atom_chain/call
{ "arguments": { "parcel_node_id": "48209:156346" } }

is_error=False
auth={"product":"public","tier":"free_anonymous"}
latency_ms≈152
payload status=ready
```

### 4c. Paid authorize + serve

Probe key (minted then revoked): `key_id=0dbc8672-2814-446c-a0ec-0c83b2a9da3e`, tier `developer_pro` → SDK tier `builder`, product `reporting`.

Introspection + real `/mcp` `tools/call` `read_atom_calibration` with `atom_id=did:hauska:zoning-fact:48209:156346`:

```
is_error=False (introspection)
/mcp HTTP 200, isError false in JSON-RPC result
```

Cloud Logging (`revision=hauska-mcp-server-00025-bkp`, `jsonPayload.event=sdk_metering_authorize`):

```
2026-07-23T21:56:32.125122Z  allowed=True  tool=read_atom_calibration  key_id=0dbc8672-…  sdk_tier=builder  usage=1  quota=1000
2026-07-23T21:56:37.224759Z  allowed=True  tool=read_atom_calibration  key_id=0dbc8672-…  sdk_tier=builder  usage=2  quota=1000
```

Neon `sdk_metering_usage`:

```
key_id=0dbc8672-2814-446c-a0ec-0c83b2a9da3e
period=2026-07
layer2_count=2
updated_at=2026-07-23T21:56:37.208Z
```

Circle:

```
event=sdk_metering_circle_absent
note=CIRCLE_* / HAUSKA_CHECKOUT_BASE_URL unset; within-bundle authorize OK; overage PARTIAL.
```

Probe key status after proof: **revoked**.

### 4d. Stripe absence

```
rg api.stripe.com src  → CLEAN (no matches)
```

---

## 5. Rollback note

1. Shift traffic back:  
   `gcloud run services update-traffic hauska-mcp-server --region=us-central1 --project=hauska-prod-497015 --to-revisions=hauska-mcp-server-00023-j4s=100`  
   (pre-Gate-D PE catalog revision; or `00024-vjz` if you want SDK code without ESM patch — not recommended).
2. Or keep `00025` and set `SDK_METERING=0` via `--update-env-vars=SDK_METERING=0` (observability-only post-success path; no Stripe either — Stripe is code-retired).
3. Tagged 0% revisions unchanged; cortex dual-serve untouched.

---

## 6. Ask of the planner

Grade Master **3.11** / I-F as **met with Circle-overage PARTIAL**, or name residual before next phase. Next planned stop after operator go is **not** full I-K inbound ICC meter unless separately dispatched.
