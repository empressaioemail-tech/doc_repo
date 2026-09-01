# Mission — write the P5 scrub families now, so they are not a serial block later

P5 is the largest untouched block on the CTX board and it is **code**. It can only
RUN after P4, but it can be WRITTEN now, in parallel with the handback and
P2-JURIS lanes. Written early it also supplies the poisoned-row fixtures that P4's
own exit gate needs. Left until after P4 it is a serial block at the end of the
road.

**This card writes and tests. It does not run a production scrub and does not
publish.**

## The binding constraint — extend the walk, do not sit beside it

A-021 already gates production on a passed walk. A new standalone scrub script
would be a **fifth dormant mechanism** on a board that has already found four.
The families extend the existing grade set:

- Grade set: `src/stages/grade/v-rules.mjs` (hauska-factory). Today `RULE_IDS` is
  `V1`..`V15` and `MEANING` is `{V1, V3, V7, V11, V14}`.
- Walk: `src/jobs/verify-walk.mjs`.

**Read `gradeRule` before writing anything.** It returns `PASS` when
`evidence.pass === true && (meaningShaped || MEANING.has(ruleId))`, where
`meaningShaped` arrives as a **caller-supplied argument**.

First question this card answers, before any family is written: **is
`meaningShaped` derived, or is it declared by the caller?** If a caller supplies
both `evidence.pass` and `meaningShaped`, then one party acting alone satisfies
both sides, which is internal consistency wearing a meaning-shaped label, and every
S-family added on top inherits exactly the vacuity it exists to prevent. Two
mechanisms produce the same reading here: the flag may be computed by a shared
helper from the evidence's own provenance (fine), or passed as a literal at the
call site (not fine). Enumerate the call sites and say which. Report the answer
before proceeding; if it is caller-declared, fixing that is the first family.

## The families

Fourteen. Each needs a **second, independently derived** input. Two fields from one
payload from one upstream is one derivation, not two.

| | Family | Second derivation |
|---|---|---|
| S1 | sentinels (`", ,"`, `", TX 78660"`, `0,0`, `A1 — A1`) | real vs non-null coverage |
| S2 | three-state audit: every null carries the full record | null vs its provenance |
| S2b | absence integrity: `asOf` is evaluation time, `basis` varies per parcel | `asOf` vs `bakedAt` |
| S3 | cross-source agreement (landUse, yearBuilt, acreage) | three-way; disagreement refuses |
| S4 | point falls inside its own ring (`ST_Contains`) | geometry vs join label |
| S5 | refusal reconciliation: a refused parcel names *that* refusal | roster vs served body |
| S6 | serve-path divergence: facets vs `get_smart_site` vs PE vs MCP | reader vs reader |
| S7 | ledger vs served truth | cell vs live probe |
| S8 | provenance completeness | value vs source |
| S9 | unit and frame | declared unit vs range |
| S10 | identifier hygiene (six key forms live today) | key vs registry |
| S11 | schema-version fidelity | cross-county shape diff |
| S12 | adapter conflict (426 Bastrop parcels, two geometries) | adapter vs adapter |
| S13 | placeholder provenance + derived-without-input | provenance allowlist; envelope vs rule |

S4, S5 and S13 are the three the board flags as most likely to find live defects.

## Sampling law

100% for anything expressible in SQL. **Area sweep, never random**, for the HTTP
checks — random sampling certified a broken Bastrop once.

Force the hard classes in rather than hoping they appear: the refused roster,
gate-blocked, no-row, PDD parcels, 5- and 7-digit ids, two-tax-year parcels,
unincorporated parcels, and the 534,700 CAD rows with no conformant snapshot.

## Exit gate

**Every family runs against a poisoned row and FAILS, and against a known-good row
and PASSES. Both directions, every family.** A family observed only passing has not
been observed working. A family that cannot be made to fail is not written yet.

Keep the poison fixtures — P4's exit gate needs them.

## Do not

- Do not write a standalone scrub script that runs in no workflow. That is the
  dormant-mechanism defect this card exists to avoid.
- Do not run a production scrub, a bake, or a publish from this card.
- Do not assert a value the system currently produces that no external authority
  recognises. Verify expected values against the source authority, not against
  current output — that converts a defect into a specification.
- Do not weaken a family because no second derivation exists. Construct one.
- Do not sample randomly for the HTTP families.
- Do not touch any repository other than the registered factory worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot (repo, branch, commit) in the first output. **State the falsifier for each
family before running it.** `leave_behind` named, `none` is valid. Subagents do not
commit. Verification does not delegate below the lane planner.
