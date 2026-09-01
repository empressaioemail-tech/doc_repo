---
id: 2026-08-24_lane1_find_identity_WDLL
title: Lane 1 — Find identity does not go through envelope geocode of a Photon label
status: live
date: 2026-08-24
plan_row: P-60
operator_go: verbal 2026-08-24 (proceed)
audit: _scratch/setback-serve-wave.md GROUND-TRUTH 2026-08-24T16:28Z
---

# WDLL: Find identity peel

Peel means delete the extra composer. Find currently asks envelope to geocode the Photon label (`17005 Simsbrook Drive, Pflugerville, Texas, 78660`). That string 422s. Address landing also forwards Photon/viewport lat/lng, which Cortex honors over the address. The leftover card (51536) stays the subject.

Identity writer is the situs index (and its rooftop point). Envelope derive is for the wedge, not for "which parcel did they type."

## Done looks like

Find or pick of `17005 Simsbrook Drive, Pflugerville, Texas, 78660` docks inspect on `48453:280239`. Gold `908 Pine, Bastrop TX` still docks `48021:34137`. A Photon or viewport coordinate is not sent as the envelope point. Many-hit situs (bare `908 Pine`) does not take `hits[0]`.

## Acceptance items

1. **Photon long-form Simsbrook pins 280239.** Situs unique address-point (even when `parcelNodeId` is null) supplies the rooftop; envelope if needed uses that point + CAD situs, not the Photon label alone. | check: unit both directions + live PE probe after deploy | grade: [met] `parcel-lookup.test.ts` Photon string + unique point → 280239. Live hops after `dpl_ExCgJHQgjosXw11smSeaR5nFNK8z`.

2. **Caller lat/lng is not an identity input.** `resolveLookupToParcelNodeId` and address landing do not forward Photon/viewport coords onto envelope. | check: unit — body has no lat/lng from opts; search-landing no longer passes lat/lng | grade: [met] inverted old bias test; landing call is `{ quiet: true }` only.

3. **Gold still docks.** `908 Pine, Bastrop TX` / CAD gold situs still resolve `48021:34137`. | check: existing envelope fallback + live probe | grade: [met] many-hit situs falls through to address-only envelope → 34137.

4. **Many situs hits fail closed.** Bare `908 Pine` (five hits) does not pick Harker Heights `hits[0]`. | check: unit fixture with five hits returns no pin | grade: [met] `uniqueSitusPin(GOLD_POLLUTED) === null`.

## Do not

- Hover paint / lot-line suppress
- A2 pricing
- Widen Travis situs regex
- LDT envelope schema
- Take situs `hits[0]` when more than one usable hit
