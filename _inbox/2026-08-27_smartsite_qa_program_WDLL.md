---
id: 2026-08-27_smartsite_qa_program_WDLL
title: WDLL — Smart Site inbound QA + offer remediation
status: approved
last_updated: 2026-08-27
operator_approval: 2026-08-27 verbal go (canvas + waves + deploy/merge/commit)
---

# WDLL: Smart Site inbound QA + offer remediation

Date: 2026-08-27  Status: approved
Operator approval: 2026-08-27 (operator: add every item to the design-system gap canvas, organize waves, spawn subagents, do not wait for operator QA until in-wave items are addressed; parked long-term items stay on the canvas only)

Canvas: `C:/Users/cente/.cursor/projects/p-doc-repo/canvases/smartsite-design-system-gap.canvas.tsx`
Register: `Master Collateral Folder/2026-08-25_edw_gtm_qa/` (00–05). Claims changes refresh 01, 04, 05 together. Pricing changes refresh 02. Demo parcel refresh is 03.
Attack plan: `_inbox/2026-08-27_nick_val_qa_attack_plan.md`

## Done looks like

A visitor on smartsite.cloud can use the right rail the way it worked before #234, stack only the left map utilities, find a Bastrop parcel without a second click, land a share recipient on that property, and cannot download a hollow X-ray. The reports panel matches the locked ladder (X-ray and Flood are reports; site plan and terrain are exports) without advertising Coming soon or a 10-of-12 meter. Long-term items remain listed on the canvas and are absent from the shipped tree. Appraisal numbers are absent. No new report SKU exists.

## Acceptance items

Wave 0 depends on nothing. Wave 1 and Wave 2 depend on W0.1–W0.4. Wave 4 P1 depends on W4.P0 live. Wave 9 depends on Wave 0 live. Wave 8 depends on W4.P1. Valuation and extra-SKU rulings are not items.

1. W0.1 Right rail single-tenant, docks on the right. Check: open brief then chat on live PE; only chat; dock is right.
2. W0.2 Compare expand-wider works. Check: live Compare expand.
3. W0.3 Brief docks right; inspect is not a left overlay. Check: live brief + left bubbles still usable.
4. W0.4 Brief accordion, high-level first; mobile click-to-expand. Check: live + narrow viewport.
5. W0.5 Left four bubbles 34px; draw ≠ layers; original legend only. Check: open all four.
6. W0.6 Dynamic left height; collapse-all. Check: layers-only vs all-four.
7. W0.7 Map-pin notes, up to 10 colors, hover shows text. Check: three notes.
8. W1.1 Suggest disambiguates Street/Drive/city. Check: 905 Pecan, 17000 Simsbrook.
9. W1.2 One click lands, gold subject, zoom fill, setback facts, brief right. Check: one dropdown pick.
10. W1.3 History pick zooms and shows address not APN. Check: re-pick a history row.
11. W1.4 Place lookup without comma; city vs county labels. Check: Bastrop Texas.
12. W1.5 Suggest about one second. Check: stopwatch.
13. W1.6 Lock parcel not subdivision. Check: no neighborhood-hover then 404.
14. W1.7 Units in suggest; no whole-PUD dock. Check: 1620 Bryant.
15. W1.8 1308 Pecan / 48021:27479 finds Bastrop. Check: four query strings.
16. W2.1 Share lands on the property with notes. Check: signed-out share URL.
17. W2.2 Free recipient reads, cannot generate. Check: free account on share.
18. W2.3 Anonymous work survives sign-in. Check: anon save then sign in.
19. W2.4 Live-view link on every PDF. Check: Flood and X-ray PDFs.
20. W2.5 In-app PDF viewer. Check: narrow viewport.
21. W2.6 Reports bubble tabs: my reports | shared with me. Check: right-rail reports.
22. W3.1 Notes persist; include/exclude on share. Check: write, leave, share picker.
23. W3.2 First report auto-saves the property and files in Reports. Check: unsaved parcel, run Flood.
24. W3.3 On-property share personas with default message. Check: My properties detail.
25. W3.4 Add/exclude reports replaces Export X-ray as the only action. Check: property row.
26. W3.5 Chats collapsed by date, markdown cleaned, one open. Check: two chats.
27. W3.6 Status stays; pass does not auto-delete; stars encode status. Check: toggle pass.
28. W4.P0 Hollow X-ray hard-fails. World miss named. User-content miss omitted. Check: violate by requesting export with no verdict.
29. W4.P1 X-ray verdict like flood study; site plan one appended sheet. Check: 48021:34161 PDF after P0.
30. W4.P2 Provenance four columns; no asserted; no internal keys. Check: live PDF table.
31. W4.P3 Contour, units, packet ID, local date, no UNAVAILABLE chips, flood-zone reconcile. Check: bound packet.
32. W4.Q4 Flood PDF drawing has flow and ponding. Check: on-map vs PDF.
33. W4.Q6 X-ray titles the address. Check: cover + footer.
34. W4.Q11 Studio reports reachable for Studio. Check: Studio session.
35. W4.REC Records unreachable routed to P-85; CAD ≠ courthouse. Check: no merged verb.
36. W4.ZON Zoning brief stays on the map. Check: Q&A #2 item 7.
37. W5.1 Compare reads and adds notes. Check: A vs B.
38. W5.2 Click B opens that property; pair survives. Check: click through and return.
39. W6.1–W6.6 Hoffman checkout items (seat math, 2 months free, back-to-cart, ICC line, unlock error, card scroll / wallets). Check: pricing popup + checkout.
40. W7.1–W7.10 Offer panel and CTA rules per canvas. Check: reports panel + pricing + fourth chat + share landing.
41. W8.1–W8.4 Site Constraints in X-ray; structure-only beds/baths; mailing suppressed; no raw CAD names. Check: X-ray + share. Valuation absent.
42. W9.1–W9.3 Kit law frozen; six primitives; ESLint gate fails on a known violation. Check: violate hex / raw button in chrome.

## Amendments

None yet.

## Finish card (graded at close)

Not graded. Every item above starts as open.
