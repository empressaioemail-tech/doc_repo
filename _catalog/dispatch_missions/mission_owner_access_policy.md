# Mission — one fact, two access policies: produce the ruling input, do not rule

## Why this card exists

`owner-fact` is `public-paid`, and its writer docblock states the contract schema
rejects any other policy. It is described in that file as "THE ONE PAID PROPERTY
ATOM".

`cad-parcel-roll` carries `ownerName` and `ownerMailingAddress` in its body at
`accessPolicy: "public-free"` (`cad-parcel-roll-writer.ts:153, 208`; contract
`hauska-atom-contract src/property/cad-parcel-roll.ts:45-46`), gated only on
`joinPassedOwnerMatchGate`.

**This is not a live leak, and do not report it as one.** The twin never serves those
fields, because the Tier-1 bake's claim reader does not read them and
`sanitizeNodeFacetPayload` strips owner-shaped keys at any depth on the way out.

**What it is:** the same fact carrying two different access policies on two atom
families, with the protection resting on a **downstream stripper rather than on the
policy**. Every consumer that forgets to strip serves it free. That is protection by
habit, and habit is the thing this operation has repeatedly found does not hold.

It is worth a ruling. It is not worth a fire, and it is not urgent enough to queue
behind the pricing workstream.

## Your job is the ruling input, not the ruling

**Do not change an access policy on this card.** Do not re-stamp atoms. Do not widen
or narrow the contract. Produce the measured answer an operator needs to decide, and
stop.

### 1. Establish the blast radius by reading, not by assuming

Enumerate every consumer that reads `cad-parcel-roll` bodies. For each, say whether it
strips owner keys, and **name the file and line where the strip happens**. A consumer
with no strip is the finding.

The question to answer precisely: **if `sanitizeNodeFacetPayload` were removed
tomorrow, what would serve owner data free?** That is the real measure of how much is
resting on the stripper.

Do not stop at the twin. Check the brief path, the MCP surface, any export, and
anything that returns an atom body whole.

### 2. Establish whether the free copy is load-bearing

Does anything legitimately need `ownerName` on `cad-parcel-roll` at `public-free`?
`joinPassedOwnerMatchGate` suggests the owner-match join uses it. If an internal join
depends on it, that is a different problem from a serving policy and it changes which
options are available.

Distinguish **written for a join** from **served to a caller**. They are not the same
and the fix differs.

### 3. Lay out the options with their costs

At least these, and any you find:

- Re-stamp `cad-parcel-roll` owner fields to `public-paid` so the two families agree.
  Cost: a re-stamp over a large corpus, and whatever the join needs.
- Stop writing owner fields to `cad-parcel-roll` entirely and let `owner-fact` be the
  only home. Cost: whatever the join loses.
- Keep it and make the protection structural rather than a stripper, so the free path
  cannot express those keys at all. Cost: type or contract work.
- Rule it acceptable as-is with the stripper named as the control, and add a test that
  fails if a consumer stops stripping. Cost: lowest, and it keeps a habit-shaped
  control while at least arming it.

**Recommend one with reasoning.** Say what you rejected and why.

### 4. One measurement, if the store is free

Coverage of owner fields on `cad-parcel-roll` per county is **PENDING-STORE-READ**.
`neondb` and `hauska_mcp` share one compute and a containment job may be running.
**Do not run this if any heavy operation is live.** If you cannot run it, report
UNMEASURED. A missing store is not a zero.

## Related, and deliberately not yours

The pricing tier structure is being settled in a separate operator workstream. This
card does not allocate tiers and does not depend on that outcome. The inconsistency is
a correctness question and would still be one whatever the tiers turn out to be.

Texas Tax Code 25.027 and the `exemptionCodes` decode is a counsel question and is
also not this card.

## Do not

- Do not change any access policy.
- Do not re-stamp, mutate or delete atoms.
- Do not remove or weaken `sanitizeNodeFacetPayload`.
- Do not report this as a live leak. It is not one.
- Do not run a store read while a heavy operation is live.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot in the first output. Report the consumer enumeration with file and line per
strip, the answer to what would serve free if the stripper vanished, whether the free
copy is load-bearing for a join, and your recommended option with the rejected ones
named. `leave_behind` named. Subagents do not commit.
