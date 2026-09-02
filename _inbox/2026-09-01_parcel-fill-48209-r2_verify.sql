-- Post-fill verify for Hays. Factory store. Absolute vs landing 116420.
-- Split leftover (cell count != 65) from landing-matched 65-rail rows.
SET statement_timeout = '30s';
SET application_name = 'parcel-fill-48209-r2-verify';

SELECT current_database() AS db, now() AS measured_at;

SELECT count(*)::bigint AS records,
       count(*) FILTER (WHERE incorporated IS TRUE)::bigint AS in_city,
       count(*) FILTER (WHERE incorporated IS FALSE)::bigint AS unincorporated,
       count(*) FILTER (WHERE incorporated IS NULL)::bigint AS unresolved
  FROM parcel_record
 WHERE county_fips = '48209';

SELECT n_cells, count(*)::bigint AS parcels
  FROM (
    SELECT r.place_key, count(*)::int AS n_cells
      FROM parcel_record r
      JOIN parcel_record_cell c ON c.place_key = r.place_key
     WHERE r.county_fips = '48209'
     GROUP BY r.place_key
  ) t
 GROUP BY n_cells
 ORDER BY n_cells;

SELECT count(*)::bigint AS cells,
       count(*) FILTER (WHERE c.cell_state->>'kind' = 'value')::bigint AS kind_value,
       count(*) FILTER (WHERE c.cell_state->>'kind' = 'unaccounted')::bigint AS kind_unaccounted,
       count(*) FILTER (WHERE c.cell_state->>'kind' = 'not-applicable')::bigint AS kind_na,
       count(*) FILTER (WHERE c.cell_state->>'kind' = 'absent-verified')::bigint AS kind_absent
  FROM parcel_record_cell c
  JOIN parcel_record r ON r.place_key = c.place_key
 WHERE r.county_fips = '48209';

SELECT count(*)::bigint AS na_on_in_city
  FROM parcel_record_cell c
  JOIN parcel_record r ON r.place_key = c.place_key
 WHERE r.county_fips = '48209'
   AND r.incorporated IS TRUE
   AND c.cell_state->>'kind' = 'not-applicable';

SELECT c.rail_key, count(*)::bigint AS n
  FROM parcel_record_cell c
  JOIN parcel_record r ON r.place_key = c.place_key
 WHERE r.county_fips = '48209'
   AND r.incorporated IS FALSE
   AND c.cell_state->>'kind' = 'not-applicable'
 GROUP BY c.rail_key
 ORDER BY c.rail_key;

SELECT count(*)::bigint AS store_improvement_zero
  FROM parcel_record_cell c
  JOIN parcel_record r ON r.place_key = c.place_key
 WHERE r.county_fips = '48209'
   AND c.rail_key = 'improvementValue'
   AND c.cell_state->>'kind' = 'value'
   AND c.cell_state->>'value' IN ('0', '0.0');

SELECT count(*)::bigint AS store_living_gt0
  FROM parcel_record_cell c
  JOIN parcel_record r ON r.place_key = c.place_key
 WHERE r.county_fips = '48209'
   AND c.rail_key = 'livingAreaSqft'
   AND c.cell_state->>'kind' = 'value';

SELECT r.place_key, r.incorporated, r.instantiated_at
  FROM parcel_record r
  JOIN (
    SELECT place_key, count(*)::int AS n_cells
      FROM parcel_record_cell
     GROUP BY place_key
  ) c ON c.place_key = r.place_key
 WHERE r.county_fips = '48209'
   AND c.n_cells <> 65
 ORDER BY r.place_key;
