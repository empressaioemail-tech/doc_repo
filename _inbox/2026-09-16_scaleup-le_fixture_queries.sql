\pset footer off
set statement_timeout = '280s';
with p as (
  select place_key,
    max(cell_state->>'value') filter (where rail_key='zoningJurisdictionKey' and cell_state->>'kind'='value') as city,
    max(cell_state->>'value') filter (where rail_key='zoningDistrict' and cell_state->>'kind'='value') as district,
    max(cell_state->>'kind') filter (where rail_key='zoningDistrict') as zd_kind,
    max(cell_state->>'kind') filter (where rail_key='setbackFrontFt') as sb_kind,
    max(cell_state->'basis'->>'method') filter (where rail_key='setbackFrontFt') as sb_method,
    max(cell_state->>'kind') filter (where rail_key='landUseCode') as lu_kind,
    max(cell_state->>'value') filter (where rail_key='landUseCode' and cell_state->>'kind'='value') as land_use,
    max(cell_state->>'kind') filter (where rail_key='yearBuilt') as yb_kind,
    max(cell_state->>'value') filter (where rail_key='situsAddress' and cell_state->>'kind'='value') as situs
  from parcel_record_cell
  where place_key >= :'fips' || ':' and place_key < :'fips' || ';'
    and rail_key in ('zoningJurisdictionKey','zoningDistrict','setbackFrontFt','landUseCode','yearBuilt','situsAddress')
  group by place_key
),
b as (
  select *, coalesce(city, '(no city: ' || coalesce(zd_kind,'none') || ')') as bucket,
    coalesce(sb_method like 'setback-table-router%', false) as is_district_miss,
    coalesce(district ~* '(^|[^A-Za-z])(PUD|PDD|PD|PC)([^A-Za-z]|$)', false) as is_pud,
    coalesce(land_use ilike '%vacant%', false) or yb_kind is distinct from 'value' as is_vacant,
    md5(place_key) as h
  from p
)
select bucket,
  count(*) as n,
  (array_agg(place_key order by h) filter (where sb_kind='value'))[1] as fx_codified,
  (array_agg(place_key order by h) filter (where sb_kind='absent-verified' and is_district_miss))[1] as fx_district_miss,
  (array_agg(place_key order by h) filter (where sb_kind='absent-verified' and not is_district_miss))[1] as fx_no_table,
  (array_agg(place_key order by h) filter (where is_pud))[1] as fx_pud,
  (array_agg(district order by h) filter (where is_pud))[1] as pud_district,
  (array_agg(place_key order by h) filter (where is_vacant and sb_kind='value'))[1] as fx_vacant
from b
group by bucket
order by n desc;
-- Run per county: psql "$FACTORY_DATABASE_URL_RO" -v fips=48021 -f this-file.sql  (repeat for 48055, 48209, 48309, 48453, 48491)
