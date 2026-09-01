-- Scout session RO arm. Not 00: 00's 981k snapshot is not cheap.
\set ON_ERROR_STOP on
SET default_transaction_read_only = on;
SET TIME ZONE 'UTC';

SELECT
  current_database() AS db,
  current_setting('default_transaction_read_only') AS read_only;

DO $$
BEGIN
  CREATE TABLE p2_juris_ro_probe_must_not_exist (
    probe_at timestamptz PRIMARY KEY
  );
  RAISE EXCEPTION 'P2-JURIS RO hole: durable CREATE TABLE succeeded under default_transaction_read_only=on';
EXCEPTION
  WHEN read_only_sql_transaction THEN
    RAISE NOTICE 'P2-JURIS RO armed: durable CREATE TABLE refused [%]', SQLERRM;
  WHEN feature_not_supported THEN
    RAISE NOTICE 'P2-JURIS RO armed: durable CREATE TABLE refused [%]', SQLERRM;
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'P2-JURIS RO armed: durable CREATE TABLE refused [%]', SQLERRM;
END $$;
