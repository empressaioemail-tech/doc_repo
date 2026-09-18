## Mission — G-159: the finance bridge, as far as it can go before D-13 and D-14

You launch no sub-agents (FAN-DEPTH 0). You work in two repos, `smartcity-os` (v1) and
`smartcity-dashboards` (v2), in the order below. You fix your own failed builds rather than
escalating them.

Read the G-159 row in `90_operations/OPS-17_govtech_stack_plan_of_record.md`, then
`_decisions/2026-09-18_bastrop_is_the_proving_pack.md`, then `_design/smartcity-finance-lens/README.md`.
The program preamble compiled above now LEADS with "Bastrop is the proving pack". It binds this
lane: prove everything on `bastrop_tx` and against Bastrop's real data, and `template-city` is no proof.

### Why this row exists

Bastrop's finance data is wired into v1, and v2 cannot reach it. That is why the G-156 Finance lens
renders the budget UNACCOUNTED. v1 `smartcity-os` has `server/routes/opengov.ts` (entities, financial,
reports), `opengov-bnp.ts` (budgets, chart of accounts, data exports, entity info, segment names,
sync) and `finance.ts` (permit revenue by type, outstanding, summary). All of it is present at
production `8bea7fa`, and the keys exist in production in both projects: `smartcity-OPENGOV_API_KEY`,
`smartcity-OPENGOV_BNP_API_KEY` and `smartcity-OPENGOV_EMAIL` in `smartcity-os-prod`, and
`opengov-api-key`, `opengov-bnp-api-key` and `opengov-email` in `smartcity-dashboards`. None of it has
a v1 platform route, so v2 has no path to it.

The G-156 lens is not to be rebuilt. It derives every state from the active pack's grants, so once
this data is declared and granted, the budget moves from UNACCOUNTED to MEASURED with no lens change.

### What this row can finish, and what it cannot

**Going live waits on two OPS-25 rows, and they are not yours.** D-14: `walrus-app` builds from branch
`d9-api-8bea7fa`, which v1 `main` does not contain, so routes merged to `main` never deploy. D-13: the
dashboards read every v1 platform route from the GCP copy (`smartcity-api-7dyaiy7wha-uc.a.run.app`),
not from `walrus-app`, so they could not reach new routes even once deployed. **Do not deploy v1, and
do not deploy anything to the GCP `smartcity-api`.** It is the untouched rollback copy (OPS-25 rule 3),
and it is also the dashboards' live data source.

### STEP 0 — prove the keys answer, before any code

The credentials exist. That they return live Bastrop data is not established: v1 sits behind a login
and now runs on DigitalOcean. **This is your first act and it gates everything else.**

Read how `server/routes/opengov.ts` and `opengov-bnp.ts` call OpenGov, then make one authenticated
read the same way, directly, using the key from `smartcity-os-prod` Secret Manager. Never print a key;
echo its length only. Record the endpoint, the status, and the response SHAPE (field names and types,
and one record with any personal data redacted) as CP1.

**Pre-register the falsifier:** if the read is refused, empty, or returns data that is not Bastrop's,
STOP and report. Do not build a bridge to a source that does not answer.

Before writing new code, look at the unmerged `smartcity-os` branch `fix/w1-c-3-opengov-bnp-hardening`.
It may already hold OpenGov work you should build on rather than duplicate. Say what you found.

### STEP 1 — v1 platform routes, merged to `main`, NOT deployed

Map the Finance lens design's required sources (its README and `capture-figures.json`) to the v1
OpenGov, budgeting-and-planning and permit-revenue data. Add platform routes only for what the design
uses, behind `requirePlatformInternalKey`, on the pattern of the thirteen that already exist (for
example `/api/platform/powerbi/cip-projects`). Each route REFUSES without the key and answers with it;
prove both directions. Branch from `main` and merge to `main`. `main` is one commit past production and
that commit touches only the scraper, so the API is unaffected.

### STEP 2 — v2: declare the adapter, and fix the city default

**Wait for G-154 to merge before starting this step.** G-154 is working in `smartcity-dashboards` now,
and two lanes in one product repo is how two changes to `city-pack.mjs` collide.

(a) Declare the OpenGov adapter kind. It is catalogued `declared: false` because its budget record
shape is not declared on G-91. Declare that shape, and validate it against the REAL record you captured
in STEP 0, not against a `template-city` fixture. On a record that fails the shape, refuse; never
default a field.

(b) **Do not add the `bastrop_tx` grant yet.** A grant pointing at a route the dashboards cannot reach
would put a failing fetch on the product. The grant is the last step, after D-13 and D-14, and it goes
in your `leave_behind`.

(c) Fix the city default. `src/server.mjs` in the finance lens route falls back to `template-city` when
no `cityKey` is passed. Make a missing `cityKey` a REFUSAL, proven by violation. Then enumerate every
other place in `smartcity-dashboards` that defaults a `cityKey` to `template-city`, and list them in
your close; the preamble's rule 3 applies to all of them. Fix only the finance route. The others are a
finding, not scope.

### What proves it

Prove the v2 change on the non-production DigitalOcean app `d12-main-uat` against `bastrop_tx`, and read
back `services[0].source_commit_hash` (OPS-25 rule 13). **If you have no DigitalOcean credential, stop at
merged and say so.** The G-156 lane hit exactly that, and a merged change is not a proven one.

### Close

Declare your `leave_behind`: at least the `bastrop_tx` grant, owned by whoever lands after D-13 and
D-14. File CP1 (the key proof), CP2 and the close.

Your close records: the STEP 0 read verbatim with the key length only; the unmerged-branch finding;
every route's refusal in both directions; the adapter shape validated against the real record; the
city-default fix proven by violation; and every other `template-city` default you found.

State your snapshot in your first output: repository, branch, commit, for both repos.
