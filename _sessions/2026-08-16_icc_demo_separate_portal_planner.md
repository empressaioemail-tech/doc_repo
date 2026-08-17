---
date: 2026-08-16
agent: planner
repo: docs
session_type: execute
memory_graded: none
rolled_up: false
rolled_up_into:
---

# Session: ICC Demo is a separate portal (A-033)

## What was done

Operator reversed A-032. ICC Demo is the access path for people paying to use licensed IP. Separate portal. Separate domain. Plan review cites. It is not the portal.

Stood up `empressaioemail-tech/icc-portal` and Vercel `icc-portal-app` at https://icc-portal-app.vercel.app. Unauthed `/activity` 401. Accessor BFF n=27 against plan-review activity (no second ledger, no DSN). Stripped ICC nav and `/icc` middleware from plan-review. Deleted an accidental Vercel project created by deploying plan-review from repo root.

## What was learned (changes to ground truth)

Same class of miss as sending the applicant to smart-files-app: the citing product is not the IP-access door. Custom DNS is still owed. `icc-demo` in repo_intents stays docs-only; the product repo is `icc-portal`.

## What's still open

Custom DNS. WDLL 13 token-room. ICC store UPDATE. F4. L26. G-58b DROP. G-50 SaaS.

## Suggested canonical doc updates

Already applied this session.
