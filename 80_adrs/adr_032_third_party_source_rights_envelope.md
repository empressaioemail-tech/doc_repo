---
id: adr_032_third_party_source_rights_envelope
title: "ADR-032 — The third-party source rights envelope: one pipeline, two storage modes, two accrual triggers"
status: proposed
last_updated: 2026-09-12
applies_to: portfolio
related: [adr_015_actor_atoms, adr_017_atom_access_control, adr_018_atom_contract_substrate_layer, adr_031_parcel_record_ledger_over_atoms, adr_030_declared_is_not_armed_contract_surface_governance, 25b_monetization_provenance_storage_stack, _research/2026-09-12_cotality_reengagement_division_cogs_and_probe, _research/2026-07-05_icc_code_connect_technical_answers, _decisions/2026-06-16_cotality_consumer_display_license_gate]
owner: nick
---

# ADR-032 — The third-party source rights envelope

## Status

**Proposed 2026-09-12.** Not accepted, and deliberately so: four of its fields have
no value for Cotality because the commercial agreement has not been read, and one
consequence (the meter's accrual trigger) changes code that OPS-23 is actively
rewriting.

Per ADR-030, declaring a surface is not arming it. **Nothing may be built from this
ADR until it is accepted.** The reason it exists now, unaccepted, is that its unknown
column is the read-list for the Cotality commercial agreement, which makes it useful
before it is ratified and dangerous if treated as ratified.

## Context

The portfolio has two licensed third-party sources in flight and they sit at opposite
ends of the axis that turns out to matter most.

ICC (International Code Council) sells normative code text, bound to a jurisdiction by
adoption, licensed per reference, and carrying an explicit destroy-on-termination
obligation that names vector databases. Its own definition of a derivative is that our
reasoning may cite a section freely but may not incorporate the content text into what
we generate.

Cotality sells parcel-keyed facts, bound to a property by CLIP, billed per use, and the
entire commercial case for it depends on retaining what we fetch so the second buyer of
a parcel costs nothing.

An abstraction shaped as "a vendor adapter returns fields for a parcel" describes
Cotality and completely fails ICC, which is not parcel-keyed, not field-grained, and
not retainable. What the two actually share is not content shape. It is a set of
permissions that determines what the pipeline may do with the bytes.

The mechanism to enforce those permissions is already substantially built for ICC.
`hauska-mcp-server` carries `source_obligation_ledger` (migration 009), an inbound
obligation meter that accrues on every read including free anonymous, and a reader.
The ledger row shape is already generic: source actor, obligation type, amount,
currency, grace terms. What is ICC-specific is only detection, which today is an
allowlist and regex heuristic rather than a hard reference, tracked open as OPS-17 G-17.

## Decision

Every third-party licensed source declares a rights envelope. The fetch, mint, serve
and meter path is parameterized on that envelope rather than on the vendor's identity.

| Field | Meaning |
|---|---|
| `sourceActorDid` | identity, an ADR-015 actor atom; already exists for ICC |
| `bindingKey` | what a claim attaches to: `parcel`, `jurisdiction-edition`, `geography`, `address` |
| `storageMode` | `retain-and-mint` or `point-and-fetch` |
| `retention` | permitted, TTL, and whether termination compels destruction |
| `reproduction` | whether verbatim text may be shown, the licensor's own definition of a derivative, and any binding citation format |
| `redisplay` | whether output may reach an end user, and at what minimum tier |
| `accrualTrigger` | `on-acquisition`, `on-reference`, or `both` |
| `rate` | amount, currency, and unit (`call`, `reference`, `record`, `seat`, `flat`), with grace terms |
| `refreshPolicy` | what moves the underlying truth, and stale-after |
| `purge` | the selector that finds every copy, and whether the partition is provably isolatable |
| `accessPolicyFloor` | the most permissive `accessPolicy` any atom from this source may carry |

### The two storage modes

**Retain and mint.** The fact is licensed for retention, so it is minted into a
source-tagged atom family carrying its own `accessPolicy`, and it compounds. One writer
mints atom, pointer and rendering in one transaction, per ADR-031.

**Point and fetch.** The content may not be copied into an atom body. Our reasoning
atom carries the citation and a pointer; if an entitled caller needs the text itself it
is fetched and rendered behind the gate at serve time and never stored. This is the
`point-to, never embed-with` rule already written for ICC, generalized: it is the only
mode under which a destroy-on-termination obligation is satisfiable, because there is
nothing stored to destroy beyond an isolatable cache.

### The accrual trigger is a field, not a constant

This is the non-obvious half and it is why one meter placement cannot serve both
sources.

ICC accrues **on reference**. A free-tier homeowner viewing a cited section owes a
royalty, and a cache hit owes it too. The meter must therefore sit on the read path.

Cotality accrues **on acquisition**. We pay for the fetch. Every later serve from the
minted atom is free, which is the entire basis of the compounding-margin argument.

A meter fixed to the read path charges us for Cotality cache hits that cost nothing. A
meter fixed to the fetch path silently under-reports the ICC obligation on every cached
read, which is an unmetered source liability and the dangerous kind of licensing gap.
The gate reads the trigger from the envelope and fires accordingly.

### Two behaviours inherited from the ICC meter, kept as law

An unset rate produces a countable accrual with a null amount and `pending-rate` grace
terms, never a zero. A fabricated zero enters totals without announcing that it was
invented.

An unmeasured provenance stamp reads as unmeasured, never as "not this source." Absent
and unmeasured are different states and collapsing them under-reports the obligation in
exactly the direction that favours us, which is the direction to distrust.

### Why `accessPolicyFloor` is not optional

`accessPolicy` gates a whole atom and never a field, and the MCP catalog tools return
bodies whole with no field strip because returning the body whole is their job. A floor
enforced at mint is the only thing standing between a vendor atom and an anonymous
caller reading its entire body. The history is the warning: the ICC ingest hardcode was
removed on engine PR #346 and the store still carried `public-free` afterward.

## What this does not decide

It does not decide whether to contract with Cotality, what the division of rails is, or
the pricing of anything. It does not authorize a vendor fetch path. It does not resolve
what happens when a vendor value and a first-party value disagree, which needs its own
ruling modelled on `_decisions/2026-09-11_setback_source_most_current_wins.md`. It does
not decide whether vendor-sourced values may enter the calibration loop, which the
2026-07-13 constraint currently forbids for value and rent.

## Consequences

The obligation meter's detection must become a hard reference (`sourceActorDid` plus
the source's own identifiers) rather than the current allowlist and regex, or a second
source cannot ride the ledger at all. That is OPS-17 G-17, already open, and this ADR
makes it load-bearing for two sources instead of one.

The vendor fetch path is a new writer and a new read path, and OPS-23 exists to
eliminate exactly those. Any vendor pipeline lands inside the OPS-23 reader and writer
model or it recreates the six-read-path condition that program was opened to fix.

A source whose envelope carries a destroy obligation cannot use `retain-and-mint`, so
the commercial terms decide the architecture rather than the other way around.

## Reversal criteria

Revisit if a third source arrives whose terms fit neither storage mode, which would mean
the two-mode split is wrong rather than incomplete. Revisit `accrualTrigger` if a source
bills on a basis that is neither acquisition nor reference, such as a seat licence with
no per-use component, in which case the field needs a `none` value and the meter needs a
periodic accrual instead of an event-driven one.

Accept this ADR when the Cotality commercial agreement has been read and its four
unknown fields (`retention`, `reproduction`, `redisplay`, `rate.unit`) carry values.
