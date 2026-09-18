---
id: 2026-09-15_g135_substrate_mint_request
title: Request to substrate seat — mint a verification-scoped bastrop_tx Hauska key (G-135)
status: active
last_updated: 2026-09-15
applies_to: hauska-mcp-server (substrate seat)
owner: nick
related:
  - 90_operations/OPS-17_govtech_stack_plan_of_record.md (G-135)
  - _dispatches/2026-09-15_g135-tenant-key-distribution_dispatch.md
  - _inbox/2026-09-14_g133-bastrop-verify-access_close.json (G-133, established the key exists and is a distribution problem)
  - _catalog/credential_access_index.json (entry: hauska-tenant-key-bastrop_tx-lane-verification)
plan_row: G-135 (OPS-17)
---

# Request to substrate — mint one verification-scoped bastrop_tx key

Filed by lane `g135-tenant-key-distribution` (seat `cente-g135`). Minting happens in
`hauska-mcp-server`, which the SUBSTRATE seat owns; this lane holds no registered
substrate worktree (checked against `_catalog/seat_register.json`) and did not write to
that repo. Everything below is a request, not a change already made.

## Why

G-133 (closed 2026-09-15) found that `bastrop_tx`'s real blocker was never a missing
credential — an active key exists, owned by the operator's own account, labelled "Nick,
bastrop_tx staff pilot". G-135's mission is explicit: **do not hand that key out.** A
human's pilot credential is the wrong shape for unattended/automated lane verification —
rotating or revoking it would break every lane at once with no obvious cause, and it ties
lane access to one person's account. A second, purpose-built key closes that risk.

## What to mint

One call to this repo's own admin API (read at `src/admin.ts`, not modified):

```
POST /admin/keys
Header: X-Hauska-Admin-Key: <HAUSKA_ADMIN_BOOTSTRAP_KEY>
Body:
{
  "tier": "<same tier as the existing bastrop_tx pilot key — please read it off that row rather than have this lane guess; this lane deliberately did not select the tier column value into anything it could see beyond confirming the row exists>",
  "product": "public",
  "jurisdiction_tenant": "bastrop_tx",
  "platform_internal": false,
  "owner_email": "<a non-personal owner distinct from the operator's own account — a service/lane-verification address is enough; a Gmail '+' alias on the operator's own address (still one inbox, still one owner, but a textually distinct DB value so this row is not literally indistinguishable from the pilot row) would satisfy 'distinct identity' without inventing a new account, but the exact choice is the substrate seat's / operator's call, not this lane's>",
  "owner_name": "govtech-lane-verification (bastrop_tx)",
  "notes": "G-135 (OPS-17). Verification-scoped credential for automated lane use against the bastrop_tx pack, distinct from 'Nick, bastrop_tx staff pilot' (created 2026-09-03) so lane use/rotation never touches the operator's own access. Requested via _inbox/2026-09-15_g135_substrate_mint_request.md."
}
```

The endpoint returns `raw_key` exactly once, on creation, and never again — whoever runs
this call is the only one who will ever see the raw value. Per this program's own rule
(G-133's method, restated in G-135's dispatch): **never print or store the raw value in
doc_repo or any repo.** Put it directly into:

1. Secret Manager, in the project the `smartcity-dashboards` serving revision actually
   reads from (the same project `HAUSKA_MCP_URL` and `DASHBOARDS_API_KEY` already live
   in, per `_inbox/2026-09-14_g133-bastrop-verify-access_cp2.json`).
2. Nowhere else. `smartcity-dashboards`' `.env.example` has already been updated (this
   lane, PR `empressaioemail-tech/smartcity-dashboards#64`) to document the *name* and
   *mechanism* only — never a value.

## What to send back

Once minted, please record (names/ids/scope only, per this program's own line on
secrets — never the raw value):

- The new `key_id`
- The `owner_name` / `owner_email` actually used (if different from the suggestion above)
- Confirmation it is `active`, `jurisdiction_tenant=bastrop_tx`, `platform_internal=false`
- Which Secret Manager project + secret name it was placed under

...either by updating `_catalog/credential_access_index.json`'s
`hauska-tenant-key-bastrop_tx-lane-verification` entry directly (status ->
`"active"`, plus the fields above), or by replying in this file / a close referencing it.
This lane's own close for G-135 leaves that entry `"REQUESTED, NOT YET MINTED"` and
names this file as the open item.

## What still can't happen until this lands

The acceptance test G-135's dispatch names — a full-shell authenticated probe on
`bastrop_tx` that mounts the map iframe, plus the violation test (accepted for
`bastrop_tx`, refused for another tenant) — needs the new key's actual raw value. This
lane could not run it and says so plainly in its own close rather than fabricate a
result. Whoever mints the key is the natural next owner of that verification step, since
they are the only one who will hold the raw value; alternatively, mint it and hand the
raw value (not the mint mechanism, not the operator's own key) to the next lane assigned
G-134 or a G-135 follow-on, exactly once, out of doc_repo.
