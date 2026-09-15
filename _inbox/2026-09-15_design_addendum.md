---
id: 2026-09-15_design_addendum
title: ADDENDUM — the design state in full, every table caught up, for continuing the design work
date: 2026-09-15
status: addendum — read with the handoff, supersedes its design tables
kind: addendum
owner: nick
programs: [OPS-17]
addendum_to: _inbox/2026-09-15_design_thread_HANDOFF.md
related:
  - _inbox/2026-09-15_roadmap_reconciliation.md
  - _design/INDEX.md
  - 90_operations/OPS-17_govtech_stack_plan_of_record.md
verified_against:
  - smartcity-dashboards origin/main f776b4bf, web/index.html
  - smart-files origin/main 61c84f6
  - doc_repo _design/ folder inventory, counted 2026-09-15
  - OPS-17 rows G-137 to G-145, amendment A-136
---

# ADDENDUM — the design state in full

The handoff's design tables were written mid-session and are stale. These replace them. Counted
from the folders and verified against the shipped nav, not remembered.

**Two corrections carried in from the A-136 carding pass, because both change what a designer
should assume.** The cameras are not a broken connection — the code is built and fails closed
correctly, and no credential exists in any of three GCP projects, so it is vendor onboarding. And
the zoning gap is not missing data — the product reads a city layer last edited **2023-04-28**
while Bastrop publishes three newer ones. Neither is a design problem.

---

## 1. Design folders, as they exist

Eleven folders. Every one regenerates with `node gen.mjs`.

| Folder | Boards | `check.mjs` | Status |
|---|---|---|---|
| `smartcity-overview-lens` | 3 | — | **RATIFIED** 2026-09-14, dispatched G-120 |
| `smartcity-dev-services` | 6 | **yes** | IN REVIEW. Completed and corrected 2026-09-15 |
| `smartcity-map-dock` | 3 | — | **APPROVED** 2026-09-14, dispatched G-128 |
| `smartcity-flood-study` | 5 | — | **RATIFIED** 2026-09-15. Not dispatched |
| `plan-review-reasoner` | 5 | — | **RATIFIED** 2026-09-15. Not dispatched |
| `plan-review-departments` | 5 | — | DRAFT. May be shown, cannot be built |
| `plan-review` | 3 | — | Superseded by the reasoner set |
| `smart-files` | 5 | **yes** | DRAFT 2026-09-15, not ratified |
| `smartcity-finance-lens` | 5 | **yes** | DRAFT 2026-09-15, not ratified |
| `smartcity-finance-filings` | 5 | — | **AMEND** — G-138 |
| `smartcity-place-tab` | 3 | — | SUPERSEDED by the map dock |

**48 boards. Three carry an instrument. `smartcity-finance-filings` is the only folder on the
critical path without one, which is exactly what G-138 says.**

Images: 48 screens x 2 themes in `_design/exports/`, 37 cleared to show a city.

---

## 2. Lenses — 3 of 9 designed

| Lens | Design | Ships today | Row | What a designer needs to know |
|---|---|---|---|---|
| **Overview** | 3 boards, RATIFIED | live, dispatched G-120 | G-120 | Its headline move is Connections promoting on a pack that reads nothing. That only fires when `granted === 0`; **Bastrop grants seven**, so it does not fire there |
| **Development services** | 6 boards, in review | live | G-123 | All seven tabs designed. Densest lens; fourteen of fifteen destinations inherit its pattern |
| **Finance** | 5 boards, DRAFT | shipped as a correct refusal | — | The lens is drawn. Its filings tab is a separate folder under AMEND |
| **Citizen** | **none** | **not a blank** — real markup, badged `Preview`, address lookup **deliberately disabled with the basis printed on the page** | **G-142** | Read `src/shell-homes.mjs:146` first: *"Citizen service requests — the twelve-tile grid was dropped."* There is design history. The disabled-with-basis treatment is already correct and **must not be regressed** |
| **Public works** | none | `Not read` badge | **G-145** | CIP, projects, reporting, phones. Jaime named engineering as a likely flood-study user |
| **Parks** | none | `Not built` badge | **G-145** | Park and trail assets, dedication funds |
| **Police** | none | `Not read` badge | **G-145** | Scope call owed — was "not in the pilot" until v1 retirement changed it |
| **Fire and EMS** | none | `Not read` badge | **G-145** | Named on the call as a likely flood-study user |
| **Fleet** | none | `Not read` badge | **G-145** | Scope call owed, same as Police |

**The five in G-145 stopped being a backlog when v1 was declared retired.** They exist in v1 today,
so shipping v2 without them removes capability from departments that have it.

---

## 3. Development services tabs — 7 of 7

| Tab | Board | Note |
|---|---|---|
| Pipeline | `Main.dc.html` | Live MyGov read |
| Inspections | `Inspections.dc.html` | Paired second axis — four measured result classes |
| Work orders | `WorkOrders.dc.html` | Load strip, view modes, pagination |
| Code enforcement | `CodeEnforcement.dc.html` | Ordered second axis — escalation rungs |
| Licenses | `Licences.dc.html` | Continuous second axis — derived expiry bands |
| Plan review | own folders ×3 | Named in the strip; designed separately |
| Flood study | `smartcity-flood-study/` | RATIFIED, five states |

**There is no Place tab.** `DS_TABS` is seven and has never contained `place`. The map became a
dock rail. A design showing eight tabs is wrong and `check.mjs` refuses it.

---

## 4. Work and City — 2 of 6 designed

| Surface | Design | Ships today | Row | Note |
|---|---|---|---|---|
| **Plan review** | 3 folders | `Preview` | — | **Three competing designs. Which one a city sees is still owed.** Reasoner is the only ratified one |
| **Files** | 5 boards, DRAFT | mount point | — | The dashboards entry is a **mount point and says so**. The product is its own repo. Design against `smart-files`, not dashboards |
| **Records search** | none | stub, `Not built` | — | Not carded. Document search is a named island until a lens is designed |
| **Assets** | none | 3 tabs, `Empty` | **not carded, deliberately** | Doc 32: G-24 stays zero until a named ingest. Drawing it now is wallpaper |
| **Connections** | none | **75-row register, baked and fixed-point tested** | **not carded, deliberately** | **Not a design candidate.** Engineering pass first — see the findings card |
| **People and access** | none | nav, `Not built` | **G-143** | Four things: provisioning, role assignment, offboarding, and **the audit trail**. The audit half is a trust surface, not an admin screen, and is the half most likely to be dropped as internal |

---

## 5. Cross-cutting

| Surface | Design | Row | Note |
|---|---|---|---|
| Map dock | 3 boards, APPROVED | G-128 | Dispatched |
| Compass | none | — | Doc 34 calls it a sidebar over readable records; v1 chatbot still runs. Hold until more lenses exist |
| Shell chrome (G-90) | none | — | Theme toggle, account menu, notifications, tenant branding, record search, help, feedback. Not designed **as a set** |
| Applicant-facing plan review | none | — | A persona exists; the view does not |

---

## 6. What to design next, in order, with the source state already checked

| # | Surface | Row | Blocked on | Why here |
|---|---|---|---|---|
| 1 | **Finance filings AMEND fix** | G-138 | nothing | On the critical path now that HOT is the customer's priority. Needs a `check.mjs` — it is the only live folder without one |
| 2 | **People and access** | G-143 | G-132 for vocabulary, not the credentials | Same surface as the WorkOS build, so design and build land together |
| 3 | **Citizen** | G-142 | nothing | Widest audience, only public surface, and it ships with real markup to read first |
| 4 | **Public works, Parks, Fire and EMS** | G-145 | nothing | Three of the five have no scope question |
| 5 | **Police, Fleet** | G-145 | operator scope call | v1 retirement changed their status; that is a call, not an inference |
| 6 | **Records search, Compass, shell chrome, applicant view** | — | not carded | The long tail |

**Do not take Assets. Do not take Connections.**

---

## 7. Rulings that constrain any new design

| Ruling | Effect |
|---|---|
| Plan review is a **companion**, not a system | No markup, no batch stamping, no measurement tools, no document workflow |
| Plan review gated to Development services + city-manager | Departmental parallel review **cannot be built** as ruled. G-144 is the mechanism |
| Department roster is **the nine lenses** | Seven department roles, plus `city-manager`, plus `admin`. No invented departments |
| Flood: authoritative for serving, **provisional for citation** | The study downloads; citing it in a review letter is refused **on the page** |
| Finance filings **AMEND** | May not enter a customer artefact until two citations are sourced or badged |
| v1 is being **retired** | Every v1 surface is a migration obligation |

---

## 8. Conventions, non-negotiable

Tokens are copied from the product, never invented. `_kit.css` is **byte-identical across all
eleven folders** — verify with `md5sum _design/*/_kit.css` before and after any change.

Absent, zero and unmeasured are three different states and no surface collapses them. Fixture data
is badged as fixture **on the page**. Nobody is named on a published canvas. Every money figure is
traceable to a record, or the board declares itself illustrative.

**Every design gets an adversarial read run as a file** that self-tests in both directions and
reports a **non-zero matched-input count**. Three exist as working precedents:

- `smartcity-dev-services/check.mjs` — 21 self-tests; refuses an undeclared tab, a person-shaped
  name in a cell, and rows drifting from the fixture record
- `smartcity-finance-lens/check.mjs` — 11; refuses any money figure not traceable to the capture
- `smart-files/check.mjs` — 12; refuses any value outside the product's closed vocabularies

**A check with no inputs is worse than no check.** One shipped this thread that self-tested
perfectly and matched nothing on any board. Count the matches.

**Render it before saying it works.** Chrome is at
`C:/Program Files/Google/Chrome/Application/chrome.exe`; `--headless=new --screenshot` works, and
`_design/demo/export-screens.mjs` already does it for all 48 boards in both themes.

---

## 9. The seven defects this thread caught, so they are not repeated

Every one was found by comparing a canvas against an independently derived source. **Not one was
findable by re-reading the canvas.**

| Defect | Found by |
|---|---|
| A `Place` tab the product never had | reading `DS_TABS` |
| Five named people on a published workload ranking | grepping both repos; they appear in neither |
| Licence rows in the wrong sort order | running the product's own generators |
| Three residents named beside their addresses | the folder README quotes them as PII the design must not render |
| A 7.00% ordinance rate attributed to the city's own code | searching for any source; there is none |
| A dependency asserted to the operator that does not hold | reading `app.js` |
| A check with zero inputs on every board | counting matches instead of trusting self-tests |
