# Mission: close the P-98b billing-interval vocabulary split

## The defect

PR #574 on `empressaioemail-tech/legacy-design-tools` (branch `feat/p98b-account-entitlement`) fails CI with three assertions, all one root cause:

- `src/__tests__/pe-property-entitlement.test.ts:298` — AssertionError: Expected "month", Received "monthly"
- `src/lib/peEntitlement.responseBody.unit.test.ts:136` — Expected "month", Received "monthly"
- `src/lib/peEntitlement.responseBody.unit.test.ts:181` — Expected "year", Received "annual"

Established by the planner at source. Do not re-derive:

The server uses `month` / `year` end to end and deliberately so. `lib/db/drizzle/0092_pe_billing_interval.sql` carries `CHECK (billing_interval IS NULL OR billing_interval IN ('month','year'))` and its comment states the grammar mirrors Stripe's `month` / `year` recurring intervals. The type `PeBillingInterval` is `"month" | "year"`. `peBillingIntervalForPriceId` at `artifacts/api-server/src/lib/pePaywallStripe.ts:177` returns `isMonthly ? "month" : "year"`.

The sibling CLIENT lane on `empressaioemail-tech/hauska-map` (branch `feat/p98b-account-entitlement-client`, commit `04e0a75`, pushed but no PR opened) built its contract as `billingInterval: 'monthly'|'annual'|null` and gates the annual-upgrade rung on `if (e.billingInterval !== "monthly") return null;` in `apps/property-explorer/src/lib/nextAction.ts`.

So a translation layer somewhere on the server response path maps `month` to `monthly` and `year` to `annual` to match the client, while the server's own tests were written against Stripe's vocabulary.

## The ruling you implement

One vocabulary end to end: `month` / `year`, Stripe's own. No translation layer. Do not relitigate this. The rationale is that a silent mapping between two vocabularies for the same subject is the exact defect class this operation has already been bitten by, when a legacy access-policy pair had to be re-stamped out of 6.3 million rows.

The DB, the type, the wire, and the client all speak `month` / `year`.

## Tasks

1. Find the translation. In the legacy-design-tools worktree at `P:/seat-worktrees/property/legacy-design-tools-p98` (branch `feat/p98b-account-entitlement`), locate exactly where `month`/`year` becomes `monthly`/`annual` on the response path. Read `artifacts/api-server/src/lib/peEntitlement.ts` and the response-body builders. Report the file:line.

2. Remove it. The wire carries `month` / `year` / `null`. Do not widen a check to admit both. Do not add an alias. Delete the mapping.

3. Verify the tests express the source authority. The three failing assertions expect `month`/`year`, which is correct, so they should go green without editing them. If any test still expects `monthly`/`annual`, that test is wrong and gets corrected, but say so explicitly rather than quietly changing it.

4. Run the suite. In `artifacts/api-server`: `npx vitest run src/lib/peEntitlement.responseBody.unit.test.ts` and `npx tsc --noEmit -p tsconfig.json`. The DB-backed `pe-property-entitlement.test.ts` needs DATABASE_URL and will fail at import locally; report that as unmeasured-here rather than claiming it passes. Report exact counts before and after.

5. Fix the client half. In the hauska-map worktree at `P:/seat-worktrees/property/hauska-map-nextaction` (branch `feat/p98b-account-entitlement-client`): change the union to `'month'|'year'|null` and the nextAction gate from `!== "monthly"` to `!== "month"`. Update every test, fixture, and wire-body literal carrying the old strings. Start from `apps/property-explorer/src/lib/accountEntitlementClient.ts`, `apps/property-explorer/src/lib/nextAction.ts`, `apps/property-explorer/src/lib/account-entitlement-client.test.ts`, `apps/property-explorer/src/browse/settings-plan-rows.test.tsx`, `apps/property-explorer/src/browse/settings-next-action.test.tsx`. Grep the whole app for `monthly` and `annual` to catch any you were not told about, and report anything that is NOT billing-interval. There is unrelated annual PRICING copy which must NOT be touched.

6. Run the client suite. `npx vitest run` in `apps/property-explorer`. The baseline before the P-98b client work was 2194 tests. Report before and after counts.

7. Verify by violation, both directions. Break the gate (`!== "month"` to `=== "month"`) and confirm tests go red; restore and confirm green. Paste the verbatim failure text. A check observed only passing has not been observed working.

## Bounds

Do not touch `usePropertyEntitlement.ts` or `entitlementClient.ts` in hauska-map. The client lane deliberately left them alone and a test pins that.

Absent, zero, and unmeasured are three different states. A `null` interval must never be treated as monthly; that is the entire point of the column.

Every negative claim carries the command that produced it.

## Report back

File:line of the translation you removed. The full list of files changed in each repo with a one-line reason each. Before and after test counts for both suites with the exact command. The verbatim red output from the violation test in step 7. Anything that contradicts this brief. And explicitly, anything you chose not to change and why.
