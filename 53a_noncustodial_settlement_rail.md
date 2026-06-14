---
id: 53a_noncustodial_settlement_rail
title: Non-custodial settlement rail - remove facilitator custody, verify-only party-to-party
status: active
last_updated: 2026-06-14
applies_to: hauska
owner: nick
related: [53_hauska_sdk_completion_sprint, 14_pricing_framework, 72_hauska_inc_operations, 52_mcp_offer_and_buildout, _verticals/oil_gas/00_oil_gas_index]
---

# Non-custodial settlement rail

> **Purpose.** The current Hauska SDK payment design is custodial by construction: payments route to a Hauska-controlled facilitator wallet or Circle merchant wallet, and the revenue router takes a cut out of the gross before disbursing the rest. That is the collect-then-disburse shape of a money transmitter and a broker. This spec removes it. The target is a verify-only rail where capital moves directly party-to-party (bank-to-bank for fiat, wallet-to-wallet for crypto), Hauska never takes custody of a counterparty's funds, and Hauska collects a technology fee billed separately rather than skimmed from the transaction. This is required regardless of the oil and gas pursuit; it is the single change that most reduces Hauska Inc. money-transmitter exposure. It becomes urgent for oil and gas because those capital transactions are large, bank-to-bank, and not crypto.
>
> **Sourcing.** Code state read directly from `p:\Hauska SDK\packages\payment` on 2026-06-14. File and line citations below are verbatim against that read. Note: the Circle fiat path is now built (it was a stub when `53_hauska_sdk_completion_sprint.md` was written on 2026-06-06); `generateFiatCheckout` at `payment-request.ts:253` creates a real Circle payment intent. The custody problem is in the design, not in incompleteness.

## The core distinction this spec rests on

There are two different money contexts in the platform and the current code conflates them. Keeping them separate is the whole design.

| Context | What moves | Who Hauska is | Custody | Risk |
|---|---|---|---|---|
| 1. Hauska bills its own customers | Catalog micropayments, subscription, per-call overage, the technology fee | The merchant being paid for its own service | Hauska receives its own revenue. Normal merchant activity. | Low. A Hauska Circle or card account is fine here. |
| 2. Capital moves between two platform users | An oil and gas deal payment, investor to operator, buyer to seller | A verifier and record-keeper only | Hauska must never touch it. Party-to-party directly. | High. Custody here is money transmission and the fee-from-gross is brokering. |

Everything the current code does that is custodial is the result of applying a Context 1 mechanism (collect to a Hauska wallet) to a Context 2 transaction (third-party capital). The fix is to stop doing that for Context 2.

## Verified current state, custodial by construction

| Component | File of record | What it does today | Why it is custody or brokering |
|---|---|---|---|
| Crypto 402 target | `payment-request.ts:131-135`, `:149`, `:161` | The 402 response sets the pay-to address to `config.blockchain.facilitatorWallet` and throws if it is absent. | The payer pays a Hauska-controlled wallet, not the payee. Hauska takes custody, then must disburse. |
| Circle checkout | `circle/checkout.ts:52`, `:50` | Creates a Circle payment intent with `merchantWalletId` and `settlementCurrency`, funds settle to the Hauska Circle merchant wallet. | Same shape on the fiat side. Funds land with Hauska. |
| Custodial user wallets | `wallet-integration.ts:26-57`, `:95-98` | `getOrCreateWallet(userId, password)` via `@hauska-sdk/wallet`; the platform creates and holds password-encrypted wallets for users. | Hauska holds keys to user funds. Custodial wallet operation. |
| Revenue router | `revenue/index.ts:64-127` | `routeSettledPayment` computes a facilitator cut from the gross (`facilitatorAmount = gross * takeRateBps / 10000`) and routes the remainder to the source actor; writes a routing ledger entry. | Taking a cut out of the gross of a third-party transaction is a broker fee, and disbursing the remainder is transmission. |

The crypto verification primitive (`payment-verification.ts`, `PaymentSDK.verifyPayment`) is the one piece that is already the right shape: it verifies a payment the client executed rather than settling anything. That stays and becomes the template.

## Target model

### Principle

Hauska is the verification mechanism and the record-keeper. Capital flows directly between counterparties. Hauska's revenue is a technology fee on its own customer, billed as a separate transaction Hauska is a party to, never extracted from the counterparties' transfer.

### Crypto (Context 2)

The 402, or its non-HTTP equivalent for a deal payment, directs payment to the payee's own address (the seller or operator), not a facilitator wallet. Hauska verifies the on-chain transfer landed at the payee for the expected amount, using the existing verification primitive. The `facilitatorWallet` config is removed from the Context 2 path. Hauska's technology fee is a separate charge against the platform user under Context 1.

### Fiat, bank-to-bank (Context 2, the oil and gas case)

The capital moves bank-to-bank between the two parties' own bank accounts. Hauska does not stand in the flow. Hauska verifies that settlement occurred. The verification mechanism is a design decision to be made, options below, and is the main net-new build:

1. Bank-linking and transaction verification (a Plaid-style provider): both parties link accounts, Hauska confirms the transfer posted. Lowest custody risk, depends on a third-party verifier.
2. A confirmation-and-attestation flow: both parties confirm settlement and upload proof, Hauska records a signed attestation. Weakest verification, no third-party dependency, may suffice for a v1 where the deal documents and not the wire are the product.
3. Circle in a non-custodial connected-account mode, if and only if funds settle directly to the payee's account and never to a Hauska wallet. Requires confirming Circle supports a true pass-through here; the current `merchantWalletId` usage is the opposite of this.

The technology fee for the deal is invoiced to the platform user (the operator) as a Context 1 charge, on the existing Circle or card merchant path, decoupled from the deal amount entirely.

### Wallets

Remove custodial wallet creation from the platform path. Crypto users connect self-custodied wallets. Fiat users link bank accounts. `getOrCreateWallet` with a platform-held password must not be the funding mechanism for Context 2. If a wallet abstraction is kept for Context 1 convenience, it must not hold counterparty capital.

### Revenue router

Stop computing a cut from the gross of a Context 2 transaction. The router is reshaped into two separate records:

1. A technology-fee charge: a Context 1 charge to the platform user, its own amount, not a percentage carved from the counterparties' transfer.
2. A settlement-verification ledger entry: records that transaction between party A and party B settled for amount X at time T, with the verification method and proof reference. This is a record, not a disbursement instruction. The `RoutingLedgerEntry` becomes a verification ledger; `facilitatorAmount` and `sourceActorAmount` as a split of the gross are removed for Context 2.

The existing source-actor split may remain valid for Context 1 catalog revenue-share (paying a jurisdiction or firm a share of what Hauska earned on a paid call), because there the money is Hauska's own revenue being shared, not counterparty capital. Keep that path; scope it explicitly to Context 1.

## What stays

The crypto verification primitive. The Circle path for Context 1 (Hauska billing its own customers). The catalog metering and tier enforcement from `53` item 3. The source-actor share where it splits Hauska's own earned revenue, not a third party's transfer.

## Regulatory note

Non-custody is the posture that keeps Hauska out of money-transmitter and broker-dealer territory, but the test is function over label: the design must genuinely never hold counterparty capital and never extract a fee from the counterparties' transfer. This requires a counsel pass before the Context 2 fiat rail is load-bearing, tracked in `72_hauska_inc_operations.md` alongside the existing money-transmitter and KYC questions. This spec is the engineering target; the legal confirmation is Nick's to route, not decided here.

## Open questions and dependencies

- The fiat bank-to-bank verification mechanism (the three options above) is an open design decision and the main net-new build.
- Whether the existing `@hauska-sdk/wallet` package is retired, scoped to Context 1 only, or kept for a non-custodial connect flow.
- Counsel confirmation that the verify-only, separate-tech-fee model holds as a non-money-transmitter posture, per state.
- Coordination with `53` item 2 (revenue routing) and item 3 (MCP metering), which assume the current model; this spec changes item 2's shape for Context 2.

## Acceptance criteria

- No Context 2 payment path directs counterparty funds to a Hauska-controlled wallet or Circle merchant wallet. Verified by code: no `facilitatorWallet` or `merchantWalletId` in the deal-payment path.
- A Context 2 crypto payment is verified as landing at the payee's own address; Hauska never receives it.
- A Context 2 fiat transaction is verified as settled bank-to-bank between the two parties by the chosen mechanism; Hauska never receives it.
- The technology fee is a separate charge to the platform user, never a percentage of the counterparties' transfer, and is computed and billed independently of the deal amount.
- The verification ledger records party A, party B, amount, time, method, and proof reference per settled transaction, and is idempotent on transaction id.
- Context 1 (catalog micropayments, subscription, overage, tech fee) continues to function on the existing rails.
- Test artifacts pasted verbatim per HR-8.

## Cross-references

- [`53_hauska_sdk_completion_sprint.md`](53_hauska_sdk_completion_sprint.md) - the sprint this revises; item 2 routing changes shape for Context 2.
- [`14_pricing_framework.md`](14_pricing_framework.md) - take-rate philosophy; the tech fee replaces the cut-from-gross for Context 2.
- [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md) - money-transmitter and counsel routing.
- [`_verticals/oil_gas/00_oil_gas_index.md`](_verticals/oil_gas/00_oil_gas_index.md) - the oil and gas capital layer that makes this urgent.

## Revision history

- **2026-06-14 (origin):** Created at operator direction. Custody removal scoped as substrate-wide and required regardless of the oil and gas pursuit. Current custodial state verified against `p:\Hauska SDK\packages\payment` with file and line citations; two-money-context distinction established; verify-only target model defined for crypto and fiat bank-to-bank; fiat verification mechanism left as an open design decision; regulatory confirmation routed to counsel via 72.
