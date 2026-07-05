---
id: research/2026-07-05_icc_code_connect_technical_answers
title: ICC Code Connect API — Ed Cilurso's technical answers (PoC binding spec)
status: active
date: 2026-07-05
related: [_decisions/2026-07-04_icc_poc_play, 09_post_saas_substrate_thesis, 25_atom_architecture_reference, icc-demo repo docs, 73_partnerships]
---

# ICC Code Connect — technical answers (the PoC binding spec)

Answers from Edward Cilurso (Senior Product Manager, Digital Assets, ICC), received 2026-06-30, to the eight technical questions filed in `icc-demo`. These are load-bearing for the ICC PoC and the eventual SaaS display license. Source of truth is the email thread; this is the durable working copy. The PoC (see `_decisions/2026-07-04_icc_poc_play.md`) builds against these.

## Credentials and access

- **Demo credentials** are set and tested for Hauska against the Code Connect API, **enabled through 2026-12-30**. New production credentials issue at the live SaaS stage (so the demo creds carry no security exposure — they are PoC-scoped and time-boxed).
- **Same credentials and same API for the PoC and the live SaaS stage** — there is no separate interface to rebuild for production. Endpoint documentation + Postman collection at `https://api.iccsafe.org/`.
- **Titles mapped for the PoC:** 2018 International Building Code (book id **`IBC2018P6`**) and 2018 International Property Maintenance Code (book id **`IPMC2018P2`**).
- **Rate limits / quota:** per `https://api.iccsafe.org/`.

## Citation identifier format (binding — our references must match exactly)

Minimum canonical form is **Codebook name + precise section number**. Example:
- Section URL: `https://codes.iccsafe.org/content/IBC2018P6/chapter-8-interior-finishes#IBC2018P6_Ch08_Sec802.3`
- Correct displayed citation: **"2018 International Building Code Section 802.3"**

So a formal reference renders as `<full codebook title> Section <number>` (e.g. "2018 International Property Maintenance Code Section X"). The ICC atom/adapter must emit exactly this string when displaying a title.

## Verbatim display boundary

- Showing the **section identifier + heading alongside our own analysis** is fine (our default).
- **Displaying the content of a subsection is explicitly allowed.** So we MAY show subsection body text, not only the identifier. This is more permissive than our conservative default; our design intent (sell reasoning, cite the source) still governs — we cite and reason, and may surface subsection content where it strengthens the reasoning.

## Derivative works (the commitment-#1 firewall, in ICC's words)

- ICC's definition: **"When the content text is directly used within new content you create, that is a derivative work."**
- Therefore: **citing a section + independent analysis is NOT a derivative** (clean, PoC-safe); **directly incorporating ICC content text into content we generate IS a derivative** (requires the license). This maps exactly onto structural commitment #1 (sell reasoning, not raw data): our reasoning atoms cite ICC sections and reason over them without reproducing the code text, so they are not derivatives. The point-to (never embed-with) rule for licensed ICC content is thus contractually grounded, not just an internal principle.

## Caching / storage and wind-down

- **Storage restriction:** a full licensee who stores code content agrees that, on ceasing to license, **all stored copies must be destroyed — including vector databases that have ingested the content.** This is the "layer-in-between never republishes" acceptance criterion in storage terms.
- **PoC wind-down:** delete stored content, stop using the API, and confirm back to ICC. Design implication: the ICC content path must be isolatable and destroyable (isolated demo instance, clean tear-down), and any ingested ICC text must live in a partition that can be provably purged. Extracted reasoning atoms that cite (but do not reproduce) ICC text are not "stored content" in this sense.

## Next step per Ed

When Hauska is ready to demonstrate code use within the software, reach out and ICC arranges the demo; following the demo, ICC creates and signs the full SaaS agreement enabling ICC codes in customer-facing applications. So the PoC demo is the gate to the paid display license.

## Build implications (for the PoC and the engine ICC adapter)

1. The ICC adapter's citation output must render `<codebook title> Section <number>` verbatim (IBC2018P6 -> "2018 International Building Code", IPMC2018P2 -> "2018 International Property Maintenance Code").
2. Licensed ICC text follows point-to, never embed-with (the untrusted-to-atom firewall): reasoning atoms cite section ids; any surfaced subsection body is fetched/displayed as licensed content behind the gate, never minted into a public-tier atom body.
3. The ICC content store must be a purgeable partition (destroy-on-termination), separate from the reasoning atoms that merely cite it.
4. Metering/attribution (MCP pay-per-query, PR #33) is the visible-usage acceptance criterion — the command-center metering view shows ICC its usage.
