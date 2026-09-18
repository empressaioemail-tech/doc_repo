---
id: 2026-09-18_p347_customer_leg_wave1_record
title: P-347, the customer leg made gradeable, Wave 1 record
date: 2026-09-18
last_updated: 2026-09-18 (14:15Z)
status: partial. Everything but the MCP leg is done and graded; the MCP leg waits on a client identity for the sign-in helper (operator decision) and then the operator's sign-in (ruling 9)
kind: seat record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-347, P-205, P-210, P-270, P-353]
snapshot: probe artifact of record `_inbox/2026-09-18_140516_surface_probe.json` (instrument sha256 a1590f84142526c4..., working-tree revision on doc_repo main e887a8fb, run 14:05:16Z, --use-system-ca, engine key present, MCP refused missing_bearer); PDF build record `_inbox/2026-09-18_p347_pdf_builds.jsonl`
related:
  - _decisions/2026-09-18_phase0_closeout_rulings.md (rulings 9, 13, 17)
  - _inbox/2026-09-17_192035_surface_probe.json (the customer leg of record before this run)
  - _inbox/2026-09-18_135952_surface_probe.json (first run of the day; superseded, carries a false XD-1 FAIL, see section 2)
---

# P-347, Wave 1

## 1. What changed in the instrument (`scripts/surface-probe.mjs`)

| Done clause | State | How it is proven |
|---|---|---|
| XD-1 corrected to P-304's rule (ruling 13) | done | A figure is judged by its backing, read from a SECOND surface (the draw route's `derivePath` carrying `+atom-reconciled`), never from the payload that carries it. Unbacked FAILS, backed PASSES, unreadable backing is UNMEASURED. Applied in the bucket grader, the `figureLeak` ledger grader, the findings and P-303. Self-tests both directions, including the live 504 shape |
| Runs use `--use-system-ca` | done | A TLS preflight refuses the whole run by name (exit 2, no artifact) when Node cannot verify a certificate. Verified by violation: with `NODE_EXTRA_CA_CERTS` unset and no flag, it refused `UNABLE_TO_VERIFY_LEAF_SIGNATURE`; with the flag it proceeded |
| The PDF leg carries the engine key | done | A missing key, or a 401/403, is named as a refused read, never folded into UNREACHED |
| A PDF built for each fixture parcel (ruling 17) | done | `scripts/p347-build-fixture-pdfs.mjs`: scope is exactly the parcels the probe's PDF leg reads (52); intent recorded before each POST; capped at 60; refuses a tag URL. Refusals verified by violation (no key, a tag URL, an unwritable record). 50 built 13:29:47Z to 13:52:40Z, 0 failed; the 2 already served were left alone. PDF surface: SERVED 52 of 52 (was NOT-BUILT 50) |
| The MCP leg signs in (ruling 9) | built, not yet run | Sign-in helper: OAuth 2.1 code flow with PKCE, loopback redirect, the server's own resource indicator, token in memory only, and a write guard that refuses to write any artifact containing the token (self-tested both ways). The session is now opened properly: `mcp-session-id` captured, `notifications/initialized` sent, tool argument names read from `tools/list`. The 2026-09-17 leg could not have made a second call even with a token (it read headers from an object that never carried them). The tier is read off the server's own `subscriptionTier` and recorded; a run where no answer names it says so |
| Coverage leg graded (P-205, P-210) | done for map and endpoint | New rows. P-210 grades the retrieval coverage endpoint; P-205 grades the Find box and the MCP's `find_parcel` on addresses that genuinely do not exist in real localities, so a coverage answer is owed |
| P-270's X2 half confirmed or reopened on its own subjects | done | Section 3 |

Also applied: the P-270 citation lane's probe patch (`_inbox/2026-09-17_p270-citation-effective-date_surface-probe.patch`,
the lane's own leave-behind, "a decision someone makes, not a default"). Reviewed and taken: an undated
citation that DECLARES its unreadable vintage is counted as its own class `XD-11-declared` rather than
subtracted, the undeclared case still fails, and a declaration whose prose parses as a date is caught.
Limit stated: the declaration and the citation come from the same payload, so this grades whether the
surface is honest about an unknown vintage, not whether the date truly is unreadable at source (that is
P-258's acquisition work). The patch's encoding damage (em dashes as `ΓÇö`) was repaired.

Self-test: all checks pass (272 before the last fixes; more since).

## 2. A defect of my own, caught by the run

The first run (13:59:52Z) graded XD-1 OPEN on `48021:14899`. The draw route had answered **504**
("upstream aborted after 10000ms"), and my first `figureBacking` read the absent `derivePath` as "no
reconciled atom". A route that timed out measured nothing. Fixed: a non-2xx answer leaves backing
unmeasured; a 2xx decline is unbacked; an ok with no derive path is unmeasured. The corrected run
(14:05:16Z) is the artifact of record; on it the same parcel's figure is backed.

## 3. Results, artifact `_inbox/2026-09-18_140516_surface_probe.json`

**Buckets (P-254): 0 PASS, 12 FAIL, 33 UNMEASURED** (2026-09-17: 0 / 17 / 28). No bucket can PASS
until the MCP half is measured, by design.

**XD and X defects: 6 OPEN, 10 CLOSED, 7 UNMEASURED of 23** (2026-09-17: 11 OPEN).

| Open | Where | Owner |
|---|---|---|
| XD-2 / X5 | Waco `48309:187374`: the panel declines while the route draws 9 vertices | P-339 to P-341 (Waco XD-2) |
| XD-7 / X6 | 12 of 45 subjects serve a district with no composed address (first `48021:51735`) | P-335 (Williamson), P-271 |
| XD-11 / X11 | Martindale `48055:27929`: citation served undated and undeclared (24 others now declared) | P-270's LDT half, after P-323's deploy |

Closed on this run: XD-1, XD-4, XD-5, XD-8, XD-13, XD-14, X2, X4, X8, X10. UNMEASURED: XD-3, XD-6,
XD-10, XD-12, X7 (no grader in this instrument; each names its owning row), XD-9 and X9 (no subject
has the malformed-situs shape).

Required cases still firing (violations, not defects): the ruled-table-called-unruled contradiction on
5 subjects and geometry-withheld-beside-drawn on 2 (P-339's envelope-reason work), and 6 codified
districts that do not draw.

**P-270's X2, on its own subject `48453:445501` (Pflugerville):** the zoning-row half is CONFIRMED
(`jurisdictionKey pflugerville-tx`; X2 CLOSED on all 37 graded subjects) and its citation is declared
undated. **The address-line half is REOPENED:** the ledger holds `situsZip` 78660 and `cityLimits`
Pflugerville (`situsCity` is absent-verified in the county roll), and the card's address reads
`21404 GRAND NATIONAL AVE` with neither. The card-truth close already said P-270's address half was
unbuilt. The X2 grader checks the jurisdiction row only; the address line needs its own predicate.

**Coverage:** P-210 PASS 3 of 3 (Austin covered; Cameron not-covered naming Milam County 48331, TX;
Marble Falls not-covered naming Burnet County 48053, TX). **P-205 FAIL 4 of 4 on the map:** the Find
box returns `{"hits":[]}` with no `missClass` for every subject, so a customer cannot tell a covered
miss from an uncovered county or from another state. Code read: `pe-situs-search-core.ts` lines 82 to
106 rebuild the response as `{ hits }`. P-205 was customer-closed on the MCP only (A-197). Carded as
**P-353**. The MCP half is unmeasured until the sign-in.

## 4. What P-347 still owes

The MCP leg. It needs a client identity the sign-in helper can present: AuthKit advertises no dynamic
registration, and the server's own `WORKOS_CLIENT_ID` is not an OAuth application there (`invalid_client:
Application not found`, measured 2026-09-18). The server checks only the token's issuer, signature and
audience (`https://mcp.smartsite.cloud/mcp`), and WorkOS issues the audience from the requested
resource, so either a registered public client or a client-ID metadata document works. Which one is the
operator's decision. Then the operator signs in once per run, and the probe re-runs with `--mcp-sign-in`.
