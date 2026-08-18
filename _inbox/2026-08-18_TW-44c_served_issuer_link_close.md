---
title: TW-44c close — the served node read names its issuer, and only when the link is trusted
date: 2026-08-18
status: complete
row: TW-44 (Smart Markets, unregistered R&D — no PLAN-ROW by design, per operator override TW-44c)
repo: empressaioemail-tech/empressa-trading
branch: tw44c/served-issuer-link
pr: 341
last_updated: 2026-08-18
---

# TW-44c close

## Header facts

Branch: `tw44c/served-issuer-link`, cut from `origin/main` at `08585b0b` in an isolated worktree at
`P:/empressa-trading-worktrees/tw44c-served-issuer-link`. Nothing was checked out in `P:/Empressa Trading`.

Commit: `6e55adb4` — `feat(TW-44c): the served node read names its issuer, and only when trusted`.

PR: **#341**, https://github.com/empressaioemail-tech/empressa-trading/pull/341, base `main`. NOT merged.

Files touched, three, all inside the two directories the dispatch allowed:

    apps/cockpit/backend/app/securities/router.py              +180
    apps/cockpit/backend/tests/test_tw44a_served_node_facts.py  +11
    apps/cockpit/backend/tests/test_tw44c_served_issuer_link.py +1008 (new)

## The exact fields added

Four fields on `ServedNodeFacts`, every one additive and optional (defaulted), and every one either
`issuer_`-prefixed or nested so an issuer fact cannot be read as a fact about the security. They mirror
the envelope's existing verdict-then-facts shape one for one:

    issuer_available: bool = False          mirrors  available
    issuer_reason: str | None = None        mirrors  reason
    issuer_node_id: str | None = None       mirrors  node_id
    issuer: ServedIssuer | None = None      mirrors  node

One new response model, in the same module (a served path still takes no runtime dependency on the
operator-gated admin module):

    class ServedIssuer(BaseModel):
        node_id: str
        name: str | None
        lei: str | None

`name` is included because it is the whole point of the row: `name` is an issuer-only column on `Node`
(the model comments the block `# Issuer-only fields.` above `lei` and `name`), so a security node carries
`name = NULL` and an equity twin had no label available anywhere. `lei` is included because it is the
other half of the same issuer-only block, it is an identifier the twin layer can key on, and it leaks
nothing new: this same route already returns `lei` and `name` on the `node` object when an issuer node id
is read directly, so no fact reached the served surface that was not already on it.

WITHHELD, deliberately: `created_at` (row bookkeeping, TW-44a's standing exclusion), the issuer's
`status` / `resolution_status` / `asset_class` / `identifiers` (not needed to name or file a twin; a
caller that wants them reads the issuer node id back through this same route), every edge fact
(provenance, match method, valid_from/valid_to, counts of any kind), and everything on the operator
console (`edges_out`, `edges_in`, `atom_counts_by_family`). The route adds no field to any admin
response and moves nothing between gates.

Six module-level reason constants were added and are exported (`ISSUER_TRUST_RULE`,
`ISSUER_REASON_NOT_A_SECURITY`, `ISSUER_REASON_UNTRUSTED`, `ISSUER_REASON_RETIRED`,
`ISSUER_REASON_AMBIGUOUS`, `ISSUER_REASON_DANGLING`, `ISSUER_REASON_CYCLE`), so the rule is stated once
and a test can assert the sentence rather than a substring it invented.

## The trust rule I implemented, and where it lives

The route does not read the security-to-issuer edge at all. It calls

    app.securities.issuer_links.trusted_issuer_node_id(db, canonical_id)

which is the single sanctioned reader, and which applies
`TRUSTED_MATCH_METHODS = (MATCH_CIK_EXACT,)` — defined at `apps/cockpit/backend/app/securities/issuer_links.py`
(the module docstring carries the operator ruling of 2026-08-17: the legacy links stay recorded, trust is
a read-time decision). Served: `cik-exact` only. Withheld: `name-fuzzy` (the defect), `lei-exact`
(labelled but unexercised — one LEI row in the whole index), and unlabelled legacy (all 8,334 pre-TW-31
production edges).

An untrusted or unrecognised link produces `issuer_node_id: null`, `issuer: null`,
`issuer_available: false`, and `issuer_reason` stating the rule. The untrusted issuer's node id, name and
LEI appear nowhere in the response — the test asserts that against the entire response body text, not
just against the field, because a leaked name in a reason string is as usable a mis-filing key as a
leaked id.

One deliberate non-distinction, stated plainly: the route does NOT tell the caller apart "an untrusted
link exists" from "no link exists". Both answer with the same rule-stating reason. Two reasons. First,
that is exactly how an untrusted link is treated elsewhere — `trusted_issuer_node_id` returns `None` in
both cases and does not distinguish. Second, the only sanctioned way to learn that an untrusted edge
exists is `issuer_link_trust_split`, which runs a full scan of live security nodes (`select(Node.node_id)`
over ~35,918 rows) on every call and returns edge-provenance internals; putting that on a hot served read
would cost a scan per request and would put edge provenance on a surface that has none today. The
alternative was available and I chose against it.

Structural: the router names no edge type and takes no unscoped `select(Edge)`, so
`tests/test_issuer_link_trust.py`'s two source walkers stay green with no allowlist entry added. Adding an
allowlist entry would have been a widening of the trust boundary and needs an operator ruling, not a
green build. I added none.

## The retired-node narrowing I honoured

Found, read, and honoured rather than reinvented: **TW-35**, in
`apps/cockpit/backend/app/securities/issuer_links.py`, function `_live_security_from_node_clause()`,
applied by `trusted_issuer_links(..., exclude_retired_securities=True)`. It excludes any edge whose
`from_node` is a security node with `status == "merged"`, because `merge_nodes` rewrites no edges, so a
deduped duplicate leaves its `cik-exact` links recorded against a node that no longer represents anything
live. The module docstring is explicit that this is a NARROWING and that canonicalizing `from_node` there
would be a WIDENING, and that the coherent counterpart is the survivor minting its own link in
`issuer_rebuild.rebuild_issued_by`.

What the route does with it: nothing. It calls the boundary and lets the boundary decide. The handler's
only use of the retired fact is to choose a more specific SENTENCE when the boundary has already returned
`None` and the node row it already holds is still `status == "merged"` — that is, to say "this node is
retired, resolve the survivor" instead of the generic "no trusted link". It never filters nodes by status
to decide the link. `test_the_route_does_not_carry_its_own_retired_node_narrowing` pins exactly that by
asserting `Node.status` never appears in the handler body while `trusted_issuer_node_id(` does.

Because the route canonicalizes first (constraint 4), a caller holding a merged loser's id that HAS a
merge link lands on the survivor and gets the survivor's own trusted issuer in one call. The withheld case
is the orphan shape the narrowing exists for: a node still marked `merged` with no merge link recorded,
which canonicalizes to itself. Both are tested.

## Multi-issuer

How many trusted links exist in a representative case: one, or zero. The boundary keys on DISTINCT
`to_node`, so N duplicate rows pointing at the SAME issuer collapse to one answer and are served normally
(`test_two_links_to_the_SAME_issuer_are_not_ambiguous`).

Can more than one issuer be linked to a single security: yes, the data permits it, and
`trusted_issuer_node_id` treats it as a contradiction rather than a tie — it raises `AmbiguousIssuerLink`
rather than picking, because one security has one issuer by CIK. What I do about it: catch the exception,
serve NO issuer, and state that more than one distinct trusted issuer is recorded and that serving one of
several would be an invented fact. Neither candidate id is echoed — `AmbiguousIssuerLink`'s own message
contains both ids, so `str(exc)` is deliberately not passed through. The request still returns **200 with
the node's own facts**: an ambiguous graph must not become a regression for a TW-44a consumer that only
wanted the node half, so it is not a 409 and not a 500.

I did not measure the ambiguous cohort against production — this worktree has no production database
access and I ran nothing against the live VM. The counts I quote (8,334 legacy edges, 1,323 issuer nodes,
one LEI row against 35,918 securities) are the ones recorded in `issuer_links.py`'s own docstring, not
figures I re-measured.

## Other decisions, stated so they are reviewable

An ISSUER node id passed in directly answers `issuer_node_id: null` with the reason naming the node type,
NOT a self-reference. An issuer node IS the room a twin is filed in; naming it as its own issuer would be
an invented fact dressed as a convenience, and a union layer that dereferenced it would loop. Its own
`name` and `lei` still come back in the ordinary place, on `node`.

A trusted link whose issuer id carries no node row answers null with a stated reason, not a confident
echo — the same discipline TW-44a pinned for a merge link pointing at nothing. This can only withhold,
never serve a wrong issuer.

The issuer id is canonicalized through `SecurityResolver.canonical` like every other node-scoped read, so
a merged-away issuer resolves to its terminal survivor. A merge cycle on the ISSUER side degrades to a
stated absence rather than 409-ing the whole read, because the security's own facts are still perfectly
servable and failing them would break an existing consumer. A cycle on the REQUESTED node still 409s,
unchanged.

Not checked, and disclosed rather than silently added: the route does not assert that the node a trusted
link points at is `node_type == "issuer"`. That would be a third narrowing on a case the codebase has
never ruled on, and this module is emphatic that narrowings are deliberate rulings. The node's type is
visible to any caller that reads the issuer id back through this same route.

## Raw test output

CI command, read from `.github/workflows/ci.yml`: `python -m pytest -q`, working directory
`apps/cockpit/backend`. Run in the worktree with the repo's own venv interpreter (Python 3.12.10,
pytest 8.3.4). Full suite, WITH the change:

```
$ python -m pytest -q
4696 passed, 2 skipped, 21 deselected, 38903 warnings in 804.49s (0:13:24)
EXIT=0
```

Zero failures, which is the merge standard.

Baseline note, stated plainly because it matters: my pre-change baseline run is NOT clean and should not
be quoted. I started it in the background and then edited `router.py` while it was still running, so
`test_the_handler_touches_no_mint_path` (which reads the handler's source off disk via
`inspect.getsource`) read a file whose line numbers had shifted underneath it:

```
FAILED tests/test_tw44a_served_node_facts.py::test_the_handler_touches_no_mint_path
1 failed, 4663 passed, 2 skipped, 21 deselected, 38903 warnings in 894.49s (0:14:54)
```

That failure is my own contamination, not a pre-existing red. The arithmetic confirms it: 4663 + 1 = 4664
collected before, plus 32 new tests = 4696, which is exactly the post-change pass count, and that same
test passes in the clean run above and in the targeted run below.

New tests, by name, all passing (32 in the new file; TW-44a's 28 re-run alongside to show nothing moved):

```
$ python -m pytest tests/test_tw44c_served_issuer_link.py tests/test_tw44a_served_node_facts.py -v
tests/test_tw44c_served_issuer_link.py::test_a_trusted_cik_exact_link_serves_the_issuer_and_its_name PASSED
tests/test_tw44c_served_issuer_link.py::test_the_issuer_facts_are_nested_and_never_confusable_with_the_security PASSED
tests/test_tw44c_served_issuer_link.py::test_the_issuer_vocabulary_is_the_admin_modules_not_a_second_dialect PASSED
tests/test_tw44c_served_issuer_link.py::test_the_trusted_match_method_set_is_still_exactly_cik_exact PASSED
tests/test_tw44c_served_issuer_link.py::test_an_untrusted_link_serves_no_issuer_and_states_the_reason[name-fuzzy-name-fuzzy \u2014 the defect itself] PASSED
tests/test_tw44c_served_issuer_link.py::test_an_untrusted_link_serves_no_issuer_and_states_the_reason[lei-exact-lei-exact \u2014 labelled, still not trusted] PASSED
tests/test_tw44c_served_issuer_link.py::test_an_untrusted_link_serves_no_issuer_and_states_the_reason[None-unlabelled legacy \u2014 all 8,334 production edges] PASSED
tests/test_tw44c_served_issuer_link.py::test_a_trusted_link_is_served_while_three_untrusted_ones_are_withheld PASSED
tests/test_tw44c_served_issuer_link.py::test_two_trusted_issuers_serve_nothing_rather_than_picking_one PASSED
tests/test_tw44c_served_issuer_link.py::test_two_links_to_the_SAME_issuer_are_not_ambiguous PASSED
tests/test_tw44c_served_issuer_link.py::test_the_tw35_retired_node_narrowing_is_honoured_not_reinvented PASSED
tests/test_tw44c_served_issuer_link.py::test_the_route_does_not_carry_its_own_retired_node_narrowing PASSED
tests/test_tw44c_served_issuer_link.py::test_a_merged_away_security_resolves_to_the_survivors_issuer PASSED
tests/test_tw44c_served_issuer_link.py::test_a_merged_issuer_resolves_to_its_terminal_survivor PASSED
tests/test_tw44c_served_issuer_link.py::test_a_trusted_link_pointing_at_no_node_is_an_honest_absence PASSED
tests/test_tw44c_served_issuer_link.py::test_a_security_with_no_issuer_link_is_a_200_with_null_issuer_fields PASSED
tests/test_tw44c_served_issuer_link.py::test_a_futures_node_answers_with_no_issuer_which_is_the_contract PASSED
tests/test_tw44c_served_issuer_link.py::test_an_issuer_node_read_directly_has_no_issuer_of_its_own PASSED
tests/test_tw44c_served_issuer_link.py::test_an_unknown_node_id_still_misses_and_states_the_issuer_half_too PASSED
tests/test_tw44c_served_issuer_link.py::test_the_issuer_fields_are_additive_and_optional PASSED
tests/test_tw44c_served_issuer_link.py::test_the_miss_and_the_hit_still_have_the_same_keys PASSED
tests/test_tw44c_served_issuer_link.py::test_the_issuer_read_never_creates_a_node_or_an_edge PASSED
tests/test_tw44c_served_issuer_link.py::test_the_issuer_read_never_commits PASSED
tests/test_tw44c_served_issuer_link.py::test_the_handler_still_touches_no_mint_path PASSED
tests/test_tw44c_served_issuer_link.py::test_the_route_reads_the_issuer_link_only_through_the_trust_boundary PASSED
tests/test_tw44c_served_issuer_link.py::test_the_route_is_still_declared_above_the_mint_banner PASSED
tests/test_tw44c_served_issuer_link.py::test_the_gate_map_is_unchanged_four_served_three_operator PASSED
tests/test_tw44c_served_issuer_link.py::test_the_minting_routes_are_still_operator_only PASSED
tests/test_tw44c_served_issuer_link.py::test_the_minting_routes_are_still_operator_only_in_dev_mode PASSED
tests/test_tw44c_served_issuer_link.py::test_the_admin_console_is_still_operator_only PASSED
tests/test_tw44c_served_issuer_link.py::test_the_issuer_half_is_served_not_public PASSED
tests/test_tw44c_served_issuer_link.py::test_the_dev_bypass_user_sees_the_same_answer PASSED
tests/test_tw44a_served_node_facts.py::test_a_service_credential_is_served_on_the_node_read PASSED
tests/test_tw44a_served_node_facts.py::test_a_user_jwt_is_served_on_the_node_read PASSED
tests/test_tw44a_served_node_facts.py::test_the_node_read_returns_the_descriptive_facts PASSED
tests/test_tw44a_served_node_facts.py::test_an_option_node_carries_its_contract PASSED
tests/test_tw44a_served_node_facts.py::test_an_issuer_node_reads_the_same_way PASSED
tests/test_tw44a_served_node_facts.py::test_a_well_formed_unknown_node_id_is_an_honest_absence PASSED
tests/test_tw44a_served_node_facts.py::test_a_miss_is_never_a_404 PASSED
tests/test_tw44a_served_node_facts.py::test_the_unknown_id_is_not_the_canonical_echo PASSED
tests/test_tw44a_served_node_facts.py::test_a_merged_away_node_id_returns_the_terminal_survivors_facts PASSED
tests/test_tw44a_served_node_facts.py::test_a_transitively_merged_node_lands_on_the_terminal_survivor PASSED
tests/test_tw44a_served_node_facts.py::test_a_merge_link_pointing_at_nothing_is_still_an_honest_absence PASSED
tests/test_tw44a_served_node_facts.py::test_the_node_read_never_creates_a_node PASSED
tests/test_tw44a_served_node_facts.py::test_the_node_read_never_commits PASSED
tests/test_tw44a_served_node_facts.py::test_the_handler_touches_no_mint_path PASSED
tests/test_tw44a_served_node_facts.py::test_no_credential_on_the_node_read_is_401 PASSED
tests/test_tw44a_served_node_facts.py::test_a_wrong_service_credential_on_the_node_read_is_401 PASSED
tests/test_tw44a_served_node_facts.py::test_a_wrong_credential_is_401_even_with_the_dev_bypass_active PASSED
tests/test_tw44a_served_node_facts.py::test_the_minting_routes_are_still_operator_only_prod PASSED
tests/test_tw44a_served_node_facts.py::test_the_minting_routes_are_still_operator_only_in_dev_mode PASSED
tests/test_tw44a_served_node_facts.py::test_the_admin_console_is_still_operator_only PASSED
tests/test_tw44a_served_node_facts.py::test_the_admin_router_still_carries_its_blanket_operator_dependency PASSED
tests/test_tw44a_served_node_facts.py::test_the_securities_gate_map_is_exactly_four_served_and_three_operator PASSED
tests/test_tw44a_served_node_facts.py::test_the_new_route_is_declared_above_the_mint_banner PASSED
tests/test_tw44a_served_node_facts.py::test_the_served_module_does_not_import_the_operator_gated_admin_router PASSED
tests/test_tw44a_served_node_facts.py::test_the_response_reuses_the_admin_vocabulary_for_the_same_facts PASSED
tests/test_tw44a_served_node_facts.py::test_created_at_is_the_only_node_summary_field_withheld PASSED
tests/test_tw44a_served_node_facts.py::test_the_response_carries_no_operator_only_surface PASSED
tests/test_tw44a_served_node_facts.py::test_the_miss_and_the_hit_have_the_same_keys PASSED
============================= 60 passed in 23.01s =============================
```

The trust-boundary control and the two neighbouring auth suites, run together to show the structural
walkers stayed green without an allowlist entry:

```
$ python -m pytest tests/test_issuer_link_trust.py tests/test_tw44a_served_node_facts.py \
      tests/test_tw25_resolver_served_capability.py tests/test_service_caller_auth.py -q
112 passed in 50.76s
```

Both new controls proved non-vacuous by mutation, reverted immediately after each run.

Mutation 1, `TRUSTED_MATCH_METHODS` widened to `ISSUER_MATCH_METHODS`:

```
FAILED tests/test_tw44c_served_issuer_link.py::test_the_trusted_match_method_set_is_still_exactly_cik_exact
FAILED tests/test_tw44c_served_issuer_link.py::test_an_untrusted_link_serves_no_issuer_and_states_the_reason[name-fuzzy-name-fuzzy \u2014 the defect itself]
FAILED tests/test_tw44c_served_issuer_link.py::test_an_untrusted_link_serves_no_issuer_and_states_the_reason[lei-exact-lei-exact \u2014 labelled, still not trusted]
FAILED tests/test_tw44c_served_issuer_link.py::test_a_trusted_link_is_served_while_three_untrusted_ones_are_withheld
4 failed, 28 passed in 16.66s
```

Mutation 2, `exclude_retired_securities=True` flipped to `False`:

```
>       assert body["issuer_available"] is False
E       assert True is False

tests\test_tw44c_served_issuer_link.py:542: AssertionError
FAILED tests/test_tw44c_served_issuer_link.py::test_the_tw35_retired_node_narrowing_is_honoured_not_reinvented
1 failed, 31 passed in 23.28s
```

`git diff --stat app/securities/issuer_links.py` was empty after each revert, so neither mutation is in
the commit. No production file outside `app/securities/router.py` is modified in this branch.

## Test-set change I made deliberately

`tests/test_tw44a_served_node_facts.py::test_the_response_carries_no_operator_only_surface` asserts the
served envelope's EXACT key set. The four new keys had to be named there. I updated it rather than
loosening it to a subset check, because that assertion is precisely what stops the served envelope
growing by accident, and a comment now records why the four are there and that nothing operator-only came
with them.

`tests/test_tw25_resolver_served_capability.py` asserts the served ROUTE SET, not the response shape. This
change adds no route and moves none, so it is unaffected and I did not touch it. Its assertion is
re-stated independently in the new file as `test_the_gate_map_is_unchanged_four_served_three_operator`.

## Confirmations

Nothing was deployed. No docker, gcloud, ssh, scp, or deploy script was run. The `empressa-bot` GCE VM
was not touched and its paper-trading soak and A/B experiment were not disturbed.

`main` was not pushed to. The PR is open and NOT merged.

No route changed gates. No route was added or removed. The gate map is still four served
(`/lookup`, `/canonical/{node_id}`, `/current-symbol/{node_id}`, `/node/{node_id}`) and three operator
(`/resolve`, `/resolve-option`, `/resolve-issuer`), asserted route by route. `require_operator` is
unchanged, the admin router keeps its blanket operator dependency, and no field was added to any admin
response.

The route still cannot mint and still cannot commit — proved by row counts on BOTH `nodes` and `edges`
across the new issuer branches, by a commit trap armed on `AsyncSession` over the three-hop issuer merge
chain that actually triggers path compression, and by the source-level guard on the handler body.

An untrusted link can never surface as a served `issuer_node_id`. The route's only path to an issuer id
is `trusted_issuer_node_id`, every branch in the handler can only WITHHOLD, and the negative tests assert
the untrusted issuer's id, name and LEI are absent from the entire response body.

## What I could not do

I could not verify the Smart Markets contract text at source. `packages/contract/src/twin.ts` lives in the
smart-markets repo, which is not checked out on this machine and which I did not clone. The contract
requirements quoted in the code, the tests and the PR (`issuerNodeId` required on operating-company and
fund nodes, forbidden on contract nodes; the `iss_` ULID id shape) are taken from the dispatch, which
states they were verified at source by the planner. The node-id regex is pinned in the test as a copy
against drift, not as an import, and a drift there is a contract question for the planner.

I could not measure anything against production. This worktree has no live database access and I ran
nothing against the deployment. Every count in this report and in the code comments is quoted from
`issuer_links.py`'s own docstring, which records the 2026-08-17 measurement; I did not re-measure the
8,334 legacy edges, the 1,323 issuer nodes, the single LEI row, or how many securities currently hold a
trusted `cik-exact` link. If a "how many equity twins can be built today" number is wanted, that is a
separate query against the live database and it is not in this PR.

CI on PR #341 is GREEN, judged on the conclusion string from the API rather than on an exit code:

```
$ gh api repos/empressaioemail-tech/empressa-trading/actions/runs/32156135324/jobs       --jq '.jobs[] | "\(.name) | \(.status) | \(.conclusion)"'
Python tests (cockpit backend) | completed | success
Frontend tests (cockpit vitest) | completed | success
Frontend build (cockpit web) | completed | success
Gitleaks security scan | completed | success
Windows .exe (release tags only) | completed | skipped
```

That is the authoritative signal. The merge is the operator's and I did not take it.
