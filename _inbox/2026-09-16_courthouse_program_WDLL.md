---
id: 2026-09-16_courthouse_program_WDLL
title: Courthouse records, paused at coming soon (WDLL)
date: 2026-09-16
status: PAUSED 2026-09-15 by operator ruling (P-242, Records request is coming soon on every tier). Nothing in flight. Resume from this card.
plan_row: P-120 items 15 to 17c (courthouse half of the reports program); P-85 (Records Request lane); P-242 (coming-soon gate)
owner: operator decides; reports lane (doc-repo-55) holds the verification below
supersedes: the courthouse rows of _inbox/2026-09-07_reports_courthouse_program_WDLL.md (items 15 to 17c). That card's reports rows stay governed by _inbox/2026-09-07_reports_one_model_recut_WDLL.md.
snapshot: |
  doc_repo P:/doc_repo main 5e016719 (= origin/main). hauska-engine origin/main 2d85fee.
  legacy-design-tools origin/main ba39b4f5. hauska-map origin/main f7fbcbf.
  Every code claim below was read from those refs on 2026-09-16 with git show / git grep,
  not carried from the 2026-09-08 inventory. Live MCP probe dated 2026-09-12.
related:
  - _inbox/2026-09-07_reports_courthouse_program_WDLL.md
  - _inbox/2026-09-07_reports_one_model_recut_WDLL.md
  - _sessions/2026-09-08_p120_unfinished_inventory_claude_code.md
  - _decisions/2026-09-03_p32_feasibility_unfrozen.md
  - _decisions/2026-09-01_owner_policy_and_portal_access_rulings.md
  - _smartsite_gtm/09_crm_courthouse_agent_roadmap.md
---

# Courthouse records, paused at coming soon

## State at pause

The operator set Records request to coming soon on 2026-09-15 (hauska-map PR #406,
commit `c61de8c`, P-242). This card holds everything the reports thread learned about
the courthouse half so it can be picked up cold.

The short version. Retrieval exists and is partly proven. The join from a retrieved
document into a customer report does not exist at any link, and the type that would
carry it forbids the state it needs. Item 16 as scoped is larger than the first useful
increment.

## The six items

| # | Item | State | Owner |
|---|---|---|---|
| 15 | Deploy the block-parser reliability fix (legacy-design-tools PR #597) | CLOSED. Was already deployed; verified at source against a wrong premise in its own dispatch | done |
| 16 | Wire retrieved or Smart-Files-mounted documents into Feasibility section 11 through cite-or-decline | NEVER STARTED | unassigned |
| 17a | Re-run the 14 Bastrop digit-block jobs on `48021:34161`, `48021:34753`, `48021:35481` | NOT DONE | operator's own hand, by prior ruling |
| 17b-gate | Verify Hays `48209:168686` for the silent fabricated-zero class | ANSWERED, NOT CLOSED. Two authorized live probes both ended `needs-human/captcha-required`, deterministic. Hays is structurally unmeasured | operator scope decision |
| 17b | Re-run 6 letter-block jobs (Bastrop `48021:81886`, Hays `48209:168686`, Travis `48453:500996`) and McLennan's 4 (`48309:181849`) | NOT DONE. McLennan refusing honestly is a pass | operator's own hand |
| 17c | Reconcile `p85ClerkPortalRegistry.ts` and `p85-clerk-portals.mjs` against corrected portal data | CLOSED. Registry reconciled and live `clerk_portal_terms` rows corrected | done |

## What exists

**Retrieval is real.** legacy-design-tools `ba39b4f5` carries the records-request stack
under `artifacts/api-server/src/lib/`: job worker, purchase decision, artifact vision,
classify and classify-write, corridor derive, document serve, completion email, the
clerk portal search gate and the P-85 portal registry, each with tests.

**The MCP surface answers.** `request_records`, `check_request`,
`list_purchased_records` and `read_purchased_record` are registered in
`artifacts/smartsite-mcp`. `list_purchased_records` returned `status: ok, jobs: []` for
`48021:34161` and `48309:181849` on 2026-09-12. Per the tool's own contract an empty
array is a genuine result, not an error. That probe is account-scoped: it says nothing
about jobs placed under the operator's account.

**The honest-refusal posture is designed in.** McLennan's extractor refusing that
vendor's markup is graded as a pass.

**The section 11 shell is deliberate.** `_decisions/2026-09-03_p32_feasibility_unfrozen.md`
ships section 11 as an honest "not searched" shell with a Smart Files mount slot, and
calls the P-85 reconciliation "a follow-up amendment when that call gets made, not a
precondition." That call is the one this card is waiting on.

## What does not exist: the join, all four links

Read from hauska-engine `2d85fee`.

1. **The request cannot carry documents.** `feasibilityRefreshBody` in
   `services/engine-api/src/routes/parcel-terrain.ts` has no `courthouseDocuments`
   field. Zero matches in the routes directory. An API caller cannot supply them.
2. **The route never passes them.** Same file, zero references.
3. **The author forwards them to the wrong path.**
   `packages/engine-core/src/site-plan/feasibility-author.ts` accepts
   `courthouseDocuments` (line 89) and forwards it (line 211) only to the legacy LDT
   narrative client, `narrative-section-client.ts`. In-process generation,
   `narrative-generator.ts`, has zero courthouse references and has been the DEFAULT
   narrative path since 2026-09-09. So the only seam that could carry a document now
   sits on the fallback.
4. **Nothing writes the citation.** `report-model.ts:1152` composes
   `const hoa: HoaFacts = { searchStatus: "not-searched" }` for every parcel,
   unconditionally. `mountedDocumentCitation` is declared at `feasibility-model.ts:339`
   and read in three places (`narrative-section-client.ts:132`, `pdf/feasibility.ts:549`
   to `:552`) and written nowhere.

Consequence: section 11 prints "Not searched. Mount a recorded document (e.g. a CC&R) in
Smart Files to cite it here" on every Feasibility report, and cannot print anything else,
because no path can put a document into the model.

## The type forbids the feature

`HoaFacts.searchStatus` at `feasibility-model.ts:334` is typed as the single literal
`"not-searched"`. It is not a union. A "searched, found nothing" state and a "searched,
found this document" state are unrepresentable. Any producer has to widen this type
first, and per ENFORCEMENT the right widening is a discriminated union, not an optional
string: searched-with-citation, searched-clear, not-searched, blocked-at-source, each
carrying its own required fields. The existing five-kind absence taxonomy
(`AbsenceKind`) is the obvious shape to reuse.

## Surface divergence to settle before resuming

P-242 made Records request coming soon on every tier in Property Explorer; hauska-map
tests pin it (`lock-matrix.test.tsx`, `reports-catalog.test.ts`,
`reports-tool.test.tsx`). A Property Explorer production deploy exists roughly ten hours
after the merge. Its bundle was not read, so whether P-242 is live on smartsite.cloud is
not verified here.

The MCP side does not obviously match. `artifacts/smartsite-mcp/src` contains no
coming-soon gate at all (no match for coming_soon, comingSoon or COMING_SOON). The
records gates found are `canRunStudioReport` tier checks at `recordsExtraction.ts:365`
and `:434`, which refuse below Studio and admit Studio and above. P-242's MCP changes
harden that tier gate for paid Solo callers; they do not disable records.

**Unverified, and needs a structural read, not a grep:** whether the `request_records`
handler admits a Studio caller today. If it does, the app says coming soon while the
connector will still place a paid records purchase. That is the two-surface divergence
class, and it should be closed in one direction or the other before anything else here
resumes.

## Design calls to make before building

**Engine reads the records store; the caller does not supply documents.** Caller-supplied
facts are what the one-model re-cut deleted from X-Ray. Adding `courthouseDocuments` to
the request body would rebuild that second derivation for courthouse. The composer should
read purchased records for the parcel itself, the same way it reads atoms.

**A recorded instrument is a source of record, not a web finding.** It belongs in the
fact section with its recording citation (volume, page, instrument number, county), not in
the unverified web block. Different treatment on purpose.

**Cite-or-decline carries over.** When the narrative cites a document, the citation must
match a document the composer actually supplied, and a sentence naming a document outside
that set is dropped. This is the rule already enforced for web findings in
`extractWebFindings`; reuse it.

**The in-process generator is where the input goes.** Do not extend the deprecated LDT
client.

## Minimum usable increment

Item 16 as written asks for document synthesis. The smallest increment that is useful and
honest is narrower:

> If a recorded document has been purchased and classified for this parcel, section 11
> names it and cites it. If a search ran and found nothing, section 11 says so. If no
> search ran, it says that.

That is a producer for `HoaFacts` plus the widened type, and nothing else. It turns one
permanently fixed line of customer copy into a true one. Narrative synthesis over the
documents is a second increment.

## Sequencing and done-looks-like

No timeframes. Order and dependencies only.

| Step | Depends on | Done looks like | Instrument |
|---|---|---|---|
| A. Settle the MCP divergence | nothing | `request_records` either refuses every tier while P-242 stands, or the app and connector are deliberately different and that is written down | Structural read of the handler, then a live call from a Studio test account that is expected to refuse, stated before the call |
| B. Operator runs 17a and 17b | 15 (closed) | Real job output on the named parcels, reviewed by hand | Job ids from `check_request`, documents from `read_purchased_record` |
| C. Hays scope decision | nothing | One of: human-solved captcha, a different verification route, or Hays declared unmeasured in the product | A decision record, not a code change |
| D. Widen `HoaFacts` to a discriminated union | nothing | The compiler rejects a searched state with no citation | A type test with `@ts-expect-error`, verified by removing the expectation and watching it fail |
| E. `HoaFacts` producer reading purchased records | B, D | A parcel with a classified purchase shows the citation in section 11; a parcel with none shows the correct absence kind | Paired run on one parcel with a purchase and one without, same revision, page and byte counts only |
| F. Narrative cites documents | E | A cited document appears in the narrative; a fabricated citation is dropped | Violation test mirroring `extractWebFindings`, with a not-vacuous control |
| G. Retire `courthouseDocuments` from the LDT client path | F | The parameter is gone from `feasibility-author.ts` and `narrative-section-client.ts`, and a CI check fails if it returns | CI grep with a planted violation |

Per the retirement rule, G ships in the same change as F, not after it.

## Open decisions for the operator

1. Should `request_records` over MCP match the app's coming soon, or stay open to Studio?
2. Hays: which of the three routes in step C?
3. Is the minimum increment (E) the target for the first resume, with synthesis (F) held?

## Not measured, stated so it is not inherited as fact

- Whether P-242 is in the live smartsite.cloud bundle.
- Whether `request_records` admits a Studio caller today.
- Whether any records jobs exist under the operator's account.
- Whether `48209:168686` is still the correct Hays node id. Hays node ids were re-ruled
  2026-09-13 (the node id is the parcel-map id; account attributes attach only through the
  crosswalk). The 17b-gate and 17b parcel ids predate that ruling and should be re-resolved
  before any re-run.
- Nothing about retrieval accuracy. 17a and 17b are the measurement, and neither has run.

## Leave-behind

    leave_behind:
      - item: courthouse join (steps D to G above), unbuilt
        owner: unassigned
        plan_row: P-120 item 16
      - item: 17a and 17b re-runs
        owner: operator
        plan_row: P-120 items 17a, 17b
      - item: Hays verification route
        owner: operator
        plan_row: P-120 item 17b-gate
      - item: request_records MCP gate vs P-242 app gate
        owner: unassigned
        plan_row: P-242
