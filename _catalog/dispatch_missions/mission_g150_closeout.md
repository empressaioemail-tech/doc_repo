## Mission — G-150 close-out: file what the build lane did not, and prove the console is live

You launch no sub-agents (FAN-DEPTH 0). This is a narrow row. **The build is done**; you are closing
the evidence gap it left. You do not rebuild, refactor or redeploy unless the live probe below proves
the deploy is partial.

Read the G-150 row in `90_operations/OPS-17_govtech_stack_plan_of_record.md`, whose status cell says
exactly what is and is not established, then `_design/plan-review-reasoner/README.md`.

### What is already true, verified by the planner, not to be redone

`plan-review` PR #18 merged (`99c156ba`), lane-branch tree byte-identical to `origin/main`. Deployed
`plan-review-00029-gom` at 100%, tag `g150-reasoner`, moved off the old `00025-ley` pin.
`_design/plan-review-reasoner/check.mjs` 72/72 self-tests; `violate.mjs` 27/27 planted violations
caught; GATE 3 identifier extraction 16 entries, 0 absent from source. The lane also caught a real
design defect, a Pass rendered where source sets `adjudicated: null`, and fixed it.

Do not re-run these and report them as your findings. They are established.

### The two gaps, and they are the whole row

**GAP 1 — the build lane filed no close, no CP1 and no CP2.** So GATE 2 has no record and no
`leave_behind` was declared. You file them, for the work that was done, stating plainly what you
observed yourself and what you are recording from the build lane's commits.

**GAP 2 — nobody has reached the reasoner console on the live surface.** The planner probed the root
route and got HTTP 200 carrying NONE of the reasoner markers (`NO ADJUDICATOR`, `CITATION OWED`,
`data-determination`). Two mechanisms produce that observation and they were not separated:

1. The console lives behind an engagement id and the root is the queue, so the markers are correctly
   absent there.
2. The deploy is partial and the reasoner path is not actually being served.

**Pre-register your falsifier before you probe.** Reach the console for a real engagement, on the live
serving revision, and look for the markers. If they are present and match the ratified boards,
mechanism 1 holds. If you cannot reach a console at all, or reach one without the markers, mechanism 2
is live and you say so, with the revision you actually hit.

### GATE 2, which the build lane owed and did not record

The `NO ADJUDICATOR` badge is a claim about source: exactly one adjudicator exists
(`adjudication.mjs`, `adjudicateMinimumSetback`, the front setback). The badge becomes a false
negative the moment a second adjudicator ships, and that failure is SILENT.

Prove it the wrong way: add a second-adjudicator fixture, confirm the badge correctly disappears for
that rule and only that rule, then remove the fixture and confirm it returns. Record both directions.

### How to read the serving revision

`plan-review` traffic is **pinned by revision name**. Read the spec by JSON field name, never through
a positional `--format="value(...)"` formatter, which aligns by semicolons and shifts every column
after a blank field. **Confirm the revision serving your console probe from that request's own log
line**, not from `latestReadyRevisionName`, which is a proxy for it.

### If GAP 2 finds a partial deploy

Then and only then you redeploy, by the canary path: `--no-traffic --tag`, verify the console on the
tag URL, then `update-traffic`. A plain redeploy on a pinned service is a silent no-op that reports
success.

### Out of scope

The SF-1 labelling defect in `plan-review`'s deterministic checklist, where every Bastrop parcel is
labelled SF-1. If you confirm it, record it as a `leave_behind` with a named owner; do not fix it
here. Also out: the console and departments designs, any department other than Development services
reaching the surface (G-144 is DEFERRED), and anything in `smartcity-dashboards`.

### Close

Declare your `leave_behind` block. "None" is valid and cheap; the declaration is required regardless.

Your close records: your pre-registered falsifier and whether it fired; the engagement id and serving
revision (from the request's own log line) of the console you reached; the markers observed, verbatim;
GATE 2 in both directions; and a clear line separating what you observed from what you recorded from
the build lane.

State your snapshot in your first output: repository, branch, commit.
