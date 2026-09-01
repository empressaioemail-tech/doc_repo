-- Wave R verify: bake cadRoll / year / legal vs cad_property.
-- Run on neondb AFTER the patch. First statement is current_database().
-- Expected: n_mkt_present → cad_property market_value population, not "more than zero".

SELECT current_database() AS db, now() AS ts;

-- Source populations at declared vintage (pin tax_year per county before use).
-- 48021/48055 typically 2025; confirm via cad_county_registry / tryResolveDeclaredCadVintage.

SELECT county_fips,
       count(*) AS n_parcels,
       count(*) FILTER (WHERE market_value IS NOT NULL) AS n_mkt,
       count(*) FILTER (WHERE market_value = 0) AS n_mkt_zero,
       count(*) FILTER (WHERE land_value IS NOT NULL) AS n_land,
       count(*) FILTER (WHERE land_value = 0) AS n_land_zero,
       count(*) FILTER (WHERE improvement_value IS NOT NULL) AS n_imp,
       count(*) FILTER (WHERE improvement_value = 0) AS n_imp_zero,
       count(*) FILTER (WHERE assessed_value IS NOT NULL) AS n_ass,
       count(*) FILTER (WHERE assessed_value = 0) AS n_ass_zero,
       count(*) FILTER (WHERE living_area_sqft IS NOT NULL AND living_area_sqft > 0) AS n_living,
       count(*) FILTER (WHERE year_built IS NOT NULL AND year_built > 0) AS n_year,
       count(*) FILTER (WHERE nullif(btrim(legal_description), '') IS NOT NULL) AS n_legal,
       count(*) FILTER (WHERE exemption_codes IS NOT NULL AND cardinality(exemption_codes) > 0) AS n_ex
  FROM cad_property
 WHERE county_fips IN ('48021','48055','48209','48309','48453','48491')
 GROUP BY 1
 ORDER BY 1;

SELECT substring(place_key from 6 for 5) AS fips,
       count(*) AS n_bake,
       count(*) FILTER (WHERE payload_json->'baseFacts'->'cadRoll'->>'source' = 'cad_property'
                          OR payload_json->'baseFacts'->'cadRoll'->'marketValue'->>'source' = 'cad_property') AS n_src_cad_property,
       count(*) FILTER (WHERE (payload_json->'baseFacts'->'cadRoll'->'marketValue'->>'v') IS NOT NULL) AS n_mkt_key,
       count(*) FILTER (WHERE (payload_json->'baseFacts'->'cadRoll'->'marketValue'->>'v')::numeric > 0) AS n_mkt_present,
       count(*) FILTER (WHERE (payload_json->'baseFacts'->'cadRoll'->'marketValue'->>'v') = '0') AS n_mkt_zero,
       count(*) FILTER (WHERE (payload_json->'baseFacts'->'cadRoll'->'landValue'->>'v') IS NOT NULL) AS n_land_key,
       count(*) FILTER (WHERE (payload_json->'baseFacts'->'cadRoll'->'improvementValue'->>'v') IS NOT NULL) AS n_imp_key,
       count(*) FILTER (WHERE (payload_json->'baseFacts'->'cadRoll'->'improvementValue'->>'v') = '0') AS n_imp_zero,
       count(*) FILTER (WHERE (payload_json->'baseFacts'->'cadRoll'->'assessedValue'->>'v') IS NOT NULL) AS n_ass_key,
       count(*) FILTER (WHERE (payload_json->'baseFacts'->'cadRoll'->'livingAreaSqft'->>'v') IS NOT NULL) AS n_living,
       count(*) FILTER (WHERE (payload_json->'baseFacts'->'yearBuilt'->>'v') IS NOT NULL) AS n_year,
       count(*) FILTER (WHERE payload_json->'baseFacts'->'legalDescription'->>'v' IS NOT NULL) AS n_legal
  FROM place_layer_snapshots
 WHERE adapter_key = 'node-facets:tier1'
   AND place_key LIKE 'node:%'
   AND substring(place_key from 6 for 5) IN ('48021','48055','48209','48309','48453','48491')
 GROUP BY 1
 ORDER BY 1;
