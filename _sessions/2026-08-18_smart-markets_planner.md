---
date: 2026-08-18
agent: planner
repo: portfolio
session_type: execute
memory_graded: none
rolled_up: false
---

## What was done

Smart Markets went from an agent-only API to a twin that resolves, renders, and
serves both doors. Ten PRs merged across two repos, four production deploys, and
one production data write on the cockpit side by the lane seat.

**Union layer (smart-markets), PRs #9 through #15.** The security-master adapter
was wired so a symbol resolves to a node (#9). Licensed identifiers are withheld
from anonymous callers (#10). The cockpit service credential is mounted, without
which nothing resolves (#11). Display names fall back to the issuer and the
absence basis relays rather than paraphrases (#12). The served node read is
parsed as the envelope it actually is (#13). Absence copy no longer claims wider
than the scope it names (#14). Re-sync anchor lesson recorded (#15).

**Cockpit (empressa-trading), PRs #340 and #341, deployed as D-083.** A
service-callable node read, `GET /securities/node/{node_id}`, returning
descriptive facts plus the trusted issuer link, honouring the existing
`cik-exact` trust rule and the TW-35 retired-node narrowing. Read-only, cannot
mint, sits above the MINT banner. Full suite 4,696 passing.

**Cockpit data, D-084.** The lane seat wrote 9,981 `identity.symbol` alias eras
against a stated expectation of exactly 9,981, using the resolver's own atom
writer. Soak state byte-identical either side, no restart.

**Design system.** `packages/ui` extracted from `apps/web` (#6), the brand fonts
shipped for the first time, and the library synced to Claude Design at
`d36b7d05-d6d4-494c-a41e-1bd51db3878e` — nine components, eighteen preview
cells, all graded, then re-synced after the copy fix.

**Deployed.** Union at Cloud Run revision `smart-markets-api-00004-whp`; human
surface at `smart-markets-app.vercel.app` with a same-origin proxy, because the
union sends no CORS headers and adding them would have opened the API to browser
origins generally.

## What was learned (changes to ground truth)

**The catalog was never empty, and it was never duplicated either.** The union
reported "the security master holds no node for the exact symbol". The D-083
probe then reported 24 duplicate AAPL nodes. Both were wrong. The lane seat
retracted its own count — 23 of the 24 were seven-week-dead losers, unfiltered
for `status='merged'` — and the real cause was that the catalog held 9,984 nodes
and ZERO symbol alias eras. `resolve_security` builds candidates exclusively
from those atoms with no nodes-table fallback, so the entire catalog was
invisible to the served walk.

**Every blocker this session was a seam, not a volume problem.** Nothing failed
for want of data or throughput. Two systems, each internally correct, disagreed
about a shape or a word: a flat row against an envelope, an issuer-only column
read off a security, a resolution failure paraphrased as a claim about the
world, a credential the deploy script deliberately did not mount because the
code that needs it did not exist when the script was written.

**One failure shape recurred five times across two seats.** A filtered thing
used unfiltered, or a read trusted without checking what it excluded: the
unfiltered merge-status count; a tar step that picked up Git's tar from a
polluted PATH; a bundle grep against one chunk of sixteen; a test fixture whose
flat shape agreed with a flat schema while both disagreed with production; a
hand-copied re-sync anchor missing `sourceHashes`, which did not fail but
silently answered a different question.

**Fixtures that are more generous than production hide defects indefinitely.**
`AAPL_WIRE_NODE` carried a name on a security node, which the cockpit never
produces. That single generosity hid a defect that would have failed every
equity and fund twin. The durable fix was making `FakeSecurityMaster` parse
through the real schema, so a fixture can no longer agree with a wrong parser.

**Futures carry two nodes per contract today.** `/GC` and `GC` resolve to
different node ids, as do `/CL` and `CL`. All eleven instruments in the futures
catalog are slash-form, so the slash is the live form and retiring it would
retire what every feed emits. Data written against one form is already invisible
from the other.

**Contract 0.1.0 has seven expressiveness gaps, not four.** Three were added
this session: it cannot distinguish "nothing exists" from "nothing resolves";
it does not carry the scope of an absence, so a caller-bounded absence is
indistinguishable from a world-scoped one; and it does not say whether a failed
lookup will be retried, so `lookup-failed` covers both a transient fault and an
adapter that was never built.

## What's still open

Four of five layers are stubs. Roster, drivers, market and synthesis all return
`upstream adapter not implemented`; market alone is six quote branches.

The futures symbol-form split needs the aliasing pass. Brief is written and
dispatch-ready; the survivor must be chosen by measuring where the data actually
hangs, not by assuming the slash form.

A retirement ruling on the 21 bare futures forms is the operator's, separately
from the aliasing.

`resolution_status` stays `provisional` on the AAPL survivor. Correct — surviving
a merge is not evidence — but it means nothing has been promoted to `resolved`.

The cockpit's `SMART_FILES_API_KEY` is bound to the union's runtime service
account per-secret although it is deliberately never mounted. Harmless today
because the code cannot read what is not mounted, but it is a wider grant than
the design requires.

## Suggested canonical doc updates

`_rd_disclosure_twin/08_build_scope.md` should add rows TW-41 and TW-44 through
TW-52, and record the deployed revisions: cockpit `3e222e68`, union
`smart-markets-api-00004-whp`, human surface on Vercel.

`_rd_disclosure_twin/09_twin_read_contract.md` should record the three new
contract gaps above, which are also carried in the design system's section 8.

`_catalog/repo_intents.md` should note that `smart-markets` now has a deployed
human surface and a synced design system, and that `empressa-trading` serves a
service-callable securities read consumed by it.

A new memory is warranted for the recurring failure shape: a count or a read
that has not been shown to exclude what it claims to exclude is a hypothesis,
not a measurement.
