---
id: 2026-08-24_govtech_transaction_contract
title: Govtech transaction contract (S5-1)
status: active
last_updated: 2026-08-24
applies_to: portfolio
owner: nick
related:
  - _inbox/2026-08-24_govtech_program_scope.md
  - _decisions/2026-08-17_g13_consumer_contract
  - 61_enforcement_doctrine
---
# PURPOSE

This is S5-1, the transaction contract for the govtech program. It is written before the lanes build, because four lanes building in parallel will each invent a definition of a citation and meet at integration, and that is the failure OPS-17's preamble was adopted to prevent.

Snapshot this was written against, per `61_enforcement_doctrine.md` §State your snapshot:

| Repo | Commit | Read as |
|---|---|---|
| plan-review | `2b5a713` | clean clone, origin/main |
| smart-files | `86975d0` | clean clone, origin/main |
| smartcity-dashboards | `238e023` | clean clone, origin/main |
| hauska-mcp-server | `bdbb99d` | clean clone, origin/main |
| hauska-engine | `60adb1f` | clean clone, origin/main |
| legacy-design-tools | `1fd6233` | clean clone, origin/main |
| doc_repo | `bbcf029` | working tree, main |

All clones are depth-1, so no claim of the form "X was removed on date D" appears here. Nothing was executed: this document was produced by reading source. Items that would have needed a running service or an installed dependency are under the final section, with the command that settles them.

The contract binds four objects and one transaction. It settles what each object carries, which system owns each field, and what a reviewer may reject in a diff. It does not relitigate G-13, which is settled: the data plane does not merge, consumers reach suppliers by HTTP service token or the one MCP server, never a DSN and never a copied table as system of record. It does not require all three products to be present for any one to work. It does not put product reasoning in the substrate.

One constraint governs how strongly anything here can be enforced, and it is worth stating before the body rather than discovering it in a lane. `plan-review`, `smart-files` and `smartcity-dashboards` are each plain Node ESM with `pg` as the single runtime dependency, no TypeScript, no bundler and no build step. `hauska-engine` and `hauska-mcp-server` are TypeScript. So "prefer a type the compiler enforces over a check someone must remember to call" is available in the substrate and unavailable in the three products as they stand today. Where this document says "make it a discriminated union", that means a compiler-enforced union in the substrate and, in the products, one shared validator module that refuses, with a `node --test` suite that runs in CI, plus a Postgres CHECK constraint where the value lands. That is weaker than a compiler and is named as weaker rather than pretended equal.

# THE TRANSACTION

A submittal is uploaded by staff, reviewed against a code corpus whose edition is declared, producing determinations that cite sections, and accruing a reference to a licensed source.

Stated once, end to end, naming every system it crosses and in what order.

A staff member of a city, authenticated as that city's tenant, uploads a submittal through the plan review surface. Where the city bought filing and not plan review, the same upload enters through the Smart Files surface and stops at step four; nothing downstream of step four is required for the document to be filed, retained and found again. This is what R-E means in the transaction and it is the reason the transaction is described as one path with an early exit rather than as a pipeline.

Plan review resolves the engagement. An engagement is keyed to a parcel node and a project type and carries the city tenant; it is a row in plan review's own Postgres and nowhere else. Plan review holds no file bytes at any point in this transaction, and holds no identity for the document beyond the one Smart Files returns.

Plan review calls Smart Files over HTTP with a service token, creating the engagement folder if it does not exist and posting the submittal bytes. It never opens a Smart Files DSN. The wire is `SMART_FILES_BACKEND_URL` plus a bearer token, which is the shape `plan-review/src/files.mjs` already implements and which G-13 names.

Smart Files mints the document. It hashes the bytes into a content CID, writes the blob, the document row, one version row carrying provenance, and one placement row binding the document to the folder, all in one transaction. It returns the document entity id, the version number and the content CID. Smart Files is the system of record for the document from this moment. Plan review stores the returned entity id as a reference and nothing else about the file.

Plan review resolves the code corpus that applies to this engagement's jurisdiction, and it resolves an edition, not a jurisdiction alone. It asks the substrate: the one Hauska MCP server for agent-shaped reads, or retrieval-api over HTTP for application-shaped reads. Both answer with code-section atoms and a provenance envelope. This is the step where the contract does the most work, because today the read filters on jurisdiction alone and the edition is dropped at the boundary.

The substrate serves. Every code-section atom it returns carries a citation object minted by the substrate at serve time: section identity, edition identity, and source-actor identity together in one value. Where the atom belongs to a licensed source, the substrate records the serve in the accrual ledger before the response is written. Where the atom's verbatim body is licensed and not hosted, the citation says so in a field, not in a comment.

Plan review's finding engine, which lives in plan review after S2-1 and not in the substrate, runs the applicability matrix. For each section in the applicable set it emits exactly one determination. Sections it did not reach emit `Unchecked` carrying a typed absence naming why. No section in the applicable set is silently omitted, because an omission and a determination of compliance are indistinguishable to a reviewer reading a matrix.

Plan review persists the determinations to its own Postgres, each carrying the citations it actually named, verbatim as the substrate minted them.

Plan review accrues the cited references. This is a distinct event from the serve at step six and the contract requires both to be recorded and distinguishable, because forty sections served into a retrieval window and four sections cited in a determination are two different obligations to a licensor and today the ledger cannot tell them apart.

A reviewer reads the matrix, in the plan review UI, or in the SmartCity Dashboards plan review lens, or through Codex tools on the one MCP. Each of the three renders the same determinations from the same store; none of them recomputes a determination and none of them constructs a citation. A reviewer override writes a new determination preserving the original and the stated reason, and that override is the calibration signal.

The decision letter renders determinations with their citations. It reproduces no licensed body text, and the constraint that makes this true is a database CHECK rather than a review convention.

The licensor reads the accrual ledger through a reader that produces a statement or an invoice, reconciling rows against sections they published. This step does not exist today on the store designated as the source of truth, and the contract's job at this step is to say what the row must contain for it to be possible at all.

Twelve steps, seven systems: the plan review surface, plan review's service and store, Smart Files' service and store, the Hauska MCP server, retrieval-api, the atoms store, and the accrual ledger. Dashboards is an eighth when the city bought it and is not on the critical path for any other step.

# FIELD OWNERSHIP

One system owns each field. The others read it. Where two systems write the same field today, the table says which one stops.

**Document.** Owner is Smart Files.

| Field | Owner | Read by | Note |
|---|---|---|---|
| `entityId` | Smart Files | plan review, Dashboards, MCP | minted at write; `smartfile:<scopeType>:<scopeId>:<docSlug>` |
| `scopeType`, `scopeId` | Smart Files | all | resolved from the caller, never from the body on the tenant path |
| `docSlug` | **caller** (plan review for submittals) | Smart Files | changes ownership; see THE FOUR OBJECTS |
| `title` | caller | all | display only, never identity |
| `accessPolicy` | Smart Files | all | five-value union; default `tenant-private` |
| `currentVersion` | Smart Files | all | |
| `contentCid` | Smart Files | all | sha256 of bytes |
| `provenance` | Smart Files, from caller-supplied typed input | all | today free jsonb; contract types it |
| placements | Smart Files | all | plan review supplies the folder target |

**Determination.** Owner is plan review. The substrate owns none of it and must not grow a determination vocabulary.

| Field | Owner | Read by | Note |
|---|---|---|---|
| `verdict` | plan review | Dashboards, MCP, letter | `Pass` / `Fail` / `Uncertain` / `Unchecked`, existing CHECK |
| `citations[]` | **substrate** (minted), plan review (selected) | all | plan review chooses which, never what they say |
| `analysis` | plan review | all | |
| `confidence` | plan review | all | must carry provenance kind; absent on `Unchecked` |
| `absence` | plan review | all | required on `Unchecked` |
| `originalVerdict`, `overrideReason` | plan review | all | written only by a human override |
| `adjudicationAtomDid` | substrate | plan review | `null` until the substrate resolves it, never a `pending:` string |
| `submittalVersionRef` | plan review | all | new; part of determination identity |
| severity, category | **plan review's finding engine** | plan review | attributes of an issue, not of a determination |

**Citation.** Owner is the substrate. Every field. No consumer writes any of them.

| Field | Owner | Read by | Note |
|---|---|---|---|
| `sectionAtomDid` | substrate | reviewer, meter, audit | resolvable identity |
| `bookId` | substrate | reviewer, meter, audit | |
| `sectionNumber` | substrate | reviewer, meter, audit | |
| `editionId` | substrate | reviewer, meter, audit | required, no default |
| `editionLabel` | substrate | reviewer | |
| `editionEffectiveFrom` | substrate | reviewer, audit | adoption date, not fetch date |
| `editionCurrency` | substrate | reviewer | three-value union |
| `adoptedBy` | substrate | reviewer | jurisdiction that adopted a model edition |
| `sourceActorDid` | substrate | meter | `null` means public record, not unknown |
| `accessPolicy` | substrate | gate | |
| `bodyDisposition` | substrate | audit, renderer | `hosted-verbatim` / `deep-link-only` / `reasoning-layer` |
| `deepLinkUrl` | substrate | reviewer | |
| `sourceUrl`, `fetchedAt`, `contentHash` | substrate | audit | |
| `displayText` | **nobody** | reviewer | derived at render, never stored |

**Accrual record.** Owner is the substrate store designated by O-1. Plan review writes through the substrate and is never a second store of record for money owed.

| Field | Owner | Read by | Note |
|---|---|---|---|
| `sourceActorDid` | substrate | licensor | who is owed |
| `referenceKind` | writer | licensor | `served` / `cited`, required discriminator |
| citation quadruple (`sectionAtomDid`, `bookId`, `sectionNumber`, `editionId`) | substrate | licensor | denormalised at write |
| `bodyDisposition` | substrate | licensor audit | proves verbatim was not served |
| `occurredAt`, `requestId` | substrate | licensor | |
| `surface`, `product`, `tier` | substrate | licensor | |
| `engagementRef` | plan review | licensor | nullable; present on `cited` rows |
| `rateBasis` | rate authority (O-2) | licensor | discriminated union, never a nullable number |

Three ownership changes fall out of this table and each is a real change to shipped code.

`docSlug` moves from Smart Files to the caller. Today `uploadFileToFolder` in `smart-files/src/store.mjs` derives the slug from the human title and disambiguates with a counter loop that appends `-2` through `-19`. That makes identity a function of what somebody typed, and it makes two submittals both called "Site Plan" into `site-plan` and `site-plan-2` with nothing recording which is which. For a submittal, plan review knows the stable role and must supply it.

`citations[]` splits: the substrate owns what a citation says, plan review owns which citations a determination names. This is the single most important line in the document, because today plan review authors citation strings by hand in `src/server.mjs` and `src/mcp.mjs`, and that authorship is what produced two IRC sections labelled as the 2018 Building Code with IBC book ids and IBC deep links.

`adjudicationAtomDid` becomes nullable in practice as well as in schema. It is already `text` and nullable in `plan_review_findings`, and the override route returns `pending:plan-review:<id>` instead. A resolved-looking string that resolves to nothing is worse than a null, because a null forces a decision at the consumer and the string does not.

# THE FOUR OBJECTS

## Document

**Owner:** Smart Files. **Identity:** `smartfile:<scopeType>:<scopeId>:<docSlug>`.

The convention survives. It is the best-defended identity in the program: `smart-files/src/identity.mjs` carries a per-scope validator table rather than one regex, refuses a malformed id at construction, and parses back by taking the last segment as the slug so a scopeId containing colons cannot swallow a segment. `smart_file_documents` carries a unique index on `entity_id` and a second on `(scope_type, scope_id, doc_slug)`. It has 188 lines of test. Nothing in this contract weakens it.

Three things change.

**The slug stops being derived from the title.** The write path today builds it with `slugify(title)` and then walks a counter loop looking for a free id. Plan review must pass an explicit `docSlug` for a submittal, stable across revisions, of the form `<engagementId>:<documentRole>` reduced to the slug alphabet. The title stays, as display, and stops being load-bearing.

**A resubmission is a new version, not a new document.** `smart_file_versions` exists, carries `version`, `content_cid`, `provenance`, `computed_at` and `superseded_at`, and has a unique index on `(document_id, version)`. Nothing writes a version above one. Grepping the service for `current_version` finds one INSERT of the literal `1`, three reads, and no UPDATE anywhere; the only inserts into `smart_file_versions` outside that path are in `scripts/ci_probe_seed.sql` and `scripts/seed_isolation_probe.py`. So the version machinery is a built and starved mechanism in the ENFORCEMENT.md sense: it exists, it has correct shape, and its input is never supplied. A submittal revision is exactly the input it was built for.

**Provenance stops being free jsonb.** `smart_file_versions.provenance` is `jsonb NOT NULL`, which guarantees a value and constrains nothing about it. The write path fills it with two keys, `sourceLabel` set to the literal `"qa-upload"` or `"instrument-write"` and `uploadedBy`. Required keys under this contract: `capturedBy` (actor id), `capturedAt` (ISO-8601), `sourceKind` as a closed set of `staff-upload` / `applicant-upload` / `feed` / `instrument-write`, `originalFilename`, and `declaredRole`. A missing key refuses the write rather than defaulting.

**Scope.** A city submittal is `scopeType: "tenant"` with the city key as `scopeId`. `jurisdiction` scope is for documents the jurisdiction published, which is where an adopted code PDF belongs, and it is deliberately not writable through this service (`WRITABLE_SCOPE_TYPES` is `["tenant", "instrument"]`). That is correct and stays.

There is a live identity mismatch here that Wave 1 has to settle rather than inherit. `plan-review/web/app.js:6` hardcodes `const CITY_KEY = "template-city"` and its own copy at line 227 reads "City is ${CITY_KEY}, not icc-demo", while every persona in `plan-review/src/actors.mjs` is `orgId: "icc-demo"` and `ensureFolder` passes `persona.orgId` into folder creation. So the surface says template-city and the store writes `folder:tenant:icc-demo:*` and `smartfile:tenant:icc-demo:*`. Under R-C the demo city is template-city, and a document whose identity says otherwise is not the demo city's document. Recommendation in the OPEN section.

**Absence on the document plane.** `smart_file_absence_determinations` exists with a two-value CHECK of `absent-verified` and `lookup-failed`, a unique index on `entity_id`, and zero readers and zero writers anywhere in `smart-files/src`. Dormant, in the exact sense the doctrine names: it exists, it has no trigger, and it reports as built. Either it gets a writer in S3-8 or it is retired; leaving it is the worst of the three states.

## Determination

**Owner:** plan review. **Identity:** `(engagementId, submittalVersionRef, sectionAtomDid, editionId)`.

**The vocabulary already exists and is not reinvented.** `plan-review/sql/001_foundation.sql` carries:

```sql
CONSTRAINT plan_review_findings_determination_check
  CHECK (determination IN ('Pass', 'Fail', 'Uncertain', 'Unchecked'))
```

Four values, storage-enforced. This contract adopts them unchanged and forbids a second vocabulary. That matters immediately, because the finding engine being migrated by S2-1 carries its own three-value `FINDING_SEVERITY_VALUES` of `blocker` / `concern` / `advisory`, its own eight-value `FINDING_CATEGORY_VALUES`, and its own five-value `FINDING_STATUS_VALUES`. Those are attributes of an **issue**, and an issue is not a determination. The engine is an issue emitter; the matrix is a section adjudicator. S2-1 must map, and must not merge: one submittal produces zero or more issues and exactly one determination per applicable section, and the two counts have no reason to be equal.

**The four values conflate two different questions, so the type splits them.** `Pass` and `Fail` are adjudications. `Uncertain` means the section was reached and the facts do not decide it. `Unchecked` means no adjudication was attempted, which is an absence wearing a determination's clothes, and the CHECK constraint cannot say which absence it is. The union:

```ts
type Determination =
  | { verdict: "Pass";      citations: NonEmpty<Citation>; analysis: string; confidence: Confidence }
  | { verdict: "Fail";      citations: NonEmpty<Citation>; analysis: string; confidence: Confidence }
  | { verdict: "Uncertain"; citations: NonEmpty<Citation>; analysis: string; confidence: Confidence;
                            undecidedBecause: string }
  | { verdict: "Unchecked"; absence: Absence }
```

Read what the union removes. `Unchecked` carries no `confidence` field, so there is no place to put a number. Today `matrixFromChain` in `plan-review/src/mcp.mjs` emits an `Unchecked` row for `R311.7` carrying `confidence: { n: 0, width: null, provenance: "asserted-baseline", basis: "asserted", note: "No stair atom in the chain. Unchecked is honest." }`. The note is honest and the object is not, because a confidence object attached to a non-claim will be averaged, charted and reported by something downstream that reads the field and not the note. Under the union the field does not exist on that branch.

`Pass`, `Fail` and `Uncertain` require a non-empty citation list. A determination that cites nothing is not a determination about a code section. This is the constraint that makes S2-7's "make `Pass` and `Fail` reachable" mean something: reachable through a cited section, not through a hardcoded row.

**Identity carries the edition and the submittal version.** Today `upsertFinding` looks up by `(engagement_id, section_id)` and updates in place. Two consequences follow that nobody chose. A re-review against a newer adopted edition silently overwrites the determination made against the old one, so the record of what was decided under the code in force at submittal time is destroyed by the act of re-reviewing. And a determination against submittal revision one is overwritten by revision two with no history, so "the applicant fixed it" and "we changed our mind" are the same row. A city that cannot show what it decided, under which code, against which submitted drawing, does not have a permit record. The unique key must be the four-part identity.

**Overrides and the calibration loop.** `original_determination` and `override_reason` already exist and already work: `overrideFinding` sets `original_determination = COALESCE(original_determination, determination)` and `upsertFinding` refuses to overwrite a finding that carries an `override_reason`. That refusal is one of the few genuinely fail-closed behaviours in the program and it stays. What is missing is the consumer. The calibration signal vocabulary the engine accepts is `PERMIT_OUTCOME_KINDS` in `hauska-engine/packages/adapters/src/portal/permit-outcomes/types.ts`: `permit-approved`, `variance-granted`, `comment-resolved`. All three are confirmations. No row in that vocabulary can say a finding was wrong, so confidence can only ratchet upward, which makes it uncalibratable in the sense structural commitment two requires. The contract's requirement is narrow and does not depend on S2-19 shipping: an override is a first-class outcome kind, and the outcome vocabulary must be able to express a disconfirmation before any confidence value in this program is described as calibrated. Note that `FINDING_STATUS_VALUES` in the engine already contains `rejected`, so the disconfirming signal exists one layer up and is not carried down.

**Confidence.** The kind vocabulary already exists and is already a closed enum: `confidenceKindSchema` in `hauska-engine/packages/engine-core/src/envelope/schema.ts` is `z.enum(["calibrated", "asserted", "deterministic"])` and `envelopeConfidenceSchema` requires `{ value, kind }` together. Adopt it unchanged. Every confidence value in this program is that pair and never a bare number. `resolveReadPathConfidence` already returns it. What the contract adds is that `kind: "calibrated"` may not be emitted unless a disconfirming outcome was possible, and that a stale calibration reports as stale rather than collapsing to `asserted`, which is what `confidenceFromCodeSections` does today at the line `sawStale ? "asserted" : "asserted"`.

## Citation

**Owner:** the substrate. **Identity:** structural, `(sectionAtomDid, editionId)`. It is a value, not a row.

This is the contested object and the reason is that three readers read it for three different things.

| Reader | Reads | Fails if |
|---|---|---|
| Reviewer | `bookId`, `sectionNumber`, `editionLabel`, `deepLinkUrl` | the edition is the one we scraped rather than the one adopted |
| Meter | `sourceActorDid`, `sectionAtomDid`, `bookId`, `sectionNumber`, `editionId` | it cannot name which section was referenced |
| Licensor audit | `bookId`, `sectionNumber`, `editionId`, `bodyDisposition` | it cannot prove verbatim body was never reproduced |

No display string serves any of the three, and all three fall out of one object. That is the whole argument for making the citation a value type rather than a rendered line.

**Definition.** A citation is minted by the substrate at serve time from the code-section atom and its edition, travels unchanged through every consumer, and is stored verbatim by whoever persists a determination that names it.

```ts
interface Citation {
  sectionAtomDid: string;          // resolvable; did:hauska:code-section:<editionId>/<sectionNumber>
  bookId: string;                  // publisher's book id, e.g. IBC2018P6
  sectionNumber: string;           // publisher's number, e.g. R311.7 or 14-02-003
  editionId: string;               // required. no default. no undefined.
  editionLabel: string;            // human, from the code-edition atom
  editionEffectiveFrom: DateOrAbsence;   // adoption, not fetch
  editionCurrency: "current" | "superseded" | "unresolved";
  adoptedBy: string | null;        // jurisdiction tenant adopting a model edition; null when native
  sourceActorDid: string | null;   // null MEANS public record. never means unknown.
  accessPolicy: AccessPolicy;      // five-value union
  bodyDisposition: "hosted-verbatim" | "deep-link-only" | "reasoning-layer";
  deepLinkUrl: string | null;
  sourceUrl: string;
  fetchedAt: string;
  contentHash: string;
}
```

**Every field already has a home in the substrate. None of them reach the consumer.** That is the finding that makes this cheap rather than a rebuild. `CodeSectionAtomInstance` in `hauska-engine/packages/atoms/src/instances.ts` carries `codeEditionId`, `sectionNumber`, `title`, `accessPolicy`, `sourceActorDid` and `verbatimTextDeepLink`; `CODE_SECTION_SCHEMA` requires `codeEditionId: z.string().min(1)`. `CodeEditionAtomInstance` carries `editionLabel`, `effectiveFrom` and `effectiveTo`. `AtomSearchResult` in the retrieval layer carries `editionId` and `isCurrentEdition`. The loss happens at exactly two boundaries.

The first is `hauska-mcp-server/src/atom-shape.ts`. `AtomProvenanceEntry` carries `did`, `entityType`, `entityId`, `jurisdictionTenant`, `contentHash`, `cidNote`, a `source` triple, `sectionNumber`, `score`, `sourceActorDid`, `sourceCitation`, `iccSourced` and `citedAtomDid`. There is no edition field of any kind, and `provenanceFromSearchResult` does not copy the `editionId` that arrives on the search result. Every MCP consumer therefore receives a section number with no edition.

The second is `legacy-design-tools/artifacts/api-server/src/routes/findings.ts:523`. `toCodeSectionInput` projects a retrieved atom into `{ atomId, label, snippet }` and the engine's `CodeSectionInput` has no edition field for the corpus path. So the model that writes the finding text cannot know which edition it is citing. The perverse detail is that the web-search path is better provisioned than the authoritative one: `CodeSectionWebProvenance` on the same interface carries `edition`, `retrievedAt`, `verified`, `verificationState` and `displayMode`, all of which the corpus path lacks. The less trustworthy source carries more provenance than the corpus.

**`editionCurrency` replaces a fail-open boolean.** `annotateEditionCurrency` in `hauska-engine/packages/retrieval/src/index.ts` sets `isCurrentEdition` to a boolean or leaves it undefined, and the filter keeps everything except rows positively known superseded, with the comment saying so. Two problems. A tri-state expressed as `boolean | undefined` invites every consumer to write `if (isCurrentEdition)` and treat unresolved as superseded, or `if (isCurrentEdition !== false)` and treat unresolved as current, and both readings exist in one codebase already. And the comparison is our-scrape against our-latest-scrape: it resolves `jurisdiction-corpus.currentEditionId`, which is a fact about our ingest, not about what the jurisdiction adopted. So the three-value union is required and `unresolved` is a real, serveable, honest value that a reviewer sees.

**`bodyDisposition` makes the licence discipline machine-readable.** The ICC posture per `75n_icc_code_connect_catalog.md` is display by deep-link and never reproduce body text, and the substrate already encodes the mechanism: `verbatimTextDeepLink` on `CodeSectionAtomInstance` with an `isDeepLinkFootingSection` predicate, and `bodyText` carrying the reasoning layer rather than the normative text when it is set. Today that survives to the consumer as `bodyVerbatim: false` on a JSON response and as a CHECK constraint. Promoting it to a three-value field on the citation means the renderer, the letter generator and the licensor audit read the same value, and a section whose disposition is `deep-link-only` cannot be rendered as body text by a consumer that never learned the rule.

**`sourceActorDid: null` means public record.** It does not mean unknown. This distinction is load-bearing for the meter, because a null that might mean either is exactly the collapse ENFORCEMENT.md forbids under "absent, zero and unmeasured are three different states". Where the substrate has not determined the source actor, the citation does not construct; the atom is not served as a citable section until its source is resolved. That is the fail-closed reading and it is the one the contract takes.

**Consumers may not construct a citation.** They validate one and refuse. In the substrate this is a TypeScript type with no optional `editionId`. In the three products, which have no compiler, it is one small validator module vendored identically into each, exporting a single total function that returns the citation or throws, with a `node --test` suite that includes a not-vacuous fixture. The products need no constructor at all, because they never mint; the validator alone is the enforcement, and it is the only new shared code this contract creates.

**`displayText` is derived at render and never stored.** `plan_review_findings.citation` is `text NOT NULL` and holds hand-authored strings. `plan-review/src/server.mjs` and `src/mcp.mjs` between them hardcode six of them, including `"2018 International Building Code Section R311.7"` and `"2018 International Building Code Section R302.1"` for two sections whose numbers are IRC, paired with the book id `IBC2018P6` and an `iccsafe.org` deep link into the IBC. Storing the display string is what let that survive: there was no structured field for anything to disagree with. Under this contract that column is replaced by the citation object, and the string is computed at render from `bookId`, `sectionNumber` and `editionLabel`.

## Accrual record

**Owner:** the substrate store designated by O-1. **Append-only.** No row is ever updated.

**What the licensor needs, and does not get today.** `source_obligation_ledger`, created by `hauska-mcp-server/migrations/009_source_obligation_ledger.sql`, carries `source_actor_did`, `atom_did`, `tool`, `product`, `tier`, `request_id`, `obligation_type`, `amount_minor`, `currency`, `grace_terms` and `note`. It records the served atom DID and nothing that names a book, a section or an edition. ICC reading that table can count references and cannot determine which of their sections were referenced, which means they cannot check our number against their catalogue, which means the row cannot be reconciled and can only be believed. That is the defect, and it is a shape defect rather than a volume defect.

**Required row:**

```ts
interface AccrualRecord {
  sourceActorDid: string;
  referenceKind: "served" | "cited";      // required discriminator
  citation: Pick<Citation,
    "sectionAtomDid" | "bookId" | "sectionNumber" | "editionId" | "bodyDisposition">;
  occurredAt: string;
  requestId: string;
  surface: string;                         // tool name or route
  product: string;
  tier: string;
  engagementRef: string | null;            // present on cited rows
  rateBasis:
    | { kind: "resolved"; rateMinor: number; currency: string; rateSourceDid: string }
    | { kind: "unrated"; reason: "no-agreed-rate" };
}
```

**`referenceKind` is the fix for "records the served atom rather than the cited one", and it is a discriminator rather than a substitution.** A serve and a citation are both references to a licensor's material and they are not the same obligation: a retrieval window that returns forty candidate sections and a determination that cites four of them are different facts, and a licensor reconciling a statement needs to see both and tell them apart. Replacing the served row with a cited row would delete a real signal to fix a real gap. Adding the discriminator makes the difference visible and leaves the commercial question, which of the two kinds is billable, to O-3 and S4-B1 where it belongs rather than deciding it silently in a schema.

**`rateBasis` is a union because two nullable columns can disagree.** Today the row carries `amount_minor INTEGER NULL` and `grace_terms TEXT NULL` set to `"pending-rate"`, which is the right instinct, expressed so that a row can be written with an amount and a grace term, or with neither. The union makes "we have an agreed rate and here it is, from this authority" and "we have no agreed rate" the only two states, and makes them exclusive at the type level.

The other ledger is worse in exactly the way the doctrine names. `plan_review_activity` carries `rate numeric NOT NULL DEFAULT 0.01` and `amount numeric NOT NULL DEFAULT 0.01`, and `recordActivity` in `plan-review/src/store.mjs` passes `row.rate ?? 0.01`. Every caller in `src/server.mjs` omits it. So every row in that table carries a fabricated rate that never came from an agreement, entering sums, and the ICC-facing surface renders the total. The credit is that the table also carries `book_id`, `section_id` and `engagement_id`, which is more than the designated source of truth carries; the row shape above takes the good half of each.

**The write is not fire-and-forget.** `accrueSourceObligations` in `hauska-mcp-server/src/source-obligation-meter.ts` builds the rows and then runs `void (async () => { ... })()` with a try/catch that logs and continues. So an insert failure produces a log line and a successful serve, and an empty ledger is indistinguishable from no traffic. ENFORCEMENT.md is direct about this: if the record cannot be written, the mutation does not run. The requirement here is that the serve of a licensed-source atom and the accrual of its reference commit together, or the serve declines. A durable outbox written in the same transaction satisfies that. A detached promise does not.

**The detectors must agree.** Two of them disagree today and the disagreement under-counts against a licensor, which is the direction that matters. `hauska-mcp-server/src/access-policy.ts` treats an atom as ICC when `jurisdictionTenant === "icc-model-code"` **or** `sourceAdapter === "icc-code-connect"`. `source-obligation-meter.ts` never checks the tenant: `resolveSourceActorDid` tests an explicit `sourceActorDid`, an `iccSourced` stamp, membership in a three-element allowlist, an adapter substring match, a regex over the citation string, and a cited-DID recursion. An ICC section marked by tenant alone is withheld from the public catalogue by one detector and accrues nothing under the other. One definition, exported from one module, consumed by both.

**And the meter is bypassed entirely on the plan review path.** `wrap()` in `hauska-mcp-server/src/plan-review-tools.ts` calls `buildEnvelope(data, [], {...})` with a hardcoded empty provenance array, then `logToolRead({...}, env.atoms)`. `logToolRead` guards on `atom_ids.length > 0`, so no Codex plan-review tool call has ever accrued. That is one function, and it is the reason the non-negotiable ordering in the scope document puts the bypass fix before the rate.

## Absence, the fifth shared value

The four objects share one absence type, and the program inherits more than one absence vocabulary that do not currently agree with each other. Naming them all is the first requirement, because a lane that adopts one of them believes it has adopted the program's.

| Where | Vocabulary | Values | State |
|---|---|---|---|
| `_decisions/2026-08-12_zoning_absence_taxonomy.md` | discovery outcome | `NO-ZONING-AUTHORITY`, `NO-EUCLIDEAN-REGIME`, `ORDINANCE-NO-GIS`, `AUTH-WALLED`, `HOST-BROKEN`, `NOT-FOUND-UNKNOWN-WHY`, `LAYER-FOUND` | pinned; implemented in `hauska-engine/packages/engine-core/src/zoning-discovery/classify.ts` |
| `19_the_instrument_contract.md` §Layer | layer absence | `absent-verified`, `lookup-failed`, `not-applicable` plus `authority`, `scopeSearched`, `asOf`, `basis` | canon |
| `legacy-design-tools/.../verdictLayerServe.ts` | layer absence | same three, as `LAYER_ABSENCE_VERDICTS` | implemented |
| `smart-files/sql/001_foundation.sql` | document absence | `absent-verified`, `lookup-failed` | CHECK exists, no writer, no reader |
| `smart-files/src/store.mjs` `readDocument` | read status | `held`, `held-version-absent`, `not-sought` | implemented |
| `briefRetrievalSubstrate.ts` | retrieval failure | `not_configured`, `unreachable`, `http_error`, `invalid_response` | exported guard `isSubstrateRetrievalError`, not imported by `findings.ts` |
| `plan-review/src/server.mjs` IPMC branch | typed absence | `verified-absent` | implemented |

The last row is the finding that proves the point. Smart Files writes `absent-verified` and plan review writes `verified-absent`: the same two words in the opposite order, in two services that meet in this transaction. Neither is wrong on its own and no check can catch it, because each satisfies its own vocabulary. This is precisely what happens when four lanes build in parallel, and it happened between two.

**The contract's requirement, in terms a lane can implement.**

The three-verdict layer vocabulary from doc 19 is the program's absence type. It is canon, it is already implemented in two repos, and the seven-status discovery taxonomy is a different question: it classifies **why an acquisition attempt ended**, which is upstream of serving, and it is not a substitute. The mapping is one way and total, and a lane implements it as a function rather than remembering it:

| Discovery status | Serves as | Because |
|---|---|---|
| `NO-ZONING-AUTHORITY` | `not-applicable` | the category does not exist for this shape |
| `NO-EUCLIDEAN-REGIME` | `not-applicable` | the regime is real and is not this layer |
| `ORDINANCE-NO-GIS` | `absent-verified` | we looked, in a stated scope, and the GIS layer is genuinely not there |
| `AUTH-WALLED` | `lookup-failed` | we could not look |
| `HOST-BROKEN` | `lookup-failed` | we could not look |
| `NOT-FOUND-UNKNOWN-WHY` | `lookup-failed` | no positive determination was made |
| `LAYER-FOUND` | not an absence | populated |

Every absence served in this transaction is an object, never a bare status string:

```ts
type Absence =
  | { verdict: "absent-verified"; authority: string; scopeSearched: string; asOf: string; basis: string }
  | { verdict: "lookup-failed";   authority: string; scopeSearched: string; asOf: string; basis: string;
      failure: "not-configured" | "unreachable" | "http-error" | "invalid-response"
             | "paywalled" | "not-attempted" }
  | { verdict: "not-applicable";  authority: string; scopeSearched: string; asOf: string; basis: string };
```

Four rules bind a lane implementing it.

`lookup-failed` requires a `failure` value and the union makes it unforgettable. This is where S2-8's four kinds land: never-looked is `lookup-failed` with `failure: "not-attempted"`, source-down is `unreachable` or `http-error`, paywalled is `paywalled`, and genuinely-absent is the separate verdict `absent-verified`. Four of the six already exist as `SubstrateRetrievalFailureReason` in `briefRetrievalSubstrate.ts`, correctly typed and exported with the guard `isSubstrateRetrievalError`, and `findings.ts` does not import them, which is the "exists, is correct, and does nothing" shape the doctrine opens with. The fix is one import and one branch.

`lookup-failed` is never upgraded to `absent-verified` in transit, and no consumer re-classes an absence onto a weaker obligation. Doc 19 records this as a known unenforceable at the type level and it is a producer-honesty convention; a lane states it in review rather than claiming a control.

Withholding is not absence. A record the caller may not see is not `absent-verified`, which lies about the world, not `lookup-failed`, since the lookup succeeded, and not `not-applicable`, since the category applies. It rides in `scopeSearched` as the entitlement bound with a count in `basis`, and never names whose policy withheld it.

Only a positive determination writes an absence. An empty result is `lookup-failed` with `failure: "not-attempted"` and stays a question. This is the governing rule from the 2026-08-12 decision, restated in the layer vocabulary, and it is the rule that forbidden rule 2 below enforces in a diff.

The string spelling is `absent-verified`, matching canon and the two implementations. `plan-review`'s `verified-absent` is corrected, and the correction is a two-line diff on the IPMC branch of `/api/plan-review/code`.

# WHAT THIS FORBIDS

Each rule states the shape a reviewer can see in a diff, and whether a compiler can catch it or a human must. The five the program mandates come first.

**1. A citation without an edition.**

Reject: any citation-shaped object literal constructed without `editionId`; any type declaring `editionId?: string` or `editionId: string | undefined`; any projection of a retrieved section into a narrower shape that drops it, of which `toCodeSectionInput` at `findings.ts:523` is the live instance; any `editionId` filled from a fallback, a jurisdiction key, or a slice of an entity id. Compiler-enforceable in the substrate: make the field required and every dropping projection fails to compile. Validator-enforceable in the products.

Note a live edition-parsing bug that this rule does not by itself catch. `sectionLabelFromEntityId` in `legacy-design-tools/lib/codes/src/briefRetrievalSubstrate.ts` returns `{ sectionNumber: null, codeBook: entityId, edition: entityId }` when the entity id contains no slash, so a malformed id becomes its own edition label and passes a presence check. The rule that catches it is rule 5.

**2. An absence that cannot say which kind of absence it is.**

Reject: `catch { xs = [] }` or `?? []` or `|| null` on a retrieval result; a boolean `found` or `hasData`; a `status: "absent"` with no `verdict`; an empty array returned from a path whose caller reports success. The live instance is `findings.ts` around line 713, where a retrieval failure is caught, logged as a warning, leaves `codeSections` empty, and the run completes as succeeded, so "we could not reach the corpus" and "the corpus has nothing for this" are the same output.

**3. A confidence value with no provenance.**

Reject: a bare `number` on any field named `confidence` or `score`; a numeric literal assigned to one, of which `confidence: 0.92` in `hauska-engine/packages/engine-core/src/finding/mockGenerator.ts:115` and four instances in `packages/adapters/src/local/setbacks/bastrop-per-parcel-record.ts` are live; a confidence attached to a determination that makes no claim. Every confidence is `{ value, kind }` with `kind` from the existing three-value enum. Compiler-enforceable in the substrate.

**4. A determination inferred from silence.**

Reject: any code that treats an empty findings array as compliance; any write of `Pass` on a path where no section was evaluated; any matrix that omits a section it did not reach rather than emitting `Unchecked` with an absence. The prompt in `packages/engine-core/src/finding/prompt.ts` instructs that the findings array may be empty, and the types file states that a submission with no compliance issues yields an empty array. Both are correct for an **issue emitter**. Neither licenses a determination. The migration in S2-1 is where this rule will be tested, because that is the moment an issue emitter is asked to feed a section adjudicator.

**5. Any default standing in for an unresolved value.**

Reject, by literal shape: `?? "public-free"` (live on the atoms writer, `resolveAccessPolicy`); `|| IBC_SEED[0]` and `|| chapterHits[0]` (live in `plan-review/src/server.mjs`, serving a neighbouring section as the answer); `DEFAULT 0.01` and `rate ?? 0.01` (live on `plan_review_activity`); `actorDid || "did:hauska:actor:org:icc"` (live in `recordActivity`); any `pending:` or `unknown:` or `tbd:` string written into an id field, of which `pending:plan-review:<id>` is live on the override route; any `catch` that produces a value the caller cannot distinguish from a real one. The general form a reviewer looks for is a coalescing operator or a catch on the right-hand side of an assignment to a field that names an identity, a policy, a rate, or a source. Where the correct value is unknown, refuse.

Five more this program specifically needs.

**6. A consumer constructing a citation.** Reject any string literal containing a code book name next to a section number outside the substrate. Six are live in `plan-review/src`.

**7. A display string stored where a structured citation belongs.** Reject `citation text NOT NULL` and every equivalent. A rendered string is an output, never a record.

**8. Licensed verbatim body crossing the boundary.** Reject any write of `body_verbatim = true`, any migration dropping `plan_review_findings_no_verbatim_check`, and any assignment of an atom's `bodyText` into a rendered field where `bodyDisposition` is not `hosted-verbatim`. The existing CHECK is one of the few controls in the program that can actually fail, and it stays.

**9. Enforcement on the write path and absent on the read path.** This is the program's governing defect class and it has a mechanical diff signature: for every exported function taking a scope, tenant or caller argument, the sibling read must take one too. `smart-files/src/store.mjs` shows the shape exactly. `createFolder`, `uploadFileToFolder` and `createShare` all begin with `resolveWriteScope` and then `assertFolderInScope`. `listFolders`, `listFolderFiles`, `readDocument`, `listPlacements` and `getBlob` take no caller at all, and the route comment says the quiet part: "a non-empty scopeId is the whole rule on this route." `getBlob` takes a content CID and returns bytes with no scope in scope. A reviewer catches this by pairing signatures, not by reading logic. Related live instances: `atomVisibleToCaller` in `smartcity-dashboards/src/tenancy.mjs:114` returns `true` when `accessPolicy` is absent or empty, and `/api/lenses/city-manager/compose` resolves a caller and never gates on it.

**10. A cross-service read that is not HTTP-with-token or the one MCP.** Reject a DSN, a connection string, or a `pg.Pool` naming another product's database; reject a table in one product's schema treated as the system of record for another's. G-13 settles this and all three products already implement the defence as DSN denylists, which are a good instinct and a weak control: `plan-review/src/store.mjs` refuses a DSN matching `/fancy-fire|lucky-truth|06136146|tiny-art|snowy-bread/`, which is a hardcoded list of today's Neon project slugs and cannot refuse tomorrow's.

**11. Silent degradation.** Reject any `void (async () => {...})()` wrapping a durable write; any `catch` that logs and continues on a path that subsequently reports success; any response that is degraded and does not say so. Degradation is permitted only when declared in the output.

# OPEN

Six items. Each carries the specific question and a recommendation, so a ruling is a yes or a no rather than a design session.

**O-1. Which ledger is authoritative.** This is S4-1 and it is the one open ruling this contract genuinely cannot take, because it is commercial as much as technical. `plan_review_activity` works, carries the numbers the ICC portal renders, and carries `book_id`, `section_id` and `engagement_id`; it also carries a fabricated `DEFAULT 0.01` rate on every row. `source_obligation_ledger` is designated the source of truth by its own migration comment, is append-only, carries `request_id` and a nullable amount with grace terms, and has zero readers. Recommendation: **`source_obligation_ledger` is authoritative**, extended to the row shape above; `plan_review_activity` is repointed to write through the substrate and becomes a read cache with a retirement item filed in the same card, per the doctrine's retirement rule. Reason: the designated store is append-only, request-scoped and already sits where every serve passes, and moving a licensor's liability record into a separately sellable product's database makes the liability follow the product's lifecycle.

**O-2. Where the rate lives.** This is S4-9. The per-reference rate is currently a field on `ICC_ACTOR_RECORD_FIXTURE` inside the `@empressaio/atom-contract` npm package, read at `source-obligation-meter.ts` as `ICC_ACTOR_RECORD_FIXTURE.sourceLicensing?.perReferenceRateMinor`, which makes setting a commercial rate an npm publish. Recommendation: **an actor atom in the store**, resolved at accrual time, with `rateBasis.rateSourceDid` naming the atom that supplied it. A rate whose provenance is a package version cannot be reconciled against an agreement.

**O-3. Whether `referenceKind: "served"` is billable.** The contract requires both kinds to be recorded and distinguishable; it does not decide which one generates an obligation, because that is S4-B1 and it is the operator's to agree with ICC in writing. Recommendation: **`cited` is billable, `served` is recorded and not billed**, pending the agreement. Reason: a citation is a use of the licensor's material in a work product; a serve into a retrieval window is closer to an index lookup, and billing it would make our retrieval breadth the licensor's revenue, which is an incentive nobody should want.

**O-4. The tenant identity of a Wave 1 submittal.** `plan-review/web/app.js:6` hardcodes `template-city` while every persona writes into `icc-demo`, so the surface and the store disagree about which city this is. Recommendation: **`template-city` is the tenant and `icc-demo` is retired to a QA-only persona set**, because R-C makes template-city the demo city and the end-to-end test at once, and a document whose identity says `icc-demo` is not evidence that the transaction worked on the demo city. This sits inside S1-16, which already scopes de-hardcoding `CITY_KEY` on the supplier side.

**O-5. Who mints the citation for an out-of-corpus section.** The Brief path falls back to web search when a jurisdiction is outside engine coverage, and that path produces `CodeSectionWebProvenance` carrying `edition`, `verified` and `verificationState: "unverified-web-source"`. That is a citation-shaped thing minted outside the substrate, which rule 6 forbids. Recommendation: **the substrate mints it too**, as a citation with `bodyDisposition: "reasoning-layer"`, `editionCurrency: "unresolved"` and a `sourceActorDid` of `null` meaning public record, with the unverified state riding on the determination's confidence `kind` rather than inside the citation. Reason: a second minting path is a second definition of a citation, which is the exact failure this document exists to prevent, and the web path's provenance fields map cleanly onto the fields above.

**O-6. Whether `contested` enters the determination vocabulary in Wave 1.** Doc 19 carries a `contested` layer status for the real case where two authorities both have standing, such as an ETJ parcel where a city code and a county order set different setbacks. The determination vocabulary has no equivalent, and `Uncertain` would collapse a genuine conflict of authority into a missing fact. Recommendation: **not in Wave 1**, and reserve the value: do not widen the CHECK constraint now, and do not let any lane use `Uncertain` to mean "two authorities disagree" in the meantime, because a value used for two meanings is harder to split later than to add.

## What I could not establish

Carried forward rather than guessed, each with the command that settles it. Nothing was executed for this pass.

The contents of `ICC_ACTOR_RECORD_FIXTURE.sourceLicensing`, including whether `perReferenceRateMinor` is present at all and what `meterFreeTier` is set to. The clone has no `node_modules` and `@empressaio/atom-contract` is a published dependency at `^1.9.0`. Settles with: `npm pack @empressaio/atom-contract@1.9.0` and reading the `reasoning` export from the extracted package, or `npm install` in `P:/tmp/scope_20260824/hauska-mcp-server` and reading `node_modules/@empressaio/atom-contract`.

Whether migration `009_source_obligation_ledger.sql` is applied to the deployment Neon, and therefore whether the ledger is empty because it has no traffic or because every insert throws into the swallowed catch in `accrueSourceObligations`. These are two different diagnoses with the same observation and the doctrine requires stating both. Settles with: `SELECT to_regclass('public.source_obligation_ledger');` then `SELECT count(*) FROM source_obligation_ledger;` against the MCP server's Neon, reading the catalog rather than inferring absence from a query shape.

Whether any row in `source_obligation_ledger` exists at all. O-1 says "zero readers", which is established from source, and describes the table as empty only on the strength of the scope document rather than a count taken in this pass. Same query.

Whether `plan_review_findings` in the deployed plan review database has ever carried a `Pass` or `Fail` row, which determines whether the four-value CHECK has been exercised beyond the two values `matrixFromChain` emits. Settles with: `SELECT determination, count(*) FROM plan_review_findings GROUP BY 1;`.

Whether the citation validator described above can be vendored into all three products without a build step. It is true on inspection of their `package.json` files, all of which declare `"type": "module"`, `pg` as the only runtime dependency and no build script, but it is not proven until one validator is written and its `node --test` suite runs green in all three. This is the first task of S5-2 and it should be verified by violation, against a citation missing `editionId`, before anything else in this contract is trusted.
