# CTX-HAYS-BACKFILL — the two-column backfill that does not exist yet

repo: legacy-design-tools

CTX-HAYS-REBIND (#653, merged `c43e2436`) added `quick_ref_id` and `property_number` to
`cad_property` in migration 0099, which is applied to production. Nothing populates them. The
lane's own close said "re-ingest", corrected that word in place, and named why it was wrong.

**Running the export through the existing CLI is a re-ingest, not a backfill.**
`upsertCadProperties` builds a whole row. It has no delete, and `marketValue` is
`COALESCE(excluded.market_value, existing)` so incoming wins, while `sourceFile` and
`sourceVintage` are overwritten unconditionally.

Measured, production read-only, joining the store's 134,606 rows to the export's 134,591
accounts: a re-ingest would change **45,524 of 134,216 market values**, roughly **5.8 billion
dollars of absolute movement**, overwrite `source_file` on the 134,216 it touched, and leave
`PRELIMINARY` on the 390 it did not. Nobody scoped that.

## What to build

A single-purpose CLI that writes **only** `quick_ref_id` and `property_number` onto rows that
already exist.

Constraints, each of which should be a test that fails when violated:

- **Never INSERT.** A prop_id in the export with no row on the roll is skipped and counted, not
  created. 390 such rows exist today and they must stay NULL.
- **Never an empty string.** A missing identifier stays NULL. Migration 0099 says NULL means
  "not published / not acquired" and a null key can never produce a bind. An empty string would
  be a key that binds nothing while looking populated.
- **Refuse a tax_year that is not the declared vintage.** Hays is 2026. Reading
  `DECLARED_CAD_VINTAGES` rather than taking a flag is preferable; argue whichever you choose.
- **Touch no other column.** Not situs, not owner, not a value, not `source_file`. This is the
  whole reason the tool exists.
- **Leave a durable record** naming county, tax_year, source file, rows matched, rows updated,
  rows skipped for no roll row, rows skipped for a null identifier. A count alone is not a
  record.

## The archive trap that already cost a false start

Every member of every inner zip is named `PropertyDataExport<n>.txt` and the numbering is not
mnemonic. Only the enclosing zip names the record type:

    449 PROPERTY   134,592 records   40 header columns
    450 OWNER
    451 LAND
    452 IMPROVEMENT  103,490 records  11 header columns
    453 SEGMENT
    454 SALES

**PROPERTY and IMPROVEMENT share their first four columns**, `RecordType, PropertyID,
QuickRefID, PropertyNumber`, so a header check for the identifier columns passes on the wrong
file. Column 5 is the first divergence, `LegalDesc` versus `InstanceID`. The integration seat
read 452 believing it was the roll and got 103,490 where the truth is 134,592.

Your reader must refuse a member whose shape is not the PROPERTY shape, and say how it decided.
Header width is the cheapest discriminator; take it or beat it.

## What the backfill is expected to reach

Re-derive these rather than trusting them:

    134,216 of 134,606 roll rows get both identifiers
        390 stay NULL, correctly, and are the fail-closed population
    115,033 usable keys after the backfill
     30,861 parcels would rebind geometry
     19,901 would gain geometry they do not have

## What you must NOT decide

**Which drop should be Hays' declared 2026 roll is an open operator question and it is not
yours.** The loaded PRELIMINARY export and the 8-26-2026 export disagree on 45,524 valuations.
Do not resolve it, do not switch the declared vintage, and do not let the backfill quietly
import a value from the newer drop.

## Verify by violating

Each constraint above fails a test before it passes one. At minimum: an export row with no roll
row must not create one; a blank identifier must leave NULL rather than an empty string; a
wrong tax_year must refuse; and a run must be provably unable to alter a market value, which is
the constraint with real money behind it.

## Scope

`legacy-design-tools` only. No writes to hauska-factory, hauska-engine or hauska-map. **Do not
run the backfill against any store.** Build it, test it, and hand it back. The integration seat
executes it, staging first.

Register your worktree before working. Declare seat, branch and commit.

## Close contract

Standard lane close JSON, plus: the member-discrimination rule and how you tested it; the
re-derived counts; every violation run; the exact invocation the integration seat should use for
staging and for production; and `leave_behind`. Push and open a PR. Do not merge. Report the PR
number and head SHA.
