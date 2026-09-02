-- READ-ONLY. SET default_transaction_read_only = on before running.
-- Williamson: is txgio.geo_id the numeric CAD account on an R-prefix feature?

-- 1. txgio key schemes on 48491
SELECT
  CASE
    WHEN prop_id ~ '^R[0-9]+$' THEN 'R-prefix'
    WHEN prop_id ~ '^[0-9]+$' THEN 'numeric'
    ELSE 'other'
  END AS prop_scheme,
  CASE
    WHEN geo_id ~ '^R[0-9]+$' THEN 'R-prefix'
    WHEN geo_id ~ '^[0-9]+$' THEN 'numeric'
    WHEN geo_id IS NULL OR btrim(geo_id) = '' THEN 'empty'
    ELSE 'other'
  END AS geo_scheme,
  count(*)::bigint AS n
  FROM txgio_parcel
 WHERE county_fips = '48491'
 GROUP BY 1, 2
 ORDER BY 1, 2;

-- 2. sample pairs
SELECT prop_id, geo_id, left(situs_address, 80) AS situs
  FROM txgio_parcel
 WHERE county_fips = '48491'
 ORDER BY prop_id
 LIMIT 12;

-- 3. Bastrop CAD has no parent column. Cluster 8712 living-not-landing by owner_name cardinality.
WITH latest AS (
  SELECT DISTINCT ON (prop_id)
         prop_id::text AS prop_id,
         owner_name,
         situs_address,
         living_area_sqft
    FROM cad_property
   WHERE county_fips = '48021'
   ORDER BY prop_id, tax_year DESC
),
living_out AS (
  SELECT l.prop_id, l.owner_name, l.situs_address, l.living_area_sqft
    FROM latest l
   WHERE l.living_area_sqft > 0
     AND NOT EXISTS (
       SELECT 1 FROM landing_parcel_jurisdiction j
        WHERE j.county_fips = '48021' AND j.prop_id = l.prop_id
     )
)
SELECT
  count(*)::bigint AS living_out,
  count(DISTINCT owner_name)::bigint AS distinct_owners,
  count(*) FILTER (WHERE owner_name IS NULL OR btrim(owner_name) = '')::bigint AS owner_blank
  FROM living_out;
