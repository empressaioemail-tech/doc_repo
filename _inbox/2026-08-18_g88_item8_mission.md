# G-88 item 8: give the static assets a revalidation contract

You are an executor on OPS-17 Lane B. This is acceptance item 8 of the approved WDLL at
`P:\doc_repo\_inbox\2026-08-18_g88_design_into_apps_WDLL.md` and nothing else. Read that card
before you start; it is the contract you are graded against.

## STEP 0 — your own clone, nobody else's

Two sibling executors are working the same repo in parallel on different files. Clone fresh:

    git clone https://github.com/empressaioemail-tech/smartcity-dashboards.git P:/tmp/g88-cache
    cd P:/tmp/g88-cache && npm ci

Do NOT work in `P:/tmp/g75-dash` or `P:/tmp/b82-dash`. Push your branch immediately after your
first commit.

## READ THIS FIRST, BECAUSE THE CARD YOU MAY HAVE HEARD OF IS WRONG

The queued card said a returning browser holds a stale stylesheet across every CSS deploy, and that
this blocks a design pass. **That was measured with a real Chrome against the live service and it
is false.** A returning browser gets FRESH CSS every time, including after a full browser restart
and after an in-session deploy. With no `Last-Modified` there is no basis for heuristic freshness,
so Chrome revalidates, and with no validator that degrades to a full unconditional GET.

**You are not fixing staleness. You are fixing the inverse.** There is no caching at all and a
`304` is structurally impossible, so every navigation re-transfers about 145 KB, forever. This item
is a performance and correctness fix and it is explicitly NOT a blocker on anything.

Full prior investigation with all measurements:
`P:\doc_repo\_inbox\2026-08-18_g88_shell_css_cache.md`.

## THE WORK

`src/server.mjs` lines 41-51. One hand-rolled `sendFile(res, filePath, contentType)` serves every
static asset. `res.writeHead(200, ...)` is unconditional and the function never receives `req`, so
it structurally cannot read a conditional header or emit a `304`.

Add **`cache-control: no-cache` plus a strong content-hash `ETag`**, and honour `If-None-Match`.

`no-cache` means store it but always revalidate. That is the contract you want: never stale by
construction, near-zero cost when unchanged. **Do not use `no-store`** — the JSON helper three
lines above uses it correctly for JSON, but on a static asset it forbids storage entirely and
throws away the whole `304` benefit, leaving the 145 KB problem exactly where it is.

Thread `req` through all six `sendFile` call sites. All six routes are affected identically and all
six get the fix, not just `shell.css`:

    /  and /index.html   web/index.html      75,687 B
    /app.js              web/app.js          32,914 B
    /sc-kit.css          web/sc-kit.css       4,409 B
    /shell.css           web/shell.css       26,969 B
    /staff-map.mjs       src/staff-map.mjs      579 B
    /staff-review.mjs    src/staff-review.mjs 3,368 B

Hash with built-in `node:crypto`. No new dependency, no build step, no filename changes, no HTML
rewriting. Hashing 27 KB per request is microseconds.

**The ETag must be derived from the file CONTENT, every request.** A constant, hardcoded, or
startup-computed ETag is the obvious way to get this wrong and it causes PERMANENT staleness, which
is a far worse defect than the one you are fixing. It also passes the two easy probe legs. See
below.

## THE REGRESSION TEST, which is not optional

`src/server.test.mjs` already has a `serves /sc-kit.css as text/css` case. That is the natural home.
Assert: `cache-control: no-cache` present, `etag` present, a conditional GET with the matching etag
returns `304` with no body, and **a conditional GET with a STALE etag returns `200` with a full body
and a DIFFERENT etag.**

That last assertion is the one that can fail and the only reason this is a test rather than a
rubber stamp. Without it a constant ETag sails through.

## VERIFY (exit-bounded, every command terminates)

    npm test    # expect 185 pass or more, 0 fail, plus your new assertions

Then the three-leg HTTP probe against a LOCAL run of your patched build. Start the server in the
background, curl, then kill it. Never leave it running, never use a watch:

    # leg 1: advertises a revalidation contract
    curl -sS -D - -o /dev/null http://localhost:PORT/shell.css
    #   PASS: cache-control: no-cache AND etag: "..."

    # leg 2: returning browser revalidates cheaply
    curl -sS -D - -o /dev/null -H 'If-None-Match: "<the etag from leg 1>"' http://localhost:PORT/shell.css
    #   PASS: 304, no body

    # leg 3: THE LEG THAT CAN FAIL
    curl -sS -D - -o /dev/null -H 'If-None-Match: "stale-from-a-previous-deploy"' http://localhost:PORT/shell.css
    #   PASS: 200, full body, and a DIFFERENT etag

Paste the raw headers from all three legs into your close.

## HARD CONSTRAINTS

- Touch `src/server.mjs` and `src/server.test.mjs` only. Two siblings are editing `web/shell.css`
  and `src/ui.test.mjs` right now.
- Do not deploy. The planner owns deploys on this card.
- Do not change what any asset contains, only how it is served.
- Do not add a dependency. `node:crypto` is built in.

## THEN

Open a PR against `main`. Title it `G-88 item 8: no-cache plus a content-hash ETag on every static
asset`. Wait for CI and report the check-run conclusion STRING.

**Do NOT merge.** The planner verifies and merges.

Write your close to exactly `P:\doc_repo\_inbox\2026-08-19_b88-8_close.json`. Carry: the PR
number and head SHA, the CI conclusion string, the raw headers from all three probe legs, the six
routes confirmed covered, and the before-and-after bytes-per-navigation figure with the counting
rule stated. State plainly that you did not deploy.
