---
id: 2026-09-15_roadmap_reconciliation
title: Roadmap reconciliation — designed vs built vs promised, after the Jaime call
date: 2026-09-15
status: reconciliation
kind: reconciliation
owner: nick
programs: [OPS-17]
related:
  - _inbox/2026-09-15_design_thread_HANDOFF.md
  - _design/INDEX.md
  - _decisions/2026-09-15_design_ratification_pass.md
  - _decisions/2026-09-15_plan_review_role_gate_deferred.md
  - _decisions/2026-09-14_staff_identity_and_department_rbac.md
sources:
  - Nick and Jaime call, 2026-09-15, transcript and summary supplied by the operator
  - smartcity-dashboards origin/main f776b4bf, web/index.html
  - smart-files origin/main 61c84f6
---

# Roadmap reconciliation

Three columns that are usually conflated: what is **designed**, what is **built**, and what has
been **described to the customer**. They do not match, and the places they do not match are the
whole point of this document.

## 1. Design state, verified against the shipped nav

| Group | Designed | Not designed |
|---|---|---|
| Lenses | 3 of 9: Overview, Development services, Finance | Citizen, Public works, Parks, Police, Fire and EMS, Fleet |
| Development services tabs | 7 of 7 | none |
| Work | 2 of 3: Plan review, Files | Records search |
| City | 0 of 3 | Assets, Connections, People and access |
| Cross-cutting | Map dock | Compass, shell chrome, applicant-facing plan review |

48 screens exist as images in `_design/exports/`, in both themes. 37 are cleared to show a city.

## 2. What the Jaime call changed

**v1 is being retired, not run alongside.** Stated to the customer: *"the version two dashboard.
I'm retiring the one you're working off of."* That makes every v1 surface a migration obligation
rather than a nice-to-have, and it raises the bar on the six undesigned lenses: today they exist
in v1 and they would disappear.

**Role-based access and MFA are now a customer commitment**, not an internal plan. Jaime asked
directly whether Finance can be restricted to Finance, and the answer given was yes. That is
G-132 then G-127, and neither is built. **This is the largest gap between what has been said and
what exists.**

**Seats are a commercial line, not a technical one.** Base contract was roughly one seat (city
manager) plus five integrations. Actual deployment is eleven to thirteen integrations. Finance
likely needs a seat; directors possibly more. This belongs in the 70-band, not here, but it is
recorded because the access design and the seat model are the same conversation.

**Hotel occupancy tax is separately priced**, outside the current subscription. Everything else
discussed sits inside v2 and inside the subscription.

**The flood study scope is confirmed as designed.** Scenario comparison at different rainfall
depths, multi-property screening, and living inside the Development services tab. The design
matches what was described, including Sylvia's four-inch question.

**Plan review as a companion is confirmed**, and the departmental parallel review was described
to the customer: *"fire review will be able to use theirs and zoning and structural."*

## 3. The gaps, in the order they will bite

### a. Smart Files "bring any link" was described as a capability and is chrome

Described to the customer: *"drop any link, if it's a Google Drive, if it's a Microsoft one,
whatever it is, drop it in and make actually one database for everything that AI can reason
over."*

What exists, from `smart-files` `origin/main`: the Bring files page is **fixture data against a
pasted link**, and the page says so on itself — *"This page is chrome against fixture data. It is
not a live Drive sync."*

Nothing improper was said; this is a roadmap description. But it is the item most likely to be
clicked in a demo, and the distance between the description and the build is larger than for
anything else on this list. **Close it or qualify it before it is shown.**

### b. Departmental plan review cannot be built as currently ruled

`_decisions/2026-09-14_staff_identity_and_department_rbac.md` gates plan review to Development
services and city-manager. Parallel review needs Fire and EMS, Public works and Parks to reach
that surface. The amendment was DEFERRED 2026-09-15 with a trigger.

**The call moved that trigger closer.** Departmental review was described to the customer as a
feature of v2. The deferral still has no mechanism — its only trigger is that somebody remembers
before launch, which by the three-question gate is not a control.

### c. Six lenses are undesigned and v1 is being retired

Citizen, Public works, Parks, Police, Fire and EMS, Fleet. Jaime raised engineering and fire as
likely flood-study users, and Sylvia may add directors. If v1 goes away and those lenses are not
designed, the cutover removes capability.

### d. Two live defects surfaced on the call, neither carded

- **The camera / API connection is broken.** Owner: us. Not in any plan row read here.
- **GIS zoning gaps.** A property's zoning district was changed from commercial and the map does
  not reflect it, plus other gaps. Needs a check with the city's GIS, then a data fix.

### e. Finance lens is designed; its filings tab is not cleared

The Finance lens is drafted and exportable. The hotel occupancy tax tab
(`smartcity-finance-filings`) is under an **AMEND** ruling: it prints an ordinance rate attributed
to Bastrop's own code that traces to no source, and scores three of their filings against it.
**Since HOT is the prioritised, separately-priced integration, this is now on the critical path
rather than parked.**

Its integration is also still blocked on four credentials and four questions to Azavar.

## 4. What this means for sequencing

**Superseded 2026-09-15 by operator ruling, recorded as OPS-17 `A-137`.** Finishing the design
work is the first card, `G-146`, ahead of everything below. Bastrop approves the design before we
build, so every build row here sits behind it. The list below stands as the order *within* the
build work once design lands, and item 4 and item 5 are themselves design items that `G-146`
now sequences.

The reason the ruling changed the order is a number nobody had: counted against the shipped nav,
**5 of 15 surfaces are designed** and 2 more are excluded by ruling, leaving 8 uncovered. Eleven
folders and 48 boards read as much more than that.

The customer conversation has reordered things. The honest order now:

1. **Hotel occupancy tax.** Prioritised by the customer and separately billable. Blocked on the
   Azavar credentials and on the AMEND fix to the filings design.
2. **Role-based access and MFA.** Committed verbally, gates the seat conversation, and everything
   departmental depends on it. G-132 then G-127.
3. **The two live defects.** Cameras and GIS zoning. Small, visible, and they are the customer's
   current experience of the product.
4. **People and access design.** Same surface as the WorkOS work, so design and build land
   together.
5. **Citizen lens**, then the remaining five lenses, because v1 is being retired.
6. **Smart Files bring-files**, closed or qualified.

Plan review and flood study are designed and ahead of their dependencies. Neither is the
bottleneck.

## 5. Owed by the operator

| Item | Status |
|---|---|
| Email to Sylvia: v2, go-live date, RBAC changes, HOT integration, pricing, seat costs, copy Jaime | committed on the call, owed same day |
| HOT integration proposal with pricing, then a follow-up meeting with Sylvia | owed after the email |
| Confirm with Sylvia which departments and directors need access, and whether Finance needs a seat | owed |
| WorkOS org, client id, API key, MFA, `bastrop_tx` key | outstanding, blocks item 2 above |
| Azavar reply: four questions, four credentials | outstanding, blocks item 1 above |
| Ratify, amend or kill: Finance lens, Smart Files, Development services lens | outstanding |
| Which of the three plan review designs a city is shown | outstanding |

## 6. What this document does not do

It does not assign plan rows. Nothing here is carded to OPS-17, and the two live defects and the
Smart Files gap in particular have no row. That is the next planner's first job, not a
reconciliation's.

**Done 2026-09-15, same day.** Carded as OPS-17 `G-137` through `G-145` per amendment `A-136`.
Every row was written against a source read rather than transcribed from this document, and two
came back different from how they are described above. The camera connection is not a defect to
debug: the code is built and fails closed, and no Verkada credential exists in any of the three
GCP projects, so it is vendor onboarding (`G-139`). And the GIS zoning gaps are neither a data gap
nor a cache: the product reads a city layer last edited 2023-04-28 while Bastrop publishes three
newer ones, evidence in `_inbox/2026-09-15_bastrop_zoning_layer_findings.md` (`G-140`).
