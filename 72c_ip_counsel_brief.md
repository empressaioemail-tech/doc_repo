---
id: 72c_ip_counsel_brief
title: IP counsel brief — portfolio triage, inventory, and questions
status: draft
last_updated: 2026-08-26
applies_to: portfolio
owner: nick
supersedes: rd_dt_03_ip_counsel_brief
related: [19_the_instrument_contract, 24_instrument_conformance_program, 03c_records_as_instruments_positioning, 72_hauska_inc_operations, 13_risk_register, 72b_capital_readiness_audit, 80_adrs/adr_012_atom_export_format, 80_adrs/adr_030_declared_is_not_armed_contract_surface_governance]
---

# IP counsel brief

## What this is

A working agenda for the conversation with IP counsel, written by a non-lawyer as questions and inventory rather than as conclusions. Nothing below states a legal position. Every item is something to put to counsel.

It replaces [`_rd_disclosure_twin/03_ip_counsel_brief.md`](_rd_disclosure_twin/03_ip_counsel_brief.md), which was scoped from the Disclosure Twin outward. [`19_the_instrument_contract.md`](19_the_instrument_contract.md) (2026-08-22) superseded [`77_place_graph_strategy.md`](77_place_graph_strategy.md) as north star and now governs the twin read contract as one specialisation, so the counsel engagement is scoped at the portfolio and the twin appears here as one instance. The twin material is preserved in full below.

**Standing rule, unchanged.** IP counsel runs parallel to bizops and is never a critical-path gate. It does not gate ingestion, does not gate a Sync point, and does not appear in any build sequence as a blocker. This is stated in [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md), in [`13_risk_register.md`](13_risk_register.md), and as row 8 of [`72b_capital_readiness_audit.md`](72b_capital_readiness_audit.md), and it survives this rewrite.

## Status: a filing is already in flight

Updated 2026-08-27 from the IP strategy call with Jonathan, counsel. This changes the brief from a cold agenda to a live matter, and several items below were written before it.

Counsel is preparing a federal filing now, with a Texas Secretary of State filing as a possible addition, and will circulate a draft for review before anything is filed. What counsel is waiting on: a plain-narrative write-up of the process and what makes it unique, a written summary of the call, the filing address, and developer attribution.

The narrative was written 2026-08-27 and is held at `_private/2026-08-27_invention_narrative_for_counsel.md`, deliberately outside version control. It describes the conversion process, the four-domain evidence that the process rather than any vertical is the subject, what is running against what is only designed, chain of title, and the full public-disclosure position with dates. It is not tracked because this repository is public and the document is a pre-filing description of the invention.

**Ownership, decided on the call, and it supersedes the assignment question further down.** The intellectual property is to be held by Nick and Val personally, fifty-fifty, rather than under any existing entity, and leased to the operating businesses. Counsel offered to propose a structure. The earlier framing in this brief, which asked about assignment hygiene across Legacy Group ATX LLC and Hauska Inc., assumed entity ownership and is superseded by that decision. The reasoning is recorded in the call transcript and is not repeated in any tracked document.

**Chain of title, established on the call.** Every line of code in current use was written by Nick personally after roughly thirty-five contract developers over about five years produced nothing usable. The prior contractor repository is frozen and retained and can be compared directly against the current code base, which is the evidence for the claim. No work-for-hire question is outstanding.

**Counsel's own recommendation, not yet in place.** A short non-disclosure agreement for use when the system is shown to third parties. Several parties have asked for the same thing to be built for them, and the First American written summary is pending.

**Two open items.** The 2026-06-26 PDFs `Hauska_IP_Counsel_Brief.pdf` and `Empressa_IP_Counsel_Brief.pdf` sit unread in the operator's Downloads and are referenced nowhere in this repository; they predate the twin-scoped brief by seven weeks and may already answer questions asked here. And the twin brief named counsel as Hullihan while the call names Jonathan; whether that is one person or two has not been established.

## Two engagements, not one

The repo has been tracking two different asks under one name, and they need separating before either is routed.

**This brief is the protection triage.** What to file, what to keep secret, what is already lost to publication, what the freedom-to-operate exposure is, and clearance to publish the positioning material without foreclosing anything worth keeping.

**The other is a data-licensing liability memo.** Whether ingestion and downstream outputs exceed source-license scope, tracked in `72_hauska_inc_operations.md` under IP attorney memo and as a mitigation under the reliance-and-license risk in `13_risk_register.md`. That memo concerns county CAD, Municode, ICC, and the scrape posture ruled 2026-08-04. It is a different question set and possibly different counsel.

Counsel question zero: are these one engagement or two, and if one, in what order.

## What counsel should understand about the model

Five sentences, because the questions below only make sense against them.

We mint identifiers for records and countersign what the holder never sends us, so bytes stay with the holder and we attest form, identity, and who asserted a thing, never that content is true. Identity is given away and the join is metered: composing an instrument with jurisdictional, hazard, encumbrance, or market context is the priced act. A publisher's track record is computed across many publishers against outcomes and cannot be self-issued, which is the ratings shape rather than the vendor shape. Verification is free and unauthenticated by design, because an attestation you must pay to check is not an attestation. A holder can leave with their instruments, ids and the ability to verify, forfeiting only the join and the score.

The positioning language is in [`03c_records_as_instruments_positioning.md`](03c_records_as_instruments_positioning.md). The model is [`19_the_instrument_contract.md`](19_the_instrument_contract.md).

## What is built versus designed

Counsel should not be told we hold something we do not. Per [`80_adrs/adr_030_declared_is_not_armed_contract_surface_governance.md`](80_adrs/adr_030_declared_is_not_armed_contract_surface_governance.md), a capability is claimable in present tense only where the armed-state table in `19` says armed, and that table is the authority over anything in this brief.

The material gap that bears directly on filing: **"we sign what we never see" is today "we hash what we never see."** `19` records that the export path under ADR-012 ships a field named `signedEventChain` carrying no signature and no key, verified by an unkeyed SHA-256 chain whose formula is published inside the package. That is tamper-evident against corruption and forgeable by anyone who can run the same function. The countersignature is designed and not built.

Two consequences to raise. It bounds what external copy may claim without misrepresentation exposure. And because the mechanism is unbuilt and unpublished, the publication bar has presumably not started running on it, which may make it the most filing-ready item on the list rather than the least.

**This is not hypothetical, and counsel should be told so plainly.** The live overview deck described in the inventory below states in present tense that whoever supplied the data behind an answer gets paid automatically, that a named licensor is metered and paid per lookup, that confidence is earned by checking past calls against outcomes, and that every call is sealed when made so it cannot be changed later. The armed-state table in `19` rules out rights-holder payment as distinct from attribution, and rules out calibrated confidence on the property store. The sealing claim rests on the unkeyed chain described above. Three of the four are claims the portfolio's own armed test rejected on 2026-08-22, six weeks after the deck went up. Bringing that copy into line is an operator decision that sits outside this brief, but counsel should see the exposure since it names a real counterparty.

## Publication inventory

The publication-bar question needs the current inventory rather than the one in the superseded brief. Each line carries its verification date, and the two marked unverified should be re-run before the meeting.

**Published and public.** `@empressaio/atom-contract` on npm, through v1.22.0, root plus eleven subpaths, sixteen minor versions between 2026-07-07 and 2026-08-12 (verified live 2026-08-20; subpath count read from the published tarball's `dist/*.d.ts` on 2026-08-22). The older `@hauska/atom-contract` name is frozen at 1.6.1 and appears in historical records. Several SDK packages are public. The MCP server exposes tools across four gates on deployed main, with an anonymous public tier reachable without a credential.

**Published and public: the overview deck.** A twenty-one-slide system-overview deck is live and unauthenticated at `empressa-overview.vercel.app`, source at [`system-overview-site/index.html`](system-overview-site/index.html). It describes the four-layer architecture, the self-describing fact and its six fields, typed nodes and edges, the calibration loop, the anticipatory or forward-looking fact, the access and consent field, and the metering, settlement and anchoring rail, and then applies all of it across real estate, energy, markets, insurance, healthcare, diligence, robotics and general filing. It is in the repo from 2026-06-30 and last changed 2026-07-13; the actual first-deploy date must come from Vercel rather than from git, and counsel will want it. There is no `robots.txt` and no noindex, because a catch-all rewrite returns the deck for every path, so it is fully indexable.

**There are now two public versions of this deck, and counsel needs both.** The version described above was public from roughly 2026-06-30 until 2026-08-27, and its exact bytes are preserved at commit `873868f` in `system-overview-site/index.html`, which is the artifact to produce for the disclosure question. On 2026-08-27 it was revised on the operator's instruction and redeployed: the title, the four unarmed present-tense claims, the marketplace framing and the closing slide were rewritten to match `03c`. The mechanisms it discloses are unchanged by that revision, so the earlier date still governs the bar clock. What changed is the claims, not the teaching.

**Published and public: this repository, and the specification inside it.** `doc_repo` is a public repository on GitHub, verified 2026-08-26 two ways: `gh repo view` returns `"visibility":"PUBLIC"`, and an unauthenticated fetch of `raw.githubusercontent.com` returns `19_the_instrument_contract.md` at 55,743 bytes, `03c_records_as_instruments_positioning.md` at 17,438 bytes and `CLAUDE.md` at 25,124 bytes, each matching the local file exactly. The repository was created 2026-05-05 and currently shows zero forks and zero stars, though those counters are weak evidence of reach and none at all of indexing or scraping.

This is the controlling disclosure, not the deck. `19` describes the mint, the countersignature, the conformance levels, the two scores and the absence verdicts in more detail than any deck would, and the deck contains none of them. This brief is in the same public repository.

Sixteen of the twenty-six repositories on the account are public, including `hauska-engine`, `hauska-mcp-server`, `hauska-atom-contract`, `smart-files`, `legacy-design-tools`, `plan-review` and `icc-demo`. The operator has decided to flip repositories to private and accepted publication in the meantime, so counsel should be told that going private does not un-publish: anything already cloned, forked, indexed or scraped stays out. **When the repositories became public is not recoverable from the git history and must come from GitHub's audit log or from the operator.** That date, not the commit date, is what dates several of the disclosures below.

**About to publish deliberately.** The positioning material in `03c`. It is already publicly readable through the repository, so the clearance ask is about a deliberate marketing publication rather than about first disclosure, which has already happened.

**Discussed with third parties.** The architecture has been discussed with prospective partners and counterparties. An NDA question rides with this: the First American written summary is owed and gated on their entity name and type, which is a separate thread from this brief but the same counsel conversation.

### Earliest public artifact per mechanism

Different mechanisms went public in different artifacts on different dates, so there is no single bar clock. Commit dates below are from `git log --reverse` in this repository on 2026-08-26 and are the date the file entered the repository, which is the disclosure date only if the repository was already public then. That is the open question above.

| Mechanism | Earliest public artifact | Date | How established |
|---|---|---|---|
| Provenance ladder, confidence with a count behind it | overview deck, then the published npm package | 2026-06-30 in tree | git first commit; deck text read 2026-08-26 |
| Metering, usage ledger by source, settlement, anchoring | overview deck | 2026-06-30 in tree | same |
| Anticipatory or forward-looking fact with probability and future date | overview deck | 2026-06-30 in tree | same |
| Typed nodes, typed edges, shared node billed per use | overview deck | 2026-06-30 in tree | same |
| Access and consent carried on the fact | overview deck | 2026-06-30 in tree | same |
| Mint and countersign without receiving content | `19` in this repository | 2026-08-22 commit | git first commit `b3c8eea` |
| Two-score conformance, declared against verified | `19` | 2026-08-22 commit | same |
| Absence verdicts as distinct machine states | `19`, and separately a table in the public `smart-files` repository | 2026-08-22 commit; smart-files date not established | git first commit; the smart-files date is owed |
| Custody gradient | not located in any public artifact by this pass | not established | absence of a finding, not a finding of absence |
| Conformance levels, lens, subject and authority axes | `19` and `_decisions/2026-08-22_atom_layering_target_state.md` | 2026-08-22 commit | same |

The deck was checked mechanism by mechanism rather than read impressionistically: it contains no occurrence of mint, countersign, absence, unmeasured, conformance, lens, declared, verified level, custody, grant, tenant, portable, or the word instrument.

## Trademark and certification mark

**1. The certification mark question, which is the largest item in this brief and was absent from the prior version.**

`19` establishes that a surface may claim conformance to the contract only by publishing a passing run of a fixture set plus a behavioural suite, stamped with the fixture-set hash and the commit it ran against, re-run on every contract bump. `24` Track 4 leaves open whether the conformance registry is built now or later.

If that stamp becomes a mark that other parties display, our understanding is that it is a certification mark rather than an ordinary trademark, which we believe is a distinct registration category with its own rules about who may use it and about non-discriminatory administration. We want counsel to confirm the category, state what administering one obliges us to do, say whether the owner may use its own mark on its own goods, and advise whether to file before or alongside building the registry.

This is the item most likely to change the sequencing of a build decision, which is why it leads.

**2. Ordinary marks, clearance and classes.** Empressa, and the Empressa Solutions entity-versus-brand question. Hauska, existing use. The Smart Files, Smart Site and Smart Athlete family; confirm current live usage of Smart Site before clearing, since it shipped to production under that name on 2026-08-03. Disclosure Twin as a service-name candidate, likely descriptive, and counsel's view on protectability against picking a coined name.

**3. Slogans.** "We turn records into instruments" is now the load-bearing line and is the one to clear first. "We build digital economies" and "Tokens Need Twins" carry over from the prior brief. Do not spend clearance budget on "truth layer" or "ground truth"; both were deliberately retired as load-bearing language and survive only as an unprotectable hook.

**4. Priority against imminent publication** of the positioning material, per the inventory above.

## Patent landscape, candidate subject matter for triage

Re-scoped to the general mechanism, with the twin as one instance rather than as the frame. We hold no illusion that all of this is patentable. We want the triage.

1. **Mint and countersign without receiving content.** The holder runs local code, sends proposed shape, content hashes, declared authority, provenance class, proposed access and alias set, and receives minted ids, a countersignature over the hashes, the contract version, and a conformance result. Bytes never move. Note the built-versus-designed gap above.

2. **The measurement-provenance ladder.** A provenance class carried on every published value, where the class determines which fields are required, enforced at validation. This is the one rule in `19` that passes the portfolio's own four-question control gate, meaning it is the mechanism most clearly reduced to practice.

3. **Honest absence as a machine artifact.** Verified absence with mandatory scope, distinguished in the type from lookup failure and from unmeasured, so that three states never collapse into one and each is separately machine-actionable.

4. **Two-score conformance.** A declared level asserted by the minter and a verified level that requires a second independent derivation, published together so that a filter states which score it filters on. The self-report problem and its separation is the inventive part, if any.

5. **Continuous attestation of state.** The linkage-definition to twin to drift-detection to tamper-evident feed method, which is the generalized reconcile mechanism and the twin's specialisation of item 1.

6. **The custody gradient.** Per-key-class custody states with chained transitions and self-custodied consent keys.

7. **Counsel's frank view** on patentability against cost against the publication bar, given that items 2 and 3 are already shipped in a published npm package and item 1's distinguishing half is not.

## Trade secret and the open boundary

The boundary is sharper than the prior brief stated it, and the sharper version is the one to work from.

1. **Deliberately given away.** The atom contract and the mint. This is an operator-led standard strategy: the identifier is worth more the more places it resolves. Counsel's guidance on what license the published packages should carry going forward, given that goal.

2. **Deliberately retained.** The join, meaning the lens composition that places an instrument in jurisdictional, hazard, encumbrance and market context. The cross-publisher track record, which is computed against outcomes across many publishers and by construction cannot be self-issued. Calibration data and outcome ledgers. Evidence-chain corpora and adapter know-how. These are time-moat assets that cannot be reverse-engineered from the published contract, which is why the contract can be published at all.

3. **Employee and contractor IP assignment hygiene** across Legacy Group ATX LLC and Hauska Inc., as a precondition for any of the above.

## Liability and structure

Three questions the prior brief did not ask, each arising from the refined model rather than from the twin.

1. **Publishing a track record about a named third party.** We compute and publish a publisher's reliability from independent sampling. That is the ratings-agency shape. Counsel's view on defamation and trade-libel exposure generally, and separately on whether scoring issuers or their disclosures in the markets context touches ratings regulation.

2. **Publishing verified absence as a finding about a named party.** Carried forward from the prior brief's 2026-08-16 scope note, where it was raised for public companies. The general form is that we assert, with stated scope, that a record does not exist. No incumbent does this, which makes it unprecedented rather than merely conservative.

3. **Neutrality and rate structure.** The publisher model rests on an argument that only a neutral third party can assemble a catalog that includes a rights-holder's competitors, and entity separation between Legacy Group ATX LLC and Hauska Inc. is what is claimed to buy that neutrality. Rates are negotiated bilaterally per publisher and deliberately never pooled and divided by formula, specifically to avoid becoming a collecting society. Counsel's view on whether the separation as structured delivers the neutrality claim, and whether a neutral intermediary setting per-publisher rates raises anything we should know about before the first rights-holder conversation.

## Freedom to operate

The target has changed. The prior brief aimed the search at the tokenization platforms, and its own 2026-08-16 scope note already demoted that when the twin redirected from tokenized RWAs to publicly traded companies.

Under the portfolio framing the search is against registrar, identifier-resolution, attestation, certificate-authority and content-provenance families rather than tokenization platforms. Securitize and tZERO remain background: the prior brief records that the two entered patent litigation against each other circa June 2026 over tokenization methods, which is carried forward here as reported and is **not independently verified in this repo.** Confirm before relying on it.

## The Disclosure Twin, preserved

The service concept is at [`_rd_disclosure_twin/01_service_concept.md`](_rd_disclosure_twin/01_service_concept.md) and the running precedent at [`_rd_disclosure_twin/02_cockpit_precedent.md`](_rd_disclosure_twin/02_cockpit_precedent.md). Two items specific to it ride into the triage above. The instrument-scope identity design in [`_rd_disclosure_twin/08_build_scope.md`](_rd_disclosure_twin/08_build_scope.md). And publishing verified absence as a finding about a named public company, which is item 2 under liability.

Ruling 9 redirected the service from tokenized RWAs to publicly traded companies, which is why the Securitize and tZERO freedom-to-operate question became background rather than a channel gate.

## What we want out of meeting one

A triage. What to file, what to keep secret, what is already lost to publication, whether the conformance stamp is registrable as a certification mark and what administering one costs us, what the freedom-to-operate exposure is, and clearance to publish the positioning material without foreclosing anything worth keeping.

## Provenance of this brief

Compiled 2026-08-26 against `doc_repo` `main` at `9753b83`. Content sources: `_rd_disclosure_twin/03_ip_counsel_brief.md` at 2026-08-16 for the trademark, patent and trade-secret inventory; `19_the_instrument_contract.md` and `24_instrument_conformance_program.md` at 2026-08-22 for the model, the conformance requirement, the signature gap and the open items; `03c_records_as_instruments_positioning.md` at 2026-08-22 for the commercial frames and the retired vocabulary; `CLAUDE.md` and `_decisions/2026-08-22_atom_layering_target_state.md` for the npm publication figures.

Repository visibility was established on 2026-08-26 by two independent derivations: `gh repo view --json isPrivate,visibility`, and an unauthenticated `raw.githubusercontent.com` fetch whose returned byte counts were compared against the local files. The deck was read by decoding the bundled template in `system-overview-site/index.html` and extracting its text, and its slide count of twenty-one comes from counting direct-child sections of `#deck`, not from the on-screen counter, which is a stale hardcoded `13` the nav script overwrites at runtime.

Three claims in this document are unverified and marked as such in place: the Securitize and tZERO litigation, the live production usage of the Smart Site name, and the date the repositories became public. Everything else traces to a file read or a command run on the compile date, and the npm and store figures are claims about their stated verification dates rather than about today.
