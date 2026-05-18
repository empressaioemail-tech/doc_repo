---
date: 2026-05-18
agent: claude-code
repo: docs
session_type: execute
rolled_up: true
rolled_up_into: [80_adrs/adr_018_atom_contract_substrate_layer, 80_adrs/adr_001_atom_architecture, 25_atom_architecture_reference, 26_atom_upgrade_guide, 27_engine_evolution_plan, 11_roadmap, 51_substrate_v1_sprint, 14_pricing_framework, 00_current_state]
---

## What was done

Doc-set sweep executing all seven Known-follow-on-doc-updates items queued in [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md). Mechanical execution per the handoff plan; one commit.

Item 1 (most load-bearing): [`14_pricing_framework.md`](../14_pricing_framework.md) "Phased implementation" subsection (Phase 1 metadata, Phase 2 metering, Phase 3 settlement, Phase 4 marketplace) replaced with "Substrate state — code reality vs integration work" subsection naming what is actually built in `@hauska-sdk/payment` v0.1.0 today (x402 protocol signing, on-chain verification via ethers v6, wallet integration, payment storage, PaymentSDK orchestrator; USDC on Base 8453 / Ethereum 1 / Polygon 137; publish-ready posture), what remains as code-level TODO (Circle fiat checkout URL generation at `packages/payment/src/payment-request.ts:253`, sole real production TODO), and what remains as integration-and-operational work (atom-contract licensing-metadata at M2-C `@hauska/atom-contract` publication, MCP-server metering wire-up, Bastrop revenue-share manual reconciliation pilot, Hauska Inc. money-transmitter / KYC/AML / settlement-rail posture). Marketplace dynamics remain 18-36 month horizon. Source-citation discipline followed: every SDK claim cites a file path. Verification line added naming the 2026-05-18 re-verification (56 tests passed in 783ms; file paths cited).

Item 2 (paired docs): [`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md) and [`26_atom_upgrade_guide.md`](../26_atom_upgrade_guide.md) package-name and title sweep. Eleven in-body references in doc 25 plus title, H1, owner line, Package descriptor, historical-context paragraph (lines 40-46 preserved with supersession callout), Section 4 enforcement reference, Section 5 cinematography reference, Section 8 opening, Section 10 anti-pattern row (reframed: publishing the contract inside `@hauska-sdk/*` is the anti-pattern; substrate-peer not SDK-sub-package), glossary row, Section 11 package-surface tree, Section 11 licensing paragraph all renamed to `@hauska/atom-contract`. Fifteen in-body references in doc 26 plus title, H1, owner line, audience descriptions, scenario table, install commands and import statements, prerequisites, Step 1 registration, version-upgrade-protocol intros and commands, Pattern E split example, validation-checklist references all renamed. Both docs gained ADR-018 to `related` and a revision-history entry naming the rename and the rationale.

Item 3: [`80_adrs/adr_001_atom_architecture.md`](../80_adrs/adr_001_atom_architecture.md) five in-body references renamed plus a substantive rewrite of the Subsidiary-commitments bullet that asserted "Empressa owns the atom contract, not Hauska" (now "Hauska commercial substrate owns the atom contract, distinct from the Hauska SDK" with peer-substrate dependency-graph explanation). Status-section v1.3 reframe marks the 2026-04-18 ownership-correction as superseded by ADR-018 with the current-canon statement immediately adjacent. Revision-history gained a 2026-05-18 entry naming the reconciliation; the 2026-04-18 v1.3 entry gained a same-line "Superseded 2026-05-18 by ADR-018" callout.

Item 4: small-handful sweep. [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) line 226 (Stream B contract-version-bump reference), [`11_roadmap.md`](../11_roadmap.md) line 275 (commercial-posture revisit trigger), [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) lines 90 (Coordination touchpoints) and 133 (Bump 1 minor-version-bump). All four references renamed to `@hauska/atom-contract`. Brief revision-history entries on 27 and 51; 11 has no revision-history section so gained the parenthetical inline. All three `related` fields extended to ADR-018.

ADR-018 follow-on checklist (lines 77-83) flipped from seven `- [ ]` to seven `- [x]` with completion notes inline; closing line points at this session summary; revision-history gained a 2026-05-18 sweep-completion entry. The checklist now serves as a status indicator for future agents.

Cross-cutting bookkeeping: [`00_current_state.md`](../00_current_state.md) Open ADRs ADR-018 entry updated to reflect all seven follow-on items completed; Recent session summaries gained today's doc-set sweep entry at the top; one prior entry rotates out per the five-entry cap.

## What was learned (changes to ground truth)

SDK re-verification held the recon. `npm test --workspace=@hauska-sdk/payment` ran in 783ms; `Test Files 5 passed (5)` / `Tests 56 passed (56)`. Breakdown matched the recon: payment-storage 15, payment-request 8, wallet-integration 11, payment-verification 7, PaymentSDK 15. The Circle checkout URL TODO at `packages/payment/src/payment-request.ts:253` is still present and is still the sole production code TODO blocking the fiat rail. Last commit on the SDK is still `ecfdfa9` (2026-04-05, "all 12 packages publish-ready"). No new code lands since the recon, so the 14_pricing_framework rewrite proceeded on the recon evidence with the verification line citing both the original recon and the 2026-05-18 re-run.

The doc-set drift was nomenclature, not engineering substance. None of the seven docs had stale technical content beyond the package name and the brand-placement claim. The contract definition, registration mechanism, rendering modes, composition mechanics, history layer, AI gateway, anti-pattern list, and migration patterns all remained accurate. The sweep was a brand-and-naming reconciliation, not a re-architecture. This is the cheapest moment for the rename per ADR-018 (pre-publication; nothing external imports the renamed target yet).

The ADR-018 Known-follow-on-doc-updates checklist as a paper artifact worked. Defining the checklist in the originating ADR with exact line numbers per follow-on item gave the doc-set-sweep session a verbatim task list and made flipping the checklist a meaningful status indicator. The pattern is reusable for future load-bearing ADRs that name body-level cleanup as out-of-scope; future agents see the unchecked items and know what remains.

The Section 10 anti-pattern row in doc 25 (originally "Publishing `@hauska-sdk/atom` / Atom belongs to Empressa") was the most subtle edit. The anti-pattern was correct under the old framing (atom in Empressa, SDK in Hauska, mixing scopes is bad) but became stale under ADR-018 (atom and SDK both Hauska substrates, but distinct peer namespaces; folding contract into `@hauska-sdk/*` would create the transitive-dependency problem the substrate-vs-product split solved). Reframed to name the new anti-pattern: folding the contract inside `@hauska-sdk/*` forces every consumer to take a transitive dependency on x402 + USDC + ethers + Circle + BIP39 wallets just to register an atom type. The architectural prohibition is preserved; the framing is updated.

## What's still open

Items the handoff named as explicitly out of scope, still open after this session:

ECI internal registry naming. Canon today is `@empressaio/atom-internal` per CLAUDE.md line 93, [`60_eci_atomization.md`](../60_eci_atomization.md) lines 56-58 / 62-63 / 408 / 423. ADR-018 explicitly defers to the ECI atomization sprint kickoff. Untouched in this session per the handoff.

Contract-completeness gap on four atoms (sheet, decision-event, submission, submission-classification) missing `focus` rendering mode. Will block their `.atom` export per ADR-012 when renderers ship. Engineering action in legacy-design-tools, not doc work. Untouched in this session per the handoff.

MCP server starter / `empressaioemail-tech/hauska-mcp-server` repo / `legacy-design-tools/lib/empressa-atom` README — already handled in prior 2026-05-18 follow-on work (PR #25 merged; repo bootstrapped at commit `d00586b`). Out of scope for this session per the handoff.

Items the handoff did not name but visible in `00_current_state.md`:

Bizops 70-band structural design. Mox docs at repo root pending proper-slot placement. Hauska Inc. corporate-separation paperwork timing. Unmoved by this session.

Per-product MCP surface tier model open numerical values (take rate, tier prices, bundled call quotas). Resolved at the principle level 2026-05-16; specific values deferred per [`08`](../08_tiered_access_model.md) and the 14_pricing_framework Open-questions section. The 14_pricing_framework Open-questions section remains unchanged in this session beyond the principle-level integration of SDK substrate reality.

## Suggested canonical doc updates

None. This session was the suggested doc update. The seven items queued in ADR-018 are all completed; the checklist is flipped; the revision-history entries cite ADR-018 and this session summary on each touched doc.

## References

- [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md) — origin ADR with the Known-follow-on-doc-updates checklist that drove this session.
- [`_decisions/2026-05-18_atom_contract_hauska_namespace.md`](../_decisions/2026-05-18_atom_contract_hauska_namespace.md) — companion decision record for the package rename.
- [`_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md`](../_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md) — paired decision record, MCP server starter migration (separately executed; same day).
- [`_sessions/2026-05-18_atom_contract_hauska_namespace_and_mcp_repo_split_claude_code.md`](2026-05-18_atom_contract_hauska_namespace_and_mcp_repo_split_claude_code.md) — origin session that produced ADR-018 and the queued doc-set sweep.
- `RECON_2026-05-18.md` (in `p:\Hauska SDK`) — SDK recon report, re-verified during this session.
