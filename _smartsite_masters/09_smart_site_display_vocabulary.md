---
id: smartsite_masters_09_display_vocabulary
title: Smart Site display vocabulary. The machine token to display string table, and the law that nothing prints a raw token
status: active
last_updated: 2026-08-31
applies_to: smart_site
owner: planner (integration seat); the executable copy is owned by artifacts/smartsite-mcp/src/vocabulary.ts
purpose: The canonical half of P-91 v3 item V2. This is the SAME table the MCP server publishes as a resource and attaches to every tool result, written down here so canon can cite it. Doc 08 is the market-facing positioning glossary and is a different artifact; this one is the wire-to-screen vocabulary.
serving: p563 on smartsite-mcp-00078-fat, verified live 2026-08-31
---

# Why this exists

The display vocabulary used to live only inside the served panel. Anything composing prose outside the panel, including the assistant itself, had never been given the string the panel prints, so it drifted from the UI by construction. In a live session against three Bastrop parcels that produced the raw machine token `atom_path_pending` in user-facing text. That was a missing field, not a model failure.

The fix was to attach the vocabulary during MCP normalization, which puts the panel and the model on one table owned in one place. That makes drift impossible rather than unlikely, which is a stronger property than making it merely unlikely and is why it went there rather than upstream in cortex.

# The law

**Nothing user-facing prints a machine token.** Every token below has an exact display string, and the display string is what a reader sees. A token with no mapping is a defect, not a fallback.

**The four states that read alike must stay distinguishable.** `unread`, `absent`, `absent-verified` and `unknown` describe four genuinely different situations and a lay reader cannot tell them apart from the tokens. `unknown` in particular must never render as a clear finding.

**A new token needs a row here and in `vocabulary.ts` before it ships.** The executable copy is authoritative for behaviour; this doc is authoritative for citation. They are the same 19 rows and a divergence between them is a defect in whichever changed without the other.

# The table

| Token | Prints as | Means |
|---|---|---|
| `present` | Present | The section or rail carries confirmed on-record data for this parcel. |
| `absent` | Reported absent | The source claims no record exists, not yet verified by provenance or vintage. A claim, not yet a confirmed absence. |
| `absent-verified` | absent, verified | Confirmed absent: the claim carries provenance or a known source vintage. A panel-side paint state earned from a wire `absent`, never asserted directly on the wire. |
| `unknown` | unknown | Not a finding either way. Neither confirms present nor earns a verified absence. |
| `refused` | Refused | The producer declined to answer on this read path. The refusal code and reason say why. |
| `unread` | Not read | Not read on this call. Distinct from absent: nothing was checked, so there is no claim either way. |
| `citationsDegraded` | citation degraded | A present claim carries no verifiable https citation; the source exists but could not be linked. |
| `gis-approximate` | GIS-approximate | `frame.quality`: the ring is derived from public GIS parcel geometry, not a field survey. Printed distances are approximate, not surveyed. |
| `seed` | Seed confidence | `draw.confidence`: a first-pass geometric estimate. Not a calibrated score, not a percentage, not a probability. |
| `side_corner` | corner side | The property line runs along a corner lot's side yard, not its primary front or rear line. |
| `atom_path_pending` | Withheld, setbacks unruled | Setbacks and the buildable envelope are not ruled or baked for this jurisdiction yet; no distance or polygon exists to report. |
| `upgrade_required` | Upgrade to open this parcel | The caller's tier does not include this depth of read. A plan upgrade or a 30-day unlock is required. |
| `parcel_not_found` | Not on file in \<county\> | No parcel record exists in this server's coverage for the given id. A genuine server-declared miss. |
| `baked_snapshot_not_found` | No baked snapshot yet for \<parcelNodeId\> | The parcel may exist, but the Smart Site facet snapshot has not been baked. `parcelExists` states whether the parcel itself was confirmed. |
| `parcel_batch_cap` | Batch too large | The request exceeded the array cap for this depth: 50 at stub, 25 at node. |
| `open_did_not_reach_me` | Open did not reach me | Client-side only: the Open click produced no tool result within the host's timeout. No claim was made about the parcel. |
| `depth_not_implemented` | Not implemented | `hop1` and `subgraph` are not built. Not a data miss; the read path does not exist. |
| `declined-in-bake` | Declined in bake | `refusal.code`: the producer evaluated this facet during the bake and declined it. `refusal.declineReason` carries the sub-reason. |
| `not-in-bake` | Not in bake | `refusal.code`: this facet was never attempted in the bake that produced this snapshot. |

# The two pairs that must never collapse

`parcel_not_found` versus `open_did_not_reach_me`. The first is a server-declared miss and makes a claim about the parcel: it is not on file. The second is a client-side delivery failure and makes NO claim about the parcel at all. Collapsing them tells a user a property does not exist when in fact a click was dropped. They stay distinct sentences.

`absent` versus `absent-verified`. The first is a source's claim; the second is that claim with provenance or vintage behind it. Only the second is a confirmed absence. Presenting the first as the second is asserting a verification that was never performed.

# Three policies the payload carries, not the prose

These are fields rather than guidance, because anything prompt-based degrades and these must be true rather than likely.

**Derived figures are denied.** Nothing may compute an area, a coverage ratio, or any other figure from `draw.ring`. A session computed a shoelace area and nothing prohibited it, which is the same class as a previously tracked invented "42 percent lot coverage". If a number is not present as a field, it is not available.

**An `unknown` overlay carries an explicit null finding, separate from its label.** So "No pipeline within 500 ft" cannot be rendered as a result when nothing was checked. The label names the subject; the finding names the answer; an unchecked subject has a label and no answer.

**`agentGuidance` rides every non-present facet.** It was deployed on exactly one facet before p563, which made it a mechanism that was armed but starved.

# Known limit, stated because it is load-bearing

The standing block reaches the assistant only on turns where the connector is actually called. It re-arms the vocabulary on those turns and cannot hold framing across off-topic turns in between. So the block is a lookup that is reliably present when a tool runs, not a persistent instruction, and nothing that must be TRUE should depend on it having been read earlier in a conversation. That is why the display strings are attached to the values themselves rather than only published in a table.
