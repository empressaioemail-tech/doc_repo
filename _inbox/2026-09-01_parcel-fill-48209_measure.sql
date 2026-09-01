-- PARCEL-FILL-48209 independent Hays baseline.
-- Reads PRODUCTION_NEONDB_URL / neondb only. Never Factory. Never roll atoms.
-- Never DISTINCT ON a whole county. Never place_layer_snapshots.
-- statement_timeout is the bound. A timeout is a finding, not a zero.
SET statement_timeout = '15s';
SET application_name = 'parcel-fill-48209-measure';

-- Pin: county_fips is a literal. An instrument that takes $1 can be pointed at the wrong county.
SELECT current_database() AS db,
       now() AS measured_at,
       '48209'::text AS county_fips;

SELECT disposition, count(*)::bigint AS n
  FROM landing_parcel_jurisdiction
 WHERE county_fips = '48209'
   AND method = 'ring'
 GROUP BY disposition
 ORDER BY disposition;

SELECT count(*)::bigint AS landing_rows
  FROM landing_parcel_jurisdiction
 WHERE county_fips = '48209'
   AND method = 'ring';

SELECT
  count(*)::bigint AS cad_rows,
  count(*) FILTER (WHERE market_value IS NOT NULL)::bigint AS market_present,
  count(*) FILTER (WHERE land_value IS NOT NULL)::bigint AS land_present,
  count(*) FILTER (WHERE improvement_value IS NOT NULL)::bigint AS improvement_present,
  count(*) FILTER (WHERE assessed_value IS NOT NULL)::bigint AS assessed_present,
  count(*) FILTER (WHERE living_area_sqft IS NOT NULL AND living_area_sqft > 0)::bigint AS living_gt0,
  count(*) FILTER (WHERE living_area_sqft IS NULL)::bigint AS living_null,
  count(*) FILTER (
    WHERE market_value IS NOT NULL
       OR land_value IS NOT NULL
       OR improvement_value IS NOT NULL
       OR assessed_value IS NOT NULL
  )::bigint AS any_dollar_present,
  count(*) FILTER (WHERE improvement_value = 0)::bigint AS improvement_zero,
  count(*) FILTER (WHERE market_value = 0)::bigint AS market_zero
  FROM cad_property
 WHERE county_fips = '48209';
