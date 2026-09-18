## Mission — P-270, the address half: the card's address line takes its city and ZIP from the ledger

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` and, if the MCP's address line has the
same gap, `legacy-design-tools`; one PR per repo, each from current `origin/main` with the SHA declared.
You do not merge or deploy; the integration seat does both. The probe predicate below is a doc_repo
change: hand it back as a diff in your close.

### What is still open

P-270's Done has three clauses. Two are live: the zoning row names its jurisdiction (X2 CLOSED on 37 of
37 subjects) and an undated citation declares itself (24 declared). The first clause is not built, and
the 2026-09-17 card-truth close said so: **the address line takes city and ZIP from the ledger.**

Measured 2026-09-18 on P-270's own subject, Pflugerville `48453:445501`:

| Where | City | ZIP | Address line |
|---|---|---|---|
| Factory ledger (`parcel_record_cell`) | `situsCity` absent-verified (the county roll has none); `cityLimits` value `Pflugerville` | `situsZip` value `78660` | |
| Card payload (`/api/spine/property-atoms/48453:445501/facets`, `baseFacts`) | none | none | `21404 GRAND NATIONAL AVE` |

So the card has the ZIP in its own ledger and does not carry it, and it has an incorporated city it
could name. The same shape shows on the probe's XD-7 population (12 subjects serving a district with no
composed address); those that lack a situs entirely are P-335/P-350's (Williamson) and are not yours,
but any subject whose ledger holds a city or ZIP that the card drops is.

### What to build

1. **The card carries what the ledger holds.** Find where hauska-map maps ledger cells into
   `baseFacts` (`apps/property-explorer/api/_lib/pe-record-to-facets.ts` is the likely site; P-332
   also edited it) and carry `situsZip`, and `situsCity` where it is a value.
2. **A city the roll does not state is not invented.** Where `situsCity` is absent-verified and
   `cityLimits` names an incorporated city, the address line may name that city only as what it is
   (the city whose limits contain the parcel), never as the roll's mailing city; say how you labelled
   it. An unincorporated parcel with no roll city names no city.
3. **Every surface that composes the address line**, including the MCP's `get_smart_site` answer in
   `legacy-design-tools` if it composes its own, does the same. Name each site.
4. **The probe gains the predicate (doc_repo diff).** `scripts/surface-probe.mjs`'s X2 grader
   (`jurisdictionNamed`) checks the zoning row only. Add an address predicate: where the payload
   carries a ledger ZIP or city, the composed address contains it; FAIL where the ledger holds one and
   the address line drops it; UNMEASURED where the payload carries neither. Prove it both ways against
   the live shape of `48453:445501`.

### Verify by violation

Pre-register your falsifiers. Revert-and-run: the pre-change card drops ZIP 78660; the post-change card
carries it, and a parcel whose address already reads fully is byte-identical. Name the probe for after
the deploy: `--rows P-254` in doc_repo with your predicate, PASS on `48453:445501`.

### The three-question gate

Answer in your close: what executes the address composition, what triggers it, what fails when a
surface drops a ledger ZIP again, and what bypasses it (the share view, the PDF, the MCP).

### Constraints

- No store writes, no deploys, no merges.
- hauska-map main carries P-332 (#419) in `pe-record-to-facets.ts`; keep its ETJ changes intact.
  P-339 to P-341 and P-353 are in flight in this repo; name any file you share.

### Close

Declare: the start commits and PRs, every address-composing site found and changed, how an inferred
city is labelled, the predicate diff with both directions shown, the falsifiers, the three-question
gate answers, and `leave_behind`.
