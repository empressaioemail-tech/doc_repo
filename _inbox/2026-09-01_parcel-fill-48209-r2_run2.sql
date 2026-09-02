SET statement_timeout = '10s';
SET application_name = 'parcel-fill-48209-r2-run2';

SELECT column_name, data_type
  FROM information_schema.columns
 WHERE table_name = 'runs'
 ORDER BY ordinal_position;

SELECT *
  FROM runs
 WHERE phase = 'parcel-record-fill'
   AND target = '48209'
 ORDER BY started_at DESC NULLS LAST
 LIMIT 1;
