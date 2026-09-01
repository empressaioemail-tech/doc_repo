-- Factory store only. Absolute leftover count for Hays. Not a fill size.
SET statement_timeout = '15s';
SET application_name = 'parcel-fill-48209-factory-baseline';

SELECT current_database() AS db, now() AS measured_at;

SELECT county_fips, count(*)::bigint AS records
  FROM parcel_record
 WHERE county_fips = '48209'
 GROUP BY county_fips;

SELECT count(*)::bigint AS cells,
       count(*) FILTER (WHERE cell_state->>'kind' = 'value')::bigint AS kind_value,
       count(*) FILTER (WHERE cell_state->>'kind' = 'unaccounted')::bigint AS kind_unaccounted,
       count(*) FILTER (WHERE cell_state->>'kind' = 'not-applicable')::bigint AS kind_na,
       count(*) FILTER (WHERE cell_state->>'kind' = 'absent-verified')::bigint AS kind_absent
  FROM parcel_record_cell c
  JOIN parcel_record r ON r.place_key = c.place_key
 WHERE r.county_fips = '48209';
