## Mission — L-D FARM ARCHITECTURE: map the system as it runs, measure where it chokes, and test the farm options before anything is chosen

**Read-only lane in the Texas scale-up research wave.** You spawn nothing. You write no product
code, change no store, and change no cloud resource. Metadata reads only.

### Why this exists

The operator, 2026-09-16:

- *"Won't the existing stores create a bottleneck? I want to see the architecture for the farm
  mapped out before we finalize anything."*
- The operator also asked for **the bake audit** as part of the farm.
- The plan is Burnet first, then **Bell and Milam in parallel, merging into the ledger**, then
  the rest of Texas. **Each farm run must be measurably faster than the last.**

**Your starting point:** `_inbox/2026-09-16_farm_architecture_draft.md`.

- It maps the stores and flows.
- It names six bottlenecks.
- It compares four options: shared stores; a Neon branch pair per farm; a Neon project per
  farm; shared stores with a bulk write path.
- It **leans toward a branch pair plus a bulk write path.**

**Treat every line of it as a claim to test.** It was written by a planner who already got the
envelope diagnosis wrong once today.

### The questions

1. **Map the system as it actually runs,** from code and configuration, and correct the draft's
   diagram. Cover:
   - every store: Neon project, database, region, size, the tables that matter;
   - every writer job: Cloud Run job name, region, image, which store it writes (read
     `gcloud run jobs list` and `describe`, and the `cloudbuild.*.yaml` files);
   - every reader and serving service;
   - every copy a surface reads (the ledger, the atoms, the tier-1 bake `place_layer_snapshots`,
     and any other);
   - every place a county or city literal is still hardcoded where a farm would trip on it. Start
     with the publish job's name and args, the zoning layer registries, `SIX_COUNTIES` lists, and
     `CONSTRAINT_SEARCH_COUNTIES`.
2. **Capacity, measured, not estimated.**
   - Neon compute sizes and autoscaling limits per project; branch count limits; storage
     behaviour of a branch of a 203 GB database. Use the Neon API **only through a credential
     already in Secret Manager, and only for read calls.** If none exists, mark it UNMEASURED and
     say what is needed.
   - Write throughput from existing run records (factory `runs`, `run_events`, `publish_runs`;
     engine atoms writer records) as actual rows per second, by job.
   - Every recorded contention incident: reads timing out under writer load (2026-08-28), the
     Harris writer lease, the heavy-scan rule, rate limits.
3. **Test each farm option against the code, on paper:**
   - **Isolation:** data, compute, or both.
   - **Merge mechanics:** how one county's cells and atoms move from the farm to production.
     Test this against the publish job, `atom_did` identity (P-193: not county-prefixed), the
     absence of row versions on `parcel_record_cell`, the verify walk, and the traffic lease.
   - **Throughput:** what limits a single farm; what limits two in parallel.
   - **Failure and rollback:** retract-by-run-id does not exist today.
   - **Operational hazards:** branch cleanup (2026-08-28, secrets in two projects), secrets per
     branch, cost behaviour. **Name costs as mechanisms, not dollar figures.**
4. **Place every farm stage** on the recommended architecture:
   - recon;
   - manifest;
   - **the bake audit (pre-bake)**;
   - acquire;
   - vendor (Cotality, capped; nothing served until the contract lands);
   - identity;
   - instantiate;
   - rail fill;
   - depth (the whole envelope family and road nodes);
   - atoms;
   - completeness;
   - gate;
   - publish;
   - probe and meter;
   - merge.

   For each stage, name the store, the writer, the gate, and the operator stop point.
5. **The single-source question.** Which serving copies must a farm write for a customer to see
   the county, and can the tier-1 bake copy be retired rather than farmed (P-230)?
6. **The speed instrument.** What records must each stage write so "Bell and Milam beat Burnet"
   is a query, not a memory? For each measure (wall-clock, operator minutes, fixes needed,
   re-runs, dollars), say what captures it automatically. Where only a person could, say so.

### Falsifiers

Pre-register your answers before you run anything.

1. **Your corrected diagram must differ from the draft somewhere.** If it does not, show each
   element verified at source.
2. The recommended option must survive "two counties publish in the same hour". Walk through it
   step by step against the publish job's code.
3. **Every capacity number names its source**: an API response, a run record, or a catalog query.
   None may come from memory alone.

### Close

**Report.** `_inbox/<date>_scaleup-ld_farm_architecture_report.md`, containing:

- the corrected architecture map;
- the capacity table;
- the contention incidents;
- the option evaluation;
- the recommended architecture with the stage placement;
- the speed-record specification;
- the hardcoded-literal list.

**Close JSON.** `_inbox/<date>_scaleup-ld-farm-architecture_close.json`, carrying:

- `planRows` `["P-187", "P-198"]`;
- `probe` `{"notApplicable": "read-only research lane"}`;
- `falsifier` scored;
- `leave_behind`.
