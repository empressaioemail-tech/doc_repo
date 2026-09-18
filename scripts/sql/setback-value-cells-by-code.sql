-- Setback front-rail VALUE cells grouped by corpus source, table and district code, for one county
-- (psql -v fips=48209). Read-only. Input to scripts/setback-stale-match.mjs (2026-09-18).
set default_transaction_read_only = on;
set statement_timeout = '240s';
select :'fips' as county,
       cell_state->>'source' as source,
       cell_state->>'resolvedTableKey' as table_key,
       cell_state->>'districtCode' as district_code,
       count(*) as cells
from parcel_record_cell
where place_key >= :'fips' || ':' and place_key < :'fips' || ';'
  and rail_key = 'setbackFrontFt' and cell_state->>'kind' = 'value'
group by 1, 2, 3, 4
order by cells desc;
