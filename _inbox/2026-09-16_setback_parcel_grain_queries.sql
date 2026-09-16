-- 2026-09-16 texas scale-up scope: parcel-grain setback queries, run read-only against the factory store.
-- Q1: per city, one county at a time (psql -v fips=<county>).
-- One county at a time, primary-key range scan, one pass. Pass :fips as a psql variable.
-- Parcel-grain counts from the ledger, independent of the P-225 census (which counts
-- zoning-layer features). Read-only.
\pset footer off
set statement_timeout = '240s';
with p as (
  select place_key,
         max(cell_state->>'value') filter (where rail_key = 'zoningJurisdictionKey' and cell_state->>'kind' = 'value') as city,
         max(cell_state->>'value') filter (where rail_key = 'zoningDistrict' and cell_state->>'kind' = 'value')        as district,
         max(cell_state->>'kind')  filter (where rail_key = 'zoningDistrict')                                           as zd_kind,
         max(cell_state->>'kind')  filter (where rail_key = 'setbackFrontFt')                                          as sb_kind
  from parcel_record_cell
  where place_key >= :'fips' || ':' and place_key < :'fips' || ';'
    and rail_key in ('zoningJurisdictionKey', 'zoningDistrict', 'setbackFrontFt')
  group by place_key
)
select coalesce(city, '(no city: ' || coalesce(zd_kind, 'none') || ')') as city,
       count(*)                                               as parcels,
       count(distinct district)                               as districts,
       count(*) filter (where sb_kind = 'value')              as sb_value,
       count(*) filter (where sb_kind = 'refused')            as sb_refused,
       count(*) filter (where sb_kind = 'unaccounted')        as sb_unacc,
       count(*) filter (where sb_kind = 'absent-verified')    as sb_absent_ver,
       count(*) filter (where sb_kind = 'not-applicable')     as sb_na
from p
group by 1
order by 2 desc;

-- Q2: all six counties, false setback absences by recorded reason.
select split_part(place_key,':',1) as county, case when cell_state->'basis'->>'method' like 'setback-table-router%' then 'district-miss:'||(cell_state->'basis'->>'finding') else 'no-table:'||replace(cell_state->'basis'->>'finding','no ruled setback table exists for ','') end as reason, count(*) as n from parcel_record_cell where rail_key='setbackFrontFt' and cell_state->>'kind'='absent-verified' group by 1,2 order by 1, 3 desc;

-- Q3: rail verdicts per county.
-- Six-county rail picture, read-only. Latest verdict per (county, rail).
-- Falsifier: if any county outside the six (plus the known Dallas stub) appears,
-- or a six-county row count differs from 65, the premise of this scope is wrong.
\pset footer off
with latest as (
  select distinct on (county_fips, rail_key)
         county_fips, rail_key, verdict, unaccounted_count, evaluated_at
  from parcel_gate_verdict
  order by county_fips, rail_key, evaluated_at desc
)
select county_fips,
       count(*)                                        as rails,
       count(*) filter (where verdict = 'pass')        as pass,
       count(*) filter (where verdict = 'excluded')    as excluded,
       count(*) filter (where verdict not in ('pass','excluded')) as other,
       string_agg(distinct verdict, ',')               as verdicts,
       max(evaluated_at)::date                         as last_eval
from latest
group by county_fips
order by county_fips;

-- The rails this scope cares about, per county.
with latest as (
  select distinct on (county_fips, rail_key)
         county_fips, rail_key, verdict, unaccounted_count
  from parcel_gate_verdict
  order by county_fips, rail_key, evaluated_at desc
)
select rail_key,
       string_agg(county_fips || '=' || left(verdict, 4)
                  || coalesce('(' || unaccounted_count || ')', ''), ' ' order by county_fips) as by_county
from latest
where county_fips in ('48021','48055','48209','48309','48453','48491')
  and rail_key in ('roads','edgeSignal','parcelGeometry','setbackFrontFt','setbackSideFt',
                   'setbackRearFt','setbackCornerFt','setbackRules','zoningDistrict',
                   'buildableAreaSqFt','envelopeStatus','maxHeightFt','maxLotCoveragePct',
                   'maxFootprintSqFt','parcelAreaSqFt','agValuation','citationUrl')
group by rail_key
order by rail_key;
