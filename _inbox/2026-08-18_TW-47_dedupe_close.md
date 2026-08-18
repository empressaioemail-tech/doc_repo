---
id: 2026-08-18_TW-47_dedupe_close
title: TW-47 CLOSE — the merge half was already done seven weeks ago; the alias backfill is live; resolution works end to end
status: closed
last_updated: 2026-08-18
applies_to: empressa-trading
executor: cockpit planner
authority: D-083 → D-084 (99_DECISIONS.md)
related: [2026-08-18_TW-47_security_master_dedupe_brief]
---

# TW-47 CLOSE

## The premise correction, first and loudest

**The catalog was NOT carrying live duplicates. The D-083 finding was wrong in its
headline number and right in the part that mattered.** My D-083 probe counted nodes
without filtering `status='merged'`: the "24 AAPL duplicates" were 23 merged losers
+ 1 active survivor. `merge_links` shows **25,926 `provisional_dedup` merges executed
in bulk on 2026-06-29T12:22:55Z** and 11 `venue_normalization_dedup` merges on
2026-08-17 (TW-36's own reconciliation, the day it deployed). Active population:
9,984. Duplicate groups today: **0**.

What survived of D-083 is the load-bearing half: **zero `identity.symbol` alias
eras** — the served era-walk builds candidates exclusively from alias atoms (no
nodes-table fallback; verified in `resolve_security` step 3), so the entire catalog
was invisible to the served read regardless of deduplication.

Same failure class as the tar near-miss and your bundle grep: an unfiltered count
read as a filtered one. The verification instrument (dry run) caught it before any
write, which is what the dry-run-first shape is for.

## What was done

1. **Survivor rule written and committed BEFORE any merge** (`apps/cockpit/docs/TW47_SURVIVOR_RULE.md`,
   commit `721d0853`) — including the multi-trusted, zero-trusted, form-collision,
   and no-promotion rulings you required. It stands for any future pass even though
   this one needed no merges.
2. **Dry run (read-only, full artifact retained)**: population 9,984 · duplicate
   groups **0** · expected merges **0** · HALT-two-distinct-trusted-issuers: none ·
   HALT-served-trusted-on-losers: none · identifier rows on losers: none ·
   alias-symbol mismatches: 0 · expected alias eras: **9,981** ·
   **form collisions excluded and reported: 21 futures-root pairs**
   (`/ES|ES, /CL|CL, /GC|GC, /NG|NG, /ZB|ZB, /ZN|ZN, /ZT|ZT, /SI|SI, /SIL|SIL,
   /HG|HG, /MGC|MGC, /MCL|MCL, /MES|MES, /MNQ|MNQ, /NQ|NQ, /RB|RB, /XC|XC,
   /M6E|M6E, /M6B|M6B, /M6C|M6C, /M6J|M6J`) — per the rule these are different
   textual identities, not venue seams; each form resolves to its own node and no
   merge was attempted. Whether the bare forms deserve retirement is a separate
   operator ruling; nothing in this pass forecloses it.
3. **Apply: alias-era backfill only.** `GAP_AT_APPLY 9981` — **exactly the dry-run
   expectation**. Written 9,981 · skipped 0 · remaining gap 0 · total
   `identity.symbol` atoms now 9,987 (6 pre-existed). Shape: the resolver's own
   `_write_alias_atom` (byte-identical to a mint-time alias), open era,
   `valid_from=null` (listing start unknown, not fabricated), `knowledge_time=now`
   (when the fact entered the record — historical as-of blindness stays honest),
   `source="tw47_backfill"` (the cohort is mechanically separable forever).
4. **No minting. No merges. No status promotions. No identifier re-points needed.**

## Soak safety (both-sides snapshot diff)

Pre 17:49:32Z / post 17:55:26Z: atoms **55,898 → 65,879 (+9,981, the stated
delta to the atom)**; every other ledger counter, both A/B arms, all bot statuses,
positions, stops: byte-identical (one known cosmetic row-order shuffle). Queue
empty both sides — serialized against the soak as required. No container restart
was involved at any point.

## Verification (service key, from the VM)

- `lookup?symbol=AAPL` → `sec_01KW9M9AHG6KH27D3XB1RHQC7E` (the proven XNAS survivor
  with the trusted Apple Inc. link) · `SPY` → `sec_01KW8C3B5YM6KE5P3PA597MS5V` ·
  `MSFT` → `sec_01KW87FC7ANAK9DS7KEPGTE1JY` · `GC` and `/GC` → two DISTINCT nodes,
  as the form-collision rule requires.
- `node/<AAPL id>` → 200, XNAS, equity, active, `resolution_status: "provisional"`
  (not promoted — surviving is not evidence).

## The union call — your predicted defect fired, but as a THIRD defect, not the two you named

`GET /v0.1/twin/AAPL` (anonymous) → `resolved: false, verdict: lookup-failed`, basis:

> "AAPL" **resolved to sec_01KW9M9AHG6KH27D3XB1RHQC7E**, but the security-master
> node read carried no asset_class…

Resolution works — the basis sentence itself is the proof. But the adapter failed on
`asset_class`, not `displayName`: **the cockpit's node read DOES serve
`asset_class: "equity"` — nested under the `node` object**
(`{"node": {"asset_class": …, "current_symbol": …}, "issuer": {"name": …}}`).
Your adapter appears to read top-level fields from the TW-44a wire shape. So the
fix list for your union PR is now three: (1) displayName falls back to
`issuer.name`; (2) absence basis relays the upstream sentence; (3) **the adapter
must read the nested `node.*` / `issuer.*` shape** — the displayName defect will
still be there behind the asset_class one.

## Reversal

- Alias cohort: `claim_type='identity.symbol' AND provenance LIKE '%tw47_backfill%'`
  — reversal CLOSES eras (writes `valid_to`), never deletes. No merges to reverse.
- Snapshots retained (`snap_tw47_pre/post`); dry-run JSON retained.
