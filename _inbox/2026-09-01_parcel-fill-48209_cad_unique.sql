-- Unique CAD keys for Hays. Not the fill denominator (that is landing 116420).
-- Tests the dispatch claim "154313 parcels with dollar fields".
SET statement_timeout = '15s';
SET application_name = 'parcel-fill-48209-cad-unique';

SELECT count(*)::bigint AS cad_prop_ids
  FROM (
    SELECT prop_id
      FROM cad_property
     WHERE county_fips = '48209'
     GROUP BY prop_id
  ) u;

SELECT count(*)::bigint AS cad_prop_ids_any_dollar
  FROM (
    SELECT prop_id
      FROM cad_property
     WHERE county_fips = '48209'
       AND (market_value IS NOT NULL
         OR land_value IS NOT NULL
         OR improvement_value IS NOT NULL
         OR assessed_value IS NOT NULL)
     GROUP BY prop_id
  ) u;

SELECT count(*)::bigint AS cad_prop_ids_living_gt0
  FROM (
    SELECT prop_id
      FROM cad_property
     WHERE county_fips = '48209'
       AND living_area_sqft IS NOT NULL
       AND living_area_sqft > 0
     GROUP BY prop_id
  ) u;
