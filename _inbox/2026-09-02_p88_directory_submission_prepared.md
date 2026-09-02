---
id: 2026-09-02_p88_directory_submission_prepared
title: P-88 Claude Connectors Directory submission, prepared and not filed
date: 2026-09-02
last_updated: 2026-09-02
status: prepared, not submitted
plan_row: P-88
applies_to: legacy-design-tools (artifacts/smartsite-mcp), smartsite.cloud
supersedes: _inbox/2026-08-28_p88_item21_claude_directory_submission.md
depends_on: 90_operations/OPS-16 A-035, _decisions/2026-08-31_smartsite_connector_is_a_door_not_a_tier.md, _smartsite_masters/
snapshot: doc_repo main 3a02384; legacy-design-tools main 7217621; serving smartsite-mcp-00085-nuj; all live reads 2026-09-02
owner: operator (filing), planner (copy)
---

# P-88 directory submission, prepared

This lane prepares. It does not file. The dispatch that authorized it forbids submitting to any external directory or vendor, so card item 5 is handed back rather than closed. Everything below is ready to paste into the portal once the blockers in the last section clear.

## The submission surface, verified

Remote MCP servers are submitted at `https://claude.ai/admin-settings/directory/submissions/new`, inside Claude.ai organization settings. Source read 2026-09-02: `https://claude.com/docs/connectors/building/submission`. Two facts from it govern this whole card and neither was in our prior draft. The portal requires a Team or Enterprise Claude organization, because organization settings do not exist on individual plans. And the portal syncs the tool list automatically off the running server, then asks the submitter to confirm they ran every tool themselves.

The prior draft assumed a form with a 280-character short description and a separate long description. That is not the shape. The real Listing step asks for a server name capped at 100 characters, a tagline capped at 55, a description capped at 2,000, one to five categories, a documentation URL, a privacy policy URL, a support contact, an icon, and a permanent URL slug.

## The copy, verbatim

### Server name (100 max, uses 10)

```
Smart Site
```

### Tagline (55 max, uses 49)

```
One place. All the layers. Always current. Cited.
```

This is the positioning spine from `_smartsite_masters/01_smart_site_positioning.md` with its fifth beat removed. The full spine, "One place. All the layers. Always current. Cited. Yours.", is 56 characters and does not fit. If the operator would rather keep "Yours." than "Always current.", the alternate is "One place. All the layers. Cited. Yours." at 40 characters.

### Description (2,000 max, uses 1,802)

```
Smart Site assembles what governs a place, the parcel record, zoning, land use and flood, into one current, cited answer, and gives an AI agent the same answer a person gets in the app.

Coverage is Central Texas: Bastrop, Travis, Williamson, Hays, Caldwell and McLennan counties. Ask about a parcel outside that and the connector reports a miss rather than inventing one.

What you can do here:
- Find a parcel by address or parcel id, or every parcel within a set distance of one, with the result marked when more matched than were returned.
- Open a parcel's on-record facts: zoning district and jurisdiction, land use, flood zone, and where the setbacks and buildable envelope stand, carrying their citations where a source can be linked, and the date each was baked.
- Read the property intelligence report for a parcel.
- Build a screening board from a pasted list of addresses and work it row by row.
- Save parcels, set a status on them, and list what you have saved.

Where a fact is not on record, Smart Site says which kind of nothing it is, reported absent, unknown, not read, or refused, each with a reason, instead of guessing. On many parcels the buildable envelope is a declared refusal rather than a distance, and it says so. It will not invent a setback, a flood zone or a zoning district. It does no valuation, no listings or sold prices, and no owner lookup, and nothing it returns is a boundary survey or a legal record.

Connecting uses OAuth 2.1 with PKCE against your Smart Site account, the same sign-in you use in the app. The connector is a door, not a plan: it is available on every plan including Free, and it applies the same limits the app applies. Opening a parcel's full read needs Solo or above, or a 30-day unlock on that parcel. Reading the report needs a paid plan.
```

### Coverage variant B, if the masters rule wins

One sentence is contested. `_smartsite_masters/` says coverage is spoken of as nationwide and that collateral must not enumerate counties as the extent of coverage. The dispatch says never nationwide and names six Central Texas counties. The running product says Central Texas in three independent places. The copy above resolves it toward the narrowest true claim. If the operator instead wants the unenumerated form, swap the second paragraph for this and the description lands at 1,763 characters:

```
Coverage is Central Texas, in the connector's own words. Ask about a parcel outside it and the connector reports a miss rather than inventing one.
```

The recommendation is the enumerated version. A directory listing is a capability claim to strangers who will test it on their own parcel within a minute of connecting, the narrow claim cannot be caught out and the wide one can, and master 06 has already retired "confirmed on request" precisely so a buyer never has to ask where the product works.

## Per-sentence provenance

| Sentence or clause | Traced to |
|---|---|
| "assembles what governs a place ... into one current, cited answer" | `_smartsite_masters/01`, the spine and "What a smart site is": one place, all the layers, always current, cited |
| "gives an AI agent the same answer a person gets in the app" | `_smartsite_masters/01`, "Two doors, one truth"; `_decisions/2026-08-31_smartsite_connector_is_a_door_not_a_tier.md` |
| The six counties | `_smartsite_gtm/01_central_texas_gtm_strategy.md`: the six counties running the conformant serving shape, with FIPS. CONTESTED against the masters coverage rule, see above |
| "reports a miss rather than inventing one" | Live wire vocabulary token `parcel_not_found`, "a genuine server-declared miss"; `_smartsite_masters/01`, "The system fails honestly" |
| Find a parcel by address or id | Live probe 2026-09-02, returned `48021:34137` |
| "every parcel within a set distance of one" and the truncation marker | Live `near` probe 2026-09-02 on `48021:34137` at 300 ft, cap 5: five hits with `distanceFt`, and `truncated: true` returned honestly |
| Zoning, land use, flood, setbacks and envelope, with citation and bake date | Live `get_smart_site` depth node probe on 48021:34137, 2026-09-02 |
| "the property intelligence report" | Live `run_report` description, verbatim minus the internal R1 token |
| Screening board from a pasted list | Live `create_screen`, `add_to_screen`, `list_screens` descriptions |
| Save, set status, list saved | Live `save_property`, `set_property_status`, `list_my_properties` descriptions |
| "reported absent, unknown, not read, or refused, each with a reason" | The live `smartSiteVocabulary` block the server attaches to every tool result. NOT traced to a master: the master phrase is "not verified", which is not a string this connector returns. Flagged rather than reworded, because the listing should use the words the caller will actually see |
| "the buildable envelope is a declared refusal rather than a distance" | Live probe: `setbacks-envelope` returned `refused` / `declined-in-bake` / `atom_path_pending`. Framing as an asset rather than an apology follows `_smartsite_gtm/01`, "the campaign leads with it rather than apologizing for it" |
| "will not invent a setback, a flood zone or a zoning district" | The live `agentGuidance` strings, verbatim in substance; `_smartsite_masters/08` approved claim, "where data is missing or conditional, the system says so instead of guessing" |
| "no valuation" | `_smartsite_masters/06`, "Not valuation" |
| "no listings or sold prices" | `_smartsite_masters/06`, "Not a listings site"; dispatch bound, Texas is a non-disclosure state and the MLS route is closed |
| "no owner lookup" | `_smartsite_masters/06`, owner data is Studio; it is reachable only through `export_instrument`, which is not functional in production today |
| "not a boundary survey or a legal record" | `_smartsite_masters/06`, "Not survey or legal work"; live `frame.quality: gis-approximate` |
| "OAuth 2.1 with PKCE against your Smart Site account" | Live `/.well-known/oauth-authorization-server`, `code_challenge_methods_supported: [S256]`. Vendor deliberately unnamed per `_smartsite_masters/08` name hygiene |
| "a door, not a plan ... available on every plan including Free" | `_decisions/2026-08-31_smartsite_connector_is_a_door_not_a_tier.md`, near verbatim |
| "Solo or above, or a 30-day unlock on that parcel" | Live `get_smart_site` description, verbatim; `_smartsite_masters/06` pricing table |
| "Reading the report needs a paid plan" | `canRunDeepReport` in `entitlement.ts`, paid at any rung |

## Claim to tool to gate

Card item 2 asks for this table. Every row is a live tool and a gate read at source, not a plan.

| Listing claim | Tool | Gate today | Verified |
|---|---|---|---|
| Find a parcel by address or id | `find_parcel` query | authenticated account | live probe 2026-09-02, returned 48021:34137 |
| Every parcel within a radius | `find_parcel` near | authenticated account | schema read; refusal codes `radius_invalid`, `radius_exceeds_max`, `radius_unbounded` declared |
| Every parcel on a named street | `find_parcel` street | authenticated account | schema read; refuses a bare street with no locality |
| Open a parcel's on-record facts | `get_smart_site` | no MCP-layer gate; Solo or above, or a 30-day parcel unlock, enforced downstream in cortex | live probe at depth node on a paid account |
| Read the property intelligence report | `run_report` | `canRunDeepReport`, paid at any rung | live probe on a paid account, `reportKind: R1-baked-snapshot` |
| Build a screening board and work it | `create_screen`, `add_to_screen`, `list_screens` | none today, moving to Studio and Team under P-101 | `list_screens` probed live; the two write tools deliberately not probed |
| Save, set status, list saved | `save_property`, `set_property_status`, `list_my_properties` | authenticated account | source read; write tools deliberately not probed |

Deliberately absent from the listing, and why:

| Tool | Why it is not in the copy |
|---|---|
| `export_instrument` | Returns `not_ready` in production. The Hauska export proxy is not configured on the serving revision. This is a change since 2026-08-28, when the prior draft recorded it live and wrote the copy around it |
| `request_records` | `readiness: blocked`, P-85 item 4 |
| `check_request` | `readiness: blocked`, P-85 item 4 |
| `ask_the_map` | `readiness: blocked`, parcel path not live. Also a change since 2026-08-28, when the prior draft named "ask the map" as a capability in its short description |
| `find_parcel` street mode | Not dead, but not claimed. Two consecutive calls on "Pine St, Bastrop TX 78602" did not return inside the host's timeout window on 2026-09-02, while a `near` call immediately afterwards returned at once. The service was warm, so this is specific to the street path. Card item 2 asks for capabilities that are live AND reachable, and reachable is what failed, so the clause naming it was cut from the copy |

The consequence worth stating plainly: the four tools above still appear in the tool list the portal syncs off the running server, because the portal reads the server rather than the copy. Keeping them out of the description is all the copy can do.

## The rest of the portal fields

**Categories, one to five.** Real estate, then property research or data if offered. Do not pick a legal category; the product explicitly does no legal work.

**Documentation URL.** Nothing suitable exists. See blockers. Interim answer if filing cannot wait: `https://mcp.smartsite.cloud/llms.txt`.

**Privacy policy URL.** `https://smartsite.cloud/privacy`. Live static HTML, verified 2026-09-02. Incomplete against Anthropic's stated requirements, see blockers.

**Terms URL.** `https://smartsite.cloud/terms`. Live static HTML, verified 2026-09-02.

**Support contact.** `support@empressa.io`. This is the address the live privacy policy publishes, which settles the S4 question the 2026-08-28 blocker card left open.

**Icon.** Live icons are SVG only. See blockers.

**URL slug, permanent once published.** Recommend `smart-site`. This is irreversible and belongs to the operator.

**Company.** Legacy Group ATX LLC, trading as Empressa. Website `https://smartsite.cloud`.

**Server URL and transport.** `https://mcp.smartsite.cloud/mcp`, Streamable HTTP, MCP 2025-03-26. Every user connects to the same URL. Never a `*.run.app` URL.

**Authentication.** OAuth. The authorization server advertises `client_id_metadata_document_supported: true` and S256 PKCE, so the client-ID-metadata-document mode is the one to declare. Read live from `/.well-known/oauth-authorization-server` on 2026-09-02.

**Data handling.** The underlying API is our own. No personal health data. No sponsored content. Sources are public records.

**Reads, writes, or both.** Both. Nine functional tools, of which four write: `create_screen`, `add_to_screen`, `save_property`, `set_property_status`. All four are annotated `readOnlyHint: false, destructiveHint: false`.

**What a user needs before connecting.** A Smart Site account, free to create, signed in with Google or Microsoft. No plan purchase is needed to connect. A paid plan is needed to open a parcel's full read or to run the report.

**Allowed link URIs.** Declare `https://smartsite.cloud` and `https://mcp.smartsite.cloud`. Citation links open third-party county and agency hosts we do not own, so those cannot be declared and viewers will be prompted before each one opens. That is correct behavior, not a defect.

**Example prompts.**

```
Find 908 Pine St, Bastrop TX 78602
```

```
Get the smart site for 48021:34137 and summarize the flood picture
```

```
Every parcel within 300 feet of 48021:34137
```

```
List my saved properties
```

The first three are proven live on 2026-09-02 against parcel `48021:34137`. The fourth was not probed. A street-name prompt is deliberately absent from this list; see the street-mode row above.

## Blockers between this pack and a filing

None of these are copy. Each has an owner.

1. **Team or Enterprise Claude organization.** The portal lives in organization settings and does not exist on an individual plan. Unverified; only the operator can see the account. If this is not in place, nothing else matters.
2. **Carousel screenshots.** This server is an MCP App: it registers `ui://smartsite/app-p562.html` and three tools mount a panel. MCP App submissions require three to five PNGs at least 1000px wide, cropped to the app response with the prompt not visible, each with its prompt text supplied separately. None exist.
3. **Documentation URL.** `/docs`, `/help`, `/connect`, `/mcp` and six other candidates all return the SPA shell. `/privacy` and `/terms` return real static HTML, so the mechanism is proven and building one more page is a known shape.
4. **Privacy policy completeness.** The live policy covers collection, storage, processors and contact. It does not cover data retention, and third-party sharing is only described inbound. Anthropic's doc says missing or incomplete privacy policies result in immediate rejection.
5. **The four refusing tools.** The reviewer is asked to run every tool. Four will refuse. Either withhold them from registration before filing, which is a code change and outside this card, or file knowing the reviewer meets four declared refusals.
6. **A cold Connect.** Card item 1 is not closed. See the close.
7. **Two operator lines.** The coverage ruling, and the permanent slug.

## What catches this listing going stale

Nothing does. Stated plainly because card item 6 asks for it and the honest answer is the absence.

There is no executor, no trigger and no failing thing. The tool set can gain a tool, lose one, rename one or change its gate, and this listing will keep saying what it says today. Two changes are already scheduled and would each falsify a line: P-101 moves screens to Studio and Team, and configuring the Hauska proxy would make `export_instrument` real. Neither has any connection to this document.

The copy was written to blunt that, which is mitigation and not a control. Three specific choices: it names no tool count, so adding a tool does not falsify it; it states the tier rule as an invariant, "it applies the same limits the app applies", rather than assigning capabilities to rungs, so P-101 cannot make it wrong; and it names no report menu, so the report set can grow without contradiction. What it cannot survive is a capability being removed or renamed, which is exactly what happened to the 2026-08-28 draft twice in five days.

If the operator wants a real control, the shape is a scheduled job that fetches `https://mcp.smartsite.cloud/llms.txt`, diffs the tool list and the readiness markers against a committed snapshot, and exits non-zero on any difference. That is a new build with its own row, it is not this card, and until it exists this listing is a claim nobody re-checks.
