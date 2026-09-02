-- PARCEL-FILL-48209-r2 pre-execute baseline. Hays only.
-- Reads PRODUCTION_NEONDB_URL / neondb for landing+CAD.
-- Never roll atoms. Never place_layer_snapshots. Never a fill selector.
SET statement_timeout = '20s';
SET application_name = 'parcel-fill-48209-r2-pre';

SELECT current_database() AS db, now() AS measured_at, '48209'::text AS county_fips;

SELECT
  count(*)::bigint AS landing_n,
  count(*) FILTER (WHERE disposition = 'in-city')::bigint AS in_city,
  count(*) FILTER (WHERE disposition = 'unincorporated')::bigint AS unincorporated,
  count(*) FILTER (WHERE disposition NOT IN ('in-city', 'unincorporated'))::bigint AS other
  FROM landing_parcel_jurisdiction
 WHERE county_fips = '48209'
   AND method = 'ring';

-- CAD latest ∩ landing (the only CAD headlines that can be store targets)
WITH latest AS (
  SELECT DISTINCT ON (prop_id)
         prop_id, improvement_value, market_value, living_area_sqft
    FROM cad_property
   WHERE county_fips = '48209'
   ORDER BY prop_id, tax_year DESC
)
SELECT
  count(*)::bigint AS latest_rows,
  count(*) FILTER (WHERE market_value IS NOT NULL)::bigint AS latest_market,
  count(*) FILTER (WHERE improvement_value = 0)::bigint AS latest_improvement_zero,
  count(*) FILTER (WHERE living_area_sqft IS NOT NULL AND living_area_sqft > 0)::bigint AS latest_living_gt0,
  count(*) FILTER (
    WHERE exists (
      SELECT 1 FROM landing_parcel_jurisdiction l
       WHERE l.county_fips = '48209' AND l.method = 'ring' AND l.prop_id = latest.prop_id
    )
  )::bigint AS latest_in_landing,
  count(*) FILTER (
    WHERE improvement_value = 0
      AND exists (
        SELECT 1 FROM landing_parcel_jurisdiction l
         WHERE l.county_fips = '48209' AND l.method = 'ring' AND l.prop_id = latest.prop_id
      )
  )::bigint AS latest_improvement_zero_in_landing,
  count(*) FILTER (
    WHERE living_area_sqft IS NOT NULL AND living_area_sqft > 0
      AND exists (
        SELECT 1 FROM landing_parcel_jurisdiction l
         WHERE l.county_fips = '48209' AND l.method = 'ring' AND l.prop_id = latest.prop_id
      )
  )::bigint AS latest_living_gt0_in_landing
  FROM latest;
