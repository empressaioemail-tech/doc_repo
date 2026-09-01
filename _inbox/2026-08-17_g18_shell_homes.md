---
id: 2026-08-17_g18_shell_homes
title: G-18 function homes in the Dashboards shell
status: active
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    2026-08-17_g18_smartcity_inventory,
    2026-08-17_bastrop_dashboard_layout_inventory,
    30c_smartcity_platform_ia,
    _smartcity_masters/31_smartcity_dashboards,
    _decisions/2026-08-17_shell_before_feeds,
  ]
---

# G-18 function homes in the Dashboards shell

Every live Bastrop staff job from G-18 and the layout inventory gets a named home on the Dashboards product. A home is a nav item, a tab, a City page, or a killed/island ruling. Homeless is the defect. A feed is not a home.

This is the accounting. G-73 puts the missing homes into the live shell. No new ingest. Live `smartcityos.io` stays no-touch. Three identities hold.

Sources: `_inbox/2026-08-17_g18_smartcity_inventory.md`, `_inbox/2026-08-17_bastrop_dashboard_layout_inventory.md`, `30c_smartcity_platform_ia.md` section 4, doc 31 roster.

## Shell groups (30c plus the long tail)

**Lenses.** Overview, Development services, Finance, Citizen. Then Not built: Public works, Parks, Police, Fire and EMS, Fleet. Code enforcement and planning stay tabs under Development services, not extra lead lenses.

**Work.** Plan review (Preview mount), Files (Preview mount), Records search (Not built, Prophecy island).

**City.** Assets (real path, honest-empty, G-24 stays zero), Connections (the function register), People and access (Not built until a staff session card).

Demo may see this full roster with Preview / Not built / Empty badges. It must not see live Bastrop ops, staff names, or work orders. Environment badge stays Demo. `template-city` stays the pack.

## Homes

Disposition: **Mounted** (live on Dashboards today), **Empty** (chrome exists, no records), **Not built** (named nav or tab, no view yet), **Island** (stays on `smartcityos.io` until a named cut), **Killed** (no home, with reason).

### Live Bastrop primary nav (seven destinations)

| Bastrop job | Live route | Home on Dashboards | Disposition | Notes |
|---|---|---|---|---|
| See the whole city this morning | `/overview` | Overview | Mounted | Decision queue stays honest-empty. No morning-brief leak. |
| Overview metric tiles | `/overview` | Overview metric strip | Empty | Four numbers only when records exist. |
| Workspace launch cards | `/overview` | Sidebar | Killed | 30c: navigation lives in one place. |
| City calendar | `/overview` | Overview Public meetings; Citizen Meetings | Mounted | Home is the panel. G-71 used Bastrop municode as the template source. That host is a HOLD, not a feed win. |
| Live City Pulse / data-source dots | `/overview` | Overview Across departments; City Connections | Mounted / Empty | Source register, not vendor wallpaper. |
| Money, budget, spend, scenario | `/executive-analysis` | Finance | Empty | Honest-empty plus source register. OpenGov is a later grant, not a painted workspace. |
| OpenGov embed / COA | `/opengov`, `/opengov/code-reference` | Finance | Not built | Named on Connections as OpenGov. |
| Permit fee revenue | Finance Permit Revenue tab | Finance source register, Partial | Empty | Fees on cases are not revenue until a ledger confirms. |
| Permitting pipeline | `/development-services` Permits | Development services Pipeline | Empty | MyGov is a later adapter. No copied `mygov_permits`. |
| Inspections | DS Permits | Development services Inspections | Not built | Tab exists in G-66 chrome. |
| Work orders | DS Work Orders | Development services Pipeline (staff only) | Not built | Never on unauth Overview. |
| Business licenses | DS Licenses | Development services Licenses | Not built | Tab exists. |
| Code enforcement | DS + PermitFlow CE | Development services Code enforcement | Not built | One home. Nested PermitFlow CE dies with that product. |
| Property Intel / parcel dossier | DS Property Intel | Development services Place; SmartSite map | Mounted | Gold `48021:34137` is a demo fixture, not Bastrop onboarded. |
| Leaflet second parcel stack | DS map | Killed as a product map | Island | Live Leaflet stays on the city until a named G-45 island cut. |
| Emergency EOC | `/emergency-response` | Police + Fire and EMS | Not built | 30c folded EOC into those two lenses. No fake EOC wallpaper. |
| Regional ops map / resources / incident log | Emergency Regional | Police / Fire | Not built | |
| Police | `/police` and Emergency Police | Police | Not built | Spireon is the later grant, not the lens. |
| Fire / EMS | `/fire-ems` | Fire and EMS | Not built | FirstDue is the later grant. |
| Flood / weather | Emergency Flood | Fire and EMS; Place overlays | Not built | NWS / flood layers are records or map overlays, not a product. |
| VFD | `/vfd` | Fire and EMS | Not built | Named on Connections. Live `/vfd` stays island. |
| County dispatch | Emergency tab | Fire and EMS | Not built | |
| Cameras | Emergency Cameras | Police (Verkada) | Not built | |
| Fleet / operations | `/fleet` | Fleet | Not built | Samsara is the later grant. Not Asset Management. |
| Fleet map / vehicles / drivers / safety | Fleet tabs | Fleet | Not built | |
| CIP / projects | Fleet Overview + `/projects` | Public works | Not built | |
| Power BI reporting | Fleet Reporting | Public works | Not built | Embed is a later mount, not a nav product. |
| Phones / GoTo | Fleet Communications + `/call-analytics` | Public works | Not built | |
| Compass chatbot | `/ask-smartcity` | Compass top-bar sheet | Mounted chrome | Answer engine out. Live chatbot stays island. |
| Public morning-brief | `/api/ai/morning-brief` | Killed on unauth Dashboards | Killed | Leaks live WO names. |
| Prophecy document search | `/prophecy` | Work Records search | Not built | Named island until a records-search lens is designed. |

### PermitFlow (second chrome)

| Bastrop job | Live route | Home on Dashboards | Disposition | Notes |
|---|---|---|---|---|
| Reviewer queue | `/permitflow/review` | Work Plan review | Mounted (iframe residual) | Kill as a product. Island until staff use plan-review-app. |
| Intake | `/permitflow/intake` | Plan review intake | Not built | Project type plus place. No upload required to start. |
| Inspect / Fire / GIS review tabs | `/permitflow/inspector` etc. | Plan review disciplines | Not built | Filters on one queue, not four apps. |
| PermitFlow CE | `/permitflow/code-enforcement` | Development services Code enforcement | Not built | Duplicate dropped. |
| Applicant / contractor portals | `/permitflow/citizen`, `/contractor` | Citizen My requests | Not built | Thin public status. |
| `pf_documents` | city DB | Files | Island | Mount Smart Files for city rooms later. Do not copy the table. |
| PermitFlow product name / chrome | nested header | Killed | Killed | |

### G-18 named products

| Name | Home | Disposition |
|---|---|---|
| Operations Dashboard | Overview | Mounted chrome. Do not clone wallpaper. |
| Parcel Intelligence | Development services Place / SmartSite | Mounted. |
| AI Plan Review / Codex 1b | Work Plan review | Mounted iframe residual. Native console later. |
| CitizenConnect | Citizen | Killed as a SKU. Capability stays. Payments unclaimed. |
| Digital Twin / 3D | none | Killed. Word does not appear. Replaced by Assets empty chrome. |
| Compass | Top-bar sheet | Chrome mounted. Engine out. |

### G-18 vendor feeds (homes, not grants)

| Feed | Home | Disposition | Do not |
|---|---|---|---|
| MyGov | Development services Pipeline; Overview queue | Not connected | Copy `mygov_permits` into Dashboards Neon. Start G-52. |
| Samsara | Fleet | Not connected | Paint trucks on Assets. Fill G-24. |
| Spireon | Police | Not connected | Cut `/police` on the island. |
| Verkada | Police | Not connected | Fake camera tiles. |
| FirstDue | Fire and EMS | Not connected | Cut `/vfd`. |
| OpenGov | Finance | Not connected | Embed the vendor workspace as the Finance page. |
| ArcGIS / Esri | Place map (SmartSite) | Mounted as geocode/map, not a nav item | Stand up a second GIS product. |
| Power BI | Public works | Not connected | |
| GoTo Connect | Public works | Not connected | |
| Municode calendar | Overview Public meetings | Home exists | Use Bastrop's clerk host as proof that template-city is Bastrop. Fetch `smartcityos.io` `/api/calendar/*`. |
| Anthropic | Compass | Chrome only | Put morning-brief on unauth Dashboards. |
| Pipedrive | none | Killed | City feed. |

### Other staff pages not in the seven-item nav

| Bastrop route | Home | Disposition |
|---|---|---|
| `/reports`, `/reports/:id` | Public works; Finance | Not built |
| `/activity` | Overview; People and access | Not built |
| `/projects` | Public works | Not built |
| `/call-analytics` | Public works | Not built |
| `/design-lab` | none | Killed (playground) |
| `/admin/data-audit` | Connections | Not built |
| `/departments/*` including Parks, Court | Parks; Courts as Not built on Connections | Not built |
| `/citizen` twelve tiles | Citizen | Mounted lens. Tile grid killed. Pay buttons unclaimed. |
| Auth / session / notifications / theme / sign out | Top bar; People and access | Not built (staff session later) |
| Status bar "7 integrations" | Connections; nav footer | Empty | Never a hardcoded count. |
| City-owned assets (G-24) | City Assets | Empty | Chrome ships. Counter stays zero. |

## What the live shell already has (2026-08-17, `00010-vbs`)

Overview, Development services, Finance, Citizen. Public works, Police, Fire and EMS, Fleet as Not built. Plan review and Files as Preview mounts. Compass source control. No Parks. No Records search. No City group (Assets, Connections, People). No Connections register.

## What G-73 adds to the shell

1. Parks as Not built on the lens roster (doc 31).
2. Work Records search as Not built (Prophecy island named).
3. City group: Assets honest-empty, Connections as this register on the product, People and access Not built.
4. Connections lists every row in this file with home and disposition. That is the proof nothing is homeless.
5. No adapter run. No new grant. No Bastrop municode fetch. No city deploy.

## Holds

G-71 grant still points `template-city` at `https://bastrop-tx.municodemeetings.com/`. Five Bastrop meeting files sit on `folder:tenant:template-city:public-meetings`. That is identity collapse, not a shell home. It is **rendering** on Overview via compose hydration (`honesty=read`, Partial chip hidden). Wipe and retarget are a later named card, not more ingest. Design review `_inbox/2026-08-17_g73_shell_design_review.md` A1.

Live island routes in G-18 "Do not touch" stay on `00118-qox`.
