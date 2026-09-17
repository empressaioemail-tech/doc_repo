## Mission — D-12: put customer traffic on the dashboards DigitalOcean app, and make `main` the thing it builds

You launch no sub-agents (FAN-DEPTH 0). You do not touch DNS. You do not decommission anything. You
fix your own failed deploys rather than escalating them.

This row is the CRITICAL PATH for the entire SmartCity design build program. The operator ruled
2026-09-17 that all SmartCity surfaces move to DigitalOcean before any design build work begins, so
OPS-17 G-149 and every design build row behind it waits on you.

Read `90_operations/OPS-25_cloud_infrastructure_and_cost_program.md` in full before anything else,
including all twelve governing rules. Rules 3, 7, 9, 10, 11 and 12 all bind this row directly.

### The state, measured at the planner seat 2026-09-17T21:2xZ, not remembered

Every line below was read from a live instrument. Re-read anything you intend to rely on; these are
readings with a timestamp, not current state.

| Thing | Reading | How it was read |
|---|---|---|
| `smartcityos.io`, `www` | `Server: cloudflare` + `CF-RAY` | `curl -D -`, edge header per rule 10 |
| dashboards public URL | `server: Google Frontend`, still GCP | same |
| GCP dashboards service | project **`smartcity-dashboards`**, us-east1 | `gcloud run services list` |
| GCP serving revision | `smartcity-dashboards-00074-sil` @ 100%, `latestRevision=false`, tag `g129-flood` | traffic spec read BY FIELD NAME |
| GCP deployer | `empressaioemail@gmail.com`, client `gcloud` | service annotations |
| `smartcity-dashboards` main | `f776b4bf` (G-134 WorkOS) | `gh api` |
| DO app build source | branch `d9-pin-96efa35` at `178e968b` | D-9 close + `gh api branches` |
| pin vs main | **diverged: ahead 1, behind 1** | `gh api compare` |
| Cloud Build triggers | **zero** in `smartcity-os-prod`, `hauska-prod-497015`, `legacy-design-tools-prod` | `gcloud builds triggers list` |
| GitHub workflows | one, `ci.yml`, jobs `test` and `a11y`, **zero deploy references** | full file grep |

**The GCP original is NOT in `smartcity-os-prod`.** It is in its own project, `smartcity-dashboards`.
Two of the three 2026-09-17 handoff documents get this wrong by omission. Every `gcloud` call you
make against it needs `--project=smartcity-dashboards --region=us-east1`.

**The backend consumer already cut over and the human path did not.** D-11 flipped
`hauska-mcp-server`'s `DASHBOARDS_BACKEND_URL` to the DigitalOcean address, so `dolphin-app` already
serves MCP tool traffic today. You are moving the browser traffic, not the first traffic.

### The thing that will bite you, and it is not the cutover

`dolphin-app` builds from `d9-pin-96efa35`, which is `96efa35` (main's parent) plus `178e968b` (a
`.gitattributes` fix preserving CRLF web assets). Main is `f776b4bf`, which is `96efa35` plus the
G-134 WorkOS commit. **Neither branch contains the other's commit.**

So a cutover alone produces this: a design build row merges to `main`, CI goes green, the app is
live, and the change is absent. A merged PR, a green suite and a running app all agreeing, with the
work missing. That failure has no symptom and nothing downstream would catch it.

**Reconciling the divergence is inside this row and is not optional.** Do it before the cutover, not
after.

### The work, in order

**1. Land the CRLF fix on `main`.** `178e968b`'s `.gitattributes` change exists only on the pin
branch. Get it onto `main` by whatever path is cleanest (cherry-pick and PR, or a fresh equivalent
commit), and confirm the built static assets are byte-identical to what D-9 validated. D-9 found
17 of 17 paths byte-identical to GCP; that property must survive.

**2. Prove `main` builds clean on DigitalOcean.** `main` carries the G-134 WorkOS commit, which
`dolphin-app` has never built. Build it on a non-production target first. If it fails, that is the
finding and you report it rather than reverting to the pin and calling the row done.

**3. Repoint `dolphin-app` at `main`.** After this the app tracks `main`, not a frozen side branch.

**4. Ruling on deploy-on-push: keep it DISABLED unless you find a reason to change it, and state
your decision either way.** Shipping stays a deliberate act. If you enable it, every future merge
becomes a production deploy and that is a much larger change than it looks.

**5. Supply the DNS records for `app.smartcityos.io` to the operator. Do not execute them.** The
hostname is ruled (operator, 2026-09-17). `smartcityos.io` and `www` stay on `walrus-app`. Governing
rule 12: DNS and domain management are outside this program's DigitalOcean token by design, confirmed
twice. Do not request a token widening. Hand the operator exact record values and wait.

**6. Cut over, and keep the GCP original running unmodified.** Rule 3. The GCP service is the
rollback path through the bake. Do not delete it, do not modify it, do not scale it to zero.

### Gates

**GATE A — verify from a vantage point that cannot lie.** Rule 10, earned on D-9. This fleet host
runs TLS-interception middleware that re-signs every certificate, so a local handshake check CANNOT
distinguish DigitalOcean's certificate from Google's and will return a confident wrong answer. Direct
checks against `*.ondigitalocean.app` from this host have also failed with connection resets that do
not occur elsewhere. Distinguish origins by an unfakeable edge header (`Server: cloudflare` + `CF-RAY`
versus `server: Google Frontend`), from outside this network. D-9 used Cloud Build.

**GATE B — prove a `main` commit actually reaches the running app.** This is the whole point of step
3 and it needs a meaning-shaped check, not a presence-shaped one. Find a byte-level marker present in
`f776b4bf` and absent in `96efa35` (the WorkOS commit changes the sign-in path), then confirm that
marker is served by the running DO app. Two independently derived inputs: what the commit contains,
and what the live app serves. **A successful deploy message is not evidence.** If you cannot
construct such a marker, say so rather than substituting a weaker check.

**GATE C — classify payload and framing separately.** Rule 11, earned on D-9. Cloud Run sets
`Content-Length`; DigitalOcean App Platform streams chunked. The same bytes over different transport
framing will read as a divergence to a naive comparison, and a clean migration will look failed.

**GATE D — check egress before trusting outbound calls.** Rule 7, earned on D-5. `smartcity-dashboards`
calls `hauska-retrieval-api` and `hauska-mcp-server` (`HAUSKA_RETRIEVAL_URL`, `HAUSKA_MCP_URL`),
which stay on their current GCP addresses for this row. A third-party WAF blocked some DigitalOcean
IPs and not others, per-IP rather than per-provider. If any outbound call fails, test from a second
host in the same account and region as a control before concluding anything about the provider.

### Traps that have already caught someone on this program

**The GCP original's traffic is pinned by revision name.** If you roll back, a plain `gcloud run
deploy` comes up `Ready=True`/`Active=False` while `gcloud` reports the OLD revision as serving 100
percent. Its own success message is true of the old revision and conceals the no-op. Use the canary
path (`--no-traffic --tag`, verify on the tag URL, then `update-traffic`) and read the traffic spec
by field name. Rule 9, earned on D-11. `plan-review` carries the identical pin; do not touch it.

**Do not trust DigitalOcean's certificate API field.** On D-9 it reported the apex certificate's
issuance as permanently failed (`certificate_expires_at = 1970-01-01`) while a valid chain-verified
certificate was being served through a different path and its ACME agent was retrying every 5 to 11
minutes. A status field that has stopped changing is not evidence a process stopped. Count events in
a log before declaring anything dead.

**Never read multi-field `gcloud` output through a positional formatter.** `--format="value(a,b,c)"`
aligns by semicolons and a blank field shifts every column after it. This exact misread reported the
wrong serving revision to the operator twice. Use `--format=json` and read fields by name.

### Out of scope, explicitly

Decommissioning anything. The scraper concurrency lock and its missing TLS (OPS-25 open items 2 and
3). The apex certificate renewal path (item 4). `smartcity-os` main drift (item 5). `P-154` (item 6).
`plan-review`, which the operator ruled stays on GCP for now. Any design build work, which is G-149
and G-150 and belongs to other rows.

### Close

Declare your `leave_behind` block. "None" is valid and cheap; the declaration is required regardless.

Your close records: the verbatim edge headers proving the origin, from outside this host; the
byte-level marker used for GATE B and where it was observed; the exact DNS record values handed to
the operator and the time they were handed over; the deploy-on-push decision and its reason; and the
bake window observed with the GCP original's request count through it. A count is not a record.

State your snapshot in your first output: repository, branch, commit.
