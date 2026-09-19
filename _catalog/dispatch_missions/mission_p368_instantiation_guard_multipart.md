## Mission — P-368: the instantiation guard tells a multipart parcel from a label key

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open one PR from current
`origin/main` with the SHA declared (`e6ca09de` at compile). You do not merge, deploy, apply or write
any store.

### What is wrong (measured 2026-09-19, `_inbox/2026-09-19_p350_williamson_RECORD.md` section 3)

P-352's guard (`classifyInstantiationKeys` in `src/jobs/parcel-record-fill.mjs`) refuses a key that
resolves to neither exactly one parcel geometry nor a CAD account (directly or through the county's
declared crosswalk). Williamson's fill (`dc2pj` dry, `wt4pb` apply) refused **82** keys. The samples
are R accounts (`48491:R006142`, `R008416`, `R009569`, `R010065`, `R010298`, `R011232`, `R011919`,
`R012327`, `R012409`, ...) with 2 or 4 parcel geometries and no reachable CAD account. They look like
multipart parcels with a CAD miss, not label keys. `R006142` is also among P-351's named unreachable
accounts. The one real phantom, `48491:PRIVATE ROAD`, has been retired.

Today the effect is benign, because those records exist from 2026-09-02 and the refusal only stops
their refresh: `situsState` and `landUseVintage` refuse on exactly these 82 in the gate. For a new
county, a multipart join miss would never be instantiated, and a missing record is invisible (the
full-shape ruling).

### What to build

1. **Read the 82 at source** before any code: geometry count, whether the geometries are one
   parcel's parts (adjacent, same owner, same situs, or whatever the published source says), and
   whether any published identifier reaches an account. A table, one row per key.
2. **Refuse on a second derivation, not on geometry count alone.** A label key and a multipart parcel
   both carry several geometries and no account. Find a second, independently derived signal that
   separates them (for example the key's shape in the county's own account format, the geometries'
   situs agreement, or a published label vocabulary), and say why it is independent.
   `48491:PRIVATE ROAD` must still be refused.
3. **Name the refused population on every run**, per county, in the run's durable record (not only
   as samples).

### Verify by violation

`48491:PRIVATE ROAD` still refused; a multipart fixture shaped like `R006142` accepted; a single-
geometry label key (the gap P-352's close named) handled as your design says; a per-county read-only
dry run naming the refused keys, beside your prediction.

### The three-question gate

What executes the refusal, what triggers it, what fails when a real parcel is refused, and what
bypasses it.

### Close

Declare: the start commit and PR, the 82-key table, the second derivation and why it is independent,
the falsifiers with both directions shown, the three-question gate answers, and `leave_behind`.
