SET statement_timeout = '10s';
SET application_name = 'parcel-fill-48209-r2-run';

SELECT id, phase, target, status, engine_sha, started_at, finished_at, scope
  FROM runs
 WHERE phase = 'parcel-record-fill'
   AND target = '48209'
 ORDER BY started_at DESC
 LIMIT 3;
