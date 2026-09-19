## Mission — P-376: an incorporated parcel is outside every ETJ, and the reader says so

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` and open one PR from current
`origin/main` with the SHA declared (`ad99acaa` at compile). You do not merge, deploy or write any store.

### What is wrong (measured on the cortex-api canary, 2026-09-19; `_inbox/2026-09-19_a231_merges_etj_deploys_RECORD.md` section 4)

P-359's reader refuses a ring it cannot test (excluded or withheld) and answers `unresolved` for any
point that ring could reach. That is right for an unincorporated point. On the canary, 9 subjects moved
from `absent` to `unresolved`, and most are INCORPORATED by the same fact's own city-limits line:
`48021:14899` (Elgin), `48209:145880` (Kyle), `48209:166141` (San Marcos), `48209:140047` (Buda), plus
`48209:150937`, `48453:445501`, `48453:959606`, `48453:941831`, `48453:352594`. A Texas ETJ is the
unincorporated area contiguous to a city (Local Government Code ch. 42), so an incorporated parcel's ETJ
answer is settled by its incorporation, and no ring needs testing.

### What to build

1. **Read the city-limits basis first.** In the ETJ determination (`etjFactRead.ts`, and the
   determination `containment.ts` returns), when the parcel's city-limits fact reads incorporated with
   a real basis, answer not-in-an-ETJ with that basis and the legal ground named, before any ring is
   consulted. Say what "a real basis" is (the fact's own source and vintage); a city-limits fact that is
   itself unmeasured or unresolved does not settle the ETJ.
2. **Everything else unchanged.** An unincorporated parcel near an excluded ring still reads
   `unresolved` with the refused ring named; a point a derived or verbatim ring contains still reads
   `present`.
3. **One vocabulary.** No new ETJ status token unless the existing ones cannot express it; if one is
   needed, say why and add it through the shared vocabulary, pinned cross-repo (P-331's check).

### Verify by violation

Pre-register: the nine canary subjects (their incorporated ones read not-in-an-ETJ; any unincorporated
one stays `unresolved`); a fixture where the city-limits fact is unmeasured still reads `unresolved`; a
fixture of an unincorporated point inside a verbatim ring still reads `present`. Grade after deploy:
the signed probe's ETJ rows and a canary-compare (`scripts/cortex-canary-compare.mjs`) whose only
differences are on the ETJ path.

### The three-question gate

What executes the incorporation check, what triggers it, what fails when an incorporated parcel is read
into an ETJ, and what bypasses it.

### Close

Declare: the start commit and PR, the rule and its legal basis, the falsifiers with both directions
shown, the three-question gate answers, and `leave_behind`.
