-- Per-rail kind counts for landing-matched 65-rail Hays rows.
SET statement_timeout = '30s';
SET application_name = 'parcel-fill-48209-r2-rails';

SELECT c.rail_key,
       count(*) FILTER (WHERE c.cell_state->>'kind' = 'value')::bigint AS value,
       count(*) FILTER (WHERE c.cell_state->>'kind' = 'unaccounted')::bigint AS unaccounted,
       count(*) FILTER (WHERE c.cell_state->>'kind' = 'not-applicable')::bigint AS not_applicable,
       count(*) FILTER (WHERE c.cell_state->>'kind' = 'absent-verified')::bigint AS absent_verified
  FROM parcel_record_cell c
  JOIN parcel_record r ON r.place_key = c.place_key
 WHERE r.county_fips = '48209'
 GROUP BY c.rail_key
 ORDER BY c.rail_key;
