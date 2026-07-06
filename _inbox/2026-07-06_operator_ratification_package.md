# Operator ratification package — 2026-07-06

> **Operator answers received 2026-07-06 (items 1-3):**
> **1. RATIFIED** — O&G activation + ADR-025 both ratified; repo name `og-twin` confirmed; Herbert expected back this morning (his pooling read folds into ADR-025 before the 1.7.0 freeze). Promotion of both drafts to `_decisions/` and `80_adrs/` (applying the stamped rulings, incl. obligation moving to the core contract module) is task zero of the autonomous run.
> **2. ACCEPTED** — atom-spec PR #4 ready to merge and publish. HELD one step behind item 3's branding-scope answer: the spec's naming/branding must match the ruling before it publishes as a public standard.
> **ALL ANSWERS COMPLETE 2026-07-06 (second pass):** (3-resolved) Hauska is the SDK ONLY — wider rename confirmed; decision record `_decisions/2026-07-06_branding_hauska_sdk_only.md` (staged R1 brand surfaces / R2 infra lag). (4) proof-of-record: PROMOTE to slot 62. (5) certification scaffold: PROMOTE to slot 63 with the non-vacuousness floor (rename "Hauska Verified" per branding). (6) siting memo: PARK as exploration. (7) M1: RUN as a parallel dispatch. (npm) operator handles all npm publishes manually at session end — program bridges with tarball/git refs mid-run and stages a publish queue. (T1) enforce-on-clean-soak GRANT given. (og-twin) repo exists: github.com/empressaioemail-tech/og-twin. (SLB) framing retired: `_decisions/2026-07-06_slb_framing_retired_operator_overlay.md`. (Herbert) Nick pinging; answers fold before 1.7.0 freeze. (Chris) we drive the Reeves redesign of his file; he takes design back after a touchable version exists. Both O&G drafts PROMOTED. This package is CLOSED; execution state moves to `_inbox/2026-07-06_three_lane_program_STATUS.md`.
>
> **3. ANSWERED with a scope question flagged (superseded by the block above)** — operator: "hauska is the sdk only - all else empressa branding + description i.e. empressa map, empressa land etc." This is NARROWER than the 2026-07-04 branding canon (Hauska = substrate set: SDK, engine, MCP server, atom contract per ADR-018). If taken literally it renames/rebrands hauska-engine, hauska-mcp-server, @hauska/atom-contract, the atom spec, and the hauska.dev domains — and touches the Hauska Inc. entity-brand mapping. Clarification requested before the rename wave and before PR #4 merges; see the session record. Chris mockup delivered in chat (permian-field-health.html); operator to drop the file at `_verticals/oil_gas/assets/`.

Every decision currently owed by Nick, in one pass. Each item: context in brief, planner recommendation, and what approval unblocks. Answer inline by number (yes / no / adjust). Items resolved this morning are recorded at the bottom for the log.

## Decisions

**1. O&G vertical activation + ADR-025 (drafts in `_inbox`, full-scope path per the 2026-07-06 ruling).**
The activation decision now carries the eight-step full-scope path (H-10, adjudication admin panel, aggregator title slice). ADR-025 carries your four stamped rulings; the pooled-units hole is explicitly open pending Herbert. Ratifying activation does NOT wait on Herbert — only the 1.7.0 version freeze does; his corrections fold in before the contract publishes.
Recommendation: **ratify both now.** Also settle the repo name; planner recommendation stands at brand-neutral `og-twin` (the skeleton proves substrate capability; `empressa-land` pre-decides brand placement while the product name is deliberately open). You create the GitHub repo.
Unblocks: ADR-025 promotion to `80_adrs/`, the 1.7.0 contract work, RRC adapter dispatches.

**2. Atom-spec PR #4 (hauska-atom-contract) — the language-neutral open standard.**
Seven JSON schemas + SPEC.md + README, additive-safe, planner-reviewed; held only because it is public-facing. This is the audit's "the contract is the product" finding made real, the Phase 1 own-the-layer artifact, and correctly Hauska-branded per the canon (atom contract is substrate).
Recommendation: **approve merge + publish.** External promotion (registry listings, announcement) rides the discoverability motion, not this approval.

**3. Rename PR #226 (ldt) — @hauska/* to @empressaio/* for the five component packages.**
Executes the branding canon. Needs a careful rebase (cortex-tiles moved to 0.1.1 under it), then the coordinated landing: merge, CI republish under @empressaio, consumer bumps. The npm CI path is proven on ldt.
Recommendation: **approve the landing window now**; the execution agent handles rebase + republish + bumps as one coordinated move.

**4. Proof-of-record spec draft (rec. slot 62).**
The notary-for-facts primitive: portable, tamper-evident record artifacts off the conformance/export pair. Commitment-1 rendered as product.
Recommendation: **promote the doc to canonical slot 62; the build stays queued** behind the Phase 1 exit. Promoting the spec costs no build lane.

**5. Certification scaffold draft (rec. slot 63).**
"Hauska Verified" certification revenue scaffold, carrying the non-vacuousness eval floor the eval-scores incident motivated.
Recommendation: **promote to slot 63 with the floor intact; build queued.** The floor should also be cited by the Reeves mint gate.

**6. Siting spike memo draft.**
Scope was self-proposed from the 77 place-graph data-center signal; the program never defined it. No counterparty exists, and the focus queue already carries the Phase 1 exit + O&G.
Recommendation: **park as exploration** (correct the scope only if "siting" meant something else). Revisit when a counterparty or the O&G/land base makes it cheap.

**7. M1 calibration gate — run or re-sequence (drift-steer D3).**
The dispatches have been drafted since 06-25 (cc-agent-E edition ingest, then cc-agent-C K2 retrodiction Austin+SA, then the M1 measure). Four programs have resourced past the "nothing downstream until M1" rule; the roadmap doc still carries the retracted arrow-two claim either way.
Recommendation: **run it.** Cursor executes; it consumes no operator time; commitment #2 is the moat and it is currently a plan. If you rule re-sequence instead, a decision record gets filed and 00d corrected.

**8. NPM_TOKEN legs — SDK + atom-contract repos.**
The CI tag-push publish path is proven on ldt. The same secret needs to exist in hauska-sdk and hauska-atom-contract (planner adds the atom-contract workflow). Minutes of your time; unblocks metering publish (after the SDK build fix, execution-side) and all future contract publishes including 1.7.0.
Recommendation: **do at next convenience.**

**9. Herbert pooling read.**
Gates the ADR-025 freeze (not activation). Brief already delivered.
Recommendation: **nudge or schedule the recorded conversation**; the transcript feeds the corrections pass.

## Standing rulings (no action; recorded so nothing re-raises them)

Cotality production keys: operator handling directly; not a planning blocker. Extension key rotation + Upstash replacement: deferred until after QA by explicit ruling. smartcity-os: absolute no-touch.

## Resolved 2026-07-06 (this morning, recorded in the tracker)

ICC walkthrough shape answered: the real selling surfaces (fixed extension consuming through the gate + command center workspace + revenue meter), not a standalone page; icc-demo.vercel.app stays as the agent-market leg. New quality flag logged: the Cortex workspace mount in the command center is not testable and does not match the look; a quality pass to the operator's bar enters the close-the-gap lane ahead of walkthrough assembly.
