## Mission — P-351: the bake retires a parcel only when its own account is gone

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` (the bake) and
`hauska-factory` (the bake pin), each from current `origin/main` with the SHA declared (LDT `25d1782f`,
factory `0f4558a4` at compile). You do not merge, deploy, bake, publish or write any store; the
integration seat does all of them. Any doc_repo change is handed back as a diff in your close.

No bake publish runs until this row lands (the handoff's standing hold): P-349's Hays bake and P-350's
Williamson republish both wait on it.

### Two retirement writers live inside the bake (P-327's finding)

P-327 (`_inbox/2026-09-18_p327-retirement-gate-roll_close.json`, `contradicted` and `leave_behind`)
grouped retired tier-1 rows by the authority string their writer stamped, and found two writers:

| Writer | Where (LDT at `25d1782f`) | Compares | Wrote |
|---|---|---|---|
| (a) the conformant arm | `artifacts/api-server/src/lib/nodeFacetBakeTier1Conformant.ts` `buildConformantTier1Payload` (~line 1347): `apn != null && cadPropConsulted && byPropId.get(apn) == null`, where `apn` is the node id's bare prop_id and `byPropId` is `cad_property` at the declared tax_year | the node's bare id against the roll's `prop_id` | 1,386 of Hays' 58,015 retired rows; 282,570 of Williamson's 602,050 |
| (b) the P-180 wave-6 account-keyed pass | `artifacts/api-server/src/nodeFacetBakeTier1ConformantCli.ts` (~line 412) `partitionAccountKeyedWork(work, txgioPropIds)`, then `buildAccountKeyedRetirementPayload` (`src/lib/accountKeyedWork.ts`) | work ids against the resolved PARCEL table (`txgio_parcel` for a gate-blocked county) | the other 56,629 (Hays) and 319,480 (Williamson) |

The factory's pre-bake gate (P-319, P-327, `requireRetirementGate` in `runBastropPublish`) can refuse
before the bake starts. It cannot reach (b), which runs inside the bake after promotion, and it is
bypassed by any bake run outside `runBastropPublish`.

### What the seat measured since (production, 2026-09-18)

- Hays' 56,629 `txgio_parcel`-authority retired rows are NOT served parcel keys: they are the hollow
  account-keyed nodes P-180 meant to retire. Writer (b) did its job in Hays.
- Hays' 1,385 `cad_property`-authority retired rows ARE served parcel keys. Those are writer (a)'s,
  and they are the population this row must settle one by one.
- Hays node ids are parcel-map ids, not accounts (`_decisions/2026-09-13_hays_node_identity_is_the_parcel_map_id.md`):
  the same bare number can name two different properties on the map and on the roll. The account is
  reached only through `geo_id = property_number` corroborated by the `quick_ref_id` stem. The bake's
  own comment near the `landUseRoll` fetch says "48209 and 48491 are clear on this join" (CAD-to-CAD
  on prop_id). That contradicts the ruling. Resolve it at source and say which is true.

### Williamson: the answer already exists

P-335's close (`_inbox/2026-09-18_p335-williamson-crosswalk_close.json`, `p351Answer`) worked it out
from the code and the counts: the served node's R id, then the county's published WCAD pair, then the
numeric account, then `byPropId.get(account)`. The pair goes IN FRONT of the lookup. The reverse
direction is useless. The retirement predicate itself is right and must not be weakened: a node whose
ACCOUNT is absent from the declared roll still retires. Read the pair from the same two staged
extracts the factory reads (`tx_wcad_owner`, `tx_wcad_ag_valuation`); do not build a second copy with
its own staleness.

### What to build

1. **Writer (a):** the arm resolves each node to its account within the node's own keyspace, or
   through the county's published crosswalk (Hays: the geo_id bind with its corroborator; Williamson:
   the WCAD pair), before it looks at the roll. A node whose key cannot be resolved is NOT retired: the
   payload says the retirement could not be determined and why. An unaccounted keyspace refuses the
   bake for that county rather than retiring into it. The payload states what it compared: the key,
   the path, the roll and its tax year.
2. **The dollar facts ride the same lookup.** `cadFacts` comes from the same `byPropId.get(apn)`. Say
   whether a Hays map-id node that collides with an unrelated account gets that account's dollars
   today, with a count and three named examples, and route both through the one resolution you build.
   A value on the wrong parcel is worse than an absence.
3. **Writer (b):** decide whether the account-keyed pass belongs to the bake's contract or to the
   gate's, and say why. If it stays in the bake, it gets its own instrument: before the pass, measure
   the excluded set against the served keyspaces and refuse when the excluded set is a whole served
   keyspace (P-327's suggested shape; blast radius today: exactly 48209 and 48491).
4. **The 1,385.** For each Hays served key writer (a) retired, resolve its account through the
   crosswalk and read the declared roll. Report how many are genuine retirements (the account is off
   the roll), how many are false (the account is on it), and how many have no resolvable account.
   Write them to a committed artifact. The next bake applies the answer; you do not.
5. **The pin.** A factory PR moving `_LDT_SHA` in `cloudbuild.publish.yaml` from `bae48d40` to the
   LDT commit carrying this change, with its adjacent comment. List every LDT commit between
   `bae48d40` and the new pin that touches the bake path (P-304, P-297 and P-258 lane-c are among them)
   so the seat knows what the next bake carries. Open it as a draft against your LDT PR's head; it is
   re-pointed to the merge commit after the LDT PR merges. `ldt-pin-staleness` must pass at the new pin.

### Verify by violation

Pre-register your falsifiers. Fixtures for Hays (a collision: map id equals an unrelated account
number), Williamson (an R node reached through the pair, one the pair does not reach), and a
single-keyspace county. Each shown on the pre-change code: the Hays collision retires wrongly or reads
the wrong dollars; the Williamson node retires wrongly. And on the fixed code: a genuine account
retirement still retires (the predicate is not weakened), an unresolvable key is declared, not
retired, and Bastrop's payloads are byte-identical. Then a read-only dry run of the bake's retirement
decisions for 48209 and 48491 (no write, heavy-scan lease, direct host) with counts per writer beside
an independent query.

### The three-question gate

Answer in your close: what executes each retirement writer, what triggers it, what fails when a writer
retires across keyspaces, and what bypasses it (a bake CLI invoked directly, the frozen laptop scripts,
a raw write).

### Constraints

- No store writes, no bakes, no publishes, no deploys, no merges.
- hauska-factory merge order this wave: P-333, then P-334/P-329/P-330, then P-352 and P-361, then
  P-300 and P-338's writer half, then P-336's. Your pin PR is separate from that queue, but rebase it
  onto whatever has merged and say whether P-329's comment-adjacency rule is on main when you open it.
- P-354 (Georgetown dates) and the LDT halves of P-339 to P-341 may be in flight in LDT; stay inside
  the bake's retirement, key resolution and account-keyed pass, and name any shared file.

### Close

Declare: the start commits and both PRs, the answer on "clear on this join", the dollar-collision
count with examples, the decision on writer (b) with its instrument, the 1,385 split and its artifact,
the LDT commits the new pin carries, the falsifiers with both directions shown, the three-question gate
answers, and `leave_behind`.
