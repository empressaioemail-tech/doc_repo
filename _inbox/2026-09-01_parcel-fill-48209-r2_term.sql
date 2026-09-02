SET statement_timeout = '10s';
SET application_name = 'parcel-fill-48209-r2-term';

SELECT run_id, exit_kind, lease_released, recorded_at, reason
  FROM termination_records
 WHERE run_id = '2b35c514-89bb-4da6-9db5-e9bd84625647';
