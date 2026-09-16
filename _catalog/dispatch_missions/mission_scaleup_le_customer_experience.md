## Mission — L-E CUSTOMER EXPERIENCE: what a customer actually sees, city by city, across the six counties

**Read-only lane in the Texas scale-up research wave.** You spawn nothing. You write no product
code and change no store. Surface reads only.

### Why this exists

The operator, 2026-09-16: *"the most important thing is we have the customer experience showing
like it needs to be."* Two examples from the same day show how far it can drift while every gate
passes:

- **203 E Oxford Dr** showed "Travis County", the street line and "SF-S".
  - Nothing said Pflugerville, although the ledger holds `situsCity` PFLUGERVILLE,
    `situsZip` 78660, `cityLimits` Pflugerville and `zoningJurisdictionKey` pflugerville-tx.
- **5292 Hartson, Kyle** (district PC R2, a planned community):
  - the MCP returned `envelope: "absent-verified"`;
  - the map said "Setbacks pending re-warm from city per-parcel record ... pre-layer-23
    sources", which is Bastrop wording on a Kyle lot.

### Step 1: write the spec before you grade anything

`_inbox/<date>_scaleup-le_card_spec.md`: what the property card, the MCP answer and the PDF
**must** show for a parcel. Derive it from the Smart Site design of record and the standing
rulings, and cite each:

- envelope drawn and figure refused (2026-09-11);
- most-current source wins, with a conflict row (2026-09-11);
- the PUD message (A-164);
- salesHistory unavailable (P-209);
- tier gating;
- honest refusals that name what is missing.

At minimum it covers:

- the full address with city and ZIP;
- the county;
- zoning **with its governing jurisdiction**;
- setbacks with citation and vintage;
- the envelope, drawn or declined, with the specific true reason;
- flood;
- land use;
- lot size;
- year built;
- the refused and gated fields;
- how an unincorporated parcel reads;
- how an uncovered county reads.

### Step 2: choose fixtures deterministically

Choose per wired city in the six counties, plus the unincorporated remainder of each county. The
city list is in `_inbox/2026-09-16_setback_parcel_grain_results.txt`. Select from the factory
store (read-only) by a stated rule, for example the lowest `md5(place_key)` in each bucket. Where
a city has them, include:

- a codified district with setbacks;
- a district miss;
- a no-table city parcel;
- a PUD or planned community;
- a parcel whose envelope draws;
- one whose envelope is declined;
- a corner lot;
- a curved frontage;
- a vacant lot.

**The fixture list is itself a deliverable.** It becomes the per-city surface probe (P-197).

### Step 3: read every fixture on every surface

| Surface | What to read | Where the account is not entitled |
|---|---|---|
| Map | `GET https://smartsite.cloud/api/spine/property-atoms/<id>/facets`; `POST .../api/spine/cortex/api/brokerage/v1/place/buildable-envelope`; what the card renders | n/a |
| MCP | `get_smart_site` at depth node and stub, if your session has the Smart Site connector | The operator's account is paid Solo. Owner and valuation refusals are correct, and site-plan export needs an unlock. If you have no connector, mark the MCP leg UNMEASURED. |
| PDF | a PDF export | UNMEASURED, with the reason, where the account is not entitled |

**Grade each fixture against the spec, field by field.**

### Step 4: roll up

**Per city:** the scorecard, meaning fields right and fields wrong. **The defect list:** each
defect with its count across fixtures and the code location that produces it. Where two surfaces
disagree on the same parcel, that is a P-217 instance; list it.

### Falsifiers

Pre-register your answers before you run anything.

1. Your spec must fail the Pflugerville card on the missing city, and fail the Kyle PC R2 card on
   both the MCP state and the map wording. If it does not, the spec is too weak.
2. **At least one city must score well.** If none does, check your reading of the map payload
   against a Bastrop parcel the operator has confirmed looks right, such as 1109 Pecan.
3. Every defect names the file that produces it. Where you cannot find the file, the defect is
   still listed, marked "source not located".

### Close

**Report.** `_inbox/<date>_scaleup-le_customer_experience_report.md`, with the spec, the fixture
set, the per-city scorecards and the defect list.

**Close JSON.** `_inbox/<date>_scaleup-le-customer-experience_close.json`, carrying:

- `planRows` `["P-197"]`;
- `probe` `{"notApplicable": "read-only research lane"}`;
- `falsifier` scored;
- `leave_behind`.
