-- P-106 item 7: migration 0094 verified BY VIOLATION, both directions.
--
-- Run against a THROWAWAY local database that 0094 has been applied to.
-- Never against production; this lane is read-only there and 0094 is handed
-- back unapplied.
--
--   dropdb --if-exists p106_ddl_check && createdb p106_ddl_check
--   psql -d p106_ddl_check -f lib/db/drizzle/0094_p106_parcel_constraint_index.sql
--   psql -d p106_ddl_check -f _inbox/2026-09-02_p106_migration_0094_violation_suite.sql
--
-- Every block below is expected to RAISE. A block that succeeds means the
-- constraint it targets does not fire, and a constraint that cannot fire is
-- not a constraint. The final block is the positive case: the same row,
-- corrected, must be accepted, so the suite proves the checks are not simply
-- refusing everything.

\set ON_ERROR_STOP off
\echo === V1 a value under an unmeasured state must be refused (acreage) ===
INSERT INTO pe_parcel_constraint_index (
  county_fips, prop_id, parcel_node_id, built_at, build_run_id,
  acreage_acres, acreage_state, land_use_state, city_limits_state, etj_state,
  zoning_state, flood_state, special_district_state, market_value_state,
  land_value_state, improvement_value_state, year_built_state
) VALUES (
  '48021','1001','48021:1001', now(), gen_random_uuid(),
  2.5, 'unknown', 'unknown','unknown','unread','unknown','unknown','unknown',
  'unknown','unknown','unknown','unknown'
);

\echo === V2 a present state with no value behind it must be refused (acreage) ===
INSERT INTO pe_parcel_constraint_index (
  county_fips, prop_id, parcel_node_id, built_at, build_run_id,
  acreage_acres, acreage_state, land_use_state, city_limits_state, etj_state,
  zoning_state, flood_state, special_district_state, market_value_state,
  land_value_state, improvement_value_state, year_built_state
) VALUES (
  '48021','1002','48021:1002', now(), gen_random_uuid(),
  NULL, 'present', 'unknown','unknown','unread','unknown','unknown','unknown',
  'unknown','unknown','unknown','unknown'
);

\echo === V3 a sixth rail-state word must be refused ===
INSERT INTO pe_parcel_constraint_index (
  county_fips, prop_id, parcel_node_id, built_at, build_run_id,
  acreage_state, land_use_state, city_limits_state, etj_state,
  zoning_state, flood_state, special_district_state, market_value_state,
  land_value_state, improvement_value_state, year_built_state
) VALUES (
  '48021','1003','48021:1003', now(), gen_random_uuid(),
  'probably', 'unknown','unknown','unread','unknown','unknown','unknown',
  'unknown','unknown','unknown','unknown'
);

\echo === V4 an unresolved jurisdiction smuggled in as a PLACE must be refused ===
INSERT INTO pe_parcel_constraint_index (
  county_fips, prop_id, parcel_node_id, built_at, build_run_id,
  city_limits, city_limits_state,
  acreage_state, land_use_state, etj_state,
  zoning_state, flood_state, special_district_state, market_value_state,
  land_value_state, improvement_value_state, year_built_state
) VALUES (
  '48021','1004','48021:1004', now(), gen_random_uuid(),
  'unresolved','present',
  'unknown','unknown','unread','unknown','unknown','unknown',
  'unknown','unknown','unknown','unknown'
);

\echo === V5 a flood zone letter with no SFHA determination must be refused ===
INSERT INTO pe_parcel_constraint_index (
  county_fips, prop_id, parcel_node_id, built_at, build_run_id,
  flood_zone, flood_in_sfha, flood_state,
  acreage_state, land_use_state, city_limits_state, etj_state,
  zoning_state, special_district_state, market_value_state,
  land_value_state, improvement_value_state, year_built_state
) VALUES (
  '48021','1005','48021:1005', now(), gen_random_uuid(),
  'AE', NULL, 'absent-verified',
  'unknown','unknown','unknown','unread','unknown','unknown','unknown',
  'unknown','unknown','unknown'
);

\echo === V6 the degenerate prop_id 0 must be refused ===
INSERT INTO pe_parcel_constraint_index (
  county_fips, prop_id, parcel_node_id, built_at, build_run_id,
  acreage_state, land_use_state, city_limits_state, etj_state,
  zoning_state, flood_state, special_district_state, market_value_state,
  land_value_state, improvement_value_state, year_built_state
) VALUES (
  '48021','0','48021:0', now(), gen_random_uuid(),
  'unknown','unknown','unknown','unread','unknown','unknown','unknown',
  'unknown','unknown','unknown','unknown'
);

\echo === V7 a node id that does not agree with its own key must be refused ===
INSERT INTO pe_parcel_constraint_index (
  county_fips, prop_id, parcel_node_id, built_at, build_run_id,
  acreage_state, land_use_state, city_limits_state, etj_state,
  zoning_state, flood_state, special_district_state, market_value_state,
  land_value_state, improvement_value_state, year_built_state
) VALUES (
  '48021','1007','48453:1007', now(), gen_random_uuid(),
  'unknown','unknown','unknown','unread','unknown','unknown','unknown',
  'unknown','unknown','unknown','unknown'
);

\echo === V8 a refused build with no reason must be refused ===
INSERT INTO pe_parcel_constraint_index_builds (
  build_run_id, county_fips, started_at, invocation, outcome
) VALUES (gen_random_uuid(), '48021', now(), 'p106-build --county 48021', 'refused');

\echo === P1 POSITIVE: the corrected rows must all be ACCEPTED ===
INSERT INTO pe_parcel_constraint_index (
  county_fips, prop_id, parcel_node_id, built_at, bake_snapshot_at, build_run_id,
  acreage_acres, acreage_state,
  land_use_code, land_use_state,
  city_limits, city_limits_state,
  etj, etj_state,
  zoning_district, zoning_state,
  flood_zone, flood_in_sfha, flood_state,
  special_district_id, special_district_state,
  market_value, market_value_state,
  land_value, land_value_state,
  improvement_value, improvement_value_state,
  year_built, year_built_state
) VALUES
-- an in-city parcel with a stamped district, in a mapped AE zone, zero dollars
-- measured (zero is a value, and it is NOT the same as unmeasured)
( '48021','2001','48021:2001', now(), now(), gen_random_uuid(),
  2.5000,'present', 'A1','present', 'in-city','present', NULL,'unread',
  'SF-1','present', 'AE', true,'present', 'MUD-14','present',
  0,'present', 0,'present', 0,'present', 1998,'present'),
-- an unincorporated parcel: zoning is a VERIFIED absence, flood is a mapped
-- negative, the dollar rails are unmeasured, and those are three different
-- states on one row
( '48021','2002','48021:2002', now(), now(), gen_random_uuid(),
  10.0000,'present', NULL,'unknown', 'unincorporated','present', NULL,'unread',
  NULL,'absent-verified', NULL, NULL,'absent-verified', NULL,'absent-verified',
  NULL,'unknown', NULL,'unknown', NULL,'unknown', NULL,'unknown'),
-- a parcel the jurisdiction run looked at and could not place: refused, which
-- is not absent and not unknown
( '48021','2003','48021:2003', now(), now(), gen_random_uuid(),
  NULL,'unknown', NULL,'refused', NULL,'refused', NULL,'unread',
  NULL,'unknown', NULL, NULL,'unknown', NULL,'unknown',
  NULL,'unknown', NULL,'unknown', NULL,'unknown', NULL,'unknown');

INSERT INTO pe_parcel_constraint_index_builds (
  build_run_id, county_fips, started_at, finished_at, invocation,
  prop_id_lo, prop_id_hi, bake_rows_read, rows_written, bake_snapshot_max, outcome
) VALUES (
  gen_random_uuid(), '48021', now(), now(),
  'node buildParcelConstraintIndexCli.mjs --county 48021',
  '2001','2003', 3, 3, now(), 'succeeded'
);

\echo === P2 the three accepted rows, and their three distinct dispositions ===
SELECT prop_id, acreage_state, zoning_state, flood_state, city_limits_state, market_value_state
  FROM pe_parcel_constraint_index ORDER BY prop_id;

\echo === P3 exactly three rows exist: every V block above refused ===
SELECT count(*) AS rows_admitted FROM pe_parcel_constraint_index;
