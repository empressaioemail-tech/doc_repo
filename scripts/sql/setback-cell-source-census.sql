-- Setback front-rail cells by kind, corpus source and resolved table, for one county (psql -v fips=48209).
-- Read-only. Used by the integration seat to measure what a setback-writer apply could move before it runs
-- (P-258 re-run, 2026-09-18). Control row: 48209:97658 must appear in the San Marcos value bucket.
set default_transaction_read_only = on;
set statement_timeout = '240s';
select cell_state->>'kind' as kind,
       coalesce(cell_state->>'source', '(none)') as source,
       coalesce(cell_state->>'resolvedTableKey', '(none)') as table_key,
       coalesce(substring(cell_state->'basis'->>'method' from '^[a-z-]+'), '(none)') as method_prefix,
       left(coalesce(cell_state->'basis'->>'finding', ''), 40) as finding_prefix,
       count(*) as cells,
       bool_or(place_key = :'fips' || ':97658') as has_control
from parcel_record_cell
where place_key >= :'fips' || ':' and place_key < :'fips' || ';'
  and rail_key = 'setbackFrontFt'
group by 1, 2, 3, 4, 5
order by cells desc;
