# Mission — JOB-SIGTERM: termination records survive external kills

Twice-confirmed defect (b-gate-sched close + the parcel-record-fill phantom run
122cd0b2): an external Cloud Run cancel/SIGTERM never reaches writeTermination in the
shared Factory job-runner, leaving run rows stuck at status=running forever — the
phantom-running class. Root cause: no SIGTERM handler in the shared runner pattern.

1. Add the SIGTERM/SIGINT handler to the shared job-runner: write the termination
   record (exit_kind=killed/external, lease released) with a bounded grace window
   before the container dies. Cloud Run sends SIGTERM with ~10s grace — the write must
   be fast and unconditional.
2. Verify by violation, live: start a dummy long-running execution, cancel it
   externally, and show the termination row LANDED with exit_kind reflecting the kill;
   falsifier = the pre-fix behavior (no row), demonstrated once on the old image.
3. Reconcile the two known phantom rows (122cd0b2 and the b-gate-sched instance) via
   the reaper or a recorded manual termination — do not leave them running forever;
   record both invocations.
4. Shared-runner change: every Factory job inherits it — run the full test suite and
   one ordinary execution end-to-end to prove no regression in the normal path.

Close: _inbox/2026-09-02_factory-job-sigterm_close.json.
