-- Latest tax year per Hays prop_id. Tests dispatch "154313 parcels with dollar fields".
-- DISTINCT ON is scoped by county_fips = '48209' and is a count, not a fill selector.
SET statement_timeout = '15s';
SET application_name = 'parcel-fill-48209-cad-latest';

SELECT count(*)::bigint AS latest_rows,
       count(*) FILTER (
         WHERE market_value IS NOT NULL
            OR land_value IS NOT NULL
            OR improvement_value IS NOT NULL
            OR assessed_value IS NOT NULL
       )::bigint AS latest_any_dollar,
       count(*) FILTER (WHERE market_value IS NOT NULL)::bigint AS latest_market,
       count(*) FILTER (WHERE living_area_sqft IS NOT NULL AND living_area_sqft > 0)::bigint AS latest_living_gt0
  FROM (
    SELECT DISTINCT ON (prop_id)
           prop_id, market_value, land_value, improvement_value, assessed_value, living_area_sqft
      FROM cad_property
     WHERE county_fips = '48209'
     ORDER BY prop_id, tax_year DESC
  ) latest;
