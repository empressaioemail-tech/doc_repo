# Mission — REAPER-PHANTOMS: unstarve the reaper, clear the phantom backlog

From the FACTORY-JOB-SIGTERM close (read it first). Three items, one card:

1. FIX the reaper precondition: reapStartedRuns() matches only status='started' but
   several jobs write status='running' — a starved mechanism (runs and does nothing
   for that class). Widen to the real status set, with a violation test per status
   string; falsifier = the old predicate missing a 'running' fixture.
2. RECONCILE the two remaining phantom rows (parcel-record-fill runs 9ef1b6d4 and
   28823aa1, status=running since 2026-09-01, laptop-era/not-cloud-run) via the fixed
   reaper or recorded manual termination — record both invocations.
3. The SIGTERM fix redeploy to the ~20 job resources outside the active family:
   execute the sweep OR write the per-job list into the close with each one marked
   deploy-on-next-natural-touch — either is acceptable; silence is not.

Verify: zero rows with status in the running/started set older than their job's max
duration, live query pasted. Close: _inbox/2026-09-02_factory-reaper-phantoms_close.json.
