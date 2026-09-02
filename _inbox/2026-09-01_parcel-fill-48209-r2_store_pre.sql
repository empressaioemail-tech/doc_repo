-- Factory leftover baseline for Hays. Absolute, not incremental.
SET statement_timeout = '15s';
SET application_name = 'parcel-fill-48209-r2-store-pre';

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

SELECT r.place_key, r.incorporated, r.instantiated_at
  FROM parcel_record r
 WHERE r.county_fips = '48209'
 ORDER BY r.place_key
 LIMIT 5;
