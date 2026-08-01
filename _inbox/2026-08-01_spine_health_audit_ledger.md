---
id: 2026-08-01_spine_health_audit_ledger
title: Spine health audit — FINDINGS LEDGER (adversarially verified; roadmap-foldable)
date: 2026-08-01
status: ledger (read-only audit complete; adversarial gate applied; feeds roadmap)
owner: nick
related: [2026-08-01_spine_health_audit_plan, 2026-08-01_retrieval_api_search_down_incident, 2026-08-01_retrieval_api_search_fix_dispatch]
purpose: Durable record of the read-only spine health audit surfaced by the retrieval-api silent-4-day outage. Adversarial gate refuted 3 of the planner's recon claims (traffic-trap gaps, contract-pin outage, InMemory outage) and CONFIRMED the real holes. Ranked ledger below folds into the roadmap. NOTE: finding #1 (retrieval /search) is now RESOLVED (fix #201 deployed 2026-08-01) — kept for the record; the pattern-class findings remain open.
---

# Spine health audit — findings ledger

## VERDICT
The retrieval-api pattern is NOT unique. Worst live holes: (1) /search dead while health/corpus look green [now fixed], (2) monitors that never exercise real work, (3) MCP prod env still carrying literal REPLACE-with-* placeholders. Planner-recon claims of engine/MCP "17/21 behind" traffic-traps were REFUTED by the adversarial gate — those services are serving latest.

## LIVE SNAPSHOT (adversarially re-probed 2026-08-01)
| Service | Serving @% | latestReady | Health depth |
|---|---|---|---|
| hauska-engine-api | 00159-suv @100% | 00159-suv | FUNCTIONAL (adapters/engineCore/envelope) — the GOOD model |
| hauska-mcp-server | 00034-cr5 @100% | 00034-cr5 | MIXED (degraded + dep probes; returns HTTP 200) |
| hauska-retrieval-api | 00052-suj @100% (post-fix) | 00052-suj | /health liveness; NEW /health/search functional (fix #201) |
| cortex-api | 00454-* @100% (post-#370) | — | LIVENESS-ONLY {"status":"ok"} |
| smartcity-api | 00100-hkx @100% | 00100-hkx | MIXED (db:connected, no business path) |
| smartcity-scraper | 00038-hb4 @100% | 00038-hb4 | No /health route (TCP startup only) |

## RANKED FINDINGS LEDGER
| # | Finding | Dim | Status | Blast | How silent | Fix-class | Effort |
|---|---|---|---|---|---|---|---|
| 1 | retrieval /search dead while health/corpus green | D1/D4 | CONFIRMED — **RESOLVED (#201)** | PE citations, brief substrate, MCP retrieval | /health 200 + /healthz/ db+corpus ok while /search 503 | health-probe + code fix | M (done) |
| 2 | No functional /search alert; existing signals insufficient | D5 | CONFIRMED | Whole spine can die for days unnoticed | uptime only checks /healthz 200; no synthetic search; 5xx policy is absolute rate not ratio, can't see degrade-to-empty | add-alert | S |
| 3 | Uptime checks point at wrong/weak paths | D5/D1 | CONFIRMED | False coverage | config path /healthz; MCP /healthz→404, /healthz/→200 degraded; retrieval /healthz→404 | add-alert/health-probe | S |
| 4 | cortex-api /api/health bare liveness | D1 | CONFIRMED | Reports, briefs, PE via cortex | {"status":"ok"}; no DB/engine/retrieval proof; LDT project has 0 uptime/policies | health-probe + add-alert | S |
| 5 | MCP prod HAUSKA_BACKEND_URL + UPSTASH_REDIS_REST_URL are literal REPLACE-with-* | D4/D2 | CONFIRMED | Health lies; rate-limit fails open | health uses HAUSKA_BACKEND_URL (placeholder) while tools use HAUSKA_ENGINE_API_URL (real) → perpetual false "engine down"; Upstash placeholder → memory rate-limit only | env fix / kill-fallback | S |
| 6 | MCP returns HTTP 200 when status: degraded | D1/D5 | CONFIRMED | All MCP consumers | uptime accepts 200; body ignored | health-probe (non-200 on degraded) + alert | S |
| 7 | Caller fail-open: retrieval error → [] → Neon/websearch "success" | D2 | CONFIRMED (code); PLAUSIBLE (live default) | Brief/chat/findings can look fine with wrong/empty grounding | briefRetrievalSubstrate returns [] on non-ok; retrieval.ts falls to Neon; prod has no BRIEF_CODE_RETRIEVAL (defaults neon); path activates under gate/mcp/#370 | kill-fallback (surface substrate failure) | M |
| 8 | smartcity-os-prod + legacy-design-tools-prod: zero alerting | D5 | CONFIRMED | City calendar/API + cortex | uptime list-configs → []; no policies | add-alert | S-M |
| 9 | SmartCity calendar returns {ok:true,events:[],source:"empty"} on total failure | D2 | CONFIRMED | Public calendar, iCal, AI context | success envelope masks scraper/LKG death | kill-fallback | S |
| 10 | SmartCity AI assistant .catch(()=>null) on 7 deps | D2 | CONFIRMED | City AI briefing | incomplete context, no failure marker | kill-fallback | M |
| 11 | smartcity-scraper: no health route | D1 | CONFIRMED | Scrape freshness | TCP startup only; /health→404 | health-probe | S |
| 12 | Engine /health does not prove parcel/substrate storage | D1/D2 | PLAUSIBLE (latent) | Terrain/site-plan | InMemoryStorage if DB unset; live HAS DATABASE_URL + documentIngestStore durable — not live-broken | health-probe | S |
| 13 | MCP atom-contract pin 1.9.0 vs npm 1.11.0 | D4 | REFUTED as outage; hygiene | Low | 1.10/1.11 additive per changelog | bump-contract | S |
| 14 | Engine/MCP serving 17/21 revs behind (planner recon claim) | D3 | REFUTED | — | live: 00159 + 00034 @100% = latestReady | — | — |
| 15 | smartcity-api traffic-trap (00113 vs 00100) | D3 | REFUTED | — | 00113 created 06-10; serving 00100 created 06-16 (newer) | — | — |

## D5 META-RECOMMENDATION — minimum functional-alert set
Would any current signal have caught the 4-day outage? NO — uptime is liveness-shaped; /healthz/ corpus-ok would've stayed green while /search 503'd.
| Alert | Proves | Tier |
|---|---|---|
| Retrieval synthetic authed /search (fixed jurisdiction+query → expect ≥1 hit) | real critical path | S must-have |
| Retrieval /search success=0 for N hrs while requests>0 | zero-success | S |
| MCP non-200 (or policy) when body status=degraded / dep down | dependency truth | S |
| Point uptime at real routes (/health or /healthz/ + parse body); fix slash | stop theater | S |
| Engine: assert /health fields (fail if adapters/engineCore/envelope false) | keep the good model | S |
| Cortex: one DB read + one engine/retrieval dep probe (not bare ok) | end silent cortex | M |
| SmartCity API: alert on db not-connected; scraper last-success freshness | city surface | M |
| Wire all uptime failures to a live notification channel | close the loop | S |

## ROADMAP FOLD ORDER (no dates)
1. [DONE] retrieval /search fix + /health/search (#201 deployed).
2. [DONE 2026-08-01] S-tier alert #1: functional uptime check on retrieval-api `/health/search` (public, 2xx-required, 300s) + alert policy "Retrieval /search FUNCTIONAL down" wired to the MCP-alerts email channel. THIS would have caught the 4-day outage. (Cloud Run uptime checks see only status codes, so a status-code check on the public /health/search is the right instrument; it returns non-2xx when search fails.)
3. [DONE 2026-08-01] MCP env/health (findings #5/#6): hauska-mcp-server #54 (MERGED + DEPLOYED) — cloudbuild `_HAUSKA_BACKEND_URL` → real retrieval-api URL; health.ts `probeUpstash` reports the intentionally-parked Upstash as honest `skipped` not `down`. Live MCP /health flipped `degraded`→`ok`, `engine_retrieval_api` down→ok, `upstash` down→skipped(parked). Upstash URL left parked (operator-owned env swap). Tools were never affected (they used the real HAUSKA_ENGINE_API_URL); only health reporting was lying.
   REMAINING (finding #6 code-fix, not blocking): MCP `/health` still returns HTTP 200 even when body status=degraded, so a status-code uptime check can't catch a genuine MCP degrade. Follow-up: make `/health` return 503 when a CRITICAL dep is down (careful not to alarm on the parked-upstash skipped state). Queued, not urgent (the false-degraded that made this pressing is fixed).
4. [PR OPEN 2026-08-01 — awaiting planner merge/deploy] Cortex functional health: LDT [#371](https://github.com/empressaioemail-tech/legacy-design-tools/pull/371) @ `cdf44f18` adds `/api/health/ready` (DB + engine + retrieval); keeps `/api/health` liveness. Dark-project monitoring DRAFTED in `_inbox/2026-08-01_spine_ledger_monitoring_draft.md` (not applied).
5. [PR OPEN 2026-08-01 — awaiting planner merge/deploy] Fail-closed caller: LDT [#372](https://github.com/empressaioemail-tech/legacy-design-tools/pull/372) @ `b175a0e9` — `SubstrateRetrievalError` + brief/chat `substrateStatus`/`degradedReasons` annotations. Hardening (citations already work live via #370).
6. [PR OPEN 2026-08-01 — awaiting planner merge/deploy] SmartCity empty-success + scraper health: smartcity-os [#32](https://github.com/empressaioemail-tech/smartcity-os/pull/32) @ `65eae19` — calendar 503 degraded; AI named dep failures; scraper `/health` freshness.
6b. [PR OPEN 2026-08-01 — awaiting planner merge/deploy] MCP readiness signal (finding #6 remainder): hauska-mcp-server [#55](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/55) @ `457e26d` — `/health/ready` 503 on critical dep down; `/health` stays 200-on-degraded.
Coordinator handback: `_inbox/2026-08-01_spine_ledger_remaining_fixes_HANDBACK.md`.
DO NOT dispatch: engine/MCP "shift to latest" — already serving latest. DO NOT touch: the retrieval fix (landed).

## APPLIED 2026-08-01 (planner, items 1+2 of the co-urgent block)
- retrieval-api uptime check `hauska-retrieval-api-search-functional` on /health/search (period 300s, 2xx required) + alert policy (id 2889743585354385803, enabled) → MCP-alerts email channel. (One MSYS path-mangle mishap during creation — the first check stored `/C:/Program Files/Git/health/search`; caught it, recreated correctly via PowerShell, repointed the policy to the good check id, deleted the mangled one. Lesson: create GCP uptime checks with paths from PowerShell, not Git-Bash, or MSYS mangles the leading-slash path.)
- MCP #54 merged + Cloud-Build-deployed (build ad983e98 SUCCESS); /health verified honest live.
