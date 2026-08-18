---
title: TW-44a close — cockpit served node read
status: complete
last_updated: 2026-08-18
owner: planner-dispatched lane agent
repo: empressa-trading
row: TW-44 (Smart Markets, unregistered R&D — no PLAN-ROW by design, per operator CANON_OVERRIDE TW-44a)
canon: CANON-PREAMBLE v0f465c77 AGENT-CONTRACT v7b714e95
---

# TW-44a — GET /securities/node/{node_id}, the served descriptive read

## Branch and PR

Branch `tw44a/served-node-read`, cut from `origin/main` at `7520635b`.
Commit `0a432206`.
PR **340** — https://github.com/empressaioemail-tech/empressa-trading/pull/340
State OPEN, base `main`, MERGEABLE. **Not merged** — the planner merges after review.

All work was done in a dedicated worktree at
`P:/empressa-trading-worktrees/tw44a-served-node-read`. The shared clone at
`P:/Empressa Trading` was never checked out and stayed on `main`, clean, for the
whole run.

## The gap, confirmed at source before anything was written

Confirmed exactly as briefed; nothing in the dispatch was wrong.

`apps/cockpit/backend/app/securities/router.py` defined three service-callable
routes (`dependencies=[SERVED]`, where
`SERVED = Depends(get_user_or_service_caller)`): `/securities/lookup`,
`/securities/canonical/{node_id}`, `/securities/current-symbol/{node_id}`. None
returns a display name, an asset class, or identifiers. The descriptive facts
exist as `NodeSummary` in `apps/cockpit/backend/app/routers/admin_securities.py`
(line 90), whose router is declared

    router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_operator)])

and therefore refuses a service caller outright.

The `/canonical` echo trap is real and was read at source. `SecurityResolver.canonical`
(`app/securities/resolver.py` line 976) walks merge links and returns its input
unchanged when there is no link, without ever touching the node table. It is not
an existence check.

## Route signature

    @router.get("/node/{node_id}", response_model=ServedNodeFacts, dependencies=[SERVED])
    async def node_facts(
        node_id: str,
        db: AsyncSession = Depends(get_db),
        settings: Settings = Depends(get_settings),
    ) -> ServedNodeFacts:

Declared at `app/securities/router.py` line 235, above the
`# OPERATOR-ONLY — every route below can MINT` banner (line 322), with the other
served reads. `test_the_new_route_is_declared_above_the_mint_banner` pins the
placement so the file keeps teaching the right rule.

## Response models (defined in the securities router, not imported)

    class ServedIdentifier(BaseModel):
        identifier_type: str
        identifier_value: str
        node_id: str
        valid_from: str | None
        valid_to: str | None

    class ServedNode(BaseModel):
        node_id: str
        node_type: str
        asset_class: str | None
        current_symbol: str | None
        primary_venue: str | None
        status: str
        resolution_status: str
        lei: str | None
        name: str | None

    class ServedNodeFacts(BaseModel):
        available: bool
        reason: str | None = None
        node_id: str | None = None
        resolution_status: str
        requested_node_id: str
        canonical_node_id: str | None = None
        node: ServedNode | None = None
        identifiers: list[ServedIdentifier] = []
        identifiers_json: Any | None = None
        contract_json: Any | None = None

Defined in `app/securities/router.py`, deliberately NOT imported from
`app/routers/admin_securities.py`: a served path must not take a runtime
dependency on an operator-gated module. The field names and types are that
module's vocabulary on purpose, so the same facts are not described twice in two
dialects. Two tests enforce both halves —
`test_the_served_module_does_not_import_the_operator_gated_admin_router` and
`test_the_response_reuses_the_admin_vocabulary_for_the_same_facts` (every
`ServedNode` field must exist on `NodeSummary` with the same annotation).

## Fields included

`node_id` (canonicalized), `resolution_status`, `available`, `reason`,
`requested_node_id`, `canonical_node_id`; the `node` object with `node_type`,
`asset_class`, `current_symbol`, `primary_venue`, `status`, `resolution_status`,
`lei`, `name`; `identifiers` (identifier-index rows: scheme, value, node id,
`valid_from`, `valid_to`); `identifiers_json` (the node's own figi/cusip/isin
blob); `contract_json` (option right/strike/expiry/multiplier/occ_symbol).

## Fields deliberately excluded, and why

`created_at` — the ONLY `NodeSummary` field withheld. It is row bookkeeping
(when OUR row was written), not a fact about the instrument, so it stays on the
operator console. `test_created_at_is_the_only_node_summary_field_withheld`
asserts the set difference is exactly `["created_at"]`, so if a later edit adds
it the call gets made again rather than drifting in.

`edges_out` / `edges_in` (including edge `provenance`) and
`atom_counts_by_family`, both on `/admin/nodes/{id}` — graph internals and a
measure of how much we have stored about a node. Neither is needed to NAME a
node, and the atom counts in particular describe our operation rather than the
instrument.

The merge chain (`/admin/nodes/{id}/merge-chain`: `actor`, merge `reason`,
`knowledge_time`) — internal reconciliation vocabulary naming who merged what and
why. The caller gets the one fact it needs from it: `canonical_node_id`.

A `source` on each identifier was asked for "if the model carries them" —
`IdentifierIndex` has no `source` column (only `identifier_type`,
`identifier_value`, `node_id`, `valid_from`, `valid_to`), so no source is
reported rather than a guessed one. The as-of window is the validity pair.

## How a miss is represented

    HTTP 200
    {
      "available": false,
      "reason": "no node carries the id 'sec_00000000000000000000000000'",
      "node_id": null,
      "resolution_status": "not_found",
      "requested_node_id": "sec_00000000000000000000000000",
      "canonical_node_id": null,
      "node": null,
      "identifiers": [],
      "identifiers_json": null,
      "contract_json": null
    }

Same top-level `node_id` / `resolution_status` / `available` / `reason` keys
`/securities/lookup` returns for an unknown symbol, so one consumer branch
handles "we do not know this" on both routes. Never a 404 — `test_a_miss_is_never_a_404`
runs five shapes of unknown id (including a malformed one) and requires 200 with
`node_id: null` on every one. The miss and the hit carry identical keys
(`test_the_miss_and_the_hit_have_the_same_keys`), so a consumer parses one model
and branches on `available` rather than shape-sniffing.

`requested_node_id` restates the caller's input — an echo of an argument is not a
claim — and no field asserts the node exists.

A merge-link CYCLE is a broken graph, not an absence, so it returns 409 exactly
as the sibling served reads do rather than masquerading as `not_found`.

## The `/canonical` trap is not repeated

`test_the_unknown_id_is_not_the_canonical_echo` asserts the contrast on the SAME
id in one test: `/securities/canonical/sec_0…0` returns that id (the echo, still
true — the test says so as a precondition), and `/securities/node/sec_0…0`
returns `node_id: null, available: false`. The dangerous composition is covered
too: `test_a_merge_link_pointing_at_nothing_is_still_an_honest_absence` seeds a
merge link to an id carrying no node, so the merge walk succeeds and returns a
well-formed id — and the answer is still the not-found shape, never the survivor
id reported as though it were a node.

## Read only

The handler's only resolver call is `SecurityResolver.canonical`; everything else
is a `SELECT`. Pinned three independent ways rather than asserted in a comment:

1. `test_the_node_read_never_creates_a_node` — node-row count across calls with
   exactly the input that makes `/securities/resolve` mint.
2. `test_the_node_read_never_commits` — `AsyncSession.commit` monkeypatched to
   raise, then the route called against a known id, an unknown id, AND a
   three-hop merge chain (the one input that actually triggers `canonical()`'s
   path-compression flush). The guard is proven non-vacuous in the same test:
   with the patch still armed, the minting route DOES commit and raises.
3. `test_the_handler_touches_no_mint_path` — source-level, over the handler body
   with its docstring stripped: no `get_or_create_node`, `resolve_security`,
   `resolve_option`, `resolve_issuer`, `merge_nodes`, `session.add`, `db.add`,
   `commit(`, `delete(`, `update(`; and `r.canonical(` must still be present.

## The operator surface did not widen

`require_operator` untouched. No existing route moved between gates. No admin
response gained a field. Asserted:

- `test_the_minting_routes_are_still_operator_only_prod` and
  `..._in_dev_mode` — the three minting routes refuse a service caller under both
  auth modes (403 with `detail: "operator only"` under the dev bypass).
- `test_the_admin_console_is_still_operator_only` — eight `/admin` GETs and the
  two `/admin/resolver` POSTs all 403 for a service caller.
- `test_the_admin_router_still_carries_its_blanket_operator_dependency` —
  structural; the gate that makes `NodeSummary` operator-only is intact.
- `test_the_securities_gate_map_is_exactly_four_served_and_three_operator` —
  walks `app.routes` dependency graphs and requires each `/securities` route to
  carry exactly one of the two gates, with the new one on the served side.

## Files touched

    apps/cockpit/backend/app/securities/router.py                          +195
    apps/cockpit/backend/tests/test_tw44a_served_node_facts.py             +806 (new)
    apps/cockpit/backend/tests/test_tw25_resolver_served_capability.py       +6

Nothing else. The TW-25 edit is six lines: its structural test
`test_no_securities_route_is_ungated_and_the_blanket_is_gone` asserts the exact
`/securities` route SET, so a seventh route makes it fail on drift. The new route
was added to its `expected` map (as served) with a comment, so that assertion
keeps meaning "the split is complete" rather than "the split is whatever TW-25
shipped". No other assertion in that file was changed.

## Raw test output

Full cockpit backend suite, the CI command from `.github/workflows/ci.yml`
(`working-directory: apps/cockpit/backend`, `run: python -m pytest -q`):

    4664 passed, 2 skipped, 21 deselected, 38920 warnings in 735.40s (0:12:15)

    [exited with code 0]

Zero failures, matching the CI baseline and merge standard. The 2 skips and 21
deselections are pre-existing (`-m "not live_eval"` in `pytest.ini` deselects the
paid Anthropic evals).

Named run of the new module plus every adjacent securities/auth module
(`python -m pytest tests/test_tw44a_served_node_facts.py tests/test_tw25_resolver_served_capability.py tests/test_service_caller_auth.py tests/test_admin_securities.py tests/test_securities_resolver.py -v -p no:warnings`):

    tests/test_tw44a_served_node_facts.py::test_a_service_credential_is_served_on_the_node_read PASSED [  0%]
    tests/test_tw44a_served_node_facts.py::test_a_user_jwt_is_served_on_the_node_read PASSED [  1%]
    tests/test_tw44a_served_node_facts.py::test_the_node_read_returns_the_descriptive_facts PASSED [  2%]
    tests/test_tw44a_served_node_facts.py::test_an_option_node_carries_its_contract PASSED [  3%]
    tests/test_tw44a_served_node_facts.py::test_an_issuer_node_reads_the_same_way PASSED [  3%]
    tests/test_tw44a_served_node_facts.py::test_a_well_formed_unknown_node_id_is_an_honest_absence PASSED [  4%]
    tests/test_tw44a_served_node_facts.py::test_a_miss_is_never_a_404 PASSED [  5%]
    tests/test_tw44a_served_node_facts.py::test_the_unknown_id_is_not_the_canonical_echo PASSED [  6%]
    tests/test_tw44a_served_node_facts.py::test_a_merged_away_node_id_returns_the_terminal_survivors_facts PASSED [  6%]
    tests/test_tw44a_served_node_facts.py::test_a_transitively_merged_node_lands_on_the_terminal_survivor PASSED [  7%]
    tests/test_tw44a_served_node_facts.py::test_a_merge_link_pointing_at_nothing_is_still_an_honest_absence PASSED [  8%]
    tests/test_tw44a_served_node_facts.py::test_the_node_read_never_creates_a_node PASSED [  9%]
    tests/test_tw44a_served_node_facts.py::test_the_node_read_never_commits PASSED [  9%]
    tests/test_tw44a_served_node_facts.py::test_the_handler_touches_no_mint_path PASSED [ 10%]
    tests/test_tw44a_served_node_facts.py::test_no_credential_on_the_node_read_is_401 PASSED [ 11%]
    tests/test_tw44a_served_node_facts.py::test_a_wrong_service_credential_on_the_node_read_is_401 PASSED [ 12%]
    tests/test_tw44a_served_node_facts.py::test_a_wrong_credential_is_401_even_with_the_dev_bypass_active PASSED [ 12%]
    tests/test_tw44a_served_node_facts.py::test_the_minting_routes_are_still_operator_only_prod PASSED [ 13%]
    tests/test_tw44a_served_node_facts.py::test_the_minting_routes_are_still_operator_only_in_dev_mode PASSED [ 14%]
    tests/test_tw44a_served_node_facts.py::test_the_admin_console_is_still_operator_only PASSED [ 15%]
    tests/test_tw44a_served_node_facts.py::test_the_admin_router_still_carries_its_blanket_operator_dependency PASSED [ 16%]
    tests/test_tw44a_served_node_facts.py::test_the_securities_gate_map_is_exactly_four_served_and_three_operator PASSED [ 16%]
    tests/test_tw44a_served_node_facts.py::test_the_new_route_is_declared_above_the_mint_banner PASSED [ 17%]
    tests/test_tw44a_served_node_facts.py::test_the_served_module_does_not_import_the_operator_gated_admin_router PASSED [ 18%]
    tests/test_tw44a_served_node_facts.py::test_the_response_reuses_the_admin_vocabulary_for_the_same_facts PASSED [ 19%]
    tests/test_tw44a_served_node_facts.py::test_created_at_is_the_only_node_summary_field_withheld PASSED [ 19%]
    tests/test_tw44a_served_node_facts.py::test_the_response_carries_no_operator_only_surface PASSED [ 20%]
    tests/test_tw44a_served_node_facts.py::test_the_miss_and_the_hit_have_the_same_keys PASSED [ 21%]
    tests/test_tw25_resolver_served_capability.py::test_service_credential_is_served_on_every_resolution_read PASSED [ 22%]
    tests/test_tw25_resolver_served_capability.py::test_service_caller_resolves_a_ticker_to_a_node_id PASSED [ 22%]
    tests/test_tw25_resolver_served_capability.py::test_lookup_miss_is_an_honest_absence_not_an_error PASSED [ 23%]
    tests/test_tw25_resolver_served_capability.py::test_service_credential_never_reaches_a_minting_route_prod PASSED [ 24%]
    tests/test_tw25_resolver_served_capability.py::test_service_credential_never_reaches_a_minting_route_in_dev_mode PASSED [ 25%]
    tests/test_tw25_resolver_served_capability.py::test_service_credential_never_reaches_the_admin_resolver_ops_routes PASSED [ 25%]
    tests/test_tw25_resolver_served_capability.py::test_lookup_never_writes_a_node PASSED [ 26%]
    tests/test_tw25_resolver_served_capability.py::test_no_served_route_commits_anything PASSED [ 27%]
    tests/test_tw25_resolver_served_capability.py::test_the_operator_route_still_mints PASSED [ 28%]
    tests/test_tw25_resolver_served_capability.py::test_no_credential_on_a_resolution_read_is_401 PASSED [ 29%]
    tests/test_tw25_resolver_served_capability.py::test_a_wrong_service_credential_on_a_resolution_read_is_401 PASSED [ 29%]
    tests/test_tw25_resolver_served_capability.py::test_a_wrong_service_credential_is_401_even_with_the_dev_bypass_active PASSED [ 30%]
    tests/test_tw25_resolver_served_capability.py::test_user_jwt_is_served_on_every_resolution_read PASSED [ 31%]
    tests/test_tw25_resolver_served_capability.py::test_dev_bypass_user_is_unchanged_on_every_securities_route PASSED [ 32%]
    tests/test_tw25_resolver_served_capability.py::test_a_non_operator_user_is_still_refused_the_minting_routes PASSED [ 32%]
    tests/test_tw25_resolver_served_capability.py::test_operator_reaches_every_route_unchanged PASSED [ 33%]
    tests/test_tw25_resolver_served_capability.py::test_an_operator_presenting_a_service_key_is_still_refused_the_writes PASSED [ 34%]
    tests/test_tw25_resolver_served_capability.py::test_no_securities_route_is_ungated_and_the_blanket_is_gone PASSED [ 35%]
    tests/test_tw25_resolver_served_capability.py::test_the_router_carries_no_blanket_dependency PASSED [ 35%]
    tests/test_tw25_resolver_served_capability.py::test_main_does_not_re_gate_the_securities_router PASSED [ 36%]
    tests/test_tw25_resolver_served_capability.py::test_minted_node_ids_match_the_smart_markets_contract[security-sec_] PASSED [ 37%]
    tests/test_tw25_resolver_served_capability.py::test_minted_node_ids_match_the_smart_markets_contract[issuer-iss_] PASSED [ 38%]
    tests/test_tw25_resolver_served_capability.py::test_minted_node_ids_match_the_smart_markets_contract[option-opt_] PASSED [ 38%]
    tests/test_tw25_resolver_served_capability.py::test_minted_node_ids_match_the_contract_at_timestamp_extremes[0] PASSED [ 39%]
    tests/test_tw25_resolver_served_capability.py::test_minted_node_ids_match_the_contract_at_timestamp_extremes[1] PASSED [ 40%]
    tests/test_tw25_resolver_served_capability.py::test_minted_node_ids_match_the_contract_at_timestamp_extremes[1755000000000] PASSED [ 41%]
    tests/test_tw25_resolver_served_capability.py::test_minted_node_ids_match_the_contract_at_timestamp_extremes[281474976710655] PASSED [ 41%]
    tests/test_tw25_resolver_served_capability.py::test_the_ulid_alphabet_is_exactly_crockford_base32 PASSED [ 42%]
    tests/test_tw25_resolver_served_capability.py::test_a_provisionally_minted_node_id_matches_the_contract PASSED [ 43%]
    tests/test_tw25_resolver_served_capability.py::test_the_service_principal_is_not_an_operator_identity PASSED [ 44%]
    tests/test_service_caller_auth.py::test_no_credential_and_no_jwt_is_401 PASSED [ 45%]
    tests/test_service_caller_auth.py::test_combined_gate_stays_closed_when_service_auth_is_unconfigured PASSED [ 45%]
    tests/test_service_caller_auth.py::test_malformed_credential_is_401[] PASSED [ 46%]
    tests/test_service_caller_auth.py::test_malformed_credential_is_401[   ] PASSED [ 47%]
    tests/test_service_caller_auth.py::test_malformed_credential_is_401[Bearer tw24-test-service-secret] PASSED [ 48%]
    tests/test_service_caller_auth.py::test_malformed_credential_is_401[{}] PASSED [ 48%]
    tests/test_service_caller_auth.py::test_malformed_credential_does_not_fall_through_to_the_dev_identity PASSED [ 49%]
    tests/test_service_caller_auth.py::test_dependency_raises_401_on_malformed_credential_in_dev_mode PASSED [ 50%]
    tests/test_service_caller_auth.py::test_wrong_credential_is_401 PASSED   [ 51%]
    tests/test_service_caller_auth.py::test_wrong_credential_is_401_even_with_the_dev_bypass_active PASSED [ 51%]
    tests/test_service_caller_auth.py::test_a_prefix_of_the_secret_is_rejected PASSED [ 52%]
    tests/test_service_caller_auth.py::test_service_credential_never_reaches_an_operator_route_prod PASSED [ 53%]
    tests/test_service_caller_auth.py::test_service_credential_never_reaches_an_operator_route_in_dev_mode PASSED [ 54%]
    tests/test_service_caller_auth.py::test_service_identity_is_refused_by_the_operator_allowlist PASSED [ 54%]
    tests/test_service_caller_auth.py::test_service_namespace_is_reserved_from_the_dev_bypass PASSED [ 55%]
    tests/test_service_caller_auth.py::test_service_namespace_is_reserved_from_a_clerk_sub PASSED [ 56%]
    tests/test_service_caller_auth.py::test_user_jwt_still_works_on_every_touched_router PASSED [ 57%]
    tests/test_service_caller_auth.py::test_user_jwt_resolves_to_the_user_not_the_service_principal PASSED [ 58%]
    tests/test_service_caller_auth.py::test_dev_bypass_user_still_works_on_every_touched_router PASSED [ 58%]
    tests/test_service_caller_auth.py::test_position_context_stays_user_only PASSED [ 59%]
    tests/test_service_caller_auth.py::test_valid_service_credential_passes_every_guarded_route PASSED [ 60%]
    tests/test_service_caller_auth.py::test_service_caller_reaches_atom_serve_as_a_non_owner PASSED [ 61%]
    tests/test_service_caller_auth.py::test_service_only_dependency_is_service_or_nothing PASSED [ 61%]
    tests/test_service_caller_auth.py::test_service_path_is_closed_when_the_secret_is_unset PASSED [ 62%]
    tests/test_service_caller_auth.py::test_service_secret_has_no_committed_default PASSED [ 63%]
    tests/test_service_caller_auth.py::test_anchor_verify_is_public PASSED   [ 64%]
    tests/test_service_caller_auth.py::test_anchor_verify_carries_no_auth_dependency PASSED [ 64%]
    tests/test_service_caller_auth.py::test_the_atom_serve_sibling_is_still_gated PASSED [ 65%]
    tests/test_admin_securities.py::test_nodes_empty PASSED                  [ 66%]
    tests/test_admin_securities.py::test_nodes_seeded_and_filters PASSED     [ 67%]
    tests/test_admin_securities.py::test_nodes_limit_validated PASSED        [ 67%]
    tests/test_admin_securities.py::test_node_detail_missing_is_honest_empty PASSED [ 68%]
    tests/test_admin_securities.py::test_node_detail_seeded PASSED           [ 69%]
    tests/test_admin_securities.py::test_node_detail_resolves_loser_to_survivor PASSED [ 70%]
    tests/test_admin_securities.py::test_issuer_link_trust_split_empty PASSED [ 70%]
    tests/test_admin_securities.py::test_issuer_link_trust_split_counts_the_legacy_cohort PASSED [ 71%]
    tests/test_admin_securities.py::test_node_atoms_empty PASSED             [ 72%]
    tests/test_admin_securities.py::test_node_atoms_seeded_and_family_filter PASSED [ 73%]
    tests/test_admin_securities.py::test_merge_chain_empty PASSED            [ 74%]
    tests/test_admin_securities.py::test_merge_chain_seeded PASSED           [ 74%]
    tests/test_admin_securities.py::test_resolver_queues_empty PASSED        [ 75%]
    tests/test_admin_securities.py::test_resolver_queues_seeded PASSED       [ 76%]
    tests/test_admin_securities.py::test_resolver_identifiers_empty PASSED   [ 77%]
    tests/test_admin_securities.py::test_resolver_identifiers_seeded PASSED  [ 77%]
    tests/test_admin_securities.py::test_corp_actions_empty PASSED           [ 78%]
    tests/test_admin_securities.py::test_corp_actions_seeded PASSED          [ 79%]
    tests/test_admin_securities.py::test_merge_appends_action_atom_and_does_not_mutate PASSED [ 80%]
    tests/test_admin_securities.py::test_merge_self_is_honest_error PASSED   [ 80%]
    tests/test_admin_securities.py::test_merge_already_merged_is_guarded PASSED [ 81%]
    tests/test_admin_securities.py::test_non_operator_forbidden PASSED       [ 82%]
    tests/test_admin_securities.py::test_operator_allowed PASSED             [ 83%]
    tests/test_admin_securities.py::test_empty_allowlist_fails_closed PASSED [ 83%]
    tests/test_securities_resolver.py::test_ulid_is_time_sortable PASSED     [ 84%]
    tests/test_securities_resolver.py::test_fb_and_meta_resolve_to_same_node PASSED [ 85%]
    tests/test_securities_resolver.py::test_delisted_symbol_reuse_mints_new_node PASSED [ 86%]
    tests/test_securities_resolver.py::test_mint_same_security_twice_is_one_node PASSED [ 87%]
    tests/test_securities_resolver.py::test_concurrent_provisional_mints_converge_to_one_node PASSED [ 87%]
    tests/test_securities_resolver.py::test_concurrent_figi_mints_converge_to_one_node PASSED [ 88%]
    tests/test_securities_resolver.py::test_split_event_atom_and_factor_recorded PASSED [ 89%]
    tests/test_securities_resolver.py::test_merge_link_loser_resolves_to_survivor_zero_rewrites PASSED [ 90%]
    tests/test_securities_resolver.py::test_chained_merge_resolves_to_terminal_survivor PASSED [ 90%]
    tests/test_securities_resolver.py::test_merge_cycle_errors PASSED        [ 91%]
    tests/test_securities_resolver.py::test_ambiguous_symbol_deterministic_across_runs PASSED [ 92%]
    tests/test_securities_resolver.py::test_resolve_option_parses_occ_and_links_underlying PASSED [ 93%]
    tests/test_securities_resolver.py::test_resolve_option_from_tuple PASSED [ 93%]
    tests/test_securities_resolver.py::test_resolve_issuer_lei_then_name_fuzzy PASSED [ 94%]
    tests/test_securities_resolver.py::test_provisional_resolution_with_no_external_keys PASSED [ 95%]
    tests/test_securities_resolver.py::test_late_recorded_bounded_alias_is_invisible_to_earlier_asof PASSED [ 96%]
    tests/test_securities_resolver.py::test_node_minted_now_is_invisible_before_it_existed PASSED [ 96%]
    tests/test_securities_resolver.py::test_current_symbol_follows_ticker_change PASSED [ 97%]
    tests/test_securities_resolver.py::test_duplicate_provisional_nodes_resolve_without_error PASSED [ 98%]
    tests/test_securities_resolver.py::test_dedup_provisional_nodes_merges_null_venue_dupes PASSED [ 99%]
    tests/test_securities_resolver.py::test_null_venue_provisional_resolve_is_idempotent PASSED [100%]

    ============================ 131 passed in 40.38s =============================

## Confirmations

Nothing was deployed. No docker, no gcloud, no ssh, no scp, no deploy script,
nothing touching the `empressa-bot` VM. The live paper-trading soak and its A/B
arms were not disturbed.

`main` was not pushed to. `origin/main` is still `7520635b`, the commit the
worktree was cut from.

No route changed gates. `require_operator` was not modified, no existing route
moved between gates, no admin response gained a field. The change is one
additive served route plus its models.

The route cannot mint. Its only resolver call is `canonical()`; the rest is
`SELECT`. Enforced by a row count, a commit trap (proven non-vacuous), and a
source-level check.

PR 340 is OPEN and was NOT merged.

## Things I could not do, stated plainly

Nothing in the assignment was blocked. Three notes the planner should have
anyway, none of which changed the build:

1. **Identifier rows are read on the canonical id only.** If identifier-index
   rows are still attached to a merged-away LOSER node, they will not appear in
   the response. This is exactly what `/admin/nodes/{id}` does today, so the two
   surfaces agree; whether the merge path should re-point identifier rows is a
   substrate question, not a question about this route, and I did not change
   resolver behaviour to paper over it.
2. **`identifiers_json` can carry a CUSIP,** which is licensed reference data.
   The service credential is an inbound credential for our own services (Smart
   Markets), not a third-party API key, and the field is already on the admin
   surface, so I included it — but if the union layer ever fronts an external
   consumer, that is a licensing call for the operator, not an auth one.
3. **`canonical()` flushes** on path compression (three or more hops). That is
   pre-existing and shared with `/securities/canonical`; nothing on the served
   request path commits, and `test_the_node_read_never_commits` now pins that
   for the new route against a three-hop chain specifically.

Housekeeping the planner owns after merge: remove the worktree with
`git worktree remove P:/empressa-trading-worktrees/tw44a-served-node-read`.
